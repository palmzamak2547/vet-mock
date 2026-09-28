// A ResultEnvelope turned into what the result view and the exports show [M1-DESIGN.md 10.2, 10.6,
// 14]. Numbers are formatted only here, from the envelope's full-precision values, through the
// formatter the stats role owns (stats/format.js, injected so this module stays testable). The order
// is estimate and CI first, p after. Pure. OWNER: workspace role.
import { valueKind } from './method-ui.js';
import { keyPart } from './keys.js';
import { AREA_OF } from '../../lib/runtime/areas/index.js';
import { suffixText } from './term-words.js';

/**
 * The dictionary area a method's own words live in: an M2 method's area (lab, models, measure, plan's
 * words in tools) names its values, tests and table columns there [M2-DESIGN.md 9]. Null for M1 methods.
 * @param {string|null|undefined} methodId
 */
export function wordAreaOf(methodId) {
  const a = methodId ? AREA_OF[methodId] : null;
  return a === 'plan' ? 'tools' : a || null;
}

/**
 * @typedef {{ formatNumber: (x: number|null, o: { kind: string }) => string, formatP: (p: number|null) => string, formatCi: (v: any, lang: 'th'|'en') => string }} Fmt
 */

/** Rows for the values table, in envelope order; the primary value first when named. */
export function valueRows(env, primary = null) {
  const entries = Object.entries(env?.values || {});
  const rows = entries.map(([name, v]) => ({ name, kind: valueKind(name), ...v }));
  if (primary) rows.sort((a, b) => (a.name === primary ? -1 : b.name === primary ? 1 : 0));
  return rows;
}

/**
 * The value the result headline shows: the design's primary 2x2 measure when present, else the
 * first value with an interval, else the first value.
 */
export function primaryValueName(env, designRow = null) {
  const names = Object.keys(env?.values || {});
  const own = headlineOf(env);
  if (own) return own.value && names.includes(own.value) ? own.value : null;
  const want = designRow?.twoByTwoMeasures?.primary;
  if (want && names.includes(want)) return want;
  const withCi = names.find((n) => Array.isArray(env.values[n]?.ci));
  return withCi || names[0] || null;
}

/**
 * The headline of an M2 result whose first value would be a nuisance quantity (review round 1: two-way
 * ANOVA led with the residual sum of squares, repeated measures with epsilon, Dunnett with its critical
 * value): the effect size of the effect to read first and its test. A post hoc result has no single
 * answer: its headline is null and the pairwise table and the sentences carry the pairs.
 * @returns {{ value: string|null, test: string|null }|null} null when the method has no own headline
 */
export function headlineOf(env) {
  const id = env?.method?.id || env?.spec?.method || '';
  const v = env?.values || {};
  switch (id) {
    case 'anova.twoWay':
      return v.etaPartialAB ? { value: 'etaPartialAB', test: 'AB' } : { value: 'etaPartialA', test: 'A' };
    case 'anova.repeated':
      return v.etaPartialGroupTime ? { value: 'etaPartialGroupTime', test: 'groupTime' } : { value: 'etaPartialTime', test: 'time' };
    case 'posthoc.dunnett':
    case 'posthoc.gamesHowell':
    case 'posthoc.dunn':
      return { value: null, test: null };
    default:
      return null;
  }
}

/** The test the headline's p-value line reads: the method's own headline test, else the first test. */
export function primaryTest(env) {
  const tests = env?.tests || [];
  const own = headlineOf(env);
  if (own) return own.test ? tests.find((x) => x.id === own.test) || null : null;
  // A regression model: the likelihood-ratio test of the model when there is one; else (the farm-adjusted
  // robust route drops it) the test of the headline term, never the intercept's Wald test (review round 2:
  // "Wald test: intercept (t), p = 0.092" under the odds ratio for age).
  const mid = env?.method?.id || env?.spec?.method || '';
  // The p-value beside the headline OR/IRR is that term's own test; the whole-model LR test (p = 0.144 under
  // OR 3.11 whose own tests gave 0.027 and 0.032, review round 3) stays in the tests table.
  if (mid === 'reg.logistic' || mid === 'reg.poisson') {
    const head = primaryValueName(env);
    const term = head && head.includes(':') ? head.slice(head.indexOf(':') + 1) : null;
    const col = term && term.includes('=') ? term.slice(0, term.indexOf('=')) : term;
    const own = term ? tests.find((x) => x.id === `lr:${col}`) || tests.find((x) => x.id === `wald:${term}`) : null;
    if (own) return own;
    return tests[0]?.id === 'lrNull' ? tests[0] : null;
  }
  return tests[0] || null;
}

