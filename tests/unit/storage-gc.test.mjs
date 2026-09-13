// ============================================================
// storage-gc.test.mjs
// ============================================================
// localStorage filled up because five key families were written per item and
// never removed, and because nothing recovered once a write started failing.
// These tests pin both halves: what may be reclaimed, and — more important —
// what may not. Sweeping a student's notes to make room would be a worse bug
// than the one being fixed.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { sweepStaleKeys, sweepOldOperations, reclaim, isQuotaError } from '../../src/lib/storage-gc.js';

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

function makeStorage(seed = {}) {
  const mem = new Map(Object.entries(seed));
  return {
    get length() { return mem.size; },
    key: (i) => [...mem.keys()][i] ?? null,
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); },
    removeItem: (k) => { mem.delete(k); },
    keys: () => [...mem.keys()].sort(),
  };
}

// ── what gets reclaimed ──────────────────────────────────────────
test('a daily-question key from another day is dead weight', () => {
  const s = makeStorage({
    'vmx-todays-q-2026-09-14': '{"correct":true}',
    'vmx-todays-q-2026-09-13': '{"correct":false}',
    'vmx-todays-q-2026-05-02': '{"correct":true}',
    'vmx-daily-q-pulse-fired-2026-09-14': '1',
    'vmx-daily-q-pulse-fired-2026-05-02': '1',
  });
  const out = sweepStaleKeys(s, { now: NOW, today: '2026-09-14' });
  assert.deepEqual(s.keys(), ['vmx-daily-q-pulse-fired-2026-09-14', 'vmx-todays-q-2026-09-14']);
  assert.equal(out.removed.length, 3);
  assert.ok(out.bytes > 0);
});

test('both keys a day writes are swept, not just the answer', () => {
  // The pulse flag is a second key per calendar day; missing it would halve
  // the reclaim and leave the count growing.
  const s = makeStorage({ 'vmx-daily-q-pulse-fired-2026-01-01': '1' });
  sweepStaleKeys(s, { now: NOW, today: '2026-09-14' });
  assert.deepEqual(s.keys(), []);
});

test('an expired playlist cache is removed, a fresh one is kept', () => {
  const s = makeStorage({
    'vmx-pl-preview-FRESH': JSON.stringify({ cachedAt: NOW - 1000, data: [1] }),
    'vmx-pl-preview-STALE': JSON.stringify({ cachedAt: NOW - 3 * DAY, data: [1] }),
    'vmx-pl-preview-JUNK': 'not json',
  });
  sweepStaleKeys(s, { now: NOW, today: '2026-09-14' });
  assert.deepEqual(s.keys(), ['vmx-pl-preview-FRESH']);
});

test('a back-off marker whose moment has passed is removed', () => {
  const s = makeStorage({
    'vmx-pl-miss-PAST': String(NOW - 1),
    'vmx-pl-miss-FUTURE': String(NOW + 60_000),
  });
  sweepStaleKeys(s, { now: NOW, today: '2026-09-14' });
  assert.deepEqual(s.keys(), ['vmx-pl-miss-FUTURE']);
});

// ── what must survive ────────────────────────────────────────────
test('a student’s own work is never reclaimed', () => {
  const mine = {
    'vmx-history': '[{"id":1}]',
    'vmx-bookmarks': '[1,2]',
    'vmx-notes': '{"1":"note"}',
    'vmx-sr-cards': '{"1":{}}',
    'vmx-custom-q': '[{"id":9}]',
    'vmx-pending-exam-results': '[{}]',
    'vmx-pass-abc123-hl': '[{"start":0,"end":4}]',
    'vmx-pass-abc123-dr': '[{"points":[[1,2,3]]}]',
  };
  const s = makeStorage({ ...mine, 'vmx-todays-q-2020-01-01': '{}' });
  sweepStaleKeys(s, { now: NOW, today: '2026-09-14' });
  assert.deepEqual(s.keys(), Object.keys(mine).sort());
});

