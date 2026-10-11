// Curve models and their formulas (stats/curves.js) against R 4.6.0 nls and drc 3.0.1 [M3-DESIGN.md 3.1.1, C2 to
// C6]: tests/fixtures/r/out/nonlinear.json, cases ryegrass4pl, ryegrass5pl, michaelisMenten, decay, growth, compare
// (script tests/fixtures/r/nonlinear.R; datasets inside the JSON; curves, decay and growth are made-up data,
// ข้อมูลสมมุติ). Every case carries tol 'iterative' (1e-6 relative).
//
// How the pins are split, and why. R's nls stops when its convergence value sqrt(||Q1'r||^2 / ||Q2'r||^2) falls below
// its default tol = 1e-5, so its printed estimates sit up to one Gauss-Newton step short of the least-squares minimum:
// in these cases by up to 4.5e-5 relative (the shared-EC50 fit's control bottom), far below a standard error but
// above 1e-6. The Levenberg-Marquardt core goes to the minimum itself (relative offset below 1e-7, RSS at or below
// R's). So:
//   1. every printed value that is a function of the estimates (standard errors and parameter intervals, EC50 and
//      its interval, the log-scale SE, the curve and its band, interpolated concentrations and their intervals,
//      half-life and doubling time with their intervals, the EC50 ratio) is computed by our formulas AT R'S PRINTED
//      ESTIMATES and must match at 1e-6 (they match to about 1e-7);
//   2. every value that depends on the fit only through its residual sum of squares (RSS, residual SD, R squared,
//      AICc, the extra sum-of-squares F and p) is taken from OUR fit and must match at 1e-6 (the RSS is flat at the
//      minimum: our RSS and R's agree to about 1e-10);
//   3. our estimates must be the same least-squares solution as R's: RSS no larger than R's, and each estimate
//      within a thousandth of its standard error of R's (and R's point must satisfy R's own stopping rule on our
//      model, which also proves the model formula is the one R fitted).
// The finding for the rparity role: rerunning nonlinear.R with nls.control(tol = 1e-10) would let point 3 be a plain
// 1e-6 comparison (lab notes).
// Injected-wrong-value proof: STATS_INJECT=1 node --test tests/unit/stats-nls-curves.test.mjs must go red (lab notes).
// OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nlsAt, nlsFit, deltaSe, tMultiplier, aicc, extraSsF, rSquared } from '../../src/lib/stats/nls.js';
import { MODELS, pointModel, sharedPotencyModel, fitCurve, potency, inverseLogX, curveBand, logPotency, llValue } from '../../src/lib/stats/curves.js';
import { readJson, close, TOL } from './stats-fixtures.mjs';

const R = readJson('r/out/nonlinear.json');
const INJECT = process.env.STATS_INJECT === '1';
const LN2 = Math.LN2;

/** Same least-squares solution: |ours - R| within a thousandth of R's standard error (or 1e-6 relative). */
function sameSolution(got, want, se, label) {
  if (INJECT && want !== 0) want *= 1 + 1e-5;
  const tol = Math.max(TOL.iterative * Math.abs(want), 1e-3 * se);
  assert.ok(Math.abs(got - want) <= tol, `${label}: ours ${got}, R ${want}, difference ${Math.abs(got - want).toExponential(3)} > ${tol.toExponential(3)}`);
}

/** Our RSS at the minimum: no larger than R's (R stops a little short of it) and equal at 1e-6. */
function rssNoLarger(got, want, label) {
  close(got, want, TOL.iterative, label);
  assert.ok(got <= want * (1 + 1e-12), `${label}: ours ${got} above R's ${want}`);
}

