// Rank tests, matching R 4.6.0's wilcox.test and kruskal.test [M1-DESIGN.md 7.9].
// OWNER: stats role.
//
// R 4.6.0 changed wilcox.test (read from stats:::wilcox.test.default and its .wilcox_test_* helpers
// in R 4.6.0 through webR 0.6.0, 27 Sep 2026): with exact = NULL the exact test is used whenever the
// samples are small (both n < 50 for the rank sum, n < 50 for the signed rank), EVEN WITH TIES OR
// ZEROS, through the exact conditional (permutation) distribution of the mid-ranks (.pwilcox /
// .psignrank with the rank vector z, C_dpermdist2 / C_dpermdist1). Without ties (and zeros) it is
// the classical distribution (pwilcox, psignrank). In the exact signed-rank test the ranks are taken
// over |x| INCLUDING the zeros, and the zeros are then left out of the sum (Pratt's handling); in the
// normal approximation the zeros are dropped first (Wilcoxon's). The older rule "exact only without
// ties" (M1-DESIGN.md 7.9 as first written) is R 4.5 and earlier.
//
// Exact p-values, as R 4.6.0:
//   rank sum, two-sided: min(2 P(W <= w), 2 P(W >= w), 1); greater P(W >= w); less P(W <= w)
//   signed rank, two-sided: m = n(n+1)/4 (no ties or zeros) or sum(z)/2; p = P(V >= v) if v > m
//   else P(V <= v); min(2 p, 1)
// The distributions are counted exactly (subset-sum dynamic programming on the doubled ranks) and
// every tail is summed from its own side, never as 1 minus the other tail.
// Normal approximation: continuity correction 0.5 toward the mean by default (correct = TRUE),
// tie-corrected variance; two-sided p = 2 min(P(Z <= z), P(Z >= z)).
//
// Run functions report values nX, nY (or n), medianX, medianY (or medianDiff), and one test whose
// variant says which p-value was used: 'exact', 'exact-conditional' (ties or zeros), 'normal-cc'
// (continuity corrected) or 'normal'.
import { pnormLower, pnormUpper, pchisqUpper } from './dist.js';
import { rankAvg, ksum, val, nullVal, testRow, role, common, completeRows, numbersAt, column, groupsAt } from './common.js';
import { quantile } from './descriptive.js';

// ---------------------------------------------------------------- exact distributions

const wilcoxCache = new Map();
/** Counts of W = 0..m*n for rank-sum samples of sizes m and n, as doubles (R's cwilcox). */
function wilcoxCounts(m, n) {
  const key = `${m},${n}`;
  if (wilcoxCache.has(key)) return wilcoxCache.get(key);
  // dp[j][s]: subsets of size j from ranks 1..i with rank sum s; W = s - m(m+1)/2
  const N = m + n;
  const maxS = (m * (2 * N - m + 1)) / 2;
  let dp = Array.from({ length: m + 1 }, () => new Float64Array(maxS + 1));
  dp[0][0] = 1;
  for (let i = 1; i <= N; i++) {
    for (let j = Math.min(i, m); j >= 1; j--) {
      const cur = dp[j];
      const prev = dp[j - 1];
      for (let s = maxS; s >= i; s--) if (prev[s - i]) cur[s] += prev[s - i];
    }
  }
  const off = (m * (m + 1)) / 2;
  const counts = new Float64Array(m * n + 1);
  for (let w = 0; w <= m * n; w++) counts[w] = dp[m][w + off];
  dp = null;
  const total = ksum(Array.from(counts));
  const res = { counts, total };
  if (wilcoxCache.size > 64) wilcoxCache.clear();
  wilcoxCache.set(key, res);
  return res;
}

