// Two-way ANOVA with interaction, Type III (sum-to-zero contrasts, as SPSS UNIANOVA) or Type II sums of
// squares [M2-DESIGN.md 3.1.1].
// OWNER: lab role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles outcome, group (factor A), factorB; options ssType, interaction, posthoc ('tukey' only when every cell has the same n).
 * Tests: one row per effect (A, B, A:B) with F, dfPair, p; values partial eta squared per effect; tables anova, cellMeans, marginalMeans, tukeyA, tukeyB.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runAnovaTwoWay(spec, table) {
  throw new Error('not implemented: stats/anova2.runAnovaTwoWay');
}

/**
 * Pure core: SS, df, F and p for A, B and A:B from the cell layout.
 * @param {number[]} y
 * @param {number[]} a     factor A level index per row
 * @param {number[]} b     factor B level index per row
 * @param {{ ssType: 'III'|'II', interaction: boolean }} opts
 * @returns {{ effects: { id: 'A'|'B'|'AB', ss: number, df: number, ms: number, F: number|null, p: number|null }[], residual: { ss: number, df: number, ms: number }, balanced: boolean }}
 */
export function anovaTwoWay(y, a, b, opts) {
  throw new Error('not implemented: stats/anova2.anovaTwoWay');
}
