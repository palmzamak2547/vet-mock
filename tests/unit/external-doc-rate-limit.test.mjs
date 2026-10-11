// ============================================================
// external-doc-rate-limit — a lecture hall behind one campus address
// ============================================================
// Every external-docs endpoint used to charge a small per-address budget
// before anything else: twenty reads an hour shared by everyone on the
// campus Wi-Fi, charged even when the answer came from the shared cache,
// ten connect starts, sixty file lists. Twenty-five students opening the
// sheet their lecturer shared locked each other out.
//
// The shared limiter is Upstash in production, and the limiter module reads
// its credentials when it loads, so this file sets them first and answers
// the Upstash REST pipeline with a tiny in-memory Redis.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.fixture.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'fixture-token';
process.env.VITE_SUPABASE_URL = 'https://fixture.supabase.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-key';
process.env.GOOGLE_OAUTH_CLIENT_ID = 'fixture-client';
process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'fixture-secret';
delete process.env.GOOGLE_API_KEY;

const { default: fetchDoc } = await import('../../api/fetch-external-doc.js');
const { default: listFiles } = await import('../../api/list-external-files.js');
const { default: connectStart } = await import('../../api/external-connect-start.js');
const { default: manage } = await import('../../api/external-connect.js');

const PUBLIC_DOC = 'https://docs.google.com/document/d/PUBLICLECTURESHEET000001/edit';
const privateDoc = (n) => `https://docs.google.com/document/d/PRIVATEDOC${String(n).padStart(14, '0')}/edit`;

function world(t, { connected = false } = {}) {
  const redis = new Map();
  const upstream = { public: 0, drive: 0 };
  const previous = globalThis.fetch;
  globalThis.fetch = async (raw, options = {}) => {
    const url = new URL(raw);
    if (url.hostname === 'upstash.fixture.test') {
      const results = JSON.parse(options.body).map(([cmd, key, ...args]) => {
        if (cmd === 'INCR') { const n = (redis.get(key) || 0) + 1; redis.set(key, n); return { result: n }; }
        if (cmd === 'EXPIRE') return { result: 1 };
        if (cmd === 'TTL') return { result: 3600 };
        if (cmd === 'GET') return { result: redis.has(key) ? redis.get(key) : null };
        if (cmd === 'SET') { redis.set(key, args[0]); return { result: 'OK' }; }
        throw new Error(`unexpected redis command ${cmd}`);
      });
      return { ok: true, json: async () => results };
    }
    if (url.pathname === '/auth/v1/user') {
      const jwt = String(options.headers?.Authorization || '').replace(/^Bearer /, '');
      return jwt ? { ok: true, json: async () => ({ id: `user-${jwt}` }) } : { ok: false, json: async () => ({}) };
    }
    if (url.pathname === '/rest/v1/external_connections') {
      return { ok: true, json: async () => connected ? [{ user_id: 'x', provider: 'google', access_token: 'fixture-access', expires_at: '2999-01-01T00:00:00Z' }] : [] };
    }
    if (url.hostname === 'www.googleapis.com') {
      upstream.drive++;
      if (url.pathname === '/drive/v3/files') return { ok: true, json: async () => ({ files: [] }) };
      return { ok: true, status: 200, url: url.href, text: async () => '# Private notes', json: async () => ({ name: 'Private notes' }) };
    }
    if (url.hostname === 'docs.google.com') {
      upstream.public++;
      return { ok: true, status: 200, url: url.href, text: async () => '# Shared lecture sheet' };
    }
    return { ok: false, status: 404, url: url.href };
  };
  t.after(() => { globalThis.fetch = previous; });
  return { redis, upstream };
}

const response = () => ({ statusCode: 200, headers: {}, body: null,
  setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; },
  json(b) { this.body = b; return this; }, end() { return this; } });
const request = ({ method = 'POST', body = {}, query = {}, jwt = '' } = {}) => ({ method, body, query,
  headers: { host: 'vetmock.test', 'x-forwarded-for': '203.0.113.7', ...(jwt ? { authorization: `Bearer ${jwt}` } : {}) },
  socket: { remoteAddress: '203.0.113.7' } });

test('twenty-five guests on one campus address all open the sheet their lecturer shared', async t => {
  const { upstream } = world(t);
  for (let i = 0; i < 25; i++) {
    const res = response();
    await fetchDoc(request({ body: { url: PUBLIC_DOC } }), res);
    assert.equal(res.statusCode, 200, `guest ${i + 1}: ${JSON.stringify(res.body)}`);
    assert.match(res.body.markdown, /Shared lecture sheet/);
  }
  assert.equal(upstream.public, 1, 'one upstream read, the rest come from the shared cache');
});

test('signed-in classmates on one address each get their own reading budget, and one account still has a limit', async t => {
  const { upstream } = world(t, { connected: true });
  for (let i = 0; i < 25; i++) {
    const res = response();
    await fetchDoc(request({ jwt: `student${i}`, body: { url: privateDoc(i) } }), res);
    assert.equal(res.statusCode, 200, `student ${i + 1}: ${JSON.stringify(res.body)}`);
  }
  assert.ok(upstream.drive >= 25);
  let last;
  for (let i = 0; i < 61; i++) {
    last = response();
    await fetchDoc(request({ jwt: 'busy', body: { url: privateDoc(100 + i) } }), last);
  }
  assert.equal(last.statusCode, 429, 'one account past its hourly reads is refused');
  assert.equal(last.body.reason, 'rate_limited');
});

test('a guest flood of distinct documents is still bounded per address', async t => {
  world(t);
  let last;
  for (let i = 0; i < 41; i++) {
    last = response();
    await fetchDoc(request({ body: { url: `https://docs.google.com/document/d/GUESTDOC${String(i).padStart(16, '0')}/edit` } }), last);
  }
  assert.equal(last.statusCode, 429);
});

test('a class can list files, check connections and start connecting from one address', async t => {
  world(t, { connected: true });
  for (let i = 0; i < 70; i++) {
    const listed = response();
    await listFiles(request({ method: 'GET', jwt: `student${i}`, query: { provider: 'google' } }), listed);
    assert.equal(listed.statusCode, 200, `list ${i + 1}: ${JSON.stringify(listed.body)}`);
    const status = response();
    await manage(request({ jwt: `student${i}`, body: { action: 'status' } }), status);
    assert.equal(status.statusCode, 200, `status ${i + 1}: ${JSON.stringify(status.body)}`);
  }
  for (let i = 0; i < 30; i++) {
    const started = response();
    await connectStart(request({ method: 'GET', jwt: `student${i}`, query: { provider: 'google' } }), started);
    assert.equal(started.statusCode, 200, `start ${i + 1}: ${JSON.stringify(started.body)}`);
  }
  let last;
  for (let i = 0; i < 11; i++) {
    last = response();
    await connectStart(request({ method: 'GET', jwt: 'restless', query: { provider: 'google' } }), last);
  }
  assert.equal(last.statusCode, 429, 'one account starting consent again and again is still refused');
});
