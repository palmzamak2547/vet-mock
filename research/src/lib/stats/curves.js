// Standard curves, dose-response curves and curve equations [M3-DESIGN.md 3.1.1, C3 to C6]: the 4PL and 5PL in
// the log-EC50 form, Michaelis-Menten, one-phase decay and exponential growth, fitted by the Levenberg-Marquardt
// core of nls.js. OWNER: lab role.
//
// Models (parameters in this order, as R's nls and drc LL2.4 / LL2.5 print them):
//   4PL  f = c + (d - c) / (1 + exp(b (ln x - e)))          b Hill slope, c bottom, d top, e ln EC50
//   5PL  f = c + (d - c) / (1 + exp(b (ln x - e)))^g        g asymmetry; EC50 = exp(e + ln(2^(1/g) - 1) / b)
//   Michaelis-Menten  f = Vmax x / (Km + x)
//   one-phase decay   f = (Y0 - Plateau) exp(-K x) + Plateau,   half-life ln 2 / K
//   exponential growth f = Y0 exp(k x),                         doubling time ln 2 / k
// The 4PL and 5PL are computed through softplus(t) = ln(1 + e^t), t = b (ln x - e), so a large |t| neither
// overflows nor loses the tail. A zero concentration sits on an asymptote (ln 0 = -Inf, C4): its fitted value is
// d when b > 0 and c when b < 0, and every term of the gradient that carries u (ln x - e) is its limit 0.
//
// Starting values. 4PL and 5PL (M3-DESIGN.md 3.1.1): c and d the lowest and highest mean response over the
// distinct concentrations, e the log of the positive concentration whose mean response is nearest the half-way
// response, b = +1 when the mean response at the lowest concentration is above the mean at the highest (the
// response falls with dose), else -1, g = 1. The 5PL starts from the converged 4PL with g = 1 (the 4PL is the 5PL
// at g = 1, so the 5PL can only improve on it), and from the rule above if the 4PL fails. The equations are
// separable (linear in all but one parameter): the start is the best point of a 61-point grid over the nonlinear
// parameter (Km, K or k, log-spaced over a hundredfold either side of the data's own scale), each with its
// linear parameters by least squares.
//
// Potency is named by the direction of the curve: the response falls with concentration when b (d - c) > 0, and
// the concentration of the half-way response is then an IC50; when it rises, an EC50. The 4PL fit is reported
// with c below d (the 4PL is unchanged by b -> -b with c and d swapped; the 5PL has no such twin).
//
// Intervals (C3): EC50 and interpolated concentrations by the delta method on the log scale with t on the
// residual df, exponentiated; parameters est +- t SE; half-life and doubling time from the interval of their
// rate constant (ln 2 over its bounds, an open bound when the rate's interval reaches 0). The confidence band of
// a curve is f +- t sqrt(g' V g) at each grid point.
//
// Grid of the curve the chart draws (table 'curve'): 4PL and 5PL, 100 points log-spaced from the lowest
// positive concentration to the highest of the curve's own rows, after a row at x = 0 when that curve has a zero
// concentration (the chart puts it at the axis break); the equations, 100 points evenly spaced from the lowest x
// to the highest.
import { nlsFit, deltaSe, tMultiplier, aicc, extraSsF, rSquared } from './nls.js';
import { val, nullVal, nanToNull, testRow, role, common, column, isMissing, activeRows, invalid } from './common.js';

const LN2 = Math.LN2;
const GRID = 100;

// ---------------------------------------------------------------- models

/** ln(1 + e^t) without overflow. */
function softplus(t) {
  return t > 0 ? t + Math.log1p(Math.exp(-t)) : Math.log1p(Math.exp(t));
}
/** e^t / (1 + e^t) without overflow. */
function sigmoid(t) {
  if (t >= 0) return 1 / (1 + Math.exp(-t));
  const e = Math.exp(t);
  return e / (1 + e);
}

/**
 * 4PL (five = false) or 5PL fitted value at x, with the gradient in (b, c, d, e[, g]) written into `out`.
 * @param {number} x @param {ArrayLike<number>} p @param {boolean} five @param {Float64Array|null} out
 */
export function llValue(x, p, five, out) {
  const b = p[0];
  const c = p[1];
  const d = p[2];
  const e = p[3];
  const g = five ? p[4] : 1;
  const zero = x === 0;
  const t = zero ? (b > 0 ? -Infinity : b < 0 ? Infinity : 0) : b * (Math.log(x) - e);
  const sp = softplus(t);
  const s = Math.exp(-g * sp);
  if (out) {
    out[1] = 1 - s;
    out[2] = s;
    if (zero) {
      out[0] = 0;
      out[3] = 0;
      if (five) out[4] = 0;
    } else {
      const common = (d - c) * g * s * sigmoid(t);
      out[0] = -common * (Math.log(x) - e);
      out[3] = common * b;
      if (five) out[4] = -(d - c) * s * sp;
    }
  }
  return c + (d - c) * s;
}

/** Models by id: names in R's order, value and gradient at one x. */
export const MODELS = Object.freeze({
  ll4: { k: 4, names: ['b', 'c', 'd', 'e'], log: true, value: (x, p, out) => llValue(x, p, false, out) },
  ll5: { k: 5, names: ['b', 'c', 'd', 'e', 'g'], log: true, value: (x, p, out) => llValue(x, p, true, out) },
  michaelisMenten: {
    k: 2, names: ['Vmax', 'Km'], log: false,
    value(x, p, out) {
      const den = p[1] + x;
      if (out) { out[0] = x / den; out[1] = (-p[0] * x) / (den * den); }
      return (p[0] * x) / den;
    },
  },
  decay: {
    k: 3, names: ['Y0', 'Plateau', 'K'], log: false,
    value(x, p, out) {
      const E = Math.exp(-p[2] * x);
      if (out) { out[0] = E; out[1] = 1 - E; out[2] = -(p[0] - p[1]) * x * E; }
      return (p[0] - p[1]) * E + p[1];
    },
  },
  growth: {
    k: 2, names: ['Y0', 'k'], log: false,
    value(x, p, out) {
      const E = Math.exp(p[1] * x);
      if (out) { out[0] = E; out[1] = p[0] * x * E; }
      return p[0] * E;
    },
  },
});

