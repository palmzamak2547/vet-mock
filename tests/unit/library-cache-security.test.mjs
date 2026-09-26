import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mintBlobToken, verifyBlobToken } from '../../api/_lib/blob-token.js';
import blobHandler from '../../api/library-blob.js';

const ORIGIN = 'https://vetmock.test';
const DOCS = 'vmx-lib-docs-v1', CATALOG = 'vmx-library-catalog-v1';
const ACCESS = '/__vmx/library-access.json', SNAPSHOT = '/__vmx/library-catalog.json';
const epoch = 'test-active-session';
const hash = text => crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
const publicBytes = 'public teaching deck', privateBytes = 'restricted teaching deck';
const publicHash = hash(publicBytes), privateHash = hash(privateBytes);
const source = file => process.env.VMX_SECURITY_BASELINE
  ? execFileSync('git', ['show', `bdfc2a4616f391cc71ae60121fa05fcbf74b04a1:${file}`], { encoding: 'utf8' })
  : fs.readFileSync(file, 'utf8');

function memoryCaches() {
  const stores = new Map();
  const key = input => new URL(input?.url || input, ORIGIN).href;
  return {
    stores,
    has: async name => stores.has(name),
    delete: async name => stores.delete(name),
    keys: async () => [...stores.keys()],
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name); // deleting a cache detaches this handle
      return {
        match: async input => store.get(key(input))?.clone(),
        put: async (input, response) => { store.set(key(input), response.clone()); },
        delete: async input => store.delete(key(input)),
        keys: async () => [...store.keys()].map(url => new Request(url)),
      };
    },
  };
}

function worker(caches = memoryCaches()) {
  const listeners = new Map();
  let clients = [{ id: 'reader', url: ORIGIN + '/app/library' }];
  const context = {
    caches, crypto: crypto.webcrypto, URL, Headers, Response, MessageChannel, AbortController, setTimeout, clearTimeout,
    Request: class extends Request { constructor(input, init) { super(new URL(input?.url || input, ORIGIN), init); } },
    fetch: async () => { throw Error('offline'); },
    self: {
      location: { origin: ORIGIN },
      clients: { matchAll: async () => clients },
      addEventListener: (name, callback) => listeners.set(name, callback),
    },
  };
  vm.runInNewContext(source('public/sw.js'), context);
  return {
    caches, context,
    setClients: value => { clients = value; },
    register() { listeners.get('message')({ data: { type: 'LIBRARY_ACCESS', epoch }, source: clients[0], ports: [] }); },
    message(data, source, ports) { listeners.get('message')({ data, source, ports, waitUntil: work => work.catch(() => {}) }); },
    async access(signedIn, accessEpoch = epoch) { await (await caches.open(CATALOG)).put(ACCESS, Response.json({ signedIn, epoch: accessEpoch })); },
    request(query, { clientId = 'reader', mode = 'cors' } = {}) {
      const pending = [];
      let response;
      listeners.get('fetch')({
        clientId, request: { url: ORIGIN + '/api/library-blob?' + query, method: 'GET', mode, headers: new Headers() },
        respondWith: promise => { response = promise; }, waitUntil: promise => pending.push(promise),
      });
      return { response, settled: async () => { for (let n = 0; n < pending.length; n++) await pending[n]; } };
    },
  };
}

async function seed(app, bytes, h, access) {
  const headers = access ? { 'X-VetMock-Library-Access': access, 'X-VetMock-Library-Hash': hash(bytes) } : {};
  await (await app.caches.open(DOCS)).put('/__lib-doc/' + h, new Response(bytes, { headers }));
}

test('unsigned restricted cache requests fail closed after reload, guest boot and closed app tabs', async () => {
  const app = worker();
  await app.access(false);
  await seed(app, privateBytes, privateHash);
  assert.equal((await app.request(`offline=1&h=${privateHash}`).response).status, 503);
  await app.access(true);
  app.register();
  assert.equal(await (await app.request(`offline=1&h=${privateHash}&a=${epoch}`).response).text(), privateBytes);
  assert.equal((await app.request(`offline=1&h=${privateHash}&a=old-session`).response).status, 503);
  app.setClients([]);
  assert.equal((await app.request(`offline=1&h=${privateHash}&a=${epoch}`, { clientId: '', mode: 'navigate' }).response).status, 503);
});

