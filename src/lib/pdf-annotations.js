// ============================================================
// pdf-annotations — where a student's pen marks live
// ============================================================
//
// Rewritten 2026-08-31. The old store kept every document's strokes inside a
// SINGLE localStorage key, and that shape caused real, silent data loss:
//
//  • localStorage gives the whole origin about 5 MB, shared with exam state,
//    notes and the SR deck. Stroke points were written at full float
//    precision — ~38 bytes a point — so one densely annotated 20-page deck
//    could take the entire budget on its own.
//
//  • When the write failed, writeAll() shrank the object by DELETING other
//    documents' entries until it fit. Correct as a last resort, except that
//    loadAnnotations() also wrote (to refresh lastOpened) and ignored the
//    result — so merely OPENING one document could silently destroy the pen
//    marks on another, with nothing shown to the person it happened to.
//
//  • Every 500 ms autosave re-serialised all thirty documents to write the
//    one being drawn on. On a large deck that is megabytes of JSON.stringify
//    on the main thread, in the middle of a stroke.
//
//  • One unparseable byte in that key and readAll() returned {} — every
//    document's annotations gone at once, silently.
//
// So: IndexedDB, one record per document. No practical size ceiling, no
// cross-document eviction, an autosave touches only its own record, and a
// corrupt record can lose at most itself. Writes are async, which keeps the
// serialising off the drawing path too.
//
// Record shape (store `docs`, keyPath `hash`):
//   { hash, fileName, pageCount, strokesByPage: { [page]: Stroke[] },
//     lastPage, lastOpened }
//
// Stroke: { color, size, points: Array<[x, y, pressure?]>, mode: 'pen'|'eraser' }
// Points are normalised to [0..1] so they survive any viewport scale.
//
// Anything already in the old localStorage key is migrated on first use and
// the old key is left in place — a student who opens the app on an older
// build must still find their work there.
// ============================================================

const DB_NAME = 'vmx-pdf-annotations';
const DB_VERSION = 1;
const STORE = 'docs';
const LEGACY_KEY = 'vmx-pdf-annotations';

// Coordinates are stored to 4 decimals. On the widest canvas this reader ever
// paints (~2600 device pixels) that is a quarter of a pixel — invisible — and
// it cuts a stored point from ~38 bytes to ~15. Precision beyond what can be
// drawn is not fidelity, it is just volume.
const round4 = (n) => Math.round(n * 10000) / 10000;

export function packStroke(stroke) {
  if (!stroke?.points) return stroke;
  return {
    ...stroke,
    points: stroke.points.map((p) => (p.length > 2
      ? [round4(p[0]), round4(p[1]), Math.round(p[2] * 100) / 100]
      : [round4(p[0]), round4(p[1])])),
  };
}

// ── Connection ────────────────────────────────────────────────────────────
let _dbPromise = null;

function openDb() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('no-idb')); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    // Safari in a private window can leave the request pending forever rather
    // than erroring. Fail over to the in-memory mirror instead of hanging the
    // reader on its first save. Cleared on settle so a healthy open does not
    // leave a live timer behind it.
    const bail = setTimeout(() => reject(new Error('idb-timeout')), 3000);
    const settle = (fn, v) => { clearTimeout(bail); fn(v); };
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'hash' });
      }
    };
    req.onsuccess = () => settle(resolve, req.result);
    req.onerror = () => settle(reject, req.error || new Error('idb-open-failed'));
  }).catch((e) => { _dbPromise = null; throw e; });
  return _dbPromise;
}

function tx(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    let req;
    try { req = fn(store); } catch (e) { reject(e); return; }
    // A miss must come back as undefined, not as the request object. `get` on
    // an absent key resolves with result === undefined, and falling back to
    // the request itself made every absent record look present — which meant
    // the legacy migration saw "already there" for every document and copied
    // nothing, and loadAnnotations handed the reader an IDBRequest.
    const isReq = req && typeof req === 'object' && 'result' in req;
    t.oncomplete = () => resolve(isReq ? req.result : req);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('idb-abort'));
  }));
}

// A synchronous mirror of what has been read or written this session. The view
// asks for a document's strokes during render, and IndexedDB cannot answer
// synchronously; the mirror also keeps the reader working end to end when
// IndexedDB is unavailable entirely (private windows, blocked storage), where
// the marks live for the session and are simply not persisted. Say so rather
// than pretend — see `storageHealth`.
const mirror = new Map();
let idbUsable = true;

export function storageHealth() {
  return { persistent: idbUsable };
}

// ── Migration from the single-key localStorage store ──────────────────────
let _migrated = null;
function migrateLegacy() {
  if (_migrated) return _migrated;
  _migrated = (async () => {
    if (typeof window === 'undefined') return;
    let legacy;
    try {
      const raw = window.localStorage.getItem(LEGACY_KEY);
      if (!raw) return;
      legacy = JSON.parse(raw);
    } catch { return; }
    if (!legacy || typeof legacy !== 'object') return;
    for (const [hash, v] of Object.entries(legacy)) {
      if (!v || typeof v !== 'object') continue;
      try {
        const existing = await tx('readonly', (s) => s.get(hash));
        // Never overwrite work done on the new store with an older copy.
        if (existing) continue;
        await tx('readwrite', (s) => s.put(normalise(hash, v)));
      } catch { return; } // IndexedDB is gone; the legacy key stays where it is
    }
    // The old key is deliberately NOT deleted. A student who opens an older
    // build, or a cached service-worker version, must still find their marks.
  })();
  return _migrated;
}

