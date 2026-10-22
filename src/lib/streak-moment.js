// ============================================================
// What a finished set did to the streak, for the results page
// ============================================================
// App.jsx's finishExam runs updateStreak (hooks/utils.js) on the saved record
// and stashes the before and after here, keyed by the set's completion time;
// ResultsView reads it for that set only, so a browser Back from the answers
// shows the same card without replaying it. Same-day sets change nothing and
// show nothing. Pure apart from the one-slot stash.
// ============================================================

// Days worth a word on the results page: the first weeks, then months.
const MILESTONES = [3, 7, 14, 30, 50, 100, 150, 200, 365];
export const isStreakMilestone = (days) => MILESTONES.includes(days) || (days > 365 && days % 100 === 0);

/**
 * kind:
 *   'started'    no streak before: today is day 1
 *   'extended'   practised the day before too: one more day
 *   'kept'       one day skipped, covered by the one-time pause day
 *   'restarted'  a longer gap ended the old run: today is day 1 again
 * The same day as the last practice, or nothing saved: null.
 */
export function streakMoment(before, after) {
  if (!after || !Number.isFinite(after.streak) || after.streak < 1) return null;
  if (before?.lastDate && after.lastDate === before.lastDate) return null;
  const prior = before?.lastDate ? Number(before.streak) || 0 : 0;
  const days = after.streak;
  if (after.freezeJustUsed) return { kind: 'kept', days, milestone: isStreakMilestone(days) };
  if (!prior) return { kind: 'started', days, milestone: false };
  if (days === prior + 1) return { kind: 'extended', days, milestone: isStreakMilestone(days) };
  return { kind: 'restarted', days, milestone: false };
}

let stash = null;
/** finishExam: what this set did, for the results page of this set. */
export function stashStreakMoment(moment, completedAt) {
  stash = moment ? { ...moment, completedAt, seen: false } : null;
}
/** ResultsView, in render: the moment for this set (read only). */
export function readStreakMoment(completedAt) {
  return stash && stash.completedAt === completedAt ? { ...stash } : null;
}
/** ResultsView, after the first paint: the card has had its entrance. */
export function markStreakMomentSeen(completedAt) {
  if (stash && stash.completedAt === completedAt) stash.seen = true;
}
