// Farm route 'robust': cluster-robust standard errors for the GLMs as sandwich::vcovCL(fit, cluster = ~farm)
// [M2-DESIGN.md 3.2.2]. Pin: the serosurvey (made-up data) rows with a known age and vaccine answer, 670 cows
// on 49 farms, pos ~ age24 + vacNo + herd; R 4.6.0, sandwich 3.1.1, values in M2-DESIGN.md 3.2.2. The rows are
// read from the committed CSV with check.py's rules (models-fixtures.mjs). OWNER: models role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitGlm, runLogistic } from '../../src/lib/models/glm.js';
import { clusterRobustVcov } from '../../src/lib/models/robust.js';
import { makeTable, spec, near, nearAll, serosurveyRows } from './models-fixtures.mjs';

const TOL = { rel: 1e-6 };
const R = {
  B: [-1.2399476033053185, 0.9424636331977192, -0.32221018767534881, -0.018270420443850171],
  modelSE: [0.33800373824495417, 0.23757769837614479, 0.25966664183101812, 0.0066046240653819871],
  dev: 648.10943271047802,
  HC0: [0.31996387430171991, 0.23472541740711333, 0.33635775445723487, 0.0065955115084228464],
  HC0noAdj: [0.31668210678694814, 0.23231791358681853, 0.33290784013697594, 0.0065278634482820661],
  HC1: [0.32068370395009155, 0.23525348425542439, 0.33711446577236753, 0.0066103495733147105],
};

const d = serosurveyRows().filter((r) => r.age !== null && (r.vaccine === 'ฉีด' || r.vaccine === 'ไม่ฉีด'));

test('serosurvey rows: 670 cows with a known age and vaccine answer on 49 farms', () => {
  assert.equal(d.length, 670);
  assert.equal(new Set(d.map((r) => r.farm)).size, 49);
});

test('sandwich::vcovCL HC0 (with and without G / (G - 1)) and HC1 on the serosurvey logistic model', () => {
  const n = d.length;
  const X = [new Float64Array(n).fill(1), Float64Array.from(d, (r) => (r.age >= 24 ? 1 : 0)), Float64Array.from(d, (r) => (r.vaccine === 'ไม่ฉีด' ? 1 : 0)), Float64Array.from(d, (r) => r.herd)];
  const y = Float64Array.from(d, (r) => r.pos);
  const f = fitGlm(X, y, 'binomial');
  nearAll(f.beta, R.B, TOL, 'B');
  nearAll(f.vcov.map((row, i) => Math.sqrt(row[i])), R.modelSE, TOL, 'model SE');
  near(f.deviance, R.dev, TOL, 'deviance');
  const ids = new Map();
  const cluster = d.map((r) => { if (!ids.has(r.farm)) ids.set(r.farm, ids.size); return ids.get(r.farm); });
  const fit = { X, y, fitted: f.fitted, family: 'binomial', bread: f.vcov, workingWeights: f.workingWeights, workingResiduals: f.workingResiduals };
  const se = (V) => V.map((row, i) => Math.sqrt(row[i]));
  nearAll(se(clusterRobustVcov(fit, cluster)), R.HC0, TOL, 'HC0 with G/(G-1)');
  nearAll(se(clusterRobustVcov(fit, cluster, { cadjust: false })), R.HC0noAdj, TOL, 'HC0 without the adjustment');
  nearAll(se(clusterRobustVcov(fit, cluster, { type: 'HC1' })), R.HC1, TOL, 'HC1');
});

test('runLogistic on the robust route: robust SE, Wald intervals forced with a note, no LR tests', () => {
  const t = makeTable({
    farm: { kind: 'category', levels: [...new Set(d.map((r) => r.farm))], values: d.map((r) => r.farm) },
    pos: { kind: 'number', values: d.map((r) => r.pos) },
    age24: { kind: 'number', values: d.map((r) => (r.age >= 24 ? 1 : 0)) },
    vacNo: { kind: 'number', values: d.map((r) => (r.vaccine === 'ไม่ฉีด' ? 1 : 0)) },
    herd: { kind: 'number', values: d.map((r) => r.herd) },
  });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'pos', covariates: ['age24', 'vacNo', 'herd'] }, options: { ciMethod: 'profile' }, cluster: { route: 'robust', column: 'farm' } }), t);
  assert.equal(out.status, 'ok');
  const coef = out.tables.find((x) => x.id === 'coefficients').rows;
  coef.forEach((r, j) => {
    near(r[1], R.B[j], TOL, `B ${j}`);
    near(r[2], R.HC0[j], TOL, `robust SE ${j}`);
    near(r[5], R.B[j] - 1.959963984540054 * R.HC0[j], TOL, `Wald lower ${j}`);
  });
  assert.equal(out.resolvedOptions.ciMethod, 'wald');
  assert.equal(out.values.clusters.value, 49);
  assert.ok(out.notes.some((x) => x.key === 'models.note.robustWald'));
  assert.ok(out.tests.every((x) => x.id.startsWith('wald:') && x.variant === 'wald-robust'), 'Wald z tests only');
  assert.ok(!out.tables.some((x) => x.id === 'lrTests'));
});

test('the robust route without a farm column is refused', () => {
  const t = makeTable({ y: { kind: 'number', values: [0, 1, 0, 1] }, x: { kind: 'number', values: [1, 2, 3, 4] } });
  const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] }, cluster: { route: 'robust', column: null } }), t);
  assert.equal(out.values.reason.reasonKey, 'models.error.needCluster');
});
