// The methods and results draft [M1-DESIGN.md 17; workspace board "Report"]. Written from the saved
// analyses (their envelopes) and the recipe steps, never from typed numbers: every figure in a
// paragraph comes from an envelope value through the stats formatter. Thai and English are built from
// the report dictionary with the same facts. When the data changed after an analysis was saved, the
// draft keeps the old numbers and lists that analysis as not current, instead of recomputing silently.
// Pure: `t` and `fmt` are passed in. OWNER: workspace role.
import { fmtKind, isStale, pText, primaryValueName, testLabel, valueRows } from '../lib/result-model.js';
import { keyPart } from '../lib/keys.js';

/**
 * @typedef {{ formatNumber: Function, formatP: Function, formatCi: Function }} Fmt
 * @typedef {(key: string, params?: Object) => string} T
 */

const has = (t, key) => t(key) !== `[${key}]`;

/** Punctuation differs by language: Thai lists with a space and ends a sentence without a full stop. */
const PUNCT = { th: { sep: ' ', end: '' }, en: { sep: ', ', end: '.' } };
const punct = (lang) => PUNCT[lang] || PUNCT.en;

/** Method name from the catalogue key, or the id when the dictionary has no name yet. */
function methodName(t, nameKey, id) {
  return nameKey && has(t, nameKey) ? t(nameKey) : id;
}

/** "95%" from a spec. */
const levelText = (spec) => `${Math.round((spec?.options?.confLevel ?? 0.95) * 1000) / 10}%`;

/** Methods that describe a sample and give no interval or p-value (Table 1 and the descriptives). */
const describes = (methodId) => /^desc\./.test(String(methodId || ''));

/** The public version of the engine: 'research-studio-m1-0.1.0' is printed as '0.1.0'. */
export function publicVersion(engine) {
  return String(engine || '').replace(/^research-studio-m\d+-/, '');
}

/** Sentences ending as the language writes them, joined into one paragraph. */
function sentences(list, lang) {
  const { end } = punct(lang);
  return list.filter(Boolean).map((x) => x.replace(/[.\s]+$/, '') + end).join(' ');
}

/** A reason sentence placed inside brackets loses its own full stop. */
const inBrackets = (text) => String(text || '').replace(/[.\s]+$/, '');

/**
 * The methods sentences for one saved analysis, each a full sentence ending as the language does.
 * @param {any} analysis saved analysis { spec, envelope }
 * @param {{ t: T, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, columnName: (key: string) => string }} ctx
 */
