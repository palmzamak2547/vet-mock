// Auto-promote wrong answers to SR queue. Pure helper — does NOT touch
// localStorage. Caller passes current `history` array + `srCards` map
// and gets back a list of `{ questionId, subject, wrongCount }` ready
// for `setSrCards(prev => ({ ...prev, [id]: lowEaseCard(id) }))`.
//
// Threshold = 2 wrong by default. Cards are only injected if the user
// does not already have a "review-pending" entry (nextReview > now).
// This avoids resurfacing a question they've already scheduled.
//
// Compound-id contract: history rows store `{ questionId, subject }`.
// SR cards are keyed by raw questionId because that matches how
// SRSessionView + DashboardView address them. If two subjects ever
// share an id, we still use a single SR card per id — that's the
// existing convention in `vmx-sr-cards`.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const DEFAULT_EASE = 1.5;
const DEFAULT_THRESHOLD = 2;

/**
 * Find Qs the user has answered wrong ≥ threshold times, that don't
 * already have a pending SR card. Returns objects describing the
 * promotion — caller is responsible for actually mutating srCards.
 *
 * @param {Object} args
 * @param {Array<{questionId: string|number, subject?: string, correct: boolean}>} args.history
 * @param {Record<string|number, { questionId: string|number, nextReview?: number, totalReviews?: number }>} args.srCards
 * @param {number} [args.threshold=2]
 * @returns {Array<{ questionId: string|number, subject?: string, wrongCount: number }>}
 */
export function findAutoPromoteCandidates({ history, srCards, threshold = DEFAULT_THRESHOLD }) {
  if (!Array.isArray(history) || history.length === 0) return [];
  const cards = srCards || {};
  const now = Date.now();

  // Count wrong by questionId. We don't aggregate by (subject:id) because
  // SR card keys are already raw ids.
  const wrongCounts = new Map();
  const subjectFor = new Map();
  for (const entry of history) {
    if (!entry || entry.correct) continue;
    const id = entry.questionId;
    if (id == null) continue;
    wrongCounts.set(id, (wrongCounts.get(id) || 0) + 1);
    if (entry.subject && !subjectFor.has(id)) subjectFor.set(id, entry.subject);
  }

  const out = [];
  for (const [id, count] of wrongCounts.entries()) {
    if (count < threshold) continue;
    const existing = cards[id];
    if (existing) {
      // Skip if there's a fresh, future-scheduled review still pending
      const totalReviews = Number(existing.totalReviews) || 0;
      const nextReview = Number(existing.nextReview) || 0;
      if (totalReviews > 0 && nextReview > now) continue;
      // Also skip if the card was already injected by this helper today
      if (existing.autoPromoted && nextReview > now) continue;
    }
    out.push({ questionId: id, subject: subjectFor.get(id), wrongCount: count });
  }
  return out;
}

/**
 * Build a low-ease SR card ready to drop into srCards. ease=1.5 so the
 * card resurfaces in 1 day and stays "hot" until the user repeatedly
 * grades it Easy. Matches the shape `initCard` in `hooks/sm2.js`
 * returns, with a marker (`autoPromoted: true`) for diagnostics.
 *
 * @param {string|number} questionId
 * @param {{ ease?: number }} [opts]
 */
export function makeLowEaseCard(questionId, opts = {}) {
  const ease = opts.ease ?? DEFAULT_EASE;
  return {
    questionId,
    easeFactor: ease,
    interval: 1,
    repetitions: 0,
    nextReview: Date.now() + MS_PER_DAY,
    lastReview: null,
    totalReviews: 0,
    lapses: 0,
    autoPromoted: true,
  };
}

export const AUTO_PROMOTE_DEFAULTS = Object.freeze({
  threshold: DEFAULT_THRESHOLD,
  easeFactor: DEFAULT_EASE,
});
