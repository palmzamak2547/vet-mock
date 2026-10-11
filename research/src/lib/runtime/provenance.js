// The human provenance line under every result [M1-DESIGN.md 10.5; engine.md 7]. OWNER: runtime role.
import { METHODS } from './catalog.js';
import { AREA_OF } from './areas/index.js';

/** Options printed on the line, in this order. confLevel and the CI method come first as "95% CI (Wilson)". */
const CI_METHOD_OPTIONS = ['ciMethod', 'apparentCiMethod', 'orCi', 'rrCi', 'rdCi', 'lrCi'];
const OTHER_OPTIONS = ['variant', 'measure', 'posthoc', 'method', 'exact', 'weights', 'zeroCell', 'yates', 'continuityCorrection', 'cmhContinuity', 'homogeneity', 'quantileType', 'clusterSize', 'formula', 'z', 'fpc', 'per', 'scores', 'mu', 'intercept', 'roundUp'];

/**
 * Options only the M3a methods carry, and the options of theirs whose name an M1 or M2 method uses for something
 * else. `method` is adjust.pValues' p-value adjustment ("p-values adjusted by Holm"), but on reg.logistic it is the
 * Firth switch and on qpcr.relative it is Livak or Pfaffl; `test` is Kaplan-Meier's log-rank switch (never printed),
 * but on qpcr.relative it picks Welch or pooled variance. Per method: option name -> the dictionary slug its words
 * live under. A slug owns whole phrases, one per value (`runtime.opt.<slug>.<value>`, `.on` and `.off` for a boolean)
 * and a panel label (`runtime.optName.<slug>`). The phrases are not added to OPTION_VALUES, so a level someone
 * named "first" or "all" in a reference record is never rewritten in the options panel.
 */
export const SCOPED_OPTIONS = Object.freeze({
  'reg.logistic': Object.freeze({ method: 'logisticMethod' }),
  'qpcr.relative': Object.freeze({ method: 'qpcrMethod', test: 'qpcrTest', efficiency: 'efficiency' }),
  'nls.fourPL': Object.freeze({ model: 'model' }),
  'nls.doseResponse': Object.freeze({ model: 'model', compare: 'compare' }),
  'nls.equation': Object.freeze({ equation: 'equation' }),
  'calc.auc': Object.freeze({ baseline: 'baseline' }),
  'mv.pca': Object.freeze({ scale: 'scale' }),
});

/** Values that are what the method does when the option is absent, so the line does not announce them. */
const UNMARKED = Object.freeze({ 'reg.logistic:method': 'ml' });

