// ============================================================
// tts-shared — pre-generated question audio, the same for everyone
// ============================================================
// scripts/tts-clips.mjs speaks each stem, option, option label and
// explanation once and stores it on R2 behind tts.vetmock.com, named by
// clipKey(text, generation). Two generations exist: e1 (ElevenLabs Sarah)
// and g1 (Gemini Kore), each with a per-subject manifest listing its clips,
// so a tap knows at once whether it can play them or must fall back to the
// live voices. Clips also land in this device's IndexedDB, so a question
// heard once replays offline.
// ============================================================

import { createAudioCache } from './tts-cache.js';
import { SHARED_GENS, SHARED_TTS, clipKey, clipText, clipUrl, manifestUrl, optionLabel } from './tts-text.js';

const FETCH_TIMEOUT_MS = 8000;
const MANIFEST_TIMEOUT_MS = 3000;
const cache = createAudioCache({ dbName: 'vmx-tts-shared' });
const manifests = new Map(); // 'gen/subject' -> Promise<Set<string> | null>

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
export function loadManifest(subject, g = SHARED_TTS) {
  if (!subject) return Promise.resolve(null);
  const id = `${g.gen}/${subject}`;
  let p = manifests.get(id);
  if (!p) {
    p = fetchWithTimeout(manifestUrl(subject, g), MANIFEST_TIMEOUT_MS)
      .then((r) => (r.ok ? r.json() : r.status === 404 ? [] : null))
      .then((list) => (Array.isArray(list) ? new Set(list) : null))
      .catch(() => null);
    manifests.set(id, p);
    p.then((set) => { if (!set) manifests.delete(id); });
  }
  return p;
}

// part: { key, url } from sharedPlan. The key names the clip in the
// device cache; it already carries the model and voice.
export async function getSharedAudio({ key, url }, signal) {
  const cached = await cache.read(key);
  if (cached) return cached;
  const r = await fetchWithTimeout(url, FETCH_TIMEOUT_MS, signal);
  if (!r.ok) throw new Error(`clip ${r.status}`);
  const buf = await r.arrayBuffer();
  if (!buf.byteLength) throw new Error('empty clip');
  cache.write(key, buf);
  return buf;
}

/**
 * The clips for one question in reading order, or null when any is missing.
 * stem and options are the question's own text (options in display order);
 * an explanation is read as a stem with no options.
 * Each item: { key, url, kind: 'stem' | 'label' | 'option' }, all from one
 * generation: the newest whose manifest lists every clip.
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
  const gens = SHARED_GENS.map((g) => ({
    manifest: loadManifest(subject, g),
    plan: Promise.all(parts.map((p) => clipKey(p.text, g)))
      .then((keys) => parts.map((p, i) => ({ kind: p.kind, key: keys[i], url: clipUrl(keys[i], g) }))),
  }));
  // The newest generation's stem clip starts downloading alongside the
  // manifests: on a slow phone network that saves a round trip before the
  // first word. When its manifest says no, the request was one small 404.
  const first = await gens[0].plan;
  first[0].buf = getSharedAudio(first[0], signal);
  first[0].buf.catch(() => {});
  for (const g of gens) {
    const [plan, manifest] = await Promise.all([g.plan, g.manifest]);
    if (manifest ? plan.every((p) => manifest.has(p.key))
      // No manifest (offline): play only if every clip is already on the device.
      : (await Promise.all(plan.map((p) => cache.read(p.key)))).every(Boolean)) return plan;
  }
  return null;
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

// Prefetch the manifests for a student who has used read-aloud before, so
// their next tap starts without waiting on them.
export function warmShared(subject) {
  preconnect();
  try {
    if (window.localStorage.getItem('vmx-tts-used') !== '1') return;
  } catch { return; }
  for (const g of SHARED_GENS) loadManifest(subject, g);
}
