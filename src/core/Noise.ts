/**
 * 2D value-gradient noise + fBm, written by hand so the project stays
 * dependency-light and the terrain is byte-for-byte reproducible from a seed.
 */

import { hashString } from './Rng';

const PERM_SIZE = 512;

export class Noise2D {
  private readonly perm = new Uint8Array(PERM_SIZE);
  private readonly gradX = new Float32Array(256);
  private readonly gradY = new Float32Array(256);

  constructor(seed: number | string = 'bharat') {
    let s = (typeof seed === 'string' ? hashString(seed) : seed) | 0;
    if (s === 0) s = 0x1b873593;

    const rand = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const base = new Uint8Array(256);
    for (let i = 0; i < 256; i++) base[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = base[i] as number;
      base[i] = base[j] as number;
      base[j] = tmp;
    }
    for (let i = 0; i < PERM_SIZE; i++) this.perm[i] = base[i & 255] as number;

    for (let i = 0; i < 256; i++) {
      const a = rand() * Math.PI * 2;
      this.gradX[i] = Math.cos(a);
      this.gradY[i] = Math.sin(a);
    }
  }

  /** Perlin-style gradient noise, roughly in [-1, 1]. */
  sample(x: number, y: number): number {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const u = fade(xf);
    const v = fade(yf);

    const n00 = this.dot(xi, yi, xf, yf);
    const n10 = this.dot(xi + 1, yi, xf - 1, yf);
    const n01 = this.dot(xi, yi + 1, xf, yf - 1);
    const n11 = this.dot(xi + 1, yi + 1, xf - 1, yf - 1);

    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * 1.4;
  }

  /** Fractional Brownian motion: layered octaves, output roughly in [-1, 1]. */
  fbm(x: number, y: number, octaves = 5, lacunarity = 2.02, gain = 0.5): number {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += this.sample(x * freq, y * freq) * amp;
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return norm > 0 ? sum / norm : 0;
  }

  /** Ridged multifractal — makes convincing mountain spines (Aravalli, Sahyadri). */
  ridged(x: number, y: number, octaves = 5, lacunarity = 2.07, gain = 0.5): number {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      const n = 1 - Math.abs(this.sample(x * freq, y * freq));
      sum += n * n * amp;
      norm += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    return norm > 0 ? sum / norm : 0;
  }

  /** Cell-ish noise used for boulder fields and scatter jitter. */
  warp(x: number, y: number, strength = 1): [number, number] {
    return [x + this.sample(x * 0.7 + 11.3, y * 0.7 - 5.1) * strength, y + this.sample(x * 0.7 - 3.9, y * 0.7 + 8.8) * strength];
  }

  private dot(xi: number, yi: number, dx: number, dy: number): number {
    const h = (this.perm[(this.perm[xi & 255] as number) + (yi & 255) & 511] as number) & 255;
    return (this.gradX[h] as number) * dx + (this.gradY[h] as number) * dy;
  }
}

export function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

/** Smooth 0→1 ramp between edges. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

/** 1 at the centre, 0 at `radius` and beyond — used to flatten zone plateaus. */
export function falloff(dist: number, radius: number, softness = 0.45): number {
  return 1 - smoothstep(radius * (1 - softness), radius, dist);
}
