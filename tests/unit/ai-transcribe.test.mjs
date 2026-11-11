// /api/ai-transcribe — the microphone's speech-to-text for browsers without
// their own recognition. Pins what it accepts (a WAV under a minute), how it
// joins iApp's segments (no space inside Thai), and that it says why it fails.

import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { joinSegments, readWav, available, resetProbe, transcribeWav } from '../../api/ai-transcribe.js';

const wav = (bytes = 3200) => {
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0); b.writeUInt32LE(36 + bytes, 4); b.write('WAVE', 8);
  return b.toString('base64');
};

function call(body, { headers = {}, env = {} } = {}) {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  if (!('IAPP_API_KEY' in env)) delete process.env.IAPP_API_KEY;
  const res = {
    statusCode: 200, headers: {}, body: null,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    end() { return this; },
  };
  const req = { method: 'POST', headers: { 'x-forwarded-for': '203.0.113.9', ...headers }, body, url: '/api/ai-transcribe' };
  return Promise.resolve(handler(req, res)).then(() => { process.env = saved; return res; });
}

test('segments join as Thai is written: no space between two Thai runs, one beside English', () => {
  assert.equal(joinSegments(['อาการของ', 'โรคไข้หัด', ' canine distemper ', 'มีอะไรบ้าง']), 'อาการของโรคไข้หัด canine distemper มีอะไรบ้าง');
  assert.equal(joinSegments(['', null, ' ']), '');
});

test('only a real WAV under a minute is read', () => {
  assert.ok(readWav(wav()));
  assert.equal(readWav(Buffer.from('not audio at all, just some text bytes here...........').toString('base64')), null);
  assert.equal(readWav(wav(2_100_000)), null, 'over a minute');
  assert.equal(readWav(123), null);
});

test('no key: a 503 that says so, before any upload', async () => {
  const res = await call({ audio: wav() });
  assert.equal(res.statusCode, 503);
  assert.match(res.body.message, /ไมค์/);
});

test('a bad clip is a 400 with a reason', async () => {
  const res = await call({ audio: 'AAAA' }, { env: { IAPP_API_KEY: 'k' } });
  assert.equal(res.statusCode, 400);
  assert.ok(res.body.message);
});

test('a foreign origin is refused; preflight from the chat page passes', async () => {
  const foreign = await call({ audio: wav() }, { headers: { origin: 'https://evil.example' }, env: { IAPP_API_KEY: 'k' } });
  assert.equal(foreign.statusCode, 403);
  const saved = process.env.IAPP_API_KEY;
  const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; }, json() { return this; }, end() { return this; } };
  await handler({ method: 'OPTIONS', headers: { origin: 'https://ai.vetmock.com' }, url: '/api/ai-transcribe' }, res);
  process.env.IAPP_API_KEY = saved;
  assert.equal(res.statusCode, 204);
  assert.equal(res.headers['access-control-allow-origin'], 'https://ai.vetmock.com');
});

test('the transcript comes back as one text from iApp segments', async () => {
  const realFetch = globalThis.fetch;
  let sent = null;
  globalThis.fetch = async (url, init) => { sent = { url, init }; return Response.json({ output: [{ text: 'ระยะฟักตัว' }, { text: 'ของ rabies' }], audio_duration_in_seconds: 2.4 }); };
  try {
    const res = await call({ audio: wav() }, { env: { IAPP_API_KEY: 'k' } });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { text: 'ระยะฟักตัวของ rabies', seconds: 2.4 });
    assert.equal(sent.url, 'https://api.iapp.co.th/v3/store/speech/speech-to-text/base');
    assert.equal(sent.init.headers.apikey, 'k');
    assert.ok(sent.init.body instanceof FormData && sent.init.body.get('file'));
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('the probe never calls a service; it says no once a real clip met no credits', async () => {
  resetProbe();
  let calls = 0;
  const fetchImpl = async () => { calls++; return new Response('{"error_code":"INSUFFICIENT_CREDIT"}', { status: 402 }); };
  const env = { IAPP_API_KEY: 'k' };
  for (let i = 0; i < 50; i++) assert.equal(await available({ env, fetchImpl, now: 1_000 + i }), true);
  assert.equal(calls, 0, 'an unauthenticated probe spends nothing, however often it is asked');
  const r = await transcribeWav(Buffer.alloc(64), { env, fetchImpl, now: 2_000 });
  assert.equal(r.ok, false);
  assert.equal(calls, 1);
  assert.equal(await available({ env, fetchImpl, now: 3_000 }), false, 'out of credit: the microphone hides');
  assert.equal((await transcribeWav(Buffer.alloc(64), { env, fetchImpl, now: 4_000 })).ok, false);
  assert.equal(calls, 1, 'a service out of credit is not asked again for ten minutes');
  assert.equal(await available({ env, fetchImpl, now: 2_000 + 10 * 60 * 1000 + 1 }), true, 'and is tried again after');
  resetProbe();
  assert.equal(await available({ env: {}, fetchImpl }), false, 'no service configured');
});

test('the GET probe sends nothing anywhere, whatever query string busts the cache', async () => {
  resetProbe();
  const realFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ result: { text: '' } }); };
  const saved = { ...process.env };
  Object.assign(process.env, { CF_AI_TOKEN: 't', CF_AI_ACCOUNT_ID: 'a', IAPP_API_KEY: 'k' });
  try {
    for (let i = 0; i < 20; i++) {
      const res = { statusCode: 200, headers: {}, body: null, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, end() { return this; } };
      await handler({ method: 'GET', headers: {}, url: `/api/ai-transcribe?bust=${i}` }, res);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body, { available: true });
    }
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = realFetch;
    process.env = saved;
  }
});

test('a limiter that cannot count refuses the clip: nothing reaches the paid service', async () => {
  resetProbe();
  const realFetch = globalThis.fetch;
  let paid = 0;
  globalThis.fetch = async () => { paid++; return Response.json({ output: [{ text: 'x' }] }); };
  try {
    // NODE_ENV=production with no shared limiter configured: rateLimit() reports unavailable.
    const res = await call({ audio: wav() }, { env: { IAPP_API_KEY: 'k', NODE_ENV: 'production' } });
    assert.equal(res.statusCode, 503);
    assert.equal(res.body.reason, 'temporarily_unavailable');
    assert.equal(paid, 0);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('Cloudflare Whisper goes first; iApp answers when it fails', async () => {
  const seen = [];
  const fetchImpl = async (url) => {
    seen.push(String(url).includes('cloudflare') ? 'cf' : 'iapp');
    return String(url).includes('cloudflare') ? new Response('{}', { status: 401 }) : Response.json({ output: [{ text: 'ทดสอบ' }] });
  };
  const wav = Buffer.alloc(64);
  const r = await transcribeWav(wav, { env: { CF_AI_TOKEN: 't', R2_ACCOUNT_ID: 'a', IAPP_API_KEY: 'k' }, fetchImpl });
  assert.deepEqual(seen, ['cf', 'iapp']);
  assert.equal(r.text, 'ทดสอบ');
  resetProbe(); // the 401 above left Cloudflare out for ten minutes
  const cf = await transcribeWav(wav, { env: { CF_AI_TOKEN: 't', R2_ACCOUNT_ID: 'a' }, fetchImpl: async () => Response.json({ result: { text: ' ระยะฟักตัว ' } }) });
  assert.equal(cf.text, 'ระยะฟักตัว');
});
