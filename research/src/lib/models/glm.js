// Generalized linear models by IRLS: binomial (logit) and Poisson (log, optional offset from the time role).
// Convergence as R glm.control (deviance change below 1e-8, 25 iterations); Wald and profile-likelihood
// intervals; likelihood-ratio test per term; separation (G14) and overdispersion (G23) findings
// [M2-DESIGN.md 3.2.1].
// OWNER: models role.
//
// fitGlm follows R 4.6.0 glm.fit line by line: the family's starting values (binomial (y + 0.5) / 2,
// Poisson y + 0.1), the working response and weights, a least-squares step by Householder QR of the
// weighted columns (a column whose remaining norm falls below 1e-11 of its original norm is aliased, as
// Cdqrls with tol = min(1e-7, epsilon / 1000)), step halving when the deviance is not finite, and the
// stop rule |dev - devold| / (|dev| + 0.1) < epsilon. The link functions copy R's C code, including the
// logit clamps (mu at DBL_EPSILON beyond |eta| = 30). The unscaled covariance is (R'R)^-1 of the QR of the
// last iteration, as summary.glm reads it. Dispersion is 1 (binomial, Poisson).
//
// Numbers pinned in tests/unit/models-glm.test.mjs (R 4.6.0 values in docs/research/M2-DESIGN.md 3.2.1 and
// the models role's own webR run, script in the test header).
import { pnormTwoSided, pchisqUpper, qnorm, lgamma, ptTwoSided, qt } from '../stats/dist.js';
import { val, nullVal, testRow, role, common, completeRows, column, invalid, ksum } from '../stats/common.js';
import { buildDesign } from './design-matrix.js';
import { profileCi } from './profile.js';
import { clusterRobustVcov } from './robust.js';

const EPS = 2.220446049250313e-16;
const INVEPS = 1 / EPS;
const THRESH = 30;
const QR_TOL = 1e-11;
/** Fitted probabilities (or rates) this close to 0 or 1 mark separation [M2-DESIGN.md 3.2.1]. */
export const SEPARATION_TOL = 1e-8;
/** Fewest farms for the cluster-robust route; the same number as epi/guardrails.js ROBUST_MIN_FARMS (a test pins both). */
export const ROBUST_MIN_FARMS = 10;

// ---------------------------------------------------------------- families (R's C code)

const ylogy = (y, mu) => (y !== 0 ? y * Math.log(y / mu) : 0);

/** @type {Record<'binomial'|'poisson', any>} */
export const FAMILIES = {
  binomial: {
    linkfun: (mu) => Math.log(mu / (1 - mu)),
    linkinv: (eta) => {
      const t = eta < -THRESH ? EPS : eta > THRESH ? INVEPS : Math.exp(eta);
      return t / (1 + t);
    },
    muEta: (eta) => {
      if (eta > THRESH || eta < -THRESH) return EPS;
      const e = Math.exp(eta);
      const op = 1 + e;
      return e / (op * op);
    },
    variance: (mu) => mu * (1 - mu),
    devRes: (y, mu) => 2 * (ylogy(y, mu) + ylogy(1 - y, 1 - mu)),
    mustart: (y) => (y + 0.5) / 2,
    validmu: (mu) => Number.isFinite(mu) && mu > 0 && mu < 1,
    /** -2 log likelihood of one row */
    aicTerm: (y, mu) => -2 * (y === 1 ? Math.log(mu) : Math.log(1 - mu)),
  },
  poisson: {
    linkfun: (mu) => Math.log(mu),
    linkinv: (eta) => Math.max(Math.exp(eta), EPS),
    muEta: (eta) => Math.max(Math.exp(eta), EPS),
    variance: (mu) => mu,
    devRes: (y, mu) => 2 * (y > 0 ? y * Math.log(y / mu) - (y - mu) : mu),
    mustart: (y) => y + 0.1,
    validmu: (mu) => Number.isFinite(mu) && mu > 0,
    aicTerm: (y, mu) => -2 * (y * Math.log(mu) - mu - lgamma(y + 1)),
  },
};

// ---------------------------------------------------------------- least squares

/**
 * Householder QR of the columns `cols` (each length m, modified in place) with the right-hand side z.
 * Aliased columns (remaining norm below QR_TOL of the original) are skipped, in column order.
 */
