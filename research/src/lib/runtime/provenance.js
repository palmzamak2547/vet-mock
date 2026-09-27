// The human provenance line under every result [M1-DESIGN.md 10.5; engine.md 7]. OWNER: runtime role.
import { METHODS } from './catalog.js';

/** Options printed on the line, in this order. confLevel and the CI method come first as "95% CI (Wilson)". */
const CI_METHOD_OPTIONS = ['ciMethod', 'apparentCiMethod', 'orCi', 'rrCi', 'rdCi', 'lrCi'];
const OTHER_OPTIONS = ['variant', 'measure', 'posthoc', 'method', 'exact', 'weights', 'zeroCell', 'yates', 'continuityCorrection', 'cmhContinuity', 'homogeneity', 'quantileType', 'clusterSize', 'formula', 'z', 'fpc', 'per', 'scores', 'mu', 'intercept', 'roundUp'];

/** Option values that have a display name (statistics names stay English in both languages). */
export const OPTION_VALUES = Object.freeze([
  'wilson', 'exact', 'wald', 'agresti-coull', 'exact-poisson', 'woolf', 'wald-log', 'score', 'newcombe', 'none',
  'haldane', 'rgb', 'greenland-robins', 'breslow-day-tarone', 'welch', 'pooled', 'paired', 'one-sample', 'tukey',
  'pairwise-t-holm', 'pairwise-t-bonferroni', 'holm', 'bonferroni', 'auto', 'normal', 'fisher-z', 'log', 'linear',
  'quadratic', 'anova-oneway', 'mean', 'n0', 'course', 'epiR', 'course-1.96', 'fleiss', 'fleiss-cc', 'course-pooled',
  'rank', 'OR', 'RR',
]);

/** Option names that have a label in the dictionary (runtime.optName.*). */
export const OPTION_NAMES = Object.freeze(['confLevel', 'alternative', 'quantileType', 'summaries', 'percentDenominator', 'showMissing', 'byLevel', 'ciMethod', 'apparentCiMethod', 'clip', 'se', 'sp', 'per', 'orCi', 'rrCi', 'rdCi', 'zeroCell', 'measures', 'measure', 'cmhContinuity', 'homogeneity', 'yates', 'continuityCorrection', 'exact', 'scores', 'variant', 'mu', 'posthoc', 'method', 'intercept', 'lrCi', 'weights', 'estimator', 'clusterSize', 'z', 'fpc', 'roundUp', 'formula']);

/** i18n key segment for an option value: 'wald-log' -> 'waldLog', 'course-1.96' -> 'course196'. */
export function valueSlug(v) {
  return String(v).replace(/[^A-Za-z0-9]+(.)?/g, (_m, c) => (c ? c.toUpperCase() : ''));
}

/** Methods whose line shows a CI level (everything that reports an interval). */
const NO_CI = new Set(['desc.summary', 'desc.table1', 'adjust.pValues', 'ss.proportion', 'ss.twoProportions', 'ss.caseControl', 'ss.mean', 'ss.twoMeans', 'ss.paired']);

function valueText(val, t) {
  if (Array.isArray(val)) return val.join(', ');
  return typeof val === 'string' && OPTION_VALUES.includes(val) ? t(`runtime.optv.${valueSlug(val)}`) : String(val);
}

function optionValueText(name, val, t) {
  if (typeof val === 'boolean') return t(`runtime.opt.${name}.${val ? 'on' : 'off'}`);
  return t(`runtime.opt.${name}`, { value: valueText(val, t) });
}

/**
 * One or two lines in the page language, built only from the envelope:
 *   method name | options that change numbers | rows used and dropped with reasons |
 *   data fingerprint (first 8 hex) | "ตรวจเทียบกับ" / "verified against" only when verified | program version (always last).
 * No middle dot, no ellipsis; separators are " | " exactly as engine.md 7 shows.
 * @param {import('./types.js').ResultEnvelope} env
 * @param {'th'|'en'} lang
 * @param {(key: string, params?: Object) => string} t
 * @param {(columnKey: string) => string} [labelOf]  column label in the page language (codebook); the key when absent
 * @returns {string[]}
 */
