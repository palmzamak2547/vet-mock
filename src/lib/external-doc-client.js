// ============================================================
// external-doc-client.js — the reader's client half
// ============================================================
// Calls /api/fetch-external-doc (server-side fetch + convert) and maps
// every failure the route can answer into one Thai sentence the view can
// show as-is. Also owns the reader's "เปิดล่าสุด" list — client-only on
// purpose: a list of pasted links is the visitor's own browsing history,
// not study data, so it stays in localStorage like the library's recents
// (src/lib/library.js) instead of joining the synced user-data fields.
// ============================================================

const RECENT_KEY = 'vmx-external-docs-v1';
const RECENT_MAX = 8;

export const PROVIDER_LABELS = { notion: 'Notion', gdocs: 'Google Docs', gsheets: 'Google Sheets' };

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

/** POST one link to the reader endpoint. Never throws — answers { ok, doc } or { ok:false, error, reason }. */
export async function fetchExternalDoc(url, { signal } = {}) {
  try {
    const res = await fetch('/api/fetch-external-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

function readRecents() {
  try {
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
