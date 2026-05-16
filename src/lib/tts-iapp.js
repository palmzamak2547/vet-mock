// ============================================================
// tts-iapp — Thai-native neural TTS via iApp Kaitom Voice V3
// ============================================================
//
// What this provides:
//   • One-call audio synthesis using iApp Technology's Kaitom V3
//     model (Thai team, native Thai training, preserves ไม้เอก/โท/
//     ตรี/จัตวา + Thai-English code-switch).
//   • Same IndexedDB cache shape as tts-edge.js — keyed by hash of
//     the text — so a Q's audio survives reloads / offline.
//   • Cancellable playback that piggybacks on the existing audio
//     registry in tts-edge so a global cancelSpeech() stops both
//     providers cleanly.
//
// When this fires:
//   src/lib/tts.js tries iApp first when:
//     (a) The /api/tts-iapp endpoint exists (it always does in this
//         build), AND
//     (b) The last call didn't return 503 "iapp not configured"
//         (cached for the session so we don't keep hammering an
//         endpoint that needs a key set in Vercel env).
//   On failure → ladder to Edge Premwadee → Web Speech.
//
// When to bail:
//   503 from server (no IAPP_API_KEY set) → mark provider unavailable
//   for the session so subsequent calls skip straight to Edge.
//   Any other error → throw so the dispatcher tries the next provider.
// ============================================================

import { playArrayBuffer } from './tts-edge.js';

const DB_NAME = 'vmx-tts-iapp';
const STORE = 'audio';
const VERSION = 1;
const FETCH_TIMEOUT_MS = 10_000;
// iApp WAV chunks are larger than Edge MP3 (~4× the bytes for the same
// duration), but the cache is bounded the same way — eviction kicks in
// at MAX_CACHE_BYTES so a heavy practice run can't fill the device.
const MAX_CACHE_BYTES = 30 * 1024 * 1024;
const EVICT_TARGET_BYTES = Math.floor(MAX_CACHE_BYTES * 0.80);
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
let _lastEvictAt = 0;
const EVICT_THROTTLE_MS = 30_000;

// Session-scoped "provider unavailable" flag. When the proxy returns
// 503 we know IAPP_API_KEY isn't set; flipping this to true makes
// subsequent calls fall straight through to Edge without a wasted
// round-trip per Q. Reset on full reload.
let _unavailable = false;
export function isIAppAvailable() {
  return !_unavailable;
}
export function markIAppUnavailable() {
  _unavailable = true;
}

let _dbPromise = null;
function openDb() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexeddb'));
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
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
  } catch { /* cache miss is harmless */ }
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

async function evictStale(force = false) {
  const now = Date.now();
  if (!force && now - _lastEvictAt < EVICT_THROTTLE_MS) return;
  _lastEvictAt = now;
  let entries = await dbListAll();
  if (entries.length === 0) return;
  for (const e of entries) {
    if (now - e.ts > TTL_MS) dbDelete(e.key).catch(() => {});
  }
  entries = entries.filter((e) => now - e.ts <= TTL_MS);
  let total = entries.reduce((s, e) => s + e.bytes, 0);
  if (total <= MAX_CACHE_BYTES) return;
  entries.sort((a, b) => a.ts - b.ts);
  while (total > EVICT_TARGET_BYTES && entries.length > 0) {
    const evict = entries.shift();
    dbDelete(evict.key).catch(() => {});
    total -= evict.bytes;
  }
}

// iApp's v3 endpoint accepts {text, speed} (speed 0.8–1.2). `lang` is
// inferred from the text itself by iApp, but we still take it as a
// param for API parity with getEdgeAudio and to disambiguate the
// cache key (Thai vs English text with identical content can otherwise
// collide; speed feeds the key too since different rates produce
// different audio).
async function hashKey({ text, lang, speed }) {
  const data = new TextEncoder().encode(`${lang}|${Number(speed).toFixed(2)}|${text}`);
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
 * Fetch (or cache-hit) iApp Kaitom audio for the given text.
 * Throws on any failure; caller decides whether to fall back.
 *
 * @param {{text: string, lang?: string, rate?: number}} args
 *   `rate` is mapped to iApp's `speed` param (clamped to 0.8–1.2
 *   server-side). Default 1.0 = normal pace.
 * @param {AbortSignal} [signal]
 * @returns {Promise<ArrayBuffer>} audio bytes (WAV / 24kHz mono, with
 *   header already wrapped by the proxy so <audio> can play directly).
 */
