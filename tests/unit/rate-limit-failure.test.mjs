import test from 'node:test';
import assert from 'node:assert/strict';

let n = 0;
async function withBackend(fetchImpl, fn, configured = true) {
  const keys = ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'VERCEL_ENV'];
  const previous = keys.map(key => process.env[key]);
  const originalFetch = globalThis.fetch;
  process.env.VERCEL_ENV = 'production';
  if (configured) {
    process.env.UPSTASH_REDIS_REST_URL = 'https://quota.example.invalid';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-only';
  } else {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  }
  globalThis.fetch = fetchImpl;
  try { await fn(await import(`../../api/_lib/rate-limit.js?failure=${++n}`)); }
  finally {
    globalThis.fetch = originalFetch;
    keys.forEach((key, i) => { if (previous[i] === undefined) delete process.env[key]; else process.env[key] = previous[i]; });
  }
}

test('shared backend failure never grants a fresh instance budget and remains retryable', async () => {
  await withBackend(async (_url, init) => {
    assert.ok(init.signal, 'the limiter request must have a deadline');
    throw new Error('backend offline');
  }, async ({ rateLimit, sendRateLimitFailure }) => {
    const limit = await rateLimit('provider:test:daily', 100, 86400000);
    assert.equal(limit.ok, false);
    assert.equal(limit.unavailable, true);
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(s) { this.code = s; return this; }, json(body) { this.body = body; return this; } };
    sendRateLimitFailure(res, limit);
    assert.equal(res.code, 503);
    assert.match(res.headers['Cache-Control'], /no-store/);
    assert.equal(res.headers['Retry-After'], '30');
  });
});

test('a failed TTL operation cannot masquerade as an enforced quota', async () => {
  await withBackend(async () => ({ ok: true, json: async () => [{ result: 1 }, { error: 'permission denied' }] }), async ({ rateLimit }) => {
    assert.equal((await rateLimit('test', 100, 60000)).unavailable, true);
  });
});

test('production without shared credentials refuses metered requests', async () => {
  await withBackend(async () => { throw new Error('must not fetch'); }, async ({ rateLimit }) => {
    assert.equal((await rateLimit('test', 100, 60000)).unavailable, true);
  }, false);
});
