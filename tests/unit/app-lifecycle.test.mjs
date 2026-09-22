import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { publishUpdateStatus } from '../../src/lib/update-safety.js';
import { APP_VIEW_ROUTES } from '../../src/lib/view-route.js';
import { createUserDataSync } from '../../src/lib/user-data-sync.js';

function harness({ view = 'home', online = true, waiting = true } = {}) {
  const listeners = new Map(), docListeners = new Map(), swListeners = new Map();
  const events = [], messages = [], timers = [], intervals = [];
  let reloads = 0, checks = 0, updateResult = Promise.resolve();
  const on = map => (name, fn) => { map.set(name, [...(map.get(name) || []), fn]); };
  const fire = (map, name, event = {}) => Promise.all((map.get(name) || []).map(fn => fn(event)));
  const document = { visibilityState: 'visible', documentElement: { dataset: {} }, addEventListener: on(docListeners) };
  class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
  const window = {
    document, CustomEvent, history: { state: { vmxView: view } },
    location: { reload() { reloads++; } }, addEventListener: on(listeners),
    dispatchEvent(event) { events.push(event); void fire(listeners, event.type, event); },
  };
  const worker = { state: 'installed', postMessage(message) { messages.push(message); } };
  const reg = { waiting: waiting ? worker : null, addEventListener() {}, update() { checks++; return updateResult; } };
  const navigator = { onLine: online, serviceWorker: { controller: worker, addEventListener: on(swListeners), register: async () => reg } };
  const code = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8')
    .replace('import.meta.env?.MODE', '"production"').replace(/^import .*update-safety\.js'\s*$/m, '');
  vm.runInNewContext(code, {
    window, document, navigator, publishUpdateStatus, CustomEvent,
    setTimeout: fn => { timers.push(fn); return fn; }, clearTimeout() {}, setInterval: fn => intervals.push(fn),
    console: { warn() {}, info() {} },
  });
  return { window, document, events, messages, timers, intervals, worker,
    get reloads() { return reloads; }, get checks() { return checks; },
    setUpdateResult(value) { updateResult = value; },
    setWaiting(value) { reg.waiting = value ? worker : null; },
    fire: (name, event) => fire(listeners, name, event),
    controllerChange: () => fire(swListeners, 'controllerchange'),
    visibility: state => { document.visibilityState = state; return fire(docListeners, 'visibilitychange'); },
  };
}

for (const view of [...Object.keys(APP_VIEW_ROUTES), 'exam', 'review', 'results', 'config', 'topic-select', 'notes', 'knowledge', 'lab', 'group-detail', 'new-unregistered-view', undefined]) {
  test('updates preserve the open ' + (view ?? 'initial') + ' document without requesting takeover', async () => {
    const app = harness({ view }); let prevented = 0;
    await app.fire('load');
    await app.fire('vite:preloadError', { preventDefault() { prevented++; } });
    await app.fire('vmx-sw-apply-update'); await app.controllerChange();
    await app.visibility('hidden'); await app.visibility('visible');
    await app.fire('vmx-view-change'); await app.fire('pagehide');
    await new Promise(setImmediate);
    assert.equal(app.reloads, 0);
    assert.equal(prevented, 0, 'keep rejection available to the importing view');
    assert.ok(!app.messages.includes('SKIP_WAITING'));
    assert.ok(!app.messages.includes('ACTIVATE_WHEN_SESSION_SAFE'));
    assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'ready');
  });
}

test('offline failure stays with the importing view without announcing a false update', async () => {
  const app = harness({ online: false }); await app.fire('vite:preloadError');
  assert.equal(app.events.length, 0); assert.equal(app.reloads, 0);
});

test('a real departure asks for optional cleanup while BFCache keeps its document intact', async () => {
  const app = harness(); await app.fire('load');
  await app.fire('pagehide', { persisted: true });
  assert.deepEqual(app.messages, []);
  await app.fire('pagehide', { persisted: false });
  assert.deepEqual(app.messages, ['TRIM_ASSETS_IF_UNUSED']);
  assert.equal(app.reloads, 0);
});

test('visible and hourly discovery checks remain automatic even with a waiting worker', async () => {
  const app = harness(); await app.fire('load');
  await app.visibility('hidden'); assert.equal(app.checks, 0);
  await app.visibility('visible'); await new Promise(setImmediate);
  app.intervals[0](); await new Promise(setImmediate);
  assert.equal(app.checks, 2);
  assert.deepEqual(app.messages, [], 'discovery never requests early activation');
});

test('overlapping discovery events share one update job and can check again after completion', async () => {
  const app = harness({ waiting: false }); await app.fire('load');
  let finishUpdate;
  app.setUpdateResult(new Promise(resolve => { finishUpdate = resolve; }));
  await app.visibility('visible'); app.intervals[0](); await app.visibility('visible');
  assert.equal(app.checks, 1);
  app.setWaiting(true); finishUpdate(); await new Promise(setImmediate);
  assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'ready');
  await app.visibility('visible'); await new Promise(setImmediate);
  assert.equal(app.checks, 2);
  assert.deepEqual(app.messages, []);
});

// ── The idle storage sweep, with two windows of one account open ────
class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(k) { return this.values.get(k) ?? null; }
  setItem(k, v) { this.values.set(k, String(v)); }
  removeItem(k) { this.values.delete(k); }
}
function engineLifecycle(online) {
  const listeners = new Set();
  return {
    isOnline: () => online,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    emit(reason) { for (const listener of listeners) listener(reason); },
  };
}
/** An idle scheduler the test runs by hand. */
function manualIdle() {
  const queue = [];
  return {
    request(fn) { const handle = { fn }; queue.push(handle); return handle; },
    cancel(handle) { const i = queue.indexOf(handle); if (i !== -1) queue.splice(i, 1); },
    run() { for (const handle of queue.splice(0)) handle.fn(); },
  };
}
const never = { setTimeout: () => 0, clearTimeout: () => {} };
const outboxKeys = (storage) => [...storage.values.keys()].filter((k) => k.startsWith('vmx-user-op-v1:user-1:'));
const snapshotNotes = (storage) => JSON.parse(storage.getItem('vmx-user-data-v1:user-1')).notes;

