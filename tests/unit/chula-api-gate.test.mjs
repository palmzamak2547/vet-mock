// The Chula wall for Vercel functions (api/_lib/chula-gate.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chulaGate, requireChula, resetChulaGate } from '../../api/_lib/chula-gate.js';

const env = { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef' };
const MEMBER = 'member.token.0123456789abcdef';
const GMAIL = 'gmail.token.0123456789abcdef';
const EXPIRED = 'expired.token.0123456789abcdef';
const req = (token) => ({ headers: token ? { authorization: `Bearer ${token}` } : {} });

function backend(enforce) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    assert.equal(url, 'https://x.supabase.co/rest/v1/rpc/chula_access_state');
    const bearer = init.headers.Authorization.slice(7);
    calls.push(bearer);
    if (bearer === EXPIRED) return new Response('{"message":"JWT expired"}', { status: 401 });
    if (bearer === MEMBER) return Response.json({ enforce: backend.enforce, signed_in: true, member: true, uid: 'u-member' });
    if (bearer === GMAIL) return Response.json({ enforce: backend.enforce, signed_in: true, member: false, uid: 'u-gmail' });
    return Response.json({ enforce: backend.enforce, signed_in: false, member: false, uid: null });
  };
  backend.enforce = enforce;
  return { calls, fetchImpl };
}

test('wall on: members pass with their id, everyone else is refused with a reason', async () => {
  resetChulaGate();
  const { fetchImpl } = backend(true);
  const o = { env, fetchImpl };
  assert.deepEqual(await chulaGate(req(MEMBER), o), { ok: true, userId: 'u-member', token: MEMBER });
  const gmail = await chulaGate(req(GMAIL), o);
  assert.equal(gmail.status, 403);
  assert.equal(gmail.body.error, 'chula_required');
  const guest = await chulaGate(req(), o);
  assert.equal(guest.status, 401);
  assert.equal(guest.body.error, 'signin_required');
  const expired = await chulaGate(req(EXPIRED), o);
  assert.equal(expired.status, 401, 'a refused token is a guest, asked to sign in again');
  const garbage = await chulaGate({ headers: { authorization: 'Bearer not a token\r\nX-Injected: 1' } }, o);
  assert.equal(garbage.status, 401);
});

test('wall off: everyone passes as before, with their id when signed in', async () => {
  resetChulaGate();
  const { fetchImpl } = backend(false);
  const o = { env, fetchImpl };
  assert.deepEqual(await chulaGate(req(), o), { ok: true, userId: null, token: null });
  assert.deepEqual(await chulaGate(req(GMAIL), o), { ok: true, userId: 'u-gmail', token: GMAIL });
  assert.deepEqual(await chulaGate(req(EXPIRED), o), { ok: true, userId: null, token: null });
});

test('a warm instance asks the database once per member token and once per switch window', async () => {
  resetChulaGate();
  let clock = 1_000;
  const { calls, fetchImpl } = backend(true);
  const o = { env, fetchImpl, now: () => clock };
  await chulaGate(req(MEMBER), o);
  await chulaGate(req(MEMBER), o);
  assert.deepEqual(calls, [MEMBER], 'the member is remembered for a minute');
  clock += 61_000;
  await chulaGate(req(MEMBER), o);
  assert.equal(calls.length, 2, 'and asked again after it');
  calls.length = 0;
  await chulaGate(req(), o);
  await chulaGate(req(), o);
  assert.equal(calls.length, 0, 'guests are judged by the switch the member call just read');
  clock += 31_000;
  await chulaGate(req(), o);
  assert.equal(calls.length, 1);
  backend.enforce = false;
  clock += 31_000;
  assert.equal((await chulaGate(req(), o)).ok, true, 'the switch turned off reaches the API within 30 s');
});

test('when the database cannot be asked the gate refuses, unless this instance saw the wall off', async () => {
  resetChulaGate();
  const down = async () => { throw new TypeError('fetch failed'); };
  const refused = await chulaGate(req(MEMBER), { env, fetchImpl: down });
  assert.equal(refused.status, 503);
  const { fetchImpl } = backend(false);
  await chulaGate(req(), { env, fetchImpl, now: () => 0 });
  assert.equal((await chulaGate(req(), { env, fetchImpl: down, now: () => 60_000 })).ok, true);
  resetChulaGate();
  assert.equal((await chulaGate(req(), { env: {}, fetchImpl: down })).ok, true, 'no database configured: a local API or the unit suite');
  assert.equal((await chulaGate(req(), { env: { VERCEL_ENV: 'production' }, fetchImpl: down })).status, 503, 'production without a database refuses');
});

test('requireChula answers the refusal uncached and returns null', async () => {
  resetChulaGate();
  const { fetchImpl } = backend(true);
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; } };
  assert.equal(await requireChula(req(GMAIL), res, { env, fetchImpl }), null);
  assert.equal(res.statusCode, 403);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.body.error, 'chula_required');
});

test('every function that costs money or touches an account is behind the gate', () => {
  const gated = ['ai-chat', 'ai-transcribe', 'agent-action', 'exam-result', 'external-connect', 'external-connect-start',
    'fetch-external-doc', 'grade-summary', 'library-file', 'list-external-files', 'mochi-voice', 'playlist', 'race-start',
    'study-coach', 'transcribe-handwriting', 'tts', 'tts-iapp', 'wiki-explain'];
  for (const name of gated) {
    const src = readFileSync(new URL(`../../api/${name}.js`, import.meta.url), 'utf8');
    assert.match(src, /await (requireChula|chulaGate)\(req/, `${name} must call the Chula gate`);
  }
  // Open on purpose: crash counts, the feedback lifeline, a public calendar feed,
  // the signed byte link, the OAuth return, the old-origin move, the admin's own probe.
  const open = ['client-diagnostic', 'send-feedback', 'calendar', 'library-blob', 'external-connect-callback', 'move-in', 'system-status'];
  for (const name of open) {
    assert.doesNotMatch(readFileSync(new URL(`../../api/${name}.js`, import.meta.url), 'utf8'), /chula-gate/, name);
  }
});
