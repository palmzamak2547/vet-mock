// The written grader's answer, checked on the server before a student sees it.
//
// The model is asked for a fixed JSON shape (api/grade-summary.js), but what it
// returns is only a proposal: a score above its category's maximum, a total
// that is not the sum of its parts, or a category it made up would otherwise
// reach the screen as it came. Here every score is an integer clamped to the
// rubric's own maximum, the maximum comes from the rubric (never the model),
// the word-count penalty is counted from the answer, and the total is
// recomputed. A grading with a category missing or not a number cannot be
// repaired and is refused.

export const GRADE_RUBRIC = Object.freeze({
  essay: Object.freeze({ content: 7, grammar: 5, paraphrase: 3 }),
  short: Object.freeze({ answer: 2 }),
});

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v) => (Array.isArray(v) ? v.map((s) => text(s, 500)).filter(Boolean).slice(0, 8) : []);

export function countWords(answer) {
  const t = String(answer || '').trim();
  return t ? t.split(/\s+/).length : 0;
}

export function wordPenalty(words, { softMax, hardMax }) {
  if (words > hardMax) return 2;
  if (words > softMax) return 1;
  return 0;
}

/**
 * @returns {{ ok: true, grading: object } | { ok: false, reason: string }}
 */
export function normalizeGrading(raw, type, { wordCount = 0, softMax = 180, hardMax = 200 } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, reason: 'not_object' };
  const rubric = GRADE_RUBRIC[type === 'essay' ? 'essay' : 'short'];
  const given = raw.scores && typeof raw.scores === 'object' && !Array.isArray(raw.scores) ? raw.scores : null;
  if (!given) return { ok: false, reason: 'no_scores' };

  const scores = {};
  let sum = 0;
  let max = 0;
  for (const [name, total] of Object.entries(rubric)) {
    const entry = given[name];
    const earned = typeof entry?.earned === 'string' && entry.earned.trim() !== '' ? Number(entry.earned) : entry?.earned;
    if (typeof earned !== 'number' || !Number.isFinite(earned)) return { ok: false, reason: `score_${name}` };
    const clamped = Math.min(total, Math.max(0, Math.round(earned)));
    scores[name] = { earned: clamped, total, justification: text(entry.justification, 600) };
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
  grading.totalScore = Math.min(max, Math.max(0, sum - penalty));
  grading.maxScore = max;
  return { ok: true, grading };
}
