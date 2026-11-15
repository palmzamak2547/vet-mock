// vmx-quests-streak holding "null" put Home's error card up: readStreak
// (src/lib/quests.js) returned the parsed null and getQuestStreak read
// `.lastDate` from it (stored-key sweep, 11 Nov 2026). A stored null, a value
// of another shape and a corrupt value now read as no run.
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

const noon = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0).getTime();
mock.timers.enable({ apis: ['Date'], now: noon(2026, 10, 1) });
test.after(() => mock.timers.reset());

const quests = await import('../../src/lib/quests.js');
const KEY = 'vmx-quests-streak';

for (const [label, raw] of [
  ['a stored null', 'null'],
  ['a stored number', '7'],
  ['a stored array', '[1,2]'],
  ['a stored string', '"x"'],
  ['corrupt JSON', '{"streak":3,'],
  ['the text undefined', 'undefined'],
]) {
  test(`${label} reads as no quest streak, without throwing`, () => {
    store.set(KEY, raw);
    assert.equal(quests.getQuestStreak(), 0);
  });
}

test('a run with a field of the wrong type keeps what it can', () => {
  store.set(KEY, JSON.stringify({ streak: '3', lastDate: quests.todayKey() }));
  assert.equal(quests.getQuestStreak(), 0);
  store.set(KEY, JSON.stringify({ streak: 4, lastDate: quests.todayKey() }));
  assert.equal(quests.getQuestStreak(), 4);
});
