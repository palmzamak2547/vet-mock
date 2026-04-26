import { useState, useEffect } from 'react';
import { hasSupabase, hasSavedSession, getSupabase } from '../lib/supabase.js';

// useAuth() — returns { user, profile, loading, isSignedIn }.
//
// Loading strategy:
//   • If env doesn't have Supabase keys     → skip SDK entirely, loading=false
//   • If no saved session in localStorage   → skip SDK at boot, loading=false
//     (SDK will load on first explicit Login click via signIn helpers)
//   • If a session token exists             → dynamic-import SDK, hydrate user
//
// The first two branches together let anonymous visitors avoid a 190KB
// SDK download on cold visits.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // Only show "loading" if we actually plan to fetch a session
  const [loading, setLoading] = useState(hasSupabase && hasSavedSession());

  useEffect(() => {
    if (!hasSupabase) return;
    if (!hasSavedSession()) return; // no session → SDK stays unloaded

    let cancelled = false;
    let unsub = null;

    (async () => {
      const supabase = await getSupabase();
      if (cancelled || !supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setUser(session?.user ?? null);
      setLoading(false);

      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setUser(s?.user ?? null);
      });
      unsub = data.subscription;
    })();

    return () => {
      cancelled = true;
      if (unsub) unsub.unsubscribe();
    };
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    let cancelled = false;
    (async () => {
      const supabase = await getSupabase();
      if (cancelled || !supabase) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!cancelled) setProfile(data);
    })();
    return () => { cancelled = true; };
  }, [user]);

  return { user, profile, setProfile, loading, isSignedIn: !!user };
}
