// The session engine: a practice set locks each answer, a mock exam keeps answers open until
// it is submitted and runs against an absolute deadline; finishing grades by original index.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// A stored session is read when the module loads; seed localStorage first, as a reload would.
const storage = new Map();
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
};
const stored = {
  v: 1, id: 'stored-1', mode: 'mock', createdAt: 1, status: 'active', cursor: 99, meta: {},
  items: [{ key: 'vca:1', domain: 'swine', order: [2, 0, 1], answer: 0 }, { key: 'vca:2', domain: 'swine', order: [0, 1], answer: 1 }],
};
storage.set('vca:session:v1', JSON.stringify(stored));
storage.set('vca:results:v1', JSON.stringify([{ v: 1, id: 'r1', items: [] }, { v: 2, id: 'old', items: [] }, { nope: true }]));

const S = await import('../../src/lib/session.js');
const {
  createSession, remainingMs, isExpired, answeredCount, choose, unchoose, go, toggleFlag, tally, finish, byDomain,
  keepResult, newId, sessionStore, resultsStore, RESULTS_KEPT,
} = S;

const items = [
  { key: 'vca:1', domain: 'swine', order: [2, 0, 1, 3], answer: 0 },
  { key: 'vca:2', domain: 'equine', order: [0, 1, 2, 3], answer: 3 },
  { key: 'vca:3', domain: 'swine', order: [3, 2, 1, 0], answer: 1 },
];
const T0 = 1_800_000_000_000;

test('a stored session is repaired on load: cursor kept inside the set', () => {
  const s = sessionStore.get();
  assert.equal(s.id, 'stored-1');
  assert.equal(s.cursor, 1);
  assert.deepEqual(s.answers, {});
  assert.deepEqual(s.flags, []);
});

test('stored results keep only well-formed entries', () => {
  assert.deepEqual(resultsStore.get().map((r) => r.id), ['r1']);
});

test('createSession checks its inputs and times only a mock with a limit', () => {
  assert.throws(() => createSession({ mode: 'quiz', items }), /unknown mode/);
  assert.throws(() => createSession({ mode: 'practice', items: [] }), /at least one/);
  const practice = createSession({ mode: 'practice', items, limitSec: 600, now: T0 });
  assert.equal(practice.limitSec, null);
  assert.equal(practice.deadline, null);
  const mock = createSession({ mode: 'mock', items, limitSec: 162, now: T0, meta: { size: 3 } });
  assert.equal(mock.limitSec, 162);
  assert.equal(mock.deadline, T0 + 162_000);
  assert.equal(mock.status, 'active');
  assert.equal(mock.cursor, 0);
  assert.deepEqual(mock.meta, { size: 3 });
  const untimed = createSession({ mode: 'mock', items, limitSec: 0, now: T0 });
  assert.equal(untimed.deadline, null);
});

test('ids are unique and start with the time', () => {
  const ids = new Set(Array.from({ length: 200 }, () => newId(T0)));
  assert.equal(ids.size, 200);
  for (const id of ids) assert.match(id, /^[a-z0-9]+-[a-z0-9]{1,8}$/);
  assert.ok([...ids][0].startsWith(T0.toString(36)));
});

test('the clock: remaining time and expiry', () => {
  const mock = createSession({ mode: 'mock', items, limitSec: 60, now: T0 });
  assert.equal(remainingMs(mock, T0 + 20_000), 40_000);
  assert.equal(remainingMs(mock, T0 + 90_000), 0);
  assert.equal(isExpired(mock, T0 + 59_999), false);
  assert.equal(isExpired(mock, T0 + 60_000), true);
  const practice = createSession({ mode: 'practice', items, now: T0 });
  assert.equal(remainingMs(practice, T0), null);
  assert.equal(isExpired(practice, T0 + 1e9), false);
});

test('practice locks the first answer', () => {
  let s = createSession({ mode: 'practice', items, now: T0 });
  s = choose(s, 'vca:1', 2, T0 + 1);
  assert.deepEqual(s.answers['vca:1'], { choice: 2, at: T0 + 1 });
  const again = choose(s, 'vca:1', 0, T0 + 2);
  assert.equal(again, s, 'a second answer is ignored');
  assert.equal(unchoose(s, 'vca:1', T0 + 3), s, 'practice cannot take an answer back');
});

test('a mock keeps answers open until submitted, and closes at the deadline', () => {
  let s = createSession({ mode: 'mock', items, limitSec: 60, now: T0 });
  s = choose(s, 'vca:2', 1, T0 + 1);
  s = choose(s, 'vca:2', 3, T0 + 2);
  assert.equal(s.answers['vca:2'].choice, 3);
  s = unchoose(s, 'vca:2', T0 + 3);
  assert.equal(s.answers['vca:2'], undefined);
  s = choose(s, 'vca:2', 3, T0 + 4);
  assert.equal(choose(s, 'vca:3', 1, T0 + 60_000), s, 'no answers after the deadline');
  assert.equal(unchoose(s, 'vca:2', T0 + 60_000), s, 'no changes after the deadline');
});

test('choices outside a question are ignored', () => {
  const s = createSession({ mode: 'mock', items, now: T0 });
  assert.equal(choose(s, 'vca:9', 0, T0), s);
  assert.equal(choose(s, 'vca:1', 4, T0), s);
  assert.equal(choose(s, 'vca:1', -1, T0), s);
  assert.equal(choose(s, 'vca:1', 1.5, T0), s);
  assert.equal(choose({ ...s, status: 'finished' }, 'vca:1', 0, T0).answers['vca:1'], undefined);
});

