// Which charts a result shows under it, and what each chart is drawn from [M2-DESIGN.md 8.2, 10.2]. The
// chart kit's own reading of a result (charts/from-result.js chartOptions, graphs role) comes first; this
// module adds the charts of the M2 results that reading does not cover (pairwise differences after the
// lab tests, the model's odds or rate ratios, a two-factor experiment's cell means, the Q-Q points of a
// normality check), in the kit's own input shapes (charts/kinds-*.js JSDoc). Every number is taken from
// the envelope as it stands: a chart never computes an interval, a mean or a ratio here, and a result
// whose envelope lacks what a chart needs simply has no chart (the tables still show every number).
// Used by the result views, the saved-result page and the figure composer, so a figure panel is the
// chart the student saw under the result. Pure. OWNER: ui-analysis role.
import { chartOptions } from '../charts/from-result.js';
import { pairText, termText } from './term-words.js';
import { valueLabel } from './result-model.js';

/**
 * @typedef {{ id: string, kind: string, titleKey: string, input: any, needsRows: boolean }} ChartSpec
 */

const num = (x) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
/** A bound may be ±Infinity (an open interval, "no upper limit"); kept as it is, never replaced by a number. */
const bound = (x) => (typeof x === 'number' && !Number.isNaN(x) ? x : null);

/** The table with the first id that exists. */
export function findTable(env, ...ids) {
  const tables = env?.tables || [];
  for (const id of ids) {
    const tb = tables.find((x) => x.id === id);
    if (tb && Array.isArray(tb.rows) && Array.isArray(tb.columns)) return tb;
  }
  return null;
}

/**
 * Index of the first column name that exists, else -1. A method may name its columns by the dictionary
 * key that labels them ('models.col.or', 'ws.col.lower'): the last segment is the name, and case is
 * ignored ('models.col.or' is the OR column).
 */
export function colIndex(table, ...names) {
  const last = table.columns.map((c) => String(c).split('.').pop().toLowerCase());
  for (const n of names) {
    const i = table.columns.indexOf(n);
    if (i >= 0) return i;
    const j = last.indexOf(String(n).toLowerCase());
    if (j >= 0) return j;
  }
  return -1;
}

/** The interval level of a result (0.95 for a 95% interval). */
function levelOf(env) {
  return Object.values(env?.values || {}).find((v) => v?.ciLevel)?.ciLevel ?? env?.spec?.options?.confLevel ?? 0.95;
}

/** Pairwise differences with their intervals, for the kit's CI chart (reference line at 0). */
function pairsInput(table, xTitle, level, pairLabel = (x) => String(x)) {
  const pi = colIndex(table, 'pair', 'comparison');
  const di = colIndex(table, 'diff', 'estimate');
  const li = colIndex(table, 'lower', 'ciLow');
  const ui = colIndex(table, 'upper', 'ciHigh');
  if (pi < 0 || di < 0 || li < 0 || ui < 0) return null;
  return { rows: table.rows.map((r) => ({ label: pairLabel(r[pi]), est: num(r[di]), lo: bound(r[li]), hi: bound(r[ui]) })), ref: 0, log: false, xTitle, level };
}

/** Means with their intervals, one line per level of the first factor, across the second factor's levels. */
function cellMeansInput(table, { xTitle, yTitle, factorTitle, level, labelA = (x) => x, labelB = (x) => x }) {
  const bi = colIndex(table, 'levelB', 'b', 'factorB');
  const ai = colIndex(table, 'levelA', 'a', 'group');
  const ni = colIndex(table, 'n');
  const mi = colIndex(table, 'mean');
  const li = colIndex(table, 'lower', 'ciLow');
  const ui = colIndex(table, 'upper', 'ciHigh');
  if (ai < 0 || bi < 0 || mi < 0 || li < 0 || ui < 0) return null;
  const times = [];
  const labels = [];
  for (const r of table.rows) {
    if (!times.includes(String(r[bi]))) times.push(String(r[bi]));
    if (!labels.includes(String(r[ai]))) labels.push(String(r[ai]));
  }
  const series = labels.map((label) => ({
    label: labelA(label),
    points: table.rows.filter((r) => String(r[ai]) === label).map((r) => ({ time: times.indexOf(String(r[bi])), mean: num(r[mi]), lo: bound(r[li]), hi: bound(r[ui]), ...(ni >= 0 ? { n: num(r[ni]) } : {}) })),
  }));
  return { variant: 'cellMeans', times: times.map(labelB), series, xTitle, yTitle, factorTitle, level };
}

