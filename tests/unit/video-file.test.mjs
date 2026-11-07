// /api/video-file: our copy of a lecture video, for a signed-in student only.
// Pins that a crafted id or kind signs nothing, that a guest gets 401 before
// any storage call, that the Chula wall decides who may watch, and that a
// student's link is a six-hour presigned R2 GET built from the Cloudflare
// token, with no secret in the answer.

import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { VIDEO_TTL } from '../../api/video-file.js';
import { resetChulaGate } from '../../api/_lib/chula-gate.js';
import { VIDEO_REGISTRY } from '../../src/data/video-registry.generated.js';

const withCopy = Object.keys(VIDEO_REGISTRY).find((id) => VIDEO_REGISTRY[id].media);
const cardOnly = Object.keys(VIDEO_REGISTRY).find((id) => VIDEO_REGISTRY[id].card && !VIDEO_REGISTRY[id].media);
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

// The database's answer on who is let in (public.chula_access_state).
const wall = (enforce, byToken) => async (u, init) => {
  const url = String(u);
  if (url === 'https://db.example/rest/v1/rpc/chula_access_state') {
    const bearer = init.headers.Authorization.slice(7);
    const who = byToken[bearer] || { signed_in: false, member: false, uid: null };
    return new Response(JSON.stringify({ enforce, ...who }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  if (url.endsWith('/user/tokens/verify')) return { ok: true, status: 200, json: async () => ({ success: true, result: { id: 'token-id', status: 'active' } }) };
  throw new Error(`unrouted ${url}`);
};
const STUDENT = 'a'.repeat(40);

test('a guest is asked to sign in before any storage call', async () => {
  resetChulaGate();
  const real = globalThis.fetch;
  globalThis.fetch = wall(false, {});
  try {
    const r = await call(`/api/video-file?v=${withCopy}&f=video`);
    assert.equal(r.status, 401);
    assert.equal(r.body.error, 'login_required');
  } finally {
    globalThis.fetch = real;
  }
});

test('with the wall on, an account without a Chula email is refused', async () => {
  resetChulaGate();
  const real = globalThis.fetch;
  globalThis.fetch = wall(true, { [STUDENT]: { signed_in: true, member: false, uid: 'gmail-1' } });
  try {
    const r = await call(`/api/video-file?v=${withCopy}&f=video`, { auth: STUDENT });
    assert.equal(r.status, 403);
    assert.equal(r.body.error, 'chula_required');
  } finally {
    globalThis.fetch = real;
  }
});

test('a carded clip without our copy still has its transcript, but no video link', async () => {
  // The audit of 2 Nov: transcripts were kept for every card and served for five.
  resetChulaGate();
  const real = globalThis.fetch;
  const asked = [];
  const db = wall(false, { [STUDENT]: { signed_in: true, member: false, uid: 'student-1' } });
  globalThis.fetch = async (u, init) => {
    if (String(u).includes(`/videos/${cardOnly}/transcript.json`)) { asked.push(String(u)); return new Response(JSON.stringify({ lines: [[12, 'สวัสดี']] }), { status: 200 }); }
    return db(u, init);
  };
  try {
    assert.ok(cardOnly, 'the registry has a carded clip without our copy');
    assert.equal((await call(`/api/video-file?v=${cardOnly}&f=video`, { auth: STUDENT })).status, 404);
    const r = await call(`/api/video-file?v=${cardOnly}&f=transcript`, { auth: STUDENT });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.deepEqual(r.body.lines, [[12, 'สวัสดี']]);
    assert.equal(asked.length, 1);
  } finally {
    globalThis.fetch = real;
  }
});

test('a student gets a six-hour presigned link to our copy, and no secret', async () => {
  resetChulaGate();
  const real = globalThis.fetch;
  globalThis.fetch = wall(false, { [STUDENT]: { signed_in: true, member: false, uid: 'student-1' } });
  try {
    const r = await call(`/api/video-file?v=${withCopy}&f=video`, { auth: STUDENT });
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
