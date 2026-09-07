// Transactional IDB seam for small storage modules. Request callbacks may
// schedule more requests; completion waits for that queue, like the browser.
export function memoryIndexedDb() {
  const databases = new Map();
  const clone = value => value === undefined ? undefined : structuredClone(value);
  const api = {
    failWrites: false,
    failReads: false,
    open(name) {
      const fresh = !databases.has(name);
      if (fresh) databases.set(name, new Map());
      const stores = databases.get(name);
      const db = {
        objectStoreNames: { contains: name => stores.has(name) },
        createObjectStore(name, { keyPath }) {
          const store = { keyPath, rows: new Map(), indexes: new Map() };
          stores.set(name, store);
          return { createIndex: (name, path) => store.indexes.set(name, path) };
        },
        transaction(name, mode) {
          if (mode === 'readonly' && api.failReads) throw new Error('ReadUnavailable');
          if (mode === 'readwrite' && api.failWrites) throw new Error('QuotaExceeded');
          const state = stores.get(name);
          const working = new Map([...state.rows].map(([k, v]) => [k, clone(v)]));
          const tx = { oncomplete: null, onerror: null, onabort: null, error: null };
          let pending = 0, ended = false;
          const finish = () => {
            if (pending || ended) return;
            ended = true;
            if (mode === 'readonly' && api.failReads) throw new Error('ReadUnavailable');
          if (mode === 'readwrite') state.rows = working;
            tx.oncomplete?.();
          };
          const request = value => {
            pending++;
            const req = { result: clone(value), onsuccess: null, onerror: null };
            queueMicrotask(() => {
              try { req.onsuccess?.(); }
              catch (error) { ended = true; tx.error = error; tx.onerror?.(); }
              pending--;
              queueMicrotask(finish);
            });
            return req;
          };
          tx.abort = () => { ended = true; tx.onabort?.(); };
          tx.objectStore = () => ({
            get: key => request(working.get(key)),
            put: row => { working.set(row[state.keyPath], clone(row)); return request(undefined); },
            delete: key => { working.delete(key); return request(undefined); },
            getAll: () => request([...working.values()]),
            index(indexName) {
              const path = state.indexes.get(indexName);
              const matching = key => [...working.values()].filter(row => JSON.stringify(Array.isArray(path) ? path.map(part => row[part]) : row[path]) === JSON.stringify(key));
              return {
                getAll: (key, limit) => request(matching(key).slice(0, limit)),
                getAllKeys: key => request(matching(key).map(row => row[state.keyPath])),
              };
            },
          });
          queueMicrotask(finish);
          return tx;
        },
      };
      const request = { result: db, onupgradeneeded: null, onsuccess: null, onerror: null };
      queueMicrotask(() => { if (fresh) request.onupgradeneeded?.(); request.onsuccess?.(); });
      return request;
    },
  };
  return api;
}