test('moving, flagging and counting', () => {
  let s = createSession({ mode: 'mock', items, now: T0 });
  assert.equal(go(s, 5).cursor, 2);
  assert.equal(go(s, -3).cursor, 0);
  assert.equal(go(s, 0), s, 'no move returns the same object');
  s = toggleFlag(s, 'vca:2');
  s = toggleFlag(s, 'vca:3');
  s = toggleFlag(s, 'vca:2');
  assert.deepEqual(s.flags, ['vca:3']);
  s = choose(s, 'vca:1', 0, T0);
  assert.equal(answeredCount(s), 1);
  assert.deepEqual(tally(s), { total: 3, answered: 1, unanswered: 2, flagged: 1 });
});

test('finish grades by original index and caps the time at the deadline', () => {
  let s = createSession({ mode: 'mock', items, limitSec: 60, now: T0, meta: { label: 'exam' } });
  s = choose(s, 'vca:1', 0, T0 + 1); // right
  s = choose(s, 'vca:2', 2, T0 + 2); // wrong
  s = toggleFlag(s, 'vca:3');
  const done = finish(s, T0 + 90_000);
  assert.equal(done.expired, true);
  assert.equal(done.durationMs, 60_000);
  assert.equal(done.total, 3);
  assert.equal(done.correct, 1);
  assert.equal(done.answered, 2);
  assert.deepEqual(done.flags, ['vca:3']);
  assert.deepEqual(done.items.map((x) => [x.key, x.choice, x.correct]), [['vca:1', 0, true], ['vca:2', 2, false], ['vca:3', null, false]]);
  assert.deepEqual(done.meta, { label: 'exam' });
  const early = finish(s, T0 + 30_000);
  assert.equal(early.expired, false);
  assert.equal(early.durationMs, 30_000);
});

test('scores by domain, in first-seen order', () => {
  let s = createSession({ mode: 'practice', items, now: T0 });
  s = choose(s, 'vca:1', 0, T0);
  s = choose(s, 'vca:3', 1, T0);
  assert.deepEqual(byDomain(finish(s, T0)), [
    { domain: 'swine', total: 2, correct: 2 },
    { domain: 'equine', total: 1, correct: 0 },
  ]);
});

test('results are kept newest first, once each, at most RESULTS_KEPT', () => {
  let list = [];
  for (let i = 0; i < RESULTS_KEPT + 5; i += 1) list = keepResult(list, { v: 1, id: `r${i}`, items: [] });
  assert.equal(list.length, RESULTS_KEPT);
  assert.equal(list[0].id, `r${RESULTS_KEPT + 4}`);
  list = keepResult(list, { v: 1, id: 'r10', items: [], again: true });
  assert.equal(list.filter((r) => r.id === 'r10').length, 1);
  assert.equal(list[0].again, true);
});

test('the store writes through and resets', () => {
  const s = createSession({ mode: 'practice', items, now: T0, id: 'fresh-1' });
  let calls = 0;
  const off = sessionStore.subscribe(() => { calls += 1; });
  sessionStore.set(s);
  assert.equal(JSON.parse(storage.get('vca:session:v1')).id, 'fresh-1');
  sessionStore.set((cur) => go(cur, 1));
  assert.equal(sessionStore.get().cursor, 1);
  sessionStore.reset();
  assert.equal(sessionStore.get(), null);
  assert.equal(storage.has('vca:session:v1'), false);
  off();
  assert.equal(calls, 3);
});

// Stored sets are read before any page: a malformed one is dropped, never thrown (a null item
// once stopped the app from opening at all).
test('malformed stored sets and results are dropped instead of throwing', async () => {
  const { normalizeSession, normalizeResults } = await import('../../src/lib/session.js');
  assert.equal(normalizeSession({ v: 1, status: 'active', items: [null] }), null);
  assert.equal(normalizeSession('garbage'), null);
  const ok = normalizeSession({ v: 1, status: 'active', items: [{ key: 'a:1', order: [0, 1], answer: 1 }], answers: [], flags: [1, 'a:1'] });
  assert.deepEqual(ok.answers, {});
  assert.deepEqual(ok.flags, ['a:1']);
  const r = normalizeResults([{ v: 1, id: 'x', items: [null, { key: 'a:1', order: [0], answer: 0 }] }, null, 5]);
  assert.equal(r.length, 1);
  assert.equal(r[0].items.length, 1);
});

test('a question held back after the set was made, and left unanswered, is not scored', async () => {
  const { createSession, choose, finish } = await import('../../src/lib/session.js');
  let s = createSession({ mode: 'practice', items: [{ key: 'a:1', domain: 'a', order: [0, 1], answer: 0 }, { key: 'a:2', domain: 'a', order: [0, 1], answer: 1 }], now: 0 });
  s = choose(s, 'a:1', 0, 1);
  const r = finish(s, 2, { paused: (k) => k === 'a:2' });
  assert.equal(r.total, 1);
  assert.equal(r.correct, 1);
});

test('a set made before a corrected key is graded against the key as it is now', async () => {
  const { createSession, refreshItems } = await import('../../src/lib/session.js');
  const s = createSession({ mode: 'practice', items: [{ key: 'a:1', domain: 'a', order: [1, 0], answer: 0 }, { key: 'a:2', domain: 'a', order: [0, 1], answer: 1 }], now: 0 });
  const bank = { 'a:1': { answer: 1, options: ['x', 'y'] }, 'a:2': { answer: 1, options: ['x', 'y', 'z'] } };
  const next = refreshItems({ ...s, answers: { 'a:2': { choice: 1, at: 1 } } }, (k) => bank[k]);
  assert.equal(next.items[0].answer, 1);
  assert.deepEqual(next.items[0].order, [1, 0]);
  assert.deepEqual(next.items[1].order, [0, 1, 2]);
  assert.equal(next.answers['a:2'], undefined);
  assert.equal(refreshItems(s, () => null), s);
});
