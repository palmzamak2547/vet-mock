import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
const {ignoreCommand: ignore}=JSON.parse(readFileSync(new URL('../../vercel.json',import.meta.url),'utf8'));
test('Vercel builds production only, and a production push still skips documentation', () => {
  // Every preview is skipped by one environment check, not by a list of branch
  // prefixes: a branch nobody listed (chore/, feat/, kasem/, zcode/) used to
  // build a billable preview on every push.
  assert.match(ignore, /^\[ "\$VERCEL_ENV" = production \] \|\| exit 0;/);
  assert.doesNotMatch(ignore, /VERCEL_GIT_COMMIT_REF/, 'no branch-prefix list: the environment decides');
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

// Exit 0 skips the build, anything else builds, and the two are easy to swap.
// Run the real command through sh in a throwaway repo and read the exit code.
// Skipped where no sh is on the PATH (a bare Windows shell); CI runs it.
const hasSh = spawnSync('sh', ['-c', 'exit 0']).status === 0;
const sh = (cwd, env) => {
  const clean = { ...process.env, MSYS_NO_PATHCONV: '1', MSYS2_ARG_CONV_EXCL: '*' };
  delete clean.VERCEL_ENV;
  delete clean.VERCEL_GIT_PREVIOUS_SHA;
  delete clean.VERCEL_GIT_COMMIT_REF;
  return spawnSync('sh', ['-c', ignore], { cwd, env: { ...clean, ...env }, encoding: 'utf8' }).status;
};
function repoWith(changed) {
  const dir = mkdtempSync(join(tmpdir(), 'vetmock-ignore-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' }).toString().trim();
  const put = (rel, text) => { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); };
  git('init', '-q');
  git('config', 'user.email', 'gate@example.invalid');
  git('config', 'user.name', 'gate');
  git('config', 'core.autocrlf', 'false');
  put('src/app.js', 'a\n');
  put('docs/note.md', 'a\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'first');
  const first = git('rev-parse', 'HEAD');
  for (const rel of changed) put(rel, 'b\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'second');
  return { dir, first, done: () => rmSync(dir, { recursive: true, force: true }) };
}

test('the command skips every preview, builds a production source change, skips a production docs change', { skip: !hasSh && 'no sh on PATH' }, () => {
  const source = repoWith(['src/app.js']);
  const docs = repoWith(['docs/note.md']);
  try {
    // Previews: skipped whatever the branch is called, even with a source change.
    for (const ref of ['claude/x', 'codex/x', 'grok/x', 'kasem/landing-rebuild', 'chore/design-sync-setup', 'main']) {
      assert.equal(sh(source.dir, { VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: ref }), 0, `preview of ${ref} must be skipped`);
    }
    // Production: a source change builds, a documentation-only change skips.
    assert.equal(sh(source.dir, { VERCEL_ENV: 'production' }), 1, 'a production source change must build');
    assert.equal(sh(docs.dir, { VERCEL_ENV: 'production' }), 0, 'a production docs-only change is skipped');
    // Production with a previous SHA the clone does not hold: git exits 128, the build runs.
    assert.equal(sh(source.dir, { VERCEL_ENV: 'production', VERCEL_GIT_PREVIOUS_SHA: '0123456789abcdef0123456789abcdef01234567' }), 1);
    // The previous SHA is honoured when it is there.
    assert.equal(sh(docs.dir, { VERCEL_ENV: 'production', VERCEL_GIT_PREVIOUS_SHA: docs.first }), 0);
  } finally { source.done(); docs.done(); }
});

// The VCA project (root vca/) keeps its rule in a script: Vercel rejects the whole vercel.json
// when ignoreCommand passes 256 characters, which failed the project's first deploy (17 Oct).
test('the VCA project builds production only, and only when the site or its bank changed', () => {
  const vca = JSON.parse(readFileSync(new URL('../../vca/vercel.json', import.meta.url), 'utf8'));
  assert.ok(vca.ignoreCommand.length <= 256, `vca ignoreCommand is ${vca.ignoreCommand.length} characters`);
  if (!hasSh) return;
  const cwd = new URL('../../vca/', import.meta.url);
  const run = (env) => {
    const clean = { ...process.env, MSYS_NO_PATHCONV: '1', MSYS2_ARG_CONV_EXCL: '*' };
    delete clean.VERCEL_ENV;
    delete clean.VERCEL_GIT_PREVIOUS_SHA;
    return spawnSync('sh', ['-c', vca.ignoreCommand], { cwd, env: { ...clean, ...env }, encoding: 'utf8' }).status;
  };
  assert.equal(run({ VERCEL_ENV: 'preview' }), 0, 'a preview is skipped');
  assert.equal(run({ VERCEL_ENV: 'production' }), 1, 'the first production build runs');
  assert.equal(run({ VERCEL_ENV: 'production', VERCEL_GIT_PREVIOUS_SHA: 'HEAD' }), 0, 'nothing changed: skipped');
  assert.equal(run({ VERCEL_ENV: 'production', VERCEL_GIT_PREVIOUS_SHA: 'no-such-commit' }), 1, 'a git error builds');
});

// With cleanUrls on, Vercel serves index.html as "/", so a rewrite to "/index.html" found
// nothing: every route not prerendered (/auth/callback, /chat, /me, /community/new) answered 404
// on vca.vetmock.com (18 Oct). The SPA fallback goes to "/", as the main project's does.
test('the VCA project sends unknown routes to the app shell at "/"', () => {
  const vca = JSON.parse(readFileSync(new URL('../../vca/vercel.json', import.meta.url), 'utf8'));
  const shell = vca.rewrites.filter((r) => r.source.startsWith('/(('));
  assert.equal(shell.length, 1);
  assert.equal(shell[0].destination, '/');
  for (const path of ['/auth/callback', '/chat', '/me', '/community/new', '/auth/line']) assert.match(path, new RegExp(`^${shell[0].source}$`));
  for (const path of ['/assets/x.js', '/q/1.json', '/sw.js']) assert.doesNotMatch(path, new RegExp(`^${shell[0].source}$`));
});
