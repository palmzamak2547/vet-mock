import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { publishUpdateStatus } from '../../src/lib/update-safety.js';
import { APP_VIEW_ROUTES } from '../../src/lib/view-route.js';

function harness({ view = 'home', online = true, waiting = true, controlled = true, resources = [], observer = null } = {}) {
  const listeners = new Map(), docListeners = new Map(), swListeners = new Map();
  const events = [], messages = [], timers = [], intervals = [];
  let reloads = 0, checks = 0, updateResult = Promise.resolve();
  const on = map => (name, fn) => { map.set(name, [...(map.get(name) || []), fn]); };
  const fire = (map, name, event = {}) => Promise.all((map.get(name) || []).map(fn => fn(event)));
  const document = { visibilityState: 'visible', documentElement: { dataset: {} }, addEventListener: on(docListeners) };
  class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
  const window = {
    document, CustomEvent, history: { state: { vmxView: view } },
    location: { origin: 'https://vetmock.test', reload() { reloads++; } }, addEventListener: on(listeners),
    PerformanceObserver: observer,
    performance: { getEntriesByType: type => (type === 'resource' ? resources.map(name => ({ name })) : []) },
    dispatchEvent(event) { events.push(event); void fire(listeners, event.type, event); },
  };
  const worker = { state: 'installed', postMessage(message) { messages.push(message); } };
  const reg = { waiting: waiting ? worker : null, addEventListener() {}, update() { checks++; return updateResult; } };
  const navigator = { onLine: online, serviceWorker: { controller: controlled ? worker : null, addEventListener: on(swListeners), register: async () => reg } };
  const code = readFileSync(new URL('../../src/lib/app-lifecycle.js', import.meta.url), 'utf8')
    .replace('import.meta.env?.MODE', '"production"').replace(/^import .*update-safety\.js'\s*$/m, '')
    .replace(/^import .*native-detect\.js'\s*$/m, '');
  vm.runInNewContext(code, {
    window, document, navigator, publishUpdateStatus, CustomEvent, URL, IS_APP: false,
    setTimeout: fn => { timers.push(fn); return fn; }, clearTimeout() {}, setInterval: fn => intervals.push(fn),
    console: { warn() {}, info() {} },
  });
  return { window, document, events, messages, timers, intervals, worker,
    get reloads() { return reloads; }, get checks() { return checks; },
    setUpdateResult(value) { updateResult = value; },
    setWaiting(value) { reg.waiting = value ? worker : null; },
    fire: (name, event) => fire(listeners, name, event),
    controllerChange: () => fire(swListeners, 'controllerchange'),
    takeControl() { navigator.serviceWorker.controller = worker; return fire(swListeners, 'controllerchange'); },
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

test('failed discovery keeps the current document and reports any already waiting update', async () => {
  const app = harness({ waiting: false }); await app.fire('load');
  let failUpdate;
  app.setUpdateResult(new Promise((resolve, reject) => { failUpdate = reject; }));
  await app.visibility('visible'); app.setWaiting(true); failUpdate(new Error('offline'));
  await new Promise(setImmediate);
  assert.equal(app.window.__VMX_UPDATE_STATUS__.state, 'ready');
  assert.equal(app.reloads, 0); assert.deepEqual(app.messages, []);
});

// Offline audit, 15 Nov 2026: one online visit, then an offline reload, drew a
// blank page, because the first visit's files loaded before any worker
// controlled the page. Once one does, the page names them for it to keep.
test('the first visit names its own app files to the worker once it takes control', async () => {
  const app = harness({ controlled: false, waiting: false, resources: [
    'https://vetmock.test/assets/main-1.js', 'https://vetmock.test/assets/HomeView-2.js', 'https://vetmock.test/assets/main-1.css',
    'https://vetmock.test/fonts/sarabun-400.woff2', 'https://vetmock.test/api/me', 'https://cdn.elsewhere.test/assets/x.js',
    'https://vetmock.test/subject-art/a.webp', 'https://vetmock.test/assets/main-1.js',
  ] });
  await app.fire('load');
  assert.deepEqual(app.messages, [], 'nothing is sent before a worker controls the page');
  await app.takeControl();
  assert.equal(app.messages.length, 1);
  assert.equal(app.messages[0].type, 'CACHE_LOADED');
  assert.deepEqual([...app.messages[0].urls], [
    'https://vetmock.test/assets/main-1.js', 'https://vetmock.test/assets/HomeView-2.js', 'https://vetmock.test/assets/main-1.css',
    'https://vetmock.test/fonts/sarabun-400.woff2',
  ]);
  await app.takeControl();
  assert.equal(app.messages.length, 1, 'only the first takeover reports');
  assert.equal(app.reloads, 0);
});

test('a page that opened already controlled sends no list: its files went through the worker', async () => {
  const app = harness({ resources: ['https://vetmock.test/assets/main-1.js'] });
  await app.fire('load');
  await app.controllerChange();
  assert.ok(!app.messages.some(m => m?.type === 'CACHE_LOADED'));
});

test('files still downloading at the takeover are named as they finish', async () => {
  let deliver;
  class FakeObserver { constructor(callback) { deliver = callback; } observe() {} disconnect() {} }
  const app = harness({ controlled: false, waiting: false, observer: FakeObserver, resources: ['https://vetmock.test/assets/main-1.js'] });
  await app.fire('load');
  await app.takeControl();
  deliver({ getEntries: () => [{ name: 'https://vetmock.test/assets/HomeView-2.js' }, { name: 'https://vetmock.test/subject-art/a.webp' }] });
  assert.equal(app.messages.length, 2);
  assert.deepEqual([...app.messages[1].urls], ['https://vetmock.test/assets/HomeView-2.js']);
});