/** P(W <= q) for the rank-sum statistic (R's pwilcox, lower tail). */
export function pwilcoxLower(q, m, n) {
  q = Math.floor(q + 1e-7);
  if (q < 0) return 0;
  if (q >= m * n) return 1;
  const { counts, total } = wilcoxCounts(m, n);
  let s = 0;
  for (let w = 0; w <= q; w++) s += counts[w];
  return s / total;
}
/** P(W > q) (R's pwilcox(q, lower.tail = FALSE)), summed from the top so small tails stay exact. */
export function pwilcoxUpper(q, m, n) {
  q = Math.floor(q + 1e-7);
  if (q < 0) return 1;
  if (q >= m * n) return 0;
  const { counts, total } = wilcoxCounts(m, n);
  let s = 0;
  for (let w = m * n; w > q; w--) s += counts[w];
  return s / total;
}

const signrankCache = new Map();
function signrankCounts(n) {
  if (signrankCache.has(n)) return signrankCache.get(n);
  const maxV = (n * (n + 1)) / 2;
  const dp = new Float64Array(maxV + 1);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) for (let s = maxV; s >= i; s--) dp[s] += dp[s - i];
  const res = { counts: dp, total: 2 ** n };
  if (signrankCache.size > 64) signrankCache.clear();
  signrankCache.set(n, res);
  return res;
}
/** P(V <= q) (R's psignrank). */
export function psignrankLower(q, n) {
  q = Math.floor(q + 1e-7);
  const maxV = (n * (n + 1)) / 2;
  if (q < 0) return 0;
  if (q >= maxV) return 1;
  const { counts, total } = signrankCounts(n);
  let s = 0;
  for (let v = 0; v <= q; v++) s += counts[v];
  return s / total;
}
/** P(V > q). */
export function psignrankUpper(q, n) {
  q = Math.floor(q + 1e-7);
  const maxV = (n * (n + 1)) / 2;
  if (q < 0) return 1;
  if (q >= maxV) return 0;
  const { counts, total } = signrankCounts(n);
  let s = 0;
  for (let v = maxV; v > q; v--) s += counts[v];
  return s / total;
}

function normalP(z, alternative) {
  if (alternative === 'less') return pnormLower(z);
  if (alternative === 'greater') return pnormUpper(z);
  return 2 * Math.min(pnormLower(z), pnormUpper(z));
}

function correctionFor(z, alternative, correct) {
  if (!correct) return 0;
  if (alternative === 'greater') return 0.5;
  if (alternative === 'less') return -0.5;
  return Math.sign(z) * 0.5;
}

// ---------------------------------------------------------------- tests

// Exact conditional distributions with ties or zeros (R's C_dpermdist2 and C_dpermdist1). The
// mid-ranks are doubled so every score is a positive integer; `f` is 2 when any rank is a half.

function scoreScale(z) { return z.every((v) => v === Math.floor(v)) ? 1 : 2; }

/** P(sum of m scores drawn without replacement = s), for every s; scores are positive integers. */
function subsetSumDist(scores, m) {
  const sorted = scores.slice().sort((a, b) => b - a);
  let maxS = 0;
  for (let i = 0; i < m; i++) maxS += sorted[i];
  const dp = Array.from({ length: m + 1 }, () => new Float64Array(maxS + 1));
  dp[0][0] = 1;
  let reach = 0;
  for (let i = 0; i < scores.length; i++) {
    const sc = scores[i];
    reach = Math.min(maxS, reach + sc);
    for (let j = Math.min(i + 1, m); j >= 1; j--) {
      const cur = dp[j];
      const prev = dp[j - 1];
      for (let s = reach; s >= sc; s--) { const v = prev[s - sc]; if (v) cur[s] += v; }
    }
  }
  const counts = dp[m];
  const total = ksum(Array.from(counts));
  return { probs: Array.from(counts, (c) => c / total), maxS };
}

/** P(sum of a random subset of the scores = s): each score in or out with probability 1/2. */
function randomSubsetDist(scores) {
  const maxS = scores.reduce((a, b) => a + b, 0);
  const dp = new Float64Array(maxS + 1);
  dp[0] = 1;
  let reach = 0;
  for (const sc of scores) {
    reach += sc;
    for (let s = reach; s >= sc; s--) dp[s] += dp[s - sc];
  }
  const total = 2 ** scores.length;
  return { probs: Array.from(dp, (c) => c / total), maxS };
}

