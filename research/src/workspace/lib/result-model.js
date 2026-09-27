// A ResultEnvelope turned into what the result view and the exports show [M1-DESIGN.md 10.2, 10.6,
// 14]. Numbers are formatted only here, from the envelope's full-precision values, through the
// formatter the stats role owns (stats/format.js, injected so this module stays testable). The order
// is estimate and CI first, p after. Pure. OWNER: workspace role.
import { valueKind } from './method-ui.js';
import { keyPart } from './keys.js';

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
  const want = designRow?.twoByTwoMeasures?.primary;
  if (want && names.includes(want)) return want;
  const withCi = names.find((n) => Array.isArray(env.values[n]?.ci));
  return withCi || names[0] || null;
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
export function valueLabel(name, t, methodId = null) {
  const keys = methodId ? [`ws.value.${keyPart(methodId)}.${name}`, `ws.value.${name}`] : [`ws.value.${name}`];
  for (const key of keys) {
    const s = t(key);
    if (s !== `[${key}]`) return s;
  }
  return name;
}

/**
 * Name of a test row: the dictionary's name for the test id ("Cochran-Mantel-Haenszel") with the
 * statistic's symbol beside it, so two X2 rows are never left unnamed.
 * @param {{ id: string, statistic?: { name?: string } }} test
 * @param {(k: string, p?: object) => string} t
 */
export function testLabel(test, t) {
  const stat = test?.statistic?.name || '';
  const key = `ws.test.${keyPart(test?.id || '')}`;
  const s = t(key);
  if (s === `[${key}]`) return stat || String(test?.id || '');
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
export function valueCells(row, fmt, lang, t) {
  if (row.value === null || row.value === undefined) {
    return { est: '—', ci: '', note: row.reasonKey ? t(row.reasonKey) : t('ws.result.undefinedNoReason') };
  }
  const est = fmt.formatNumber(row.value, { kind: fmtKind(row.kind) });
  const ci = row.ci ? fmt.formatCi({ value: row.value, ci: row.ci, kind: fmtKind(row.kind) }, lang) : '';
  return { est, ci: ci ? ci.replace(/^.*?\(/, '').replace(/\)$/, '') : '', note: '' };
}

/**
 * A plain table for Word, CSV and the screen reader summary: values first, then tests.
 * @returns {{ caption: string, columns: string[], rows: (string|number|null)[][], note: string }}
 */
export function exportTable(env, { t, fmt, lang, caption, note, primary = null }) {
  const cols = [t('ws.result.col.measure'), t('ws.result.col.estimate'), t('ws.result.col.ci', { level: ciLevelText(env) }), t('ws.result.col.note')];
  const rows = [];
  for (const r of valueRows(env, primary)) {
    const c = valueCells(r, fmt, lang, t);
    rows.push([valueLabel(r.name, t, env?.method?.id), c.est, c.ci, c.note]);
  }
  for (const test of env?.tests || []) {
    const stat = test.statistic?.value === null || test.statistic?.value === undefined ? '—' : fmt.formatNumber(test.statistic.value, { kind: 'statistic' });
    const df = test.df === null || test.df === undefined ? '' : ` ${t('ws.result.df', { df: fmt.formatNumber(test.df, { kind: 'statistic' }) })}`;
    const p = pText(fmt, test.p);
    rows.push([testLabel(test, t), `${stat}${df}`, p, test.p === null && test.reasonKey ? t(test.reasonKey) : '']);
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