/** What each parameter is, as a dictionary key the parameters table carries. */
const MEANING = {
  ll4: ['lab.param.hillSlope', 'lab.param.bottom', 'lab.param.top', 'lab.param.logMidpoint4', 'lab.param.asymmetry'],
  ll5: ['lab.param.hillSlope', 'lab.param.bottom', 'lab.param.top', 'lab.param.logMidpoint5', 'lab.param.asymmetry'],
  michaelisMenten: ['lab.param.vmax', 'lab.param.km'],
  decay: ['lab.param.y0', 'lab.param.plateau', 'lab.param.decayRate'],
  growth: ['lab.param.y0', 'lab.param.growthRate'],
};

/**
 * An NlsModel over fixed x values.
 * @param {{ k: number, value: Function }} def @param {ArrayLike<number>} xs
 * @returns {import('./nls.js').NlsModel}
 */
export function pointModel(def, xs) {
  const n = xs.length;
  return {
    k: def.k,
    fitted(p) {
      const f = new Float64Array(n);
      for (let i = 0; i < n; i++) f[i] = def.value(xs[i], p, null);
      return f;
    },
    jacobian(p) {
      const cols = Array.from({ length: def.k }, () => new Float64Array(n));
      const g = new Float64Array(def.k);
      for (let i = 0; i < n; i++) {
        def.value(xs[i], p, g);
        for (let j = 0; j < def.k; j++) cols[j][i] = g[j];
      }
      return cols;
    },
  };
}

/** ln 2^(1/g) - 1 with care near g large (2^(1/g) close to 1). */
function logH(g) {
  return Math.log(Math.expm1(LN2 / g));
}

/**
 * ln of the EC50 (IC50) of a 4PL or 5PL and its gradient in the parameters.
 * 4PL: e. 5PL: e + ln(2^(1/g) - 1) / b, the concentration whose response is half-way between c and d.
 * @param {ArrayLike<number>} p @param {boolean} five
 */
export function logPotency(p, five) {
  if (!five) return { value: p[3], grad: [0, 0, 0, 1] };
  const [b, , , e, g] = p;
  const h = Math.expm1(LN2 / g);
  const lh = Math.log(h);
  // d/dg ln(2^(1/g) - 1) = 2^(1/g) ln 2 (-1/g^2) / h
  const dlh = (-(h + 1) * LN2) / (g * g * h);
  return { value: e + lh / b, grad: [-lh / (b * b), 0, 0, 1, dlh / b] };
}

/**
 * ln of the concentration whose fitted response is y0 (inverse of the 4PL or 5PL) and its gradient, or null when
 * y0 is not strictly between c and d (outside the curve, C5).
 * ln x0 = e + ln(((d - c) / (y0 - c))^(1/g) - 1) / b
 * @param {ArrayLike<number>} p @param {number} y0 @param {boolean} five
 * @returns {{ value: number, grad: number[] }|null}
 */
export function inverseLogX(p, y0, five) {
  const b = p[0];
  const c = p[1];
  const d = p[2];
  const e = p[3];
  const g = five ? p[4] : 1;
  if (!(y0 > Math.min(c, d) && y0 < Math.max(c, d)) || !(b !== 0)) return null;
  // r = (d - c) / (y0 - c) > 1; ln r without cancellation near r = 1 (y0 near d)
  const r = (d - c) / (y0 - c);
  const lr = Math.log1p((d - y0) / (y0 - c));
  const w = Math.expm1(lr / g);
  if (!(w > 0) || !Number.isFinite(w)) return null;
  const lw = Math.log(w);
  const rg = w + 1;
  const dwdr = (rg / r) / g;
  const grad = [
    -lw / (b * b),
    ((1 / b) / w) * dwdr * ((d - y0) / ((y0 - c) * (y0 - c))),
    ((1 / b) / w) * dwdr * (1 / (y0 - c)),
    1,
  ];
  if (five) grad.push(((1 / b) / w) * rg * lr * (-1 / (g * g)));
  return { value: e + lw / b, grad };
}

/**
 * Shared-EC50 model over several groups (each with its own b, c, d and, for the 5PL, g; one ln EC50 for all),
 * parameters [b_1, c_1, d_1, (g_1), b_2, ..., ln EC50]. For the 5PL each group's e is ln EC50 - ln(2^(1/g) - 1) / b,
 * so the shared quantity is the EC50 itself, not the inflection point.
 * @param {ArrayLike<number>} xs @param {ArrayLike<number>} gi group index per row @param {number} G @param {boolean} five
 * @returns {import('./nls.js').NlsModel}
 */
export function sharedPotencyModel(xs, gi, G, five) {
  const n = xs.length;
  const m = five ? 4 : 3;
  const K = G * m + 1;
  const q = new Float64Array(five ? 5 : 4);
  const gq = new Float64Array(five ? 5 : 4);
  const local = (p, g) => {
    const o = g * m;
    const b = p[o];
    q[0] = b; q[1] = p[o + 1]; q[2] = p[o + 2];
    if (five) {
      const gg = p[o + 3];
      q[4] = gg;
      q[3] = p[G * m] - logH(gg) / b;
    } else q[3] = p[G * m];
    return o;
  };
  return {
    k: K,
    fitted(p) {
      const f = new Float64Array(n);
      for (let i = 0; i < n; i++) { local(p, gi[i]); f[i] = llValue(xs[i], q, five, null); }
      return f;
    },
    jacobian(p) {
      const cols = Array.from({ length: K }, () => new Float64Array(n));
      for (let i = 0; i < n; i++) {
        const o = local(p, gi[i]);
        llValue(xs[i], q, five, gq);
        const b = q[0];
        cols[o][i] = gq[0];
        cols[o + 1][i] = gq[1];
        cols[o + 2][i] = gq[2];
        cols[G * m][i] = gq[3];
        if (five) {
          const gg = q[4];
          const h = Math.expm1(LN2 / gg);
          const lh = Math.log(h);
          // e = l50 - ln h / b: de/db = ln h / b^2, de/dg = -(1/b) (dh/dg) / h
          cols[o][i] += gq[3] * (lh / (b * b));
          cols[o + 3][i] = gq[4] + gq[3] * (((h + 1) * LN2) / (gg * gg * h * b));
        }
      }
      return cols;
    },
  };
}

