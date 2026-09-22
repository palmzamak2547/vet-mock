// ============================================================
// ai-grade-errors.test.mjs — a failed self-grade speaks Thai
// ============================================================
// The "ตรวจคำตอบนี้" button in SmartGrader prints whatever gradeWithAI
// returns as `error`, then the server's `hint` in brackets, verbatim. The
// client passed the server's English `error` field straight through
// ("Internal error", "Unknown question", "Automatic grading unavailable"),
// fell back to `HTTP 500` when the body was not JSON, showed a raw
// "Failed to fetch" offline, and rendered a 429 as "(retry in undefineds)"
// when the limiter sent no number. On the daily-capacity 503 the Thai
// headline was followed by "(Use self-grade for now and try again later.)".
//
// The client now picks its sentence from the HTTP status and never reads the
// server's `error` field, which stays English for logs and old tabs. A hint
// reaches the screen only when it is Thai, and every hint the endpoint sends
// is Thai.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const THAI = /[ก-๙]/;
// Anything a student should never read in this panel.
const LEAK = /HTTP|retry|undefined|NaN|Internal|Unknown|Automatic|Network|Failed|fetch|self-grade|AI grading|\b\d{3}\b/i;

async function withFetch(stub, fn) {
  const real = globalThis.fetch;
  globalThis.fetch = stub;
  try { return await fn(); } finally { globalThis.fetch = real; }
}

const jsonReply = (status, body, headers = {}) => async () => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', ...headers },
});

async function grade(stub) {
  const { gradeWithAI } = await import('../../src/lib/ai-grade.js');
  return withFetch(stub, () => gradeWithAI({ qid: 'q-1', userAnswer: 'Serum creatinine.' }));
}

function assertStudentCopy(result, label) {
  assert.equal(result.ok, false, `${label}: must be a failure`);
  assert.equal(typeof result.error, 'string', `${label}: error must be a string`);
  assert.match(result.error, THAI, `${label}: error must be Thai, got ${JSON.stringify(result.error)}`);
  assert.doesNotMatch(result.error, LEAK, `${label}: error leaks raw text: ${JSON.stringify(result.error)}`);
  if (result.hint !== undefined) {
    assert.match(result.hint, THAI, `${label}: hint must be Thai, got ${JSON.stringify(result.hint)}`);
    assert.doesNotMatch(result.hint, LEAK, `${label}: hint leaks raw text: ${JSON.stringify(result.hint)}`);
  }
}

test('a 500 is Thai, whether or not the body is JSON', async () => {
  assertStudentCopy(await grade(jsonReply(500, { error: 'Internal error' })), '500 json');
  assertStudentCopy(await grade(async () => new Response('<html>Server Error</html>', { status: 500 })), '500 html');
});

test('the English error field the server sends is never shown', async () => {
  for (const [status, body] of [
    [400, { error: 'Unknown question', hint: 'ข้อนี้ยังไม่รองรับการตรวจอัตโนมัติ ใช้เกณฑ์ให้คะแนนด้วยตนเองได้' }],
    [422, { error: 'No model answer for this question', hint: 'ข้อนี้ยังไม่มีคำตอบตัวอย่างให้เทียบ' }],
    [502, { error: 'Automatic grading unavailable', hint: 'ลองอีกครั้งภายหลัง หรือประเมินตามเกณฑ์ด้วยตนเอง' }],
    [502, { error: 'AI response not parseable' }],
    [504, { error: 'Automatic grading timed out', hint: 'ลองอีกครั้งภายหลัง หรือประเมินตามเกณฑ์ด้วยตนเอง' }],
    [403, { error: 'Origin not allowed' }],
  ]) {
    const result = await grade(jsonReply(status, body));
    assertStudentCopy(result, `${status} ${body.error}`);
    if (body.hint) assert.equal(result.hint, body.hint, `${status}: a Thai hint from the server is kept`);
  }
});

