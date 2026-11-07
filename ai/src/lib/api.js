// ============================================================
// api.js — the one door to the model route
// ============================================================
// Production calls the main VetMock project (vetmock.com/api/ai-chat), which
// holds the corpora, the keys and the rate limits. The answer arrives as
// Server-Sent Events over a POST (EventSource cannot POST), read here with a
// stream reader; each event is handed to `on(name, data)` as it lands.

const PROD = 'https://vetmock.com/api/ai-chat';
// Vite inlines import.meta.env; under node --test it is undefined
const ENV = import.meta.env || {};

export const API_URL =
  ENV.VITE_AI_API ||
  (typeof location !== 'undefined' && /(^|\.)vetmock\.com$/.test(location.hostname) ? PROD : '/api/ai-chat');

export class ChatError extends Error {
  constructor(message, reason, extra = {}) {
    super(message);
    this.reason = reason;
    Object.assign(this, extra);
  }
}

// ── The account on each request ─────────────────────────────
// While the Chula wall is on, the route answers only a member's token
// (docs/CHULA-SIGNIN.md): 401 signin_required for no token or an expired one,
// 403 chula_required for a signed-in account that is not a member. The wall
// (lib/account.js) hands over how to get a token, how to refresh it once, and
// where a refusal goes; with no wall (a build without a database) requests go
// out as before.
let auth = null;

/** @param {{ token: () => Promise<string|null>, refresh: () => Promise<string|null>, refused: (kind: 'signin'|'link') => void } | null} provider */
export function setApiAuth(provider) {
  auth = provider;
}

const errorOf = (res) => res.clone().json().then((j) => j?.error || null).catch(() => null);

/** fetch with the session's bearer token: one refresh and one retry after a 401. */
export async function authorized(url, init) {
  const send = (token) => fetch(url, token ? { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } } : init);
  if (!auth) return send(null);
  const token = await auth.token().catch(() => null);
  let res = await send(token);
  if (res.status === 401) {
    const fresh = await auth.refresh().catch(() => null);
    if (fresh && fresh !== token) res = await send(fresh);
  }
  if (res.status === 401) auth.refused('signin');
  else if (res.status === 403 && (await errorOf(res)) === 'chula_required') auth.refused('link');
  return res;
}

let warmed = false;
/** Wake an instance and build its corpus while the student is still typing
 *  (an uncached GET; the route answers it in a few ms once warm). Once per page. */
export function warm() {
  if (warmed) return;
  warmed = true;
  fetch(`${API_URL}?warm=1`, { method: 'GET', keepalive: true }).catch(() => { warmed = false; });
}

// the microphone's speech-to-text route lives beside the chat route
export const TRANSCRIBE_URL = API_URL.replace(/ai-chat$/, 'ai-transcribe');

/** Can the server transcribe right now? (the recorder is offered only if so) */
export async function transcribeAvailable() {
  try {
    const r = await fetch(TRANSCRIBE_URL, { headers: { Accept: 'application/json' } });
    return r.ok && (await r.json()).available === true;
  } catch {
    return false;
  }
}

/** A recorded question (16 kHz WAV) as text, from Thai ASR. */
export async function transcribe(wav, signal) {
  const audio = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(new ChatError('อ่านเสียงที่อัดไว้ไม่ได้', 'input'));
    r.readAsDataURL(wav);
  });
  let res;
  try {
    res = await authorized(TRANSCRIBE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audio }), signal });
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
    throw new ChatError('เชื่อมต่อไม่ได้ เช็กอินเทอร์เน็ตก่อน', 'network');
  }
  let j = {};
  try { j = await res.json(); } catch { /* not JSON */ }
  if (!res.ok) throw new ChatError(j.message || 'ถอดเสียงไม่สำเร็จ ลองอีกครั้ง', j.error || 'http', { status: res.status, retryAfter: j.retryAfter });
  return String(j.text || '').trim();
}

export async function health(signal) {
  const res = await fetch(API_URL, { method: 'GET', signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new ChatError('health', 'http', { status: res.status });
  return res.json();
}

export function parseEvent(raw) {
  let event = 'message';
  let data = '';
  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data += line.slice(5).trimStart();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) };
  } catch {
    return null;
  }
}

/**
 * @param {{ messages: {role: string, content: string}[], image?: {mediaType: string, data: string} | null,
 *           signal?: AbortSignal, on: (event: string, data: any) => void }} p
 */
export async function chat({ messages, image = null, signal, on }) {
  // ?mock, dev only: a build replaces import.meta.env.DEV with false, which drops
  // this branch and mock.js from the bundle (spelled out so the bundler can see it)
  if (import.meta.env && import.meta.env.DEV && typeof location !== 'undefined' && location.search.includes('mock')) {
    const { mockChat } = await import('./mock.js');
    return mockChat({ messages, image, signal, on });
  }
  let res;
  try {
    res = await authorized(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ messages, image }),
      signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
    throw new ChatError('เชื่อมต่อไม่ได้ เช็กอินเทอร์เน็ตก่อน', 'network');
  }
  if (!res.ok || !res.body) {
    let j = {};
    try { j = await res.json(); } catch { /* not JSON */ }
    throw new ChatError(j.message || 'ระบบตอบไม่ได้ในตอนนี้ ลองอีกครั้ง', j.error || 'http', { status: res.status, retryAfter: j.retryAfter });
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let ended = false;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.search(/\r?\n\r?\n/)) >= 0) {
      const raw = buf.slice(0, i);
      buf = buf.slice(buf[i] === '\r' ? i + 4 : i + 2);
      const ev = parseEvent(raw);
      if (!ev) continue;
      if (ev.event === 'done' || ev.event === 'error') ended = true;
      on(ev.event, ev.data);
    }
  }
  if (!ended) throw new ChatError('คำตอบถูกตัดกลางทาง ลองอีกครั้ง', 'cut');
}