// ---------------------------------------------------------------- starting values

/** Distinct x values with their mean response, in increasing x. */
function levelMeans(x, y) {
  const by = new Map();
  for (let i = 0; i < x.length; i++) {
    const a = by.get(x[i]) || [0, 0];
    a[0] += y[i]; a[1] += 1;
    by.set(x[i], a);
  }
  return [...by.entries()].sort((u, v) => u[0] - v[0]).map(([xv, [s, nn]]) => ({ x: xv, mean: s / nn }));
}

/** The 4PL / 5PL starting values of M3-DESIGN.md 3.1.1. */
export function startLL(x, y, five) {
  const lv = levelMeans(x, y);
  let c = Infinity;
  let d = -Infinity;
  for (const l of lv) { c = Math.min(c, l.mean); d = Math.max(d, l.mean); }
  const half = (c + d) / 2;
  let e = NaN;
  let best = Infinity;
  for (const l of lv) {
    if (!(l.x > 0)) continue;
    const dist = Math.abs(l.mean - half);
    if (dist < best) { best = dist; e = Math.log(l.x); }
  }
  const b = lv[0].mean > lv[lv.length - 1].mean ? 1 : lv[0].mean < lv[lv.length - 1].mean ? -1 : 1;
  return five ? [b, c, d, e, 1] : [b, c, d, e];
}

/** Linear least squares on two columns (or one when B is null); returns the coefficients and the RSS. */
function linear2(A, B, y) {
  const n = y.length;
  if (!B) {
    let aa = 0;
    let ay = 0;
    for (let i = 0; i < n; i++) { aa += A[i] * A[i]; ay += A[i] * y[i]; }
    const a = aa > 0 ? ay / aa : NaN;
    let rss = 0;
    for (let i = 0; i < n; i++) { const r = y[i] - a * A[i]; rss += r * r; }
    return { coef: [a], rss };
  }
  let aa = 0;
  let ab = 0;
  let bb = 0;
  let ay = 0;
  let by = 0;
  for (let i = 0; i < n; i++) { aa += A[i] * A[i]; ab += A[i] * B[i]; bb += B[i] * B[i]; ay += A[i] * y[i]; by += B[i] * y[i]; }
  const det = aa * bb - ab * ab;
  if (!(Math.abs(det) > 1e-300)) return { coef: [NaN, NaN], rss: Infinity };
  const a = (ay * bb - by * ab) / det;
  const bc = (by * aa - ay * ab) / det;
  let rss = 0;
  for (let i = 0; i < n; i++) { const r = y[i] - a * A[i] - bc * B[i]; rss += r * r; }
  return { coef: [a, bc], rss };
}

/** Log-spaced grid of `count` points from lo to hi. */
function logGrid(lo, hi, count) {
  const out = [];
  const a = Math.log(lo);
  const b = Math.log(hi);
  for (let i = 0; i < count; i++) out.push(Math.exp(a + ((b - a) * i) / (count - 1)));
  return out;
}

/**
 * Starting values of a curve equation: the best point of a grid over its one nonlinear parameter, each with its
 * linear parameters by least squares.
 * @param {'michaelisMenten'|'decay'|'growth'} equation @param {number[]} x @param {number[]} y
 * @returns {number[]|null}
 */
export function startEquation(equation, x, y) {
  const n = x.length;
  let best = null;
  const consider = (p, rss) => { if (Number.isFinite(rss) && p.every(Number.isFinite) && (!best || rss < best.rss)) best = { p, rss }; };
  if (equation === 'michaelisMenten') {
    const pos = x.filter((v) => v > 0);
    if (!pos.length) return null;
    const scale = pos.reduce((s, v) => s + Math.log(v), 0) / pos.length;
    for (const K of logGrid(Math.exp(scale) / 100, Math.exp(scale) * 100, 61)) {
      const A = Float64Array.from(x, (v) => v / (K + v));
      const r = linear2(A, null, y);
      consider([r.coef[0], K], r.rss);
    }
  } else {
    const xmin = Math.min(...x);
    const xmax = Math.max(...x);
    const range = xmax - xmin;
    if (!(range > 0)) return null;
    const amax = Math.max(Math.abs(xmin), Math.abs(xmax));
    for (const k0 of logGrid(0.01 / range, 100 / range, 61)) {
      for (const sign of equation === 'growth' ? [1, -1] : [1]) {
        const k = sign * k0;
        // keep exp() finite on the grid; LM moves on from the best point
        if (Math.abs(k) * amax > 300) continue;
        if (equation === 'decay') {
          const A = Float64Array.from(x, (v) => Math.exp(-k * v));
          const B = new Float64Array(n).fill(1);
          const r = linear2(A, B, y);
          // f = A_coef e^{-kx} + P: Y0 = A_coef + P, Plateau = P
          consider([r.coef[0] + r.coef[1], r.coef[1], k], r.rss);
        } else {
          const A = Float64Array.from(x, (v) => Math.exp(k * v));
          const r = linear2(A, null, y);
          consider([r.coef[0], k], r.rss);
        }
      }
    }
  }
  return best ? best.p : null;
}

// ---------------------------------------------------------------- fitting and what is reported from a fit

/**
 * Fit a model to (x, y) from a start. For the 5PL the start comes from the 4PL fit when that converges.
 * @param {'ll4'|'ll5'|'michaelisMenten'|'decay'|'growth'} id @param {number[]} x @param {number[]} y
 * @param {number[]|null} [start]
 * @returns {import('./nls.js').NlsFit & { model: string, four?: import('./nls.js').NlsFit }}
 */
