// ROC analysis with the DeLong interval and the paired DeLong comparison [M2-DESIGN.md 3.3.1]. Fixture:
// tests/fixtures/r/out/roc.json (pROC 1.19.0.1 in R 4.6.0 through webR 0.6.0, written by the rparity role
// from tests/fixtures/r/roc.R on 28 Sep 2026; the made-up `roc` data, ข้อมูลสมมุติ / made-up data). This file
// pins what rparity-m2 does not: the Youden cut-offs (every tied threshold), the DeLong covariance, the
// row order of the coordinates and the refusals. AUC, variance, interval and the paired test are pinned
// in rparity-m2.test.mjs as well.
// Injected-wrong-value proof: EPI_INJECT=1 node --test tests/unit/measure-roc.test.mjs must go red.
// OWNER: measure role (written by the integrator in M2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runRoc, delong, delongCovariance, rocCoords, youdenBest } from '../../src/lib/epi/roc.js';
import { close, CLOSED, readFixture } from './epi-fixtures.mjs';
import { makeTable, spec } from './stats-fixtures.mjs';

const doc = readFixture('r/out/roc.json');
const R = doc.datasets.roc;
const cases = (m) => m.filter((_, i) => R.status[i] === 1);
const controls = (m) => m.filter((_, i) => R.status[i] === 0);
const table = () => makeTable({
  ref: { kind: 'category', levels: ['0', '1'], values: R.status.map(String) },
  m1: { kind: 'number', values: R.marker1 },
  m2: { kind: 'number', values: R.marker2 },
});
const run = (roles, options = {}) => runRoc(spec('roc.delong', { roles: { reference: 'ref', ...roles }, levels: { referencePositive: '1' }, options: { direction: 'higher-positive', youden: true, ...options } }), table());

test('marker1: every tied Youden cut-off with its Se and Sp (pROC coords best, youden)', () => {
  const v = doc.cases.marker1.values;
  const out = run({ test: 'm1' });
  assert.equal(out.status, 'ok');
  const y = out.tables.find((t) => t.id === 'youden');
  assert.equal(y.rows.length, v.youdenThresholds.length);
  y.rows.forEach((row, k) => {
    assert.equal(row[0], 'test');
    close(row[1], v.youdenThresholds[k], CLOSED, `threshold ${k + 1}`);
    close(row[2], v.youdenSensitivity[k], CLOSED, `Se ${k + 1}`);
    close(row[3], v.youdenSpecificity[k], CLOSED, `Sp ${k + 1}`);
  });
  close(out.values.youdenIndex.value, v.youdenSensitivity[0] + v.youdenSpecificity[0] - 1, CLOSED, 'Youden J');
  // a cut-off chosen on these animals overstates accuracy (G13)
  assert.ok(out.warnings.some((w) => w.id === 'G13'));
});

test('marker2: the single Youden cut-off', () => {
  const v = doc.cases.marker2.values;
  const y = run({ test: 'm2' }).tables.find((t) => t.id === 'youden');
  assert.equal(y.rows.length, v.youdenThresholds.length);
  close(y.rows[0][1], v.youdenThresholds[0], CLOSED, 'threshold');
  close(y.rows[0][2], v.youdenSensitivity[0], CLOSED, 'Se');
  close(y.rows[0][3], v.youdenSpecificity[0], CLOSED, 'Sp');
});

test('DeLong covariance of the two markers and the paired test (pROC cov, roc.test)', () => {
  const v = doc.cases['paired.delong'].values;
  const a = delong(cases(R.marker1), controls(R.marker1));
  const b = delong(cases(R.marker2), controls(R.marker2));
  close(delongCovariance(a, b), v.covariance, CLOSED, 'covariance');
  const out = run({ test: 'm1', test2: 'm2' });
  const t = out.tests.find((x) => x.id === 'delong');
  close(t.statistic.value, v.z, CLOSED, 'z');
  close(t.p, v.p, CLOSED, 'p');
  close(out.values.aucDifference.value, v.diff, CLOSED, 'difference');
  close(out.values.aucDifference.ci[0], v.diffLower, CLOSED, 'difference lower');
  close(out.values.aucDifference.ci[1], v.diffUpper, CLOSED, 'difference upper');
  close(out.values.auc2.value, doc.cases.marker2.values.auc, CLOSED, 'AUC of the second test');
  // both curves in the coordinate table, each from Se 1 to Se 0
  const c = out.tables.find((x) => x.id === 'coords');
  assert.deepEqual([...new Set(c.rows.map((r) => r[0]))], ['test', 'test2']);
});

