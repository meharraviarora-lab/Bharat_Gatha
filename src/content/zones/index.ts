import type { ChallengeSpec, Landmark, NpcSpec, Zone } from '../types';
import { EXTRA_NPCS } from '../npcs';

import { sindhu } from './sindhu';
import { meluhha } from './meluhha';
import { kosala } from './kosala';
import { setuLanka } from './setuLanka';
import { kurukshetra } from './kurukshetra';
import { magadha } from './magadha';
import { chola } from './chola';
import { konark } from './konark';
import { hampi } from './hampi';
import { agra } from './agra';
import { maratha } from './maratha';

/** Every zone, in chapter order. Roaming ignores the order; the guided path uses it. */
export const ZONES: Zone[] = [sindhu, meluhha, kosala, setuLanka, kurukshetra, magadha, chola, konark, hampi, agra, maratha].sort(
  (a, b) => a.chapter - b.chapter,
);

/**
 * Fold in the wider population.
 *
 * Each zone file carries the characters its teaching depends on; `npcs.ts`
 * carries everybody else. Merging here rather than in eleven separate files
 * keeps the two concerns readable and means adding a villager is a one-file
 * change.
 */
for (const zone of ZONES) {
  const extra = EXTRA_NPCS[zone.id];
  if (extra && extra.length > 0) zone.npcs = [...zone.npcs, ...extra];
}

const BY_ID = new Map(ZONES.map((z) => [z.id, z]));

export function getZone(id: string): Zone | undefined {
  return BY_ID.get(id);
}

export function requireZone(id: string): Zone {
  const z = BY_ID.get(id);
  if (!z) throw new Error(`Unknown zone: ${id}`);
  return z;
}

/** The zone whose influence circle contains this point, or the nearest one. */
export function zoneAt(x: number, z: number): Zone | null {
  let best: Zone | null = null;
  let bestD = Infinity;
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.center[0], z - zone.center[1]);
    if (d < zone.radius && d < bestD) {
      best = zone;
      bestD = d;
    }
  }
  return best;
}

export function nearestZone(x: number, z: number): { zone: Zone; distance: number } {
  let best = ZONES[0] as Zone;
  let bestD = Infinity;
  for (const zone of ZONES) {
    const d = Math.hypot(x - zone.center[0], z - zone.center[1]);
    if (d < bestD) {
      best = zone;
      bestD = d;
    }
  }
  return { zone: best, distance: bestD };
}

/** Absolute world position of a zone-relative offset. */
export function worldPos(zone: Zone, offset: readonly [number, number]): [number, number] {
  return [zone.center[0] + offset[0], zone.center[1] + offset[1]];
}

export interface LandmarkRef {
  zone: Zone;
  landmark: Landmark;
  world: [number, number];
}

export function allLandmarks(): LandmarkRef[] {
  const out: LandmarkRef[] = [];
  for (const zone of ZONES) {
    for (const landmark of zone.landmarks) {
      out.push({ zone, landmark, world: worldPos(zone, landmark.offset) });
    }
  }
  return out;
}

export interface ChallengeRef {
  zone: Zone;
  challenge: ChallengeSpec;
  world: [number, number];
}

export function allChallenges(): ChallengeRef[] {
  const out: ChallengeRef[] = [];
  for (const zone of ZONES) {
    for (const challenge of zone.challenges) {
      out.push({ zone, challenge, world: worldPos(zone, challenge.offset) });
    }
  }
  return out;
}

export function findChallenge(id: string): ChallengeRef | undefined {
  return allChallenges().find((c) => c.challenge.id === id);
}

export interface NpcRef {
  zone: Zone;
  npc: NpcSpec;
  world: [number, number];
}

export function allNpcs(): NpcRef[] {
  const out: NpcRef[] = [];
  for (const zone of ZONES) {
    for (const npc of zone.npcs) {
      out.push({ zone, npc, world: worldPos(zone, npc.offset) });
    }
  }
  return out;
}

export const TOTAL_CHALLENGES = ZONES.reduce((n, z) => n + z.challenges.length, 0);
export const TOTAL_LANDMARKS = ZONES.reduce((n, z) => n + z.landmarks.length, 0);
export const TOTAL_NPCS = ZONES.reduce((n, z) => n + z.npcs.length, 0);

export {
  sindhu,
  meluhha,
  kosala,
  setuLanka,
  kurukshetra,
  magadha,
  chola,
  konark,
  hampi,
  agra,
  maratha,
};
