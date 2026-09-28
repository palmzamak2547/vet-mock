// Post hoc comparisons: Dunn after Kruskal-Wallis, Games-Howell, Dunnett against a control [M2-DESIGN.md
// 3.1.4]. OWNER: lab role.
//
// Pairs are listed in R's order (B-A, C-A, C-B: later level minus earlier level); Dunnett lists every
// other level minus the control, in codebook order.
// - Dunn (1964): z on mean ranks of the whole sample, with the tie correction
//   sigma^2 = N (N + 1) / 12 - sum(t^3 - t) / (12 (N - 1)); two-sided p from erfc; the adjustment (Holm by
//   default, G7) over every pair with p.adjust's rules (padjust.js).
// - Games and Howell (1976): Welch standard error and Welch-Satterthwaite df per pair; p from the
//   studentized range with k means, ptukey(|diff| / SE * sqrt 2, k, df) upper tail (computed as 1 - cdf,
//   as R does, M1-DESIGN.md A8); interval diff +/- qtukey(conf, k, df) / sqrt 2 * SE.
// - Dunnett (1955): pooled mean square of all groups on N - k df; t = diff / SE for each level against the
//   control; the adjusted p is 1 - P(|T_j| <= |t| for every j) and the interval uses the two-sided
//   critical value, both from the multivariate t in mvt.js (numerical integration, never simulation),
//   with its error bound printed. Two-sided only.
// Newman-Keuls and Fisher's LSD are not offered (competitor-gaps D1: neither controls the chance of a
// false difference across the family).
import { pnormTwoSided, ptukeyUpper, qtukey } from './dist.js';
import { mean, variance, rankAvg, val, nullVal, testRow, role, common, completeRows, groupsAt, invalid, sumSqDev, ksum } from './common.js';
import { pAdjust } from './padjust.js';
import { kruskalWallis } from './rank.js';
import { dunnettUpper, dunnettQuantile } from './mvt.js';

function pairsOrder(k) {
  const out = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) out.push([j, i]);
  return out;
}

const nn = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);

/** G7 when more than one comparison is shown without an adjustment. */
function g7(m, adjust) {
  return adjust === 'none' && m > 1 ? [{ id: 'G7', severity: 'warn', key: 'epi.guard.G7.title', bodyKey: 'epi.guard.G7.body', params: { tests: m }, routes: ['holm', 'bonferroni'] }] : [];
}

function readGroups(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'exposure');
  if (!yKey || !gKey) return { bad: invalid('stats.error.missingRole') };
  const { rows, dropped } = completeRows(table, [yKey, gKey]);
  const { labels, groups } = groupsAt(table, yKey, gKey, rows);
  return { rows, dropped, labels, groups };
}

/**
 * Dunn's z for every pair.
 * @param {number[][]} groups @param {string[]} labels @param {'holm'|'bonferroni'|'sidak'|'bh'|'none'} adjust
 * @returns {{ pair: string, meanRankDiff: number, z: number|null, p: number|null, pAdjusted: number|null }[]}
 */
export function dunn(groups, labels, adjust = 'holm') {
  const all = [];
  for (const g of groups) for (const v of g) all.push(v);
  const N = all.length;
  const { ranks, ties } = rankAvg(all);
  const meanRanks = [];
  let off = 0;
  for (const g of groups) { meanRanks.push(ksum(ranks.slice(off, off + g.length)) / g.length); off += g.length; }
  const tieSum = ties.reduce((s, t) => s + (t ** 3 - t), 0);
  const s2 = (N * (N + 1)) / 12 - tieSum / (12 * (N - 1));
  const rows = pairsOrder(groups.length).map(([j, i]) => {
    const d = meanRanks[j] - meanRanks[i];
    const se = Math.sqrt(s2 * (1 / groups[j].length + 1 / groups[i].length));
    const z = se > 0 ? d / se : NaN;
    return { pair: `${labels[j]}-${labels[i]}`, meanRankDiff: d, z: nn(z), p: nn(pnormTwoSided(z)) };
  });
  const adj = pAdjust(rows.map((r) => r.p), adjust);
  return rows.map((r, x) => ({ ...r, pAdjusted: adj[x] }));
}

/**
 * Games-Howell for every pair.
 * @param {number[][]} groups @param {string[]} labels @param {number} confLevel
 */
