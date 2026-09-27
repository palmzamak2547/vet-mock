// Engine version and the worker message protocol [M1-DESIGN.md 11]. OWNER: runtime role.

/** Printed on every provenance line and stored in every envelope. Bump on any change to a method's numbers. */
export const ENGINE_VERSION = 'research-studio-m1-0.1.0';

/** Operations the engine accepts (worker and main-thread fallback share them). */
export const OPS = Object.freeze({
  HELLO: 'hello',     // -> { engineVersion, features: { xlsx: boolean } }
  SHEETS: 'sheets',   // { bytes: ArrayBuffer } -> { sheets: string[] }
  PARSE: 'parse',     // { bytes, fileName, format: 'auto'|'csv'|'tsv'|'xlsx', encoding: 'auto'|..., sheet, headerRow } -> ParsePreview
  APPLY: 'apply',     // { raw: RawTable, codebook, steps } -> WorkingTable (typed arrays transferred)
  RUN: 'run',         // { spec: AnalysisSpec, table: WorkingTable|null } -> ResultEnvelope
});

/** Messages the engine sends back. Every reply echoes the request id. */
export const REPLY = Object.freeze({ RESULT: 'result', PROGRESS: 'progress', ERROR: 'error' });

/** Watchdog limits in milliseconds; on expiry the client terminates the worker and starts a new one. */
export const WATCHDOG_MS = Object.freeze({ hello: 3000, sheets: 30000, parse: 60000, apply: 30000, run: 30000 });

/** Largest input the main-thread fallback accepts (iOS 14 has no module workers). */
export const FALLBACK_LIMITS = Object.freeze({ bytes: 2 * 1024 * 1024, rows: 20000 });

/**
 * @typedef {Object} EngineRequest
 * @property {number} id
 * @property {string} op        one of OPS
 * @property {Object} payload
 */

/**
 * @typedef {Object} EngineReply
 * @property {number} id
 * @property {'result'|'progress'|'error'} type
 * @property {Object} [result]
 * @property {{done: number, total: number}} [progress]
 * @property {{code: string, key: string, detail?: string}} [error]  key is an i18n key in runtime.js
 */
