// Firth's penalised likelihood logistic regression [M3-DESIGN.md 3.2.1, C9]: reg.logistic with options.method
// 'firth', never switched on by the engine (glm.js runLogistic sends a spec here only when the student chose it).
// OWNER: models role.
//
// The estimate maximises l*(beta) = l(beta) + 0.5 log|X'WX| (Firth 1993; Heinze and Schemper 2002), which has a
// finite maximum also when the outcome is separated, where ordinary maximum likelihood (M2) has none and stops.
// Fitting as logistf 1.26.1: from beta = 0, Newton steps with Fisher's information X'WX and the hat-adjusted score
// U*_r = sum_i x_ir (y_i - pi_i + h_i (1/2 - pi_i)), h_i the diagonal of W^1/2 X (X'WX)^-1 X' W^1/2 (U* is the exact
// gradient of l*); a step is scaled so no coefficient moves by more than 5 (logistf's maxstep) and halved while
// l* falls. Converged when no coefficient moves by more than 1e-10 and every score is below 1e-10 times the sum
// of |x| in its column (the size of that sum's own rounding error, so a column of herd sizes converges as a
// column of 0 and 1 does). logistf's fixture run used 1e-12 controls; 1e-10 changes no printed digit.
//
// The penalty always uses the information of the whole model, also when some coefficients are held fixed: that
// is logistf's convention for its profile intervals (logistpl), its test per coefficient (prob) and drop1/anova
// (logistftest), and for loglik['null'] (the intercept alone, every other coefficient at 0).
//   - Intervals (ciMethod 'profile', the default): the b where 2 (l*(beta hat) - l*_j(b)) = qchisq(level, 1), with
//     l*_j(b) the penalised log-likelihood maximised over the other coefficients with beta_j = b. logistpl solves
//     the same two equations by Venzon and Moolgavkar's method; here a safeguarded Newton search on b, whose
//     derivative dl*_j/db is U*_j at the restricted maximum (the other scores are 0 there).
//     ciMethod 'wald': b +- z SE, with logistf's SE: the inverse of X' diag(w (1 + h)) X at the estimate (the
//     information of the augmented data Firth's estimate is the maximum likelihood fit of; see augmentedVcov).
//   - Tests: penalised likelihood ratio 2 (l*(beta hat) - l*_0), l*_0 the fit with the coefficient (or every column
//     of a factor, as drop1.logistf) held at 0, on 1 (or the factor's) df; the model against the intercept alone
//     likewise. With ciMethod 'wald' the test per coefficient is Wald's z, as logistf(pl = FALSE).
// Aliased columns (a combination of earlier columns, glm.js keptColumns) are left out of the fit and reported as
// in M2. The farm route 'robust' is refused: there is no pinned sandwich estimator for the penalised fit.
//
// Pins: tests/unit/models-firth.test.mjs against tests/fixtures/r/out/firth.json (logistf 1.26.1 on sex2 and sep).
import { pnormTwoSided, pchisqUpper, qnorm, qchisq } from '../stats/dist.js';
import { val, nullVal, testRow, invalid } from '../stats/common.js';
import { glmData, keptColumns, referencesTable } from './glm.js';

/** Controls of the penalised fit (see the header). */
export const FIRTH_CONTROL = Object.freeze({ maxIter: 100, maxStep: 5, maxHalvings: 30, xconv: 1e-10, gconv: 1e-10 });
const PROFILE_MAX_EXPAND = 60;
const PROFILE_MAX_ITER = 100;

// ---------------------------------------------------------------- small dense algebra

/** Lower Cholesky factor of a symmetric matrix (rows of numbers), or null when it is not positive definite. */
function cholesky(A) {
  const k = A.length;
  const L = Array.from({ length: k }, () => new Float64Array(k));
  for (let a = 0; a < k; a++) {
    for (let b = 0; b <= a; b++) {
      let s = A[a][b];
      for (let c = 0; c < b; c++) s -= L[a][c] * L[b][c];
      if (a === b) {
        if (!(s > 0) || !Number.isFinite(s)) return null;
        L[a][a] = Math.sqrt(s);
      } else L[a][b] = s / L[b][b];
    }
  }
  return L;
}

