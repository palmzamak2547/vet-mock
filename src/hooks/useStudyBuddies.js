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

export function useStudyBuddies({ user, profile, subject, view, qKey }) {
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
            qKey: qKey || null,
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

  // Update presence metadata when user navigates to a new subject/view/Q.
  // qKey changes most often (each Q in an exam) — debounced via the
  // natural React batching since the underlying channel.track call is
  // a no-op-on-no-change inside the SDK.
  useEffect(() => {
    const ch = channelRef.current;
    if (!ch || !user) return;
    try {
      ch.track({
        username: profile?.username || user.email?.split('@')[0] || 'guest',
        avatar: profile?.avatar_emoji || '🐾',
        subject: subject || null,
        view: view || 'home',
        qKey: qKey || null,
        joined_at: Date.now(),
      });
    } catch {}
  }, [subject, view, qKey, user, profile]);

  return buddies;
}

// Helper: count buddies currently on the same question (excluding self).
export function countBuddiesOnQ(buddies, qKey, selfUserId) {
  if (!buddies || !qKey) return 0;
  let n = 0;
  for (const [k, b] of Object.entries(buddies)) {
    if (k === selfUserId) continue;
    if (b?.qKey === qKey) n++;
  }
  return n;
}
