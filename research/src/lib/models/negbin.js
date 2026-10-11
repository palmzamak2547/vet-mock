// Negative binomial regression [M3-DESIGN.md 3.2.2, C10]: method reg.negbin, the NB2 model Var = mu + mu^2 / theta
// with a log link, the same roles as Poisson regression (outcome a count, covariates, time as a log offset).
// OWNER: models role.
//
// Fitting as MASS 7.3.65 glm.nb, line by line:
//   1. the Poisson fit (glm.js fitGlm);
//   2. theta.ml at its fitted values: Newton on the score of theta from the moment estimate n / sum((y / mu - 1)^2)
//      (each step from |theta|), stopping once a step is no larger than eps^(1/4) = 1.220703125e-4 or after
//      limit - 1 steps; the SE of theta is sqrt(1 / i) with i the observed information of the last step (taken
//      before that step was added, as MASS does);
//   3. alternate: an IRLS fit at the current theta (glm.fit with the negative.binomial(theta) family, started
//      from the previous fitted values), then theta.ml at the PREVIOUS fitted values, until
//      |change in log-likelihood| / sqrt(2 max(1, residual df)) + |change in theta| / max(1, theta) < 1e-10.
//      MASS divides the change in theta by 1 and uses R's epsilon (1e-8 by default; the fixture ran 1e-12); with
//      theta below 1 the two rules are the same, and above it ours stops at the same relative precision.
// Reported as MASS: coefficients, SE (dispersion 1) and deviance of the last IRLS fit; theta and its SE from the
// last theta.ml; 2 log-likelihood from that theta and the last fitted values; AIC = -2 logLik + 2 rank + 2.
//   - Intervals (ciMethod 'profile'): R's confint on the fit, which profiles the deviance with theta held at the
//     estimate (the family of the last IRLS fit). profile.glm switches on family$family and MASS's family name
//     "Negative Binomial(1.2749)" matches none of its cases, so R takes zmax = sqrt(qf(1 - alpha, 1, n - p)) here
//     (profile.js { fDf }). ciMethod 'wald': b +- z SE (confint.default).
//   - Term tests: the model refitted without the term, theta estimated again, 2 logLik difference on the term's
//     df (anova of two glm.nb fits). The model against the intercept alone likewise.
//   - Against Poisson regression: LR = 2 (logLik NB - logLik Poisson) on 1 df with the p-value halved: theta
//     tested at its boundary (1 / theta = 0), where the statistic follows half a chi-square on 0 df and half on 1
//     (Cameron and Trivedi 1998).
// A level whose counts are all 0 has no finite rate: as Poisson (glm.js), the finding G14 and no estimates.
// Counts that vary no more than Poisson allows give theta without a finite estimate (theta.ml runs off):
// models.invalid.negbinTheta, and the sentence names Poisson regression. The farm route 'robust' is refused (no
// pinned sandwich estimator here; the G1 panel does not offer it either).
//
// Pins: tests/unit/models-negbin.test.mjs against tests/fixtures/r/out/negbin.json (MASS 7.3.65, quine).
import { pnormTwoSided, pchisqUpper, qnorm, lgamma } from '../stats/dist.js';
import { val, nullVal, testRow, invalid } from '../stats/common.js';
import { fitGlm, glmData, referencesTable, separationTable } from './glm.js';
import { profileCi } from './profile.js';

const EPS = 2.220446049250313e-16;
/** theta.ml's default eps, .Machine$double.eps^0.25. */
export const THETA_EPS = 1.220703125e-4;
/** Controls: the IRLS fits, the alternation and theta.ml's limit (MASS passes control$maxit to all three). */
export const NB_CONTROL = Object.freeze({ maxIter: 50, epsilon: 1e-10 });

// ---------------------------------------------------------------- special functions (own code, C13)

/**
 * digamma(x) for x > 0: the recurrence psi(x) = psi(x + 1) - 1 / x up to x >= 10, then the asymptotic series
 * ln x - 1 / (2x) - sum B_2k / (2k x^2k) to x^-14 (next term below 5e-17 at x = 10).
 */