export async function getIAppAudio({ text, lang = 'th', rate = 1.0 }, signal) {
  if (_unavailable) throw new Error('iapp unavailable for session');

  // iApp's "speed" maps 1:1 onto our "rate" semantic (1.0 = normal,
  // 0.8 = slower, 1.2 = faster). We pass through unchanged; the proxy
  // clamps to the supported range so we don't waste a request on a
  // user-typed 2.0.
  const speed = Number(rate);
  const key = await hashKey({ text, lang, speed });

  const cached = await dbGet(key);
  if (cached?.audio) {
    const age = Date.now() - (cached.ts || 0);
    if (age > TTL_MS) dbDelete(key).catch(() => {});
    else {
      dbPut(key, { ...cached, ts: Date.now() }).catch(() => {});
      return cached.audio;
    }
  }

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
  }

  let response;
  try {
    // Same Vercel-edge-byte-mangle workaround as /api/tts: client
    // base64-encodes the JSON so Thai bytes survive intact.
    const json = JSON.stringify({ text, lang, speed });
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, 'utf8').toString('base64');
    response = await fetch('/api/tts-iapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/vmx-b64' },
      body: 'b64:' + b64,
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }

  if (response.status === 503) {
    // Server has no IAPP_API_KEY set — flip the session flag so we stop
    // calling it for this page lifetime. Next reload will retry once.
    markIAppUnavailable();
    throw new Error('iapp not configured (503)');
  }
  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`iapp tts ${response.status}: ${errText.slice(0, 100)}`);
  }
  const audio = await response.arrayBuffer();
  if (!audio || audio.byteLength === 0) throw new Error('empty audio');

  dbPut(key, { audio, ts: Date.now(), bytes: audio.byteLength })
    .then(() => evictStale())
    .catch(() => {});

  return audio;
}

/**
 * High-level: synthesize + play one chunk via iApp. Honors a controller's
 * `cancelled` flag (checked before fetch + before play). Throws on any
 * failure so the dispatcher can fall through to the next provider.
 *
 * playArrayBuffer is imported from tts-edge so a global cancelSpeech()
 * (which calls stopAllEdgeAudio) stops iApp audio too — they share the
 * same live-audio registry inside that module.
 */
export async function speakViaIApp({ text, lang, controller }) {
  if (!text || !text.trim()) return;
  if (controller?.cancelled) return;

  const audio = await getIAppAudio({ text, lang }, controller?.signal);
  if (controller?.cancelled) return;

  // Proxy wraps iApp's raw PCM in a WAV header server-side, so this
  // ArrayBuffer is a valid audio/wav stream.
  const player = playArrayBuffer(audio, 'audio/wav');
  if (controller) {
    if (!controller._players) controller._players = new Set();
    controller._players.add(player);
  }
  await player.finished;
  if (controller?._players) controller._players.delete(player);
}

// ── Cache management (parallels the tts-edge exports) ──────────
export async function forceEvictIAppCache() {
  await evictStale(true);
}
export async function clearIAppCache() {
  try {
    const store = await dbTx('readwrite');
    return await new Promise((res, rej) => {
      const r = store.clear();
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  } catch { /* ignore */ }
}
export async function iappCacheSize() {
  try {
    const store = await dbTx('readonly');
    return await new Promise((res, rej) => {
      const all = [];
      const r = store.openCursor();
      r.onsuccess = (e) => {
        const c = e.target.result;
        if (c) { all.push(c.value); c.continue(); }
        else res({
          entries: all.length,
          bytes: all.reduce((s, v) => s + (v.bytes || v.audio?.byteLength || 0), 0),
          maxBytes: MAX_CACHE_BYTES,
        });
      };
      r.onerror = () => rej(r.error);
    });
  } catch {
    return { entries: 0, bytes: 0, maxBytes: MAX_CACHE_BYTES };
  }
}
