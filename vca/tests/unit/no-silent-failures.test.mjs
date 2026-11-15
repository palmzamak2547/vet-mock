// Two ways VCA lost a student's work without a word (15 Nov 2026): a browser that refused to
// keep practice dropped every answer at the next reload, and a delete that row security
// filtered to nothing reported success while the item came back on the next load.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = (p) => readFileSync(new URL(`../../src/${p}`, import.meta.url), 'utf8');

test('a refused write marks storage as refused and tells whoever listens, once', async () => {
  const prior = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); }, removeItem() {} };
  try {
    const { writeJSON, storageRefused, onStorageRefused, readJSON } = await import('../../src/lib/storage.js');
    let heard = 0;
    const stop = onStorageRefused(() => { heard += 1; });
    assert.equal(writeJSON('vca:t', { a: 1 }), false);
    assert.equal(writeJSON('vca:t', { a: 2 }), false);
    assert.equal(storageRefused(), true);
    assert.equal(heard, 1);
    assert.deepEqual(readJSON('vca:t', null), { a: 2 }, 'practice still runs from memory');
    stop();
  } finally { globalThis.localStorage = prior; }
});

test('the app shell says so above every page when storage is refused', () => {
  const app = src('App.jsx');
  assert.match(app, /const storageOff = useStorageRefused\(\)/);
  assert.match(app, /\{storageOff && \(/);
});

test('community deletes read their rows back instead of trusting an empty answer', () => {
  const live = src('online/live.js');
  assert.match(live, /async function mustRemove\(sb, table, id\)/);
  assert.match(live, /if \(Array\.isArray\(still\) && still\.length\) throw/, 'only a row still there is a failure');
  for (const table of ['posts', 'comments', 'messages']) {
    assert.match(live, new RegExp(`mustRemove\\(sb, '${table}', id\\)`), `${table} delete checks its rows`);
    assert.doesNotMatch(live, new RegExp(`await must\\(sb\\.from\\('${table}'\\)\\.delete\\(\\)`), `${table} delete is not trusted blind`);
  }
});
