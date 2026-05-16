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

const IAPP_ENDPOINT = 'https://api.iapp.co.th/v3/store/audio/tts/generate';

export default async function handler(req, res) {
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
  const limit = rateLimit(`tts-iapp:${clientIP(req)}`, 30, 5 * 60_000);
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

  const { text } = body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'missing text' });
  }
  if (text.length > 3000) {
    return res.status(400).json({ error: 'text too long (max 3000 chars)' });
  }

  // ── Forward to iApp ────────────────────────────────────────
  // V3 contract: POST JSON {text} with Bearer auth, get WAV bytes.
  // The 9-second AbortController matches the function timeout so the
  // client gets a clean 502 instead of Vercel's generic 504 when iApp
  // is slow.
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9_000);
  try {
    const upstream = await fetch(IAPP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'audio/wav, audio/*',
      },
      body: JSON.stringify({ text }),
      signal: ctrl.signal,
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '');
      // Surface 401/403 distinctly so the client can show a config hint.
      return res.status(upstream.status === 401 || upstream.status === 403 ? upstream.status : 502).json({
        error: 'iapp upstream error',
        status: upstream.status,
        detail: errText.slice(0, 200),
      });
    }

    const audio = Buffer.from(await upstream.arrayBuffer());
    if (audio.length === 0) {
      return res.status(502).json({ error: 'empty audio' });
    }

    // Preserve iApp's Content-Type if it gave one (audio/wav typically);
    // fall back to audio/wav since v3 docs guarantee WAV bytes.
    const upstreamCt = upstream.headers.get('content-type') || 'audio/wav';
    res.setHeader('Content-Type', upstreamCt);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Content-Length', String(audio.length));
    return res.send(audio);
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
