// Pearson chi-square for r x c (Yates as a visible option for 2x2), expected counts for G5, and the
// chi-square test for trend in proportions (R's prop.trend.test) [M1-DESIGN.md 7.12]. OWNER: stats role.
//
// As R's chisq.test: E = row total x column total / n; with Yates on a 2x2 table the correction is
// min(0.5, min |x - E|), so it never overshoots; df = (r - 1)(c - 1). prop.trend.test is the
// weighted regression of x/n on the scores with weights n / (p (1 - p)); its statistic is the
// regression sum of squares, written here in closed form.
//
// runChisq values: minExpected, shareBelow5 (share of cells with E < 5, for G5; each carries the
// thresholds G5 uses as below / above, for stats/format.js); test 'chisq'
// (X2, df, p, variant 'pearsonX2' or 'yates'); tables 'observed' and 'expected'.
// runTrend: test 'trend' (X2, df 1, p); table 'proportions' (level, x, n, proportion, score).
import { pchisqUpper } from './dist.js';
import { val, nullVal, testRow, role, completeRows, column } from './common.js';

/** @returns {{ X2: number|null, df: number, p: number|null, expected: number[][], minExpected: number, shareBelow5: number, yates: number, reasonKey?: string }} */
export function chisqTest(table, opts = {}) {
  const r = table.length;
  const c = table[0]?.length ?? 0;
  const rs = table.map((row) => row.reduce((a, b) => a + b, 0));
  const cs = Array.from({ length: c }, (_, j) => table.reduce((a, row) => a + row[j], 0));
  const n = rs.reduce((a, b) => a + b, 0);
  const expected = table.map((_, i) => cs.map((cj) => (rs[i] * cj) / n));
  let minE = Infinity;
  let below = 0;
  for (const row of expected) for (const e of row) { minE = Math.min(minE, e); if (e < 5) below++; }
  const df = (r - 1) * (c - 1);
  const base = { df, expected, minExpected: minE, shareBelow5: r * c ? below / (r * c) : 0 };
  if (!(n > 0) || rs.some((v) => v === 0) || cs.some((v) => v === 0)) return { ...base, X2: null, p: null, yates: 0, reasonKey: 'stats.undefined.emptyMargin' };
  if (df < 1) return { ...base, X2: null, p: null, yates: 0, reasonKey: 'stats.undefined.needTwoGroups' };
  let yates = 0;
  if (opts.yates && r === 2 && c === 2) {
    let m = Infinity;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) m = Math.min(m, Math.abs(table[i][j] - expected[i][j]));
    yates = Math.min(0.5, m);
  }
  let X2 = 0;
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    const d = Math.abs(table[i][j] - expected[i][j]) - yates;
    X2 += (d * d) / expected[i][j];
  }
  return { ...base, X2, p: pchisqUpper(X2, df), yates };
}

/** @returns {{ X2: number|null, df: 1, p: number|null, reasonKey?: string }} */
export function trendTest(x, n, scores) {
  const k = x.length;
  const s = scores ?? x.map((_, i) => i + 1);
  const N = n.reduce((a, b) => a + b, 0);
  const pbar = x.reduce((a, b) => a + b, 0) / N;
  if (!(pbar > 0 && pbar < 1)) return { X2: null, df: 1, p: null, reasonKey: 'stats.undefined.noVariation' };
  const w = n.map((ni) => ni / pbar / (1 - pbar));
  const f = x.map((xi, i) => xi / n[i]);
  const W = w.reduce((a, b) => a + b, 0);
  const sbar = s.reduce((a, si, i) => a + w[i] * si, 0) / W;
  const fbar = f.reduce((a, fi, i) => a + w[i] * fi, 0) / W;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < k; i++) {
    sxy += w[i] * (s[i] - sbar) * (f[i] - fbar);
    sxx += w[i] * (s[i] - sbar) ** 2;
  }
  if (!(sxx > 0)) return { X2: null, df: 1, p: null, reasonKey: 'stats.undefined.zeroVariance' };
  const X2 = (sxy * sxy) / sxx;
  return { X2, df: 1, p: pchisqUpper(X2, 1) };
}

