// runAnalysis: the one entry point every result goes through [M1-DESIGN.md 10.3]. Runs inside the
// worker (engine.worker.js) and in the main-thread fallback. Pure: no DOM, no storage, no network.
// OWNER: runtime role.
//
// Order: validateSpec -> normalizeSpec -> design check (epi/design.js allows the method?) ->
// guardrails (epi/guardrails.js) -> if no stop, IMPLEMENTED[method](spec, table) -> makeEnvelope
// with provenance (rows used and dropped with reasons, fingerprint, recipeRev, ENGINE_VERSION,
// validatedAgainst from the catalogue).

/**
 * @param {import('./types.js').AnalysisSpec} spec
 * @param {import('./types.js').WorkingTable|null} table   null for counts/params inputs
 * @param {import('./types.js').Codebook|null} codebook
 * @param {{ now?: () => Date }} [env]  clock injection for tests
 * @returns {import('./types.js').ResultEnvelope}
 */
export function runAnalysis(spec, table, codebook, env = {}) {
  void spec; void table; void codebook; void env;
  throw new Error('not implemented: runtime/run.runAnalysis');
}