export function digamma(x) {
  let r = 0;
  while (x < 10) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  return r + Math.log(x) - 0.5 / x - f * (1 / 12 - f * (1 / 120 - f * (1 / 252 - f * (1 / 240 - f * (1 / 132 - f * (691 / 32760 - f / 12))))));
}

/** trigamma(x) for x > 0: psi'(x) = psi'(x + 1) + 1 / x^2 up to x >= 10, then 1/x + 1/(2x^2) + sum B_2k / x^(2k+1). */
export function trigamma(x) {
  let r = 0;
  while (x < 10) { r += 1 / (x * x); x += 1; }
  const f = 1 / (x * x);
  return r + 1 / x + 0.5 * f + (f / x) * (1 / 6 - f * (1 / 30 - f * (1 / 42 - f * (1 / 30 - f * (5 / 66 - f * (691 / 2730 - (f * 7) / 6))))));
}

// ---------------------------------------------------------------- theta, the family, the log-likelihood

function sum(n, term) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < n; i++) {
    const x = term(i);
    const t = s + x;
    c += Math.abs(s) >= Math.abs(x) ? (s - t) + x : (x - t) + s;
    s = t;
  }
  return s + c;
}

/**
 * MASS theta.ml (weights 1): theta by Newton from the moment estimate; ok false when the limit was reached (the
 * estimate runs off to infinity: no extra variation) or theta is not a positive finite number.
 * @param {Float64Array|number[]} y
 * @param {Float64Array|number[]} mu
 * @param {number} limit
 * @returns {{ theta: number, se: number, iterations: number, ok: boolean }}
 */
export function thetaMl(y, mu, limit) {
  const n = y.length;
  const score = (th) => sum(n, (i) => digamma(th + y[i]) - digamma(th) + Math.log(th) + 1 - Math.log(th + mu[i]) - (y[i] + th) / (mu[i] + th));
  const info = (th) => sum(n, (i) => -trigamma(th + y[i]) + trigamma(th) - 1 / th + 2 / (mu[i] + th) - (y[i] + th) / ((mu[i] + th) * (mu[i] + th)));
  let t0 = n / sum(n, (i) => (y[i] / mu[i] - 1) ** 2);
  let it = 0;
  let del = 1;
  let i = NaN;
  while ((it += 1) < limit && Math.abs(del) > THETA_EPS) {
    t0 = Math.abs(t0);
    i = info(t0);
    del = score(t0) / i;
    t0 += del;
    if (!Number.isFinite(t0)) break;
  }
  const ok = Number.isFinite(t0) && t0 > 0 && it < limit && i > 0;
  return { theta: t0 < 0 ? 0 : t0, se: Math.sqrt(1 / i), iterations: it, ok };
}

/** MASS negative.binomial(theta) with the log link, as a glm.js family. */
export function negbinFamily(theta) {
  return {
    theta,
    linkfun: (mu) => Math.log(mu),
    linkinv: (eta) => Math.max(Math.exp(eta), EPS),
    muEta: (eta) => Math.max(Math.exp(eta), EPS),
    variance: (mu) => mu + (mu * mu) / theta,
    devRes: (y, mu) => 2 * (y * Math.log(Math.max(1, y) / mu) - (y + theta) * Math.log((y + theta) / (mu + theta))),
    mustart: (y) => y + (y === 0 ? 1 / 6 : 0),
    validmu: (mu) => Number.isFinite(mu) && mu > 0,
    aicTerm: (y, mu) => 2 * ((y + theta) * Math.log(mu + theta) - (y > 0 ? y * Math.log(mu) : 0) + lgamma(y + 1) - theta * Math.log(theta) + lgamma(theta) - lgamma(theta + y)),
  };
}

