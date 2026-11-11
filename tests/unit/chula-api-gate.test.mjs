// The Chula wall for Vercel functions (api/_lib/chula-gate.js).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chulaGate, requireChula, resetChulaGate } from '../../api/_lib/chula-gate.js';
import { API_DIR, apiHandlerNames } from '../helpers/api-handlers.mjs';
import { sessionToken } from '../helpers/supabase-jwt.mjs';

const env = { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef' };
// Well-formed session tokens: the gate reads them locally before asking the database.
const MEMBER = sessionToken('https://x.supabase.co', { sub: 'u-member' });
const GMAIL = sessionToken('https://x.supabase.co', { sub: 'u-gmail' });
// Well-formed, and refused by the database (a revoked session).
const EXPIRED = sessionToken('https://x.supabase.co', { sub: 'u-revoked' });
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
  assert.deepEqual(await chulaGate(req(MEMBER), o), { ok: true, userId: 'u-member', token: MEMBER, member: true });
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
  assert.deepEqual(await chulaGate(req(), o), { ok: true, userId: null, token: null, member: false });
  assert.deepEqual(await chulaGate(req(GMAIL), o), { ok: true, userId: 'u-gmail', token: GMAIL, member: false });
  assert.deepEqual(await chulaGate(req(EXPIRED), o), { ok: true, userId: null, token: null, member: false });
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
  assert.equal((await chulaGate(req(), { env, fetchImpl: down, now: () => 10_000 })).ok, true, 'open within the 30 s it trusts the switch');
  assert.equal((await chulaGate(req(), { env, fetchImpl: down, now: () => 5 * 60_000 })).ok, true, 'an outage keeps open what it saw open in the last ten minutes');
  assert.equal((await chulaGate(req(MEMBER), { env, fetchImpl: down, now: () => 11 * 60_000 })).status, 503, 'and refuses after them');
  resetChulaGate();
  assert.equal((await chulaGate(req(), { env: {}, fetchImpl: down })).ok, true, 'no database configured: a local API or the unit suite');
  assert.equal((await chulaGate(req(), { env: { VERCEL_ENV: 'production' }, fetchImpl: down })).status, 503, 'production without a database refuses');
});

