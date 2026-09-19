import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ORIGIN = 'https://vetmock.test';
const source = readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const runtime = /const RUNTIME = `([^`]+)`/.exec(source)[1]
  .replace('${SW_VERSION}', /const SW_VERSION = '([^']+)'/.exec(source)[1]);
const assetCache = 'vmx-assets-v1';
const absolute = input => new URL(typeof input === 'string' ? input : input.url, ORIGIN).href;

function response(body, options) {
  const value = new Response(body, options);
  // Network responses in a same-origin service worker have type "basic".
  Object.defineProperty(value, 'type', { value: 'basic' });
  return value;
}

function worker({ clients = [], network = async () => response('network'), schedule = setTimeout } = {}) {
  const listeners = new Map(), stores = new Map(), inspections = [];
  let activations = 0;
  let writeBarrier = Promise.resolve();
  let beforeRead = () => {};
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async match(input) { await beforeRead(name, input); return store.get(absolute(input))?.clone(); },
        async keys() { return [...store.keys()].map(url => new Request(url)); },
        async delete(input) { return store.delete(absolute(input)); },
        async put(input, value) { await writeBarrier; store.set(absolute(input), value.clone()); },
        async add(input) {
          const value = await context.fetch(new Request(absolute(input)));
          if (!value.ok) throw new Error('precache failed');
          await this.put(input, value);
        },
      };
    },
    async match(input) {
      for (const store of stores.values()) {
        const value = store.get(absolute(input));
        if (value) return value.clone();
      }
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
  const context = {
    caches, URL, Response, AbortController, setTimeout: schedule, clearTimeout,
    Request: class extends Request { constructor(input, init) { super(absolute(input), init); } },
    fetch: (...args) => network(...args),
    self: {
      location: { origin: ORIGIN },
      registration: { scope: `${ORIGIN}/` },
      clients: {
        async claim() {},
        async matchAll(options) { inspections.push(options); if (clients instanceof Error) throw clients; return clients; },
      },
      addEventListener(type, callback) { listeners.set(type, callback); },
      async skipWaiting() { activations++; },
    },
  };
  vm.runInNewContext(source, context);
  return {
    caches, stores, inspections,
    get activations() { return activations; },
    setClients(value) { clients = value; },
    setNetwork(value) { network = value; },
    setWriteBarrier(value) { writeBarrier = value; },
    setReadHook(value) { beforeRead = value; },
    dispatch(type, request, extra = {}) {
      const pending = [];
      let output;
      listeners.get(type)({
        request, ...extra,
        waitUntil(work) { pending.push(work); },
        respondWith(work) { output = work; },
      });
      return { pending, response: output, async settled() { for (let index = 0; index < pending.length; index++) await pending[index]; } };
    },
    request(path, overrides = {}) {
      return this.dispatch('fetch', { url: absolute(path), method: 'GET', mode: 'cors', headers: new Headers(), ...overrides });
    },
    message(data) { return this.dispatch('message', undefined, { data }); },
  };
}

const offline = async () => { throw new Error('offline'); };

for (const message of ['SKIP_WAITING', 'ACTIVATE_WHEN_SESSION_SAFE']) {
  test(message + ' cannot take over an open document', async () => {
    const app = worker({ clients: [{ id: 'legacy-or-modern', url: ORIGIN + '/app/notes' }] });
    await app.message(message).settled();
    assert.equal(app.activations, 0);
    assert.equal(app.inspections.length, 0, 'natural activation needs no capability protocol');
  });
}

test('background installation does not request an early activation', async () => {
  const app = worker(); await app.dispatch('install').settled();
  assert.equal(app.activations, 0);
});

test('a transient runtime inspection failure preserves the usable prior offline shell', async () => {
  const app = worker({ network: offline, clients: [{ id: 'open-legacy-tab' }] });
  await (await app.caches.open('vmx-runtime-previous')).put('/', response('previous usable shell'));
  app.setReadHook(name => { if (name === 'vmx-runtime-previous') throw new Error('transient cache read'); });
  await app.dispatch('activate').settled();
  assert.ok(app.stores.has('vmx-runtime-previous'));
  app.setReadHook(() => {});
  const navigation = app.request('/app/notes', { mode: 'navigate' });
  assert.equal(await (await navigation.response).text(), 'previous usable shell');
});

test('failed prior-shell inspection during install cannot publish unvisited new HTML', async () => {
  const requests = [];
  const app = worker({ network: async request => {
    requests.push(new URL(request.url).pathname);
    return response('unvisited new document');
  } });
  await (await app.caches.open('vmx-runtime-previous')).put('/', response('previous visited document'));
  app.setReadHook(name => { if (name === 'vmx-runtime-previous') throw new Error('transient read'); });
  await app.dispatch('install').settled();
  assert.equal(requests.includes('/'), false, 'an inspection failure is not an absent old shell');
  assert.ok(requests.includes('/manifest.webmanifest'), 'other best-effort precaching continues');
  assert.equal(await (await app.caches.open(runtime)).match('/'), undefined);
  app.setReadHook(() => {});
  await app.dispatch('activate').settled();
  app.setNetwork(offline);
  const navigation = app.request('/app/notes', { mode: 'navigate' });
  assert.equal(await (await navigation.response).text(), 'previous visited document');
});

test('an offline worker install cannot delete the previous navigation shell', async () => {
  const app = worker({ network: offline });
  const old = await app.caches.open('vmx-runtime-previous');
  await old.put('/', response('<html>previous working document</html>'));
  await app.dispatch('install').settled();
  await app.dispatch('activate').settled();
  const navigation = app.request('/app/notes', { mode: 'navigate' });
  assert.match(await (await navigation.response).text(), /previous working document/);
  assert.equal((await navigation.response).status, 200);
});

test('a successful background install cannot displace the visited shell with unvisited HTML', async () => {
  const requests = [];
  const app = worker({ network: async request => { requests.push(new URL(request.url).pathname); return response('unvisited new build'); } });
  await (await app.caches.open('vmx-runtime-previous')).put('/', response('<script src="/assets/visited-A.js"></script>'));
  await (await app.caches.open(assetCache)).put('/assets/visited-A.js', response('working entry A'));
  await app.dispatch('install').settled();
  await app.dispatch('activate').settled();
  assert.equal(requests.includes('/'), false, 'background install must not publish HTML whose entry has never loaded');
  assert.equal(await (await app.caches.open(runtime)).match('/'), undefined);
  assert.ok(requests.includes('/manifest.webmanifest'), 'small icon/manifest precaching remains available');
  app.setNetwork(offline);
  const document = app.request('/app/unvisited-route', { mode: 'navigate' });
  assert.match(await (await document.response).text(), /visited-A\.js/);
  const entry = app.request('/assets/visited-A.js');
  assert.equal(await (await entry.response).text(), 'working entry A');
});

test('the first install still precaches a root when no earlier shell exists', async () => {
  const app = worker({ network: async () => response('first shell') });
  await app.dispatch('install').settled();
  assert.equal(await (await (await app.caches.open(runtime)).match('/')).text(), 'first shell');
});

test('runtime cleanup retains only the newest previous shell and preserves offline libraries', async () => {
  const app = worker();
  await (await app.caches.open('vmx-runtime-old')).put('/', response('old'));
  await (await app.caches.open('vmx-runtime-newer')).put('/', response('newer'));
  await (await app.caches.open('vmx-runtime-failed-install')).put('/favicon.svg', response('icon only'));
  const persistent = ['vmx-lib-docs-v1', 'vmx-atlas-models-v1', 'vmx-atlas-shell-v1', 'vmx-library-catalog-v1'];
  for (const name of persistent) await (await app.caches.open(name)).put('/kept', response(name));
  await app.dispatch('install').settled();
  await app.dispatch('activate').settled();
  assert.deepEqual((await app.caches.keys()).filter(name => name.startsWith('vmx-runtime-')).sort(), [runtime, 'vmx-runtime-newer'].sort());
  for (const name of persistent) assert.equal(await (await (await app.caches.open(name)).match('/kept')).text(), name);
});

test('offline navigation prefers the current exact document and current root over older cached shells', async () => {
  const app = worker({ network: offline });
  const older = await app.caches.open('vmx-runtime-previous');
  await older.put('/', response('old root'));
  await older.put('/app/notes', response('old notes route'));
  const current = await app.caches.open(runtime);
  await current.put('/', response('current root'));
  await current.put('/app/notes', response('current notes route'));
  for (const [path, expected] of [['/app/notes', 'current notes route'], ['/app/library', 'current root']]) {
    const load = app.request(path, { mode: 'navigate' });
    assert.equal(await (await load.response).text(), expected);
  }
});

test('a missing current route uses the same previous route, never an unrelated cached document', async () => {
  const app = worker({ network: offline });
  const older = await app.caches.open('vmx-runtime-previous');
  await older.put('/', response('previous root'));
  await older.put('/app/notes', response('previous notes route'));
  await (await app.caches.open(runtime)).put('/app/videos', response('current videos route'));
  await (await app.caches.open('vmx-atlas-shell-v1')).put('/app/library', response('unrelated Atlas cache entry'));
  const sameRoute = app.request('/app/notes', { mode: 'navigate' });
  assert.equal(await (await sameRoute.response).text(), 'previous notes route');
  const unknownRoute = app.request('/app/library', { mode: 'navigate' });
  assert.equal(await (await unknownRoute.response).text(), 'previous root');
  const missingData = app.request('/uncached.json');
  assert.equal((await missingData.response).status, 503);
});

test('another open tab protects old immutable assets, including uncontrolled tabs', async () => {
  const app = worker({ clients: [{ id: 'old-study-tab' }, { id: 'new-tab' }] });
  const cache = await app.caches.open(assetCache);
  for (let index = 0; index < 300; index++) await cache.put(`/assets/old-${index}.js`, response(`old ${index}`));
  const load = app.request('/assets/new.js');
  assert.equal(await (await load.response).text(), 'network');
  await load.settled();
  assert.equal(await (await cache.match('/assets/old-0.js')).text(), 'old 0');
  assert.equal((await cache.keys()).length, 301);
  assert.equal(app.inspections[0].includeUncontrolled, true);
  assert.equal(app.inspections[0].type, 'window');
  app.setNetwork(offline);
  const oldTabLoad = app.request('/assets/old-0.js');
  assert.equal(await (await oldTabLoad.response).text(), 'old 0');
});

test('asset cleanup resumes and stays bounded when no window remains', async () => {
  const app = worker({ schedule: callback => callback() });
  const cache = await app.caches.open(assetCache);
  for (let index = 0; index < 304; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  await app.message('TRIM_ASSETS_IF_UNUSED').settled();
  assert.equal((await cache.keys()).length, 300);
  assert.equal(await cache.match('/assets/old-0.js'), undefined);
  const load = app.request('/assets/new.js');
  await load.response;
  await load.settled();
  assert.equal((await cache.keys()).length, 300);
  assert.ok(await cache.match('/assets/new.js'));
});

test('failed client inspection preserves cached assets', async () => {
  const app = worker({ clients: new Error('client enumeration failed'), schedule: callback => callback() });
  const cache = await app.caches.open(assetCache);
  for (let index = 0; index < 301; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  await app.message('TRIM_ASSETS_IF_UNUSED').settled();
  assert.equal((await cache.keys()).length, 301);
});

test('cleanup preserves complete cached shell graphs larger than 300 and removes only obsolete assets', async () => {
  const app = worker({ network: async () => { throw new Error('cleanup must never fetch'); }, schedule: callback => callback() });
  const cache = await app.caches.open(assetCache);
  await (await app.caches.open('vmx-runtime-previous')).put('/', response('<script src="/assets/main-A.js"></script><link href="/assets/theme-A.css">'));
  await (await app.caches.open(runtime)).put('/app/notes', response('<script src="/assets/main-B.js"></script>', { headers: { 'Content-Type': 'text/html' } }));
  const mapped = Array.from({ length: 325 }, (_, index) => `assets/chunk-${index}-hash.js`);
  const protectedFiles = new Map([
    ['/assets/main-A.js', `import './React-hash.js'; import('./Home-hash.js'); const __vite__mapDeps=${JSON.stringify(mapped)};`],
    ['/assets/Home-hash.js', 'import "./React-hash.js";'],
    ['/assets/React-hash.js', 'import "./Home-hash.js";'],
    ['/assets/main-B.js', 'import("./Home-hash.js");'],
    ['/assets/theme-A.css', '@font-face{src:url(./font-hash.woff2)}'],
    ['/assets/font-hash.woff2', 'font bytes'],
    ...mapped.map(path => [`/${path}`, 'export const value = 1;']),
  ]);
  for (const [path, body] of protectedFiles) await cache.put(path, response(body));
  for (let index = 0; index < 8; index++) await cache.put(`/assets/obsolete-${index}.js`, response('obsolete'));
  await app.message('TRIM_ASSETS_IF_UNUSED').settled();
  assert.equal((await cache.keys()).length, protectedFiles.size, 'a usable build may exceed the soft target');
  for (const path of protectedFiles.keys()) assert.ok(await cache.match(path), `${path} belongs to a retained offline shell`);
  assert.equal(await cache.match('/assets/obsolete-0.js'), undefined);
  assert.equal(await cache.match('/assets/obsolete-7.js'), undefined);
});

test('a client appearing during dependency scanning cancels all eviction', async () => {
  const app = worker({ schedule: callback => callback() });
  const cache = await app.caches.open(assetCache);
  await (await app.caches.open(runtime)).put('/', response('<script src="/assets/main-hash.js"></script>'));
  await cache.put('/assets/main-hash.js', response('export const loaded = true;'));
  for (let index = 0; index < 302; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  app.setReadHook((name, input) => {
    if (name === assetCache && absolute(input).endsWith('/main-hash.js')) app.setClients([{ id: 'new-window' }]);
  });
  await app.message('TRIM_ASSETS_IF_UNUSED').settled();
  assert.equal((await cache.keys()).length, 303);
  assert.equal(app.inspections.length, 2, 'client ownership must be checked after scanning');
});

test('a dependency cache read failure cancels all eviction', async () => {
  const app = worker({ schedule: callback => callback() });
  const cache = await app.caches.open(assetCache);
  await (await app.caches.open(runtime)).put('/', response('<script src="/assets/main-hash.js"></script>'));
  await cache.put('/assets/main-hash.js', response('export const loaded = true;'));
  for (let index = 0; index < 302; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  app.setReadHook((name, input) => {
    if (name === assetCache && absolute(input).endsWith('/main-hash.js')) throw new Error('cache temporarily unavailable');
  });
  await app.message('TRIM_ASSETS_IF_UNUSED').settled();
  assert.equal((await cache.keys()).length, 303);
});

test('activation does not wait for optional client enumeration or asset maintenance', async () => {
  let releaseClients, activationSettled = false;
  const app = worker({ clients: new Promise(resolve => { releaseClients = resolve; }) });
  const activation = app.dispatch('activate').settled().then(() => { activationSettled = true; });
  await new Promise(setImmediate);
  try {
    assert.equal(activationSettled, true, 'optional cleanup cannot keep the new worker activating');
    assert.equal(app.inspections.length, 0, 'takeover must not enumerate clients alongside claim');
  } finally {
    releaseClients([]);
    await activation;
  }
});

test('a last-tab departure keeps delayed cleanup alive and then trims unused assets', async () => {
  const scheduled = [];
  const app = worker({ clients: [{ id: 'departing-tab' }], schedule: (callback, delay) => scheduled.push({ callback, delay }) });
  const cache = await app.caches.open(assetCache);
  for (let index = 0; index < 303; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  const message = app.message('TRIM_ASSETS_IF_UNUSED');
  assert.equal(message.pending.length, 1, 'closing the page must not cancel the worker cleanup');
  assert.equal(scheduled.length, 1);
  assert.ok(scheduled[0].delay > 0 && scheduled[0].delay <= 2000, 'allow departure to finish with one bounded delay');
  assert.equal((await cache.keys()).length, 303, 'do not trim synchronously while the tab is departing');
  app.setClients([]);
  scheduled[0].callback();
  await message.settled();
  assert.equal((await cache.keys()).length, 300);
});

test('a delayed departure cleanup rechecks and preserves another live window', async () => {
  const scheduled = [];
  const app = worker({ schedule: callback => scheduled.push(callback) });
  const cache = await app.caches.open(assetCache);
  for (let index = 0; index < 303; index++) await cache.put(`/assets/old-${index}.js`, response('old'));
  const message = app.message('TRIM_ASSETS_IF_UNUSED');
  app.setClients([{ id: 'another-study-tab' }]);
  scheduled[0]();
  await message.settled();
  assert.equal((await cache.keys()).length, 303);
  assert.equal(app.inspections[0].includeUncontrolled, true);
});

for (const [kind, path, overrides] of [
  ['immutable asset', '/assets/view.js', {}],
  ['navigation', '/app/notes', { mode: 'navigate' }],
  ['runtime data', '/public-data.json', {}],
  ['uncached image', '/figure.png', { destination: 'image' }],
  ['library document', '/api/library-blob?h=abcdef12', {}],
]) {
  test(`${kind} cache write stays alive after the response is returned`, async () => {
    const app = worker({ clients: [{ id: 'active-tab' }], network: async () => response('bytes', { headers: { 'Content-Length': '5' } }) });
    let release;
    app.setWriteBarrier(new Promise(resolve => { release = resolve; }));
    const load = app.request(path, overrides);
    assert.equal(await (await load.response).text(), 'bytes');
    assert.ok(load.pending.length > 0, 'the fetch must extend the worker lifetime for its cache write');
    let durable = false;
    const complete = load.settled().then(() => { durable = true; });
    await Promise.resolve();
    assert.equal(durable, false, 'network response should not wait for a slow cache write');
    release();
    await complete;
    const cached = path.startsWith('/api/library-blob') ? '/__lib-doc/abcdef12' : path;
    assert.equal(await (await app.caches.match(cached)).text(), 'bytes');
  });
}

test('cached image responds immediately while revalidation remains attached to the fetch event', async () => {
  let finishNetwork;
  const app = worker({ network: () => new Promise(resolve => { finishNetwork = resolve; }) });
  await (await app.caches.open(runtime)).put('/figure.png', response('cached'));
  const load = app.request('/figure.png', { destination: 'image' });
  assert.equal(await (await load.response).text(), 'cached');
  assert.equal(load.pending.length, 1);
  finishNetwork(response('updated'));
  await load.settled();
  assert.equal(await (await app.caches.match('/figure.png')).text(), 'updated');
});

test('cache quota failures cannot reject a successful network response', async () => {
  const app = worker({ clients: [{ id: 'active-tab' }] });
  const failure = Promise.reject(new Error('quota exceeded'));
  failure.catch(() => {});
  app.setWriteBarrier(failure);
  const load = app.request('/assets/view.js');
  assert.equal(await (await load.response).text(), 'network');
  await assert.doesNotReject(() => load.settled());
});
