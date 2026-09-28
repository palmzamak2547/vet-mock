// Main-thread client for the engine [M1-DESIGN.md 11]: a module worker when the browser has one,
// the same pure modules on the main thread otherwise (iOS 14), with watchdogs and cancel.
// OWNER: runtime role.
import { OPS, REPLY, WATCHDOG_MS } from './protocol.js';

/**
 * @typedef {Object} Engine
 * @property {'worker'|'main-thread'} mode
 * @property {(bytes: ArrayBuffer) => Promise<{sheets: string[]}>} sheets
 * @property {(req: {bytes: ArrayBuffer, fileName: string, format?: string, encoding?: string, sheet?: string|null, headerRow?: number}, onProgress?: (p: {done: number, total: number}) => void) => Promise<import('../intake/preview.js').ParsePreview>} parse
 * @property {(raw: import('./types.js').RawTable, codebook: import('./types.js').Codebook, steps: import('./types.js').RecipeStep[], sources?: Record<string, { raw: import('./types.js').RawTable, codebook: import('./types.js').Codebook, steps: import('./types.js').RecipeStep[] }>|null) => Promise<import('./types.js').WorkingTable>} apply
 *   `sources`: the other datasets a merge step names, by dataset id (M2-DESIGN.md 4)
 * @property {(spec: import('./types.js').AnalysisSpec, table: import('./types.js').WorkingTable|null, codebook: import('./types.js').Codebook|null, steps?: import('./types.js').RecipeStep[]) => Promise<import('./types.js').ResultEnvelope>} run
 * @property {() => void} cancel   terminates the current worker (a new one starts on the next call)
 * @property {() => void} dispose  terminates the worker and drops memory; call on unmount
 */

/** An engine error as the UI receives it: `key` is an i18n key in runtime.js. */
export class EngineCallError extends Error {
  /** @param {{ code: string, key: string, detail?: string }} e */
  constructor(e) {
    super(e.detail || e.code);
    this.code = e.code;
    this.key = e.key;
    this.detail = e.detail || '';
    this.params = e.params || undefined;
  }
}

/** The one place the worker is constructed, written literally so the bundler emits it as a module worker. */
function spawnModuleWorker() {
  return new Worker(new URL('./engine.worker.js', import.meta.url), { type: 'module' });
}

/**
 * Start the engine. Tries a module worker and waits for HELLO within WATCHDOG_MS.hello; falls back to
 * the main thread, which refuses inputs larger than FALLBACK_LIMITS with 'runtime.engine.tooLargeForFallback'.
 * @param {{ preferWorker?: boolean, createWorker?: () => any, loadCore?: () => Promise<{ handleRequest: Function, toEngineError: Function }>, watchdog?: Partial<typeof WATCHDOG_MS> }} [opts]
 *   createWorker, loadCore and watchdog are for tests
 * @returns {Promise<Engine>}
 */
