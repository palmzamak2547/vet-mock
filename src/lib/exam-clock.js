// A browser may throttle or suspend callbacks while a tab is in the background.
// Remaining time must depend on the deadline, not the number of callbacks.
//
// Which clock: the device's wall clock alone let a student stretch a timed
// paper by setting the phone's time back (an hour back was an hour more).
// The page's monotonic clock (performance.now) cannot be set, but on some
// phones it stands still while the device sleeps, and a paper must keep
// running through a locked screen. So the exam's time is an anchor plus the
// monotonic clock, and the anchor moves only forward, only when the wall
// clock leads it: a sleep counts (the wall clock leads by the time asleep),
// a clock set back adds nothing (the anchor stays), a clock set back and then
// corrected costs nothing either (the wall clock only catches up), and the
// time never runs backwards. A clock set forward counts: it cannot be told
// apart from a sleep. A time zone change moves neither clock. One cost: a
// clock set back and then a sleep on a phone whose monotonic clock stops is
// given that sleep back, as the wall clock does not lead until it has made
// up what was set back. Across a reload a parked set keeps what it had left
// when it was saved (app-flow.js resumedDeadline), so the page's own clock
// only has to hold while it lives.
let base = null;
let examTime = null;

const mono = () => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : null);

/** The exam's own "now", in wall-clock milliseconds as the page first read them. */
export function examNow(wall = Date.now(), monoNow = mono()) {
  if (monoNow === null) {
    examTime = examTime === null ? wall : Math.max(examTime, wall);
    return examTime;
  }
  if (base === null || wall - monoNow > base) base = wall - monoNow;
  examTime = examTime === null ? base + monoNow : Math.max(examTime, base + monoNow);
  return examTime;
}

/** A deadline in exam time as the wall clock reads it now, for a saved record. */
export function deadlineOnWall(deadline, wall = Date.now()) {
  if (!Number.isFinite(deadline)) return deadline;
  return deadline - (examNow(wall) - wall);
}

/** For tests: forget what the page has read. */
export function resetExamClock() { base = null; examTime = null; }

export function secondsUntilDeadline(deadline, now = examNow()) {
  if (!Number.isFinite(deadline) || deadline <= 0) return 0;
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