export function methodsSentence(analysis, ctx) {
  const { t } = ctx;
  const env = analysis.envelope;
  const spec = env?.spec || analysis.spec;
  const name = methodName(t, ctx.nameKeyOf(spec.method), spec.method);
  const route = spec.cluster?.route;
  const clusterColumn = spec.cluster?.column || null;
  // Comparing within farms names the farm column in its own sentence; it is not listed again as strata.
  const roleEntries = Object.entries(spec.roles || {})
    .filter(([, v]) => v && (!Array.isArray(v) || v.length))
    .filter(([role, v]) => !(route === 'mh-within' && role === 'strata' && [].concat(v).every((k) => k === clusterColumn)));
  const roleName = (role) => {
    if (role === 'covariates' && describes(spec.method)) return t('report.role.described');
    return has(t, `report.role.${role}`) ? t(`report.role.${role}`) : t(`ws.role.${role}`);
  };
  const roles = roleEntries.map(([role, v]) => t('report.methods.role', { role: roleName(role), column: (Array.isArray(v) ? v : [v]).map(ctx.columnName).join(punct(ctx.lang).sep) }));
  // Table 1 and the summaries are described in their own words: the method's display label is not a
  // noun that fits a sentence (review round 2: "Table 1: who is in the sample was used to describe").
  const summaries = Object.values(spec.options?.summaries || {});
  const lead = spec.method === 'desc.table1'
    ? t(summaries.includes('mean-sd') ? 'report.methods.table1MeanSd' : 'report.methods.table1')
    : describes(spec.method) ? t('report.methods.summary')
      // A method that reports no interval (a chi-square test) is not said to report one.
      : t(env && !Object.values(env.values || {}).some((v) => Array.isArray(v?.ci)) ? 'report.methods.analysisNoCi' : 'report.methods.analysis', { method: name, level: levelText(spec) });
  const out = [lead];
  if (roles.length) out.push(t('report.methods.roles', { roles: roles.join(punct(ctx.lang).sep) }));
  // The Mantel-Haenszel name is said once: by the method when the method is Mantel-Haenszel, else here.
  const routeKey = route === 'mh-within' && spec.method !== 'epi.mantelHaenszel' ? 'report.methods.route.mhWithinNamed' : `report.methods.route.${keyPart(route || '')}`;
  const drops = env?.provenance?.rowsDropped || [];
  const sum = (pred) => drops.filter(pred).reduce((a, d) => a + (d.count || 0), 0);
  // Rows merged into farm rows by the aggregate route were summarised, not left out (review round 2:
  // "679 rows with missing values were left out" for the 728 animals analysed as 49 farms).
  const aggregated = sum((d) => d.reason === 'aggregated');
  const removed = sum((d) => d.reason === 'excluded' || d.reason === 'filter');
  const missing = sum((d) => d.reason !== 'aggregated' && d.reason !== 'excluded' && d.reason !== 'filter');
  const column = clusterColumn ? ctx.columnName(clusterColumn) : '';
  if (route === 'aggregate' && aggregated > 0) {
    const used = env?.provenance?.rowsUsed ?? 0;
    out.push(t('report.methods.route.aggregateCounts', { animals: used + aggregated, farms: used, column }));
    if (spec.levels?.outcomePositive != null && spec.roles?.outcome) out.push(t('report.methods.aggregatePositive'));
  } else if (route && route !== 'none' && has(t, routeKey)) out.push(t(routeKey, { column }));
  if (removed > 0) out.push(t('report.methods.removed', { n: removed }));
  if (missing === 1) out.push(t('report.methods.droppedOne'));
  else if (missing > 1) out.push(t('report.methods.dropped', { n: missing }));
  return sentences(out, ctx.lang);
}

/** Values that compare an exposed with a reference group. */
const COMPARISON = new Set(['PR', 'POR', 'OR', 'RR', 'RD', 'PD', 'IRR', 'IRD']);
/** Values that are a share of the outcome, written "the prevalence of <outcome> <level>". */
const OUTCOME_SHARE = new Set(['prevalence', 'apparent', 'truePrevalence', 'risk']);

/** A test's name inside a sentence ("the chi-square test"), falling back to its table label. */
function testName(test, t) {
  const key = `report.test.${keyPart(test?.id || '')}`;
  if (has(t, key)) return t(key);
  const k2 = `ws.test.${keyPart(test?.id || '')}`;
  return has(t, k2) ? t(k2) : String(test?.id || '');
}

const STAT_SYMBOL = { X2: 'χ²', chisq: 'χ²' };

/** "χ² = 0.358, df = 1, p = 0.550": statistic, degrees of freedom and p, from the envelope. */
function statsText(test, fmt) {
  const out = [];
  const st = test?.statistic;
  if (st && typeof st.value === 'number' && Number.isFinite(st.value)) {
    out.push(`${STAT_SYMBOL[st.name] || st.name} = ${fmt.formatNumber(st.value, { kind: 'statistic' })}`);
  }
  const df = test?.df;
  if (Array.isArray(df)) out.push(`df = ${df.map((d) => (Number.isInteger(d) ? String(d) : fmt.formatNumber(d, { kind: 'statistic' }))).join(', ')}`);
  else if (typeof df === 'number' && Number.isFinite(df)) out.push(`df = ${Number.isInteger(df) ? String(df) : fmt.formatNumber(df, { kind: 'statistic' })}`);
  out.push(pText(fmt, test?.p));
  return out.join(', ');
}

/** English starts a sentence with a capital. */
const cap = (lang, s) => (lang === 'en' && s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * The results sentences for one kept analysis, written to paste into a report: the estimate with
 * its interval (naming the groups compared when the spec names them), then each test with its
 * statistic, df and p, then a sentence when strata disagree. Every number is an envelope number.
 * @param {any} analysis
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, designRow?: any, valueLabel: (name: string) => string, columnName?: (key: string) => string }} ctx
 */
