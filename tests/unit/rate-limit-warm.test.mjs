// The limiter's store connection is opened as the handler starts (warmStore), so the first real limiter
// call of a fresh instance does not pay the name lookup and the handshake. The warm call is one PING per
// instance, is never counted against a limit, and can never fail a request.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.UPSTASH_REDIS_REST_URL = 'https://upstash.fixture.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'fixture-token';

const previousFetch = globalThis.fetch;
const sent = [];
let mode = 'ok';
globalThis.fetch = async (url, options = {}) => {
  const commands = JSON.parse(options.body);
  sent.push(commands);
  if (mode === 'fail') throw new Error('store down');
  return new Response(JSON.stringify(commands.map(c => ({ result: c[0] === 'PING' ? 'PONG' : 1 }))), { status: 200 });
};

const { rateLimit, warmStore } = await import('../../api/_lib/rate-limit.js?warm');
const settle = () => new Promise(resolve => setTimeout(resolve, 20));

test('a failing warm call changes nothing: the next real call still counts', async () => {
  mode = 'fail';
  assert.equal(warmStore(), undefined, 'warmStore is not awaited and returns nothing');
  await settle();
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], [['PING']]);
  mode = 'ok';
  const r = await rateLimit('warm:a', 5, 60_000);
  assert.equal(r.ok, true);
  assert.equal(sent[1][0][0], 'INCR', 'the limit is counted by its own call, never by the warm one');
});

test('the warm call is sent once per instance and at most one is in flight', async () => {
  const fresh = await import('../../api/_lib/rate-limit.js?warm-once'); // a new instance
  const before = sent.length;
  const warmStore = fresh.warmStore;
  warmStore();
  warmStore();
  warmStore();
  await settle();
  assert.equal(sent.length - before, 1, 'three calls at once send one PING');
  warmStore();
  warmStore();
  await settle();
  assert.equal(sent.length - before, 1, 'once the store has answered, nothing more is sent');
});

test('the warm call never counts against a limit', async () => {
  assert.ok(sent.every(commands => commands.every(c => ['PING', 'INCR', 'EXPIRE'].includes(c[0]))));
  const counted = sent.filter(commands => commands.some(c => c[0] === 'INCR'));
  assert.equal(counted.length, 1, 'only the one real rateLimit call incremented');
  assert.equal(sent.filter(commands => commands.some(c => c[0] === 'PING')).length, 2, 'one PING per instance, two instances');
});

test.after(() => { globalThis.fetch = previousFetch; });
