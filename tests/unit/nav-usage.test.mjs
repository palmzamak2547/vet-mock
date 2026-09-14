// ============================================================
// nav-usage.test.mjs
// ============================================================
// The sidebar list is capped now, so what fills it decides what a student
// can reach without opening the palette. Two properties matter more than the
// ranking itself: a destination they use must not fall out, and the order
// must not depend on anything that changes between renders.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankByUse, splitForSidebar, recordViewOpen, readUsage } from '../../src/lib/nav-usage.js';

const feat = (id, view = id) => ({ id, invoke: { kind: 'view', view } });
const FEATURES = ['library', 'notes', 'videos', 'atlas', 'faculty', 'reading', 'schedule', 'bench', 'pinboard'].map((id) => feat(id));
const ids = (list) => list.map((f) => f.id);

function memStorage(seed = {}) {
  const m = new Map(Object.entries(seed));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    _map: m,
  };
}

// ── ranking ──────────────────────────────────────────────────────
test('with no history at all, the registry order is kept exactly', () => {
  assert.deepEqual(ids(rankByUse(FEATURES, {})), ids(FEATURES));
  assert.deepEqual(ids(rankByUse(FEATURES)), ids(FEATURES));
});

test('what the student opens rises, and ties keep registry order', () => {
  const ranked = rankByUse(FEATURES, { pinboard: 9, schedule: 9, bench: 2 });
  // schedule and pinboard tie on 9 — schedule is earlier in the registry.
  assert.deepEqual(ids(ranked).slice(0, 3), ['schedule', 'pinboard', 'bench']);
  // everything else keeps its original relative order behind them
  assert.deepEqual(ids(ranked).slice(3), ['library', 'notes', 'videos', 'atlas', 'faculty', 'reading']);
});

test('ranking is a pure function of its inputs — same in, same out', () => {
  const counts = { bench: 3, atlas: 1 };
  assert.deepEqual(ids(rankByUse(FEATURES, counts)), ids(rankByUse(FEATURES, counts)));
  // and it does not mutate what it was given
  const before = ids(FEATURES);
  rankByUse(FEATURES, counts);
  assert.deepEqual(ids(FEATURES), before, 'the registry array must not be reordered in place');
});

test('a feature matched by its destination, not its id', () => {
  // vetwiki opens `knowledge`; the count is against the view.
  const list = [feat('atlas'), { id: 'vetwiki', invoke: { kind: 'view', view: 'knowledge' } }];
  assert.deepEqual(ids(rankByUse(list, { knowledge: 5 })), ['vetwiki', 'atlas']);
});

test('a feature with no invoke target does not throw or jump the queue', () => {
  const list = [{ id: 'broken' }, feat('atlas')];
  assert.deepEqual(ids(rankByUse(list, { atlas: 1 })), ['atlas', 'broken']);
});

// ── the split the sidebar draws ──────────────────────────────────
test('the visible list is capped and the remainder is handed to the palette', () => {
  const { visible, rest } = splitForSidebar(FEATURES, {}, 6);
  assert.equal(visible.length, 6);
  assert.equal(rest.length, 3);
  assert.deepEqual([...ids(visible), ...ids(rest)], ids(FEATURES), 'nothing may be lost between the two');
});

test('a list that would hide exactly one item shows it instead', () => {
  // An overflow row costs a row. Spending one to hide one is a net loss.
  const seven = FEATURES.slice(0, 7);
  const { visible, rest } = splitForSidebar(seven, {}, 6);
  assert.equal(visible.length, 7);
  assert.deepEqual(rest, []);
});

test('a short list is untouched and needs no overflow row', () => {
  const { visible, rest } = splitForSidebar(FEATURES.slice(0, 4), {}, 6);
  assert.equal(visible.length, 4);
  assert.deepEqual(rest, []);
});

test('a destination the student actually uses cannot be hidden by the cap', () => {
  // The whole point of ranking: use it, and it stays reachable in one click.
  const counts = { pinboard: 12 };  // last in the registry, first in use
  const { visible, rest } = splitForSidebar(FEATURES, counts, 6);
  assert.equal(ids(visible)[0], 'pinboard');
  assert.ok(!ids(rest).includes('pinboard'));
});

// ── the counter ──────────────────────────────────────────────────
test('opens accumulate, and are read back', () => {
  const s = memStorage();
  recordViewOpen('bench', s);
  recordViewOpen('bench', s);
  recordViewOpen('atlas', s);
  assert.deepEqual(readUsage(s), { bench: 2, atlas: 1 });
});

test('the record stays small — only the most-used survive the cap', () => {
  const s = memStorage();
  for (let i = 0; i < 40; i += 1) recordViewOpen(`view-${i}`, s);
  recordViewOpen('view-39', s);  // make one clearly the most used
  const counts = readUsage(s);
  assert.ok(Object.keys(counts).length <= 24, `tracked ${Object.keys(counts).length}`);
  assert.equal(counts['view-39'], 2, 'the most-used entry is the one kept');
});

test('storage that refuses every write is survivable and changes nothing', () => {
  const hostile = {
    getItem: () => { throw new Error('denied'); },
    setItem: () => { throw new Error('denied'); },
    removeItem: () => { throw new Error('denied'); },
  };
  assert.doesNotThrow(() => recordViewOpen('bench', hostile));
  assert.deepEqual(readUsage(hostile), {});
  // With no counts the sidebar still gets a full, correctly ordered list.
  assert.deepEqual(ids(rankByUse(FEATURES, readUsage(hostile))), ids(FEATURES));
});

test('corrupt or hostile stored values are ignored rather than ranked', () => {
  for (const raw of ['{not json', '[]', 'null', '{"bench":"lots"}', '{"bench":-4}']) {
    const s = memStorage({ 'vmx-nav-use-v1': raw });
    assert.deepEqual(readUsage(s), {}, raw);
    assert.deepEqual(ids(rankByUse(FEATURES, readUsage(s))), ids(FEATURES), raw);
  }
});

test('a missing view is not counted', () => {
  const s = memStorage();
  recordViewOpen(null, s);
  recordViewOpen('', s);
  recordViewOpen(undefined, s);
  assert.deepEqual(readUsage(s), {});
});
