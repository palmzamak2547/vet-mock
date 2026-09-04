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
//     deleted: [strokeId], lastPage, lastOpened, dirty }
//
// Every stroke carries an `id`, and every removal is recorded as a tombstone
// rather than as an absence. That shape is what makes syncing across devices
// safe: the merge is
//
//     strokes = (union of both sides' strokes, by id) minus
//               (union of both sides' tombstones)
//
// which is commutative, associative and idempotent — a two-phase set. Two
// iPads annotating the same deck offline both keep their work no matter which
// one syncs first, and merging twice changes nothing. A last-write-wins row
// would silently discard a whole afternoon.
//
// Redo re-adds the stroke under a NEW id instead of un-deleting the old one,
// because a tombstone that can be taken back is no longer monotonic and the
// guarantee above collapses.
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

// This browser's identity, used only to make stroke ids unique between
// devices. Not a user id, not sent anywhere on its own — two devices must
// simply never mint the same stroke id, or a merge would drop one of them.
const DEVICE_KEY = 'vmx-pdf-device';
let _device = null;
export function deviceId() {
  if (_device) return _device;
  try {
    _device = window.localStorage.getItem(DEVICE_KEY);
    if (!_device) {
      _device = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
      window.localStorage.setItem(DEVICE_KEY, _device);
    }
  } catch {
    _device = 'anon' + Math.random().toString(36).slice(2, 6);
  }
  return _device;
}

let _seq = 0;
export function newStrokeId() {
  _seq += 1;
  return `${deviceId()}-${Date.now().toString(36)}${_seq.toString(36)}`;
}

// Tombstones are ids, about a dozen bytes each. Ten thousand deletions is
// ~150 KB, so they are kept rather than garbage-collected — pruning them is
// what would break convergence, because a device that has been offline still
// holds the stroke a prune would forget to suppress. The cap exists only so a
// pathological session cannot grow without bound; it drops the OLDEST
// tombstones, which are the ones every device has long since seen.
const MAX_TOMBSTONES = 20000;

/** Union of strokes by id, minus the union of tombstones. Order-independent. */
export function mergeRecords(a, b) {
  if (!a) return b;
  if (!b) return a;
  const deleted = new Set([...(a.deleted || []), ...(b.deleted || [])]);
  const pages = new Set([
    ...Object.keys(a.strokesByPage || {}),
    ...Object.keys(b.strokesByPage || {}),
  ]);
  const strokesByPage = {};
  for (const page of pages) {
    const byId = new Map();
    // b last so that, for the same id, the later writer's copy wins — the
    // content of one id never differs in practice (strokes are immutable once
    // drawn), so this only matters for records written by older versions.
    for (const st of (a.strokesByPage?.[page] || [])) if (st?.id) byId.set(st.id, st);
    for (const st of (b.strokesByPage?.[page] || [])) if (st?.id) byId.set(st.id, st);
    const kept = [...byId.values()].filter((st) => !deleted.has(st.id));
    if (kept.length) strokesByPage[page] = kept;
  }
  const tombs = [...deleted];
  return {
    hash: a.hash || b.hash,
    fileName: a.fileName || b.fileName || 'untitled.pdf',
    pageCount: Math.max(a.pageCount || 0, b.pageCount || 0) || 1,
    strokesByPage,
    deleted: tombs.length > MAX_TOMBSTONES ? tombs.slice(-MAX_TOMBSTONES) : tombs,
    // The reading position is the one field where "most recent wins" is right:
    // it describes where a person is, not what they made.
    lastPage: (a.lastOpened || 0) >= (b.lastOpened || 0)
      ? (a.lastPage ?? b.lastPage ?? 1)
      : (b.lastPage ?? a.lastPage ?? 1),
    lastOpened: Math.max(a.lastOpened || 0, b.lastOpened || 0),
  };
}

