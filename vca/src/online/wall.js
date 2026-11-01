// The Chula sign-in wall's state (docs/CHULA-SIGNIN.md). One small store the app reads: where
// the switch is, who is signed in, and what the server last said about them, turned into
// gateState()'s four answers ('open' | 'checking' | 'signin' | 'link'). The database decides;
// this keeps its answers on the device (rememberAnswer), so a saved member session opens with no
// network, and it never signs anyone out because a check failed.
//
// createWall() takes everything it touches (the account, storage, fetch, the address bar), so
// tests/unit/chula-wall.test.mjs drives it with fakes; gate.js makes the site's one instance on
// the shared VetMock account. A build with no backend (demo or off) has no accounts to gate.

import {
  CHULA_HD, fetchAccessState, gateState, rememberAnswer, rememberedEnforce, rememberedMember,
  signInProblem, takeAuthErrorFromUrl,
} from './chula.js';

/** What each problem says to the student, the same words on every VetMock origin. */
export const PROBLEM_TEXT = Object.freeze({
  'not-chula': 'บัญชีนี้ไม่ใช่อีเมลจุฬา เลือกบัญชี @student.chula.ac.th หรือ @chula.ac.th แล้วลองใหม่',
  cancelled: 'ยกเลิกการเข้าสู่ระบบแล้ว ลองใหม่ได้ทุกเมื่อ',
  offline: 'ยังไม่ได้ต่ออินเทอร์เน็ต การเข้าสู่ระบบครั้งแรกต้องใช้เน็ต เครื่องที่เคยเข้าสู่ระบบแล้วใช้ต่อได้แบบออฟไลน์',
  expired: 'เซสชันหมดอายุแล้ว เข้าสู่ระบบอีกครั้ง',
  unknown: 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง',
});

/** The words for a problem; linking problems belong to vetmock.com and read as unknown here. */
export const problemText = (kind) => (kind ? PROBLEM_TEXT[kind] || PROBLEM_TEXT.unknown : '');

/** A sign-in that neither leaves for Google nor fails must not leave the buttons busy. */
export const SAFETY_MS = 12_000;

const NO_ANSWER = Object.freeze({ uid: undefined, verdict: 'pending' });

export function createWall({
  auth,
  store = globalThis.localStorage,
  fetchImpl = (...args) => globalThis.fetch(...args),
  online = () => globalThis.navigator?.onLine !== false,
  location = globalThis.location,
  history = globalThis.history,
  events = globalThis,
  safetyMs = SAFETY_MS,
}) {
  const configured = Boolean(auth?.configured);
  const boot = configured ? auth.stored() : null;
  // An OAuth error is read from the address once (a sign-in comes back to /auth/callback,
  // which hands its own errors over with holdProblem()).
  const returned = configured ? takeAuthErrorFromUrl(location, history) : null;
  let leftOnPurpose = false;
  let started = false;
  let subscribed = false;
  let turn = 0;
  let safety = 0;
  const listeners = new Set();

  let raw = {
    enforce: configured ? rememberedEnforce(store) ?? 'pending' : false,
    loading: configured && !returned && auth.returning(),
    user: boot?.user || null,
    token: boot?.access_token || null,
    answer: NO_ANSWER,
    problem: returned ? signInProblem(returned, { online: online() }) || 'unknown' : null,
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
      set({ user: null, token: null, answer: NO_ANSWER, problem: leftOnPurpose ? null : raw.problem || 'expired' });
      check();
      return;
    }
    // INITIAL_SESSION without a session says nothing (offline it is null too); start() reads the session itself
    if (!session?.user) return;
    const signedIn = session.user.id !== raw.user?.id || event === 'SIGNED_IN';
    set({ user: session.user, token: session.access_token || raw.token, loading: false, ...(signedIn ? { problem: null } : {}) });
    if (signedIn || (event === 'TOKEN_REFRESHED' && snapshot.verdict === 'unknown')) check();
  }

  /** Called once at start-up. Idempotent. */
  async function start() {
    if (!configured || started) return;
    started = true;
    events?.addEventListener?.('online', () => { check(); });
    // back from linking the account at vetmock.com in another tab: ask again
    events?.addEventListener?.('focus', () => { if (snapshot.gate === 'link') check(); });
    // the client is loaded only for a student who has a session here: a guest's practice pays nothing
    if (raw.user || raw.loading) {
      const landing = raw.loading;
      try {
        subscribed = true;
        await auth.onChange(onAuthEvent);
        const { session, error, retryable } = await auth.session();
        if (session?.user) {
          set({ user: session.user, token: session.access_token || raw.token, loading: false });
        } else if (retryable && raw.user) {
          // the refresh could not reach the server: the stored account stands, the token refreshes later
          set({ loading: false });
        } else {
          const problem = raw.problem
            || (landing && error ? signInProblem(error, { online: online() }) || 'unknown' : null)
            || (boot && !leftOnPurpose ? 'expired' : null);
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

  /** A session made elsewhere on this page (the callback page finished a sign-in): read it now. */
  async function resync() {
    if (!configured) return;
    try {
      if (!subscribed) {
        subscribed = true;
        await auth.onChange(onAuthEvent);
      }
      const { session } = await auth.session();
      if (session?.user) onAuthEvent('SIGNED_IN', session);
    } catch {
      subscribed = false; // the next boot reads it from storage
    }
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
      set({ busy: null });
      if (session?.user) onAuthEvent('SIGNED_IN', session);
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

  /** Signs out on this device only, then the wall asks again ("ใช้บัญชีอื่น", the account menu). */
  async function signOut() {
    if (!configured) return;
    leftOnPurpose = true;
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
    resync,
    signIn,
    signInWithGoogleToken,
    signOut,
    /** A sign-in that came back with an error to /auth/callback: say it on the wall's card. */
    holdProblem: (kind) => set({ problem: kind || null }),
    clearProblem: () => set({ problem: null }),
  };
}
