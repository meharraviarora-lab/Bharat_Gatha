import type { Kit } from './kit';
import type { Rng } from '../../core/Rng';
import { shade, mixColor } from '../Materials';

/**
 * Shared sub-assemblies used by many monuments: trees, boulders, pots, fires,
 * banners, crenellations, pointed-arch recesses and so on. Keeping them here
 * means a village hut and a palace courtyard draw the same banyan tree.
 */

export const WOOD = 0x6b4a2f;
export const THATCH = 0xb79355;
export const CLOTH_SAFFRON = 0xd4702a;
export const WATER_TINT = 0x2f6f7a;
export const BRONZE = 0xa9793c;

// ----------------------------------------------------------------- vegetation

export type TreeKind = 'banyan' | 'palm' | 'sal' | 'acacia' | 'cypress' | 'mango' | 'date';

export function addTree(kit: Kit, x: number, z: number, y: number, kind: TreeKind, rng: Rng, scale = 1): void {
  const s = scale * rng.range(0.85, 1.2);
  const foliage = (base: number) => shade(base, rng.range(0.85, 1.12));

  switch (kind) {
    case 'palm': {
      const h = 9 * s;
      // Palms lean; the lean is what makes a beach read as a beach.
      const lean = rng.range(-0.14, 0.14);
      kit.cylinder(0.26 * s, 0.42 * s, h, [x, y + h / 2, z], 0x7c6246, { segments: 6, rotZ: lean });
      const top = y + h - 0.3;
      kit.ring(
        7,
        2.9 * s,
        (fx, fz, a) => {
          kit.prism(
            [
              [0, -0.16 * s],
              [3.1 * s, -0.5 * s],
              [3.4 * s, 0.1 * s],
              [0, 0.3 * s],
            ],
            0.1,
            [x + fx * 0.25 + lean * h, top, z + fz * 0.25],
            foliage(0x3f7a3a),
            { rotY: -a, rotZ: rng.range(-0.3, -0.05), collide: false },
          );
        },
        rng.range(0, 1),
      );
      kit.sphere(0.5 * s, [x + lean * h, top - 0.4, z], 0x6b5a3a, { segments: 6, collide: false });
      break;
    }
    case 'date': {
      const h = 7.5 * s;
      kit.cylinder(0.3 * s, 0.5 * s, h, [x, y + h / 2, z], 0x8a7250, { segments: 6 });
      kit.ring(6, 2.4 * s, (fx, fz, a) => {
        kit.prism(
          [
            [0, 0],
            [2.6 * s, -0.7 * s],
            [2.7 * s, -0.2 * s],
            [0, 0.26 * s],
          ],
          0.1,
          [x, y + h - 0.2, z],
          foliage(0x5f7c38),
          { rotY: -a, collide: false },
        );
        void fx;
        void fz;
      });
      break;
    }
    case 'cypress': {
      const h = 11 * s;
      kit.cylinder(0.18 * s, 0.3 * s, h * 0.3, [x, y + h * 0.15, z], WOOD, { segments: 6 });
      kit.cone(1.25 * s, h, [x, y + h / 2 + 0.4, z], foliage(0x2f5a33), { segments: 8, collide: true });
      break;
    }
    case 'banyan': {
      const h = 7 * s;
      kit.cylinder(1.1 * s, 1.5 * s, h, [x, y + h / 2, z], 0x6a5440, { segments: 8 });
      // Prop roots — the signature of a banyan.
      kit.ring(5, 3.2 * s, (fx, fz) => {
        kit.cylinder(0.22 * s, 0.3 * s, h * 0.86, [x + fx, y + h * 0.43, z + fz], 0x6a5440, {
          segments: 5,
          collide: false,
        });
      }, rng.next() * 3);
      const cy = y + h + 1.6 * s;
      kit.sphere(5.2 * s, [x, cy, z], foliage(0x2d5f2c), { segments: 10, collide: false });
      kit.sphere(3.6 * s, [x + 3.4 * s, cy - 0.8 * s, z - 1.5 * s], foliage(0x2d5f2c), { segments: 8, collide: false });
      kit.sphere(3.3 * s, [x - 2.8 * s, cy - 1.1 * s, z + 2.6 * s], foliage(0x33692f), { segments: 8, collide: false });
      break;
    }
    case 'mango': {
      const h = 6.5 * s;
      kit.cylinder(0.6 * s, 0.85 * s, h, [x, y + h / 2, z], WOOD, { segments: 7 });
      kit.sphere(3.5 * s, [x, y + h + 1.9 * s, z], foliage(0x2f6b35), { segments: 9, collide: false });
      kit.sphere(2.4 * s, [x + 2.2 * s, y + h + 0.9 * s, z + 1.2 * s], foliage(0x376f36), { segments: 7, collide: false });
      break;
    }
    case 'acacia': {
      const h = 6 * s;
      kit.cylinder(0.35 * s, 0.6 * s, h, [x, y + h / 2, z], 0x7a6346, { segments: 6 });
      // Flat-topped canopy, the dry-plains silhouette.
      kit.cylinder(3.6 * s, 2.4 * s, 0.9 * s, [x, y + h + 0.45 * s, z], foliage(0x6f7f42), {
        segments: 9,
        collide: false,
      });
      kit.cylinder(2.3 * s, 3.1 * s, 0.7 * s, [x + 0.5 * s, y + h + 1.15 * s, z], foliage(0x76853f), {
        segments: 8,
        collide: false,
      });
      break;
    }
    case 'sal':
    default: {
      const h = 11 * s;
      kit.cylinder(0.45 * s, 0.75 * s, h, [x, y + h / 2, z], 0x5f4a33, { segments: 7 });
      kit.cone(3.1 * s, 5.4 * s, [x, y + h + 1.4 * s, z], foliage(0x2a5c2b), { segments: 9, collide: false });
      kit.cone(2.3 * s, 3.8 * s, [x, y + h + 3.6 * s, z], foliage(0x316a30), { segments: 8, collide: false });
      break;
    }
  }
}

