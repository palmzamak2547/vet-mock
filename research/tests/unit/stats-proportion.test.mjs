// One proportion and Poisson rate intervals [M1-DESIGN.md 7.5]. Pins: R 4.6.0 through webR 0.6.0
// (r/out/proportion.json: prop.test(correct = FALSE) for Wilson, binom.test for Clopper-Pearson,
// Wald and Agresti-Coull written in base R, poisson.test for rates; rparity role). Cross-check:
// SciPy 1.17.1 (crosscheck/scipy-crosscheck.json). Course: 17/179 is course item 107002
// (fixtures/course/epi-course-2026.json). OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proportionCi, poissonRateCi } from '../../src/lib/stats/proportion.js';
import { readJson, close, TOL } from './stats-fixtures.mjs';

const R = readJson('r/out/proportion.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');

// Clopper-Pearson goes through qbeta, an iterative inverse: R's own qbeta and stdlib's agree to far
// better than 1e-6, but the design's rule for iterative values is 1e-6 relative.
const TOL_BY_METHOD = { wilson: TOL.closed, wald: TOL.closed, agrestiCoull: TOL.closed, exact: TOL.iterative };
const METHOD_ID = { wilson: 'wilson', exact: 'exact', wald: 'wald', agrestiCoull: 'agresti-coull' };

test('proportion: R 4.6.0 pins (r/out/proportion.json), every interval', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    if (c.count !== undefined) continue; // rates below
    for (const [m, want] of Object.entries(c.values)) {
      if (m === 'p') { close(proportionCi(c.x, c.n, 'wilson', c.confLevel).value, want, TOL.closed, `${name} p`); continue; }
      const got = proportionCi(c.x, c.n, METHOD_ID[m], c.confLevel);
      // a bound that is exactly 0 or 1 in R must be exactly 0 or 1 here
      want.forEach((w, i) => {
        if (w === 0 || w === 1) assert.equal(got.ci[i], w, `${name} ${m}[${i}] exact end`);
        else close(got.ci[i], w, TOL_BY_METHOD[m], `${name} ${m}[${i}]`);
      });
      n++;
    }
  }
  assert.ok(n >= 30, `only ${n} intervals compared`);
});

test('proportion: Poisson rate intervals match R poisson.test', () => {
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    if (c.count === undefined) continue;
    const got = poissonRateCi(c.count, c.time, c.confLevel);
    close(got.value, c.values.rate, TOL.closed, `${name} rate`);
    c.values.ci.forEach((w, i) => (w === 0 ? assert.equal(got.ci[i], 0) : close(got.ci[i], w, TOL.iterative, `${name} ci[${i}]`)));
    n++;
  }
  assert.equal(n, 3);
});

test('proportion: SciPy cross-check', () => {
  for (const key of ['proportion.17of179', 'proportion.0of20', 'proportion.20of20']) {
    const c = SCIPY[key];
    const [x, n] = key.match(/(\d+)of(\d+)/).slice(1).map(Number);
    for (const m of ['wilson', 'exact', 'wald']) {
      const got = proportionCi(x, n, m, 0.95);
      c[m].forEach((w, i) => close(got.ci[i], w, 1e-9, `SciPy ${key} ${m}[${i}]`));
    }
  }
});

test('proportion: undefined and poor cases carry a reason, never a fake 0', () => {
  const none = proportionCi(0, 0, 'wilson');
  assert.equal(none.value, null);
  assert.deepEqual(none.ci, [null, null]);
  assert.equal(none.reasonKey, 'stats.undefined.noDenominator');
  assert.equal(proportionCi(5, 3, 'exact').reasonKey, 'stats.error.countOutOfRange');
  const wald0 = proportionCi(0, 20, 'wald');
  assert.deepEqual(wald0.ci, [0, 0]);
  assert.equal(wald0.reasonKey, 'stats.note.waldPoor');
  assert.equal(proportionCi(17, 179, 'wilson').reasonKey, undefined);
  assert.throws(() => proportionCi(1, 2, 'jeffreys'));
  assert.equal(poissonRateCi(3, 0).value, null);
});

test('proportion: course numbers (fixtures/course/epi-course-2026.json, items 107002 and 107003)', () => {
  const course = readJson('course/epi-course-2026.json');
  const i2 = course.items.find((i) => i.id === 107002);
  close(proportionCi(i2.input.x, i2.input.n).value, i2.value, TOL.closed, 'course 107002');
  const i3 = course.items.find((i) => i.id === 107003);
  for (const k of ['period', 'point']) close(proportionCi(i3.input[k].x, i3.input[k].n).value, i3.value[k], TOL.closed, `course 107003 ${k}`);
});
