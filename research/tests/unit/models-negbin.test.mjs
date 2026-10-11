// Negative binomial regression [M3-DESIGN.md 3.2.2, C10]: method reg.negbin. Pins: tests/fixtures/r/out/negbin.json,
// MASS 7.3.65 glm.nb in R 4.6.0 (webR 0.6.0) with glm.control(epsilon = 1e-12, maxit = 200), on quine (Aitkin 1978)
// and quine with a made-up exposure as an offset: coefficients, SE, profile intervals with theta held fixed
// (confint), Wald intervals (confint.default), theta and its SE, 2 log-likelihood, AIC, deviance, residual df, the
// term tests with theta estimated again, and the test against Poisson with its p-value halved. The whole-model
// test (glm.nb(Days ~ 1) against the model, theta estimated in both) is pinned from the models role's own run of
// the same R through the same webR (11 Oct 2026; the script is in the role notes,
// work/loop-2026-10-08/research-m3/models.md): anova(m0, m) prints 25.115944407851885 on 6 df for quine and
// 14.479206265232051 on 2 df for quineOffset. Iterative tolerance 1e-6 relative. MODELS_INJECT=1 shifts every
// pinned number (models-fixtures.mjs): each pin test must then fail. OWNER: models role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runNegbin, fitNegbin, thetaMl, digamma, trigamma, NB_CONTROL } from '../../src/lib/models/negbin.js';
import { runPoisson } from '../../src/lib/models/glm.js';
import { profileCi } from '../../src/lib/models/profile.js';
import { readJson } from './stats-fixtures.mjs';
import { makeTable, spec, near, nearAll, same } from './models-fixtures.mjs';

const FX = readJson('r/out/negbin.json');
const TOL = { rel: 1e-6 };
const D = FX.datasets.quine;
const QUINE = makeTable({
  Days: { kind: 'number', values: D.Days },
  py: { kind: 'number', values: D.py },
  // R's factor order: references A, F, F0, AL (the fixture's notes)
  Eth: { kind: 'category', levels: ['A', 'N'], values: D.Eth },
  Sex: { kind: 'category', levels: ['F', 'M'], values: D.Sex },
  Age: { kind: 'category', levels: ['F0', 'F1', 'F2', 'F3'], values: D.Age },
  Lrn: { kind: 'category', levels: ['AL', 'SL'], values: D.Lrn },
});
const CASES = {
  quine: { roles: { outcome: 'Days', covariates: ['Eth', 'Sex', 'Age', 'Lrn'] }, terms: ['Eth=N', 'Sex=M', 'Age=F1', 'Age=F2', 'Age=F3', 'Lrn=SL'], lrNull: [25.115944407851885, 6] },
  quineOffset: { roles: { outcome: 'Days', covariates: ['Eth', 'Sex'], time: 'py' }, terms: ['Eth=N', 'Sex=M'], lrNull: [14.479206265232051, 2] },
};
const run = (id, ciMethod) => runNegbin(spec('reg.negbin', { roles: CASES[id].roles, options: { ciMethod } }), QUINE);

test('fixture shape: the cases, names and references this test reads', () => {
  assert.deepEqual(FX._fixture.methods, ['reg.negbin']);
  assert.deepEqual(FX.cases.quine.values.names, ['(Intercept)', 'EthN', 'SexM', 'AgeF1', 'AgeF2', 'AgeF3', 'LrnSL']);
  assert.deepEqual(FX.cases.quineOffset.values.names, ['(Intercept)', 'EthN', 'SexM']);
  assert.equal(D.Days.length, 146);
});