/** Values that can be drawn on the CI plot: an estimate or an interval exists, one scale (ratio or not). */
export function plottable(env, primary = null) {
  const rows = valueRows(env, primary).filter((r) => r.ci && Array.isArray(r.ci) && r.kind !== 'count');
  if (!rows.length) return { rows: [], log: false, ref: null };
  const first = rows[0].kind;
  const same = rows.filter((r) => (r.kind === 'ratio') === (first === 'ratio'));
  const log = first === 'ratio';
  const ref = log ? 1 : first === 'difference' ? 0 : null;
  return { rows: same, log, ref };
}

/**
 * Label of a value: the method's own name for it when the dictionary has one (a t-test's 'estimate'
 * is a difference in means, a correlation's is r), else the general name, else the value's own name.
 * @param {string} name
 * @param {(k: string) => string} t
 * @param {string|null} [methodId]
 */
export function valueLabel(name, t, methodId = null, words = null) {
  // 'median:Maintained' reads "Median (Maintained)", 'oddsRatio:age' "Odds ratio (age)": the part after
  // the colon is a level or a model term, named by the codebook when `words` (term-words.js) is given.
  const colon = String(name).indexOf(':');
  if (colon > 0) return t('ws.value.ofLevel', { value: valueLabel(String(name).slice(0, colon), t, methodId), level: suffixText(methodId, String(name).slice(colon + 1), words ? { t, ...words } : null) });
  // The epi area names the values its methods return (epi.value.nPooled); used when the workspace has no own word.
  // An M2 method's area names its own values (measure.value.relCronbach.k, lab.value.epsGG): the
  // method's own word comes first, then the area's general one, then the workspace's and epi's general
  // ones. The area comes before the general words so an M1 word does not shadow it (review round 1: a
  // logistic model's count of positive outcomes read "new cases" through ws.value.cases).
  const area = wordAreaOf(methodId);
  const keys = methodId
    ? [`ws.value.${keyPart(methodId)}.${name}`, area && `${area}.value.${keyPart(methodId)}.${name}`, area && `${area}.value.${name}`, `ws.value.${name}`, `epi.value.${name}`].filter(Boolean)
    : [`ws.value.${name}`, `epi.value.${name}`];
  const params = labelParams(methodId, t, words);
  for (const key of keys) {
    const s = t(key, params);
    if (s !== `[${key}]`) return s;
  }
  return name;
}

/** Words a value label names by the columns chosen: Bland-Altman's difference is "<method 1> minus
 * <method 2>" (review round 1: "A minus B" beside "method 1" and "rater 1" on one screen). */
/** What a power tool's n counts, from the method and the t-test type: per group, pairs, animals or the total. */
export function powerUnit(methodId, spec) {
  if (methodId === 'power.anova') return 'perGroup';
  if (methodId === 'power.tTest') {
    const type = spec?.options?.type ?? 'two-sample';
    return type === 'paired' ? 'pairs' : type === 'one-sample' ? 'animals' : 'perGroup';
  }
  return 'total';
}

function labelParams(methodId, t, words) {
  if (String(methodId).startsWith('power.')) return { unit: t(`lab.power.unit.${powerUnit(methodId, words?.spec || words?.env?.spec)}`) };
  if (methodId === 'roc.delong') {
    // each test by its column (review round 2: "the AUC of the second test")
    const roles = words?.spec?.roles || {};
    const name = (r) => (roles[r] && words?.columnName ? words.columnName(roles[r]) : t(`measure.word.${r}`));
    return { test: name('test'), test2: name('test2') };
  }
  if (methodId === 'anova.twoWay') {
    // the effects by the columns chosen (review round 2: "partial eta squared of the first factor")
    const roles = words?.spec?.roles || {};
    const name = (r, fallback) => (roles[r] && words?.columnName ? words.columnName(roles[r]) : t(fallback));
    return { a: name('group', 'lab.word.firstFactor'), b: name('factorB', 'lab.word.secondFactor') };
  }
  if (methodId !== 'agree.blandAltman') return undefined;
  const roles = words?.spec?.roles || {};
  const name = (r) => (roles[r] && words?.columnName ? words.columnName(roles[r]) : t(`ws.roleFor.agreeBlandAltman.${r}`));
  return { a: name('raterA'), b: name('raterB') };
}

/**
 * Name of a test row: the dictionary's name for the test id ("Cochran-Mantel-Haenszel") with the
 * statistic's symbol beside it, so two X2 rows are never left unnamed.
 * @param {{ id: string, statistic?: { name?: string } }} test
 * @param {(k: string, p?: object) => string} t
 */
