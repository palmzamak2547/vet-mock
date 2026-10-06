// What the engine does for each operation [M1-DESIGN.md 11], shared by the module worker
// (engine.worker.js) and the main-thread fallback (client.js). Pure apart from crypto.subtle; no DOM,
// no storage, no network. OWNER: runtime role.
import { OPS, ENGINE_VERSION, FALLBACK_LIMITS } from './protocol.js';
import { runAnalysis } from './run.js';
import { fingerprint, fingerprintCodebook } from './fingerprint.js';

/** An engine failure with an i18n key (runtime.engine.*) and a short technical detail. */
export class EngineError extends Error {
  /** @param {string} code @param {string} key @param {string} [detail] */
  constructor(code, key, detail = '') {
    super(detail || code);
    this.code = code;
    this.key = key;
    this.detail = detail;
  }
}

/** The fill-ins of an error's message (a SavError's {max}), numbers and short strings only. */
function safeParams(p) {
  if (!p || typeof p !== 'object') return undefined;
  const out = {};
  for (const [k, v] of Object.entries(p)) if (typeof v === 'number' || (typeof v === 'string' && v.length <= 200)) out[k] = v;
  return Object.keys(out).length ? out : undefined;
}

/** @param {any} e @returns {{ code: string, key: string, detail?: string, params?: Object<string, string|number> }} */
export function toEngineError(e) {
  if (e && typeof e === 'object' && typeof e.key === 'string' && typeof e.code === 'string') return { code: e.code, key: e.key, detail: String(e.detail || '').slice(0, 300), params: safeParams(e.params) };
  // A reader's error (SavError, the column cap) carries the numbers its message names; they travel with the
  // key so the notice reads "over 20,000", not "{max}" (review round 4).
  if (e && typeof e === 'object' && typeof e.key === 'string') return { code: 'failed', key: e.key, detail: String(e.message || '').slice(0, 300), params: safeParams(e.params) };
  return { code: 'failed', key: 'runtime.engine.failed', detail: String(e?.message || e || '').slice(0, 300) };
}

/**
 * Every ArrayBuffer behind the typed arrays of a WorkingTable, once each, for postMessage's transfer list.
 * @param {import('./types.js').WorkingTable|null} table
 * @returns {ArrayBuffer[]}
 */
export function tableTransferables(table) {
  const out = new Set();
  if (!table || !table.columns) return [];
  for (const col of Object.values(table.columns)) {
    for (const arr of [col.values, col.missing]) {
      if (ArrayBuffer.isView(arr) && arr.buffer instanceof ArrayBuffer && arr.buffer.byteLength > 0) out.add(arr.buffer);
    }
  }
  return [...out];
}

/** Column keys in codebook order, then any column the recipe derived that the codebook does not list. */
export function fingerprintKeys(table, codebook) {
  const present = new Set(Object.keys(table.columns || {}));
  const keys = (codebook?.columns || []).map((c) => c.key).filter((k) => present.has(k));
  const rest = [...present].filter((k) => !keys.includes(k)).sort();
  return [...keys, ...rest];
}

/**
 * Handle one request.
 * @param {string} op
 * @param {any} payload
 * @param {{ mode: 'worker'|'main-thread', onProgress?: (p: {done: number, total: number}) => void }} ctx
 * @returns {Promise<{ result: any, transfer: Transferable[] }>}
 */
export async function handleRequest(op, payload, ctx) {
  const progress = ctx.onProgress || (() => {});
  const small = ctx.mode === 'main-thread';
  switch (op) {
    case OPS.HELLO:
      return { result: { engineVersion: ENGINE_VERSION, mode: ctx.mode, features: { xlsx: true } }, transfer: [] };

    case OPS.SHEETS: {
      const bytes = needBytes(payload);
      if (small) checkBytes(bytes);
      const { listSheets } = await import('../intake/xlsx.js');
      return { result: { sheets: await listSheets(bytes) }, transfer: [] };
    }

    case OPS.PARSE: {
      const bytes = needBytes(payload);
      if (small) checkBytes(bytes);
      progress({ done: 0, total: 2 });
      const { buildPreview } = await import('../intake/preview.js');
      const preview = await buildPreview(bytes, {
        fileName: String(payload.fileName || ''),
        format: payload.format || 'auto',
        encoding: payload.encoding || 'auto',
        sheet: payload.sheet ?? null,
        headerRow: payload.headerRow,
      });
      progress({ done: 1, total: 2 });
      if (small && preview?.raw?.rowCount > FALLBACK_LIMITS.rows) throw new EngineError('too-large', 'runtime.engine.tooLargeForFallback');
      progress({ done: 2, total: 2 });
      return { result: preview, transfer: [] };
    }

    case OPS.APPLY: {
      const { raw, codebook, steps, sources = null } = payload || {};
      if (!raw || !codebook) throw new EngineError('bad-request', 'runtime.engine.badRequest', 'apply needs raw and codebook');
      if (small && raw.rowCount > FALLBACK_LIMITS.rows) throw new EngineError('too-large', 'runtime.engine.tooLargeForFallback');
      if (sources != null && (typeof sources !== 'object' || Array.isArray(sources))) throw new EngineError('bad-request', 'runtime.engine.badRequest', 'sources must be an object');
      if (small && sources) for (const s of Object.values(sources)) if (s?.raw?.rowCount > FALLBACK_LIMITS.rows) throw new EngineError('too-large', 'runtime.engine.tooLargeForFallback');
      const { applyRecipe } = await import('../intake/recipe.js');
      // The fingerprint hashes the finished table, so rows brought in by a merge are covered by it.
      const table = applyRecipe(raw, codebook, steps || [], sources);
      table.fingerprint = await fingerprint(table, fingerprintKeys(table, codebook));
      table.codebookFingerprint = await fingerprintCodebook(table.codebook);
      return { result: table, transfer: ctx.mode === 'worker' ? tableTransferables(table) : [] };
    }

    case OPS.RUN: {
      const { spec, table = null, codebook = null, steps = [] } = payload || {};
      if (!spec) throw new EngineError('bad-request', 'runtime.engine.badRequest', 'run needs a spec');
      if (small && table && table.n > FALLBACK_LIMITS.rows) throw new EngineError('too-large', 'runtime.engine.tooLargeForFallback');
      const env = runAnalysis(spec, table, codebook, { steps });
      return { result: env, transfer: [] };
    }

    default:
      throw new EngineError('unknown-op', 'runtime.engine.unknownOp', String(op));
  }
}

function needBytes(payload) {
  const b = payload?.bytes;
  if (b instanceof ArrayBuffer) return b;
  if (ArrayBuffer.isView(b)) return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  throw new EngineError('bad-request', 'runtime.engine.badRequest', 'bytes must be an ArrayBuffer');
}

function checkBytes(bytes) {
  if (bytes.byteLength > FALLBACK_LIMITS.bytes) throw new EngineError('too-large', 'runtime.engine.tooLargeForFallback');
}
