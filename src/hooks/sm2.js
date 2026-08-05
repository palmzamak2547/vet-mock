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

// Hard is not a failure. The original code branched at `quality < 2`, which
// put Hard on the same path as Again: repetitions reset to 0, interval back to
// 1 day, lapses incremented. That punished a student who struggled and got it
// right exactly as hard as one who drew a blank — and it contradicted the very
// next line, where the SM-2 quality map scores Hard as 3, a PASS.
//
// Hard now keeps its repetition streak and grows the interval slowly (×1.2).
// The difficulty signal still lands: the ease-factor formula below drops the
// ease on a Hard, so every future interval off this card is shorter.
const HARD_GROWTH = 1.2;

/** The schedule a grade would produce, without committing it. Exported so the
 *  grade buttons can label themselves from the real arithmetic — a button that
 *  computes its own "2 วัน" will eventually advertise timing the scheduler does
 *  not produce, and nobody finds out. */
export function previewInterval(card, quality) {
  if (quality === 0) return 1;
  if (quality === 1) return Math.max(1, Math.round((card.interval || 1) * HARD_GROWTH));
  if (card.repetitions === 0) return 1;
  if (card.repetitions === 1) return 6;
  return Math.round((card.interval || 1) * card.easeFactor);
}

export function updateCard(card, quality) {
  const c = { ...card };
  c.totalReviews++;
  c.lastReview = Date.now();

  if (quality === 0) {
    // Forgot completely - reset the streak
    c.repetitions = 0;
    c.interval = 1;
    c.lapses++;
  } else if (quality === 1) {
    // Struggled but recalled - keep the streak, grow slowly
    c.interval = Math.max(1, Math.round((c.interval || 1) * HARD_GROWTH));
    c.repetitions++;
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
  // `autoPromoted` cards are the exception to the never-reviewed rule above.
  // They exist because the student already got that question wrong twice in a
  // real session, so they are not "unseen" in any meaningful sense — the app
  // flagged them itself. Excluding them meant the one card the app was most
  // confident about was the one it never mentioned: getDueCards served it, but
  // every count that would have told the student to open the session read 0.
  const isDue = (c) => c.nextReview <= now && (c.totalReviews > 0 || c.autoPromoted);
  return {
    total: values.length,
    due: values.filter(isDue).length,
    dueTomorrow: values.filter((c) => c.nextReview > now && c.nextReview <= tomorrow && (c.totalReviews > 0 || c.autoPromoted)).length,
    // An auto-promoted card is not new: the student has already met that
    // question and missed it twice. Counting it in both buckets would make
    // due + new exceed the cards that actually exist.
    new: values.filter((c) => c.totalReviews === 0 && !c.autoPromoted).length,
    mastered: values.filter((c) => c.repetitions >= 5 && c.interval >= 21).length,
  };
}