export function fitCurve(id, x, y, start = null) {
  const def = MODELS[id];
  const model = pointModel(def, x);
  if (id === 'll4' || id === 'll5') {
    if (id === 'll4') {
      const fit = nlsFit(model, y, start || startLL(x, y, false));
      return { ...canonical4(fit), model: id };
    }
    const four = canonical4(nlsFit(pointModel(MODELS.ll4, x), y, startLL(x, y, false)));
    let fit = null;
    if (!start && four.status === 'ok') fit = nlsFit(model, y, [...four.p, 1]);
    if (!fit || fit.status !== 'ok') {
      const second = nlsFit(model, y, start || startLL(x, y, true));
      if (!fit || second.status === 'ok') fit = second;
    }
    return { ...fit, model: id, four };
  }
  const s = start || startEquation(id, x, y);
  if (!s) return { status: 'invalid', reasonKey: 'lab.invalid.notConverged', p: [], rss: NaN, n: y.length, k: def.k, df: y.length - def.k, sigma: NaN, cov: null, xtxInv: null, se: null, fitted: new Float64Array(y.length), iterations: 0, offset: null, perfect: false, model: id };
  return { ...nlsFit(model, y, s), model: id };
}

/** The 4PL with c below d: (b, c, d, e) and (-b, d, c, e) are the same curve. */
function canonical4(fit) {
  if (fit.status !== 'ok' || !(fit.p[1] > fit.p[2])) return fit;
  const map = [[0, -1], [2, 1], [1, 1], [3, 1]];
  const p = map.map(([j, s]) => s * fit.p[j]);
  const tr = (M) => (M ? map.map(([i, si]) => map.map(([j, sj]) => si * sj * M[i][j])) : M);
  const cov = tr(fit.cov);
  return { ...fit, p, cov, xtxInv: tr(fit.xtxInv), se: cov ? cov.map((r, j) => Math.sqrt(r[j])) : fit.se };
}

/** Does the curve fall as the concentration rises? (b (d - c) > 0); null when flat. */
export function falls(p) {
  const s = p[0] * (p[2] - p[1]);
  return s > 0 ? true : s < 0 ? false : null;
}

/** An interval on the log scale, exponentiated. */
function expInterval(logValue, se, tm) {
  return { value: Math.exp(logValue), lower: Math.exp(logValue - tm * se), upper: Math.exp(logValue + tm * se), se };
}

/**
 * EC50 or IC50 of a 4PL / 5PL fit with its interval (delta method on the log scale, t on `df`).
 * @param {number[]} p @param {number[][]} V covariance @param {boolean} five @param {number} df @param {number} confLevel
 */
export function potency(p, V, five, df, confLevel) {
  const lp = logPotency(p, five);
  const se = deltaSe(lp.grad, V);
  const tm = tMultiplier(confLevel, df);
  const dir = falls(p);
  return { kind: dir === false ? 'ec50' : 'ic50', direction: dir, logValue: lp.value, logSe: se, ...expInterval(lp.value, se, tm), response: (p[1] + p[2]) / 2 };
}

/**
 * Fitted curve and its pointwise confidence band at xs.
 * @param {string} id model id @param {number[]} p @param {number[][]} V @param {ArrayLike<number>} xs @param {number} df @param {number} confLevel
 */
export function curveBand(id, p, V, xs, df, confLevel) {
  const def = MODELS[id];
  const g = new Float64Array(def.k);
  const tm = tMultiplier(confLevel, df);
  return Array.from(xs, (x) => {
    const f = def.value(x, p, g);
    const se = deltaSe(Array.from(g), V);
    return { x, fitted: f, se, lower: f - tm * se, upper: f + tm * se };
  });
}

/** The grid the chart draws (see the header). */
export function curveGrid(id, x) {
  if (MODELS[id].log) {
    const pos = x.filter((v) => v > 0);
    const out = x.some((v) => v === 0) ? [0] : [];
    if (!pos.length) return out;
    const lo = Math.min(...pos);
    const hi = Math.max(...pos);
    return out.concat(hi > lo ? logGrid(lo, hi, GRID) : [lo]);
  }
  const lo = Math.min(...x);
  const hi = Math.max(...x);
  if (!(hi > lo)) return [lo];
  return Array.from({ length: GRID }, (_, i) => lo + ((hi - lo) * i) / (GRID - 1));
}

/** Rows of the parameters table: [term, meaning, estimate, se, lower, upper] (group first when given). */
function parameterRows(id, fit, V, df, confLevel, group) {
  const def = MODELS[id];
  const tm = tMultiplier(confLevel, df);
  return def.names.map((name, j) => {
    const se = V ? Math.sqrt(V[j][j]) : NaN;
    const est = fit.p[j];
    const row = [name, MEANING[id][j], est, nanToNull(se), nanToNull(est - tm * se), nanToNull(est + tm * se)];
    return group === undefined ? row : [group, ...row];
  });
}

/** A parameter as an envelope value with its SE and t interval. */
function paramValue(fit, j, V, df, confLevel) {
  const se = Math.sqrt(V[j][j]);
  const tm = tMultiplier(confLevel, df);
  return val(fit.p[j], { se, ci: [fit.p[j] - tm * se, fit.p[j] + tm * se], ciLevel: confLevel, ciMethod: 't' });
}

/** ln 2 / rate with the interval from the rate's interval (an open bound when the rate's lower bound is 0 or less). */
function lnTwoOver(rate, se, df, confLevel, reasonKey) {
  if (!(rate > 0)) return nullVal(reasonKey);
  const tm = tMultiplier(confLevel, df);
  const lo = rate - tm * se;
  const hi = rate + tm * se;
  return val(LN2 / rate, { ci: [LN2 / hi, lo > 0 ? LN2 / lo : Infinity], ciLevel: confLevel, ciMethod: 'rate-interval' });
}

const perfectNote = { id: 'perfectFit', severity: 'note', key: 'lab.note.curvePerfectFit' };

/** The fit's covariance, or null when the residuals are at rounding level (every interval would be an artefact). */
function usableCov(fit, V = fit.cov) {
  return fit.perfect ? null : V;
}

// ---------------------------------------------------------------- reading the table

/** A numeric role column, or a refusal. */
function numberColumn(table, key) {
  const c = column(table, key);
  if (c.kind !== 'number') throw Object.assign(new Error(`stats: ${key} is not a number column`), { key: 'stats.error.needsNumber', detail: key });
  return c;
}