/** Statistic symbols as a manuscript prints them (the engine names chi-square 'X2'). */
const STAT_SYMBOL = { X2: 'χ²', chisq: 'χ²', 'chi-squared': 'χ²' };

/**
 * Tests that are one effect of a model with several factors (two-way and repeated-measures ANOVA
 * [M2-DESIGN.md 3.1.1, 3.1.2]) are named by the columns the student chose, not by a letter.
 */
const EFFECT_ROLES = Object.freeze({
  'anova.twoWay': { A: ['group'], B: ['factorB'], AB: ['group', 'factorB'] },
  'anova.repeated': { time: ['time'], group: ['group'], groupTime: ['group', 'time'] },
});

/**
 * The column words of a model effect, or null when the test is not one.
 * @param {{ id: string }} test
 * @param {(k: string, p?: object) => string} t
 * @param {{ methodId?: string|null, roles?: Record<string, any>, columnName?: (key: string) => string }} [ctx]
 */
export function effectLabel(test, t, ctx = {}) {
  const roles = EFFECT_ROLES[ctx.methodId || '']?.[test?.id];
  if (!roles || !ctx.roles || !ctx.columnName) return null;
  const names = roles.map((r) => (ctx.roles[r] ? ctx.columnName(ctx.roles[r]) : null));
  if (names.some((n) => !n)) return null;
  return names.length === 1 ? t('ws.test.effect', { a: names[0] }) : t('ws.test.interaction', { a: names[0], b: names[1] });
}

export function testLabel(test, t, ctx = {}) {
  const raw = test?.statistic?.name || '';
  const stat = STAT_SYMBOL[raw] || raw;
  const effect = effectLabel(test, t, ctx);
  if (effect) return stat ? t('ws.result.testWithStat', { test: effect, stat }) : effect;
  // One test per model term ('wald:age'): the test's name with the term the model wrote.
  const colon = String(test?.id || '').indexOf(':');
  if (colon > 0) {
    const base = testLabel({ ...test, id: test.id.slice(0, colon), statistic: null }, t, {});
    const named = t('ws.test.ofTerm', { test: base, term: suffixText(ctx.methodId || null, test.id.slice(colon + 1), ctx.words ? { t, ...ctx.words } : null) });
    return stat ? t('ws.result.testWithStat', { test: named, stat }) : named;
  }
  const area = wordAreaOf(ctx.methodId);
  const keys = [`ws.test.${keyPart(test?.id || '')}`, area && `${area}.test.${keyPart(test?.id || '')}`].filter(Boolean);
  const key = keys.find((k) => t(k) !== `[${k}]`);
  if (!key) return stat || String(test?.id || '');
  const s = t(key);
  return stat ? t('ws.result.testWithStat', { test: s, stat }) : s;
}

/**
 * "p = 0.012" or "p < 0.001" (the formatter prints "< 0.001" below 0.001, so the equals sign is added
 * only when it would be true); "p —" when the p-value is withheld or undefined.
 * @param {Fmt} fmt
 * @param {number|null|undefined} p
 */
export function pText(fmt, p) {
  if (p === null || p === undefined) return 'p —';
  const s = fmt.formatP(p);
  return /^[<>≤≥]/.test(s) ? `p ${s}` : `p = ${s}`;
}

/** Values printed with a fixed number of decimals. */
const VALUE_DIGITS = Object.freeze({ icc: 4 });
/** Values that count animals and print as whole numbers. */
const WHOLE_VALUES = new Set(['nEff']);
/**
 * Parameters the student typed (controls per case, number of groups): a whole number prints whole,
 * "1" and not "1.00" (M1 review round 3, M2-DESIGN.md 12.5). Estimated ratios (OR, RR, PR) have their
 * own names and keep their decimals.
 */
const TYPED_WHOLE = new Set(['ratio', 'groups', 'iterations', 'dfResidual', 'nTotal']);

/** The kind the stats formatter expects for a value name. */
export function fmtKind(kind) {
  return kind === 'rate' ? 'statistic' : kind;
}

/**
 * Text cells of one value row: estimate, interval, the undefined sentence when null.
 * @param {any} row
 * @param {Fmt} fmt
 * @param {'th'|'en'} lang
 * @param {(k: string, p?: object) => string} t
 */
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** "2.61e-14" as "2.61 × 10⁻¹⁴": the formatter's exponent for a number below 1e-12, written as a reader
 * reads it (review round 2: the Dunnett integration error on screen and in the Word file). */
