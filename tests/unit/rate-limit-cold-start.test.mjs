// The limiter's store is asked over the network. The first call of a fresh instance also pays the name
// lookup and the TLS handshake, and on 15 Nov 2026 it took longer than the warm limit: the first chat of
// every new deployment was refused. A cold call gets more room; a warm one keeps the short limit.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.fixture.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'fixture-token';

const { rateLimit, STORE_TIMEOUTS } = await import('../../api/_lib/rate-limit.js?cold-start');

test('a cold call is given more time than a warm one', () => {
  assert.ok(STORE_TIMEOUTS.cold > STORE_TIMEOUTS.warm, JSON.stringify(STORE_TIMEOUTS));
});

test('the first store call of an instance may be slow; a slow warm call is still refused', async (t) => {
  const previous = globalThis.fetch;
  t.after(() => { globalThis.fetch = previous; });
  const slow = STORE_TIMEOUTS.warm + 300; // longer than a warm call may take, shorter than a cold one
  globalThis.fetch = (url, options = {}) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(new Response(JSON.stringify([{ result: 1 }, { result: 1 }]), { status: 200 })), slow);
    options.signal?.addEventListener('abort', () => { clearTimeout(timer); reject(options.signal.reason); });
  });

  const first = await rateLimit('cold-start:a', 5, 60_000);
  assert.equal(first.ok, true, 'a fresh instance waits for the handshake instead of refusing');

  const second = await rateLimit('cold-start:a', 5, 60_000);
  assert.equal(second.unavailable, true, 'once warm, a store this slow is treated as down');
});