/** Counts from the table (rows = exposure levels, columns = outcome levels) or from counts input. */
function crossTab(spec, table) {
  if (spec?.input?.kind === 'counts') {
    const t = spec.input.counts?.table;
    return { counts: t, rowLabels: spec.input.counts?.rowLabels ?? t.map((_, i) => String(i + 1)), colLabels: spec.input.counts?.colLabels ?? t[0].map((_, j) => String(j + 1)), used: t.flat().reduce((a, b) => a + b, 0), dropped: [] };
  }
  const rKey = role(spec, 'exposure') ?? role(spec, 'group') ?? role(spec, 'x');
  const cKey = role(spec, 'outcome') ?? role(spec, 'y');
  if (!rKey || !cKey) return null;
  const { rows, dropped } = completeRows(table, [rKey, cKey]);
  const rc = column(table, rKey);
  const cc = column(table, cKey);
  if (rc.kind !== 'category' || cc.kind !== 'category') throw Object.assign(new Error('stats: chi-square needs two category columns'), { key: 'stats.error.needsCategory' });
  const counts = rc.levels.map(() => cc.levels.map(() => 0));
  for (const i of rows) counts[rc.values[i]][cc.values[i]]++;
  // drop empty levels (a level with no rows is not a category of this analysis)
  const keepR = counts.map((row) => row.some((v) => v > 0));
  const keepC = cc.levels.map((_, j) => counts.some((row) => row[j] > 0));
  const t = counts.filter((_, i) => keepR[i]).map((row) => row.filter((_, j) => keepC[j]));
  return { counts: t, rowLabels: rc.levels.filter((_, i) => keepR[i]), colLabels: cc.levels.filter((_, j) => keepC[j]), used: rows.length, dropped };
}

/** Implementation for 'test.chisq'. @type {import('../runtime/registry.js').MethodImpl} */
export function runChisq(spec, table) {
  const ct = crossTab(spec, table);
  if (!ct) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
  const yates = !!spec?.options?.yates;
  const r = chisqTest(ct.counts, { yates });
  const is2x2 = ct.counts.length === 2 && ct.counts[0].length === 2;
  return {
    status: r.X2 === null ? 'invalid' : 'ok',
    values: {
      // G5 judges these against Cochran's rule (any E below 1, more than 20% below 5): the thresholds
      // travel with the values so the printed number keeps its side of each (stats/format.js).
      minExpected: Number.isFinite(r.minExpected) ? val(r.minExpected, { below: [1, 5] }) : nullVal('stats.undefined.noData'),
      shareBelow5: val(r.shareBelow5, { above: [0.2] }),
    },
    tests: [testRow({ id: 'chisq', name: 'X2', statistic: r.X2, df: r.df, p: r.p, variant: yates && is2x2 ? 'yates' : 'pearsonX2', reasonKey: r.reasonKey })],
    tables: [
      { id: 'observed', columns: ['level', ...ct.colLabels], rows: ct.counts.map((row, i) => [ct.rowLabels[i], ...row]) },
      { id: 'expected', columns: ['level', ...ct.colLabels], rows: r.expected.map((row, i) => [ct.rowLabels[i], ...row]) },
    ],
    used: ct.used,
    dropped: ct.dropped,
  };
}

/**
 * Implementation for 'test.trend'. Rows = the ordered levels of `exposure` (codebook order), the
 * count x = rows with the outcome level `levels.outcomePositive`; options.scores 'rank' (1..k) or an
 * array of numbers. Counts input: { x: [...], n: [...], labels?: [...] }.
 * @type {import('../runtime/registry.js').MethodImpl}
 */
export function runTrend(spec, table) {
  let x;
  let n;
  let labels;
  let used;
  let dropped = [];
  if (spec?.input?.kind === 'counts') {
    ({ x, n } = spec.input.counts);
    labels = spec.input.counts.labels ?? x.map((_, i) => String(i + 1));
    used = n.reduce((a, b) => a + b, 0);
  } else {
    const ct = crossTab(spec, table);
    if (!ct) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: [] };
    const pos = spec?.levels?.outcomePositive;
    const j = pos != null ? ct.colLabels.indexOf(pos) : 0;
    if (j < 0) return { status: 'invalid', values: { reason: nullVal('stats.error.missingRole') }, tests: [], tables: [], used: 0, dropped: ct.dropped };
    x = ct.counts.map((row) => row[j]);
    n = ct.counts.map((row) => row.reduce((a, b) => a + b, 0));
    labels = ct.rowLabels;
    used = ct.used;
    dropped = ct.dropped;
  }
  const sc = spec?.options?.scores;
  const scores = Array.isArray(sc) ? sc : x.map((_, i) => i + 1);
  if (scores.length !== x.length) return { status: 'invalid', values: { reason: nullVal('stats.error.scoresLength') }, tests: [], tables: [], used: 0, dropped };
  const r = trendTest(x, n, scores);
  return {
    status: r.X2 === null ? 'invalid' : 'ok',
    values: { levels: val(x.length) },
    tests: [testRow({ id: 'trend', name: 'X2', statistic: r.X2, df: 1, p: r.p, variant: Array.isArray(sc) ? 'typedScores' : 'rankScores', reasonKey: r.reasonKey })],
    tables: [{ id: 'proportions', columns: ['level', 'x', 'n', 'proportion', 'score'], rows: x.map((xi, i) => [labels[i], xi, n[i], n[i] ? xi / n[i] : null, scores[i]]) }],
    used,
    dropped,
  };
}
