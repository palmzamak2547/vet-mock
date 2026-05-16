// ============================================================
// tts-edge — neural-voice TTS via /api/tts proxy + IndexedDB cache
// ============================================================
//
// What this provides:
//   • One-call audio synthesis using Microsoft Edge neural voices
//     (Premwadee Thai / Aria English) regardless of browser.
//   • Aggressive IndexedDB caching keyed by hash(lang+rate+text). A Q
//     played once is instant on every replay across sessions.
//   • Cancellable playback so navigating to a new Q stops audio mid-flight.
//
// When this is the right path:
//   Use this for stem + per-option synthesis when the user's browser is
//   on a "standard" tier (SAPI offline). The UX win is enormous — same
//   neural quality on Windows Chrome as on iPhone.
//
// When to bail:
//   On error / timeout / network down → caller should fall back to
//   Web Speech API. This module's `speakViaEdge` just throws on failure;
//   the caller handles the fallback decision.
// ============================================================

const DB_NAME = 'vmx-tts';
const STORE = 'audio';
const VERSION = 1;
const FETCH_TIMEOUT_MS = 8000;
// Cache caps. Eviction runs after each successful write so the store
// stays bounded even on heavy practice sessions. Was 50 MB but 30 MB
// holds ~85 chunks (mean 350 KB / 5-chunk Q) — plenty for the active
// study set. LRU keeps hot Qs around; cold ones age out.
const MAX_CACHE_BYTES = 30 * 1024 * 1024;
const EVICT_TARGET_BYTES = Math.floor(MAX_CACHE_BYTES * 0.80); // hysteresis target
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // entries older than 30 days auto-expire
// Throttle eviction so rapid-fire plays don't trigger a sweep each time
let _lastEvictAt = 0;
const EVICT_THROTTLE_MS = 30_000;

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
  } catch {
    /* ignore — cache miss is fine */
  }
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

// Walk every entry. Returns array of { key, ts, bytes } (audio NOT
// included so the walk is light — eviction only needs metadata).
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
          all.push({
            key: c.primaryKey,
            ts: v?.ts || 0,
            bytes: v?.bytes || v?.audio?.byteLength || 0,
          });
          c.continue();
        } else {
          res(all);
        }
      };
      r.onerror = () => rej(r.error);
    });
  } catch {
    return [];
  }
}

// LRU + TTL eviction. Runs after each successful write; throttled to
// once per 30 sec so a burst of plays doesn't sweep on every call.
// Logic:
//   1. Drop entries older than TTL_MS (30 days) — these would be purged
//      by iOS Safari anyway on inactive-week eviction.
//   2. If still over MAX_CACHE_BYTES, drop oldest entries (by ts)
//      until total fits under EVICT_TARGET_BYTES (80% of cap — gives
//      headroom so the next write doesn't trigger eviction again).
async function evictStale(force = false) {
  const now = Date.now();
  if (!force && now - _lastEvictAt < EVICT_THROTTLE_MS) return;
  _lastEvictAt = now;
  let entries = await dbListAll();
  if (entries.length === 0) return;

  // (1) TTL pass — drop stale
  for (const e of entries) {
    if (now - e.ts > TTL_MS) {
      dbDelete(e.key).catch(() => {});
    }
  }
  entries = entries.filter((e) => now - e.ts <= TTL_MS);

  // (2) Size pass — LRU evict to target
  let total = entries.reduce((s, e) => s + e.bytes, 0);
  if (total <= MAX_CACHE_BYTES) return;
  entries.sort((a, b) => a.ts - b.ts); // oldest first
  while (total > EVICT_TARGET_BYTES && entries.length > 0) {
    const evict = entries.shift();
    dbDelete(evict.key).catch(() => {});
    total -= evict.bytes;
  }
}

// Hash text+voice+rate → 16-byte hex (128 bits, plenty for cache key).
async function hashKey({ text, lang, rate }) {
  const data = new TextEncoder().encode(`${lang}|${Number(rate).toFixed(2)}|${text}`);
  if (typeof crypto?.subtle?.digest !== 'function') {
    // Fallback: simple FNV-1a 32-bit hash
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
 * Fetch (or cache-hit) MP3 audio for a given text.
 * @returns ArrayBuffer of MP3 bytes
 * @throws on network/timeout/non-200
 */
export async function getEdgeAudio({ text, lang, rate = 1.0 }, signal) {
  const key = await hashKey({ text, lang, rate });

  // Cache lookup with TTL check — if the cached entry is older than
  // TTL_MS, treat as miss + delete so we re-fetch fresh audio. This
  // catches the case where iOS Safari is about to evict storage anyway
  // (it purges inactive-7-day caches): we age-out at 30 days so we
  // get fresher entries from the upstream voice updates Microsoft ships.
  const cached = await dbGet(key);
  if (cached?.audio) {
    const age = Date.now() - (cached.ts || 0);
    if (age > TTL_MS) {
      dbDelete(key).catch(() => {});
    } else {
      // Touch ts so LRU eviction prefers stale entries
      dbPut(key, { ...cached, ts: Date.now() }).catch(() => {});
      return cached.audio;
    }
  }

  // Network fetch with explicit timeout
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
  }

  let response;
  try {
    // Vercel's edge HTTP layer mangles non-ASCII bytes (Thai chars all
    // become "?" before reaching the function — confirmed via debug
    // echo). Base64-encode the JSON to keep the payload pure ASCII.
    // Server decodes via the "b64:" prefix (see api/tts.js).
    const json = JSON.stringify({ text, lang, rate });
    const b64 = typeof btoa === 'function'
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, 'utf8').toString('base64');
    response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/vmx-b64' },
      body: 'b64:' + b64,
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`tts ${response.status}: ${errText.slice(0, 100)}`);
  }
  const audio = await response.arrayBuffer();
  if (!audio || audio.byteLength === 0) throw new Error('empty audio');

  // Best-effort cache write (don't await; fire-and-forget). Then kick
  // off a throttled eviction sweep — this is what actually keeps the
  // store bounded over a long study session.
  dbPut(key, { audio, ts: Date.now(), bytes: audio.byteLength })
    .then(() => evictStale())
    .catch(() => {});

  return audio;
}

