// AnalysisSpec: defaults, normalisation and validation [M1-DESIGN.md 10.1]. No hidden default ever
// decides a number: normalizeSpec() writes every option into the spec, the envelope stores the
// normalised spec, and the provenance line prints the options that change numbers.
// OWNER: data role (M2; runtime in M1). The M1 tables below stay here; each M2 area writes its own
// methods' defaults and allowed values in areas/<area>.options.js and they are merged in here
// [M2-DESIGN.md 2], so no two roles edit this file.
import * as v from 'valibot';
import { LEVELS } from '../intake/codebook.js';
import { AREA_DEFAULTS, AREA_ALLOWED, AREA_EXTEND_DEFAULTS, AREA_EXTEND_ALLOWED, AREA_DESIGNS } from './areas/index.js';

/** @typedef {import('./types.js').AnalysisSpec} AnalysisSpec */

/** Options every method carries. */
export const COMMON_OPTIONS = Object.freeze({ confLevel: 0.95, alternative: 'two.sided' });

/**
 * Per-method defaults. Allowed values for each option are in ALLOWED below (M1-DESIGN.md 10.1); the
 * valibot schema rejects anything else.
 */
const M1_DEFAULT_OPTIONS = {
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
  'ss.mean': { formula: 'normal', z: 'exact', roundUp: true },
  'ss.twoMeans': { formula: 'normal', z: 'exact', roundUp: true },
  'ss.paired': { formula: 'normal', z: 'exact', roundUp: true },
};

export const DEFAULT_OPTIONS = Object.freeze(withAreas(M1_DEFAULT_OPTIONS, AREA_DEFAULTS, AREA_EXTEND_DEFAULTS));

// ---- allowed values -----------------------------------------------------------------------
const bool = v.boolean();
const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);
const prob = v.pipe(v.number(), v.finite(), v.minValue(0), v.maxValue(1));
const z = pick(['exact', 'course-1.96']);
const exactAuto = pick(['auto', 'exact', 'normal']);
const measureNames = v.array(pick(['PR', 'POR', 'PD', 'RR', 'OR', 'RD', 'AFe', 'AFp', 'AFeEst', 'AFpEst']));

/** Per-method option schemas (besides confLevel and alternative). Every key is optional here; normalizeSpec fills it. */
const M1_ALLOWED = {
  'desc.summary': { quantileType: pick([7, 6]) },
  'desc.table1': {
    quantileType: pick([7, 6]),
    summaries: v.record(v.string(), pick(['median-iqr', 'mean-sd', 'n-percent'])),
    percentDenominator: pick(['known']),
    showMissing: bool,
    byLevel: bool,
    // Copied from the codebook by normalizeSpec: a variable measured on the farm is summarised over
    // farms, not over the animals that share it.
    columnLevels: v.record(v.string(), pick(LEVELS)),
    unitOfAnalysis: pick(LEVELS),
  },
  'freq.proportion': { ciMethod: pick(['wilson', 'exact', 'wald', 'agresti-coull']) },
  'freq.truePrevalence': { apparentCiMethod: pick(['wilson', 'exact', 'wald']), clip: bool, se: prob, sp: prob },
  'freq.incidenceRisk': { ciMethod: pick(['wilson', 'exact', 'wald']) },
  'freq.incidenceRate': { ciMethod: pick(['exact-poisson']), per: pick([1000, 100, 1]) },
  'epi.twoByTwo': {
    orCi: pick(['woolf', 'exact']), rrCi: pick(['wald-log', 'score']), rdCi: pick(['wald', 'newcombe']),
    zeroCell: pick(['none', 'haldane']), measures: measureNames,
  },
  'epi.mantelHaenszel': {
    measure: pick(['OR', 'RR']), orCi: pick(['rgb']), rrCi: pick(['greenland-robins']),
    cmhContinuity: bool, homogeneity: pick(['breslow-day-tarone', 'woolf']),
  },
  'test.chisq': { yates: bool },
  'test.fisher2x2': {},
  'test.mcnemar': { continuityCorrection: bool, exact: bool },
  'test.trend': { scores: v.union([pick(['rank']), v.pipe(v.array(v.pipe(v.number(), v.finite())), v.maxLength(1000))]) },
  'test.tTest': { variant: pick(['welch', 'pooled', 'paired', 'one-sample']), mu: v.pipe(v.number(), v.finite()) },
  'test.anova1': { posthoc: pick(['tukey', 'pairwise-t-holm', 'pairwise-t-bonferroni', 'none']) },
  'posthoc.tukey': {},
  'adjust.pValues': { method: pick(['holm', 'bonferroni', 'none']) },
  'test.mannWhitney': { exact: exactAuto, continuityCorrection: bool },
  'test.wilcoxonSignedRank': { exact: exactAuto, continuityCorrection: bool },
  'test.kruskalWallis': {},
  'corr.pearson': { ciMethod: pick(['fisher-z']) },
  'corr.spearman': { exact: exactAuto, ciMethod: pick(['none']) },
  'reg.ols': { intercept: bool },
  'dx.accuracy': { ciMethod: pick(['wilson', 'exact']), lrCi: pick(['log']) },
  'agree.kappa': { weights: pick(['none', 'linear', 'quadratic']) },
  'agree.percent': { ciMethod: pick(['wilson', 'exact']) },
  'cluster.iccDeff': { estimator: pick(['anova-oneway']), clusterSize: pick(['mean', 'n0']) },
  'ss.proportion': { z, fpc: pick(['course', 'epiR', 'none']), roundUp: bool },
  'ss.twoProportions': { formula: pick(['pooled', 'fleiss', 'fleiss-cc']), z, roundUp: bool },
  'ss.caseControl': { formula: pick(['course-pooled', 'fleiss', 'fleiss-cc']), z, roundUp: bool },
  'ss.mean': { formula: pick(['normal']), z, roundUp: bool },
  'ss.twoMeans': { formula: pick(['normal']), z, roundUp: bool },
  'ss.paired': { formula: pick(['normal']), z, roundUp: bool },
};

