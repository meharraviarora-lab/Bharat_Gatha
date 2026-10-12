import { Kit, type BuildResult } from './kit';
import { Rng } from '../../core/Rng';
import type { BuilderKind, ZonePalette } from '../../content/types';

import * as ancient from './ancient';
import * as sacred from './sacred';
import * as places from './places';

/**
 * The builder registry.
 *
 * A landmark in the content data says only `kind: 'stupa'` plus a few numbers.
 * This maps that to a function that fills a Kit, so adding a new monument type
 * is one entry here and one function — no changes anywhere else in the engine.
 */

export interface BuildContext {
  kit: Kit;
  rng: Rng;
  /** The owning zone's palette, so a monument takes its region's stone colour. */
  palette: ZonePalette;
  /** Read a numeric option with a fallback. */
  num(key: string, fallback: number): number;
  /** Read a boolean-ish option. */
  flag(key: string): boolean;
}

export type Builder = (ctx: BuildContext) => void;

export const BUILDERS: Record<BuilderKind, Builder> = {
  // Bronze Age and epic-period
  indusCitadel: ancient.indusCitadel,
  greatBath: ancient.greatBath,
  indusHousing: ancient.indusHousing,
  lothalDock: ancient.lothalDock,
  ziggurat: ancient.ziggurat,
  scribeYard: ancient.scribeYard,
  warCamp: ancient.warCamp,
  chariotLine: ancient.chariotLine,
  kuruShrine: ancient.kuruShrine,
  cityGate: ancient.cityGate,
  harbour: ancient.harbour,
  dhow: ancient.dhow,

  // Sacred and scientific architecture
  stupa: sacred.stupa,
  ashokaPillar: sacred.ashokaPillar,
  nalandaVihara: sacred.nalandaVihara,
  dravidaTemple: sacred.dravidaTemple,
  nagaraTemple: sacred.nagaraTemple,
  konarkTemple: sacred.konarkTemple,
  jantarMantar: sacred.jantarMantar,
  mughalTomb: sacred.mughalTomb,
  charbagh: sacred.charbagh,
  stoneChariot: sacred.stoneChariot,
  bronzeFoundry: sacred.bronzeFoundry,

  // Settlements, defences and landscape
  palaceCity: places.palaceCity,
  hermitage: places.hermitage,
  villageCluster: places.villageCluster,
  bazaarStreet: places.bazaarStreet,
  hillFort: places.hillFort,
  lankaFort: places.lankaFort,
  ramSetu: places.ramSetu,
  boulderField: places.boulderField,
  stepwell: places.stepwell,
  vimanaPad: places.vimanaPad,
};

export function buildLandmark(
  kind: BuilderKind,
  opts: Record<string, number | string | boolean> | undefined,
  palette: ZonePalette,
  seed: string,
): BuildResult {
  const builder = BUILDERS[kind];
  const kit = new Kit();
  const options = opts ?? {};

  const ctx: BuildContext = {
    kit,
    rng: new Rng(seed),
    palette,
    num: (key, fallback) => {
      const v = options[key];
      return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
    },
    flag: (key) => {
      const v = options[key];
      return v === true || v === 1 || v === 'true';
    },
  };

  if (!builder) {
    console.warn(`[architecture] no builder for kind "${kind}" — placing a marker block`);
    kit.box([6, 6, 6], [0, 3, 0], 0xff00ff);
    return kit.build();
  }

  try {
    builder(ctx);
  } catch (err) {
    console.error(`[architecture] builder "${kind}" failed`, err);
  }

  return kit.build();
}

export type { BuildResult } from './kit';
export { Kit } from './kit';
