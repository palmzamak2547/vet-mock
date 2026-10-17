// Drawing a set: how many from each domain, which questions qualify, which ones are drawn.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocate, eligible, draw, shuffle, seededRandom } from '../../src/lib/sets.js';

const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);

test('allocate mirrors the pools by size, at least one each when n allows', () => {
  assert.deepEqual(allocate({ a: 10, b: 5, c: 1 }, 8), { a: 4, b: 3, c: 1 });
  assert.deepEqual(allocate({ a: 100, b: 1, c: 1 }, 3), { a: 1, b: 1, c: 1 });
  assert.deepEqual(allocate({ a: 10, b: 10 }, 4), { a: 2, b: 2 });
});

test('allocate never draws more than a pool holds, nor more than all of them', () => {
  assert.deepEqual(allocate({ a: 10, b: 5, c: 1 }, 16), { a: 10, b: 5, c: 1 });
  assert.deepEqual(allocate({ a: 10, b: 5, c: 1 }, 100), { a: 10, b: 5, c: 1 });
  assert.deepEqual(allocate({ a: 2, b: 2 }, 10, { a: 1, b: 1 }), { a: 2, b: 2 });
});

test('allocate with nothing to draw', () => {
  assert.deepEqual(allocate({}, 10), {});
  assert.deepEqual(allocate({ a: 0, b: 5 }, 3), { b: 3 });
  assert.deepEqual(allocate({ a: 4 }, 0), { a: 0 });
  assert.deepEqual(allocate({ a: 4 }, -3), { a: 0 });
  assert.deepEqual(allocate({ a: 4 }, 2.9), { a: 2 }, 'a fractional n rounds down');
});

test('with fewer questions than pools, no pool is promised one', () => {
  const out = allocate({ a: 5, b: 5, c: 5 }, 2);
  assert.equal(sum(out), 2);
  for (const v of Object.values(out)) assert.ok(v <= 1);
});

test('weights steer the draw, and a full pool spills over to the others by weight', () => {
  const out = allocate({ a: 100, b: 100, c: 3 }, 30, { a: 1, b: 1, c: 10 });
  assert.equal(out.c, 3, 'c is weighted heaviest but holds only 3');
  assert.equal(sum(out), 30);
  assert.ok(Math.abs(out.a - out.b) <= 1, `a ${out.a} and b ${out.b} share the rest evenly`);
  assert.deepEqual(allocate({ a: 50, b: 50, c: 50 }, 20, { a: 1, b: 1, c: 2 }), { a: 5, b: 5, c: 10 });
});

test('a pool weighted 0 gets its one, and more only when nothing else is left', () => {
  assert.deepEqual(allocate({ a: 100, b: 100, c: 3 }, 30, { a: 1, b: 0, c: 10 }), { a: 26, b: 1, c: 3 });
  assert.deepEqual(allocate({ a: 2, b: 50 }, 20, { a: 1, b: 0 }), { a: 2, b: 18 });
  const unweighted = allocate({ a: 5, b: 9 }, 6, {});
  assert.equal(sum(unweighted), 6, 'every weight 0: the set still fills');
  assert.deepEqual(unweighted, { a: 1, b: 5 }, 'each its one, then the largest pool first');
});

test('allocate holds its promises for many random cases', () => {
  const rand = seededRandom(7);
  for (let round = 0; round < 400; round += 1) {
    const ids = 'abcdefgh'.slice(0, 1 + Math.floor(rand() * 8)).split('');
    const sizes = Object.fromEntries(ids.map((id) => [id, Math.floor(rand() * 40)]));
    const weights = rand() < 0.5 ? undefined : Object.fromEntries(ids.map((id) => [id, rand() < 0.15 ? 0 : rand() * 10]));
    const n = Math.floor(rand() * 120);
    const out = allocate(sizes, n, weights);
    const available = sum(sizes);
    const open = ids.filter((id) => sizes[id] > 0);
    assert.equal(sum(out), Math.min(n, available), JSON.stringify({ sizes, weights, n, out }));
    for (const id of Object.keys(out)) {
      assert.ok(Number.isInteger(out[id]) && out[id] >= 0 && out[id] <= sizes[id], `${id} in ${JSON.stringify({ sizes, n, out })}`);
    }
    if (Math.min(n, available) >= open.length) for (const id of open) assert.ok(out[id] >= 1, `${id} got none: ${JSON.stringify({ sizes, n, out })}`);
  }
});

