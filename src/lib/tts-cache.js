// ============================================================
// tts-cache — the IndexedDB audio cache both TTS voices share
// ============================================================
//
// tts-edge.js (Microsoft neural voices, MP3) and tts-iapp.js (iApp
// Kaitom, WAV) each keep synthesized audio on the device so a question
// read aloud once replays instantly, across sessions and offline. They
// used to carry two copies of this code; each now makes its own instance.
//
// Each instance keeps its own database ('vmx-tts' for Edge,
// 'vmx-tts-iapp' for iApp) and its own budget. The names, the store and
// the key format are exactly what shipped before this file existed:
// change any of them and every student's cached audio becomes a miss.
//
// Bounds, per instance:
//   • entries older than 30 days expire (iOS Safari purges inactive
//     storage anyway, and upstream voices get updated);
//   • above 30 MB, least-recently-played entries go until the store is
//     back under 80% of the cap, so the next write does not sweep again.
//     30 MB holds ~85 Edge chunks (mean 350 KB per 5-chunk question);
//     iApp WAV is ~4x the bytes for the same duration.
//   • the sweep runs after a successful write, at most every 30 s.
// ============================================================

const STORE = 'audio';
const VERSION = 1;
const DEFAULT_MAX_BYTES = 30 * 1024 * 1024;
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const EVICT_THROTTLE_MS = 30_000;

/**
 * Cache key for one synthesized chunk: hash of lang + rate + text.
 * SHA-256 truncated to 16 bytes of hex (128 bits, plenty for a cache
 * key); FNV-1a 32-bit when WebCrypto is unavailable.
 */
export async function audioCacheKey({ text, lang, rate }) {
  const data = new TextEncoder().encode(`${lang}|${Number(rate).toFixed(2)}|${text}`);
  if (typeof crypto?.subtle?.digest !== 'function') {
    let h = 2166136261;
    for (let i = 0; i < data.length; i++) {
      h ^= data[i];
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
  }
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * One bounded audio cache in its own IndexedDB database.
 * Every operation is best-effort: a browser without IndexedDB, or one
 * that refuses a write, just gets cache misses.
 */
export function createAudioCache({ dbName, maxBytes = DEFAULT_MAX_BYTES }) {
  const evictTargetBytes = Math.floor(maxBytes * 0.80);
  let dbPromise = null;
  let lastEvictAt = 0;

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') return reject(new Error('no indexeddb'));
      const req = indexedDB.open(dbName, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  function dbTx(mode) {
    return openDb().then((db) => db.transaction(STORE, mode).objectStore(STORE));
  }

  async function dbGet(key) {
    try {
      const store = await dbTx('readonly');
      return await new Promise((res, rej) => {
        const r = store.get(key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    } catch {
      return undefined;
    }
  }

  async function dbPut(key, value) {
    try {
      const store = await dbTx('readwrite');
      return await new Promise((res, rej) => {
        const r = store.put(value, key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    } catch { /* a cache miss is fine */ }
  }

  async function dbDelete(key) {
    try {
      const store = await dbTx('readwrite');
      return await new Promise((res, rej) => {
        const r = store.delete(key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    } catch { /* ignore */ }
  }

  // Walk every entry for its metadata only ({ key, ts, bytes }); the
  // audio itself is not collected, so the walk stays light.
  async function dbListAll() {
    try {
      const store = await dbTx('readonly');
      return await new Promise((res, rej) => {
        const all = [];
        const r = store.openCursor();
        r.onsuccess = (e) => {
          const c = e.target.result;
          if (c) {
            const v = c.value;
            all.push({ key: c.primaryKey, ts: v?.ts || 0, bytes: v?.bytes || v?.audio?.byteLength || 0 });
            c.continue();
          } else res(all);
        };
        r.onerror = () => rej(r.error);
      });
    } catch {
      return [];
    }
  }

  async function evictStale() {
    const now = Date.now();
    if (now - lastEvictAt < EVICT_THROTTLE_MS) return;
    lastEvictAt = now;
    let entries = await dbListAll();
    if (entries.length === 0) return;

    // (1) TTL pass: drop anything older than 30 days.
    for (const e of entries) {
      if (now - e.ts > TTL_MS) dbDelete(e.key).catch(() => {});
    }
    entries = entries.filter((e) => now - e.ts <= TTL_MS);

    // (2) Size pass: least recently played first, down to 80% of the cap.
    let total = entries.reduce((s, e) => s + e.bytes, 0);
    if (total <= maxBytes) return;
    entries.sort((a, b) => a.ts - b.ts);
    while (total > evictTargetBytes && entries.length > 0) {
      const evict = entries.shift();
      dbDelete(evict.key).catch(() => {});
      total -= evict.bytes;
    }
  }

  return {
    /** Cached audio for `key`, or undefined. An expired entry is dropped
     *  and reported as a miss; a hit is touched so LRU keeps it. */
    async read(key) {
      const cached = await dbGet(key);
      if (!cached?.audio) return undefined;
      if (Date.now() - (cached.ts || 0) > TTL_MS) {
        dbDelete(key).catch(() => {});
        return undefined;
      }
      dbPut(key, { ...cached, ts: Date.now() }).catch(() => {});
      return cached.audio;
    },
    /** Store fresh audio without waiting, then run the throttled sweep —
     *  this is what keeps the store bounded over a long session. */
    write(key, audio) {
      dbPut(key, { audio, ts: Date.now(), bytes: audio.byteLength })
        .then(() => evictStale())
        .catch(() => {});
    },
  };
}
