// The Chula sign-in rule, research.vetmock.com's copy of src/lib/chula.js in the main app
// (docs/CHULA-SIGNIN.md). research/ never imports ../src, so the rule is copied:
// tests/unit/chula-subapps.test.mjs at the repo root holds this copy to the same answers as the
// original; change both together. The database decides who is let in; this decides what the
// screen shows while it does, and lets a saved session open with no network.
// One difference, and only in where the memory lives: lib/store/prefs.js is the only file that
// touches localStorage [M1-DESIGN.md 9.8], so the switch and the accounts the server let in are
// kept in its prefs.chulaWall through prefsStore, a two-method storage over readPrefs/writePrefs.
// fetchAccessState asks Supabase (sign-in only, never research data), so this file sits in
// lib/auth, the one place the no-egress test lets reach the network. OWNER: runtime role.
import { readPrefs, writePrefs } from '../store/prefs.js';

export const CHULA_DOMAINS = Object.freeze(['student.chula.ac.th', 'chula.ac.th']);

/** Google's hosted-domain hint: every student identity carries hd = student.chula.ac.th. */
export const CHULA_HD = Object.freeze({ student: 'student.chula.ac.th', staff: 'chula.ac.th' });

/** The phrase the Auth hook's refusal carries; how a client recognises it. */
export const CHULA_REFUSAL_MARK = 'อีเมลจุฬา';

/** Exactly one @ and an exact Chula domain. x@vet.chula.ac.th is not accepted.
 *  Spaces around the address are ignored, as btrim does in the SQL twin. */
export function isChulaEmail(email) {
  if (typeof email !== 'string' || email.split('@').length !== 2) return false;
  return CHULA_DOMAINS.includes(email.replace(/^ +| +$/g, '').split('@')[1].toLowerCase());
}

/** A Google identity whose email Google verified on a Chula domain. */
export function hasChulaIdentity(user) {
  return Array.isArray(user?.identities) && user.identities.some((identity) =>
    identity?.provider === 'google'
    && isChulaEmail(identity.identity_data?.email)
    && String(identity.identity_data?.email_verified) === 'true'
    // Google's hosted-domain claim: an account in Chula's own Workspace, not a
    // personal Google account registered on a Chula address.
    && CHULA_DOMAINS.includes(String(identity.identity_data?.custom_claims?.hd || '').toLowerCase()));
}

/** The Chula address to show for an account, when it has one. */
export function chulaEmailOf(user) {
  const identity = Array.isArray(user?.identities)
    ? user.identities.find((i) => i?.provider === 'google' && isChulaEmail(i.identity_data?.email))
    : null;
  return identity?.identity_data?.email || (isChulaEmail(user?.email) ? user.email : null);
}

/**
 * What the gate shows, from what the device knows right now:
 *   configured  the build has a database (no database, no accounts, nothing to gate)
 *   enforce     the switch: true, false, or 'pending' while the first answer is awaited
 *   loading     the saved session is still being read
 *   user        the session's user, or null
 *   verdict     the server's answer about this account: 'pending' | 'yes' | 'no' | 'unknown'
 *   remembered  the server said yes for this account on this device before
 * Returns 'open' | 'checking' | 'signin' | 'link'.
 */
export function gateState({ configured, enforce, loading, user, verdict = 'pending', remembered = false }) {
  if (!configured || enforce === false) return 'open';
  if (loading) return 'checking';
  if (user) {
    if (verdict === 'yes') return 'open';
    if (verdict === 'no') return 'link';
    if (hasChulaIdentity(user) || remembered) return 'open';
    return verdict === 'pending' ? 'checking' : 'link';
  }
  return enforce === 'pending' ? 'checking' : 'signin';
}

// ── The switch and this device's memory of it ───────────────
const WALL_KEY = 'vmx-chula-wall';

/** Storage for the wall's memory, inside the prefs key (the only localStorage key this app writes). */
export const prefsStore = Object.freeze({
  getItem(key) {
    const memory = key === WALL_KEY ? readPrefs().chulaWall : null;
    return memory ? JSON.stringify(memory) : null;
  },
  setItem(key, value) {
    if (key === WALL_KEY) writePrefs({ chulaWall: JSON.parse(value) });
  },
});

