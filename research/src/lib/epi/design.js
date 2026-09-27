// Design first [M1-DESIGN.md 6; research-m1-brief.md scope]. The student names the study design;
// the Studio offers only the measures that design supports, and says why the others are missing.
// This table is the single source for the design screen and for run.js's design check (G3).
// OWNER: epi role.

/**
 * @typedef {Object} DesignRow
 * @property {string} id
 * @property {string} nameKey
 * @property {string} descKey
 * @property {{ method: string, measures?: string[] }[]} offers      what the design screen lists as computable
 * @property {{ what: string, reasonKey: string }[]} blocked        shown as "คำนวณไม่ได้ และเหตุผล"
 * @property {Record<string, string>} twoByTwoMeasures             which measure epi.twoByTwo reports first ('primary') and which beside it
 */

/** @type {DesignRow[]} */
export const DESIGNS = [
  {
    id: 'cross-sectional', nameKey: 'epi.design.crossSectional.name', descKey: 'epi.design.crossSectional.desc',
    offers: [
      { method: 'freq.proportion' }, { method: 'freq.truePrevalence' },
      { method: 'epi.twoByTwo', measures: ['PR', 'POR', 'PD'] }, { method: 'epi.mantelHaenszel', measures: ['PR', 'POR'] },
      { method: 'test.chisq' }, { method: 'test.fisher2x2' }, { method: 'test.trend' },
      { method: 'desc.summary' }, { method: 'desc.table1' }, { method: 'cluster.iccDeff' },
      { method: 'test.tTest' }, { method: 'test.anova1' }, { method: 'test.mannWhitney' }, { method: 'test.kruskalWallis' },
      { method: 'corr.pearson' }, { method: 'corr.spearman' }, { method: 'reg.ols' },
    ],
    blocked: [
      { what: 'incidence, risk, RR', reasonKey: 'epi.design.blocked.noFollowUp' },
      { what: 'IRR', reasonKey: 'epi.design.blocked.noAnimalTime' },
      { what: 'treatment effect', reasonKey: 'epi.design.blocked.noRandomisation' },
    ],
    twoByTwoMeasures: { primary: 'PR', beside: 'POR' },
  },
  {
    id: 'cohort', nameKey: 'epi.design.cohort.name', descKey: 'epi.design.cohort.desc',
    offers: [
      { method: 'freq.incidenceRisk' }, { method: 'freq.incidenceRate' },
      { method: 'epi.twoByTwo', measures: ['RR', 'RD', 'AFe', 'AFp', 'OR'] }, { method: 'epi.mantelHaenszel', measures: ['RR', 'OR'] },
      { method: 'test.chisq' }, { method: 'test.fisher2x2' }, { method: 'test.trend' },
      { method: 'desc.summary' }, { method: 'desc.table1' }, { method: 'cluster.iccDeff' },
      { method: 'test.tTest' }, { method: 'test.anova1' }, { method: 'test.mannWhitney' }, { method: 'test.kruskalWallis' },
      { method: 'corr.pearson' }, { method: 'corr.spearman' }, { method: 'reg.ols' },
    ],
    blocked: [{ what: 'prevalence as the outcome measure', reasonKey: 'epi.design.blocked.cohortNotPrevalence' }],
    twoByTwoMeasures: { primary: 'RR', beside: 'OR' },
  },
  {
    id: 'case-control', nameKey: 'epi.design.caseControl.name', descKey: 'epi.design.caseControl.desc',
    offers: [
      { method: 'epi.twoByTwo', measures: ['OR', 'AFeEst', 'AFpEst'] }, { method: 'epi.mantelHaenszel', measures: ['OR'] },
      { method: 'test.chisq' }, { method: 'test.fisher2x2' }, { method: 'test.trend' }, { method: 'test.mcnemar' },
      { method: 'desc.summary' }, { method: 'desc.table1' }, { method: 'cluster.iccDeff' },
    ],
    blocked: [
      { what: 'risk, incidence, RR, RD', reasonKey: 'epi.design.blocked.caseControlNoRisk' },
      { what: 'prevalence', reasonKey: 'epi.design.blocked.caseControlNoPrevalence' },
    ],
    twoByTwoMeasures: { primary: 'OR', beside: null },
  },
  {
    id: 'trial', nameKey: 'epi.design.trial.name', descKey: 'epi.design.trial.desc',
    offers: [
      { method: 'epi.twoByTwo', measures: ['RR', 'RD', 'OR'] }, { method: 'epi.mantelHaenszel', measures: ['RR', 'OR'] },
      { method: 'test.chisq' }, { method: 'test.fisher2x2' }, { method: 'test.mcnemar' },
      { method: 'test.tTest' }, { method: 'test.anova1' }, { method: 'test.mannWhitney' }, { method: 'test.wilcoxonSignedRank' }, { method: 'test.kruskalWallis' },
      { method: 'desc.summary' }, { method: 'desc.table1' }, { method: 'cluster.iccDeff' }, { method: 'reg.ols' },
    ],
    blocked: [{ what: 'prevalence', reasonKey: 'epi.design.blocked.trialNotPrevalence' }],
    twoByTwoMeasures: { primary: 'RR', beside: 'RD' },
  },
  {
    id: 'diagnostic', nameKey: 'epi.design.diagnostic.name', descKey: 'epi.design.diagnostic.desc',
    offers: [{ method: 'dx.accuracy' }, { method: 'freq.proportion' }, { method: 'desc.summary' }],
    blocked: [
      { what: 'association measures (OR, RR)', reasonKey: 'epi.design.blocked.diagnosticNotAssociation' },
      { what: 'ROC and cut-offs', reasonKey: 'epi.design.blocked.rocIsM2' },
    ],
    twoByTwoMeasures: {},
  },
  {
    id: 'agreement', nameKey: 'epi.design.agreement.name', descKey: 'epi.design.agreement.desc',
    offers: [{ method: 'agree.kappa' }, { method: 'agree.percent' }, { method: 'desc.summary' }],
    blocked: [
      { what: 'Pearson correlation as agreement', reasonKey: 'epi.design.blocked.correlationNotAgreement' },
      { what: 'Bland-Altman', reasonKey: 'epi.design.blocked.blandAltmanIsM2' },
    ],
    twoByTwoMeasures: {},
  },
  {
    id: 'descriptive', nameKey: 'epi.design.descriptive.name', descKey: 'epi.design.descriptive.desc',
    offers: [
      { method: 'desc.summary' }, { method: 'desc.table1' }, { method: 'freq.proportion' }, { method: 'freq.truePrevalence' },
      { method: 'freq.incidenceRisk' }, { method: 'freq.incidenceRate' }, { method: 'cluster.iccDeff' },
    ],
    blocked: [{ what: 'comparisons between groups', reasonKey: 'epi.design.blocked.descriptiveNoComparison' }],
    twoByTwoMeasures: {},
  },
];

/** Sample-size tools need no data file and no design; they are always offered. */
export const DESIGN_FREE_METHODS = Object.freeze(['ss.proportion', 'ss.twoProportions', 'ss.caseControl', 'ss.mean', 'ss.twoMeans', 'ss.paired', 'adjust.pValues']);

/**
 * @param {string|null} designId
 * @param {string} methodId
 * @returns {{ allowed: boolean, reasonKey: string|null, measures: string[]|null }}
 */
export function checkDesign(designId, methodId) { void designId; void methodId; throw new Error('not implemented: epi/design.checkDesign'); }
