// The Chula sign-in wall's state for the workspace [docs/CHULA-SIGNIN.md; M1-DESIGN.md 9.7]. One
// small store: where the switch is, who is signed in, and what the server last said about them,
// turned into gateState()'s four answers ('open' | 'checking' | 'signin' | 'link'). The database
// decides; this keeps its answers on the device (prefs.chulaWall), so a saved member session opens
// with no network, and it never signs anyone out because a check failed. Only Supabase is asked
// (one state call, then Auth); no research data is sent.
//
// createWall() takes everything it touches, so tests/unit/chula-wall.test.mjs drives it with fakes;
// chulaWall() makes the page's one instance on the real account, the first time it is asked for
// (workspace/components/ChulaGate.jsx, a lazy chunk loaded only when sign-in is configured).
// OWNER: runtime role.
import { useSyncExternalStore } from 'react';
import { AUTH_CONFIGURED, AUTH_KEY, AUTH_URL, cleanAuthParams, getAuthClient, redirectTarget, signedOutHere, signIn as clientSignIn, signOut as clientSignOut } from './client.js';
import { storedSession } from './stored.js';
import {
  CHULA_HD, fetchAccessState, gateState, prefsStore, rememberAnswer, rememberedEnforce, rememberedMember,
  signInProblem, takeAuthErrorFromUrl,
} from './chula.js';

/** The dictionary key for each problem (i18n/runtime-chula.js); one not named reads as unknown. */
export const PROBLEM_KEYS = Object.freeze({
  'not-chula': 'runtime.chula.problem.notChula',
  cancelled: 'runtime.chula.problem.cancelled',
  offline: 'runtime.chula.problem.offline',
  expired: 'runtime.chula.problem.expired',
  unknown: 'runtime.chula.problem.unknown',
  'identity-taken': 'runtime.chula.problem.identityTaken',
  'linking-off': 'runtime.chula.problem.linkingOff',
});

/** @param {string|null} kind @returns {string|null} */
export const problemKey = (kind) => (kind ? PROBLEM_KEYS[kind] || PROBLEM_KEYS.unknown : null);

/** A sign-in that neither leaves for Google nor fails must not leave the buttons busy. */
export const SAFETY_MS = 12_000;

/** A tab shown again asks the database again, at most this often (an open tab sees the switch turned on). */
export const RECHECK_MS = 60_000;

const NO_ANSWER = Object.freeze({ uid: undefined, verdict: 'pending' });

/** A refresh that failed because the network is down or the server did not answer, not a refusal. */
const retryable = (error) => Boolean(error) && (error.name === 'AuthRetryableFetchError' || error.status === 0 || (typeof error.status === 'number' && error.status >= 500));