/** Sum of probs[s] over s with toStat(s) < limit (lower) or >= limit (upper), each tail from its own side. */
function tail(probs, toStat, limit, upper) {
  let acc = 0;
  for (let s = 0; s < probs.length; s++) {
    const p = probs[s];
    if (!p) continue;
    const st = toStat(s);
    if (upper ? st >= limit : st < limit) acc += p;
  }
  return Math.min(1, acc);
}

/**
 * @param {number[]} x @param {number[]} y
 * @param {{ exact?: 'auto'|'exact'|'normal', continuityCorrection?: boolean, alternative?: string }} [opts]
 * @returns {{ W: number, p: number|null, exact: boolean, conditional: boolean, correct: boolean, reasonKey?: string }} W = rank sum of x minus n1(n1+1)/2
 */
export function rankSum(x, y, opts = {}) {
  const alternative = opts.alternative ?? 'two.sided';
  const correct = opts.continuityCorrection ?? opts.correct ?? true;
  const nx = x.length;
  const ny = y.length;
  if (nx < 1 || ny < 1) return { W: NaN, p: null, exact: false, conditional: false, correct: false, reasonKey: 'stats.undefined.needOnePerGroup' };
  const { ranks, ties } = rankAvg(x.concat(y));
  let rx = 0;
  for (let i = 0; i < nx; i++) rx += ranks[i];
  const W = rx - (nx * (nx + 1)) / 2;
  const hasTies = ties.length > 0;
  const exact = opts.exact === 'exact' ? true : opts.exact === 'normal' ? false : nx < 50 && ny < 50;
  if (exact) {
    let lower;
    let upper;
    if (!hasTies) {
      lower = () => pwilcoxLower(W, nx, ny);
      upper = () => pwilcoxUpper(W - 1, nx, ny); // P(W >= w)
    } else {
      const f = scoreScale(ranks);
      const off = (nx * (nx + 1)) / 2;
      const { probs } = subsetSumDist(ranks.map((r) => Math.round(f * r)), nx);
      const toStat = (s) => s / f - off;
      lower = () => tail(probs, toStat, W + 1e-8, false); // R: sum(d[s < q + 1e-8])
      upper = () => tail(probs, toStat, W - 0.25 + 1e-8, true); // R: 1 - .pwilcox(q - 1/4)
    }
    let p;
    if (alternative === 'less') p = lower();
    else if (alternative === 'greater') p = upper();
    else p = Math.min(2 * lower(), 2 * upper(), 1);
    return { W, p, exact: true, conditional: hasTies, correct: false };
  }
  let z = W - (nx * ny) / 2;
  const tieSum = ties.reduce((s, t) => s + (t ** 3 - t), 0);
  const sigma = Math.sqrt(((nx * ny) / 12) * (nx + ny + 1 - tieSum / ((nx + ny) * (nx + ny - 1))));
  if (!(sigma > 0)) return { W, p: null, exact: false, conditional: false, correct, reasonKey: 'stats.undefined.allTied' };
  z = (z - correctionFor(z, alternative, correct)) / sigma;
  return { W, p: normalP(z, alternative), exact: false, conditional: false, correct, z };
}

/**
 * @param {number[]} d  paired differences (x - y) or one sample minus mu
 * @param {{ exact?: 'auto'|'exact'|'normal', continuityCorrection?: boolean, alternative?: string }} [opts]
 * @returns {{ V: number, p: number|null, exact: boolean, conditional: boolean, correct: boolean, zeros: number, n: number, reasonKey?: string }} V = sum of positive ranks
 */