/** Option values that have a display name (statistics names stay English in both languages). */
export const OPTION_VALUES = Object.freeze([
  'wilson', 'exact', 'wald', 'agresti-coull', 'exact-poisson', 'woolf', 'wald-log', 'score', 'newcombe', 'none',
  'haldane', 'rgb', 'greenland-robins', 'breslow-day-tarone', 'welch', 'pooled', 'paired', 'one-sample', 'tukey',
  'pairwise-t-holm', 'pairwise-t-bonferroni', 'holm', 'bonferroni', 'auto', 'normal', 'fisher-z', 'log', 'linear',
  'quadratic', 'anova-oneway', 'mean', 'n0', 'course', 'epiR', 'course-1.96', 'fleiss', 'fleiss-cc', 'course-pooled',
  'rank', 'OR', 'RR', 'wald-deff',
  // M2 [M2-DESIGN.md 3]
  'delong', 'feldt', 'profile', 'pairwise-t-sidak', 'pairwise-t-bh', 'sidak', 'bh', 'survey-logit', 'survey-mean', 'hodges-lehmann',
  // M3a: the interval Firth's correction reports
  'profile-penalised',
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

/** The phrase for a value of a scoped option (SCOPED_OPTIONS): runtime.opt.<slug>.<value>, .on/.off for a boolean. */
function scopedOptionText(slug, val, t) {
  if (typeof val === 'boolean') return t(`runtime.opt.${slug}.${val ? 'on' : 'off'}`);
  return t(`runtime.opt.${slug}.${valueSlug(val)}`);
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

  // An M2 method names a confidence level only when it reports an interval (power, randomisation and the
  // checks report none); the M1 lines are unchanged.
  const m2NoInterval = Boolean(AREA_OF[methodId]) && !Object.values(env.values || {}).some((v) => Array.isArray(v?.ci));
  if (!NO_CI.has(methodId) && !m2NoInterval && typeof opts.confLevel === 'number') {
    const level = Math.round(opts.confLevel * 1000) / 10;
    // The interval a value actually carries wins over the option asked for: the DEFF route widens a
    // Wald interval whatever the CI option says (review round 2: the line said Wilson).
    // Firth's correction (M3a) reports its intervals from the penalised likelihood, not the plain profile.
    const used = Object.values(env.values || {}).map((v) => v?.ciMethod).filter((m) => m === 'wald-deff' || m === 'survey-logit' || m === 'survey-mean' || m === 'profile-penalised');
    const ciMethods = CI_METHOD_OPTIONS.filter((k) => opts[k] !== undefined && opts[k] !== 'none')
      .map((k) => (k === 'ciMethod' && used.length ? used[0] : opts[k]))
      .map((m) => valueText(m, t));
    first.push(ciMethods.length ? t('runtime.prov.ciWith', { level, methods: ciMethods.join(', ') }) : t('runtime.prov.ci', { level }));
  }
  if (opts.alternative && opts.alternative !== 'two.sided') first.push(t(`runtime.prov.alternative.${opts.alternative === 'less' ? 'less' : 'greater'}`));
  const scoped = SCOPED_OPTIONS[methodId] || {};
  for (const name of OTHER_OPTIONS) {
    if (scoped[name]) continue; // this method's own words, below
    if (opts[name] === undefined || opts[name] === null) continue;
    if (name === 'mu' && opts.variant !== 'one-sample') continue;
    // "no pairwise comparisons" says nothing about the numbers shown
    if (name === 'posthoc' && opts[name] === 'none') continue;
    // In a cross-sectional study the Mantel-Haenszel ratios are prevalence ratios, as the result says.
    if (name === 'measure' && env.spec?.design === 'cross-sectional' && (opts.measure === 'RR' || opts.measure === 'OR')) {
      first.push(t('runtime.opt.measure', { value: t(`runtime.optv.${opts.measure === 'RR' ? 'PR' : 'POR'}`) }));
      continue;
    }
    first.push(optionValueText(name, opts[name], t));
  }
  // M3a options, each in the words of the method that carries it (a Firth result is not "adjusted" in any way).
  for (const [name, slug] of Object.entries(scoped)) {
    const val = opts[name];
    if (val === undefined || val === null || typeof val === 'object') continue; // a record (efficiency) is in the panel
    if (UNMARKED[`${methodId}:${name}`] === val) continue;
    // "no comparison between curves" says nothing about the numbers shown
    if (name === 'compare' && val === 'none') continue;
    // the two-group test is only a fact of the result when a t-test ran (three groups run the F test)
    if (slug === 'qpcrTest' && !(env.tests || []).some((x) => x.id === 'tTest')) continue;
    first.push(scopedOptionText(slug, val, t));
  }
  if (p.route && p.route !== 'none') first.push(t('runtime.prov.route', { route: t(`runtime.route.${valueSlug(p.route)}`) }));

  const second = [];
  const dropped = (p.rowsDropped || []).filter((d) => d.count > 0);
  const total = dropped.reduce((s, d) => s + d.count, 0);
  const used = typeof p.rowsUsed === 'number' ? p.rowsUsed : 0;
  // A calculation from typed parameters (sample size) reads no rows, so the rows line is left out
  // (review round 2: "used 0 rows, none left out" under every sample size).
  // A result the method refused before counting rows has no row count of its own: printing "used 0 rows"
  // beside the G24 note's "59 of 60 rows used" gave two counts for one result (review round 3).
  const noData = env.spec?.input?.kind === 'params' || (env.status !== 'ok' && !(p.rowsUsed > 0));
  if (noData) { /* no rows line */ } else if (total === 0) second.push(t('runtime.prov.rowsNoneDropped', { used }));
  else {
    const reasons = dropped.map((d) => t(`runtime.prov.drop.${d.reason}`, { column: d.column ? labelOf(d.column) : '', count: d.count }).trim()).join(', ');
    second.push(t('runtime.prov.rows', { used, dropped: total, reasons }));
  }
  if (p.dataFingerprint) second.push(t('runtime.prov.data', { hash: p.dataFingerprint.slice(0, 8) }));
  // The line always ends with the program version; the verification claim sits just before it.
  if (env.verified) second.push(t('runtime.prov.verified', { against: (p.validatedAgainst || []).map((f) => t(`runtime.family.fixture.${valueSlug(f)}`)).join(', ') }));
  second.push(t('runtime.prov.engine', { version: String(p.engineVersion || '').replace(/^research-studio-m\d+-/, '') }));
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
  const scoped = SCOPED_OPTIONS[env.provenance?.methodId || env.method?.id] || {};
  const out = [];
  for (const [name, val] of Object.entries(opts)) {
    const slug = scoped[name];
    if (slug) {
      let words;
      if (val && typeof val === 'object') {
        words = Object.keys(val).length === 0 ? t(`runtime.opt.${slug}.empty`) : Object.entries(val).map(([k, x]) => `${k}: ${x}`).join(', ');
      } else words = scopedOptionText(slug, val, t);
      out.push([t(`runtime.optName.${slug}`), words]);
      continue;
    }
    let shown;
    if (typeof val === 'boolean') shown = t(val ? 'runtime.prov.yes' : 'runtime.prov.no');
    else if (val && typeof val === 'object' && !Array.isArray(val)) shown = Object.entries(val).map(([k, x]) => `${k}: ${valueText(x, t)}`).join(', ');
    else shown = valueText(val, t);
    out.push([OPTION_NAMES.includes(name) ? t(`runtime.optName.${name}`) : name, shown]);
  }
  return out;
}
