// ============================================================
// first-tip.test.mjs — one usage hint per feature, once ever
// ============================================================
// The rules under test: the first open shows it, and no later open does, on
// any day; the features never silence each other; a record written under the
// old daily rule (until 5.214) counts as seen; a broken store never throws;
// dismissing is the same as being shown.
//
// Driven against the real module over a minimal stub — the same shape the
// browser gives it — because the bugs would otherwise hide in the try/catch.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const DAY_1 = new Date(2026, 9, 11, 10, 0, 0);
const A_WEEK_LATER = new Date(2026, 9, 18, 10, 0, 0);
const A_YEAR_LATER = new Date(2027, 9, 11, 10, 0, 0);

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

const { shouldShowTip, markTipSeen, dismissTip, decideTip, todayKey, TIP_STORAGE_KEY, TIP_TURN_KEY } =
  await import('../../src/lib/first-tip.js');

test('the first open ever shows the hint', () => {
  assert.equal(shouldShowTip('library'), true, 'a feature never opened before must show its hint');
});

test('time moves forward a week, a year: no tip returns', () => {
  for (const id of ['library', 'knowledge', 'notes', 'videos', 'schedule']) markTipSeen(id, DAY_1);
  for (const id of ['library', 'knowledge', 'notes', 'videos', 'schedule']) {
    assert.equal(shouldShowTip(id, A_WEEK_LATER), false, `${id} came back a week later`);
    assert.equal(decideTip(null, id, A_WEEK_LATER).show, false, `${id} decided to show a week later`);
    assert.equal(shouldShowTip(id, A_YEAR_LATER), false, `${id} came back a year later`);
  }
});

test('a record from the old daily rule counts as seen, whatever its day', () => {
  // A student who met the hints before this release holds the last day each
  // was seen, and the rotation counter for it.
  store.set(TIP_STORAGE_KEY, JSON.stringify({ notes: '2026-10-01', knowledge: '2026-11-10' }));
  store.set(TIP_TURN_KEY, JSON.stringify({ notes: 4, knowledge: 2, videos: 1 }));
  assert.equal(shouldShowTip('notes', A_WEEK_LATER), false);
  assert.equal(shouldShowTip('knowledge', A_WEEK_LATER), false);
  assert.equal(shouldShowTip('videos', A_WEEK_LATER), false, 'a hint seen only in the turn record came back');
  assert.equal(shouldShowTip('library', A_WEEK_LATER), true, 'a hint never seen was silenced');
  // The next write folds the turn record into the one map and drops its key.
  markTipSeen('library', A_WEEK_LATER);
  assert.equal(store.has(TIP_TURN_KEY), false, 'the old rotation key was kept');
  const map = JSON.parse(store.get(TIP_STORAGE_KEY));
  assert.deepEqual(Object.keys(map).sort(), ['knowledge', 'library', 'notes', 'videos']);
  assert.equal(map.notes, '2026-10-01', 'the first day seen was overwritten');
  assert.equal(shouldShowTip('videos', A_YEAR_LATER), false);
});

test('dismissing is exactly the same as being shown', () => {
  dismissTip('notes', DAY_1);
  assert.equal(shouldShowTip('notes', A_WEEK_LATER), false, 'a dismissed tip came back');
  assert.deepEqual(JSON.parse(store.get(TIP_STORAGE_KEY)), { notes: todayKey(DAY_1) });
});

test('each feature keeps its own record', () => {
  markTipSeen('library', DAY_1);
  assert.equal(shouldShowTip('notes'), true, 'one feature being shown silenced another');
  assert.equal(shouldShowTip('videos'), true, 'one feature being shown silenced another');
});

test('a corrupted blob is ignored and reset rather than thrown', () => {
  store.set(TIP_STORAGE_KEY, '{not json at all');
  assert.equal(shouldShowTip('library'), true, 'a corrupted blob threw instead of showing the tip');
  markTipSeen('library', DAY_1);
  assert.deepEqual(JSON.parse(store.get(TIP_STORAGE_KEY)), { library: todayKey(DAY_1) });
  store.set(TIP_STORAGE_KEY, JSON.stringify(['library']));
  assert.equal(shouldShowTip('library'), true, 'an array blob was treated as the record');
});

test('the day recorded is the local calendar day, never UTC', () => {
  assert.equal(todayKey(new Date(2026, 9, 11, 23, 59)), '2026-10-11');
  assert.equal(todayKey(new Date(2026, 9, 12, 0, 0)), '2026-10-12');
});

test('storage that cannot be read or written degrades to showing the tip', () => {
  globalThis.localStorage = {
    getItem() { throw new Error('SecurityError: storage is disabled'); },
    setItem() { throw new Error('QuotaExceededError'); },
    removeItem() {},
  };
  assert.equal(shouldShowTip('library'), true);
  assert.doesNotThrow(() => markTipSeen('library', DAY_1));
});

test('no store at all shows the tip', () => {
  delete globalThis.localStorage;
  assert.equal(shouldShowTip('library'), true);
  assert.doesNotThrow(() => dismissTip('library', DAY_1));
});

test('the decision is made once per id: the record the card wrote cannot hide that same card', () => {
  const decision = decideTip(null, 'library');
  assert.equal(decision.show, true);
  markTipSeen('library', DAY_1);
  markTipSeen('library', DAY_1);
  assert.equal(decideTip(decision, 'library'), decision, 'the same id must keep the same decision');
  const quiet = decideTip(decision, 'notes');
  assert.notEqual(quiet, decision);
  assert.deepEqual(decideTip(null, 'library'), { id: 'library', show: false });
});

process.on('exit', () => {
  if (saved === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = saved;
});
