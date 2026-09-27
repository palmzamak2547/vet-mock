// McNemar for paired binary data (continuity correction on by default, as R), with the exact
// binomial variant as an option [M1-DESIGN.md 7.14]. OWNER: stats role.

/** @returns {{ X2: number|null, df: 1, p: number, variant: 'corrected'|'uncorrected'|'exact' }} */
export function mcnemar(b, c, opts) { void b; void c; void opts; throw new Error('not implemented: stats/mcnemar.mcnemar'); }

/** Implementation for 'test.mcnemar'. @type {import('../runtime/registry.js').MethodImpl} */
export function runMcnemar(spec, table) { void spec; void table; throw new Error('not implemented: stats/mcnemar.runMcnemar'); }
