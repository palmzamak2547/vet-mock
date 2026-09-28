// Design first [M1-DESIGN.md 6; research-m1-brief.md scope]. The student names the study design;
// the Studio offers only the measures that design supports, and says why the others are missing.
// This table is the single source for the design screen and for run.js's design check (G3).
// OWNER: measure role (M2; epi in M1). The M2 areas add methods to these rows and new rows through
// lib/runtime/areas/<area>.options.js (offers, designs, designFree) [M2-DESIGN.md 2], merged below.
import { areaOffers, AREA_DESIGNS, AREA_DESIGN_FREE } from '../runtime/areas/index.js';
import { MEASURE_SHIPPED } from '../runtime/catalog.js';

/** A 'comes in M2' row stays on the design board only until the method it names ships. */
const untilShipped = (methodId, row) => (MEASURE_SHIPPED.includes(methodId) ? [] : [row]);

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
const M1_DESIGNS = [
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
    offers: [{ method: 'dx.accuracy' }, { method: 'freq.proportion' }, { method: 'freq.truePrevalence' }, { method: 'desc.summary' }],
    blocked: [
      { what: 'association measures (OR, RR)', reasonKey: 'epi.design.blocked.diagnosticNotAssociation' },
      ...untilShipped('roc.delong', { what: 'ROC and cut-offs', reasonKey: 'epi.design.blocked.rocIsM2' }),
    ],
    twoByTwoMeasures: {},
  },
  {
    id: 'agreement', nameKey: 'epi.design.agreement.name', descKey: 'epi.design.agreement.desc',
    offers: [{ method: 'agree.kappa' }, { method: 'agree.percent' }, { method: 'desc.summary' }],
    blocked: [
      { what: 'Pearson correlation as agreement', reasonKey: 'epi.design.blocked.correlationNotAgreement' },
      ...untilShipped('agree.blandAltman', { what: 'Bland-Altman', reasonKey: 'epi.design.blocked.blandAltmanIsM2' }),
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

/**
 * Every design: M1's rows, then the rows areas add, each with the methods areas add to it appended
 * after its own offers (a method already offered keeps its place and its measures).
 * @type {DesignRow[]}
 */
export const DESIGNS = [...M1_DESIGNS, ...AREA_DESIGNS].map((d) => ({
  ...d,
  offers: [...d.offers, ...areaOffers(d.id).filter((o) => !d.offers.some((x) => x.method === o.method))],
}));

/** Sample-size tools need no data file and no design; they are always offered. */
export const DESIGN_FREE_METHODS = Object.freeze(['ss.proportion', 'ss.twoProportions', 'ss.caseControl', 'ss.mean', 'ss.twoMeans', 'ss.paired', 'adjust.pValues', ...AREA_DESIGN_FREE]);

/**
 * @param {string|null} designId
 * @param {string} methodId
 * @param {string[]|null} [requestedMeasures]  2x2 measures asked for (options.measures); each must be offered
 * @returns {{ allowed: boolean, reasonKey: string|null, measures: string[]|null, measure?: string }}
 */
export function checkDesign(designId, methodId, requestedMeasures = null) {
  if (DESIGN_FREE_METHODS.includes(methodId)) return { allowed: true, reasonKey: null, measures: null };
  // Post hoc comparisons belong to the ANOVA they follow.
  const lookup = methodId === 'posthoc.tukey' ? 'test.anova1' : methodId;
  if (!designId) return { allowed: false, reasonKey: 'epi.design.needDesign', measures: null };
  const design = DESIGNS.find((d) => d.id === designId);
  if (!design) return { allowed: false, reasonKey: 'epi.design.unknown', measures: null };
  const offer = design.offers.find((o) => o.method === lookup);
  if (!offer) return { allowed: false, reasonKey: BLOCK_REASON[designId]?.[lookup] ?? 'epi.design.blocked.notOffered', measures: null };
  const measures = offer.measures ?? null;
  if (measures && Array.isArray(requestedMeasures) && requestedMeasures.length) {
    const bad = requestedMeasures.find((m) => !measures.includes(m));
    if (bad) return { allowed: false, reasonKey: MEASURE_BLOCK_REASON[designId]?.[bad] ?? 'epi.design.blocked.measureNotOffered', measures, measure: bad };
  }
  return { allowed: true, reasonKey: null, measures };
}

/** Why a method is missing from a design (the reason keys of DESIGNS[].blocked, per method). */
export const BLOCK_REASON = Object.freeze({
  'cross-sectional': {
    'freq.incidenceRisk': 'epi.design.blocked.noFollowUp',
    'freq.incidenceRate': 'epi.design.blocked.noAnimalTime',
    'dx.accuracy': 'epi.design.blocked.notDiagnostic',
    'agree.kappa': 'epi.design.blocked.notAgreement',
    'agree.percent': 'epi.design.blocked.notAgreement',
    'test.mcnemar': 'epi.design.blocked.notPaired',
    'test.wilcoxonSignedRank': 'epi.design.blocked.notPaired',
  },
  cohort: {
    'freq.proportion': 'epi.design.blocked.cohortNotPrevalence',
    'freq.truePrevalence': 'epi.design.blocked.cohortNotPrevalence',
    'dx.accuracy': 'epi.design.blocked.notDiagnostic',
    'agree.kappa': 'epi.design.blocked.notAgreement',
    'agree.percent': 'epi.design.blocked.notAgreement',
  },
  'case-control': {
    'freq.proportion': 'epi.design.blocked.caseControlNoPrevalence',
    'freq.truePrevalence': 'epi.design.blocked.caseControlNoPrevalence',
    'freq.incidenceRisk': 'epi.design.blocked.caseControlNoRisk',
    'freq.incidenceRate': 'epi.design.blocked.caseControlNoRisk',
    'dx.accuracy': 'epi.design.blocked.notDiagnostic',
    'agree.kappa': 'epi.design.blocked.notAgreement',
    'agree.percent': 'epi.design.blocked.notAgreement',
  },
  trial: {
    'freq.proportion': 'epi.design.blocked.trialNotPrevalence',
    'freq.truePrevalence': 'epi.design.blocked.trialNotPrevalence',
    'dx.accuracy': 'epi.design.blocked.notDiagnostic',
    'agree.kappa': 'epi.design.blocked.notAgreement',
    'agree.percent': 'epi.design.blocked.notAgreement',
  },
  diagnostic: {
    'epi.twoByTwo': 'epi.design.blocked.diagnosticNotAssociation',
    'epi.mantelHaenszel': 'epi.design.blocked.diagnosticNotAssociation',
    'test.chisq': 'epi.design.blocked.diagnosticNotAssociation',
    'test.fisher2x2': 'epi.design.blocked.diagnosticNotAssociation',
  },
  agreement: {
    'corr.pearson': 'epi.design.blocked.correlationNotAgreement',
    'corr.spearman': 'epi.design.blocked.correlationNotAgreement',
    'epi.twoByTwo': 'epi.design.blocked.notAssociationDesign',
    'test.chisq': 'epi.design.blocked.notAssociationDesign',
  },
  descriptive: {
    'epi.twoByTwo': 'epi.design.blocked.descriptiveNoComparison',
    'epi.mantelHaenszel': 'epi.design.blocked.descriptiveNoComparison',
    'test.chisq': 'epi.design.blocked.descriptiveNoComparison',
    'test.fisher2x2': 'epi.design.blocked.descriptiveNoComparison',
    'test.tTest': 'epi.design.blocked.descriptiveNoComparison',
    'test.anova1': 'epi.design.blocked.descriptiveNoComparison',
    'test.mannWhitney': 'epi.design.blocked.descriptiveNoComparison',
    'test.kruskalWallis': 'epi.design.blocked.descriptiveNoComparison',
  },
});

/** Why a 2x2 measure is missing from a design. */
export const MEASURE_BLOCK_REASON = Object.freeze({
  'cross-sectional': { RR: 'epi.design.blocked.noFollowUp', RD: 'epi.design.blocked.noFollowUp', OR: 'epi.design.blocked.useCrossSectionalNames', AFe: 'epi.design.blocked.noFollowUp', AFp: 'epi.design.blocked.noFollowUp' },
  cohort: { PR: 'epi.design.blocked.cohortNotPrevalence', POR: 'epi.design.blocked.cohortNotPrevalence', PD: 'epi.design.blocked.cohortNotPrevalence' },
  'case-control': { RR: 'epi.design.blocked.caseControlNoRisk', RD: 'epi.design.blocked.caseControlNoRisk', PR: 'epi.design.blocked.caseControlNoPrevalence', PD: 'epi.design.blocked.caseControlNoPrevalence', AFe: 'epi.design.blocked.caseControlNoRisk', AFp: 'epi.design.blocked.caseControlNoRisk' },
  trial: { PR: 'epi.design.blocked.trialNotPrevalence', POR: 'epi.design.blocked.trialNotPrevalence', PD: 'epi.design.blocked.trialNotPrevalence' },
});