export function signedRank(d, opts = {}) {
  const alternative = opts.alternative ?? 'two.sided';
  const correct = opts.continuityCorrection ?? opts.correct ?? true;
  const nAll = d.length;
  const zeros = d.filter((v) => v === 0).length;
  if (nAll < 1 || zeros === nAll) return { V: NaN, p: null, exact: false, conditional: false, correct: false, zeros, n: nAll - zeros, reasonKey: 'stats.undefined.allZeroDifferences' };
  const exact = opts.exact === 'exact' ? true : opts.exact === 'normal' ? false : nAll < 50;
  if (exact) {
    // ranks over |d| including the zeros (R 4.6.0 .wilcox_test_one_stat_exact)
    const { ranks, ties } = rankAvg(d.map(Math.abs));
    let V = 0;
    for (let i = 0; i < nAll; i++) if (d[i] > 0) V += ranks[i];
    const conditional = ties.length > 0 || zeros > 0;
    let lower;
    let upper;
    let mid;
    if (!conditional) {
      mid = (nAll * (nAll + 1)) / 4;
      lower = () => psignrankLower(V, nAll);
      upper = () => psignrankUpper(V - 1, nAll);
    } else {
      const z = ranks.filter((_, i) => d[i] !== 0);
      mid = z.reduce((a, b) => a + b, 0) / 2;
      const f = scoreScale(z);
      const { probs } = randomSubsetDist(z.map((r) => Math.round(f * r)));
      const toStat = (s) => s / f;
      lower = () => tail(probs, toStat, V + 1e-8, false);
      upper = () => tail(probs, toStat, V - 0.25 + 1e-8, true);
    }
    let p;
    if (alternative === 'less') p = lower();
    else if (alternative === 'greater') p = upper();
    else p = Math.min(2 * (V > mid ? upper() : lower()), 1);
    return { V, p, exact: true, conditional, correct: false, zeros, n: nAll - zeros };
  }
  const nonzero = d.filter((v) => v !== 0);
  const n = nonzero.length;
  const { ranks, ties } = rankAvg(nonzero.map(Math.abs));
  let V = 0;
  for (let i = 0; i < n; i++) if (nonzero[i] > 0) V += ranks[i];
  let z = V - (n * (n + 1)) / 4;
  const tieSum = ties.reduce((s, t) => s + (t ** 3 - t), 0);
  const sigma = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24 - tieSum / 48);
  if (!(sigma > 0)) return { V, p: null, exact: false, conditional: false, correct, zeros, n, reasonKey: 'stats.undefined.allTied' };
  z = (z - correctionFor(z, alternative, correct)) / sigma;
  return { V, p: normalP(z, alternative), exact: false, conditional: false, correct, zeros, n, z };
}

/**
 * @param {number[][]} groups
 * @returns {{ H: number|null, df: number, p: number|null, reasonKey?: string }} tie-corrected
 */
export function kruskalWallis(groups) {
  const gs = groups.filter((g) => g.length > 0);
  const k = gs.length;
  if (k < 2) return { H: null, df: k - 1, p: null, reasonKey: 'stats.undefined.needTwoGroups' };
  const all = [];
  gs.forEach((g) => { for (const v of g) all.push(v); });
  const n = all.length;
  const { ranks, ties } = rankAvg(all);
  let stat = 0;
  let off = 0;
  for (const g of gs) {
    let s = 0;
    for (let i = 0; i < g.length; i++) s += ranks[off + i];
    off += g.length;
    stat += (s * s) / g.length;
  }
  const tieSum = ties.reduce((s, t) => s + (t ** 3 - t), 0);
  const denom = 1 - tieSum / (n ** 3 - n);
  if (!(denom > 0)) return { H: null, df: k - 1, p: null, reasonKey: 'stats.undefined.allTied' };
  const H = ((12 * stat) / (n * (n + 1)) - 3 * (n + 1)) / denom;
  return { H, df: k - 1, p: pchisqUpper(H, k - 1) };
}

// ---------------------------------------------------------------- run functions

