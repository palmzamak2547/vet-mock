// Repeated-measures ANOVA: one within factor (time), optionally one between factor (a split-plot design),
// Greenhouse-Geisser and Huynh-Feldt corrections, Mauchly test [M2-DESIGN.md 3.1.2].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome, subject, time (within), group (between, optional); data in long form (one row per animal and time).
 * Animals missing any time are dropped with reason 'incomplete' and counted. options sphericity (which corrected p the sentence uses), mauchly.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runAnovaRepeated(spec, table) {
  throw new Error('not implemented: stats/anovarm.runAnovaRepeated');
}

/**
 * Epsilons from the covariance of the within-subject contrasts (R anova.mlm, test = 'Spherical').
 * @param {number[][]} wide       one row per subject, one column per time
 * @param {number[]} [between]     between-group index per subject
 * @returns {{ gg: number, hf: number, hfCapped: number, mauchlyW: number, mauchlyP: number, df: number }}
 */
export function sphericity(wide, between) {
  throw new Error('not implemented: stats/anovarm.sphericity');
}
