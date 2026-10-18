// What the service worker (public/sw.js) stores, and where. The bank is hundreds of small files,
// and a set takes whichever shards its questions are in: kept in one cache with the app, a few mock
// exams' worth of shards pushed out the oldest files, which are the app's own entry scripts, and a
// first visit that ended offline found only the shell. A stand-in for the worker scope with named
// caches that hold real Response objects, a network the test answers, and the install, activate
// and fetch events driven as the browser drives them.
import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const SOURCE = fs.readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8');
const ORIGIN = 'https://vca.vetmock.com';
const html = (text) => new Response(text, { status: 200, headers: { 'content-type': 'text/html' } });
const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };

const SHELL_HTML = `<!doctype html><html><head>
<link rel="canonical" href="https://vca.vetmock.com/" />
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
<link rel="manifest" href="/manifest.webmanifest" />
<script src="/theme-boot.js"></script>
<link rel="preload" href="/fonts/anuphan-thai-var.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/art/hero.webp" as="image" />
<script type="module" crossorigin src="/assets/index-AAAA.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vendor-react-BBBB.js">
<link rel="stylesheet" crossorigin href="/assets/index-CCCC.css">
<link rel="stylesheet" href="https://elsewhere.test/outside.css">
<script src="//cdn.test/protocol-relative.js"></script>
</head><body><div id="root"></div></body></html>`;

const DEFAULT_ANSWER = (path) => (path === '/' ? html(SHELL_HTML) : new Response(`file ${path}`, { status: 200, headers: { 'content-type': 'text/plain' } }));

/** The worker, run against a fake scope. `answer(path)` is what the network says to a request. */
function worker({ answer = DEFAULT_ANSWER } = {}) {
  const listeners = {};
  const stores = new Map(); // cache name -> Map(pathname -> Response)
  const asked = [];
  const keysRead = {};
  const pathOf = (r) => new URL(typeof r === 'string' ? r : r.url, ORIGIN).pathname;
  const open = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      add: async (path) => {
        const res = await scope.fetch({ url: new URL(path, ORIGIN).href, mode: 'cors' });
        if (!res.ok) throw new TypeError(`bad status ${res.status}`);
        store.set(pathOf(path), res);
      },
      put: async (request, response) => { store.set(pathOf(request), response); },
      match: async (request) => store.get(pathOf(request))?.clone(),
      keys: async () => { keysRead[name] = (keysRead[name] || 0) + 1; return [...store.keys()].map((p) => ({ url: `${ORIGIN}${p}` })); },
      delete: async (request) => store.delete(pathOf(request)),
    };
  };
  const scope = {
    self: {
      location: { origin: ORIGIN },
      addEventListener: (type, fn) => { listeners[type] = fn; },
      skipWaiting: () => Promise.resolve(),
      clients: { claim: () => Promise.resolve() },
    },
    caches: {
      open: async (name) => open(name),
      match: async (request) => { for (const store of stores.values()) { const hit = store.get(pathOf(request)); if (hit) return hit.clone(); } return undefined; },
      keys: async () => [...stores.keys()],
      delete: async (name) => stores.delete(name),
    },
    fetch: async (request) => { const path = pathOf(request); asked.push(path); return answer(path); },
    URL,
    Promise,
    setTimeout: (...args) => globalThis.setTimeout(...args),
    clearTimeout: (...args) => globalThis.clearTimeout(...args),
  };
  vm.runInNewContext(SOURCE, scope);

  /** Lets the worker finish what it is held awake for, including a trim it scheduled for later. */
  const settle = async (waits) => {
    for (let round = 0; round < 6; round += 1) {
      await flush();
      mock.timers.tick(5000);
      await flush();
      await Promise.all(waits);
    }
  };
  const lifecycle = async (type) => {
    const waits = [];
    listeners[type]({ waitUntil: (p) => waits.push(p) });
    await settle(waits);
    return waits;
  };
  /** A request for a file, as a page makes it; resolves once the worker has answered and stored it. */
  const get = async (path) => {
    const waits = [];
    let response;
    listeners.fetch({ request: { method: 'GET', url: `${ORIGIN}${path}`, mode: 'cors' }, waitUntil: (p) => waits.push(p), respondWith: (p) => { response = p; } });
    const res = response ? await response : undefined;
    await settle(waits);
    return res;
  };
  const names = (cache) => [...(stores.get(cache)?.keys() || [])];
  return { install: () => lifecycle('install'), activate: () => lifecycle('activate'), get, stores, asked, keysRead, names, listeners, settle };
}

const timers = async (run) => {
  mock.timers.enable({ apis: ['setTimeout'] });
  try { await run(); } finally { mock.timers.reset(); }
};

test('installing stores the shell and the files it needs to draw, and only those', () => timers(async () => {
  const w = worker();
  await w.install();
  assert.deepEqual(w.names('vca-v3').sort(), ['/', '/assets/index-AAAA.js', '/assets/index-CCCC.css', '/assets/vendor-react-BBBB.js', '/fonts/anuphan-thai-var.woff2', '/theme-boot.js'].sort());
  assert.ok(!w.asked.some((p) => /outside|protocol-relative|icon|manifest|hero/.test(p)), `asked ${w.asked.join(', ')}`);
}));