function normalise(hash, v) {
  return {
    hash,
    fileName: v.fileName || 'untitled.pdf',
    pageCount: v.pageCount || 1,
    strokesByPage: v.strokesByPage || {},
    lastPage: Number.isFinite(v.lastPage) ? v.lastPage : 1,
    lastOpened: v.lastOpened || Date.now(),
  };
}

// ── Public API ────────────────────────────────────────────────────────────

/** SHA-256 of the file bytes, hex, truncated to 16 chars. */
export async function hashFile(file) {
  if (!file) throw new Error('hashFile: missing file');
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buf);
      const bytes = new Uint8Array(digest);
      let hex = '';
      for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
      return hex.slice(0, 16);
    } catch { /* fall through */ }
  }
  // Insecure context / SubtleCrypto unavailable — degrade to a
  // non-cryptographic identity hash. Enough to recognise a re-upload of the
  // same file in dev; not used for any security purpose.
  const ident = `${file.name}|${file.size}|${file.lastModified || 0}`;
  let h = 0;
  for (let i = 0; i < ident.length; i++) h = ((h << 5) - h + ident.charCodeAt(i)) | 0;
  return ('00000000' + (h >>> 0).toString(16)).slice(-8) + '00000000';
}

/** Loads one document's record. READ ONLY — unlike the old version, opening a
 *  document never writes, so it can never evict anything. */
export async function loadAnnotations(fileHash) {
  if (!fileHash) return null;
  await migrateLegacy().catch(() => {});
  try {
    const rec = await tx('readonly', (s) => s.get(fileHash));
    if (rec) mirror.set(fileHash, rec);
    return rec || null;
  } catch {
    idbUsable = false;
    return mirror.get(fileHash) || null;
  }
}

/** Synchronous read of whatever this session already knows. */
export function peekAnnotations(fileHash) {
  return mirror.get(fileHash) || null;
}

/** Saves one document. Returns { ok, evicted } — `evicted` is always 0 now and
 *  kept so callers written against the old contract keep compiling; nothing is
 *  ever deleted to make room for something else again. */
export async function saveAnnotations(fileHash, data) {
  if (!fileHash || !data) return { ok: false, evicted: 0 };
  const prev = mirror.get(fileHash) || {};
  // Field-by-field merge: a stroke autosave that carries no lastPage must not
  // erase the reading position, and the page tracker that carries no strokes
  // must not erase the strokes.
  const rec = {
    hash: fileHash,
    fileName: data.fileName || prev.fileName || 'untitled.pdf',
    pageCount: data.pageCount || prev.pageCount || 1,
    strokesByPage: data.strokesByPage
      ? packAll(data.strokesByPage)
      : (prev.strokesByPage || {}),
    lastPage: Number.isFinite(data.lastPage) ? data.lastPage : (prev.lastPage ?? 1),
    lastOpened: Date.now(),
  };
  mirror.set(fileHash, rec);
  try {
    await tx('readwrite', (s) => s.put(rec));
    idbUsable = true;
    return { ok: true, evicted: 0 };
  } catch {
    idbUsable = false;
    return { ok: false, evicted: 0 };
  }
}

function packAll(byPage) {
  const out = {};
  for (const [page, arr] of Object.entries(byPage)) {
    out[page] = Array.isArray(arr) ? arr.map(packStroke) : [];
  }
  return out;
}

export async function listRecentPdfs() {
  await migrateLegacy().catch(() => {});
  let all = [];
  try {
    all = await tx('readonly', (s) => s.getAll());
    for (const r of all) mirror.set(r.hash, r);
  } catch {
    idbUsable = false;
    all = [...mirror.values()];
  }
  return all
    .map((v) => ({
      hash: v.hash,
      fileName: v.fileName || 'untitled.pdf',
      pageCount: v.pageCount || 0,
      lastOpened: v.lastOpened || 0,
      annotatedPageCount: v.strokesByPage
        ? Object.values(v.strokesByPage).filter((a) => Array.isArray(a) && a.length > 0).length
        : 0,
    }))
    .sort((a, b) => b.lastOpened - a.lastOpened);
}

export async function deleteAnnotations(fileHash) {
  if (!fileHash) return;
  mirror.delete(fileHash);
  try { await tx('readwrite', (s) => s.delete(fileHash)); } catch { idbUsable = false; }
  // Drop it from the legacy blob too, or the next migration would resurrect
  // a document the student deleted on purpose.
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw);
    if (legacy && legacy[fileHash]) {
      delete legacy[fileHash];
      window.localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));
    }
  } catch { /* legacy cleanup is best effort */ }
}
