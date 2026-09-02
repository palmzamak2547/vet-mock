// ============================================================
// API hardening — the small contracts each route has to keep
// ============================================================
// Each block below is a regression that reached (or could reach) a student
// as a failed request. They run the real handlers with fetch stubbed, so a
// behaviour change in the route itself fails here, not in production.

import test from 'node:test';
import assert from 'node:assert/strict';

import { voiceFor, rateStringFor } from '../../api/tts.js';
import { contentHeaders } from '../../api/library-blob.js';

// A minimal Vercel-style response object.
function fakeRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    end() { return res; },
  };
  return res;
}

async function withFetch(stub, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = stub;
  try { return await fn(); } finally { globalThis.fetch = real; }
}

// ── /api/tts ────────────────────────────────────────────────────────
test('the voice lookup answers only for real languages', () => {
  assert.equal(voiceFor('th'), 'th-TH-PremwadeeNeural');
  assert.equal(voiceFor('en'), 'en-US-AriaNeural');
  // Prototype keys used to come back as Object methods, then went upstream
  // as the voice name.
  assert.equal(voiceFor('constructor'), 'th-TH-PremwadeeNeural');
  assert.equal(voiceFor('__proto__'), 'th-TH-PremwadeeNeural');
  assert.equal(voiceFor('toString'), 'th-TH-PremwadeeNeural');
  assert.equal(voiceFor(undefined), 'th-TH-PremwadeeNeural');
});

test('a rate that is not a number plays at the default pace, not at "NaN%"', () => {
  assert.equal(rateStringFor(1), '+0%');
  assert.equal(rateStringFor(1.1), '+10%');
  assert.equal(rateStringFor(0.5), '-50%');
  assert.equal(rateStringFor(9), '+200%');
  assert.equal(rateStringFor('fast'), '+0%');
  assert.equal(rateStringFor(undefined), '+0%');
  assert.equal(rateStringFor(NaN), '+0%');
});

// ── /api/library-blob ───────────────────────────────────────────────
test('library bytes that a browser would execute are downloaded, not rendered on the app origin', () => {
  assert.deepEqual(contentHeaders({ m: 'application/pdf' }), { type: 'application/pdf', disposition: 'inline' });
  assert.deepEqual(contentHeaders({ m: 'image/png' }), { type: 'image/png', disposition: 'inline' });
  for (const m of ['text/html', 'application/xhtml+xml', 'image/svg+xml', 'text/javascript', 'application/ecmascript']) {
    assert.deepEqual(contentHeaders({ m }), { type: 'application/octet-stream', disposition: 'attachment' }, m);
  }
  // No declared mime: the upstream's answer is used, and judged the same way.
  assert.deepEqual(contentHeaders({}, 'text/html'), { type: 'application/octet-stream', disposition: 'attachment' });
  assert.deepEqual(contentHeaders({}, null), { type: 'application/octet-stream', disposition: 'inline' });
});

// ── /api/grade-summary ──────────────────────────────────────────────
const claudeReply = (text) => new Response(JSON.stringify({ content: [{ type: 'text', text }] }), {
  status: 200, headers: { 'content-type': 'application/json' },
});

const gradeReq = () => ({
  method: 'POST',
  headers: { host: 'vetmock.test' },
  socket: { remoteAddress: `10.0.0.${Math.floor(Math.random() * 250)}` },
  body: { type: 'short', question: 'What was measured?', userAnswer: 'Serum creatinine.' },
});

test('a grade survives the junk a model appends after the JSON object', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const { default: handler } = await import('../../api/grade-summary.js');
  const text = 'Here is the grade:\n```json\n{"scores":{"answer":{"earned":2,"total":2,"justification":"ok"}},"totalScore":2}\n```\n"}';
  const res = fakeRes();
  await withFetch(async () => claudeReply(text), () => handler(gradeReq(), res));
  assert.equal(res.statusCode, 200, JSON.stringify(res.body));
  assert.equal(res.body.totalScore, 2);
  assert.equal(res.body.scores.answer.earned, 2);
  assert.equal(res.body._meta.type, 'short');
  assert.equal(res.headers['cache-control'], 'private, no-store');
});

test('a reply with no JSON object is a 502 the client can explain, not a 500', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const { default: handler } = await import('../../api/grade-summary.js');
  const res = fakeRes();
  await withFetch(async () => claudeReply('I cannot grade this.'), () => handler(gradeReq(), res));
  assert.equal(res.statusCode, 502);
  assert.match(res.body.error, /not parseable/);
});

test('a stalled upstream ends as a 504 with a hint', async () => {
  process.env.ANTHROPIC_API_KEY = 'test-key';
  const { default: handler } = await import('../../api/grade-summary.js');
  const res = fakeRes();
  const timeout = new Error('The operation was aborted due to timeout');
  timeout.name = 'TimeoutError';
  await withFetch(async () => { throw timeout; }, () => handler(gradeReq(), res));
  assert.equal(res.statusCode, 504);
  assert.match(res.body.hint, /self-grade/);
});

// ── /api/library-file ───────────────────────────────────────────────
test('a malformed Authorization header is forwarded as anonymous, not as a broken request', async () => {
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'anon-key';
  const { default: handler } = await import('../../api/library-file.js');
  const seen = [];
  const stub = async (url, init) => {
    seen.push(init.headers.Authorization);
    return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  const res = fakeRes();
  await withFetch(stub, () => handler({
    method: 'GET',
    url: '/api/library-file?slug=some-deck',
    headers: { authorization: 'Bearer not a token\r\nX-Injected: 1' },
  }, res));
  assert.equal(seen[0], 'Bearer anon-key', 'the garbage header reached the upstream request');
  assert.equal(res.statusCode, 404, 'an empty catalog answer is not_found, not catalog_unavailable');

  const res2 = fakeRes();
  await withFetch(stub, () => handler({
    method: 'GET',
    url: '/api/library-file?slug=some-deck',
    headers: { authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.sig-part_ok' },
  }, res2));
  assert.equal(seen[1], 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.sig-part_ok', 'a real token must still be forwarded');
});
