// Diagnostics shown beside a result and never used to switch tests (methods.md anti-pattern 2): Shapiro-Wilk
// (Royston 1995, AS R94, as R shapiro.test), Q-Q points (R qqnorm), Brown-Forsythe [M2-DESIGN.md 3.1.5].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome, group (optional); options on 'residuals' (value minus its group mean, one test) or 'groups' (one test per group). n outside 3..5000 gives null with lab.undefined.shapiroN.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runShapiro(spec, table) {
  throw new Error('not implemented: stats/normality.runShapiro');
}

/**
 * roles outcome, group; options center 'median' (Brown-Forsythe) or 'mean' (Levene 1960): a one-way ANOVA on absolute deviations.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runBrownForsythe(spec, table) {
  throw new Error('not implemented: stats/normality.runBrownForsythe');
}

/**
 * @param {number[]} x
 * @returns {{ W: number, p: number }|null}
 */
export function shapiroWilk(x) {
  throw new Error('not implemented: stats/normality.shapiroWilk');
}

/**
 * Theoretical normal quantiles at R's ppoints(n) in the order of x (as qqnorm).
 * @param {number[]} x
 * @returns {{ theoretical: number[], sample: number[] }}
 */
export function qqPoints(x) {
  throw new Error('not implemented: stats/normality.qqPoints');
}