function countDrop(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function dropList(map, keys) {
  const out = [];
  for (const k of keys) if (map.get(k)) out.push({ reason: 'missing', column: k, count: map.get(k) });
  return out;
}

function distinctCount(x) { return new Set(x).size; }

/** Sample SD (n - 1), 0 for fewer than 2 values. */
function sdOf(y) {
  const n = y.length;
  if (n < 2) return 0;
  let m = 0;
  for (const v of y) m += v;
  m /= n;
  let s = 0;
  for (const v of y) s += (v - m) * (v - m);
  return Math.sqrt(s / (n - 1));
}

/** Level index per row for a category column, renumbered to the levels present (codebook order). */
function groupIndex(col, rows) {
  const levels = col.levels || [];
  const seen = new Array(levels.length).fill(false);
  for (const i of rows) seen[col.values[i]] = true;
  const map = new Array(levels.length).fill(-1);
  const labels = [];
  levels.forEach((l, j) => { if (seen[j]) { map[j] = labels.length; labels.push(l); } });
  return { labels, index: rows.map((i) => map[col.values[i]]) };
}

const curveRows = (band, group) => band.map((b) => {
  const row = [b.x, nanToNull(b.fitted), nanToNull(b.lower), nanToNull(b.upper)];
  return group === undefined ? row : [group, ...row];
});

// ---------------------------------------------------------------- nls.fourPL

/**
 * Standard curve (4PL or 5PL) with the unknowns interpolated [M3-DESIGN.md 3.1.1, C4, C5].
 * Roles: `x` concentration (number, 0 or above; empty in the rows to interpolate), `outcome` response.
 * Options: model '4pl' | '5pl'.
 * Rows without a response are dropped and counted against the outcome; rows with a response and no
 * concentration are the unknowns.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runFourPL(spec, table) {
  const xKey = role(spec, 'x');
  const yKey = role(spec, 'outcome');
  if (!xKey || !yKey) return invalid('stats.error.missingRole');
  const five = (spec.options?.model ?? '4pl') === '5pl';
  const id = five ? 'll5' : 'll4';
  const { confLevel } = common(spec);
  const xc = numberColumn(table, xKey);
  const yc = numberColumn(table, yKey);
  const drops = new Map();
  const std = [];
  const unknown = [];
  for (const i of activeRows(table)) {
    if (isMissing(yc, i)) { countDrop(drops, yKey); continue; }
    if (isMissing(xc, i)) unknown.push(i);
    else std.push(i);
  }
  const dropped = dropList(drops, [yKey]);
  const used = std.length + unknown.length;
  const x = std.map((i) => xc.values[i]);
  const y = std.map((i) => yc.values[i]);
  const k = MODELS[id].k;
  const refuse = (reasonKey, params) => ({ ...invalid(reasonKey), used, dropped, notes: params ? [{ id: 'counts', severity: 'note', key: reasonKey.replace('lab.invalid.', 'lab.note.refused.'), params }] : [] });
  if (x.some((v) => v < 0)) return refuse('lab.invalid.negativeX', { rows: x.filter((v) => v < 0).length });
  if (x.length < k + 1) return refuse('lab.invalid.tooFewPoints', { n: x.length, need: k + 1 });
  if (distinctCount(x) < k) return refuse('lab.invalid.fewConcentrations', { levels: distinctCount(x), need: k });

  const fit = fitCurve(id, x, y);
  if (fit.status !== 'ok') return { ...invalid(fit.reasonKey), used, dropped, values: { reason: nullVal(fit.reasonKey), iterations: val(fit.iterations) } };
  const V = usableCov(fit);
  const df = fit.df;
  const notes = [];
  if (fit.perfect) notes.push(perfectNote);
  const values = {};
  const pot = V ? potency(fit.p, V, five, df, confLevel) : null;
  const kind = falls(fit.p) === false ? 'ec50' : 'ic50';
  if (falls(fit.p) === null) values[kind] = nullVal('lab.undefined.flatCurve');
  else if (pot) values[kind] = val(pot.value, { ci: [pot.lower, pot.upper], ciLevel: confLevel, ciMethod: 'delta-log' });
  else values[kind] = val(Math.exp(logPotency(fit.p, five).value), { ci: [null, null], ciLevel: confLevel, reasonKey: 'lab.undefined.perfectFit' });
  values.r2 = val(rSquared(y, fit.rss));
  values.sigma = val(fit.sigma);
  values.ssResidual = val(fit.rss);
  values.dfResidual = val(df);
  values.n = val(x.length);
  const a = aicc(fit.rss, x.length, k);
  values.aicc = Number.isNaN(a) ? nullVal('lab.undefined.aiccFewPoints') : val(a);
  const tests = [];
  if (five) {
    const four = fit.four;
    if (four && four.status === 'ok') {
      const a4 = aicc(four.rss, x.length, 4);
      values.aiccFourPL = Number.isNaN(a4) ? nullVal('lab.undefined.aiccFewPoints') : val(a4);
      const F = extraSsF(four.rss, four.df, fit.rss, fit.df);
      tests.push(testRow({ id: 'fiveVsFour', name: 'F', statistic: F.F, dfPair: [F.df1, F.df2], p: F.p, variant: 'extraSumOfSquares', ...(Number.isNaN(F.F) ? { reasonKey: 'lab.undefined.noComparison' } : {}) }));
    } else {
      values.aiccFourPL = nullVal(four?.reasonKey || 'lab.invalid.notConverged');
      tests.push(testRow({ id: 'fiveVsFour', name: 'F', statistic: null, dfPair: [1, fit.df], p: null, variant: 'extraSumOfSquares', reasonKey: 'lab.undefined.fourPLFailed' }));
    }
    notes.push({ id: 'fiveVsFour', severity: 'note', key: 'lab.note.fiveVsFour' });
  }
  values.iterations = val(fit.iterations);

  const tables = [{ id: 'parameters', columns: ['term', 'meaning', 'estimate', 'se', 'lower', 'upper'], rows: parameterRows(id, fit, V, df, confLevel) }];
  tables.push({
    id: 'potency', columns: ['kind', 'estimate', 'lower', 'upper', 'response'],
    rows: [[kind, nanToNull(pot ? pot.value : NaN), nanToNull(pot ? pot.lower : NaN), nanToNull(pot ? pot.upper : NaN), nanToNull((fit.p[1] + fit.p[2]) / 2)]],
  });
  // Unknowns (C4, C5): each response read back off the curve, with the curve's own uncertainty only.
  if (unknown.length) {
    const tm = tMultiplier(confLevel, df);
    const pos = x.filter((v) => v > 0);
    const lo = pos.length ? Math.min(...pos) : NaN;
    const hi = Math.max(...x);
    let beyond = 0;
    const rows = unknown.map((i) => {
      const y0 = yc.values[i];
      const inv = inverseLogX(fit.p, y0, five);
      if (!inv) return [table.rowIds[i], y0, null, null, null, 'lab.undefined.outsideCurve'];
      const x0 = Math.exp(inv.value);
      if (x0 < lo || x0 > hi) beyond += 1;
      if (!V) return [table.rowIds[i], y0, x0, null, null, 'lab.undefined.perfectFit'];
      const se = deltaSe(inv.grad, V);
      return [table.rowIds[i], y0, x0, nanToNull(Math.exp(inv.value - tm * se)), nanToNull(Math.exp(inv.value + tm * se)), null];
    });
    tables.push({ id: 'unknowns', columns: ['rowId', 'response', 'x', 'lower', 'upper', 'reason'], rows });
    values.nUnknowns = val(unknown.length);
    notes.push({ id: 'curveOnly', severity: 'note', key: 'lab.note.curveOnly' });
    const outside = rows.filter((r) => r[5] === 'lab.undefined.outsideCurve').length;
    if (outside) notes.push({ id: 'outsideCurve', severity: 'note', key: 'lab.note.outsideCurve', params: { rows: outside } });
    if (beyond) notes.push({ id: 'beyondStandards', severity: 'note', key: 'lab.note.beyondStandards', params: { rows: beyond } });
  }
  const band = V ? curveBand(id, fit.p, V, curveGrid(id, x), df, confLevel) : curveGrid(id, x).map((gx) => ({ x: gx, fitted: MODELS[id].value(gx, fit.p, null), lower: NaN, upper: NaN }));
  tables.push({ id: 'curve', columns: ['x', 'fitted', 'lower', 'upper'], rows: curveRows(band) });

  notes.unshift({ id: 'model', severity: 'note', key: five ? 'lab.note.fivePLForm' : 'lab.note.fourPLForm' });
  notes.push({ id: 'potency', severity: 'note', key: kind === 'ic50' ? 'lab.note.ic50Named' : 'lab.note.ec50Named' });
  const zeros = x.filter((v) => v === 0).length;
  if (zeros) notes.push({ id: 'zeroDose', severity: 'note', key: 'lab.note.zeroDose', params: { rows: zeros } });
  return { status: 'ok', values, tests, tables, used, dropped, notes };
}

// ---------------------------------------------------------------- nls.doseResponse

/**
 * Dose-response curves, one per group with one residual variance across groups, and their comparison
 * [M3-DESIGN.md 3.1.1, C6]. Roles: `x`, `outcome`, `group` (optional). Options: model '4pl' | '5pl';
 * compare 'none' | 'ec50' (shared EC50 against separate curves) | 'all' (one curve against separate curves).
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runDoseResponse(spec, table) {
  const xKey = role(spec, 'x');
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group');
  if (!xKey || !yKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const five = (o.model ?? '4pl') === '5pl';
  const id = five ? 'll5' : 'll4';
  const compare = o.compare ?? 'none';
  const { confLevel } = common(spec);
  const xc = numberColumn(table, xKey);
  const yc = numberColumn(table, yKey);
  const gc = gKey ? column(table, gKey) : null;
  if (gc && gc.kind !== 'category') throw Object.assign(new Error(`stats: ${gKey} is not a category column`), { key: 'stats.error.needsCategory', detail: gKey });
  const keys = [xKey, yKey, ...(gKey ? [gKey] : [])];
  const cols = [xc, yc, ...(gc ? [gc] : [])];
  const drops = new Map();
  const rows = [];
  for (const i of activeRows(table)) {
    const miss = cols.findIndex((c) => isMissing(c, i));
    if (miss >= 0) countDrop(drops, keys[miss]);
    else rows.push(i);
  }
  const dropped = dropList(drops, keys);
  const used = rows.length;
  const x = rows.map((i) => xc.values[i]);
  const y = rows.map((i) => yc.values[i]);
  const gi = gc ? groupIndex(gc, rows) : { labels: [null], index: rows.map(() => 0) };
  const G = gi.labels.length;
  const k = MODELS[id].k;
  const refuse = (reasonKey, params) => ({ ...invalid(reasonKey), used, dropped, notes: params ? [{ id: 'counts', severity: 'note', key: reasonKey.replace('lab.invalid.', 'lab.note.refused.'), params }] : [] });
  if (!rows.length) return refuse('lab.invalid.tooFewPoints', { n: 0, need: k + 1 });
  if (x.some((v) => v < 0)) return refuse('lab.invalid.negativeX', { rows: x.filter((v) => v < 0).length });
  const byGroup = gi.labels.map((_, g) => rows.map((_, j) => j).filter((j) => gi.index[j] === g));
  for (let g = 0; g < G; g++) {
    const xs = byGroup[g].map((j) => x[j]);
    if (xs.length < k + 1) return refuse('lab.invalid.tooFewPointsGroup', { n: xs.length, need: k + 1, group: gi.labels[g] ?? '' });
    if (distinctCount(xs) < k) return refuse('lab.invalid.fewConcentrationsGroup', { levels: distinctCount(xs), need: k, group: gi.labels[g] ?? '' });
  }
  const N = rows.length;
  const dfSep = N - G * k;
  if (dfSep < 1) return refuse('lab.invalid.tooFewPoints', { n: N, need: G * k + 1 });

  // Separate curves, one residual variance: each group's own fit (the estimates of the joint fit, which has no
  // shared parameter), then the pooled s^2 on N - G k df.
  const fits = [];
  for (let g = 0; g < G; g++) {
    const xs = byGroup[g].map((j) => x[j]);
    const ys = byGroup[g].map((j) => y[j]);
    const fit = fitCurve(id, xs, ys);
    if (fit.status !== 'ok') {
      const notes = gc ? [{ id: 'failedGroup', severity: 'note', key: 'lab.note.failedGroup', params: { group: gi.labels[g] } }] : [];
      return { ...invalid(fit.reasonKey), used, dropped, notes };
    }
    fits.push({ fit, xs, ys });
  }
  const rssSep = fits.reduce((s, f) => s + f.fit.rss, 0);
  const s2 = rssSep / dfSep;
  const sigma = Math.sqrt(s2);
  // Residuals at rounding level across every group: the intervals would be artefacts (as nlsFit's own rule).
  const perfect = !(sigma > 1e-10 * sdOf(y));
  const covs = fits.map((f) => (perfect ? null : f.fit.xtxInv.map((r) => r.map((v) => v * s2))));

  const values = {};
  const tables = [];
  const notes = [{ id: 'model', severity: 'note', key: five ? 'lab.note.fivePLForm' : 'lab.note.fourPLForm' }];
  if (perfect) notes.push(perfectNote);
  const name = (base, g) => (gc ? `${base}:${gi.labels[g]}` : base);
  const potencies = fits.map((f, g) => {
    const dir = falls(f.fit.p);
    const kind = dir === false ? 'ec50' : 'ic50';
    const pot = covs[g] ? potency(f.fit.p, covs[g], five, dfSep, confLevel) : null;
    if (dir === null) values[name(kind, g)] = nullVal('lab.undefined.flatCurve');
    else if (pot) values[name(kind, g)] = val(pot.value, { ci: [pot.lower, pot.upper], ciLevel: confLevel, ciMethod: 'delta-log' });
    else values[name(kind, g)] = val(Math.exp(logPotency(f.fit.p, five).value), { ci: [null, null], ciLevel: confLevel, reasonKey: 'lab.undefined.perfectFit' });
    return { kind, dir, pot };
  });
  values.sigma = val(sigma);
  values.ssResidual = val(rssSep);
  values.dfResidual = val(dfSep);
  values.n = val(N);
  const tests = [];
  if (compare !== 'none' && G < 2) notes.push({ id: 'compare', severity: 'note', key: 'lab.note.compareNeedsGroups' });
  if (compare !== 'none' && G >= 2) {
    const shared = compare === 'ec50';
    const kRestricted = shared ? G * k - (G - 1) : k;
    const restricted = shared ? fitShared(x, y, gi.index, G, five, fits) : fitCurve(id, x, y);
    const aSep = aicc(rssSep, N, G * k);
    values.aiccSeparate = Number.isNaN(aSep) ? nullVal('lab.undefined.aiccFewPoints') : val(aSep);
    const aName = shared ? 'aiccShared' : 'aiccOne';
    const testId = shared ? 'sharedEc50' : 'oneCurve';
    if (restricted.status === 'ok') {
      const aR = aicc(restricted.rss, N, kRestricted);
      values[aName] = Number.isNaN(aR) ? nullVal('lab.undefined.aiccFewPoints') : val(aR);
      const F = extraSsF(restricted.rss, N - kRestricted, rssSep, dfSep);
      tests.push(testRow({ id: testId, name: 'F', statistic: F.F, dfPair: [F.df1, F.df2], p: F.p, variant: 'extraSumOfSquares', ...(Number.isNaN(F.F) ? { reasonKey: 'lab.undefined.noComparison' } : {}) }));
    } else {
      values[aName] = nullVal(restricted.reasonKey);
      tests.push(testRow({ id: testId, name: 'F', statistic: null, dfPair: [N - kRestricted - dfSep, dfSep], p: null, variant: 'extraSumOfSquares', reasonKey: restricted.reasonKey }));
    }
    notes.push({ id: 'compare', severity: 'note', key: shared ? 'lab.note.compareShared' : 'lab.note.compareOne' });
    notes.push({ id: 'aicc', severity: 'note', key: 'lab.note.aicc' });
    if (G === 2) {
      // EC50 ratio, second group over first, from the joint separate fit (its covariance is block-diagonal: the
      // groups share no parameter, so the two log potencies are uncorrelated).
      const [p1, p2] = potencies;
      const same = p1.dir !== null && p1.dir === p2.dir;
      const ratioName = same && p1.kind === 'ic50' ? 'ic50Ratio' : 'ec50Ratio';
      if (p1.dir === null || p2.dir === null) values[ratioName] = nullVal('lab.undefined.flatCurve');
      else if (p1.pot && p2.pot) {
        const lr = p2.pot.logValue - p1.pot.logValue;
        const se = Math.sqrt(p1.pot.logSe * p1.pot.logSe + p2.pot.logSe * p2.pot.logSe);
        const r = expInterval(lr, se, tMultiplier(confLevel, dfSep));
        values[ratioName] = val(r.value, { ci: [r.lower, r.upper], ciLevel: confLevel, ciMethod: 'delta-log' });
      } else values[ratioName] = nullVal('lab.undefined.perfectFit');
      notes.push({ id: 'ratio', severity: 'note', key: 'lab.note.potencyRatio', params: { numerator: gi.labels[1], denominator: gi.labels[0] } });
      if (!same && p1.dir !== null && p2.dir !== null) notes.push({ id: 'directions', severity: 'note', key: 'lab.note.directionsDiffer' });
    } else notes.push({ id: 'manyGroups', severity: 'note', key: 'lab.note.compareManyGroups', params: { groups: G } });
  }

  const label = (g) => (gc ? gi.labels[g] : null);
  tables.push({ id: 'parameters', columns: ['group', 'term', 'meaning', 'estimate', 'se', 'lower', 'upper'], rows: fits.flatMap((f, g) => parameterRows(id, f.fit, covs[g], dfSep, confLevel, label(g))) });
  tables.push({
    id: 'potency', columns: ['group', 'kind', 'estimate', 'lower', 'upper', 'response', 'n', 'r2'],
    rows: fits.map((f, g) => {
      const pt = potencies[g].pot;
      return [label(g), potencies[g].kind, nanToNull(pt ? pt.value : NaN), nanToNull(pt ? pt.lower : NaN), nanToNull(pt ? pt.upper : NaN), nanToNull((f.fit.p[1] + f.fit.p[2]) / 2), f.ys.length, nanToNull(rSquared(f.ys, f.fit.rss))];
    }),
  });
  tables.push({
    id: 'curve', columns: ['group', 'x', 'fitted', 'lower', 'upper'],
    rows: fits.flatMap((f, g) => {
      const grid = curveGrid(id, f.xs);
      const band = covs[g] ? curveBand(id, f.fit.p, covs[g], grid, dfSep, confLevel) : grid.map((gx) => ({ x: gx, fitted: MODELS[id].value(gx, f.fit.p, null), lower: NaN, upper: NaN }));
      return curveRows(band, label(g));
    }),
  });
  const kinds = new Set(potencies.map((p) => p.kind));
  notes.push({ id: 'potency', severity: 'note', key: kinds.size === 1 && kinds.has('ic50') ? 'lab.note.ic50Named' : kinds.size === 1 ? 'lab.note.ec50Named' : 'lab.note.potencyNamedEach' });
  const zeros = x.filter((v) => v === 0).length;
  if (zeros) notes.push({ id: 'zeroDose', severity: 'note', key: 'lab.note.zeroDose', params: { rows: zeros } });
  return { status: 'ok', values, tests, tables, used, dropped, notes };
}

/** Shared-EC50 fit across groups, started from the separate fits and the mean of their log potencies. */
function fitShared(x, y, gi, G, five, fits) {
  const model = sharedPotencyModel(x, gi, G, five);
  const start = [];
  let l50 = 0;
  for (const { fit } of fits) {
    start.push(fit.p[0], fit.p[1], fit.p[2]);
    if (five) start.push(fit.p[4]);
    l50 += logPotency(fit.p, five).value / G;
  }
  start.push(l50);
  return nlsFit(model, y, start);
}

// ---------------------------------------------------------------- nls.equation

const EQUATION_MODEL = { michaelisMenten: 'michaelisMenten', decay: 'decay', growth: 'growth' };

/**
 * A curve equation of known form [M3-DESIGN.md 3.1.1]: Michaelis-Menten (Vmax, Km), one-phase decay (Y0,
 * Plateau, K, half-life), exponential growth (Y0, k, doubling time). Roles: `x`, `outcome`. Option: equation.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runEquation(spec, table) {
  const xKey = role(spec, 'x');
  const yKey = role(spec, 'outcome');
  if (!xKey || !yKey) return invalid('stats.error.missingRole');
  const equation = spec.options?.equation ?? 'michaelisMenten';
  const id = EQUATION_MODEL[equation];
  if (!id) return invalid('lab.invalid.unknownEquation');
  const { confLevel } = common(spec);
  const xc = numberColumn(table, xKey);
  const yc = numberColumn(table, yKey);
  const drops = new Map();
  const rows = [];
  for (const i of activeRows(table)) {
    if (isMissing(xc, i)) countDrop(drops, xKey);
    else if (isMissing(yc, i)) countDrop(drops, yKey);
    else rows.push(i);
  }
  const dropped = dropList(drops, [xKey, yKey]);
  const used = rows.length;
  const x = rows.map((i) => xc.values[i]);
  const y = rows.map((i) => yc.values[i]);
  const k = MODELS[id].k;
  const refuse = (reasonKey, params) => ({ ...invalid(reasonKey), used, dropped, notes: params ? [{ id: 'counts', severity: 'note', key: reasonKey.replace('lab.invalid.', 'lab.note.refused.'), params }] : [] });
  if (id === 'michaelisMenten' && x.some((v) => v < 0)) return refuse('lab.invalid.negativeX', { rows: x.filter((v) => v < 0).length });
  if (x.length < k + 1) return refuse('lab.invalid.tooFewPoints', { n: x.length, need: k + 1 });
  if (distinctCount(x) < k) return refuse('lab.invalid.fewConcentrations', { levels: distinctCount(x), need: k });
  if (id === 'michaelisMenten' && !x.some((v) => v > 0)) return refuse('lab.invalid.fewConcentrations', { levels: 0, need: k });

  const fit = fitCurve(id, x, y);
  if (fit.status !== 'ok') return { ...invalid(fit.reasonKey), used, dropped, values: { reason: nullVal(fit.reasonKey), iterations: val(fit.iterations) } };
  const V = usableCov(fit);
  const df = fit.df;
  const notes = [{ id: 'model', severity: 'note', key: `lab.note.equation.${equation}` }];
  if (fit.perfect) notes.push(perfectNote);
  const values = {};
  const pv = (j) => (V ? paramValue(fit, j, V, df, confLevel) : val(fit.p[j], { reasonKey: 'lab.undefined.perfectFit' }));
  if (id === 'michaelisMenten') {
    values.vmax = pv(0);
    values.km = pv(1);
  } else if (id === 'decay') {
    values.halfLife = V ? lnTwoOver(fit.p[2], Math.sqrt(V[2][2]), df, confLevel, 'lab.undefined.noDecay') : (fit.p[2] > 0 ? val(LN2 / fit.p[2]) : nullVal('lab.undefined.noDecay'));
    notes.push({ id: 'rateInterval', severity: 'note', key: 'lab.note.halfLifeInterval' });
  } else {
    values.doublingTime = V ? lnTwoOver(fit.p[1], Math.sqrt(V[1][1]), df, confLevel, 'lab.undefined.noGrowth') : (fit.p[1] > 0 ? val(LN2 / fit.p[1]) : nullVal('lab.undefined.noGrowth'));
    notes.push({ id: 'rateInterval', severity: 'note', key: 'lab.note.doublingInterval' });
  }
  values.r2 = val(rSquared(y, fit.rss));
  values.sigma = val(fit.sigma);
  values.ssResidual = val(fit.rss);
  values.dfResidual = val(df);
  values.n = val(x.length);
  const a = aicc(fit.rss, x.length, k);
  values.aicc = Number.isNaN(a) ? nullVal('lab.undefined.aiccFewPoints') : val(a);
  values.iterations = val(fit.iterations);
  const band = V ? curveBand(id, fit.p, V, curveGrid(id, x), df, confLevel) : curveGrid(id, x).map((gx) => ({ x: gx, fitted: MODELS[id].value(gx, fit.p, null), lower: NaN, upper: NaN }));
  const tables = [
    { id: 'parameters', columns: ['term', 'meaning', 'estimate', 'se', 'lower', 'upper'], rows: parameterRows(id, fit, V, df, confLevel) },
    { id: 'curve', columns: ['x', 'fitted', 'lower', 'upper'], rows: curveRows(band) },
  ];
  return { status: 'ok', values, tests: [], tables, used, dropped, notes };
}