export function sciText(s) {
  const m = /^(-?[\d.]+)e([-+]?)(\d+)$/.exec(String(s));
  if (!m) return s;
  const exp = String(Number(m[3])).split('').map((d) => SUPS[Number(d)]).join('');
  return `${m[1].replace('-', '−')} × 10${m[2] === '-' ? '⁻' : ''}${exp}`;
}

export function valueCells(row, fmt, lang, t) {
  if (row.value === null || row.value === undefined) {
    return { est: '—', ci: '', note: row.reasonKey ? t(row.reasonKey) : t('ws.result.undefinedNoReason') };
  }
  // An ICC keeps four decimals everywhere it is printed, so the DEFF arithmetic shown beside it can be
  // checked by hand; an effective n is a number of animals and prints whole (review round 3: ICC 0.0506
  // beside 0.051 on one screen, effective n 428.02).
  const digits = VALUE_DIGITS[row.name];
  const shown = WHOLE_VALUES.has(row.name) && Number.isFinite(row.value) ? Math.round(row.value) : row.value;
  const sides = { below: row.below, above: row.above };
  const kind = TYPED_WHOLE.has(row.name) && Number.isInteger(row.value) ? 'count' : fmtKind(row.kind);
  const est = sciText(fmt.formatNumber(shown, { kind, ...sides, ...(digits === undefined ? {} : { digits }) }));
  const ci = row.ci ? fmt.formatCi({ value: row.value, ci: row.ci, kind: fmtKind(row.kind), ...sides }, lang) : '';
  // A defined value can still carry a sentence: a limit held at 0..1, a herd-level reading, a Wald
  // interval that misbehaves. Shown beside the number and in every export.
  const note = [row.noteKey, row.reasonKey].filter(Boolean).map((k) => t(k)).join(' ');
  return { est, ci: ci ? ci.replace(/^.*?\(/, '').replace(/\)$/, '') : '', note };
}

/**
 * A plain table for Word, CSV and the screen reader summary: values first, then tests.
 * @returns {{ caption: string, columns: string[], rows: (string|number|null)[][], note: string }}
 */
export function exportTable(env, { t, fmt, lang, caption, note, primary = null, columnName = null, words = null }) {
  const cols = [t('ws.result.col.measure'), t('ws.result.col.estimate'), t('ws.result.col.ci', { level: ciLevelText(env) }), t('ws.result.col.note')];
  const rows = [];
  for (const r of valueRows(env, primary)) {
    const c = valueCells(r, fmt, lang, t);
    rows.push([valueLabel(r.name, t, env?.method?.id, words), c.est, c.ci, c.note]);
  }
  for (const test of env?.tests || []) {
    const stat = test.statistic?.value === null || test.statistic?.value === undefined ? '—' : fmt.formatNumber(test.statistic.value, { kind: 'statistic' });
    const df = test.df === null || test.df === undefined ? '' : ` ${t('ws.result.df', { df: fmt.formatNumber(test.df, { kind: 'statistic' }) })}`;
    const p = pText(fmt, test.p);
    rows.push([testLabel(test, t, { methodId: env?.method?.id, roles: env?.spec?.roles, columnName, words }), `${stat}${df}`, p, test.p === null && test.reasonKey ? t(test.reasonKey) : '']);
  }
  return { caption: caption || '', columns: cols, rows, note: note || '' };
}

/** "95%" from the first interval's level, else from the spec's confLevel. */
export function ciLevelText(env) {
  const v = Object.values(env?.values || {}).find((x) => x?.ciLevel);
  const level = v?.ciLevel ?? env?.spec?.options?.confLevel ?? 0.95;
  return `${Math.round(level * 1000) / 10}%`;
}

/** Plain-text summary for the CI plot's aria-label: every row with its numbers. */
export function plotSummary(rows, fmt, lang, t, methodId = null) {
  return rows.map((r) => {
    if (r.value === null || r.value === undefined) return `${valueLabel(r.name, t, methodId)} —`;
    const est = fmt.formatNumber(r.value, { kind: fmtKind(r.kind) });
    const ci = fmt.formatCi({ value: r.value, ci: r.ci, kind: fmtKind(r.kind) }, lang);
    return `${valueLabel(r.name, t, methodId)} ${ci || est}`;
  }).join('; ');
}

/** Whether a saved analysis was computed on another version of the data than the one open now. */
export function isStale(analysis, currentFingerprint) {
  const fp = analysis?.dataFingerprint ?? analysis?.envelope?.provenance?.dataFingerprint ?? null;
  return Boolean(fp && currentFingerprint && fp !== currentFingerprint);
}