test('legacy public entries require the actual content hash, including historically poisoned public keys', async () => {
  const app = worker();
  await app.access(false);
  await (await app.caches.open(CATALOG)).put(SNAPSHOT, Response.json({ docs: [{ status: 'public', sha256_16: publicHash }] }));
  await seed(app, privateBytes, publicHash);
  assert.equal((await app.request(`offline=1&h=${publicHash}`).response).status, 503);
  await seed(app, publicBytes, publicHash);
  assert.equal(await (await app.request(`offline=1&h=${publicHash}`).response).text(), publicBytes);
});

test('a held restricted URL survives worker restart only when its live app confirms the current session', async () => {
  const app = worker();
  await app.access(true); await seed(app, privateBytes, privateHash);
  app.setClients([{ id: 'reader', url: ORIGIN + '/app/pdf', postMessage: (_data, ports) => ports[0].postMessage({ epoch }) }]);
  assert.equal(await (await app.request(`offline=1&h=${privateHash}&a=${epoch}`).response).text(), privateBytes);
  const native = { id: 'native-pdf', url: `${ORIGIN}/api/library-blob?offline=1&h=${privateHash}&a=${epoch}` };
  app.setClients([{ id: 'reader', url: ORIGIN + '/app/pdf' }, native]);
  assert.equal(await (await app.request(`offline=1&h=${privateHash}&a=${epoch}`, { clientId: native.id }).response).text(), privateBytes);
  app.setClients([native]);
  assert.equal((await app.request(`offline=1&h=${privateHash}&a=${epoch}`, { clientId: native.id }).response).status, 503);
  const restarted = worker(app.caches);
  restarted.setClients([{ id: 'reader', url: ORIGIN + '/app/pdf', postMessage: (_data, ports) => ports[0].postMessage({ epoch: null }) }]);
  assert.equal((await restarted.request(`offline=1&h=${privateHash}&a=${epoch}`).response).status, 503);
  restarted.setClients([]);
  assert.equal((await restarted.request(`offline=1&h=${privateHash}&a=${epoch}`, { clientId: '', mode: 'navigate' }).response).status, 503);
});

test('network responses cannot poison another hash or downgrade restricted bytes into public cache', async () => {
  const app = worker();
  await app.access(true); app.register();
  app.context.fetch = async () => new Response(privateBytes, { headers: { 'Content-Length': String(privateBytes.length), 'X-VetMock-Library-Access': 'restricted' } });
  const wrong = app.request(`t=signed&h=${publicHash}&a=${epoch}`);
  await wrong.response; await wrong.settled();
  assert.equal(await (await app.caches.open(DOCS)).match('/__lib-doc/' + publicHash), undefined);
  const valid = app.request(`t=signed&h=${privateHash}&a=${epoch}`);
  await valid.response; await valid.settled();
  await app.access(false, 'signed-out');
  assert.equal((await app.request(`offline=1&h=${privateHash}&a=${epoch}`).response).status, 503);
});

test('a logout during download prevents a late restricted write; public offline downloads still work', async () => {
  const app = worker();
  await app.access(true); app.register();
  let deliver;
  app.context.fetch = () => new Promise(resolve => { deliver = resolve; });
  const inflight = app.request(`t=signed&h=${privateHash}&a=${epoch}`);
  while (!deliver) await new Promise(resolve => setImmediate(resolve));
  await app.access(false, 'signed-out');
  deliver(new Response(privateBytes, { headers: { 'Content-Length': String(privateBytes.length), 'X-VetMock-Library-Access': 'restricted' } }));
  await inflight.response; await inflight.settled();
  assert.equal(await (await app.caches.open(DOCS)).match('/__lib-doc/' + privateHash), undefined);
  app.context.fetch = async () => new Response(publicBytes, { headers: { 'Content-Length': String(publicBytes.length), 'X-VetMock-Library-Access': 'public' } });
  const publicDownload = app.request(`t=signed-public&h=${publicHash}`);
  await publicDownload.response; await publicDownload.settled();
  app.context.fetch = async () => { throw Error('offline'); };
  assert.equal(await (await app.request(`offline=1&h=${publicHash}`).response).text(), publicBytes);
});

let moduleLoads = 0;
async function library(caches) {
  const store = { getItem: () => null, length: 0 };
  globalThis.window = new EventTarget(); window.localStorage = store;
  globalThis.localStorage = globalThis.sessionStorage = store;
  globalThis.caches = caches;
  const folder = dirname(resolve('src/lib/library.js'));
  const code = source('src/lib/library.js').replace(/from '(\.[^']+)'/g, (_match, path) => `from '${pathToFileURL(resolve(folder, path)).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(code + `\n// fresh ${++moduleLoads}`).toString('base64'));
}

