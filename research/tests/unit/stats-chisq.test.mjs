// Pearson chi-square (Yates as an option) and the test for trend [M1-DESIGN.md 7.12]. Pins: R 4.6.0
// chisq.test and prop.trend.test (r/out/chisq.json, rparity role). Cross-check: SciPy 1.17.1. The
// serosurvey 2x2 also appears in work/research-studio/workspace/numbers.json (check.py).
// OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chisqTest, trendTest, runChisq, runTrend } from '../../src/lib/stats/chisq.js';
import { readJson, close, TOL, makeTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/chisq.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');

test('chi-square and trend: R 4.6.0 pins (r/out/chisq.json), every case', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    if (c.table) {
      const got = chisqTest(c.table, { yates: c.yates });
      close(got.X2, c.values.X2, TOL.closed, `${name} X2`);
      assert.equal(got.df, c.values.df, `${name} df`);
      close(got.p, c.values.p, TOL.closed, `${name} p`);
      close(got.minExpected, c.values.minExpected, TOL.closed, `${name} min E`);
      c.values.expected.forEach((row, i) => row.forEach((e, j) => close(got.expected[i][j], e, TOL.closed, `${name} E[${i}][${j}]`)));
    } else {
      const got = trendTest(c.x, c.n, c.scores);
      close(got.X2, c.values.X2, TOL.closed, `${name} X2`);
      close(got.p, c.values.p, TOL.closed, `${name} p`);
    }
    n++;
  }
  assert.equal(n, 9);
});

test('chi-square: SciPy cross-check', () => {
  const s = SCIPY['chisq.serosurvey2x2'];
  const t = [[116, 364], [27, 209]];
  close(chisqTest(t).X2, s.pearson.X2, 1e-12, 'pearson');
  close(chisqTest(t, { yates: true }).p, s.yates.p, 1e-9, 'yates p');
  const r = SCIPY['chisq.rxc'];
  close(chisqTest(r.table).p, r.p, 1e-9, 'rxc p');
  const tr = SCIPY.trend;
  close(trendTest(tr.x, tr.n, tr.score).X2, tr.X2, 1e-9, 'trend X2');
});

test('chi-square: Yates never applies beyond 2x2; empty margins give null with a reason', () => {
  const t = [[20, 15, 10], [10, 20, 25]];
  assert.equal(chisqTest(t, { yates: true }).X2, chisqTest(t).X2);
  const empty = chisqTest([[0, 0], [3, 4]]);
  assert.equal(empty.X2, null);
  assert.equal(empty.reasonKey, 'stats.undefined.emptyMargin');
  const flat = trendTest([0, 0, 0], [5, 5, 5]);
  assert.equal(flat.X2, null);
  assert.equal(flat.reasonKey, 'stats.undefined.noVariation');
});

test('chi-square: runChisq and runTrend on a WorkingTable (missing rows counted, empty levels left out)', () => {
  // exposure old/young/unused, outcome pos/neg; one row missing the outcome
  const ex = [];
  const out = [];
  const add = (e, o, k) => { for (let i = 0; i < k; i++) { ex.push(e); out.push(o); } };
  add('old', 'pos', 116); add('old', 'neg', 364); add('young', 'pos', 27); add('young', 'neg', 209);
  ex.push('old'); out.push(null);
  const table = makeTable({
    ex: { kind: 'category', levels: ['old', 'young', 'unused'], values: ex },
    out: { kind: 'category', levels: ['pos', 'neg'], values: out },
  });
  const r = runChisq(spec('test.chisq', { roles: { exposure: 'ex', outcome: 'out' } }), table);
  assert.equal(r.status, 'ok');
  assert.equal(r.used, 716);
  assert.deepEqual(r.dropped, [{ reason: 'missing', column: 'out', count: 1 }]);
  assert.deepEqual(r.tables[0].rows, [['old', 116, 364], ['young', 27, 209]]);
  close(r.tests[0].statistic.value, R.cases['serosurvey.pearson'].values.X2, TOL.closed, 'runChisq X2');
  assert.equal(r.tests[0].variant, 'pearsonX2');
  const y = runChisq(spec('test.chisq', { roles: { exposure: 'ex', outcome: 'out' }, options: { yates: true } }), table);
  assert.equal(y.tests[0].variant, 'yates');
  close(y.tests[0].p, R.cases['serosurvey.yates'].values.p, TOL.closed, 'runChisq yates p');

  const tr = runTrend(spec('test.trend', { input: { kind: 'counts', counts: { x: [15, 10, 8, 4], n: [20, 25, 18, 30] } }, options: { scores: [0, 1, 2, 5] } }), null);
  close(tr.tests[0].statistic.value, R.cases['trend.typed'].values.X2, TOL.closed, 'runTrend typed');
  assert.equal(tr.tests[0].variant, 'typedScores');
  const bad = runTrend(spec('test.trend', { input: { kind: 'counts', counts: { x: [1, 2], n: [5, 5] } }, options: { scores: [1, 2, 3] } }), null);
  assert.equal(bad.status, 'invalid');
});
