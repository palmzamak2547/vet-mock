// ============================================================
// seasonal-mochi.js — which Mochi belongs to this week
// ============================================================
// Pure date logic, kept out of the view so it can be tested and so the rule
// is written down in one place rather than implied by a chain of ternaries in
// JSX.
//
// The rule is deliberately conservative: it changes the picture, never the
// words, and it only fires on a fact the app already holds (the next exam on
// the schedule). A cheering Mochi shown to someone whose exam is next month
// is a small lie about where they are, so the default is the ordinary one and
// every window has to be earned.
// ============================================================

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * `daysLeft` is the app's own field on the next scheduled exam, so this
 * agrees with the countdown the student is already reading instead of
 * re-deriving it from dates and drifting by a day.
 *
 * @param {object} opts
 * @param {Date|number} opts.now
 * @param {number|null} opts.daysLeft   days until the next exam, or null
 * @param {string|Date|null} opts.lastExamDate  the last exam of the phase
 * @returns {string|null} a key of SEASONAL_MOCHI, or null for the usual Mochi
 */
export function seasonalMochiKey({ now = Date.now(), daysLeft = null, lastExamDate = null } = {}) {
  const t = now instanceof Date ? now.getTime() : now;
  if (!Number.isFinite(t)) return null;
  const today = new Date(t);

  // New year sits above the exam windows: it is a single fixed week and it
  // cannot be mistaken for a statement about someone's revision.
  const month = today.getMonth();
  const date = today.getDate();
  if ((month === 11 && date >= 28) || (month === 0 && date <= 3)) return 'new-year';

  if (Number.isFinite(daysLeft)) {
    if (daysLeft >= 0 && daysLeft <= 1) return 'exam-eve';
    if (daysLeft > 1 && daysLeft <= 7) return 'exam-week';
  }

  const last = lastExamDate ? new Date(lastExamDate).getTime() : NaN;
  if (Number.isFinite(last) && t > last) {
    const daysSince = Math.floor((t - last) / ONE_DAY);
    // The first three days after the last paper are the celebration; after
    // that the term is simply over and it is the holiday picture.
    if (daysSince <= 3) return 'exam-finished';
    if (!Number.isFinite(daysLeft)) return 'holiday';
  }

  return null;
}