test('every case is pinned at the iterative tolerance and R stopped by its own rule on our model', () => {
  for (const c of Object.values(R.cases)) assert.equal(c.tol, 'iterative');
  assert.equal(R._fixture.family, 'r-4.6.0');
  assert.deepEqual(R._fixture.methods, ['nls.fourPL', 'nls.doseResponse', 'nls.equation']);
  const D = R.datasets.ryegrass;
  const v4 = R.cases.ryegrass4pl.values;
  const v5 = R.cases.ryegrass5pl.values;
  // R's convergence value at R's printed estimates, on our model: below nls's tol = 1e-5, and not much below it
  // (R stops on the first iterate under tol), which is why point 3 of the header is needed.
  const r4 = nlsAt(pointModel(MODELS.ll4, D.conc), D.rootl, [v4.b, v4.c, v4.d, v4.e]).rOffset;
  const r5 = nlsAt(pointModel(MODELS.ll5, D.conc), D.rootl, [v5.b, v5.c, v5.d, v5.e, v5.g]).rOffset;
  assert.ok(r4 < 1e-5 && r4 > 1e-8, `4PL R convergence value ${r4}`);
  assert.ok(r5 < 1e-5 && r5 > 1e-8, `5PL R convergence value ${r5}`);
});

test('ryegrass 4PL at R\'s estimates: SEs, intervals, EC50, the band on the grid and the interpolated unknowns', () => {
  const D = R.datasets.ryegrass;
  const v = R.cases.ryegrass4pl.values;
  const p = [v.b, v.c, v.d, v.e];
  const at = nlsAt(pointModel(MODELS.ll4, D.conc), D.rootl, p);
  const tol = TOL.iterative;
  assert.equal(at.df, v.df);
  close(at.rss, v.rss, tol, 'rss at R');
  close(at.sigma, v.sigma, tol, 'sigma at R');
  const tm = tMultiplier(0.95, at.df);
  p.forEach((pj, j) => {
    close(at.se[j], v.se[j], tol, `se ${j}`);
    close(pj - tm * at.se[j], v.lower[j], tol, `lower ${j}`);
    close(pj + tm * at.se[j], v.upper[j], tol, `upper ${j}`);
  });
  const pt = potency(p, at.cov, false, at.df, 0.95);
  assert.equal(pt.kind, 'ic50', 'root length falls with dose: IC50');
  close(pt.value, v.ec50, tol, 'EC50');
  close(pt.lower, v.ec50Lower, tol, 'EC50 lower');
  close(pt.upper, v.ec50Upper, tol, 'EC50 upper');
  close(pt.logSe, v.logEc50Se, tol, 'log EC50 SE');
  curveBand('ll4', p, at.cov, v.grid, at.df, 0.95).forEach((b, i) => {
    close(b.fitted, v.fitted[i], tol, `fitted ${v.grid[i]}`);
    close(b.se, v.bandSe[i], tol, `band SE ${v.grid[i]}`);
    close(b.lower, v.bandLower[i], tol, `band lower ${v.grid[i]}`);
    close(b.upper, v.bandUpper[i], tol, `band upper ${v.grid[i]}`);
  });
  v.unknownResponse.forEach((y0, i) => {
    const inv = inverseLogX(p, y0, false);
    const se = deltaSe(inv.grad, at.cov);
    close(inv.value, v.unknownLogX[i], tol, `unknown ${y0} log x`);
    close(se, v.unknownLogXSe[i], tol, `unknown ${y0} log x SE`);
    close(Math.exp(inv.value), v.unknownX[i], tol, `unknown ${y0} x`);
    close(Math.exp(inv.value - tm * se), v.unknownXLower[i], tol, `unknown ${y0} lower`);
    close(Math.exp(inv.value + tm * se), v.unknownXUpper[i], tol, `unknown ${y0} upper`);
  });
});

test('ryegrass 4PL fitted from the contract\'s starting values: the same solution, RSS, R squared and AICc', () => {
  const D = R.datasets.ryegrass;
  const v = R.cases.ryegrass4pl.values;
  const fit = fitCurve('ll4', D.conc, D.rootl);
  assert.equal(fit.status, 'ok');
  assert.ok(fit.offset <= 1e-7, `offset ${fit.offset}`);
  ['b', 'c', 'd', 'e'].forEach((n, j) => sameSolution(fit.p[j], v[n], v.se[j], `4PL ${n}`));
  rssNoLarger(fit.rss, v.rss, '4PL rss');
  assert.equal(fit.df, v.df);
  close(fit.sigma, v.sigma, TOL.iterative, '4PL sigma');
  close(rSquared(D.rootl, fit.rss), v.r2, TOL.iterative, '4PL R squared');
  close(aicc(fit.rss, D.conc.length, 4), v.aicc, TOL.iterative, '4PL AICc');
});

