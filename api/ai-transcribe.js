// ============================================================
// /api/ai-transcribe — Thai speech to text for VetMock AI's microphone
// ============================================================
// The page uses the browser's own speech recognition where it has one (free,
// live). Where it has none (Firefox, in-app browsers such as LINE) or it fails
// (Safari with dictation off), the page records the question, encodes it as
// 16 kHz mono WAV (both services take WAV, not the WebM a browser records) and
// posts it here as base64 JSON. See providers() for the services, in order:
// Cloudflare Workers AI Whisper, then iApp's Thai ASR
// (https://iapp.co.th/docs/speech/speech-to-text/thai: base model, 1 IC per
// 60 s, header `apikey`, multipart `file`, segments in `output[].text`).
//
// GET answers whether any of them works right now (a probe, cached), so the
// page offers the recorder only where it will really transcribe.
//
// Bounded on purpose: one question is seconds of speech, so a clip over 60 s
// (about 1.9 MB of WAV) is refused, and an address gets 40 clips an hour.
// ============================================================

import { allowedOrigin, clientIP, rateLimit, sendRateLimitFailure } from './_lib/rate-limit.js';

export const config = { runtime: 'nodejs', maxDuration: 30 };

const IAPP_ENDPOINT = 'https://api.iapp.co.th/v3/store/speech/speech-to-text/base';
const CF_MODEL = '@cf/openai/whisper-large-v3-turbo';
const MAX_WAV_BYTES = 2_000_000; // 60 s at 16 kHz, 16-bit, mono, plus the header
export const TRANSCRIBE_RATE = { max: 40, windowMs: 60 * 60 * 1000 };

/**
 * The speech-to-text services this deployment can use, in order: Cloudflare
 * Workers AI Whisper (CF_AI_TOKEN, a token with Workers AI permission; inside
 * the free daily allocation a question costs nothing) and iApp's Thai ASR
 * (IAPP_API_KEY, paid per minute in credits). Each returns { ok, text, status }.
 */
export function providers(env = process.env, fetchImpl = fetch) {
  const list = [];
  const account = env.CF_AI_ACCOUNT_ID || env.R2_ACCOUNT_ID || env.CF_ACCOUNT_ID;
  if (env.CF_AI_TOKEN && account) {
    list.push(async (wav) => {
      const r = await fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${CF_MODEL}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.CF_AI_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: wav.toString('base64'), language: 'th', vad_filter: true }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!r.ok) return { ok: false, status: r.status };
      const j = await r.json();
      const res = j?.result || {};
      return { ok: true, text: String(res.text ?? res.transcription_info?.text ?? '').trim() };
    });
  }
  if (env.IAPP_API_KEY) {
    list.push(async (wav) => {
      const form = new FormData();
      form.append('file', new Blob([wav], { type: 'audio/wav' }), 'question.wav');
      const r = await fetchImpl(IAPP_ENDPOINT, { method: 'POST', headers: { apikey: env.IAPP_API_KEY }, body: form, signal: AbortSignal.timeout(25_000) });
      if (!r.ok) return { ok: false, status: r.status };
      const j = await r.json();
      return { ok: true, text: joinSegments((Array.isArray(j?.output) ? j.output : []).map((s) => s?.text)), seconds: Number(j?.audio_duration_in_seconds) || null };
    });
  }
  return list;
}

/** Ask each service in turn; the first that answers wins. */
export async function transcribeWav(wav, { env = process.env, fetchImpl = fetch } = {}) {
  let status = 503;
  for (const run of providers(env, fetchImpl)) {
    try {
      const r = await run(wav);
      if (r.ok) return r;
      status = r.status || 502;
      console.warn('[ai-transcribe] provider', status);
    } catch (err) {
      status = 504;
      console.warn('[ai-transcribe] provider', String(err?.message || err).slice(0, 120));
    }
  }
  return { ok: false, status };
}

// Can the microphone's fallback work right now? A half-second of silence goes
// through the chain (a service without credits or permission fails it), and
// the answer is kept ten minutes per instance and at the edge: the page asks
// only where the browser has no speech recognition of its own, and hides the
// microphone there when nothing can transcribe, instead of offering a button
// that fails.
let probe = { at: 0, available: null };
const PROBE_MS = 10 * 60 * 1000;
function silence(seconds = 0.5) {
  const n = Math.round(16000 * seconds);
  const b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(16000, 24);
  b.writeUInt32LE(32000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  return b;
}
export async function available({ env = process.env, fetchImpl = fetch, now = Date.now() } = {}) {
  if (!providers(env, fetchImpl).length) return false;
  if (probe.available !== null && now - probe.at < PROBE_MS) return probe.available;
  const r = await transcribeWav(silence(), { env, fetchImpl });
  probe = { at: now, available: r.ok };
  return r.ok;
}
export const resetProbe = () => { probe = { at: 0, available: null }; };

/** Segments joined the way Thai is written: no space between two Thai runs. */
export function joinSegments(parts) {
  return parts.reduce((acc, raw) => {
    const t = String(raw || '').trim();
    if (!t) return acc;
    if (!acc) return t;
    const thaiSeam = /[฀-๿]$/.test(acc) && /^[฀-๿]/.test(t);
    return `${acc}${thaiSeam ? '' : ' '}${t}`;
  }, '');
}

/** The WAV a page may send: RIFF/WAVE, not empty, not over a minute. */
export function readWav(base64) {
  if (typeof base64 !== 'string' || base64.length < 64 || base64.length > (MAX_WAV_BYTES * 4) / 3 + 8) return null;
  const buf = Buffer.from(base64, 'base64');
  if (buf.length < 44 || buf.length > MAX_WAV_BYTES) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return null;
  return buf;
}

export default async function handler(req, res) {
  const allowed = allowedOrigin(req);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '7200');
    return res.status(204).end();
  }
  if (req.method === 'GET') {
    // public and the same for everyone: any origin may read it, cached at the edge
    res.setHeader('Access-Control-Allow-Origin', '*');
    const ok = await available();
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    return res.status(200).json({ available: ok });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'method' });
  }
  if (req.headers.origin && !allowed) return res.status(403).json({ error: 'origin' });

  if (!providers().length) return res.status(503).json({ error: 'unavailable', message: 'ไมค์ยังใช้ไม่ได้ในตอนนี้ ลองพิมพ์แทน' });

  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { body = null; }
  const wav = readWav(body?.audio);
  if (!wav) return res.status(400).json({ error: 'input', message: 'เสียงที่อัดไว้ใช้ไม่ได้ ลองพูดใหม่ไม่เกิน 1 นาที' });

  const limit = await rateLimit(`ai-transcribe:${clientIP(req)}`, TRANSCRIBE_RATE.max, TRANSCRIBE_RATE.windowMs);
  if (!limit.ok && !limit.unavailable) return sendRateLimitFailure(res, limit);

  const r = await transcribeWav(wav);
  if (!r.ok) {
    return res.status(r.status === 504 ? 504 : 502).json({ error: 'upstream', message: r.status === 504 ? 'ถอดเสียงนานเกินไป ลองอีกครั้ง' : 'ถอดเสียงไม่สำเร็จ ลองอีกครั้ง' });
  }
  return res.status(200).json({ text: r.text, seconds: r.seconds ?? null });
}
