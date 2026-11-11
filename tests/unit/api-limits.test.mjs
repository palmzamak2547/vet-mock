// How the API counts its callers (api/_lib/rate-limit.js limitCaller, the
// gate's failed-token brake, feedback, the library byte budget) and where the
// gate stands open. In-memory limiter, fake database, no network.
import test from 'node:test';
import assert from 'node:assert/strict';
import { limitCaller, rateLimit } from '../../api/_lib/rate-limit.js';
import { chulaGate, resetChulaGate, FAILED_TOKEN_BRAKE } from '../../api/_lib/chula-gate.js';

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

const ENV = { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-key-0123456789abcdef' };
function database() {
  const calls = { n: 0 };
  const fetchImpl = async (url, init) => {
    calls.n++;
    const bearer = init.headers.Authorization.slice(7);
    if (bearer === 'member.token.0123456789abcdef') return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-m' });
    if (bearer === ENV.VITE_SUPABASE_ANON_KEY) return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
    return new Response('{"message":"invalid JWT"}', { status: 401 });
  };
  return { calls, fetchImpl };
}
const withToken = (ip, token) => ({ headers: { 'x-vercel-forwarded-for': ip, authorization: `Bearer ${token}` } });

test('forged tokens from one address stop reaching the database once they have failed many times', async () => {
  resetChulaGate();
  const { calls, fetchImpl } = database();
  const ip = '203.0.113.77';
  for (let i = 0; i < FAILED_TOKEN_BRAKE.max; i++) {
    const g = await chulaGate(withToken(ip, `forged.${i}.0123456789abcdefghij`), { env: ENV, fetchImpl });
    assert.equal(g.status, 401);
  }
  const before = calls.n;
  for (let i = 0; i < 200; i++) {
    const g = await chulaGate(withToken(ip, `forged.more.${i}.0123456789abcdef`), { env: ENV, fetchImpl });
    assert.equal(g.status, 429);
  }
  assert.equal(calls.n, before, 'a braked address costs the database nothing');
  // Another address, and a member already checked on this instance, are untouched.
  assert.equal((await chulaGate(withToken('203.0.113.78', 'member.token.0123456789abcdef'), { env: ENV, fetchImpl })).member, true);
  assert.equal((await chulaGate(withToken(ip, 'member.token.0123456789abcdef'), { env: ENV, fetchImpl })).member, true, 'remembered members are not braked');
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
    headers: { authorization: `Bearer tok${String(i).padStart(30, '0')}`, 'x-vercel-forwarded-for': `192.0.2.${100 + (i % 5)}` },
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

// ── The library's byte budget ───────────────────────────────────────────────

test('library-blob: bytes pulled through the function are budgeted per address, and an outage refuses', async (t) => {
  const { default: handler, BLOB_BYTES, bytesPulled } = await import('../../api/library-blob.js');
  const { mintBlobToken } = await import('../../api/_lib/blob-token.js');
  const saved = { ...process.env };
  t.after(() => { process.env = saved; });
  Object.assign(process.env, { CLOUDFLARE_API_TOKEN: 'budget-test', R2_ACCOUNT_ID: 'acct' });
  const size = 50 * 1024 ** 2;
  assert.equal(bytesPulled({ n: size }, 'bytes=0-1023', false), size, 'a PDF range still pulls the whole object');
  assert.equal(bytesPulled({ n: size }, 'bytes=0-1023', true), 1024, 'a media range pulls up to its end');
  const token = mintBlobToken({ storage_bucket: 'b', storage_key: 'docs/deck.pdf', mime: 'application/pdf', byte_size: size, status: 'public' });
  let upstream = 0;
  t.mock.method(globalThis, 'fetch', async () => { upstream++; return new Response(null, { status: 200 }); });
  const call = async (ip) => {
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, end() { return this; }, once() { return this; } };
    await handler({ method: 'GET', url: '/api/library-blob?' + new URLSearchParams(token), headers: { 'x-vercel-forwarded-for': ip } }, res);
    return res.statusCode;
  };
  const allowed = Math.floor(BLOB_BYTES.max / size);
  const ip = '203.0.113.150';
  for (let i = 0; i < allowed; i++) assert.equal(await call(ip), 200);
  assert.equal(await call(ip), 429, `the ${allowed + 1}th 50 MB pull in the window is refused`);
  assert.equal(upstream, allowed);
  process.env.NODE_ENV = 'production';
  assert.equal(await call('203.0.113.151'), 503, 'a limiter that cannot count refuses');
});
