// ============================================================
// prefs/account-sync.js — the preferences that follow the account
// ============================================================
// No database change: the copy is one token (prefs/account-token.js) in the
// sign-in account's user_metadata, written with auth.updateUser. Loaded after
// sign-in, never on first paint. Guests keep everything on the device.
//
//   local stamp  vmx-prefs-stamp: when an account row last changed here
//   seen mark    vmx-prefs-sync:<user id>: the newest token time this device
//                has taken in or written for that account
//
// On sign-in, with the account's token at time T:
//   - no token yet        this device's values go up (if it has any)
//   - first time here     only rows this device has no choice for are taken
//                         from the account; the device's own choices stay
//   - T newer than local  the account's values are applied
//   - local newer than T  this device's values go up
// A change made here is written after a quiet two seconds, or when the studio
// closes (flushPrefsSync), never per tap. A failed write keeps the local
// choice, shows nothing, and is tried again with the next change.
// ============================================================

import { ACCOUNT_PREFS, LOCAL_STAMP_KEY, PREF_CHANGE_EVENT, prefRow, readPref, writePref } from './table.js';
import { ACCOUNT_META_KEY, encodeAccountToken, parseAccountToken } from './account-token.js';

export const SEEN_PREFIX = 'vmx-prefs-sync:';
export const QUIET_MS = 2000;

const ls = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };
const num = (k) => { try { const n = Number(ls()?.getItem(k)); return Number.isFinite(n) && n > 0 ? n : 0; } catch { return 0; } };
const put = (k, v) => { try { ls()?.setItem(k, String(v)); } catch { /* the next sign-in decides again */ } };

export function accountValues() {
  return Object.fromEntries(ACCOUNT_PREFS.map((id) => [id, readPref(id)]));
}
const storedLocally = (id) => { try { return Boolean(prefRow(id)?.stored()); } catch { return false; } };

/** Decide what a sign-in does, from plain values (pure; unit tested). */
export function plan({ token, localStamp, seen, storedIds }) {
  if (!token) return storedIds.length ? { take: {}, push: true } : { take: {}, push: false };
  if (!seen) {
    const take = Object.fromEntries(Object.entries(token.values).filter(([id]) => !storedIds.includes(id)));
    // A choice made here after the account's copy is the newer one.
    return localStamp > token.at ? { take, push: true } : { take, push: false, seen: token.at };
  }
  if (token.at > localStamp) return { take: token.values, push: false, seen: token.at };
  if (localStamp > token.at) return { take: {}, push: true };
  return { take: {}, push: false, seen: token.at };
}

let state = null;

/** Start following `user`'s account copy. `auth` is supabase.auth. */
export function startPrefsSync({ user, auth }) {
  stopPrefsSync();
  if (!user?.id || typeof auth?.updateUser !== 'function') return;
  const seenKey = SEEN_PREFIX + encodeURIComponent(user.id);
  state = { user, auth, seenKey, timer: 0, applying: false };
  const token = parseAccountToken(user.user_metadata?.[ACCOUNT_META_KEY]);
  const decision = plan({
    token,
    localStamp: num(LOCAL_STAMP_KEY),
    seen: num(seenKey),
    storedIds: ACCOUNT_PREFS.filter(storedLocally),
  });
  if (Object.keys(decision.take).length) {
    state.applying = true;
    try { for (const [id, v] of Object.entries(decision.take)) writePref(id, v, { quiet: true }); } finally { state.applying = false; }
  }
  if (decision.seen) put(seenKey, decision.seen);
  if (decision.push) schedule(0);
  window.addEventListener(PREF_CHANGE_EVENT, onChange);
  window.addEventListener('vmx-motion-settings-change', onChange);
  window.addEventListener('vmx-buddy-changed', onChange);
}

export function stopPrefsSync() {
  if (!state) return;
  clearTimeout(state.timer);
  window.removeEventListener(PREF_CHANGE_EVENT, onChange);
  window.removeEventListener('vmx-motion-settings-change', onChange);
  window.removeEventListener('vmx-buddy-changed', onChange);
  state = null;
}

function onChange() {
  if (!state || state.applying) return;
  // Only a change that moved the local stamp past what the account holds.
  if (num(LOCAL_STAMP_KEY) > num(state.seenKey)) schedule(QUIET_MS);
}

function schedule(ms) {
  if (!state) return;
  clearTimeout(state.timer);
  state.timer = setTimeout(push, ms);
}

/** Write now if a change is waiting (the studio calls this on close). */
export function flushPrefsSync() {
  if (!state || !state.timer) return;
  clearTimeout(state.timer);
  push();
}

async function push() {
  if (!state) return;
  state.timer = 0;
  const { auth, seenKey } = state;
  const at = num(LOCAL_STAMP_KEY) || Date.now();
  const token = encodeAccountToken(accountValues(), at);
  if (!token) return;
  try {
    const { error } = await auth.updateUser({ data: { [ACCOUNT_META_KEY]: token } });
    if (!error) put(seenKey, at);
  } catch { /* kept locally; the next change tries again */ }
}
