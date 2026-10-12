import * as THREE from 'three';

import { Terrain, SEA_LEVEL } from './Terrain';
import { Sky } from './Sky';
import { Water } from './Water';
import { Vegetation, defaultVegetationOptions, type ExclusionCircle } from './Vegetation';
import { CollisionWorld } from './Collision';
import { buildLandmark } from './architecture';
import { Kit } from './architecture/kit';
import { stoneMaterial, glowMaterial, shade } from './Materials';
import { Rng } from '../core/Rng';
import { Chariot } from '../vehicles/Chariot';
import { ZONES, zoneAt, worldPos } from '../content/zones';
import type { Landmark, Zone, ChallengeSpec, NpcSpec } from '../content/types';

/**
 * The world.
 *
 * Builds the island, then walks the content data and places every monument,
 * challenge marker and NPC on it. Nothing here knows what a quiz is or what a
 * challenge does — it only knows where things are and what you can bump into.
 */

export interface PlacedLandmark {
  id: string;
  name: string;
  zoneId: string;
  codexId?: string;
  scanSeconds: number;
  signposted: boolean;
  /** World position of the base. */
  position: THREE.Vector3;
  /** Centre of the bounding sphere used for look-at detection. */
  focus: THREE.Vector3;
  radius: number;
  height: number;
}

export type InteractableKind = 'challenge' | 'npc' | 'pad';

export interface Interactable {
  id: string;
  kind: InteractableKind;
  zoneId: string;
  label: string;
  position: THREE.Vector3;
  /** How close the player must be. */
  reach: number;
  challenge?: ChallengeSpec;
  npc?: NpcSpec;
  /** For pads: the zone this pad belongs to. */
  padZone?: string;
}

export interface WorldOptions {
  seed: string;
  shadows: boolean;
  /** Scale the vegetation budget — lower it on weak hardware. */
  floraScale?: number;
}

interface Bobber {
  mesh: THREE.Object3D;
  baseY: number;
  speed: number;
  phase: number;
  spin: number;
}

export class World {
  readonly terrain: Terrain;
  readonly sky: Sky;
  readonly water: Water;
  readonly vegetation: Vegetation;
  readonly collision = new CollisionWorld();
  readonly group = new THREE.Group();

  readonly landmarks: PlacedLandmark[] = [];
  readonly interactables: Interactable[] = [];
  readonly chariots: Chariot[] = [];

  private readonly bobbers: Bobber[] = [];
  private readonly monumentMeshes: THREE.Mesh[] = [];
  private readonly personGeometries = new Map<number, THREE.BufferGeometry>();

  constructor(scene: THREE.Scene, opts: WorldOptions) {
    this.group.name = 'world';
    scene.add(this.group);

    this.terrain = new Terrain(opts.seed);
    this.group.add(this.terrain.mesh);

    this.sky = new Sky(opts.shadows);
    this.sky.addTo(scene);

    this.water = new Water();
    this.group.add(this.water.mesh);

    // Monuments first — vegetation needs to know where not to grow.
    const exclusions: ExclusionCircle[] = [];
    for (const zone of ZONES) {
      for (const landmark of zone.landmarks) {
        const placed = this.placeLandmark(zone, landmark, opts.seed);
        if (placed) {
          exclusions.push({ x: placed.position.x, z: placed.position.z, radius: Math.max(14, placed.radius * 1.25) });
        }
      }
      for (const challenge of zone.challenges) this.placeChallengeMarker(zone, challenge);
      for (const npc of zone.npcs) this.placeNpc(zone, npc, opts.seed);
    }

    this.spawnChariots(opts.seed);

    const floraOpts = defaultVegetationOptions(opts.seed);
    const scale = opts.floraScale ?? 1;
    floraOpts.trees = Math.round(floraOpts.trees * scale);
    floraOpts.rocks = Math.round(floraOpts.rocks * scale);
    this.vegetation = new Vegetation(this.terrain, exclusions, floraOpts);
    this.group.add(this.vegetation.group);
  }

  // ----------------------------------------------------------------- placement

