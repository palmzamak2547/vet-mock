// Trial links for the assistant (api/_lib/guest-pass.js; docs/CHULA-SIGNIN.md, "Trial links").
//
// The header parser, the database call against a stub, and the three routes it
// concerns with the real handlers: /api/ai-chat and /api/ai-transcribe take a
// pass from a request with no session and continue as a guest with no token;
// a session token is judged by the gate as before, whatever header rides with
// it; /api/ai-voice never reads the header. The database function itself runs
// on the CI Postgres in scripts/test-chula-wall-db.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { passOf, trialPassOf, usePass, PASS_HEADER } from '../../api/_lib/guest-pass.js';
import { resetChulaGate } from '../../api/_lib/chula-gate.js';
import { IP_BURST } from '../../api/_lib/ai/config.js';
import { LIMIT_MESSAGES } from '../../api/_lib/ai/limits.js';
import chat from '../../api/ai-chat.js';
import transcribe from '../../api/ai-transcribe.js';
import voice from '../../api/ai-voice.js';
import { sessionToken } from '../helpers/supabase-jwt.mjs';

const URL_ = 'https://x.supabase.co';
const ANON = 'anon-key-0123456789abcdef';
const env = { VITE_SUPABASE_URL: URL_, VITE_SUPABASE_ANON_KEY: ANON };
// Shaped like a code, and no pass anywhere: the stubs below decide what is good.
const CODE = 'unit-test-code_not-a-pass-0001';
const OTHER = 'unit-test-code_not-a-pass-0002';
const MEMBER = sessionToken(URL_, { sub: 'u-member' });
const GMAIL = sessionToken(URL_, { sub: 'u-gmail' });
const REVOKED = sessionToken(URL_, { sub: 'u-revoked' });

// ── the header ──────────────────────────────────────────────
const withHeader = (value, more = {}) => ({ headers: { ...(value === undefined ? {} : { [PASS_HEADER]: value }), ...more } });

test('the header is read only when it is shaped like a code', () => {
  assert.equal(PASS_HEADER, 'x-vetmock-pass');
  for (const good of [CODE, 'a'.repeat(22), 'Z'.repeat(64), 'aA0_-'.repeat(6)]) assert.equal(passOf(withHeader(good)), good);
  const bad = [
    undefined, '', 'a'.repeat(21), 'a'.repeat(65), 'a'.repeat(20_000),
    `${'a'.repeat(21)} `, `${'a'.repeat(22)}\n`, `${'a'.repeat(22)}\r\nX-Injected: 1`, `${'a'.repeat(21)}.`, `${'a'.repeat(21)}+`,
    `${'a'.repeat(21)}/`, `${'a'.repeat(21)}=`, `${'a'.repeat(21)}ก`, `${CODE}, ${CODE}`,
    [CODE], 1234567890123456789012, null, { toString: () => CODE },
  ];
  for (const value of bad) assert.equal(passOf(withHeader(value)), '', JSON.stringify(String(value).slice(0, 40)));
  assert.equal(passOf({}), '');
  assert.equal(passOf(null), '');
});

test('a session token outranks a pass: the header speaks only for a request without one', () => {
  assert.equal(trialPassOf(withHeader(CODE)), CODE);
  assert.equal(trialPassOf(withHeader(CODE, { authorization: `Bearer ${MEMBER}` })), '', 'a member is never turned into a trial visitor');
  assert.equal(trialPassOf(withHeader(CODE, { authorization: 'Bearer short' })), CODE, 'what the gate reads as no token is no token here');
  assert.equal(trialPassOf(withHeader(undefined, { authorization: `Bearer ${MEMBER}` })), '');
});

// ── the database call ───────────────────────────────────────
/** The pass function behind PostgREST: `answer(code, count)` gives the JSON body, a status, or throws. */
function passBackend(answer) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    assert.equal(url, `${URL_}/rest/v1/rpc/ai_guest_pass_use`);
    const body = JSON.parse(init.body);
    calls.push({ ...body, init });
    const out = await answer(body.p_code, body.p_count);
    if (typeof out === 'number') return new Response('{"message":"no"}', { status: out });
    if (typeof out === 'string') return new Response(out, { status: 200 });
    return Response.json(out);
  };
  return { calls, fetchImpl };
}
const GOOD = { ok: true, expires_at: '2026-11-22T00:00:00+00:00', left: 199 };

