import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function harness({ blocked = false, view = 'atlas', online = true } = {}) {
  const listeners = new Map(), flags = new Map(), timers = [], events = [];
  let reloads = 0;
  const window = {
    history: { state: { vmxView: view } }, location: { reload() { reloads++; } },
    addEventListener(name, callback) { const rows = listeners.get(name) || []; rows.push(callback); listeners.set(name, rows); },
    dispatchEvent(event) { events.push(event); },
  };
  const storage = {
    getItem(key) { if (blocked) throw new Error('storage denied'); return flags.get(key) || null; },
    setItem(key, value) { if (blocked) throw new Error('storage denied'); flags.set(key, value); },
    removeItem(key) { if (blocked) throw new Error('storage denied'); flags.delete(key); },
  };
  const code = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8').replace('import.meta.env?.MODE', '"production"');
  vm.runInNewContext(code, { window, navigator: { onLine: online }, document: { documentElement: { dataset: {} } }, sessionStorage: storage, setTimeout: callback => timers.push(callback), console: { warn() {}, error() {} }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } } });
  return { window, events, timers, flags, get reloads() { return reloads; }, fire(name, event = {}) { for (const callback of listeners.get(name) || []) callback(event); } };
}
test('a stale chunk reloads at most once until a successful load', () => {
  const app = harness(); let prevented = 0;
  app.fire('vite:preloadError', { preventDefault() { prevented++; } });
  app.fire('vite:preloadError', { preventDefault() { prevented++; } });
  assert.equal(app.reloads, 1); assert.equal(prevented, 1);
});
test('restricted storage cannot create a reload loop or a startup exception', () => {
  const app = harness({ blocked: true });
  assert.doesNotThrow(() => { app.fire('vite:preloadError'); app.fire('load'); app.timers.forEach(callback => callback()); });
  assert.equal(app.reloads, 0);
});
test('an active exam keeps update deferral even when storage is unavailable', () => {
  const app = harness({ blocked: true, view: 'exam' }); let prevented = false;
  app.fire('vite:preloadError', { preventDefault() { prevented = true; } });
  assert.equal(prevented, true); assert.equal(app.reloads, 0); assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'deferred');
});
test('offline chunk failure remains retryable without navigating away', () => {
  const app = harness({ online: false }); app.fire('vite:preloadError');
  assert.equal(app.reloads, 0); assert.equal(app.flags.size, 0);
});