export async function createEngine(opts = {}) {
  const limits = { ...WATCHDOG_MS, ...(opts.watchdog || {}) };
  const createWorker = opts.createWorker || (typeof Worker === 'function' ? spawnModuleWorker : null);
  const loadCore = opts.loadCore || (() => import('./engine-core.js'));
  const preferWorker = opts.preferWorker !== false && Boolean(createWorker);

  let disposed = false;
  let seq = 0;
  /** @type {any} */
  let worker = null;
  /** @type {Map<number, { resolve: Function, reject: Function, timer: any, onProgress?: Function }>} */
  const pending = new Map();
  let mode = /** @type {'worker'|'main-thread'} */ ('worker');
  let corePromise = null;

  const failAll = (err) => {
    for (const [id, p] of pending) {
      clearTimeout(p.timer);
      p.reject(new EngineCallError(err));
      pending.delete(id);
    }
  };

  const kill = () => {
    if (worker) {
      try { worker.terminate(); } catch { /* already gone */ }
      worker = null;
    }
  };

  const onMessage = (event) => {
    const msg = event.data || {};
    const p = pending.get(msg.id);
    if (!p) return;
    if (msg.type === REPLY.PROGRESS) {
      p.onProgress?.(msg.progress);
      return;
    }
    clearTimeout(p.timer);
    pending.delete(msg.id);
    if (msg.type === REPLY.RESULT) p.resolve(msg.result);
    else p.reject(new EngineCallError(msg.error || { code: 'failed', key: 'runtime.engine.failed' }));
  };

  const startWorker = () => {
    const w = createWorker();
    w.onmessage = onMessage;
    w.onerror = (ev) => {
      ev?.preventDefault?.();
      kill();
      failAll({ code: 'crashed', key: 'runtime.engine.workerCrashed', detail: String(ev?.message || '') });
    };
    w.onmessageerror = () => failAll({ code: 'crashed', key: 'runtime.engine.workerCrashed', detail: 'messageerror' });
    return w;
  };

  const post = (op, payload, transfer, onProgress, timeoutMs) => new Promise((resolve, reject) => {
    if (!worker) worker = startWorker();
    seq += 1;
    const id = seq;
    const timer = setTimeout(() => {
      pending.delete(id);
      kill();
      // Other requests on the same worker die with it.
      failAll({ code: 'restarted', key: 'runtime.engine.restarted' });
      reject(new EngineCallError({ code: 'timeout', key: 'runtime.engine.timeout', detail: op }));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer, onProgress });
    try {
      worker.postMessage({ id, op, payload }, transfer || []);
    } catch (e) {
      clearTimeout(timer);
      pending.delete(id);
      reject(new EngineCallError({ code: 'failed', key: 'runtime.engine.failed', detail: String(e?.message || e) }));
    }
  });

  const onMainThread = async (op, payload, onProgress) => {
    corePromise = corePromise || loadCore();
    const core = await corePromise;
    try {
      const { result } = await core.handleRequest(op, payload, { mode: 'main-thread', onProgress });
      return result;
    } catch (e) {
      throw new EngineCallError(core.toEngineError(e));
    }
  };

  // Cancellation for the main-thread fallback cannot stop a computation; it makes the caller stop
  // waiting and drops the answer.
  let epoch = 0;
  const call = async (op, payload, transfer, onProgress) => {
    if (disposed) throw new EngineCallError({ code: 'disposed', key: 'runtime.engine.disposed' });
    if (mode === 'worker') return post(op, payload, transfer, onProgress, limits[op] ?? limits.run);
    const mine = epoch;
    const result = await onMainThread(op, payload, onProgress);
    if (mine !== epoch || disposed) throw new EngineCallError({ code: 'cancelled', key: 'runtime.engine.cancelled' });
    return result;
  };

  if (preferWorker) {
    try {
      const hello = await post(OPS.HELLO, {}, [], undefined, limits.hello);
      if (!hello || !hello.engineVersion) throw new Error('no hello');
    } catch {
      kill();
      mode = 'main-thread';
    }
  } else {
    mode = 'main-thread';
  }

  return {
    get mode() { return mode; },
    sheets: (bytes) => call(OPS.SHEETS, { bytes }, []),
    parse: (req, onProgress) => call(OPS.PARSE, { ...req }, mode === 'worker' && req?.bytes instanceof ArrayBuffer ? [req.bytes] : [], onProgress),
    apply: (raw, codebook, steps, sources = null) => call(OPS.APPLY, { raw, codebook, steps, sources }, []),
    run: (spec, table, codebook, steps = []) => call(OPS.RUN, { spec, table, codebook, steps }, []),
    cancel() {
      epoch += 1;
      kill();
      failAll({ code: 'cancelled', key: 'runtime.engine.cancelled' });
    },
    dispose() {
      disposed = true;
      epoch += 1;
      kill();
      failAll({ code: 'disposed', key: 'runtime.engine.disposed' });
      corePromise = null;
    },
  };
}
