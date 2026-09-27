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

/** Punctuation differs by language: Thai joins clauses with a space and ends without a full stop. */
const PUNCT = { th: { join: ' ', sep: ' ', end: '' }, en: { join: '; ', sep: ', ', end: '.' } };
const punct = (lang) => PUNCT[lang] || PUNCT.en;

/** Method name from the catalogue key, or the id when the dictionary has no name yet. */
function methodName(t, nameKey, id) {
  return nameKey && has(t, nameKey) ? t(nameKey) : id;
}

/** "95%" from a spec. */
const levelText = (spec) => `${Math.round((spec?.options?.confLevel ?? 0.95) * 1000) / 10}%`;

/**
 * One methods sentence for a saved analysis.
 * @param {any} analysis saved analysis { spec, envelope }
 * @param {{ t: T, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, columnName: (key: string) => string }} ctx
 */
export function methodsSentence(analysis, ctx) {
  const { t } = ctx;
  const env = analysis.envelope;
  const spec = env?.spec || analysis.spec;
  const name = methodName(t, ctx.nameKeyOf(spec.method), spec.method);
  const roles = Object.entries(spec.roles || {})
    .filter(([, v]) => v && (!Array.isArray(v) || v.length))
    .map(([role, v]) => t('report.methods.role', { role: has(t, `report.role.${role}`) ? t(`report.role.${role}`) : t(`ws.role.${role}`), column: (Array.isArray(v) ? v : [v]).map(ctx.columnName).join(', ') }));
  const parts = [t('report.methods.analysis', { method: name, level: levelText(spec) })];
  if (roles.length) parts.push(t('report.methods.roles', { roles: roles.join(punct(ctx.lang).sep) }));
  const route = spec.cluster?.route;
  if (route && route !== 'none' && has(t, `report.methods.route.${keyPart(route)}`)) parts.push(t(`report.methods.route.${keyPart(route)}`, { column: spec.cluster.column ? ctx.columnName(spec.cluster.column) : '' }));
  const dropped = (env?.provenance?.rowsDropped || []).reduce((s, d) => s + (d.count || 0), 0);
  if (dropped > 0) parts.push(t('report.methods.dropped', { n: dropped }));
  return parts.join(punct(ctx.lang).join);
}

/**
 * One results sentence: estimate and interval before p, undefined values named as such.
 * @param {any} analysis
 * @param {{ t: T, fmt: Fmt, lang: 'th'|'en', nameKeyOf: (id: string) => string|null, designRow?: any, valueLabel: (name: string) => string }} ctx
 */
export function resultsSentence(analysis, ctx) {
  const { t, fmt, lang } = ctx;
  const env = analysis.envelope;
  if (!env) return '';
  const spec = env.spec || analysis.spec;
  const name = methodName(t, ctx.nameKeyOf(spec.method), spec.method);
  if (env.status === 'stopped') return t('report.results.stopped', { method: name });
  const primary = primaryValueName(env, ctx.designRow);
  const bits = [];
  // Counts (strata used, rows) belong in the table and the provenance line, not in the sentence.
  const worded = valueRows(env, primary).filter((r) => r.name === primary || r.kind !== 'count');
  for (const r of worded.slice(0, 4)) {
    if (r.value === null || r.value === undefined) {
      bits.push(t('report.results.undefined', { label: ctx.valueLabel(r.name), reason: r.reasonKey ? t(r.reasonKey) : t('ws.result.undefinedNoReason') }));
    } else if (r.ci) {
      const full = fmt.formatCi({ value: r.value, ci: r.ci, kind: fmtKind(r.kind) }, lang);
      const bounds = full.includes('(') ? full.replace(/^.*?\(/, '').replace(/\)$/, '') : full;
      bits.push(t('report.results.valueCi', { label: ctx.valueLabel(r.name), value: fmt.formatNumber(r.value, { kind: fmtKind(r.kind) }), bounds, level: levelText(spec) }));
    } else {
      bits.push(t('report.results.value', { label: ctx.valueLabel(r.name), value: fmt.formatNumber(r.value, { kind: fmtKind(r.kind) }) }));
    }
  }
  for (const test of (env.tests || []).slice(0, 2)) {
    if (test.p === null || test.p === undefined) bits.push(t('report.results.pWithheld', { test: testLabel(test, t) }));
    else bits.push(t('report.results.p', { test: testLabel(test, t), p: pText(fmt, test.p) }));
  }
  if (!bits.length) return t('report.results.tableOnly', { method: name });
  return t('report.results.lead', { method: name, parts: bits.join(punct(ctx.lang).sep) });
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
  if (ctx.designNameKey && has(t, ctx.designNameKey)) methods.push(t('report.methods.design', { design: t(ctx.designNameKey) }));
  const cluster = data.codebook?.clusterKey;
  if (cluster) methods.push(t('report.methods.cluster', { column: columnName(cluster) }));
  const names = Object.fromEntries((data.codebook?.columns || []).map((c) => [c.key, columnName(c.key)]));
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
  for (const a of kept) methods.push(methodsSentence(a, sctx));
  const engine = kept[0]?.envelope?.provenance?.engineVersion;
  if (engine) methods.push(t('report.methods.software', { engine }));
  const results = kept.map((a) => resultsSentence(a, { t, fmt: ctx.fmt, lang: ctx.lang, nameKeyOf: ctx.nameKeyOf, designRow: ctx.designRow, valueLabel: valueLabelFor((a.envelope?.spec || a.spec)?.method) })).filter(Boolean);
  const end = punct(ctx.lang).end;
  return {
    methods: methods.map((s) => s + end).join(' '),
    results: results.map((s) => s + end).join(' '),
    stale,
    used: kept.map((a) => a.id),
  };
}