test('a file the shell names that cannot be had does not stop the worker installing', () => timers(async () => {
  const w = worker({ answer: (path) => (path === '/assets/vendor-react-BBBB.js' ? new Response('gone', { status: 404 }) : DEFAULT_ANSWER(path)) });
  await w.install();
  assert.ok(w.names('vca-v3').includes('/'));
  assert.ok(w.names('vca-v3').includes('/assets/index-AAAA.js'));
  assert.ok(!w.names('vca-v3').includes('/assets/vendor-react-BBBB.js'));
}));

test('a shell that cannot be had does stop it: the worker is not installed on nothing', () => timers(async () => {
  const w = worker({ answer: () => new Response('down', { status: 503 }) });
  const waits = [];
  w.listeners.install({ waitUntil: (p) => waits.push(p) });
  await assert.rejects(waits[0], /bad status 503/);
  assert.equal(w.names('vca-v3').length, 0, 'nothing was stored');
}));

test('the bank has a cache of its own, so a flood of shards cannot push the app out', () => timers(async () => {
  const w = worker();
  await w.install();
  const appFiles = w.names('vca-v3');
  for (let i = 0; i < 1500; i += 1) await w.get(`/bank/swine-${i}.${String(i).padStart(8, '0')}.json`);
  assert.deepEqual(w.names('vca-v3'), appFiles, 'the app\'s files are untouched');
  assert.ok(w.names('vca-bank-v1').length <= 1200, `${w.names('vca-bank-v1').length} bank files kept`);
  assert.ok(w.names('vca-bank-v1').includes('/bank/swine-1499.00001499.json'), 'the newest are kept');
  assert.ok(!w.names('vca-bank-v1').includes('/bank/swine-0.00000000.json'), 'the oldest went first');
}));

test('figures live with the bank, and a file once stored is answered without the network', () => timers(async () => {
  const w = worker();
  await w.install();
  await w.get('/q/figure.0123456789.webp');
  await w.get('/bank/swine.index.abcdef01.json');
  assert.deepEqual(w.names('vca-bank-v1').sort(), ['/bank/swine.index.abcdef01.json', '/q/figure.0123456789.webp']);
  const before = w.asked.length;
  const again = await w.get('/bank/swine.index.abcdef01.json');
  assert.equal(await again.text(), 'file /bank/swine.index.abcdef01.json');
  assert.equal(w.asked.length, before, 'no request went out');
}));

test('a burst of new files is trimmed once, not once for each', () => timers(async () => {
  const w = worker();
  await w.install();
  // Forty shards in one breath, as a mock exam fetches them.
  const waits = [];
  const responses = Array.from({ length: 40 }, (_, i) => {
    let response;
    w.listeners.fetch({ request: { method: 'GET', url: `${ORIGIN}/bank/equine-${i}.${String(i).padStart(8, '0')}.json`, mode: 'cors' }, waitUntil: (p) => waits.push(p), respondWith: (p) => { response = p; } });
    return response;
  });
  await Promise.all(responses);
  await w.settle(waits);
  assert.equal(w.names('vca-bank-v1').length, 40);
  assert.equal(w.keysRead['vca-bank-v1'], 1, 'the bank cache\'s keys were read once');
}));

test('the app\'s hashed files, art and icons are kept in the app cache', () => timers(async () => {
  const w = worker();
  await w.install();
  for (const path of ['/assets/Practice-DDDD.js', '/art/plate.webp', '/icons/icon.svg']) {
    await w.get(path);
    assert.ok(w.names('vca-v3').includes(path), path);
  }
  assert.equal(w.names('vca-bank-v1').length, 0);
}));

test('the theme script comes from the cache and is refreshed behind it, like the fonts', () => timers(async () => {
  let version = 1;
  const w = worker({ answer: (path) => (path === '/theme-boot.js' ? new Response(`boot v${version}`) : DEFAULT_ANSWER(path)) });
  await w.install();
  version = 2;
  const first = await w.get('/theme-boot.js');
  assert.equal(await first.text(), 'boot v1', 'the stored copy answers at once');
  const second = await w.get('/theme-boot.js');
  assert.equal(await second.text(), 'boot v2', 'and the refresh behind it is there next time');
}));

test('a new worker clears the caches of the old ones and keeps its own two', () => timers(async () => {
  const w = worker();
  await w.install();
  await w.get('/bank/swine.index.abcdef01.json');
  w.stores.set('vca-v2', new Map([['/bank/swine.0123456789.json', html('the old whole domain')]]));
  w.stores.set('something-else', new Map());
  await w.activate();
  assert.deepEqual([...w.stores.keys()].sort(), ['vca-bank-v1', 'vca-v3']);
  assert.ok(w.names('vca-bank-v1').includes('/bank/swine.index.abcdef01.json'), 'the bank cache survives its worker\'s activation');
}));

test('the shell is never the one trimmed away', () => timers(async () => {
  const w = worker();
  await w.install();
  // 450 app files, past the 400 the app cache keeps; the shell was stored first and is the oldest.
  for (let i = 0; i < 450; i += 1) await w.get(`/assets/chunk-${i}.js`);
  const kept = w.names('vca-v3');
  assert.ok(kept.includes('/'), 'the shell stays');
  assert.ok(kept.length <= 401, `${kept.length} files kept`);
  assert.ok(!kept.includes('/assets/index-AAAA.js') || kept.includes('/assets/chunk-449.js'), 'the newest are kept');
}));