function qrSolve(cols, z) {
  const m = z.length;
  const p = cols.length;
  const qtz = Float64Array.from(z);
  const kept = [];
  const orig = cols.map((c) => norm(c, 0));
  let r = 0;
  for (let k = 0; k < p; k++) {
    const x = cols[k];
    const nrm = r < m ? norm(x, r) : 0;
    if (!(nrm > QR_TOL * orig[k]) || r >= m) continue;
    const alpha = x[r] > 0 ? -nrm : nrm;
    const v = new Float64Array(m);
    for (let i = r; i < m; i++) v[i] = x[i];
    v[r] -= alpha;
    let vv = 0;
    for (let i = r; i < m; i++) vv += v[i] * v[i];
    const apply = (col) => {
      let dot = 0;
      for (let i = r; i < m; i++) dot += v[i] * col[i];
      const f = (2 * dot) / vv;
      for (let i = r; i < m; i++) col[i] -= f * v[i];
    };
    for (let j = k + 1; j < p; j++) apply(cols[j]);
    apply(qtz);
    x[r] = alpha;
    for (let i = r + 1; i < m; i++) x[i] = 0;
    kept.push(k);
    r++;
  }
  const R = [];
  for (let a = 0; a < r; a++) R.push(kept.map((j) => cols[j][a]));
  const b = new Array(r).fill(0);
  for (let i = r - 1; i >= 0; i--) {
    let s = qtz[i];
    for (let j = i + 1; j < r; j++) s -= R[i][j] * b[j];
    b[i] = s / R[i][i];
  }
  return { R, b, kept };
}

function norm(c, from) {
  let scale = 0;
  for (let i = from; i < c.length; i++) scale = Math.max(scale, Math.abs(c[i]));
  if (!(scale > 0)) return 0;
  let s = 0;
  for (let i = from; i < c.length; i++) { const t = c[i] / scale; s += t * t; }
  return scale * Math.sqrt(s);
}

/** (R'R)^-1 for upper-triangular R. */
function covUnscaled(R) {
  const r = R.length;
  const inv = Array.from({ length: r }, () => new Array(r).fill(0));
  for (let j = 0; j < r; j++) {
    for (let i = j; i >= 0; i--) {
      let s = i === j ? 1 : 0;
      for (let k = i + 1; k <= j; k++) s -= R[i][k] * inv[k][j];
      inv[i][j] = s / R[i][i];
    }
  }
  return Array.from({ length: r }, (_, i) => Array.from({ length: r }, (_, j) => {
    let s = 0;
    for (let k = Math.max(i, j); k < r; k++) s += inv[i][k] * inv[j][k];
    return s;
  }));
}

// ---------------------------------------------------------------- IRLS

/**
 * @param {Float64Array[]} X         columns of the design matrix (intercept first)
 * @param {Float64Array} y
 * @param {'binomial'|'poisson'} family
 * @param {{ offset?: Float64Array, maxIter?: number, epsilon?: number, etastart?: Float64Array, nullDeviance?: boolean }} [opts]
 *   nullDeviance false skips the null model (profile and drop-one refits need only the deviance); it is then NaN.
 * @returns {{ beta: number[], vcov: number[][], deviance: number, nullDeviance: number, aic: number, iter: number, converged: boolean, fitted: Float64Array, separated: boolean, aliased: boolean[], rank: number, eta: Float64Array, pearson: number, dfResidual: number, workingWeights: Float64Array, workingResiduals: Float64Array }}
 *   beta and vcov have one entry per column of X; an aliased column has beta NaN and a NaN row and column.
 */
