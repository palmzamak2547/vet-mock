// Two-way ANOVA with interaction: Type III (sum-to-zero contrasts, as SPSS UNIANOVA and car::Anova type 3
// with contr.sum), Type II (each main effect after the other, R's drop1 of the additive model) or Type I
// (sequential, R's anova(lm)) sums of squares, for balanced and unbalanced cells [M2-DESIGN.md 3.1.1].
// OWNER: lab role.
//
// Every sum of squares is a difference of two residual sums of squares from the Householder QR fit in
// ols.js (never the normal equations): Type III drops one term's sum-to-zero columns from the full model
// (R: options(contrasts = c('contr.sum', 'contr.poly')); drop1(lm(y ~ A * B), . ~ ., test = 'F')), Type II
// compares A + B with each main effect alone and the full model with A + B, Type I adds the terms in the
// order A, B, A:B. With every cell the same size the three types agree. The interaction is fitted only
// when every cell has data: with an empty cell the Type III hypotheses are not the ones SPSS or R test,
// so the result says so and offers the model without the interaction.
//
// Partial eta squared = SS effect / (SS effect + SS residual) (Cohen 1973), from the same type of SS.
// Tukey HSD on a main effect (R TukeyHSD(aov(...), which)) uses the model's residual mean square and df
// and is offered only when every cell has the same n (with unequal cells the level means R compares are
// not the model's marginal means; lab.note.tukeyUnbalanced says so and no comparisons are printed).
import { pfUpper, ptukeyUpper, qtukey, qt } from './dist.js';
import { olsQr } from './ols.js';
import { mean, variance, val, nullVal, testRow, role, common, completeRows, column, numbersAt, invalid } from './common.js';

/** Sum-to-zero contrast columns of a factor with k levels, for one row's level index. */
function sumContrast(level, k) {
  const out = new Array(k - 1).fill(0);
  if (level === k - 1) out.fill(-1);
  else out[level] = 1;
  return out;
}

/** Residual sum of squares of y on the given column blocks (an intercept always included). */
function rssOf(y, blocks) {
  const n = y.length;
  const X = new Array(n);
  for (let i = 0; i < n; i++) {
    const row = [1];
    for (const b of blocks) for (const v of b[i]) row.push(v);
    X[i] = row;
  }
  const fit = olsQr(X, y);
  return { rss: fit.rss, rank: fit.rank };
}

/**
 * Pure core: SS, df, F and p for A, B and A:B from the cell layout.
 * @param {number[]} y
 * @param {number[]} a     factor A level index per row (0..ka-1, every level present)
 * @param {number[]} b     factor B level index per row (0..kb-1, every level present)
 * @param {{ ssType: 'III'|'II'|'I', interaction: boolean }} opts
 * @returns {{ effects: { id: 'A'|'B'|'AB', ss: number, df: number, ms: number, F: number|null, p: number|null, etaPartial: number|null }[], residual: { ss: number, df: number, ms: number }, balanced: boolean, emptyCells: number, cellN: number[][], reasonKey?: string }}
 */
export function anovaTwoWay(y, a, b, opts) {
  const ssType = opts?.ssType ?? 'III';
  const interaction = opts?.interaction !== false;
  const n = y.length;
  const ka = Math.max(-1, ...a) + 1;
  const kb = Math.max(-1, ...b) + 1;
  const cellN = Array.from({ length: ka }, () => new Array(kb).fill(0));
  for (let i = 0; i < n; i++) cellN[a[i]][b[i]] += 1;
  let emptyCells = 0;
  const sizes = new Set();
  for (const r of cellN) for (const c of r) { if (c === 0) emptyCells += 1; sizes.add(c); }
  const balanced = emptyCells === 0 && sizes.size === 1;
  const base = { cellN, balanced, emptyCells };
  if (ka < 2 || kb < 2) return { ...base, effects: [], residual: { ss: NaN, df: 0, ms: NaN }, reasonKey: 'lab.undefined.needTwoLevels' };
  if (interaction && emptyCells > 0) return { ...base, effects: [], residual: { ss: NaN, df: 0, ms: NaN }, reasonKey: 'lab.undefined.emptyCell' };

  const A = a.map((l) => sumContrast(l, ka));
  const B = b.map((l) => sumContrast(l, kb));
  const AB = A.map((ra, i) => { const out = []; for (const u of ra) for (const w of B[i]) out.push(u * w); return out; });
  const dfA = ka - 1;
  const dfB = kb - 1;
  const dfAB = dfA * dfB;
  const full = interaction ? rssOf(y, [A, B, AB]) : rssOf(y, [A, B]);
  const dfRes = n - full.rank;
  const add = interaction ? rssOf(y, [A, B]) : full;
  let ssA;
  let ssB;
  let ssAB = interaction ? add.rss - full.rss : null;
  if (ssType === 'III') {
    const noA = interaction ? rssOf(y, [B, AB]) : rssOf(y, [B]);
    const noB = interaction ? rssOf(y, [A, AB]) : rssOf(y, [A]);
    ssA = noA.rss - full.rss;
    ssB = noB.rss - full.rss;
  } else if (ssType === 'II') {
    ssA = rssOf(y, [B]).rss - add.rss;
    ssB = rssOf(y, [A]).rss - add.rss;
  } else {
    const tss = rssOf(y, []).rss;
    const onlyA = rssOf(y, [A]).rss;
    ssA = tss - onlyA;
    ssB = onlyA - add.rss;
  }
  const rss = full.rss;
  const ms = dfRes > 0 ? rss / dfRes : NaN;
  const residual = { ss: rss, df: dfRes, ms };
  const eff = (id, ss, df) => {
    const clamped = Math.max(0, ss);
    const msE = clamped / df;
    const ok = dfRes > 0 && ms > 0;
    const F = ok ? msE / ms : null;
    const p = ok ? pfUpper(F, df, dfRes) : null;
    const etaPartial = clamped + rss > 0 ? clamped / (clamped + rss) : null;
    return { id, ss: clamped, df, ms: msE, F, p, etaPartial };
  };
  const effects = [eff('A', ssA, dfA), eff('B', ssB, dfB)];
  if (interaction) effects.push(eff('AB', ssAB, dfAB));
  let reasonKey;
  if (!(dfRes > 0)) reasonKey = 'stats.undefined.noResidualDf';
  else if (!(ms > 0)) reasonKey = 'stats.undefined.zeroVariance';
  return { ...base, effects, residual, ...(reasonKey ? { reasonKey } : {}) };
}

