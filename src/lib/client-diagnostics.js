import { LATEST_CHANGELOG } from '../data/latest-changelog.generated.js';
import { APP_VIEW_ROUTES } from './view-route.js';
import { reportFailure, FAILURE_EVENT } from './report-failure.js';
const views = new Set([...Object.keys(APP_VIEW_ROUTES), 'exam', 'results', 'landing', 'auth', 'notes', 'topic-select', 'review']);
const names = new Set(['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError', 'NetworkError', 'ChunkLoadError', 'QuotaExceededError', 'SecurityError', 'AbortError', 'TimeoutError', 'NotAllowedError', 'InvalidStateError', 'DataError', 'Error']);
// What failed, beyond a thrown error: a save the student made that did not
// stick, a sync that did not go through, a lazy screen that did not load, a
// list that could not be read. Code anywhere reports one with reportFailure().
export const FAILURE_KINDS = ['error', 'rejection', 'render', 'save', 'sync', 'chunk', 'load'];
const MESSAGE_MAX = 120;

// What is stored, field by field, in the words the privacy page uses
// (PrivacyView.jsx; tests/unit/no-silent-failures.test.mjs holds the two
// together, so a field cannot be stored without the page saying so).
export const DIAGNOSTIC_FIELDS = {
  release: 'รุ่นเว็บ',
  view: 'ชื่อหน้า',
  kind: 'ชนิดของปัญหา',
  category: 'ประเภทของ error',
  message: 'ข้อความ error เฉพาะแบบที่เบราว์เซอร์สร้างเอง',
  frame: 'ชื่อไฟล์โค้ดของเว็บพร้อมเลขบรรทัด',
};

// A message is kept only when the JavaScript engine or the browser writes it
// itself, from identifiers of our own code. Stripping what looks personal
// cannot be made complete (a Latin user name, an English answer, a token
// without a scheme all passed an earlier scrubber), so the rule runs the other
// way: every other message is recorded as a short hash of its text, never the
// text. A kept message is reduced first, so the few places an engine message
// can echo data carry a mark instead.
const ENGINE_MESSAGES = [
  /^Cannot (read|set) propert(y|ies) of (undefined|null)( \((reading|setting) '…'\))?$/,
  /^[\w$.]{1,60} is not (a function|defined|iterable|a constructor|an object)$/,
  /^[\w$.]{1,60} is (null|undefined)$/,
  /^(undefined|null) is not an object \(evaluating '…'\)$/,
  /^Assignment to constant variable\.$/,
  /^Maximum call stack size exceeded\.?$/,
  /^(Invalid array length|Invalid time value|Invalid Date)$/,
  /^Failed to fetch$/,
  /^Load failed$/,
  /^NetworkError when attempting to fetch resource\.$/,
  /^The network connection was lost\.$/,
  /^Network request failed$/,
  /^Loading (CSS )?chunk [\w#-]{1,40} failed\.?$/,
  /^(Failed to fetch|error loading) dynamically imported module: <url>$/,
  /^Importing a module script failed\.$/,
  /^Unable to preload CSS for <url>$/,
  /^The quota has been exceeded\.$/,
  /^The operation is insecure\.$/,
  /^The (user aborted a request|operation was aborted)\.?$/,
  /^signal (is aborted|timed out) without reason$/,
  /^The object is in an invalid state\.$/,
  /^Unexpected token '…'(, "…"(\.\.\.)? is not valid JSON)?$/,
  /^Unexpected token .{1,3} in JSON at position \d{1,4}$/,
  /^Unexpected end of JSON input$/,
  /^ResizeObserver loop (limit exceeded|completed with undelivered notifications\.)$/,
  /^Script error\.?$/,
  /^(HTTP|status) \d{3}$/i,
];
const HASHED = /^h:[0-9a-f]{8}$/;

// A short stable hash (FNV-1a, 32 bits): the same failure counts as one row
// and its text never leaves the browser.
function shortHash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return `h:${h.toString(16).padStart(8, '0')}`;
}