export function fitGlm(X, y, family, opts = {}) {
  const fam = FAMILIES[family];
  if (!fam) throw new Error(`models: unknown family ${family}`);
  const n = y.length;
  const p = X.length;
  const maxIter = opts.maxIter ?? 25;
  const epsilon = opts.epsilon ?? 1e-8;
  const offset = opts.offset ?? new Float64Array(n);
  let eta = new Float64Array(n);
  if (opts.etastart) eta.set(opts.etastart);
  else for (let i = 0; i < n; i++) eta[i] = fam.linkfun(fam.mustart(y[i]));
  let mu = eta.map(fam.linkinv);
  const devOf = (m) => ksum(Array.from(m, (mi, i) => fam.devRes(y[i], mi)));
  let devold = devOf(mu);
  let dev = devold;
  let beta = new Array(p).fill(NaN);
  let coefold = null;
  let converged = false;
  let iter = 0;
  let last = { R: [], kept: [] };
  /** glm's `weights`: the working weights of the last iteration (computed before its update of mu) */
  let workingWeights = new Float64Array(n);
  if (p === 0) {
    for (let i = 0; i < n; i++) eta[i] = offset[i];
    mu = eta.map(fam.linkinv);
    dev = devOf(mu);
    converged = true;
  }
  for (iter = 1; p > 0 && iter <= maxIter; iter++) {
    const good = [];
    const zw = [];
    const wts = [];
    for (let i = 0; i < n; i++) {
      const me = fam.muEta(eta[i]);
      if (me === 0) continue;
      const w = Math.sqrt((me * me) / fam.variance(mu[i]));
      good.push(i);
      wts.push(w);
      zw.push(((eta[i] - offset[i]) + (y[i] - mu[i]) / me) * w);
    }
    const cols = X.map((c) => Float64Array.from(good, (i, g) => c[i] * wts[g]));
    const fit = qrSolve(cols, zw);
    last = fit;
    workingWeights = new Float64Array(n);
    good.forEach((i, g) => { workingWeights[i] = wts[g] * wts[g]; });
    let start = new Array(p).fill(0);
    fit.kept.forEach((j, a) => { start[j] = fit.b[a]; });
    const etaOf = (coef) => {
      const e = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        let s = offset[i];
        for (let j = 0; j < p; j++) if (coef[j] !== 0) s += X[j][i] * coef[j];
        e[i] = s;
      }
      return e;
    };
    eta = etaOf(start);
    mu = eta.map(fam.linkinv);
    dev = devOf(mu);
    // Step halving as glm.fit: a non-finite deviance or an invalid mean pulls the step back.
    let halvings = 0;
    while ((!Number.isFinite(dev) || !mu.every(fam.validmu)) && coefold) {
      if (++halvings > maxIter) throw Object.assign(new Error('models: IRLS step halving failed'), { key: 'models.invalid.notConverged' });
      start = start.map((b, j) => (b + coefold[j]) / 2);
      eta = etaOf(start);
      mu = eta.map(fam.linkinv);
      dev = devOf(mu);
    }
    if (!Number.isFinite(dev)) throw Object.assign(new Error('models: deviance not finite at the start'), { key: 'models.invalid.notConverged' });
    beta = start.map((b, j) => (fit.kept.includes(j) ? b : NaN));
    if (Math.abs(dev - devold) / (Math.abs(dev) + 0.1) < epsilon) { converged = true; break; }
    devold = dev;
    coefold = start;
  }
  if (iter > maxIter) iter = maxIter;
  const aliased = X.map((_, j) => !last.kept.includes(j));
  const cu = last.R.length ? covUnscaled(last.R) : [];
  const vcov = Array.from({ length: p }, () => new Array(p).fill(NaN));
  last.kept.forEach((j, a) => last.kept.forEach((k, b) => { vcov[j][k] = cu[a][b]; }));
  const rank = last.kept.length;
  // Null deviance as glm(): the mean of y with an intercept and no offset; with an offset, the deviance
  // of the intercept-only fit with that offset; without an intercept, the offset alone.
  const icol = X.findIndex((c) => c.every((v) => v === 1));
  const hasOffset = offset.some((o) => o !== 0);
  let nullDeviance = NaN;
  if (opts.nullDeviance === false) {
    // not needed by the caller
  } else if (icol >= 0 && !hasOffset) {
    const m = ksum(Array.from(y)) / n;
    nullDeviance = ksum(Array.from(y, (yi) => fam.devRes(yi, m)));
  } else if (icol >= 0) {
    nullDeviance = fitGlm([X[icol]], y, family, { offset, maxIter, epsilon, nullDeviance: false }).deviance;
  } else {
    nullDeviance = ksum(Array.from(y, (yi, i) => fam.devRes(yi, fam.linkinv(offset[i]))));
  }
  const aic = ksum(Array.from(y, (yi, i) => fam.aicTerm(yi, mu[i]))) + 2 * rank;
  const pearson = ksum(Array.from(y, (yi, i) => ((yi - mu[i]) ** 2) / fam.variance(mu[i])));
  let separated = false;
  if (family === 'binomial') separated = mu.some((m) => m < SEPARATION_TOL || m > 1 - SEPARATION_TOL);
  // glm's working residuals: (y - mu) / mu.eta(eta) at the final fit (sandwich's estfun reads these with the weights).
  const workingResiduals = Float64Array.from(y, (yi, i) => (yi - mu[i]) / fam.muEta(eta[i]));
  return { beta, vcov, deviance: dev, nullDeviance, aic, iter, converged, fitted: mu, separated, aliased, rank, eta, pearson, dfResidual: n - rank, workingWeights, workingResiduals };
}

