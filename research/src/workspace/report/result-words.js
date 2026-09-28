// Words the result view shows beside the numbers [M1-DESIGN.md 10.5, 14, 17]: the options a result
// was computed with, named and valued from the dictionaries and limited to those that apply to it
// (review round 3: "two.sided", "wilson" and ["PR","POR","PD"] were printed as stored, and a test
// direction was listed under a prevalence); the captions and labels of the tables a method returns
// (a 2x2 table is labelled with its own columns and levels); the guardrail notices. Pure: `t` is
// passed in. OWNER: workspace role.
import { formatNumber, formatP } from '../../lib/stats/format.js';
import { METHOD_UI } from '../lib/method-ui.js';
import { keyPart } from '../lib/keys.js';
import { valueLabel, wordAreaOf } from '../lib/result-model.js';
import { cellText, termText } from '../lib/term-words.js';

const has = (t, key) => t(key) !== `[${key}]`;
/** The text of the first key the dictionary has, else null. */
const firstOf = (t, keys) => {
  const k = keys.find((x) => x && has(t, x));
  return k ? t(k) : null;
};

/** Options worked out from the codebook rather than chosen; the Table 1 blocks show them already. */
const DERIVED = new Set(['columnLevels', 'unitOfAnalysis']);
/** Each interval option and the values it is used for. */
const CI_FOR = { orCi: ['OR', 'POR'], rrCi: ['RR', 'PR'], rdCi: ['RD', 'PD'], lrCi: ['LRpos', 'LRneg'] };
/** Table 1 summary codes and their words. */
const SUMMARY_KEY = { 'median-iqr': 'ws.table1.stat.medianIqr', 'mean-sd': 'ws.table1.stat.meanSd', 'n-percent': 'ws.table1.stat.nPercent' };
/** Ratios Mantel-Haenszel reports, named as the result names them. */
const MH_RATIOS = ['PR', 'POR', 'OR', 'RR'];

const methodOf = (env) => env?.method?.id || env?.spec?.method || null;
const optionsOf = (env) => env?.provenance?.options || env?.spec?.options || {};

/**
 * Whether an option of this result changed its numbers, so the student should see it.
 * @param {string} name
 * @param {any} value
 * @param {any} env
 */
export function optionApplies(name, value, env) {
  if (value === undefined || value === null || DERIVED.has(name)) return false;
  const method = String(methodOf(env) || '');
  const ui = METHOD_UI[method] || {};
  const values = env?.values || {};
  const withCi = Object.values(values).some((v) => Array.isArray(v?.ci));
  switch (name) {
    case 'confLevel': return withCi || method.startsWith('ss.');
    // A direction exists only for a test that has one; a prevalence has no test at all.
    case 'alternative': return ui.alternative === true && (env?.tests || []).length > 0;
    case 'ciMethod':
    case 'apparentCiMethod':
      // The design-effect route widens a Wald interval whatever this option says, so it was not used.
      return withCi && !Object.values(values).some((v) => v?.ciMethod === 'wald-deff');
    case 'orCi':
    case 'rrCi':
    case 'rdCi':
    case 'lrCi':
      return CI_FOR[name].some((n) => Array.isArray(values[n]?.ci));
    case 'mu': return optionsOf(env).variant === 'one-sample';
    case 'fpc': return Number(env?.spec?.input?.params?.N) > 0;
    case 'posthoc': return (env?.tables || []).some((tb) => tb.id === 'posthoc');
    default: return true;
  }
}

/**
 * The words for one option value: the option's own word (ws.opt.<name>.<value>), else the shared
 * word for that value (runtime.optv.<value>), else a formatted number; null when there is nothing to say.
 */
