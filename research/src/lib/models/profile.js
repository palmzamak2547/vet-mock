// Profile-likelihood intervals for GLM coefficients, as R 4.6.0 confint() on a glm (stats:::profile.glm and
// its interpolation) [M2-DESIGN.md 3.2.1].
// OWNER: models role.
//
// R's steps, copied so the bounds agree with R's to the fit tolerance rather than to an interpolation
// error of their own:
//   profile.glm(fit, alpha = (1 - level) / 4): zmax = sqrt(qchisq(1 - alpha, 1)), del = zmax / 5; for
//   each side, step k = 1, 2, .. while k < 10 and |z| < zmax, fix the coefficient at b + sign k del SE,
//   refit the others (glm.fit, etastart = the previous linear predictor, the fixed part moved into the
//   offset) and record z = sign sqrt(deviance - original deviance);
//   confint.profile.glm: spline(par, z) (FMM cubic spline at 3 m equally spaced points) and
//   approx(z, par, xout = qnorm(a)) (linear interpolation of the spline's points).
// A bound that the profile never reaches is null (R prints NA). If a refit finds a smaller deviance than
// the original fit (R stops: "profiling has found a better solution"), both bounds are null.
import { qchisq } from '../stats/dist.js';
import { qnorm } from '../stats/qnorm.js';
import { fitGlm } from './glm.js';

const MAXSTEPS = 10;

/**
 * @param {Parameters<import('./glm.js').fitGlm>} fitArgs
 * @param {number} j            coefficient index
 * @param {number} confLevel
 * @param {ReturnType<import('./glm.js').fitGlm>} [base]  the fit of fitArgs, when the caller has it
 * @returns {[number|null, number|null]}
 */
export function profileCi(fitArgs, j, confLevel, base) {
  const [X, y, family, opts = {}] = fitArgs;
  const fit = base ?? fitGlm(X, y, family, opts);
  if (fit.aliased[j] || !Number.isFinite(fit.beta[j])) return [null, null];
  const prof = profilePoints(X, y, family, opts, fit, j, (1 - confLevel) / 4);
  if (!prof) return [null, null];
  const a = (1 - confLevel) / 2;
  const sp = splineFmm(prof.par, prof.z);
  const cut = [qnorm(a), qnorm(1 - a)];
  return cut.map((c) => approxLinear(sp.y, sp.x, c));
}

/**
 * The profile of coefficient j as profile.glm builds it, sorted by z. Null when a refit beats the fit.
 * @returns {{ z: number[], par: number[] } | null}
 */
export function profilePoints(X, y, family, opts, fit, j, alpha) {
  const n = y.length;
  const O = opts.offset ?? new Float64Array(n);
  const nonA = X.map((_, k) => !fit.aliased[k]);
  const B0 = fit.beta;
  const se = Math.sqrt(fit.vcov[j][j]);
  const zmax = Math.sqrt(qchisq(1 - alpha, 1));
  const del = zmax / 5;
  const others = X.map((_, k) => k).filter((k) => nonA[k] && k !== j);
  const Xi = others.map((k) => X[k]);
  const zi = [0];
  const par = [B0[j]];
  for (const sgn of [-1, 1]) {
    let step = 0;
    let z = 0;
    let LP = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = O[i];
      for (let k = 0; k < X.length; k++) if (nonA[k]) s += X[k][i] * B0[k];
      LP[i] = s;
    }
    while ((step += 1) < MAXSTEPS && Math.abs(z) < zmax) {
      const bi = B0[j] + sgn * step * del * se;
      const o = new Float64Array(n);
      for (let i = 0; i < n; i++) o[i] = O[i] + X[j][i] * bi;
      let fm;
      try { fm = fitGlm(Xi, y, family, { ...opts, offset: o, etastart: LP, nullDeviance: false }); } catch { return null; }
      const nl = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        let s = o[i];
        for (let k = 0; k < Xi.length; k++) if (Number.isFinite(fm.beta[k])) s += Xi[k][i] * fm.beta[k];
        nl[i] = s;
      }
      LP = nl;
      let zz = fm.deviance - fit.deviance;
      if (zz > -1e-3) zz = Math.max(zz, 0);
      else return null;
      z = sgn * Math.sqrt(zz);
      zi.push(z);
      par.push(bi);
    }
  }
  const ord = zi.map((_, i) => i).sort((a, b) => zi[a] - zi[b]);
  return { z: ord.map((i) => zi[i]), par: ord.map((i) => par[i]) };
}

/** R's regularize.values(x, y, mean): sorted by x, tied x averaged. */
function regularize(x, y) {
  const ord = x.map((_, i) => i).sort((a, b) => x[a] - x[b]);
  const xs = [];
  const ys = [];
  for (let k = 0; k < ord.length;) {
    let m = k;
    let s = 0;
    while (m < ord.length && x[ord[m]] === x[ord[k]]) { s += y[ord[m]]; m++; }
    xs.push(x[ord[k]]);
    ys.push(s / (m - k));
    k = m;
  }
  return { x: xs, y: ys };
}