  private placeLandmark(zone: Zone, landmark: Landmark, seed: string): PlacedLandmark | null {
    const [wx, wz] = worldPos(zone, landmark.offset);
    const built = buildLandmark(landmark.kind, landmark.opts, zone.palette, `${seed}:${landmark.id}`);
    if (!built.geometry.getAttribute('position')) return null;

    // Sit the monument on the ground. Shoreline structures are allowed to go
    // below sea level — a dock basin is supposed to hold water.
    const waterTolerant = landmark.kind === 'lothalDock' || landmark.kind === 'harbour' || landmark.kind === 'ramSetu' || landmark.kind === 'dhow';
    let y = this.terrain.heightAt(wx, wz);
    let x = wx;
    let z = wz;
    if (!waterTolerant && y < SEA_LEVEL + 0.8) {
      const found = this.terrain.findGround(wx, wz, 120);
      x = found.x;
      z = found.z;
      y = found.y;
    }
    if (landmark.kind === 'dhow' || landmark.kind === 'ramSetu') y = SEA_LEVEL;

    const rotY = THREE.MathUtils.degToRad(landmark.rotation ?? 0);
    const scale = landmark.scale ?? 1;

    const mesh = new THREE.Mesh(built.geometry, stoneMaterial());
    mesh.name = `landmark:${landmark.id}`;
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    mesh.scale.setScalar(scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    this.group.add(mesh);
    this.monumentMeshes.push(mesh);

    this.collision.addPlaced(built.colliders, x, y, z, rotY, scale);

    const placed: PlacedLandmark = {
      id: landmark.id,
      name: landmark.name,
      zoneId: zone.id,
      codexId: landmark.codexId,
      scanSeconds: landmark.scanSeconds ?? 2.5,
      signposted: landmark.signposted ?? false,
      position: new THREE.Vector3(x, y, z),
      focus: new THREE.Vector3(x, y + built.height * scale * 0.5, z),
      radius: Math.max(6, built.radius * scale),
      height: built.height * scale,
    };
    this.landmarks.push(placed);

    // The landing terraces double as fast-travel points.
    if (landmark.kind === 'vimanaPad') {
      this.interactables.push({
        id: `pad:${zone.id}`,
        kind: 'pad',
        zoneId: zone.id,
        label: `Vimana terrace — ${zone.name}`,
        position: new THREE.Vector3(x, y + 1.8, z),
        reach: 7,
        padZone: zone.id,
      });
    }

    return placed;
  }

  /** A carved post with a floating marker, placed where a challenge starts. */
  private placeChallengeMarker(zone: Zone, challenge: ChallengeSpec): void {
    const [wx, wz] = worldPos(zone, challenge.offset);
    const ground = this.terrain.findGround(wx, wz, 70);
    const stone = zone.palette.stone;

    const kit = new Kit();
    kit.cylinder(0.9, 1.3, 0.5, [0, 0.25, 0], shade(stone, 0.9), { segments: 12 });
    kit.cylinder(0.42, 0.52, 3.0, [0, 1.8, 0], shade(stone, 1.06), { segments: 10 });
    kit.box([1.3, 0.9, 0.35], [0, 3.5, 0], shade(stone, 1.12), { collide: false });
    // A small lotus bracket, so the posts read as made rather than dropped in.
    kit.ring(6, 0.62, (px, pz, a) => {
      kit.prism(
        [
          [-0.26, 0],
          [0.26, 0],
          [0, 0.5],
        ],
        0.14,
        [px, 0.5, pz],
        shade(stone, 1.14),
        { rotY: -a + Math.PI / 2, collide: false },
      );
    });
    const built = kit.build();

    const mesh = new THREE.Mesh(built.geometry, stoneMaterial());
    mesh.name = `challenge:${challenge.id}`;
    mesh.position.set(ground.x, ground.y, ground.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.collision.addPlaced(built.colliders, ground.x, ground.y, ground.z);

    // Floating glow diamond.
    const glow = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), glowMaterial(0xffd97a, 0.7));
    glow.position.set(ground.x, ground.y + 4.9, ground.z);
    glow.name = `challenge-glow:${challenge.id}`;
    this.group.add(glow);
    this.bobbers.push({ mesh: glow, baseY: glow.position.y, speed: 1.4, phase: Math.random() * 6.28, spin: 0.9 });

    this.interactables.push({
      id: `challenge:${challenge.id}`,
      kind: 'challenge',
      zoneId: zone.id,
      label: challenge.prompt ?? challenge.name,
      position: new THREE.Vector3(ground.x, ground.y + 1.4, ground.z),
      reach: 5.5,
      challenge,
    });
  }

