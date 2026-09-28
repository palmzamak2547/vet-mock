// One-way ANOVA with Tukey HSD (Tukey-Kramer for unequal n) and pairwise t with Holm or Bonferroni
// [M1-DESIGN.md 7.7]. M2 adds the pairwise t options with Sidak and Benjamini-Hochberg
// [M2-DESIGN.md 3.1.4]. OWNER: lab role (stats role in M1).
//
// Sums of squares are computed from deviations (group means with a second-pass correction), never
// from sum(x^2) - n mean^2, so the NIST StRD ANOVA sets keep 9 or more correct digits at the lower
// and average levels of difficulty. TukeyHSD and pairwise.t.test follow R's code: pairs in the order
// of R's lower triangle (B-A, C-A, C-B), difference = later level minus earlier level, Tukey p from
// ptukey(lower.tail = FALSE) (see dist.js A8), pairwise t with the pooled SD of all groups and
// p.adjust over every pair.
//
// runAnova1 values: F is reported as the test 'anova' (statistic F, dfPair [between, within], p);
// values ssBetween, ssWithin, msBetween, msWithin, etaSquared (= R^2). Tables: 'anova' (source, df,
// ss, ms, F, p), 'groups' (level, n, mean, sd), and 'posthoc' when asked for.
import { pfUpper, ptukeyUpper, qtukey, ptUpper, ptTwoSided } from './dist.js';
import { mean, ksum, sumSqDev, variance, val, nullVal, testRow, role, common, completeRows, groupsAt } from './common.js';
import { pAdjust } from './padjust.js';

/**
 * @param {number[][]} groups
 * @returns {{ F: number|null, df1: number, df2: number, p: number|null, ssBetween: number, ssWithin: number, msBetween: number, msWithin: number, means: number[], ns: number[], grandMean: number, rSquared: number|null, reasonKey?: string }}
 */
export function anova1(groups) {
  const gs = groups.filter((g) => g.length > 0);
  const ns = gs.map((g) => g.length);
  const means = gs.map((g) => mean(g));
  const N = ns.reduce((a, b) => a + b, 0);
  const k = gs.length;
  const all = [];
  for (const g of gs) for (const v of g) all.push(v);
  const grandMean = mean(all);
  const ssWithin = ksum(gs.map((g, j) => Math.max(0, sumSqDev(g, means[j]))));
  const ssBetween = ksum(gs.map((g, j) => ns[j] * (means[j] - grandMean) ** 2));
  const df1 = k - 1;
  const df2 = N - k;
  const msBetween = df1 > 0 ? ssBetween / df1 : NaN;
  const msWithin = df2 > 0 ? ssWithin / df2 : NaN;
  const total = ssBetween + ssWithin;
  const out = { df1, df2, ssBetween, ssWithin, msBetween, msWithin, means, ns, grandMean, rSquared: total > 0 ? ssBetween / total : null };
  if (k < 2) return { ...out, F: null, p: null, reasonKey: 'stats.undefined.needTwoGroups' };
  if (df2 < 1) return { ...out, F: null, p: null, reasonKey: 'stats.undefined.noResidualDf' };
  if (!(msWithin > 0)) return { ...out, F: null, p: null, reasonKey: 'stats.undefined.zeroVariance' };
  const F = msBetween / msWithin;
  return { ...out, F, p: pfUpper(F, df1, df2) };
}

function pairsOrder(k) {
  const out = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) out.push([j, i]); // R lower.tri, column-major
  return out;
}

/**
 * Pairs in R's TukeyHSD order (level j minus level i for i < j), diff, CI and adjusted p.
 * @param {number[][]} groups @param {string[]} labels @param {number} confLevel
 * @returns {{ pair: string, diff: number, ci: [number|null, number|null], p: number|null }[]}
 */
export function tukeyHsd(groups, labels, confLevel = 0.95) {
  const a = anova1(groups);
  const k = a.means.length;
  const df = a.df2;
  const mse = a.msWithin;
  const q = df >= 2 ? qtukey(confLevel, k, df) : NaN;
  return pairsOrder(k).map(([j, i]) => {
    const center = a.means[j] - a.means[i];
    const s = Math.sqrt((mse / 2) * (1 / a.ns[j] + 1 / a.ns[i]));
    const width = q * s;
    const est = center / s;
    const p = df >= 2 && s > 0 ? ptukeyUpper(Math.abs(est), k, df) : NaN;
    const ok = (x) => (Number.isNaN(x) ? null : x);
    return { pair: `${labels[j]}-${labels[i]}`, diff: center, ci: [ok(center - width), ok(center + width)], p: ok(p) };
  });
}

