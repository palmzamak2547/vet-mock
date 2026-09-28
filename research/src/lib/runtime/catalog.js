// The method catalogue [M1-DESIGN.md 5]. One row per method the Studio has, will have, or has decided
// against. The landing chart, the design-first screen and the "ตรวจเทียบแล้ว" badge all read it, so
// what the page says stays true: `shipped` is derived from the registry (an implementation exists),
// `verified` from tests/fixtures (regen-verified). Names live in the i18n dictionaries under
// `nameKey`. OWNER: data role (M2; runtime in M1). The M2 rows were written by the architect with their
// owners; a new method id goes through the data role [M2-DESIGN.md 2].
import { REGISTERED } from './registered.js';
import { VERIFIED } from './verified.generated.js';

/**
 * A family groups methods the way the Europe PMC counts do, so the landing chart can say which
 * families the Studio covers. `evidence` points into the committed files under src/landing/evidence.
 * @typedef {{ id: string, nameKey: string, evidence: { file: string, path: string }[] }} Family
 */

// The two evidence files: 2026-09-25 counts CUVET papers ('cuvet.<term>'), 2026-09-27 the wider methods
// search ('methods.<term>'). The helpers keep the landing's first load small (the catalogue is on it).
const cuvet = (term) => ({ file: 'epmc-methods-2026-09-25.json', path: `cuvet.${term}` });
const methods = (term) => ({ file: 'epmc-methods-2026-09-27.json', path: `methods.${term}` });

/** @type {Omit<Family, 'nameKey'>[]} */
const FAMILY_ROWS = [
  { id: 'anova', evidence: [cuvet('ANOVA')] },
  { id: 'randomisation', evidence: [methods('randomization / blinding')] },
  { id: 'ttest', evidence: [cuvet('t-test')] },
  { id: 'rankTwo', evidence: [cuvet('Mann-Whitney/Wilcoxon')] },
  { id: 'chisq', evidence: [cuvet('chi-square')] },
  { id: 'normality', evidence: [methods('Shapiro-Wilk')] },
  { id: 'kruskal', evidence: [cuvet('Kruskal-Wallis')] },
  { id: 'sampleSize', evidence: [cuvet('sample size calculation')] },
  { id: 'posthoc', evidence: [cuvet('post hoc (Tukey/Bonferroni/Dunn)')] },
  { id: 'mixed', evidence: [cuvet('mixed/random effects')] },
  { id: 'logistic', evidence: [cuvet('logistic regression')] },
  { id: 'sesp', evidence: [cuvet('sensitivity AND specificity')] },
  { id: 'standardCurve', evidence: [methods('standard curve / 4PL')] },
  { id: 'multivariate', evidence: [methods('PCA / cluster / heatmap')] },
  { id: 'correlation', evidence: [cuvet('correlation (Pearson/Spearman)')] },
  { id: 'anova2', evidence: [methods('two-way ANOVA')] },
  { id: 'roc', evidence: [methods('ROC / AUC')] },
  { id: 'linear', evidence: [cuvet('linear regression')] },
  { id: 'qpcr', evidence: [methods('qPCR 2-ddCt')] },
  { id: 'kappa', evidence: [cuvet('kappa')] },
  { id: 'survival', evidence: [cuvet('survival (KM/log-rank/Cox)')] },
  { id: 'questionnaire', evidence: [methods('questionnaire / Cronbach')] },
  { id: 'spatial', evidence: [methods('map / GIS / spatial')] },
  { id: 'fisher', evidence: [cuvet("Fisher's exact")] },
  { id: 'oddsRatio', evidence: [cuvet('odds ratio')] },
  { id: 'doseResponse', evidence: [methods('nonlinear/dose-response IC50 EC50')] },
  { id: 'counts', evidence: [methods('Poisson / negative binomial')] },
  { id: 'anovaRm', evidence: [methods('repeated-measures ANOVA')] },
  { id: 'riskRatio', evidence: [cuvet('risk ratio/relative risk')] },
  { id: 'pk', evidence: [methods('noncompartmental PK')] },
  { id: 'meta', evidence: [methods('meta-analysis')] },
  { id: 'friedman', evidence: [methods('Friedman')] },
  { id: 'blandAltman', evidence: [methods('Bland-Altman')] },
  { id: 'clustering', evidence: [cuvet('intraclass/ICC or design effect')] },
  { id: 'dunnett', evidence: [methods('Dunnett')] },
  { id: 'gee', evidence: [cuvet('GEE')] },
  { id: 'truePrevalence', evidence: [cuvet('true prevalence (Rogan-Gladen)')] },
  { id: 'methodComparison', evidence: [methods('Passing-Bablok / Deming')] },
];

