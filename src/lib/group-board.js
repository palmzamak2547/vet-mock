// ============================================================
// group-board — the study-group ranking, built from the members' best runs
// ============================================================
// The group page ranked exam_results rows WHERE group_id = the group, but
// nothing has ever written exam_results.group_id: record_exam_receipt has no
// such column in its INSERT, and no exam flow carries a group. The tab the
// page opens on could therefore never show a score.
//
// The group's member list is readable to its members, and the global board
// (get_leaderboard_by_source, score_source 'server') already returns each
// student's best server-scored run with the same 5-question floor and the
// student's show_on_leaderboard choice applied. The group board is that board
// narrowed to the group's members: no database change, no second copy of the
// ranking rules. A member who hides from the leaderboard stays hidden here.
// ============================================================

/**
 * @param {Iterable<string>} memberIds  the group's user ids (group_members.user_id)
 * @param {Array<{ user_id: string, pct: number, correct: number }>} board
 *        getLeaderboard({ scoreSource: 'server' }) rows, one best run per user
 * @returns the board rows of this group's members, best first
 */
export function groupBoardRows(memberIds, board) {
  const ids = new Set([...(memberIds && typeof memberIds[Symbol.iterator] === 'function' ? memberIds : [])].filter(Boolean));
  if (!ids.size) return [];
  const best = new Map();
  for (const row of Array.isArray(board) ? board : []) {
    if (!row || !ids.has(row.user_id)) continue;
    const held = best.get(row.user_id);
    if (!held || (row.pct ?? 0) > (held.pct ?? 0)
      || ((row.pct ?? 0) === (held.pct ?? 0) && (row.correct ?? 0) > (held.correct ?? 0))) {
      best.set(row.user_id, row);
    }
  }
  return [...best.values()].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0) || (b.correct ?? 0) - (a.correct ?? 0));
}

// get_leaderboard_by_source caps its answer at 1000 rows.
export const GROUP_BOARD_SOURCE_LIMIT = 1000;
