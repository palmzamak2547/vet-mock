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
import { SHARED_GENS, SHARED_TTS, clipKey, clipParts, clipText, clipUrl, manifestUrl, optionLabel, segmentStarts } from './tts-text.js';

const FETCH_TIMEOUT_MS = 8000;
const MANIFEST_TIMEOUT_MS = 3000;
const cache = createAudioCache({ dbName: 'vmx-tts-shared' });
const manifests = new Map(); // 'gen/subject' -> Promise<Set<string> | null> (complete: the whole subject is voiced)

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
// A manifest is a list of clip names, or { complete, keys } for a
// generation that serves a subject only once it is whole: the Set it
// resolves to carries complete as a property.
export function loadManifest(subject, g = SHARED_TTS) {
  if (!subject) return Promise.resolve(null);
  const id = `${g.gen}/${subject}`;
  let p = manifests.get(id);
  if (!p) {
    p = fetchWithTimeout(manifestUrl(subject, g), MANIFEST_TIMEOUT_MS)
      .then((r) => (r.ok ? r.json() : r.status === 404 ? [] : null))
      .then((list) => {
        const keys = Array.isArray(list) ? list : Array.isArray(list?.keys) ? list.keys : null;
        if (!keys) return null;
        const set = new Set(keys);
        // A whole-subject generation is complete only where its manifest says
        // so: a missing one (404, read as []) or a plain list is not.
        set.complete = g.wholeSubject ? list?.complete === true : keys.length > 0 || list?.complete === true;
        return set;
      })
      .catch(() => null);
    manifests.set(id, p);
    p.then((set) => { if (!set) manifests.delete(id); });
  }
  return p;
}

// part: { key, url } from sharedPlan. The key names the clip in the
// device cache; it already carries the model and voice. The timeout covers
// the body too: a download that stalls after its headers would otherwise
// leave the read-aloud loading for ever.
const CLIP_TIMEOUT_MS = 20000;
export async function getSharedAudio({ key, url }, signal, timeout = CLIP_TIMEOUT_MS) {
  const cached = await cache.read(key);
  if (cached) return cached;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
  }
  try {
    const r = await fetch(url, { signal: ctrl.signal, mode: 'cors', credentials: 'omit' });
    if (!r.ok) throw new Error(`clip ${r.status}`);
    const buf = await r.arrayBuffer();
    if (!buf.byteLength) throw new Error('empty clip');
    cache.write(key, buf);
    return buf;
  } finally {
    clearTimeout(t);
  }
}

/**
 * The clips for one question in reading order, or null when any is missing.
 * stem and options are the question's own text (options in display order);
 * an explanation is read as a stem with no options.
 * Each item: { key, url, gen, text, kind: 'stem' | 'label' | 'option', option }
 * (option: the display index a label or option belongs to), all from one
 * generation: the newest whose manifest lists every clip. A segmented
 * generation gives a piece one item per sentence-sized part, each with
 * full (the piece's whole text), from (the words before it) and segs.
 * A whole-subject generation plays only where its manifest is complete.
 */
export async function sharedPlan({ stem, options, lang, subject, signal, prefetch = true }) {
  const parts = [];
  const add = (text, kind, option = -1) => { if (text) parts.push({ text, kind, option }); };
  add(clipText(stem, lang), 'stem');
  (options || []).forEach((o, i) => {
    const t = clipText(o, lang);
    if (!t) return;
    add(optionLabel(i, lang), 'label', i);
    add(t, 'option', i);
  });
  if (!parts.length) return null;
  // Every generation's manifest is asked for at once, then they are read in
  // order, newest first: only the voice that wins downloads its first clip,
  // and a generation without the question costs no request for one.
  const gens = SHARED_GENS.map(async (g) => {
    const manifest = await loadManifest(subject, g);
    // A generation that serves whole subjects only: nothing until it is done.
    if (g.wholeSubject && !manifest?.complete) return null;
    const pieces = parts.flatMap((p) => {
      const segs = clipParts(p.text, g);
      const starts = segmentStarts(p.text, segs);
      return segs.map((text, k) => ({ ...p, text, full: p.text, from: starts[k], segs: segs.length }));
    });
    const keys = await Promise.all(pieces.map((p) => clipKey(p.text, g)));
    const plan = pieces.map((p, i) => ({ ...p, key: keys[i], url: clipUrl(keys[i], g), gen: g.gen }));
    const whole = manifest ? plan.every((p) => manifest.has(p.key))
      // No manifest (offline): play only if every clip is already on the device.
      : (await Promise.all(plan.map((p) => cache.read(p.key)))).every(Boolean);
    return whole ? plan : null;
  });
  for (const g of gens) {
    const plan = await g;
    if (!plan) continue;
    if (prefetch) {
      plan[0].buf = getSharedAudio(plan[0], signal);
      plan[0].buf.catch(() => {});
    }
    return plan;
  }
  return null;
}

// The second each word of a part's text starts ({ w } beside an e1 clip,
// scripts/tts-clips.mjs), or null: g1 clips and options carry none.
const words = new Map(); // url -> Promise<number[] | null>
export function loadWords(part) {
  if (part.gen !== 'e1' || part.kind !== 'stem') return Promise.resolve(null);
  const url = part.url.replace(/\.mp4$/, '.json');
  let p = words.get(url);
  if (!p) {
    p = fetchWithTimeout(url, FETCH_TIMEOUT_MS)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => (Array.isArray(j?.w) ? j.w : null))
      .catch(() => null);
    words.set(url, p);
  }
  return p;
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
