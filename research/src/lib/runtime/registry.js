// Method id -> implementation [M1-DESIGN.md 10.3]. A method counts as shipped only when it has a row
// in IMPLEMENTED, so the catalogue (and the landing chart that reads it) cannot claim a method that does
// not run. Each implementation takes (spec, table) and returns the partial envelope fields
// { status, values, tests, tables, used, dropped } that run.js wraps with provenance and guardrails.
// OWNER: data role (M2; runtime in M1). stats and epi export the functions; runtime adds the id to REGISTERED when the
// method's fixture test is green (tests/unit/runtime-registry.test.mjs checks that every registered
// function has left its "not implemented" stub).
import { runSummary } from '../stats/descriptive.js';
import { runTable1 } from '../stats/table1.js';
import { runChisq, runTrend } from '../stats/chisq.js';
import { runFisher } from '../stats/fisher.js';
import { runMcnemar } from '../stats/mcnemar.js';
import { runTTest } from '../stats/ttest.js';
import { runAnova1 } from '../stats/anova.js';
import { runPAdjust } from '../stats/padjust.js';
import { runMannWhitney, runSignedRank, runKruskalWallis } from '../stats/rank.js';
import { runPearson, runSpearman } from '../stats/correlation.js';
import { runOls } from '../stats/ols.js';
import { runProportion, runTruePrevalence, runIncidenceRisk, runIncidenceRate } from '../epi/frequency.js';
import { runTwoByTwo } from '../epi/twobytwo.js';
import { runMantelHaenszel } from '../epi/mh.js';
import { runDiagnostic } from '../epi/diagnostic.js';
import { runKappa, runPercentAgreement } from '../epi/kappa.js';
import { runIccDeff } from '../epi/cluster.js';
import { REGISTERED } from './registered.js';
import { AREA_CANDIDATES } from './areas/impl.js';
import { runSsProportion, runSsTwoProportions, runSsCaseControl, runSsMean, runSsTwoMeans, runSsPaired } from '../epi/samplesize.js';

/**
 * @typedef {import('./types.js').AnalysisSpec} AnalysisSpec
 * @typedef {import('./types.js').WorkingTable} WorkingTable
 * @typedef {Object} MethodOutput
 * @property {'ok'|'invalid'} status
 * @property {Object<string, import('./types.js').Value>} values
 * @property {import('./types.js').TestResult[]} tests
 * @property {{id: string, columns: string[], rows: (string|number|null)[][]}[]} tables
 * @property {number} used                      rows that entered the computation
 * @property {import('./types.js').Provenance['rowsDropped']} dropped
 * @property {Object} [resolvedOptions]        'auto' choices the method settled from the data (e.g. { exact: 'normal' })
 * @property {import('./types.js').GuardFinding[]} [notes]  sentences the method adds (e.g. why Wald degenerates at 0)
 * @property {import('./types.js').GuardFinding[]} [warnings]  warnings the method raises from its own fit (M2: G14, G23)
 * @typedef {(spec: AnalysisSpec, table: WorkingTable|null) => MethodOutput} MethodImpl
 */

/**
 * Every M1 method's implementation and the module that owns it. `module` is the path under
 * src/lib/, used by the registry test to find the source.
 * @type {Record<string, { impl: MethodImpl, module: string, fn: string }>}
 */