function optionValueText(name, value, env, t, columnName, lang) {
  const k = keyPart(name);
  const method = methodOf(env);
  if (name === 'confLevel' && typeof value === 'number') return `${Math.round(value * 1000) / 10}%`;
  if (name === 'measures' && Array.isArray(value)) {
    // English reads the list as one phrase: the first word keeps its capital, the rest go lower case
    // (acronyms such as OR keep theirs).
    return value
      .map((v, i) => {
        const x = valueLabel(String(v), t, method);
        return lang === 'en' && i > 0 && /^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x;
      })
      .join(', ');
  }
  if (name === 'measure') {
    const shown = Object.keys(env?.values || {}).find((n) => MH_RATIOS.includes(n));
    if (shown) return valueLabel(shown, t, method);
  }
  if (name === 'summaries' && value && typeof value === 'object') {
    const parts = Object.entries(value).map(([key, code]) => `${columnName(key)}: ${firstOf(t, [SUMMARY_KEY[code]]) || code}`);
    return parts.length ? parts.join(', ') : null;
  }
  if ((name === 'se' || name === 'sp') && typeof value === 'number') return formatNumber(value, { kind: 'proportion' });
  if (typeof value === 'boolean') return firstOf(t, [`ws.opt.${k}.${value}`, `ws.opt.bool.${value}`]);
  if (typeof value === 'string' || typeof value === 'number') {
    const word = firstOf(t, [`ws.opt.${k}.${keyPart(value)}`, `runtime.optv.${keyPart(value)}`]);
    if (word) return word;
    return typeof value === 'number' ? formatNumber(value, { kind: 'statistic' }) : value;
  }
  return null;
}

/**
 * The options panel under a result: [{ name, label, text }] in the page language, only the options
 * that applied to this result, every value in words.
 * @param {any} env
 * @param {(key: string, params?: Object) => string} t
 * @param {{ columnName?: (key: string) => string, lang?: 'th'|'en' }} [ctx]
 */
export function optionItems(env, t, { columnName = (k) => k, lang = 'th' } = {}) {
  const method = String(methodOf(env) || '');
  const out = [];
  for (const [name, value] of Object.entries(optionsOf(env))) {
    if (!optionApplies(name, value, env)) continue;
    // A sample size has no interval: its confidence level is the plan's, not a CI's.
    const labelKeys = name === 'confLevel' && method.startsWith('ss.') ? ['ws.opt.confLevel.labelPlan'] : [`ws.opt.${keyPart(name)}.label`, `runtime.optName.${keyPart(name)}`];
    const label = firstOf(t, labelKeys);
    if (!label) continue;
    const text = optionValueText(name, value, env, t, columnName, lang);
    if (text === null || text === undefined || text === '') continue;
    out.push({ name, label, text });
  }
  return out;
}

/**
 * A guardrail finding: epi findings carry a title key and a body key; other findings (runtime notes)
 * carry one sentence in `key`.
 */
/**
 * A finding's parameters in the student's words: column keys by their labels, a separation finding's
 * cells as "Column: level" (review round 1: "c3=เมีย, c4=models.cell.sideLow" reached the screen).
 */
/** Numbers a finding carries in its sentence, printed through the formatter (review round 1: the
 * Dunnett error 2.605248285796423e-14 and the Huynh-Feldt epsilon 1.058414687576785 printed raw). */
const NUMBER_PARAMS = new Set(['epsHF', 'error', 'ratio', 'epv']);

const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
/** A very small number in a sentence as "2.6 × 10⁻¹⁴", never e-notation (review round 2: the Dunnett error). */
function tinyText(x) {
  if (!(Math.abs(x) > 0 && Math.abs(x) < 1e-4)) return null;
  const [m, e] = x.toExponential(1).split('e');
  const exp = String(Number(e)).split('').map((c) => SUP[c]).join('');
  return `${m.replace('-', '−')} × 10${exp}`;
}

