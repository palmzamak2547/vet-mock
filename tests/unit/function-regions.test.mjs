// Where the API runs (docs/releases/5.180.0.md). Functions default to sin1, beside Supabase
// (ap-southeast-1), the library's R2 bucket (APAC) and the students. The few pinned to iad1 make
// several calls in a row to the shared limiter, which is in US East: from sin1 each call would cost
// a Pacific round trip. They move when the limiter moves to Singapore, and this list empties then.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const NEAR_LIMITER = ['agent-action', 'grade-summary', 'mochi-voice', 'playlist', 'study-coach', 'transcribe-handwriting', 'wiki-explain'];

test('functions default to sin1', () => {
  assert.deepEqual(config.regions, ['sin1']);
});

test('only the limiter-bound functions stay in iad1, and every entry names a function', () => {
  const functions = Object.entries(config.functions || {});
  const elsewhere = functions.filter(([, f]) => f.regions && f.regions.join() !== 'sin1');
  assert.deepEqual(elsewhere.map(([p]) => p).sort(), NEAR_LIMITER.map((n) => `api/${n}.js`).sort());
  for (const [p, f] of elsewhere) assert.deepEqual(f.regions, ['iad1'], p);
  const files = new Set(readdirSync('api').map((f) => `api/${f}`));
  for (const [p] of functions) assert.ok(files.has(p), `${p} is not a file in api/`);
});