/** The ratios a regression table prints (the model's own OR or IRR column), intercept left out. */
function ratiosInput(table, measure, level, termLabel = (x) => String(x)) {
  const ti = colIndex(table, 'term');
  const ei = colIndex(table, 'ratio', 'OR', 'IRR');
  const li = colIndex(table, 'ratioLower');
  const ui = colIndex(table, 'ratioUpper');
  if (ti < 0 || ei < 0 || li < 0 || ui < 0) return null;
  const rows = table.rows.filter((r) => r[ti] !== '(Intercept)').map((r) => ({ label: termLabel(r[ti]), est: num(r[ei]), lo: bound(r[li]), hi: bound(r[ui]), kind: 'term' }));
  return rows.length ? { rows, measure, xTitle: measure, level, log: true } : null;
}

/** Without a dictionary (a test), pairs and terms read as plain text. */
function fallbackT(k, p = {}) {
  if (k === 'ws.term.pair') return `${p.a} - ${p.b}`;
  if (k === 'ws.term.level' || k === 'ws.term.levelVsRef') return `${p.column}: ${p.level}`;
  if (k === 'term.intercept') return '(Intercept)';
  return k;
}

/** Chart ids this module adds, with their own title words. */
const OWN_TITLES = Object.freeze({
  cellMeans: 'ws.chart.title.cellMeans', tukeyA: 'ws.chart.title.tukeyA', tukeyB: 'ws.chart.title.tukeyB', pairs: 'ws.chart.title.pairs',
  oddsRatios: 'ws.chart.title.oddsRatios', rateRatios: 'ws.chart.title.rateRatios', qq: 'ws.chart.title.qq',
});

/**
 * The charts this module adds for M2 results the kit's reading does not cover.
 * @param {any} env
 * @param {(key: string) => string} [labelOf]
 * @returns {ChartSpec[]}
 */
export function extraCharts(env, labelOf = (k) => k, levelName = (k, v) => v, t = null) {
  if (!env || env.status !== 'ok') return [];
  const method = env.method?.id || env.spec?.method || '';
  const roles = env.spec?.roles || {};
  const name = (k) => (k ? labelOf(k) : '');
  // Levels, pairs and model terms by the codebook's words (review round 1: "B-A", "c2=B" on the charts).
  const words = { t: t || fallbackT, spec: env.spec, env, columnName: labelOf, levelName };
  const pairOf = (key) => (x) => pairText(x, key, words);
  const lv = (key) => (x) => levelName(key, x);
  // A pairwise chart's axis is a difference of the outcome, not the outcome (review round 1).
  const diffTitle = (k) => (t ? t('ws.chart.diffOf', { outcome: name(k) }) : name(k));
  const level = levelOf(env);
  const out = [];
  const add = (id, kind, input) => { if (input) out.push({ id, kind, titleKey: OWN_TITLES[id], input, needsRows: false }); };
  switch (method) {
    case 'anova.twoWay': {
      const tb = findTable(env, 'cellMeans');
      if (tb) add('cellMeans', 'timeCourse', cellMeansInput(tb, { xTitle: name(roles.factorB), yTitle: name(roles.outcome), factorTitle: name(roles.group), level, labelA: lv(roles.group), labelB: lv(roles.factorB) }));
      for (const id of ['tukeyA', 'tukeyB']) {
        const t2 = findTable(env, id);
        if (t2) add(id, 'ci', pairsInput(t2, diffTitle(roles.outcome), level, pairOf(id === 'tukeyB' ? roles.factorB : roles.group)));
      }
      break;
    }
    case 'posthoc.gamesHowell':
    case 'posthoc.dunnett': {
      const tb = findTable(env, 'pairs');
      // Dunnett compares with the control group only: its own title, so a figure's list of charts never offers
      // two with the same name (review round 4).
      if (tb) {
        add('pairs', 'ci', pairsInput(tb, diffTitle(roles.outcome), level, pairOf(roles.group)));
        if (method === 'posthoc.dunnett' && out.length) out[out.length - 1].titleKey = 'ws.chart.title.pairsControl';
      }
      break;
    }
    case 'reg.logistic':
    case 'reg.poisson': {
      const tb = findTable(env, 'ratios', 'coefficients');
      if (tb) add(method === 'reg.logistic' ? 'oddsRatios' : 'rateRatios', 'forest', ratiosInput(tb, method === 'reg.logistic' ? 'OR' : 'IRR', level, (x) => termText(x, words)));
      break;
    }
    case 'diag.shapiro': {
      const tb = findTable(env, 'qq');
      if (tb) {
        const xi = colIndex(tb, 'theoretical');
        const yi = colIndex(tb, 'sample');
        if (xi >= 0 && yi >= 0) add('qq', 'scatter', { points: tb.rows.map((r) => ({ x: num(r[xi]), y: num(r[yi]) })), xTitle: '', yTitle: name(roles.outcome), line: false, level });
      }
      break;
    }
    default:
      break;
  }
  return out;
}