function wordParams(params, t, words) {
  if (!params) return params;
  const out = { ...params };
  for (const k of NUMBER_PARAMS) if (typeof out[k] === 'number' && !Number.isInteger(out[k])) out[k] = tinyText(out[k]) ?? formatNumber(out[k], { kind: 'statistic' });
  // option ids a method settled from the data, by the option's own label
  if (Array.isArray(params.optionIds) && t) out.options = params.optionIds.map((id) => (has(t, `ws.opt.${id}.label`) ? t(`ws.opt.${id}.label`) : id)).join(', ');
  // the roles a column was chosen for, by the labels the analysis screen shows for this method
  if (Array.isArray(params.roleIds) && t) {
    const m = keyPart(words?.spec?.method || '');
    const roleName = (r) => { const k = [`ws.roleFor.${m}.${r}`, `ws.role.${r}`].find((x) => has(t, x)); return k ? t(k) : r; };
    [out.roleA, out.roleB] = params.roleIds.map(roleName);
  }
  if (!words) return out;
  const w = { t, ...words };
  const col = (k) => (words.columnName ? words.columnName(k) : k);
  if (Array.isArray(params.cells)) {
    out.levels = params.cells.map(([c, l]) => (l === null || l === undefined ? termText(c, w) : String(l).startsWith('models.cell.') ? t('ws.term.level', { column: col(c), level: t(l) }) : t('ws.term.level', { column: col(c), level: words.levelName ? words.levelName(c, l) : l }))).join(', ');
  }
  if (Array.isArray(params.columns) && params.columns.every((c) => typeof c === 'string')) out.columns = params.columns.map(col).join(', ');
  for (const k of ['column', 'cluster', 'exposure']) if (typeof params[k] === 'string') out[k] = col(params[k]);
  return out;
}

export function guardText(g, t, words = null) {
  if (g?.params) g = { ...g, params: wordParams(g.params, t, words) };
  // G25 names only the steps this sample size still misses (review round 2: the whole list was shown
  // right after the design effect had been applied).
  if (g.id === 'G25' && Array.isArray(g.params?.missing) && g.params.missing.length) {
    return { title: t(g.key, g.params), body: g.params.missing.map((m) => t(`epi.guard.G25.step.${m}`)).join(' ') };
  }
  if (g.bodyKey) return { title: t(g.key, g.params), body: t(g.bodyKey, g.params) };
  const titleKey = `epi.guard.${g.id}.title`;
  // An M2 area's own note keeps its own words: the epi title of the same id (G7 "no adjustment chosen")
  // does not fit a two-way ANOVA, which has no adjustment option (review round 1).
  const own = /^(lab|models|measure)\.note\./.test(String(g.key || ''));
  return { title: !own && g.key !== titleKey && has(t, titleKey) ? t(titleKey, g.params) : undefined, body: t(g.key, g.params) };
}
/**
 * A word a method table carries (a column name such as 'unrounded', a step id such as 'fpc', or a
 * dictionary key such as 'epi.ss.formula.base'): the dictionary's text when it has one, else the
 * word itself (level names and farm ids are data, shown as they are).
 */
export function tableWord(word, t, group, ctx = {}) {
  const s = String(word);
  if (has(t, s)) return t(s);
  const kp = keyPart(s);
  // An M2 method's area names its table columns (measure.table.items.itemRest, lab.col.levelA).
  const area = ctx.area || null;
  // The area's words come before the workspace's general ones, so an M1 word does not shadow them.
  const keys = [area && group === 'col' && ctx.tableId && `${area}.table.${keyPart(ctx.tableId)}.${kp}`, area && `${area}.${group}.${kp}`, `ws.${group}.${kp}`].filter(Boolean);
  const k = keys.find((x) => has(t, x));
  return k ? t(k) : s;
}

/** Tables whose dashes mean something else than a zero cell. */
const DASH_NOTE = Object.freeze({ anova: 'ws.table.dashNa', coefficients: 'ws.table.dashNa', lrTests: 'ws.table.dashNa', medians: 'ws.table.dashMedian', survival: 'ws.table.dashMedian', shapiro: 'ws.table.dashNa', qq: 'ws.table.dashNa' });

/** A 2x2 table of counts as twobytwo returns it. */
const isTwoByTwo = (table) => table?.id === 'counts' && Array.isArray(table.columns) && table.columns.join(',') === 'row,positive,negative,total';

/**
 * Labels for a 2x2 table of counts from the spec it was made from: the rows are the exposure's
 * levels, the columns the outcome's (review round 3: "row / positive / negative / exposed /
 * reference"). Null when the spec does not name them.
 */
