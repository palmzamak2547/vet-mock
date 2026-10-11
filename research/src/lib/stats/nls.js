// Nonlinear least squares by Levenberg-Marquardt, with the Gauss-Newton covariance [M3-DESIGN.md 3.1.1, C2, C13].
// The models (4PL, 5PL, Michaelis-Menten, decay, growth) and the methods that use them are in curves.js; this
// file knows only fitted values, Jacobians and sums of squares. OWNER: lab role.
//
// Minimises RSS(p) = sum (y_i - f_i(p))^2 with analytic Jacobians J = df/dp (n x k):
// - Each step solves min || [Js; sqrt(lambda) I] u - [r; 0] || by Householder QR (never the normal equations),
//   where Js is J with every column scaled to unit length (Marquardt's damping lambda diag(J'J)) and the step is
//   delta = u / ||J_j||. Every iteration first tries the Gauss-Newton step (lambda at its floor) with R's nls step
//   factor: halved until the RSS falls, down to 1/1024, and doubled (to at most 1) after a success. Only when no
//   factor lowers the RSS does Levenberg-Marquardt take over: lambda starts at 1e-3, x10 on a rejected step, /10
//   on an accepted one. Damping alone crawls along a long narrow valley (exponential growth over widely spaced
//   x, fix-stats finding 2), swinging between an overshooting step and a tiny one until the steps run out.
// - Converged when one step changes every parameter by less than 1e-10 of its size and the RSS by less than
//   1e-12 relative (accepted or not: a step that small that cannot lower the RSS means the minimum is reached to
//   rounding); for Gauss-Newton the whole step is judged, never a halved one. The size of a parameter is |p_j| plus its resolution sigma / ||J_j|| (the change that
//   moves the fitted values by one residual SD), so a parameter whose estimate is near 0 is judged on its own
//   scale. At most 200 steps (a Gauss-Newton step with its halvings counts once); then status 'invalid',
//   lab.invalid.notConverged. A start or a step whose fitted values are not finite is rejected like any other.
// - Safety net (R's nls criterion, Bates and Watts 1981): at the stopping point the Gauss-Newton increment, the
//   projection of the residuals on the columns of J, must be below 1e-5 of the residual SD (the "relative
//   offset"); otherwise the fit stopped at a point that is not a minimum and says notConverged, never a number.
// - Covariance s^2 (J'J)^-1 at the solution, from the QR of the scaled J: (J'J)^-1 = D^-1 R^-1 R^-T D^-1. A
//   column whose remaining norm after the earlier columns falls below 1e-7 of its own norm (R's qr tolerance,
//   used by nls for its "singular gradient") is a parameter the data cannot determine: lab.invalid.singular. A
//   column that is exactly 0 at the stopping point but was not at the start is a parameter that ran away to where
//   it no longer moves any fitted value (NIST BoxBOD from Start 1 did, b2 to 8e47, under damping alone): that fit
//   never settled, so it says notConverged.
// - Parameter intervals est +- qt(1 - alpha/2, df) SE with df = n - k; delta-method SEs sqrt(g' V g).
// Pinned by the NIST StRD nonlinear sets (tests/unit/stats-nls.test.mjs) and R 4.6.0 nls (stats-curves).
import { qt, pfUpper } from './dist.js';
import { ksum } from './common.js';

const PTOL = 1e-10;
const FTOL = 1e-12;
const MAX_ITER = 200;
const LAMBDA0 = 1e-3;
// lambda never falls below this (sqrt 3e-13 against unit columns: no damping left that matters) nor rises above
// the cap (a step that small has met the parameter test long before; reaching it means no progress at all).
const LAMBDA_MIN = 1e-25;
const LAMBDA_MAX = 1e25;
const RANK_TOL = 1e-7;
const OFFSET_TOL = 1e-5;
// R's nls minFactor: the smallest Gauss-Newton step factor tried before Levenberg-Marquardt takes over
const MIN_FACTOR = 1 / 1024;

