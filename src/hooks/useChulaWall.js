import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasSupabase, getSupabase } from '../lib/supabase.js';
import { fetchAccessState, gateState, readAuthErrorFromUrl, rememberAnswer, rememberedEnforce, rememberedMember, takeAuthErrorFromUrl } from '../lib/chula.js';

// useChulaWall({ user, loading }) — what the Chula sign-in wall shows now
// (docs/CHULA-SIGNIN.md). The database decides; this asks it once per account
// and again when the device comes back online, and keeps the answer so a saved
// session opens offline. It never signs anyone out.

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Read while the page boots, before the auth SDK or the router tidies the address:
// the gate mounts later, and Google's refusal must still reach it. The gate reads
// it while rendering and drops it only once a screen that shows it has committed,
// because React may render the gate more than once (or mount it again) first.
let bootAuthError = typeof window === 'undefined' ? null : readAuthErrorFromUrl();
export const peekBootAuthError = () => bootAuthError;
export function dropBootAuthError() { bootAuthError = null; }

/** Set by the gate before a sign-in starts; the door opens once when it lands. */
export const WELCOME_KEY = 'vmx-chula-welcome';

function readWelcome() {
  try { return sessionStorage.getItem(WELCOME_KEY) === '1'; } catch { return false; }
}

export function useChulaWall({ user, loading }) {
  const uid = user?.id ?? null;
  const [enforce, setEnforce] = useState(() => (hasSupabase ? rememberedEnforce() ?? 'pending' : false));
  const [answer, setAnswer] = useState({ uid: undefined, verdict: 'pending' });
  const [round, setRound] = useState(0);
  const [welcome, setWelcome] = useState(readWelcome);

  useEffect(() => {
    if (!hasSupabase || loading) return undefined;
    let alive = true;
    (async () => {
      let token = null;
      if (uid) {
        try { token = (await (await getSupabase())?.auth.getSession())?.data?.session?.access_token || null; } catch { token = null; }
      }
      try {
        const state = await fetchAccessState({ url: URL_, key: KEY, token, timeoutMs: uid ? 6000 : 4000 });
        if (!alive) return;
        const member = uid && state.uid === uid ? state.member : null;
        setEnforce(state.enforce);
        setAnswer({ uid, verdict: member === true ? 'yes' : member === false ? 'no' : 'unknown' });
        rememberAnswer({ enforce: state.enforce, uid, member });
      } catch {
        if (!alive) return;
        // Unreachable: keep what this device last knew, and assume on if it never knew.
        setEnforce((prev) => (prev === 'pending' ? rememberedEnforce() ?? true : prev));
        setAnswer({ uid, verdict: 'unknown' });
      }
    })();
    return () => { alive = false; };
  }, [uid, loading, round]);

  // Ask again when the device comes back online, and when the tab is looked at
  // again (at most once a minute), so an open tab sees the switch turned on.
  useEffect(() => {
    if (!hasSupabase) return undefined;
    let last = Date.now();
    const again = () => { last = Date.now(); setRound((n) => n + 1); };
    const seen = () => { if (document.visibilityState === 'visible' && Date.now() - last > 60_000) again(); };
    window.addEventListener('online', again);
    document.addEventListener('visibilitychange', seen);
    return () => { window.removeEventListener('online', again); document.removeEventListener('visibilitychange', seen); };
  }, []);

  const verdict = answer.uid === uid ? answer.verdict : 'pending';
  // Read once per account and per answer, not on every render of the app.
  const remembered = useMemo(() => rememberedMember(uid), [uid, answer]); // eslint-disable-line react-hooks/exhaustive-deps
  const state = gateState({ configured: hasSupabase, enforce, loading, user, verdict, remembered });
  // Let in past an enforced wall without the gate ever showing it (a member whose
  // stored session opened the app): a sign-in failure in the address is moot. Drop
  // it and tidy the address, so it cannot surface after a later sign-out in this
  // page. With the wall off the address is left alone: AuthView reads it.
  useEffect(() => {
    if (state !== 'open' || enforce !== true || !bootAuthError) return;
    dropBootAuthError();
    takeAuthErrorFromUrl();
  }, [state, enforce]);

  const refresh = useCallback(() => setRound((n) => n + 1), []);
  // Kept in sessionStorage as well, so it survives the redirect to Google and back.
  const armWelcome = useCallback(() => {
    try { sessionStorage.setItem(WELCOME_KEY, '1'); } catch { /* private mode */ }
    setWelcome(true);
  }, []);
  const doneWelcome = useCallback(() => {
    try { sessionStorage.removeItem(WELCOME_KEY); } catch { /* private mode */ }
    setWelcome(false);
  }, []);

  return { state, enforce, verdict, refresh, welcome: welcome && state === 'open', armWelcome, doneWelcome };
}
