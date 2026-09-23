// ============================================================
// tts-iapp — Thai-native neural TTS via iApp Kaitom Voice V3
// ============================================================
//
// What this provides:
//   • One-call audio synthesis using iApp Technology's Kaitom V3
//     model (Thai team, native Thai training, preserves ไม้เอก/โท/
//     ตรี/จัตวา + Thai-English code-switch).
//   • An IndexedDB cache built by tts-cache.js, like tts-edge.js's —
//     keyed by hash of the text — so a Q's audio survives reloads /
//     offline.
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
import { audioCacheKey, createAudioCache } from './tts-cache.js';

const FETCH_TIMEOUT_MS = 10_000;
// iApp WAV chunks are ~4x the bytes of Edge MP3 for the same duration,
// so they get their own database ('vmx-tts-iapp') and their own 30 MB
// budget; tts-cache.js bounds and expires it the same way.
const cache = createAudioCache({ dbName: 'vmx-tts-iapp' });

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
  // The key takes lang as well as speed: iApp infers the language from
  // the text, but identical text in two languages must not collide, and
  // a different speed is different audio.
  const key = await audioCacheKey({ text, lang, rate: speed });

  const cached = await cache.read(key);
  if (cached) return cached;

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

  cache.write(key, audio);

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
