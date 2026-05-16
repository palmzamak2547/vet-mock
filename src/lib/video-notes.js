// ============================================================
// video-notes.js — per-video timestamped notes (localStorage)
//
// Shape on disk (key = 'vmx-video-notes'):
//   {
//     [videoId]: {
//       lastUpdated: <epoch ms>,
//       notes: [{ id: <int>, t: <seconds>, text: <string>, createdAt: <epoch ms> }, ...]
//     },
//     ...
//   }
//
// Notes are always returned sorted by `t` ascending. `id` is a monotonic
// integer per video (max(existing.id) + 1). Survives Safari private mode
// gracefully (try/catch around every storage op).
// ============================================================

const KEY = 'vmx-video-notes';

function readAll() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(obj) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(obj));
  } catch {
    /* quota / private-mode — swallow */
  }
}

function sortAsc(notes) {
  return [...notes].sort((a, b) => a.t - b.t);
}

export function loadNotes(videoId) {
  if (!videoId) return [];
  const all = readAll();
  const bucket = all[videoId];
  if (!bucket || !Array.isArray(bucket.notes)) return [];
  return sortAsc(bucket.notes);
}

export function addNote(videoId, t, text) {
  if (!videoId) return null;
  const all = readAll();
  const bucket = all[videoId] || { lastUpdated: 0, notes: [] };
  const nextId = bucket.notes.reduce((m, n) => Math.max(m, n.id || 0), 0) + 1;
  const note = {
    id: nextId,
    t: Math.max(0, Number(t) || 0),
    text: String(text || '').trim(),
    createdAt: Date.now(),
  };
  bucket.notes = sortAsc([...bucket.notes, note]);
  bucket.lastUpdated = Date.now();
  all[videoId] = bucket;
  writeAll(all);
  return note;
}

export function updateNote(videoId, id, text) {
  if (!videoId || id == null) return;
  const all = readAll();
  const bucket = all[videoId];
  if (!bucket || !Array.isArray(bucket.notes)) return;
  let touched = false;
  bucket.notes = bucket.notes.map((n) => {
    if (n.id === id) {
      touched = true;
      return { ...n, text: String(text || '').trim() };
    }
    return n;
  });
  if (!touched) return;
  bucket.lastUpdated = Date.now();
  all[videoId] = bucket;
  writeAll(all);
}

export function deleteNote(videoId, id) {
  if (!videoId || id == null) return;
  const all = readAll();
  const bucket = all[videoId];
  if (!bucket || !Array.isArray(bucket.notes)) return;
  const before = bucket.notes.length;
  bucket.notes = bucket.notes.filter((n) => n.id !== id);
  if (bucket.notes.length === before) return;
  bucket.lastUpdated = Date.now();
  all[videoId] = bucket;
  writeAll(all);
}

export function clearVideoNotes(videoId) {
  if (!videoId) return;
  const all = readAll();
  if (!all[videoId]) return;
  delete all[videoId];
  writeAll(all);
}

// "MM:SS" under an hour, "H:MM:SS" for hour+. Used by the panel rows.
export function formatTimestamp(t) {
  const total = Math.max(0, Math.floor(Number(t) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}