  /** A simple standing figure. NPCs exist to be talked to, not admired. */
  private placeNpc(zone: Zone, npc: NpcSpec, seed: string): void {
    const [wx, wz] = worldPos(zone, npc.offset);
    const ground = this.terrain.findGround(wx, wz, 60);
    const color = npc.color ?? 0xb08a5a;

    let geo = this.personGeometries.get(color);
    if (!geo) {
      geo = buildPerson(color, new Rng(`${seed}:person:${color}`));
      this.personGeometries.set(color, geo);
    }

    const mesh = new THREE.Mesh(geo, stoneMaterial());
    mesh.name = `npc:${npc.id}`;
    mesh.position.set(ground.x, ground.y, ground.z);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    mesh.castShadow = true;
    this.group.add(mesh);
    // A thin collider so you cannot walk through people.
    this.collision.add(ground.x - 0.4, ground.y, ground.z - 0.4, ground.x + 0.4, ground.y + 1.8, ground.z + 0.4);

    const glow = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 6, 18), glowMaterial(0x7fd4c8, 0.55));
    glow.rotation.x = Math.PI / 2;
    glow.position.set(ground.x, ground.y + 2.45, ground.z);
    this.group.add(glow);
    this.bobbers.push({ mesh: glow, baseY: glow.position.y, speed: 1.0, phase: Math.random() * 6.28, spin: 0.5 });

    this.interactables.push({
      id: `npc:${npc.id}`,
      kind: 'npc',
      zoneId: zone.id,
      label: `Speak with ${npc.name}`,
      position: new THREE.Vector3(ground.x, ground.y + 1.2, ground.z),
      reach: 4.5,
      npc,
    });
  }

  /**
   * Park chariots where a player would look for one: by the landing terrace, and
   * by a gate, bazaar or village on the other side of each region.
   */
  private spawnChariots(seed: string): void {
    const rng = new Rng(`${seed}:chariots`);
    const PREFERRED = new Set(['vimanaPad', 'cityGate', 'bazaarStreet', 'villageCluster', 'harbour', 'hermitage']);

    for (const zone of ZONES) {
      const candidates = zone.landmarks.filter((l) => PREFERRED.has(l.kind));
      const chosen = candidates.length >= 2 ? rng.sample(candidates, 2) : zone.landmarks.slice(0, 2);

      chosen.forEach((landmark, index) => {
        const placed = this.landmarks.find((l) => l.id === landmark.id);
        const base = placed
          ? { x: placed.position.x, z: placed.position.z, radius: placed.radius }
          : { x: zone.center[0], z: zone.center[1], radius: 20 };

        // Stand off from the monument so the chariot is not inside it.
        const angle = rng.range(0, Math.PI * 2);
        const dist = base.radius + rng.range(10, 20);
        const spot = this.terrain.findGround(base.x + Math.cos(angle) * dist, base.z + Math.sin(angle) * dist, 70);

        const chariot = new Chariot(
          `${zone.id}-chariot-${index}`,
          zone.id,
          spot.x,
          spot.z,
          rng.range(0, Math.PI * 2),
          this.terrain,
          this.collision,
          zone.palette.stone,
          rng,
        );
        this.chariots.push(chariot);
        this.group.add(chariot.group);
      });
    }
  }

  /** Closest chariot within reach, for mounting. */
  nearestChariot(point: THREE.Vector3, maxDistance = 5.5): Chariot | null {
    let best: Chariot | null = null;
    let bestD = maxDistance;
    for (const c of this.chariots) {
      const d = Math.hypot(c.position.x - point.x, c.position.z - point.z);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    return best;
  }

  // ------------------------------------------------------------------ queries

  /** Terrain height only. */
  heightAt(x: number, z: number): number {
    return this.terrain.heightAt(x, z);
  }

  /** Highest walkable surface: terrain, or a building floor above it. */
  groundAt(x: number, z: number, fromY: number): number {
    const terrain = this.terrain.heightAt(x, z);
    const built = this.collision.supportAt(x, z, fromY + 0.3, 0.45);
    return built !== null && built > terrain ? built : terrain;
  }

  zoneAt(x: number, z: number): Zone | null {
    return zoneAt(x, z);
  }

  /** Nearest interactable within reach of a point. */
  nearestInteractable(point: THREE.Vector3): Interactable | null {
    let best: Interactable | null = null;
    let bestD = Infinity;
    for (const it of this.interactables) {
      const d = it.position.distanceTo(point);
      if (d <= it.reach && d < bestD) {
        best = it;
        bestD = d;
      }
    }
    return best;
  }

  /**
   * Which landmark is the player looking at?
   *
   * Tests the view ray against each nearby landmark's bounding sphere. A proper
   * raycast against the merged meshes would be more accurate and much slower,
   * and would make scanning a thin pillar infuriating.
   */
  landmarkInSights(origin: THREE.Vector3, direction: THREE.Vector3, maxDistance = 140): PlacedLandmark | null {
    let best: PlacedLandmark | null = null;
    let bestScore = Infinity;
    for (const lm of this.landmarks) {
      if (!lm.codexId) continue;
      const toward = _v1.subVectors(lm.focus, origin);
      const dist = toward.length();
      if (dist > maxDistance) continue;
      const along = toward.dot(direction);
      if (along <= 0) continue;
      // Perpendicular miss distance from the ray to the landmark centre.
      const miss = Math.sqrt(Math.max(0, dist * dist - along * along));
      const tolerance = Math.max(5, lm.radius * 0.85);
      if (miss > tolerance) continue;
      const score = miss / tolerance + dist / maxDistance;
      if (score < bestScore) {
        bestScore = score;
        best = lm;
      }
    }
    return best;
  }

  /** The pad the player starts beside, in the first chapter's zone. */
  spawnPoint(): THREE.Vector3 {
    const first = ZONES[0] as Zone;
    const pad = this.interactables.find((i) => i.kind === 'pad' && i.padZone === first.id);
    const base = pad ? pad.position : new THREE.Vector3(first.center[0], 0, first.center[1] + 30);
    const ground = this.terrain.findGround(base.x, base.z + 12, 60);
    return new THREE.Vector3(ground.x, ground.y + 2, ground.z);
  }

  padFor(zoneId: string): Interactable | undefined {
    return this.interactables.find((i) => i.kind === 'pad' && i.padZone === zoneId);
  }

  // ------------------------------------------------------------------- update

  update(dt: number, camera: THREE.Camera, elapsed: number): void {
    this.sky.update(dt, camera.position, elapsed);
    this.water.update(elapsed, this.sky.sun.position.clone().sub(camera.position).normalize(), this.sky.sun.color, this.sky.fog.color);
    for (const b of this.bobbers) {
      b.mesh.position.y = b.baseY + Math.sin(elapsed * b.speed + b.phase) * 0.3;
      b.mesh.rotation.y += dt * b.spin;
    }
    // The ridden chariot is driven by the player; the rest just settle.
    for (const c of this.chariots) {
      if (!c.mounted) c.update(dt, null);
    }
  }

  get stats(): { monuments: number; colliders: number; flora: number; interactables: number; chariots: number } {
    return {
      monuments: this.monumentMeshes.length,
      colliders: this.collision.count,
      flora: this.vegetation.instanceCount,
      interactables: this.interactables.length,
      chariots: this.chariots.length,
    };
  }

  dispose(): void {
    for (const c of this.chariots) c.dispose();
    this.chariots.length = 0;
    for (const mesh of this.monumentMeshes) mesh.geometry.dispose();
    for (const geo of this.personGeometries.values()) geo.dispose();
    this.personGeometries.clear();
    this.vegetation.dispose();
    this.water.dispose();
    this.sky.dispose();
    this.terrain.dispose();
    this.group.clear();
    this.collision.clear();
  }
}

