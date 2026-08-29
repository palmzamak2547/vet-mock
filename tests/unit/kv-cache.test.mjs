// ============================================================
// kv cache — the answer cache's fallback contract
// ============================================================
// The AI answer cache is best-effort by design: with no Upstash backend
// (local dev, tests, a missing env) every read must be a miss and every
// write must vanish silently. The endpoint's correctness never depends
// on the cache — this pins the no-op half of that contract.

import test from 'node:test';
import assert from 'node:assert/strict';

import { kvGetJSON, kvSetJSON } from '../../api/_lib/rate-limit.js';

test('kv cache is a safe no-op without a backend', async () => {
  assert.equal(await kvGetJSON('ask:contract-test'), null);
  await kvSetJSON('ask:contract-test', { claims: [{ id: 'c1' }] }, 60); // must not throw
  assert.equal(await kvGetJSON('ask:contract-test'), null);
});