/** Scatter a thicket of trees in a ring, avoiding the centre. */
export function scatterTrees(
  kit: Kit,
  count: number,
  innerRadius: number,
  outerRadius: number,
  kind: TreeKind,
  rng: Rng,
  y = 0,
): void {
  for (let i = 0; i < count; i++) {
    const a = rng.next() * Math.PI * 2;
    const r = innerRadius + rng.next() * (outerRadius - innerRadius);
    addTree(kit, Math.cos(a) * r, Math.sin(a) * r, y, kind, rng, rng.range(0.75, 1.25));
  }
}

// -------------------------------------------------------------------- geology

/** A weathered granite boulder — squashed, tilted, slightly irregular. */
export function addBoulder(kit: Kit, x: number, z: number, y: number, radius: number, color: number, rng: Rng): void {
  const squash = rng.range(0.55, 0.95);
  kit.sphere(radius, [x, y + radius * squash * 0.72, z], shade(color, rng.range(0.86, 1.14)), {
    segments: rng.int(7, 10),
    rotX: rng.range(-0.25, 0.25),
    rotZ: rng.range(-0.25, 0.25),
    collide: radius > 1.6,
  });
}

/** Two or three boulders balanced on each other — very Hampi. */
export function addBoulderStack(kit: Kit, x: number, z: number, y: number, scale: number, color: number, rng: Rng): void {
  let h = y;
  const n = rng.int(2, 3);
  let r = scale * rng.range(2.4, 3.6);
  for (let i = 0; i < n; i++) {
    addBoulder(kit, x + rng.range(-0.5, 0.5) * r * 0.3, z + rng.range(-0.5, 0.5) * r * 0.3, h, r, color, rng);
    h += r * 1.1;
    r *= rng.range(0.55, 0.78);
  }
}

// -------------------------------------------------------------- built details

/** Crenellated parapet along a line. */
export function addCrenellations(
  kit: Kit,
  from: readonly [number, number],
  to: readonly [number, number],
  y: number,
  color: number,
  merlon = 1.1,
): void {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const n = Math.max(2, Math.floor(len / (merlon * 2)));
  const angle = Math.atan2(dz, dx);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    kit.box([merlon, merlon * 1.5, merlon * 0.8], [from[0] + dx * t, y + merlon * 0.75, from[1] + dz * t], color, {
      rotY: -angle,
      collide: false,
    });
  }
}

/**
 * A pointed-arch recess (iwan / pishtaq) sunk into a wall face.
 * Built as a frame of boxes plus a stepped head — close enough at game scale,
 * and far cheaper than a real arch mesh.
 */
