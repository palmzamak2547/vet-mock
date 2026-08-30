// ============================================================
// pdf-annotations — localStorage layer for PdfAnnotateView
// ============================================================
//
// Per-PDF stroke storage keyed by SHA-256(file bytes), trimmed to
// first 16 hex chars (collision space ~10^19 — fine for a single
// user's library).
//
// Shape under `vmx-pdf-annotations`:
//   {
//     [fileHash: string]: {
//       fileName:      string,
//       pageCount:     number,
//       strokesByPage: { [pageNumStr]: Array<Stroke> },
//       lastOpened:    number  // Date.now()
//     }
//   }
//
// Stroke shape (kept loose on purpose; PdfAnnotateView owns it):
//   { color: string, size: number, points: Array<[x, y, pressure?]>,
//     mode: 'pen' | 'eraser' }
//
// Quota guard — LRU evict by `lastOpened` once over MAX_PDFS, so a
// user who annotates 30+ PDFs doesn't quietly run into the ~5 MB
// localStorage ceiling. The PDF bytes themselves are NEVER stored
// (re-upload is required to resume) — only the strokes JSON.
// ============================================================

const STORAGE_KEY = 'vmx-pdf-annotations';
const MAX_PDFS = 30;

function readAll() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    // Corrupt JSON — start fresh rather than crash the view.
    return {};
  }
}

// Returns { ok, evicted } so callers can stop claiming a save happened.
//
// The old retry could not work for most people: it trimmed to
// max(5, MAX_PDFS - 10) = 20, and lruEvict returns the object UNCHANGED when
// it already holds no more than that — so with 20 or fewer stored PDFs the
// "retry" re-wrote the exact bytes that had just failed, and was guaranteed
// to fail the same way. It also returned nothing, and the comment here
// promised a "save failed" toast that no caller had the information to show.
function writeAll(obj) {
  if (typeof window === 'undefined') return { ok: false, evicted: 0 };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    return { ok: true, evicted: 0 };
  } catch (e) {
    // Actually shrink, one entry at a time, keeping the most recently opened.
    const entries = Object.entries(obj)
      .sort((a, b) => (b[1]?.lastOpened || 0) - (a[1]?.lastOpened || 0));
    let evicted = 0;
    while (entries.length > 1) {
      entries.pop();
      evicted++;
      const shrunk = {};
      for (const [k, v] of entries) shrunk[k] = v;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shrunk));
        return { ok: true, evicted };
      } catch {
        /* keep going */
      }
    }
    console.warn('[pdf-annotations] localStorage write failed:', e);
    return { ok: false, evicted };
  }
}

function lruEvict(obj, maxItems) {
  const entries = Object.entries(obj);
  if (entries.length <= maxItems) return obj;
  entries.sort((a, b) => (b[1]?.lastOpened || 0) - (a[1]?.lastOpened || 0));
  const kept = entries.slice(0, maxItems);
  const out = {};
  for (const [k, v] of kept) out[k] = v;
  return out;
}

// SHA-256 of the file bytes, hex, truncated to 16 chars.
// SubtleCrypto is available on every target (iOS Safari 14+, Chrome,
// Firefox) over HTTPS / localhost. Falls back to a name+size+mtime
// digest for the (rare) insecure-context case so the view still
// works in dev over plain http:// without crashing.
export async function hashFile(file) {
  if (!file) throw new Error('hashFile: missing file');
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buf);
      const bytes = new Uint8Array(digest);
      let hex = '';
      for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, '0');
      }
      return hex.slice(0, 16);
    } catch {
      // fall through
    }
  }
  // Insecure context / SubtleCrypto unavailable — degrade to a
  // non-cryptographic identity hash. Good enough to dedupe re-uploads
  // of the same file in dev; not used for any security purpose.
  const ident = `${file.name}|${file.size}|${file.lastModified || 0}`;
  let h = 0;
  for (let i = 0; i < ident.length; i++) {
    h = ((h << 5) - h + ident.charCodeAt(i)) | 0;
  }
  return ('00000000' + (h >>> 0).toString(16)).slice(-8) + '00000000';
}

export function loadAnnotations(fileHash) {
  if (!fileHash) return null;
  const all = readAll();
  const entry = all[fileHash];
  if (!entry) return null;
  // Refresh lastOpened on read so an active PDF resists eviction
  // while the user is in the middle of working with it.
  all[fileHash] = { ...entry, lastOpened: Date.now() };
  writeAll(all);
  return entry;
}

/** Returns { ok, evicted } — see writeAll. Callers must not report success blind. */
export function saveAnnotations(fileHash, data) {
  if (!fileHash || !data) return { ok: false, evicted: 0 };
  const all = readAll();
  all[fileHash] = {
    fileName: data.fileName || all[fileHash]?.fileName || 'untitled.pdf',
    pageCount: data.pageCount || all[fileHash]?.pageCount || 1,
    strokesByPage: data.strokesByPage || all[fileHash]?.strokesByPage || {},
    // Field-by-field merge on purpose: a stroke autosave that doesn't pass
    // lastPage must not erase the reading position, and the page tracker
    // that doesn't pass strokesByPage must not erase the strokes.
    lastPage: Number.isFinite(data.lastPage) ? data.lastPage : (all[fileHash]?.lastPage ?? 1),
    lastOpened: Date.now(),
  };
  const trimmed = lruEvict(all, MAX_PDFS);
  return writeAll(trimmed);
}

export function listRecentPdfs() {
  const all = readAll();
  return Object.entries(all)
    .map(([hash, v]) => ({
      hash,
      fileName: v?.fileName || 'untitled.pdf',
      pageCount: v?.pageCount || 0,
      lastOpened: v?.lastOpened || 0,
      annotatedPageCount: v?.strokesByPage
        ? Object.values(v.strokesByPage).filter((a) => Array.isArray(a) && a.length > 0).length
        : 0,
    }))
    .sort((a, b) => b.lastOpened - a.lastOpened);
}

export function deleteAnnotations(fileHash) {
  if (!fileHash) return;
  const all = readAll();
  if (!all[fileHash]) return;
  delete all[fileHash];
  writeAll(all);
}