/** glm.nb's log-likelihood at theta and the means mu. */
export function negbinLogLik(theta, mu, y) {
  const lt = lgamma(theta);
  const tlt = theta * Math.log(theta);
  return sum(y.length, (i) => lgamma(theta + y[i]) - lt - lgamma(y[i] + 1) + tlt + (y[i] > 0 ? y[i] * Math.log(mu[i]) : 0) - (theta + y[i]) * Math.log(theta + mu[i]));
}

/** The Poisson log-likelihood at the means mu (logLik of a Poisson glm). */
function poissonLogLik(mu, y) {
  return sum(y.length, (i) => (y[i] > 0 ? y[i] * Math.log(mu[i]) : 0) - mu[i] - lgamma(y[i] + 1));
}

// ---------------------------------------------------------------- the fit

/**
 * glm.nb on the columns X (see the header).
 * @param {Float64Array[]} X
 * @param {Float64Array} y
 * @param {{ offset?: Float64Array }} [opts]
 * @returns {{ ok: true, glm: ReturnType<typeof fitGlm>, family: ReturnType<typeof negbinFamily>, theta: number,
 *   thetaSe: number, twoLogLik: number, aic: number, iterations: number, poisson: ReturnType<typeof fitGlm>,
 *   poissonLogLik: number } | { ok: false, reasonKey: string }}
 *   glm is the last IRLS fit (coefficients, vcov, deviance, fitted values); family the one it used.
 */
export function fitNegbin(X, y, opts = {}) {
  const { maxIter, epsilon } = NB_CONTROL;
  const offset = opts.offset;
  const ctl = { offset, maxIter, epsilon, nullDeviance: false };
  let fit;
  try { fit = fitGlm(X, y, 'poisson', ctl); } catch { return { ok: false, reasonKey: 'models.invalid.negbinNotConverged' }; }
  if (!fit.converged) return { ok: false, reasonKey: 'models.invalid.negbinNotConverged' };
  const poisson = fit;
  let mu = fit.fitted;
  let tm = thetaMl(y, mu, maxIter);
  if (!tm.ok) return { ok: false, reasonKey: 'models.invalid.negbinTheta' };
  let th = tm.theta;
  let fam = negbinFamily(th);
  let famFit = fam;
  const d1 = Math.sqrt(2 * Math.max(1, fit.dfResidual));
  let del = 1;
  let Lm = negbinLogLik(th, mu, y);
  let Lm0 = Lm + 2 * d1;
  let iter = 0;
  let converged = false;
  while ((iter += 1) <= maxIter) {
    if (Math.abs(Lm0 - Lm) / d1 + Math.abs(del) / Math.max(1, th) <= epsilon) { converged = true; break; }
    const eta = Float64Array.from(mu, (m) => Math.log(m));
    try { fit = fitGlm(X, y, fam, { ...ctl, etastart: eta }); } catch { return { ok: false, reasonKey: 'models.invalid.negbinNotConverged' }; }
    famFit = fam;
    const t0 = th;
    tm = thetaMl(y, mu, maxIter);
    if (!tm.ok) return { ok: false, reasonKey: 'models.invalid.negbinTheta' };
    th = tm.theta;
    fam = negbinFamily(th);
    mu = fit.fitted;
    del = t0 - th;
    Lm0 = Lm;
    Lm = negbinLogLik(th, mu, y);
    if (!Number.isFinite(Lm)) return { ok: false, reasonKey: 'models.invalid.negbinNotConverged' };
  }
  if (!converged || !fit.converged) return { ok: false, reasonKey: 'models.invalid.negbinNotConverged' };
  const twoLogLik = 2 * Lm;
  return { ok: true, glm: fit, family: famFit, theta: th, thetaSe: tm.se, twoLogLik, aic: -twoLogLik + 2 * fit.rank + 2, iterations: iter - 1, poisson, poissonLogLik: poissonLogLik(poisson.fitted, y) };
}

// ---------------------------------------------------------------- the method