export function addIwan(
  kit: Kit,
  at: readonly [number, number, number],
  width: number,
  height: number,
  depth: number,
  frameColor: number,
  voidColor: number,
  rotY = 0,
): void {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  const p = (lx: number, ly: number, lz: number): [number, number, number] => [
    at[0] + lx * c + lz * s,
    at[1] + ly,
    at[2] - lx * s + lz * c,
  ];
  // Dark recess behind.
  kit.box([width, height, depth * 0.5], p(0, height / 2, -depth * 0.3), voidColor, { rotY, collide: false });
  // Pointed head, approximated by shrinking courses.
  const courses = 5;
  for (let i = 0; i < courses; i++) {
    const t = (i + 1) / (courses + 1);
    kit.box(
      [width * (1 - t * t * 0.92), height * 0.085, depth * 0.5],
      p(0, height + height * 0.085 * (i + 0.5), -depth * 0.3),
      voidColor,
      { rotY, collide: false },
    );
  }
  // Frame.
  const jamb = width * 0.16;
  kit.box([jamb, height * 1.5, depth], p(-(width / 2 + jamb / 2), height * 0.75, 0), frameColor, { rotY });
  kit.box([jamb, height * 1.5, depth], p(width / 2 + jamb / 2, height * 0.75, 0), frameColor, { rotY });
  kit.box([width + jamb * 2, jamb * 0.9, depth], p(0, height * 1.5 + jamb * 0.45, 0), frameColor, { rotY, collide: false });
}

/** A small domed kiosk on four or eight posts. */
export function addChhatri(
  kit: Kit,
  at: readonly [number, number, number],
  radius: number,
  height: number,
  color: number,
  posts = 4,
): void {
  kit.cylinder(radius * 1.12, radius * 1.18, height * 0.1, [at[0], at[1] + height * 0.05, at[2]], color, {
    segments: posts === 4 ? 4 : 8,
  });
  kit.ring(posts, radius * 0.86, (px, pz) => {
    kit.box([radius * 0.2, height * 0.72, radius * 0.2], [at[0] + px, at[1] + height * 0.46, at[2] + pz], color, {
      collide: false,
    });
  }, Math.PI / posts);
  kit.cylinder(radius * 1.05, radius * 0.95, height * 0.1, [at[0], at[1] + height * 0.86, at[2]], color, {
    segments: 8,
    collide: false,
  });
  kit.dome(radius * 0.92, [at[0], at[1] + height * 0.9, at[2]], color, { segments: 12, squash: 0.92, collide: false });
  addKalasha(kit, [at[0], at[1] + height * 0.9 + radius * 0.88, at[2]], radius * 0.22, color);
}

/** The finial pot-and-bud that tops almost every Indian tower. */
export function addKalasha(kit: Kit, at: readonly [number, number, number], scale: number, color: number): void {
  kit.lathe(
    [
      [scale * 1.1, 0],
      [scale * 1.25, scale * 0.35],
      [scale * 0.55, scale * 0.75],
      [scale * 0.8, scale * 1.1],
      [scale * 0.3, scale * 1.5],
      [scale * 0.12, scale * 2.1],
      [0.001, scale * 2.4],
    ],
    at,
    color,
    { segments: 10, collide: false },
  );
}

/** The ribbed cushion disc below a Nagara finial. */
export function addAmalaka(kit: Kit, at: readonly [number, number, number], radius: number, color: number): void {
  kit.lathe(
    [
      [radius * 0.55, 0],
      [radius, radius * 0.22],
      [radius * 1.05, radius * 0.45],
      [radius * 0.78, radius * 0.7],
      [radius * 0.45, radius * 0.78],
    ],
    at,
    color,
    { segments: 16, collide: false },
  );
}

/** A conical thatched roof hut. */
export function addHut(
  kit: Kit,
  x: number,
  z: number,
  y: number,
  radius: number,
  wallColor: number,
  rng: Rng,
  reed = false,
): void {
  const h = radius * rng.range(1.1, 1.4);
  if (reed) {
    kit.cylinder(radius, radius * 1.05, h, [x, y + h / 2, z], mixColor(THATCH, 0x8c7a4a, 0.4), { segments: 8 });
    kit.dome(radius * 1.02, [x, y + h, z], THATCH, { segments: 10, squash: 1.5, collide: false });
  } else {
    kit.cylinder(radius, radius * 1.04, h, [x, y + h / 2, z], shade(wallColor, rng.range(0.9, 1.1)), { segments: 8 });
    kit.cone(radius * 1.3, radius * 1.1, [x, y + h + radius * 0.55, z], THATCH, { segments: 9, collide: false });
  }
  // Doorway, cut by placing a dark panel rather than booleans.
  kit.box([radius * 0.5, h * 0.62, 0.22], [x, y + h * 0.31, z + radius * 0.99], 0x2a211a, { collide: false });
}

