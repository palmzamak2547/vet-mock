// How the API counts its callers (api/_lib/rate-limit.js limitCaller, the
// gate's failed-token brake, feedback, the library byte budget) and where the
// gate stands open. In-memory limiter, fake database, no network.
import test from 'node:test';
import assert from 'node:assert/strict';
import { limitCaller, rateLimit } from '../../api/_lib/rate-limit.js';
import { chulaGate, resetChulaGate } from '../../api/_lib/chula-gate.js';
import { sessionToken } from '../helpers/supabase-jwt.mjs';

const at = (ip) => ({ headers: { 'x-vercel-forwarded-for': ip } });
const member = (id) => ({ ok: true, userId: id, member: true });
const route = (name) => `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

test('a member is counted on their own account only: a hall of 150 on one address is never refused', async () => {
  const r = route('wiki');
  let refused = 0;
  for (let s = 0; s < 150; s++) for (let i = 0; i < 20; i++) if (!(await limitCaller(at('203.0.113.9'), member(`s${s}`), r, 20, 3600_000)).ok) refused++;
  assert.equal(refused, 0);
  assert.equal((await limitCaller(at('203.0.113.9'), member('s0'), r, 20, 3600_000)).ok, false, 'each keeps their own limit');
});

test('one scripted member cannot lock classmates on the same address out', async () => {
  const r = route('wiki');
  for (let i = 0; i < 300; i++) await limitCaller(at('203.0.113.10'), member('scripted'), r, 20, 3600_000);
  assert.equal((await limitCaller(at('203.0.113.10'), member('honest'), r, 20, 3600_000)).ok, true);
});

test('a free account (member false) gets no counter of its own: it is counted by address', async () => {
  const r = route('wiki');
  for (let i = 0; i < 20; i++) assert.equal((await limitCaller(at('198.51.100.20'), { ok: true, userId: `throwaway-${i}`, member: false }, r, 20, 3600_000)).ok, true);
  assert.equal((await limitCaller(at('198.51.100.20'), { ok: true, userId: 'throwaway-new', member: false }, r, 20, 3600_000)).ok, false, 'cycling throwaway accounts buys nothing');
  assert.equal((await limitCaller(at('198.51.100.21'), null, r, 20, 3600_000)).ok, true);
});

test('with an address ceiling (feedback), the address is counted only when the account allowed the request', async () => {
  const r = route('feedback');
  for (let i = 0; i < 50; i++) await limitCaller(at('192.0.2.30'), member('loud'), r, 3, 600_000, { addressMax: 5 });
  // loud was allowed 3; the address took 3, not 50.
  assert.equal((await limitCaller(at('192.0.2.30'), member('quiet-1'), r, 3, 600_000, { addressMax: 5 })).ok, true);
  assert.equal((await limitCaller(at('192.0.2.30'), member('quiet-2'), r, 3, 600_000, { addressMax: 5 })).ok, true);
  assert.equal((await limitCaller(at('192.0.2.30'), member('quiet-3'), r, 3, 600_000, { addressMax: 5 })).ok, false, 'the ceiling still holds');
});

test('a limiter that cannot count refuses', async () => {
  const saved = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const r = await limitCaller(at('192.0.2.1'), member('m'), route('x'), 5, 60_000);
    assert.equal(r.ok, false);
    assert.equal(r.unavailable, true);
  } finally { process.env.NODE_ENV = saved; }
});

// ── The gate ────────────────────────────────────────────────────────────────

const PROJECT = 'https://x.supabase.co';
const ENV = { VITE_SUPABASE_URL: PROJECT, VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef' };
const MEMBER = sessionToken(PROJECT, { sub: 'u-m' });
function database() {
  const calls = { n: 0, bearers: [] };
  const fetchImpl = async (url, init) => {
    calls.n++;
    const bearer = init.headers.Authorization.slice(7);
    calls.bearers.push(bearer);
    if (bearer === MEMBER) return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-m' });
    if (bearer === ENV.VITE_SUPABASE_ANON_KEY) return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
    return new Response('{"message":"invalid JWT"}', { status: 401 });
  };
  return { calls, fetchImpl };
}
const withToken = (ip, token) => ({ headers: { 'x-vercel-forwarded-for': ip, authorization: `Bearer ${token}` } });

test('forged tokens from a hall\'s address never refuse an honest member there', async () => {
  resetChulaGate();
  const { fetchImpl } = database();
  const ip = '203.0.113.77';
  // Well-formed forgeries (a bad signature, refused by the database) and junk.
  for (let i = 0; i < 300; i++) await chulaGate(withToken(ip, sessionToken(PROJECT, { sub: `forged-${i}`, tag: String(i) })), { env: ENV, fetchImpl });
  for (let i = 0; i < 300; i++) await chulaGate(withToken(ip, `forged.${i}.0123456789abcdefghij`), { env: ENV, fetchImpl });
  const honest = await chulaGate(withToken(ip, MEMBER), { env: ENV, fetchImpl });
  assert.equal(honest.ok, true);
  assert.equal(honest.member, true);
  // And again once this instance has forgotten them.
  const later = await chulaGate(withToken(ip, MEMBER), { env: ENV, fetchImpl, now: () => Date.now() + 61_000 });
  assert.equal(later.member, true);
});

// The reviewers' probe sent plain strings as "member" tokens; a real session
// token is three base64url parts with this project's issuer and audience and
// an expiry ahead. Two with identical claims, one signature the database
// accepts and one it refuses: only the database tells them apart.
test('a session-shaped token: the database decides, a good signature is a member and a bad one a guest', async () => {
  resetChulaGate();
  const claims = { sub: 'u-real', expInSec: 1800 };
  const good = sessionToken(PROJECT, { ...claims, tag: 'good' });
  const [h, p] = good.split('.');
  const bad = `${h}.${p}.${Buffer.from('not-the-signature').toString('base64url')}`;
  const asked = [];
  const fetchImpl = async (url, init) => {
    const bearer = init.headers.Authorization.slice(7);
    asked.push(bearer);
    if (bearer === good) return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-real' });
    if (bearer === ENV.VITE_SUPABASE_ANON_KEY) return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
    return new Response('{"message":"invalid JWT"}', { status: 401 });
  };
  const ip = '203.0.113.90';
  const refused = await chulaGate(withToken(ip, bad), { env: ENV, fetchImpl });
  assert.equal(refused.status, 401, 'a bad signature is a guest');
  assert.ok(asked.includes(bad), 'a well-formed token is always verified by the database');
  for (let i = 0; i < 300; i++) await chulaGate(withToken(ip, bad), { env: ENV, fetchImpl });
  const served = await chulaGate(withToken(ip, good), { env: ENV, fetchImpl });
  assert.equal(served.ok, true);
  assert.equal(served.member, true, 'the good one is a member, after 300 bad ones from the same address');
  assert.equal(served.userId, 'u-real');
});

test('expired tokens are guests: no database call, and nobody braked', async () => {
  resetChulaGate();
  const { calls, fetchImpl } = database();
  const ip = '203.0.113.78';
  // 30 students, four parallel calls each, with tokens that expired during a lecture.
  const stale = Array.from({ length: 30 }, (_, s) => sessionToken(PROJECT, { sub: `student-${s}`, expInSec: -60 }));
  const answers = await Promise.all(stale.flatMap((t) => [1, 2, 3, 4].map(() => chulaGate(withToken(ip, t), { env: ENV, fetchImpl }))));
  for (const a of answers) assert.equal(a.status, 401, 'asked to sign in, as a guest is');
  assert.ok(!calls.bearers.some((b) => stale.includes(b)), 'no expired token reached the database');
  assert.equal((await chulaGate(withToken(ip, MEMBER), { env: ENV, fetchImpl })).member, true, 'the refreshed member is served');
});

test('a malformed token makes no database call', async () => {
  const { calls, fetchImpl } = database();
  const bad = [
    'forged.token.0123456789abcdefghij',
    'a'.repeat(40),
    sessionToken(PROJECT, { iss: 'https://other.supabase.co/auth/v1' }),
    sessionToken(PROJECT, { aud: 'anon' }),
    sessionToken(PROJECT, { sub: '' }),
    `${sessionToken(PROJECT).split('.').slice(0, 2).join('.')}.`,
  ];
  for (const t of bad) {
    resetChulaGate();
    calls.bearers.length = 0;
    const g = await chulaGate(withToken('203.0.113.79', t), { env: ENV, fetchImpl });
    assert.equal(g.status, 401, t.slice(0, 30));
    assert.ok(!calls.bearers.includes(t), `${t.slice(0, 30)} reached the database`);
  }
});

test('a deployed preview without database settings refuses; local development stays open', async () => {
  resetChulaGate();
  const preview = await chulaGate({ headers: {} }, { env: { VERCEL_ENV: 'preview' } });
  assert.equal(preview.ok, false);
  assert.equal(preview.status, 503);
  resetChulaGate();
  assert.equal((await chulaGate({ headers: {} }, { env: { VERCEL_ENV: 'production' } })).status, 503);
  resetChulaGate();
  assert.equal((await chulaGate({ headers: {} }, { env: { VERCEL_ENV: 'development' } })).ok, true, 'vercel dev on a laptop');
  resetChulaGate();
  assert.equal((await chulaGate({ headers: {} }, { env: {} })).ok, true, 'the dev server and the unit suite');
});

// ── Feedback ────────────────────────────────────────────────────────────────

async function feedback(fetchImpl, reqs) {
  const saved = { ...process.env };
  const realFetch = globalThis.fetch;
  Object.assign(process.env, { RESEND_API_KEY: 're_test', SUPABASE_URL: 'https://db.example', SUPABASE_ANON_KEY: 'anon-test-0123456789abcdef' });
  globalThis.fetch = fetchImpl;
  const { default: handler } = await import('../../api/send-feedback.js');
  const out = [];
  const error = console.error; console.error = () => {};
  try {
    for (const req of reqs) {
      const res = { statusCode: 200, headers: {}, body: null, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, end() { return this; } };
      await handler({ method: 'POST', url: '/api/send-feedback', socket: {}, ...req }, res);
      out.push(res);
    }
  } finally {
    console.error = error;
    globalThis.fetch = realFetch;
    process.env = saved;
  }
  return out;
}

test('feedback: the mailer\'s own error text never reaches the sender', async () => {
  const [res] = await feedback(async (url) => {
    if (String(url).includes('resend')) return new Response(JSON.stringify({ statusCode: 403, message: 'You can only send testing emails to your own email address (owner@example.com).' }), { status: 403 });
    throw new TypeError('network cut');
  }, [{ headers: { 'x-vercel-forwarded-for': '192.0.2.200' }, body: { message: 'hi' } }]);
  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, { error: 'mailer_error', code: 'mailer_refused' });
});

test('feedback: with the wall off, free accounts are visitors; a full day says daily_cap', async () => {
  resetChulaGate();
  let sent = 0;
  const fetchImpl = async (url, init) => {
    const u = String(url);
    if (u.includes('chula_access_state')) {
      const auth = init?.headers?.Authorization || '';
      const signed = !auth.includes('anon-test');
      return Response.json({ enforce: false, signed_in: signed, member: false, uid: signed ? `acct-${auth.slice(-6)}` : null });
    }
    if (u.includes('resend')) { sent++; return Response.json({ id: 'x' }); }
    throw new TypeError('network cut');
  };
  const reqs = Array.from({ length: 50 }, (_, i) => ({
    headers: { authorization: `Bearer ${sessionToken('https://db.example', { sub: `throwaway-${i}` })}`, 'x-vercel-forwarded-for': `192.0.2.${100 + (i % 5)}` },
    body: { message: `spam ${i}` },
  }));
  const out = await feedback(fetchImpl, reqs);
  assert.ok(sent <= 15, `50 throwaway accounts on 5 addresses sent ${sent}: each address is a visitor with 3 in 10 minutes`);
  assert.ok(out.some((r) => r.statusCode === 429 && r.body?.reason === 'rate_limited'));
});

test('feedback: a visitor\'s full day is answered daily_cap, not "wait ten minutes"', async () => {
  const { FEEDBACK_RATE } = await import('../../api/send-feedback.js');
  assert.equal(FEEDBACK_RATE.visitorDaily, 20);
  const ip = '192.0.2.250';
  // Fill the address's day directly; the next message must say so.
  for (let i = 0; i < FEEDBACK_RATE.visitorDaily; i++) await rateLimit(`feedback-day:${ip}`, FEEDBACK_RATE.visitorDaily, 24 * 3600_000);
  const [res] = await feedback(async () => { throw new TypeError('network cut'); }, [{ headers: { 'x-vercel-forwarded-for': ip }, body: { message: 'hi' } }]);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.reason, 'daily_cap');
  assert.equal(res.body.scope, 'caller');
});

test('feedback: a member stopped by the shared network\'s ceiling is told it is the network', async () => {
  resetChulaGate();
  const { FEEDBACK_RATE } = await import('../../api/send-feedback.js');
  const ip = '192.0.2.240';
  const token = sessionToken('https://db.example', { sub: 'one-message-member' });
  for (let i = 0; i < FEEDBACK_RATE.addressBurst; i++) await rateLimit(`feedback:addr:${ip}`, FEEDBACK_RATE.addressBurst, 10 * 60_000);
  const fetchImpl = async (url, init) => {
    if (String(url).includes('chula_access_state')) {
      const auth = init?.headers?.Authorization || '';
      return auth.includes(token) ? Response.json({ enforce: true, signed_in: true, member: true, uid: 'm-1' }) : Response.json({ enforce: true, signed_in: false, member: false, uid: null });
    }
    throw new TypeError('network cut');
  };
  const [res] = await feedback(fetchImpl, [{ headers: { 'x-vercel-forwarded-for': ip, authorization: `Bearer ${token}` }, body: { message: 'first and only' } }]);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.reason, 'network_busy');
  const client = await import('../../src/lib/feedback-client.js');
  assert.match(client.FEEDBACK_MESSAGES.network_busy, /เครือข่าย/);
  assert.doesNotMatch(client.FEEDBACK_MESSAGES.network_busy, /ส่งถี่|ครบจำนวนต่อวัน/, 'not the member\'s own burst or day');
});

// ── The library's byte budget ───────────────────────────────────────────────

function blobCall(handler, token, ip) {
  return (async () => {
    const res = { statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, end(b) { if (b !== undefined) this.body = b; return this; }, once() { return this; } };
    await handler({ method: 'GET', url: '/api/library-blob?' + new URLSearchParams(token), headers: { 'x-vercel-forwarded-for': ip } }, res);
    return res;
  })();
}

test('library-blob: a member\'s link is budgeted on their account; one member looping a link stops only themselves', async (t) => {
  const { default: handler, BLOB_BYTES, bytesPulled } = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'budget-test', R2_ACCOUNT_ID: 'acct' });
  const size = 50 * 1024 ** 2;
  assert.equal(bytesPulled({ n: size }, 'bytes=0-1023', false), size, 'a PDF range still pulls the whole object');
  assert.equal(bytesPulled({ n: size }, 'bytes=0-1023', true), 1024, 'a media range pulls up to its end');
  const doc = { storage_bucket: 'b', storage_key: 'docs/deck.pdf', mime: 'application/pdf', byte_size: size, status: 'public' };
  let upstream = 0;
  t.mock.method(globalThis, 'fetch', async () => { upstream++; return new Response(null, { status: 200 }); });
  const hall = '203.0.113.160';
  const looper = mintBlobToken(doc, { user: 'looping-member' });
  const allowed = Math.floor(BLOB_BYTES.max / size);
  for (let i = 0; i < allowed; i++) assert.equal((await blobCall(handler, looper, hall)).statusCode, 200);
  const refused = await blobCall(handler, looper, hall);
  assert.equal(refused.statusCode, 429);
  assert.match(String(refused.headers['content-type']), /text\/html/, 'a page, not JSON, in the deck\'s tab');
  assert.match(String(refused.body), /เปิดไฟล์ไม่ได้ชั่วคราว/);
  assert.match(String(refused.body), /นาที/, 'and when to try again');
  assert.ok(Number(refused.headers['retry-after']) > 0);
  assert.equal(upstream, allowed, 'a refused request never reaches storage');
  // Classmates on the same address, each with their own link, are untouched.
  for (let s = 0; s < 20; s++) assert.equal((await blobCall(handler, mintBlobToken(doc, { user: `classmate-${s}` }), hall)).statusCode, 200);
});

test('library-blob: a link with no member (an open ticket) is budgeted by address', async (t) => {
  const { default: handler, BLOB_BYTES } = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'budget-test', R2_ACCOUNT_ID: 'acct' });
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 200 }));
  const size = 200 * 1024 ** 2;
  const ticket = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/big.pdf', mime: 'application/pdf', byte_size: size, status: 'public' });
  const allowed = Math.floor(BLOB_BYTES.address / size);
  for (let i = 0; i < allowed; i++) assert.equal((await blobCall(handler, ticket, '203.0.113.170')).statusCode, 200);
  assert.equal((await blobCall(handler, ticket, '203.0.113.170')).statusCode, 429);
  assert.equal((await blobCall(handler, ticket, '203.0.113.171')).statusCode, 200, 'another address keeps its own');
});

test('library-blob: reading stays open when the shared limiter is down, bounded by the instance\'s own budget', async (t) => {
  const { default: handler, BLOB_BYTES } = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'budget-test', R2_ACCOUNT_ID: 'acct', NODE_ENV: 'production' });
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 200 }));
  const size = 100 * 1024 ** 2;
  const link = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/outage.pdf', mime: 'application/pdf', byte_size: size, status: 'public' }, { user: 'outage-member' });
  const allowed = Math.floor(BLOB_BYTES.max / size);
  for (let i = 0; i < allowed; i++) assert.equal((await blobCall(handler, link, '203.0.113.180')).statusCode, 200, 'students can still read');
  assert.equal((await blobCall(handler, link, '203.0.113.180')).statusCode, 429, 'and the cost is still bounded');
});

test('the library link carries the member it was minted for', async () => {
  const src = (await import('node:fs')).readFileSync(new URL('../../api/library-file.js', import.meta.url), 'utf8');
  const mints = src.match(/mintBlobToken\(doc, \{[^}]*\}\)/g) || [];
  assert.ok(mints.length >= 2);
  for (const m of mints) assert.match(m, /user: gate\?\.member === true \? gate\.userId : null/);
});
