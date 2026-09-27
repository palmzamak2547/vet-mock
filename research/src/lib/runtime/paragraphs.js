// Methods and results paragraphs in Thai and English, written from the project log and the saved
// result envelopes with fixed template sentences (never a model, never a typed number)
// [M1-DESIGN.md 9.3, 10.2, 17; research-m1-brief.md "Results"]. The Report screen (workspace role)
// lays them out; this module only decides the sentences. OWNER: runtime role.
import { METHODS } from './catalog.js';
import { OPTION_VALUES, valueSlug } from './provenance.js';
import { formatP, formatCi, formatNumber } from '../stats/format.js';

/** @typedef {import('../store/log.js').LogEntry} LogEntry */
/** @typedef {import('../store/analyses.js').SavedAnalysis} SavedAnalysis */

/** Estimate names that have a reading in the dictionaries (runtime.para.value.*). Others print as named. */
export const VALUE_NAMES = Object.freeze(['PR', 'POR', 'PD', 'RR', 'OR', 'RD', 'AFe', 'AFp', 'AFeEst', 'AFpEst', 'estimate', 'proportion', 'truePrevalence', 'risk', 'rate', 'icc', 'deff', 'nEff', 'mean', 'median', 'difference', 'r', 'rho', 'kappa', 'se', 'sp', 'ppv', 'npv', 'lrPos', 'lrNeg', 'accuracy', 'n']);

const CI_KEYS = ['ciMethod', 'apparentCiMethod', 'orCi', 'rrCi', 'rdCi'];

/**
 * @param {Object} args
 * @param {'th'|'en'} args.lang
 * @param {(key: string, params?: Object) => string} args.t
 * @param {{ name: string, design: string|null }} args.project
 * @param {LogEntry[]} args.log                    oldest first
 * @param {SavedAnalysis[]} args.analyses          the results the student put in the report, in order
 * @param {string|null} [args.currentFingerprint]  the data as it is now; older snapshots are flagged
 * @param {(columnKey: string) => string} [args.labelOf]
 * @param {{ p?: typeof formatP, ci?: typeof formatCi, num?: typeof formatNumber }} [args.fmt]
 * @returns {{ methods: string[], results: string[], stale: string[] }}
 */
export function buildReport(args) {
  const { lang, t, project, log = [], analyses = [], currentFingerprint = null, labelOf = (k) => k } = args;
  const fmt = { p: formatP, ci: formatCi, num: formatNumber, ...(args.fmt || {}) };
  const methods = [];
  const results = [];
  const stale = [];

  // 1. Design and data, from the latest import in the log.
  const imp = [...log].reverse().find((e) => e.kind === 'import');
  const design = project?.design ? t(`runtime.para.design.${valueSlug(project.design)}`) : t('runtime.para.design.unnamed');
  if (imp) methods.push(t('runtime.para.m.data', { design, rows: fmtInt(imp.detail?.rows), columns: fmtInt(imp.detail?.columns), file: imp.detail?.fileName || '' }));
  else methods.push(t('runtime.para.m.designOnly', { design }));

  // 2. Data preparation: the recipe steps, in order, grouped where a count reads better than a list.
  methods.push(...recipeSentences(log, t, labelOf));

  // 3. Each distinct analysis once, with its interval method and the farm route.
  const ok = analyses.filter((a) => a.envelope && a.envelope.status === 'ok');
  const seen = new Set();
  for (const a of ok) {
    const env = a.envelope;
    const id = env.provenance?.methodId || env.method?.id;
    const route = env.provenance?.route && env.provenance.route !== 'none' ? env.provenance.route : null;
    const sig = `${id}|${route}|${JSON.stringify(env.provenance?.options || {})}`;
    if (seen.has(sig)) continue;
    seen.add(sig);
    methods.push(methodSentence(env, t));
    if (route) methods.push(t(`runtime.para.m.route.${valueSlug(route)}`, { column: env.spec?.cluster?.column ? labelOf(env.spec.cluster.column) : '' }));
    for (const d of env.provenance?.rowsDropped || []) {
      if (d.count > 0 && d.reason === 'missing') methods.push(t('runtime.para.m.missing', { count: fmtInt(d.count), column: d.column ? labelOf(d.column) : '', method: methodName(id, t) }));
    }
  }

  // 4. The software sentence, and the verification claim only when a fixture covers a result.
  const version = ok[0]?.envelope?.provenance?.engineVersion;
  if (version) methods.push(t('runtime.para.m.software', { version }));
  const families = [...new Set(ok.filter((a) => a.envelope.verified).flatMap((a) => a.envelope.provenance?.validatedAgainst || []))];
  if (families.length) methods.push(t('runtime.para.m.verified', { against: families.map((f) => t(`runtime.family.fixture.${valueSlug(f)}`)).join(', ') }));

  // Results.
  for (const a of analyses) {
    const env = a.envelope;
    if (!env) continue;
    const name = methodName(env.provenance?.methodId || env.method?.id, t);
    if (currentFingerprint && a.dataFingerprint && a.dataFingerprint !== currentFingerprint) stale.push(t('runtime.para.r.stale', { method: name }));
    if (env.status === 'stopped') { results.push(t('runtime.para.r.stopped', { method: name })); continue; }
    if (env.status !== 'ok') { results.push(t('runtime.para.r.invalid', { method: name })); continue; }
    results.push(resultSentence(env, name, lang, t, fmt));
  }
  return { methods, results, stale };
}