export function resultsSentence(analysis, ctx) {
  const { t, fmt, lang } = ctx;
  const env = analysis.envelope;
  if (!env) return '';
  const spec = env.spec || analysis.spec;
  const name = methodName(t, ctx.nameKeyOf(spec.method), spec.method);
  if (env.status === 'stopped') return sentences([t('report.results.stopped', { method: name })], lang);
  // A descriptive table is its own result; the sentence points to it without the method's label.
  if (spec.method === 'desc.table1') return sentences([t('report.results.table1')], lang);
  if (describes(spec.method)) return sentences([t('report.results.summary')], lang);
  const columnName = ctx.columnName || ((k) => k);
  const primary = primaryValueName(env, ctx.designRow);
  // English puts a label mid-sentence in lower case ("the prevalence ratio (PR)"), acronyms kept.
  const label = (n) => {
    const x = ctx.valueLabel(n);
    return lang === 'en' && /^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x;
  };
  const valueText = (r) => {
    const value = fmt.formatNumber(r.value, { kind: fmtKind(r.kind) });
    if (!r.ci) return value;
    const full = fmt.formatCi({ value: r.value, ci: r.ci, kind: fmtKind(r.kind) }, lang);
    const bounds = full.includes('(') ? full.replace(/^.*?\(/, '').replace(/\)$/, '') : full;
    return t('report.results.valueCi', { value, bounds, level: levelText(spec) });
  };
  const lv = spec.levels || {};
  const roles = spec.roles || {};
  const strata = [].concat(roles.strata || []).filter(Boolean);
  const out = [];
  const rows = valueRows(env, primary);
  const sentenceFor = (r) => {
    if (r.value === null || r.value === undefined) {
      return t('report.results.undefined', { label: cap(lang, label(r.name)), reason: inBrackets(r.reasonKey ? t(r.reasonKey) : t('ws.result.undefinedNoReason')) });
    }
    const v = valueText(r);
    if (COMPARISON.has(r.name) && roles.exposure && lv.exposureLevel != null && lv.referenceLevel != null) {
      const params = { exposure: columnName(roles.exposure), exposed: lv.exposureLevel, reference: lv.referenceLevel, measure: label(r.name), value: v };
      if (strata.length) return t('report.results.compareAdjusted', { ...params, strata: strata.map(columnName).join(punct(lang).sep) });
      return t('report.results.compare', params);
    }
    if (r.name === primary && OUTCOME_SHARE.has(r.name) && roles.outcome && lv.outcomePositive != null) {
      return t('report.results.ofOutcome', { label: label(r.name), outcome: columnName(roles.outcome), positive: lv.outcomePositive, value: v });
    }
    return t('report.results.estimate', { label: label(r.name), value: v });
  };
  // The primary value is written when it is an estimate (an interval, a comparison, a share of the
  // outcome); a check value such as the smallest expected count stays in the table beside a test.
  const primaryRow = rows.find((r) => r.name === primary);
  const tests = env.tests || [];
  if (primaryRow && (Array.isArray(primaryRow.ci) || COMPARISON.has(primaryRow.name) || OUTCOME_SHARE.has(primaryRow.name) || !tests.length)) out.push(sentenceFor(primaryRow));
  // Other estimates with an interval (a PD beside the PR), or a comparison that could not be computed.
  const others = rows.filter((r) => r.name !== primary && r.kind !== 'count' && (Array.isArray(r.ci) || (COMPARISON.has(r.name) && r.value == null)));
  for (const r of others.slice(0, 3)) out.push(sentenceFor(r));
  for (const test of tests.filter((x) => x.id !== 'homogeneity').slice(0, 2)) {
    if (test.p === null || test.p === undefined) out.push(t('report.results.pWithheld', { test: testName(test, t) }));
    else out.push(cap(lang, t('report.results.test', { test: testName(test, t), stats: statsText(test, fmt) })));
  }
  const hom = tests.find((x) => x.id === 'homogeneity');
  if (hom && typeof hom.p === 'number') {
    const which = has(t, `report.homogeneity.${keyPart(hom.variant || '')}`) ? t(`report.homogeneity.${keyPart(hom.variant || '')}`) : t('report.homogeneity.generic');
    out.push(t(hom.p < 0.05 ? 'report.results.strataDiffer' : 'report.results.strataTest', { test: which, stats: statsText(hom, fmt) }));
  }
  if (!out.length) return sentences([t('report.results.tableOnly', { method: name })], lang);
  return sentences(out, lang);
}

