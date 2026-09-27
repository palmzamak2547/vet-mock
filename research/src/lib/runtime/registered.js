// The ids of methods that ship, kept apart from registry.js so the landing (which reads the catalogue
// for its chart) never pulls the statistics code into its chunk. registry.js builds IMPLEMENTED from
// this list; runtime adds an id here only after that method's fixture test is green.
// OWNER: data role. The M2 areas add their ids through areas/<area>.registered.js [M2-DESIGN.md 2].
import { AREA_REGISTERED } from './areas/registered.js';

/** @type {readonly string[]} */
// Registered 27 Sep 2026 23:45 (Asia/Bangkok) after every owner fixture test (stats-*, epi-*) and the
// R 4.6.0 parity test (rparity-engine, 202 cases) were green: 404 pass, 0 fail.
const M1_REGISTERED = [
  'desc.summary',
  'desc.table1',
  'freq.proportion',
  'freq.truePrevalence',
  'freq.incidenceRisk',
  'freq.incidenceRate',
  'epi.twoByTwo',
  'epi.mantelHaenszel',
  'test.chisq',
  'test.fisher2x2',
  'test.mcnemar',
  'test.trend',
  'test.tTest',
  'test.anova1',
  'posthoc.tukey',
  'adjust.pValues',
  'test.mannWhitney',
  'test.wilcoxonSignedRank',
  'test.kruskalWallis',
  'corr.pearson',
  'corr.spearman',
  'reg.ols',
  'dx.accuracy',
  'agree.kappa',
  'agree.percent',
  'cluster.iccDeff',
  'ss.proportion',
  'ss.twoProportions',
  'ss.caseControl',
  'ss.mean',
  'ss.twoMeans',
  'ss.paired',
];

export const REGISTERED = Object.freeze([...M1_REGISTERED, ...AREA_REGISTERED]);