/**
 * reg.negbin: roles outcome (count), covariates[], time (animal-time, log offset; optional); options ciMethod
 * 'profile' (theta held at its estimate) or 'wald'.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runNegbin(spec, table) {
  if (spec?.cluster?.route === 'robust') return invalid('models.error.negbinNoRobust');
  const data = glmData(spec, table, 'poisson', { needCountKey: 'models.error.needCountNegbin' });
  if (data.fail) return data.fail;
  const { confLevel, dropped, design, n, y, offset } = data;
  const { X, names, terms } = design;
  if (y.every((v) => v === y[0])) return invalid('models.undefined.oneOutcome', { used: n, dropped });
  const wald = spec?.options?.ciMethod === 'wald';
  const notes = [];
  const warnings = [];
  if (design.emptyLevels.length) notes.push({ id: 'emptyLevels', severity: 'note', key: 'models.note.emptyLevels', params: { levels: design.emptyLevels.map((e) => `${e.column}=${e.level}`).join(', '), cells: design.emptyLevels.map((e) => [e.column, e.level]) } });
  /** @type {Record<string, any>} */
  const resolvedOptions = Object.keys(design.references).length ? { references: design.references } : {};
  const count = y.reduce((s, v) => s + v, 0);

  // A level counted 0 throughout has no finite rate (checked on the data, before any fit).
  const sep = separationTable(null, design, y, 'poisson');
  if (sep.length) {
    warnings.push({ id: 'G14', severity: 'warn', key: 'models.guard.G14.title', bodyKey: 'models.guard.G14.zeroCounts', params: { levels: sep.map((r) => `${r[0]}=${r[1]}`).join(', '), cells: sep.map((r) => [r[0], r[1]]) } });
    const why = 'models.undefined.zeroCounts';
    const values = {};
    names.forEach((nm) => { values[`b:${nm.term}`] = nullVal(why); });
    values.n = val(n);
    values.count = val(count);
    values.theta = nullVal(why);
    return {
      status: 'ok',
      values,
      tests: names.map((nm) => testRow({ id: `wald:${nm.term}`, name: 'z', statistic: null, p: null, variant: 'wald', reasonKey: why })),
      tables: [
        { id: 'separation', columns: ['models.col.column', 'ws.col.level', 'models.col.outcome', 'ws.col.n'], rows: sep },
        referencesTable(design.references),
      ],
      used: n,
      dropped,
      notes: [...notes, { id: 'separation', severity: 'note', key: 'models.note.zeroCounts' }],
      warnings,
      resolvedOptions,
    };
  }

  const nb = fitNegbin(X, y, { offset });
  if (!nb.ok) return invalid(nb.reasonKey, { used: n, dropped });
  const fit = nb.glm;
  const zq = qnorm(1 - (1 - confLevel) / 2);
  const ciMethod = wald ? 'wald' : 'profile';
  if (!wald) notes.push({ id: 'negbinProfile', severity: 'note', key: 'models.note.negbinProfile' });
  notes.push({ id: 'lrPoisson', severity: 'note', key: 'models.note.lrPoissonHalf' });
  const coefRows = [];
  const tests = [];
  const bValues = {};
  const ratioValues = {};
  names.forEach((nm, j) => {
    const isInt = nm.term === '(Intercept)';
    if (fit.aliased[j]) {
      bValues[`b:${nm.term}`] = nullVal('stats.undefined.aliased');
      coefRows.push([nm.term, null, null, null, null, null, null, null, null, null]);
      tests.push(testRow({ id: `wald:${nm.term}`, name: 'z', statistic: null, p: null, variant: 'wald', reasonKey: 'stats.undefined.aliased' }));
      return;
    }
    const b = fit.beta[j];
    const se = Math.sqrt(fit.vcov[j][j]);
    const z = b / se;
    const p = pnormTwoSided(z);
    const ci = wald
      ? [b - zq * se, b + zq * se]
      : profileCi([X, y, nb.family, { offset, maxIter: NB_CONTROL.maxIter, epsilon: NB_CONTROL.epsilon }], j, confLevel, fit, { fDf: n - X.length });
    const bExtra = { se, ci: [ci[0], ci[1]], ciLevel: confLevel, ciMethod };
    if (ci[0] === null || ci[1] === null) bExtra.noteKey = 'models.undefined.profileBound';
    bValues[`b:${nm.term}`] = val(b, bExtra);
    const rl = ci[0] === null ? null : Math.exp(ci[0]);
    const ru = ci[1] === null ? null : Math.exp(ci[1]);
    if (!isInt) {
      const rExtra = { ci: [rl, ru], ciLevel: confLevel, ciMethod };
      if (ci[0] === null || ci[1] === null) rExtra.noteKey = 'models.undefined.profileBound';
      ratioValues[`rateRatio:${nm.term}`] = val(Math.exp(b), rExtra);
    }
    coefRows.push([nm.term, b, se, z, p, ci[0], ci[1], isInt ? null : Math.exp(b), isInt ? null : rl, isInt ? null : ru]);
    tests.push(testRow({ id: `wald:${nm.term}`, name: 'z', statistic: z, p, variant: 'wald' }));
  });

  // Refits without columns, theta estimated again: 2 logLik of the model minus that of the smaller one.
  const without = (cols) => {
    const keep = X.map((_, j) => j).filter((j) => !cols.includes(j));
    const r = fitNegbin(keep.map((j) => X[j]), y, { offset });
    if (!r.ok) return { stat: null, p: null };
    const df = cols.filter((j) => !fit.aliased[j]).length;
    const stat = Math.max(0, nb.twoLogLik - r.twoLogLik);
    return { stat, df, p: pchisqUpper(stat, df) };
  };
  const lrRows = [];
  for (const t of terms) {
    const df = t.cols.filter((j) => !fit.aliased[j]).length;
    if (!df) { lrRows.push([t.column, 0, null, null]); continue; }
    const r = without(t.cols);
    lrRows.push([t.column, df, r.stat, r.p]);
    tests.push(testRow({ id: `lr:${t.column}`, name: 'X2', statistic: r.stat, df, p: r.p, variant: 'lrt' }));
  }
  const hasInt = names[0]?.term === '(Intercept)';
  const dfModel = fit.rank - (hasInt ? 1 : 0);
  const head = [];
  if (dfModel > 0 && hasInt) {
    const r = without(X.map((_, j) => j).slice(1));
    head.push(testRow({ id: 'lrNull', name: 'X2', statistic: r.stat, df: dfModel, p: r.p, variant: 'lrt' }));
  }
  // Against Poisson regression, p halved (theta on the boundary).
  const lrPois = 2 * (nb.twoLogLik / 2 - nb.poissonLogLik);
  head.push(testRow({ id: 'lrPoisson', name: 'X2', statistic: lrPois, df: 1, p: 0.5 * pchisqUpper(lrPois, 1), variant: 'lrt-boundary' }));
  tests.unshift(...head);

  const values = { ...ratioValues, ...bValues, n: val(n), count: val(count) };
  values.theta = val(nb.theta, { se: nb.thetaSe });
  values.deviance = val(fit.deviance);
  values.dfResidual = val(fit.dfResidual);
  values.aic = val(nb.aic);
  values.logLik = val(nb.twoLogLik / 2);
  const tables = [
    { id: 'coefficients', columns: ['ws.col.term', 'ws.col.estimate', 'ws.col.se', 'models.col.z', 'ws.col.p', 'ws.col.lower', 'ws.col.upper', 'models.col.irr', 'models.col.ratioLower', 'models.col.ratioUpper'], rows: coefRows },
    referencesTable(design.references),
  ];
  if (lrRows.length) tables.push({ id: 'lrTests', columns: ['ws.col.term', 'ws.col.df', 'models.col.lrStat', 'ws.col.p'], rows: lrRows });
  return { status: 'ok', values, tests, tables, used: n, dropped, notes, warnings, resolvedOptions };
}
