import test from 'node:test';
import assert from 'node:assert/strict';
import { printDocument, isPrinting } from '../../src/lib/print-document.js';

function fakeEnv({ images = [] } = {}) {
  const attrs = new Map();
  const props = new Map();
  const listeners = new Map();
  const order = [];
  const doc = {
    documentElement: {
      setAttribute: (k, v) => { attrs.set(k, v); order.push('mark'); },
      removeAttribute: k => { attrs.delete(k); order.push('unmark'); },
      style: { setProperty: (k, v) => props.set(k, v), removeProperty: k => props.delete(k) },
    },
    fonts: { ready: Promise.resolve().then(() => order.push('fonts')) },
    images,
  };
  const win = {
    print: () => order.push('print'),
    addEventListener: (n, fn) => listeners.set(n, fn),
    removeEventListener: n => listeners.delete(n),
    setTimeout: (fn, ms) => (ms >= 100000 ? 0 : setTimeout(fn, ms)),
  };
  return { doc, win, attrs, props, listeners, order };
}

test('the kind is set while printing and removed after the print window closes', async () => {
  const env = fakeEnv();
  const run = printDocument('questions', { ...env, loadCss: async () => {}, head: 'Head', foot: 'Foot' });
  await new Promise(r => setImmediate(r));
  assert.equal(env.attrs.get('data-print'), 'questions');
  assert.equal(env.props.get('--vmx-print-head'), '"Head"');
  assert.equal(isPrinting(), true);
  env.listeners.get('afterprint')();
  assert.equal(await run, true);
  assert.equal(env.attrs.has('data-print'), false);
  assert.equal(env.props.size, 0);
  assert.equal(isPrinting(), false);
});

test('it loads the stylesheet, waits for fonts and pictures, then prints', async () => {
  const handlers = {};
  const img = { complete: false, addEventListener: (n, fn) => { handlers[n] = fn; } };
  const env = fakeEnv({ images: [img] });
  let cssLoaded = false;
  const run = printDocument('notes', { ...env, loadCss: async () => { cssLoaded = true; } });
  await new Promise(r => setImmediate(r));
  assert.equal(cssLoaded, true);
  assert.ok(env.order.includes('fonts'));
  assert.equal(env.order.includes('print'), false, 'prints only after the picture loaded');
  handlers.load();
  await new Promise(r => setImmediate(r));
  assert.ok(env.order.indexOf('print') > env.order.indexOf('fonts'));
  env.listeners.get('afterprint')();
  await run;
});

test('a second call while one print window is open does nothing', async () => {
  const env = fakeEnv();
  const first = printDocument('notes', { ...env, loadCss: async () => {} });
  const second = await printDocument('notes', { ...env, loadCss: async () => {} });
  assert.equal(second, false);
  await new Promise(r => setImmediate(r));
  assert.equal(env.order.filter(x => x === 'print').length, 1);
  env.listeners.get('afterprint')();
  await first;
  // and a new one is allowed once the first has closed
  const again = printDocument('notes', { ...fakeEnv(), loadCss: async () => {} });
  await new Promise(r => setImmediate(r));
  assert.equal(isPrinting(), true);
  void again;
});