export const ALLOWED = Object.freeze(withAreas(M1_ALLOWED, AREA_ALLOWED, AREA_EXTEND_ALLOWED));

/**
 * M1's table, the areas' new methods, then the options areas add to existing methods (an extension
 * replaces an option of the same name, e.g. a longer allowed list).
 */
function withAreas(m1, added, extended) {
  const out = { ...m1 };
  for (const [id, opts] of Object.entries(added)) {
    if (out[id]) throw new Error(`spec: ${id} is defined by M1 and by an area`);
    out[id] = { ...opts };
  }
  for (const [id, opts] of Object.entries(extended)) {
    if (!out[id]) throw new Error(`spec: an area extends unknown method ${id}`);
    out[id] = { ...out[id], ...opts };
  }
  return out;
}

export const METHOD_IDS = Object.freeze(Object.keys(DEFAULT_OPTIONS));
// M2 adds factorB (two-way ANOVA), subject (repeated measures, Friedman), event (survival), items
// (Cronbach) and test2 (a second test on the same animals, ROC comparison) [M2-DESIGN.md 3].
export const ROLE_NAMES = Object.freeze(['outcome', 'exposure', 'group', 'x', 'y', 'strata', 'cluster', 'pair', 'raterA', 'raterB', 'test', 'reference', 'time', 'covariates', 'factorB', 'subject', 'event', 'items', 'test2']);
export const LEVEL_NAMES = Object.freeze(['outcomePositive', 'exposureLevel', 'referenceLevel', 'testPositive', 'referencePositive', 'order', 'controlLevel']);
export const DESIGN_IDS = Object.freeze(['cross-sectional', 'cohort', 'case-control', 'trial', 'diagnostic', 'agreement', 'descriptive', ...AREA_DESIGNS.map((d) => d.id)]);
// M2: 'survey' (design-based interval, farms as sampling units) and 'robust' (cluster-robust SE for the
// regression models) [M2-DESIGN.md 3.2, 3.3].
export const CLUSTER_ROUTES = Object.freeze(['none', 'deff', 'mh-within', 'aggregate', 'survey', 'robust']);

const colKey = v.pipe(v.string(), v.maxLength(64));
const levelText = v.pipe(v.string(), v.maxLength(500));
const idText = v.pipe(v.string(), v.maxLength(64));
const plain = v.union([v.pipe(v.number(), v.finite()), v.pipe(v.string(), v.maxLength(500)), v.boolean(), v.null()]);
// Counts are nested JSON (a 2x2 table, a list of strata, a k x k agreement table) of plain values.
/** @type {any} */
const countsValue = v.lazy(() => v.union([plain, v.pipe(v.array(countsValue), v.maxLength(10000)), v.record(v.pipe(v.string(), v.maxLength(64)), countsValue)]));

const baseSchema = v.strictObject({
  specVersion: v.literal(1),
  method: v.picklist(METHOD_IDS),
  input: v.variant('kind', [
    v.strictObject({ kind: v.literal('dataset'), datasetId: idText, recipeRev: v.pipe(v.number(), v.integer(), v.minValue(0)) }),
    v.strictObject({ kind: v.literal('counts'), counts: v.record(v.pipe(v.string(), v.maxLength(64)), countsValue) }),
    // Parameters are plain values or flat lists of them (adjust.pValues takes p = [0.01, 0.04, ...] and labels).
    v.strictObject({ kind: v.literal('params'), params: v.record(v.pipe(v.string(), v.maxLength(64)), v.union([plain, v.pipe(v.array(plain), v.maxLength(10000))])) }),
  ]),
  design: v.nullable(v.picklist(DESIGN_IDS)),
  roles: v.strictObject(Object.fromEntries(ROLE_NAMES.map((r) => [r, v.optional(r === 'covariates' || r === 'strata' || r === 'items' ? v.union([colKey, v.pipe(v.array(colKey), v.maxLength(200))]) : colKey)]))),
  levels: v.strictObject(Object.fromEntries(LEVEL_NAMES.map((l) => [l, v.optional(v.nullable(l === 'order' ? v.pipe(v.array(levelText), v.maxLength(1000)) : levelText))]))),
  options: v.record(v.string(), v.unknown()),
  cluster: v.strictObject({ route: v.nullable(v.picklist(CLUSTER_ROUTES)), column: v.nullable(colKey) }),
});

