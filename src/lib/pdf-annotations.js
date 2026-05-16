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

function writeAll(obj) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    // Quota exceeded — evict more aggressively and retry once.
    try {
      const trimmed = lruEvict(obj, Math.max(5, MAX_PDFS - 10));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Out of options. Surface to console for debugging; UI will toast
      // "save failed" on next autosave tick.
      console.warn('[pdf-annotations] localStorage write failed:', e);
    }
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

export function saveAnnotations(fileHash, data) {
  if (!fileHash || !data) return;
  const all = readAll();
  all[fileHash] = {
    fileName: data.fileName || all[fileHash]?.fileName || 'untitled.pdf',
    pageCount: data.pageCount || all[fileHash]?.pageCount || 1,
    strokesByPage: data.strokesByPage || all[fileHash]?.strokesByPage || {},
    lastOpened: Date.now(),
  };
  const trimmed = lruEvict(all, MAX_PDFS);
  writeAll(trimmed);
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
