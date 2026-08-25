// ============================================================
// /api/tts-iapp — iApp Kaitom Voice V3 proxy (Thai-native neural)
// ============================================================
//
// Why this endpoint exists, in addition to /api/tts (Microsoft Edge):
//
//   Microsoft's Premwadee is a *good* neural voice but it's trained
//   on multilingual data with Thai as one of many languages. Thai
//   tone marks (ไม้เอก/โท/ตรี/จัตวา) and code-switching to English
//   medical terms sometimes come out flat.
//
//   iApp Kaitom V3 is built by a Thai team (iApp Technology, Bangkok),
//   trained natively on Thai. Quality is materially better for clinical
//   content where exact tone + Thai-English mixing matters. They also
//   ship an alpha-period free tier (50 "IC" credits = ~20,000 chars
//   per fresh account).
//
//   Dispatch policy (in src/lib/tts.js): iApp → Edge → Web Speech.
//   This endpoint just brokers the request; the client decides when
//   to call it.
//
// Auth: requires IAPP_API_KEY env var (set in Vercel project settings).
// Without the key set, the endpoint returns 503 so the client knows to
// fall through to the Edge path.
//
// Audio: returns WAV/PCM bytes from iApp (24 kHz mono) — the same
// audio element the client uses for Edge MP3 plays it fine since we
// proxy the original Content-Type header.
// ============================================================

import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

// V3 endpoint — docs as of 2026-05-16:
// https://iapp.co.th/docs/speech/text-to-speech/text-to-speech-v3
// Returns raw signed 16-bit LE PCM @ 24kHz mono (NOT WAV) — we wrap
// in a WAV header before forwarding so the browser <audio> element
// can play it directly without client-side ffmpeg-style assembly.
const IAPP_ENDPOINT = 'https://api.iapp.co.th/v3/store/audio/tts';
const IAPP_SAMPLE_RATE = 24000;
const IAPP_CHANNELS = 1;
const IAPP_BITS_PER_SAMPLE = 16;

