import test from 'node:test';
import assert from 'node:assert/strict';
import { streakMoment, isStreakMilestone, stashStreakMoment, readStreakMoment, markStreakMomentSeen } from '../../src/lib/streak-moment.js';
import { updateStreak } from '../../src/hooks/utils.js';

const DAY = 24 * 60 * 60 * 1000;
const midnight = (offsetDays) => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime() + offsetDays * DAY; };

// The moment is read off updateStreak's own output, so each case runs the
// real rule rather than a hand-made "after".
const run = (before) => streakMoment(before, updateStreak(before.lastDate, before.streak, before.freezeUsedAt));

test('the first set ever starts the count', () => {
  assert.deepEqual(run({ streak: 0, lastDate: null, freezeUsedAt: null }), { kind: 'started', days: 1, milestone: false });
});

test('a second set on the same day changes nothing and says nothing', () => {
  assert.equal(run({ streak: 4, lastDate: midnight(0), freezeUsedAt: null }), null);
});

test('practising the next day adds one, and the round numbers are named', () => {
  assert.deepEqual(run({ streak: 4, lastDate: midnight(-1), freezeUsedAt: null }), { kind: 'extended', days: 5, milestone: false });
  assert.deepEqual(run({ streak: 6, lastDate: midnight(-1), freezeUsedAt: null }), { kind: 'extended', days: 7, milestone: true });
});

test('one skipped day after five or more is covered once, and says so', () => {
  assert.deepEqual(run({ streak: 6, lastDate: midnight(-2), freezeUsedAt: null }), { kind: 'kept', days: 7, milestone: true });
  // The pause day is spent: the next skip restarts.
  assert.deepEqual(run({ streak: 9, lastDate: midnight(-2), freezeUsedAt: midnight(-20) }), { kind: 'restarted', days: 1, milestone: false });
});

test('a longer gap restarts the count at day 1', () => {
  assert.deepEqual(run({ streak: 12, lastDate: midnight(-3), freezeUsedAt: null }), { kind: 'restarted', days: 1, milestone: false });
  assert.deepEqual(run({ streak: 3, lastDate: midnight(-2), freezeUsedAt: null }), { kind: 'restarted', days: 1, milestone: false });
});

test('milestones are the first weeks, then months, then every hundred days', () => {
  const hits = Array.from({ length: 801 }, (_, n) => n).filter(isStreakMilestone);
  assert.deepEqual(hits, [3, 7, 14, 30, 50, 100, 150, 200, 365, 400, 500, 600, 700, 800]);
});

test('the stash answers only for the set it was written for, and remembers its entrance', () => {
  stashStreakMoment({ kind: 'extended', days: 5, milestone: false }, 1000);
  assert.equal(readStreakMoment(999), null);
  assert.equal(readStreakMoment(1000).seen, false);
  markStreakMomentSeen(1000);
  assert.equal(readStreakMoment(1000).seen, true);
  // Reading never consumes it: Back from the answers shows the same card.
  assert.equal(readStreakMoment(1000).days, 5);
  stashStreakMoment(null, 2000);
  assert.equal(readStreakMoment(2000), null);
});
