/**
 * Deterministic random numbers.
 *
 * Every piece of generated content — terrain, prop scatter, quiz order — pulls
 * from a seeded stream so that a world can be reproduced exactly from its seed.
 * That matters for a classroom: a teacher can hand out one seed and every
 * student gets the same map and the same question order.
 */
export class Rng {
  private s: number;

  constructor(seed: number | string = 1337) {
    this.s = typeof seed === 'string' ? hashString(seed) : (seed | 0) || 1;
    if (this.s === 0) this.s = 0x9e3779b9;
  }

  /** mulberry32 — small, fast, good enough statistically for game content. */
  next(): number {
    this.s = (this.s + 0x6d2b79f5) | 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Uniform float in [min, max). */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Uniform integer in [min, max] inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  bool(chanceTrue = 0.5): boolean {
    return this.next() < chanceTrue;
  }

  /** Random element. Throws on empty input so bugs surface early. */
  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error('Rng.pick: empty array');
    return items[this.int(0, items.length - 1)] as T;
  }

  /** n distinct elements (or as many as exist). */
  sample<T>(items: readonly T[], n: number): T[] {
    return this.shuffled(items).slice(0, Math.max(0, Math.min(n, items.length)));
  }

  /** Fisher–Yates on a copy. */
  shuffled<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const a = out[i] as T;
      out[i] = out[j] as T;
      out[j] = a;
    }
    return out;
  }

  /** Weighted pick. Weights need not sum to 1. */
  weighted<T>(items: readonly T[], weightOf: (item: T) => number): T {
    let total = 0;
    for (const it of items) total += Math.max(0, weightOf(it));
    if (total <= 0) return this.pick(items);
    let roll = this.next() * total;
    for (const it of items) {
      roll -= Math.max(0, weightOf(it));
      if (roll <= 0) return it;
    }
    return items[items.length - 1] as T;
  }

  /** Gaussian-ish via sum of uniforms; cheap and bounded. */
  gaussian(mean = 0, dev = 1): number {
    const u = this.next() + this.next() + this.next() - 1.5;
    return mean + u * dev * 1.1547;
  }

  /** Fork a child stream — lets subsystems draw without disturbing each other. */
  fork(tag: string): Rng {
    return new Rng((hashString(tag) ^ Math.floor(this.next() * 0xffffffff)) | 0);
  }
}

export function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}

/** Shared stream for throwaway effects where determinism does not matter. */
export const fx = new Rng(Date.now() & 0xffffffff);