const median = (a) => (a.length ? quantile(a.slice().sort((p, q) => p - q), 0.5, 7) : null);
const medVal = (a) => (a.length ? val(median(a)) : nullVal('stats.undefined.noData'));
const bad = (reasonKey, used = 0, dropped = []) => ({ status: 'invalid', values: { reason: nullVal(reasonKey) }, tests: [], tables: [], used, dropped });

function variantOf(r) { return r.exact ? (r.conditional ? 'exact-conditional' : 'exact') : r.correct ? 'normal-cc' : 'normal'; }

/** Implementation for 'test.mannWhitney'. Roles: outcome (number), group (two levels; x = the first level). @type {import('../runtime/registry.js').MethodImpl} */
export function runMannWhitney(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  if (!yKey || !gKey) return bad('stats.error.missingRole');
  const { alternative } = common(spec);
  const o = spec.options || {};
  const { rows, dropped } = completeRows(table, [yKey, gKey]);
  const { labels, groups } = groupsAt(table, yKey, gKey, rows);
  if (groups.length !== 2) return bad('stats.undefined.needTwoGroups', rows.length, dropped);
  const r = rankSum(groups[0], groups[1], { exact: o.exact, continuityCorrection: o.continuityCorrection, alternative });
  return {
    status: r.p === null ? 'invalid' : 'ok',
    values: { nX: val(groups[0].length), nY: val(groups[1].length), medianX: medVal(groups[0]), medianY: medVal(groups[1]) },
    tests: [testRow({ id: 'mannWhitney', name: 'W', statistic: r.W, p: r.p, alternative, variant: variantOf(r), reasonKey: r.reasonKey })],
    tables: [{ id: 'groups', columns: ['first', 'second'], rows: [labels] }],
    used: rows.length,
    dropped,
  };
}

/** Implementation for 'test.wilcoxonSignedRank'. Roles: x and y (paired columns), or outcome holding the differences. @type {import('../runtime/registry.js').MethodImpl} */
export function runSignedRank(spec, table) {
  const a = role(spec, 'x') ?? role(spec, 'outcome');
  const b = role(spec, 'y');
  if (!a) return bad('stats.error.missingRole');
  const { alternative } = common(spec);
  const o = spec.options || {};
  const { rows, dropped } = completeRows(table, b ? [a, b] : [a]);
  const xa = numbersAt(table, a, rows);
  const xb = b ? numbersAt(table, b, rows) : null;
  const d = xb ? xa.map((v, i) => v - xb[i]) : xa;
  const r = signedRank(d, { exact: o.exact, continuityCorrection: o.continuityCorrection, alternative });
  return {
    status: r.p === null ? 'invalid' : 'ok',
    values: { n: val(r.n), zeros: val(r.zeros), medianDiff: medVal(d) },
    tests: [testRow({ id: 'signedRank', name: 'V', statistic: r.V, p: r.p, alternative, variant: variantOf(r), reasonKey: r.reasonKey })],
    tables: [],
    used: rows.length,
    dropped,
  };
}

/** Implementation for 'test.kruskalWallis'. Roles: outcome (number), group (category). @type {import('../runtime/registry.js').MethodImpl} */
export function runKruskalWallis(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  if (!yKey || !gKey) return bad('stats.error.missingRole');
  const { rows, dropped } = completeRows(table, [yKey, gKey]);
  column(table, gKey);
  const { labels, groups } = groupsAt(table, yKey, gKey, rows);
  const r = kruskalWallis(groups);
  return {
    status: r.H === null ? 'invalid' : 'ok',
    values: { groups: val(groups.length) },
    tests: [testRow({ id: 'kruskalWallis', name: 'H', statistic: r.H, df: r.df, p: r.p, variant: 'tie-corrected', reasonKey: r.reasonKey })],
    tables: [{ id: 'groups', columns: ['level', 'n', 'median'], rows: groups.map((g, j) => [labels[j], g.length, median(g)]) }],
    used: rows.length,
    dropped,
  };
}