/** R's seq.int(from, to, length.out): first and last exact, the rest counted from the nearer end. */
function seqLength(from, to, len) {
  const out = new Array(len);
  if (len > 0) out[0] = from;
  if (len > 1) out[len - 1] = to;
  if (len > 2) {
    const by = (to - from) / (len - 1);
    for (let i = 1; i < len - 1; i++) out[i] = i < Math.floor(len / 2) ? from + i * by : to - (len - 1 - i) * by;
  }
  return out;
}

/**
 * R's spline(x, y, method = 'fmm') at its default 3 m points: the Forsythe, Malcolm and Moler cubic spline
 * (src/library/stats/src/splines.c, fmm_spline and spline_eval).
 */
export function splineFmm(x0, y0) {
  const { x, y } = regularize(x0, y0);
  const n = x.length;
  const xout = seqLength(x[0], x[n - 1], 3 * n);
  const b = new Array(n).fill(0);
  const c = new Array(n).fill(0);
  const d = new Array(n).fill(0);
  if (n < 2) return { x: xout, y: xout.map(() => y[0]) };
  if (n < 3) {
    b[0] = (y[1] - y[0]) / (x[1] - x[0]);
    b[1] = b[0];
  } else {
    // 1-based arrays in the C code; here index i in C is i - 1.
    const nm1 = n - 1;
    d[0] = x[1] - x[0];
    c[1] = (y[1] - y[0]) / d[0];
    for (let i = 1; i < nm1; i++) {
      d[i] = x[i + 1] - x[i];
      b[i] = 2 * (d[i - 1] + d[i]);
      c[i + 1] = (y[i + 1] - y[i]) / d[i];
      c[i] = c[i + 1] - c[i];
    }
    b[0] = -d[0];
    b[nm1] = -d[nm1 - 1];
    c[0] = 0;
    c[nm1] = 0;
    if (n > 3) {
      c[0] = c[2] / (x[3] - x[1]) - c[1] / (x[2] - x[0]);
      c[nm1] = c[nm1 - 1] / (x[nm1] - x[nm1 - 2]) - c[nm1 - 2] / (x[nm1 - 1] - x[nm1 - 3]);
      c[0] = (c[0] * d[0] * d[0]) / (x[3] - x[0]);
      c[nm1] = (-c[nm1] * d[nm1 - 1] * d[nm1 - 1]) / (x[nm1] - x[nm1 - 3]);
    }
    for (let i = 1; i <= nm1; i++) {
      const t = d[i - 1] / b[i - 1];
      b[i] -= t * d[i - 1];
      c[i] -= t * c[i - 1];
    }
    c[nm1] /= b[nm1];
    for (let i = nm1 - 1; i >= 0; i--) c[i] = (c[i] - d[i] * c[i + 1]) / b[i];
    b[nm1] = (y[nm1] - y[nm1 - 1]) / d[nm1 - 1] + d[nm1 - 1] * (c[nm1 - 1] + 2 * c[nm1]);
    for (let i = 0; i < nm1; i++) {
      b[i] = (y[i + 1] - y[i]) / d[i] - d[i] * (c[i + 1] + 2 * c[i]);
      d[i] = (c[i + 1] - c[i]) / d[i];
      c[i] *= 3;
    }
    c[nm1] *= 3;
    d[nm1] = d[nm1 - 1];
  }
  const yout = new Array(xout.length);
  let i = 0;
  for (let l = 0; l < xout.length; l++) {
    const ul = xout[l];
    if (ul < x[i] || (i < n - 1 && x[i + 1] < ul)) {
      i = 0;
      let jj = n;
      do {
        const k = Math.floor((i + jj) / 2);
        if (ul < x[k]) jj = k; else i = k;
      } while (jj > i + 1);
    }
    const dx = ul - x[i];
    yout[l] = y[i] + dx * (b[i] + dx * (c[i] + dx * d[i]));
  }
  return { x: xout, y: yout };
}

/** R's approx(x, y, xout = v) with rule 1 (null outside the range), ties averaged. */
export function approxLinear(x0, y0, v) {
  const { x, y } = regularize(x0, y0);
  const n = x.length;
  if (!n || v < x[0] || v > x[n - 1] || Number.isNaN(v)) return null;
  let i = 0;
  let j = n - 1;
  while (i < j - 1) {
    const ij = Math.floor((i + j) / 2);
    if (v < x[ij]) j = ij; else i = ij;
  }
  if (v === x[j]) return y[j];
  if (v === x[i]) return y[i];
  return y[i] + (y[j] - y[i]) * ((v - x[i]) / (x[j] - x[i]));
}