// Live audio element registry — used so cancelSpeech() can stop playback
// from anywhere, not just the speakQuestion that created it.
const _liveAudios = new Set();

/**
 * Play an MP3 ArrayBuffer. Returns a Promise that resolves when the audio
 * finishes (or errors out or is cancelled). The returned controller can
 * stop playback explicitly.
 */
export function playArrayBuffer(arrayBuffer, mimeType = 'audio/mpeg') {
  // mimeType hints the decoder. Browsers ALSO content-sniff so WAV
  // bytes in an audio/mpeg-typed blob still play (Chrome/Safari/Firefox
  // tested), but passing the real type keeps things tidy when multiple
  // providers feed different formats: Edge → MP3, iApp → WAV.
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  _liveAudios.add(audio);

  let resolved = false;
  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    _liveAudios.delete(audio);
    URL.revokeObjectURL(url);
  };

  const finished = new Promise((resolve) => {
    audio.addEventListener('ended', () => { cleanup(); resolve(); }, { once: true });
    audio.addEventListener('error', () => { cleanup(); resolve(); }, { once: true });
  });

  audio.play().catch(() => { cleanup(); });

  return {
    audio,
    finished,
    stop() {
      try { audio.pause(); audio.currentTime = audio.duration || 0; } catch {}
      cleanup();
    },
  };
}

/**
 * Stop ALL currently-playing Edge audio. Wired into cancelSpeech() in
 * the main tts.js so it's a one-stop "shut up everything".
 */
export function stopAllEdgeAudio() {
  for (const a of _liveAudios) {
    try { a.pause(); a.currentTime = 0; } catch {}
  }
  _liveAudios.clear();
}

/**
 * High-level: synthesize + play one chunk via Edge TTS. Returns a Promise
 * that resolves when audio ends. Honors a controller's `cancelled` flag
 * (checked before fetch + before play). Throws on any failure so caller
 * can fall back to Web Speech.
 */
export async function speakViaEdge({ text, lang, rate = 1.0, controller }) {
  if (!text || !text.trim()) return;
  if (controller?.cancelled) return;

  const audio = await getEdgeAudio({ text, lang, rate }, controller?.signal);
  if (controller?.cancelled) return;

  const player = playArrayBuffer(audio);
  // Wire the player into the controller so cancellation can stop it
  if (controller) {
    if (!controller._players) controller._players = new Set();
    controller._players.add(player);
  }
  await player.finished;
  if (controller?._players) controller._players.delete(player);
}

/**
 * Stop in-flight Edge playback associated with a controller.
 */
export function stopControllerEdge(controller) {
  if (!controller?._players) return;
  for (const p of controller._players) {
    try { p.stop(); } catch {}
  }
  controller._players.clear();
}

// Force an immediate LRU + TTL eviction sweep (ignores throttle).
// Useful from DashboardView debug or after a long offline period.
export async function forceEvictCache() {
  await evictStale(true);
}

// Cache management — exposed for DashboardView "clear cache" if added
export async function clearEdgeCache() {
  try {
    const store = await dbTx('readwrite');
    return await new Promise((res, rej) => {
      const r = store.clear();
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  } catch { /* ignore */ }
}

export async function edgeCacheSize() {
  try {
    const store = await dbTx('readonly');
    return await new Promise((res, rej) => {
      const all = [];
      const r = store.openCursor();
      r.onsuccess = (e) => {
        const c = e.target.result;
        if (c) {
          all.push(c.value);
          c.continue();
        } else {
          res({
            entries: all.length,
            bytes: all.reduce((s, v) => s + (v.bytes || (v.audio?.byteLength || 0)), 0),
            maxBytes: MAX_CACHE_BYTES,
          });
        }
      };
      r.onerror = () => rej(r.error);
    });
  } catch {
    return { entries: 0, bytes: 0, maxBytes: MAX_CACHE_BYTES };
  }
}
