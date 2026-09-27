// Bland-Altman agreement: bias and limits of agreement for the difference as measured, as a percent of the
// mean, or as a ratio on the log scale; approximate intervals for the limits (Bland and Altman 1986, 1999);
// proportional bias as a regression of difference on mean [M2-DESIGN.md 3.3.2].
// OWNER: measure role. STUB(m2): each export throws until its owner fills it in.

/**
 * roles raterA (method A), raterB (method B), both numbers; options scale, loaMultiplier (1.96 or 2), loaCi, proportionalBias. Table 'points' (mean, difference) for the plot.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runBlandAltman(spec, table) {
  throw new Error('not implemented: epi/blandaltman.runBlandAltman');
}
