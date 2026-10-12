import type { Question } from '../types';
import { ZONES } from '../zones';

import { ancientQuestions } from './ancient';
import { epicQuestions } from './epics';
import { classicalQuestions } from './classical';
import { medievalQuestions } from './medieval';

/** The authored question bank. Generated questions are produced separately. */
export const QUESTIONS: Question[] = [
  ...ancientQuestions,
  ...epicQuestions,
  ...classicalQuestions,
  ...medievalQuestions,
];

const BY_ZONE = new Map<string, Question[]>();
for (const q of QUESTIONS) {
  let list = BY_ZONE.get(q.zoneId);
  if (!list) {
    list = [];
    BY_ZONE.set(q.zoneId, list);
  }
  list.push(q);
}

export function questionsForZone(zoneId: string): Question[] {
  return BY_ZONE.get(zoneId) ?? [];
}

export const QUESTION_COUNT = QUESTIONS.length;

/** Every distinct learning-objective bucket, for the report card. */
export const SKILLS: string[] = [...new Set(QUESTIONS.map((q) => q.skill))].sort();

/**
 * Validate the bank. A mis-indexed answer is the one content bug that actively
 * teaches the wrong thing, so this runs at startup in dev.
 */
export function validateQuestions(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const q of QUESTIONS) {
    if (seen.has(q.id)) problems.push(`duplicate question id: ${q.id}`);
    seen.add(q.id);

    if (q.zoneId !== 'general' && !ZONES.some((z) => z.id === q.zoneId)) {
      problems.push(`question "${q.id}" has unknown zone "${q.zoneId}"`);
    }
    if (q.options.length < 3) problems.push(`question "${q.id}" has fewer than 3 options`);
    if (q.answer < 0 || q.answer >= q.options.length) {
      problems.push(`question "${q.id}" answer index ${q.answer} is out of range`);
    }
    if (new Set(q.options).size !== q.options.length) {
      problems.push(`question "${q.id}" has duplicate options`);
    }
    if (q.options.some((o) => o.trim().length === 0)) {
      problems.push(`question "${q.id}" has an empty option`);
    }
    if (!q.explain || q.explain.trim().length < 10) {
      problems.push(`question "${q.id}" has no useful explanation`);
    }
    if (!q.skill) problems.push(`question "${q.id}" has no skill tag`);
  }

  // Every zone should have enough authored questions to gate a chapter seal.
  for (const zone of ZONES) {
    const n = questionsForZone(zone.id).length;
    if (n < 8) problems.push(`zone "${zone.id}" has only ${n} authored questions (want at least 8)`);
  }

  return problems;
}
