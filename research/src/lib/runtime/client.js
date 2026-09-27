// Main-thread client for the engine [M1-DESIGN.md 11]: a module worker when the browser has one,
// the same pure modules on the main thread otherwise (iOS 14), with watchdogs and cancel.
// OWNER: runtime role.

/**
 * @typedef {Object} Engine
 * @property {'worker'|'main-thread'} mode
 * @property {(bytes: ArrayBuffer) => Promise<{sheets: string[]}>} sheets
 * @property {(req: {bytes: ArrayBuffer, fileName: string, format?: string, encoding?: string, sheet?: string|null, headerRow?: number}, onProgress?: (p: {done: number, total: number}) => void) => Promise<import('../intake/preview.js').ParsePreview>} parse
 * @property {(raw: import('./types.js').RawTable, codebook: import('./types.js').Codebook, steps: import('./types.js').RecipeStep[]) => Promise<import('./types.js').WorkingTable>} apply
 * @property {(spec: import('./types.js').AnalysisSpec, table: import('./types.js').WorkingTable|null, codebook: import('./types.js').Codebook|null) => Promise<import('./types.js').ResultEnvelope>} run
 * @property {() => void} cancel   terminates the current worker (a new one starts on the next call)
 * @property {() => void} dispose  terminates the worker and drops memory; call on unmount
 */

/**
 * Start the engine. Tries `new Worker(new URL('./engine.worker.js', import.meta.url), { type: 'module' })`
 * and waits for HELLO within WATCHDOG_MS.hello; falls back to the main thread, which refuses inputs
 * larger than FALLBACK_LIMITS with error key 'runtime.engine.tooLargeForFallback'.
 * @param {{ preferWorker?: boolean }} [opts]
 * @returns {Promise<Engine>}
 */
export async function createEngine(opts = {}) {
  void opts;
  throw new Error('not implemented: runtime/client.createEngine');
}
