// The methods and results draft [M1-DESIGN.md 17; workspace board "Report"]. Written from the saved
// analyses (their envelopes) and the recipe steps, never from typed numbers: every figure in a
// paragraph comes from an envelope value through the stats formatter. Thai and English are built from
// the report dictionary with the same facts. When the data changed after an analysis was saved, the
// draft keeps the old numbers and lists that analysis as not current, instead of recomputing silently.
// Pure: `t` and `fmt` are passed in. OWNER: workspace role.
import { fmtKind, isStale, pText, primaryValueName, valueRows } from '../lib/result-model.js';
import { keyPart } from '../lib/keys.js';

/**
 * @typedef {{ formatNumber: Function, formatP: Function, formatCi: Function }} Fmt
 * @typedef {(key: string, params?: Object) => string} T
 */

const has = (t, key) => t(key) !== `[${key}]`;

/** Punctuation differs by language: Thai lists with a space and ends a sentence without a full stop. */
const PUNCT = { th: { sep: ' ', end: '' }, en: { sep: ', ', end: '.' } };
const punct = (lang) => PUNCT[lang] || PUNCT.en;

/** Thai script. */
const THAI = new RegExp(`[${String.fromCharCode(0x0e00)}-${String.fromCharCode(0x0e7f)}]`);

/**
 * A column name set into Thai text. Thai runs its words together, so a name that starts or ends in
 * another script (farm_id, ELISA) gets a space on that side (review round 3: the Thai sentence ran
 * "prevalence of" straight into the key c13); the
 * spaces a template already has are collapsed when the sentence is finished.
 * @param {string} name
 */
export function padInThai(name) {
  const s = String(name ?? '');
  if (!s) return s;
  return `${THAI.test(s[0]) ? '' : ' '}${s}${THAI.test(s[s.length - 1]) ? '' : ' '}`;
}

/**
 * A column's name in the page language, from the codebook: the label the student gave, else the
 * header in the file. The internal key only when the codebook has no such column.
 * @param {any} codebook
 * @param {'th'|'en'} lang
 * @returns {(key: string) => string}
 */
export function columnNameFor(codebook, lang) {
  return (key) => {
    const c = codebook?.columns?.find((x) => x.key === key);
    if (!c) return key;
    return (lang === 'en' ? c.labelEn || c.name : c.labelTh || c.name) || key;
  };
}

/**
 * A level's label in the page language when the codebook gives one, else the value as the file has it.
 * @param {any} codebook
 * @param {'th'|'en'} lang
 * @returns {(key: string, value: string) => string}
 */
export function levelNameFor(codebook, lang) {
  return (key, value) => {
    const c = codebook?.columns?.find((x) => x.key === key);
    const l = (c?.levels || []).find((x) => x && x.value === value);
    if (!l) return value;
    return (lang === 'en' ? l.labelEn : l.labelTh) || value;
  };
}

/** Column names as a sentence in `lang` sets them (padded inside Thai). */
const inLang = (columnName, lang) => (lang === 'th' ? (k) => padInThai(columnName(k)) : columnName);

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
  return list.filter(Boolean).map((x) => x.replace(/\s{2,}/g, ' ').trim().replace(/[.\s]+$/, '') + end).join(' ');
}

/** A reason sentence placed inside brackets loses its own full stop. */
const inBrackets = (text) => String(text || '').replace(/[.\s]+$/, '');

/**
 * "A, B and C" in English, the Thai list word before the last item in Thai; the joining word comes from the dictionary. In Thai
 * the joining word runs into the last item, so an item in another script gets a space before it.
 */
function joinList(items, lang, t) {
  const list = items.filter((x) => x !== null && x !== undefined && x !== '').map(String);
  if (list.length < 2) return list.join('');
  const last = list[list.length - 1];
  const b = lang === 'th' && !THAI.test(last.trimStart()[0] || '') ? ` ${last.trimStart()}` : last;
  return t('report.list.and', { a: list.slice(0, -1).join(punct(lang).sep), b });
}

/**
 * A negative number in a paragraph takes the minus sign (U+2212), as a manuscript prints it (review
 * round 3: "-0.069"). Tables and CSV files keep the hyphen-minus a spreadsheet reads as a number.
 */
