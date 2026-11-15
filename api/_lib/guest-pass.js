// Trial links for the assistant (docs/CHULA-SIGNIN.md, "Trial links").
//
// A person without a Chula account can be handed a link that opens
// ai.vetmock.com for a limited time. The page sends the link's code in one
// header, on a request that carries no session. The database keeps only the
// code's hash, an expiry and a message cap, and answers through
// public.ai_guest_pass_use, asked with the public key the way the gate asks
// chula_access_state.
//
// A good pass makes the caller a guest: the shape the gate gives a guest while
// the wall is off, with no account and no token, so the library is never read.
// A pass never outranks a session: a request with a bearer token goes to the
// gate as before and the header is ignored. Only /api/ai-chat and
// /api/ai-transcribe read the header; every other function still asks the gate.
//
// When the database cannot be asked the answer is 503, never an opening. The
// code is never logged.
import { backendConfig } from './app-backend.js';
import { bearerOf } from './chula-gate.js';

export const PASS_HEADER = 'x-vetmock-pass';
const PASS_RE = /^[A-Za-z0-9_-]{22,64}$/;

/** The code in the request's pass header, or '' when there is none or it is not shaped like one. */
export function passOf(req) {
  const raw = req?.headers?.[PASS_HEADER];
  return typeof raw === 'string' && PASS_RE.test(raw) ? raw : '';
}

/** The pass that speaks for this request: none when it carries a session token, which always goes to the gate. */
export function trialPassOf(req) {
  return bearerOf(req) ? '' : passOf(req);
}

const refuse = (status, error, message) => ({ ok: false, status, body: { error, message } });
export const PASS_INVALID = refuse(401, 'pass_invalid', 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว');
const UNAVAILABLE = refuse(503, 'backend-unavailable', 'ตรวจสิทธิ์ไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง');

let lastFailureLog = 0;
function unavailable(why) {
  if (Date.now() - lastFailureLog > 60_000) {
    lastFailureLog = Date.now();
    console.warn('[guest-pass] the pass could not be checked; request refused', { why });
  }
  return UNAVAILABLE;
}

/**
 * Asks the database whether this code is good; with `count` (the default) one
 * message of it is used in the same statement. Resolves the guest
 * { ok: true, userId: null, token: null, member: false, trial: true }, or
 * { ok: false, status, body }: 401 for a code the database refuses (unknown,
 * revoked, expired, spent), 503 when it could not be asked.
 */
export async function usePass(code, { count = true, env = process.env, fetchImpl = fetch } = {}) {
  if (typeof code !== 'string' || !PASS_RE.test(code)) return PASS_INVALID;
  const cfg = backendConfig(env);
  if (!cfg.url || !cfg.key) return unavailable('no database configured');
  let body;
  try {
    const response = await fetchImpl(`${cfg.url}/rest/v1/rpc/ai_guest_pass_use`, {
      redirect: 'error',
      method: 'POST',
      headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_code: code, p_count: count !== false }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return unavailable(`status ${response.status}`);
    body = await response.json();
  } catch (error) {
    return unavailable(String(error?.name || 'error'));
  }
  if (body?.ok === true) return { ok: true, userId: null, token: null, member: false, trial: true };
  if (body?.ok === false && ['invalid', 'expired', 'spent'].includes(body.reason)) return PASS_INVALID;
  return unavailable('unexpected answer');
}

/** One line per handler, as requireChula is: answers the refusal and returns null, or returns the guest. */
export async function requirePass(code, res, options) {
  const pass = await usePass(code, options);
  if (pass.ok) return pass;
  res.setHeader('Cache-Control', 'no-store');
  res.status(pass.status).json(pass.body);
  return null;
}
