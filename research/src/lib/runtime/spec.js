// AnalysisSpec: defaults, normalisation and validation [M1-DESIGN.md 10.1]. No hidden default ever
// decides a number: normalizeSpec() writes every option into the spec, the envelope stores the
// normalised spec, and the provenance line prints the options that change numbers.
// OWNER: runtime role. stats/epi may propose option changes through runtime; the table below is
// the single place defaults live.

/** @typedef {import('./types.js').AnalysisSpec} AnalysisSpec */

/** Options every method carries. */
export const COMMON_OPTIONS = Object.freeze({ confLevel: 0.95, alternative: 'two.sided' });

/**
 * Per-method defaults. Allowed values for each option are listed in M1-DESIGN.md 10.1; the valibot
 * schema in this file rejects anything else.
 */
export const DEFAULT_OPTIONS = Object.freeze({
  'desc.summary': { quantileType: 7 },
  'desc.table1': { quantileType: 7, summaries: {}, percentDenominator: 'known', showMissing: true, byLevel: true },
  'freq.proportion': { ciMethod: 'wilson' },
  'freq.truePrevalence': { apparentCiMethod: 'wilson', clip: true },
  'freq.incidenceRisk': { ciMethod: 'wilson' },
  'freq.incidenceRate': { ciMethod: 'exact-poisson', per: 1000 },
  'epi.twoByTwo': { orCi: 'woolf', rrCi: 'wald-log', rdCi: 'wald', zeroCell: 'none' },
  'epi.mantelHaenszel': { measure: 'OR', orCi: 'rgb', rrCi: 'greenland-robins', cmhContinuity: true, homogeneity: 'breslow-day-tarone' },
  'test.chisq': { yates: false },
  'test.fisher2x2': {},
  'test.mcnemar': { continuityCorrection: true, exact: false },
  'test.trend': { scores: 'rank' },
  'test.tTest': { variant: 'welch', mu: 0 },
  'test.anova1': { posthoc: 'tukey' },
  'posthoc.tukey': {},
  'adjust.pValues': { method: 'holm' },
  'test.mannWhitney': { exact: 'auto', continuityCorrection: true },
  'test.wilcoxonSignedRank': { exact: 'auto', continuityCorrection: true },
  'test.kruskalWallis': {},
  'corr.pearson': { ciMethod: 'fisher-z' },
  'corr.spearman': { exact: 'auto', ciMethod: 'none' },
  'reg.ols': { intercept: true },
  'dx.accuracy': { ciMethod: 'wilson', lrCi: 'log' },
  'agree.kappa': { weights: 'none' },
  'agree.percent': { ciMethod: 'wilson' },
  'cluster.iccDeff': { estimator: 'anova-oneway', clusterSize: 'mean' },
  'ss.proportion': { z: 'exact', fpc: 'course', roundUp: true },
  'ss.twoProportions': { formula: 'pooled', z: 'exact', roundUp: true },
  'ss.caseControl': { formula: 'course-pooled', z: 'exact', roundUp: true },
  'ss.mean': { z: 'exact', roundUp: true },
  'ss.twoMeans': { formula: 'normal', z: 'exact', roundUp: true },
  'ss.paired': { formula: 'normal', z: 'exact', roundUp: true },
});

/**
 * Fill every option from COMMON_OPTIONS and DEFAULT_OPTIONS, resolve design-dependent choices
 * (e.g. which measures epi.twoByTwo reports, Table 1 summaries from the codebook), and return a new
 * spec. Never mutates the argument.
 * @param {AnalysisSpec} spec
 * @param {import('./types.js').Codebook|null} codebook
 * @returns {AnalysisSpec}
 */
export function normalizeSpec(spec, codebook) {
  void spec; void codebook;
  throw new Error('not implemented: runtime/spec.normalizeSpec');
}

/**
 * Validate a spec against the valibot schema. Unknown methods, unknown options and values outside
 * the allowed lists are errors.
 * @param {unknown} spec
 * @returns {{ ok: true, spec: AnalysisSpec } | { ok: false, issues: { path: string, key: string }[] }}
 */
export function validateSpec(spec) {
  void spec;
  throw new Error('not implemented: runtime/spec.validateSpec');
}
