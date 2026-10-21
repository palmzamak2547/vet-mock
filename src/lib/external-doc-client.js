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
// 5.140.0 to 5.141.5 kept one list for everybody on the browser, private
// document links and titles included. Nothing reads it since recents became
// per account, so the first read removes it rather than leave it behind.
const LEGACY_UNOWNED_RECENT_KEY = 'vmx-external-docs-v1';

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
  reconnect: 'บัญชีที่เชื่อมไว้หมดอายุหรือถูกยกเลิกสิทธิ์แล้ว กดยกเลิกการเชื่อมต่อ แล้วเชื่อมบัญชีใหม่อีกครั้ง',
  notion_not_shared: 'บัญชี Notion ที่เชื่อมไว้ยังเปิดเพจนี้ไม่ได้ กดยกเลิกการเชื่อมต่อ แล้วเชื่อมใหม่และเลือกเพจนี้ตอนให้สิทธิ์',
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

// Outcomes the callback reports that are the student's own choice, not a
// failure: shown as a plain notice, never as an error alert.
const CONNECT_NOTICES = {
  cancelled: 'ยังไม่ได้เชื่อมบัญชี เพราะกดยกเลิกที่หน้าให้สิทธิ์ กดเชื่อมต่อใหม่ได้เมื่อพร้อม',
};

/** The neutral notice for a callback outcome, or null when it is an error. */
export function connectNoticeFor(reason) {
  return Object.hasOwn(CONNECT_NOTICES, reason) ? CONNECT_NOTICES[reason] : null;
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
      && safeLinkUrl(doc.sourceUrl) && (doc.title == null || typeof doc.title === 'string')
      && (doc.imagesOmitted == null || typeof doc.imagesOmitted === 'boolean')) return { ok: true, doc };
  return { ...result, ok: false, error: messageFor(result.reason) };
}

/** Begin the OAuth consent flow for one provider — the view navigates to `url`. */
export async function startExternalConnection(provider, options = {}) {
  const result = await request(`/api/external-connect-start?provider=${encodeURIComponent(provider)}`, options);
  const url = safeLinkUrl(result.data?.url);
  if (result.ok && url) return { ok: true, url };
  // The server knows better than the answer this page remembered: a provider
  // it refuses as not configured stays hidden for the rest of the visit.
  if (result.reason === 'not_configured' && connectableCache && Object.hasOwn(connectableCache, provider)) {
    connectableCache = { ...connectableCache, [provider]: false };
  }
  return { ...result, ok: false, error: connectMessageFor(result.reason) };
}

// ── Which accounts this deployment can connect ───────────────────────
// A connect button is shown only when pressing it can work. The server
// answers from env presence (booleans only); anything else, a failed fetch,
// an older deployment, a malformed answer, means nothing is connectable
// here, so the reader offers only what every visitor can use: a link
// shared with anyone who has it.
export const NO_CONNECTABLE = Object.freeze({ google: false, notion: false });

/** The server's answer as two booleans, or null when it is not exactly that. */
export function parseConnectable(data) {
  const connect = data && typeof data === 'object' ? data.connect : null;
  if (!connect || typeof connect !== 'object') return null;
  if (typeof connect.google !== 'boolean' || typeof connect.notion !== 'boolean') return null;
  return { google: connect.google, notion: connect.notion };
}

let connectableCache = null;

/** The last answer this page received, without asking again (null before one). */
export function peekConnectable() {
  return connectableCache;
}

/** Ask once per page; only a well-formed answer is remembered. */
export async function fetchConnectable(options = {}) {
  if (connectableCache) return { ok: true, connectable: connectableCache };
  const result = await request('/api/external-connect', { signal: options.signal });
  const parsed = result.ok ? parseConnectable(result.data) : null;
  if (parsed) {
    connectableCache = parsed;
    return { ok: true, connectable: parsed };
  }
  return { ok: false, connectable: NO_CONNECTABLE, aborted: !!result.aborted };
}

/**
 * The line under the paste box that names what a connection adds, or null
 * when no account can be connected here (then nothing about connecting is
 * said at all).
 */
export function connectNoteFor(connectable) {
  const google = connectable?.google === true;
  const notion = connectable?.notion === true;
  if (google && notion) return 'เอกสารส่วนตัวใน Google และหน้าของ Notion เปิดได้หลังเชื่อมบัญชีของคุณด้านล่าง';
  if (google) return 'เอกสารส่วนตัวใน Google เปิดได้หลังเชื่อมบัญชีของคุณด้านล่าง';
  if (notion) return 'หน้าของ Notion เปิดได้หลังเชื่อมบัญชีของคุณด้านล่าง';
  return null;
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
  try { localStorage.removeItem(LEGACY_UNOWNED_RECENT_KEY); } catch { /* storage blocked: nothing to remove */ }
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

// ── Google Picker ─────────────────────────────────────────────────────
// The connection asks Google for drive.file only, so the app reads exactly
// the Docs and Sheets the student picks here. The picker is Google's own
// window; it gets the student's short-lived token from our server.

let pickerScript = null;
function loadPickerApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no_window'));
  if (window.google?.picker) return Promise.resolve();
  pickerScript ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.async = true;
    s.onload = () => window.gapi.load('picker', { callback: resolve, onerror: reject });
    s.onerror = () => { pickerScript = null; reject(new Error('picker_load_failed')); };
    document.head.appendChild(s);
  });
  return pickerScript;
}

/** Resolves with the picked files as [{ id, title, url }], or [] when the student closes it. */
export async function pickGoogleFiles(options = {}) {
  const result = await request('/api/list-external-files?provider=google&picker=1', options);
  const { accessToken, appId, developerKey } = result.data || {};
  if (!result.ok || !accessToken) {
    return { ok: false, error: result.reason ? connectMessageFor(result.reason) : 'เปิดหน้าต่างเลือกไฟล์ไม่สำเร็จ ลองใหม่อีกครั้ง' };
  }
  try { await loadPickerApi(); } catch {
    return { ok: false, error: 'เปิดหน้าต่างเลือกไฟล์ของ Google ไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่' };
  }
  const { picker } = window.google;
  return new Promise((resolve) => {
    const docs = new picker.DocsView(picker.ViewId.DOCS)
      .setMimeTypes('application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet')
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false);
    new picker.PickerBuilder()
      .setAppId(appId)
      .setDeveloperKey(developerKey)
      .setOAuthToken(accessToken)
      .setLocale('th')
      .setTitle('เลือกเอกสารหรือชีตที่จะอ่านใน VetMock')
      .addView(docs)
      .enableFeature(picker.Feature.MULTISELECT_ENABLED)
      .setCallback((data) => {
        const action = data[picker.Response.ACTION];
        if (action === picker.Action.CANCEL) resolve({ ok: true, files: [] });
        if (action !== picker.Action.PICKED) return;
        const files = (data[picker.Response.DOCUMENTS] || []).map((d) => {
          const sheet = d[picker.Document.MIME_TYPE] === 'application/vnd.google-apps.spreadsheet';
          const id = d[picker.Document.ID];
          return { id, title: d[picker.Document.NAME] || '', url: `https://docs.google.com/${sheet ? 'spreadsheets' : 'document'}/d/${id}` };
        }).filter((f) => typeof f.id === 'string' && safeLinkUrl(f.url));
        resolve({ ok: true, files });
      })
      .build()
      .setVisible(true);
  });
}