const commonSchema = {
  confLevel: v.pipe(v.number(), v.finite(), v.minValue(0.5), v.maxValue(0.999)),
  alternative: v.picklist(['two.sided', 'less', 'greater']),
};

/**
 * Fill every option from COMMON_OPTIONS and DEFAULT_OPTIONS and resolve codebook-dependent choices
 * (Table 1 summaries from each column's type), then return a new spec. Never mutates the argument.
 * 'auto' choices that need the data (exact vs normal for rank tests) are resolved by the method and
 * written back into the envelope by run.js (output.resolvedOptions), with a note.
 * @param {AnalysisSpec} spec
 * @param {import('./types.js').Codebook|null} codebook
 * @returns {AnalysisSpec}
 */
export function normalizeSpec(spec, codebook) {
  const method = spec.method;
  const options = { ...COMMON_OPTIONS, ...clone(DEFAULT_OPTIONS[method] || {}), ...clone(spec.options || {}) };
  if (method === 'desc.table1') {
    options.summaries = table1Summaries(spec, codebook, options.summaries || {});
    if (codebook) {
      const levels = {};
      for (const c of codebook.columns || []) if (options.summaries[c.key] && LEVELS.includes(c.level)) levels[c.key] = c.level;
      options.columnLevels = { ...levels, ...(options.columnLevels || {}) };
      if (LEVELS.includes(codebook.unitOfAnalysis)) options.unitOfAnalysis = options.unitOfAnalysis || codebook.unitOfAnalysis;
    }
  }
  return {
    specVersion: 1,
    method,
    input: clone(spec.input),
    design: spec.design ?? null,
    roles: clone(spec.roles || {}),
    levels: clone(spec.levels || {}),
    options,
    cluster: { route: spec.cluster?.route ?? null, column: spec.cluster?.column ?? codebook?.clusterKey ?? null },
  };
}

/** Summaries per Table 1 column: typed choices kept, the rest from the codebook type. */
function table1Summaries(spec, codebook, given) {
  const out = { ...given };
  if (!codebook) return out;
  const wanted = spec.roles?.covariates ? [].concat(spec.roles.covariates) : null;
  for (const c of codebook.columns || []) {
    if (wanted && !wanted.includes(c.key)) continue;
    if (!wanted && (c.pii || c.hidden || c.type === 'id' || c.type === 'text' || c.type === 'date' || c.role === 'id' || c.key === codebook.clusterKey)) continue;
    if (out[c.key]) continue;
    if (c.type === 'continuous' || c.type === 'count') out[c.key] = 'median-iqr';
    else if (c.type === 'binary' || c.type === 'nominal' || c.type === 'ordinal') out[c.key] = 'n-percent';
  }
  return out;
}

/**
 * Validate a spec against the valibot schema. Unknown methods, unknown options and values outside
 * the allowed lists are errors. Accepts both raw specs (options partly given) and normalised ones.
 * @param {unknown} spec
 * @returns {{ ok: true, spec: AnalysisSpec } | { ok: false, issues: { path: string, key: string }[] }}
 */
export function validateSpec(spec) {
  const base = v.safeParse(baseSchema, spec);
  if (!base.success) return { ok: false, issues: base.issues.map(issueOut) };
  const s = /** @type {AnalysisSpec} */ (base.output);
  const allowed = ALLOWED[s.method];
  const optionSchema = v.strictObject(
    Object.fromEntries([
      ...Object.entries(commonSchema).map(([k, sch]) => [k, v.optional(sch)]),
      ...Object.entries(allowed).map(([k, sch]) => [k, v.optional(sch)]),
    ]),
  );
  const opts = v.safeParse(optionSchema, s.options);
  if (!opts.success) return { ok: false, issues: opts.issues.map((i) => issueOut(i, 'options')) };
  if (s.input.kind === 'dataset' && s.cluster.route && s.cluster.route !== 'none' && !s.cluster.column) {
    return { ok: false, issues: [{ path: 'cluster.column', key: 'runtime.spec.clusterColumnMissing' }] };
  }
  return { ok: true, spec: s };
}

function issueOut(issue, prefix = '') {
  const path = [prefix, v.getDotPath(issue) || ''].filter(Boolean).join('.');
  let key = 'runtime.spec.invalidValue';
  if (issue.type === 'strict_object') key = 'runtime.spec.unknownField';
  if (path === 'method') key = 'runtime.spec.unknownMethod';
  return { path, key };
}

function clone(x) {
  return x === undefined ? undefined : JSON.parse(JSON.stringify(x));
}

/**
 * A blank spec for a method, for the UI to fill: every option already written in.
 * @param {string} method
 * @param {AnalysisSpec['input']} input
 * @returns {AnalysisSpec}
 */
export function makeSpec(method, input, partial = {}) {
  return normalizeSpec({ specVersion: 1, method, input, design: null, roles: {}, levels: {}, options: {}, cluster: { route: null, column: null }, ...partial }, null);
}