// Build a 44-byte RIFF/WAVE header for raw 16-bit LE PCM data.
// All fields are little-endian unsigned ints (per WAV spec).
function wavHeader(pcmByteLen) {
  const byteRate = (IAPP_SAMPLE_RATE * IAPP_CHANNELS * IAPP_BITS_PER_SAMPLE) / 8;
  const blockAlign = (IAPP_CHANNELS * IAPP_BITS_PER_SAMPLE) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmByteLen, 4);           // file size − 8
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);                        // PCM fmt chunk size
  header.writeUInt16LE(1, 20);                         // format = PCM
  header.writeUInt16LE(IAPP_CHANNELS, 22);
  header.writeUInt32LE(IAPP_SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(IAPP_BITS_PER_SAMPLE, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmByteLen, 40);
  return header;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  // ── CORS — same pattern as /api/tts ────────────────────────
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  } else if (req.headers.origin) {
    return res.status(403).json({ error: 'origin not allowed' });
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  // ── Fail-fast when not configured ──────────────────────────
  // Returning 503 (not 500) is intentional: the client treats 503 as
  // "provider unavailable, ladder down to the next one" rather than
  // a hard error. Until Palm pastes the key into Vercel env, every
  // call lands here and silently falls through to /api/tts.
  const API_KEY = process.env.IAPP_API_KEY;
  if (!API_KEY) {
    return res.status(503).json({
      error: 'iapp not configured',
      hint: 'Set IAPP_API_KEY in Vercel env to enable this provider.',
    });
  }

  // ── Rate limit ─────────────────────────────────────────────
  // iApp's own quota will catch abuse upstream, but a local limit
  // protects the free 50 IC trial from being burned in one bad loop.
  // 30/5min/IP = ≤1 call every 10 s on average per user — plenty for
  // ExamView Q-by-Q reading.
  const limit = await rateLimit(`tts-iapp:${clientIP(req)}`, 30, 5 * 60_000);
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({ error: 'rate limited', retryAfter: limit.retryAfter });
  }

  // ── Parse body (same b64 sentinel trick as /api/tts) ───────
  // Vercel edge HTTP layer mangles non-ASCII bytes upstream of any
  // user code; client base64-encodes the JSON to keep it pure ASCII.
  // See api/tts.js for the full archaeology.
  let body;
  try {
    let raw = typeof req.body === 'string' ? req.body : '';
    if (!raw && req.rawBody && Buffer.isBuffer(req.rawBody)) raw = req.rawBody.toString('utf8');
    if (!raw && req.readable) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      raw = Buffer.concat(chunks).toString('utf8');
    }
    if (!raw) return res.status(400).json({ error: 'empty body' });

    const ct = String(req.headers['content-type'] || '');
    let payload = raw;
    if (ct.includes('application/vmx-b64') || raw.startsWith('b64:')) {
      const b64 = raw.startsWith('b64:') ? raw.slice(4) : raw;
      payload = Buffer.from(b64, 'base64').toString('utf8');
    }
    body = payload ? JSON.parse(payload) : {};
  } catch (e) {
    return res.status(400).json({ error: 'bad json', detail: String(e?.message).slice(0, 100) });
  }

  const { text, speed } = body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'missing text' });
  }
  // iApp V3 docs cap at ~1,000 Thai chars per call; we cap at 1000 to
  // stay well clear. The dispatcher already chunks on sentence
  // boundaries before calling.
  if (text.length > 1000) {
    return res.status(400).json({ error: 'text too long (max 1000 chars for iApp v3)' });
  }
  // Clamp speed to iApp's documented range so an upstream 400 doesn't
  // burn a request that we could have rejected locally for free.
  let speedNum = Number(speed);
  if (!Number.isFinite(speedNum)) speedNum = 1.0;
  speedNum = Math.max(0.8, Math.min(1.2, speedNum));

  // Protect the shared Thai-voice quota even when callers rotate IPs. A 503
  // intentionally tells the client dispatcher to continue to Edge TTS.
  const providerBudget = await rateLimit('provider:iapp:daily', 200, 24 * 60 * 60 * 1000);
  if (!providerBudget.ok) {
    res.setHeader('Retry-After', String(providerBudget.retryAfter));
    return res.status(503).json({ error: 'iapp daily capacity reached' });
  }

  // ── Forward to iApp ────────────────────────────────────────
  // V3 contract: POST JSON {text, speed} with `apikey:` custom header
  // (NOT `Authorization: Bearer`). Response is raw 16-bit LE PCM at
  // 24kHz mono with Content-Type: application/octet-stream — we wrap
  // it in a WAV header so the browser <audio> element can play the
  // result like any other WAV.
  //
  // The 9-second AbortController matches the function timeout so the
  // client gets a clean 504 instead of Vercel's generic 504 when iApp
  // is slow.
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9_000);
  try {
    const upstream = await fetch(IAPP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY,
        'Accept': 'application/octet-stream, audio/*',
      },
      body: JSON.stringify({ text, speed: speedNum }),
      signal: ctrl.signal,
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      // Map iApp's documented error codes (400/402/413/429/503) to
      // sensible client responses. 402 (insufficient credits) is
      // worth surfacing distinctly so the operator gets a clear
      // signal — not "the TTS just stopped working".
      const passthrough = [401, 402, 403, 429];
      const status = passthrough.includes(upstream.status) ? upstream.status : 502;
      return res.status(status).json({
        error: upstream.status === 402
          ? 'iapp insufficient credits — top up at iapp.co.th'
          : 'iapp upstream error',
        status: upstream.status,
        detail: errText.slice(0, 200),
      });
    }

    const pcm = Buffer.from(await upstream.arrayBuffer());
    if (pcm.length === 0) {
      return res.status(502).json({ error: 'empty audio' });
    }

    // Wrap PCM in a WAV header so the browser audio element gets a
    // self-describing format. Header is 44 bytes; the body is the PCM
    // we already have.
    const wav = Buffer.concat([wavHeader(pcm.length), pcm]);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'private, max-age=86400, immutable');
    res.setHeader('Content-Length', String(wav.length));
    return res.send(wav);
  } catch (err) {
    const aborted = err?.name === 'AbortError';
    console.error('[tts-iapp] error:', err?.message || err);
    return res.status(aborted ? 504 : 502).json({
      error: aborted ? 'iapp upstream timeout' : 'iapp upstream error',
      detail: String(err?.message || err).slice(0, 200),
    });
  } finally {
    clearTimeout(t);
  }
}
