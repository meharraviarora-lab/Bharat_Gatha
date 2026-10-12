import * as THREE from 'three';

/**
 * Material registry.
 *
 * Almost everything built in this game shares ONE material and carries its
 * colour in a vertex-colour attribute. That is what lets us merge an entire
 * monument — drum, dome, railing, four gateways — into a single draw call while
 * still giving each part its own stone colour.
 */

let sharedOpaque: THREE.MeshStandardMaterial | null = null;
let sharedUnlit: THREE.MeshBasicMaterial | null = null;
const cache = new Map<string, THREE.Material>();

/** The workhorse: vertex-coloured, shadow-receiving stone/brick/timber. */
export function stoneMaterial(): THREE.MeshStandardMaterial {
  if (!sharedOpaque) {
    sharedOpaque = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.82,
      metalness: 0.02,
      flatShading: false,
    });
  }
  return sharedOpaque;
}

/** For markers, holograms and UI-ish world elements that should ignore light. */
export function unlitMaterial(): THREE.MeshBasicMaterial {
  if (!sharedUnlit) {
    sharedUnlit = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  }
  return sharedUnlit;
}

export interface SolidOptions {
  roughness?: number;
  metalness?: number;
  emissive?: number;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  flatShading?: boolean;
  depthWrite?: boolean;
}

/** A cached single-colour material, for the few things that cannot share. */
export function solid(color: number, opts: SolidOptions = {}): THREE.MeshStandardMaterial {
  const key = `s|${color}|${JSON.stringify(opts)}`;
  const hit = cache.get(key);
  if (hit) return hit as THREE.MeshStandardMaterial;
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.8,
    metalness: opts.metalness ?? 0.03,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    flatShading: opts.flatShading ?? false,
    depthWrite: opts.depthWrite ?? true,
  });
  cache.set(key, mat);
  return mat;
}

/** Terrain uses its own material so we can tune it independently. */
export function terrainMaterial(): THREE.MeshStandardMaterial {
  const key = 'terrain';
  const hit = cache.get(key);
  if (hit) return hit as THREE.MeshStandardMaterial;
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0,
    flatShading: false,
  });
  cache.set(key, mat);
  return mat;
}

/** Glow material for pickups, scan targets and challenge markers. */
export function glowMaterial(color: number, opacity = 0.55): THREE.MeshBasicMaterial {
  const key = `g|${color}|${opacity}`;
  const hit = cache.get(key);
  if (hit) return hit as THREE.MeshBasicMaterial;
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
  });
  cache.set(key, mat);
  return mat;
}

// ------------------------------------------------------------------ colours

/** Multiply a hex colour by a scalar, clamped. Handy for shading variants. */
export function shade(color: number, factor: number): number {
  const r = Math.min(255, Math.round(((color >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.round(((color >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.round((color & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

/** Linear blend between two hex colours. */
export function mixColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

export function disposeMaterials(): void {
  sharedOpaque?.dispose();
  sharedUnlit?.dispose();
  sharedOpaque = null;
  sharedUnlit = null;
  for (const mat of cache.values()) mat.dispose();
  cache.clear();
}
