// Fisher's exact test for 2x2 [M1-DESIGN.md 7.13]. Pins: R 4.6.0 fisher.test (r/out/fisher.json,
// rparity role). p is a closed sum (1e-10); the conditional MLE and the exact interval come from
// uniroot inside fisher.test, compared within R's own uniroot tolerance
// |js - R| <= 2 * 1.220703125e-4 * max(1, |R|) (M1-DESIGN.md 7 general rules). SciPy 1.17.1 is a
// second implementation that stops its root search elsewhere, so it is compared loosely.
// Closed form: tea p greater = 17/70, two-sided = 34/70. OWNER: stats role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fisher2x2, runFisher } from '../../src/lib/stats/fisher.js';
import { readJson, close, num, TOL, makeTable, spec } from './stats-fixtures.mjs';

const R = readJson('r/out/fisher.json');
const SCIPY = readJson('crosscheck/scipy-crosscheck.json');

function unirootClose(got, want, label) {
  want = num(want);
  if (!Number.isFinite(want)) { assert.equal(got, want, label); return; }
  const lim = 2 * 1.220703125e-4 * Math.max(1, Math.abs(want));
  assert.ok(Math.abs(got - want) <= lim, `${label}: got ${got}, want ${want} (|diff| ${Math.abs(got - want)} > ${lim})`);
}

test('Fisher: R 4.6.0 pins (r/out/fisher.json), p closed, MLE and CI within uniroot tolerance', () => {
  assert.equal(R._fixture.family, 'r-4.6.0');
  let n = 0;
  for (const [name, c] of Object.entries(R.cases)) {
    const got = fisher2x2(c.table, { alternative: c.alternative, confLevel: c.confLevel });
    close(got.p, c.values.p, TOL.closed, `${name} p`);
    unirootClose(got.estimate, c.values.estimate, `${name} estimate`);
    unirootClose(got.ci[0], c.values.ci[0], `${name} ci lower`);
    unirootClose(got.ci[1], c.values.ci[1], `${name} ci upper`);
    n++;
  }
  assert.equal(n, 10);
});

test('Fisher: closed forms and SciPy cross-check', () => {
  const tea = [[3, 1], [1, 3]];
  close(fisher2x2(tea, { alternative: 'greater' }).p, 17 / 70, 1e-12, 'tea greater');
  close(fisher2x2(tea).p, 34 / 70, 1e-12, 'tea two-sided');
  for (const key of ['fisher.tea', 'fisher.zeroCell', 'fisher.serosurvey']) {
    const s = SCIPY[key];
    const got = fisher2x2(s.table);
    close(got.p, s.pTwoSided, 1e-9, `${key} p`);
    close(fisher2x2(s.table, { alternative: 'greater' }).p, s.pGreater, 1e-9, `${key} p greater`);
    const est = num(s.conditionalMLE);
    if (Number.isFinite(est)) close(got.estimate, est, 1e-3, `${key} MLE vs SciPy`);
    else assert.equal(got.estimate, Infinity);
  }
});

test('Fisher: a zero cell gives an Infinity estimate and open bound, never null', () => {
  const r = fisher2x2([[7, 0], [2, 5]]);
  assert.equal(r.estimate, Infinity);
  assert.equal(r.ci[1], Infinity);
  const out = runFisher(spec('test.fisher2x2', { input: { kind: 'counts', counts: { table: [[7, 0], [2, 5]] } } }), null);
  assert.equal(out.status, 'ok');
  assert.equal(out.values.estimate.value, Infinity);
  assert.equal(out.values.estimate.ci[1], Infinity);
  assert.equal(out.tests[0].statistic.value, Infinity);
});

test('Fisher: runFisher on a WorkingTable puts the exposure level and positive outcome first', () => {
  const ex = [];
  const out = [];
  const add = (e, o, k) => { for (let i = 0; i < k; i++) { ex.push(e); out.push(o); } };
  // levels listed reference-first; the spec names the exposure level and the positive outcome
  add('young', 'neg', 209); add('young', 'pos', 27); add('old', 'neg', 364); add('old', 'pos', 116);
  ex.push(null); out.push('pos');
  const table = makeTable({
    ex: { kind: 'category', levels: ['young', 'old'], values: ex },
    out: { kind: 'category', levels: ['neg', 'pos'], values: out },
  });
  const s = spec('test.fisher2x2', { roles: { exposure: 'ex', outcome: 'out' }, levels: { exposureLevel: 'old', outcomePositive: 'pos' } });
  const r = runFisher(s, table);
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.tables[0].rows[0], [116, 364, 27, 209]);
  assert.deepEqual(r.dropped, [{ reason: 'missing', column: 'ex', count: 1 }]);
  const c = R.cases.serosurvey;
  close(r.tests[0].p, c.values.p, TOL.closed, 'runFisher p');
  unirootClose(r.values.estimate.value, c.values.estimate, 'runFisher MLE');
  const three = makeTable({ a: { kind: 'category', levels: ['x', 'y', 'z'], values: ['x', 'y', 'z'] }, b: { kind: 'category', levels: ['p', 'q'], values: ['p', 'q', 'p'] } });
  assert.equal(runFisher(spec('test.fisher2x2', { roles: { exposure: 'a', outcome: 'b' } }), three).status, 'invalid');
});

test('fisher: an empty row or column gives no odds ratio, with a sentence (review round 1)', () => {
  for (const t of [[[0, 0], [5, 5]], [[0, 5], [0, 7]]]) {
    const f = fisher2x2(t);
    assert.equal(f.estimate, null);
    assert.deepEqual(f.ci, [null, null]);
    assert.equal(f.p, 1);
    assert.equal(f.reasonKey, 'stats.undefined.emptyMarginOr');
  }
});
