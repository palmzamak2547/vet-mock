// Lab track: options, guard membership and design offers for the M2 lab methods [M2-DESIGN.md 3.1].
// Pure data plus valibot schemas: spec.js, run.js and epi/design.js read this file, so it must never
// import statistics code (the landing reads the catalogue, and the catalogue must stay light).
// OWNER: lab role.
import * as v from 'valibot';

const bool = v.boolean();
const pick = (/** @type {readonly any[]} */ list) => v.picklist(list);
const posNum = v.pipe(v.number(), v.finite(), v.gtValue(0));
const solveFor = pick(['n', 'power']);

/** @type {import('./index.js').AreaOptions} */
export default {
  area: 'lab',
  defaults: {
    'anova.twoWay': { ssType: 'III', interaction: true, posthoc: 'none' },
    'anova.repeated': { sphericity: 'gg', mauchly: true },
    'test.friedman': {},
    'posthoc.dunn': { adjust: 'holm' },
    'posthoc.gamesHowell': {},
    'posthoc.dunnett': {},
    'diag.shapiro': { on: 'residuals' },
    'diag.brownForsythe': { center: 'median' },
    'power.anova': { solveFor: 'n', sigLevel: 0.05 },
    'power.tTest': { type: 'two-sample', solveFor: 'n', sigLevel: 0.05 },
    'power.correlation': { solveFor: 'n', sigLevel: 0.05 },
    'power.regression': { solveFor: 'n', sigLevel: 0.05 },
  },
  allowed: {
    'anova.twoWay': { ssType: pick(['III', 'II', 'I']), interaction: bool, posthoc: pick(['none', 'tukey']) },
    'anova.repeated': { sphericity: pick(['gg', 'hf', 'none']), mauchly: bool },
    'test.friedman': {},
    'posthoc.dunn': { adjust: pick(['holm', 'bonferroni', 'sidak', 'bh', 'none']) },
    'posthoc.gamesHowell': {},
    'posthoc.dunnett': {},
    'diag.shapiro': { on: pick(['residuals', 'groups']) },
    'diag.brownForsythe': { center: pick(['median', 'mean']) },
    'power.anova': { solveFor, sigLevel: posNum },
    'power.tTest': { type: pick(['two-sample', 'paired', 'one-sample']), solveFor, sigLevel: posNum },
    'power.correlation': { solveFor, sigLevel: posNum },
    'power.regression': { solveFor, sigLevel: posNum },
  },
  // Options the lab role adds to M1 methods (M2-DESIGN.md 3.1): Sidak and Benjamini-Hochberg wherever an
  // adjustment is offered (adjust.pValues, the pairwise t tests after one-way ANOVA). Only the allowed
  // lists grow; no default changes, so M1 envelopes stay byte-identical. Hodges-Lehmann on the rank tests
  // (an extendDefaults entry) lands with its own tests.
  // Hodges-Lehmann estimate and interval on the M1 rank tests (3.1.6): a default, so their envelopes gain
  // `estimate` in provenance.options and a hodgesLehmann value (the M1 pins that list options say so).
  extendDefaults: {
    'test.mannWhitney': { estimate: 'hodges-lehmann' },
    'test.wilcoxonSignedRank': { estimate: 'hodges-lehmann' },
  },
  extendAllowed: {
    'test.mannWhitney': { estimate: pick(['hodges-lehmann', 'none']) },
    'test.wilcoxonSignedRank': { estimate: pick(['hodges-lehmann', 'none']) },
    'adjust.pValues': { method: pick(['holm', 'bonferroni', 'sidak', 'bh', 'none']) },
    'test.anova1': { posthoc: pick(['tukey', 'pairwise-t-holm', 'pairwise-t-bonferroni', 'pairwise-t-sidak', 'pairwise-t-bh', 'none']) },
  },
  // Methods that treat every row as an independent animal (G1 stops them on repeated farm ids).
  g1Subject: ['anova.twoWay', 'anova.repeated', 'test.friedman', 'posthoc.dunn', 'posthoc.gamesHowell', 'posthoc.dunnett'],
  // No data file and no design needed.
  designFree: ['power.anova', 'power.tTest', 'power.correlation', 'power.regression'],
  // Which designs offer each method (appended to lib/epi/design.js rows).
  offers: {
    'cross-sectional': ['anova.twoWay', 'test.friedman', 'posthoc.dunn', 'posthoc.gamesHowell', 'diag.shapiro', 'diag.brownForsythe'],
    cohort: ['anova.twoWay', 'anova.repeated', 'posthoc.dunn', 'posthoc.gamesHowell', 'diag.shapiro', 'diag.brownForsythe'],
    trial: ['anova.twoWay', 'anova.repeated', 'test.friedman', 'posthoc.dunn', 'posthoc.gamesHowell', 'posthoc.dunnett', 'diag.shapiro', 'diag.brownForsythe'],
    experiment: [
      'desc.summary', 'desc.table1', 'test.tTest', 'test.anova1', 'test.mannWhitney', 'test.wilcoxonSignedRank', 'test.kruskalWallis',
      'corr.pearson', 'corr.spearman', 'reg.ols', 'test.chisq', 'test.fisher2x2', 'cluster.iccDeff',
      'anova.twoWay', 'anova.repeated', 'test.friedman', 'posthoc.dunn', 'posthoc.gamesHowell', 'posthoc.dunnett', 'diag.shapiro', 'diag.brownForsythe',
    ],
  },
  // A design this area adds (laboratory or animal experiment, ARRIVE 2.0). Its words live in i18n/lab.js.
  routes: [],
  designs: [
    {
      id: 'experiment', nameKey: 'lab.design.experiment.name', descKey: 'lab.design.experiment.desc',
      offers: [],
      blocked: [{ what: 'prevalence', reasonKey: 'lab.design.blocked.experimentNotPrevalence' }],
      twoByTwoMeasures: {},
    },
  ],
};
