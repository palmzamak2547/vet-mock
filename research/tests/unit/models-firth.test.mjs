// Firth's penalised likelihood logistic regression [M3-DESIGN.md 3.2.1, C9]: reg.logistic with options.method
// 'firth'. Pins: tests/fixtures/r/out/firth.json, logistf 1.26.1 in R 4.6.0 (webR 0.6.0) with 1e-12 controls, on
// sex2 (Heinze and Schemper 2002) and sep (M2's made-up separation data): coefficients, SE, profile penalised
// likelihood intervals, penalised likelihood ratio p-values, the penalised log-likelihoods of the model and of
// the intercept alone, Wald intervals and p (pl = FALSE), and drop1's term test. Iterative tolerance 1e-6
// relative (fixture `tol`). MODELS_INJECT=1 shifts every pinned number (models-fixtures.mjs): each pin test must
// then fail. OWNER: models role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitFirth, firthProfileCi, firthTest } from '../../src/lib/models/firth.js';
import { runLogistic } from '../../src/lib/models/glm.js';
import { readJson } from './stats-fixtures.mjs';
import { makeTable, spec, near, nearAll, same } from './models-fixtures.mjs';

const FX = readJson('r/out/firth.json');
const TOL = { rel: 1e-6 };
const VARS = ['age', 'oc', 'vic', 'vicl', 'vis', 'dia'];

const sex2 = (() => {
  const d = FX.datasets.sex2;
  const n = d.case.length;
  const cols = { case: { kind: 'number', values: d.case } };
  for (const k of VARS) cols[k] = { kind: 'number', values: d[k] };
  return { n, X: [new Float64Array(n).fill(1), ...VARS.map((k) => Float64Array.from(d[k]))], y: Float64Array.from(d.case), table: makeTable(cols) };
})();

const sep = (() => {
  const d = FX.datasets.sep;
  const n = d.y.length;
  return {
    X: [new Float64Array(n).fill(1), Float64Array.from(d.x, (x) => (x === 'b' ? 1 : 0)), Float64Array.from(d.x, (x) => (x === 'c' ? 1 : 0))],
    y: Float64Array.from(d.y),
    table: makeTable({ y: { kind: 'number', values: d.y }, x: { kind: 'category', levels: ['a', 'b', 'c'], values: d.x } }),
  };
})();

const firth = (table, roles, ciMethod = 'profile', extra = {}) => runLogistic(spec('reg.logistic', { roles, options: { ciMethod, method: 'firth' }, ...extra }), table);

test('fixture shape: the cases and names this test reads', () => {
  assert.deepEqual(FX._fixture.methods, ['reg.logistic']);
  assert.deepEqual(FX.cases.sex2.values.names, ['(Intercept)', ...VARS]);
  assert.deepEqual(FX.cases.separation.values.names, ['(Intercept)', 'xb', 'xc']);
  assert.equal(FX.cases.sex2.tol, 'iterative');
  assert.equal(sex2.n, 239);
});

test('sex2: the penalised fit matches logistf (coefficients, SE, penalised log-likelihoods)', () => {
  const v = FX.cases.sex2.values;
  const f = fitFirth(sex2.X, sex2.y);
  assert.ok(f.converged);
  nearAll(f.beta, v.coef, TOL, 'coef');
  nearAll(f.se, v.se, TOL, 'SE');
  near(f.logLik, v.loglik[0], TOL, 'loglik full');
  near(firthTest(f, [1, 2, 3, 4, 5, 6]).logLik0, v.loglik[1], TOL, 'loglik null (intercept alone, the full penalty)');
  // Heinze and Schemper's published coefficients to the 5 decimals the paper prints (M3-DESIGN.md 4.2)
  const published = [0.12025, -1.10598, -0.06882, 2.26887, -2.11141, -0.78832, 3.09601];
  f.beta.forEach((b, j) => assert.ok(Math.abs(b - published[j]) < 5e-6, `published ${j}: ${b}`));
});

test('sex2: profile penalised likelihood intervals and penalised likelihood ratio p-values as logistf', () => {
  const v = FX.cases.sex2.values;
  const f = fitFirth(sex2.X, sex2.y);
  for (let j = 0; j < 7; j++) {
    const [lo, hi] = firthProfileCi(f, j, 0.95);
    near(lo, v.lower[j], TOL, `lower ${j}`);
    near(hi, v.upper[j], TOL, `upper ${j}`);
    near(firthTest(f, [j]).p, v.p[j], TOL, `p ${j}`);
  }
});

