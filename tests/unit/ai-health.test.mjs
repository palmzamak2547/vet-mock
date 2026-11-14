// ============================================================
// ai-health — GET /api/ai-chat?health=1 answers without spending a token
// ============================================================
// The scheduled watch reads one word: ok, degraded or down. It comes from
// DeepSeek's free balance read and whether the fallback's key is set, never
// from a model call, and the answer carries no key, amount or vendor text.
// fallback.model says whether Anthropic still serves the model in use
// (served, retired, unknown, or none without a key). fetch is stubbed
// throughout.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { aiHealth, resetAiHealth, CACHE_MS } from '../../api/_lib/ai/health.js';
import { ANTHROPIC_MODEL } from '../../api/_lib/llm.js';

const HOUR = 60 * 60 * 1000;
const MODEL_URL = `https://api.anthropic.com/v1/models/${ANTHROPIC_MODEL}`;
const modelAnswer = (status) => async () => new Response(status === 200 ? '{"id":"x"}' : '{"error":{"message":"vendor text"}}', { status });
const balance = (is_available, status = 200) => async (url) => {
  assert.equal(String(url), 'https://api.deepseek.com/user/balance', 'only the two free reads are made');
  return new Response(JSON.stringify({ is_available, balance_infos: [{ currency: 'USD', total_balance: is_available ? '12.34' : '-0.51' }] }), { status });
};
// One stub for both free reads; any other address is a token spent and fails the test.
const stub = (is_available, model = modelAnswer(200)) => async (url, init) => (String(url) === MODEL_URL ? model(url, init) : balance(is_available)(url));
const BOTH = { DEEPSEEK_API_KEY: 'sk-secret-deepseek', ANTHROPIC_API_KEY: 'sk-ant-secret' };

beforeEach(() => resetAiHealth());

test('ok: the first provider has balance', async () => {
  const h = await aiHealth({ env: BOTH, fetchImpl: stub(true), now: 1 });
  assert.equal(h.health, 'ok');
  assert.deepEqual(h.primary, { configured: true, balance: 'available' });
  assert.deepEqual(h.fallback, { configured: true, model: 'served' });
});

test('degraded: no balance, but a fallback is configured', async () => {
  assert.equal((await aiHealth({ env: BOTH, fetchImpl: stub(false), now: 1 })).health, 'degraded');
  resetAiHealth();
  const h402 = await aiHealth({
    env: BOTH,
    fetchImpl: async (url) => (String(url) === MODEL_URL ? modelAnswer(200)() : new Response('{"error":"Insufficient Balance"}', { status: 402 })),
    now: 1,
  });
  assert.equal(h402.health, 'degraded');
  assert.equal(h402.primary.balance, 'empty');
  resetAiHealth();
  const unreachable = await aiHealth({
    env: BOTH,
    fetchImpl: async (url) => { if (String(url) === MODEL_URL) return modelAnswer(200)(); throw new Error('ECONNRESET'); },
    now: 1,
  });
  assert.equal(unreachable.health, 'degraded', 'a balance read that fails is not called ok');
  assert.equal(unreachable.primary.balance, 'unknown');
});

test('down: no balance and nothing behind it', async () => {
  const h = await aiHealth({ env: { DEEPSEEK_API_KEY: 'sk-secret-deepseek' }, fetchImpl: stub(false), now: 1 });
  assert.equal(h.health, 'down');
  assert.deepEqual(h.fallback, { configured: false, model: 'none' });
  resetAiHealth();
  const none = await aiHealth({ env: {}, fetchImpl: async () => { throw new Error('no call without a key'); }, now: 1 });
  assert.equal(none.health, 'down');
  assert.equal(none.primary.configured, false);
});

test('the model: served, retired and cannot tell, with the health word each gives', async () => {
  const ask = (model, deepseek = false, env = BOTH) => { resetAiHealth(); return aiHealth({ env, fetchImpl: stub(deepseek, model), now: 1 }); };
  assert.equal((await ask(modelAnswer(200))).fallback.model, 'served');

  const retired = await ask(modelAnswer(404));
  assert.equal(retired.fallback.model, 'retired');
  assert.equal(retired.health, 'down', 'a fallback whose model is retired is no fallback');
  const covered = await ask(modelAnswer(404), true);
  assert.equal(covered.health, 'ok', 'DeepSeek still answers, so students are served');
  assert.equal(covered.fallback.model, 'retired', 'but the watch is told');

  for (const status of [429, 500, 529, 401, 403]) {
    const h = await ask(modelAnswer(status));
    assert.equal(h.fallback.model, 'unknown', `${status} is not a retirement`);
    assert.equal(h.health, 'degraded');
  }
  const timeout = await ask(async () => { throw new DOMException('timed out', 'TimeoutError'); });
  assert.equal(timeout.fallback.model, 'unknown', 'a request that fails is not a retirement');

  const noKey = await ask(async () => { throw new Error('no model read without a key'); }, true, { DEEPSEEK_API_KEY: 'sk-secret-deepseek' });
  assert.equal(noKey.fallback.model, 'none', 'no Anthropic key is a supported state, not a fault');
  assert.equal(noKey.health, 'ok');
});