function pairsOrder(k) {
  const out = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) out.push([j, i]);
  return out;
}

/**
 * Tukey HSD on one factor's level means with the model's residual mean square (R TukeyHSD on an aov fit).
 * @param {number[]} means @param {number[]} ns @param {string[]} labels
 * @param {number} mse @param {number} df @param {number} confLevel
 */
export function tukeyOnFactor(means, ns, labels, mse, df, confLevel = 0.95) {
  const k = means.length;
  const q = df >= 2 ? qtukey(confLevel, k, df) : NaN;
  const ok = (x) => (Number.isNaN(x) ? null : x);
  return pairsOrder(k).map(([j, i]) => {
    const center = means[j] - means[i];
    const s = Math.sqrt((mse / 2) * (1 / ns[j] + 1 / ns[i]));
    const p = df >= 2 && s > 0 ? ptukeyUpper(Math.abs(center) / s, k, df) : NaN;
    return { pair: `${labels[j]}-${labels[i]}`, diff: center, lower: ok(center - q * s), upper: ok(center + q * s), p: ok(p) };
  });
}

/** Level indexes renumbered to the levels present, in codebook order. */
function presentLevels(col, rows) {
  const levels = col.levels || [];
  const seen = new Array(levels.length).fill(false);
  for (const i of rows) seen[col.values[i]] = true;
  const map = new Array(levels.length).fill(-1);
  const labels = [];
  levels.forEach((l, j) => { if (seen[j]) { map[j] = labels.length; labels.push(l); } });
  return { labels, index: rows.map((i) => map[col.values[i]]) };
}

function needCategory(table, key) {
  const c = column(table, key);
  if (c.kind !== 'category') throw Object.assign(new Error(`stats: ${key} is not a category column`), { key: 'stats.error.needsCategory', detail: key });
  return c;
}

/** Mean, SD and t interval of one set of values; SD and interval null below 2 values. */
function describe(x, confLevel) {
  const m = x.length ? mean(x) : null;
  if (x.length < 2) return { n: x.length, mean: m, sd: null, lower: null, upper: null };
  const sd = Math.sqrt(variance(x));
  const h = qt(1 - (1 - confLevel) / 2, x.length - 1) * sd / Math.sqrt(x.length);
  return { n: x.length, mean: m, sd, lower: m - h, upper: m + h };
}

