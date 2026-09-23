// ============================================================
// feedback-client.js — the one client for /api/send-feedback
// ============================================================
// Three places send a message to the team: the flag on a question, the
// concern box on a VetWiki section and the feedback page. Each used to call
// the endpoint itself and read its failures its own way, so the same daily
// cap told one student "พรุ่งนี้" and another "ลองใหม่ภายหลัง", and pointed a
// third at the feedback page, which posts here too and was capped as well.
// They now share this client and one Thai sentence per cause.
//
// What the endpoint answers (api/send-feedback.js, api/_lib/rate-limit.js):
//   200 {ok:true}                     sent
//   429 {reason:'daily_cap'}          the shared daily budget; clears tomorrow
//   429 {reason:'rate_limited'}       this device sent 3 in 10 minutes
//   503 / 502 / 500 (JSON)            the mailer is down or not configured
// Every answer from the function is JSON. A request that gets no answer
// (offline) rejects. A local `vite` / `vite preview` has no serverless
// runtime, so the route answers with a bare 404 or a page, never our JSON.
//
// sendFeedback never throws and never touches the caller's text: every
// caller keeps what the student wrote until a send succeeds.
// ============================================================

export const FEEDBACK_EMAIL = 'palmzamak2547@gmail.com';

// Each one says what to do next. The daily cap and a mailer fault point at
// email, the one way out that does not go through this endpoint.
export const FEEDBACK_MESSAGES = Object.freeze({
  daily_cap: `วันนี้ระบบรับข้อความครบโควตาแล้ว พรุ่งนี้ส่งได้อีก หรือส่งอีเมลถึงทีมงานโดยตรงที่ ${FEEDBACK_EMAIL}`,
  burst: 'ส่งถี่เกินไป พักสักครู่แล้วลองใหม่ (ส่งได้ 3 ครั้งต่อ 10 นาที)',
  offline: 'เชื่อมต่อไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่',
  preview: 'ส่งได้เฉพาะบนเว็บจริง เปิด vetmock.vercel.app แล้วส่งอีกครั้ง',
  server: `ระบบส่งข้อความขัดข้องชั่วคราว ส่งอีเมลถึงทีมงานโดยตรงที่ ${FEEDBACK_EMAIL} ได้เลย`,
});

function failure(status, reason) {
  return { ok: false, status, reason, messageTh: FEEDBACK_MESSAGES[reason] };
}

/**
 * POST one message. `payload` is the body the endpoint reads:
 * { type, subject, message, fromEmail?, fromName? }.
 * Resolves to { ok, status, reason, messageTh }; reason is null on success,
 * otherwise one of the FEEDBACK_MESSAGES keys. status is 0 when offline.
 */
export async function sendFeedback(payload, { fetch = globalThis.fetch } = {}) {
  let res;
  try {
    res = await fetch('/api/send-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return failure(0, 'offline');
  }
  const body = await res.json().catch(() => null);
  if (res.ok && body) return { ok: true, status: res.status, reason: null, messageTh: '' };
  // A 429 has two causes with opposite advice: a burst clears in minutes, the
  // daily cap not until tomorrow.
  if (res.status === 429) return failure(429, body?.reason === 'daily_cap' ? 'daily_cap' : 'burst');
  // No JSON from a route that is missing or a page served in its place: a
  // local preview. The platform's own 5xx and 403 pages are a server fault.
  if (!body && (res.ok || res.status === 404 || res.status === 405)) return failure(res.status, 'preview');
  return failure(res.status, 'server');
}