/** Solve (L L') x = rhs. */
function cholSolve(L, rhs) {
  const k = L.length;
  const z = new Float64Array(k);
  for (let a = 0; a < k; a++) {
    let s = rhs[a];
    for (let c = 0; c < a; c++) s -= L[a][c] * z[c];
    z[a] = s / L[a][a];
  }
  const x = new Float64Array(k);
  for (let a = k - 1; a >= 0; a--) {
    let s = z[a];
    for (let c = a + 1; c < k; c++) s -= L[c][a] * x[c];
    x[a] = s / L[a][a];
  }
  return x;
}

/** (L L')^-1 as rows. */
function cholInverse(L) {
  const k = L.length;
  const out = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let j = 0; j < k; j++) {
    const e = new Float64Array(k);
    e[j] = 1;
    const col = cholSolve(L, e);
    for (let i = 0; i < k; i++) out[i][j] = col[i];
  }
  return out;
}

// ---------------------------------------------------------------- the penalised likelihood

/**
 * l*, its score U* and Fisher's information at beta, or null where the information is singular.
 * @returns {{ pll: number, ll: number, info: number[][], U: Float64Array, pi: Float64Array } | null}
 */
function evaluate(X, y, offset, beta) {
  const k = X.length;
  const n = y.length;
  const pi = new Float64Array(n);
  const w = new Float64Array(n);
  let ll = 0;
  let comp = 0;
  for (let i = 0; i < n; i++) {
    let e = offset ? offset[i] : 0;
    for (let j = 0; j < k; j++) e += X[j][i] * beta[j];
    // log pi and log(1 - pi) without cancellation for any eta
    const t = Math.exp(-Math.abs(e));
    const l1 = Math.log1p(t);
    let lp;
    let lq;
    if (e >= 0) { pi[i] = 1 / (1 + t); lp = -l1; lq = -e - l1; } else { pi[i] = t / (1 + t); lp = e - l1; lq = -l1; }
    w[i] = t / ((1 + t) * (1 + t));
    const term = y[i] === 1 ? lp : lq;
    const s = ll + term;
    comp += Math.abs(ll) >= Math.abs(term) ? (ll - s) + term : (term - s) + ll;
    ll = s;
  }
  ll += comp;
  if (!Number.isFinite(ll)) return null;
  const info = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let a = 0; a < k; a++) {
    for (let b = 0; b <= a; b++) {
      let s = 0;
      const xa = X[a];
      const xb = X[b];
      for (let i = 0; i < n; i++) s += w[i] * xa[i] * xb[i];
      info[a][b] = s;
      info[b][a] = s;
    }
  }
  const L = cholesky(info);
  if (!L) return null;
  let logdet = 0;
  for (let a = 0; a < k; a++) logdet += 2 * Math.log(L[a][a]);
  const U = new Float64Array(k);
  const v = new Float64Array(k);
  const hat = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let q = 0;
    for (let a = 0; a < k; a++) {
      let s = X[a][i];
      for (let c = 0; c < a; c++) s -= L[a][c] * v[c];
      v[a] = s / L[a][a];
      q += v[a] * v[a];
    }
    const h = w[i] * q;
    hat[i] = h;
    const r = y[i] - pi[i] + h * (0.5 - pi[i]);
    for (let j = 0; j < k; j++) U[j] += X[j][i] * r;
  }
  const pll = ll + 0.5 * logdet;
  if (!Number.isFinite(pll)) return null;
  return { pll, ll, info, U, pi, w, hat };
}

