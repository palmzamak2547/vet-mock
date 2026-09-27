// 2x2 measures by design [M1-DESIGN.md 7.15]. Table layout everywhere: rows exposure (exposed,
// reference), columns outcome (positive, negative): [[a, b], [c, d]].
// Measures: RR/PR (Wald on log, Katz; score, Koopman), OR/POR (Woolf; exact through Fisher's
// conditional MLE), RD/PD (Wald; Newcombe hybrid score, method 10), AFe = (RR - 1)/RR,
// AFp = (Rt - R0)/Rt; for case-control AFe_est = (OR - 1)/OR and AFp_est = AFe_est x a/(a + c).
// A zero cell makes a ratio undefined (null with reasonKey) unless zeroCell: 'haldane' is chosen.
// OWNER: epi role.

/**
 * @param {[[number, number], [number, number]]} t
 * @param {{ measures: string[], orCi: 'woolf'|'exact', rrCi: 'wald-log'|'score', rdCi: 'wald'|'newcombe', zeroCell: 'none'|'haldane', confLevel: number }} opts
 * @returns {Object<string, import('../runtime/types.js').Value>}
 */
export function twoByTwo(t, opts) { void t; void opts; throw new Error('not implemented: epi/twobytwo.twoByTwo'); }

/** Implementation for 'epi.twoByTwo'. @type {import('../runtime/registry.js').MethodImpl} */
export function runTwoByTwo(spec, table) { void spec; void table; throw new Error('not implemented: epi/twobytwo.runTwoByTwo'); }