// A host is told from a property path (this.props.onSave) by its last part.
const LINKISH = /[/?=\\]|:\/\/|^www\.|^[\w-]+(\.[\w-]+)*\.(com|net|org|th|io|app|dev|co|ac|me|info|edu|gov|ly|ai|xyz|site|link)\.?$/i;
// The marks: quoted text becomes … (an unmatched quote cuts the rest), a mail
// <mail>, anything with a slash, query or equals sign or a bare host name
// <url>, a token-like run of 16 or more <id>, any non-Latin letter …, and a
// number over 4 digits #.
function reduce(message) {
  let m = message.replace(/\s+/g, ' ').trim();
  m = m.replace(/(["'`])(?:(?!\1).)*\1/g, '$1…$1');
  const rest = m.replace(/(["'`])…\1/g, '');
  if (/["'`]/.test(rest)) {
    // An unmatched quote: cut from it, so a long or broken quote keeps nothing.
    let cut = -1;
    for (let i = 0; i < m.length; i++) {
      if ('"\'`'.includes(m[i])) {
        if (m[i + 1] === '…' && m[i + 2] === m[i]) { i += 2; continue; }
        cut = i; break;
      }
    }
    if (cut >= 0) m = `${m.slice(0, cut)}…`;
  }
  m = m.split(' ').map((w) => (/@/.test(w) ? '<mail>' : w)).join(' ');
  m = m.split(' ').map((w) => (LINKISH.test(w) && !/^<\w+>$/.test(w) ? '<url>' : w)).join(' ');
  m = m.replace(/[A-Za-z0-9_+-]{16,}/g, '<id>');
  m = m.replace(/[^\x20-\x7e]+/g, '…');
  m = m.replace(/\d{5,}/g, '#');
  return m;
}

export function safeMessage(message) {
  if (typeof message !== 'string' || !message) return '';
  if (HASHED.test(message)) return message;
  const reduced = reduce(message);
  return reduced.length <= MESSAGE_MAX && ENGINE_MESSAGES.some((re) => re.test(reduced)) ? reduced : shortHash(message);
}

// The first frame in our own bundle: file name, line and column. No origin,
// no query, no path but assets/.
const FRAME = /\/assets\/([\w.-]{1,80}\.js)(?:\?[^:\s)]*)?:(\d{1,7}):(\d{1,7})/;
const FRAME_STORED = /^assets\/[\w.-]{1,80}\.js:\d{1,7}:\d{1,7}$/;
export function safeFrame(stack) {
  if (typeof stack !== 'string') return '';
  if (FRAME_STORED.test(stack)) return stack;
  const hit = stack.match(FRAME);
  return hit ? `assets/${hit[1]}:${hit[2]}:${hit[3]}` : '';
}

export function diagnosticRecord(error, view, kind = 'error') {
  // view is a screen's name from the route table, never the address, so a
  // document name or a query cannot reach it.
  return { release: LATEST_CHANGELOG.version, view: views.has(view) ? view : 'other',
    kind: FAILURE_KINDS.includes(kind) ? kind : 'error',
    category: names.has(error?.name) ? error.name : 'Error',
    message: safeMessage(error?.message),
    frame: safeFrame(error?.stack) };
}

export { reportFailure, FAILURE_EVENT };

export function installClientDiagnostics({ target = window, getView, send = value => fetch('/api/client-diagnostic', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
  credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true, signal: AbortSignal.timeout(8000),
}) } = {}) {
  let remaining = 20;
  const seen = new Set();
  const report = (error, kind) => {
    if (remaining <= 0) return;
    const value = diagnosticRecord(error, getView?.(), kind);
    const key = JSON.stringify(value);
    if (seen.has(key)) return;
    seen.add(key); remaining--;
    // The beacon is best effort on purpose: a report that cannot be sent has
    // nobody to tell, and retrying would cost the student's bandwidth.
    Promise.resolve().then(() => send(value)).catch(() => {});
  };
  const error = e => report(e.error || { name: 'Error', message: e.message }, 'error');
  const rejection = e => report(e.reason, 'rejection');
  const render = e => report(e.detail, 'render');
  const failure = e => report({ name: e.detail?.name, message: e.detail?.message, stack: e.detail?.stack }, e.detail?.kind);
  target.addEventListener('error', error);
  target.addEventListener('unhandledrejection', rejection);
  target.addEventListener('vmx-render-error', render);
  target.addEventListener(FAILURE_EVENT, failure);
  return () => {
    remaining = 0;
    target.removeEventListener('error', error);
    target.removeEventListener('unhandledrejection', rejection);
    target.removeEventListener('vmx-render-error', render);
    target.removeEventListener(FAILURE_EVENT, failure);
  };
}
