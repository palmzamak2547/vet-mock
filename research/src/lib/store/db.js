// IndexedDB vmx-research-v1 [M1-DESIGN.md 9]. Owner-scoped keys, 3 s open timeout (Safari private
// windows), in-memory fallback that the UI announces, saves reported only on transaction complete.
// OWNER: runtime role.
//
// Both backends expose the same transaction interface, so every store module (projects, datasets,
// analyses, log, claim) runs unchanged on IndexedDB and on the memory fallback, and the unit tests run
// the memory backend in Node.

export const DB_NAME = 'vmx-research-v1';
export const DB_VERSION = 1;
export const OPEN_TIMEOUT_MS = 3000;

/** Object stores and their indexes. Every store keyPath is 'key' = `${owner}/${id}`. */
export const STORES = Object.freeze({
  projects: { indexes: ['owner'] },
  datasets: { indexes: ['owner', 'project'] },
  blocks: { indexes: ['owner', 'dataset'] },
  analyses: { indexes: ['owner', 'project'] },
  log: { indexes: ['owner', 'project'] },
});

export const STORE_NAMES = Object.freeze(Object.keys(STORES));

/** Rows per raw column block in the `blocks` store. */
export const BLOCK_ROWS = 4096;

/**
 * @param {import('../runtime/types.js').OwnerScope} owner
 * @param {string} id
 * @returns {string}
 */
export function ownerKey(owner, id) {
  if (!owner || !id || owner.includes('/')) throw new Error('ownerKey: bad owner or id');
  return `${owner}/${id}`;
}

/** 'guest' or 'u.<uuid>'; anything else is refused so a typo can never create a third scope. */
export function isOwner(owner) {
  return owner === 'guest' || (typeof owner === 'string' && /^u\.[0-9a-f-]{8,64}$/i.test(owner));
}

/** A store error the UI can translate: `key` is an i18n key in runtime.js. */
export class StoreError extends Error {
  /** @param {string} code @param {string} key @param {string} [detail] */
  constructor(code, key, detail = '') {
    super(detail || code);
    this.code = code;
    this.key = key;
  }
}

/**
 * The operations available inside one transaction. Every call returns a promise that settles while
 * the transaction is still active, so a read and the write that depends on it share one transaction.
 * @typedef {Object} TxOps
 * @property {(store: string, key: string) => Promise<any>} get
 * @property {(store: string, record: Object) => Promise<void>} put
 * @property {(store: string, key: string) => Promise<void>} del
 * @property {(store: string, index: string, value: string) => Promise<any[]>} byIndex
 */

/**
 * @typedef {Object} ResearchDb
 * @property {'idb'|'memory'} mode      memory when IndexedDB is missing, blocked or slower than the timeout
 * @property {string|null} reason       i18n key explaining a memory fallback
 * @property {<T>(stores: string|string[], mode: 'readonly'|'readwrite', fn: (ops: TxOps) => Promise<T>|T) => Promise<T>} tx
 *           resolves with fn's value on transaction complete only; rejects on abort or error
 * @property {(fn: () => void) => () => void} onReloadNeeded  called when another tab needs a newer schema
 * @property {() => void} close
 */

/**
 * Open (or create) the database. Handles `blocked` and `versionchange` by closing and reporting
 * 'runtime.store.reloadNeeded' so an old tab never holds a newer schema back.
 * @param {{ timeoutMs?: number, indexedDB?: IDBFactory|null }} [opts]
 * @returns {Promise<ResearchDb>}
 */
export async function openResearchDb(opts = {}) {
  const factory = 'indexedDB' in opts ? opts.indexedDB : globalThis.indexedDB;
  const timeoutMs = opts.timeoutMs ?? OPEN_TIMEOUT_MS;
  if (!factory) return createMemoryDb('runtime.store.memory.unavailable');
  return new Promise((resolve) => {
    let settled = false;
    const finish = (db) => {
      if (settled) return false;
      settled = true;
      clearTimeout(timer);
      resolve(db);
      return true;
    };
    const timer = setTimeout(() => finish(createMemoryDb('runtime.store.memory.timeout')), timeoutMs);
    let req;
    try {
      req = factory.open(DB_NAME, DB_VERSION);
    } catch {
      finish(createMemoryDb('runtime.store.memory.error'));
      return;
    }
    req.onupgradeneeded = () => {
      const idb = req.result;
      for (const [name, def] of Object.entries(STORES)) {
        const store = idb.objectStoreNames.contains(name) ? req.transaction.objectStore(name) : idb.createObjectStore(name, { keyPath: 'key' });
        for (const index of def.indexes) if (!store.indexNames.contains(index)) store.createIndex(index, index, { unique: false });
      }
    };
    req.onblocked = () => finish(createMemoryDb('runtime.store.reloadNeeded'));
    req.onerror = () => finish(createMemoryDb('runtime.store.memory.error'));
    req.onsuccess = () => {
      const idb = req.result;
      if (!finish(wrapIdb(idb))) idb.close();
    };
  });
}

