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

// The message with anything that can carry a person's words or identity cut
// out: quoted text, addresses, links, every run of digits, and every
// non-Latin run (a Thai message may echo what the student typed). What is
// left is the shape of the failure ("Cannot read properties of undefined
// (reading '…')"), which is what the owner needs to find the line.
export function scrubMessage(message) {
  if (typeof message !== 'string' || !message) return '';
  return message
    .replace(/(["'`])(?:(?!\1).){0,400}\1/g, '$1…$1')
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '<mail>')
    .replace(/\b(?:https?|blob|data|file|chrome-extension|moz-extension):\S*/gi, '<url>')
    .replace(/[^\x20-\x7e]+/g, '…')
    .replace(/\d+/g, '#')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MESSAGE_MAX);
}

export function diagnosticRecord(error, view, kind = 'error') {
  // Messages pass only through scrubMessage; stacks, document titles, user
  // identifiers and URLs are never kept.
  return { release: LATEST_CHANGELOG.version, view: views.has(view) ? view : 'other',
    kind: FAILURE_KINDS.includes(kind) ? kind : 'error',
    category: names.has(error?.name) ? error.name : 'Error',
    message: scrubMessage(error?.message) };
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
  const failure = e => report({ name: e.detail?.name, message: e.detail?.message }, e.detail?.kind);
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
