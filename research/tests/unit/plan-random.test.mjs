// The seeded generator [M2-DESIGN.md 7]: PCG32 as pcg-c-basic seeds it, reproducing the reference demo's
// first six numbers (seed 42, sequence 54), unbiased bounded integers and a Fisher-Yates shuffle that
// never changes its argument. OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRng, drawSeed, isSeed, MAX_SEED } from '../../src/lib/plan/random.js';

const golden = JSON.parse(readFileSync(new URL('../fixtures/plan/golden.json', import.meta.url), 'utf8'));

test('PCG32 seed 42 stream 54 gives the pcg32-demo reference output', () => {
  const rng = createRng(42, 54);
  const got = Array.from({ length: 6 }, () => `0x${rng.nextUint32().toString(16).padStart(8, '0')}`);
  assert.deepEqual(got, ['0xa15c02b7', '0x7b47f409', '0xba1d3330', '0x83d2f293', '0xbfa4784b', '0xcbed606e']);
  assert.deepEqual(got, golden.reference.first6, 'the Python implementation agrees');
});

test('the default stream is 54', () => {
  const a = createRng(42);
  const b = createRng(42, 54);
  for (let i = 0; i < 20; i += 1) assert.equal(a.nextUint32(), b.nextUint32());
});

test('seeds and streams are unsigned 32-bit integers', () => {
  assert.ok(isSeed(0) && isSeed(MAX_SEED));
  for (const bad of [-1, MAX_SEED + 1, 1.5, '3', NaN, null]) assert.ok(!isSeed(bad), String(bad));
  assert.throws(() => createRng(-1), /seed/);
  assert.throws(() => createRng(1, 2 ** 32), /stream/);
  const s = drawSeed();
  assert.ok(isSeed(s));
});

test('bounded(n) stays in [0, n) and rejects below (2^32 - n) mod n', () => {
  const rng = createRng(7, 3);
  for (const n of [1, 2, 3, 7, 19, 1000, 2 ** 31 + 1]) {
    for (let i = 0; i < 200; i += 1) {
      const x = rng.bounded(n);
      assert.ok(Number.isInteger(x) && x >= 0 && x < n, `${n}: ${x}`);
    }
  }
  // n = 2^31 + 1 rejects a draw below 2^31 - 1: with that threshold about half the draws are thrown
  // away, so the number of raw draws is well above the number of values returned.
  const r2 = createRng(1, 1);
  const before = r2.draws();
  for (let i = 0; i < 400; i += 1) r2.bounded(2 ** 31 + 1);
  assert.ok(r2.draws() - before > 600, 'rejection happens');
});

test('bounded(1) draws once (as the C code) and returns 0', () => {
  const rng = createRng(5);
  assert.equal(rng.bounded(1), 0);
  assert.equal(rng.draws(), 1);
});

test('shuffle is a permutation, leaves its argument alone, and is the same for the same seed', () => {
  const arr = Array.from({ length: 50 }, (_, i) => i);
  const a = createRng(123).shuffle(arr);
  const b = createRng(123).shuffle(arr);
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort((x, y) => x - y), arr);
  assert.deepEqual(arr, Array.from({ length: 50 }, (_, i) => i));
  assert.notDeepEqual(a, arr);
});

test('the uniform draw is flat: 19 letters over 190,000 draws within 5 standard errors each', () => {
  const rng = createRng(2026, 9);
  const counts = new Array(19).fill(0);
  const n = 190000;
  for (let i = 0; i < n; i += 1) counts[rng.bounded(19)] += 1;
  const e = n / 19;
  const sd = Math.sqrt(n * (1 / 19) * (18 / 19));
  for (const c of counts) assert.ok(Math.abs(c - e) < 5 * sd, `${c} vs ${e}`);
});
