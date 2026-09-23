// A gate can pass on files git does not track.
//
// 23 Sep: 22 src/lib/vetwiki/search-index-*.generated.js modules existed only
// on the integration machine. The integration gate passed there (1503/0 and
// 707/0), while a fresh checkout, which is what CI and Vercel build from,
// could not resolve search-index-loaders.generated.js at all.
//
// lint:untracked fails when `git status` lists an untracked file under src/,
// api/ or public/. Ignored paths (.gitignore, dist/, test-results/,
// playwright-report/) never count. Each case builds a throwaway git repo.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(repo, 'scripts', 'lint-untracked.mjs');

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-untracked-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  git('init', '-q');
  git('config', 'user.email', 'gate@example.invalid');
  git('config', 'user.name', 'gate');
  git('config', 'core.autocrlf', 'false');
  const put = (rel, text = 'x\n') => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  put('.gitignore', 'dist/\ntest-results/\nplaywright-report/\nsrc/local-only/\n');
  put('src/app.js');
  git('add', '-A');
  git('commit', '-q', '-m', 'init');
  return { dir, git, put, done: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

const lint = (cwd) => {
  const r = spawnSync(process.execPath, [SCRIPT], { cwd, encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};

test('an untracked source file fails, and the message names it and says what to do', () => {
  const r = makeRepo();
  try {
    r.put('src/lib/vetwiki/search-index-loaders.generated.js');
    r.put('api/new-endpoint.js');
    r.put('public/images/อาการ.png');
    const out = lint(r.dir);
    assert.equal(out.status, 1, out.out);
    assert.match(out.out, /src\/lib\/vetwiki\/search-index-loaders\.generated\.js/);
    assert.match(out.out, /api\/new-endpoint\.js/);
    assert.match(out.out, /public\/images\/อาการ\.png/, 'a Thai file name is printed as itself');
    assert.match(out.out, /git add|commit/);
    assert.match(out.out, /\.gitignore/);
  } finally { r.done(); }
});

test('a tracked file passes, and so does a staged new one', () => {
  const r = makeRepo();
  try {
    r.put('src/app.js', 'changed\n');
    r.put('src/new.js');
    r.git('add', 'src/new.js');
    const out = lint(r.dir);
    assert.equal(out.status, 0, out.out);
  } finally { r.done(); }
});

test('ignored files and untracked files outside src, api and public pass', () => {
  const r = makeRepo();
  try {
    r.put('src/local-only/scratch.js');
    r.put('dist/assets/entry.js');
    r.put('test-results/.last-run.json');
    r.put('playwright-report/index.html');
    r.put('docs/notes.md');
    r.put('scratchpad/idea.txt');
    const out = lint(r.dir);
    assert.equal(out.status, 0, out.out);
  } finally { r.done(); }
});

test('it reads the repository root even when run from a subdirectory', () => {
  const r = makeRepo();
  try {
    r.put('src/stray.js');
    const out = lint(path.join(r.dir, 'src'));
    assert.equal(out.status, 1, out.out);
    assert.match(out.out, /src\/stray\.js/);
  } finally { r.done(); }
});

test('lint:data runs lint:untracked first, so it costs nothing and precedes the build', () => {
  const { scripts } = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
  assert.equal(scripts['lint:untracked'], 'node scripts/lint-untracked.mjs');
  assert.equal(scripts['lint:data'].split(' && ')[0], 'npm run lint:untracked');
});
