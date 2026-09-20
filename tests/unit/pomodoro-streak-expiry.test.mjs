// ============================================================
// pomodoro-streak-expiry.test.mjs — a streak must expire while you are away
// ============================================================
// The streak was computed when a session was recorded and stored as a
// number; loadHistory handed that number back unchanged and the view showed
// it. Time passing was never accounted for on a read, so three days after
// the last session the Pomodoro page still said Streak 3 วัน (audit MT-04).
// The streak is now derived from the session dates on every read. The
// history itself is never rewritten by a read.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (key) => mockStorage.get(key) ?? null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};
globalThis.window = { dispatchEvent: () => true };

const { loadHistory, recordSession } = await import('../../src/lib/pomodoro.js');

const DAY = 24 * 60 * 60 * 1000;

/** Run `fn` with Date.now() pinned to a controllable clock. */
function withClock(startIso, fn) {
  const original = Date.now;
  let now = new Date(startIso).getTime();
  Date.now = () => now;
  try {
    return fn({ advance: (ms) => { now += ms; }, set: (iso) => { now = new Date(iso).getTime(); } });
  } finally {
    Date.now = original;
  }
}

test('three days in a row read as a streak of 3, still 3 the next day before a session, then 0', () => {
  localStorage.clear();
  withClock('2026-09-10T12:00:00+07:00', (clock) => {
    recordSession({ durationMin: 25, completed: true });
    clock.advance(DAY);
    recordSession({ durationMin: 25, completed: true });
    clock.advance(DAY);
    recordSession({ durationMin: 25, completed: true });
    assert.equal(loadHistory().currentStreak, 3, 'the streak right after the third consecutive day');
    clock.advance(DAY);
    assert.equal(loadHistory().currentStreak, 3, 'the day after, before any session, is not yet a broken streak');
    clock.advance(DAY);
    assert.equal(loadHistory().currentStreak, 0, 'a missed day must expire the streak on read, without a new session');
    const history = loadHistory();
    assert.equal(history.sessions.length, 3, 'reading must not rewrite the history');
    assert.equal(history.totalMin, 75);
  });
});

test('the stored number cannot outlive the sessions it was computed from', () => {
  localStorage.clear();
  const longAgo = new Date('2026-08-01T09:00:00+07:00').getTime();
  localStorage.setItem('vmx-pomodoro', JSON.stringify({
    sessions: [{ date: longAgo, durationMin: 25, completed: true }],
    totalMin: 25,
    currentStreak: 12,
  }));
  withClock('2026-09-20T12:00:00+07:00', () => {
    assert.equal(loadHistory().currentStreak, 0, 'a stored streak from weeks ago was reported as current');
  });
});

test('a session after a gap starts over at 1, and an abandoned session does not extend a streak', () => {
  localStorage.clear();
  withClock('2026-09-10T12:00:00+07:00', (clock) => {
    recordSession({ durationMin: 25, completed: true });
    clock.advance(DAY);
    recordSession({ durationMin: 25, completed: true });
    assert.equal(loadHistory().currentStreak, 2);
    clock.advance(3 * DAY);
    recordSession({ durationMin: 25, completed: true });
    assert.equal(loadHistory().currentStreak, 1, 'a new session after a gap must not resume the old streak');
    clock.advance(DAY);
    recordSession({ durationMin: 25, completed: false });
    assert.equal(loadHistory().currentStreak, 1, 'an abandoned session is not a study day');
    clock.advance(DAY);
    assert.equal(loadHistory().currentStreak, 0, 'the abandoned day does not bridge the gap');
  });
});

test('local midnight is the boundary: a late session and an early one on the next day are consecutive', () => {
  localStorage.clear();
  withClock('2026-09-10T23:50:00+07:00', (clock) => {
    recordSession({ durationMin: 25, completed: true });
    clock.set('2026-09-11T00:10:00+07:00');
    recordSession({ durationMin: 25, completed: true });
    assert.equal(loadHistory().currentStreak, 2);
    clock.set('2026-09-12T23:59:00+07:00');
    assert.equal(loadHistory().currentStreak, 2, 'the whole of the next day counts as "yesterday was a study day"');
    clock.set('2026-09-13T00:01:00+07:00');
    assert.equal(loadHistory().currentStreak, 0);
  });
});

test('a streak across a DST change is walked by calendar day, not by 24 hours', (t) => {
  const previousTz = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    const honoured = new Date('2026-03-07T12:00:00Z').getTimezoneOffset() === 300
      && new Date('2026-03-08T12:00:00Z').getTimezoneOffset() === 240;
    if (!honoured) { t.skip('this runtime does not switch TZ at runtime; the Bangkok cases above still run'); return; }
    localStorage.clear();
    withClock('2026-03-07T12:00:00-05:00', (clock) => {
      recordSession({ durationMin: 25, completed: true }); // Saturday, EST
      clock.set('2026-03-08T12:00:00-04:00');               // Sunday, clocks sprang forward at 02:00
      recordSession({ durationMin: 25, completed: true });
      clock.set('2026-03-09T12:00:00-04:00');
      recordSession({ durationMin: 25, completed: true });
      assert.equal(loadHistory().currentStreak, 3, 'stepping back 24 h from a post-DST midnight lands at 23:00 two days back and breaks the streak');
    });
  } finally {
    if (previousTz === undefined) delete process.env.TZ; else process.env.TZ = previousTz;
  }
});
