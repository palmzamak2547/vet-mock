// t-tests [M1-DESIGN.md 7.6]. Pins: R 4.6.0 t.test (r/out/ttest.json, rparity role): Welch, pooled,
// paired, one-sample, one-sided and 90% cases. Cross-check: SciPy 1.17.1 (crosscheck tTest.*).
// OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tTest, runTTest } from '../../src/lib/stats/ttest.js';
import { readJson, close, TOL, makeTable, groupsTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/ttest.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');
const D = SCIPY.datasets;

const CASES = {
  welch: [D.two.g1, D.two.g2, { variant: 'welch' }],
  pooled: [D.two.g1, D.two.g2, { variant: 'pooled' }],
  paired: [D.paired.before, D.paired.after, { variant: 'paired' }],
  oneSample: [D.two.g1, null, { variant: 'one-sample', mu: 5.5 }],
  'welch.less': [D.two.g1, D.two.g2, { variant: 'welch', alternative: 'less' }],
  'pooled.greater': [D.two.g1, D.two.g2, { variant: 'pooled', alternative: 'greater' }],
  'paired.90': [D.paired.before, D.paired.after, { variant: 'paired', confLevel: 0.9 }],
  'welch.threeAB': [D.three.A, D.three.B, { variant: 'welch' }],
};

test('t-test: R 4.6.0 pins (r/out/ttest.json), every case', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  for (const [name, c] of Object.entries(R.cases)) {
    const args = CASES[name];
    assert.ok(args, `no inputs for R case ${name}`);
    const r = tTest(args[0], args[1], { mu: 0, alternative: 'two.sided', confLevel: 0.95, ...args[2] });
    const v = c.values;
    const tol = TOL[c.tol] ?? TOL.closed;
    close(r.t, v.t, tol, `R ${c.call} t`);
    close(r.df, v.df, tol, `R ${c.call} df`);
    close(r.p, v.p, tol, `R ${c.call} p`);
    close(r.estimate, v.estimate, tol, `R ${c.call} estimate`);
    close(r.se, v.se, tol, `R ${c.call} se`);
    close(r.ci[0], v.ci[0], tol, `R ${c.call} ci lower`);
    close(r.ci[1], v.ci[1], tol, `R ${c.call} ci upper`);
  }
});

test('t-test: SciPy cross-check', () => {
  for (const [key, variant] of [['tTest.welch', 'welch'], ['tTest.pooled', 'pooled']]) {
    const c = SCIPY[key];
    const r = tTest(D.two.g1, D.two.g2, { variant, mu: 0, alternative: 'two.sided', confLevel: 0.95 });
    close(r.t, c.t, 1e-9, `scipy ${key} t`);
    close(r.p, c.p, 1e-9, `scipy ${key} p`);
    close(r.ci[0], c.ci[0], 1e-9, `scipy ${key} ci`);
  }
  const c = SCIPY['tTest.paired'];
  const r = tTest(D.paired.before, D.paired.after, { variant: 'paired', mu: 0, alternative: 'two.sided', confLevel: 0.95 });
  close(r.t, c.t, 1e-9, 'scipy paired t');
  close(r.ci[1], c.ci[1], 1e-9, 'scipy paired ci');
});

test('t-test: undefined results are null with a reason, never 0', () => {
  const same = tTest([5, 5, 5], [5, 5, 5], { variant: 'welch', mu: 0, alternative: 'two.sided', confLevel: 0.95 });
  assert.equal(same.t, null);
  assert.equal(same.p, null);
  assert.ok(same.reasonKey.startsWith('stats.undefined.'));
  const tiny = tTest([1], [2, 3], { variant: 'welch', mu: 0, alternative: 'two.sided', confLevel: 0.95 });
  assert.equal(tiny.p, null);
  assert.equal(tiny.reasonKey, 'stats.undefined.needTwoPerGroup');
});

test('t-test: runTTest on a WorkingTable (first level minus second, as R formula)', () => {
  const t = groupsTable({ g1: D.two.g1, g2: D.two.g2 });
  const out = runTTest(spec('test.tTest', { roles: { outcome: 'y', group: 'g' }, options: { variant: 'welch', mu: 0 } }), t);
  assert.equal(out.status, 'ok');
  close(out.tests[0].statistic.value, R.cases.welch.values.t, TOL.closed, 'runTTest t');
  close(out.values.estimate.ci[1], R.cases.welch.values.ci[1], TOL.closed, 'runTTest ci');
  assert.equal(out.tests[0].variant, 'welch');
  assert.deepEqual(out.tables[0].rows[0], ['g1', 'g2']);
  const pt = makeTable({ a: { kind: 'number', values: [...D.paired.before, 1] }, b: { kind: 'number', values: [...D.paired.after, null] } });
  const po = runTTest(spec('test.tTest', { roles: { x: 'a', y: 'b' }, options: { variant: 'paired', mu: 0 } }), pt);
  close(po.tests[0].p, R.cases.paired.values.p, TOL.closed, 'runTTest paired p');
  assert.deepEqual(po.dropped, [{ reason: 'missing', column: 'b', count: 1 }]);
  const three = runTTest(spec('test.tTest', { roles: { outcome: 'y', group: 'g' }, options: { variant: 'welch' } }), groupsTable({ a: [1, 2], b: [3, 4], c: [5, 6] }));
  assert.equal(three.status, 'invalid');
});