test('ryegrass 5PL: SEs, EC50 and unknowns at R\'s estimates; the fit, AICc and the F test against the 4PL from ours', () => {
  const D = R.datasets.ryegrass;
  const v = R.cases.ryegrass5pl.values;
  const tol = TOL.iterative;
  const p = [v.b, v.c, v.d, v.e, v.g];
  const at = nlsAt(pointModel(MODELS.ll5, D.conc), D.rootl, p);
  assert.equal(at.df, v.df);
  at.se.forEach((s, j) => close(s, v.se[j], tol, `5PL se ${j}`));
  close(at.sigma, v.sigma, tol, '5PL sigma at R');
  const pt = potency(p, at.cov, true, at.df, 0.95);
  close(pt.value, v.ec50, tol, '5PL EC50');
  close(pt.lower, v.ec50Lower, tol, '5PL EC50 lower');
  close(pt.upper, v.ec50Upper, tol, '5PL EC50 upper');
  close(pt.logSe, v.logEc50Se, tol, '5PL log EC50 SE');
  const tm = tMultiplier(0.95, at.df);
  v.unknownResponse.forEach((y0, i) => {
    const inv = inverseLogX(p, y0, true);
    const se = deltaSe(inv.grad, at.cov);
    close(Math.exp(inv.value), v.unknownX[i], tol, `5PL unknown ${y0}`);
    close(Math.exp(inv.value - tm * se), v.unknownXLower[i], tol, `5PL unknown ${y0} lower`);
    close(Math.exp(inv.value + tm * se), v.unknownXUpper[i], tol, `5PL unknown ${y0} upper`);
  });
  // ours, from the converged 4PL with g = 1
  const fit = fitCurve('ll5', D.conc, D.rootl);
  assert.equal(fit.status, 'ok');
  assert.ok(fit.offset <= 1e-7, `offset ${fit.offset}`);
  ['b', 'c', 'd', 'e', 'g'].forEach((n, j) => sameSolution(fit.p[j], v[n], v.se[j], `5PL ${n}`));
  rssNoLarger(fit.rss, v.rss, '5PL rss');
  close(rSquared(D.rootl, fit.rss), v.r2, tol, '5PL R squared');
  close(aicc(fit.rss, D.conc.length, 5), v.aicc, tol, '5PL AICc');
  const F = extraSsF(fit.four.rss, fit.four.df, fit.rss, fit.df);
  close(F.F, v.vs4plF, tol, '5PL against 4PL F');
  close(F.p, v.vs4plP, tol, '5PL against 4PL p');
  assert.deepEqual([F.df1, F.df2], [v.vs4plDf1, v.vs4plDf2]);
});

