// Who is signed in, as one store the header, the sheets and the community pages read. It starts
// quiet: nothing about the backend loads until a student has a session on this device or asks to
// sign in, so the practice site pays nothing for the community.

import { useSyncExternalStore } from 'react';
import { AUTH_STORAGE_KEY, MODE, RETURN_KEY } from './config.js';
import { readJSON, writeJSON } from '../lib/storage.js';
import { safeReturnPath } from '@vetmock/lib/family/return-path.js';

let backendPending = null;
/** The community's calls: live.js on the real backend, demo.js in development and tests. */
export function getBackend() {
  if (!backendPending) backendPending = MODE === 'live' ? import('./live.js') : import('./demo.js');
  return backendPending;
}

/**
 * @typedef {{ status: 'off'|'idle'|'loading'|'anon'|'in', user: null|{ id: string, email: string, name: string },
 *   profile: null|ReturnType<typeof import('./shapes.js').toProfile>, moderator: boolean, setup: boolean,
 *   profileFailed: boolean }} Account
 */
let state = /** @type {Account} */ ({ status: MODE === 'off' ? 'off' : 'idle', user: null, profile: null, moderator: false, setup: false, profileFailed: false });
const listeners = new Set();
const set = (patch) => { state = { ...state, ...patch }; for (const l of listeners) l(); };

export const accountStore = {
  get: () => state,
  subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
};
export const useAccount = () => useSyncExternalStore(accountStore.subscribe, accountStore.get, accountStore.get);

/** A session left on this device from an earlier visit, read without loading anything. */
function hasStoredSession() {
  try {
    if (MODE === 'live') return !!localStorage.getItem(AUTH_STORAGE_KEY);
    return !!JSON.parse(sessionStorage.getItem('vca:demo:community:v1') || 'null')?.session;
  } catch { return false; }
}

let listening = false;
async function listen() {
  const b = await getBackend();
  if (!listening) { listening = true; b.auth.onChange((s) => { follow(s); }); }
  return b;
}

// The profile sheet opens by itself once per signed-in person: closed with "later", it stays closed,
// on later visits too (kept per account in this browser; it used to live only in memory, so the sheet
// came back on every visit).
let setupOffered = null;
const OFFERED_KEY = 'vca:profile-offered';
export const offeredBefore = (uid) => {
  const list = readJSON(OFFERED_KEY, []);
  return Array.isArray(list) && list.includes(uid);
};
export function rememberOffered(uid) {
  const list = readJSON(OFFERED_KEY, []);
  const ids = Array.isArray(list) ? list.filter((id) => typeof id === 'string' && id !== uid) : [];
  writeJSON(OFFERED_KEY, [...ids, uid].slice(-20));
}

// Calls to follow() overlap: a new listener is told the session there is (supabase's
// INITIAL_SESSION) while ensureAccount reads it too, and a sign-out can land while a profile is on
// its way. Only the newest call writes; one overtaken by a newer call or by a sign-out writes
// nothing and settles when the newest does. The second of two answers to one first sign-in closed
// the profile sheet the first had opened (and remembered as offered), and a profile that came back
// after a sign-out put the student back in with no user.
let turn = 0;
let newest = Promise.resolve();
/** A sign-out has the last word: whatever follow() is still on its way writes nothing. */
const overtake = () => { turn += 1; newest = Promise.resolve(); };

function follow(session) {
  const at = ++turn;
  const run = settle(session, () => at === turn).then(() => (at === turn ? undefined : newest));
  // A call a listener made while this one began is newer, and stays the one to wait for.
  if (at === turn) newest = run;
  return run;
}

async function settle(session, current) {
  if (!session) { setupOffered = null; set({ status: 'anon', user: null, profile: null, moderator: false, setup: false, profileFailed: false }); return; }
  const b = await getBackend();
  if (!current()) return;
  // The same person again (the tab came back, the hourly token refresh): refresh quietly. Going
  // through 'loading' unmounted the chat room and the open sheets, and lost what was being typed.
  if (state.status === 'in' && state.user?.id === session.user.id) {
    try {
      const [profile, moderator] = await Promise.all([b.profiles.mine(), b.profiles.isModerator().catch(() => state.moderator)]);
      if (current()) set({ user: session.user, profile, moderator, profileFailed: false });
    } catch { /* keep what is on screen; the next event tries again */ }
    return;
  }
  set({ status: 'loading', user: session.user });
  try {
    const [profile, moderator] = await Promise.all([b.profiles.mine(), b.profiles.isModerator().catch(() => false)]);
    if (!current()) return;
    // A first sign-in has no profile yet: the profile sheet opens by itself, once.
    const offer = !profile && setupOffered !== session.user.id && !offeredBefore(session.user.id);
    if (offer) {
      setupOffered = session.user.id;
      rememberOffered(session.user.id);
    }
    set({ status: 'in', profile, moderator, setup: offer, profileFailed: false });
  } catch {
    // Not knowing is not having none: no setup sheet (saving would try to create a second
    // profile and read as "username taken"); the pages offer a retry instead.
    if (current()) set({ status: 'in', profile: null, moderator: false, setup: false, profileFailed: true });
  }
}

/** Try loading the signed-in student's profile again, after a failure. */
export async function retryProfile() {
  const b = await getBackend();
  const session = await b.auth.session();
  if (!session) return follow(null);
  set({ status: 'idle', user: null });
  return follow(session);
}

/** Called once at start-up: signs a returning student back in, or settles as signed out. */
export function startAccount() {
  if (MODE === 'off' || state.status !== 'idle') return;
  if (!hasStoredSession()) { set({ status: 'anon' }); return; }
  set({ status: 'loading' });
  listen().then((b) => b.auth.session()).then(follow).catch(() => set({ status: 'anon' }));
}

/** Load the backend and settle the account now (the community pages need it). */
export async function ensureAccount() {
  if (MODE === 'off') return state;
  if (state.status === 'idle' || state.status === 'anon') {
    const b = await listen();
    await follow(await b.auth.session());
  }
  return state;
}

// The hash is kept too, so a link to a section arrives at that section. Only a relative path on this
// origin is kept or followed (src/lib/family/return-path.js): never '//host', '/\host' or a full URL.
/** Where to come back to after a sign-in that leaves the site (Google, LINE, an email link). */
export function rememberReturn(path = `${window.location.pathname}${window.location.search}${window.location.hash}`) {
  const safe = safeReturnPath(path);
  try { sessionStorage.setItem(RETURN_KEY, !safe || safe.startsWith('/auth/') ? '/community' : safe); } catch { /* falls back to /community */ }
}
export function takeReturn() {
  try {
    const path = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return safeReturnPath(path) || '/community';
  } catch { return '/community'; }
}

/** @param {'google'|'line'|'email'} method */
export async function signIn(method, ...args) {
  rememberReturn();
  const b = await listen();
  return b.auth[method](...args);
}

export async function signOut() {
  const b = await getBackend();
  await b.auth.signOut();
  overtake();
  set({ status: 'anon', user: null, profile: null, moderator: false, setup: false });
}

export async function saveProfile(profile) {
  const b = await getBackend();
  // After a failed load the profile may exist: ask again rather than create a second one.
  const existing = state.profile || (state.profileFailed ? await b.profiles.mine() : null);
  const saved = await b.profiles.save(profile, { create: !existing });
  // A first profile keeps its sheet open for the welcome; closing it ends setup (openSetup).
  set(existing ? { profile: saved, setup: false } : { profile: saved });
  return saved;
}

/** Open or close the profile sheet from anywhere (the header's menu, a page's prompt). */
export const openSetup = (open = true) => set({ setup: open });
