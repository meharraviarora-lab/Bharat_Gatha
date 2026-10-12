import type { CodexEntry } from '../types';
import { ZONES } from '../zones';

import { sindhuCodex } from './sindhu';
import { meluhhaCodex } from './meluhha';
import { kosalaCodex } from './kosala';
import { setuLankaCodex } from './setuLanka';
import { kurukshetraCodex } from './kurukshetra';
import { magadhaCodex } from './magadha';
import { cholaCodex } from './chola';
import { konarkCodex } from './konark';
import { hampiCodex } from './hampi';
import { agraCodex } from './agra';
import { marathaCodex } from './maratha';

/** Every codex entry in the game. */
export const CODEX: CodexEntry[] = [
  ...sindhuCodex,
  ...meluhhaCodex,
  ...kosalaCodex,
  ...setuLankaCodex,
  ...kurukshetraCodex,
  ...magadhaCodex,
  ...cholaCodex,
  ...konarkCodex,
  ...hampiCodex,
  ...agraCodex,
  ...marathaCodex,
];

const BY_ID = new Map(CODEX.map((e) => [e.id, e]));

export function getCodex(id: string): CodexEntry | undefined {
  return BY_ID.get(id);
}

export function codexForZone(zoneId: string): CodexEntry[] {
  return CODEX.filter((e) => e.zoneId === zoneId);
}

export const CODEX_COUNT = CODEX.length;

/**
 * Content integrity check.
 *
 * Because the whole game is data, a typo in a codex id is a silently missing
 * reward rather than a crash. This runs once at startup in dev and prints
 * anything that does not resolve, which has caught more mistakes than any
 * amount of careful typing.
 */
export function validateContent(): string[] {
  const problems: string[] = [];

  // Duplicate codex ids.
  const seen = new Set<string>();
  for (const entry of CODEX) {
    if (seen.has(entry.id)) problems.push(`duplicate codex id: ${entry.id}`);
    seen.add(entry.id);
    if (!ZONES.some((z) => z.id === entry.zoneId)) {
      problems.push(`codex "${entry.id}" belongs to unknown zone "${entry.zoneId}"`);
    }
    for (const ref of entry.seeAlso ?? []) {
      if (!BY_ID.has(ref)) problems.push(`codex "${entry.id}" sees-also missing entry "${ref}"`);
    }
  }

  // Everything the zones promise to unlock must exist.
  const landmarkIds = new Set<string>();
  const challengeIds = new Set<string>();
  for (const zone of ZONES) {
    for (const lm of zone.landmarks) {
      if (landmarkIds.has(lm.id)) problems.push(`duplicate landmark id: ${lm.id}`);
      landmarkIds.add(lm.id);
      if (lm.codexId && !BY_ID.has(lm.codexId)) {
        problems.push(`landmark "${lm.id}" unlocks missing codex "${lm.codexId}"`);
      }
    }
    for (const ch of zone.challenges) {
      if (challengeIds.has(ch.id)) problems.push(`duplicate challenge id: ${ch.id}`);
      challengeIds.add(ch.id);
      for (const ref of ch.unlocks ?? []) {
        if (!BY_ID.has(ref)) problems.push(`challenge "${ch.id}" unlocks missing codex "${ref}"`);
      }
      if (ch.kind === 'dialogue') {
        const nodeIds = new Set(ch.config.nodes.map((n) => n.id));
        for (const node of ch.config.nodes) {
          for (const ref of node.unlocks ?? []) {
            if (!BY_ID.has(ref)) problems.push(`dialogue "${ch.id}" node "${node.id}" unlocks missing codex "${ref}"`);
          }
          const targets = [node.goto, node.next, ...(node.choices ?? []).map((c) => c.goto)];
          for (const t of targets) {
            if (t && !nodeIds.has(t)) problems.push(`dialogue "${ch.id}" node "${node.id}" jumps to missing node "${t}"`);
          }
          if (!node.end && !node.goto && !node.next && (node.choices ?? []).length === 0) {
            problems.push(`dialogue "${ch.id}" node "${node.id}" is a dead end but not marked end`);
          }
        }
      }
      if (ch.kind === 'scriptMatch') {
        const left = new Set(ch.config.left.map((l) => l.id));
        const right = new Set(ch.config.right.map((r) => r.id));
        for (const id of left) if (!right.has(id)) problems.push(`scriptMatch "${ch.id}" left "${id}" has no right match`);
        for (const id of right) if (!left.has(id)) problems.push(`scriptMatch "${ch.id}" right "${id}" has no left match`);
      }
      if (ch.kind === 'assembly') {
        const pieces = new Set(ch.config.pieces.map((p) => p.id));
        for (const socket of ch.config.sockets) {
          if (!pieces.has(socket.accepts)) {
            problems.push(`assembly "${ch.id}" socket "${socket.id}" accepts unknown piece "${socket.accepts}"`);
          }
        }
      }
      if (ch.kind === 'trade') {
        const reachable = canReachTarget(ch.config.weights, ch.config.target);
        if (!reachable) problems.push(`trade "${ch.id}" target ${ch.config.target} cannot be made from its weights`);
      }
    }
    for (const npc of zone.npcs) {
      if (npc.unlocks && !BY_ID.has(npc.unlocks)) {
        problems.push(`npc "${npc.id}" unlocks missing codex "${npc.unlocks}"`);
      }
    }
  }

  return problems;
}

/** Subset-sum over the available weights, so an unsolvable puzzle never ships. */
function canReachTarget(weights: readonly number[], target: number): boolean {
  const reachable = new Set<number>([0]);
  for (const w of weights) {
    for (const value of [...reachable]) {
      const next = value + w;
      if (next === target) return true;
      if (next < target) reachable.add(next);
    }
  }
  return reachable.has(target);
}
