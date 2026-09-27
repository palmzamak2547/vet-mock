// Pearson (Fisher z CI) and Spearman (R's cor.test rules for the p-value) [M1-DESIGN.md 7.10].
// OWNER: stats role.
//
// Pearson, as R's cor.test: t = r sqrt(df / (1 - r^2)), df = n - 2; the interval is Fisher's z,
// atanh(r) +/- qnorm((1 + conf) / 2) / sqrt(n - 3), one-sided alternatives open on one side.
// Spearman, as R's cor.test(method = 'spearman'): rho = Pearson on average ranks; S = (n^3 - n)(1 - rho)/6;
// exact (the default in R 4.6.0) when n <= 1290 and there are no ties, through AS 89 (R's prho.c: permutation
// count for n <= 9, Edgeworth series above); otherwise the t approximation. No CI in M1.
//
// Values: estimate (r or rho, with the Fisher z CI for Pearson), n. Test 'pearson' (t, df, p) or
// 'spearman' (S, p, variant 'exact-as89' or 't-approx').
import { ptUpper, ptTwoSided, pnormUpper, pnormLower, qnorm } from './dist.js';
import { mean, rankAvg, val, nullVal, testRow, role, common, completeRows, numbersAt } from './common.js';

/** Pearson correlation by centred sums (two-pass). */
export function pearsonR(x, y) {
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  if (!(sxx > 0) || !(syy > 0)) return NaN;
  const r = sxy / Math.sqrt(sxx * syy);
  return Math.max(-1, Math.min(1, r));
}

/**
 * @param {number[]} x @param {number[]} y
 * @param {{ alternative?: string, confLevel?: number }} [opts]
 * @returns {{ r: number|null, t: number|null, df: number, p: number|null, ci: [number|null, number|null], n: number, reasonKey?: string }}
 */
export function pearson(x, y, opts = {}) {
  const alternative = opts.alternative ?? 'two.sided';
  const conf = opts.confLevel ?? 0.95;
  const n = x.length;
  const df = n - 2;
  if (n < 3) return { r: null, t: null, df, p: null, ci: [null, null], n, reasonKey: 'stats.undefined.needThree' };
  const r = pearsonR(x, y);
  if (Number.isNaN(r)) return { r: null, t: null, df, p: null, ci: [null, null], n, reasonKey: 'stats.undefined.zeroVariance' };
  const t = Math.sqrt(df) * r / Math.sqrt(1 - r * r);
  let p;
  if (alternative === 'less') p = ptUpper(-t, df);
  else if (alternative === 'greater') p = ptUpper(t, df);
  else p = ptTwoSided(t, df);
  let ci = [null, null];
  if (n > 3) {
    const z = Math.atanh(r);
    const sigma = 1 / Math.sqrt(n - 3);
    if (alternative === 'less') ci = [-1, Math.tanh(z + sigma * qnorm(conf))];
    else if (alternative === 'greater') ci = [Math.tanh(z - sigma * qnorm(conf)), 1];
    else { const q = qnorm((1 + conf) / 2); ci = [Math.tanh(z - sigma * q), Math.tanh(z + sigma * q)]; }
  }
  return { r, t: Number.isFinite(t) ? t : (r > 0 ? Infinity : -Infinity), df, p, ci, n, ciReasonKey: n > 3 ? undefined : 'stats.undefined.needFourForCi' };
}

// AS 89 constants (R src/library/stats/src/prho.c)
const C = [0.2274, 0.2531, 0.1745, 0.0758, 0.1033, 0.3932, 0.0879, 0.0151, 0.0072, 0.0831, 0.0131, 4.6e-4];
const N_SMALL = 9;

/**
 * Pr[S >= is] (upper) or Pr[S < is] (lower) for Spearman's S = sum (i - p_i)^2 under independence,
 * Algorithm AS 89 as R implements it: exact count over all n! permutations for n <= 9, Edgeworth
 * series for larger n.
 */
export function prho(n, is, lowerTail) {
  let pv = lowerTail ? 0 : 1;
  if (n <= 1) return NaN;
  if (is <= 0) return pv;
  const n3 = (n * (n * n - 1)) / 3; // (n^3 - n) / 3, the largest S
  if (is > n3) return 1 - pv;
  if (n <= N_SMALL) {
    // count permutations with S >= is by the same rotation walk as R (every permutation once)
    const l = Array.from({ length: n }, (_, i) => i + 1);
    let nfac = 1;
    for (let i = 1; i <= n; i++) nfac *= i;
    let ifr = 0;
    if (is === n3) ifr = 1;
    else {
      for (let m = 0; m < nfac; m++) {
        let ise = 0;
        for (let i = 0; i < n; i++) { const d = i + 1 - l[i]; ise += d * d; }
        if (is <= ise) ifr++;
        let n1 = n;
        let mt;
        do {
          mt = l[0];
          for (let i = 1; i < n1; i++) l[i - 1] = l[i];
          n1--;
          l[n1] = mt;
        } while (mt === n1 + 1 && n1 > 1);
      }
    }
    return (lowerTail ? nfac - ifr : ifr) / nfac;
  }
  const b = 1 / n;
  const x = ((6 * (is - 1) * b) / (n * n - 1) - 1) * Math.sqrt(1 / b - 1);
  let y = x * x;
  const u = x * b * (C[0] + b * (C[1] + C[2] * b) + y * (-C[3] + b * (C[4] + C[5] * b) - y * b * (C[6] + C[7] * b - y * (C[8] - C[9] * b + y * b * (C[10] - C[11] * y)))));
  y = u / Math.exp(y / 2);
  pv = lowerTail ? pnormLower(x) - y : y + pnormUpper(x);
  if (pv < 0) pv = 0;
  if (pv > 1) pv = 1;
  return pv;
}

