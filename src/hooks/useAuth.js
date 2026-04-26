import { useState, useEffect, useRef, useCallback } from 'react';
import { hasSupabase, hasSavedSession, getSupabase } from '../lib/supabase.js';

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
  const [loading, setLoading] = useState(hasSupabase && hasSavedSession());
  const subscribed = useRef(false);
  const subscriptionRef = useRef(null);

  // Load SDK + hydrate session + (idempotently) attach onAuthStateChange
  const setupSDK = useCallback(async (cancelledRef) => {
    if (!hasSupabase) return;
    const supabase = await getSupabase();
    if (cancelledRef.current || !supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (cancelledRef.current) return;
    setUser(session?.user ?? null);
    setLoading(false);

    if (!subscribed.current) {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setUser(s?.user ?? null);
      });
      subscriptionRef.current = data.subscription;
      subscribed.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasSupabase) return;

    const cancelledRef = { current: false };

    // Path A: saved session at boot → eagerly hydrate
    if (hasSavedSession()) {
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
  // the handle_new_user trigger right after signup.
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    let cancelled = false;
    let attempt = 0;
    const MAX_ATTEMPTS = 5;
    const DELAYS_MS = [0, 250, 500, 1000, 2000]; // total ~3.75s worst case

    (async () => {
      while (!cancelled && attempt < MAX_ATTEMPTS) {
        if (DELAYS_MS[attempt]) await new Promise((r) => setTimeout(r, DELAYS_MS[attempt]));
        if (cancelled) return;

        const supabase = await getSupabase();
        if (cancelled || !supabase) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (cancelled) return;

        if (data) { setProfile(data); return; }
        // No row yet (trigger pending) or transient error → retry
        attempt++;
        if (attempt >= MAX_ATTEMPTS && !error) {
          // Final fallback: synthesize a minimal local profile so the UI
          // doesn't appear as "logged in but no name" forever.
          setProfile({
            id: user.id,
            username: user.email?.split('@')[0] || 'user',
            avatar_emoji: '🐾',
          });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { user, profile, setProfile, loading, isSignedIn: !!user };
}
