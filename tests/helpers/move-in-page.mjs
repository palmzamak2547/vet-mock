// Runs the page /api/move-in answers with (its inline script, its embedded
// JSON) in a vm sandbox against fake storage, the way a browser on
// vetmock.com would. Shared by the handler test and the inbox test so both
// exercise the bytes the function actually serves.
import vm from 'node:vm';
import { gzipSync } from 'node:zlib';

export class MemoryStorage {
  constructor(entries = {}) { this.values = new Map(Object.entries(entries)); this.refuse = null; }
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(k) { return this.values.has(k) ? this.values.get(k) : null; }
  setItem(k, v) {
    if (this.refuse?.(k, v)) throw Object.assign(new Error('full'), { name: 'QuotaExceededError' });
    this.values.set(k, String(v));
  }
  removeItem(k) { this.values.delete(k); }
  snapshot() { return Object.fromEntries(this.values); }
}

/** The move-in inbox database: one autoIncrement store, rows kept in order.
 *  Keys are never reused, as in a real autoIncrement store. */
export function inboxIndexedDb() {
  const databases = new Map();
  const counters = new Map();
  const answer = (result) => {
    const req = { result, error: null, onsuccess: null, onerror: null };
    queueMicrotask(() => req.onsuccess?.());
    return req;
  };
  return {
    databases,
    rows: (name = 'vmx-move-inbox', store = 'records') => [...(databases.get(name)?.get(store)?.values() || [])],
    open(name) {
      const req = { result: null, error: null, transaction: null, onupgradeneeded: null, onsuccess: null, onerror: null, onblocked: null };
      queueMicrotask(() => {
        const fresh = !databases.has(name);
        if (fresh) databases.set(name, new Map());
        const stores = databases.get(name);
        const db = {
          objectStoreNames: { contains: (s) => stores.has(s) },
          createObjectStore(s) { stores.set(s, new Map()); return {}; },
          close() {},
          transaction(s) {
            const tx = { oncomplete: null, onerror: null, onabort: null, error: null };
            const rows = stores.get(s);
            tx.objectStore = () => ({
              add(value) {
                const next = (counters.get(name) || 0) + 1;
                counters.set(name, next);
                rows.set(next, structuredClone(value));
                return answer(next);
              },
              getAll: () => answer([...rows.values()].map((v) => structuredClone(v))),
              getAllKeys: () => answer([...rows.keys()]),
              delete: (key) => { rows.delete(key); return answer(undefined); },
            });
            setTimeout(() => tx.oncomplete?.(), 0);
            return tx;
          },
        };
        req.result = db;
        if (fresh) req.onupgradeneeded?.();
        req.onsuccess?.();
      });
      return req;
    },
    deleteDatabase(name) {
      const req = { onsuccess: null, onerror: null, onblocked: null };
      queueMicrotask(() => { databases.delete(name); req.onsuccess?.(); });
      return req;
    },
  };
}

export function encodePayload(payload, enc = 'gz64') {
  const json = Buffer.from(JSON.stringify(payload), 'utf8');
  return (enc === 'gz64' ? gzipSync(json) : json).toString('base64url');
}

export function pageParts(html) {
  return {
    json: /<script type="application\/json" id="vmx-move">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? null,
    script: /<script nonce="[^"]+">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? null,
  };
}

export async function runMovePage(html, { storage = new MemoryStorage(), idb = inboxIndexedDb() } = {}) {
  const { json, script } = pageParts(html);
  if (json == null || script == null) throw new Error('not a move-in page');
  const nodes = {
    'vmx-move': { textContent: json },
    'vmx-move-busy': { hidden: false },
    'vmx-move-fail': { hidden: true },
  };
  const env = { replaced: [] };
  const sandbox = {
    document: { getElementById: (id) => nodes[id] || null },
    localStorage: storage,
    location: { replace: (url) => env.replaced.push(String(url)) },
    indexedDB: idb,
    atob, TextDecoder, Response, Blob, DecompressionStream, setTimeout, clearTimeout,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  for (let i = 0; i < 500 && !env.replaced.length && nodes['vmx-move-fail'].hidden; i++) {
    await new Promise((r) => setTimeout(r, 2));
  }
  return { replaced: env.replaced, failed: !nodes['vmx-move-fail'].hidden, storage, idb };
}
