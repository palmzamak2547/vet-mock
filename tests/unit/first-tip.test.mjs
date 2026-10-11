// ============================================================
// first-tip.test.mjs — one usage hint per feature per day
// ============================================================
// A student asked for the hint to appear the first time a day they open a
// feature, then stay quiet for the rest of the day. The rules under test:
// the first open shows it, a second open the same day does not, tomorrow
// shows it again, the features never silence each other, a broken store
// never throws, and dismissing ends the day exactly like being shown.
//
// Driven against the real module over a minimal stub — the same shape the
// browser gives it — because the bugs would otherwise hide in the try/catch.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// A local 10:00 on each of two days, plus a late hour on the second one.
// Local, not UTC: the day boundary is the student's own, which is the whole
// point of todayKey().
const DAY_1 = new Date(2026, 9, 11, 10, 0, 0);
const DAY_2 = new Date(2026, 9, 12, 9, 30, 0);
const DAY_2_LATE = new Date(2026, 9, 12, 23, 59, 0);

const store = new Map();
const saved = globalThis.localStorage;
beforeEach(() => {
  store.clear();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: (key) => { store.delete(key); },
    clear: () => { store.clear(); },
  };
});

const { shouldShowTip, markTipSeen, dismissTip, todayKey, TIP_STORAGE_KEY } =
  await import('../../src/lib/first-tip.js');

test('the first open of a day shows the hint', () => {
  assert.equal(shouldShowTip('library', DAY_1), true, 'a feature never opened before must show its hint');
});

test('a second open the same day stays quiet', () => {
  assert.equal(shouldShowTip('library', DAY_1), true);
  markTipSeen('library', DAY_1);
  assert.equal(shouldShowTip('library', DAY_1), false, 'the same day, the same hint showed again');
});

test('the next day shows it again', () => {
  assert.equal(shouldShowTip('library', DAY_1), true);
  markTipSeen('library', DAY_1);
  assert.equal(shouldShowTip('library', DAY_1), false, 'still quiet within day 1');
  assert.equal(shouldShowTip('library', DAY_2), true, 'the next day still hid the hint');

  // A later time on that same day changes nothing: the key is the date.
  markTipSeen('library', DAY_2);
  assert.equal(shouldShowTip('library', DAY_2_LATE), false, 'same day, later hour, must not re-show');
});

test('dismissing is exactly the same as being shown', () => {
  dismissTip('notes', DAY_1);
  assert.equal(shouldShowTip('notes', DAY_1), false, 'a dismissed tip came back the same day');
  assert.equal(shouldShowTip('notes', DAY_2), true, 'a dismissed tip was never offered again, on any day');
});

test('each feature keeps its own day', () => {
  markTipSeen('library', DAY_1);
  dismissTip('knowledge', DAY_1);
  assert.equal(shouldShowTip('library', DAY_1), false);
  assert.equal(shouldShowTip('knowledge', DAY_1), false);
  assert.equal(shouldShowTip('notes', DAY_1), true, 'one feature being shown silenced another');
  assert.equal(shouldShowTip('videos', DAY_1), true, 'one feature being shown silenced another');

  markTipSeen('notes', DAY_2);
  assert.equal(shouldShowTip('library', DAY_2), true, 'a second day was not re-offered');
  assert.equal(shouldShowTip('knowledge', DAY_2), true, 'a second day was not re-offered');
  assert.equal(shouldShowTip('notes', DAY_2), false);
});

test('a corrupted blob is ignored and reset rather than thrown', () => {
  store.set(TIP_STORAGE_KEY, '{not json at all');
  assert.equal(shouldShowTip('library', DAY_1), true, 'a corrupted blob threw instead of showing the tip');

  markTipSeen('library', DAY_1);
  let after = null;
  try { after = JSON.parse(store.get(TIP_STORAGE_KEY)); } catch { /* fail below */ }
  assert.deepEqual(after, { library: todayKey(DAY_1) }, 'a corrupted blob was written back instead of reset');

  // A wrongly-shaped value (an array, a number) is the same story.
  store.set(TIP_STORAGE_KEY, JSON.stringify(['library']));
  assert.equal(shouldShowTip('library', DAY_1), true, 'an array blob was treated as a day record');
  store.set(TIP_STORAGE_KEY, '"2026-09-11"');
  assert.equal(shouldShowTip('library', DAY_1), true, 'a bare string blob was treated as the map');
});

test('the day is the local calendar day, never UTC', () => {
  // 23:30 in Bangkok is 16:30 UTC the same day, and 01:00 the next in UTC+8
  // is 17:00 UTC the previous day. A UTC-built key would disagree with the
  // student about whether it is already tomorrow.
  assert.equal(todayKey(new Date(2026, 9, 11, 23, 59)), '2026-10-11');
  assert.equal(todayKey(new Date(2026, 9, 12, 0, 0)), '2026-10-12');
  assert.equal(todayKey(new Date(2026, 0, 5, 3, 4, 5)), '2026-01-05');
});

test('storage that cannot be read or written degrades to showing the tip', () => {
  globalThis.localStorage = {
    getItem() { throw new Error('SecurityError: storage is disabled'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() {},
  };
  assert.equal(shouldShowTip('library', DAY_1), true, 'a disabled store threw instead of showing the tip');
  assert.doesNotThrow(() => markTipSeen('library', DAY_1), 'a refused write threw');
  assert.equal(shouldShowTip('library', DAY_1), true, 'a refused write was recorded as seen');
});

test('no store at all shows the tip', () => {
  delete globalThis.localStorage;
  assert.equal(shouldShowTip('library', DAY_1), true, 'a missing store threw instead of showing the tip');
  assert.doesNotThrow(() => dismissTip('library', DAY_1), 'a missing store threw on dismiss');
});

// The stub must not leak into the other suites.
process.on('exit', () => {
  if (saved === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = saved;
});