for (const [cs, id, dk, xk, yk, names] of [
  ['michaelisMenten', 'michaelisMenten', 'puromycin', 'conc', 'rate', ['vm', 'k']],
  ['decay', 'decay', 'decay', 'time', 'conc', ['y0', 'plateau', 'k']],
  ['growth', 'growth', 'growth', 'time', 'count', ['y0', 'k']],
]) {
  test(`${cs}: SEs and intervals at R's estimates; the same solution, RSS and R squared from the grid start`, () => {
    const D = R.datasets[dk];
    const v = R.cases[cs].values;
    const tol = TOL.iterative;
    const p = names.map((n) => v[n]);
    const at = nlsAt(pointModel(MODELS[id], D[xk]), D[yk], p);
    assert.equal(at.df, v.df);
    close(at.rss, v.rss, tol, `${cs} rss at R`);
    const tm = tMultiplier(0.95, at.df);
    p.forEach((pj, j) => {
      close(at.se[j], v.se[j], tol, `${cs} se ${names[j]}`);
      close(pj - tm * at.se[j], v.lower[j], tol, `${cs} lower ${names[j]}`);
      close(pj + tm * at.se[j], v.upper[j], tol, `${cs} upper ${names[j]}`);
    });
    if (cs === 'decay' || cs === 'growth') {
      const k = p[p.length - 1];
      const sk = at.se[p.length - 1];
      const [vv, lo, hi] = cs === 'decay' ? [v.halfLife, v.halfLifeLower, v.halfLifeUpper] : [v.doubling, v.doublingLower, v.doublingUpper];
      close(LN2 / k, vv, tol, `${cs} ln 2 / k`);
      close(LN2 / (k + tm * sk), lo, tol, `${cs} lower`);
      close(LN2 / (k - tm * sk), hi, tol, `${cs} upper`);
    }
    const fit = fitCurve(id, D[xk], D[yk]);
    assert.equal(fit.status, 'ok');
    assert.ok(fit.offset <= 1e-7, `offset ${fit.offset}`);
    names.forEach((n, j) => sameSolution(fit.p[j], v[n], v.se[j], `${cs} ${n}`));
    rssNoLarger(fit.rss, v.rss, `${cs} rss`);
    assert.equal(fit.df, v.df);
    close(rSquared(D[yk], fit.rss), v.r2, tol, `${cs} R squared`);
  });
}

/** The made-up two-arm data: rows of each arm and the arm index per row (control 0, drug 1). */
function curvesData() {
  const C = R.datasets.curves;
  const g = C.arm.map((a) => (a === 'control' ? 0 : 1));
  const arm = (k) => ({ x: C.dose.filter((_, i) => g[i] === k), y: C.resp.filter((_, i) => g[i] === k) });
  return { C, g, arms: [arm(0), arm(1)] };
}

test('two curves at R\'s estimates: pooled SEs, the EC50s and their ratio with its interval; F and AICc formulas', () => {
  const { C, g, arms } = curvesData();
  const v = R.cases.compare.values;
  const tol = TOL.iterative;
  // R's separate fit lists b1 b2 c1 c2 d1 d2 e1 e2
  const pr = [0, 1].map((k) => [v.separate[k], v.separate[2 + k], v.separate[4 + k], v.separate[6 + k]]);
  const at = [0, 1].map((k) => nlsAt(pointModel(MODELS.ll4, arms[k].x), arms[k].y, pr[k]));
  close(at[0].rss + at[1].rss, v.rssSeparate, tol, 'separate rss at R');
  const dfSep = C.dose.length - 8;
  assert.equal(dfSep, v.dfSeparate);
  const s2 = (at[0].rss + at[1].rss) / dfSep;
  const V = at.map((a) => a.xtxInv.map((r) => r.map((x) => x * s2)));
  [0, 1, 2, 3].forEach((j) => [0, 1].forEach((k) => close(Math.sqrt(V[k][j][j]), v.separateSe[2 * j + k], tol, `separate se ${j} arm ${k}`)));
  const pots = [0, 1].map((k) => potency(pr[k], V[k], false, dfSep, 0.95));
  close(pots[0].value, v.ec50Control, tol, 'EC50 control');
  close(pots[1].value, v.ec50Drug, tol, 'EC50 drug');
  const lr = pots[1].logValue - pots[0].logValue;
  const se = Math.sqrt(pots[0].logSe ** 2 + pots[1].logSe ** 2);
  const tm = tMultiplier(0.95, dfSep);
  close(Math.exp(lr), v.ec50Ratio, tol, 'EC50 ratio');
  close(Math.exp(lr - tm * se), v.ec50RatioLower, tol, 'EC50 ratio lower');
  close(Math.exp(lr + tm * se), v.ec50RatioUpper, tol, 'EC50 ratio upper');
  // the restricted fits at R's estimates give R's sums of squares on our models
  const one = nlsAt(pointModel(MODELS.ll4, C.dose), C.resp, v.oneCurve);
  close(one.rss, v.rssOne, tol, 'one-curve rss at R');
  assert.equal(one.df, v.dfOne);
  const sv = v.sharedEc50; // b1 b2 c1 c2 d1 d2 e
  const shared = nlsAt(sharedPotencyModel(C.dose, g, 2, false), C.resp, [sv[0], sv[2], sv[4], sv[1], sv[3], sv[5], sv[6]]);
  close(shared.rss, v.rssShared, tol, 'shared-EC50 rss at R');
  assert.equal(shared.df, v.dfShared);
  // the F tests and AICc on R's sums of squares
  const F1 = extraSsF(v.rssOne, v.dfOne, v.rssSeparate, v.dfSeparate);
  const Fe = extraSsF(v.rssShared, v.dfShared, v.rssSeparate, v.dfSeparate);
  close(F1.F, v.oneF, tol, 'one-curve F');
  close(F1.p, v.oneP, tol, 'one-curve p');
  close(Fe.F, v.sharedF, tol, 'shared-EC50 F');
  close(Fe.p, v.sharedP, tol, 'shared-EC50 p');
  close(aicc(v.rssSeparate, C.dose.length, 8), v.aiccSeparate, tol, 'AICc separate');
  close(aicc(v.rssOne, C.dose.length, 4), v.aiccOne, tol, 'AICc one curve');
  close(aicc(v.rssShared, C.dose.length, 7), v.aiccShared, tol, 'AICc shared EC50');
});