test('sex2 through runLogistic (method firth, profile): table, odds ratios, tests, values', () => {
  const v = FX.cases.sex2.values;
  const out = firth(sex2.table, { outcome: 'case', covariates: VARS });
  assert.equal(out.status, 'ok');
  assert.equal(out.used, 239);
  const coef = out.tables.find((t) => t.id === 'coefficients');
  assert.equal(coef.columns[3], 'models.col.plrStat');
  assert.deepEqual(coef.rows.map((r) => r[0]), ['(Intercept)', ...VARS]);
  coef.rows.forEach((r, j) => {
    near(r[1], v.coef[j], TOL, `B ${j}`);
    near(r[2], v.se[j], TOL, `SE ${j}`);
    near(r[4], v.p[j], TOL, `p ${j}`);
    near(r[5], v.lower[j], TOL, `lower ${j}`);
    near(r[6], v.upper[j], TOL, `upper ${j}`);
    if (j) {
      near(r[7], Math.exp(v.coef[j]), TOL, `OR ${j}`);
      near(r[8], Math.exp(v.lower[j]), TOL, `OR lower ${j}`);
      near(r[9], Math.exp(v.upper[j]), TOL, `OR upper ${j}`);
    } else assert.equal(r[7], null);
  });
  assert.equal(Object.keys(out.values)[0], 'oddsRatio:age');
  near(out.values['oddsRatio:dia'].value, Math.exp(v.coef[6]), TOL, 'OR dia');
  nearAll(out.values['oddsRatio:dia'].ci, [Math.exp(v.lower[6]), Math.exp(v.upper[6])], TOL, 'OR dia ci');
  assert.equal(out.values['b:dia'].ciMethod, 'profile-penalised');
  near(out.values['b:dia'].se, v.se[6], TOL, 'b dia se');
  near(out.values.logLikPenalised.value, v.loglik[0], TOL, 'penalised loglik');
  near(out.values.logLikPenalisedNull.value, v.loglik[1], TOL, 'penalised loglik null');
  // logistf's likelihood ratio test: 2 (loglik['full'] - loglik['null']) on 6 df
  const all = out.tests.find((t) => t.id === 'lrNull');
  near(all.statistic.value, 2 * (v.loglik[0] - v.loglik[1]), TOL, 'model PLR');
  same(all.df, 6, 'model PLR df');
  assert.equal(all.variant, 'plr');
  // one term per number: drop1's test is the coefficient's own penalised LR test
  VARS.forEach((k, i) => {
    const t = out.tests.find((x) => x.id === `lr:${k}`);
    near(t.p, v.p[i + 1], TOL, `term ${k}`);
    same(t.df, 1, `term df ${k}`);
  });
  assert.ok(!out.tests.some((t) => t.id.startsWith('wald:')), 'profile mode: no Wald tests');
  assert.deepEqual(out.tests.map((t) => t.id), ['lrNull', ...VARS.map((k) => `lr:${k}`)]);
  assert.ok(out.notes.some((x) => x.key === 'models.note.firth'));
  same(out.values.cases.value, 130, 'cases');
});

test('sex2 Wald variant (logistf pl = FALSE): intervals, z tests and p as logistf', () => {
  const v = FX.cases.sex2.values;
  const out = firth(sex2.table, { outcome: 'case', covariates: VARS }, 'wald');
  const coef = out.tables.find((t) => t.id === 'coefficients');
  assert.equal(coef.columns[3], 'models.col.z');
  coef.rows.forEach((r, j) => {
    near(r[3], v.coef[j] / v.se[j], TOL, `z ${j}`);
    near(r[4], v.waldP[j], TOL, `Wald p ${j}`);
    near(r[5], v.waldLower[j], TOL, `Wald lower ${j}`);
    near(r[6], v.waldUpper[j], TOL, `Wald upper ${j}`);
  });
  ['(Intercept)', ...VARS].forEach((term, j) => near(out.tests.find((t) => t.id === `wald:${term}`).p, v.waldP[j], TOL, `wald test ${term}`));
  assert.equal(out.values['b:age'].ciMethod, 'wald');
  assert.ok(out.notes.some((x) => x.key === 'models.note.firthWald'));
});