/** Every family is named runtime.family.<id> (i18n/runtime.js). @type {Family[]} */
export const FAMILIES = FAMILY_ROWS.map((f) => ({ id: f.id, nameKey: `runtime.family.${f.id}`, evidence: f.evidence }));

/**
 * @typedef {Object} MethodRow
 * @property {string} id
 * @property {string[]} families        FAMILIES ids the landing chart counts it under (may be empty)
 * @property {'M1'|'M2'|'M3'|'later'} milestone
 * @property {'stats'|'epi'|'runtime'|'lab'|'models'|'measure'|'ui-tools'|null} owner   builder role that implements it (M1 and M2 rows)
 * @property {string} nameKey
 * @property {string[]} [designs]        designs whose screen offers it (see lib/epi/design.js)
 */

/** @type {Omit<MethodRow, 'nameKey'>[]} */
const METHOD_ROWS = [
  // ---- M1 (brief scope) ------------------------------------------------------------------
  { id: 'desc.summary', families: [], milestone: 'M1', owner: 'stats' },
  { id: 'desc.table1', families: [], milestone: 'M1', owner: 'stats' },
  { id: 'freq.proportion', families: [], milestone: 'M1', owner: 'epi' },
  { id: 'freq.truePrevalence', families: ['truePrevalence'], milestone: 'M1', owner: 'epi' },
  { id: 'freq.incidenceRisk', families: [], milestone: 'M1', owner: 'epi' },
  { id: 'freq.incidenceRate', families: [], milestone: 'M1', owner: 'epi' },
  { id: 'epi.twoByTwo', families: ['oddsRatio', 'riskRatio'], milestone: 'M1', owner: 'epi' },
  { id: 'epi.mantelHaenszel', families: ['oddsRatio', 'riskRatio'], milestone: 'M1', owner: 'epi' },
  { id: 'test.chisq', families: ['chisq'], milestone: 'M1', owner: 'stats' },
  { id: 'test.fisher2x2', families: ['fisher'], milestone: 'M1', owner: 'stats' },
  { id: 'test.mcnemar', families: ['chisq'], milestone: 'M1', owner: 'stats' },
  { id: 'test.trend', families: ['chisq'], milestone: 'M1', owner: 'stats' },
  { id: 'test.tTest', families: ['ttest'], milestone: 'M1', owner: 'stats' },
  { id: 'test.anova1', families: ['anova'], milestone: 'M1', owner: 'stats' },
  { id: 'posthoc.tukey', families: ['posthoc'], milestone: 'M1', owner: 'stats' },
  { id: 'adjust.pValues', families: ['posthoc'], milestone: 'M1', owner: 'stats' },
  { id: 'test.mannWhitney', families: ['rankTwo'], milestone: 'M1', owner: 'stats' },
  { id: 'test.wilcoxonSignedRank', families: ['rankTwo'], milestone: 'M1', owner: 'stats' },
  { id: 'test.kruskalWallis', families: ['kruskal'], milestone: 'M1', owner: 'stats' },
  { id: 'corr.pearson', families: ['correlation'], milestone: 'M1', owner: 'stats' },
  { id: 'corr.spearman', families: ['correlation'], milestone: 'M1', owner: 'stats' },
  { id: 'reg.ols', families: ['linear'], milestone: 'M1', owner: 'stats' },
  { id: 'dx.accuracy', families: ['sesp'], milestone: 'M1', owner: 'epi' },
  { id: 'agree.kappa', families: ['kappa'], milestone: 'M1', owner: 'epi' },
  { id: 'agree.percent', families: ['kappa'], milestone: 'M1', owner: 'epi' },
  { id: 'cluster.iccDeff', families: ['clustering'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.proportion', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.twoProportions', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.caseControl', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.mean', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.twoMeans', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  { id: 'ss.paired', families: ['sampleSize'], milestone: 'M1', owner: 'epi' },
  // ---- M2 (competitor-gaps.md D1, D2, D5, D7; M2-DESIGN.md 3) -------------------------------
  { id: 'anova.twoWay', families: ['anova2', 'anova'], milestone: 'M2', owner: 'lab' },
  { id: 'anova.repeated', families: ['anovaRm', 'anova'], milestone: 'M2', owner: 'lab' },
  { id: 'test.friedman', families: ['friedman'], milestone: 'M2', owner: 'lab' },
  { id: 'posthoc.dunn', families: ['posthoc'], milestone: 'M2', owner: 'lab' },
  { id: 'posthoc.gamesHowell', families: ['posthoc'], milestone: 'M2', owner: 'lab' },
  { id: 'posthoc.dunnett', families: ['dunnett', 'posthoc'], milestone: 'M2', owner: 'lab' },
  { id: 'diag.shapiro', families: ['normality'], milestone: 'M2', owner: 'lab' },
  { id: 'diag.brownForsythe', families: [], milestone: 'M2', owner: 'lab' },
  { id: 'power.anova', families: ['sampleSize'], milestone: 'M2', owner: 'lab' },
  { id: 'power.tTest', families: ['sampleSize'], milestone: 'M2', owner: 'lab' },
  { id: 'power.correlation', families: ['sampleSize'], milestone: 'M2', owner: 'lab' },
  { id: 'power.regression', families: ['sampleSize'], milestone: 'M2', owner: 'lab' },
  { id: 'reg.logistic', families: ['logistic'], milestone: 'M2', owner: 'models' },
  { id: 'reg.poisson', families: ['counts'], milestone: 'M2', owner: 'models' },
  { id: 'surv.kaplanMeier', families: ['survival'], milestone: 'M2', owner: 'models' },
  { id: 'roc.delong', families: ['roc'], milestone: 'M2', owner: 'measure' },
  { id: 'agree.blandAltman', families: ['blandAltman'], milestone: 'M2', owner: 'measure' },
  { id: 'rel.cronbach', families: ['questionnaire'], milestone: 'M2', owner: 'measure' },
  { id: 'design.randomisation', families: ['randomisation'], milestone: 'M2', owner: 'ui-tools' },
  { id: 'design.sampling', families: [], milestone: 'M2', owner: 'ui-tools' },
  // ---- M3 ------------------------------------------------------------------------------
  { id: 'reg.mixed', families: ['mixed'], milestone: 'M3', owner: null },
  { id: 'reg.gee', families: ['gee'], milestone: 'M3', owner: null },
  { id: 'surv.cox', families: ['survival'], milestone: 'M3', owner: null },
  { id: 'nls.fourPL', families: ['standardCurve'], milestone: 'M3', owner: null },
  { id: 'nls.doseResponse', families: ['doseResponse'], milestone: 'M3', owner: null },
  { id: 'qpcr.relative', families: ['qpcr'], milestone: 'M3', owner: null },
  { id: 'mv.pca', families: ['multivariate'], milestone: 'M3', owner: null },
  { id: 'map.points', families: ['spatial'], milestone: 'M3', owner: null },
  { id: 'agree.passingBablok', families: ['methodComparison'], milestone: 'M3', owner: null },
  // ---- later ---------------------------------------------------------------------------
  { id: 'pk.nca', families: ['pk'], milestone: 'later', owner: null },
  { id: 'meta.analysis', families: ['meta'], milestone: 'later', owner: null },
];

/**
 * Every method is named <area>.method.<id>: stats or epi for the M1 methods those roles own, runtime for
 * the rest (M2-DESIGN.md B2). Derived here rather than written 63 times: the catalogue is on the landing's
 * first load.
 * @type {MethodRow[]}
 */
export const METHODS = METHOD_ROWS.map((m) => ({ ...m, nameKey: `${m.owner === 'stats' || m.owner === 'epi' ? m.owner : 'runtime'}.method.${m.id}` }));

/**
 * @typedef {Object} CatalogEntry
 * @property {string} id
 * @property {string[]} families
 * @property {'M1'|'M2'|'M3'|'later'} milestone
 * @property {string} nameKey
 * @property {boolean} shipped           an implementation is registered (registry.js)
 * @property {boolean} verified          at least one fixture family covers it (verified.generated.js)
 * @property {string[]} validatedAgainst fixture family ids
 */

/** @returns {CatalogEntry[]} */
export function getCatalog() {
  const shipped = new Set(REGISTERED);
  return METHODS.map((m) => ({
    id: m.id,
    families: m.families,
    milestone: m.milestone,
    nameKey: m.nameKey,
    shipped: shipped.has(m.id),
    verified: shipped.has(m.id) && (VERIFIED[m.id] || []).length > 0,
    validatedAgainst: VERIFIED[m.id] || [],
  }));
}

/**
 * Status of a family for the landing chart: 'now' when any method in it ships today, otherwise the
 * earliest planned milestone ('M1' means planned for this release but not implemented yet).
 * Families with no methods are 'later'.
 * @param {string} familyId
 * @returns {'now'|'M1'|'M2'|'M3'|'later'}
 */
export function familyStatus(familyId) {
  const rows = getCatalog().filter((m) => m.families.includes(familyId));
  if (rows.some((m) => m.shipped)) return 'now';
  for (const ms of ['M1', 'M2', 'M3']) if (rows.some((m) => m.milestone === ms)) return ms;
  return 'later';
}

/** @param {string} id @returns {CatalogEntry|undefined} */
export function getMethod(id) {
  return getCatalog().find((m) => m.id === id);
}
