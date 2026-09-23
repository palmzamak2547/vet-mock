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

// Vercel clones 10 commits deep and diffs against the last successful
// production deploy. On 23 Sep a 48-commit push put that commit outside the
// clone: git diff exited 128, Vercel reported a build error, and every later
// push failed the same way. Only exit 0 may skip a build; a git error builds.
test('a git error in the ignore step builds instead of failing the deploy', () => {
  assert.match(ignore, /git diff --quiet [^|]* \|\| exit 1$/);
  assert.ok(ignore.length <= 256, `ignoreCommand is ${ignore.length} characters; Vercel allows 256`);
});
