import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const {ignoreCommand: ignore}=JSON.parse(readFileSync(new URL('../../vercel.json',import.meta.url),'utf8'));
test('Vercel skips documentation and work branches while all public build inputs still deploy', () => {
  assert.match(ignore, /codex\/\*/);
  assert.match(ignore, /:!docs/);
  assert.match(ignore, /:!\.github/);
  assert.match(ignore, /VERCEL_GIT_PREVIOUS_SHA/);
  assert.doesNotMatch(ignore, /exclude[^']*(wiki|scripts|src|api)/);
});
