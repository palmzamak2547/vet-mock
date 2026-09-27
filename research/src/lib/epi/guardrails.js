// Guardrails that need no R [M1-DESIGN.md 7.20; methods.md section 4]. evaluateGuards() runs
// before every method (run.js) and never computes a p-value itself. OWNER: epi role.

/**
 * The M1 set. Severity and what each needs are fixed here; messages live in i18n/epi.js under
 * `epi.guard.<id>.*`. Guardrails not listed need models or time-to-event data (M2/M3):
 * G14 (events per variable), G15 (selection path), G21 (repeated measures), G22 (censoring), G23 (overdispersion).
 */
export const GUARDS = Object.freeze([
  { id: 'G1', severity: 'stop', what: 'cluster column repeats among the rows used and no cluster route chosen' },
  { id: 'G2', severity: 'stop', what: 'exposure constant within every cluster while the outcome is per animal' },
  { id: 'G3', severity: 'stop', what: 'measure the declared design cannot support' },
  { id: 'G4', severity: 'warn', what: 'odds ratio shown for a common outcome (> 10%) in a cohort or cross-sectional study' },
  { id: 'G5', severity: 'warn', what: 'any expected count below 5 (Cochran: more than 20% below 5, or any below 1)' },
  { id: 'G6', severity: 'stop', what: 'pair column present, independent-samples test requested' },
  { id: 'G7', severity: 'warn', what: 'more than one test in a family without an adjustment choice' },
  { id: 'G8', severity: 'warn', what: 'the results text would say "no difference" from p > 0.05' },
  { id: 'G9', severity: 'stop', what: 'observed (post hoc) power requested' },
  { id: 'G10', severity: 'warn', what: 'SE, CI or p-values requested in Table 1' },
  { id: 'G11', severity: 'warn', what: 'a column marked confounder was never stratified or adjusted for' },
  { id: 'G12', severity: 'warn', what: 'stratum estimates heterogeneous (Breslow-Day or Tarone p < 0.05)' },
  { id: 'G13', severity: 'warn', what: 'a bin step cut a continuous variable at a data-derived point' },
  { id: 'G16', severity: 'stop', what: 'Pearson correlation used as agreement' },
  { id: 'G17', severity: 'warn', what: 'kappa without PABAK and indices, or unweighted kappa on ordinal scores' },
  { id: 'G18', severity: 'warn', what: 'apparent prevalence reported while the test Se or Sp is below 1' },
  { id: 'G19', severity: 'note', what: 'PPV or NPV depend on prevalence; the same test elsewhere gives other values' },
  { id: 'G20', severity: 'note', what: 'combining tests in series or parallel assumes they err independently' },
  { id: 'G24', severity: 'warn', what: 'rows used below rows recorded' },
  { id: 'G25', severity: 'warn', what: 'sample size without DEFF for a clustered design, without FPC for a small population, or without non-response' },
  { id: 'G26', severity: 'stop', what: 'import questions unanswered (era, date order, two-digit years, legacy encoding, Excel-date IDs)' },
]);

/**
 * @param {import('../runtime/types.js').AnalysisSpec} spec   normalised
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @param {import('../runtime/types.js').Codebook|null} codebook
 * @returns {{ stops: import('../runtime/types.js').GuardFinding[], warnings: import('../runtime/types.js').GuardFinding[], notes: import('../runtime/types.js').GuardFinding[] }}
 */
export function evaluateGuards(spec, table, codebook) { void spec; void table; void codebook; throw new Error('not implemented: epi/guardrails.evaluateGuards'); }

/**
 * The G1 panel shown before any route: ICC, DEFF and effective n computed first (cluster.iccDeff),
 * with the routes the data allow: 'mh-within' (factor varies inside farms), 'deff', 'aggregate'
 * (disabled with a reason when the factor is measured on the animal), and GEE/mixed as M3.
 * @returns {{ icc: import('../runtime/types.js').Value, deff: import('../runtime/types.js').Value, nEff: import('../runtime/types.js').Value, clusters: number, meanSize: number, routes: { id: string, enabled: boolean, reasonKey: string|null }[] }}
 */
export function clusterPanel(spec, table, codebook) { void spec; void table; void codebook; throw new Error('not implemented: epi/guardrails.clusterPanel'); }