function fmtInt(n) {
  return typeof n === 'number' && Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '';
}

function methodName(id, t) {
  const row = METHODS.find((m) => m.id === id);
  return row ? t(row.nameKey) : id || '';
}

function methodSentence(env, t) {
  const opts = env.provenance?.options || {};
  const id = env.provenance?.methodId || env.method?.id;
  const ci = CI_KEYS.filter((k) => opts[k] && opts[k] !== 'none').map((k) => (OPTION_VALUES.includes(opts[k]) ? t(`runtime.optv.${valueSlug(opts[k])}`) : String(opts[k])));
  if (typeof opts.confLevel === 'number' && ci.length) {
    return t('runtime.para.m.methodCi', { method: methodName(id, t), level: Math.round(opts.confLevel * 1000) / 10, ci: ci.join(', ') });
  }
  return t('runtime.para.m.method', { method: methodName(id, t) });
}

function recipeSentences(log, t, labelOf) {
  const out = [];
  let edits = 0;
  let added = 0;
  for (const e of log) {
    if (e.kind !== 'recipe') continue;
    const d = e.detail || {};
    const column = d.column ? labelOf(d.column) : '';
    switch (d.stepKind) {
      case 'cell-edit': edits += 1; break;
      case 'row-add': added += 1; break;
      case 'row-exclude': out.push(t('runtime.para.m.step.rowExclude', { count: fmtInt(d.count ?? 1), reason: d.reason || '' })); break;
      case 'filter': out.push(t('runtime.para.m.step.filter', { count: fmtInt(d.count ?? 0), reason: d.reason || '' })); break;
      case 'recode': out.push(t('runtime.para.m.step.recode', { column })); break;
      case 'bin': out.push(t(d.cutSource === 'median' || d.cutSource === 'quantile' ? 'runtime.para.m.step.binData' : 'runtime.para.m.step.binTyped', { column, cutpoints: (d.cutpoints || []).join(', ') })); break;
      case 'reference': out.push(t('runtime.para.m.step.reference', { column })); break;
      case 'derive-age': out.push(t('runtime.para.m.step.deriveAge', { column })); break;
      case 'missing-code': out.push(t('runtime.para.m.step.missingCode', { column })); break;
      case 'import-conversions': if (d.count) out.push(t('runtime.para.m.step.conversions', { count: fmtInt(d.count) })); break;
      default: break;
    }
  }
  if (edits) out.push(t('runtime.para.m.step.cellEdits', { count: fmtInt(edits) }));
  if (added) out.push(t('runtime.para.m.step.rowsAdded', { count: fmtInt(added) }));
  return out;
}

function resultSentence(env, name, lang, t, fmt) {
  const parts = [];
  for (const [key, val] of Object.entries(env.values || {})) {
    const label = VALUE_NAMES.includes(key) ? t(`runtime.para.value.${key}`) : key;
    if (val.value === null) {
      parts.push(t('runtime.para.r.undefined', { name: label, reason: val.reasonKey ? t(val.reasonKey) : '' }));
      continue;
    }
    if (Array.isArray(val.ci)) parts.push(t('runtime.para.r.estimateCi', { name: label, ci: fmt.ci(val, lang), level: Math.round((val.ciLevel ?? env.spec?.options?.confLevel ?? 0.95) * 1000) / 10 }));
    else parts.push(t('runtime.para.r.estimate', { name: label, value: fmt.num(val.value, { kind: 'statistic' }) }));
  }
  for (const test of env.tests || []) {
    if (test.p === null) {
      parts.push(t('runtime.para.r.noP', { reason: test.reasonKey ? t(test.reasonKey) : '' }));
      continue;
    }
    const stat = test.statistic && typeof test.statistic.value === 'number' ? `${test.statistic.name} = ${fmt.num(test.statistic.value, { kind: 'statistic' })}` : '';
    const df = typeof test.df === 'number' ? `df = ${fmt.num(test.df, { kind: 'statistic' })}` : '';
    const pShown = fmt.p(test.p);
    const pText = pShown.startsWith('<') ? `p ${pShown}` : `p = ${pShown}`;
    parts.push([stat, df, pText].filter(Boolean).join(', '));
  }
  return t('runtime.para.r.sentence', { method: name, parts: parts.join('; ') });
}
