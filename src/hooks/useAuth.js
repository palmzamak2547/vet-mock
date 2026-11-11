import { useState, useEffect, useRef, useCallback } from 'react';
import { hasSupabase, hasSavedSession, hasAuthRedirectInUrl, getSupabase, storedAuthSession, restoreSignInDestination } from '../lib/supabase.js';

// useAuth() — returns { user, profile, setProfile, loading, isSignedIn }.
//
// Loading strategy (keeps the 190KB Supabase SDK lazy):
//   • If env doesn't have Supabase keys     → never load SDK
//   • If a session token exists in storage  → eagerly load SDK + hydrate
//   • If no saved session                   → wait for `vmx-auth-changed`
//     dispatched by signin/signup helpers in lib/supabase.js, then load
//     and subscribe to onAuthStateChange.
//
// Previously the no-session branch returned early and never subscribed,
// so successful signin via the helpers never propagated to React state —
// the user appeared signed-out until they reloaded the page.
//
// Profile fetch retries with backoff because the auth.users → profiles
// trigger may not have committed yet at the moment we query (race
// against Supabase's internal SECURITY DEFINER trigger).
//
// auth-js emits SIGNED_IN every time the tab becomes visible, and
// INITIAL_SESSION on subscribe, each with a freshly parsed copy of the same
// user. Storing that copy re-rendered the whole app, refetched the profile and
// threw away the library catalogue on every switch back from LINE or a PDF.
// So an unchanged user keeps its object, the profile follows the id, and the
// library hears about an auth change only when the id itself changes — which
// is exactly when its row access changes (anon sees public, any signed-in
// account sees public + restricted).