// Records written before stroke ids existed. Ids are prefixed with THIS
// device, so the same student's two pre-sync devices contribute both of their
// histories instead of colliding and losing one.
function ensureIds(rec) {
  if (!rec?.strokesByPage) return rec;
  let changed = false;
  const out = {};
  for (const [page, arr] of Object.entries(rec.strokesByPage)) {
    out[page] = (Array.isArray(arr) ? arr : []).map((st, i) => {
      if (st?.id) return st;
      changed = true;
      return { ...st, id: `${deviceId()}-legacy-${page}-${i}` };
    });
  }
  if (!changed) return rec;
  return { ...rec, strokesByPage: out };
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
  return ensureIds({
    hash,
    fileName: v.fileName || 'untitled.pdf',
    pageCount: v.pageCount || 1,
    strokesByPage: v.strokesByPage || {},
    deleted: Array.isArray(v.deleted) ? v.deleted : [],
    lastPage: Number.isFinite(v.lastPage) ? v.lastPage : 1,
    lastOpened: v.lastOpened || Date.now(),
  });
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
    const raw = await tx('readonly', (s) => s.get(fileHash));
    const rec = raw ? ensureIds({ deleted: [], ...raw }) : null;
    if (rec) mirror.set(fileHash, rec);
    return rec;
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
    deleted: Array.isArray(data.deleted) ? data.deleted : (prev.deleted || []),
    lastPage: Number.isFinite(data.lastPage) ? data.lastPage : (prev.lastPage ?? 1),
    lastOpened: Date.now(),
  };
  mirror.set(fileHash, rec);
  try {
    // Merge against what is IN THE DATABASE, inside the same transaction —
    // not against `mirror`, which is this tab's own memory.
    //
    // With two tabs open on the same document, tab B's mirror was populated
    // when it opened, before tab A drew anything. B's autosave then put() a
    // whole record built from that stale picture, and A's strokes were gone
    // from storage while still on A's screen. Nobody sees it until the file
    // is reopened, which is exactly when a student is counting on it.
    //
    // A union is safe because every removal path in the reader tombstones
    // what it removes — eraser, undo, the double-tap trim and clear-page all
    // call addTomb — and mergeRecords drops tombstoned ids.
    // Rescue the pages this tab is not writing, from what is IN THE DATABASE,
    // inside the same transaction — not from `mirror`, which is this tab's
    // own memory.
    //
    // With two tabs open on the same document, tab B's mirror was populated
    // when it opened, before tab A drew anything. B's autosave then put() a
    // whole record built from that stale picture, and A's strokes were gone
    // from storage while still on A's screen. Nobody sees it until the file
    // is reopened, which is exactly when a student is counting on it.
    //
    // Deliberately page-level, not stroke-level: a page this save carries is
    // this tab's authoritative view of that page, so undo, the eraser and
    // clear-page keep behaving exactly as they did. Only pages the incoming
    // record says nothing about are taken from storage. Two tabs drawing on
    // the SAME page at the same time is still last-writer-wins, which is the
    // honest limit of a merge that has no per-stroke clock.
    //
    // The merged record is captured in a closure, not returned: an
    // IDBRequest's `result` is read-only and assigning to it silently does
    // nothing.
    let merged = rec;
    await tx('readwrite', (store) => {
      const get = store.get(fileHash);
      get.onsuccess = () => {
        const stored = get.result;
        if (stored?.strokesByPage) {
          const pages = { ...rec.strokesByPage };
          let rescued = false;
          for (const [page, strokes] of Object.entries(stored.strokesByPage)) {
            if (pages[page] === undefined && Array.isArray(strokes) && strokes.length) {
              pages[page] = strokes;
              rescued = true;
            }
          }
          if (rescued) merged = { ...rec, strokesByPage: pages };
        }
        store.put(merged);
      };
      // Returning null keeps tx() from resolving with the get request.
      return null;
    });
    mirror.set(fileHash, merged);
    idbUsable = true;
    return { ok: true, evicted: 0 };
  } catch {
    idbUsable = false;
    return { ok: false, evicted: 0 };
  }
}

/** Writes a whole record as-is. Used by the sync layer after a merge, where
 *  the fields have already been reconciled and must not be merged again. */
export async function putRecord(rec) {
  if (!rec?.hash) return { ok: false };
  mirror.set(rec.hash, rec);
  try {
    await tx('readwrite', (s) => s.put(rec));
    idbUsable = true;
    return { ok: true };
  } catch {
    idbUsable = false;
    return { ok: false };
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
