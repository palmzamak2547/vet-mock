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

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { getSupabase, hasSupabase } from '../lib/supabase.js';

const CHANNEL_NAME = 'vet-mock-buddies';

// ── The presence store ─────────────────────────────────────────────
// Presence lives here, outside React state. It used to be App state,
// replaced on every Realtime sync of the global channel — and every
// signed-in student is on that channel, re-announcing on each question —
// so the whole app, Home shell and exam screen included, rebuilt from the
// top whenever any classmate moved. Now App only owns the channel, and each
// reader subscribes to the one value it draws: ExamView the count on its
// own question, the Home panel who is online on which subject. A sync that
// leaves that value alone renders nothing.
//
// One store per page: App mounts useStudyBuddies once.
const NO_BUDDIES = Object.freeze({});
let presence = NO_BUDDIES; // user id -> first presence meta, as Realtime sent it
let panel = NO_BUDDIES; // user id -> the fields StudyBuddiesPanel prints
let panelKey = '';
const listeners = new Set();

function publishPresence(next) {
  presence = next;
  // The panel prints a name, an avatar and a subject per student, so its
  // map keeps its identity until one of those, or who is online, changes.
  // A new question or view is most of the traffic and changes none of them.
  const fields = {};
  for (const [k, b] of Object.entries(next)) {
    fields[k] = { username: b?.username ?? null, avatar: b?.avatar ?? null, subject: b?.subject ?? null };
  }
  const key = JSON.stringify(fields);
  if (key !== panelKey) {
    panelKey = key;
    panel = Object.keys(fields).length ? fields : NO_BUDDIES;
  }
  for (const listener of listeners) listener();
}

function subscribePresence(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** How many others are on this question — ExamView's "👥 N คนกำลังทำข้อนี้". */
export function useBuddyCountOnQ(qKey, selfUserId) {
  return useSyncExternalStore(subscribePresence, () => countBuddiesOnQ(presence, qKey, selfUserId));
}

/** Who is online and on which subject, keyed by user id — the Home panel. */
export function useBuddyPanel() {
  return useSyncExternalStore(subscribePresence, () => panel);
}

// Presence is a message every time: supabase-js sends a `track` on every
// call (there is no client-side "same payload" short-circuit), and Realtime
// caps presence events per client. An exam changes qKey on every question,
// so tracking on each change — with a fresh joined_at that made every payload
// unique — could burst past the cap and get the client rate-limited, at which
// point the buddy list stops updating (production logs, 2026-09-01). Metadata
// updates now coalesce on a short trailing timer, an unchanged payload is not
// re-sent, and joined_at is fixed for the life of the channel.
const RETRACK_DELAY_MS = 1500;

// 'vet-mock-buddies' is a public Realtime channel: anyone holding the
// shipped anon key can join it. So it carries no auth id (the presence key
// is a digest of it, see presenceKeyFor), and a student who
// turned the leaderboard off is published without their name or avatar,
// matching how get_leaderboard_by_source reads show_on_leaderboard. Moving
// the channel behind Realtime authorization needs a database change.
const SHOWN_VALUES = new Set(['true', 't', 'yes', 'y', 'on', '1']);
function showsOnLeaderboard(user) {
  const flag = user?.user_metadata?.show_on_leaderboard;
  if (flag === undefined || flag === null) return true;
  return SHOWN_VALUES.has(String(flag).trim().toLowerCase());
}

// A 64-bit digest of the id: the same in every tab of one account (so two
// tabs stay one person) and far too short to carry the 122 random bits of the
// id itself. Synchronous on purpose, so joining the channel takes no longer
// than it did.
export function presenceKeyFor(userId) {
  const text = `vet-mock-buddies:${userId}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `b-${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

function presencePayload({ user, username, avatar, subject, view, qKey, joinedAt }) {
  const shown = showsOnLeaderboard(user);
  return {
    username: (shown && username) || 'นิสิต',
    avatar: (shown && avatar) || '🐾',
    subject: subject || null,
    view: view || 'home',
    qKey: qKey || null,
    joined_at: joinedAt,
  };
}

// Owns the channel and publishes into the store above. Returns nothing:
// the caller (App) must not re-render on presence.
export function useStudyBuddies({ user, profile, subject, view, qKey }) {
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
      publishPresence(NO_BUDDIES);
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
      const selfKey = presenceKeyFor(user.id);
      channel = supabase.channel(CHANNEL_NAME, {
        config: { presence: { key: selfKey } },
      });
      channel.on('presence', { event: 'sync' }, () => {
        if (cancelled || !channel) return;
        const state = channel.presenceState();
        const merged = {};
        for (const k of Object.keys(state)) {
          const meta = state[k]?.[0] || {};
          // Readers exclude "me" by user id; this client is on the channel
          // under its digest, so it is filed under its own id here.
          merged[k === selfKey ? user.id : k] = meta;
        }
        publishPresence(merged);
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
      // The store describes a live channel; a closed one leaves nobody on screen.
      publishPresence(NO_BUDDIES);
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
