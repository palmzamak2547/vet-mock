// Agreement [M1-DESIGN.md 7.19]. Fixtures and their sources:
// - scipy-1.17.1: tests/fixtures/crosscheck/scipy-crosscheck.json kappa.threeLevel, kappa.twoByTwo,
//   agreement.course107027 (formulas; the R pin through irr::kappa2 / epiR::epi.kappa is rparity's to add);
// - course-2026: tests/fixtures/course/epi-course-2026.json items 107023 (kappa 0.65 is
//   "substantial" in the course's bands) and 107027 (865/986);
// - the Fleiss-Cohen-Everitt 1969 SE checked against a hand computation of its formula below.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kappa, courseKappaBand, runKappa, runPercentAgreement } from '../../src/lib/epi/kappa.js';
import { spec, readFixture, close, CLOSED } from './epi-fixtures.mjs';

const x = readFixture('crosscheck/scipy-crosscheck.json');
const course = readFixture('course/epi-course-2026.json');

test('3 x 3: po, kappa, linear and quadratic weighted kappa (scipy-1.17.1)', () => {
  const k = x['kappa.threeLevel'];
  const un = kappa(k.table, { weights: 'none' });
  close(un.po.value, k.po, CLOSED, 'po');
  close(un.kappa.value, k.kappa, CLOSED, 'kappa');
  close(kappa(k.table, { weights: 'linear' }).kappa.value, k['kappa.linear'], CLOSED, 'linear');
  close(kappa(k.table, { weights: 'quadratic' }).kappa.value, k['kappa.quadratic'], CLOSED, 'quadratic');
});

test('2 x 2: kappa, PABAK, prevalence and bias indices (scipy-1.17.1 = epiR epi.kappa)', () => {
  const k = x['kappa.twoByTwo'];
  const r = kappa(k.table, {});
  close(r.po.value, k.po, CLOSED, 'po');
  close(r.kappa.value, k.kappa, CLOSED, 'kappa');
  close(r.PABAK.value, k.PABAK, CLOSED, 'PABAK');
  close(r.prevalenceIndex.value, k.prevalenceIndex, CLOSED, 'prevalence index');
  close(r.biasIndex.value, k.biasIndex, CLOSED, 'bias index');
});

test('Fleiss-Cohen-Everitt SE of unweighted kappa equals the textbook closed form', () => {
  const t = [[40, 9], [6, 45]];
  const n = 100;
  const p = t.map((r) => r.map((v) => v / n));
  const r = [p[0][0] + p[0][1], p[1][0] + p[1][1]], c = [p[0][0] + p[1][0], p[0][1] + p[1][1]];
  const po = p[0][0] + p[1][1], pe = r[0] * c[0] + r[1] * c[1];
  const k = (po - pe) / (1 - pe);
  let a = 0;
  for (let i = 0; i < 2; i++) a += p[i][i] * (1 - (r[i] + c[i]) * (1 - k)) ** 2;
  const b = (1 - k) ** 2 * (p[0][1] * (c[0] + r[1]) ** 2 + p[1][0] * (c[1] + r[0]) ** 2);
  const se = Math.sqrt((a + b - (k - pe * (1 - k)) ** 2) / (n * (1 - pe) ** 2));
  const got = kappa(t, { confLevel: 0.95 }).kappa;
  close(got.se, se, CLOSED, 'SE');
  close(got.ci[0], k - 1.959963984540054 * se, 1e-12, 'lower');
});

test('course 107023: kappa 0.65 falls in the course band "substantial"', () => {
  const it = course.items.find((i) => i.id === 107023);
  assert.equal(courseKappaBand(it.input.kappa), it.value);
  assert.equal(courseKappaBand(0.6), 'substantial');
  assert.equal(courseKappaBand(0.5999), 'moderate');
  assert.equal(courseKappaBand(0.8), 'almostPerfect');
  assert.equal(courseKappaBand(-0.1), 'poor');
  assert.equal(courseKappaBand(null), null);
});

test('course 107027: percent agreement 865 of 986 = 87.7%', () => {
  const it = course.items.find((i) => i.id === 107027);
  const out = runPercentAgreement(spec('agree.percent', { kind: 'counts', counts: { agree: it.input.agree, n: it.input.n } }));
  close(out.values.percentAgreement.value, it.value, CLOSED, 'po');
  close(out.values.percentAgreement.value, x['agreement.course107027'].po, CLOSED, 'SciPy');
  assert.equal((out.values.percentAgreement.value * 100).toFixed(1), '87.7');
  assert.ok(out.values.percentAgreement.ci[0] < it.value && out.values.percentAgreement.ci[1] > it.value);
});

test('two rater columns build the k x k table in level order', () => {
  const table = {
    rowIds: ['r1', 'r2', 'r3', 'r4', 'r5'], n: 5, recipeRev: 1, excluded: {}, fingerprint: 't',
    columns: {
      a: { key: 'a', kind: 'category', levels: ['mild', 'severe'], values: Int32Array.from([0, 0, 1, 1, -1]), missing: Uint8Array.from([0, 0, 0, 0, 2]) },
      b: { key: 'b', kind: 'category', levels: ['mild', 'moderate', 'severe'], values: Int32Array.from([0, 1, 2, 2, 0]), missing: new Uint8Array(5) },
    },
  };
  const out = runKappa(spec('agree.kappa', { kind: 'dataset', datasetId: 'd', recipeRev: 1 }, { roles: { raterA: 'a', raterB: 'b' }, levels: { order: ['mild', 'moderate', 'severe'] }, options: { weights: 'linear' } }), table);
  assert.equal(out.status, 'ok');
  assert.deepEqual(out.tables[0].columns, ['raterA', 'mild', 'moderate', 'severe']);
  assert.deepEqual(out.tables[0].rows.map((r) => r.slice(1)), [[1, 1, 0], [0, 0, 0], [0, 0, 2]]);
  assert.equal(out.used, 4);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'a', count: 1 }]);
});

test('kappa is null with a reason when chance agreement is 100%', () => {
  const r = kappa([[10, 0], [0, 0]], {});
  assert.equal(r.kappa.value, null);
  assert.equal(r.kappa.reasonKey, 'epi.undefined.kappaChanceIsOne');
});