const Q = (key, domain, kind = 'course', subject = 'sub', topic = '') => ({ key, domain, kind, subject, topic });
const pool = [
  Q('vca:1', 'swine', 'vca', 'vca', 'swine'),
  Q('vca:2', 'swine', 'vca', 'vca', 'swine'),
  Q('swine-clinic:1', 'swine', 'paper', 'swine-clinic', 'herd'),
  Q('swine-clinic:2', 'swine', 'lecture', 'swine-clinic', 'herd'),
  Q('equine-medicine:1', 'equine', 'aligned', 'equine-medicine'),
  Q('equine-medicine:2', 'equine', 'course', 'equine-medicine'),
];
const progress = { q: { 'vca:1': { l: 1 }, 'swine-clinic:1': { l: 0 }, 'equine-medicine:2': { l: 0 } } };
const keys = (list) => list.map((q) => q.key);

test('eligible: source filters', () => {
  assert.deepEqual(keys(eligible(pool, { source: 'vca' }, progress)), ['vca:1', 'vca:2']);
  assert.deepEqual(keys(eligible(pool, { source: 'paper' }, progress)), ['vca:1', 'vca:2', 'swine-clinic:1']);
  assert.equal(eligible(pool, { source: 'all' }, progress).length, pool.length);
  assert.equal(eligible(pool, {}, progress).length, pool.length);
});

test('eligible: status filters read the last answer', () => {
  assert.deepEqual(keys(eligible(pool, { status: 'unseen' }, progress)), ['vca:2', 'swine-clinic:2', 'equine-medicine:1']);
  assert.deepEqual(keys(eligible(pool, { status: 'wrong' }, progress)), ['swine-clinic:1', 'equine-medicine:2']);
  assert.equal(eligible(pool, { status: 'unseen' }).length, pool.length, 'no progress means nothing seen');
});

test('eligible: topics and keys', () => {
  assert.deepEqual(keys(eligible(pool, { topics: ['swine-clinic/herd'] }, progress)), ['swine-clinic:1', 'swine-clinic:2']);
  assert.deepEqual(keys(eligible(pool, { topics: ['equine-medicine/'] }, progress)), ['equine-medicine:1', 'equine-medicine:2']);
  assert.equal(eligible(pool, { topics: [] }, progress).length, pool.length, 'an empty topic list filters nothing');
  assert.deepEqual(keys(eligible(pool, { keys: ['vca:2', 'equine-medicine:1', 'nope:1'] }, progress)), ['vca:2', 'equine-medicine:1']);
  assert.deepEqual(keys(eligible(pool, { source: 'vca', status: 'unseen' }, progress)), ['vca:2'], 'filters combine');
});

test('seededRandom is deterministic for a seed and in [0, 1)', () => {
  const a = seededRandom(42);
  const b = seededRandom(42);
  const xs = Array.from({ length: 50 }, () => a());
  assert.deepEqual(xs, Array.from({ length: 50 }, () => b()));
  for (const x of xs) assert.ok(x >= 0 && x < 1);
  assert.notDeepEqual(xs.slice(0, 5), Array.from({ length: 5 }, seededRandom(43)));
  const unseeded = seededRandom();
  assert.equal(typeof unseeded(), 'number');
});

test('shuffle returns a permutation and leaves the input alone', () => {
  const list = Array.from({ length: 30 }, (_, i) => i);
  const copy = list.slice();
  const out = shuffle(list, seededRandom(1));
  assert.deepEqual(list, copy);
  assert.deepEqual(out.slice().sort((x, y) => x - y), list);
  assert.notDeepEqual(out, list);
});

const big = [
  ...Array.from({ length: 50 }, (_, i) => Q(`a:${i}`, 'a')),
  ...Array.from({ length: 50 }, (_, i) => Q(`b:${i}`, 'b')),
  ...Array.from({ length: 50 }, (_, i) => Q(`c:${i}`, 'c')),
];

test('draw returns n unique questions, the same ones for the same seed', () => {
  const one = draw(big, 20, seededRandom(42));
  const two = draw(big, 20, seededRandom(42));
  assert.equal(one.length, 20);
  assert.equal(new Set(keys(one)).size, 20);
  assert.deepEqual(keys(one), keys(two));
  assert.notDeepEqual(keys(draw(big, 20, seededRandom(41))), keys(one));
  for (const q of one) assert.ok(big.includes(q));
});

test('draw spreads by pool size, or by the weights given', () => {
  const count = (list) => list.reduce((acc, q) => ({ ...acc, [q.domain]: (acc[q.domain] || 0) + 1 }), {});
  const even = count(draw(big, 30, seededRandom(3)));
  assert.deepEqual(even, { a: 10, b: 10, c: 10 });
  const weighted = count(draw(big, 20, seededRandom(3), { a: 1, b: 1, c: 2 }));
  assert.deepEqual(weighted, { a: 5, b: 5, c: 10 });
  assert.equal(draw(big, 500, seededRandom(3)).length, big.length, 'never more than the pool');
  assert.deepEqual(draw([], 10, seededRandom(3)), []);
});