function readMemory(store) {
  try {
    const parsed = JSON.parse(store.getItem(WALL_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** The last switch position this device saw: true, false, or null for never. */
export function rememberedEnforce(store = prefsStore) {
  const value = readMemory(store).enforce;
  return typeof value === 'boolean' ? value : null;
}

/** True when the server once said yes for this account on this device. */
export function rememberedMember(uid, store = prefsStore) {
  return Boolean(uid) && readMemory(store).members?.includes(uid) === true;
}

/** Keep what the server answered. A "no" forgets the account; a yes remembers it. */
export function rememberAnswer({ enforce, uid, member }, store = prefsStore) {
  try {
    const memory = readMemory(store);
    const members = new Set(Array.isArray(memory.members) ? memory.members : []);
    if (uid && member === true) members.add(uid);
    if (uid && member === false) members.delete(uid);
    store.setItem(WALL_KEY, JSON.stringify({
      enforce: typeof enforce === 'boolean' ? enforce : memory.enforce,
      members: [...members].slice(-8),
    }));
  } catch { /* private mode or a full store: the next boot asks again */ }
}

/** A signal that gives up after ms; Safari before 16 has no AbortSignal.timeout. */
function timeoutSignal(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  if (typeof AbortController === 'undefined') return undefined;
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/**
 * Ask the database where the switch is and whether this caller is let in.
 * Resolves { enforce, member, uid } or throws; a token the server refuses is
 * retried without it, so the switch is still learned.
 */
export async function fetchAccessState({ url, key, token, fetchImpl = globalThis.fetch, timeoutMs = 6000 }) {
  const ask = async (bearer) => {
    const response = await fetchImpl(`${url}/rest/v1/rpc/chula_access_state`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${bearer}`, 'Content-Type': 'application/json' },
      body: '{}',
      signal: timeoutSignal(timeoutMs),
    });
    if (!response.ok) {
      const error = new Error(`chula_access_state ${response.status}`);
      error.status = response.status;
      throw error;
    }
    const body = await response.json();
    if (typeof body?.enforce !== 'boolean') throw new Error('chula_access_state shape');
    return { enforce: body.enforce, member: body.member === true, uid: body.uid || null };
  };
  if (!token) return ask(key);
  try {
    return await ask(token);
  } catch (error) {
    if (error.status !== 401) throw error;
    const anonymous = await ask(key);
    return { ...anonymous, member: null };
  }
}

/**
 * Which plain-language problem a sign-in error is. Takes an Error, an auth-js
 * error, or the error/error_description pair of an OAuth return URL.
 */
export function signInProblem(error, { online = true } = {}) {
  if (!error) return null;
  const code = String(error.code || error.error_code || error.error || '').toLowerCase();
  const text = `${error.message || ''} ${error.error_description || ''} ${error.description || ''}`;
  if (text.includes(CHULA_REFUSAL_MARK) || /chula_only|chula_member_required|database error saving new user/i.test(text)) return 'not-chula';
  if (code === 'identity_already_exists' || /already (been )?linked|identity_already_exists/i.test(text)) return 'identity-taken';
  if (code === 'manual_linking_disabled' || /manual linking/i.test(text)) return 'linking-off';
  if (code === 'access_denied' || /cancel|closed|dismiss|popup_closed|user denied|access_denied/i.test(`${code} ${text}`)) return 'cancelled';
  if (!online || /failed to fetch|networkerror|network request failed|load failed/i.test(text)) return 'offline';
  if (/refresh token|session.*(expired|missing|not found)|jwt expired/i.test(text)) return 'expired';
  return 'unknown';
}

/** An OAuth error in this page's address (query or hash), left in place. */
export function readAuthErrorFromUrl(location = globalThis.location) {
  try {
    const search = new URLSearchParams(location.search);
    const hash = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));
    const source = search.get('error') || search.get('error_description') ? search
      : hash.get('error') || hash.get('error_description') ? hash : null;
    if (!source) return null;
    return {
      error: source.get('error') || '',
      error_code: source.get('error_code') || '',
      error_description: source.get('error_description') || '',
    };
  } catch {
    return null;
  }
}

/** Read and remove an OAuth error from this page's address (query or hash). */
export function takeAuthErrorFromUrl(location = globalThis.location, history = globalThis.history) {
  try {
    const found = readAuthErrorFromUrl(location);
    if (!found) return null;
    const search = new URLSearchParams(location.search);
    const hash = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));
    for (const name of ['error', 'error_code', 'error_description']) { search.delete(name); hash.delete(name); }
    const query = search.toString();
    const fragment = hash.toString();
    history?.replaceState?.(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${fragment ? `#${fragment}` : ''}`);
    return found;
  } catch {
    return null;
  }
}