const minus = (s) => String(s).replace(/(^|[\s(])-(?=\d)/g, '$1−');

/** English starts a sentence with a capital. */
const cap = (lang, s) => (lang === 'en' && s ? s[0].toUpperCase() + s.slice(1) : s);

/** English puts a label mid-sentence in lower case ("the prevalence ratio (PR)"), acronyms kept. */
const lowerLabel = (lang, x) => (lang === 'en' && /^[A-Z][a-z]/.test(x) ? x[0].toLowerCase() + x.slice(1) : x);

/** Values that compare an exposed with a reference group. */
const COMPARISON = new Set(['PR', 'POR', 'OR', 'RR', 'RD', 'PD', 'IRR', 'IRD']);
/** Values that are a share of the outcome, written "the prevalence of <outcome> <level>". */
const OUTCOME_SHARE = new Set(['prevalence', 'apparent', 'truePrevalence', 'risk']);
/** Differences of two proportions, written in percentage points beside prevalences in percent. */
const POINTS = new Set(['PD', 'RD']);
/**
 * Tests printed in the table but not written as a sentence: Breslow-Day before Tarone's correction is
 * the same question as the corrected test, which is the one reported (review round 3).
 */
const NOT_WRITTEN = new Set(['homogeneityUncorrected']);

/**
 * A homogeneity test named with the strata it summed: Woolf leaves out the strata without a positive
 * in both groups, so on sparse farm strata it may use 10 of 49 (review round 3). All strata: "over all".
 */
function strataOf(hom, env, name, t) {
  const n = Array.isArray(hom.strataIncluded) ? hom.strataIncluded.length : 0;
  if (!n) return name;
  const of = env.values?.strataUsed?.value;
  if (of === n) return t('report.homogeneity.over.all', { test: name, n });
  const rule = has(t, `report.strataRule.${keyPart(hom.strataRule || '')}`) ? t(`report.strataRule.${keyPart(hom.strataRule || '')}`) : '';
  if (!rule) return name;
  return t(typeof of === 'number' && of > n ? 'report.homogeneity.over.some' : 'report.homogeneity.over.these', { test: name, n, of, rule });
}

/** The option of a method whose methods sentence depends on it, e.g. the t-test's variant. */
function variantOf(spec) {
  const o = spec?.options || {};
  switch (spec?.method) {
    case 'test.tTest': return o.variant || null;
    case 'test.chisq': return o.yates === true ? 'yates' : null;
    case 'agree.kappa': return o.weights && o.weights !== 'none' ? o.weights : null;
    case 'adjust.pValues': return o.method === 'none' ? 'none' : null;
    default: return null;
  }
}

/**
 * The opening sentence for one method, from the method's own sentence in the report dictionary
 * (report.methods.method.<id>), never from its menu label: a label such as "2x2 table: exposure and
 * outcome" is not a noun a sentence can use (review rounds 2 and 3). The CI clause is added only when
 * the result carries an interval.
 */
function methodLead(spec, env, ctx) {
  const { t, lang } = ctx;
  const method = spec.method;
  if (method === 'desc.table1') {
    const summaries = Object.values(spec.options?.summaries || {});
    return t(summaries.includes('mean-sd') ? 'report.methods.table1MeanSd' : 'report.methods.table1');
  }
  if (describes(method)) return t('report.methods.summary');
  const values = env?.values || {};
  const hasCi = Object.values(values).some((v) => Array.isArray(v?.ci));
  const compared = Object.keys(values).filter((n) => COMPARISON.has(n));
  const several = (n) => (has(t, `report.measures.${n}`) ? t(`report.measures.${n}`) : n);
  const one = (n) => (has(t, `report.measure.${n}`) ? t(`report.measure.${n}`) : n);
  const optionWord = (v) => (v !== undefined && v !== null && has(t, `runtime.optv.${keyPart(v)}`) ? t(`runtime.optv.${keyPart(v)}`) : String(v ?? ''));
  const params = {
    ci: hasCi ? t('report.methods.ci', { level: levelText(spec) }) : '',
    level: levelText(spec),
    measures: compared.length ? joinList(compared.map(several), lang, t) : t('report.measures.generic'),
    measure: compared.length ? one(compared[0]) : t('report.measure.generic'),
    method: optionWord(spec.options?.method),
  };
  const base = `report.methods.method.${keyPart(method)}`;
  const variant = variantOf(spec);
  const key = [variant ? `${base}.${keyPart(variant)}` : null, base].find((k) => k && has(t, k)) || 'report.methods.method.other';
  return cap(lang, t(key, params));
}

/**
 * The methods sentences for one saved analysis, each a full sentence ending as the language does.
 * @param {any} analysis saved analysis { spec, envelope }
 * @param {{ t: T, lang: 'th'|'en', columnName: (key: string) => string, nameKeyOf?: (id: string) => string|null }} ctx
 */
export function methodsSentence(analysis, ctx) {
  const { t, lang } = ctx;
  const env = analysis.envelope;
  const spec = env?.spec || analysis.spec;
  const col = inLang(ctx.columnName || ((k) => k), lang);
  const route = spec.cluster?.route;
  const clusterColumn = spec.cluster?.column || null;
  // Comparing within farms names the farm column in its own sentence; it is not listed again as strata.
  const roleEntries = Object.entries(spec.roles || {})
    .filter(([, v]) => v && (!Array.isArray(v) || v.length))
    .filter(([role, v]) => !(route === 'mh-within' && role === 'strata' && [].concat(v).every((k) => k === clusterColumn)));
  const roleName = (role) => (has(t, `report.role.${role}`) ? t(`report.role.${role}`) : t(`ws.role.${role}`));
  const out = [methodLead(spec, env, ctx)];
  if (spec.method === 'desc.table1') {
    // Table 1 lists what it describes and what splits its columns, in its own words (review round 3:
    // the role word printed once after the whole list of described columns).
    const described = [].concat(spec.roles?.covariates || []).filter(Boolean);
    const group = spec.roles?.group || null;
    if (described.length) {
      const columns = joinList(described.map(col), lang, t);
      out.push(group ? t('report.methods.table1VarsBy', { columns, group: col(group) }) : t('report.methods.table1Vars', { columns }));
    }
  } else {
    const roles = roleEntries.map(([role, v]) => t('report.methods.role', { role: roleName(role), column: joinList([].concat(v).map(col), lang, t) }));
    // One column reads "The variable was", not "The variables were".
    const count = roleEntries.reduce((n, [, v]) => n + [].concat(v).length, 0);
    if (roles.length) out.push(t(count === 1 ? 'report.methods.rolesOne' : 'report.methods.roles', { roles: joinList(roles, lang, t) }));
  }
  // One-way ANOVA says how the groups were compared pairwise, when it did so.
  if (spec.method === 'test.anova1' && (env?.tables || []).some((tb) => tb.id === 'posthoc') && spec.options?.posthoc && spec.options.posthoc !== 'none') {
    const k = `runtime.optv.${keyPart(spec.options.posthoc)}`;
    out.push(t('report.methods.posthoc', { posthoc: has(t, k) ? t(k) : spec.options.posthoc }));
  }
  // The Mantel-Haenszel name is said once: by the method when the method is Mantel-Haenszel, else here.
  const routeKey = route === 'mh-within' && spec.method !== 'epi.mantelHaenszel' ? 'report.methods.route.mhWithinNamed' : `report.methods.route.${keyPart(route || '')}`;
  const drops = env?.provenance?.rowsDropped || [];
  const sum = (pred) => drops.filter(pred).reduce((a, d) => a + (d.count || 0), 0);
  // Rows merged into farm rows by the aggregate route were summarised, not left out (review round 2:
  // "679 rows with missing values were left out" for the 728 animals analysed as 49 farms).
  const aggregated = sum((d) => d.reason === 'aggregated');
  const removed = sum((d) => d.reason === 'excluded' || d.reason === 'filter');
  const missing = sum((d) => d.reason !== 'aggregated' && d.reason !== 'excluded' && d.reason !== 'filter');
  const column = clusterColumn ? col(clusterColumn) : '';
  if (route === 'aggregate' && aggregated > 0) {
    const used = env?.provenance?.rowsUsed ?? 0;
    out.push(t('report.methods.route.aggregateCounts', { animals: used + aggregated, farms: used, column }));
    if (spec.levels?.outcomePositive != null && spec.roles?.outcome) out.push(t('report.methods.aggregatePositive'));
  } else if (route && route !== 'none' && has(t, routeKey)) out.push(t(routeKey, { column }));
  if (removed > 0) out.push(t('report.methods.removed', { n: removed }));
  if (missing === 1) out.push(t('report.methods.droppedOne'));
  else if (missing > 1) out.push(t('report.methods.dropped', { n: missing }));
  return sentences(out, lang);
}

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
  return minus(out.join(', '));
}