for (const id of Object.keys(CASES)) {
  test(`${id}: coefficients, SE, profile intervals (theta held fixed), IRR, theta, logLik, AIC, deviance as glm.nb`, () => {
    const v = FX.cases[id].values;
    const out = run(id, 'profile');
    assert.equal(out.status, 'ok');
    assert.equal(out.used, 146);
    const coef = out.tables.find((t) => t.id === 'coefficients');
    assert.deepEqual(coef.rows.map((r) => r[0]), ['(Intercept)', ...CASES[id].terms]);
    coef.rows.forEach((r, j) => {
      near(r[1], v.coef[j], TOL, `B ${j}`);
      near(r[2], v.se[j], TOL, `SE ${j}`);
      near(r[3], v.coef[j] / v.se[j], TOL, `z ${j}`);
      near(r[5], v.lower[j], TOL, `profile lower ${j}`);
      near(r[6], v.upper[j], TOL, `profile upper ${j}`);
      if (j) {
        near(r[7], Math.exp(v.coef[j]), TOL, `IRR ${j}`);
        near(r[8], Math.exp(v.lower[j]), TOL, `IRR lower ${j}`);
        near(r[9], Math.exp(v.upper[j]), TOL, `IRR upper ${j}`);
      } else assert.equal(r[7], null);
    });
    const first = `rateRatio:${CASES[id].terms[0]}`;
    assert.equal(Object.keys(out.values)[0], first);
    near(out.values[first].value, Math.exp(v.coef[1]), TOL, 'IRR value');
    nearAll(out.values[first].ci, [Math.exp(v.lower[1]), Math.exp(v.upper[1])], TOL, 'IRR value ci');
    assert.equal(out.values[first].ciMethod, 'profile');
    near(out.values.theta.value, v.theta, TOL, 'theta');
    near(out.values.theta.se, v.thetaSe, TOL, 'theta SE');
    near(2 * out.values.logLik.value, v.twoLogLik, TOL, '2 logLik');
    near(out.values.aic.value, v.aic, TOL, 'AIC');
    near(out.values.deviance.value, v.deviance, TOL, 'deviance');
    same(out.values.dfResidual.value, v.dfResidual, 'residual df');
    same(out.values.count.value, D.Days.reduce((s, x) => s + x, 0), 'total count');
    assert.ok(out.notes.some((x) => x.key === 'models.note.negbinProfile'));
  });

  test(`${id}: Wald intervals (confint.default), term tests with theta re-estimated, the test against Poisson`, () => {
    const v = FX.cases[id].values;
    const out = run(id, 'wald');
    const coef = out.tables.find((t) => t.id === 'coefficients');
    coef.rows.forEach((r, j) => { near(r[5], v.waldLower[j], TOL, `Wald lower ${j}`); near(r[6], v.waldUpper[j], TOL, `Wald upper ${j}`); });
    assert.equal(out.values['b:(Intercept)'].ciMethod, 'wald');
    v.terms.forEach((term, i) => {
      const t = out.tests.find((x) => x.id === `lr:${term}`);
      near(t.statistic.value, v.termChisq[i], TOL, `LR ${term}`);
      same(t.df, v.termDf[i], `LR df ${term}`);
      near(t.p, v.termP[i], TOL, `LR p ${term}`);
    });
    assert.deepEqual(out.tables.find((t) => t.id === 'lrTests').rows.map((r) => r[0]), v.terms);
    const pois = out.tests.find((x) => x.id === 'lrPoisson');
    near(pois.statistic.value, v.vsPoissonLr, TOL, 'LR against Poisson');
    same(pois.df, 1, 'LR against Poisson df');
    near(pois.p, v.vsPoissonP, TOL, 'halved p (theta on the boundary)');
    assert.equal(pois.variant, 'lrt-boundary');
    const all = out.tests.find((x) => x.id === 'lrNull');
    near(all.statistic.value, CASES[id].lrNull[0], TOL, 'model against the intercept alone (models role webR run)');
    same(all.df, CASES[id].lrNull[1], 'model test df');
    assert.deepEqual(out.tests.slice(0, 2).map((x) => x.id), ['lrNull', 'lrPoisson']);
    assert.ok(out.notes.some((x) => x.key === 'models.note.lrPoissonHalf'));
  });
}

test('profile.glm takes the F branch for the negative binomial family; the chi-square zmax misses R by up to 1e-4', () => {
  const v = FX.cases.quine.values;
  const n = D.Days.length;
  const ind = (k, l) => Float64Array.from(D[k], (x) => (x === l ? 1 : 0));
  const X = [new Float64Array(n).fill(1), ind('Eth', 'N'), ind('Sex', 'M'), ind('Age', 'F1'), ind('Age', 'F2'), ind('Age', 'F3'), ind('Lrn', 'SL')];
  const y = Float64Array.from(D.Days);
  const nb = fitNegbin(X, y);
  assert.ok(nb.ok);
  const args = [X, y, nb.family, { maxIter: NB_CONTROL.maxIter, epsilon: NB_CONTROL.epsilon }];
  let worst = 0;
  for (let j = 0; j < 7; j++) {
    const f = profileCi(args, j, 0.95, nb.glm, { fDf: n - 7 });
    near(f[0], v.lower[j], TOL, `F branch lower ${j}`);
    near(f[1], v.upper[j], TOL, `F branch upper ${j}`);
    const c = profileCi(args, j, 0.95, nb.glm);
    worst = Math.max(worst, Math.abs(c[0] - v.lower[j]) / Math.abs(v.lower[j]), Math.abs(c[1] - v.upper[j]) / Math.abs(v.upper[j]));
  }
  assert.ok(worst > 1e-5, `the chi-square branch would also match (worst ${worst}); recheck profile.glm`);
});

