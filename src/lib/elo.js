// Elo-style ratings on one shared scale: a student's ability and a question's
// difficulty live on the same 1500-centred axis, so the logistic expected
// score between them is the predicted probability of a correct answer.
//
// Pure arithmetic only. Persistence lives in user-data-sync (ability) and
// question-difficulty.generated.js (difficulty); selection lives in
// adaptive-select.js. Nothing here reads the DOM, the network or the clock.

export const DEFAULT_RATING = 1500;

// Below this many recorded attempts a question's observed correct rate is too
// thin to trust; its rating falls through to the neutral default. The regen
// script writes nothing below this count (scripts/regen-question-difficulty.mjs).
export const DIFFICULTY_MIN_ATTEMPTS = 20;

// Ability is clamped so a hot streak or a disaster session cannot fling a
// student into a region where no question in the bank can challenge or serve
// them. The band also bounds how far one session can move anyone.
export const ABILITY_MIN = 800;
export const ABILITY_MAX = 2200;

// Standard Elo K for a session's worth of answers. Applied once per session to
// the summed surprise, not per question — a 20-question session should move
// ability about as much as one decisive game, not twenty.
export const ABILITY_K = 32;

export function expectedScore(own, opponent) {
  return 1 / (1 + 10 ** ((opponent - own) / 400));
}

// `actual` is 0 or 1. Returns the new rating as a float; callers that persist
// round, callers that chain updates do not.
export function updateElo(rating, expected, actual, k = ABILITY_K) {
  return rating + k * (actual - expected);
}

export function clampRating(rating) {
  return Math.min(ABILITY_MAX, Math.max(ABILITY_MIN, rating));
}

// Difficulty ladder. First hit wins:
// 1. Aggregated real attempts (question-difficulty.generated.js) once there
//    are enough of them to trust: the data decides.
// 2. The neutral default: an unknown question is a mid-scale question, never
//    a missing one (unknown is never filtered out).
// Only the question id is read, so the adaptive picker (full question) and the
// ability estimate (an id from the answer history) always agree. predictionTier
// is deliberately NOT a rung: it says how likely a question is to sit on the
// current paper, which is a different axis from how hard it is
// (docs/QUESTION-STANDARD.md D6). A curator difficulty would need its own field.
export function questionDifficulty(question, difficultyData) {
  return hasMeasuredDifficulty(question, difficultyData)
    ? difficultyData[String(question.id)].rating
    : DEFAULT_RATING;
}

// Whether a question has a measured rating the ladder trusts (rung 1). Lets a
// screen say honestly how much of a pool adaptive practice can actually place.
export function hasMeasuredDifficulty(question, difficultyData) {
  const entry = difficultyData?.[String(question?.id)];
  return !!entry && Number.isFinite(entry.rating) && Number.isFinite(entry.n) && entry.n >= DIFFICULTY_MIN_ATTEMPTS;
}
