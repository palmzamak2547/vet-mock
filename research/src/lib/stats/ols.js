// Ordinary least squares by Householder QR (never the normal equations) [M1-DESIGN.md 7.11].
// Categorical predictors expand to treatment contrasts against the codebook's reference level.
// NIST StRD Longley and Norris are the certified pins. OWNER: stats role.
//
// Numerics: when the model has an intercept the other columns and y are centred first (the
// intercept column is then orthogonal to them), which is algebraically the same fit and removes the
// ill-conditioning a far-from-zero column causes (Longley's year, 1947 to 1962). The centred columns
// are scaled to unit length before the QR and unscaled after. Rank deficiency is handled like R's
// dqrdc2: a column whose remaining norm falls below tol (1e-7) of its original norm is aliased,
// gets no coefficient (null with reason stats.undefined.aliased) and is left out of the fit.
// The residual sum of squares is the squared norm of the tail of Q'y (compensated sum).
//
// runOls values: r2, adjR2, sigma (residual SD), df (residual), n; the test 'overall' (F with
// dfPair, p; only with an intercept and at least one slope); the table 'coefficients' (term,
// estimate, se, t, p, lower, upper).
import { ptTwoSided, pfUpper, qt } from './dist.js';
import { mean, ksum, val, nullVal, testRow, role, common, completeRows, column } from './common.js';

const TOL = 1e-7;

/** Euclidean norm with scaling (no overflow, no argument-count limit). */
function norm2(c) {
  let scale = 0;
  for (let i = 0; i < c.length; i++) scale = Math.max(scale, Math.abs(c[i]));
  if (!(scale > 0)) return 0;
  let s = 0;
  for (let i = 0; i < c.length; i++) { const t = c[i] / scale; s += t * t; }
  return scale * Math.sqrt(s);
}

/** Householder QR of the columns of A (array of column arrays, modified in place), with Q'y. */
function householder(cols, y) {
  const n = y.length;
  const p = cols.length;
  const qty = y.slice();
  const R = []; // R rows for kept columns: R[k][j]
  const kept = [];
  const orig = cols.map(norm2);
  const vs = [];
  let r = 0;
  for (let k = 0; k < p; k++) {
    const x = cols[k];
    // apply earlier reflections already done (cols updated in place below)
    let norm = 0;
    {
      let scale = 0;
      for (let i = r; i < n; i++) scale = Math.max(scale, Math.abs(x[i]));
      if (scale > 0) { let s = 0; for (let i = r; i < n; i++) { const t = x[i] / scale; s += t * t; } norm = scale * Math.sqrt(s); }
    }
    if (!(norm > TOL * orig[k]) || r >= n) { kept.push(false); continue; }
    const alpha = x[r] > 0 ? -norm : norm;
    const v = new Float64Array(n);
    for (let i = r; i < n; i++) v[i] = x[i];
    v[r] -= alpha;
    let vnorm2 = 0;
    for (let i = r; i < n; i++) vnorm2 += v[i] * v[i];
    const apply = (col) => {
      let dot = 0;
      for (let i = r; i < n; i++) dot += v[i] * col[i];
      const f = (2 * dot) / vnorm2;
      for (let i = r; i < n; i++) col[i] -= f * v[i];
    };
    for (let j = k + 1; j < p; j++) apply(cols[j]);
    apply(qty);
    x[r] = alpha;
    for (let i = r + 1; i < n; i++) x[i] = 0;
    vs.push({ v, r });
    kept.push(true);
    r++;
  }
  // R matrix: rows 0..r-1, columns = kept columns in order
  const keptIdx = kept.map((k, j) => (k ? j : -1)).filter((j) => j >= 0);
  for (let a = 0; a < r; a++) R.push(keptIdx.map((j) => cols[j][a]));
  return { R, qty, rank: r, keptIdx };
}

/** Solve upper-triangular R b = c. */
function backSolve(R, c) {
  const r = R.length;
  const b = new Array(r).fill(0);
  for (let i = r - 1; i >= 0; i--) {
    let s = c[i];
    for (let j = i + 1; j < r; j++) s -= R[i][j] * b[j];
    b[i] = s / R[i][i];
  }
  return b;
}