/** Rectangular flat-roofed mud-brick house. */
export function addFlatHouse(
  kit: Kit,
  x: number,
  z: number,
  y: number,
  w: number,
  d: number,
  h: number,
  color: number,
  rng: Rng,
): void {
  kit.box([w, h, d], [x, y + h / 2, z], shade(color, rng.range(0.9, 1.12)));
  kit.slab([w * 1.08, d * 1.08], [x, y + h + 0.16, z], 0.3, shade(color, 0.86), { collide: false });
  kit.box([w * 0.34, h * 0.6, 0.2], [x, y + h * 0.3, z + d / 2 + 0.05], 0x2a211a, { collide: false });
  if (rng.bool(0.4)) {
    // Parapet — Indus roofs were used.
    for (const [fx, fz, sw, sd] of [
      [0, -d / 2, w, 0.25],
      [0, d / 2, w, 0.25],
      [-w / 2, 0, 0.25, d],
      [w / 2, 0, 0.25, d],
    ] as Array<[number, number, number, number]>) {
      kit.box([sw, 0.7, sd], [x + fx, y + h + 0.6, z + fz], shade(color, 0.92), { collide: false });
    }
  }
}

/** A cooking or sacrificial fire with a glow. */
export function addFire(kit: Kit, x: number, z: number, y: number, radius = 1.2): void {
  kit.ring(7, radius, (px, pz) => {
    kit.box([0.35, 0.3, 0.35], [x + px, y + 0.15, z + pz], 0x4a443c, { collide: false });
  });
  kit.cone(radius * 0.5, radius * 1.1, [x, y + radius * 0.6, z], 0xd9762a, { segments: 6, collide: false });
  kit.cone(radius * 0.3, radius * 0.7, [x, y + radius * 0.95, z], 0xffcf6a, { segments: 5, collide: false });
}

/** Cloth banner on a pole. */
export function addBanner(kit: Kit, x: number, z: number, y: number, height: number, color: number, rotY = 0): void {
  kit.cylinder(0.12, 0.16, height, [x, y + height / 2, z], WOOD, { segments: 5 });
  kit.box([1.9, height * 0.42, 0.08], [x + 1.0, y + height * 0.72, z], color, { rotY, collide: false });
  kit.sphere(0.24, [x, y + height + 0.1, z], 0xc9a23c, { segments: 6, collide: false });
}

/** Storage jars and pots, scattered. */
export function addPots(kit: Kit, x: number, z: number, y: number, count: number, rng: Rng): void {
  for (let i = 0; i < count; i++) {
    const px = x + rng.range(-1.6, 1.6);
    const pz = z + rng.range(-1.6, 1.6);
    const s = rng.range(0.35, 0.72);
    kit.lathe(
      [
        [s * 0.45, 0],
        [s, s * 0.5],
        [s * 0.85, s * 1.05],
        [s * 0.5, s * 1.3],
        [s * 0.62, s * 1.45],
      ],
      [px, y, pz],
      shade(0xa2613f, rng.range(0.85, 1.15)),
      { segments: 8, collide: false },
    );
  }
}

/** A stone-lined well. */
export function addWell(kit: Kit, x: number, z: number, y: number, radius: number, color: number): void {
  kit.cylinder(radius, radius * 1.1, 1.3, [x, y + 0.65, z], color, { segments: 12 });
  kit.cylinder(radius * 0.78, radius * 0.78, 0.2, [x, y + 0.9, z], 0x1d2b30, { segments: 12, collide: false });
  for (const sx of [-1, 1]) {
    kit.cylinder(0.12, 0.14, 2.6, [x + sx * radius * 0.9, y + 1.3, z], WOOD, { segments: 5, collide: false });
  }
  kit.box([radius * 2.1, 0.16, 0.16], [x, y + 2.6, z], WOOD, { collide: false });
}

/** A still water surface — pools, tanks, moats. */
export function addWaterPlane(kit: Kit, size: readonly [number, number], at: readonly [number, number, number]): void {
  kit.plane(size, at, WATER_TINT, { collide: false });
}
