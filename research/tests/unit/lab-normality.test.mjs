// Diagnostics [M2-DESIGN.md 3.1.5]: Shapiro-Wilk (R shapiro.test, Royston 1995 AS R94) including the exact
// n = 3 branch, the 4..11 and the >= 12 polynomials and a tied sample; Q-Q points (R qqnorm) for n <= 10 and
// n > 10; Brown-Forsythe and Levene. Every run carries the sentence that the check never switches the test.
// Pins: R 4.6.0 (lab-fixtures.mjs). OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shapiroWilk, qqPoints, brownForsythe, runShapiro, runBrownForsythe } from '../../src/lib/stats/normality.js';
import { close, TOL, groupsTable, makeTable, spec } from './stats-fixtures.mjs';
import { THREE, TWO, QUANTILES, ROUNDING, DIAG } from './lab-fixtures.mjs';

const tol = TOL.closed;
const three = [THREE.A, THREE.B, THREE.C];
const resid = three.flatMap((g) => { const m = g.reduce((a, b) => a + b, 0) / g.length; return g.map((v) => v - m); });
const rt1 = ROUNDING.map((r) => r[0]);

test('Shapiro-Wilk: R shapiro.test W and p', () => {
  for (const [name, x] of [['g1', TWO.g1], ['g2', TWO.g2], ['quantiles', QUANTILES], ['threeResid', resid], ['n3', [1, 2, 4]], ['rt1', rt1]]) {
    const r = shapiroWilk(x);
    close(r.W, DIAG.shapiro[name].W, tol, `${name} W`);
    close(r.p, DIAG.shapiro[name].p, tol, `${name} p`);
  }
});

test('Shapiro-Wilk outside 3..5000 or with no spread gives null', () => {
  assert.equal(shapiroWilk([1, 2]), null);
  assert.equal(shapiroWilk([3, 3, 3, 3]), null);
  assert.equal(shapiroWilk(Array.from({ length: 5001 }, (_, i) => i)), null);
});

test('Q-Q points: R qqnorm in data order, n <= 10 and n > 10', () => {
  qqPoints(TWO.g1).theoretical.forEach((v, i) => close(v, DIAG.qqG1[i], tol, `g1 ${i}`));
  qqPoints(rt1).theoretical.forEach((v, i) => close(v, DIAG.qqRt1[i], tol, `rt1 ${i}`));
  assert.deepEqual(qqPoints(TWO.g1).sample, TWO.g1);
});

test('Brown-Forsythe (median) and Levene (mean) on three', () => {
  const bf = brownForsythe(three, 'median');
  close(bf.F, DIAG.brownForsythe.F, tol, 'BF F');
  close(bf.p, DIAG.brownForsythe.p, tol, 'BF p');
  assert.deepEqual([bf.df1, bf.df2], [2, 15]);
  const lv = brownForsythe(three, 'mean');
  close(lv.F, DIAG.levene.F, tol, 'Levene F');
  close(lv.p, DIAG.levene.p, tol, 'Levene p');
});

test('runShapiro: residuals (one test) and groups (one per group), with the Q-Q table and the sentence', () => {
  const t = groupsTable(THREE);
  const r = runShapiro(spec('diag.shapiro', { roles: { outcome: 'y', group: 'g' }, options: { on: 'residuals' } }), t);
  assert.equal(r.status, 'ok');
  assert.equal(r.tests.length, 1);
  close(r.tests[0].statistic.value, DIAG.shapiro.threeResid.W, tol, 'residual W');
  close(r.tests[0].p, DIAG.shapiro.threeResid.p, tol, 'residual p');
  assert.equal(r.tables.find((x) => x.id === 'qq').rows.length, 18);
  assert.ok(r.notes.some((n) => n.key === 'lab.note.diagnosticOnly'));
  const g = runShapiro(spec('diag.shapiro', { roles: { outcome: 'y', group: 'g' }, options: { on: 'groups' } }), groupsTable({ g1: TWO.g1, g2: TWO.g2 }));
  assert.deepEqual(g.tests.map((x) => x.variant), ['group:g1', 'group:g2']);
  close(g.tests[0].p, DIAG.shapiro.g1.p, tol, 'group g1 p');
  close(g.tests[1].p, DIAG.shapiro.g2.p, tol, 'group g2 p');
  // no group: the values themselves (W does not change with a shift)
  const one = runShapiro(spec('diag.shapiro', { roles: { outcome: 'y' } }), makeTable({ y: { kind: 'number', values: QUANTILES } }));
  close(one.tests[0].p, DIAG.shapiro.quantiles.p, tol, 'one sample p');
  // a group of two cannot be tested: null with the sentence, never 0
  const small = runShapiro(spec('diag.shapiro', { roles: { outcome: 'y', group: 'g' }, options: { on: 'groups' } }), groupsTable({ a: [1, 2], b: [1, 2, 4] }));
  assert.equal(small.tests[0].p, null);
  assert.equal(small.tests[0].reasonKey, 'lab.undefined.shapiroN');
  close(small.tests[1].p, DIAG.shapiro.n3.p, tol, 'n = 3 exact p');
});

test('runBrownForsythe: F on the absolute deviations, centres printed, the sentence under it', () => {
  const r = runBrownForsythe(spec('diag.brownForsythe', { roles: { outcome: 'y', group: 'g' } }), groupsTable(THREE));
  assert.equal(r.status, 'ok');
  close(r.tests[0].statistic.value, DIAG.brownForsythe.F, tol, 'F');
  assert.deepEqual(r.tests[0].dfPair, [2, 15]);
  assert.deepEqual(r.tables[0].rows.map((x) => x[2]), [24, 29.5, 27]);
  assert.ok(r.notes.some((n) => n.key === 'lab.note.diagnosticOnly'));
  const lv = runBrownForsythe(spec('diag.brownForsythe', { roles: { outcome: 'y', group: 'g' }, options: { center: 'mean' } }), groupsTable(THREE));
  close(lv.tests[0].p, DIAG.levene.p, tol, 'Levene p');
});
