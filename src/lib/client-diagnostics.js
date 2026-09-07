import { APP_VIEW_ROUTES } from './view-route.js';
const views = new Set([...Object.keys(APP_VIEW_ROUTES), 'exam', 'results', 'landing', 'auth', 'notes', 'topic-select', 'review']);
const names = new Set(['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError', 'NetworkError', 'ChunkLoadError', 'Error']);
export function diagnosticRecord(error, view, kind = 'error') {
  // Deliberately discard messages, stacks, document titles, user identifiers
  // and URLs. Arbitrary exception text can contain the learner's own input.
  return { release: '5.81.0', view: views.has(view) ? view : 'other',
    kind: ['error', 'rejection', 'render'].includes(kind) ? kind : 'error',
    category: names.has(error?.name) ? error.name : 'Error' };
}
export function installClientDiagnostics({ target = window, getView, send = value => fetch('/api/client-diagnostic', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
  credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true, signal: AbortSignal.timeout(8000),
}) } = {}) {
  let remaining = 10;
  const seen = new Set();
  const report = (error, kind) => {
    if (remaining <= 0) return;
    const value = diagnosticRecord(error, getView?.(), kind);
    const key = JSON.stringify(value);
    if (seen.has(key)) return;
    seen.add(key); remaining--;
    Promise.resolve().then(() => send(value)).catch(() => {});
  };
  const error = e => report(e.error, 'error');
  const rejection = e => report(e.reason, 'rejection');
  const render = e => report(e.detail, 'render');
  target.addEventListener('error', error);
  target.addEventListener('unhandledrejection', rejection);
  target.addEventListener('vmx-render-error', render);
  return () => {
    remaining = 0;
    target.removeEventListener('error', error);
    target.removeEventListener('unhandledrejection', rejection);
    target.removeEventListener('vmx-render-error', render);
  };
}
