// ============================================================
// video-library.js — the lecture videos the library keeps (docs/VIDEO-LIBRARY.md)
// ============================================================
// Cards (summary, chapters, index) are one lazy chunk per video; the
// registry and the topic index are lazy too. The copy, its transcript and
// slides are private: /api/video-file hands them to a signed-in student.
// Where the student stopped and what they have watched live on this device.
import { VIDEO_CARD_LOADERS } from '../data/video-cards.generated.js';
import { hasStoredAuthToken } from './auth-storage.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export const hasVideoCard = (id) => has(VIDEO_CARD_LOADERS, id);

/** "1:05:09" / "4:07" */
export function clock(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

// A failed import is forgotten, so the next tap after the connection comes back asks again.
function cached(map, key, load) {
  if (!map.has(key)) {
    const p = load();
    map.set(key, p);
    p.catch(() => { if (map.get(key) === p) map.delete(key); });
  }
  return map.get(key);
}
const cards = new Map();
export function loadVideoCard(id) {
  if (!hasVideoCard(id)) return Promise.resolve(null);
  return cached(cards, id, () => VIDEO_CARD_LOADERS[id]().then((m) => m.default));
}
const lazy = new Map();
export const loadVideoRegistry = () => cached(lazy, 'registry', () => import('../data/video-registry.generated.js').then((m) => m.VIDEO_REGISTRY));
export const loadVideoTopicIndex = () => cached(lazy, 'topics', () => import('../data/video-topic-index.generated.js').then((m) => m.VIDEO_TOPIC_INDEX));

/** The stretches of video that teach a topic, surest first; [] when none. */
/**
 * One row per clip, as the topic's "คลิป N" counts them (the audit of 2 Nov: it
 * said 1 and opened 3): the clip's surest stretch, with how many stretches it
 * has and their seconds in all. The index lists the surest stretch first.
 */
export function clipRows(stretches) {
  const rows = new Map();
  for (const c of stretches) {
    const row = rows.get(c.v);
    if (row) { row.n += 1; row.sec += c.e - c.s; } else rows.set(c.v, { ...c, n: 1, sec: c.e - c.s });
  }
  return [...rows.values()];
}

export async function topicClips(topicId) {
  const [index, registry] = await Promise.all([loadVideoTopicIndex(), loadVideoRegistry()]);
  return clipRows((index[topicId] || []).filter((c) => registry[c.v])).map((c) => ({ ...c, video: registry[c.v] }));
}

/** The signed-in student's token, or null; the Supabase SDK loads only when a session is stored. */
export async function videoAccessToken() {
  if (!hasStoredAuthToken()) return null;
  try {
    const { getSupabase } = await import('./supabase.js');
    const sb = await getSupabase();
    const { data: { session } = {} } = await sb.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * The copy, its slides or its transcript: { status: 'ok', data } |
 * { status: 'login' } | { status: 'offline' } | { status: 'error', code }.
 */
export async function fetchVideoAsset(id, kind) {
  const token = await videoAccessToken();
  if (!token) return { status: 'login' };
  try {
    const res = await fetch(`/api/video-file?v=${encodeURIComponent(id)}&f=${kind}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) return { status: 'login' };
    // The service worker answers an offline /api call with a 503 of its own.
    if (res.status === 503 && typeof navigator !== 'undefined' && navigator.onLine === false) return { status: 'offline' };
    if (!res.ok) return { status: 'error', code: res.status };
    return { status: 'ok', data: await res.json() };
  } catch {
    return { status: typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'error', code: 0 };
  }
}

// Where the student stopped, and which stretches they have watched, on this device.
const BUCKET = 30; // seconds per watched mark
const store = {
  get(k) { try { return globalThis.localStorage?.getItem(k) ?? null; } catch { return null; } },
  set(k, v) { try { globalThis.localStorage?.setItem(k, v); } catch { /* private mode: nothing kept */ } },
};
export function readPosition(id) {
  const n = Number(store.get(`vmx-clip-pos:${id}`));
  return Number.isFinite(n) && n > 0 ? n : 0;
}
export const savePosition = (id, t) => store.set(`vmx-clip-pos:${id}`, String(Math.floor(t)));
/** Whether the player jumps the stretches that teach nothing: on unless the student turned it off. */
export const readSkip = () => store.get('vmx-clip-skip') !== '0';
export const saveSkip = (on) => store.set('vmx-clip-skip', on ? '1' : '0');
export function readSeen(id) {
  return store.get(`vmx-clip-seen:${id}`) || '';
}
/** Mark the stretch around `t` watched; returns the new marks. */
export function markSeen(id, t, seen = readSeen(id)) {
  const i = Math.floor(t / BUCKET);
  if (seen[i] === '1') return seen;
  const next = seen.padEnd(i + 1, '0').split('');
  next[i] = '1';
  const out = next.join('');
  store.set(`vmx-clip-seen:${id}`, out);
  return out;
}
/** Share (0-1) of [start, end) watched. */
export function seenShare(seen, start, end) {
  const a = Math.floor(start / BUCKET);
  const b = Math.max(a + 1, Math.ceil(end / BUCKET));
  let n = 0;
  for (let i = a; i < b; i++) if (seen[i] === '1') n += 1;
  return n / (b - a);
}
