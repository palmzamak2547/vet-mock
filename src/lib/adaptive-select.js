// Adaptive session selection: from one pool, serve the set whose questions
// sit nearest the difficulty a ~70% success rate predicts, then order it as
// a gentle easy-to-hard ramp.
//
// Everything here is pure. The caller (App startExam) supplies the pool
// (already delivery-gated and scope-filtered by buildExamPool), the
// student's ability, and a difficulty resolver; nothing reads storage,
// the clock or the DOM, so the arithmetic is testable in isolation and the
// pool's own never-empty guarantees stay intact — selection only ever
// narrows what buildExamPool already served.

import { expectedScore, updateElo, clampRating, questionDifficulty, DEFAULT_RATING } from './elo.js';

// Target success rate. Comfortably above a coin flip so a session feels like
// productive practice rather than an ambush, comfortably below certainty so
// it still teaches anything.
export const ADAPTIVE_TARGET = 0.7;

// Difficulty is "near" in bands of this many rating points; inside a band the
// order is shuffled so two sessions back to back do not serve identical sets.
const NEARNESS_BAND = 50;

// The difficulty that yields the target success rate against this ability.
// Inverting the logistic: d* = ability - 400·log10(target/(1-target)).
export function targetDifficultyFor(ability, target = ADAPTIVE_TARGET) {
  return ability - 400 * Math.log10(target / (1 - target));
}

// Select `count` questions from `pool` nearest the target difficulty, with a
// per-topic diversity cap so one heavily-banked topic cannot own the set, and
// a light shuffle inside each nearness band. Returns the picked questions
// ordered easy → hard (the ramp a student walks into the session with).
export function adaptiveSelect(pool, {
  ability = DEFAULT_RATING,
  difficultyOf = (q) => questionDifficulty(q),
  target = ADAPTIVE_TARGET,
  count = 10,
  topicCap = null,
  rng = Math.random,
} = {}) {
  const wanted = Math.max(1, Math.floor(count));
  if (!Array.isArray(pool) || pool.length === 0) return [];
  if (pool.length <= wanted) {
    return [...pool].sort((a, b) => difficultyOf(a) - difficultyOf(b));
  }

  const targetDifficulty = targetDifficultyFor(ability, target);
  const byGap = pool
    .map((q) => ({ q, difficulty: difficultyOf(q), gap: Math.abs(difficultyOf(q) - targetDifficulty) }))
    // Light shuffle inside each 50-point band first: a stable sort then keeps
    // bands ordered by nearness while varying who represents each band.
    .map((entry) => ({ ...entry, band: Math.floor(entry.difficulty / NEARNESS_BAND) }))
    .sort((a, b) => a.band - b.band || a.gap - b.gap);

  const bands = new Map();
  for (const entry of byGap) {
    if (!bands.has(entry.band)) bands.set(entry.band, []);
    bands.get(entry.band).push(entry);
  }
  const ranked = [];
  for (const members of bands.values()) {
    for (let i = members.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [members[i], members[j]] = [members[j], members[i]];
    }
    ranked.push(...members);
  }
  ranked.sort((a, b) => a.gap - b.gap);

  // Diversity walk: nearest first, but a topic (fallback subject) holds at
  // most its cap until the walk runs dry and a second pass relaxes it —
  // a thin pool must never come back short (never-empty, like the pool itself).
  const cap = topicCap ?? Math.max(1, Math.ceil(wanted / 5));
  const keyOf = (q) => q.topic || q.subject || '?';
  const pickWithCap = (limit) => {
    const counts = new Map();
    const picked = [];
    for (const entry of ranked) {
      if (picked.length >= wanted) break;
      const key = keyOf(entry.q);
      const seen = counts.get(key) || 0;
      if (seen >= limit) continue;
      counts.set(key, seen + 1);
      picked.push(entry.q);
    }
    return picked;
  };
  let picked = pickWithCap(cap);
  if (picked.length < wanted) picked = pickWithCap(Infinity);

  return picked.sort((a, b) => difficultyOf(a) - difficultyOf(b));
}

// Rebuild the student's ability rating from their synced answer history.
// Deterministic from the same records every device sees, so ability needs no
// storage of its own: it survives account changes, restores and new devices
// by construction. Entries carry { questionId, correct, date }; unrated
// questions resolve through the difficulty ladder (map rung, else neutral).
const ABILITY_K_PER_ANSWER = 16;

export function computeAbility(history, difficultyData, { start = DEFAULT_RATING, k = ABILITY_K_PER_ANSWER } = {}) {
  let ability = start;
  const answered = (Array.isArray(history) ? history : [])
    .filter((e) => e && e.questionId !== null && e.questionId !== undefined && typeof e.correct === 'boolean')
    .sort((a, b) => (a.date || 0) - (b.date || 0));
  for (const entry of answered) {
    const difficulty = questionDifficulty({ id: entry.questionId }, difficultyData);
    ability = clampRating(updateElo(ability, expectedScore(ability, difficulty), entry.correct ? 1 : 0, k));
  }
  return Math.round(ability);
}