/**
 * The results sentences for one kept analysis, written to paste into a report: the estimates with
 * their intervals (every comparison of the same two groups in one sentence that names them once),
 * then each test with its statistic, df and p, then a sentence when strata disagree. Every number
 * is an envelope number.
 * @param {any} analysis
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', designRow?: any, valueLabel: (name: string) => string, columnName?: (key: string) => string, levelName?: (key: string, value: string) => string, nameKeyOf?: (id: string) => string|null }} ctx
 */
export function resultsSentence(analysis, ctx) {
  const { t, fmt, lang } = ctx;
  const env = analysis.envelope;
  if (!env) return '';
  const spec = env.spec || analysis.spec;
  if (env.status === 'stopped') return sentences([t('report.results.stopped')], lang);
  // A descriptive table is its own result; the sentence points to it without the method's label.
  if (spec.method === 'desc.table1') return sentences([t('report.results.table1')], lang);
  if (describes(spec.method)) return sentences([t('report.results.summary')], lang);
  const col = inLang(ctx.columnName || ((k) => k), lang);
  const levelName = ctx.levelName || ((k, v) => v);
  const primary = primaryValueName(env, ctx.designRow);
  const label = (n) => lowerLabel(lang, ctx.valueLabel(n));
  const noun = (n) => (has(t, `report.noun.${n}`) ? t(`report.noun.${n}`) : label(n));
  const valueText = (r) => {
    if (POINTS.has(r.name)) {
      const pts = (x) => minus(fmt.formatNumber(x * 100, { kind: 'statistic', digits: 1 }));
      const value = t('report.results.points', { value: pts(r.value) });
      if (!Array.isArray(r.ci) || !r.ci.every((x) => typeof x === 'number' && Number.isFinite(x))) return value;
      return t('report.results.valueCi', { value, bounds: t('report.results.range', { lo: pts(r.ci[0]), hi: pts(r.ci[1]) }), level: levelText(spec) });
    }
    const sides = { below: r.below, above: r.above };
    const value = minus(fmt.formatNumber(r.value, { kind: fmtKind(r.kind), ...sides }));
    if (!r.ci) return value;
    const full = fmt.formatCi({ value: r.value, ci: r.ci, kind: fmtKind(r.kind), ...sides }, lang);
    const bounds = minus(full.includes('(') ? full.replace(/^.*?\(/, '').replace(/\)$/, '') : full);
    return t('report.results.valueCi', { value, bounds, level: levelText(spec) });
  };
  const lv = spec.levels || {};
  const roles = spec.roles || {};
  const strata = [].concat(roles.strata || []).filter(Boolean);
  const rows = valueRows(env, primary);
  const tests = (env.tests || []).filter((x) => !NOT_WRITTEN.has(x.id));
  const sentenceFor = (r) => {
    if (r.value === null || r.value === undefined) {
      return t('report.results.undefined', { label: cap(lang, label(r.name)), reason: inBrackets(r.reasonKey ? t(r.reasonKey) : t('ws.result.undefinedNoReason')) });
    }
    const v = valueText(r);
    if (r.name === primary && OUTCOME_SHARE.has(r.name) && roles.outcome && lv.outcomePositive != null) {
      return cap(lang, t('report.results.ofOutcome', { label: noun(r.name), outcome: col(roles.outcome), positive: levelName(roles.outcome, lv.outcomePositive), value: v }));
    }
    return cap(lang, t('report.results.estimate', { label: label(r.name), value: v }));
  };
  // The primary value is written when it is an estimate (an interval, a comparison, a share of the
  // outcome); a check value such as the smallest expected count stays in the table beside a test.
  const chosen = [];
  const primaryRow = rows.find((r) => r.name === primary);
  if (primaryRow && (Array.isArray(primaryRow.ci) || COMPARISON.has(primaryRow.name) || OUTCOME_SHARE.has(primaryRow.name) || !tests.length)) chosen.push(primaryRow);
  // Other estimates with an interval (a PD beside the PR), or a comparison that could not be computed.
  chosen.push(...rows.filter((r) => r.name !== primary && r.kind !== 'count' && (Array.isArray(r.ci) || (COMPARISON.has(r.name) && r.value == null))).slice(0, 3));
  // The comparisons of the same two groups share one sentence that names the groups once (review
  // round 3: the design-effect paragraph repeated "when comparing ... " three times).
  const named = roles.exposure && lv.exposureLevel != null && lv.referenceLevel != null;
  const compared = named ? chosen.filter((r) => COMPARISON.has(r.name) && r.value !== null && r.value !== undefined) : [];
  const out = [];
  if (compared.length) {
    const parts = joinList(compared.map((r) => t('report.results.part', { measure: label(r.name), value: valueText(r) })), lang, t);
    const params = { exposure: col(roles.exposure), exposed: levelName(roles.exposure, lv.exposureLevel), reference: levelName(roles.exposure, lv.referenceLevel), parts };
    out.push(strata.length ? t('report.results.compareAdjusted', { ...params, strata: joinList(strata.map(col), lang, t) }) : t('report.results.compare', params));
  }
  for (const r of chosen) if (!compared.includes(r)) out.push(sentenceFor(r));
  for (const test of tests.filter((x) => x.id !== 'homogeneity').slice(0, 2)) {
    if (test.p === null || test.p === undefined) out.push(cap(lang, t('report.results.pWithheld', { test: testName(test, t) })));
    else out.push(cap(lang, t('report.results.test', { test: testName(test, t), stats: statsText(test, fmt) })));
  }
  const hom = tests.find((x) => x.id === 'homogeneity');
  if (hom && typeof hom.p === 'number') {
    const name = has(t, `report.homogeneity.${keyPart(hom.variant || '')}`) ? t(`report.homogeneity.${keyPart(hom.variant || '')}`) : t('report.homogeneity.generic');
    const which = strataOf(hom, env, name, t);
    out.push(t(hom.p < 0.05 ? 'report.results.strataDiffer' : 'report.results.strataTest', { test: which, stats: statsText(hom, fmt) }));
  }
  if (!out.length) return sentences([t('report.results.tableOnly')], lang);
  return sentences(out, lang);
}