/**
 * Every chart a result shows, in order: the kit's reading of the result, then the extra M2 charts. A
 * chart of every animal needs the data now open; the kit leaves it out when the result was computed on
 * an earlier version of the data (`stale`).
 * @param {{ id?: string, spec?: any, envelope: any }} analysis
 * @param {any} table            the working table now open, or null
 * @param {{ labelOf?: (key: string) => string, stale?: boolean, t?: (k: string, p?: any) => string }} [ctx]
 * @returns {ChartSpec[]}
 */
export function chartsForResult(analysis, table, ctx = {}) {
  const env = analysis?.envelope;
  if (!env || env.status !== 'ok') return [];
  const labelOf = ctx.labelOf || ((k) => k);
  const levelOf = ctx.levelOf || ((k, v) => v);
  const words = { spec: env.spec || analysis.spec, env, columnName: labelOf, levelName: levelOf };
  const nameOf = ctx.t ? (nm) => valueLabel(nm, ctx.t, env.method?.id || env.spec?.method || null, words) : undefined;
  let kit = [];
  try {
    kit = chartOptions({ id: analysis.id, spec: analysis.spec || env.spec, envelope: env }, table, { labelOf, levelOf, nameOf, stale: Boolean(ctx.stale), t: ctx.t }) || [];
  } catch {
    kit = [];
  }
  const out = kit.map((c) => ({ id: c.id, kind: c.kind, titleKey: `ws.chart.title.${c.kind}`, input: c.input, needsRows: Boolean(c.needsRows) }));
  const base = analysis.id || env.method?.id || 'result';
  const extra = extraCharts(env, labelOf, levelOf, ctx.t || null).map((c) => ({ ...c, id: `${base}:${c.id}` }));
  // A two-way ANOVA is read from its cell means, and the report's figure is that chart (it needs no rows):
  // the screen leads with it too, not with a one-way dot plot that ignores the second factor (review round 4).
  const method = env.method?.id || env.spec?.method || '';
  if (method === 'anova.twoWay') return [...extra.filter((c) => c.id.endsWith(':cellMeans')), ...out, ...extra.filter((c) => !c.id.endsWith(':cellMeans'))];
  return [...out, ...extra];
}

/**
 * Whether a result's charts already draw the intervals the M1 CI plot would repeat (a model's ratios,
 * pairwise differences), so the result view leaves its CI plot out. Only the charts this module adds
 * count: an M1 result keeps its CI plot and the route comparison drawn on it.
 * @param {ChartSpec[]} charts
 */
export function repeatsCiPlot(charts) {
  const own = new Set(['oddsRatios', 'rateRatios', 'pairs', 'tukeyA', 'tukeyB']);
  return (charts || []).some((c) => own.has(String(c.id).split(':').pop()));
}