// Structural equality for the plain JSON user object auth-js hands out.
function sameAuthUser(a, b) {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => Object.prototype.hasOwnProperty.call(b, k) && sameAuthUser(a[k], b[k]));
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Bumped on USER_UPDATED so the profile is re-read for the same account.
  const [profileRefresh, setProfileRefresh] = useState(0);
  // The account id the app last settled on; undefined until a saved session's
  // first hydrate, which must not reset a catalogue that was already fetched
  // with that session. A guest boot sets it to null below.
  const userIdRef = useRef(undefined);
  // Treat a URL-borne auth redirect (magic link / OAuth / recovery) as
  // "we're loading auth" so the UI doesn't briefly render the signed-out
  // state before SDK parses the URL hash.
  const [loading, setLoading] = useState(hasSupabase && (hasSavedSession() || hasAuthRedirectInUrl()));
  const subscribed = useRef(false);
  const subscriptionRef = useRef(null);
  // Guard against parallel setupSDK calls — multiple vmx-auth-changed
  // events fired in quick succession (e.g. signup → fallback signin
  // both notify) would otherwise each kick off a getSession() round-trip.
  const setupRunning = useRef(false);

  const commitUser = useCallback((next) => {
    const nextUser = next ?? null;
    const prevId = userIdRef.current;
    const nextId = nextUser?.id ?? null;
    userIdRef.current = nextId;
    setUser((prev) => (sameAuthUser(prev, nextUser) ? prev : nextUser));
    if (prevId !== nextId) {
      // Keep the catalogue module lazy. Its access record and live worker
      // registration follow an explicit auth result, never another tab's token.
      import('../lib/library.js').then(({ setLibraryAccess }) => {
        if (userIdRef.current === nextId) return setLibraryAccess(nextId !== null, { initial: prevId === undefined });
      }).catch(() => {});
    }
    if (prevId !== undefined && prevId !== nextId) {
      window.dispatchEvent(new CustomEvent('vmx-library-auth-changed', { detail: { signedIn: nextId !== null } }));
    }
  }, []);

  // Load SDK + hydrate session + (idempotently) attach onAuthStateChange
  const setupSDK = useCallback(async (cancelledRef) => {
    if (!hasSupabase) return;
    if (setupRunning.current) return;
    setupRunning.current = true;
    // Show loading state while SDK fetches the session — covers the
    // ~50-300ms gap between vmx-auth-changed firing (Path B) and user
    // being populated. Without this, App.jsx renders briefly with
    // user=null after a successful Google GIS sign-in, flashing the
    // "logged out" UI before the user state hydrates. Path A already
    // bootstrapped loading=true via useState init, so this is mostly
    // for Path B; idempotent for both paths.
    setLoading(true);
    // Open the account this device holds at once, without waiting for the SDK chunk:
    // Home and the Chula wall need not sit behind its load (~80 ms of evaluation on
    // a mid phone before any network). getSession below answers from the same
    // storage, or replaces it after a refresh. An expired token offline matters most:
    // the SDK then answers "no session" only after ~25 s of retries while the session
    // is still on the device, and the student keeps their own progress meanwhile.
    // Not on a sign-in redirect: the account arriving in the address replaces the
    // one on the device, which must not paint first.
    const held = storedAuthSession();
    const arriving = hasAuthRedirectInUrl();
    if (held && !arriving) {
      commitUser(held.user);
      setLoading(false);
    }
    try {
      const supabase = await getSupabase();
      if (cancelledRef.current) return;
      // No SDK (not configured, or the chunk failed to load): the app is
      // perfectly usable signed-out, so stop blocking the boot gate on it.
      if (!supabase) { setLoading(false); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelledRef.current) return;
      // Back from a redirect sign-in: the SDK has taken its tokens out of the address, so the
      // section the student was going to can go back in before the page behind the wall mounts.
      // Never allowed to stand in the sign-in's way: a failure here only loses the section.
      if (arriving && session) { try { restoreSignInDestination(); } catch { /* the page opens at its top */ } }
      // No session but the token still on the device: the refresh could not run
      // (the SDK clears the token itself when the server refuses it). Keep the
      // account until it can.
      const keep = !session && held && storedAuthSession()?.user?.id === held.user.id;
      commitUser(session?.user ?? (keep ? held.user : null));
      setLoading(false);

      if (!subscribed.current) {
        const { data } = supabase.auth.onAuthStateChange((event, s) => {
          // INITIAL_SESSION arrives null when an expired token could not be
          // refreshed (auth-js keeps the token on a network failure): the account
          // it holds stays. Only SIGNED_OUT, or a token gone from storage, ends it.
          commitUser(s?.user ?? (event === 'SIGNED_OUT' ? null : storedAuthSession()?.user ?? null));
          if (event === 'USER_UPDATED') setProfileRefresh((n) => n + 1);
        });
        subscriptionRef.current = data.subscription;
        subscribed.current = true;
      }
    } catch {
      // A rejected SDK load (offline, failed chunk fetch mid-deploy) used to
      // fall straight through `finally` with loading still true, wedging the
      // whole app on the boot spinner forever. Signed-out is a valid state —
      // let the user in, keeping the account this device holds.
      if (!cancelledRef.current) { commitUser(held?.user ?? null); setLoading(false); }
    } finally {
      setupRunning.current = false;
    }
  }, [commitUser]);

  useEffect(() => {
    if (!hasSupabase) return;

    const cancelledRef = { current: false };

    // Path A: saved session at boot → eagerly hydrate
    // Path A2: URL contains auth redirect tokens (magic link / OAuth /
    // recovery) — eagerly load SDK so detectSessionInUrl can parse the
    // hash and create a session. Without this branch, users coming back
    // from a magic-link email see "not signed in" until they manually
    // refresh — and refresh doesn't help because the hash is gone.
    if (hasSavedSession() || hasAuthRedirectInUrl()) {
      setupSDK(cancelledRef);
    } else if (userIdRef.current === undefined) {
      // Boot found no session, so this visitor starts as a guest and anything
      // cached so far holds public rows only: their first sign-in is a real
      // change of access and must reach the library.
      commitUser(null);
    }

    // Path B: no saved session → wait for signin helpers to fire the
    // event after a successful auth. This is what fixes the "have to
    // refresh page after login" bug.
    const onAuthChanged = () => setupSDK(cancelledRef);
    window.addEventListener('vmx-auth-changed', onAuthChanged);

    return () => {
      cancelledRef.current = true;
      window.removeEventListener('vmx-auth-changed', onAuthChanged);
      if (subscriptionRef.current) {
        try { subscriptionRef.current.unsubscribe(); } catch {}
      }
    };
  }, [setupSDK]);

  // Fetch profile when the account changes — with retry to dodge the race vs
  // the handle_new_user trigger right after signup. Most profiles are
  // ready inside 100-300ms in practice, so the retry schedule is
  // front-loaded: 0 → 100 → 300 → 800ms, total ≤1.2s before falling
  // back to a synthesized local profile (was 3.75s before).
  //
  // A read that failed (offline, a dropped request, the SDK chunk not loading)
  // is no answer about the row; postgrest-js reports it as an error beside
  // data: null, not as a throw. The stand-in then holds only until the device
  // is back online or the tab is looked at again, and the row is read again
  // then: nothing else would, since a token refresh or a tab return keeps the user.
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) { setProfile(null); return; }
    let cancelled = false;
    let attempt = 0;
    let stopWaiting = null;
    const DELAYS_MS = [0, 100, 300, 800];
    const MAX_ATTEMPTS = DELAYS_MS.length;

    const readAgainLater = () => {
      const again = () => {
        if (document.visibilityState === 'hidden') return;
        stopWaiting();
        load();
      };
      window.addEventListener('online', again);
      document.addEventListener('visibilitychange', again);
      stopWaiting = () => {
        stopWaiting = null;
        window.removeEventListener('online', again);
        document.removeEventListener('visibilitychange', again);
      };
    };

    const load = async () => {
      attempt = 0;
      let unreachable = false;
      while (!cancelled && attempt < MAX_ATTEMPTS) {
        if (DELAYS_MS[attempt]) await new Promise((r) => setTimeout(r, DELAYS_MS[attempt]));
        if (cancelled) return;

        let data = null;
        try {
          const supabase = await getSupabase();
          if (cancelled || !supabase) return;
          const result = await supabase
            .from('profiles')
            // profiles is a public directory, while legacy study-metric
            // columns are private. Keep this explicit so column grants can
            // enforce the boundary without breaking profile hydration.
            .select('id, username, avatar_emoji, created_at')
            .eq('id', userId)
            .maybeSingle();
          data = result.data;
          unreachable = Boolean(result.error);
        } catch {
          unreachable = true;
        }
        if (cancelled) return;

        if (data) { setProfile(data); return; }
        attempt++;
      }
      // Reached max attempts → synthesize local profile so the UI
      // never gets stuck on "logged in but no name" forever. A profile
      // already shown for this account stays.
      if (!cancelled) {
        setProfile((prev) => (prev?.id === userId ? prev : {
          id: userId,
          // Never the email local-part: for @student.chula.ac.th accounts that
          // is the 10-digit student id, and this name is broadcast to peers.
          username: 'นิสิต',
          avatar_emoji: '🐾',
        }));
        if (unreachable) readAgainLater();
      }
    };
    load();

    return () => { cancelled = true; stopWaiting?.(); };
  }, [userId, profileRefresh]);

  return { user, profile, setProfile, loading, isSignedIn: !!user };
}