/**
 * @typedef {Object} NlsModel
 * @property {number} k                                    number of parameters
 * @property {(p: Float64Array) => Float64Array} fitted    fitted values, one per observation
 * @property {(p: Float64Array) => Float64Array[]} jacobian  k columns of df_i/dp_j, each of length n
 */

/**
 * @typedef {Object} NlsFit
 * @property {'ok'|'invalid'} status
 * @property {string} [reasonKey]       lab.invalid.notConverged, lab.invalid.singular, lab.invalid.tooFewPoints
 * @property {number[]} p               estimates (the last point reached when not converged)
 * @property {number} rss
 * @property {number} n
 * @property {number} k
 * @property {number} df                n - k
 * @property {number} sigma             sqrt(rss / df)
 * @property {number[][]|null} cov      s^2 (J'J)^-1
 * @property {number[][]|null} xtxInv   (J'J)^-1
 * @property {number[]|null} se
 * @property {Float64Array} fitted
 * @property {number} iterations        trial steps taken
 * @property {number|null} offset       Bates-Watts relative offset at the stopping point
 * @property {boolean} perfect          the residual SD is rounding noise against the spread of y (intervals are artefacts)
 */

/** Euclidean norm of c[from..] with scaling (no overflow). */
function norm2(c, from = 0) {
  let scale = 0;
  for (let i = from; i < c.length; i++) scale = Math.max(scale, Math.abs(c[i]));
  if (!(scale > 0)) return 0;
  let s = 0;
  for (let i = from; i < c.length; i++) { const t = c[i] / scale; s += t * t; }
  return scale * Math.sqrt(s);
}

function sumSq(r) {
  const sq = new Float64Array(r.length);
  for (let i = 0; i < r.length; i++) sq[i] = r[i] * r[i];
  return ksum(sq);
}

function allFinite(a) {
  for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) return false;
  return true;
}

/**
 * Householder QR of the columns (each modified in place) and Q'b. Column j is deficient when its norm on rows
 * j.. after the earlier reflections is below tol times its original norm; a deficient column is left in place
 * (no pivoting) and flagged, which is all the callers need (any deficiency means singular).
 * @param {Float64Array[]} cols
 * @param {Float64Array} b
 * @param {number} tol
 * @returns {{ R: number[][], qtb: Float64Array, deficient: boolean }}
 */
function householder(cols, b, tol) {
  const k = cols.length;
  const m = b.length;
  const qtb = Float64Array.from(b);
  const orig = cols.map((c) => norm2(c));
  let deficient = false;
  const v = new Float64Array(m);
  for (let j = 0; j < k; j++) {
    const x = cols[j];
    const nrm = norm2(x, j);
    if (!(nrm > tol * orig[j])) { deficient = true; continue; }
    const alpha = x[j] > 0 ? -nrm : nrm;
    let vn = 0;
    for (let i = j; i < m; i++) { v[i] = x[i]; }
    v[j] -= alpha;
    for (let i = j; i < m; i++) vn += v[i] * v[i];
    if (vn > 0) {
      const apply = (col) => {
        let dot = 0;
        for (let i = j; i < m; i++) dot += v[i] * col[i];
        const f = (2 * dot) / vn;
        for (let i = j; i < m; i++) col[i] -= f * v[i];
      };
      for (let jj = j + 1; jj < k; jj++) apply(cols[jj]);
      apply(qtb);
    }
    x[j] = alpha;
    for (let i = j + 1; i < m; i++) x[i] = 0;
  }
  const R = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => (j >= i ? cols[j][i] : 0)));
  return { R, qtb, deficient };
}

/** Solve upper-triangular R u = c (first k entries of c). */
function backSolve(R, c) {
  const k = R.length;
  const u = new Float64Array(k);
  for (let i = k - 1; i >= 0; i--) {
    let s = c[i];
    for (let j = i + 1; j < k; j++) s -= R[i][j] * u[j];
    u[i] = s / R[i][i];
  }
  return u;
}

/** Inverse of an upper-triangular R. */
function invUpper(R) {
  const k = R.length;
  const inv = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let j = 0; j < k; j++) {
    const e = new Float64Array(k);
    e[j] = 1;
    const col = backSolve(R, e);
    for (let i = 0; i < k; i++) inv[i][j] = col[i];
  }
  return inv;
}