test('sep: finite estimates where maximum likelihood stops, with intervals, p-values and the term test', () => {
  const v = FX.cases.separation.values;
  const f = fitFirth(sep.X, sep.y);
  nearAll(f.beta, v.coef, TOL, 'coef');
  nearAll(f.se, v.se, TOL, 'SE');
  near(f.logLik, v.loglik[0], TOL, 'loglik full');
  for (let j = 0; j < 3; j++) {
    const [lo, hi] = firthProfileCi(f, j, 0.95);
    near(lo, v.lower[j], TOL, `lower ${j}`);
    near(hi, v.upper[j], TOL, `upper ${j}`);
    near(firthTest(f, [j]).p, v.p[j], TOL, `p ${j}`);
  }
  const term = firthTest(f, [1, 2]);
  near(term.chisq, v.termChisq, TOL, 'term chi-square (drop1)');
  same(term.df, v.termDf, 'term df');
  near(term.p, v.termP, TOL, 'term p');
  near(term.logLik0, v.loglik[1], TOL, 'loglik null');

  const out = firth(sep.table, { outcome: 'y', covariates: ['x'] });
  assert.equal(out.status, 'ok');
  assert.ok(!out.warnings.some((w) => w.bodyKey === 'models.guard.G14.separation'), 'no separation stop on the Firth path');
  const rows = out.tables.find((t) => t.id === 'coefficients').rows;
  assert.deepEqual(rows.map((r) => r[0]), ['(Intercept)', 'x=b', 'x=c']);
  rows.forEach((r, j) => { near(r[1], v.coef[j], TOL, `B ${j}`); near(r[4], v.p[j], TOL, `p ${j}`); near(r[5], v.lower[j], TOL, `lower ${j}`); near(r[6], v.upper[j], TOL, `upper ${j}`); });
  const t = out.tests.find((x) => x.id === 'lr:x');
  near(t.statistic.value, v.termChisq, TOL, 'lr:x');
  same(t.df, 2, 'lr:x df');
  near(t.p, v.termP, TOL, 'lr:x p');
  near(out.tests.find((x) => x.id === 'lrNull').statistic.value, v.termChisq, TOL, 'one term: the model test is the term test');
  assert.deepEqual(out.tables.find((x) => x.id === 'lrTests').rows.map((r) => r.slice(0, 2)), [['x', 2]]);
  const w = firth(sep.table, { outcome: 'y', covariates: ['x'] }, 'wald').tables.find((x) => x.id === 'coefficients').rows;
  w.forEach((r, j) => { near(r[4], v.waldP[j], TOL, `Wald p ${j}`); near(r[5], v.waldLower[j], TOL, `Wald lower ${j}`); near(r[6], v.waldUpper[j], TOL, `Wald upper ${j}`); });
});

test('the default path is unchanged: without method, or with ml, separation still stops and names Firth as a choice', () => {
  for (const options of [{}, { method: 'ml' }]) {
    const out = runLogistic(spec('reg.logistic', { roles: { outcome: 'y', covariates: ['x'] }, options }), sep.table);
    assert.ok(out.warnings.some((w) => w.bodyKey === 'models.guard.G14.separation'));
    assert.ok(out.notes.some((x) => x.id === 'separation' && x.key === 'models.note.separation'));
    assert.ok(Object.entries(out.values).filter(([k]) => k.startsWith('b:')).every(([, x]) => x.value === null));
  }
});

test('Firth refuses the robust farm route, leaves an aliased column out, and warns with its own G14 words', () => {
  const r = firth(sex2.table, { outcome: 'case', covariates: VARS }, 'profile', { cluster: { route: 'robust', column: 'age' } });
  assert.equal(r.status, 'invalid');
  assert.equal(r.values.reason.reasonKey, 'models.error.firthNoRobust');
  const d = FX.datasets.sep;
  const t = makeTable({ y: { kind: 'number', values: d.y }, x: { kind: 'category', levels: ['a', 'b', 'c'], values: d.x }, b2: { kind: 'number', values: d.x.map((x) => (x === 'b' ? 2 : 0)) } });
  const out = firth(t, { outcome: 'y', covariates: ['x', 'b2'] }, 'wald');
  assert.equal(out.status, 'ok');
  assert.equal(out.values['b:b2'].reasonKey, 'stats.undefined.aliased');
  near(out.values['b:x=b'].value, FX.cases.separation.values.coef[1], TOL, 'the rest of the fit is the fit without the aliased column');
  assert.ok(out.warnings.some((w) => w.id === 'G14' && w.bodyKey === 'models.guard.G14.epvFirth'), '5 positives for 2 variables');
});
