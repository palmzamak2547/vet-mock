// Sign-in helpers [M1-DESIGN.md 9.7]: the owner a session gives, the redirect target, and cleaning
// the redirect leftovers from the address bar. The Supabase client itself is not contacted here.
// OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ownerFromSession, authErrorInUrl } from '../../src/lib/auth/session.js';
import { redirectTarget, cleanAuthParams, AUTH_CONFIGURED, signIn, signOut, getAuthClient } from '../../src/lib/auth/client.js';

test('owner scope: guest without a user, u.<id> with one, guest for anything malformed', () => {
  assert.equal(ownerFromSession(null), 'guest');
  assert.equal(ownerFromSession({}), 'guest');
  assert.equal(ownerFromSession({ user: { id: '5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab' } }), 'u.5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab');
  assert.equal(ownerFromSession({ user: { id: '../guest' } }), 'guest', 'an id that could escape the key prefix is refused');
  assert.equal(ownerFromSession({ user: { id: 42 } }), 'guest');
});

test('redirect flow comes back to the workspace on this origin', () => {
  assert.equal(redirectTarget('https://research.vetmock.com'), 'https://research.vetmock.com/app');
  assert.equal(redirectTarget('http://localhost:43110'), 'http://localhost:43110/app');
});

test('the address bar loses ?code= and ?error= after the client has read them, and keeps the rest', () => {
  const calls = [];
  const hist = { state: { x: 1 }, replaceState: (...a) => calls.push(a) };
  assert.equal(cleanAuthParams({ href: 'https://research.vetmock.com/app?code=abc&state=s&tab=2#p' }, hist), true);
  assert.deepEqual(calls[0], [{ x: 1 }, '', '/app?tab=2#p']);
  assert.equal(cleanAuthParams({ href: 'https://research.vetmock.com/app/p/1' }, hist), false);
  assert.equal(calls.length, 1, 'nothing to clean, history untouched');
});

test('a provider error in the redirect is reported once as a failed sign-in', () => {
  assert.equal(authErrorInUrl({ href: 'https://research.vetmock.com/app?error=access_denied&error_description=x' }), 'runtime.auth.failed');
  assert.equal(authErrorInUrl({ href: 'https://research.vetmock.com/app?code=abc' }), null);
  assert.equal(authErrorInUrl(undefined), null);
});

test('without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY the app stays a guest app and never loads the client', async () => {
  assert.equal(AUTH_CONFIGURED, false);
  assert.equal(await getAuthClient(), null);
  assert.deepEqual(await signIn('google'), { ok: false, key: 'runtime.auth.notConfigured' });
  assert.deepEqual(await signOut(), { ok: true, key: null });
});

test('an expired session opened offline keeps the account, not the guest scope (review round 1)', async () => {
  const { resolveOwner, storedUserId, isRetryableAuthError } = await import('../../src/lib/auth/session.js');
  const id = '5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab';
  const store = { getItem: (k) => (k === 'vmx-research-auth' ? JSON.stringify({ access_token: 'x', expires_at: 1, user: { id } }) : null) };
  assert.equal(storedUserId(store), id);
  const netErr = { name: 'AuthRetryableFetchError', status: 0 };
  assert.ok(isRetryableAuthError(netErr));
  // auth-js __loadSession: refresh failed while offline, token past expiry -> { session: null, error }
  assert.equal(resolveOwner({ session: null, error: netErr, online: true, storedId: id }), `u.${id}`);
  assert.equal(resolveOwner({ session: null, event: 'INITIAL_SESSION', online: false, storedId: id }), `u.${id}`);
  // an explicit sign-out or a refusal the server gave ends the account scope
  assert.equal(resolveOwner({ session: null, event: 'SIGNED_OUT', online: false, storedId: id }), 'guest');
  assert.equal(resolveOwner({ session: null, error: { name: 'AuthApiError', status: 400 }, online: true, storedId: id }), 'guest');
  assert.equal(resolveOwner({ session: null, online: true, storedId: null }), 'guest');
  assert.equal(resolveOwner({ session: { user: { id } } }), `u.${id}`);
});

test('the INITIAL_SESSION event without a session keeps a stored account (server down, browser online)', async () => {
  const { resolveOwner } = await import('../../src/lib/auth/session.js');
  const id = '5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab';
  assert.equal(resolveOwner({ session: null, event: 'INITIAL_SESSION', online: true, storedId: id }), `u.${id}`);
});

test('the landing offers "continue" only to the owner of that project (review round 1)', async () => {
  const { storedOwner } = await import('../../src/lib/auth/stored.js');
  const id = '5f0c2d7e-8a1b-4c3d-9e2f-0123456789ab';
  assert.equal(storedOwner({ getItem: () => null }), 'guest');
  assert.equal(storedOwner({ getItem: () => JSON.stringify({ user: { id } }) }), `u.${id}`);
  assert.equal(storedOwner({ getItem: () => '{not json' }), 'guest');
});