function pspearman(q, n, lowerTail, exact) {
  if (n <= 1290 && exact) return prho(n, Math.round(q) + 2 * (lowerTail ? 1 : 0), lowerTail);
  const den = (n * (n * n - 1)) / 6;
  const r = 1 - q / den;
  const t = r / Math.sqrt((1 - r * r) / (n - 2));
  return lowerTail ? ptUpper(t, n - 2) : ptUpper(-t, n - 2); // pt(t, lower.tail = !lower.tail)
}

/**
 * @param {number[]} x @param {number[]} y
 * @param {{ alternative?: string, exact?: 'auto'|'exact'|'normal' }} [opts]
 * @returns {{ rho: number|null, S: number|null, p: number|null, n: number, exact: boolean, reasonKey?: string }}
 */
export function spearman(x, y, opts = {}) {
  const alternative = opts.alternative ?? 'two.sided';
  const n = x.length;
  if (n < 3) return { rho: null, S: null, p: null, n, exact: false, reasonKey: 'stats.undefined.needThree' };
  const rx = rankAvg(x);
  const ry = rankAvg(y);
  const rho = pearsonR(rx.ranks, ry.ranks);
  if (Number.isNaN(rho)) return { rho: null, S: null, p: null, n, exact: false, reasonKey: 'stats.undefined.zeroVariance' };
  const ties = rx.ties.length > 0 || ry.ties.length > 0;
  // R 4.6.0 cor.test: exact defaults to TRUE (pspearman itself falls back to the t approximation
  // above n = 1290); with ties it warns and uses the t approximation
  let exact = opts.exact === 'normal' ? false : true;
  if (ties) exact = false;
  const q = ((n ** 3 - n) * (1 - rho)) / 6;
  let p;
  if (alternative === 'greater') p = pspearman(q, n, true, exact);
  else if (alternative === 'less') p = pspearman(q, n, false, exact);
  else {
    p = q > (n ** 3 - n) / 6 ? pspearman(q, n, false, exact) : pspearman(q, n, true, exact);
    p = Math.min(2 * p, 1);
  }
  exact = exact && n <= 1290;
  return { rho, S: q, p, n, exact };
}

const bad = (reasonKey, used = 0, dropped = []) => ({ status: 'invalid', values: { reason: nullVal(reasonKey) }, tests: [], tables: [], used, dropped });

function pair(spec, table) {
  const a = role(spec, 'x');
  const b = role(spec, 'y') ?? role(spec, 'outcome');
  if (!a || !b) return null;
  const { rows, dropped } = completeRows(table, [a, b]);
  return { x: numbersAt(table, a, rows), y: numbersAt(table, b, rows), rows, dropped };
}

/** Implementation for 'corr.pearson'. Roles: x, y. @type {import('../runtime/registry.js').MethodImpl} */
export function runPearson(spec, table) {
  const d = pair(spec, table);
  if (!d) return bad('stats.error.missingRole');
  const { alternative, confLevel } = common(spec);
  const r = pearson(d.x, d.y, { alternative, confLevel });
  const estimate = r.r === null
    ? nullVal(r.reasonKey)
    : val(r.r, r.ci[0] === null ? { reasonKey: r.ciReasonKey } : { ci: r.ci, ciLevel: confLevel, ciMethod: 'fisher-z' });
  return {
    status: r.r === null ? 'invalid' : 'ok',
    values: { estimate, n: val(r.n) },
    tests: [testRow({ id: 'pearson', name: 't', statistic: r.t, df: r.df, p: r.p, alternative, variant: 'pearson', reasonKey: r.reasonKey })],
    tables: [],
    used: d.rows.length,
    dropped: d.dropped,
  };
}

/** Implementation for 'corr.spearman'. Roles: x, y. @type {import('../runtime/registry.js').MethodImpl} */
export function runSpearman(spec, table) {
  const d = pair(spec, table);
  if (!d) return bad('stats.error.missingRole');
  const { alternative } = common(spec);
  const r = spearman(d.x, d.y, { alternative, exact: spec?.options?.exact });
  return {
    status: r.rho === null ? 'invalid' : 'ok',
    values: { estimate: r.rho === null ? nullVal(r.reasonKey) : val(r.rho), n: val(r.n) },
    tests: [testRow({ id: 'spearman', name: 'S', statistic: r.S, p: r.p, alternative, variant: r.exact ? 'exact-as89' : 't-approx', reasonKey: r.reasonKey })],
    tables: [],
    used: d.rows.length,
    dropped: d.dropped,
  };
}
