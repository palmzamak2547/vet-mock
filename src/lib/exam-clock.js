// A browser may throttle or suspend callbacks while a tab is in the background.
// Remaining time must depend on the deadline, not the number of callbacks.
export function secondsUntilDeadline(deadline, now = Date.now()) {
  if (!Number.isFinite(deadline) || deadline <= 0) return 0;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