/** One damped step: min || [Js; sqrt(lambda) I] u - [r; 0] ||, by QR of the augmented matrix. */
function lmStep(Js, r, lambda) {
  const n = r.length;
  const k = Js.length;
  const sl = Math.sqrt(lambda);
  const cols = Js.map((c, j) => {
    const a = new Float64Array(n + k);
    a.set(c);
    a[n + j] = sl;
    return a;
  });
  const b = new Float64Array(n + k);
  b.set(r);
  const { R, qtb } = householder(cols, b, 0);
  return backSolve(R, qtb);
}

function residuals(y, f) {
  const r = new Float64Array(y.length);
  for (let i = 0; i < y.length; i++) r[i] = y[i] - f[i];
  return r;
}

/**
 * Fit a nonlinear least-squares model by Levenberg-Marquardt from `start`.
 * @param {NlsModel} model
 * @param {ArrayLike<number>} y
 * @param {ArrayLike<number>} start
 * @param {{ maxIter?: number }} [opts]
 * @returns {NlsFit}
 */
export function nlsFit(model, y, start, opts = {}) {
  const maxIter = opts.maxIter ?? MAX_ITER;
  const n = y.length;
  const k = model.k;
  const base = { n, k, df: n - k, cov: null, xtxInv: null, se: null, offset: null, perfect: false };
  if (!(n > k)) return { ...base, status: 'invalid', reasonKey: 'lab.invalid.tooFewPoints', p: Array.from(start), rss: NaN, sigma: NaN, fitted: new Float64Array(n), iterations: 0 };
  let p = Float64Array.from(start);
  let f = model.fitted(p);
  const notConverged = (iterations) => ({ ...base, status: 'invalid', reasonKey: 'lab.invalid.notConverged', p: Array.from(p), rss: NaN, sigma: NaN, fitted: f, iterations });
  if (!allFinite(p) || !allFinite(f)) return notConverged(0);
  const startNorms = model.jacobian(p).map((c) => norm2(c));
  let r = residuals(y, f);
  let rss = sumSq(r);
  let lambda = LAMBDA0;
  let iter = 0;
  let converged = rss === 0;
  let fac = 1;
  outer: while (!converged) {
    const J = model.jacobian(p);
    if (!J.every(allFinite)) break;
    const d = J.map((c) => { const s = norm2(c); return s > 0 ? s : 1; });
    const Js = J.map((c, j) => { const out = new Float64Array(n); for (let i = 0; i < n; i++) out[i] = c[i] / d[j]; return out; });
    const sigmaHat = Math.sqrt(rss / (n - k));
    const trial = (u, scale) => {
      const delta = new Float64Array(k);
      let small = true;
      for (let j = 0; j < k; j++) {
        delta[j] = (scale * u[j]) / d[j];
        if (!(Math.abs(delta[j]) <= PTOL * (Math.abs(p[j]) + sigmaHat / d[j]))) small = false;
      }
      const pNew = new Float64Array(k);
      for (let j = 0; j < k; j++) pNew[j] = p[j] + delta[j];
      let rssNew = Infinity;
      let fNew = null;
      let rNew = null;
      if (allFinite(pNew)) {
        fNew = model.fitted(pNew);
        if (allFinite(fNew)) { rNew = residuals(y, fNew); rssNew = sumSq(rNew); }
      }
      return { small, pNew, fNew, rNew, rssNew };
    };
    // 1. Gauss-Newton with R's step factor: halved until the RSS falls (down to 1/1024), doubled after a success.
    if (iter >= maxIter) break;
    iter += 1;
    const g = lmStep(Js, r, LAMBDA_MIN);
    // the parameter test reads the whole Gauss-Newton step, never a halved one
    let gSmall = true;
    for (let j = 0; j < k; j++) if (!(Math.abs(g[j] / d[j]) <= PTOL * (Math.abs(p[j]) + sigmaHat / d[j]))) gSmall = false;
    for (let f0 = gSmall ? 1 : fac; f0 >= MIN_FACTOR; f0 /= 2) {
      const t = trial(g, f0);
      if (gSmall && Number.isFinite(t.rssNew) && Math.abs(t.rssNew - rss) <= FTOL * rss) {
        if (t.rssNew < rss) { p = t.pNew; f = t.fNew; r = t.rNew; rss = t.rssNew; }
        converged = true;
        break outer;
      }
      if (t.rssNew < rss) {
        p = t.pNew; f = t.fNew; r = t.rNew; rss = t.rssNew;
        fac = Math.min(1, 2 * f0);
        if (rss === 0) { converged = true; break outer; }
        continue outer;
      }
    }
    fac = 1;
    // 2. Levenberg-Marquardt when no factor of the Gauss-Newton step lowers the RSS.
    for (;;) {
      if (iter >= maxIter) break outer;
      iter += 1;
      const t = trial(lmStep(Js, r, lambda), 1);
      if (t.rssNew < rss) {
        const rel = (rss - t.rssNew) / rss;
        p = t.pNew; f = t.fNew; r = t.rNew; rss = t.rssNew;
        lambda = Math.max(lambda / 10, LAMBDA_MIN);
        if ((t.small && rel <= FTOL) || rss === 0) { converged = true; break outer; }
        continue outer;
      }
      if (t.small && Number.isFinite(t.rssNew) && Math.abs(t.rssNew - rss) <= FTOL * rss) { converged = true; break outer; }
      lambda *= 10;
      if (lambda > LAMBDA_MAX) break outer;
    }
  }
  if (!converged) return notConverged(iter);

  // At the solution: QR of the scaled Jacobian, rank, relative offset, covariance.
  const at = nlsAt(model, y, p);
  if (at.reasonKey === 'lab.invalid.notConverged') return notConverged(iter);
  if (at.zero.some((z, j) => z && startNorms[j] > 0)) return notConverged(iter);
  if (at.deficient) return { ...base, status: 'invalid', reasonKey: 'lab.invalid.singular', p: Array.from(p), rss: at.rss, sigma: at.sigma, fitted: f, iterations: iter };
  if (!at.perfect && !(at.offset <= OFFSET_TOL)) return { ...notConverged(iter), offset: at.offset };
  return { ...base, status: 'ok', p: Array.from(p), rss: at.rss, sigma: at.sigma, cov: at.cov, xtxInv: at.xtxInv, se: at.se, fitted: at.fitted, iterations: iter, offset: at.offset, perfect: at.perfect };
}