export function createWall({
  auth,
  store = prefsStore,
  fetchImpl = (...args) => globalThis.fetch(...args),
  online = () => globalThis.navigator?.onLine !== false,
  location = globalThis.location,
  history = globalThis.history,
  events = globalThis,
  doc = globalThis.document,
  now = () => Date.now(),
  reload = () => globalThis.location?.reload(),
  safetyMs = SAFETY_MS,
}) {
  const configured = Boolean(auth?.configured);
  const boot = configured ? auth.stored() : null;
  // An OAuth error is read from the address once, before the client (or useOwner) could see it.
  const returned = configured ? takeAuthErrorFromUrl(location, history) : null;
  let ownSignOut = false;
  // the account menu signs out through client.js, not through this store: it says so there
  const asked = () => ownSignOut || Boolean(auth.signedOutHere?.());
  let started = false;
  let subscribed = false;
  let turn = 0;
  let askedAt = -Infinity;
  let safety = 0;
  const listeners = new Set();

  let raw = {
    enforce: configured ? rememberedEnforce(store) ?? 'pending' : false,
    // ?code= is a sign-in landing on /app: neither the workspace nor the buttons until it settles
    loading: configured && !returned && auth.returning(),
    user: boot?.user || null,
    token: boot?.access_token || null,
    answer: NO_ANSWER,
    problem: returned ? signInProblem(returned, { online: online() }) || 'unknown' : null,
    returned: Boolean(returned),
    busy: null,
  };

  const derive = (s) => {
    const uid = s.user?.id ?? null;
    const verdict = s.answer.uid === uid ? s.answer.verdict : 'pending';
    const remembered = rememberedMember(uid, store);
    const gate = gateState({ configured, enforce: s.enforce, loading: s.loading, user: s.user, verdict, remembered });
    const email = s.user ? s.user.email || s.user.user_metadata?.email || '' : '';
    return Object.freeze({ ...s, configured, verdict, remembered, gate, email });
  };
  let snapshot = derive(raw);

  const set = (patch) => {
    raw = { ...raw, ...patch };
    snapshot = derive(raw);
    for (const listener of listeners) listener();
  };

  /** Ask the database where the switch is and what it says about this account. */
  async function check() {
    if (!configured) return;
    const mine = ++turn;
    askedAt = now();
    const uid = raw.user?.id ?? null;
    try {
      const state = await fetchAccessState({ url: auth.url, key: auth.key, token: uid ? raw.token : null, fetchImpl, timeoutMs: uid ? 6000 : 4000 });
      if (mine !== turn) return;
      // an answer about another account (or about nobody, when the token was refused) says nothing of this one
      const member = uid && state.uid === uid ? state.member : null;
      rememberAnswer({ enforce: state.enforce, uid, member }, store);
      set({ enforce: state.enforce, answer: { uid, verdict: member === true ? 'yes' : member === false ? 'no' : 'unknown' } });
    } catch {
      if (mine !== turn) return;
      // Unreachable: keep what this device last knew, and assume on if it never knew.
      set({ enforce: raw.enforce === 'pending' ? rememberedEnforce(store) ?? true : raw.enforce, answer: { uid, verdict: 'unknown' } });
    }
  }

  function onAuthEvent(event, session) {
    if (event === 'SIGNED_OUT') {
      set({ user: null, token: null, answer: NO_ANSWER, problem: asked() ? null : raw.problem || 'expired' });
      check();
      return;
    }
    // INITIAL_SESSION without a session says nothing (offline it is null too); start() reads the session itself
    if (!session?.user) return;
    const changed = session.user.id !== raw.user?.id;
    const signedIn = changed || event === 'SIGNED_IN';
    // SIGNED_IN also comes when a stored session is restored on load: only another account clears a problem
    set({ user: session.user, token: session.access_token || raw.token, loading: false, ...(changed ? { problem: null } : {}) });
    if (signedIn || (event === 'TOKEN_REFRESHED' && snapshot.verdict === 'unknown')) check();
  }

  /** Called once when the workspace mounts. Idempotent. */
  async function start() {
    if (!configured || started) return;
    started = true;
    events?.addEventListener?.('online', () => { check(); });
    // a tab shown again (back from another tab, a phone woken): ask again, at most once a minute
    doc?.addEventListener?.('visibilitychange', () => {
      if (doc.visibilityState === 'visible' && now() - askedAt >= RECHECK_MS) check();
    });
    if (raw.user || raw.loading) {
      const landing = raw.loading;
      try {
        subscribed = true;
        await auth.onChange(onAuthEvent);
        const { session, error, retryable: offline } = await auth.session();
        if (session?.user) {
          set({ user: session.user, token: session.access_token || raw.token, loading: false });
        } else if (offline && raw.user) {
          // the refresh could not reach the server: the stored account stands, the token refreshes later
          set({ loading: false });
        } else {
          const problem = raw.problem
            || (landing && error ? signInProblem(error, { online: online() }) || 'unknown' : null)
            || (boot && !asked() ? 'expired' : null);
          set({ user: null, token: null, loading: false, problem });
        }
      } catch {
        // the client could not load (offline, a chunk gone after a deploy): the stored account stands
        subscribed = false;
        set({ loading: false });
      }
    }
    await check();
  }

  /** Google's own button handed back an ID token: trade it for a session on this page, no redirect. */
  async function signInWithGoogleToken(token, nonce) {
    if (!configured || raw.busy) return;
    clearTimeout(safety);
    set({ busy: 'google', problem: null });
    safety = setTimeout(() => set({ busy: null }), safetyMs);
    try {
      const session = await auth.idToken(token, nonce);
      clearTimeout(safety);
      // a sign-in on a page that had no session: hear the account's later changes (refresh, sign-out) too
      if (!subscribed) {
        subscribed = true;
        Promise.resolve(auth.onChange(onAuthEvent)).catch(() => { subscribed = false; });
      }
      set({ busy: null, problem: null });
      if (session?.user) onAuthEvent('SIGNED_IN', session);
    } catch (error) {
      clearTimeout(safety);
      set({ busy: null, problem: signInProblem(error, { online: online() }) || 'unknown' });
    }
  }

  /** The link screen: Google's button handed back an ID token. Add that Google identity to the account
   *  signed in here (manual linking), then start the page again as the account it now is. */
  async function linkWithGoogleToken(token, nonce) {
    if (!configured || raw.busy) return;
    clearTimeout(safety);
    set({ busy: 'link', problem: null });
    safety = setTimeout(() => set({ busy: null }), safetyMs);
    try {
      await auth.linkToken(token, nonce);
      clearTimeout(safety);
      reload();
    } catch (error) {
      clearTimeout(safety);
      // identity_already_exists: that Chula address has its own account; manual_linking_disabled: not yet
      set({ busy: null, problem: signInProblem(error, { online: online() }) || 'unknown' });
    }
  }

  /** The link screen's fallback when Google's button cannot load: link through Google's redirect. */
  async function linkRedirect(hd = CHULA_HD.student) {
    if (!configured || raw.busy) return;
    clearTimeout(safety);
    set({ busy: hd, problem: null });
    safety = setTimeout(() => set({ busy: null }), safetyMs);
    try {
      await auth.linkRedirect(hd);
    } catch (error) {
      clearTimeout(safety);
      set({ busy: null, problem: signInProblem(error, { online: online() }) || 'unknown' });
    }
  }

  /** The fallback when Google's button cannot load: the redirect through the database's address. */
  async function signIn(hd = CHULA_HD.student) {
    if (!configured || raw.busy) return;
    clearTimeout(safety);
    set({ busy: hd, problem: null });
    safety = setTimeout(() => set({ busy: null }), safetyMs);
    try {
      await auth.signIn(hd);
      // the page is leaving for Google; the safety timer frees the buttons if it never does
    } catch (error) {
      clearTimeout(safety);
      set({ busy: null, problem: signInProblem(error, { online: online() }) || 'unknown' });
    }
  }

  /** Signs out on this device only, then the wall asks again ("ใช้บัญชีอื่น"). */
  async function signOut() {
    if (!configured) return;
    ownSignOut = true;
    clearTimeout(safety);
    set({ busy: 'signout', problem: null });
    try { await auth.signOut(); } catch { /* the local session is gone either way */ }
    set({ busy: null, user: null, token: null, answer: NO_ANSWER });
    check();
  }

  return {
    get: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start,
    check,
    signIn,
    signInWithGoogleToken,
    linkWithGoogleToken,
    linkRedirect,
    signOut,
    clearProblem: () => set({ problem: null }),
  };
}

