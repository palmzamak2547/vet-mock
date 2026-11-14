// Where the API runs (docs/releases/5.180.0.md). Functions default to sin1, beside Supabase
// (ap-southeast-1), the library's R2 bucket (APAC) and the students. A function stays in iad1 while
// its calls in a row to services in US East (the limiter, Resend, Anthropic when tried first)
// outnumber one plus its calls to Supabase or R2; exam-result and race-start also stay until the
// Year-5 finals end on 4 Dec, so the exam flow does not change before then. The list shrinks when
// the limiter moves to Singapore. ai-voice: a start reads the provider's balance and mints a token
// (US) and counts twice in the limiter, against one call to Supabase (the Chula gate).
// The handlers are read from api/ (tests/helpers/api-handlers.mjs): a new endpoint fails here until
// it is placed, in iad1 for a measured reason or in the default list below, so its region is a
// decision and not an accident of nobody looking.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { apiHandlerNames } from '../helpers/api-handlers.mjs';

const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
const US_BOUND = ['agent-action', 'ai-voice', 'fetch-external-doc', 'grade-summary', 'playlist', 'send-feedback', 'study-coach', 'transcribe-handwriting', 'wiki-explain'];
const EXAM_FLOW_UNTIL_FINALS = ['exam-result', 'race-start'];
// Pinned to sin1 by name in vercel.json: VetMock AI's endpoints (AGENTS "AI").
const PINNED_SIN1 = ['ai-chat', 'ai-transcribe'];
// The default, sin1, with no entry in vercel.json: their calls go to Supabase or R2 first, or they
// were never measured as US-bound. Moving one to iad1 needs the measurement 5.180.0 describes.
const DEFAULT_SIN1 = ['calendar', 'client-diagnostic', 'evidence-pass', 'external-connect', 'external-connect-callback',
  'external-connect-start', 'library-blob', 'library-file', 'list-external-files', 'mochi-voice', 'move-in',
  'system-status', 'tts', 'tts-iapp', 'video-file'];

test('functions default to sin1', () => {
  assert.deepEqual(config.regions, ['sin1']);
});

test('only the listed functions stay in iad1, and every entry names a function', () => {
  const functions = Object.entries(config.functions || {});
  const elsewhere = functions.filter(([, f]) => f.regions && f.regions.join() !== 'sin1');
  const expected = [...US_BOUND, ...EXAM_FLOW_UNTIL_FINALS].map((n) => `api/${n}.js`).sort();
  assert.deepEqual(elsewhere.map(([p]) => p).sort(), expected);
  for (const [p, f] of elsewhere) assert.deepEqual(f.regions, ['iad1'], p);
  const files = new Set(apiHandlerNames().map((n) => `api/${n}.js`));
  for (const [p] of functions) assert.ok(files.has(p), `${p} is not a file in api/`);
  const pinned = functions.filter(([, f]) => f.regions?.join() === 'sin1').map(([p]) => p).sort();
  assert.deepEqual(pinned, PINNED_SIN1.map((n) => `api/${n}.js`).sort());
});

test('every handler in api/ has a region someone chose', () => {
  const placed = [...US_BOUND, ...EXAM_FLOW_UNTIL_FINALS, ...PINNED_SIN1, ...DEFAULT_SIN1];
  assert.equal(new Set(placed).size, placed.length, 'a handler is placed twice');
  const all = apiHandlerNames();
  for (const name of all) assert.ok(placed.includes(name), `api/${name}.js has no region decision: add it to DEFAULT_SIN1, or to vercel.json and US_BOUND with the measurement`);
  for (const name of placed) assert.ok(all.includes(name), `${name} is placed here but api/${name}.js does not exist`);
});