// ---------------------------------------------------------------- the methods

/**
 * roles outcome (binary, levels.outcomePositive), covariates[]; options ciMethod; farm route 'robust' uses models/robust.js (Wald only).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runLogistic(spec, table) {
  return runGlm(spec, table, 'binomial');
}

/**
 * roles outcome (count), covariates[], time (animal-time, log offset; optional); options ciMethod.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runPoisson(spec, table) {
  return runGlm(spec, table, 'poisson');
}

/** The reference level asked for each category covariate (as stats/ols.js reads it), else the column's own. */
function referencesOf(spec, table, covs) {
  const cats = covs.filter((k) => column(table, k).kind === 'category');
  /** @type {Record<string, string|null>} */
  const out = {};
  for (const k of cats) {
    out[k] = spec?.levels?.references?.[k]
      ?? (cats.length === 1 ? spec?.levels?.referenceLevel ?? null : null)
      ?? column(table, k).reference
      ?? null;
  }
  return out;
}

function runGlm(spec, table, family) {
  const logistic = family === 'binomial';
  const yKey = role(spec, 'outcome');
  const covs = [...new Set([].concat(spec?.roles?.covariates ?? []).filter(Boolean))];
  const tKey = logistic ? null : role(spec, 'time');
  if (!table || !yKey || !covs.length) return invalid('stats.error.missingRole');
  const { confLevel } = common(spec);
  const robust = spec?.cluster?.route === 'robust';
  const cKey = robust ? spec?.cluster?.column ?? null : null;
  if (robust && !cKey) return invalid('models.error.needCluster');
  const keys = [yKey, ...covs, ...(tKey ? [tKey] : []), ...(cKey ? [cKey] : [])];
  let { rows, dropped } = completeRows(table, keys);
  for (const k of [...covs, ...(tKey ? [tKey] : [])]) {
    const c = column(table, k);
    if (c.kind !== 'number' && c.kind !== 'category') return invalid('stats.error.needsNumber', { dropped });
    if (k === tKey && c.kind !== 'number') return invalid('stats.error.needsNumber', { dropped });
  }
  // Outcome: logistic 0/1 (a category read through levels.outcomePositive, or a number column of 0 and 1);
  // Poisson a count (non-negative whole numbers).
  const yc = column(table, yKey);
  let yOf;
  if (logistic) {
    if (yc.kind === 'category') {
      const pos = spec?.levels?.outcomePositive ?? null;
      const posIdx = pos == null ? -1 : (yc.levels || []).indexOf(pos);
      if (posIdx < 0) return invalid('models.error.needOutcomeLevel', { dropped });
      const present = new Set(rows.map((i) => yc.values[i]));
      if (present.size > 2) return invalid('models.error.outcomeNotBinary', { dropped });
      yOf = (i) => (yc.values[i] === posIdx ? 1 : 0);
    } else if (yc.kind === 'number') {
      if (rows.some((i) => yc.values[i] !== 0 && yc.values[i] !== 1)) return invalid('models.error.outcomeNotBinary', { dropped });
      yOf = (i) => yc.values[i];
    } else return invalid('models.error.outcomeNotBinary', { dropped });
  } else {
    if (yc.kind !== 'number') return invalid('models.error.needCount', { dropped });
    if (rows.some((i) => !(yc.values[i] >= 0) || !Number.isInteger(yc.values[i]))) return invalid('models.error.needCount', { dropped });
    yOf = (i) => yc.values[i];
  }
  // Animal-time must be positive: a row with time 0 or below cannot carry a log offset; it is dropped and counted.
  if (tKey) {
    const tc = column(table, tKey);
    const bad = rows.filter((i) => !(tc.values[i] > 0));
    if (bad.length) {
      rows = rows.filter((i) => tc.values[i] > 0);
      dropped = [...dropped, { reason: 'invalid', column: tKey, count: bad.length }];
    }
  }
  const design = buildDesign(table, covs, referencesOf(spec, table, covs), { rows });
  const n = rows.length;
  const y = Float64Array.from(rows, yOf);
  const offset = tKey ? Float64Array.from(rows, (i) => Math.log(column(table, tKey).values[i])) : undefined;
  if (logistic) {
    const ones = y.reduce((s, v) => s + v, 0);
    if (ones === 0 || ones === n) return invalid('models.undefined.oneOutcome', { used: n, dropped });
  }
  if (n <= design.X.length) return invalid('stats.undefined.noResidualDf', { used: n, dropped });
  let fit;
  try {
    fit = fitGlm(design.X, y, family, { offset });
  } catch (err) {
    return invalid(err?.key || 'models.invalid.notConverged', { used: n, dropped });
  }
  const { X, names, terms } = design;
  const notes = [];
  const warnings = [];
  if (design.emptyLevels.length) notes.push({ id: 'emptyLevels', severity: 'note', key: 'models.note.emptyLevels', params: { levels: design.emptyLevels.map((e) => `${e.column}=${e.level}`).join(', '), cells: design.emptyLevels.map((e) => [e.column, e.level]) } });
  // resolvedOptions are choices settled from the data (run.js records them in the envelope's options with a
  // note): the reference level each category covariate was compared against, and the interval method when
  // the farm route forces Wald.
  /** @type {Record<string, any>} */
  const resolvedOptions = Object.keys(design.references).length ? { references: design.references } : {};

  // ---- separation (logistic: a category level whose outcomes are all one value, or rows whose linear
  // predictor keeps running off when the fit is pushed further, or fitted probabilities within 1e-8 of 0 or 1;
  // Poisson: a level whose counts are all 0)
  const sep = separationTable(fit, design, y, family, logistic ? divergingRows(design.X, y, family, fit) : null);
  if (sep.length) {
    warnings.push({ id: 'G14', severity: 'warn', key: 'models.guard.G14.title', bodyKey: logistic ? 'models.guard.G14.separation' : 'models.guard.G14.zeroCounts', params: { levels: sep.map((r) => (r[1] == null ? r[0] : `${r[0]}=${r[1]}`)).join(', '), cells: sep.map((r) => [r[0], r[1] ?? null]) } });
    const why = logistic ? 'models.undefined.separation' : 'models.undefined.zeroCounts';
    const values = {};
    names.forEach((nm) => { values[`b:${nm.term}`] = nullVal(why); });
    values.n = val(n);
    if (logistic) values.cases = val(y.reduce((s, v) => s + v, 0));
    else values.count = val(y.reduce((s, v) => s + v, 0));
    values.deviance = nullVal(why);
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
      notes: [...notes, { id: 'separation', severity: 'note', key: 'models.note.separation' }],
      warnings,
      resolvedOptions,
    };
  }
  if (!fit.converged) return invalid('models.invalid.notConverged', { used: n, dropped });
  if (logistic && fit.separated) notes.push({ id: 'fittedExtreme', severity: 'note', key: 'models.note.fittedExtreme' });

  // ---- covariance: model-based, or cluster-robust on the farm route
  let V = fit.vcov;
  let clusters = null;
  let ciMethod = spec?.options?.ciMethod === 'wald' ? 'wald' : 'profile';
  if (robust) {
    const cc = column(table, cKey);
    const ids = new Map();
    const cluster = rows.map((i) => {
      const key = cc.kind === 'category' ? cc.values[i] : String(cc.values[i]);
      if (!ids.has(key)) ids.set(key, ids.size);
      return ids.get(key);
    });
    const kept = fit.aliased.map((a, j) => (a ? -1 : j)).filter((j) => j >= 0);
    const Vr = clusterRobustVcov({ X: kept.map((j) => X[j]), y, fitted: fit.fitted, family, bread: kept.map((j) => kept.map((k) => fit.vcov[j][k])), workingWeights: fit.workingWeights, workingResiduals: fit.workingResiduals }, cluster);
    V = fit.vcov.map((row) => row.map(() => NaN));
    kept.forEach((j, a) => kept.forEach((k, b) => { V[j][k] = Vr[a][b]; }));
    if (ciMethod === 'profile') notes.push({ id: 'robustWald', severity: 'note', key: 'models.note.robustWald' });
    else notes.push({ id: 'robust', severity: 'note', key: 'models.note.robust' });
    if (ciMethod !== 'wald') resolvedOptions.ciMethod = 'wald';
    ciMethod = 'wald';
    clusters = ids.size;
    // The panel greys this route out below ROBUST_MIN_FARMS farms or with no more farms than coefficients
    // (epi/guardrails.js); the engine refuses the same fit when called directly.
    if (clusters < ROBUST_MIN_FARMS || clusters <= kept.length) return invalid('models.error.robustFewFarms', { used: n, dropped });
  }
  // Model-based: normal z, as R's summary.glm and confint.default. Farm route: t on G - 1 df for the Wald
  // p-values and intervals, the usual small-sample reference for cluster-robust errors (review round 1:
  // with the normal z a handful of farms gave extreme p-values).
  const robustDf = robust ? clusters - 1 : null;
  const zq = robust ? qt(1 - (1 - confLevel) / 2, robustDf) : qnorm(1 - (1 - confLevel) / 2);
  const twoSided = (z) => (robust ? ptTwoSided(z, robustDf) : pnormTwoSided(z));
  const coefRows = [];
  const tests = [];
  const bValues = {};
  const ratioValues = {};
  const ratioName = logistic ? 'oddsRatio' : 'rateRatio';
  names.forEach((nm, j) => {
    if (fit.aliased[j]) {
      bValues[`b:${nm.term}`] = nullVal('stats.undefined.aliased');
      coefRows.push([nm.term, null, null, null, null, null, null, null, null, null]);
      tests.push(testRow({ id: `wald:${nm.term}`, name: 'z', statistic: null, p: null, variant: robust ? 'wald-robust' : 'wald', reasonKey: 'stats.undefined.aliased' }));
      return;
    }
    const b = fit.beta[j];
    const se = Math.sqrt(V[j][j]);
    const z = b / se;
    const p = twoSided(z);
    let ci;
    if (ciMethod === 'profile') ci = profileCi([X, y, family, { offset }], j, confLevel, fit);
    else ci = [b - zq * se, b + zq * se];
    const ciOut = [ci[0], ci[1]];
    const bExtra = { se, ci: ciOut, ciLevel: confLevel, ciMethod };
    if (ci[0] === null || ci[1] === null) bExtra.noteKey = 'models.undefined.profileBound';
    bValues[`b:${nm.term}`] = val(b, bExtra);
    const rl = ci[0] === null ? null : Math.exp(ci[0]);
    const ru = ci[1] === null ? null : Math.exp(ci[1]);
    if (j !== 0 || names[0].term !== '(Intercept)') {
      const rExtra = { ci: [rl, ru], ciLevel: confLevel, ciMethod };
      if (ci[0] === null || ci[1] === null) rExtra.noteKey = 'models.undefined.profileBound';
      ratioValues[`${ratioName}:${nm.term}`] = val(Math.exp(b), rExtra);
    }
    const isInt = nm.term === '(Intercept)';
    coefRows.push([nm.term, b, se, z, p, ci[0], ci[1], isInt ? null : Math.exp(b), isInt ? null : rl, isInt ? null : ru]);
    tests.push(testRow({ id: `wald:${nm.term}`, name: robust ? 't' : 'z', statistic: z, df: robustDf, p, variant: robust ? 'wald-robust' : 'wald' }));
  });

  // ---- likelihood-ratio tests: each term dropped (drop1(test = 'LRT')) and the model against the null.
  // Model-based only: on the farm route they would treat farm mates as independent, so they are left out.
  const lrRows = [];
  const hasInt = names[0]?.term === '(Intercept)';
  if (!robust) {
    for (const t of terms) {
      const keep = X.map((_, j) => j).filter((j) => !t.cols.includes(j));
      const df = t.cols.filter((j) => !fit.aliased[j]).length;
      if (!df) { lrRows.push([t.column, 0, null, null]); continue; }
      let red;
      try { red = fitGlm(keep.map((j) => X[j]), y, family, { offset, nullDeviance: false }); } catch { red = null; }
      const stat = red && red.converged ? red.deviance - fit.deviance : NaN;
      const p = Number.isFinite(stat) ? pchisqUpper(Math.max(stat, 0), df) : NaN;
      lrRows.push([t.column, df, Number.isFinite(stat) ? stat : null, Number.isFinite(p) ? p : null]);
      tests.push(testRow({ id: `lr:${t.column}`, name: 'X2', statistic: stat, df, p, variant: 'lrt' }));
    }
    const dfModel = fit.rank - (hasInt ? 1 : 0);
    if (dfModel > 0) {
      const stat = fit.nullDeviance - fit.deviance;
      tests.unshift(testRow({ id: 'lrNull', name: 'X2', statistic: stat, df: dfModel, p: pchisqUpper(Math.max(stat, 0), dfModel), variant: 'lrt' }));
    }
  } else {
    notes.push({ id: 'robustNoLr', severity: 'note', key: 'models.note.robustNoLr' });
  }

  // ---- fit summaries and the findings the fit raises
  const values = { ...ratioValues, ...bValues, n: val(n) };
  const predictors = fit.rank - (hasInt ? 1 : 0);
  if (logistic) {
    const events = y.reduce((s, v) => s + v, 0);
    const smaller = Math.min(events, n - events);
    values.cases = val(events);
    if (predictors > 0) {
      const epv = smaller / predictors;
      values.epv = val(epv, { below: [10] });
      if (epv < 10) warnings.push({ id: 'G14', severity: 'warn', key: 'models.guard.G14.title', bodyKey: 'models.guard.G14.epv', params: { epv, events: smaller, predictors } });
    }
  } else {
    const dispersion = fit.dfResidual > 0 ? fit.pearson / fit.dfResidual : NaN;
    values.dispersion = fit.dfResidual > 0 ? val(dispersion, { above: [1.5] }) : nullVal('stats.undefined.noResidualDf');
    if (dispersion > 1.5) warnings.push({ id: 'G23', severity: 'warn', key: 'models.guard.G23.title', bodyKey: 'models.guard.G23.overdispersion', params: { ratio: Math.round(dispersion * 100) / 100 } });
    values.count = val(y.reduce((s, v) => s + v, 0));
  }
  values.deviance = val(fit.deviance);
  values.nullDeviance = val(fit.nullDeviance);
  values.dfResidual = val(fit.dfResidual);
  values.aic = val(fit.aic);
  values.iterations = val(fit.iter);
  if (clusters !== null) values.clusters = val(clusters);
  const tables = [
    { id: 'coefficients', columns: ['ws.col.term', 'ws.col.estimate', 'ws.col.se', robust ? 'ws.col.t' : 'models.col.z', 'ws.col.p', 'ws.col.lower', 'ws.col.upper', logistic ? 'models.col.or' : 'models.col.irr', 'models.col.ratioLower', 'models.col.ratioUpper'], rows: coefRows },
    referencesTable(design.references),
  ];
  if (lrRows.length) tables.push({ id: 'lrTests', columns: ['ws.col.term', 'ws.col.df', 'models.col.lrStat', 'ws.col.p'], rows: lrRows });
  return { status: 'ok', values, tests, tables, used: n, dropped, notes, warnings, resolvedOptions };
}

