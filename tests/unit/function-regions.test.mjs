// Where the API runs (docs/releases/5.180.0.md). Functions default to sin1, beside Supabase
// (ap-southeast-1), the library's R2 bucket (APAC) and the students. A function stays in iad1 while
// its calls in a row to services in US East (the limiter, Resend, Anthropic when tried first)
// outnumber one plus its calls to Supabase or R2; exam-result and race-start also stay until the
// Year-5 finals end on 4 Dec, so the exam flow does not change before then. The list shrinks when
// the limiter moves to Singapore.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const US_BOUND = ['agent-action', 'fetch-external-doc', 'grade-summary', 'playlist', 'send-feedback', 'study-coach', 'transcribe-handwriting', 'wiki-explain'];
const EXAM_FLOW_UNTIL_FINALS = ['exam-result', 'race-start'];

test('functions default to sin1', () => {
  assert.deepEqual(config.regions, ['sin1']);
});

test('only the listed functions stay in iad1, and every entry names a function', () => {
  const functions = Object.entries(config.functions || {});
  const elsewhere = functions.filter(([, f]) => f.regions && f.regions.join() !== 'sin1');
  const expected = [...US_BOUND, ...EXAM_FLOW_UNTIL_FINALS].map((n) => `api/${n}.js`).sort();
  assert.deepEqual(elsewhere.map(([p]) => p).sort(), expected);
  for (const [p, f] of elsewhere) assert.deepEqual(f.regions, ['iad1'], p);
  const files = new Set(readdirSync('api').map((f) => `api/${f}`));
  for (const [p] of functions) assert.ok(files.has(p), `${p} is not a file in api/`);
});
