// ============================================================
// group-membership — who may leave a study group
// ============================================================
// A group keeps at least one admin. A member, or one admin among several,
// may leave; the last admin may not, since the group would be left with
// nobody to look after it and an invite code nobody can withdraw (the one
// group on production in Nov 2026 was exactly that: no members, no admin).
// The last admin may delete the group instead. The database holds the same
// rule (migration 20261115120100_group_keeps_an_admin); this is what the page
// offers before asking it.
// ============================================================

/**
 * @param {Array<{ id: string, role?: string }>} members  the group's members, as getGroupMembers returns them
 * @param {string} userId  the signed-in student
 * @returns {{ canLeave: boolean, canDelete: boolean, lastAdmin: boolean } | null}
 *          null when the student is not in the list (nothing to offer)
 */
export function leaveRule(members, userId) {
  const list = Array.isArray(members) ? members : [];
  const me = list.find((m) => m?.id === userId);
  if (!me) return null;
  const admins = list.filter((m) => m?.role === 'admin').length;
  const lastAdmin = me.role === 'admin' && admins <= 1;
  return { canLeave: !lastAdmin, canDelete: lastAdmin, lastAdmin };
}

/** The refusal migration 20261115120100 raises when the last admin tries to leave. */
export const LAST_ADMIN_REFUSAL = 'Last admin cannot leave';
