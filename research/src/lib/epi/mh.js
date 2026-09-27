// Mantel-Haenszel across strata [M1-DESIGN.md 7.16]: OR (Robins-Breslow-Greenland CI), RR/PR
// (Greenland-Robins variance), CMH test with continuity correction (R's mantelhaen.test default),
// Breslow-Day and Tarone homogeneity for OR, Woolf homogeneity for RR. Strata with fewer than two
// animals are skipped and counted. Also the "within-farm" G1 route: farm as the stratum.
// OWNER: epi role.

/**
 * @param {[[number, number], [number, number]][]} strata
 * @param {{ measure: 'OR'|'RR', cmhContinuity: boolean, confLevel: number }} opts
 * @returns {{ estimate: import('../runtime/types.js').Value, cmh: { X2: number, p: number }, homogeneity: { test: string, X2: number|null, df: number, p: number|null }, informative: number, skipped: number, strata: Object<string, import('../runtime/types.js').Value>[] }}
 */
export function mantelHaenszel(strata, opts) { void strata; void opts; throw new Error('not implemented: epi/mh.mantelHaenszel'); }

/** Implementation for 'epi.mantelHaenszel'. @type {import('../runtime/registry.js').MethodImpl} */
export function runMantelHaenszel(spec, table) { void spec; void table; throw new Error('not implemented: epi/mh.runMantelHaenszel'); }
