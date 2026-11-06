// ============================================================
// /api/ai-voice — start a realtime voice session on ai.vetmock.com
// ============================================================
//   OPTIONS  CORS preflight for the AI page (allowedOrigin)
//   GET      { ok, available, reason?, sessionSeconds }: may the page offer
//            voice right now (configured, switched on, the month's credits).
//            Public, no secrets, edge-cached for a minute.
//   POST     { action: 'start', transport?: 'webrtc' | 'websocket', retry? }
//            -> { transport, token | signedUrl, sessionSeconds, left, retry, user, conversationId?, photos? }
//   POST     { action: 'file', conversationId, pass, mediaType, data }: a photo into that call -> { fileId }
//            (the provider takes files into a private agent's call only with the account key)
//
// Refusals are JSON { error, message, retryAfter? } with the page's words in
// `message`: 401/403 from the Chula wall, 429 when the student has used the
// day's sessions, 503 when voice is off, unconfigured, out of credits or the
// limiter is down (it fails closed: a session costs money). The caps and
// their reasons are in api/_lib/ai/voice.js; the agent itself in
// api/_lib/ai/voice-agent.js. Its tools are answered by /api/ai-chat.
//
// Region: iad1. A start calls the limiter (US East) and the provider (US)
// four times in a row against one call to the database, so it runs there
// (tests/unit/function-regions.test.mjs).
// ============================================================

import { allowedOrigin, clientIP, rateLimit, rateRefund, kvGetJSON, kvSetJSON } from './_lib/rate-limit.js';
import { requireChula } from './_lib/chula-gate.js';
import {
  voiceConfig, readBalance, budgetVerdict, mintConversation, retryTicket, verifyRetryTicket, retryTicketTtl, voiceUserId,
  bangkokDay, secondsToBangkokMidnight, VOICE_MESSAGES, photoPass, verifyPhotoPass, photoPassTtl, attachPhoto, PHOTO_TYPES, PHOTOS_PER_CALL,
} from './_lib/ai/voice.js';

export const config = {
  runtime: 'nodejs',
  maxDuration: 15,
};

const kv = { get: kvGetJSON, set: kvSetJSON };
const refuse = (res, status, error, extra = {}) => res.status(status).json({ error, message: VOICE_MESSAGES[error], ...extra });
// free restarts a student gets a day (a failover, a dropped call); past that a restart is a session
const RESTARTS_PER_DAY = 2;
// a photo's bytes after the page has resized it (lib/image.js keeps its base64 under 3 MB)
const PHOTO_MAX_BYTES = 2_400_000;

/**
 * A photo inside a call (POST { action: 'file', conversationId, pass, mediaType, data }) -> { fileId }: into a
 * conversation this route started for this student (the start's pass), four a call (the agent's own cap).
 */
async function sendPhoto(res, body, who, cfg) {
  const conversationId = String(body.conversationId || '');
  const mediaType = PHOTO_TYPES.includes(body.mediaType) ? body.mediaType : '';
  const bytes = typeof body.data === 'string' ? Buffer.from(body.data, 'base64') : Buffer.alloc(0);
  if (!mediaType || !bytes.length) return res.status(400).json({ error: 'input', message: 'ส่งรูปนี้ไม่ได้ ลองรูปอื่น' });
  if (bytes.length > PHOTO_MAX_BYTES) return res.status(413).json({ error: 'size', message: 'รูปนี้ใหญ่เกินไป ลองครอปหรือถ่ายใหม่' });
  if (cfg.off) return refuse(res, 503, 'off');
  if (!cfg.configured) return refuse(res, 503, 'unconfigured');
  if (!verifyPhotoPass(body.pass, who, conversationId, cfg)) {
    return res.status(403).json({ error: 'conversation', message: 'สายนี้ส่งรูปไม่ได้แล้ว วางสายแล้วเริ่มใหม่ได้เลย' });
  }
  const count = await rateLimit(`ai-voice:photos:${conversationId}`, PHOTOS_PER_CALL, photoPassTtl(cfg) * 1000);
  if (!count.ok) {
    if (count.unavailable) return refuse(res, 503, 'limiter', { retryAfter: count.retryAfter });
    return res.status(429).json({ error: 'photos', message: `สายนี้ส่งรูปครบ ${PHOTOS_PER_CALL} รูปแล้ว` });
  }
  let fileId;
  try {
    fileId = await attachPhoto(cfg, { conversationId, mediaType, bytes });
  } catch (e) {
    console.warn('[ai-voice] photo', e.status || e.message);
    await rateRefund(`ai-voice:photos:${conversationId}`, photoPassTtl(cfg) * 1000);
    return res.status(502).json({ error: 'provider', message: 'ส่งรูปไม่สำเร็จ ลองอีกครั้ง' });
  }
  console.log('[ai-voice]', JSON.stringify({ outcome: 'photo', bytes: bytes.length, conversation: conversationId }));
  return res.status(200).json({ fileId });
}

async function status(cfg) {
  if (cfg.off) return { available: false, reason: 'off' };
  if (!cfg.configured) return { available: false, reason: 'unconfigured' };
  try {
    const b = await readBalance(cfg, { kv });
    const v = budgetVerdict(b, cfg);
    return v.ok ? { available: true } : { available: false, reason: v.reason, ...(b.renewsAt ? { renewsAt: b.renewsAt } : {}) };
  } catch {
    // the button stays: a start says what went wrong if it still is
    return { available: true };
  }
}