test('clipped upper bound is noted; the unclipped bound is what pROC computed before clipping', () => {
  const v = doc.cases.marker1.values;
  const out = run({ test: 'm1' });
  assert.equal(out.values.auc.ci[1], 1);
  assert.ok(v.ciUpperUnclipped > 1);
  const d = delong(cases(R.marker1), controls(R.marker1));
  close(d.auc + 1.959963984540054 * Math.sqrt(d.variance), v.ciUpperUnclipped, CLOSED, 'unclipped upper');
  assert.ok(out.notes.some((n) => n.id === 'aucCiClipped'));
});

test('lower-positive reads the curve the other way and rows still run from Se 1 to Se 0', () => {
  const rows = rocCoords([1, 2], [3, 4], 'lower-positive');
  assert.equal(rows[0].se, 1);
  assert.equal(rows[rows.length - 1].se, 0);
  const up = rocCoords([3, 4], [1, 2], 'higher-positive');
  assert.deepEqual(up.map((r) => [r.se, r.sp]), rows.map((r) => [r.se, r.sp]));
  assert.deepEqual(youdenBest(up, 2, 2).map((r) => r.threshold), [2.5]);
});

test('an AUC below 0.5 is shown as it is, with a note, never flipped', () => {
  const out = run({ test: 'm1' }, { direction: 'lower-positive' });
  assert.ok(out.values.auc.value < 0.5);
  close(out.values.auc.value, 1 - doc.cases.marker1.values.auc, CLOSED, 'AUC read the wrong way round');
  assert.ok(out.notes.some((n) => n.id === 'aucBelowHalf'));
});

test('refusals: no reference level, a text test, one class only', () => {
  const noLevel = runRoc(spec('roc.delong', { roles: { test: 'm1', reference: 'ref' } }), table());
  assert.equal(noLevel.status, 'invalid');
  assert.equal(noLevel.reasonKey, 'measure.error.needReferencePositive');
  const txt = makeTable({ ref: { kind: 'category', levels: ['0', '1'], values: ['0', '1', '1'] }, t: { kind: 'category', levels: ['low', 'high'], values: ['low', 'high', 'high'] } });
  assert.equal(runRoc(spec('roc.delong', { roles: { test: 't', reference: 'ref' }, levels: { referencePositive: '1' } }), txt).reasonKey, 'measure.error.testNotNumber');
  const onlyPos = makeTable({ ref: { kind: 'category', levels: ['0', '1'], values: ['1', '1'] }, t: { kind: 'number', values: [1, 2] } });
  assert.equal(runRoc(spec('roc.delong', { roles: { test: 't', reference: 'ref' }, levels: { referencePositive: '1' } }), onlyPos).reasonKey, 'measure.error.noReferenceNegative');
});

test('one animal in a class: the AUC is shown, the interval is null with its sentence', () => {
  const tb = makeTable({ ref: { kind: 'category', levels: ['0', '1'], values: ['1', '0', '0'] }, t: { kind: 'number', values: [3, 1, 2] } });
  const out = runRoc(spec('roc.delong', { roles: { test: 't', reference: 'ref' }, levels: { referencePositive: '1' } }), tb);
  assert.equal(out.values.auc.value, 1);
  assert.deepEqual(out.values.auc.ci, [null, null]);
  assert.equal(out.values.auc.reasonKey, 'measure.undefined.aucNeedTwoEach');
});
