// The Chula wall for Vercel functions (docs/CHULA-SIGNIN.md).
//
// The database answers through public.chula_access_state, the function every
// front end reads, so the API and the data layer cannot disagree about who is
// let in. A warm instance keeps the switch for 30 s and a member's token for
// 60 s, so a chat does not ask the database on every message.
//
// When the database cannot be asked, the gate refuses unless this instance last
// saw the wall off: the AI costs money and the rows are private.
import { createHash } from 'node:crypto';
import { backendConfig } from './app-backend.js';

const SWITCH_TTL_MS = 30_000;
const MEMBER_TTL_MS = 60_000;
let lastSwitch = null; // { enforce, at }
const members = new Map(); // sha256(token) -> { uid, until }

export function bearerOf(req) {
  const token = String(req?.headers?.authorization || '').replace(/^Bearer\s+/i, '').trim();
  return /^[A-Za-z0-9._~-]{20,4096}$/.test(token) ? token : '';
}

const refuse = (status, error, message) => ({ ok: false, status, body: { error, message } });
export const SIGNIN_REQUIRED = refuse(401, 'signin_required', 'เข้าสู่ระบบด้วยอีเมลจุฬาก่อนใช้งาน');
export const CHULA_REQUIRED = refuse(403, 'chula_required', 'บัญชีนี้ยังไม่ได้เชื่อมกับอีเมลจุฬา');
const UNAVAILABLE = refuse(503, 'backend-unavailable', 'ตรวจสิทธิ์ไม่ได้ในตอนนี้ ลองใหม่อีกครั้ง');

async function askState(cfg, bearer, fetchImpl) {
  const response = await fetchImpl(`${cfg.url}/rest/v1/rpc/chula_access_state`, {
    method: 'POST',
    headers: { apikey: cfg.key, Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(6000),
  });
  if (response.status === 401) return null;
  // No such function: the wall's migration is not in this database, so there is no wall.
  if (response.status === 404) return { enforce: false, signed_in: false, member: false, uid: null };
  if (!response.ok) throw new Error(`chula_access_state ${response.status}`);
  const body = await response.json();
  if (typeof body?.enforce !== 'boolean') throw new Error('chula_access_state shape');
  return body;
}

/**
 * Resolves { ok: true, userId, token } for a caller let in (userId and token are
 * null for a guest while the wall is off), else { ok: false, status, body }.
 */
export async function chulaGate(req, { env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  const token = bearerOf(req);
  const key = token ? createHash('sha256').update(token).digest('hex') : '';
  const remembered = key && members.get(key);
  if (remembered && remembered.until > now()) return { ok: true, userId: remembered.uid, token };

  // A guest needs only the switch, which a warm instance already holds.
  if (!token && lastSwitch && now() - lastSwitch.at < SWITCH_TTL_MS) {
    return lastSwitch.enforce ? SIGNIN_REQUIRED : { ok: true, userId: null, token: null };
  }

  const cfg = backendConfig(env);
  if (!cfg.url || !cfg.key) {
    // No database configured, so no account exists to check: a local API or the
    // unit suite. Production always has one, and there its absence refuses.
    return env.VERCEL_ENV === 'production' ? UNAVAILABLE : { ok: true, userId: null, token: null };
  }
  let state = null;
  try {
    // A token the server refuses (expired, forged) leaves a guest: then only the switch matters.
    if (token) state = await askState(cfg, token, fetchImpl);
    if (!state?.signed_in) {
      let enforce = lastSwitch && now() - lastSwitch.at < SWITCH_TTL_MS ? lastSwitch.enforce : undefined;
      if (enforce === undefined) {
        enforce = (state ?? await askState(cfg, cfg.key, fetchImpl))?.enforce;
        if (typeof enforce !== 'boolean') throw new Error('chula_access_state refused the anon key');
        lastSwitch = { enforce, at: now() };
      }
      return enforce ? SIGNIN_REQUIRED : { ok: true, userId: null, token: null };
    }
    lastSwitch = { enforce: state.enforce, at: now() };
  } catch {
    return lastSwitch?.enforce === false ? { ok: true, userId: null, token: null } : UNAVAILABLE;
  }

  if (state.member === true) {
    if (members.size > 500) members.clear();
    members.set(key, { uid: state.uid, until: now() + MEMBER_TTL_MS });
    return { ok: true, userId: state.uid, token };
  }
  return state.enforce ? CHULA_REQUIRED : { ok: true, userId: state.uid, token };
}

/** One line per handler: answers the refusal and returns null, or returns the gate. */
export async function requireChula(req, res, options) {
  const gate = await chulaGate(req, options);
  if (gate.ok) return gate;
  res.setHeader('Cache-Control', 'no-store');
  res.status(gate.status).json(gate.body);
  return null;
}

/** Tests only: forget what this instance remembered. */
export function resetChulaGate() {
  lastSwitch = null;
  members.clear();
}