const _v1 = new THREE.Vector3();

/** A low-poly standing person: robe, torso, head, arms. */
function buildPerson(color: number, rng: Rng): THREE.BufferGeometry {
  const kit = new Kit();
  const skin = 0x8a5f3c;
  const robe = color;

  // Robe, flaring slightly at the hem.
  kit.lathe(
    [
      [0.42, 0],
      [0.36, 0.5],
      [0.3, 1.0],
      [0.28, 1.15],
    ],
    [0, 0, 0],
    shade(robe, 0.95),
    { segments: 9, collide: false },
  );
  kit.box([0.52, 0.56, 0.3], [0, 1.4, 0], robe, { collide: false });
  // Shoulders and arms.
  for (const side of [-1, 1]) {
    kit.box([0.14, 0.52, 0.16], [side * 0.32, 1.38, 0.02], shade(robe, 1.06), {
      rotZ: side * rng.range(0.05, 0.16),
      collide: false,
    });
    kit.sphere(0.09, [side * 0.34, 1.1, 0.04], skin, { segments: 6, collide: false });
  }
  // Neck and head.
  kit.cylinder(0.08, 0.09, 0.12, [0, 1.73, 0], skin, { segments: 6, collide: false });
  kit.sphere(0.165, [0, 1.9, 0], skin, { segments: 9, collide: false });
  // A wrapped cloth on the head, which also reads as hair at distance.
  kit.dome(0.175, [0, 1.88, 0], shade(robe, 1.14), { segments: 9, squash: 0.8, collide: false });

  const built = kit.build();
  return built.geometry;
}