function twoByTwoLabels({ spec = null, codebook = null, columnName = (k) => k, levelName = (k, v) => v } = {}, t) {
  const roles = spec?.roles || {};
  const lv = spec?.levels || {};
  if (!roles.exposure || !roles.outcome || lv.exposureLevel == null || lv.outcomePositive == null) return null;
  const outcomeLevels = (codebook?.columns?.find((c) => c.key === roles.outcome)?.levels || []).map((l) => l?.value).filter((v) => v !== undefined);
  const others = outcomeLevels.filter((v) => v !== lv.outcomePositive);
  const positive = levelName(roles.outcome, lv.outcomePositive);
  const negative = others.length === 1 ? levelName(roles.outcome, others[0]) : t('ws.col.notLevel', { level: positive });
  const exposed = levelName(roles.exposure, lv.exposureLevel);
  const reference = lv.referenceLevel != null ? levelName(roles.exposure, lv.referenceLevel) : t('ws.col.notLevel', { level: exposed });
  return {
    columns: [t('ws.col.twoByTwoCorner', { exposure: columnName(roles.exposure), outcome: columnName(roles.outcome) }), positive, negative, null],
    rows: { exposed, reference },
  };
}

/**
 * Text of a table the method returned: numbers through the stats formatter, words through the
 * dictionary, a 2x2 table labelled with its own columns and levels.
 * @param {{ id: string, columns: string[], rows: any[][] }} table
 * @param {(key: string, params?: Object) => string} t
 * @param {{ spec?: any, codebook?: any, columnName?: (key: string) => string, levelName?: (key: string, value: string) => string }} [ctx]
 */
export function envTableText(table, t, ctx = {}) {
  const labels = isTwoByTwo(table) ? twoByTwoLabels(ctx, t) : null;
  const area = wordAreaOf(ctx.spec?.method || null);
  // The two-way ANOVA's cell means head their level columns with the factors' own names, as the chart table
  // beside them does (review round 6: 'ระดับของปัจจัยแรก | ระดับของปัจจัยที่สอง' next to 'สูตรอาหาร | เพศ').
  const factorKey = (c) => (c === 'levelA' ? ctx.spec?.roles?.group : c === 'levelB' ? ctx.spec?.roles?.factorB : null);
  const columns = table.columns.map((c, i) => labels?.columns?.[i] ?? (factorKey(c) && ctx.columnName ? ctx.columnName(factorKey(c)) : null) ?? tableWord(c, t, 'col', { area, tableId: table.id }));
  // p-value columns print as p-values (< 0.001), not as small numbers (review round 1: 0.0000168, 3.83e-32).
  const pCol = table.columns.map((c) => /(^|\.)p(Adjusted|GG|HF|Holm|Raw)?$/.test(String(c)));
  const words = ctx.spec ? { t, ...ctx } : null;
  const rows = table.rows.map((row) => row.map((cell, ci) => {
    if (cell === null || cell === undefined) return '—';
    if (typeof cell === 'number' && pCol[ci] && Number.isFinite(cell)) return formatP(cell);
    if (typeof cell === 'number') return Number.isFinite(cell) ? formatNumber(cell, { kind: Number.isInteger(cell) ? 'count' : 'statistic' }) : cell > 0 ? t('ws.result.noUpper') : t('ws.result.noLower');
    if (ci === 0 && labels?.rows?.[cell] !== undefined) return labels.rows[cell];
    const named = words ? cellText(table.id, ci, cell, row, words) : undefined;
    if (named !== undefined) return named;
    return tableWord(cell, t, 'cell', { area, tableId: table.id });
  }));
  const capKey = [isTwoByTwo(table) ? 'ws.table.twoByTwo' : null, `ws.table.${keyPart(table.id)}`, area && `${area}.table.${keyPart(table.id)}.caption`].find((k) => k && has(t, k));
  // A dash in a cell is explained under the table, and the 2x2 cell letters are named (review round 1).
  const notes = [];
  if (['a', 'b', 'c', 'd'].every((c) => table.columns.includes(c))) notes.push(t('ws.table.abcdLegend'));
  // The sentence says why for this table (review round 1: "a cell is zero" under an ANOVA residual row and
  // under a median that was not reached).
  if (rows.some((row) => row.slice(1).includes('—'))) notes.push(t(DASH_NOTE[table.id] || 'ws.table.dashNote'));
  return { columns, rows, caption: capKey ? t(capKey) : table.id, notes };
}