/**
 * logistf's covariance of the estimate: the inverse of X' diag(w_i (1 + h_i)) X, the information of the
 * augmented data whose maximum likelihood fit is Firth's (each animal counted 1 + h_i times, response
 * (y_i + h_i / 2) / (1 + h_i)). It is smaller than (X'WX)^-1: on sep the intercept's variance is 1 / (6 p (1 - p))
 * where X'WX gives 1 / (5 p (1 - p)), 5 animals in the reference level. The fixture's SE and Wald intervals pin it.
 */
function augmentedVcov(X, st) {
  const k = X.length;
  const n = st.w.length;
  const A = Array.from({ length: k }, () => new Array(k).fill(0));
  for (let a = 0; a < k; a++) {
    for (let b = 0; b <= a; b++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += st.w[i] * (1 + st.hat[i]) * X[a][i] * X[b][i];
      A[a][b] = s;
      A[b][a] = s;
    }
  }
  const L = cholesky(A);
  return L ? cholInverse(L) : null;
}

/** Newton direction on the free columns, (I_FF)^-1 U*_F, zero elsewhere; null when I_FF is singular. */
function newtonStep(st, free) {
  const A = free.map((a) => free.map((b) => st.info[a][b]));
  const L = cholesky(A);
  if (!L) return null;
  const x = cholSolve(L, free.map((j) => st.U[j]));
  const delta = new Float64Array(st.U.length);
  free.forEach((j, a) => { delta[j] = x[a]; });
  return delta;
}

/**
 * Maximise l* over the free columns, the others held at their start values.
 * @returns {{ converged: boolean, beta: Float64Array, st: NonNullable<ReturnType<typeof evaluate>>, iter: number } | null}
 */
function maximise(model, start, free) {
  const { X, y, offset, scale } = model;
  const C = FIRTH_CONTROL;
  let beta = Float64Array.from(start);
  let st = evaluate(X, y, offset, beta);
  if (!st) return null;
  for (let iter = 0; ; iter++) {
    if (!free.length) return { converged: true, beta, st, iter };
    const delta = newtonStep(st, free);
    if (!delta) return null;
    let mx = 0;
    for (const j of free) mx = Math.max(mx, Math.abs(delta[j]));
    if (mx <= C.xconv && free.every((j) => Math.abs(st.U[j]) <= C.gconv * scale[j])) return { converged: true, beta, st, iter };
    if (iter >= C.maxIter) return { converged: false, beta, st, iter };
    if (mx > C.maxStep) for (const j of free) delta[j] *= C.maxStep / mx;
    // Halve while l* falls; a fall within rounding of l* itself (1e-12 relative) is not a fall.
    const tol = 1e-12 * Math.max(1, Math.abs(st.pll));
    let f = 1;
    let next = null;
    let nst = null;
    for (let h = 0; h <= C.maxHalvings; h++, f /= 2) {
      const cand = Float64Array.from(beta);
      for (const j of free) cand[j] += f * delta[j];
      const cst = evaluate(X, y, offset, cand);
      if (cst && cst.pll >= st.pll - tol) { next = cand; nst = cst; break; }
    }
    if (!next) return { converged: false, beta, st, iter };
    beta = next;
    st = nst;
  }
}

/**
 * Firth's fit of y (0/1) on the columns X (full column rank: drop aliased columns first).
 * @param {Float64Array[]} X
 * @param {Float64Array} y
 * @param {{ offset?: Float64Array }} [opts]
 * @returns {{ converged: boolean, beta: number[], vcov: number[][], se: number[], logLik: number, iter: number,
 *   model: any }} logLik is the penalised log-likelihood l*; vcov as logistf's var (augmentedVcov); `model` carries
 *   what the intervals and tests refit with.
 *   null when the information is singular at the start.
 */
