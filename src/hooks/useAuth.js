import { useState, useEffect, useRef, useCallback } from 'react';
import { hasSupabase, hasSavedSession, hasAuthRedirectInUrl, getSupabase } from '../lib/supabase.js';

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
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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
    try {
      const supabase = await getSupabase();
      if (cancelledRef.current) return;
      // No SDK (not configured, or the chunk failed to load): the app is
      // perfectly usable signed-out, so stop blocking the boot gate on it.
      if (!supabase) { setLoading(false); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelledRef.current) return;
      setUser(session?.user ?? null);
      setLoading(false);

      if (!subscribed.current) {
        const { data } = supabase.auth.onAuthStateChange((_event, s) => {
          setUser(s?.user ?? null);
          if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
            window.dispatchEvent(new Event('vmx-library-auth-changed'));
          }
        });
        subscriptionRef.current = data.subscription;
        subscribed.current = true;
      }
    } catch {
      // A rejected SDK load (offline, failed chunk fetch mid-deploy) used to
      // fall straight through `finally` with loading still true, wedging the
      // whole app on the boot spinner forever. Signed-out is a valid state —
      // let the user in.
      if (!cancelledRef.current) { setUser(null); setLoading(false); }
    } finally {
      setupRunning.current = false;
    }
  }, []);

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

  // Fetch profile when user changes — with retry to dodge the race vs
  // the handle_new_user trigger right after signup. Most profiles are
  // ready inside 100-300ms in practice, so the retry schedule is
  // front-loaded: 0 → 100 → 300 → 800ms, total ≤1.2s before falling
  // back to a synthesized local profile (was 3.75s before).
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    let cancelled = false;
    let attempt = 0;
    const DELAYS_MS = [0, 100, 300, 800];
    const MAX_ATTEMPTS = DELAYS_MS.length;

    (async () => {
      while (!cancelled && attempt < MAX_ATTEMPTS) {
        if (DELAYS_MS[attempt]) await new Promise((r) => setTimeout(r, DELAYS_MS[attempt]));
        if (cancelled) return;

        const supabase = await getSupabase();
        if (cancelled || !supabase) return;
        const { data } = await supabase
          .from('profiles')
          // profiles is a public directory, while legacy study-metric
          // columns are private. Keep this explicit so column grants can
          // enforce the boundary without breaking profile hydration.
          .select('id, username, avatar_emoji, created_at')
          .eq('id', user.id)
          .maybeSingle();
        if (cancelled) return;

        if (data) { setProfile(data); return; }
        attempt++;
      }
      // Reached max attempts → synthesize local profile so the UI
      // never gets stuck on "logged in but no name" forever.
      if (!cancelled) {
        setProfile({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          avatar_emoji: '🐾',
        });
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { user, profile, setProfile, loading, isSignedIn: !!user };
}