test('a database without the wall migration has no wall, so the deploy order locks nobody out', async () => {
  resetChulaGate();
  const missing = async () => new Response('{"code":"PGRST202"}', { status: 404 });
  assert.deepEqual(await chulaGate(req(), { env, fetchImpl: missing }), { ok: true, userId: null, token: null, member: false });
  resetChulaGate();
  assert.equal((await chulaGate(req(MEMBER), { env, fetchImpl: missing })).ok, true);
  resetChulaGate();
  assert.equal((await chulaGate(req(), { env: { ...env, VERCEL_ENV: 'production' }, fetchImpl: missing })).status, 503, 'in production a missing function is a fault, and a fault refuses');
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

test('every function is behind the gate or open on purpose, and a new one must say which', () => {
  // The list is the folder (tests/helpers/api-handlers.mjs): a new api/*.js file is checked here the
  // moment it exists. A handler is gated when it awaits the gate on its request; any other must be
  // named below with the reason it is open.
  const OPEN = {
    'client-diagnostic': 'crash counts, sent before or without a sign-in',
    'send-feedback': 'the feedback lifeline, which must work for a student the wall refuses',
    calendar: 'a public calendar feed a phone subscribes to with no session',
    'library-blob': 'the signed byte link library-file hands out; the signature is the access check',
    'external-connect-callback': 'the OAuth return, which arrives from the provider without our header',
    'move-in': 'the old-origin move, run on vetmock.vercel.app before any session exists there',
    'system-status': "the admin's own probe, which checks the admin itself",
    playlist: 'public YouTube playlist titles: edge-cached for half an hour, its Data API spend capped daily, and the video page asks ~40 at once',
  };
  const src = (name) => readFileSync(`${API_DIR}${name}.js`, 'utf8');
  const all = apiHandlerNames();
  assert.ok(all.length >= 28, `handlers found: ${all.length}`);
  const gated = all.filter((name) => /await (requireChula|chulaGate)\(req/.test(src(name)));
  for (const name of all) {
    assert.ok(gated.includes(name) || OPEN[name], `api/${name}.js does not call the Chula gate and is not named as open on purpose: gate it, or add it to OPEN with the reason`);
  }
  // The feedback lifeline asks the gate only who is writing, to count a member
  // on their own allowance; it never refuses on the gate's answer.
  const identifiesOnly = new Set(['send-feedback']);
  for (const name of Object.keys(OPEN)) {
    assert.ok(all.includes(name), `OPEN names api/${name}.js, which no longer exists`);
    assert.doesNotMatch(src(name), /requireChula/, `${name} is listed as open but refuses on the gate: drop it from OPEN`);
    if (!identifiesOnly.has(name)) assert.doesNotMatch(src(name), /chula-gate/, `${name} is listed as open but imports the gate: drop it from OPEN`);
  }
  const feedback = readFileSync(new URL('../../api/send-feedback.js', import.meta.url), 'utf8');
  assert.doesNotMatch(feedback, /gate\.(status|body)\b/, 'send-feedback never answers with the gate\'s refusal');
});

test('an open ticket names one document for a day and nothing else', async () => {
  const { mintOpenTicket, verifyOpenTicket, ticketQuery } = await import('../../api/_lib/open-ticket.js');
  const secrets = { CLOUDFLARE_API_TOKEN: 'test-only-secret' };
  const now = Date.UTC(2026, 10, 1);
  const t = mintOpenTicket('vet-pharm-deck', { env: secrets, now });
  assert.ok(t.vt && Number.isInteger(t.ve));
  assert.equal(verifyOpenTicket('vet-pharm-deck', t.vt, String(t.ve), { env: secrets, now }), true);
  assert.equal(verifyOpenTicket('another-deck', t.vt, t.ve, { env: secrets, now }), false, 'bound to its slug');
  assert.equal(verifyOpenTicket('vet-pharm-deck', t.vt, t.ve + 1, { env: secrets, now }), false, 'bound to its expiry');
  assert.equal(verifyOpenTicket('vet-pharm-deck', t.vt, t.ve, { env: secrets, now: now + 23 * 3600_000 }), true, 'still open within the day');
  assert.equal(verifyOpenTicket('vet-pharm-deck', t.vt, t.ve, { env: secrets, now: now + 25 * 3600_000 }), false, 'expires after a day');
  assert.equal(verifyOpenTicket('vet-pharm-deck', t.vt, t.ve, { env: { CLOUDFLARE_API_TOKEN: 'other' }, now }), false, 'another secret');
  assert.equal(verifyOpenTicket('vet-pharm-deck', `${t.vt}x`, t.ve, { env: secrets, now }), false);
  assert.equal(verifyOpenTicket('vet-pharm-deck', null, null, { env: secrets, now }), false);
  assert.equal(mintOpenTicket('vet-pharm-deck', { env: {}, now }), null, 'no secret, no ticket');
  assert.match(ticketQuery(t), /^&vt=[A-Za-z0-9_-]+&ve=\d+$/);
  assert.equal(ticketQuery(null), '');
});

test('a tapped library link without a session lands on the app, which asks for sign-in', async () => {
  resetChulaGate();
  const previous = { ...process.env };
  const realFetch = globalThis.fetch;
  Object.assign(process.env, { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef' });
  globalThis.fetch = async (url) => (String(url).endsWith('/rpc/chula_access_state')
    ? Response.json({ enforce: true, signed_in: false, member: false, uid: null })
    : Response.json([]));
  try {
    const { default: handler } = await import('../../api/library-file.js');
    const res = { headers: {}, statusCode: 0, setHeader(k, v) { this.headers[k] = v; }, end() { return this; } };
    await handler({ method: 'GET', url: '/api/library-file?slug=some-deck&open=1', headers: {} }, res);
    assert.equal(res.statusCode, 302);
    assert.equal(res.headers.Location, '/app/home');
  } finally {
    process.env = previous;
    globalThis.fetch = realFetch;
    resetChulaGate();
  }
});