test('an English hint from the server is dropped, not printed in brackets', async () => {
  const result = await grade(jsonReply(503, {
    error: 'AI daily capacity reached',
    hint: 'Use self-grade for now and try again later.',
  }));
  assertStudentCopy(result, '503 daily capacity');
  assert.equal(result.hint, undefined, 'an English hint must not reach the panel');
});

test('a 429 says how long to wait, in Thai, and never "undefined"', async () => {
  const withNumber = await grade(jsonReply(429, { error: 'Too many requests', reason: 'rate_limited', retryAfter: 42 }));
  assertStudentCopy(withNumber, '429 retryAfter 42');
  assert.match(withNumber.error, /42 วินาที/, 'the wait the server named is shown');

  const long = await grade(jsonReply(429, { error: 'Too many requests', retryAfter: 1800 }));
  assertStudentCopy(long, '429 retryAfter 1800');
  assert.match(long.error, /30 นาที/, 'a long wait reads in minutes, not 1800 seconds');

  const headerOnly = await grade(jsonReply(429, {}, { 'Retry-After': '15' }));
  assertStudentCopy(headerOnly, '429 header only');
  assert.match(headerOnly.error, /15 วินาที/, 'the Retry-After header is used when the body has no number');

  const noNumber = await grade(async () => new Response('Too Many Requests', { status: 429 }));
  assertStudentCopy(noNumber, '429 no number');
});

test('a timeout is Thai and says the check ran out of time', async () => {
  const abort = await grade(async () => { throw new DOMException('The operation was aborted.', 'AbortError'); });
  assertStudentCopy(abort, 'abort');
  assert.match(abort.error, /หมดเวลา/);
});

test('an offline press says the connection failed, in Thai', async () => {
  const offline = await grade(async () => { throw new TypeError('Failed to fetch'); });
  assertStudentCopy(offline, 'offline');
  assert.match(offline.error, /เชื่อมต่อไม่ได้/);
  assertStudentCopy(await grade(async () => { throw new Error('something unexpected'); }), 'unknown throw');
});

test('every hint the grading endpoint sends is Thai', () => {
  // The panel prints the hint verbatim, so an English hint here is English on
  // a student's screen no matter what the client does with `error`.
  const src = readFileSync(resolve('api/grade-summary.js'), 'utf8');
  const hints = [...src.matchAll(/hint:\s*'([^']*)'/g)].map((m) => m[1]);
  assert.ok(hints.length >= 6, `expected every hint literal, found ${hints.length}`);
  for (const hint of hints) {
    assert.match(hint, THAI, `hint is not Thai: ${hint}`);
    assert.doesNotMatch(hint, /[A-Za-z]{3,}/, `hint carries English: ${hint}`);
    assert.doesNotMatch(hint, /·/, `no middle dot in UI copy: ${hint}`);
  }
  assert.doesNotMatch(src, /hint:\s*[`"]/, 'hints stay single-quoted literals so this test sees them all');
});

test('the not-parseable 502 keeps its English error for logs and sends a Thai hint', async () => {
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'test-key';
  const { default: handler } = await import('../../api/grade-summary.js');
  const { default: written } = await import('../../api/_lib/written-questions.generated.json', { with: { type: 'json' } });
  const qid = Object.keys(written).find((k) => written[k].model_answer);
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; },
    status(c) { res.statusCode = c; return res; },
    json(b) { res.body = b; return res; },
    end() { return res; },
  };
  await withFetch(
    async () => new Response(JSON.stringify({ content: [{ type: 'text', text: 'I cannot grade this.' }] }), {
      status: 200, headers: { 'content-type': 'application/json' },
    }),
    () => handler({
      method: 'POST',
      headers: { host: 'vetmock.test' },
      socket: { remoteAddress: '10.0.9.9' },
      body: { qid, userAnswer: 'Serum creatinine.' },
    }, res),
  );
  assert.equal(res.statusCode, 502, 'the status code is part of the contract with old tabs');
  assert.match(res.body.error, /not parseable/, 'the error field is unchanged');
  assert.match(res.body.hint, THAI, 'the hint an old tab prints verbatim is Thai');
});
