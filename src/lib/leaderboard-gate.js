// ============================================================
// leaderboard-gate.js — minimum-run-size rules for the boards
// ============================================================
// LAUNCH_READINESS (2026-08) flagged: a 1-question run can score
// 100% and top the public leaderboard. Product decision 2026-09-03:
// gate on questions-per-run, not on run count — a tiny lucky set is
// not a ranking signal no matter how many times it is repeated.
// Both the global RPC and every client read path apply the same
// constant, so the board cannot disagree with itself.

/** Runs with fewer questions than this never enter the leaderboard. */
export const LEADERBOARD_MIN_QUESTIONS = 5;

/** True when a single exam_results row is big enough to rank. */
export function qualifiesForLeaderboard(row) {
  return Number(row?.total) >= LEADERBOARD_MIN_QUESTIONS;
}

/**
 * Collapse raw exam_results rows (1 per attempt) into one row per
 * user — the BEST qualifying attempt — plus an `attempts` count for
 * the "× N" badge. Users whose every run is below `minQuestions`
 * drop off the board entirely. Attempts count qualifying runs only,
 * so the badge never advertises runs the board refused to consider.
 *
 * Sort matches the SQL on purpose (pct → correct → recency); keep the
 * three in lockstep or the client re-sort visibly disagrees with the
 * payload order.
 */
export function aggregateLeaderboard(rows, opts = {}) {
  const minQuestions = Number.isFinite(opts.minQuestions)
    ? opts.minQuestions
    : LEADERBOARD_MIN_QUESTIONS;
  const byUser = new Map();
  for (const r of rows || []) {
    if (!r?.user_id) continue;
    if (Number(r.total) < minQuestions) continue;
    const prev = byUser.get(r.user_id);
    if (!prev) {
      byUser.set(r.user_id, { ...r, attempts: 1 });
      continue;
    }
    // Keep the higher pct; tie-break on correct count; tie-break on
    // most recent. Also count attempts for a "5×" badge in the row.
    const keepNew =
      r.pct > prev.pct ||
      (r.pct === prev.pct && r.correct > prev.correct) ||
      (r.pct === prev.pct && r.correct === prev.correct
        && new Date(r.created_at) > new Date(prev.created_at));
    const attempts = prev.attempts + 1;
    byUser.set(r.user_id, keepNew ? { ...r, attempts } : { ...prev, attempts });
  }
  return Array.from(byUser.values()).sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.correct !== a.correct) return b.correct - a.correct;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}