/**
 * The least-squares quantities at a given point, without fitting: the RSS, the QR of the scaled Jacobian, the
 * rank, the relative offset (Bates and Watts, each part divided by its df) and R's nls convergence value
 * (the same ratio without the df: sqrt(||Q1'r||^2 / ||Q2'r||^2), which nls stops on below tol = 1e-5), (J'J)^-1 and
 * s^2 (J'J)^-1. nlsFit reports through this at its solution; the tests evaluate it at R's printed estimates.
 * @param {NlsModel} model @param {ArrayLike<number>} y @param {ArrayLike<number>} point
 * @returns {{ reasonKey?: string, rss: number, df: number, sigma: number, fitted: Float64Array, zero: boolean[], deficient: boolean,
 *   offset: number|null, rOffset: number|null, perfect: boolean, xtxInv: number[][]|null, cov: number[][]|null, se: number[]|null }}
 */
export function nlsAt(model, y, point) {
  const n = y.length;
  const k = model.k;
  const p = Float64Array.from(point);
  const fitted = model.fitted(p);
  const r = residuals(y, fitted);
  const rss = sumSq(r);
  const sigma = Math.sqrt(rss / (n - k));
  const empty = { rss, df: n - k, sigma, fitted, zero: new Array(k).fill(false), deficient: false, offset: null, rOffset: null, perfect: false, xtxInv: null, cov: null, se: null };
  const J = model.jacobian(p);
  if (!allFinite(fitted) || !J.every(allFinite)) return { ...empty, reasonKey: 'lab.invalid.notConverged' };
  const d = J.map((c) => norm2(c));
  const zero = d.map((v) => !(v > 0));
  if (zero.some(Boolean)) return { ...empty, zero, deficient: true };
  const cols = J.map((c, j) => { const out = new Float64Array(n); for (let i = 0; i < n; i++) out[i] = c[i] / d[j]; return out; });
  const { R, qtb, deficient } = householder(cols, r, RANK_TOL);
  if (deficient) return { ...empty, zero, deficient: true };
  const proj = norm2(qtb.subarray(0, k));
  const orth = norm2(qtb.subarray(k));
  const offset = orth > 0 ? (proj / Math.sqrt(k)) / (orth / Math.sqrt(n - k)) : 0;
  const rOffset = orth > 0 ? proj / orth : 0;
  // y spread, to tell a perfect fit (residuals at rounding level) from a real one.
  let ym = 0;
  for (let i = 0; i < n; i++) ym += y[i];
  ym /= n;
  const dev = new Float64Array(n);
  for (let i = 0; i < n; i++) dev[i] = y[i] - ym;
  const sdY = norm2(dev) / Math.sqrt(Math.max(1, n - 1));
  const perfect = !(sigma > 1e-10 * sdY);
  const Rinv = invUpper(R);
  const xtxInv = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => {
    let s = 0;
    for (let m = Math.max(i, j); m < k; m++) s += Rinv[i][m] * Rinv[j][m];
    return s / (d[i] * d[j]);
  }));
  const s2 = rss / (n - k);
  const cov = xtxInv.map((row) => row.map((v) => v * s2));
  const se = cov.map((row, j) => Math.sqrt(row[j]));
  return { rss, df: n - k, sigma, fitted, zero, deficient: false, offset, rOffset, perfect, xtxInv, cov, se };
}

