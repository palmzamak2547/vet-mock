// ============================================================
// move-gate — does this boot have move work, without loading it?
// ============================================================
// origin-move.js (with move-base.js) finishes a move from vetmock.vercel.app.
// Almost every boot has nothing for it to do, so main.jsx loads it only when
// this says so: 'now' when the inbox waits in localStorage (its merge must be
// written before anything reads user data, so the app starts after it),
// 'later' when only its after-load work is due (the IndexedDB import, the
// notice, the old address's note), null when there is none.
//
// Each test mirrors an early return in origin-move.js: applyMoveInbox (no
// inbox), importMovedRecords (no record or idbDone) and moveNotice (shown,
// or older than its ten minutes), showOldAddressNote (no note).
// tests/unit/move-gate.test.mjs holds the two to the same answers.
// ============================================================

export const MOVE_INBOX = 'vmx-move-inbox';
export const MOVE_RECEIVED = 'vmx-move-received';
export const NOTICE_MS = 10 * 60 * 1000;

export function moveWork(win, now = Date.now()) {
  let storage;
  try { storage = win.localStorage; } catch { return null; }
  const read = (key) => { try { return storage?.getItem(key) ?? null; } catch { return null; } };
  if (read(MOVE_INBOX)) return 'now';
  if (typeof win.__vmxMoveNote === 'string' && win.__vmxMoveNote) return 'later';
  let received;
  try { received = JSON.parse(read(MOVE_RECEIVED)); } catch { return null; }
  if (!received || typeof received !== 'object' || Array.isArray(received)) return null;
  if (!received.idbDone) return 'later';
  const age = now - received.at;
  if (!received.shown && Number.isFinite(received.at) && age >= 0 && age < NOTICE_MS) return 'later';
  return null;
}