/** Inverse of upper-triangular R (upper-triangular). */
function invUpper(R) {
  const r = R.length;
  const inv = Array.from({ length: r }, () => new Array(r).fill(0));
  for (let j = 0; j < r; j++) {
    const e = new Array(r).fill(0);
    e[j] = 1;
    const col = backSolve(R, e);
    for (let i = 0; i < r; i++) inv[i][j] = col[i];
  }
  return inv;
}

/**
 * @param {number[][]} X   design matrix rows, intercept column included by the caller when wanted
 * @param {number[]} y
 * @param {{ intercept?: boolean|null }} [opts]  intercept: which column is the intercept is detected
 *   (a column of ones); pass false to fit without centring even if a column of ones is present
 * @returns {{ coef: (number|null)[], se: (number|null)[], t: (number|null)[], p: (number|null)[], df: number, sigma: number|null, r2: number|null, adjR2: number|null, F: number|null, pF: number|null, rank: number, rss: number, aliased: boolean[] }}
 */
export function olsQr(X, y, opts = {}) {
  const n = y.length;
  const p = X[0]?.length ?? 0;
  let icol = -1;
  if (opts.intercept !== false) for (let j = 0; j < p; j++) if (X.every((row) => row[j] === 1)) { icol = j; break; }
  const hasInt = icol >= 0;
  const ybar = hasInt ? mean(y) : 0;
  const others = [];
  for (let j = 0; j < p; j++) if (j !== icol) others.push(j);
  const xbar = others.map((j) => (hasInt ? mean(X.map((row) => row[j])) : 0));
  const cols = others.map((j, a) => X.map((row) => row[j] - xbar[a]));
  const scale = cols.map((c) => { const s = norm2(c); return s > 0 ? s : 1; });
  cols.forEach((c, a) => { for (let i = 0; i < n; i++) c[i] /= scale[a]; });
  const yc = y.map((v) => v - ybar);
  const { R, qty, rank, keptIdx } = householder(cols, yc);
  const bScaled = backSolve(R, qty.slice(0, rank));
  const rss = ksum(qty.slice(rank).map((v) => v * v));
  const df = n - rank - (hasInt ? 1 : 0);
  const sigma2 = df > 0 ? rss / df : NaN;
  const Rinv = invUpper(R);
  // covariance of the scaled slopes: sigma2 * Rinv Rinv'
  const covS = Array.from({ length: rank }, (_, i) => Array.from({ length: rank }, (_, j) => {
    let s = 0;
    for (let k = Math.max(i, j); k < rank; k++) s += Rinv[i][k] * Rinv[j][k];
    return s * sigma2;
  }));
  const coef = new Array(p).fill(null);
  const se = new Array(p).fill(null);
  const aliased = new Array(p).fill(false);
  others.forEach((j, a) => { aliased[j] = true; });
  keptIdx.forEach((a, k) => {
    const j = others[a];
    aliased[j] = false;
    coef[j] = bScaled[k] / scale[a];
    se[j] = Math.sqrt(covS[k][k]) / scale[a];
  });
  if (hasInt) {
    // b0 = ybar - sum xbar_a b_a ; Var(b0) = sigma2 / n + x' Cov x with x the (scaled) means
    let b0 = ybar;
    const w = keptIdx.map((a) => xbar[a] / scale[a]);
    keptIdx.forEach((a, k) => { b0 -= w[k] * bScaled[k]; });
    // [(X'X)^-1]_00 = 1/n + || R^-T w ||^2: a sum of squares, so nothing cancels
    const u = new Array(rank).fill(0);
    for (let i = 0; i < rank; i++) {
      let s2 = w[i];
      for (let k = 0; k < i; k++) s2 -= R[k][i] * u[k];
      u[i] = s2 / R[i][i];
    }
    const v = sigma2 * (1 / n + ksum(u.map((x) => x * x)));
    coef[icol] = b0;
    se[icol] = Math.sqrt(v);
  }
  const t = coef.map((b, j) => (b === null || !(se[j] > 0) ? null : b / se[j]));
  const pv = t.map((tv) => (tv === null || !(df > 0) ? null : ptTwoSided(tv, df)));
  const tss = hasInt ? ksum(yc.map((v) => v * v)) : ksum(y.map((v) => v * v));
  const r2 = tss > 0 ? 1 - rss / tss : null;
  const dfModel = rank;
  const adjR2 = r2 === null || !(df > 0) ? null : 1 - (1 - r2) * ((n - (hasInt ? 1 : 0)) / df);
  let F = null;
  let pF = null;
  if (dfModel > 0 && df > 0 && rss > 0) {
    F = ((tss - rss) / dfModel) / (rss / df);
    pF = pfUpper(F, dfModel, df);
  }
  return { coef, se: se.map((s) => (s === null || Number.isNaN(s) ? null : s)), t, p: pv, df, sigma: df > 0 ? Math.sqrt(sigma2) : null, r2, adjR2, F, pF, rank: rank + (hasInt ? 1 : 0), rss, aliased };
}