/** Loads app-lifecycle.js over `storage` and runs its idle sweep to the end,
 *  with the modules it imports resolved to the real ones. */
async function runBootSweep(storage) {
  const listeners = new Map(), idle = [], imports = [];
  const window = {
    localStorage: storage,
    addEventListener(name, fn) { listeners.set(name, [...(listeners.get(name) || []), fn]); },
  };
  const code = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8')
    .replace('import.meta.env?.MODE', '"production"').replace(/^import .*update-safety\.js'\s*$/m, '')
    .replace(/\bimport\(/g, '__import(');
  vm.runInNewContext(code, {
    window, navigator: {}, publishUpdateStatus, console: { warn() {}, info() {} },
    requestIdleCallback: (fn) => { idle.push(fn); }, setTimeout: (fn) => { idle.push(fn); },
    __import: (specifier) => {
      const loading = import(new URL(specifier, new URL('../../src/lib/', import.meta.url)).href);
      imports.push(loading);
      return loading;
    },
  });
  for (const fn of listeners.get('load') || []) fn();
  for (const fn of idle.splice(0)) fn();
  await Promise.allSettled(imports);
  for (let i = 0; i < 10; i += 1) await new Promise(setImmediate);
}

test('the boot sweep keeps an edit another window has not compacted yet', async () => {
  // A window compacts its snapshot a few seconds after its last edit, so for
  // those seconds the edit lives only in that window's outbox record. The
  // sweep keeps the newest four records per account, and a window open since
  // before the others holds the oldest one. A reload of another window inside
  // that gap dropped the record, and with it the edit, in both windows.
  const storage = new MemoryStorage();
  const remote = { pull: async () => ({ notes: {} }), push: async () => {} };
  const setup = createUserDataSync({ storage, lifecycle: engineLifecycle(true), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle() });
  setup.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  for (let i = 0; i < 50 && setup.getSnapshot().sync.phase !== 'synced'; i += 1) await new Promise((r) => setTimeout(r, 5));
  setup.close();

  const writeNote = (store, key) => store.send({
    type: 'CHANGE', principalId: 'user-1', derive: (d) => ({ notes: { ...d.notes, [key]: `note ${key}` } }),
  });
  // Offline all along, so nothing is pushed and every record stays.
  let clock = 1_000;
  const lifeA = engineLifecycle(false); const idleA = manualIdle();
  const a = createUserDataSync({ storage, lifecycle: lifeA, remote, debounceMs: 60_000, scheduler: never, idle: idleA, now: () => clock });
  a.subscribe(() => {});
  a.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  writeNote(a, 'a1');
  idleA.run();
  for (let i = 0; i < 4; i += 1) {
    clock += 1_000;
    const reload = createUserDataSync({ storage, lifecycle: engineLifecycle(false), remote, debounceMs: 60_000, scheduler: never, idle: manualIdle(), now: () => clock });
    reload.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
    writeNote(reload, `c${i}`);
    reload.close();
    lifeA.emit('storage');
  }
  assert.equal(outboxKeys(storage).length, 5, 'five unpushed records, the first window’s the oldest');

  // Window B opens; then A edits, and B's idle sweep runs before A compacts.
  const lifeB = engineLifecycle(false);
  const b = createUserDataSync({ storage, lifecycle: lifeB, remote, debounceMs: 60_000, scheduler: never, idle: manualIdle(), now: () => clock + 5_000 });
  b.subscribe(() => {});
  b.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  clock += 1_000;
  writeNote(a, 'a2');
  lifeB.emit('storage');
  assert.equal(snapshotNotes(storage).a2, undefined, 'the new edit is only in A’s outbox record');

  await runBootSweep(storage);
  lifeA.emit('storage');
  assert.ok(outboxKeys(storage).length <= 4, 'the sweep still trims the outbox');

  const every = ['a1', 'a2', 'c0', 'c1', 'c2', 'c3'];
  for (const key of every) {
    assert.equal(b.getSnapshot().data.notes[key], `note ${key}`, `window B shows ${key}`);
    assert.equal(a.getSnapshot().data.notes[key], `note ${key}`, `window A still shows ${key}`);
  }
  idleA.run();
  for (const key of every) assert.equal(a.getSnapshot().data.notes[key], `note ${key}`, `after A compacts it still shows ${key}`);
  a.close(); b.close();

  const reopened = createUserDataSync({ storage, lifecycle: engineLifecycle(false), remote, idle: manualIdle() });
  reopened.send({ type: 'SESSION_CHANGED', userId: 'user-1' });
  for (const key of every) assert.equal(reopened.getSnapshot().data.notes[key], `note ${key}`, `a reload shows ${key}`);
  reopened.close();
});

test('failed discovery keeps the current document and reports any already waiting update', async () => {
  const app = harness({ waiting: false }); await app.fire('load');
  let failUpdate;
  app.setUpdateResult(new Promise((resolve, reject) => { failUpdate = reject; }));
  await app.visibility('visible'); app.setWaiting(true); failUpdate(new Error('offline'));
  await new Promise(setImmediate);
  assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'ready');
  assert.equal(app.reloads, 0); assert.deepEqual(app.messages, []);
});