/** @param {IDBDatabase} idb @returns {ResearchDb} */
function wrapIdb(idb) {
  const listeners = new Set();
  let closed = false;
  idb.onversionchange = () => {
    closed = true;
    idb.close();
    for (const fn of listeners) fn();
  };
  const reqP = (req) => new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return {
    mode: 'idb',
    reason: null,
    tx(stores, mode, fn) {
      if (closed) return Promise.reject(new StoreError('closed', 'runtime.store.reloadNeeded'));
      const names = [].concat(stores);
      return new Promise((resolve, reject) => {
        let t;
        try {
          t = idb.transaction(names, mode);
        } catch (e) {
          reject(new StoreError('failed', 'runtime.store.failed', String(e?.message || e)));
          return;
        }
        let out;
        let failure = null;
        t.oncomplete = () => (failure ? reject(failure) : resolve(out));
        t.onabort = () => reject(failure || storeErrorOf(t.error));
        t.onerror = (ev) => { ev?.preventDefault?.(); };
        /** @type {TxOps} */
        const ops = {
          get: (s, key) => reqP(t.objectStore(s).get(key)).then((r) => (r === undefined ? null : r)),
          put: (s, rec) => reqP(t.objectStore(s).put(rec)).then(() => undefined),
          del: (s, key) => reqP(t.objectStore(s).delete(key)).then(() => undefined),
          byIndex: (s, index, value) => reqP(t.objectStore(s).index(index).getAll(value)),
        };
        Promise.resolve()
          .then(() => fn(ops))
          .then((v) => { out = v; })
          .catch((e) => {
            failure = e instanceof StoreError ? e : e?.code ? e : new StoreError('failed', 'runtime.store.failed', String(e?.message || e));
            try { t.abort(); } catch { /* already finished */ }
          });
      });
    },
    onReloadNeeded(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    close() {
      closed = true;
      idb.close();
    },
  };
}

function storeErrorOf(err) {
  if (err && err.name === 'QuotaExceededError') return new StoreError('quota', 'runtime.store.notEnoughSpace', err.message);
  return new StoreError('failed', 'runtime.store.failed', String(err?.message || err || 'aborted'));
}

const copy = (x) => (typeof structuredClone === 'function' ? structuredClone(x) : JSON.parse(JSON.stringify(x)));

/**
 * The memory backend: same interface, gone when the page closes. Readwrite transactions are atomic:
 * a failure restores every store the transaction named.
 * @param {string|null} reason
 * @returns {ResearchDb}
 */
export function createMemoryDb(reason = null) {
  /** @type {Record<string, Map<string, any>>} */
  const data = Object.fromEntries(STORE_NAMES.map((n) => [n, new Map()]));
  let queue = Promise.resolve();
  const listeners = new Set();
  let closed = false;
  return {
    mode: 'memory',
    reason,
    tx(stores, mode, fn) {
      if (closed) return Promise.reject(new StoreError('closed', 'runtime.store.reloadNeeded'));
      const names = [].concat(stores);
      for (const n of names) if (!data[n]) return Promise.reject(new StoreError('failed', 'runtime.store.failed', `no store ${n}`));
      // Serialise transactions like IndexedDB does for overlapping readwrite scopes.
      const run = async () => {
        const snapshot = mode === 'readwrite' ? Object.fromEntries(names.map((n) => [n, new Map(data[n])])) : null;
        const check = (s) => {
          if (!names.includes(s)) throw new StoreError('failed', 'runtime.store.failed', `store ${s} not in transaction`);
        };
        /** @type {TxOps} */
        const ops = {
          get: async (s, key) => { check(s); const r = data[s].get(key); return r === undefined ? null : copy(r); },
          put: async (s, rec) => {
            check(s);
            if (mode !== 'readwrite') throw new StoreError('failed', 'runtime.store.failed', 'readonly transaction');
            if (!rec || typeof rec.key !== 'string') throw new StoreError('failed', 'runtime.store.failed', 'record without key');
            data[s].set(rec.key, copy(rec));
          },
          del: async (s, key) => {
            check(s);
            if (mode !== 'readwrite') throw new StoreError('failed', 'runtime.store.failed', 'readonly transaction');
            data[s].delete(key);
          },
          byIndex: async (s, index, value) => {
            check(s);
            if (!STORES[s].indexes.includes(index)) throw new StoreError('failed', 'runtime.store.failed', `no index ${index}`);
            return [...data[s].values()].filter((r) => r[index] === value).sort((a, b) => (a.key < b.key ? -1 : 1)).map(copy);
          },
        };
        try {
          return await fn(ops);
        } catch (e) {
          if (snapshot) for (const n of names) data[n] = snapshot[n];
          throw e;
        }
      };
      const p = queue.then(run, run);
      queue = p.then(() => undefined, () => undefined);
      return p;
    },
    onReloadNeeded(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    close() {
      closed = true;
    },
  };
}

/** A new random id (crypto.randomUUID, with a fallback for older browsers on http). */
export function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const b = new Uint8Array(16);
  globalThis.crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Strip the storage-only fields before a record reaches the UI. */
export function publicRecord(rec) {
  if (!rec) return rec;
  const { key: _key, project: _p, dataset: _d, ...rest } = rec;
  return rest;
}
