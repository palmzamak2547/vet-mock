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

test('catalog snapshots neither retain restricted documents nor resurrect a cleared shelf', () => {
  const previous = globalThis.window;
  const storage = new Map();
  globalThis.window = { localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  } };
  try {
    const publicDoc = { id: 'public', title: 'Open document', status: 'public' };
    const privateDoc = { id: 'restricted', title: 'Restricted document', status: 'restricted' };
    saveCatalogSnapshot({ configured: true, docs: [publicDoc, privateDoc] });
    assert.deepEqual(readCatalogSnapshot().docs, [publicDoc]);
    storage.set('vmx-library-catalog-v1', JSON.stringify({ docs: [privateDoc, publicDoc] }));
    assert.deepEqual(readCatalogSnapshot().docs, [publicDoc], 'old caches are filtered on read too');
    saveCatalogSnapshot({ configured: true, docs: [] });
    assert.equal(readCatalogSnapshot(), null);
    assert.equal(storage.size, 0);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});
