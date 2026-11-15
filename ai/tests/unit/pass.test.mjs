// A trial link's code on the device (lib/pass.js; docs/CHULA-SIGNIN.md, "Trial links"):
// taken out of the address once, kept only when it is shaped like a code, and forgotten
// on request. What the page does with it is in wall.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';

const { takePassFromUrl, getPass, clearPass, PASS_KEY, PASS_HEADER } = await import('../../src/lib/pass.js');

// Shaped like a code, and no pass anywhere.
const CODE = 'unit-test-code_not-a-pass-0001';

function memoryStore(seed = {}) {
  const map = new Map(Object.entries(seed));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}
const place = (search, hash = '') => {
  const replaced = [];
  return { replaced, location: { pathname: '/', search, hash }, history: { state: { v: 1 }, replaceState: (state, _t, url) => replaced.push([state, url]) } };
};

test('the names the server and the device agree on', () => {
  assert.equal(PASS_KEY, 'vmx-ai-pass');
  assert.equal(PASS_HEADER.toLowerCase(), 'x-vetmock-pass');
});

test('a trial link is stored and its code leaves the address', () => {
  const store = memoryStore();
  const p = place(`?pass=${CODE}`);
  assert.equal(takePassFromUrl(p.location, p.history, store), CODE);
  assert.equal(store.getItem('vmx-ai-pass'), CODE);
  assert.deepEqual(p.replaced, [[{ v: 1 }, '/']], 'the address keeps no code, and the history state is kept');
  assert.equal(getPass(store), CODE);
});

test('only the pass leaves the address: other parameters and the section stay', () => {
  const store = memoryStore();
  const p = place(`?vmt=dark&pass=${CODE}&q=rabies`, '#sources');
  takePassFromUrl(p.location, p.history, store);
  assert.equal(p.replaced[0][1], '/?vmt=dark&q=rabies#sources');
});

test('an address with no pass is left alone', () => {
  const store = memoryStore();
  const p = place('?code=abc&q=1');
  assert.equal(takePassFromUrl(p.location, p.history, store), null);
  assert.deepEqual(p.replaced, []);
  assert.equal(getPass(store), null);
});

test('a malformed value is never stored, and still leaves the address', () => {
  const malformed = ['', 'short', 'a'.repeat(21), 'a'.repeat(65), `${'a'.repeat(21)}.`, `${'a'.repeat(21)}%20`, `${'a'.repeat(22)}%0A`, `${'a'.repeat(21)}%E0%B8%81`, '<script>alert(1)</script>'];
  for (const value of malformed) {
    const store = memoryStore();
    const p = place(`?pass=${value}&keep=1`);
    assert.equal(takePassFromUrl(p.location, p.history, store), null, value);
    assert.equal(store.getItem('vmx-ai-pass'), null, value);
    assert.equal(p.replaced[0][1], '/?keep=1', value);
  }
  // a broken link does not wipe a good code already on the device
  const store = memoryStore({ 'vmx-ai-pass': CODE });
  const p = place('?pass=nope');
  takePassFromUrl(p.location, p.history, store);
  assert.equal(getPass(store), CODE);
});

test('a newer link replaces the code on the device', () => {
  const store = memoryStore({ 'vmx-ai-pass': CODE });
  const next = `${CODE.slice(0, -1)}2`;
  const p = place(`?pass=${next}`);
  takePassFromUrl(p.location, p.history, store);
  assert.equal(getPass(store), next);
});

test('a stored value that is not shaped like a code is not a pass', () => {
  assert.equal(getPass(memoryStore({ 'vmx-ai-pass': 'x' })), null);
  assert.equal(getPass(memoryStore({ 'vmx-ai-pass': `${'a'.repeat(22)}\n` })), null);
  assert.equal(getPass(memoryStore()), null);
});

test('clearing forgets the code', () => {
  const store = memoryStore({ 'vmx-ai-pass': CODE, other: 'stays' });
  clearPass(store);
  assert.equal(store.getItem('vmx-ai-pass'), null);
  assert.equal(store.getItem('other'), 'stays');
  assert.equal(getPass(store), null);
});

test('where storage is refused the code lasts for this page load, and nothing throws', () => {
  const refused = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
  const p = place(`?pass=${CODE}`);
  assert.equal(takePassFromUrl(p.location, p.history, refused), CODE);
  assert.equal(p.replaced[0][1], '/', 'the address still loses it');
  assert.equal(getPass(refused), CODE);
  assert.doesNotThrow(() => clearPass(refused));
  assert.equal(getPass(refused), null);
  // no storage object at all
  const q = place(`?pass=${CODE}`);
  assert.equal(takePassFromUrl(q.location, q.history, null), CODE);
  assert.equal(getPass(null), CODE);
  clearPass(null);
  assert.equal(getPass(null), null);
});

test('an address that cannot be read is no pass; one that cannot be rewritten still opens the link', () => {
  assert.equal(takePassFromUrl(undefined, undefined, memoryStore()), null);
  assert.equal(takePassFromUrl({ pathname: '/' }, undefined, memoryStore()), null);
  const store = memoryStore();
  const p = place(`?pass=${CODE}`);
  assert.equal(takePassFromUrl(p.location, { state: null, replaceState() { throw new Error('SecurityError'); } }, store), CODE);
  assert.equal(store.getItem('vmx-ai-pass'), CODE);
});
