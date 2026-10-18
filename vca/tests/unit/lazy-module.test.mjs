// A generated module that loads on demand must be askable again. The catalog and the document
// library are fetched with import() the first time a page wants them; when that fails the page
// shows a button, and the button has to do something: a rejection that stays cached answers with
// the old error for good, and in Chromium even a fresh import() of the same address fails again
// until the page is reloaded.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lazyModule } from '../../src/lib/lazy-module.js';
import { loadCatalog, loadLibrary, loadDomain, DOMAIN_CARDS } from '../../src/lib/bank.js';
import { installBankFetch } from '../support/bank-files.mjs';

const ORIGIN = 'https://vca.test';
const SRC = fileURLToPath(new URL('../../src/', import.meta.url));

/** The error Chromium raises for a chunk that did not arrive; Firefox words it differently but names the address too. */
const chromiumError = (chunk) => new TypeError(`Failed to fetch dynamically imported module: ${ORIGIN}/assets/${chunk}.js`);
const pickValue = (mod) => mod.VALUE;

test('a failed load is not remembered: the next call asks again', async () => {
  let calls = 0;
  const get = lazyModule(() => {
    calls += 1;
    return calls === 1 ? Promise.reject(new TypeError('Importing a module script failed.')) : Promise.resolve({ VALUE: 'catalog' });
  }, pickValue, { origin: ORIGIN });
  await assert.rejects(get(), /Importing a module script failed/);
  assert.equal(await get(), 'catalog', 'the button asks again and gets it');
  assert.equal(calls, 2);
  assert.equal(await get(), 'catalog');
  assert.equal(calls, 2, 'a loaded module is kept for the life of the page');
});

test('two callers at once share one attempt, and both see its failure', async () => {
  let calls = 0;
  const get = lazyModule(() => { calls += 1; return Promise.reject(new TypeError('offline')); }, pickValue, { origin: ORIGIN });
  const [a, b] = await Promise.allSettled([get(), get()]);
  assert.equal(a.status, 'rejected');
  assert.equal(b.status, 'rejected');
  assert.equal(calls, 1);
  await assert.rejects(get(), /offline/);
  assert.equal(calls, 2, 'and the next call is a new attempt, not the old rejection');
});

test('Chromium: the same address fails again, so the retry asks for it under a fresh query', async () => {
  // Chromium answers every later import() of an address that once failed with the same error, even
  // with the network back: the stub does the same, and only a new address gets through.
  const asked = [];
  let online = false;
  const get = lazyModule(
    () => Promise.reject(chromiumError('catalog-Da728lsO')),
    pickValue,
    {
      origin: ORIGIN,
      importer: (href) => {
        asked.push(href);
        return online ? Promise.resolve({ VALUE: 'catalog' }) : Promise.reject(chromiumError('catalog-Da728lsO'));
      },
    },
  );
  await assert.rejects(get(), /Failed to fetch dynamically imported module/);
  online = true;
  assert.equal(await get(), 'catalog', 'the second press gets through');
  assert.deepEqual(asked, [`${ORIGIN}/assets/catalog-Da728lsO.js?retry=1`, `${ORIGIN}/assets/catalog-Da728lsO.js?retry=2`], 'a new address each time');
  assert.equal(await get(), 'catalog');
  assert.equal(asked.length, 2, 'and once loaded it is not asked for again');
});

test('WebKit and an error that names no address: the original import is simply tried again', async () => {
  let calls = 0;
  const importer = () => { throw new Error('WebKit names no address, so there is nothing to retry under'); };
  const get = lazyModule(() => {
    calls += 1;
    return calls === 1 ? Promise.reject(new TypeError('Importing a module script failed.')) : Promise.resolve({ VALUE: 'library' });
  }, pickValue, { origin: ORIGIN, importer });
  await assert.rejects(get());
  assert.equal(await get(), 'library');
});

test('only this site\'s hashed chunks are asked for again', async () => {
  const messages = [
    `Failed to fetch dynamically imported module: https://elsewhere.test/assets/catalog-1.js`,
    `Failed to fetch dynamically imported module: ${ORIGIN}/src/generated/catalog.js`,
    `Failed to fetch dynamically imported module: ${ORIGIN}/assets/catalog-1.css`,
    'something broke',
  ];
  for (const message of messages) {
    let asked = 0;
    const get = lazyModule(() => Promise.reject(new TypeError(message)), pickValue, { origin: ORIGIN, importer: () => { asked += 1; return Promise.resolve({ VALUE: 1 }); } });
    await assert.rejects(get(), (err) => err.message === message);
    assert.equal(asked, 0, message);
  }
  // With no page address to compare against (a build script, a worker) nothing is retried either.
  let asked = 0;
  const get = lazyModule(() => Promise.reject(chromiumError('catalog-1')), pickValue, { origin: null, importer: () => { asked += 1; return Promise.resolve({ VALUE: 1 }); } });
  await assert.rejects(get());
  assert.equal(asked, 0);
});