/** sqrt(g' V g): the delta-method SE of a smooth function with gradient g. */
export function deltaSe(grad, V) {
  let s = 0;
  for (let i = 0; i < grad.length; i++) {
    if (!grad[i]) continue;
    for (let j = 0; j < grad.length; j++) if (grad[j]) s += grad[i] * V[i][j] * grad[j];
  }
  return s >= 0 ? Math.sqrt(s) : NaN;
}

/** Two-sided t multiplier for a confidence level. */
export function tMultiplier(confLevel, df) {
  return df > 0 ? qt(1 - (1 - confLevel) / 2, df) : NaN;
}

/** AICc of a least-squares fit, Motulsky and Christopoulos's form: n log(RSS/n) + 2K + 2K(K+1)/(n-K-1), K = parameters + 1. */
export function aicc(rss, n, parameters) {
  const K = parameters + 1;
  if (!(n - K - 1 > 0) || !(rss > 0)) return NaN;
  return n * Math.log(rss / n) + 2 * K + (2 * K * (K + 1)) / (n - K - 1);
}

/**
 * Extra sum-of-squares F test of a restricted fit against the fuller one it is nested in, both sharing one
 * residual variance: F = ((RSS_r - RSS_f) / (df_r - df_f)) / (RSS_f / df_f). A restricted RSS below the fuller
 * one (rounding, or a fuller fit stopped in a worse place) counts as no improvement: F 0, p 1.
 */
export function extraSsF(rssR, dfR, rssF, dfF) {
  const df1 = dfR - dfF;
  if (!(df1 > 0) || !(dfF > 0) || !(rssF > 0)) return { F: NaN, df1, df2: dfF, p: NaN };
  const F = Math.max(0, ((rssR - rssF) / df1) / (rssF / dfF));
  return { F, df1, df2: dfF, p: pfUpper(F, df1, dfF) };
}

/** R^2 = 1 - RSS / TSS (a description of the fit, never a test). */
export function rSquared(y, rss) {
  const n = y.length;
  let m = 0;
  for (let i = 0; i < n; i++) m += y[i];
  m /= n;
  const dev = new Float64Array(n);
  for (let i = 0; i < n; i++) dev[i] = (y[i] - m) * (y[i] - m);
  const tss = ksum(dev);
  return tss > 0 ? 1 - rss / tss : NaN;
}
