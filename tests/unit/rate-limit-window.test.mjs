// ============================================================
// rate-limit — an in-memory bucket lives as long as its window
// ============================================================
// The in-memory fallback (every instance without Upstash: local dev, a
// preview deploy missing the env) swept away any bucket idle for sixty
// seconds, whatever its window. The 24-hour provider budgets are exactly
// such buckets — a daily cap that quietly reset after one quiet minute.

import test from 'node:test';
import assert from 'node:assert/strict';

import { rateLimit, sweepInMemory } from '../../api/_lib/rate-limit.js';

const DAY = 24 * 60 * 60 * 1000;

test('a sweep leaves a still-open window alone, and drops it once closed', async () => {
  const realNow = Date.now;
  let t = 1_700_000_000_000;
  Date.now = () => t;
  try {
    const key = `test:daily:${Math.random().toString(36).slice(2)}`;
    assert.equal((await rateLimit(key, 2, DAY)).ok, true);
    assert.equal((await rateLimit(key, 2, DAY)).ok, true);

    // Two idle minutes — longer than the old sweep's 60 s idle rule.
    t += 2 * 60 * 1000;
    sweepInMemory(t);
    const third = await rateLimit(key, 2, DAY);
    assert.equal(third.ok, false, 'the daily budget reset after two quiet minutes');
    assert.ok(third.retryAfter >= 1, 'Retry-After must never be 0');

    // Past the window the bucket is garbage and the budget starts over.
    t += DAY;
    sweepInMemory(t);
    assert.equal((await rateLimit(key, 2, DAY)).ok, true);
  } finally {
    Date.now = realNow;
  }
});

test('a short window still expires on its own without a sweep', async () => {
  const realNow = Date.now;
  let t = 1_700_000_000_000;
  Date.now = () => t;
  try {
    const key = `test:minute:${Math.random().toString(36).slice(2)}`;
    assert.equal((await rateLimit(key, 1, 60_000)).ok, true);
    assert.equal((await rateLimit(key, 1, 60_000)).ok, false);
    t += 60_001;
    assert.equal((await rateLimit(key, 1, 60_000)).ok, true);
  } finally {
    Date.now = realNow;
  }
});