test('two curves fitted by us: the same separate, one-curve and shared-EC50 solutions; F, p and AICc from our RSS', () => {
  const { C, g, arms } = curvesData();
  const v = R.cases.compare.values;
  const tol = TOL.iterative;
  const n = C.dose.length;
  const fits = arms.map((a) => fitCurve('ll4', a.x, a.y));
  fits.forEach((f, k) => {
    assert.equal(f.status, 'ok');
    ['b', 'c', 'd', 'e'].forEach((nm, j) => sameSolution(f.p[j], v.separate[2 * j + k], v.separateSe[2 * j + k], `separate ${nm} arm ${k}`));
  });
  const rssSep = fits[0].rss + fits[1].rss;
  rssNoLarger(rssSep, v.rssSeparate, 'separate rss');
  const one = fitCurve('ll4', C.dose, C.resp);
  const oneSe = nlsAt(pointModel(MODELS.ll4, C.dose), C.resp, v.oneCurve).se;
  one.p.forEach((pj, j) => sameSolution(pj, v.oneCurve[j], oneSe[j], `one curve ${j}`));
  rssNoLarger(one.rss, v.rssOne, 'one-curve rss');
  // shared EC50, started as nls.doseResponse starts it: the separate fits and the mean of their log EC50s
  const model = sharedPotencyModel(C.dose, g, 2, false);
  const start = [...fits[0].p.slice(0, 3), ...fits[1].p.slice(0, 3), (logPotency(fits[0].p, false).value + logPotency(fits[1].p, false).value) / 2];
  const sh = nlsFit(model, C.resp, start);
  assert.equal(sh.status, 'ok');
  assert.ok(sh.offset <= 1e-7, `shared offset ${sh.offset}`);
  const sv = v.sharedEc50;
  const rOrder = [sv[0], sv[2], sv[4], sv[1], sv[3], sv[5], sv[6]];
  const shSe = nlsAt(model, C.resp, rOrder).se;
  sh.p.forEach((pj, j) => sameSolution(pj, rOrder[j], shSe[j], `shared EC50 parameter ${j}`));
  rssNoLarger(sh.rss, v.rssShared, 'shared-EC50 rss');
  const F1 = extraSsF(one.rss, one.df, rssSep, n - 8);
  const Fe = extraSsF(sh.rss, sh.df, rssSep, n - 8);
  close(F1.F, v.oneF, tol, 'one-curve F, ours');
  close(F1.p, v.oneP, tol, 'one-curve p, ours');
  close(Fe.F, v.sharedF, tol, 'shared-EC50 F, ours');
  close(Fe.p, v.sharedP, tol, 'shared-EC50 p, ours');
  assert.deepEqual([one.df, sh.df], [v.dfOne, v.dfShared]);
  close(aicc(rssSep, n, 8), v.aiccSeparate, tol, 'AICc separate, ours');
  close(aicc(one.rss, n, 4), v.aiccOne, tol, 'AICc one, ours');
  close(aicc(sh.rss, n, 7), v.aiccShared, tol, 'AICc shared, ours');
});

