// ============================================================
// move-gate — does this boot have move work, without loading it?
// ============================================================
// origin-move.js (with move-base.js) finishes a move from vetmock.vercel.app.
// Almost every boot has nothing for it to do, so main.jsx loads it only when
// a job in MOVE_JOBS is due: 'now' when the inbox waits in localStorage (its
// merge must be written before anything reads user data, so the app starts
// after it, or after MOVE_WAIT_MS at most), 'later' when only after-load work
// is due (the IndexedDB import, the notice, the old address's note).
//
// MOVE_JOBS is the one list of the module's start-up jobs: origin-move.js runs
// a job only when this table says it is due, so a job added there without a
// line here never runs, instead of running on boots the gate never loads it on.
//
// A job that keeps failing (storage too full for the merge, an IndexedDB that
// refuses the import) is tried MAX_ATTEMPTS times, then left: the moved data
// stays where it is (the inbox in localStorage, the records in IndexedDB, and
// the old address's own copy) and boots stop fetching and waiting for it.
// Only a run counts: a boot that timed out or was reloaded before the code ran
// never ends a move. After the merge's last try the app says so once, with
// the way back (origin-move.js moveGiveUpNotice). A new inbox written by
// api/move-in.js clears the count, so a retried move gets its own tries.
// ============================================================

export const MOVE_INBOX = 'vmx-move-inbox';
export const MOVE_INBOX_ATTEMPTS = 'vmx-move-inbox-attempts';
export const MOVE_RECEIVED = 'vmx-move-received';
export const NOTICE_MS = 10 * 60 * 1000;
export const MAX_ATTEMPTS = 3;
export const MOVE_WAIT_MS = 4000;

const plain = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

function context(win, now) {
  let storage = null;
  try { storage = win.localStorage; } catch { /* no storage: no job is due */ }
  const read = (key) => { try { return storage?.getItem(key) ?? null; } catch { return null; } };
  let received = null;
  try { received = JSON.parse(read(MOVE_RECEIVED)); } catch { /* unreadable: the module skips it too */ }
  return { win, now, read, received: plain(received) ? received : null };
}

const attempts = (value) => (Number.isSafeInteger(value) && value > 0 ? value : 0);

/** The module's start-up jobs, each with when it must run and whether it is due on this boot. */
export const MOVE_JOBS = Object.freeze([
  { id: 'inbox', when: 'now',
    due: (c) => Boolean(c.read(MOVE_INBOX)) && attempts(Number(c.read(MOVE_INBOX_ATTEMPTS))) < MAX_ATTEMPTS,
    // Runs the merge and keeps its count. Only a merge that ran counts: a boot that timed out or was
    // reloaded while the code loaded never got here. The count is written just before the merge (a
    // merge that throws counts too) and cleared when it goes through. gaveUp: that was the last try.
    run(win, merge) {
      const s = win.localStorage;
      let tried = 0;
      try { tried = attempts(Number(s.getItem(MOVE_INBOX_ATTEMPTS))) + 1; s.setItem(MOVE_INBOX_ATTEMPTS, String(tried)); } catch { /* no room to count */ }
      let applied = false;
      try { applied = merge(s)?.applied === true; } catch { /* counted above */ }
      if (applied) { try { s.removeItem(MOVE_INBOX_ATTEMPTS); } catch { /* the inbox is gone, so is the job */ } }
      return { applied, gaveUp: !applied && tried >= MAX_ATTEMPTS };
    } },
  { id: 'records', when: 'later',
    due: (c) => Boolean(c.received) && !c.received.idbDone && attempts(c.received.attempts) < MAX_ATTEMPTS },
  { id: 'notice', when: 'later',
    due: (c) => Boolean(c.received) && !c.received.shown && Number.isFinite(c.received.at)
      && c.now - c.received.at >= 0 && c.now - c.received.at < NOTICE_MS },
  { id: 'note', when: 'later',
    due: (c) => typeof c.win.__vmxMoveNote === 'string' && c.win.__vmxMoveNote.length > 0 },
]);

/** The ids of the jobs due on this boot. */
export function dueMoveJobs(win, now = Date.now()) {
  let c;
  try { c = context(win, now); } catch { return new Set(); }
  return new Set(MOVE_JOBS.filter((job) => { try { return job.due(c); } catch { return false; } }).map((job) => job.id));
}

/** 'now', 'later' or null: what main.jsx does with origin-move.js on this boot. */
export function moveWork(win, now = Date.now(), due = dueMoveJobs(win, now)) {
  if (MOVE_JOBS.some((job) => job.when === 'now' && due.has(job.id))) return 'now';
  return due.size ? 'later' : null;
}

/**
 * Starts the app once every promise in `waits` settles, or after `ms` at most: a chunk that stalls
 * (a hanging connection) must not leave the student on an empty page. `onLate` runs only when the
 * time ran out first.
 */
export function startWhenReady(waits, start, { ms = MOVE_WAIT_MS, onLate = () => {}, timer = setTimeout } = {}) {
  let started = false;
  const go = (late) => {
    if (started) return;
    started = true;
    if (late) { try { onLate(); } catch { /* starting matters more */ } }
    start();
  };
  if (!waits.length) { go(false); return; }
  timer(() => go(true), ms);
  Promise.all(waits).then(() => go(false), () => go(false));
}
