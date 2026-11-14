#!/usr/bin/env node
// lint:release-number — a branch's release number is not already main's.
//
// The last line of defence behind release:new's reservation (scripts/lib/release-reserve.mjs). It
// fails when a release file this branch adds, src/data/changelog/<version>.js, names a version that
// main already holds from another pull request: the same file with other content, the version in
// main's changelog.js, or main's docs/releases/<version>.md added after this branch started. A file
// the branch only edits (one it started with) is not checked: fixing an old release's text is fine.
//
// "Where the branch started" is the merge commit's first parent in CI (a pull request is checked out
// as its merge with main) and the merge base with main otherwise. Main is fetched fresh, so a number
// main took after the merge commit was made still fails. Offline it checks against the last fetch
// and says so; with no main at all it skips and says so. How to renumber: src/data/changelog/README.md.
//
//   node scripts/lint-release-number.mjs [--main <ref>] [--no-fetch] [--cwd <dir>]
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELEASE_FILE = /^src\/data\/changelog\/(\d+\.\d+\.\d+)\.js$/;

function gitIn(cwd) {
  return (...args) => {
    try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } }); } catch { return null; }
  };
}

const lsTree = (git, ref, dir) => (git('ls-tree', '-r', '--name-only', ref, '--', dir) ?? '').split('\n').filter(Boolean);
const blob = (git, ref, file) => git('rev-parse', '--verify', '--quiet', `${ref}:${file}`)?.trim() || null;

/** { problems, notes } for HEAD against `main`. */
export function checkReleaseNumbers({ cwd = process.cwd(), main = 'origin/main', fetch = true } = {}) {
  const git = gitIn(cwd);
  const notes = [];
  if (fetch && main === 'origin/main') {
    const shallow = git('rev-parse', '--is-shallow-repository')?.trim() === 'true';
    const ok = git('fetch', '-q', '--no-tags', ...(shallow ? ['--depth=1'] : []), 'origin', '+refs/heads/main:refs/remotes/origin/main');
    if (ok === null) notes.push(`could not fetch main; checked against the last fetch of ${main}`);
  }
  if (!git('rev-parse', '--verify', '--quiet', `${main}^{commit}`)) {
    return { problems: [], notes: [...notes, `no ${main} here; skipped`] };
  }
  const parents = (git('cat-file', '-p', 'HEAD') ?? '').split('\n').filter((l) => l.startsWith('parent ')).map((l) => l.slice(7));
  let start = null;
  if (parents.length === 2) {
    start = parents[0];
    if (git('cat-file', '-e', `${start}^{commit}`) === null) git('fetch', '-q', '--no-tags', '--depth=1', 'origin', start);
    if (git('cat-file', '-e', `${start}^{commit}`) === null) start = null;
  } else {
    start = git('merge-base', main, 'HEAD')?.trim() || null;
  }
  if (!start) return { problems: [], notes: [...notes, 'could not find where this branch started; skipped'] };

  const before = new Set(lsTree(git, start, 'src/data/changelog/'));
  const added = lsTree(git, 'HEAD', 'src/data/changelog/').filter((f) => RELEASE_FILE.test(f) && !before.has(f));
  const problems = [];
  if (!added.length) return { problems, notes };
  const mainLegacy = new Set([...(git('show', `${main}:src/data/changelog.js`) ?? '').matchAll(/version: '(\d+\.\d+\.\d+)'/g)].map((m) => m[1]));
  const startDocs = new Set(lsTree(git, start, 'docs/releases/'));
  for (const file of added) {
    const version = file.match(RELEASE_FILE)[1];
    const mine = blob(git, 'HEAD', file);
    const theirs = blob(git, main, file);
    if (theirs && theirs !== mine) problems.push(`${version}: main already has ${file} from another pull request`);
    if (mainLegacy.has(version)) problems.push(`${version}: main's src/data/changelog.js already lists it`);
    const doc = `docs/releases/${version}.md`;
    const theirDoc = !startDocs.has(doc) && blob(git, main, doc);
    if (theirDoc && theirDoc !== blob(git, 'HEAD', doc)) problems.push(`${version}: main already has ${doc} from another pull request`);
  }
  return { problems, notes };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const argv = process.argv.slice(2);
  const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const { problems, notes } = checkReleaseNumbers({ cwd: opt('--cwd') || process.cwd(), main: opt('--main') || 'origin/main', fetch: !argv.includes('--no-fetch') });
  for (const n of notes) console.warn(`⚠ release number: ${n}`);
  if (problems.length) {
    for (const p of problems) console.error(`❌ ${p}`);
    console.error('Take another number and move the entry into it: src/data/changelog/README.md, "Renumbering".');
    process.exit(1);
  }
  console.log('✅ release number: no version this branch adds is already main\'s');
}
