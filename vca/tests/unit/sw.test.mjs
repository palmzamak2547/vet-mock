// The service worker (public/sw.js) in a stand-in for the worker scope. What a returning visitor
// meets when the network is slow, hangs or is gone: pages come from the network first, but a
// network that never answers does not hold the visitor on a blank page.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const SOURCE = fs.readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const ORIGIN = 'https://vca.vetmock.com';
const html = (text, init) => new Response(text, { status: 200, headers: { 'content-type': 'text/html' }, ...init });
const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };

/**
 * Runs the worker's script against a fake scope. `network` is the test's own fetch: it gets the
 * request and returns a promise the test settles when it likes. `cached` is what the cache
 * holds for the app shell ("/") to begin with, if anything.
 */
function worker({ cached = null, network }) {
  const listeners = {};
  const store = new Map();
  if (cached) store.set('/', cached);
  const key = (request) => new URL(typeof request === 'string' ? request : request.url, ORIGIN).pathname;
  const cache = {
    add: async (path) => { store.set(path, html('shell from install')); },
    put: async (request, response) => { store.set(key(request), response); },
    keys: async () => [...store.keys()].map((path) => ({ url: `${ORIGIN}${path}` })),
    delete: async (request) => store.delete(key(request)),
  };
  const scope = {
    self: {
      location: { origin: ORIGIN },
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: () => Promise.resolve(),
      clients: { claim: () => Promise.resolve() },
    },
    caches: {
      open: async () => cache,
      match: async (request) => store.get(key(request)),
      keys: async () => ['vca-v2'],
      delete: async () => true,
    },
    fetch: (request) => network(request),
    URL,
    Promise,
    // The test's clock: read at call time, so mock.timers can take it over.
    setTimeout: (...args) => globalThis.setTimeout(...args),
    clearTimeout: (...args) => globalThis.clearTimeout(...args),
  };
  vm.runInNewContext(SOURCE, scope);

  /** A page navigation, as the browser hands it to the worker. */
  const navigate = (path = '/exam') => {
    const waits = [];
    let response = null;
    const event = {
      request: { method: 'GET', url: `${ORIGIN}${path}`, mode: 'navigate' },
      respondWith: (p) => { response = p; },
      waitUntil: (p) => { waits.push(p); },
    };
    listeners.fetch(event);
    const settled = { done: false, value: undefined };
    response?.then((v) => { settled.done = true; settled.value = v; });
    return { waits, settled, response };
  };
  return { navigate, store };
}

test('the network answers in time: its page is shown, and kept for next time', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const shell = html('old shell');
    let answer;
    const w = worker({ cached: shell, network: () => new Promise((resolve) => { answer = resolve; }) });
    const nav = w.navigate();
    assert.ok(nav.response, 'respondWith is called at once');
    mock.timers.tick(1200);
    await flush();
    assert.equal(nav.settled.done, false, 'still waiting on the network at 1.2 s');
    const fresh = html('new release');
    answer(fresh);
    await flush();
    assert.equal(nav.settled.value, fresh, 'the network page is what the visitor gets');
    await Promise.all(nav.waits);
    assert.equal(await w.store.get('/').text(), 'new release', 'the copy is the new release');
  } finally { mock.timers.reset(); }
});

test('a network that never answers: the copy answers after 3 s, not sooner', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const shell = html('cached shell');
    const w = worker({ cached: shell, network: () => new Promise(() => {}) });
    const nav = w.navigate();
    mock.timers.tick(2999);
    await flush();
    assert.equal(nav.settled.done, false, 'a network that is only slow is still waited for at 2.999 s');
    mock.timers.tick(1);
    await flush();
    assert.equal(nav.settled.done, true);
    assert.equal(nav.settled.value, shell, 'the cached shell opens the app');
  } finally { mock.timers.reset(); }
});

test('the request carries on after the copy has answered, and a late answer refreshes the copy', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    let answer;
    const w = worker({ cached: html('stale shell'), network: () => new Promise((resolve) => { answer = resolve; }) });
    const nav = w.navigate();
    mock.timers.tick(3000);
    await flush();
    assert.equal(await nav.settled.value.text(), 'stale shell');
    // The worker is held awake for the request that is still out, not let go with the answer.
    assert.equal(nav.waits.length, 1, 'waitUntil was called while the event was live');
    answer(html('release that came late'));
    await Promise.all(nav.waits);
    assert.equal(await w.store.get('/').text(), 'release that came late', 'the next visit finds it');
  } finally { mock.timers.reset(); }
});

test('a network that is gone: the copy answers at once', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const shell = html('cached shell');
    const w = worker({ cached: shell, network: () => Promise.reject(new TypeError('Failed to fetch')) });
    const nav = w.navigate();
    await flush();
    assert.equal(nav.settled.done, true, 'no waiting for the clock');
    assert.equal(nav.settled.value, shell);
    await Promise.all(nav.waits);
  } finally { mock.timers.reset(); }
});

test('with no copy yet, a slow network is waited for however long it takes', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    let answer;
    const w = worker({ network: () => new Promise((resolve) => { answer = resolve; }) });
    const nav = w.navigate();
    mock.timers.tick(30_000);
    await flush();
    assert.equal(nav.settled.done, false, 'nothing to answer with: the page is still being waited for');
    const page = html('first visit');
    answer(page);
    await flush();
    assert.equal(nav.settled.value, page);
  } finally { mock.timers.reset(); }
});

test('a page that cannot be kept is still shown: an error answer is not cached', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const shell = html('good shell');
    const w = worker({ cached: shell, network: () => Promise.resolve(new Response('down', { status: 503 })) });
    const nav = w.navigate();
    await flush();
    assert.equal(nav.settled.value.status, 503);
    await Promise.all(nav.waits);
    assert.equal(w.store.get('/'), shell, 'the good copy stays');
  } finally { mock.timers.reset(); }
});

test('a navigation that is not a page is shown but never kept as the shell (sitemap.xml)', async () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try {
    const shell = html('good shell');
    const xml = new Response('<urlset/>', { status: 200, headers: { 'content-type': 'application/xml' } });
    const w = worker({ cached: shell, network: () => Promise.resolve(xml) });
    const nav = w.navigate();
    await flush();
    assert.equal(nav.settled.value.headers.get('content-type'), 'application/xml');
    await Promise.all(nav.waits);
    assert.equal(w.store.get('/'), shell, 'the page shell stays');
  } finally { mock.timers.reset(); }
});