const M1_CANDIDATES = {
  'desc.summary': { impl: runSummary, module: 'stats/descriptive.js', fn: 'runSummary' },
  'desc.table1': { impl: runTable1, module: 'stats/table1.js', fn: 'runTable1' },
  'freq.proportion': { impl: runProportion, module: 'epi/frequency.js', fn: 'runProportion' },
  'freq.truePrevalence': { impl: runTruePrevalence, module: 'epi/frequency.js', fn: 'runTruePrevalence' },
  'freq.incidenceRisk': { impl: runIncidenceRisk, module: 'epi/frequency.js', fn: 'runIncidenceRisk' },
  'freq.incidenceRate': { impl: runIncidenceRate, module: 'epi/frequency.js', fn: 'runIncidenceRate' },
  'epi.twoByTwo': { impl: runTwoByTwo, module: 'epi/twobytwo.js', fn: 'runTwoByTwo' },
  'epi.mantelHaenszel': { impl: runMantelHaenszel, module: 'epi/mh.js', fn: 'runMantelHaenszel' },
  'test.chisq': { impl: runChisq, module: 'stats/chisq.js', fn: 'runChisq' },
  'test.fisher2x2': { impl: runFisher, module: 'stats/fisher.js', fn: 'runFisher' },
  'test.mcnemar': { impl: runMcnemar, module: 'stats/mcnemar.js', fn: 'runMcnemar' },
  'test.trend': { impl: runTrend, module: 'stats/chisq.js', fn: 'runTrend' },
  'test.tTest': { impl: runTTest, module: 'stats/ttest.js', fn: 'runTTest' },
  'test.anova1': { impl: runAnova1, module: 'stats/anova.js', fn: 'runAnova1' },
  // Tukey HSD is computed by the one-way ANOVA; the catalogue row exists so the landing's post hoc bar is honest.
  'posthoc.tukey': { impl: (spec, table) => runAnova1({ ...spec, options: { ...spec.options, posthoc: 'tukey' } }, table), module: 'stats/anova.js', fn: 'runAnova1' },
  'adjust.pValues': { impl: runPAdjust, module: 'stats/padjust.js', fn: 'runPAdjust' },
  'test.mannWhitney': { impl: runMannWhitney, module: 'stats/rank.js', fn: 'runMannWhitney' },
  'test.wilcoxonSignedRank': { impl: runSignedRank, module: 'stats/rank.js', fn: 'runSignedRank' },
  'test.kruskalWallis': { impl: runKruskalWallis, module: 'stats/rank.js', fn: 'runKruskalWallis' },
  'corr.pearson': { impl: runPearson, module: 'stats/correlation.js', fn: 'runPearson' },
  'corr.spearman': { impl: runSpearman, module: 'stats/correlation.js', fn: 'runSpearman' },
  'reg.ols': { impl: runOls, module: 'stats/ols.js', fn: 'runOls' },
  'dx.accuracy': { impl: runDiagnostic, module: 'epi/diagnostic.js', fn: 'runDiagnostic' },
  'agree.kappa': { impl: runKappa, module: 'epi/kappa.js', fn: 'runKappa' },
  'agree.percent': { impl: runPercentAgreement, module: 'epi/kappa.js', fn: 'runPercentAgreement' },
  'cluster.iccDeff': { impl: runIccDeff, module: 'epi/cluster.js', fn: 'runIccDeff' },
  'ss.proportion': { impl: runSsProportion, module: 'epi/samplesize.js', fn: 'runSsProportion' },
  'ss.twoProportions': { impl: runSsTwoProportions, module: 'epi/samplesize.js', fn: 'runSsTwoProportions' },
  'ss.caseControl': { impl: runSsCaseControl, module: 'epi/samplesize.js', fn: 'runSsCaseControl' },
  'ss.mean': { impl: runSsMean, module: 'epi/samplesize.js', fn: 'runSsMean' },
  'ss.twoMeans': { impl: runSsTwoMeans, module: 'epi/samplesize.js', fn: 'runSsTwoMeans' },
  'ss.paired': { impl: runSsPaired, module: 'epi/samplesize.js', fn: 'runSsPaired' },
};

/** M1's methods plus every area's (areas/impl.js); an id in both would be a mistake, caught at load. */
export const CANDIDATES = Object.freeze(mergeCandidates(M1_CANDIDATES, AREA_CANDIDATES));

function mergeCandidates(a, b) {
  for (const id of Object.keys(b)) if (a[id]) throw new Error(`registry: ${id} is registered by M1 and by an area`);
  return { ...a, ...b };
}

export { REGISTERED };

/** @type {Record<string, MethodImpl>} */
export const IMPLEMENTED = Object.freeze(Object.fromEntries(REGISTERED.map((id) => [id, CANDIDATES[id].impl])));