/**
 * roles outcome, group (factor A), factorB; options ssType, interaction, posthoc ('tukey' only when every cell has the same n).
 * Tests: one row per effect (A, B, A:B) with F, dfPair, p; values partial eta squared per effect; tables anova, cellMeans, marginalMeans, tukeyA, tukeyB.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runAnovaTwoWay(spec, table) {
  const yKey = role(spec, 'outcome');
  const aKey = role(spec, 'group');
  const bKey = role(spec, 'factorB');
  if (!yKey || !aKey || !bKey) return invalid('stats.error.missingRole');
  const o = spec.options || {};
  const ssType = o.ssType ?? 'III';
  const interaction = o.interaction !== false;
  const posthoc = o.posthoc ?? 'none';
  const { confLevel } = common(spec);
  const ca = needCategory(table, aKey);
  const cb = needCategory(table, bKey);
  const { rows, dropped } = completeRows(table, [yKey, aKey, bKey]);
  const y = numbersAt(table, yKey, rows);
  const A = presentLevels(ca, rows);
  const B = presentLevels(cb, rows);
  const r = anovaTwoWay(y, A.index, B.index, { ssType, interaction });

  const warnings = [];
  const notes = [];
  // G21: the same animal measured more than once is a repeated-measures layout, not two independent factors.
  const sKey = role(spec, 'subject');
  if (sKey) {
    const sc = column(table, sKey);
    const seen = new Set();
    let repeats = false;
    for (const i of rows) { const v = sc.values[i]; if (seen.has(v)) { repeats = true; break; } seen.add(v); }
    if (repeats) warnings.push({ id: 'G21', severity: 'warn', key: 'lab.guard.G21.title', bodyKey: 'lab.guard.G21.body', params: { subject: sKey }, routes: ['anova.repeated'] });
  }

  // Cell and marginal means (descriptive: printed even when the model cannot be fitted).
  const cells = A.labels.map(() => B.labels.map(() => []));
  y.forEach((v, i) => { cells[A.index[i]][B.index[i]].push(v); });
  const cellRows = [];
  A.labels.forEach((la, i) => B.labels.forEach((lb, j) => {
    const d = describe(cells[i][j], confLevel);
    cellRows.push([la, lb, d.n, d.mean, d.sd, d.lower, d.upper]);
  }));
  const cellMeanOf = (i, j) => (cells[i][j].length ? mean(cells[i][j]) : null);
  const margRows = [];
  const levelNs = { A: [], B: [] };
  const levelMeans = { A: [], B: [] };
  A.labels.forEach((la, i) => {
    const vals = y.filter((_, k) => A.index[k] === i);
    const cm = B.labels.map((_, j) => cellMeanOf(i, j));
    const em = cm.every((v) => v !== null) ? mean(cm) : null;
    levelNs.A.push(vals.length); levelMeans.A.push(mean(vals));
    margRows.push(['A', la, vals.length, mean(vals), em]);
  });
  B.labels.forEach((lb, j) => {
    const vals = y.filter((_, k) => B.index[k] === j);
    const cm = A.labels.map((_, i) => cellMeanOf(i, j));
    const em = cm.every((v) => v !== null) ? mean(cm) : null;
    levelNs.B.push(vals.length); levelMeans.B.push(mean(vals));
    margRows.push(['B', lb, vals.length, mean(vals), em]);
  });
  const tables = [
    { id: 'cellMeans', columns: ['levelA', 'levelB', 'n', 'mean', 'sd', 'lower', 'upper'], rows: cellRows },
    { id: 'marginalMeans', columns: ['factor', 'level', 'n', 'mean', 'emmean'], rows: margRows },
  ];
  if (r.reasonKey && !r.effects.length) {
    return { status: 'invalid', values: { reason: nullVal(r.reasonKey) }, tests: [], tables, used: rows.length, dropped, warnings, notes };
  }

  const names = { A: 'A', B: 'B', AB: 'A:B' };
  tables.unshift({
    id: 'anova',
    columns: ['source', 'df', 'ss', 'ms', 'F', 'p', 'etaPartial'],
    rows: [
      ...r.effects.map((e) => [names[e.id], e.df, e.ss, e.ms, e.F, e.p, e.etaPartial]),
      ['residual', r.residual.df, r.residual.ss, Number.isNaN(r.residual.ms) ? null : r.residual.ms, null, null, null],
    ],
  });
  const values = { ssResidual: val(r.residual.ss), dfResidual: val(r.residual.df), msResidual: Number.isNaN(r.residual.ms) ? nullVal('stats.undefined.noResidualDf') : val(r.residual.ms) };
  for (const e of r.effects) values[`etaPartial${e.id}`] = e.etaPartial === null ? nullVal('stats.undefined.zeroVariance') : val(e.etaPartial);
  const tests = r.effects.map((e) => testRow({ id: e.id, name: 'F', statistic: e.F, df: null, dfPair: [e.df, r.residual.df], p: e.p, variant: `type${ssType}`, reasonKey: r.reasonKey }));

  if (posthoc === 'tukey') {
    if (!r.balanced) notes.push({ id: 'posthoc', severity: 'note', key: 'lab.note.tukeyUnbalanced' });
    else if (!r.reasonKey) {
      const tk = (f, labels) => tukeyOnFactor(levelMeans[f], levelNs[f], labels, r.residual.ms, r.residual.df, confLevel);
      tables.push({ id: 'tukeyA', columns: ['pair', 'diff', 'lower', 'upper', 'pAdjusted'], rows: tk('A', A.labels).map((x) => [x.pair, x.diff, x.lower, x.upper, x.p]) });
      tables.push({ id: 'tukeyB', columns: ['pair', 'diff', 'lower', 'upper', 'pAdjusted'], rows: tk('B', B.labels).map((x) => [x.pair, x.diff, x.lower, x.upper, x.p]) });
    }
  }
  // G7: three F tests in one table; the note says each is read on its own and the interaction first.
  if (interaction) notes.push({ id: 'G7', severity: 'note', key: 'lab.note.twoWayFamily', params: { tests: 3 } });
  if (!r.balanced) notes.push({ id: 'ssType', severity: 'note', key: `lab.note.unbalanced${ssType}` });
  return { status: r.reasonKey ? 'invalid' : 'ok', values, tests, tables, used: rows.length, dropped, warnings, notes };
}