const port = {
  configured: AUTH_CONFIGURED,
  url: AUTH_URL,
  key: AUTH_KEY,
  stored: () => storedSession(),
  signedOutHere,
  returning: () => {
    try { return new URLSearchParams(globalThis.location?.search || '').has('code'); } catch { return false; }
  },
  async session() {
    const client = await getAuthClient();
    if (!client) return { session: null, error: null, retryable: false };
    const init = await client.auth.initialize();
    const { data, error } = await client.auth.getSession();
    cleanAuthParams();
    return { session: data?.session || null, error: error || init?.error || null, retryable: retryable(error) };
  },
  async onChange(callback) {
    const client = await getAuthClient();
    if (!client) return () => {};
    const { data } = client.auth.onAuthStateChange((event, session) => callback(event, session));
    return () => data?.subscription?.unsubscribe();
  },
  /** Google's own button (lib/auth/gis.js) handed back an ID token: trade it for a session, here. */
  async idToken(token, nonce) {
    const client = await getAuthClient();
    if (!client) throw new Error('runtime.auth.notConfigured');
    const { data, error } = await client.auth.signInWithIdToken({ provider: 'google', token, nonce });
    if (error) throw error;
    return data?.session || null;
  },
  /** The link screen: add the Google identity of that ID token to the account signed in here (manual linking). */
  async linkToken(token, nonce) {
    const client = await getAuthClient();
    if (!client) throw new Error('runtime.auth.notConfigured');
    const { data, error } = await client.auth.linkIdentity({ provider: 'google', token, nonce });
    if (error) throw error;
    return data;
  },
  /** The link screen's fallback: link through Google's redirect, back to /app. */
  async linkRedirect(hd) {
    const client = await getAuthClient();
    if (!client) throw new Error('runtime.auth.notConfigured');
    const { error } = await client.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: redirectTarget(), queryParams: { hd, prompt: 'select_account' } },
    });
    if (error) throw error;
  },
  /** The fallback: leaves for Google (back to /app, client.js redirectTarget); throws only when the redirect did not start. */
  async signIn(hd) {
    const result = await clientSignIn('google', { hd });
    if (result.key !== 'runtime.auth.redirecting') throw result.error || new Error(result.key);
  },
  async signOut() {
    await clientSignOut();
  },
};

let instance = null;

/** The page's one wall on the real account, made the first time it is asked for. */
export function chulaWall() {
  if (!instance) instance = createWall({ auth: port });
  return instance;
}

/** React hook: the wall's current state ({ gate, user, email, problem, busy, returned, ... }). */
export function useChulaWall() {
  const wall = chulaWall();
  return useSyncExternalStore(wall.subscribe, wall.get, wall.get);
}
