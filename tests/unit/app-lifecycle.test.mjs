import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { isUpdateUnsafe } from '../../src/lib/update-safety.js';

function harness({ blocked = false, view = 'atlas', online = true, build = '/assets/main-first.js' } = {}) {
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
  // vm.runInNewContext compiles a SCRIPT, so a top-level `import` is a syntax
  // error there. Strip the import line and pass the REAL isUpdateUnsafe in
  // through the context — a stub here would let the two paths drift again
  // while the tests stayed green, which is the bug this module exists to stop.
  const code = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8')
    .replace('import.meta.env?.MODE', '"production"')
    .replace(/^import .*update-safety\.js'\s*$/m, '');
  vm.runInNewContext(code, { window, isUpdateUnsafe, navigator: { onLine: online }, document: { documentElement: { dataset: {} }, querySelector: () => ({ getAttribute: () => build }) }, sessionStorage: storage, setTimeout: callback => timers.push(callback), console: { warn() {}, error() {} }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } } });
  return { window, events, timers, flags, setBuild(next) { build = next; }, get reloads() { return reloads; }, fire(name, event = {}) { for (const callback of listeners.get(name) || []) callback(event); } };
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

test('a slow lazy failure after HTML load cannot reset the reload guard', () => {
  const app = harness();
  app.fire('vite:preloadError');
  app.fire('load');
  app.timers.forEach(callback => callback());
  app.fire('vite:preloadError');
  assert.equal(app.reloads, 1);
});

test('a new entry hash can recover once without repeating the old build loop', () => {
  const app = harness();
  app.fire('vite:preloadError');
  app.setBuild('/assets/main-second.js');
  app.fire('vite:preloadError');
  app.fire('vite:preloadError');
  assert.equal(app.reloads, 2);
});

// The gap this closes. App.jsx has held a list of eight views a reload cannot
// restore since the deferral was written; this file checked only for 'exam'.
// So a deploy landing while a student read their score, or the answers, did
// what the other path was careful never to do — reloaded them to Home with the
// screen gone. Every view on that list now defers here too.
for (const view of ['results', 'review', 'config', 'topic-select', 'sr-session', 'race', 'pomodoro']) {
  test(`a deploy landing on ${view} defers instead of reloading`, () => {
    const app = harness({ view });
    let prevented = false;
    app.fire('vite:preloadError', { preventDefault() { prevented = true; } });
    assert.equal(app.reloads, 0, `${view} must not be reloaded out from under the student`);
    assert.equal(prevented, true);
    assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'deferred');
  });
}

// ...and a view a reload CAN restore still recovers, or a stale chunk would
// strand the student on a broken page forever.
test('a view with its own URL still recovers from a stale chunk', () => {
  const app = harness({ view: 'wiki' });
  app.fire('vite:preloadError', { preventDefault() {} });
  assert.equal(app.reloads, 1);
});