export const DIVERGE_STEPS = 6;
/**
 * Rows whose linear predictor keeps moving when the fit is pushed a few more IRLS steps past R's stop.
 * At a finite maximum Newton has converged and further steps move eta by far less than 1e-6; under
 * separation each step moves the separated rows' eta by about 1 towards their outcome, whatever the
 * deviance of the rest of the data (the 1e-8 fitted-value rule depends on it). Null when the refit fails.
 * @returns {boolean[]|null}
 */
export function divergingRows(X, y, family, fit) {
  let more;
  try {
    more = fitGlm(X, y, family, { etastart: fit.eta, maxIter: DIVERGE_STEPS, epsilon: -1, nullDeviance: false });
  } catch {
    return null;
  }
  return Array.from(fit.eta, (e, i) => {
    const d = more.eta[i] - e;
    return (y[i] === 0 && d < -1) || (y[i] === 1 && d > 1);
  });
}

function referencesTable(refs) {
  return { id: 'references', columns: ['models.col.column', 'models.col.referenceLevel'], rows: Object.entries(refs).map(([k, l]) => [k, l]) };
}

/**
 * Rows of the 'separation' table: [column, level (for a number: models.cell.sideLow or models.cell.sideHigh,
 * the end of its range that is separated), the one outcome of those rows (0 or 1), n]. Empty when the fit
 * is not separated.
 */
