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
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const bad = [
    'forged.token.0123456789abcdefghij',
    'a'.repeat(40),
    `${b64({ alg: 'ES256' })}.${Buffer.from('[1,2]').toString('base64url')}.c2ln`,
    sessionToken(PROJECT, { sub: '' }),
    `${b64({ alg: 'ES256' })}.${b64({ sub: 'u-x', aud: 'authenticated' })}.c2ln`, // no exp
    sessionToken(PROJECT, { sub: 'u-old', expInSec: -61 }),
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

test('a token that expired inside the clock margin still reaches the database', async () => {
  resetChulaGate();
  const recent = sessionToken(PROJECT, { sub: 'u-m', expInSec: -30 });
  const asked = [];
  const fetchImpl = async (url, init) => {
    const bearer = init.headers.Authorization.slice(7);
    asked.push(bearer);
    if (bearer === recent) return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-m' });
    return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
  };
  const g = await chulaGate(withToken('203.0.113.91', recent), { env: ENV, fetchImpl });
  assert.ok(asked.includes(recent), 'thirty seconds past exp: the database decides');
  assert.equal(g.member, true);
});

test('an issuer or audience that differs from the configured project never turns a member into a guest', async () => {
  const shapes = {
    'configured with a trailing slash': { env: { ...ENV, VITE_SUPABASE_URL: `${PROJECT}/` }, iss: `${PROJECT}/auth/v1` },
    'token issuer with a trailing slash': { env: ENV, iss: `${PROJECT}/auth/v1/` },
    'a custom auth domain': { env: ENV, iss: 'https://auth.vetmock.com/auth/v1' },
    'a preview configured with another address': { env: { ...ENV, VITE_SUPABASE_URL: 'https://preview-branch.supabase.co' }, iss: `${PROJECT}/auth/v1` },
    'another sign-in path (a different audience)': { env: ENV, iss: `${PROJECT}/auth/v1`, aud: ['authenticated', 'line'] },
    'no audience at all': { env: ENV, iss: `${PROJECT}/auth/v1`, aud: null },
  };
  const warn = console.warn; console.warn = () => {};
  try {
    for (const [name, shape] of Object.entries(shapes)) {
      resetChulaGate();
      const token = sessionToken(PROJECT, { sub: 'u-real', iss: shape.iss, ...(Object.hasOwn(shape, 'aud') ? { aud: shape.aud } : {}), tag: name });
      const asked = [];
      const fetchImpl = async (url, init) => {
        const bearer = init.headers.Authorization.slice(7);
        asked.push(bearer);
        if (bearer === token) return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-real' });
        return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
      };
      const g = await chulaGate(withToken('203.0.113.92', token), { env: shape.env, fetchImpl });
      assert.ok(asked.includes(token), `${name}: reached the database`);
      assert.equal(g.member, true, `${name}: a member when the database says so`);
    }
  } finally { console.warn = warn; }
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
  assert.equal(bytesPulled({ n: size }, false), size, 'a document counts the whole object');
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

// ── Media ranges, and what the byte budget counts ───────────────────────────

async function mediaCall(handler, token, { range, ip = '203.0.113.200' } = {}) {
  const { Writable } = await import('node:stream');
  const res = new Writable({ write(_c, _e, done) { done(); } });
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  await handler({ method: 'GET', url: '/api/library-blob?' + new URLSearchParams(token), headers: { 'x-vercel-forwarded-for': ip, ...(range ? { range } : {}) } }, res);
  return res;
}

async function mediaSetup(t, { size, mime = 'video/mp4', user = 'viewer', body = 16 }) {
  const mod = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'media-test', R2_ACCOUNT_ID: 'acct' });
  const reads = { calls: 0, bytes: 0 };
  // Storage ignores Range and answers the whole object; a few bytes stand for it.
  t.mock.method(globalThis, 'fetch', async () => {
    reads.calls++;
    const bytes = new Uint8Array(body);
    // highWaterMark 0: a byte counts as read only when the handler asks for it.
    return new Response(new ReadableStream({ pull(c) { reads.bytes += bytes.length; c.enqueue(bytes); c.close(); } }, { highWaterMark: 0 }), { status: 200 });
  });
  const token = mintBlobToken({ storage_bucket: 'b', storage_key: `docs/${user}.bin`, mime, byte_size: size, status: 'public' }, { user });
  return { ...mod, token, reads };
}

test('media: Chrome\'s 0- then N- are served as asked, as before the branch', async (t) => {
  const size = 1000;
  const { default: handler, token } = await mediaSetup(t, { size, user: 'chrome', body: size });
  const first = await mediaCall(handler, token, { range: 'bytes=0-' });
  assert.equal(first.statusCode, 206);
  assert.equal(first.headers['content-range'], `bytes 0-999/${size}`);
  const seek = await mediaCall(handler, token, { range: 'bytes=600-' });
  assert.equal(seek.headers['content-range'], `bytes 600-999/${size}`);
  assert.equal(seek.headers['content-length'], '400');
});

test('media: Safari\'s two-byte probe is answered with two bytes', async (t) => {
  const { default: handler, token } = await mediaSetup(t, { size: 1000, user: 'safari', body: 1000 });
  const probe = await mediaCall(handler, token, { range: 'bytes=0-1' });
  assert.equal(probe.statusCode, 206);
  assert.equal(probe.headers['content-range'], 'bytes 0-1/1000');
  assert.equal(probe.headers['content-length'], '2');
});

test('media: a range past the end and a multiple range are 416, with no body read', async (t) => {
  const { default: handler, token, reads } = await mediaSetup(t, { size: 16, user: 'past-end' });
  const past = await mediaCall(handler, token, { range: 'bytes=16-' });
  assert.equal(past.statusCode, 416);
  assert.equal(past.headers['content-range'], 'bytes */16');
  const multi = await mediaCall(handler, token, { range: 'bytes=0-1,4-5' });
  assert.equal(multi.statusCode, 416);
  assert.equal(reads.bytes, 0, 'the object body is let go unread');
});

test('budget: a 300 MB video with 20 seeks is never refused by the byte budget; a 300 MB document is', async (t) => {
  const size = 300 * 1024 * 1024;
  const video = await mediaSetup(t, { size, user: 'lecture-video' });
  assert.equal(video.bytesPulled({ n: size }, true), 0, 'video and audio are outside the byte budget');
  for (let s = 0; s <= 20; s++) {
    const at = s === 0 ? 0 : ((s * 7919) % 300) * 1024 * 1024;
    const res = await mediaCall(video.default, video.token, { range: `bytes=${at}-` });
    assert.notEqual(res.statusCode, 429, `seek ${s}`);
  }
  // The same pattern on a 300 MB document: 2 GB holds six, the seventh is refused.
  const doc = await mediaSetup(t, { size, mime: 'application/pdf', user: 'big-deck' });
  const allowed = Math.floor(doc.BLOB_BYTES.max / size);
  assert.equal(allowed, 6);
  for (let s = 0; s < allowed; s++) assert.equal((await mediaCall(doc.default, doc.token, { range: `bytes=${s}-` })).statusCode, 200);
  assert.equal((await mediaCall(doc.default, doc.token, { range: 'bytes=0-' })).statusCode, 429);
});

test('budget: BLOB_RATE still stops the 301st request on one media link', async (t) => {
  const { default: handler, token, BLOB_RATE } = await mediaSetup(t, { size: 16, user: 'rate-video' });
  for (let i = 0; i < BLOB_RATE.max; i++) assert.equal((await mediaCall(handler, token, { range: 'bytes=0-1' })).statusCode, 206, `request ${i + 1}`);
  assert.equal((await mediaCall(handler, token, { range: 'bytes=0-1' })).statusCode, 429);
});

test('budget: a document with no catalogued size is counted by the bytes it streamed', async (t) => {
  const mb = 1024 * 1024;
  const { default: handler, token, BLOB_BYTES, reads } = await mediaSetup(t, { size: 0, mime: 'application/pdf', user: 'unsized', body: 512 * mb });
  // Each open streams 512 MB; 2 GB holds four, and the fifth finds the budget spent.
  for (let i = 0; i < 4; i++) assert.equal((await mediaCall(handler, token)).statusCode, 200, `open ${i + 1}`);
  await new Promise((r) => setImmediate(r));
  assert.equal(reads.bytes, 4 * 512 * mb);
  assert.ok(4 * 512 * mb >= BLOB_BYTES.max);
  assert.equal((await mediaCall(handler, token)).statusCode, 429, 'counted as sent, not as one byte');
});

test('media: a PDF without Range is answered whole as before', async (t) => {
  const { default: handler, token, bytesPulled } = await mediaSetup(t, { size: 16, mime: 'application/pdf', user: 'reader' });
  const res = await mediaCall(handler, token, {});
  assert.equal(res.statusCode, 200);
  assert.equal(res.headers['content-range'], undefined);
  assert.equal(res.headers['accept-ranges'], 'none');
  assert.equal(bytesPulled({ n: 16 }, false), 16);
});

test('the link carries a keyed digest of the member, never the account id', async () => {
  const { mintBlobToken, verifyBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = process.env.CLOUDFLARE_API_TOKEN;
  process.env.CLOUDFLARE_API_TOKEN = 'digest-test';
  try {
    const uid = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const doc = { storage_bucket: 'b', storage_key: 'docs/x.pdf', mime: 'application/pdf', byte_size: 1, status: 'public' };
    const tok = mintBlobToken(doc, { user: uid });
    assert.ok(!Buffer.from(tok.t, 'base64url').toString('utf8').includes(uid), 'anyone handed the link reads its payload');
    const p = verifyBlobToken(tok.t, tok.s);
    assert.match(p.u, /^[A-Za-z0-9_-]{22}$/);
    const again = mintBlobToken(doc, { user: uid });
    assert.equal(verifyBlobToken(again.t, again.s).u, p.u, 'the same member, the same budget');
    assert.notEqual(verifyBlobToken(...Object.values(mintBlobToken(doc, { user: 'someone-else' }))).u, p.u);
  } finally {
    if (saved === undefined) delete process.env.CLOUDFLARE_API_TOKEN; else process.env.CLOUDFLARE_API_TOKEN = saved;
  }
});
