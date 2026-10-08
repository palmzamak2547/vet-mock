// Elo-style ratings on one shared scale: a student's ability and a question's
// difficulty live on the same 1500-centred axis, so the logistic expected
// score between them is the predicted probability of a correct answer.
//
// Pure arithmetic only. Persistence lives in user-data-sync (ability) and
// question-difficulty.generated.js (difficulty); selection lives in
// adaptive-select.js. Nothing here reads the DOM, the network or the clock.

export const DEFAULT_RATING = 1500;

// Below this many recorded attempts a question's observed correct rate is too
// thin to trust; its rating falls through to cheaper signals (prediction tier).
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

// Difficulty fallback ladder. First hit wins, mirroring the exam-scope model:
// 1. Aggregated real attempts (question-difficulty.generated.js) once there
//    are enough of them to trust — the data decides.
// 2. The authored prediction tier — the curator's judgement, better than
//    nothing for the few hundred questions that carry one.
// 3. The neutral default — an unknown question is a mid-tier question, never
//    a missing one (unknown is never filtered out).
const TIER_RATINGS = { high: 1650, medium: 1500, low: 1400 };

export function questionDifficulty(question, difficultyData) {
  const entry = difficultyData?.[String(question?.id)];
  if (entry && Number.isFinite(entry.rating) && Number.isFinite(entry.n) && entry.n >= DIFFICULTY_MIN_ATTEMPTS) {
    return entry.rating;
  }
  return TIER_RATINGS[question?.predictionTier] ?? DEFAULT_RATING;
}
