// ============================================================
// useStudyBuddies — who else is online + what they're studying
// ============================================================
// Adds a richer presence channel on top of useOnlineCount: each
// participant tracks { subject, view, qKey } so the HomeView panel can
// render "5 คนกำลังเรียน COM V อยู่" links. A phone never sends a name:
// names come from the server's profile of each account (buddy_profiles,
// migration 20261115120300), and a student who turned the leaderboard off
// is not published (the channel is joined to listen only).
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

// Names, by presence key, as the server's profiles give them. Whatever name
// or emoji a payload carries is never read: anyone signed in can put any
// text in their own presence, so a name from there could be anyone's.
// A key the server does not name (hidden, or no profile) stays nameless.
const NAME_TTL_MS = 10 * 60 * 1000;
let names = new Map(); // key -> { username, avatar, at }
let namesUnavailable = false; // buddy_profiles is not on this database yet
const asking = new Set();

function publishPresence(next) {
  presence = next;
  // The panel prints a name, an avatar and a subject per student, so its
  // map keeps its identity until one of those, or who is online, changes.
  // A new question or view is most of the traffic and changes none of them.
  const fields = {};
  for (const [k, b] of Object.entries(next)) {
    const named = names.get(k);
    fields[k] = { username: named?.username ?? null, avatar: named?.avatar ?? null, subject: b?.subject ?? null };
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

// 'vet-mock-buddies' is a private Realtime channel: the server checks the
// RLS policies on realtime.messages (migration
// 20261011120500_study_buddies_private_channel) with the student's JWT when
// the channel is joined, so only a signed-in account can read or publish
// presence here. A public join of the same name lands on a separate topic
// and sees none of it. Every signed-in classmate still reads what is
// published, so the payload carries no auth id (the presence key is a digest
// of it, see presenceKeyFor) and no name or avatar at all. A student who
// turned the leaderboard off is not published at all: no entry, not in
// "N คนกำลังทำข้อนี้", no key a classmate could match to them. They still
// see who else is reading (the channel is joined to listen). The server's
// name lookup also leaves out anyone who turned off the leaderboard.
const SHOWN_VALUES = new Set(['true', 't', 'yes', 'y', 'on', '1']);
function showsOnLeaderboard(user) {
  const flag = user?.user_metadata?.show_on_leaderboard;
  if (flag === undefined || flag === null) return true;
  return SHOWN_VALUES.has(String(flag).trim().toLowerCase());
}

// SHA-256, synchronous, for the presence key below (the browser's own digest
// is asynchronous, and joining the channel should take no longer than it did).
function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const bits = bytes.length * 8;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bits / 0x100000000));
  view.setUint32(padded.length - 4, bits >>> 0);
  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

// A 64-bit digest of the id: the same in every tab of one account (so two
// tabs stay one person) and far too short to carry the 122 random bits of the
// id itself. The server computes the same digest to find the profile behind a
// key (buddy_profiles): 'b-' and the first 16 hex digits of
// sha256('vet-mock-buddies:' || id).
export function presenceKeyFor(userId) {
  return `b-${sha256Hex(`vet-mock-buddies:${userId}`).slice(0, 16)}`;
}

function presencePayload({ subject, view, qKey, joinedAt }) {
  return {
    subject: subject || null,
    view: view || 'home',
    qKey: qKey || null,
    joined_at: joinedAt,
  };
}

// Asks the server for the names behind keys it has not named yet (or named
// over ten minutes ago), then redraws the panel. A database without
// buddy_profiles answers with an error once, and the panel then shows
// counts without names for the rest of the page's life.
async function resolveNames(supabase, keys) {
  if (namesUnavailable || typeof supabase?.rpc !== 'function') return;
  const now = Date.now();
  const wanted = keys.filter((k) => !asking.has(k) && !(names.has(k) && now - names.get(k).at < NAME_TTL_MS)).slice(0, 200);
  if (!wanted.length) return;
  for (const k of wanted) asking.add(k);
  try {
    const { data, error, status } = await supabase.rpc('buddy_profiles', { p_keys: wanted });
    // Only a database without the function stops asking; a dropped request
    // or an expired token (handed back as an error value, not thrown) is
    // asked again on the next sync.
    if (error) { if (status === 404 || error.code === 'PGRST202') namesUnavailable = true; return; }
    const next = new Map(names);
    for (const k of wanted) next.set(k, { username: null, avatar: null, at: now });
    for (const row of Array.isArray(data) ? data : []) {
      if (typeof row?.key === 'string' && wanted.includes(row.key)) {
        next.set(row.key, { username: row.username || null, avatar: row.avatar_emoji || null, at: now });
      }
    }
    names = next;
    publishPresence(presence);
  } catch {
    // A dropped request names nobody now; the next sync asks again.
  } finally {
    for (const k of wanted) asking.delete(k);
  }
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
  // The payload carries neither of these; they are kept so an edited profile
  // re-runs the update effect, which sends nothing when the payload is the same.
  const username = profile?.username || null;
  const avatar = profile?.avatar_emoji || null;
  latestRef.current = { user, username, avatar, subject, view, qKey };
  // Turning the board off takes this student off the presence list at once.
  const shown = showsOnLeaderboard(user);

  // Send the current presence payload. `force` re-announces even when the
  // payload is unchanged (after the socket was killed in the background).
  const sendPresence = (force = false) => {
    const ch = channelRef.current;
    if (!ch || !latestRef.current.user) return;
    if (!showsOnLeaderboard(latestRef.current.user)) {
      // Hidden by choice: leave the presence list if this tab was on it.
      if (lastSentRef.current) { try { ch.untrack?.(); } catch {} }
      lastSentRef.current = '';
      return;
    }
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
      // A private channel is authorised with the token the socket holds when
      // the join frame is built, so the session JWT is put there first.
      // Without a session the join is refused and the list stays empty.
      try { await supabase.realtime?.setAuth?.(); } catch {}
      if (cancelled) return;
      channel = supabase.channel(CHANNEL_NAME, {
        config: { private: true, presence: { key: selfKey } },
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
        resolveNames(supabase, Object.keys(state).filter((k) => k !== selfKey));
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
  }, [user?.id, username, avatar, subject, view, qKey, shown]);

  // The choice made in another tab reaches this one through the stored
  // session (auth-js writes it on every update): hidden there, gone here.
  useEffect(() => {
    if (!user || typeof window.addEventListener !== 'function') return undefined;
    const onStorage = (event) => {
      if (!event?.key || !/^sb-.*-auth-token$/.test(event.key) || !event.newValue) return;
      let stored = null;
      try { stored = JSON.parse(event.newValue)?.user || null; } catch { stored = null; }
      if (!stored || stored.id !== latestRef.current.user?.id) return;
      latestRef.current = { ...latestRef.current, user: stored };
      sendPresence(true);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
