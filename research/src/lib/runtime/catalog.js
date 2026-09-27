// The method catalogue [M1-DESIGN.md 5]. One row per method the Studio has, will have, or has decided
// against. The landing chart, the design-first screen and the "ตรวจเทียบแล้ว" badge all read it, so
// what the page says stays true: `shipped` is derived from the registry (an implementation exists),
// `verified` from tests/fixtures (regen-verified). Names live in the i18n dictionaries under
// `nameKey`. OWNER: runtime role (rows for M2/M3 methods may be added by anyone through runtime).
import { IMPLEMENTED } from './registry.js';
import { VERIFIED } from './verified.generated.js';

/**
 * A family groups methods the way the Europe PMC counts do, so the landing chart can say which
 * families the Studio covers. `evidence` points into the committed files under src/landing/evidence.
 * @typedef {{ id: string, nameKey: string, evidence: { file: string, path: string }[] }} Family
 */

/** @type {Family[]} */
export const FAMILIES = [
  { id: 'anova', nameKey: 'runtime.family.anova', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.ANOVA' }] },
  { id: 'randomisation', nameKey: 'runtime.family.randomisation', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.randomization / blinding' }] },
  { id: 'ttest', nameKey: 'runtime.family.ttest', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.t-test' }] },
  { id: 'rankTwo', nameKey: 'runtime.family.rankTwo', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.Mann-Whitney/Wilcoxon' }] },
  { id: 'chisq', nameKey: 'runtime.family.chisq', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.chi-square' }] },
  { id: 'normality', nameKey: 'runtime.family.normality', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.Shapiro-Wilk' }] },
  { id: 'kruskal', nameKey: 'runtime.family.kruskal', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.Kruskal-Wallis' }] },
  { id: 'sampleSize', nameKey: 'runtime.family.sampleSize', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.sample size calculation' }] },
  { id: 'posthoc', nameKey: 'runtime.family.posthoc', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.post hoc (Tukey/Bonferroni/Dunn)' }] },
  { id: 'mixed', nameKey: 'runtime.family.mixed', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.mixed/random effects' }] },
  { id: 'logistic', nameKey: 'runtime.family.logistic', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.logistic regression' }] },
  { id: 'sesp', nameKey: 'runtime.family.sesp', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.sensitivity AND specificity' }] },
  { id: 'standardCurve', nameKey: 'runtime.family.standardCurve', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.standard curve / 4PL' }] },
  { id: 'multivariate', nameKey: 'runtime.family.multivariate', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.PCA / cluster / heatmap' }] },
  { id: 'correlation', nameKey: 'runtime.family.correlation', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.correlation (Pearson/Spearman)' }] },
  { id: 'anova2', nameKey: 'runtime.family.anova2', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.two-way ANOVA' }] },
  { id: 'roc', nameKey: 'runtime.family.roc', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.ROC' }] },
  { id: 'linear', nameKey: 'runtime.family.linear', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.linear regression' }] },
  { id: 'qpcr', nameKey: 'runtime.family.qpcr', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.qPCR 2-ddCt' }] },
  { id: 'kappa', nameKey: 'runtime.family.kappa', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.kappa' }] },
  { id: 'survival', nameKey: 'runtime.family.survival', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.survival (KM/log-rank/Cox)' }] },
  { id: 'questionnaire', nameKey: 'runtime.family.questionnaire', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.questionnaire / Cronbach' }] },
  { id: 'spatial', nameKey: 'runtime.family.spatial', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.map / GIS / spatial' }] },
  { id: 'fisher', nameKey: 'runtime.family.fisher', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: "cuvet.Fisher's exact" }] },
  { id: 'oddsRatio', nameKey: 'runtime.family.oddsRatio', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.odds ratio' }] },
  { id: 'doseResponse', nameKey: 'runtime.family.doseResponse', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.nonlinear/dose-response IC50 EC50' }] },
  { id: 'counts', nameKey: 'runtime.family.counts', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.Poisson/negative binomial' }] },
  { id: 'anovaRm', nameKey: 'runtime.family.anovaRm', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.repeated-measures ANOVA' }] },
  { id: 'riskRatio', nameKey: 'runtime.family.riskRatio', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.risk ratio/relative risk' }] },
  { id: 'pk', nameKey: 'runtime.family.pk', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.noncompartmental PK' }] },
  { id: 'meta', nameKey: 'runtime.family.meta', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.meta-analysis' }] },
  { id: 'friedman', nameKey: 'runtime.family.friedman', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.Friedman' }] },
  { id: 'blandAltman', nameKey: 'runtime.family.blandAltman', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.Bland-Altman' }] },
  { id: 'clustering', nameKey: 'runtime.family.clustering', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.intraclass/ICC or design effect' }] },
  { id: 'dunnett', nameKey: 'runtime.family.dunnett', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.Dunnett' }] },
  { id: 'gee', nameKey: 'runtime.family.gee', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.GEE' }] },
  { id: 'truePrevalence', nameKey: 'runtime.family.truePrevalence', evidence: [{ file: 'epmc-methods-2026-09-25.json', path: 'cuvet.true prevalence (Rogan-Gladen)' }] },
  { id: 'methodComparison', nameKey: 'runtime.family.methodComparison', evidence: [{ file: 'epmc-methods-2026-09-27.json', path: 'methods.Passing-Bablok / Deming' }] },
];

/**
 * @typedef {Object} MethodRow
 * @property {string} id
 * @property {string[]} families        FAMILIES ids the landing chart counts it under (may be empty)
 * @property {'M1'|'M2'|'M3'|'later'} milestone
 * @property {'stats'|'epi'|'runtime'|null} owner   builder role that implements it (M1 only)
 * @property {string} nameKey
 * @property {string[]} [designs]        designs whose screen offers it (see lib/epi/design.js)
 */

/** @type {MethodRow[]} */
export const METHODS = [
  // ---- M1 (brief scope) ------------------------------------------------------------------
  { id: 'desc.summary', families: [], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.desc.summary' },
  { id: 'desc.table1', families: [], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.desc.table1' },
  { id: 'freq.proportion', families: [], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.freq.proportion' },
  { id: 'freq.truePrevalence', families: ['truePrevalence'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.freq.truePrevalence' },
  { id: 'freq.incidenceRisk', families: [], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.freq.incidenceRisk' },
  { id: 'freq.incidenceRate', families: [], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.freq.incidenceRate' },
  { id: 'epi.twoByTwo', families: ['oddsRatio', 'riskRatio'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.epi.twoByTwo' },
  { id: 'epi.mantelHaenszel', families: ['oddsRatio', 'riskRatio'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.epi.mantelHaenszel' },
  { id: 'test.chisq', families: ['chisq'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.chisq' },
  { id: 'test.fisher2x2', families: ['fisher'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.fisher2x2' },
  { id: 'test.mcnemar', families: ['chisq'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.mcnemar' },
  { id: 'test.trend', families: ['chisq'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.trend' },
  { id: 'test.tTest', families: ['ttest'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.tTest' },
  { id: 'test.anova1', families: ['anova'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.anova1' },
  { id: 'posthoc.tukey', families: ['posthoc'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.posthoc.tukey' },
  { id: 'adjust.pValues', families: ['posthoc'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.adjust.pValues' },
  { id: 'test.mannWhitney', families: ['rankTwo'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.mannWhitney' },
  { id: 'test.wilcoxonSignedRank', families: ['rankTwo'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.wilcoxonSignedRank' },
  { id: 'test.kruskalWallis', families: ['kruskal'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.test.kruskalWallis' },
  { id: 'corr.pearson', families: ['correlation'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.corr.pearson' },
  { id: 'corr.spearman', families: ['correlation'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.corr.spearman' },
  { id: 'reg.ols', families: ['linear'], milestone: 'M1', owner: 'stats', nameKey: 'stats.method.reg.ols' },
  { id: 'dx.accuracy', families: ['sesp'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.dx.accuracy' },
  { id: 'agree.kappa', families: ['kappa'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.agree.kappa' },
  { id: 'agree.percent', families: ['kappa'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.agree.percent' },
  { id: 'cluster.iccDeff', families: ['clustering'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.cluster.iccDeff' },
  { id: 'ss.proportion', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.proportion' },
  { id: 'ss.twoProportions', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.twoProportions' },
  { id: 'ss.caseControl', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.caseControl' },
  { id: 'ss.mean', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.mean' },
  { id: 'ss.twoMeans', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.twoMeans' },
  { id: 'ss.paired', families: ['sampleSize'], milestone: 'M1', owner: 'epi', nameKey: 'epi.method.ss.paired' },
  // ---- M2 (competitor-gaps.md D1, D2, D5, D6, D7) ------------------------------------------
  { id: 'anova.twoWay', families: ['anova2'], milestone: 'M2', owner: null, nameKey: 'runtime.method.anova.twoWay' },
  { id: 'anova.repeated', families: ['anovaRm'], milestone: 'M2', owner: null, nameKey: 'runtime.method.anova.repeated' },
  { id: 'test.friedman', families: ['friedman'], milestone: 'M2', owner: null, nameKey: 'runtime.method.test.friedman' },
  { id: 'posthoc.dunn', families: ['posthoc'], milestone: 'M2', owner: null, nameKey: 'runtime.method.posthoc.dunn' },
  { id: 'posthoc.gamesHowell', families: ['posthoc'], milestone: 'M2', owner: null, nameKey: 'runtime.method.posthoc.gamesHowell' },
  { id: 'posthoc.dunnett', families: ['dunnett'], milestone: 'M2', owner: null, nameKey: 'runtime.method.posthoc.dunnett' },
  { id: 'diag.shapiro', families: ['normality'], milestone: 'M2', owner: null, nameKey: 'runtime.method.diag.shapiro' },
  { id: 'reg.logistic', families: ['logistic'], milestone: 'M2', owner: null, nameKey: 'runtime.method.reg.logistic' },
  { id: 'reg.poisson', families: ['counts'], milestone: 'M2', owner: null, nameKey: 'runtime.method.reg.poisson' },
  { id: 'roc.delong', families: ['roc'], milestone: 'M2', owner: null, nameKey: 'runtime.method.roc.delong' },
  { id: 'surv.kaplanMeier', families: ['survival'], milestone: 'M2', owner: null, nameKey: 'runtime.method.surv.kaplanMeier' },
  { id: 'agree.blandAltman', families: ['blandAltman'], milestone: 'M2', owner: null, nameKey: 'runtime.method.agree.blandAltman' },
  { id: 'rel.cronbach', families: ['questionnaire'], milestone: 'M2', owner: null, nameKey: 'runtime.method.rel.cronbach' },
  { id: 'design.randomisation', families: ['randomisation'], milestone: 'M2', owner: null, nameKey: 'runtime.method.design.randomisation' },
  // ---- M3 ------------------------------------------------------------------------------
  { id: 'reg.mixed', families: ['mixed'], milestone: 'M3', owner: null, nameKey: 'runtime.method.reg.mixed' },
  { id: 'reg.gee', families: ['gee'], milestone: 'M3', owner: null, nameKey: 'runtime.method.reg.gee' },
  { id: 'surv.cox', families: ['survival'], milestone: 'M3', owner: null, nameKey: 'runtime.method.surv.cox' },
  { id: 'nls.fourPL', families: ['standardCurve'], milestone: 'M3', owner: null, nameKey: 'runtime.method.nls.fourPL' },
  { id: 'nls.doseResponse', families: ['doseResponse'], milestone: 'M3', owner: null, nameKey: 'runtime.method.nls.doseResponse' },
  { id: 'qpcr.relative', families: ['qpcr'], milestone: 'M3', owner: null, nameKey: 'runtime.method.qpcr.relative' },
  { id: 'mv.pca', families: ['multivariate'], milestone: 'M3', owner: null, nameKey: 'runtime.method.mv.pca' },
  { id: 'map.points', families: ['spatial'], milestone: 'M3', owner: null, nameKey: 'runtime.method.map.points' },
  { id: 'agree.passingBablok', families: ['methodComparison'], milestone: 'M3', owner: null, nameKey: 'runtime.method.agree.passingBablok' },
  // ---- later ---------------------------------------------------------------------------
  { id: 'pk.nca', families: ['pk'], milestone: 'later', owner: null, nameKey: 'runtime.method.pk.nca' },
  { id: 'meta.analysis', families: ['meta'], milestone: 'later', owner: null, nameKey: 'runtime.method.meta.analysis' },
];

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
  return METHODS.map((m) => ({
    id: m.id,
    families: m.families,
    milestone: m.milestone,
    nameKey: m.nameKey,
    shipped: Boolean(IMPLEMENTED[m.id]),
    verified: Boolean(IMPLEMENTED[m.id]) && (VERIFIED[m.id] || []).length > 0,
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
