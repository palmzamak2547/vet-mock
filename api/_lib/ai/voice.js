// ============================================================
// ai/voice.js — who may start a voice session, and what it may cost
// ============================================================
// The page talks to the agent (voice-agent.js) directly over WebRTC once it
// has a conversation token; the key never leaves the server. Before minting
// one, /api/ai-voice checks, in this order:
//
//   1. the switch          AI_VOICE_OFF=1 closes voice and says so
//   2. the account         the ElevenLabs balance must keep FLOOR credits
//                          untouched (Tipjai's live alerts share the account:
//                          45,000 is the house floor, 50,000 the default here)
//                          plus the worst case of every session that could be
//                          live at once (the agent's concurrency cap, so no
//                          live-session bookkeeping is needed)
//   3. the student         AI_VOICE_USER_SESSIONS sessions per Bangkok day
//
// A session is at most AI_VOICE_SESSION_SECONDS long (the agent ends it), and
// its worst case is that many minutes at AI_VOICE_CREDITS_PER_MINUTE (600:
// measured 515-560 on 2026-11-06, with room). A WebRTC start that fails over
// to WebSocket, or a dropped call that rejoins, spends the session's one retry
// ticket and is not counted again. Every refusal is a plain Thai sentence the
// page shows as is.
// ============================================================

import crypto from 'node:crypto';

export const EL_API = 'https://api.elevenlabs.io';
const BALANCE_TTL_S = 45;
const RETRY_TTL_S = 180;

export const VOICE_MESSAGES = Object.freeze({
  off: 'โหมดคุยด้วยเสียงปิดปรับปรุงชั่วคราว พิมพ์ถามได้ตามปกติ',
  unconfigured: 'โหมดคุยด้วยเสียงยังไม่พร้อมในตอนนี้ พิมพ์ถามได้ตามปกติ',
  budget: 'โควตาคุยด้วยเสียงของเดือนนี้หมดแล้ว พิมพ์ถามได้ตามปกติ',
  user: 'วันนี้คุยด้วยเสียงครบจำนวนรอบแล้ว พรุ่งนี้คุยได้อีก ระหว่างนี้พิมพ์ถามได้',
  busy: 'ตอนนี้มีคนคุยด้วยเสียงเต็มแล้ว ลองใหม่อีกสักครู่',
  provider: 'เชื่อมต่อเสียงไม่สำเร็จ ลองอีกครั้ง',
  limiter: 'ระบบนับโควตาขัดข้องชั่วคราว ลองใหม่อีกครั้งในไม่ช้า',
});

const num = (v, d, lo, hi) => {
  const n = Number(v);
  return v !== undefined && v !== '' && Number.isFinite(n) && n >= lo && n <= hi ? n : d;
};

export function voiceConfig(env = process.env) {
  const sessionSeconds = Math.round(num(env.AI_VOICE_SESSION_SECONDS, 300, 60, 900));
  const creditsPerMinute = num(env.AI_VOICE_CREDITS_PER_MINUTE, 600, 100, 5000);
  return {
    key: env.ELEVENLABS_API_KEY || '',
    agentId: env.ELEVENLABS_VOICE_AGENT_ID || '',
    configured: Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_VOICE_AGENT_ID),
    off: env.AI_VOICE_OFF === '1',
    sessionSeconds,
    userSessions: Math.floor(num(env.AI_VOICE_USER_SESSIONS, 4, 1, 100)),
    floorCredits: num(env.AI_VOICE_FLOOR_CREDITS, 50_000, 0, 1e9),
    creditsPerMinute,
    maxConcurrent: Math.floor(num(env.AI_VOICE_MAX_CONCURRENT, 4, 1, 50)),
    sessionCredits: Math.ceil((sessionSeconds / 60) * creditsPerMinute),
  };
}

/** "2026-11-06" in Bangkok: the per-student counter turns over at local midnight. */
export const bangkokDay = (now = Date.now()) => new Date(now + 7 * 3_600_000).toISOString().slice(0, 10);

/** Seconds to the next Bangkok midnight (the per-day counter's lifetime). */
export function secondsToBangkokMidnight(now = Date.now()) {
  const shifted = now + 7 * 3_600_000;
  const next = Math.floor(shifted / 86_400_000 + 1) * 86_400_000;
  return Math.max(60, Math.ceil((next - shifted) / 1000));
}

