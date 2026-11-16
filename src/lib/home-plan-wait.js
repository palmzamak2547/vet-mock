// When Home's day plan and welcome banner wait for the account (HomeView.jsx).
//
// The plan is built from the account's history and this year's questions. Until both are here it
// holds its place instead of drawing a first plan that changes, and grows, a second later. Three
// limits keep the wait from doing harm:
//   - `capped`: the 6 s cap has passed (a bank that cannot load offline, or an account read that
//     hangs, must not hold it for good);
//   - `shown`: a plan has already been drawn on this visit, and a drawn plan is never replaced by the
//     placeholder (a year switched while its bank loads, Home opened again while a bank loads);
//   - no history and no account to read: the plan is one first-question card whatever the bank holds.

/** Whether the plan shows its placeholder now. */
export function planWaiting({ capped = false, shown = false, pendingResume = false, accountReading = false, historyLength = 0, bankLoaded = true } = {}) {
  if (capped || shown || pendingResume) return false;
  return Boolean(accountReading || (historyLength > 0 && !bankLoaded));
}

/**
 * Whether the first-visit welcome shows. An account still being read is not a first visit yet (the
 * banner would show for a moment and then make way for the tour button), but only up to the same
 * 6 s cap as the plan: an account read that hangs must not hide the welcome for good.
 */
export function welcomeShown({ historyLength = 0, accountUnread = false, accountReading = false, capped = false, dismissed = false, legacySeen = false } = {}) {
  if (historyLength > 0 || accountUnread || dismissed || legacySeen) return false;
  return !(accountReading && !capped);
}
