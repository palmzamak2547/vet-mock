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

import { audioCacheKey, createAudioCache } from './tts-cache.js';

const FETCH_TIMEOUT_MS = 8000;
// Cached MP3 chunks live in their own database ('vmx-tts'), bounded and
// expired by tts-cache.js.
const cache = createAudioCache({ dbName: 'vmx-tts' });

/**
 * Fetch (or cache-hit) MP3 audio for a given text.
 * @returns ArrayBuffer of MP3 bytes
 * @throws on network/timeout/non-200
 */
export async function getEdgeAudio({ text, lang, rate = 1.0 }, signal) {
  const key = await audioCacheKey({ text, lang, rate });

  // A hit younger than 30 days plays from the device; an older one is
  // dropped and fetched fresh, which also picks up the voice updates
  // Microsoft ships.
  const cached = await cache.read(key);
  if (cached) return cached;

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

  // Best-effort cache write (not awaited); it also runs the throttled
  // eviction sweep that keeps the store bounded over a long session.
  cache.write(key, audio);

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
