import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const ignore = config.ignoreCommand;

test('Vercel skips internal-only commits but never skips public Wiki input', () => {
  assert.match(ignore, /:\(exclude\)\.github\/\*\*/);
  assert.match(ignore, /:\(exclude\)tests\/\*\*/);
  assert.match(ignore, /:\(exclude\)playwright\.config\.js/);
  assert.match(ignore, /&& git diff --quiet HEAD\^ HEAD -- 'wiki\/\*\*'/);
  assert.doesNotMatch(ignore, /:\(exclude\)wiki/);
});
