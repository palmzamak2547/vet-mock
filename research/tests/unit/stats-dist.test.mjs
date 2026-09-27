// Distribution functions [M1-DESIGN.md 7.1]. Pins: R 4.6.0 (fixtures r/out/dist.json, rparity role,
// every function against the R call named in the case) and engine.md's printed hard cases. The
// complement rule is checked directly: the chi-square upper tail at 100 is 1.524e-23, not 0.
// OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as dist from '../../src/lib/stats/dist.js';
import { readJson, close, TOL } from './stats-fixtures.mjs';

const R = readJson('r/out/dist.json');

test('dist: R 4.6.0 pins (r/out/dist.json), every case', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    const fn = dist[c.fn];
    assert.equal(typeof fn, 'function', `${name}: dist.${c.fn} is not exported`);
    close(fn(...c.args), c.values.value, TOL[c.tol] ?? TOL.closed, `R 4.6.0 ${c.call}`);
    n++;
  }
  assert.ok(n >= 60, `expected the full R case list, got ${n}`);
});

// engine.md section 4 and M1-DESIGN.md 7.1, printed values: agreement to the printed digits
const PRINTED = [
  ['pchisqUpper', [3.841459, 1], 0.049999994653, 1e-11],
  ['pchisqUpper', [30, 1], 4.3205e-8, 1e-4],
  ['pchisqUpper', [100, 1], 1.524e-23, 1e-3],
  ['ptTwoSided', [2.1, 8], 0.0689, 1e-3],
  ['ptTwoSided', [6, 3], 0.00927, 1e-3],
  ['ptTwoSided', [15, 30], 1.75e-15, 3e-3],
  ['qt', [0.975, 1], 12.7062, 1e-5],
  ['qt', [0.975, 5], 2.570581835636314, 1e-12],
];

test('dist: engine.md printed hard cases', () => {
  for (const [fn, args, want, rel] of PRINTED) close(dist[fn](...args), want, rel, `engine.md ${fn}(${args.join(', ')})`);
});

test('dist: upper tails come from complements, not 1 - cdf', () => {
  const tiny = dist.pchisqUpper(100, 1);
  assert.ok(tiny > 1e-24 && tiny < 1e-22, `chi-square upper tail at 100 is ${tiny}`);
  assert.equal(1 - dist.pchisqLower(100, 1), 0, 'the naive 1 - cdf underflows to 0, which is why complements are used');
  assert.ok(dist.pnormUpper(37.5) > 0, 'normal upper tail at 37.5 is positive');
  assert.ok(dist.ptUpper(15, 30) > 0 && dist.ptUpper(15, 30) < 1e-14);
  assert.ok(dist.pfUpper(1e6, 1, 50) > 0);
  assert.ok(dist.pbinomUpper(990, 1000, 0.5) > 0);
});

test('dist: edges and symmetry', () => {
  assert.equal(dist.ptUpper(0, 7), 0.5);
  close(dist.ptUpper(-2, 7) + dist.ptUpper(2, 7), 1, 1e-15, 't symmetry');
  assert.equal(dist.pchisqUpper(0, 3), 1);
  assert.equal(dist.pchisqUpper(-1, 3), 1);
  assert.equal(dist.pfUpper(0, 2, 5), 1);
  assert.equal(dist.pbinomLower(-1, 10, 0.3), 0);
  assert.equal(dist.pbinomLower(10, 10, 0.3), 1);
  assert.equal(dist.pbinomUpper(0, 10, 0.3), 1);
  assert.equal(dist.pbinomUpper(11, 10, 0.3), 0);
  assert.ok(Number.isNaN(dist.ptUpper(1, 0)));
  close(dist.ptUpper(1.5, Infinity), dist.pnormUpper(1.5), 1e-15, 't with infinite df is normal');
  // hypergeometric: total probability 1, tails add to 1 + P(X = x)
  let s = 0;
  for (let x = 0; x <= 4; x++) s += dist.dhyper(x, 4, 4, 4);
  close(s, 1, 1e-14, 'dhyper sums to 1');
  close(dist.dhyper(3, 4, 4, 4), 16 / 70, 1e-14, 'dhyper(3, 4, 4, 4) = 16/70 (the tea-tasting table)');
  close(dist.phyperUpper(3, 4, 4, 4), 17 / 70, 1e-14, 'P(X >= 3) = 17/70');
  close(dist.phyperLower(1, 4, 4, 4), 17 / 70, 1e-14, 'P(X <= 1) = 17/70');
  close(dist.dbinom(3, 10, 0.2), 0.201326592, 1e-9, 'dbinom closed form');
});
