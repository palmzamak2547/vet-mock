// Diagnostic test evaluation against a reference [M1-DESIGN.md 7.18]: Se, Sp, PPV, NPV, accuracy
// with Wilson or exact intervals; LR+ and LR- with log-method intervals (Simel et al. 1991).
// PPV and NPV carry note G19. OWNER: epi role.

/**
 * @param {{ TP: number, FN: number, FP: number, TN: number }} counts
 * @param {{ ciMethod: 'wilson'|'exact', confLevel: number }} opts
 * @returns {Object<string, import('../runtime/types.js').Value>}  Se, Sp, PPV, NPV, accuracy, LRpos, LRneg, prevalence
 */
export function diagnosticAccuracy(counts, opts) { void counts; void opts; throw new Error('not implemented: epi/diagnostic.diagnosticAccuracy'); }

/** Implementation for 'dx.accuracy'. @type {import('../runtime/registry.js').MethodImpl} */
export function runDiagnostic(spec, table) { void spec; void table; throw new Error('not implemented: epi/diagnostic.runDiagnostic'); }
