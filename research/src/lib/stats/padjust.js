// Multiplicity adjustment, as R's p.adjust; Holm is the default (G7) [M1-DESIGN.md 7.8]. OWNER: stats role.

/**
 * @param {(number|null)[]} p   nulls stay null and do not count toward m
 * @param {'holm'|'bonferroni'|'none'} method
 * @returns {(number|null)[]}
 */
export function pAdjust(p, method) { void p; void method; throw new Error('not implemented: stats/padjust.pAdjust'); }

/** Implementation for 'adjust.pValues' (a family of p-values entered or collected from results). @type {import('../runtime/registry.js').MethodImpl} */
export function runPAdjust(spec, table) { void spec; void table; throw new Error('not implemented: stats/padjust.runPAdjust'); }
