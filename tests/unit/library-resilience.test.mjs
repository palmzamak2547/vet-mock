import assert from 'node:assert/strict';
import test from 'node:test';
import { isMissingLibraryTable, readCatalogSnapshot, saveCatalogSnapshot } from '../../src/lib/library.js';

test('only a missing table becomes an empty library, never denied access or an outage', () => {
  for (const code of ['42P01', 'PGRST205']) assert.equal(isMissingLibraryTable({ code }), true);
  for (const error of [
    { code: '42501', message: 'permission denied for table library_docs' },
    { code: 'PGRST002', message: 'Could not query the database for the schema cache' },
    { code: 'PGRST204', message: 'Column of library_docs does not exist' },
    new Error('Failed to fetch library_docs'),
  ]) assert.equal(isMissingLibraryTable(error), false);
});

// The snapshot lives in the Cache API. A real cache hands back a fresh
// Response on every match; so does this one.
function fakeCaches() {
  const store = new Map();
  const cache = {
    put: async (url, res) => { store.set(String(url), await res.text()); },
    match: async (url) => (store.has(String(url)) ? new Response(store.get(String(url))) : undefined),
    delete: async (url) => store.delete(String(url)),
  };
  return { open: async () => cache, _store: store };
}

test('catalog snapshots neither retain restricted documents nor resurrect a cleared shelf', async () => {
  const previous = globalThis.window;
  const previousCaches = globalThis.caches;
  const caches = fakeCaches();
  globalThis.window = {};
  globalThis.caches = caches;
  try {
    const publicDoc = { id: 'public', title: 'Open document', status: 'public' };
    const privateDoc = { id: 'restricted', title: 'Restricted document', status: 'restricted' };
    await saveCatalogSnapshot({ configured: true, docs: [publicDoc, privateDoc] });
    assert.deepEqual((await readCatalogSnapshot()).docs, [publicDoc]);
    caches._store.set('/__vmx/library-catalog.json', JSON.stringify({ docs: [privateDoc, publicDoc] }));
    assert.deepEqual((await readCatalogSnapshot()).docs, [publicDoc], 'old caches are filtered on read too');
    await saveCatalogSnapshot({ configured: true, docs: [] });
    assert.equal(await readCatalogSnapshot(), null);
    assert.equal(caches._store.size, 0);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
    if (previousCaches === undefined) delete globalThis.caches;
    else globalThis.caches = previousCaches;
  }
});
