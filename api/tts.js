// ============================================================
// /api/tts — Microsoft Edge TTS proxy (neural-voice quality)
// ============================================================
//
// Why this endpoint exists:
//   Web Speech API on Windows desktop falls back to SAPI offline
//   voices (Pattara, Zira) which are 1995-era formant synthesis —
//   robotic and tiring to listen to. Phone users get Apple/Google
//   neural voices automatically. This endpoint closes that gap by
//   proxying to Microsoft's free Edge TTS WebSocket service, which
//   produces neural-quality audio (Aria, Jenny, Premwadee, Niwat)
//   identical to the voices Microsoft Edge browser uses for read-aloud.
//
// Audio is returned as MP3 24kHz mono. Frontend caches in IndexedDB
// keyed by hash(text+voice+rate) so repeat plays are instant + offline.
//
// Cost: Microsoft serves this for free for Edge users. The endpoint is
// "unofficial" in that Microsoft hasn't published it as a public API,
// but it's been stable for years and is what countless TTS libraries
// (msedge-tts, edge-tts/python, etc.) target. If it ever breaks, the
// frontend falls back to Web Speech automatically.
//
// Limits:
//   • 3000 char text cap (single utterance)
//   • 60 requests / 5 min / IP (rate-limited)
//   • 9-sec function timeout (Vercel Hobby = 10s max)
// ============================================================

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { rateLimit, clientIP, allowedOrigin } from './_lib/rate-limit.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

// Voice mapping. Premwadee/Niwat = Thai neural; Aria/Jenny = US English
// neural. We pick female voices by default (Aria, Premwadee) since
// female voices test better for clinical content clarity.
const VOICE_MAP = {
  th: 'th-TH-PremwadeeNeural',
  en: 'en-US-AriaNeural',
};

export default async function handler(req, res) {
  // ── CORS ───────────────────────────────────────────────────
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

  // ── Rate limit ─────────────────────────────────────────────
  const limit = rateLimit(`tts:${clientIP(req)}`, 60, 5 * 60_000);
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    return res.status(429).json({ error: 'rate limited', retryAfter: limit.retryAfter });
  }

  // ── Parse body ─────────────────────────────────────────────
  // Read raw stream + decode UTF-8 explicitly. Vercel's auto body parser
  // sometimes mangles non-Latin chars (Thai script came through as
  // mojibake on first deploy → 502 "empty audio" when Edge TTS
  // received the broken text). Reading raw bytes + JSON.parse preserves
  // codepoints exactly.
  let body;
  try {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      body = req.body;
    } else {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    }
  } catch (e) {
    return res.status(400).json({ error: 'bad json', detail: String(e?.message).slice(0, 100) });
  }
  const { text, lang = 'th', rate = 1.0, debug } = body;
  // ── Debug echo — diagnoses what Vercel's body parsing delivered.
  // Triggered with {"debug":true} in the body. Returns the received
  // text bytes + length so we can confirm Thai UTF-8 survived.
  if (debug) {
    const bytes = text ? Buffer.from(text, 'utf8').toString('hex') : '';
    return res.status(200).json({
      receivedText: text,
      receivedLang: lang,
      codePoints: text ? Array.from(text).map((c) => c.codePointAt(0).toString(16)) : [],
      utf8HexBytes: bytes,
      bodyParserType: typeof req.body,
    });
  }
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'missing text' });
  }
  if (text.length > 3000) {
    return res.status(400).json({ error: 'text too long (max 3000 chars)' });
  }
  const voice = VOICE_MAP[lang] || VOICE_MAP.th;
  // Edge TTS rate format: "+10%" / "-5%" / "0%" relative to default
  const ratePct = Math.max(-50, Math.min(200, Math.round((Number(rate) - 1) * 100)));
  const rateStr = `${ratePct >= 0 ? '+' : ''}${ratePct}%`;

  // ── Synthesize ─────────────────────────────────────────────
  let tts;
  try {
    tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const result = await tts.toStream(text, { rate: rateStr });
    const stream = result.audioStream || result;

    const chunks = [];
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('upstream timeout')), 9_000);
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => { clearTimeout(timer); resolve(); });
      stream.on('error', (e) => { clearTimeout(timer); reject(e); });
    });

    const audio = Buffer.concat(chunks);
    if (audio.length === 0) {
      return res.status(502).json({ error: 'empty audio' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Content-Length', String(audio.length));
    res.send(audio);
  } catch (err) {
    console.error('[tts] error:', err?.message || err);
    res.status(502).json({
      error: 'tts upstream error',
      detail: String(err?.message || err).slice(0, 200),
    });
  } finally {
    try { tts?.close?.(); } catch {}
  }
}