test('digamma and trigamma at closed-form points; theta.ml stops as MASS', () => {
  const g = 0.5772156649015329;
  near(digamma(1), -g, { rel: 1e-14 }, 'digamma(1) = -gamma');
  near(digamma(0.5), -g - 2 * Math.LN2, { rel: 1e-14 }, 'digamma(1/2)');
  near(digamma(12.5) - digamma(2.5), [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5].reduce((s, x) => s + 1 / x, 0), { rel: 1e-13 }, 'recurrence across the series threshold');
  near(trigamma(1), Math.PI ** 2 / 6, { rel: 1e-14 }, 'trigamma(1)');
  near(trigamma(0.5), Math.PI ** 2 / 2, { rel: 1e-14 }, 'trigamma(1/2)');
  // Poisson-like counts (equal to their means): theta runs off, no finite estimate
  const mu = [2, 3, 4, 2, 3, 4, 2, 3, 4, 5];
  const r = thetaMl([2, 3, 4, 2, 3, 4, 2, 3, 4, 5], mu, 50);
  assert.equal(r.ok, false);
});

test('reg.negbin: zero counts, a non-count outcome, counts without extra variation, the robust route', () => {
  const zero = makeTable({ y: { kind: 'number', values: [0, 0, 0, 3, 9, 2, 14, 1, 2, 7] }, g: { kind: 'category', levels: ['a', 'b', 'c'], values: ['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c', 'c'] } });
  const z = runNegbin(spec('reg.negbin', { roles: { outcome: 'y', covariates: ['g'] } }), zero);
  assert.equal(z.status, 'ok');
  assert.deepEqual(z.tables.find((t) => t.id === 'separation').rows, [['g', 'a', 0, 3]]);
  assert.ok(z.warnings.some((w) => w.bodyKey === 'models.guard.G14.zeroCounts'));
  assert.ok(z.notes.some((x) => x.key === 'models.note.zeroCounts'));
  assert.equal(z.values['b:g=b'].value, null);
  const frac = makeTable({ y: { kind: 'number', values: [1, 2.5, 3, 4, 1, 2] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6] } });
  assert.equal(runNegbin(spec('reg.negbin', { roles: { outcome: 'y', covariates: ['x'] } }), frac).values.reason.reasonKey, 'models.error.needCountNegbin');
  const flat = makeTable({ y: { kind: 'number', values: [3, 3, 4, 3, 4, 3, 3, 4, 3, 4, 3, 3] }, x: { kind: 'number', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } });
  assert.equal(runNegbin(spec('reg.negbin', { roles: { outcome: 'y', covariates: ['x'] } }), flat).values.reason.reasonKey, 'models.invalid.negbinTheta');
  const same4 = makeTable({ y: { kind: 'number', values: [4, 4, 4, 4, 4] }, x: { kind: 'number', values: [1, 2, 3, 4, 5] } });
  assert.equal(runNegbin(spec('reg.negbin', { roles: { outcome: 'y', covariates: ['x'] } }), same4).values.reason.reasonKey, 'models.undefined.oneOutcome');
  const rob = runNegbin(spec('reg.negbin', { roles: CASES.quine.roles, cluster: { route: 'robust', column: 'Eth' } }), QUINE);
  assert.equal(rob.values.reason.reasonKey, 'models.error.negbinNoRobust');
});

test('Poisson on quine raises G23, and NB is the next step its words name', async () => {
  const out = runPoisson(spec('reg.poisson', { roles: CASES.quine.roles }), QUINE);
  const g23 = out.warnings.find((w) => w.id === 'G23');
  assert.ok(g23, 'quine counts are overdispersed');
  const words = (await import('../../src/i18n/models.js')).default;
  assert.match(words.en[g23.bodyKey], /negative binomial regression/);
  assert.match(words.th[g23.bodyKey], /negative binomial regression/);
  assert.doesNotMatch(words.en[g23.bodyKey], /not in this release/);
});