test('the model read is bounded, a retired verdict is kept and a blip is not', async () => {
  const seen = [];
  const answers = [modelAnswer(503), modelAnswer(404), modelAnswer(200)];
  const fetchImpl = async (url, init) => {
    if (String(url) !== MODEL_URL) return balance(true)(url);
    seen.push(init);
    return answers.shift()();
  };
  const a = await aiHealth({ env: BOTH, fetchImpl, now: 0 });
  assert.equal(a.fallback.model, 'unknown');
  assert.ok(seen[0].signal instanceof AbortSignal, 'the read carries a timeout');
  const b = await aiHealth({ env: BOTH, fetchImpl, now: CACHE_MS });
  assert.equal(b.fallback.model, 'retired', 'an unknown verdict is asked again after one cache window');
  const c = await aiHealth({ env: BOTH, fetchImpl, now: 2 * CACHE_MS });
  assert.equal(c.fallback.model, 'retired', 'a retired verdict is not asked again within the hour');
  assert.equal(seen.length, 2);
  const pinned = await aiHealth({
    env: { ...BOTH, AI_GRADER_MODEL: 'claude-pinned-1' },
    fetchImpl: async (url) => (String(url).endsWith('/claude-pinned-1') ? modelAnswer(200)() : balance(true)(url)),
    now: 3 * CACHE_MS,
  });
  assert.equal(pinned.fallback.model, 'served', 'the pinned model is the one asked about, and a changed pin is asked afresh');
});

test('one balance read and one model read per cache window, and no secret, amount or model name in the answer', async () => {
  let calls = 0;
  const fetchImpl = async (url, init) => { calls += 1; return stub(true)(url, init); };
  const a = await aiHealth({ env: BOTH, fetchImpl, now: 1_000 });
  await aiHealth({ env: BOTH, fetchImpl, now: 1_000 + CACHE_MS - 1 });
  assert.equal(calls, 2);
  await aiHealth({ env: BOTH, fetchImpl, now: 1_000 + CACHE_MS });
  assert.equal(calls, 3, 'the balance is read again; a served model is kept for an hour');
  await aiHealth({ env: BOTH, fetchImpl, now: 1_000 + HOUR + CACHE_MS });
  assert.equal(calls, 5, 'after the hour the model is asked again');
  const text = JSON.stringify(a);
  for (const leak of ['sk-', 'secret', '12.34', 'USD', ANTHROPIC_MODEL]) assert.ok(!text.includes(leak), `answer must not carry ${leak}`);
});

test('the route answers ?health=1 from a GET, cached at the edge, without a model call', async () => {
  const { default: handler } = await import('../../api/ai-chat.js');
  resetAiHealth();
  const saved = { fetch: globalThis.fetch, ds: process.env.DEEPSEEK_API_KEY, an: process.env.ANTHROPIC_API_KEY };
  const urls = [];
  process.env.DEEPSEEK_API_KEY = 'sk-secret-deepseek';
  delete process.env.ANTHROPIC_API_KEY;
  globalThis.fetch = async (url) => { urls.push(String(url)); return balance(false)(url); };
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    end() { return this; },
  };
  try {
    await handler({ method: 'GET', url: '/api/ai-chat?health=1', headers: { host: 'vetmock.test' }, socket: { remoteAddress: '10.77.0.1' } }, res);
  } finally {
    globalThis.fetch = saved.fetch;
    for (const [k, v] of [['DEEPSEEK_API_KEY', saved.ds], ['ANTHROPIC_API_KEY', saved.an]]) {
      if (v === undefined) delete process.env[k]; else process.env[k] = v;
    }
  }
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.health, 'down');
  assert.equal(res.body.fallback.model, 'none');
  assert.match(res.headers['cache-control'], /s-maxage=180/);
  assert.deepEqual(urls, ['https://api.deepseek.com/user/balance']);
});
