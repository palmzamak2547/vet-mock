// ============================================================
// tts-shared — pre-generated question audio, the same for everyone
// ============================================================
// scripts/tts-clips.mjs speaks each stem, option and option label once
// (Gemini 3.8 Flash TTS, voice Kore) and stores it on R2 behind
// tts.vetmock.com, named by clipKey(text). A per-subject manifest lists
// which clips exist, so a tap knows at once whether it can play them or
// must fall back to the live voices. Clips also land in this device's
// IndexedDB, so a question heard once replays offline.
// ============================================================

import { createAudioCache } from './tts-cache.js';
import { SHARED_TTS, clipKey, clipText, clipUrl, manifestUrl, optionLabel } from './tts-text.js';

const FETCH_TIMEOUT_MS = 8000;
const MANIFEST_TIMEOUT_MS = 3000;
const cache = createAudioCache({ dbName: 'vmx-tts-shared' });
const manifests = new Map(); // subject -> Promise<Set<string> | null>

function fetchWithTimeout(url, ms, signal) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
  }
  return fetch(url, { signal: ctrl.signal, mode: 'cors', credentials: 'omit' }).finally(() => clearTimeout(t));
}

// null = could not be read (offline); a failed read is retried next tap.
export function loadManifest(subject) {
  if (!subject) return Promise.resolve(null);
  let p = manifests.get(subject);
  if (!p) {
    p = fetchWithTimeout(manifestUrl(subject), MANIFEST_TIMEOUT_MS)
      .then((r) => (r.ok ? r.json() : r.status === 404 ? [] : null))
      .then((list) => (Array.isArray(list) ? new Set(list) : null))
      .catch(() => null);
    manifests.set(subject, p);
    p.then((set) => { if (!set) manifests.delete(subject); });
  }
  return p;
}

export async function getSharedAudio(key, signal) {
  const cached = await cache.read(key);
  if (cached) return cached;
  const r = await fetchWithTimeout(clipUrl(key), FETCH_TIMEOUT_MS, signal);
  if (!r.ok) throw new Error(`clip ${r.status}`);
  const buf = await r.arrayBuffer();
  if (!buf.byteLength) throw new Error('empty clip');
  cache.write(key, buf);
  return buf;
}

/**
 * The clips for one question in reading order, or null when any is missing.
 * stem and options are the question's own text (options in display order).
 * Each item: { key, kind: 'stem' | 'label' | 'option' }.
 */
export async function sharedPlan({ stem, options, lang, subject, signal }) {
  const parts = [];
  const add = (text, kind) => { if (text) parts.push({ text, kind }); };
  add(clipText(stem, lang), 'stem');
  (options || []).forEach((o, i) => {
    const t = clipText(o, lang);
    if (!t) return;
    add(optionLabel(i, lang), 'label');
    add(t, 'option');
  });
  if (!parts.length) return null;
  const manifestP = loadManifest(subject);
  const keys = await Promise.all(parts.map((p) => clipKey(p.text)));
  parts.forEach((p, i) => { p.key = keys[i]; delete p.text; });
  // The stem's clip starts downloading alongside the manifest: on a slow
  // phone network that saves a round trip before the first word. When the
  // manifest says no, the request was one small 404.
  parts[0].buf = getSharedAudio(parts[0].key, signal);
  parts[0].buf.catch(() => {});
  const manifest = await manifestP;
  if (manifest) return parts.every((p) => manifest.has(p.key)) ? parts : null;
  // No manifest (offline): play only if every clip is already on the device.
  const hits = await Promise.all(parts.map((p) => cache.read(p.key)));
  return hits.every(Boolean) ? parts : null;
}

// Opens the connection to the clip host ahead of the first tap (DNS, TCP
// and TLS are three round trips on a phone network). Once per page.
let preconnected = false;
export function preconnect() {
  if (preconnected || typeof document === 'undefined') return;
  if (document.querySelector(`link[rel="preconnect"][href="${SHARED_TTS.base}"]`)) return;
  preconnected = true;
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = SHARED_TTS.base;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// Prefetch the manifest for a student who has used read-aloud before, so
// their next tap starts without waiting on it.
export function warmShared(subject) {
  preconnect();
  try {
    if (window.localStorage.getItem('vmx-tts-used') !== '1') return;
  } catch { return; }
  loadManifest(subject);
}