test('cold guest boot detaches old writers, preserves only verified public bytes and leaves PDF/ink caches alone', async () => {
  const caches = memoryCaches(), app = worker(caches);
  await (await caches.open(CATALOG)).put(SNAPSHOT, Response.json({ docs: [{ status: 'public', sha256_16: publicHash }] }));
  await seed(app, publicBytes, publicHash);
  await seed(app, privateBytes, privateHash);
  await seed(app, 'unknown old document', hash('unknown old document'));
  const old = await caches.open(DOCS);
  const mine = await caches.open('vmx-own-pdf-ink-test'); await mine.put('/own.pdf', new Response('own ink'));
  const lib = await library(caches);
  await lib.setLibraryAccess(false);
  await old.put('/__lib-doc/' + privateHash, new Response('late restricted write'));
  const next = await caches.open(DOCS);
  assert.equal(await next.match('/__lib-doc/' + privateHash), undefined);
  assert.equal((await next.keys()).length, 1);
  assert.equal(await (await next.match('/__lib-doc/' + publicHash)).text(), publicBytes);
  assert.equal(await (await mine.match('/own.pdf')).text(), 'own ink');
});

test('a guest tab boot preserves another live signed-in reader without granting the guest access', async () => {
  const app = worker();
  const libA = await library(app.caches);
  await libA.setLibraryAccess(true);
  await seed(app, privateBytes, privateHash);
  const state = await (await (await app.caches.open(CATALOG)).match(ACCESS)).json();
  const reader = { id: 'reader', url: ORIGIN + '/app/pdf', postMessage: (_data, ports) => ports[0].postMessage({ epoch: state.epoch }) };
  const guest = { id: 'guest', url: ORIGIN + '/app/library', postMessage: (_data, ports) => ports[0].postMessage({ epoch: null }) };
  app.setClients([reader, guest]);
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { serviceWorker: {
    addEventListener() {}, controller: { postMessage: (data, ports) => app.message(data, guest, ports) },
  } } });
  try {
    const libB = await library(app.caches);
    await libB.setLibraryAccess(false, { initial: true });
    assert.equal(await (await app.request(`offline=1&h=${privateHash}&a=${state.epoch}`).response).text(), privateBytes);
    assert.equal((await app.request(`offline=1&h=${privateHash}&a=${state.epoch}`, { clientId: 'guest' }).response).status, 503);
    assert.ok(await (await app.caches.open(DOCS)).match('/__lib-doc/' + privateHash));
  } finally {
    if (previousNavigator) Object.defineProperty(globalThis, 'navigator', previousNavigator);
    else delete globalThis.navigator;
  }
});

test('signed access status is public only by explicit server designation, including HTTP HEAD caching', async () => {
  const previous = { ...process.env };
  process.env.CLOUDFLARE_API_TOKEN = 'unit-test-only'; process.env.R2_ACCOUNT_ID = 'unit-test-account';
  try {
    for (const status of [undefined, 'restricted', 'public']) {
      const token = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/x/file.pdf', mime: 'application/pdf', byte_size: 10, status });
      assert.equal(verifyBlobToken(token.t, token.s).a, status === 'public' ? 'public' : 'restricted');
      const headers = new Map();
      await blobHandler({ method: 'HEAD', url: '/api/library-blob?' + new URLSearchParams(token), headers: {} }, { setHeader: (key, value) => headers.set(key, value), end() {} });
      assert.equal(headers.get('X-VetMock-Library-Access'), status === 'public' ? 'public' : 'restricted');
      assert.match(headers.get('Cache-Control'), status === 'public' ? /^private, max-age=/ : /^no-store$/);
    }
  } finally {
    process.env.CLOUDFLARE_API_TOKEN = previous.CLOUDFLARE_API_TOKEN;
    process.env.R2_ACCOUNT_ID = previous.R2_ACCOUNT_ID;
    if (previous.CLOUDFLARE_API_TOKEN === undefined) delete process.env.CLOUDFLARE_API_TOKEN;
    if (previous.R2_ACCOUNT_ID === undefined) delete process.env.R2_ACCOUNT_ID;
  }
});
