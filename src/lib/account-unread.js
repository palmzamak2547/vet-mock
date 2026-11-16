// A signed-in student's study data is known only once the account has been
// read on this device. Until then a failed read (the database answering 500,
// or no connection) leaves only what the device held, which on a new device
// is nothing: a screen that read that as "you have not studied yet" would be
// telling the student something false. Home and the progress screen ask this
// before they show a first-run or empty state, and say the account could not
// be read instead (AGENTS.md, silent failures).
//
// `sync` is the shape the sync store publishes (src/lib/user-data-atomic.js):
// `lastSyncedAt` stays null until this device has once read the account.
export function isAccountUnread(signedIn, sync) {
  if (!signedIn || !sync) return false;
  if (sync.lastSyncedAt) return false;
  if (sync.recovery) return false;
  return sync.phase === 'error' || sync.phase === 'offline';
}
