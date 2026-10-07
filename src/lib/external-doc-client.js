// ============================================================
// external-doc-client.js — the reader's client half
// ============================================================
// Calls /api/fetch-external-doc (server-side fetch + convert) and maps
// every failure the route can answer into one Thai sentence the view can
// show as-is. A signed-in student who has connected their own Notion /
// Google account sends their Supabase JWT along, so the server can read
// PRIVATE documents through that connection — the OAuth tokens themselves
// never leave the server. Also owns the reader's "เปิดล่าสุด" list —
// client-only on purpose: a list of pasted links is the visitor's own
// browsing history, not study data, so it stays in localStorage like the
// library's recents (src/lib/library.js) instead of joining the synced
// user-data fields.
// ============================================================

import { getSupabase } from './supabase.js';

const RECENT_KEY = 'vmx-external-docs-v1';
const RECENT_MAX = 8;

export const PROVIDER_LABELS = { notion: 'Notion', gdocs: 'Google Docs', gsheets: 'Google Sheets' };
export const CONNECT_PROVIDER_LABELS = { google: 'Google', notion: 'Notion' };

const ERROR_MESSAGES = {
  unsupported_link: 'ยังไม่รองรับลิงก์นี้ ใช้ได้กับลิงก์เอกสารหรือชีตของ Google และหน้าของ Notion',
  not_public: 'เปิดลิงก์นี้ไม่ได้ เพราะเอกสารยังไม่ได้แชร์แบบสาธารณะ ลองเปลี่ยนการแชร์เป็นแบบทุกคนที่มีลิงก์ก่อน',
  not_configured: 'ยังไม่เปิดใช้ Notion ในระบบ ส่วนเอกสารและชีตของ Google ยังใช้ได้ตามปกติ',
  too_large: 'เอกสารนี้ยาวเกินที่หน้าอ่านรองรับ',
  rate_limited: 'พยายามหลายครั้งเกินไป พักสักครู่แล้วลองใหม่',
  temporarily_unavailable: 'ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง',
  timeout: 'หมดเวลาเชื่อมต่อ ลองใหม่อีกครั้ง',
  offline: 'ออฟไลน์อยู่ เปิดเอกสารภายนอกไม่ได้ตอนนี้',
  default: 'เปิดเอกสารไม่สำเร็จ ลองใหม่อีกครั้ง',
};

export function messageFor(reason) {
  return ERROR_MESSAGES[reason] || ERROR_MESSAGES.default;
}

const CONNECT_MESSAGES = {
  login_required: 'เข้าสู่ระบบก่อนจึงจะเชื่อมบัญชีได้',
  not_configured: 'ยังไม่เปิดใช้การเชื่อมต่อผู้ให้บริการนี้',
  unsupported_provider: 'ยังไม่รองรับผู้ให้บริการนี้',
  storage: 'ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง',
  unknown_action: 'คำสั่งไม่ถูกต้อง ลองใหม่อีกครั้ง',
  state: 'หมดเวลายืนยัน ลองกดเชื่อมต่อใหม่อีกครั้ง',
  exchange: 'เชื่อมต่อกับผู้ให้บริการไม่สำเร็จ ลองใหม่อีกครั้ง',
  code: 'การเชื่อมต่อไม่สมบูรณ์ ลองกดเชื่อมต่อใหม่อีกครั้ง',
  store: 'บันทึกการเชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง',
  unexpected: 'เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง',
  default: 'เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง',
};

export function connectMessageFor(reason) {
  return CONNECT_MESSAGES[reason] || CONNECT_MESSAGES.default;
}

/** The signed-in student's Supabase access token, or null. */
async function accessToken() {
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch {
    return null;
  }
}

/** POST one link to the reader endpoint. Never throws — answers { ok, doc } or { ok:false, error, reason }. */
export async function fetchExternalDoc(url, { signal } = {}) {
  try {
    const token = await accessToken();
    const res = await fetch('/api/fetch-external-doc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ url }),
      signal,
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data && typeof data.markdown === 'string') {
      return { ok: true, doc: data };
    }
    return { ok: false, error: messageFor(data?.reason), reason: data?.reason };
  } catch (err) {
    if (err?.name === 'AbortError') return { ok: false, error: messageFor('timeout'), reason: 'timeout', aborted: true };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { ok: false, error: messageFor('offline'), reason: 'offline' };
    }
    return { ok: false, error: messageFor(), reason: 'unexpected' };
  }
}

/** Begin the OAuth consent flow for one provider — the view navigates to `url`. */
export async function startExternalConnection(provider) {
  try {
    const token = await accessToken();
    if (!token) return { ok: false, error: connectMessageFor('login_required'), reason: 'login_required' };
    const res = await fetch(`/api/external-connect/start?provider=${encodeURIComponent(provider)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.url) return { ok: true, url: data.url };
    return { ok: false, error: connectMessageFor(data?.reason), reason: data?.reason };
  } catch {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { ok: false, error: connectMessageFor('unexpected') };
    }
    return { ok: false, error: connectMessageFor() };
  }
}

/** What this account has connected — never carries tokens, only display fields. */
export async function fetchExternalConnections() {
  try {
    const token = await accessToken();
    if (!token) return { ok: true, connections: [] };
    const res = await fetch('/api/external-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'status' }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && Array.isArray(data?.connections)) return { ok: true, connections: data.connections };
    return { ok: false, error: connectMessageFor(data?.reason) };
  } catch {
    return { ok: false, error: connectMessageFor() };
  }
}

/** Revoke one connection — the stored tokens are deleted server-side. */
export async function disconnectExternalConnection(provider) {
  try {
    const token = await accessToken();
    if (!token) return { ok: false, error: connectMessageFor('login_required') };
    const res = await fetch('/api/external-connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'disconnect', provider }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: connectMessageFor(data?.reason) };
  } catch {
    return { ok: false, error: connectMessageFor() };
  }
}

function readRecents() {  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((e) => e && typeof e.url === 'string' && typeof e.provider === 'string')
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

export function loadRecentExternalDocs() {
  if (typeof localStorage === 'undefined') return [];
  return readRecents();
}

/** Most-recent first, deduped by URL, clamped. Write failures stay silent — recents are sugar. */
export function rememberRecentExternalDoc(entry) {
  if (typeof localStorage === 'undefined') return [];
  const next = [{ ...entry, at: Date.now() }, ...readRecents().filter((e) => e.url !== entry.url)]
    .slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* storage full or blocked — the reader works without it */ }
  return next;
}