/**
 * The methods and results sentences under one result, in one language: the same sentences the
 * report draft writes for it, with columns and levels named from the codebook (review round 3: the
 * paragraphs under a result printed the column keys, "The prevalence of c13").
 * @param {any} env the result's envelope
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', codebook?: any, designRow?: any, nameKeyOf?: (id: string) => string|null }} ctx
 * @returns {{ methods: string, results: string }}
 */
export function resultParagraphs(env, ctx) {
  const { t, lang } = ctx;
  const analysis = { spec: env?.spec, envelope: env };
  const columnName = columnNameFor(ctx.codebook, lang);
  const levelName = levelNameFor(ctx.codebook, lang);
  const methodId = env?.method?.id || env?.spec?.method || '';
  const valueLabel = (name) => {
    for (const k of [`ws.value.${keyPart(methodId)}.${name}`, `ws.value.${name}`]) if (has(t, k)) return t(k);
    return name;
  };
  return {
    methods: methodsSentence(analysis, { t, lang, nameKeyOf: ctx.nameKeyOf, columnName, levelName }),
    results: resultsSentence(analysis, { t, fmt: ctx.fmt, lang, nameKeyOf: ctx.nameKeyOf, designRow: ctx.designRow, valueLabel, columnName, levelName }),
  };
}