export function gamesHowell(groups, labels, confLevel = 0.95) {
  const k = groups.length;
  const m = groups.map((g) => mean(g));
  const v = groups.map((g) => variance(g));
  const n = groups.map((g) => g.length);
  return pairsOrder(k).map(([j, i]) => {
    const d = m[j] - m[i];
    const a = v[j] / n[j];
    const b = v[i] / n[i];
    const se = Math.sqrt(a + b);
    const df = (a + b) ** 2 / (a * a / (n[j] - 1) + b * b / (n[i] - 1));
    const ok = se > 0 && df > 0;
    const q = ok ? (Math.abs(d) / se) * Math.SQRT2 : NaN;
    const p = ok ? ptukeyUpper(q, k, df) : NaN;
    const crit = ok ? qtukey(confLevel, k, df) / Math.SQRT2 : NaN;
    return { pair: `${labels[j]}-${labels[i]}`, diff: d, se: nn(se), df: nn(df), q: nn(q), p: nn(p), lower: nn(d - crit * se), upper: nn(d + crit * se) };
  });
}

/**
 * Dunnett's comparisons of every group with the control (index `control`).
 * @param {number[][]} groups @param {string[]} labels @param {number} control @param {number} confLevel
 */
export function dunnett(groups, labels, control, confLevel = 0.95) {
  const k = groups.length;
  const N = groups.reduce((s, g) => s + g.length, 0);
  const df = N - k;
  const ssw = ksum(groups.map((g) => Math.max(0, sumSqDev(g))));
  const mse = df > 0 ? ssw / df : NaN;
  const m = groups.map((g) => mean(g));
  const n = groups.map((g) => g.length);
  const others = groups.map((_, j) => j).filter((j) => j !== control);
  const lambda = others.map((j) => Math.sqrt(n[j] / (n[j] + n[control])));
  const ok = df > 0 && mse > 0;
  let crit = NaN;
  let maxErr = 0;
  if (ok) crit = dunnettQuantile(confLevel, lambda, df);
  const rows = others.map((j) => {
    const d = m[j] - m[control];
    const se = Math.sqrt(mse * (1 / n[j] + 1 / n[control]));
    const t = ok ? d / se : NaN;
    let p = NaN;
    if (ok) { const u = dunnettUpper(Math.abs(t), lambda, df); p = u.value; maxErr = Math.max(maxErr, u.error); }
    return { pair: `${labels[j]}-${labels[control]}`, diff: d, se: nn(se), t: nn(t), p: nn(p), lower: nn(d - crit * se), upper: nn(d + crit * se) };
  });
  return { rows, df, mse, crit: nn(crit), lambda, error: maxErr };
}

