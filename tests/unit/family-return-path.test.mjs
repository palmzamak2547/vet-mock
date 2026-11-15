// The sign-in return path (src/lib/family/return-path.js): a destination survives a redirect
// sign-in on vetmock.com, vca and ai, and nothing that could leave the origin is ever followed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { currentPath, hashToRestore, keepDestination, safeReturnPath, takeDestination } from '../../src/lib/family/return-path.js';

function memoryStore() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    size: () => m.size,
  };
}

test('ordinary destinations pass unchanged', () => {
  for (const p of [
    '/',
    '/wiki/microbiology/rabies#pathogenesis',
    '/wiki/a/b#%E0%B8%81%E0%B8%B2%E0%B8%A3',
    '/app/library?subject=vca&q=Swine%202567',
    '/?qset=eyJzIjoiYSIsImkiOjF9',
    '/d/anatomy/12',
    '/community?tab=new#top',
  ]) assert.equal(safeReturnPath(p), p, p);
});

test('anything that could leave the origin is refused', () => {
  for (const p of [
    '//evil.example',
    '//evil.example/path',
    '/\\evil.example',
    '\\\\evil.example',
    '/%5Cevil.example',
    '/%5C%5Cevil.example',
    '%2F%2Fevil.example',
    '/%2F%2Fevil.example',
    '/%2F/evil.example',
    '/./%2f/evil.example',
    '/%2e/%2fevil.example',
    '/.%2f/evil.example',
    'https://evil.example/',
    'http:evil.example',
    'javascript:alert(1)',
    'data:text/html,hi',
    '//user:pass@evil.example',
    'https://user:pass@evil.example',
    '/user:pass@evil.example',
    '/%40evil.example',
    '/x%0d%0aSet-Cookie:a=b',
    '/x\n',
    '/\tevil',
    ' /x',
    '/x y',
    '/%E0%A4%A',
    '',
    null,
    undefined,
    42,
    `/${'a'.repeat(3000)}`,
  ]) assert.equal(safeReturnPath(p), null, String(p));
});

test('a destination is kept in this tab once, and a stale or future one is ignored', () => {
  const store = memoryStore();
  const now = 1_700_000_000_000;
  assert.equal(keepDestination('k', '/wiki/a/b#s', { store, now }), '/wiki/a/b#s');
  assert.equal(takeDestination('k', { store, now: now + 1000 }), '/wiki/a/b#s');
  assert.equal(takeDestination('k', { store, now: now + 2000 }), null, 'taken once');

  keepDestination('k', '/a', { store, now });
  assert.equal(takeDestination('k', { store, now: now + 16 * 60 * 1000 }), null, 'older than 15 minutes');
  assert.equal(store.size(), 0);

  keepDestination('k', '/a', { store, now: now + 10 * 60 * 1000 });
  assert.equal(takeDestination('k', { store, now }), null, 'from the future');
});

test('a hostile value is never kept, and one written by hand is never followed', () => {
  const store = memoryStore();
  assert.equal(keepDestination('k', '//evil.example', { store }), null);
  assert.equal(store.size(), 0);
  store.setItem('k', JSON.stringify({ path: '/\\evil.example', at: Date.now() }));
  assert.equal(takeDestination('k', { store }), null);
  store.setItem('k', 'not json');
  assert.equal(takeDestination('k', { store }), null);
  store.setItem('k', JSON.stringify({ path: 'https://evil.example/', at: Date.now() }));
  assert.equal(takeDestination('k', { store }), null);
});

test('blocked storage never throws', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(keepDestination('k', '/a', { store: broken }), '/a');
  assert.equal(takeDestination('k', { store: broken }), null);
});

test('currentPath drops what the sign-in adds', () => {
  const loc = { href: 'https://vetmock.com/wiki/a/b?code=x&state=y&keep=1#sec' };
  assert.equal(currentPath(loc, ['code', 'state']), '/wiki/a/b?keep=1#sec');
});

test('vetmock.com gets back only the hash, only on the page it was taken from', () => {
  const drop = ['code', 'state'];
  assert.equal(hashToRestore('/wiki/a/b#sec', 'https://vetmock.com/wiki/a/b', drop), '#sec');
  assert.equal(hashToRestore('/wiki/a/b#sec', 'https://vetmock.com/wiki/a/b#', drop), '#sec', 'the SDK leaves an empty #');
  assert.equal(hashToRestore('/wiki/a/b?x=1#sec', 'https://vetmock.com/wiki/a/b?x=1&code=c', drop), '#sec');
  assert.equal(hashToRestore('/wiki/a/b#sec', 'https://vetmock.com/wiki/a/c', drop), null, 'another page');
  assert.equal(hashToRestore('/wiki/a/b?x=1#sec', 'https://vetmock.com/wiki/a/b?x=2', drop), null, 'another query');
  assert.equal(hashToRestore('/wiki/a/b#sec', 'https://vetmock.com/wiki/a/b#other', drop), null, 'a hash is already there');
  assert.equal(hashToRestore('/wiki/a/b', 'https://vetmock.com/wiki/a/b', drop), null, 'nothing to restore');
  assert.equal(hashToRestore('//evil.example/wiki/a/b#sec', 'https://vetmock.com/wiki/a/b', drop), null);
  assert.equal(hashToRestore(null, 'https://vetmock.com/', drop), null);
});
