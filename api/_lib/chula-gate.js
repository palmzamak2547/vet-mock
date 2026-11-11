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

// Before any database call a token is read locally: three parts, a payload
// that decodes, this project's issuer (<url>/auth/v1), the "authenticated"
// audience and an expiry still ahead. A token that fails is no token at all:
// the caller is a guest, nothing is asked and nothing is counted, so an
// expired token costs nobody anything. A token that passes is always verified
// by the database. Nothing is counted per address: what one caller sends never
// refuses another on the same network.
// Known limit: a well-formed token with a bad signature still costs one
// database call, as before; verifying the signature here would end that.
export function tokenLooksValid(token, projectUrl, nowMs = Date.now()) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3 || parts.some((x) => !x)) return false;
  let claims;
  try {
    claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (!claims || typeof claims !== 'object') return false;
  const issuer = `${String(projectUrl || '').replace(/\/+$/, '')}/auth/v1`;
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  return claims.iss === issuer
    && audience.includes('authenticated')
    && typeof claims.sub === 'string' && claims.sub.length > 0
    && Number.isFinite(claims.exp) && claims.exp * 1000 > nowMs;
}

// Where the gate stands open without a database. A deployed preview
// (VERCEL_ENV=preview) may hold live provider keys, so it refuses like
// production; local development (no VERCEL_ENV, or `vercel dev`'s
// "development") and the unit suite stay open.
const deployed = (env) => env.VERCEL_ENV === 'production' || env.VERCEL_ENV === 'preview';

const SWITCH_TTL_MS = 30_000;
// How long a switch seen off keeps the API open through a database outage. Long
// enough that the AI and read-aloud ride out a Supabase hiccup while the wall is
// off; short enough that turning it on is not undone for long by one.
const OUTAGE_GRACE_MS = 10 * 60_000;
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

async function askState(cfg, bearer, fetchImpl, production) {
  const response = await fetchImpl(`${cfg.url}/rest/v1/rpc/chula_access_state`, {
    redirect: 'error',
    method: 'POST',
    headers: { apikey: cfg.key, Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(6000),
  });
  if (response.status === 401) return null;
  // No such function. Outside production that means a database without the wall's
  // migration, so no wall; in production it is a fault, and a fault refuses.
  if (response.status === 404 && !production) return { enforce: false, signed_in: false, member: false, uid: null };
  if (!response.ok) throw new Error(`chula_access_state ${response.status}`);
  const body = await response.json();
  if (typeof body?.enforce !== 'boolean') throw new Error('chula_access_state shape');
  return body;
}

/**
 * Resolves { ok: true, userId, token, member } for a caller let in (userId and
 * token are null for a guest while the wall is off; member is true only for a
 * Chula member or the admin), else { ok: false, status, body }.
 */
export async function chulaGate(req, { env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  const cfg = backendConfig(env);
  let token = bearerOf(req);
  if (token && cfg.url && !tokenLooksValid(token, cfg.url, now())) token = '';
  const key = token ? createHash('sha256').update(token).digest('hex') : '';
  const remembered = key && members.get(key);
  if (remembered && remembered.until > now()) return { ok: true, userId: remembered.uid, token, member: true };

  // A guest needs only the switch, which a warm instance already holds.
  if (!token && lastSwitch && now() - lastSwitch.at < SWITCH_TTL_MS) {
    return lastSwitch.enforce ? SIGNIN_REQUIRED : { ok: true, userId: null, token: null, member: false };
  }

  if (!cfg.url || !cfg.key) {
    // No database configured, so no account exists to check: a local API or the
    // unit suite. Production always has one, and there its absence refuses.
    return deployed(env) ? UNAVAILABLE : { ok: true, userId: null, token: null, member: false };
  }
  let state = null;
  try {
    // A token the server refuses (expired, forged) leaves a guest: then only the switch matters.
    const production = deployed(env);
    if (token) state = await askState(cfg, token, fetchImpl, production);
    if (!state?.signed_in) {
      let enforce = lastSwitch && now() - lastSwitch.at < SWITCH_TTL_MS ? lastSwitch.enforce : undefined;
      if (enforce === undefined) {
        enforce = (state ?? await askState(cfg, cfg.key, fetchImpl, production))?.enforce;
        if (typeof enforce !== 'boolean') throw new Error('chula_access_state refused the anon key');
        lastSwitch = { enforce, at: now() };
      }
      return enforce ? SIGNIN_REQUIRED : { ok: true, userId: null, token: null, member: false };
    }
    lastSwitch = { enforce: state.enforce, at: now() };
  } catch {
    // An outage opens only what this instance saw open in the last ten minutes.
    return lastSwitch?.enforce === false && now() - lastSwitch.at < OUTAGE_GRACE_MS ? { ok: true, userId: null, token: null, member: false } : UNAVAILABLE;
  }

  if (state.member === true) {
    if (members.size > 500) members.clear();
    members.set(key, { uid: state.uid, until: now() + MEMBER_TTL_MS });
    return { ok: true, userId: state.uid, token, member: true };
  }
  return state.enforce ? CHULA_REQUIRED : { ok: true, userId: state.uid, token, member: false };
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