/**
 * May one more session start? The floor stays untouched, and so does the worst
 * case of every session that could be live at once, this one included.
 * @param {{ remaining: number|null }} balance
 */
export function budgetVerdict(balance, cfg) {
  if (!Number.isFinite(balance?.remaining)) return { ok: false, reason: 'provider' };
  const need = cfg.floorCredits + cfg.sessionCredits * cfg.maxConcurrent;
  return balance.remaining >= need ? { ok: true, spare: balance.remaining - need } : { ok: false, reason: 'budget' };
}

/**
 * The account's balance, cached for 45 s across instances (kv) and in this one.
 * Credits the subscription still has this period, and when it renews.
 */
let localBalance = null;
export async function readBalance(cfg, { fetchImpl = fetch, kv = null, now = Date.now(), fresh = false } = {}) {
  if (!fresh && localBalance && now - localBalance.at < BALANCE_TTL_S * 1000) return localBalance.value;
  const cached = kv && !fresh ? await kv.get('ai-voice:balance') : null;
  if (cached && Number.isFinite(cached.remaining) && now - cached.at < BALANCE_TTL_S * 1000) {
    localBalance = { at: cached.at, value: cached };
    return cached;
  }
  const res = await fetchImpl(`${EL_API}/v1/user/subscription`, { headers: { 'xi-api-key': cfg.key }, signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw Object.assign(new Error('balance'), { status: res.status });
  const s = await res.json();
  const limit = Number(s.character_limit);
  const used = Number(s.character_count);
  const value = {
    at: now,
    remaining: Number.isFinite(limit) && Number.isFinite(used) ? limit - used : null,
    renewsAt: Number.isFinite(Number(s.next_character_count_reset_unix)) ? Number(s.next_character_count_reset_unix) * 1000 : null,
  };
  localBalance = { at: now, value };
  if (kv) await kv.set('ai-voice:balance', value, BALANCE_TTL_S);
  return value;
}

/** Tests only. */
export const resetVoiceCache = () => { localBalance = null; };

/** A stable, opaque id for a student in the provider's logs (never the account id itself). */
export const voiceUserId = (uid, cfg) => crypto.createHash('sha256').update(`vetmock-voice-user:${cfg.key}:${uid}`).digest('hex').slice(0, 24);

const ticketKey = (cfg) => crypto.createHash('sha256').update(`vetmock-voice-retry:${cfg.key}`).digest();
const sign = (cfg, uid, expires, nonce) => crypto.createHmac('sha256', ticketKey(cfg)).update(`${uid}|${expires}|${nonce}`).digest('base64url');
const ticketTtl = (cfg) => cfg.sessionSeconds + RETRY_TTL_S;

/**
 * One free restart of the session it came with: a WebRTC start that fails over
 * to WebSocket, or a call that dropped and rejoins. Valid for the session's
 * length plus three minutes, for this student only, and once (the route spends
 * it in the limiter); a restart that used one is handed no new one. The nonce
 * keeps two sessions started in the same second from sharing one ticket.
 */
export function retryTicket(uid, cfg, now = Date.now()) {
  const expires = Math.floor(now / 1000) + ticketTtl(cfg);
  const nonce = crypto.randomBytes(9).toString('base64url');
  return `${expires}.${nonce}.${sign(cfg, uid, expires, nonce)}`;
}

/** The ticket's signature when it is this student's and unexpired, else null. */
export function verifyRetryTicket(ticket, uid, cfg, now = Date.now()) {
  const m = /^(\d{9,11})\.([A-Za-z0-9_-]{12})\.([A-Za-z0-9_-]{20,64})$/.exec(String(ticket || ''));
  if (!m || !uid) return null;
  const expires = Number(m[1]);
  if (expires * 1000 < now || expires * 1000 > now + ticketTtl(cfg) * 1000 + 5000) return null;
  const want = Buffer.from(sign(cfg, uid, expires, m[2]));
  const got = Buffer.from(m[3]);
  return got.length === want.length && crypto.timingSafeEqual(got, want) ? m[3] : null;
}

/** Seconds a ticket can live: how long its spent mark is kept. */
export const retryTicketTtl = (cfg) => ticketTtl(cfg) + 10;

// ---------- photos inside a call ----------
// The agent's sessions are private (auth on), and the provider takes a file into one only with the account key:
// neither the session's signature nor its token is accepted (401 for both, 2026-11-06), so the browser SDK's own
// uploadFile could never work here. A photo comes through /api/ai-voice instead, into a conversation that route
// started for this student: the start hands the page a pass for that one conversation, signed like a retry ticket.
const photoKey = (cfg) => crypto.createHash('sha256').update(`vetmock-voice-photos:${cfg.key}`).digest();
const photoSig = (cfg, uid, conversationId, expires) => crypto.createHmac('sha256', photoKey(cfg)).update(`${uid}|${conversationId}|${expires}`).digest('base64url');
export const PHOTO_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);
export const PHOTOS_PER_CALL = 4; // the agent's own cap (file_input.max_files_per_conversation)
export const photoPassTtl = (cfg) => cfg.sessionSeconds + RETRY_TTL_S;

/** A pass to send photos into one conversation: this student's, for the session's length and a little after. */
export function photoPass(uid, conversationId, cfg, now = Date.now()) {
  const expires = Math.floor(now / 1000) + photoPassTtl(cfg);
  return `${expires}.${photoSig(cfg, uid, conversationId, expires)}`;
}

/** True when the pass is this student's, for this conversation, and unexpired. */
export function verifyPhotoPass(pass, uid, conversationId, cfg, now = Date.now()) {
  const m = /^(\d{9,11})\.([A-Za-z0-9_-]{20,64})$/.exec(String(pass || ''));
  if (!m || !uid || !/^conv_[A-Za-z0-9]{6,64}$/.test(String(conversationId || ''))) return false;
  const expires = Number(m[1]);
  if (expires * 1000 < now || expires * 1000 > now + photoPassTtl(cfg) * 1000 + 5000) return false;
  const want = Buffer.from(photoSig(cfg, uid, conversationId, expires));
  const got = Buffer.from(m[2]);
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

/** The photo into the live conversation, with the account key; resolves to the provider's file id. */
export async function attachPhoto(cfg, { conversationId, mediaType, bytes, fetchImpl = fetch }) {
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: mediaType }), `photo.${mediaType.split('/')[1]}`);
  const res = await fetchImpl(`${EL_API}/v1/convai/conversations/${encodeURIComponent(conversationId)}/files`, {
    method: 'POST', headers: { 'xi-api-key': cfg.key }, body: form, signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw Object.assign(new Error('photo'), { status: res.status });
  const body = await res.json();
  if (typeof body?.file_id !== 'string' || !body.file_id) throw new Error('photo-shape');
  return body.file_id;
}

/**
 * A credential for one conversation: a WebRTC conversation token, or a signed
 * WebSocket URL when the page asks to fail over (networks that drop UDP). The
 * URL is minted single-use (include_conversation_id: without it a signed URL
 * opens new conversations for 15 minutes, past every cap counted here).
 * `conversationId` is for the log line only.
 */
export async function mintConversation(cfg, { transport = 'webrtc', participant = '', fetchImpl = fetch } = {}) {
  const q = new URLSearchParams({ agent_id: cfg.agentId });
  const path = transport === 'websocket' ? '/v1/convai/conversation/get-signed-url' : '/v1/convai/conversation/token';
  if (transport === 'websocket') q.set('include_conversation_id', 'true');
  else if (participant) q.set('participant_name', participant);
  const res = await fetchImpl(`${EL_API}${path}?${q}`, { headers: { 'xi-api-key': cfg.key }, signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw Object.assign(new Error('mint'), { status: res.status });
  const body = await res.json();
  if (transport === 'websocket') {
    if (typeof body?.signed_url !== 'string' || !body.signed_url.startsWith('wss://')) throw new Error('mint-shape');
    let id = body.conversation_id || null;
    try { id ||= new URL(body.signed_url).searchParams.get('conversation_id'); } catch { /* the log goes without it */ }
    return { signedUrl: body.signed_url, conversationId: id };
  }
  if (typeof body?.token !== 'string' || body.token.length < 20) throw new Error('mint-shape');
  return { token: body.token, conversationId: body.conversation_id || null };
}