/**
 * roles outcome, group; options adjust (holm, bonferroni, sidak, bh, none). Dunn (1964) z with the tie correction; table 'pairs' (later level minus earlier, R's order).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runDunn(spec, table) {
  const r = readGroups(spec, table);
  if (r.bad) return r.bad;
  const adjust = spec.options?.adjust ?? 'holm';
  if (r.groups.length < 2) return invalid('stats.undefined.needTwoGroups', { used: r.rows.length, dropped: r.dropped });
  const kw = kruskalWallis(r.groups);
  const pairs = dunn(r.groups, r.labels, adjust);
  return {
    status: kw.H === null ? 'invalid' : 'ok',
    values: { groups: val(r.groups.length), comparisons: val(pairs.length) },
    tests: [testRow({ id: 'kruskalWallis', name: 'H', statistic: kw.H, df: kw.df, p: kw.p, variant: 'tie-corrected', reasonKey: kw.reasonKey })],
    tables: [
      { id: 'pairs', columns: ['pair', 'meanRankDiff', 'z', 'p', 'pAdjusted'], rows: pairs.map((x) => [x.pair, x.meanRankDiff, x.z, x.p, x.pAdjusted]) },
      { id: 'groups', columns: ['level', 'n', 'meanRank'], rows: meanRankRows(r.groups, r.labels) },
    ],
    used: r.rows.length,
    dropped: r.dropped,
    warnings: g7(pairs.length, adjust),
    notes: [{ id: 'adjust', severity: 'note', key: `lab.note.adjust.${adjust}` }],
  };
}

function meanRankRows(groups, labels) {
  const all = [];
  for (const g of groups) for (const v of g) all.push(v);
  const { ranks } = rankAvg(all);
  let off = 0;
  return groups.map((g, j) => { const mr = ksum(ranks.slice(off, off + g.length)) / g.length; off += g.length; return [labels[j], g.length, mr]; });
}

/**
 * roles outcome, group; Welch-type SE and df per pair, p from the studentized range (upper tail as 1 - cdf, A8), interval at confLevel.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runGamesHowell(spec, table) {
  const r = readGroups(spec, table);
  if (r.bad) return r.bad;
  const { confLevel } = common(spec);
  if (r.groups.length < 2) return invalid('stats.undefined.needTwoGroups', { used: r.rows.length, dropped: r.dropped });
  if (r.groups.some((g) => g.length < 2)) return invalid('lab.undefined.groupTooSmall', { used: r.rows.length, dropped: r.dropped });
  const pairs = gamesHowell(r.groups, r.labels, confLevel);
  // A pair can be undefined on its own: both groups without spread (SE 0), or a Welch df below 2, where the
  // studentized range is not defined (R's ptukey gives NaN there too; a group of 2 animals reaches it easily).
  // That pair keeps null p and interval with its own note; the other pairs stand. Only when no pair has a p
  // is the whole result invalid, and then with the reason that is true.
  const noSpread = pairs.filter((x) => x.se === 0).map((x) => x.pair);
  const lowDf = pairs.filter((x) => x.p === null && x.se !== 0).map((x) => x.pair);
  const none = pairs.every((x) => x.p === null);
  const notes = [];
  if (noSpread.length) notes.push({ id: 'pairNoSpread', severity: 'warning', key: 'lab.note.ghPairNoSpread', params: { pairs: noSpread.join(', ') } });
  if (lowDf.length) notes.push({ id: 'pairLowDf', severity: 'warning', key: 'lab.note.ghPairLowDf', params: { pairs: lowDf.join(', ') } });
  const reasonKey = lowDf.length ? 'lab.undefined.ghLowDf' : 'stats.undefined.zeroVariance';
  return {
    status: none ? 'invalid' : 'ok',
    values: { groups: val(r.groups.length), comparisons: val(pairs.length), ...(none ? { reason: nullVal(reasonKey) } : {}) },
    tests: [],
    tables: [
      { id: 'pairs', columns: ['pair', 'diff', 'se', 'df', 'q', 'pAdjusted', 'lower', 'upper'], rows: pairs.map((x) => [x.pair, x.diff, x.se, x.df, x.q, x.p, x.lower, x.upper]) },
      { id: 'groups', columns: ['level', 'n', 'mean', 'sd'], rows: r.groups.map((g, j) => [r.labels[j], g.length, mean(g), Math.sqrt(variance(g))]) },
    ],
    used: r.rows.length,
    dropped: r.dropped,
    notes,
  };
}

/**
 * roles outcome, group; levels.controlLevel; two-sided only (another alternative returns status 'invalid' with lab.invalid.dunnettTwoSided).
 * Adjusted p and the critical value from stats/mvt.js, never by simulation.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runDunnett(spec, table) {
  const { confLevel, alternative } = common(spec);
  if (alternative !== 'two.sided') return invalid('lab.invalid.dunnettTwoSided');
  const r = readGroups(spec, table);
  if (r.bad) return r.bad;
  if (r.groups.length < 2) return invalid('stats.undefined.needTwoGroups', { used: r.rows.length, dropped: r.dropped });
  const wanted = spec.levels?.controlLevel ?? null;
  const notes = [];
  let control = 0;
  if (wanted !== null && wanted !== undefined) {
    control = r.labels.indexOf(wanted);
    if (control < 0) return invalid('lab.invalid.controlNotFound', { used: r.rows.length, dropped: r.dropped });
  } else notes.push({ id: 'control', severity: 'note', key: 'lab.note.controlFirst', params: { level: r.labels[0] } });
  const d = dunnett(r.groups, r.labels, control, confLevel);
  const ok = d.crit !== null;
  notes.push({ id: 'integration', severity: 'note', key: 'lab.note.dunnettIntegration', params: { error: d.error } });
  return {
    status: ok ? 'ok' : 'invalid',
    values: {
      critical: ok ? val(d.crit) : nullVal('stats.undefined.zeroVariance'),
      df: val(d.df),
      msResidual: d.mse > 0 ? val(d.mse) : nullVal('stats.undefined.zeroVariance'),
      integrationError: val(d.error),
      comparisons: val(d.rows.length),
    },
    tests: [],
    tables: [
      { id: 'pairs', columns: ['pair', 'diff', 'se', 't', 'pAdjusted', 'lower', 'upper'], rows: d.rows.map((x) => [x.pair, x.diff, x.se, x.t, x.p, x.lower, x.upper]) },
      { id: 'groups', columns: ['level', 'n', 'mean', 'sd'], rows: r.groups.map((g, j) => [r.labels[j], g.length, mean(g), g.length > 1 ? Math.sqrt(variance(g)) : null]) },
    ],
    used: r.rows.length,
    dropped: r.dropped,
    notes,
  };
}