test('without a date to protect, the daily family is left alone', () => {
  // Guessing the timezone rule could delete the entry the app is about to
  // read, so no `today` means no sweep of that family at all.
  const s = makeStorage({ 'vmx-todays-q-2026-09-14': '{}' });
  sweepStaleKeys(s, { now: NOW });
  assert.deepEqual(s.keys(), ['vmx-todays-q-2026-09-14']);
});

// ── the sync outbox ──────────────────────────────────────────────
test('only the newest outbox records are kept', () => {
  const seed = {};
  for (let i = 0; i < 9; i += 1) seed[`vmx-op-${i}`] = JSON.stringify({ createdAt: NOW + i, changes: {} });
  const s = makeStorage(seed);
  sweepOldOperations(s, 'vmx-op-', { keep: 4 });
  assert.deepEqual(s.keys(), ['vmx-op-5', 'vmx-op-6', 'vmx-op-7', 'vmx-op-8']);
});

test('the record being written right now survives its own sweep', () => {
  const seed = { 'vmx-op-mine': JSON.stringify({ createdAt: 0, changes: {} }) };
  for (let i = 0; i < 9; i += 1) seed[`vmx-op-${i}`] = JSON.stringify({ createdAt: NOW + i, changes: {} });
  const s = makeStorage(seed);
  // createdAt 0 sorts oldest, so without protection this is the first to go.
  sweepOldOperations(s, 'vmx-op-', { keep: 4, protectKey: 'vmx-op-mine' });
  assert.ok(s.keys().includes('vmx-op-mine'));
});

test('a short outbox is left untouched', () => {
  const s = makeStorage({ 'vmx-op-a': JSON.stringify({ createdAt: NOW, changes: {} }) });
  const out = sweepOldOperations(s, 'vmx-op-', { keep: 4 });
  assert.equal(out.removed.length, 0);
  assert.deepEqual(s.keys(), ['vmx-op-a']);
});

// ── the combined recovery pass ───────────────────────────────────
test('reclaim reports the bytes it actually freed', () => {
  const s = makeStorage({
    'vmx-todays-q-2020-01-01': 'x'.repeat(400),
    'vmx-history': 'y'.repeat(900),
  });
  const out = reclaim(s, { now: NOW, today: '2026-09-14' });
  assert.ok(out.bytes >= 400, 'freed bytes should cover the dead key');
  assert.deepEqual(s.keys(), ['vmx-history'], 'history must survive a reclaim');
});

test('reclaim on an empty store frees nothing and throws nothing', () => {
  const out = reclaim(makeStorage(), { now: NOW, today: '2026-09-14' });
  assert.equal(out.bytes, 0);
  assert.deepEqual(out.removed, []);
});

test('a storage that refuses to answer is survivable', () => {
  const hostile = {
    get length() { throw new Error('denied'); },
    key: () => { throw new Error('denied'); },
    getItem: () => { throw new Error('denied'); },
    setItem: () => { throw new Error('denied'); },
    removeItem: () => { throw new Error('denied'); },
  };
  assert.doesNotThrow(() => sweepStaleKeys(hostile, { now: NOW, today: '2026-09-14' }));
  assert.doesNotThrow(() => reclaim(hostile, { now: NOW, today: '2026-09-14' }));
});

// ── recognising the failure ──────────────────────────────────────
test('a quota failure is recognised across browsers', () => {
  assert.equal(isQuotaError({ name: 'QuotaExceededError' }), true);
  assert.equal(isQuotaError({ name: 'NS_ERROR_DOM_QUOTA_REACHED' }), true, 'Firefox');
  assert.equal(isQuotaError({ code: 22 }), true, 'legacy WebKit');
  assert.equal(isQuotaError({ code: 1014 }), true, 'legacy Firefox');
  assert.equal(isQuotaError(new Error('something else')), false);
  assert.equal(isQuotaError(null), false);
});