function separationTable(fit, design, y, family, diverging = null) {
  const { X, names, terms, rows } = design;
  const out = [];
  if (family === 'binomial') {
    // A number or a combination is separated only when its rows keep running off as the fit is pushed further
    // (divergingRows). A fitted value within 1e-8 of 0 or 1 alone is not separation: a steep but finite fit (an
    // age-seroprevalence curve, one animal with an extreme covariate) reaches it too and has a finite maximum
    // (review round 2). R only warns there; the note models.note.fittedExtreme says the same. The 1e-8 rule is
    // the fallback only when the refit itself failed.
    const extreme = diverging
      ? diverging.map(Boolean)
      : Array.from(fit.fitted, (m, i) => (m < SEPARATION_TOL && y[i] === 0) || (m > 1 - SEPARATION_TOL && y[i] === 1));
    const flagged = extreme.some(Boolean);
    // rows already accounted for by a separated category level do not make a number look separated too
    const explained = new Array(rows.length).fill(false);
    const catFirst = [...terms].sort((a, b) => Number(names[b.cols[0]]?.level != null) - Number(names[a.cols[0]]?.level != null));
    for (const t of catFirst) {
      if (t.cols.length && names[t.cols[0]].level !== null) {
        // each level (the reference level is the rows with 0 in every column of the term). Checked exactly,
        // whatever the fit: a level whose outcomes are all one value has no finite coefficient (its fitted
        // value only creeps towards 0 or 1 as far as the deviance stop lets it, which on a large remainder
        // is well above 1e-8; review round 1).
        const groups = new Map();
        for (let i = 0; i < rows.length; i++) {
          const j = t.cols.find((c) => X[c][i] === 1);
          const lev = j === undefined ? design.references[t.column] : names[j].level;
          if (!groups.has(lev)) groups.set(lev, []);
          groups.get(lev).push(i);
        }
        for (const [lev, idx] of groups) {
          if (idx.length && idx.every((i) => y[i] === y[idx[0]])) {
            out.push([t.column, lev, y[idx[0]], idx.length]);
            for (const i of idx) explained[i] = true;
          }
        }
      } else if (t.cols.length && flagged) {
        // a number: the extreme rows sit at one end of its range with one outcome
        const x = X[t.cols[0]];
        const ord = Array.from(x, (_, i) => i).filter((i) => !explained[i]).sort((a, b) => x[a] - x[b]);
        for (const [side, seq] of [['low', ord], ['high', [...ord].reverse()]]) {
          let k = 0;
          while (k < seq.length && extreme[seq[k]] && y[seq[k]] === y[seq[0]]) k++;
          if (k > 0 && k < seq.length && x[seq[k]] !== x[seq[k - 1]]) out.push([t.column, side === 'low' ? 'models.cell.sideLow' : 'models.cell.sideHigh', y[seq[0]], k]);
        }
      }
    }
    if (!out.length && flagged) out.push(['models.cell.combination', null, null, extreme.filter(Boolean).length]);
    return out;
  }
  // Poisson: a category level whose counts are all 0 has no finite rate.
  for (const t of terms) {
    if (!t.cols.length || names[t.cols[0]].level === null) continue;
    const sums = new Map();
    for (let i = 0; i < rows.length; i++) {
      const j = t.cols.find((c) => X[c][i] === 1);
      const lev = j === undefined ? design.references[t.column] : names[j].level;
      const s = sums.get(lev) || { y: 0, n: 0 };
      s.y += y[i]; s.n++;
      sums.set(lev, s);
    }
    for (const [lev, s] of sums) if (s.y === 0) out.push([t.column, lev, 0, s.n]);
  }
  return out;
}
