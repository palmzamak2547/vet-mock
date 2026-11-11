// ============================================================
// provider-breaker — a provider that says "no balance" is skipped for a while
// ============================================================
// 11 Nov 2026: DeepSeek's account went below zero and answered 402 for hours,
// and every request still spent its attempts there before the fallback
// answered. After one 402 the chains in llm.js and ai/writer.js skip DeepSeek
// for OPEN_MS in that instance, then try it again. Anything else (a 500, a
// 429, a timeout) leaves the chain exactly as it was. fetch is stubbed.
// ============================================================

import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { chatJSON } from '../../api/_lib/llm.js';
import { writeAnswer } from '../../api/_lib/ai/writer.js';
import { OPEN_MS, isNoBalance, resetBreakers } from '../../api/_lib/provider-breaker.js';

const ENV = { DEEPSEEK_API_KEY: 'k', ANTHROPIC_API_KEY: 'a', AI_GRADER_MODEL: 'claude-test' };
const NO_BALANCE = { error: { message: 'Insufficient Balance', type: 'unknown_error' } };

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
const host = (url) => new URL(String(url)).hostname;

let realFetch, realNow, realError, now, logs;
beforeEach(() => {
  resetBreakers();
  realFetch = globalThis.fetch;
  realNow = Date.now;
  realError = console.error;
  now = 1_800_000_000_000;
  Date.now = () => now;
  logs = [];
  console.error = (...a) => logs.push(a.join(' '));
});
afterEach(() => {
  globalThis.fetch = realFetch;
  Date.now = realNow;
  console.error = realError;
  resetBreakers();
});

/** chatJSON with DeepSeek answering `deepseek(n)`; returns the hosts called. */
async function ask(deepseek) {
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(host(url));
    if (host(url) === 'api.deepseek.com') return deepseek(calls.length);
    return json({ content: [{ type: 'text', text: '{"ok":1}' }] });
  };
  const out = await chatJSON({ system: 's', user: 'u', env: ENV });
  return { out, calls };
}

test('after a 402 the next request makes no call to DeepSeek', async () => {
  const first = await ask(() => json(NO_BALANCE, 402));
  assert.equal(first.out.ok, true);
  assert.deepEqual(first.calls, ['api.deepseek.com', 'api.anthropic.com'], 'one attempt, not two, then the fallback');
  assert.equal(logs.filter((l) => l.includes('breaker open deepseek')).length, 1);

  now += 60_000;
  const second = await ask(() => { throw new Error('DeepSeek must not be called while the breaker is open'); });
  assert.equal(second.out.ok, true);
  assert.deepEqual(second.calls, ['api.anthropic.com']);
});

test('after the window DeepSeek is tried again, and the close is logged once', async () => {
  await ask(() => json(NO_BALANCE, 402));
  now += OPEN_MS + 1;
  const again = await ask(() => json({ choices: [{ message: { content: '{"back":1}' } }] }));
  assert.equal(again.out.ok, true);
  assert.equal(again.out.model, 'deepseek-flash');
  assert.deepEqual(again.calls, ['api.deepseek.com']);
  assert.equal(logs.filter((l) => l.includes('breaker closed deepseek')).length, 1);
});

test('an "insufficient balance" body opens it too, and so does Anthropic saying its credit is gone', () => {
  assert.equal(isNoBalance(402, ''), true);
  assert.equal(isNoBalance(400, JSON.stringify(NO_BALANCE)), true);
  assert.equal(isNoBalance(400, '{"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API."}}'), true);
  assert.equal(isNoBalance(400, '{"error":"bad thinking field"}'), false);
  assert.equal(isNoBalance(429, 'Insufficient Balance'), false, 'rate limiting is not an empty account');
  assert.equal(isNoBalance(500, 'Insufficient Balance'), false, 'a server error never opens it');
  assert.equal(isNoBalance(503, ''), false);
});

test('a 500 does not open the breaker: the next request asks DeepSeek again', async () => {
  const first = await ask(() => json({ error: 'boom' }, 500));
  assert.deepEqual(first.calls, ['api.deepseek.com', 'api.anthropic.com']);
  const second = await ask(() => json({ error: 'boom' }, 500));
  assert.deepEqual(second.calls, ['api.deepseek.com', 'api.anthropic.com']);
  assert.equal(logs.some((l) => l.includes('breaker')), false);
});

// ── the streamed writer (ai.vetmock.com) ──
const enc = new TextEncoder();
function stream(parts, { hang = false, signal } = {}) {
  let i = 0;
  let ctrl;
  signal?.addEventListener('abort', () => { try { ctrl?.error(signal.reason); } catch { /* closed */ } });
  return new Response(new ReadableStream({
    start(c) { ctrl = c; },
    pull(c) {
      if (i < parts.length) { c.enqueue(enc.encode(parts[i++])); return undefined; }
      if (hang) return new Promise(() => {});
      c.close();
      return undefined;
    },
  }), { status: 200, headers: { 'content-type': 'text/event-stream' } });
}
const anthropicText = (text) => [
  `event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text } })}\n\n`,
  'event: message_stop\ndata: {"type":"message_stop"}\n\n',
];

async function write(deepseek) {
  const calls = [];
  const r = await writeAnswer({
    system: 's', messages: [{ role: 'user', content: 'q' }], env: ENV, onDelta: () => {}, firstByteMs: 60, idleMs: 60,
    fetchImpl: async (url, init) => {
      calls.push(host(url));
      return host(url) === 'api.deepseek.com' ? deepseek(init) : stream(anthropicText('ตอบ'), { signal: init.signal });
    },
  });
  return { r, calls };
}

test('the writer skips DeepSeek after a 402 and labels the answer as the fallback', async () => {
  const first = await write(() => json(NO_BALANCE, 402));
  assert.equal(first.r.ok, true);
  assert.deepEqual(first.calls, ['api.deepseek.com', 'api.anthropic.com']);
  const second = await write(() => { throw new Error('DeepSeek must not be called while the breaker is open'); });
  assert.equal(second.r.ok, true);
  assert.equal(second.r.model, 'fallback');
  assert.deepEqual(second.calls, ['api.anthropic.com']);
});

test('a timeout does not open the breaker', async () => {
  const hang = (init) => stream([': keep-alive\n\n'], { hang: true, signal: init.signal });
  const first = await write(hang);
  assert.equal(first.r.ok, true);
  assert.deepEqual(first.calls, ['api.deepseek.com', 'api.anthropic.com']);
  const second = await write(hang);
  assert.deepEqual(second.calls, ['api.deepseek.com', 'api.anthropic.com']);
  assert.equal(logs.some((l) => l.includes('breaker')), false);
});