/**
 * The whole draft for one language.
 * @param {{ analyses: any[], steps: any[], project: any, table: any, codebook: any }} data
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, designNameKey: string|null, describeStep: (s: any, t: T, names?: Record<string, string>) => string, designRow?: any }} ctx
 * @returns {{ methods: string, results: string, stale: string[], used: string[] }}
 */
export function buildDraft(data, ctx) {
  const { t } = ctx;
  const columnName = columnNameFor(data.codebook, ctx.lang);
  const levelName = levelNameFor(data.codebook, ctx.lang);
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
    methods.push(t('report.methods.design', { design: lowerLabel(ctx.lang, t(ctx.designNameKey)) }));
  }
  const cluster = data.codebook?.clusterKey;
  if (cluster) methods.push(t('report.methods.cluster', { column: inLang(columnName, ctx.lang)(cluster) }));
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
  const sctx = { t, lang: ctx.lang, nameKeyOf: ctx.nameKeyOf, columnName, levelName };
  // Two kept results of the same analysis (an earlier and a current run) describe the method once.
  for (const a of kept) {
    const m = methodsSentence(a, sctx);
    if (!methods.includes(m)) methods.push(m);
  }
  const engine = kept[0]?.envelope?.provenance?.engineVersion;
  if (engine) methods.push(t('report.methods.software', { engine: publicVersion(engine) }));
  const results = kept.map((a) => resultsSentence(a, { t, fmt: ctx.fmt, lang: ctx.lang, nameKeyOf: ctx.nameKeyOf, designRow: ctx.designRow, columnName, levelName, valueLabel: valueLabelFor((a.envelope?.spec || a.spec)?.method) })).filter(Boolean);
  return {
    methods: sentences(methods, ctx.lang),
    results: results.join(' '),
    stale,
    used: kept.map((a) => a.id),
  };
}
