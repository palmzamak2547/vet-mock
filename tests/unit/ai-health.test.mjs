// ============================================================
// ai-health — GET /api/ai-chat?health=1 answers without spending a token
// ============================================================
// The scheduled watch reads one word: ok, degraded or down. It comes from
// DeepSeek's free balance read and whether the fallback's key is set, never
// from a model call, and the answer carries no key, amount or vendor text.
// fetch is stubbed throughout.
// ============================================================

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { aiHealth, resetAiHealth, CACHE_MS } from '../../api/_lib/ai/health.js';

const balance = (is_available, status = 200) => async (url) => {
  assert.equal(String(url), 'https://api.deepseek.com/user/balance', 'only the free balance read is made');
  return new Response(JSON.stringify({ is_available, balance_infos: [{ currency: 'USD', total_balance: is_available ? '12.34' : '-0.51' }] }), { status });
};
const BOTH = { DEEPSEEK_API_KEY: 'sk-secret-deepseek', ANTHROPIC_API_KEY: 'sk-ant-secret' };

beforeEach(() => resetAiHealth());

test('ok: the first provider has balance', async () => {
  const h = await aiHealth({ env: BOTH, fetchImpl: balance(true), now: 1 });
  assert.equal(h.health, 'ok');
  assert.deepEqual(h.primary, { configured: true, balance: 'available' });
  assert.deepEqual(h.fallback, { configured: true });
});

test('degraded: no balance, but a fallback is configured', async () => {
  assert.equal((await aiHealth({ env: BOTH, fetchImpl: balance(false), now: 1 })).health, 'degraded');
  resetAiHealth();
  const h402 = await aiHealth({ env: BOTH, fetchImpl: async () => new Response('{"error":"Insufficient Balance"}', { status: 402 }), now: 1 });
  assert.equal(h402.health, 'degraded');
  assert.equal(h402.primary.balance, 'empty');
  resetAiHealth();
  const unreachable = await aiHealth({ env: BOTH, fetchImpl: async () => { throw new Error('ECONNRESET'); }, now: 1 });
  assert.equal(unreachable.health, 'degraded', 'a balance read that fails is not called ok');
  assert.equal(unreachable.primary.balance, 'unknown');
});

test('down: no balance and nothing behind it', async () => {
  const h = await aiHealth({ env: { DEEPSEEK_API_KEY: 'sk-secret-deepseek' }, fetchImpl: balance(false), now: 1 });
  assert.equal(h.health, 'down');
  assert.deepEqual(h.fallback, { configured: false });
  resetAiHealth();
  const none = await aiHealth({ env: {}, fetchImpl: async () => { throw new Error('no call without a key'); }, now: 1 });
  assert.equal(none.health, 'down');
  assert.equal(none.primary.configured, false);
});

test('one balance read per cache window, and no secret or amount in the answer', async () => {
  let calls = 0;
  const fetchImpl = async (url) => { calls += 1; return balance(true)(url); };
  const a = await aiHealth({ env: BOTH, fetchImpl, now: 1_000 });
  await aiHealth({ env: BOTH, fetchImpl, now: 1_000 + CACHE_MS - 1 });
  assert.equal(calls, 1);
  await aiHealth({ env: BOTH, fetchImpl, now: 1_000 + CACHE_MS });
  assert.equal(calls, 2);
  const text = JSON.stringify(a);
  for (const leak of ['sk-', 'secret', '12.34', 'USD']) assert.ok(!text.includes(leak), `answer must not carry ${leak}`);
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
  assert.match(res.headers['cache-control'], /s-maxage=180/);
  assert.deepEqual(urls, ['https://api.deepseek.com/user/balance']);
});
