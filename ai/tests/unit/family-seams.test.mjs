// Where VetMock AI meets the rest of VetMock: a redirect sign-in comes back to the address the
// student left from, never to anything off this origin.
import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreSignInDestination } from '../../src/lib/auth.js';

function memoryStore(entries = {}) {
  const m = new Map(Object.entries(entries));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const fakeHistory = () => { const calls = []; return { calls, state: null, replaceState: (...a) => calls.push(a) }; };
const loc = { href: 'https://ai.vetmock.com/' };

test('a destination kept before the redirect is put back once the session has started', () => {
  const store = memoryStore({ 'vmai-return-to': JSON.stringify({ path: '/?ask=rabies#src-2', at: Date.now() }) });
  const hist = fakeHistory();
  assert.equal(restoreSignInDestination(loc, hist, store), '/?ask=rabies#src-2');
  assert.deepEqual(hist.calls, [[null, '', '/?ask=rabies#src-2']]);
  assert.equal(restoreSignInDestination(loc, hist, store), null, 'once');
});

test('a hostile or stale destination is never followed', () => {
  for (const path of ['//evil.example', '/\\evil.example', 'https://evil.example/', '/%5Cevil', '//u:p@evil.example']) {
    const hist = fakeHistory();
    const store = memoryStore({ 'vmai-return-to': JSON.stringify({ path, at: Date.now() }) });
    assert.equal(restoreSignInDestination(loc, hist, store), null, path);
    assert.equal(hist.calls.length, 0, path);
  }
  const hist = fakeHistory();
  const old = memoryStore({ 'vmai-return-to': JSON.stringify({ path: '/x', at: Date.now() - 60 * 60 * 1000 }) });
  assert.equal(restoreSignInDestination(loc, hist, old), null);
  assert.equal(hist.calls.length, 0);
});
