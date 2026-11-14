// The written grader's answer, checked on the server before a student sees it.
//
// The model is asked for a fixed JSON shape (api/grade-summary.js), but what it
// returns is only a proposal: a score above its category's maximum, a total
// that is not the sum of its parts, or a category it made up would otherwise
// reach the screen as it came. Here:
// - each category's maximum comes from the rubric: the essay's 7/5/3, and for a
//   short answer the points the question itself states ("(10 คะแนน)"), else 2;
// - a grader that scored a category out of another positive total is scaled to
//   the rubric's, not capped (6 of 10 on a 10-point item stays 6/10, and 6 of
//   10 on a 2-point item is 1/2);
// - a score is clamped to its maximum and cut to the half point below, never
//   rounded up (1.5 of 2 reads 1.5/2, not 2/2);
// - a category is matched by name ignoring case, spaces, "-" and "_";
// - the essay word penalty is counted from the answer and the total recomputed.
// A grading with a category missing or not a number cannot be repaired and is
// refused.

export const GRADE_RUBRIC = Object.freeze({
  essay: Object.freeze({ content: 7, grammar: 5, paraphrase: 3 }),
  short: Object.freeze({ answer: 2 }),
});

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v) => (Array.isArray(v) ? v.map((s) => text(s, 500)).filter(Boolean).slice(0, 8) : []);
const keyOf = (name) => String(name).toLowerCase().replace(/[\s_-]+/g, '');
const halfDown = (x) => Math.floor(x * 2 + 1e-9) / 2;
const num = (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v);

/**
 * The points a question states for itself, e.g. "(10 คะแนน)" or "(5 points)";
 * the largest such statement (a part restated keeps its own number), or null.
 */
export function statedPoints(question) {
  const found = [...String(question || '').matchAll(/\(\s*(\d{1,3}(?:\.\d)?)\s*(?:คะแนน|points?|pts?|marks?)\s*\)/gi)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 100);
  return found.length ? Math.max(...found) : null;
}

export function countWords(answer) {
  const t = String(answer || '').trim();
  return t ? t.split(/\s+/).length : 0;
}

export function wordPenalty(words, { softMax, hardMax }) {
  if (words > hardMax) return 2;
  if (words > softMax) return 1;
  return 0;
}

export function rubricFor(type, maxPoints = null) {
  if (type === 'essay') return GRADE_RUBRIC.essay;
  return Number.isFinite(maxPoints) && maxPoints > 0 ? { answer: maxPoints } : GRADE_RUBRIC.short;
}

/**
 * @returns {{ ok: true, grading: object } | { ok: false, reason: string }}
 */
export function normalizeGrading(raw, type, { wordCount = 0, softMax = 180, hardMax = 200, maxPoints = null } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, reason: 'not_object' };
  const rubric = rubricFor(type === 'essay' ? 'essay' : 'short', maxPoints);
  const given = raw.scores && typeof raw.scores === 'object' && !Array.isArray(raw.scores) ? raw.scores : null;
  if (!given) return { ok: false, reason: 'no_scores' };
  const byKey = new Map();
  for (const [name, entry] of Object.entries(given)) if (!byKey.has(keyOf(name))) byKey.set(keyOf(name), entry);

  const scores = {};
  let sum = 0;
  let max = 0;
  for (const [name, total] of Object.entries(rubric)) {
    const entry = byKey.get(keyOf(name));
    const earned = num(entry?.earned);
    if (typeof earned !== 'number' || !Number.isFinite(earned)) return { ok: false, reason: `score_${name}` };
    const graderTotal = num(entry?.total);
    const scaled = typeof graderTotal === 'number' && Number.isFinite(graderTotal) && graderTotal > 0 && graderTotal !== total
      ? (earned * total) / graderTotal
      : earned;
    const clamped = halfDown(Math.min(total, Math.max(0, scaled)));
    scores[name] = { earned: clamped, total, justification: text(entry?.justification, 600) };
    sum += clamped;
    max += total;
  }

  const grading = {
    scores,
    totalScore: 0,
    overallFeedback: text(raw.overallFeedback, 2000),
    improvements: list(raw.improvements),
    strengthsSpotted: list(raw.strengthsSpotted),
  };
  let penalty = 0;
  if (type === 'essay') {
    penalty = wordPenalty(wordCount, { softMax, hardMax });
    grading.wordCount = wordCount;
    grading.wordCountPenalty = { applied: penalty, reason: `${wordCount} words` };
  }
  grading.totalScore = halfDown(Math.min(max, Math.max(0, sum - penalty)));
  grading.maxScore = max;
  return { ok: true, grading };
}