test('a good pass is a guest: no account, no token, not a member', async () => {
  const { calls, fetchImpl } = passBackend(() => GOOD);
  assert.deepEqual(await usePass(CODE, { env, fetchImpl }), { ok: true, userId: null, token: null, member: false, trial: true });
  const { init, ...sent } = calls[0];
  assert.deepEqual(sent, { p_code: CODE, p_count: true }, 'one message is counted unless the caller says otherwise');
  assert.equal(init.method, 'POST');
  assert.equal(init.redirect, 'error');
  assert.ok(init.signal instanceof AbortSignal, 'the call has a deadline');
  assert.deepEqual(init.headers, { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json' }, 'asked with the public key, never a session');
  await usePass(CODE, { count: false, env, fetchImpl });
  assert.equal(calls[1].p_count, false);
});

test('a pass the database refuses is 401 pass_invalid, whatever the reason', async () => {
  for (const reason of ['invalid', 'expired', 'spent']) {
    const { fetchImpl } = passBackend(() => ({ ok: false, reason }));
    const out = await usePass(CODE, { env, fetchImpl });
    assert.equal(out.status, 401, reason);
    assert.deepEqual(out.body, { error: 'pass_invalid', message: 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว' }, reason);
  }
  const { calls, fetchImpl } = passBackend(() => GOOD);
  for (const malformed of ['', 'short', 'a'.repeat(65), `${'a'.repeat(22)}'--`, null, undefined, 42, [CODE]]) {
    assert.equal((await usePass(malformed, { env, fetchImpl })).status, 401);
  }
  assert.equal(calls.length, 0, 'a value that is not shaped like a code never reaches the database');
});

test('when the database cannot be asked the answer is 503, never an opening', async () => {
  const quiet = console.warn;
  console.warn = () => {};
  try {
    const failures = {
      'the network is down': () => { throw new TypeError('fetch failed'); },
      'the call timed out': () => { throw Object.assign(new Error('timeout'), { name: 'TimeoutError' }); },
      'the database errored': () => 500,
      'the function is not there yet': () => 404,
      'the pre-request refused the call': () => 403,
      'the key was refused': () => 401,
      'the limiter refused the call': () => 429,
      'the body is not JSON': () => 'not json',
      'the answer has no verdict': () => ({}),
      'the answer is a list': () => [GOOD],
      'the verdict is not a boolean': () => ({ ok: 'true' }),
      'the reason is not one we know': () => ({ ok: false, reason: 'maybe' }),
      'the answer is null': () => null,
    };
    for (const [name, answer] of Object.entries(failures)) {
      const { fetchImpl } = passBackend(answer);
      const out = await usePass(CODE, { env, fetchImpl });
      assert.equal(out.ok, false, name);
      assert.equal(out.status, 503, name);
      assert.equal(out.body.error, 'backend-unavailable', name);
    }
    const { calls, fetchImpl } = passBackend(() => GOOD);
    assert.equal((await usePass(CODE, { env: {}, fetchImpl })).status, 503, 'no database configured: nothing can vouch for the code');
    assert.equal((await usePass(CODE, { env: { VITE_SUPABASE_URL: URL_ }, fetchImpl })).status, 503);
    assert.equal(calls.length, 0);
  } finally {
    console.warn = quiet;
  }
});

// ── the routes ──────────────────────────────────────────────
function fakeRes() {
  const res = new EventEmitter();
  Object.assign(res, {
    statusCode: 200, headers: {}, body: undefined, chunks: [], ended: false,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    getHeader(k) { return res.headers[k.toLowerCase()]; },
    flushHeaders() {},
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; res.ended = true; return res; },
    write(c) { res.chunks.push(String(c)); return true; },
    end() { res.ended = true; res.emit('close'); return res; },
  });
  return res;
}
let ipSeq = 1;
function fakeReq({ method = 'POST', body, headers = {}, ip } = {}) {
  return { method, body, url: '/api/x', headers: { host: 'vetmock.com', origin: 'https://ai.vetmock.com', ...headers }, socket: { remoteAddress: ip || `10.77.0.${ipSeq++}` } };
}
const events = (res) => res.chunks.join('').split('\n\n').filter(Boolean).map((block) => /^event: (.+)$/m.exec(block)[1]);
const sse = (parts) => {
  const enc = new TextEncoder();
  return new Response(new ReadableStream({ start(c) { for (const p of parts) c.enqueue(enc.encode(p)); c.close(); } }), { headers: { 'content-type': 'text/event-stream' } });
};
const ds = (text) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
const GREETING = { messages: [{ role: 'user', content: 'สวัสดีครับ' }] };
const QUESTION = { messages: [{ role: 'user', content: 'ระยะฟักตัวของโรคพิษสุนัขบ้าในสุนัขนานเท่าไหร่' }], image: null };

/**
 * The world outside the handlers: the database (the wall on, the pass function
 * answering from `passes`), the model, and nothing else. Everything written to
 * the console is kept, so a test can show the code never reaches a log.
 */
async function world({ passes = {}, passFails = false, vars = {} }, fn) {
  const seen = { pass: [], gate: [], walled: [], model: 0, other: [], logs: [] };
  const fetchStub = async (url, init) => {
    const u = String(url);
    if (u === `${URL_}/rest/v1/rpc/ai_guest_pass_use`) {
      const body = JSON.parse(init.body);
      seen.pass.push(body);
      if (passFails) throw new TypeError('fetch failed');
      const left = passes[body.p_code];
      if (!Number.isInteger(left)) return Response.json({ ok: false, reason: 'invalid' });
      if (left <= 0) return Response.json({ ok: false, reason: 'spent' });
      if (body.p_count) passes[body.p_code] = left - 1;
      return Response.json({ ok: true, expires_at: GOOD.expires_at, left: passes[body.p_code] });
    }
    if (u === `${URL_}/rest/v1/rpc/chula_access_state`) {
      const bearer = init.headers.Authorization.slice(7);
      seen.gate.push(bearer);
      if (bearer === REVOKED) return new Response('{"message":"JWT expired"}', { status: 401 });
      if (bearer === MEMBER) return Response.json({ enforce: true, signed_in: true, member: true, uid: 'u-member' });
      if (bearer === GMAIL) return Response.json({ enforce: true, signed_in: true, member: false, uid: 'u-gmail' });
      return Response.json({ enforce: true, signed_in: false, member: false, uid: null });
    }
    if (u.startsWith(`${URL_}/`)) {
      // Anything else in the database, answered as the wall answers a caller who is not a member
      // (the pre-request, 20261101170000_chula_wall.sql): refused, whatever was asked.
      seen.walled.push({ path: u.slice(URL_.length), bearer: init.headers.Authorization });
      return new Response('{"code":"42501","message":"chula_member_required"}', { status: 401 });
    }
    if (u.includes('api.deepseek.com')) {
      seen.model += 1;
      if (JSON.parse(init.body).stream !== true) {
        return Response.json({ choices: [{ message: { content: JSON.stringify({ intent: 'answer', query_th: QUESTION.messages[0].content, terms_en: ['rabies', 'incubation period', 'dog'], subjects: [] }) } }] });
      }
      return sse([ds('ตอบ [1]'), 'data: [DONE]\n\n']);
    }
    seen.other.push(u);
    throw new Error(`no other network: ${u}`);
  };
  const all = { ...env, DEEPSEEK_API_KEY: 'test', ANTHROPIC_API_KEY: undefined, LLM_MODEL: undefined, IAPP_API_KEY: undefined, CF_AI_TOKEN: undefined, ...vars };
  const saved = {};
  for (const [k, v] of Object.entries(all)) { saved[k] = process.env[k]; if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  const realFetch = globalThis.fetch;
  const real = { log: console.log, warn: console.warn, error: console.error };
  for (const level of Object.keys(real)) console[level] = (...args) => { seen.logs.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')); };
  globalThis.fetch = fetchStub;
  resetChulaGate();
  try {
    await fn(seen);
  } finally {
    globalThis.fetch = realFetch;
    Object.assign(console, real);
    for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    resetChulaGate();
  }
  return seen;
}
const run = async (handler, req) => { const res = fakeRes(); await handler(req, res); return res; };
const neverLogged = (seen) => { for (const line of seen.logs) for (const code of [CODE, OTHER]) assert.ok(!line.includes(code), 'the code never reaches a log'); };

test('chat: a good pass with no session answers as a guest, and no token ever reaches the library', async () => {
  const seen = await world({ passes: { [CODE]: 5 } }, async () => {
    const res = await run(chat, fakeReq({ body: QUESTION, headers: { [PASS_HEADER]: CODE } }));
    assert.equal(res.statusCode, 200, JSON.stringify(res.body));
    assert.deepEqual(events(res).slice(-2), ['check', 'done']);
    assert.ok(events(res).includes('sources'), 'answered from the open corpus, as a guest is');
    assert.ok(!res.chunks.join('').includes('library-file'), 'no link into the library in the answer');
  });
  assert.deepEqual(seen.pass, [{ p_code: CODE, p_count: true }], 'one request, one message');
  assert.deepEqual(seen.gate, [], 'the gate is not asked: the wall stays as it is for everyone else');
  // A guest's search of the library goes out with the public key, which the wall refuses in the
  // database. The pass adds no token and no other way in.
  assert.ok(seen.walled.length > 0, 'the library was asked, as for any guest');
  for (const call of seen.walled) {
    assert.equal(call.path, '/rest/v1/rpc/library_search');
    assert.equal(call.bearer, `Bearer ${ANON}`, 'with the public key only');
  }
  assert.deepEqual(seen.other, [], 'no other network');
  assert.equal(seen.model, 2, 'one planner call, one streamed answer');
  neverLogged(seen);
});

test('chat: a pass the database refuses is 401 pass_invalid before anything is spent', async () => {
  const seen = await world({ passes: { [CODE]: 0 } }, async () => {
    for (const code of [CODE, OTHER]) {
      const res = await run(chat, fakeReq({ body: GREETING, headers: { [PASS_HEADER]: code } }));
      assert.equal(res.statusCode, 401);
      assert.deepEqual(res.body, { error: 'pass_invalid', message: 'ลิงก์ทดลองนี้ใช้ไม่ได้แล้ว' });
      assert.equal(res.headers['cache-control'], 'no-store');
    }
    // a header that is not shaped like a code is no pass at all: the wall answers
    const garbage = await run(chat, fakeReq({ body: GREETING, headers: { [PASS_HEADER]: 'x' } }));
    assert.equal(garbage.statusCode, 401);
    assert.equal(garbage.body.error, 'signin_required');
  });
  assert.equal(seen.model, 0, 'no model call for a refused pass');
  assert.equal(seen.pass.length, 2);
  neverLogged(seen);
});

test('chat: a session token is judged by the gate as before, whatever pass rides with it', async () => {
  const seen = await world({ passes: { [CODE]: 5 } }, async () => {
    const member = await run(chat, fakeReq({ body: GREETING, headers: { authorization: `Bearer ${MEMBER}`, [PASS_HEADER]: CODE } }));
    assert.equal(member.statusCode, 200, JSON.stringify(member.body));
    assert.equal(events(member).at(-1), 'done');
    const gmail = await run(chat, fakeReq({ body: GREETING, headers: { authorization: `Bearer ${GMAIL}`, [PASS_HEADER]: CODE } }));
    assert.equal(gmail.statusCode, 403, 'a good pass does not let a signed-in non-member past the wall');
    assert.equal(gmail.body.error, 'chula_required');
    const revoked = await run(chat, fakeReq({ body: GREETING, headers: { authorization: `Bearer ${REVOKED}`, [PASS_HEADER]: CODE } }));
    assert.equal(revoked.statusCode, 401);
    assert.equal(revoked.body.error, 'signin_required');
  });
  assert.deepEqual(seen.pass, [], 'the pass is never asked about, so never counted');
  assert.equal(seen.gate[0], MEMBER);
  neverLogged(seen);
});

test('chat: a database that cannot be asked about the pass is 503, and nothing is answered', async () => {
  const seen = await world({ passes: { [CODE]: 5 }, passFails: true }, async () => {
    const res = await run(chat, fakeReq({ body: GREETING, headers: { [PASS_HEADER]: CODE } }));
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.error, 'backend-unavailable');
    assert.equal(res.headers['cache-control'], 'no-store');
  });
  assert.equal(seen.model, 0);
  neverLogged(seen);
});

test('chat: a trial visitor is limited by address, as a guest is', async () => {
  const seen = await world({ passes: { [CODE]: 500 } }, async () => {
    const ask = () => run(chat, fakeReq({ body: GREETING, headers: { [PASS_HEADER]: CODE }, ip: '10.78.0.1' }));
    for (let i = 0; i < IP_BURST.max; i++) assert.equal((await ask()).statusCode, 200, `question ${i + 1}`);
    const tooFast = await ask();
    assert.equal(tooFast.statusCode, 429);
    assert.equal(tooFast.body.message, LIMIT_MESSAGES.burst);
  });
  assert.equal(seen.model, IP_BURST.max, 'the refused question reached no model');
});

test('chat: the call is not opened, so its tools refuse a trial visitor', async () => {
  const seen = await world({ passes: { [CODE]: 5 } }, async () => {
    const res = await run(chat, fakeReq({ body: { voice: { op: 'search', query: 'rabies' } }, headers: { [PASS_HEADER]: CODE } }));
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.error, 'signin_required');
  });
  assert.equal(seen.model, 0);
});

test('the voice route never reads the pass: with the wall on it asks for a sign-in', async () => {
  const seen = await world({ passes: { [CODE]: 5 } }, async () => {
    const res = await run(voice, fakeReq({ body: { action: 'start' }, headers: { [PASS_HEADER]: CODE } }));
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.error, 'signin_required');
  });
  assert.deepEqual(seen.pass, [], 'the pass function is not asked');
  assert.equal(seen.gate.length, 1, 'the gate is');
});

test('transcribe: a good pass is checked without counting, a refused one is 401, a token goes to the gate', async () => {
  const seen = await world({ passes: { [CODE]: 5 }, vars: { IAPP_API_KEY: 'test' } }, async () => {
    // past the gate, the clip itself is judged: this one is not audio
    const res = await run(transcribe, fakeReq({ body: { audio: 'not audio' }, headers: { [PASS_HEADER]: CODE } }));
    assert.equal(res.statusCode, 400, JSON.stringify(res.body));
    assert.equal(res.body.error, 'input');
    const refused = await run(transcribe, fakeReq({ body: { audio: 'not audio' }, headers: { [PASS_HEADER]: OTHER } }));
    assert.equal(refused.statusCode, 401);
    assert.equal(refused.body.error, 'pass_invalid');
    const gmail = await run(transcribe, fakeReq({ body: { audio: 'not audio' }, headers: { authorization: `Bearer ${GMAIL}`, [PASS_HEADER]: CODE } }));
    assert.equal(gmail.statusCode, 403);
    assert.equal(gmail.body.error, 'chula_required');
  });
  assert.deepEqual(seen.pass, [{ p_code: CODE, p_count: false }, { p_code: OTHER, p_count: false }], 'a clip is not one of the link\'s messages');
  neverLogged(seen);
});

test('only the chat and transcribe preflights allow the pass header', async () => {
  const allowed = async (handler) => (await run(handler, fakeReq({ method: 'OPTIONS' }))).headers['access-control-allow-headers'];
  assert.equal(await allowed(chat), 'Content-Type, Authorization, X-VetMock-Pass');
  assert.equal(await allowed(transcribe), 'Content-Type, Authorization, X-VetMock-Pass');
  assert.equal(await allowed(voice), 'Content-Type, Authorization');
});
