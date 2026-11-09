// ============================================================
// quests-streak.test.mjs -- a quest streak that has ended reads 0
// ============================================================
// The quest panel prints "streak N วัน" from getQuestStreak, and the saved
// count only moves when a quest is claimed. Read as-is, a run that stopped
// weeks ago kept its number beside a main streak that already read 0
// (streakShown). A run is alive through yesterday, because today's first
// claim still extends it; after that it is over.
// ============================================================

import test, { mock } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
globalThis.window = {
  localStorage: {
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] ?? null,
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => store.clear(),
  },
  dispatchEvent: () => true,
  addEventListener() {},
  removeEventListener() {},
};

// Quest days are the device's calendar (todayKey). Noon on the device's own
// clock is the same date under every zone the suite runs in.
const noon = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0).getTime();
mock.timers.enable({ apis: ['Date'], now: noon(2026, 10, 1) });
test.after(() => mock.timers.reset());

const quests = await import('../../src/lib/quests.js');

// One finished quest on the current day, claimed the way the panel claims it.
function claimToday() {
  const date = quests.todayKey();
  store.set(`vmx-quests-${date}`, JSON.stringify({
    date,
    quests: [{ id: 'read-1-topic', label: 'อ่าน 1 หัวข้อในสรุปบทเรียน', icon: '', target: 1, xp: 10, progress: 1, claimed: false }],
    bonusClaimed: false,
  }));
  assert.equal(quests.claimQuestReward('read-1-topic'), true);
}

test('a run of claimed days shows while it is alive and reads 0 once it has ended', () => {
  store.clear();
  for (let d = 1; d <= 5; d += 1) {
    mock.timers.setTime(noon(2026, 10, d));
    claimToday();
  }
  assert.equal(quests.getQuestStreak(), 5, 'five days in a row');

  mock.timers.setTime(noon(2026, 10, 6));
  assert.equal(quests.getQuestStreak(), 5, 'nothing claimed yet today, so the run can still go on');

  mock.timers.setTime(noon(2026, 10, 7));
  assert.equal(quests.getQuestStreak(), 0, 'a whole day with no claim ended the run');

  mock.timers.setTime(noon(2026, 11, 8));
  assert.equal(quests.getQuestStreak(), 0, 'weeks later the panel still printed the old run');

  claimToday();
  assert.equal(quests.getQuestStreak(), 1, 'the next claim starts a new run');
});

test('yesterday is found across the end of a month and of a year', () => {
  store.clear();
  mock.timers.setTime(noon(2026, 10, 31));
  claimToday();
  mock.timers.setTime(noon(2026, 11, 1));
  assert.equal(quests.getQuestStreak(), 1, '31 Oct is the day before 1 Nov');
  claimToday();
  assert.equal(quests.getQuestStreak(), 2);

  store.clear();
  mock.timers.setTime(noon(2026, 12, 31));
  claimToday();
  mock.timers.setTime(noon(2027, 1, 1));
  assert.equal(quests.getQuestStreak(), 1, '31 Dec is the day before 1 Jan');
  mock.timers.setTime(noon(2027, 1, 2));
  assert.equal(quests.getQuestStreak(), 0);
});