/**
 * The whole draft for one language.
 * @param {{ analyses: any[], steps: any[], project: any, table: any, codebook: any }} data
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, designNameKey: string|null, describeStep: (s: any, t: T, names?: Record<string, string>) => string, designRow?: any }} ctx
 * @returns {{ methods: string, results: string, stale: string[], used: string[] }}
 */
export function buildDraft(data, ctx) {
  const { t } = ctx;
  const columnName = (key) => {
    const c = data.codebook?.columns?.find((x) => x.key === key);
    if (!c) return key;
    return (ctx.lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name) || key;
  };
  const valueLabelFor = (methodId) => (name) => {
    for (const key of [`ws.value.${keyPart(methodId || '')}.${name}`, `ws.value.${name}`]) if (has(t, key)) return t(key);
    return name;
  };
  const fp = data.table?.fingerprint || null;
  const kept = (data.analyses || []).filter((a) => a.envelope);
  const stale = kept.filter((a) => isStale(a, fp)).map((a) => a.id);
  const methods = [];
  if (ctx.designNameKey && has(t, ctx.designNameKey)) {
    // English writes the design mid-sentence in lower case ("was cross-sectional"), acronyms kept.
    const d = t(ctx.designNameKey);
    methods.push(t('report.methods.design', { design: ctx.lang === 'en' && /^[A-Z][a-z]/.test(d) ? d[0].toLowerCase() + d.slice(1) : d }));
  }
  const cluster = data.codebook?.clusterKey;
  if (cluster) methods.push(t('report.methods.cluster', { column: columnName(cluster) }));
  const names = Object.fromEntries((data.codebook?.columns || []).map((c) => [c.key, columnName(c.key)]));
  // What the import converted, confirmed by the student (review round 2: the steps page promises every
  // step is in the draft, and the import was left out). A column counts when a date was read with its
  // era, a missing-value code was set, or a cell was fixed.
  const imp = (data.steps || []).find((s) => s.kind === 'import-conversions');
  const converted = Object.values(imp?.params?.perColumn || {}).filter((c) => c && (c.dates || (c.missingCodes || []).length || (c.cellFixes || []).length)).length;
  if (converted) methods.push(t('report.methods.importConverted', { count: converted }));
  const edits = (data.steps || []).filter((s) => s.kind !== 'import-conversions');
  if (edits.length) {
    const lines = [];
    for (const s of edits) {
      try {
        const line = ctx.describeStep(s, t, names);
        if (line) lines.push(line);
      } catch {
        /* a step the describer cannot name is left out of the sentence, never invented */
      }
    }
    if (lines.length) methods.push(t('report.methods.steps', { steps: lines.join(punct(ctx.lang).sep) }));
  }
  const sctx = { t, lang: ctx.lang, nameKeyOf: ctx.nameKeyOf, columnName };
  // Two kept results of the same analysis (an earlier and a current run) describe the method once.
  for (const a of kept) {
    const m = methodsSentence(a, sctx);
    if (!methods.includes(m)) methods.push(m);
  }
  const engine = kept[0]?.envelope?.provenance?.engineVersion;
  if (engine) methods.push(t('report.methods.software', { engine: publicVersion(engine) }));
  const results = kept.map((a) => resultsSentence(a, { t, fmt: ctx.fmt, lang: ctx.lang, nameKeyOf: ctx.nameKeyOf, designRow: ctx.designRow, columnName, valueLabel: valueLabelFor((a.envelope?.spec || a.spec)?.method) })).filter(Boolean);
  return {
    methods: sentences(methods, ctx.lang),
    results: results.join(' '),
    stale,
    used: kept.map((a) => a.id),
  };
}