export function provenanceLines(env, lang, t, labelOf = (k) => k) {
  void lang;
  const p = env.provenance || {};
  const opts = p.options || env.spec?.options || {};
  const methodId = p.methodId || env.method?.id;
  const row = METHODS.find((m) => m.id === methodId);
  const first = [];
  first.push(row ? t(row.nameKey) : methodId);

  if (!NO_CI.has(methodId) && typeof opts.confLevel === 'number') {
    const level = Math.round(opts.confLevel * 1000) / 10;
    const ciMethods = CI_METHOD_OPTIONS.filter((k) => opts[k] !== undefined && opts[k] !== 'none').map((k) => valueText(opts[k], t));
    first.push(ciMethods.length ? t('runtime.prov.ciWith', { level, methods: ciMethods.join(', ') }) : t('runtime.prov.ci', { level }));
  }
  if (opts.alternative && opts.alternative !== 'two.sided') first.push(t(`runtime.prov.alternative.${opts.alternative === 'less' ? 'less' : 'greater'}`));
  for (const name of OTHER_OPTIONS) {
    if (opts[name] === undefined || opts[name] === null) continue;
    if (name === 'mu' && opts.variant !== 'one-sample') continue;
    // In a cross-sectional study the Mantel-Haenszel ratios are prevalence ratios, as the result says.
    if (name === 'measure' && env.spec?.design === 'cross-sectional' && (opts.measure === 'RR' || opts.measure === 'OR')) {
      first.push(t('runtime.opt.measure', { value: t(`runtime.optv.${opts.measure === 'RR' ? 'PR' : 'POR'}`) }));
      continue;
    }
    first.push(optionValueText(name, opts[name], t));
  }
  if (p.route && p.route !== 'none') first.push(t('runtime.prov.route', { route: t(`runtime.route.${valueSlug(p.route)}`) }));

  const second = [];
  const dropped = (p.rowsDropped || []).filter((d) => d.count > 0);
  const total = dropped.reduce((s, d) => s + d.count, 0);
  const used = typeof p.rowsUsed === 'number' ? p.rowsUsed : 0;
  if (total === 0) second.push(t('runtime.prov.rowsNoneDropped', { used }));
  else {
    const reasons = dropped.map((d) => t(`runtime.prov.drop.${d.reason}`, { column: d.column ? labelOf(d.column) : '', count: d.count }).trim()).join(', ');
    second.push(t('runtime.prov.rows', { used, dropped: total, reasons }));
  }
  if (p.dataFingerprint) second.push(t('runtime.prov.data', { hash: p.dataFingerprint.slice(0, 8) }));
  // The line always ends with the program version; the verification claim sits just before it.
  if (env.verified) second.push(t('runtime.prov.verified', { against: (p.validatedAgainst || []).map((f) => t(`runtime.family.fixture.${valueSlug(f)}`)).join(', ') }));
  second.push(t('runtime.prov.engine', { version: p.engineVersion || '' }));
  return [first.join(' | '), second.join(' | ')];
}

/**
 * Every option of the envelope, for the tap-to-expand panel: [label, value] pairs in the page language.
 * @param {import('./types.js').ResultEnvelope} env
 * @param {(key: string, params?: Object) => string} t
 * @returns {[string, string][]}
 */
export function provenanceOptions(env, t) {
  const opts = env.provenance?.options || env.spec?.options || {};
  const out = [];
  for (const [name, val] of Object.entries(opts)) {
    let shown;
    if (typeof val === 'boolean') shown = t(val ? 'runtime.prov.yes' : 'runtime.prov.no');
    else if (val && typeof val === 'object' && !Array.isArray(val)) shown = Object.entries(val).map(([k, x]) => `${k}: ${valueText(x, t)}`).join(', ');
    else shown = valueText(val, t);
    out.push([OPTION_NAMES.includes(name) ? t(`runtime.optName.${name}`) : name, shown]);
  }
  return out;
}