export function fitFirth(X, y, opts = {}) {
  const k = X.length;
  const model = { X, y, offset: opts.offset ?? null, scale: X.map((c) => { let s = 0; for (let i = 0; i < c.length; i++) s += Math.abs(c[i]); return Math.max(1, s); }) };
  const r = maximise(model, new Float64Array(k), X.map((_, j) => j));
  if (!r) return null;
  const vcov = augmentedVcov(X, r.st);
  const se = vcov ? vcov.map((row, j) => Math.sqrt(row[j])) : new Array(k).fill(NaN);
  model.beta = r.beta;
  model.st = r.st;
  return { converged: r.converged && Boolean(vcov), beta: Array.from(r.beta), vcov, se, logLik: r.st.pll, iter: r.iter, model };
}

/**
 * l* maximised with the columns `fixed` held at the given values (0 for a test), from the fit's estimate.
 * @param {any} model  fitFirth(...).model
 * @param {Map<number, number>} fixed
 * @param {Float64Array} [start]
 */
function restricted(model, fixed, start = model.beta) {
  const beta = Float64Array.from(start);
  for (const [j, v] of fixed) beta[j] = v;
  const free = model.X.map((_, j) => j).filter((j) => !fixed.has(j));
  const r = maximise(model, beta, free);
  return r && r.converged ? r : null;
}

/**
 * Penalised likelihood ratio test of the columns `cols` held at 0 (logistftest): 2 (l*(beta hat) - l*_0).
 * @param {ReturnType<typeof fitFirth>} fit
 * @param {number[]} cols
 * @returns {{ chisq: number|null, df: number, p: number|null, logLik0: number|null }}
 */
export function firthTest(fit, cols) {
  const r = restricted(fit.model, new Map(cols.map((j) => [j, 0])));
  if (!r) return { chisq: null, df: cols.length, p: null, logLik0: null };
  const chisq = Math.max(0, 2 * (fit.logLik - r.st.pll));
  return { chisq, df: cols.length, p: pchisqUpper(chisq, cols.length), logLik0: r.st.pll };
}

/**
 * Profile penalised likelihood interval of coefficient j: where 2 (l* - l*_j(b)) = qchisq(confLevel, 1).
 * A bound the search cannot reach is null.
 * @param {ReturnType<typeof fitFirth>} fit
 * @param {number} j
 * @param {number} confLevel
 * @returns {[number|null, number|null]}
 */
export function firthProfileCi(fit, j, confLevel) {
  const q = qchisq(confLevel, 1);
  const target = fit.logLik - q / 2;
  return [-1, 1].map((side) => profileBound(fit, j, side, target, q));
}

function profileBound(fit, j, side, target, q) {
  const { model } = fit;
  const bhat = fit.beta[j];
  const at = (b, start) => {
    const r = restricted(model, new Map([[j, b]]), start);
    return r ? { b, g: r.st.pll - target, d: r.st.U[j], beta: r.beta } : null;
  };
  // Bracket: from the estimate (g = q / 2 > 0) outwards, doubling from the Wald half-width, until g < 0.
  let inner = { b: bhat, g: fit.logLik - target, d: 0, beta: model.beta };
  let outer = null;
  let step = Math.sqrt(q) * fit.se[j];
  if (!(step > 0) || !Number.isFinite(step)) step = 1;
  for (let e = 0; e < PROFILE_MAX_EXPAND && !outer; e++, step *= 2) {
    const pt = at(bhat + side * step, inner.beta);
    if (!pt) return null;
    if (pt.g <= 0) outer = pt; else inner = pt;
  }
  if (!outer) return null;
  if (outer.g === 0) return outer.b;
  // Safeguarded Newton (dg/db = U*_j at the restricted maximum), bisecting when Newton leaves the bracket or the
  // bracket fails to halve over two steps.
  let cur = inner.b !== bhat && Math.abs(inner.g) < Math.abs(outer.g) ? inner : outer;
  let width = Math.abs(outer.b - inner.b);
  let widthBefore = Infinity;
  const gTol = 1e-12 * Math.max(1, Math.abs(target));
  for (let it = 0; it < PROFILE_MAX_ITER; it++) {
    const lo = Math.min(inner.b, outer.b);
    const hi = Math.max(inner.b, outer.b);
    let b = cur.d !== 0 ? cur.b - cur.g / cur.d : NaN;
    if (!(b > lo && b < hi) || width > widthBefore / 2) b = (lo + hi) / 2;
    const near = Math.abs(b - inner.b) < Math.abs(b - outer.b) ? inner : outer;
    const pt = at(b, near.beta);
    if (!pt) return null;
    if (Math.abs(pt.g) <= gTol || (pt.d !== 0 && Math.abs(pt.g / pt.d) <= 1e-12 * Math.max(1, Math.abs(b)))) return b;
    if (pt.g > 0) inner = pt; else outer = pt;
    widthBefore = width;
    width = Math.abs(outer.b - inner.b);
    if (width <= 1e-12 * Math.max(1, Math.abs(b))) return b;
    cur = pt;
  }
  return null;
}

