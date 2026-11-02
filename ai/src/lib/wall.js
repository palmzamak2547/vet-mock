// ============================================================
// wall.js — the Chula sign-in wall's state (docs/CHULA-SIGNIN.md)
// ============================================================
// One small store the page reads: where the switch is, who is signed in, and
// what the server last said about them, turned into gateState()'s four answers
// ('open' | 'checking' | 'signin' | 'link'). The database decides; this keeps
// its answers on the device (rememberAnswer), so a saved member session opens
// with no network, and it never signs anyone out because a check failed.
//
// createWall() takes everything it touches (the account, storage, fetch, the
// address bar), so tests/unit/wall.test.mjs drives it with fakes; account.js
// makes the page's one instance.
// ============================================================

import {
  CHULA_HD, fetchAccessState, gateState, rememberAnswer, rememberedEnforce, rememberedMember,
  signInProblem, takeAuthErrorFromUrl,
} from './chula.js';

/** What each problem says to the student (docs/CHULA-SIGNIN.md, the same words on every VetMock origin). */
export const PROBLEM_TEXT = Object.freeze({
  'not-chula': 'บัญชีนี้ไม่ใช่อีเมลจุฬา เลือกบัญชี @student.chula.ac.th หรือ @chula.ac.th แล้วลองใหม่',
  cancelled: 'ยกเลิกการเข้าสู่ระบบแล้ว ลองใหม่ได้ทุกเมื่อ',
  offline: 'ยังไม่ได้ต่ออินเทอร์เน็ต การเข้าสู่ระบบครั้งแรกต้องใช้เน็ต เครื่องที่เคยเข้าสู่ระบบแล้วใช้ต่อได้แบบออฟไลน์',
  expired: 'เซสชันหมดอายุแล้ว เข้าสู่ระบบอีกครั้ง',
  unknown: 'เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง',
  // linking on the link screen
  'identity-taken': 'บัญชีจุฬานี้มีบัญชี VetMock ของตัวเองอยู่แล้ว เข้าบัญชีจุฬานั้นแทนได้เลย ความคืบหน้าในบัญชีนี้ยังอยู่',
  'linking-off': 'ตอนนี้ยังเชื่อมบัญชีไม่ได้ ลองใหม่อีกครั้ง',
});

/** The words for a problem; one this table does not name reads as unknown. */
export const problemText = (kind) => (kind ? PROBLEM_TEXT[kind] || PROBLEM_TEXT.unknown : '');

/** A sign-in that neither leaves for Google nor fails must not leave the buttons busy. */
export const SAFETY_MS = 12_000;

/** A tab shown again asks the database again, at most this often (an open tab sees the switch turned on). */
export const RECHECK_MS = 60_000;

const NO_ANSWER = Object.freeze({ uid: undefined, verdict: 'pending' });

export function createWall({
  auth,
  store = globalThis.localStorage,
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
  // An OAuth error is read from the address once, before the client could see it.
  const returned = configured ? takeAuthErrorFromUrl(location, history) : null;
  let leftOnPurpose = false;
  let started = false;
  let subscribed = false;
  let turn = 0;
  let asked = -Infinity;
  let safety = 0;
  const listeners = new Set();

  let raw = {
    enforce: configured ? rememberedEnforce(store) ?? 'pending' : false,
    // a code in the address is a sign-in landing: neither the app nor the buttons until it settles
    loading: configured && !returned && auth.returning(),
    user: boot?.user || null,
    token: boot?.access_token || null,
    answer: NO_ANSWER,
    problem: returned ? signInProblem(returned, { online: online() }) || 'unknown' : null,
    forced: false,
    busy: null,
  };

  const derive = (s) => {
    const uid = s.user?.id ?? null;
    const verdict = s.answer.uid === uid ? s.answer.verdict : 'pending';
    const remembered = rememberedMember(uid, store);
    let gate = gateState({ configured, enforce: s.enforce, loading: s.loading, user: s.user, verdict, remembered });
    // the API refused this token even after a refresh: ask for a sign-in again (until the switch goes off)
    if (configured && s.forced && s.enforce !== false) gate = 'signin';
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
    asked = now();
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
      set({ user: null, token: null, forced: false, answer: NO_ANSWER, problem: leftOnPurpose ? null : raw.problem || 'expired' });
      check();
      return;
    }
    // INITIAL_SESSION without a session says nothing (offline it is null too); start() reads the session itself
    if (!session?.user) return;
    const changed = session.user.id !== raw.user?.id;
    const signedIn = changed || event === 'SIGNED_IN';
    // a new session or a refreshed token is worth another try at the API
    const fresh = signedIn || event === 'TOKEN_REFRESHED';
    // SIGNED_IN also comes when a stored session is restored on load: only another account clears a problem
    set({ user: session.user, token: session.access_token || raw.token, loading: false, ...(fresh ? { forced: false } : {}), ...(changed ? { problem: null } : {}) });
    if (signedIn || (event === 'TOKEN_REFRESHED' && snapshot.verdict === 'unknown')) check();
  }

  /** Called once at start-up. Idempotent. */
  async function start() {
    if (!configured || started) return;
    started = true;
    events?.addEventListener?.('online', () => { check(); });
    // a tab shown again (back from another tab, a phone woken): ask again, at most once a minute
    doc?.addEventListener?.('visibilitychange', () => {
      if (doc.visibilityState === 'visible' && now() - asked >= RECHECK_MS) check();
    });
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

  /** Signs out on this device only, then the wall asks again ("ใช้บัญชีอื่น", the menu's sign-out). */
  async function signOut() {
    if (!configured) return;
    leftOnPurpose = true;
    clearTimeout(safety);
    set({ busy: 'signout', problem: null });
    try { await auth.signOut(); } catch { /* the local session is gone either way */ }
    set({ busy: null, user: null, token: null, forced: false, answer: NO_ANSWER });
    check();
  }

  /** What the API calls need: a token per request, one refresh after a 401, and where refusals go. */
  const apiAuth = {
    async token() {
      if (!configured || !raw.user) return null;
      try {
        const { session } = await auth.session();
        if (session?.access_token) return session.access_token;
      } catch { /* the token held is the best there is */ }
      return raw.token;
    },
    async refresh() {
      if (!configured) return null;
      try { return (await auth.refresh()) || null; } catch { return null; }
    },
    /** 'signin': no token or one the server refused after a refresh. 'link': signed in, not a member. */
    refused(kind) {
      if (!configured) return;
      const uid = raw.user?.id ?? null;
      if (kind === 'link' && uid) {
        rememberAnswer({ enforce: true, uid, member: false }, store);
        set({ enforce: true, answer: { uid, verdict: 'no' } });
        return;
      }
      rememberAnswer({ enforce: true, uid: null, member: null }, store);
      set({ enforce: true, forced: Boolean(raw.user), problem: raw.user ? 'expired' : raw.problem });
    },
  };

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
    apiAuth,
  };
}
