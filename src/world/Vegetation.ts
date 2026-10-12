import * as THREE from 'three';
import { Kit } from './architecture/kit';
import { addTree, addBoulder, type TreeKind } from './architecture/props';
import { Rng } from '../core/Rng';
import { stoneMaterial } from './Materials';
import type { Terrain } from './Terrain';
import { WORLD_HALF, SEA_LEVEL } from './Terrain';
import { ZONES, nearestZone } from '../content/zones';

/**
 * World-wide scatter: trees, scrub and boulders placed across the island.
 *
 * Each species is built once with the same Kit the monuments use, then drawn as
 * a single InstancedMesh. Nine species at a few thousand instances each costs
 * nine draw calls, which is what makes a 3.6 km island affordable.
 *
 * Nothing is placed in water, on steep slopes, or inside the exclusion circles
 * the monuments claim — so no tree ever grows through a temple wall.
 */

/** Which species dominate which biome, with relative weights. */
const BIOME_FLORA: Record<string, Array<[TreeKind, number]>> = {
  riverPlain: [['mango', 4], ['banyan', 2], ['acacia', 2], ['date', 1]],
  desertFringe: [['acacia', 5], ['date', 3]],
  mesopotamianDelta: [['date', 6], ['acacia', 2]],
  dryPlains: [['acacia', 5], ['banyan', 2], ['mango', 1]],
  sal_forest: [['sal', 6], ['banyan', 3], ['mango', 2]],
  deccanBoulder: [['acacia', 4], ['banyan', 2], ['mango', 1]],
  coastalPalm: [['palm', 5], ['mango', 3], ['banyan', 1]],
  tropicalIsland: [['palm', 6], ['mango', 2]],
  gangeticPlain: [['mango', 4], ['sal', 3], ['banyan', 3]],
  hillGhats: [['sal', 5], ['mango', 2], ['acacia', 2]],
  coastalDune: [['palm', 4], ['acacia', 3], ['date', 1]],
};

const ALL_KINDS: TreeKind[] = ['banyan', 'palm', 'sal', 'acacia', 'cypress', 'mango', 'date'];

export interface ExclusionCircle {
  x: number;
  z: number;
  radius: number;
}

export interface VegetationOptions {
  /** Total tree instances across the whole island. */
  trees: number;
  /** Total boulder instances. */
  rocks: number;
  seed: string;
}

export class Vegetation {
  readonly group = new THREE.Group();
  private readonly meshes: THREE.InstancedMesh[] = [];

  constructor(terrain: Terrain, exclusions: ExclusionCircle[], opts: VegetationOptions) {
    this.group.name = 'vegetation';
    const rng = new Rng(`${opts.seed}:flora`);

    // Build one prototype geometry per species.
    const protos = new Map<TreeKind, THREE.BufferGeometry>();
    for (const kind of ALL_KINDS) {
      const kit = new Kit();
      addTree(kit, 0, 0, 0, kind, new Rng(`${opts.seed}:proto:${kind}`), 1);
      const built = kit.build();
      if (built.geometry.getAttribute('position')) protos.set(kind, built.geometry);
    }
    const rockKit = new Kit();
    addBoulder(rockKit, 0, 0, 0, 1, 0x8f8470, new Rng(`${opts.seed}:proto:rock`));
    const rockGeo = rockKit.build().geometry;

    // Collect placements per species, then build the instanced meshes.
    const placements = new Map<TreeKind, THREE.Matrix4[]>();
    for (const kind of ALL_KINDS) placements.set(kind, []);
    const rocks: THREE.Matrix4[] = [];

    const matrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();

    const tryPlace = (isRock: boolean): void => {
      // Rejection sampling: cheap, and it naturally respects the coastline.
      const x = rng.range(-WORLD_HALF + 20, WORLD_HALF - 20);
      const z = rng.range(-WORLD_HALF + 20, WORLD_HALF - 20);
      const y = terrain.heightAt(x, z);
      if (y < SEA_LEVEL + 1.2) return;

      const slope = terrain.slopeAt(x, z);
      if (isRock ? slope > 0.72 : slope > 0.38) return;

      for (const ex of exclusions) {
        const dx = x - ex.x;
        const dz = z - ex.z;
        if (dx * dx + dz * dz < ex.radius * ex.radius) return;
      }

      // Thin out above the tree line.
      if (!isRock && y > 95 && rng.bool(0.75)) return;

      if (isRock) {
        pos.set(x, y - 0.4, z);
        quat.setFromEuler(new THREE.Euler(rng.range(-0.2, 0.2), rng.next() * Math.PI * 2, rng.range(-0.2, 0.2)));
        const s = rng.range(0.8, 3.4);
        scl.set(s, s * rng.range(0.6, 1.0), s);
        matrix.compose(pos, quat, scl);
        rocks.push(matrix.clone());
        return;
      }

      const { zone } = nearestZone(x, z);
      const flora = BIOME_FLORA[zone.biome] ?? BIOME_FLORA.dryPlains!;
      const kind = rng.weighted(flora, (f) => f[1])[0];
      pos.set(x, y - 0.3, z);
      quat.setFromEuler(new THREE.Euler(0, rng.next() * Math.PI * 2, 0));
      const s = rng.range(0.7, 1.35);
      scl.set(s, s * rng.range(0.9, 1.15), s);
      matrix.compose(pos, quat, scl);
      placements.get(kind)!.push(matrix.clone());
    };

    // Budget the attempts: most rejections are water, so over-sample.
    const treeAttempts = opts.trees * 4;
    for (let i = 0; i < treeAttempts; i++) tryPlace(false);
    const rockAttempts = opts.rocks * 4;
    for (let i = 0; i < rockAttempts; i++) tryPlace(true);

    const material = stoneMaterial();
    for (const [kind, list] of placements) {
      const geo = protos.get(kind);
      if (!geo || list.length === 0) continue;
      const mesh = new THREE.InstancedMesh(geo, material, list.length);
      for (let i = 0; i < list.length; i++) mesh.setMatrixAt(i, list[i] as THREE.Matrix4);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      mesh.name = `flora:${kind}`;
      // Instanced bounds must cover the island, or three culls the whole mesh.
      mesh.frustumCulled = false;
      this.meshes.push(mesh);
      this.group.add(mesh);
    }

    if (rocks.length > 0) {
      const mesh = new THREE.InstancedMesh(rockGeo, material, rocks.length);
      for (let i = 0; i < rocks.length; i++) mesh.setMatrixAt(i, rocks[i] as THREE.Matrix4);
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = 'flora:rock';
      mesh.frustumCulled = false;
      this.meshes.push(mesh);
      this.group.add(mesh);
    }
  }

  get instanceCount(): number {
    return this.meshes.reduce((n, m) => n + m.count, 0);
  }

  dispose(): void {
    for (const mesh of this.meshes) {
      mesh.geometry.dispose();
      mesh.dispose();
    }
    this.meshes.length = 0;
    this.group.clear();
  }
}

/** Default scatter budget, scaled by how many zones the world has. */
export function defaultVegetationOptions(seed: string): VegetationOptions {
  return { trees: Math.round(260 * ZONES.length), rocks: Math.round(55 * ZONES.length), seed };
}
