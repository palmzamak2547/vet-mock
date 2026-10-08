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
import { safeLinkUrl } from './safe-url.js';

const RECENT_KEY = 'vmx-external-docs-v2:';
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
  login_required: 'เซสชันเปลี่ยนแล้ว เข้าสู่บัญชีเดิมแล้วลองอีกครั้ง',
  sheet_unavailable: 'ยังเปิดแท็บชีตนี้ไม่ได้ ลองใหม่หรือเปิดต้นฉบับ',
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
  timeout: 'หมดเวลาเชื่อมต่อ ลองใหม่อีกครั้ง',
  offline: 'ออฟไลน์อยู่ ลองอีกครั้งเมื่อเชื่อมต่ออินเทอร์เน็ต',
  rate_limited: 'พยายามหลายครั้งเกินไป พักสักครู่แล้วลองใหม่',
  temporarily_unavailable: 'ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง',
  not_connected: 'ยังไม่ได้เชื่อมบัญชีนี้ หรือการเชื่อมต่อถูกยกเลิกแล้ว',
  token_expired: 'การเชื่อมต่อหมดอายุ ยกเลิกแล้วเชื่อมบัญชีนี้ใหม่',
  default: 'เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง',
};

export function connectMessageFor(reason) {
  return CONNECT_MESSAGES[reason] || CONNECT_MESSAGES.default;
}

/** The signed-in student's Supabase access token, or null. */
async function accessToken(ownerId) {
  if (!ownerId) return null;
  try {
    const supabase = await getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data?.session?.user?.id === ownerId ? data.session.access_token || null : null;
  } catch {
    return null;
  }
}

async function request(path, { ownerId = null, signal, body } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) abort();
  const timer = setTimeout(() => { timedOut = true; abort(); }, 45_000);
  try {
    const pending = (async () => {
      const token = await accessToken(ownerId);
      if (controller.signal.aborted) throw new Error('aborted');
      if (ownerId && !token) return { ok: false, reason: 'login_required' };
      const res = await fetch(path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      return { ok: res.ok, data, reason: data?.reason || data?.error };
    })();
    return await Promise.race([pending, new Promise((_, reject) => {
      if (controller.signal.aborted) reject(new Error('aborted'));
      else controller.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
    })]);
  } catch (err) {
    return { ok: false, reason: timedOut ? 'timeout' : typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'unexpected',
      aborted: !!signal?.aborted };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

/** POST one link; the initiating account supplies the token for the entire request. */
export async function fetchExternalDoc(url, options = {}) {
  const result = await request('/api/fetch-external-doc', { ...options, body: { url } });
  const doc = result.data;
  if (result.ok && typeof doc?.markdown === 'string' && Object.hasOwn(PROVIDER_LABELS, doc.provider)
      && safeLinkUrl(doc.sourceUrl) && (doc.title == null || typeof doc.title === 'string')) return { ok: true, doc };
  return { ...result, ok: false, error: messageFor(result.reason) };
}

/** Begin the OAuth consent flow for one provider — the view navigates to `url`. */
export async function startExternalConnection(provider, options = {}) {
  const result = await request(`/api/external-connect-start?provider=${encodeURIComponent(provider)}`, options);
  const url = safeLinkUrl(result.data?.url);
  if (result.ok && url) return { ok: true, url };
  return { ...result, ok: false, error: connectMessageFor(result.reason) };
}

/** What this account has connected — never carries tokens, only display fields. */
export async function fetchExternalConnections(options = {}) {
  const result = await request('/api/external-connect', { ...options, body: { action: 'status' } });
  const connections = result.data?.connections;
  if (result.ok && Array.isArray(connections) && connections.every(c => c && Object.hasOwn(CONNECT_PROVIDER_LABELS, c.provider)
      && (c.accountLabel == null || typeof c.accountLabel === 'string'))) return { ok: true, connections };
  return { ...result, ok: false, error: connectMessageFor(result.reason) };
}

/** Revoke one connection — the stored tokens are deleted server-side. */
export async function disconnectExternalConnection(provider, options = {}) {
  const result = await request('/api/external-connect', { ...options, body: { action: 'disconnect', provider } });
  if (result.ok && result.data?.ok === true) return { ok: true };
  return { ...result, ok: false, error: connectMessageFor(result.reason) };
}

function readRecents(ownerId) {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY + encodeURIComponent(ownerId || 'guest')) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((e) => e && safeLinkUrl(e.url) && Object.hasOwn(PROVIDER_LABELS, e.provider) && typeof e.title === 'string')
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

export function loadRecentExternalDocs(ownerId = null) {
  if (typeof localStorage === 'undefined') return [];
  return readRecents(ownerId);
}

/** Most-recent first, deduped by URL, clamped. Write failures stay silent — recents are sugar. */
export function rememberRecentExternalDoc(entry, ownerId = null) {
  if (typeof localStorage === 'undefined') return [];
  const url = safeLinkUrl(entry?.url);
  if (!url || !Object.hasOwn(PROVIDER_LABELS, entry.provider)) return readRecents(ownerId);
  const next = [{ url, provider: entry.provider, title: typeof entry.title === 'string' ? entry.title.slice(0, 200) : '', at: Date.now() }, ...readRecents(ownerId).filter((e) => e.url !== url)]
    .slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_KEY + encodeURIComponent(ownerId || 'guest'), JSON.stringify(next));
  } catch { /* storage full or blocked — the reader works without it */ }
  return next;
}

export async function listExternalFiles(provider, options = {}) {
  const result = await request(`/api/list-external-files?provider=${encodeURIComponent(provider)}`, options);
  const files = result.data?.files;
  if (result.ok && Array.isArray(files) && files.every(f => f && typeof f.id === 'string' && typeof f.title === 'string'
      && safeLinkUrl(f.url))) return { ok: true, files };
  return { ...result, ok: false, error: result.reason ? connectMessageFor(result.reason) : 'ดึงข้อมูลไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง' };
}