/**
 * Implementation for 'reg.ols'. Roles: `outcome` (number); `covariates` (numbers, or categories
 * expanded to treatment contrasts). The reference level of a category covariate is, in order:
 * `spec.levels.references[col]` when normalizeSpec provides it, `spec.levels.referenceLevel` when
 * there is a single category covariate, else the first level in codebook order.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runOls(spec, table) {
  const yKey = role(spec, 'outcome') ?? role(spec, 'y');
  const covs = [].concat(spec?.roles?.covariates ?? role(spec, 'x') ?? []).filter(Boolean);
  if (!yKey || !covs.length) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
  const { confLevel } = common(spec);
  const intercept = spec?.options?.intercept !== false;
  const { rows, dropped } = completeRows(table, [yKey, ...covs]);
  const ycol = column(table, yKey);
  if (ycol.kind !== 'number') return { status: 'invalid', values: { reason: nullVal('stats.error.needsNumber') }, tests: [], tables: [], used: 0, dropped };
  const catCovs = covs.filter((k) => column(table, k).kind === 'category');
  const terms = intercept ? ['(Intercept)'] : [];
  const builders = [];
  for (const k of covs) {
    const c = column(table, k);
    if (c.kind === 'number') { terms.push(k); builders.push((i) => [c.values[i]]); }
    else if (c.kind === 'category') {
      const levels = c.levels || [];
      let ref = spec?.levels?.references?.[k] ?? (catCovs.length === 1 ? spec?.levels?.referenceLevel : null);
      let refIdx = ref != null ? levels.indexOf(ref) : 0;
      if (refIdx < 0) refIdx = 0;
      const others = levels.map((_, j) => j).filter((j) => j !== refIdx);
      for (const j of others) terms.push(`${k}=${levels[j]}`);
      builders.push((i) => others.map((j) => (c.values[i] === j ? 1 : 0)));
    } else return { status: 'invalid', values: { reason: nullVal('stats.error.needsNumber') }, tests: [], tables: [], used: 0, dropped };
  }
  const X = rows.map((i) => (intercept ? [1] : []).concat(...builders.map((b) => b(i))));
  const y = rows.map((i) => ycol.values[i]);
  if (rows.length <= X[0]?.length) return { status: 'invalid', values: { reason: nullVal('stats.undefined.noResidualDf') }, tests: [], tables: [], used: rows.length, dropped };
  const f = olsQr(X, y, { intercept });
  const q = f.df > 0 ? qt(1 - (1 - confLevel) / 2, f.df) : NaN;
  const coefRows = terms.map((term, j) => {
    const b = f.coef[j];
    const s = f.se[j];
    return [term, b, s, f.t[j], f.p[j], b === null || s === null || Number.isNaN(q) ? null : b - q * s, b === null || s === null || Number.isNaN(q) ? null : b + q * s];
  });
  const values = {
    n: val(rows.length),
    df: val(f.df),
    sigma: f.sigma === null ? nullVal('stats.undefined.noResidualDf') : val(f.sigma),
    r2: f.r2 === null ? nullVal('stats.undefined.zeroVariance') : val(f.r2),
    adjR2: f.adjR2 === null ? nullVal('stats.undefined.noResidualDf') : val(f.adjR2),
  };
  if (f.aliased.some(Boolean)) values.aliased = val(f.aliased.filter(Boolean).length, { reasonKey: 'stats.undefined.aliased' });
  const tests = [];
  if (intercept && f.rank > 1) tests.push(testRow({ id: 'overall', name: 'F', statistic: f.F, df: null, dfPair: [f.rank - 1, f.df], p: f.pF, variant: 'ols' }));
  return {
    status: 'ok',
    values,
    tests,
    tables: [{ id: 'coefficients', columns: ['term', 'estimate', 'se', 't', 'p', 'lower', 'upper'], rows: coefRows }],
    used: rows.length,
    dropped,
  };
}
