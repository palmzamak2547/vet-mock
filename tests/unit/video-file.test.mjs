// /api/video-file: our copy of a lecture video, for a signed-in student only.
// Pins that a crafted id or kind signs nothing, that a guest gets 401 before
// any storage call, and that a student's link is a six-hour presigned R2 GET
// built from the Cloudflare token, with no secret in the answer.

import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { VIDEO_TTL } from '../../api/video-file.js';
import { VIDEO_REGISTRY } from '../../src/data/video-registry.generated.js';

const withCopy = Object.keys(VIDEO_REGISTRY).find((id) => VIDEO_REGISTRY[id].media);
const ENV = { VITE_SUPABASE_URL: 'https://db.example', VITE_SUPABASE_ANON_KEY: 'anon-key', CLOUDFLARE_API_TOKEN: 'cf-secret-token', R2_ACCOUNT_ID: 'acct' };

const call = async (url, { method = 'GET', auth } = {}) => {
  const res = { statusCode: 0, headers: {}, body: '', setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(b) { this.body = b; } };
  await handler({ method, url, headers: { ...(auth && { authorization: `Bearer ${auth}` }), 'x-forwarded-for': '203.0.113.9' } }, res, { env: ENV });
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null, headers: res.headers };
};

test('a bad id, a bad kind or an id without our copy signs nothing', async () => {
  assert.equal((await call('/api/video-file?v=x&f=video')).status, 400);
  assert.equal((await call(`/api/video-file?v=${withCopy}&f=../secret`)).status, 400);
  assert.equal((await call('/api/video-file?v=AAAAAAAAAAA&f=video')).status, 404);
  assert.equal((await call(`/api/video-file?v=${withCopy}`, { method: 'POST' })).status, 405);
});

test('a guest is asked to sign in before any storage call', async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async (u) => { throw new Error(`no network for a guest: ${u}`); };
  try {
    const r = await call(`/api/video-file?v=${withCopy}&f=video`);
    assert.equal(r.status, 401);
    assert.equal(r.body.error, 'login_required');
  } finally {
    globalThis.fetch = real;
  }
});

test('a student gets a six-hour presigned link to our copy, and no secret', async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async (u) => {
    const url = String(u);
    if (url === 'https://db.example/auth/v1/user') return { ok: true, status: 200, json: async () => ({ id: 'student-1' }) };
    if (url.endsWith('/user/tokens/verify')) return { ok: true, status: 200, json: async () => ({ success: true, result: { id: 'token-id', status: 'active' } }) };
    throw new Error(`unrouted ${url}`);
  };
  try {
    const r = await call(`/api/video-file?v=${withCopy}&f=video`, { auth: 'a'.repeat(40) });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.expiresIn, VIDEO_TTL);
    const link = new URL(r.body.url);
    assert.equal(link.host, 'acct.r2.cloudflarestorage.com');
    assert.equal(link.pathname, `/vetmock-library/videos/${withCopy}/video.mp4`);
    assert.equal(link.searchParams.get('X-Amz-Expires'), String(6 * 3600));
    assert.match(link.searchParams.get('X-Amz-Credential'), /^token-id\//);
    assert.ok(!JSON.stringify(r.body).includes('cf-secret-token'), 'the token never leaves');
    assert.equal(r.headers['cache-control'], 'private, no-store');
  } finally {
    globalThis.fetch = real;
  }
});
