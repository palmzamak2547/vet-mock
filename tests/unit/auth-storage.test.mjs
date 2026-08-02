// ============================================================
// auth-storage.test.mjs — "จดจำ session" actually decides where the token goes
// ============================================================
// The checkbox used to be decorative: it wrote vmx-stay-signed-in and nothing
// read it, while the client hardcoded persistSession with the localStorage
// default. A student on a shared library machine who unticked it stayed signed
// in, and the next person to open VetMock was them.
//
// Two ways the fix could be worse than the bug, so both are pinned here:
//   • a token left behind in localStorage after the user opted out — the exact
//     thing they unticked the box to prevent
//   • a live session going unnoticed at boot because only one store is checked,
//     which would show the signed-out UI to someone who is signed in
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAuthStorage,
  hasStoredAuthToken,
  staySignedIn,
  STAY_SIGNED_IN_KEY,
} from '../../src/lib/auth-storage.js';

function fakeStore() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
    _map: m,
  };
}

const TOKEN_KEY = 'sb-abc-auth-token';

function setup(stay) {
  const local = fakeStore();
  const session = fakeStore();
  if (stay !== undefined) local.setItem(STAY_SIGNED_IN_KEY, stay);
  const store = createAuthStorage(() => local, () => session);
  return { local, session, store };
}

test('opting out keeps the token out of localStorage entirely', () => {
  const { local, session, store } = setup('0');
  store.setItem(TOKEN_KEY, 'tok');
  assert.equal(session.getItem(TOKEN_KEY), 'tok');
  assert.equal(local.getItem(TOKEN_KEY), null, 'token must not survive in localStorage');
});

test('the default is to remember, so behaviour is unchanged for everyone else', () => {
  const { local, session, store } = setup(undefined);
  assert.equal(staySignedIn(local), true);
  store.setItem(TOKEN_KEY, 'tok');
  assert.equal(local.getItem(TOKEN_KEY), 'tok');
  assert.equal(session.getItem(TOKEN_KEY), null);
});

test('only an explicit "0" opts out', () => {
  const l = fakeStore();
  l.setItem(STAY_SIGNED_IN_KEY, '1');
  assert.equal(staySignedIn(l), true);
  l.setItem(STAY_SIGNED_IN_KEY, '');
  assert.equal(staySignedIn(l), true, 'an empty value must not silently opt out');
});

test('flipping the checkbox does not orphan an existing session', () => {
  const { local, session, store } = setup('1');
  store.setItem(TOKEN_KEY, 'tok');            // written to localStorage
  local.setItem(STAY_SIGNED_IN_KEY, '0');      // user now unticks the box
  assert.equal(store.getItem(TOKEN_KEY), 'tok', 'read must fall back to the other store');
  assert.equal(session.getItem(TOKEN_KEY), null, 'and must not have moved on its own');
});

test('writing after opting out moves the token rather than duplicating it', () => {
  const { local, session, store } = setup('1');
  store.setItem(TOKEN_KEY, 'old');
  local.setItem(STAY_SIGNED_IN_KEY, '0');
  store.setItem(TOKEN_KEY, 'new');             // next refresh rewrites it
  assert.equal(session.getItem(TOKEN_KEY), 'new');
  assert.equal(local.getItem(TOKEN_KEY), null, 'the stale copy must be cleared');
});

test('sign-out clears both stores, whatever the flag says now', () => {
  const { local, session, store } = setup('1');
  store.setItem(TOKEN_KEY, 'tok');
  local.setItem(STAY_SIGNED_IN_KEY, '0');      // flag flipped after the write
  store.removeItem(TOKEN_KEY);
  assert.equal(local.getItem(TOKEN_KEY), null);
  assert.equal(session.getItem(TOKEN_KEY), null);
});

test('a session-only token is still seen at boot', () => {
  const local = fakeStore();
  const session = fakeStore();
  session.setItem(TOKEN_KEY, 'tok');
  assert.equal(hasStoredAuthToken(() => local, () => session), true,
    'boot check must scan sessionStorage or opted-out users look signed out');
});

test('no token anywhere reads as no session', () => {
  const local = fakeStore();
  const session = fakeStore();
  local.setItem(STAY_SIGNED_IN_KEY, '0');      // unrelated key must not count
  assert.equal(hasStoredAuthToken(() => local, () => session), false);
});

test('a storage that throws degrades to signed-out rather than crashing boot', () => {
  const boom = { get length() { throw new Error('blocked'); }, getItem() { throw new Error('blocked'); },
                 setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); }, key() { throw new Error('blocked'); } };
  assert.equal(hasStoredAuthToken(() => boom, () => boom), false);
  const store = createAuthStorage(() => boom, () => boom);
  assert.equal(store.getItem(TOKEN_KEY), null);
  assert.doesNotThrow(() => store.setItem(TOKEN_KEY, 'x'));
  assert.doesNotThrow(() => store.removeItem(TOKEN_KEY));
});
