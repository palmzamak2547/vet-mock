// Properties every list must have whatever the seed [M2-DESIGN.md 7]: every complete block balanced in
// the arm ratio, every blinding code unique and made of the look-alike-free alphabet, and over 10,000
// seeds each arm's share of a unit position within binomial limits. Also the settings the method
// refuses, each with a sentence. OWNER: ui-tools role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRandomisation, drawList, runRandomisation, CODE_ALPHABET } from '../../src/lib/plan/randomise.js';
import { largestRemainder, runSampling } from '../../src/lib/plan/sampling.js';

const settings = (params, options) => {
  const c = checkRandomisation(params, options);
  assert.ok(c.ok, JSON.stringify(c));
  return c;
};

test('every complete block holds each arm in its ratio (1000 seeds, sizes 4, 8 and 12, ratio 2:1:1)', () => {
  for (let seed = 0; seed < 1000; seed += 1) {
    const { units } = drawList(settings({ n: 60, arms: ['A', 'B', 'C'], ratio: [2, 1, 1], seed }, { scheme: 'block', blockSizes: [4, 8, 12], blinding: false }));
    const blocks = new Map();
    for (const u of units) {
      if (!blocks.has(u.block)) blocks.set(u.block, []);
      blocks.get(u.block).push(u.arm);
    }
    const all = [...blocks.values()];
    for (const arms of all.slice(0, -1)) {
      const a = arms.filter((x) => x === 'A').length;
      const b = arms.filter((x) => x === 'B').length;
      const c = arms.filter((x) => x === 'C').length;
      assert.equal(a, 2 * b, `seed ${seed}`);
      assert.equal(b, c, `seed ${seed}`);
      assert.ok([4, 8, 12].includes(arms.length));
    }
    assert.equal(units.length, 60);
  }
});

test('blinding codes are unique, four letters from the alphabet and two digits', () => {
  const re = new RegExp(`^[${CODE_ALPHABET}]{4}[0-9]{2}$`);
  for (let seed = 0; seed < 50; seed += 1) {
    const { units } = drawList(settings({ n: 2000, arms: ['A', 'B'], seed }, { scheme: 'block', blockSizes: [2, 4], blinding: true }));
    const codes = units.map((u) => u.code);
    assert.equal(new Set(codes).size, codes.length);
    for (const c of codes) assert.match(c, re);
  }
  assert.equal(CODE_ALPHABET.length, 19);
  for (const lookAlike of 'BGIOQSZ') assert.ok(!CODE_ALPHABET.includes(lookAlike));
});

test('over 10,000 seeds each arm takes its share of a unit position within binomial limits', () => {
  const N = 10000;
  let simpleB = 0;
  let blockA = 0;
  for (let seed = 0; seed < N; seed += 1) {
    const s = drawList(settings({ n: 3, arms: ['A', 'B'], ratio: [1, 2], seed }, { scheme: 'simple', blinding: false }));
    if (s.units[0].arm === 'B') simpleB += 1;
    const b = drawList(settings({ n: 4, arms: ['A', 'B'], seed: seed * 7 + 1 }, { scheme: 'block', blockSizes: [4], blinding: false }));
    if (b.units[1].arm === 'A') blockA += 1;
  }
  const within = (count, p) => Math.abs(count - N * p) < 4.5 * Math.sqrt(N * p * (1 - p));
  assert.ok(within(simpleB, 2 / 3), `simple 1:2, arm B at unit 1: ${simpleB}`);
  assert.ok(within(blockA, 1 / 2), `block of 4, arm A at unit 2: ${blockA}`);
});

test('a stratified list keeps each stratum its own block sequence and size', () => {
  const { units } = drawList(settings({ strata: ['farm 1', 'farm 2'], strataN: [9, 5], arms: ['T', 'C'], seed: 3 }, { scheme: 'stratified-block', blockSizes: [2, 4], blinding: false }));
  assert.equal(units.filter((u) => u.stratum === 'farm 1').length, 9);
  assert.equal(units.filter((u) => u.stratum === 'farm 2').length, 5);
  assert.deepEqual(units.map((u) => u.unit), Array.from({ length: 14 }, (_, i) => i + 1));
  assert.equal(units.find((u) => u.stratum === 'farm 2').block, 1, 'block numbers restart in each stratum');
});

test('settings the method refuses, each with its sentence key', () => {
  const base = { n: 10, arms: ['A', 'B'], seed: 1 };
  const bad = (params, options) => checkRandomisation(params, options).key;
  assert.equal(bad({ ...base, arms: ['A'] }, {}), 'tools.invalid.armCount');
  assert.equal(bad({ ...base, arms: ['A', 'A'] }, {}), 'tools.invalid.armNames');
  assert.equal(bad({ ...base, ratio: [1, 0] }, {}), 'tools.invalid.ratio');
  assert.equal(bad({ ...base, n: 0 }, {}), 'tools.invalid.units');
  assert.equal(bad({ ...base, n: 10001 }, {}), 'tools.invalid.units');
  assert.equal(bad({ ...base, ratio: [2, 1] }, { scheme: 'block', blockSizes: [4] }), 'tools.invalid.blockMultiple');
  assert.equal(bad({ ...base, seed: -3 }, {}), 'tools.invalid.seed');
  assert.equal(bad({ ...base, seed: 2 ** 32 }, {}), 'tools.invalid.seed');
  assert.equal(bad(base, { scheme: 'stratified-block', blockSizes: [2] }), 'tools.invalid.strata');
  assert.equal(bad({ ...base, strata: ['x', 'x'], strataN: [2, 2] }, { scheme: 'stratified-block', blockSizes: [2] }), 'tools.invalid.strataNames');
  const out = runRandomisation({ input: { kind: 'params', params: { ...base, arms: ['A'] } }, options: {} }, null);
  assert.equal(out.status, 'invalid');
  assert.equal(out.values.units.value, null);
  assert.equal(out.values.units.reasonKey, 'tools.invalid.armCount');
});

test('largest remainder: sums to n, ties to the earlier stratum', () => {
  assert.deepEqual(largestRemainder([13, 9, 6], 9), [4, 3, 2]);
  assert.deepEqual(largestRemainder([1, 1, 1], 7), [3, 2, 2]);
  assert.deepEqual(largestRemainder([1, 1, 1, 1], 2), [1, 1, 0, 0]);
  for (let n = 1; n < 40; n += 1) assert.equal(largestRemainder([5, 17, 3, 11], n).reduce((a, b) => a + b, 0), n);
});

test('sampling refuses a size larger than the frame and says how large the frame is', () => {
  const table = { rowIds: ['r1', 'r2', 'r3'], n: 3, excluded: { r2: 's3' }, columns: {} };
  const out = runSampling({ roles: {}, options: { scheme: 'simple', size: 3, seed: 1 } }, table);
  assert.equal(out.status, 'invalid');
  assert.equal(out.values.frame.value, 2, 'an excluded row is not in the frame');
  const ok = runSampling({ roles: {}, options: { scheme: 'simple', size: 2, seed: 1 } }, table);
  assert.deepEqual(ok.tables[0].rows.map((r) => r[0]).sort(), ['r1', 'r3']);
});