test('a chunk that is not the module asked for keeps the first error and is not remembered', async () => {
  // A chunk that Rollup merged with another one exports under short names: reading VALUE finds
  // nothing, and resolving to that would hand the page an empty catalog.
  const first = chromiumError('catalog-2');
  const get = lazyModule(() => Promise.reject(first), pickValue, { origin: ORIGIN, importer: () => Promise.resolve({ a: 1 }) });
  await assert.rejects(get(), (err) => err === first);
  await assert.rejects(get(), (err) => err === first);
});

test('a module that loads without the export is an error, never an empty value', async () => {
  const get = lazyModule(() => Promise.resolve({}), pickValue, { origin: ORIGIN });
  await assert.rejects(get(), /does not export/);
  const nothing = lazyModule(() => Promise.resolve({ VALUE: null }), pickValue, { origin: ORIGIN });
  await assert.rejects(nothing(), /does not export/);
});

test('the address built from a retried error carries one retry query, not a pile', async () => {
  const asked = [];
  const get = lazyModule(
    () => Promise.reject(new TypeError(`Failed to fetch dynamically imported module: ${ORIGIN}/assets/library-9.js?retry=3`)),
    pickValue,
    { origin: ORIGIN, importer: (href) => { asked.push(href); return Promise.resolve({ VALUE: 'ok' }); } },
  );
  assert.equal(await get(), 'ok');
  assert.deepEqual(asked, [`${ORIGIN}/assets/library-9.js?retry=1`]);
});

// ── the pages' own loaders ──────────────────────────────────────────────────────────────────

test('the catalog and the library load through the retrying loader', async () => {
  const catalog = await loadCatalog();
  assert.ok(catalog.domains.swine.shown.length >= 4, 'swine lists its topics');
  assert.equal(await loadCatalog(), catalog, 'kept after the first load');
  const library = await loadLibrary();
  assert.ok(library.docs.length > 0 && library.shelves.length > 0);
  assert.equal(await loadLibrary(), library);
});

test('a domain whose index failed to load is fetched again on the next call', async () => {
  const id = DOMAIN_CARDS[0].id;
  let online = false;
  const net = installBankFetch({ fail: () => !online });
  try {
    await assert.rejects(loadDomain(id), /network down/);
    assert.equal(net.calls.length, 2, 'one quiet retry, then the page offers its own');
    online = true;
    const list = await loadDomain(id);
    assert.equal(list.length, DOMAIN_CARDS[0].count);
    assert.equal(list[0].domain, id);
  } finally {
    net.restore();
  }
});

test('a shard that failed to load is fetched again on the next call, and no other shard is lost', async () => {
  // Not the first domain: the test before this one loaded all of it.
  const card = DOMAIN_CARDS.filter((d) => d.shards >= 3).at(-1);
  let online = false;
  let broken = null;
  const net = installBankFetch({ fail: (url) => (broken ? url === broken && !online : false) });
  try {
    const { loadIndex, loadQuestions } = await import('../../src/lib/bank.js');
    const index = await loadIndex(card.id);
    broken = index.shards[1].url;
    const wanted = [index.entries[0], index.entries[index.size], index.entries[index.size * 2]];
    await assert.rejects(loadQuestions(wanted), /network down/);
    assert.equal(net.calls.filter((u) => u === broken).length, 2, 'the broken shard was asked for twice, quietly, then given up on');
    online = true;
    const questions = await loadQuestions(wanted);
    assert.deepEqual(questions.map((q) => q.key), wanted.map((e) => e.key));
    assert.equal(net.calls.filter((u) => u === index.shards[0].url).length, 1, 'the shard that arrived the first time is not fetched again');
  } finally {
    net.restore();
  }
});

// ── what the fresh-address retry depends on ─────────────────────────────────────────────────
// It works only for a chunk that stands alone and exports what the page picks. Rollup gives a
// dynamically imported module such a chunk when nothing imports it statically and it imports
// nothing; the build output was checked for this (dist/assets/catalog-*.js and library-*.js hold
// no import and export CATALOG and LIBRARY by name), and these hold the source side of it.

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return files(p);
    return /\.(jsx?|mjs)$/.test(e.name) ? [p] : [];
  });
}

test('the generated data modules are leaves, reached by one import() each and by no static import', () => {
  for (const name of ['catalog', 'library']) {
    const text = fs.readFileSync(path.join(SRC, 'generated', `${name}.js`), 'utf8');
    assert.ok(!/^\s*import\b/m.test(text), `${name}.js imports nothing`);
    const dynamic = [];
    for (const file of files(SRC)) {
      const code = fs.readFileSync(file, 'utf8');
      const rel = path.relative(SRC, file).split(path.sep).join('/');
      assert.ok(!new RegExp(`from\\s*['"][^'"]*generated/${name}\\.js['"]`).test(code), `${rel} imports ${name}.js statically`);
      for (const m of code.matchAll(new RegExp(`import\\(\\s*['"][^'"]*generated/${name}\\.js['"]\\s*\\)`, 'g'))) dynamic.push(rel + ':' + m[0]);
    }
    assert.equal(dynamic.length, 1, `${name}.js has one import() site: ${dynamic.join(', ')}`);
    assert.ok(dynamic[0].startsWith('lib/bank.js:'), `${name}.js is imported in lib/bank.js, where the retry lives`);
  }
});
