// SM-2 (SuperMemo 2) Spaced Repetition Algorithm
// Based on https://en.wikipedia.org/wiki/SuperMemo

// Quality ratings (user feedback after answering):
// 0 = Again (forgot completely)
// 1 = Hard (struggled, barely remembered)
// 2 = Good (correct with some effort)
// 3 = Easy (perfect recall, no effort)

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function initCard(questionId) {
  return {
    questionId,
    easeFactor: 2.5,      // difficulty multiplier (1.3 min)
    interval: 0,          // days until next review
    repetitions: 0,       // consecutive correct answers
    nextReview: Date.now(), // timestamp
    lastReview: null,
    totalReviews: 0,
    lapses: 0,            // times forgotten
  };
}

export function updateCard(card, quality) {
  const c = { ...card };
  c.totalReviews++;
  c.lastReview = Date.now();

  if (quality < 2) {
    // Failed - reset repetitions
    c.repetitions = 0;
    c.interval = 1;
    c.lapses++;
  } else {
    // Passed - increase interval
    if (c.repetitions === 0) c.interval = 1;
    else if (c.repetitions === 1) c.interval = 6;
    else c.interval = Math.round(c.interval * c.easeFactor);
    c.repetitions++;
  }

  // Update ease factor (SM-2 formula)
  const q = quality === 0 ? 0 : quality === 1 ? 3 : quality === 2 ? 4 : 5;
  c.easeFactor = Math.max(1.3, c.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  c.nextReview = Date.now() + c.interval * MS_PER_DAY;
  return c;
}

// Get cards that are due for review (sorted by urgency).
// Pass limit=0 (or null) for no cap.
export function getDueCards(cards, limit = 0) {
  const now = Date.now();
  const due = Object.values(cards)
    .filter((c) => c.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
  return limit && limit > 0 ? due.slice(0, limit) : due;
}

// Get cards due count breakdown.
//
// "due" is intentionally restricted to cards the user has actually
// reviewed at least once (totalReviews > 0). Unseen cards have
// nextReview = Date.now() by default (see initCard), which would
// otherwise inflate "due" by the entire question bank for a fresh
// user (~1800 "due" cards on first visit — friend's review 2026-05-12
// + Palm's friend's review 2026-05-13). Truly new cards go into the
// `new` bucket; the home/coach surfaces choose what to surface.
export function getCardStats(cards) {
  const now = Date.now();
  const tomorrow = now + MS_PER_DAY;
  const values = Object.values(cards);
  return {
    total: values.length,
    due: values.filter((c) => c.nextReview <= now && c.totalReviews > 0).length,
    dueTomorrow: values.filter((c) => c.nextReview > now && c.nextReview <= tomorrow && c.totalReviews > 0).length,
    new: values.filter((c) => c.totalReviews === 0).length,
    mastered: values.filter((c) => c.repetitions >= 5 && c.interval >= 21).length,
  };
}
