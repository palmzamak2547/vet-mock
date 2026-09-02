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

// Presence is a message every time: supabase-js sends a `track` on every
// call (there is no client-side "same payload" short-circuit), and Realtime
// caps presence events per client. An exam changes qKey on every question,
// so tracking on each change — with a fresh joined_at that made every payload
// unique — could burst past the cap and get the client rate-limited, at which
// point the buddy list stops updating (production logs, 2026-09-01). Metadata
// updates now coalesce on a short trailing timer, an unchanged payload is not
// re-sent, and joined_at is fixed for the life of the channel.
const RETRACK_DELAY_MS = 1500;

function presencePayload({ user, username, avatar, subject, view, qKey, joinedAt }) {
  return {
    username: username || user?.email?.split('@')[0] || 'guest',
    avatar: avatar || '🐾',
    subject: subject || null,
    view: view || 'home',
    qKey: qKey || null,
    joined_at: joinedAt,
  };
}

export function useStudyBuddies({ user, profile, subject, view, qKey }) {
  const [buddies, setBuddies] = useState({});
  const channelRef = useRef(null);
  const joinedAtRef = useRef(0);
  const lastSentRef = useRef('');
  const retrackTimerRef = useRef(null);
  // Latest inputs, readable from timers and listeners without re-binding
  // them. Only the fields the panel shows take part — the profile object's
  // identity is irrelevant.
  const latestRef = useRef({});
  const username = profile?.username || null;
  const avatar = profile?.avatar_emoji || null;
  latestRef.current = { user, username, avatar, subject, view, qKey };

  // Send the current presence payload. `force` re-announces even when the
  // payload is unchanged (after the socket was killed in the background).
  const sendPresence = (force = false) => {
    const ch = channelRef.current;
    if (!ch || !latestRef.current.user) return;
    const payload = presencePayload({ ...latestRef.current, joinedAt: joinedAtRef.current });
    const key = JSON.stringify(payload);
    if (!force && key === lastSentRef.current) return;
    lastSentRef.current = key;
    try { ch.track(payload); } catch {}
  };

  useEffect(() => {
    if (!hasSupabase || !user) {
      setBuddies({});
      return;
    }
    let cancelled = false;
    let channel = null;
    joinedAtRef.current = Date.now();
    lastSentRef.current = '';
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
      channelRef.current = channel;
      await channel.subscribe((status) => {
        if (status === 'SUBSCRIBED' && !cancelled) sendPresence(true);
      });
    };
    start();
    return () => {
      cancelled = true;
      clearTimeout(retrackTimerRef.current);
      retrackTimerRef.current = null;
      channelRef.current = null;
      lastSentRef.current = '';
      if (channel) {
        try { channel.untrack?.(); } catch {}
        try { channel.unsubscribe?.(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Metadata changes (a new question, a new view) coalesce on a short
  // trailing timer, so a fast run through an exam sends one update when the
  // student pauses, not one per question.
  useEffect(() => {
    if (!user) return undefined;
    clearTimeout(retrackTimerRef.current);
    retrackTimerRef.current = setTimeout(() => {
      retrackTimerRef.current = null;
      sendPresence(false);
    }, RETRACK_DELAY_MS);
    return () => clearTimeout(retrackTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, username, avatar, subject, view, qKey]);

  // iOS Safari (and aggressive battery managers on Android) kill background
  // WebSocket connections. When the tab returns to the foreground our
  // presence is gone server-side, so re-announce even if nothing about us
  // changed; Supabase's auto-reconnect handles incoming events.
  useEffect(() => {
    if (!user) return undefined;
    const onVis = () => {
      if (document.visibilityState !== 'visible') return;
      sendPresence(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
