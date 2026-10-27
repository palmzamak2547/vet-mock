// ============================================================
// /api/ai-chat.js — the streaming assistant behind ai.vetmock.com
// ============================================================
// A research-preview chat that answers Thai veterinary students from
// VetMock's own governed content, with numbered citations, and can also hand
// out real bank questions as an in-chat quiz, deep-link into vetmock.com,
// find research papers, and answer questions about VetMock itself.
//
//   OPTIONS  CORS preflight for the chat origin (allowedOrigin)
//   GET      { ok, configured, stats }: is a model key set, and how much the
//            chat can answer from, counted from the loaded corpora. No model
//            call. Edge-cacheable for 10 minutes.
//   POST     { messages, image } → text/event-stream:
//            status → sources → cards? → delta… → check → done   (or error)
//
// Everything that can refuse a request does so BEFORE the stream opens, as a
// JSON status the page can read: 400 input (input.js), 429/503 rate or
// budget (limits.js). After the stream opens the status line is already 200,
// so failures arrive as an `error` event and the stream ends.
//
// The pipeline itself (plan, retrieval, quiz, actions, papers, writing, the
// grounding check) lives in api/_lib/ai/, one small module per concern;
// pipeline.js reads top to bottom as the order of events.
//
// No model or vendor name is ever put in a user-facing field: `done.model`
// is "primary" or "fallback". The one log line per request carries timings
// and counts only, never message text or the client address.
// ============================================================

import { allowedOrigin, clientIP } from './_lib/rate-limit.js';
import { chatConfig } from './_lib/ai/config.js';
import { validateChatInput, INPUT_MESSAGES } from './_lib/ai/input.js';
import { checkLimits } from './_lib/ai/limits.js';
import { openStream } from './_lib/ai/sse.js';
import { runChat, chatStats, ERROR_MESSAGES } from './_lib/ai/pipeline.js';
import { warmCorpus } from './_lib/ai/corpus.js';

// Literal on purpose: the platform reads this object statically from the
// source, so an imported constant would be invisible to it and the function
// would get the 10-second default, which cuts a streaming answer off.
export const config = {
  runtime: 'nodejs',
  maxDuration: 60,
};

const UNAVAILABLE = 'ผู้ช่วยยังไม่พร้อมให้บริการในตอนนี้';

export default async function handler(req, res) {
  const t0 = Date.now();
  const origin = req.headers.origin;
  const allowed = allowedOrigin(req);

  if (req.method === 'GET') {
    // Public counts with no credentials, cached at the edge: any origin may
    // read them. A per-origin header on a cached response would be served to
    // the next origin too (or be missing when a header-less request filled
    // the cache), and the chat page's own fetch would fail for ten minutes.
    res.setHeader('Access-Control-Allow-Origin', '*');
    const cfg = chatConfig();
    let stats = {};
    try { stats = await chatStats(); } catch { stats = {}; }
    const complete = Object.keys(stats).length === 6;
    // ?warm=1 (sent when a student starts typing) must reach an instance, so it is
    // never cached: it builds the corpus while they type instead of after they send
    const warm = /[?&]warm=1/.test(req.url || '');
    res.setHeader('Cache-Control', complete && !warm ? 'public, s-maxage=600, stale-while-revalidate=3600' : 'no-store');
    return res.status(200).json({ ok: true, configured: cfg.configured, stats });
  }

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '7200');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    return res.status(405).json({ error: 'method', message: 'ใช้ได้เฉพาะ GET และ POST' });
  }
  if (origin && !allowed) return res.status(403).json({ error: 'origin', message: 'เว็บนี้ไม่ได้รับอนุญาตให้เรียกใช้ผู้ช่วย' });

  // A malformed JSON body throws when req.body is first read (the platform
  // parses lazily): that is the caller's error, and it is a 400.
  let body;
  try {
    body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    return res.status(400).json({ error: 'input', message: INPUT_MESSAGES.shape });
  }
  const input = validateChatInput(body);
  if (!input.ok) return res.status(400).json({ error: 'input', message: input.message });

  const cfg = chatConfig();
  if (!cfg.configured) return res.status(503).json({ error: 'unavailable', message: UNAVAILABLE });

  // The corpus starts loading while the limiter round-trips (cold start
  // overlaps them instead of adding to them).
  warmCorpus();
  const limit = await checkLimits(clientIP(req), { dailyCap: cfg.dailyCap });
  if (!limit.ok) {
    if (limit.body.retryAfter) res.setHeader('Retry-After', String(limit.body.retryAfter));
    return res.status(limit.status).json(limit.body);
  }

  const stream = openStream(res);
  try {
    await runChat(input, { send: stream.send, signal: stream.signal, t0 });
  } catch (err) {
    console.error('[ai-chat] unexpected', String(err?.stack || err?.message || err).slice(0, 600));
    stream.send('error', { reason: 'unexpected', message: ERROR_MESSAGES.unexpected });
  } finally {
    stream.end();
  }
  return undefined;
}