// ---------------------------------------------------------------- the method

/**
 * reg.logistic with options.method 'firth' (glm.js runLogistic calls this). Roles and outcome as M2's logistic
 * regression; options ciMethod 'profile' (profile penalised likelihood intervals, penalised likelihood ratio tests
 * per coefficient) or 'wald' (Wald intervals and z tests); the term tests are penalised likelihood ratio tests in
 * both.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runFirth(spec, table) {
  if (spec?.cluster?.route === 'robust') return invalid('models.error.firthNoRobust');
  const data = glmData(spec, table, 'binomial');
  if (data.fail) return data.fail;
  const { confLevel, dropped, design, n, y } = data;
  const { X, names, terms } = design;
  const wald = spec?.options?.ciMethod === 'wald';
  const ciMethod = wald ? 'wald' : 'profile-penalised';
  const kept = keptColumns(X);
  const pos = new Map(kept.map((j, a) => [j, a]));
  const fit = fitFirth(kept.map((j) => X[j]), y);
  if (!fit || !fit.converged) return invalid('models.invalid.firthNotConverged', { used: n, dropped });

  const notes = [];
  const warnings = [];
  if (design.emptyLevels.length) notes.push({ id: 'emptyLevels', severity: 'note', key: 'models.note.emptyLevels', params: { levels: design.emptyLevels.map((e) => `${e.column}=${e.level}`).join(', '), cells: design.emptyLevels.map((e) => [e.column, e.level]) } });
  notes.push({ id: 'firth', severity: 'note', key: wald ? 'models.note.firthWald' : 'models.note.firth' });
  /** @type {Record<string, any>} */
  const resolvedOptions = Object.keys(design.references).length ? { references: design.references } : {};

  const zq = qnorm(1 - (1 - confLevel) / 2);
  const tests = [];
  const coefRows = [];
  const bValues = {};
  const ratioValues = {};
  // one restricted fit per set of columns held at 0, shared by the coefficient and term tests
  const cache = new Map();
  const plr = (cols) => {
    const key = cols.join(',');
    if (!cache.has(key)) cache.set(key, firthTest(fit, cols));
    return cache.get(key);
  };
  names.forEach((nm, j) => {
    const isInt = nm.term === '(Intercept)';
    if (!pos.has(j)) {
      bValues[`b:${nm.term}`] = nullVal('stats.undefined.aliased');
      coefRows.push([nm.term, null, null, null, null, null, null, null, null, null]);
      if (wald) tests.push(testRow({ id: `wald:${nm.term}`, name: 'z', statistic: null, p: null, variant: 'wald', reasonKey: 'stats.undefined.aliased' }));
      return;
    }
    const a = pos.get(j);
    const b = fit.beta[a];
    const se = fit.se[a];
    let ci;
    let stat;
    let p;
    if (wald) {
      ci = [b - zq * se, b + zq * se];
      stat = b / se;
      p = pnormTwoSided(stat);
      tests.push(testRow({ id: `wald:${nm.term}`, name: 'z', statistic: stat, p, variant: 'wald' }));
    } else {
      ci = firthProfileCi(fit, a, confLevel);
      const t = plr([a]);
      stat = t.chisq;
      p = t.p;
    }
    const bExtra = { se, ci: [ci[0], ci[1]], ciLevel: confLevel, ciMethod };
    if (ci[0] === null || ci[1] === null) bExtra.noteKey = 'models.undefined.profileBound';
    bValues[`b:${nm.term}`] = val(b, bExtra);
    const rl = ci[0] === null ? null : Math.exp(ci[0]);
    const ru = ci[1] === null ? null : Math.exp(ci[1]);
    if (!isInt) {
      const rExtra = { ci: [rl, ru], ciLevel: confLevel, ciMethod };
      if (ci[0] === null || ci[1] === null) rExtra.noteKey = 'models.undefined.profileBound';
      ratioValues[`oddsRatio:${nm.term}`] = val(Math.exp(b), rExtra);
    }
    coefRows.push([nm.term, b, se, stat ?? null, p ?? null, ci[0], ci[1], isInt ? null : Math.exp(b), isInt ? null : rl, isInt ? null : ru]);
  });

  // The model against the intercept alone (logistf's likelihood ratio test, loglik['full'] - loglik['null']).
  const hasInt = names[0]?.term === '(Intercept)' && pos.has(0);
  const others = kept.map((_, a) => a).filter((a) => !(hasInt && a === 0));
  let logLikNull = null;
  if (others.length) {
    const t = plr(others);
    logLikNull = t.logLik0;
    tests.unshift(testRow({ id: 'lrNull', name: 'X2', statistic: t.chisq, df: t.df, p: t.p, variant: 'plr' }));
  }
  // Each term held at 0 (drop1.logistf).
  const lrRows = [];
  for (const t of terms) {
    const cols = t.cols.filter((j) => pos.has(j)).map((j) => pos.get(j));
    if (!cols.length) { lrRows.push([t.column, 0, null, null]); continue; }
    const r = plr(cols);
    lrRows.push([t.column, r.df, r.chisq, r.p]);
    tests.push(testRow({ id: `lr:${t.column}`, name: 'X2', statistic: r.chisq, df: r.df, p: r.p, variant: 'plr' }));
  }

  const values = { ...ratioValues, ...bValues, n: val(n) };
  const events = y.reduce((s, v) => s + v, 0);
  const smaller = Math.min(events, n - events);
  values.cases = val(events);
  const predictors = kept.length - (hasInt ? 1 : 0);
  if (predictors > 0) {
    const epv = smaller / predictors;
    values.epv = val(epv, { below: [10] });
    if (epv < 10) warnings.push({ id: 'G14', severity: 'warn', key: 'models.guard.G14.title', bodyKey: 'models.guard.G14.epvFirth', params: { epv, events: smaller, predictors } });
  }
  values.logLikPenalised = val(fit.logLik);
  values.logLikPenalisedNull = logLikNull === null ? nullVal('stats.undefined.notComputable') : val(logLikNull);
  const tables = [
    { id: 'coefficients', columns: ['ws.col.term', 'ws.col.estimate', 'ws.col.se', wald ? 'models.col.z' : 'models.col.plrStat', 'ws.col.p', 'ws.col.lower', 'ws.col.upper', 'models.col.or', 'models.col.ratioLower', 'models.col.ratioUpper'], rows: coefRows },
    referencesTable(design.references),
  ];
  if (lrRows.length) tables.push({ id: 'lrTests', columns: ['ws.col.term', 'ws.col.df', 'models.col.plrStat', 'ws.col.p'], rows: lrRows });
  return { status: 'ok', values, tests, tables, used: n, dropped, notes, warnings, resolvedOptions };
}