/** Central differences of a model's fitted values, against its analytic Jacobian. */
function checkJacobian(model, p, label) {
  const J = model.jacobian(Float64Array.from(p));
  p.forEach((pj, j) => {
    const h = 1e-6 * Math.max(1, Math.abs(pj));
    const up = model.fitted(Float64Array.from(p, (v, i) => (i === j ? v + h : v)));
    const dn = model.fitted(Float64Array.from(p, (v, i) => (i === j ? v - h : v)));
    J[j].forEach((a, i) => {
      const num = (up[i] - dn[i]) / (2 * h);
      assert.ok(Math.abs(a - num) <= 1e-6 * Math.max(1, Math.abs(num)), `${label} d/dp${j} row ${i}: analytic ${a}, numeric ${num}`);
    });
  });
}

test('analytic Jacobians agree with central differences, including the 5PL shared-EC50 reparametrisation', () => {
  const x = [0, 0.1, 0.3, 1, 3, 10, 30, 100];
  checkJacobian(pointModel(MODELS.ll4, x), [1.3, 5, 99, 1.1], '4PL falling');
  checkJacobian(pointModel(MODELS.ll4, x), [-0.9, 2, 40, 0.5], '4PL rising');
  checkJacobian(pointModel(MODELS.ll5, x), [2.1, 3, 80, 0.7, 0.45], '5PL');
  checkJacobian(pointModel(MODELS.michaelisMenten, x), [200, 0.06], 'Michaelis-Menten');
  checkJacobian(pointModel(MODELS.decay, x.map((v) => v / 10)), [98, 7, 0.28], 'decay');
  checkJacobian(pointModel(MODELS.growth, x.map((v) => v / 10)), [1.05, 0.35], 'growth');
  const gi = x.map((_, i) => i % 2);
  checkJacobian(sharedPotencyModel(x, gi, 2, false), [1.2, 5, 99, 1.4, 6, 98, 1.5], 'shared EC50 4PL');
  checkJacobian(sharedPotencyModel(x, gi, 2, true), [1.2, 5, 99, 0.6, 1.4, 6, 98, 1.7, 1.5], 'shared EC50 5PL');
});

test('a zero dose sits on the asymptote: d when the curve falls, c when it rises, and only that parameter moves it', () => {
  const g = new Float64Array(5);
  assert.equal(llValue(0, [1.3, 5, 99, 1.1], false, g), 99);
  assert.deepEqual(Array.from(g.slice(0, 4)), [0, 0, 1, 0]);
  assert.equal(llValue(0, [-1.3, 5, 99, 1.1], false, g), 5);
  assert.deepEqual(Array.from(g.slice(0, 4)), [0, 1, 0, 0]);
  assert.equal(llValue(0, [2, 3, 80, 0.7, 0.45], true, g), 80);
  assert.deepEqual(Array.from(g), [0, 0, 1, 0, 0]);
  // no overflow far out on the curve
  assert.ok(Number.isFinite(llValue(1e300, [5, 1, 9, 0], false, g)) && g.every(Number.isFinite));
  // an interpolation outside the curve's range has no answer
  assert.equal(inverseLogX([1.3, 5, 99, 1.1], 99.5, false), null);
  assert.equal(inverseLogX([1.3, 5, 99, 1.1], 4, false), null);
});