/**
 * Pairwise t tests with the pooled SD of all groups, as R's pairwise.t.test(pool.sd = TRUE).
 * @param {number[][]} groups @param {string[]} labels
 * @param {'holm'|'bonferroni'|'sidak'|'bh'|'none'} adjust
 * @param {'two.sided'|'less'|'greater'} [alternative]
 * @returns {{ pair: string, diff: number, t: number|null, p: number|null, pAdjusted: number|null }[]}
 */
export function pairwiseT(groups, labels, adjust = 'holm', alternative = 'two.sided') {
  const ns = groups.map((g) => g.length);
  const xbar = groups.map((g) => mean(g));
  const s2 = groups.map((g) => (g.length > 1 ? variance(g) : NaN));
  const degf = ns.map((n) => n - 1);
  let num = 0;
  let totalDf = 0;
  groups.forEach((g, j) => { if (g.length > 1) { num += s2[j] * degf[j]; totalDf += degf[j]; } });
  const pooled = Math.sqrt(num / totalDf);
  const rows = pairsOrder(groups.length).map(([j, i]) => {
    const dif = xbar[j] - xbar[i];
    const se = pooled * Math.sqrt(1 / ns[j] + 1 / ns[i]);
    const t = dif / se;
    let p;
    if (!(se > 0) || totalDf < 1) p = NaN;
    else if (alternative === 'greater') p = ptUpper(t, totalDf);
    else if (alternative === 'less') p = ptUpper(-t, totalDf);
    else p = ptTwoSided(t, totalDf);
    return { pair: `${labels[j]}-${labels[i]}`, diff: dif, t: Number.isFinite(t) ? t : null, p: Number.isNaN(p) ? null : p };
  });
  const adj = pAdjust(rows.map((r) => r.p), adjust);
  return rows.map((r, i) => ({ ...r, pAdjusted: adj[i] }));
}

/** posthoc option -> p.adjust method for the pairwise t tests. */
const PAIRWISE_ADJUST = { 'pairwise-t-holm': 'holm', 'pairwise-t-bonferroni': 'bonferroni', 'pairwise-t-sidak': 'sidak', 'pairwise-t-bh': 'bh' };

/** Implementation for 'test.anova1' (and 'posthoc.tukey' through options.posthoc). @type {import('../runtime/registry.js').MethodImpl} */
export function runAnova1(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  if (!yKey || !gKey) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
  const { confLevel } = common(spec);
  const posthoc = spec?.method === 'posthoc.tukey' ? 'tukey' : (spec?.options?.posthoc ?? 'tukey');
  const { rows, dropped } = completeRows(table, [yKey, gKey]);
  const { labels, groups } = groupsAt(table, yKey, gKey, rows);
  const a = anova1(groups);
  const reason = a.reasonKey;
  const values = {
    ssBetween: val(a.ssBetween),
    ssWithin: val(a.ssWithin),
    msBetween: Number.isNaN(a.msBetween) ? nullVal('stats.undefined.needTwoGroups') : val(a.msBetween),
    msWithin: Number.isNaN(a.msWithin) ? nullVal('stats.undefined.noResidualDf') : val(a.msWithin),
    etaSquared: a.rSquared === null ? nullVal('stats.undefined.zeroVariance') : val(a.rSquared),
  };
  const tables = [
    { id: 'anova', columns: ['source', 'df', 'ss', 'ms', 'F', 'p'], rows: [
      ['between', a.df1, a.ssBetween, Number.isNaN(a.msBetween) ? null : a.msBetween, a.F, a.p],
      ['within', a.df2, a.ssWithin, Number.isNaN(a.msWithin) ? null : a.msWithin, null, null],
    ] },
    { id: 'groups', columns: ['level', 'n', 'mean', 'sd'], rows: groups.map((g, j) => [labels[j], g.length, a.means[j], g.length > 1 ? Math.sqrt(variance(g)) : null]) },
  ];
  if (a.F !== null && posthoc !== 'none' && (groups.length > 2 || spec?.method === 'posthoc.tukey')) {
    if (posthoc === 'tukey') {
      tables.push({ id: 'posthoc', columns: ['pair', 'diff', 'lower', 'upper', 'pAdjusted'], rows: tukeyHsd(groups, labels, confLevel).map((r) => [r.pair, r.diff, r.ci[0], r.ci[1], r.p]) });
    } else {
      const method = PAIRWISE_ADJUST[posthoc] ?? 'holm';
      tables.push({ id: 'posthoc', columns: ['pair', 'diff', 't', 'p', 'pAdjusted'], rows: pairwiseT(groups, labels, method).map((r) => [r.pair, r.diff, r.t, r.p, r.pAdjusted]) });
    }
  }
  return {
    status: a.F === null ? 'invalid' : 'ok',
    values,
    tests: [testRow({ id: 'anova', name: 'F', statistic: a.F, df: null, dfPair: [a.df1, a.df2], p: a.p, variant: 'oneway', reasonKey: reason })],
    tables,
    used: rows.length,
    dropped,
  };
}