export default async function handler(req, res) {
  const t0 = Date.now();
  const allowed = allowedOrigin(req);
  const cfg = voiceConfig();

  if (req.method === 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, ...(await status(cfg)), sessionSeconds: cfg.sessionSeconds });
  }
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '7200');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    return res.status(405).json({ error: 'method', message: 'ใช้ได้เฉพาะ GET และ POST' });
  }
  if (req.headers.origin && !allowed) return res.status(403).json({ error: 'origin', message: 'เว็บนี้ไม่ได้รับอนุญาตให้เริ่มคุยด้วยเสียง' });
  const gate = await requireChula(req, res);
  if (!gate) return undefined;

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    body = null;
  }
  // who is counted: the student, or the address while the wall is off and nobody signed in
  const who = gate.userId || `ip:${clientIP(req)}`;
  if (body?.action === 'file') return sendPhoto(res, body, who, cfg);
  if (body?.action !== 'start') return res.status(400).json({ error: 'input', message: 'คำขอไม่ถูกต้อง' });
  const transport = body.transport === 'websocket' ? 'websocket' : 'webrtc';

  if (cfg.off) return refuse(res, 503, 'off');
  if (!cfg.configured) return refuse(res, 503, 'unconfigured');
  const ticket = verifyRetryTicket(body.retry, who, cfg);

  let balance;
  try {
    balance = await readBalance(cfg, { kv });
  } catch (e) {
    console.warn('[ai-voice] balance', e.status || e.message);
    return refuse(res, 503, 'provider');
  }
  let verdict = budgetVerdict(balance, cfg);
  // The cached balance can be 45 s behind sessions billed since. Further from the floor than
  // every live session could cost, that cannot matter; nearer, it is read fresh.
  if (verdict.ok && verdict.spare < cfg.sessionCredits * cfg.maxConcurrent) {
    try {
      balance = await readBalance(cfg, { kv, fresh: true });
    } catch (e) {
      console.warn('[ai-voice] balance', e.status || e.message);
      return refuse(res, 503, 'provider');
    }
    verdict = budgetVerdict(balance, cfg);
  }
  if (!verdict.ok) return refuse(res, 503, verdict.reason === 'budget' ? 'budget' : 'provider', balance.renewsAt ? { renewsAt: balance.renewsAt } : {});

  // Counts this start takes, given back if the provider then fails before anything started.
  const taken = [];
  const take = async (key, max, winMs) => {
    const r = await rateLimit(key, max, winMs);
    if (r.ok) taken.push([key, winMs]);
    return r;
  };
  const toMidnight = secondsToBangkokMidnight() * 1000;
  const day = bangkokDay();

  // a ticket restarts its session once: spent here, and a restart is handed no new one
  let retried = false;
  if (ticket) {
    const spent = await take(`ai-voice:ticket:${ticket}`, 1, retryTicketTtl(cfg) * 1000);
    if (spent.unavailable) return refuse(res, 503, 'limiter', { retryAfter: spent.retryAfter });
    // a ticket holds no proof the session before it died: a few free restarts a day, then they count
    retried = spent.ok && (await take(`ai-voice:restarts:${who}:${day}`, RESTARTS_PER_DAY, toMidnight)).ok;
  }
  // a rapid start-stop loop is not a conversation
  const burst = await rateLimit(`ai-voice:burst:${who}`, 10, 10 * 60 * 1000);
  if (!burst.ok) {
    if (burst.unavailable) return refuse(res, 503, 'limiter', { retryAfter: burst.retryAfter });
    res.setHeader('Retry-After', String(burst.retryAfter));
    return res.status(429).json({ error: 'rate', message: 'เริ่มคุยถี่เกินไป รอสักครู่แล้วลองใหม่', retryAfter: burst.retryAfter });
  }
  const dayKey = `ai-voice:day:${who}:${day}`;
  let left = null;
  if (!retried) {
    const used = await take(dayKey, cfg.userSessions, toMidnight);
    if (!used.ok) {
      if (used.unavailable) return refuse(res, 503, 'limiter', { retryAfter: used.retryAfter });
      res.setHeader('Retry-After', String(used.retryAfter));
      return refuse(res, 429, 'user', { retryAfter: used.retryAfter, sessions: cfg.userSessions });
    }
  }
  // the limiter's own count (null without the shared store: then unknown, never a guess)
  const used = await kv.get(`rl:${dayKey}`);
  if (Number.isFinite(used)) left = Math.max(0, cfg.userSessions - used);

  const user = voiceUserId(who, cfg);
  let credential;
  try {
    credential = await mintConversation(cfg, { transport, participant: user });
  } catch (e) {
    console.warn('[ai-voice] mint', transport, e.status || e.message);
    // nothing started: the session, the ticket and the restart this attempt took are the student's again
    await Promise.all(taken.map(([key, winMs]) => rateRefund(key, winMs)));
    return refuse(res, e.status === 429 ? 503 : 502, e.status === 429 ? 'busy' : 'provider');
  }
  const { conversationId, ...cred } = credential;
  console.log('[ai-voice]', JSON.stringify({ outcome: 'start', transport, retried, ms: Date.now() - t0, left, spare: Math.round(verdict.spare), conversation: conversationId }));
  return res.status(200).json({
    transport,
    ...cred,
    sessionSeconds: cfg.sessionSeconds,
    left,
    retry: retried ? null : retryTicket(who, cfg),
    user,
    // the page's own conversation, and its pass to send photos into it (none when the provider gave no id)
    ...(conversationId ? { conversationId, photos: photoPass(who, conversationId, cfg) } : {}),
  });
}
