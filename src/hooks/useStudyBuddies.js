// ============================================================
// useStudyBuddies — who else is online + what they're studying
// ============================================================
// Adds a richer presence channel on top of useOnlineCount: each
// participant tracks { username, avatar, subject, view } so the
// HomeView panel can render "🐕 5 คนกำลังเรียน COM V อยู่" links.
//
// Uses a separate channel ('vet-mock-buddies') so the original count
// channel stays unchanged. Anonymous users (no Supabase login) DON'T
// join — to keep the buddy list real, not noisy. Falls back to {} when
// Supabase isn't configured.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { getSupabase, hasSupabase } from '../lib/supabase.js';

const CHANNEL_NAME = 'vet-mock-buddies';

export function useStudyBuddies({ user, profile, subject, view }) {
  const [buddies, setBuddies] = useState({});
  const channelRef = useRef(null);

  useEffect(() => {
    if (!hasSupabase || !user) {
      setBuddies({});
      return;
    }
    let cancelled = false;
    let channel = null;
    const start = async () => {
      // Defer to idle so first paint isn't blocked by another WS connect
      await new Promise((res) => (window.requestIdleCallback || ((cb) => setTimeout(cb, 1200)))(res, { timeout: 2500 }));
      if (cancelled) return;
      const supabase = await getSupabase();
      if (!supabase || cancelled) return;
      channel = supabase.channel(CHANNEL_NAME, {
        config: { presence: { key: user.id } },
      });
      channel.on('presence', { event: 'sync' }, () => {
        if (cancelled || !channel) return;
        const state = channel.presenceState();
        const merged = {};
        for (const k of Object.keys(state)) {
          const meta = state[k]?.[0] || {};
          merged[k] = meta;
        }
        setBuddies(merged);
      });
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && !cancelled) {
          await channel.track({
            username: profile?.username || user.email?.split('@')[0] || 'guest',
            avatar: profile?.avatar_emoji || '🐾',
            subject: subject || null,
            view: view || 'home',
            joined_at: Date.now(),
          });
        }
      });
      channelRef.current = channel;
    };
    start();
    return () => {
      cancelled = true;
      if (channel) {
        try { channel.untrack?.(); } catch {}
        try { channel.unsubscribe?.(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Update presence metadata when user navigates to a new subject/view
  useEffect(() => {
    const ch = channelRef.current;
    if (!ch || !user) return;
    try {
      ch.track({
        username: profile?.username || user.email?.split('@')[0] || 'guest',
        avatar: profile?.avatar_emoji || '🐾',
        subject: subject || null,
        view: view || 'home',
        joined_at: Date.now(),
      });
    } catch {}
  }, [subject, view, user, profile]);

  return buddies;
}
