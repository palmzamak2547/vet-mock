#!/usr/bin/env node
// npm run release:new -- [minor|patch]   (default minor)
//
// Writes src/data/changelog/<version>.js with the next free version, so sessions stop agreeing on
// numbers by message. "Taken" means: in changelog.js or a release file on origin/main, in a release
// file, a release record or the title of any open pull request (gh), in this checkout, or on disk in
// any other worktree of this repository (its src/data/changelog/ and docs/releases/), committed or
// not. Run it when you open the pull request and
// keep the number: there is no renumbering at merge, because Home announces every release a device
// has not seen (src/lib/changelog-seen.js) in whatever order they merge.
//
// The other worktrees are read because two of them on one computer used to take one number: each
// ran this before the other had pushed, so neither file was on main or in a pull request yet
// (5.227.0 twice and 5.227.2 twice on 15 Nov 2026). The pick and the write are one step under a lock
// file in the repository's common git directory, which every worktree shares: two runs in the same
// second take two numbers. The lock is removed when the run ends, and one left by a run that died
// is taken over once it is a minute old. With no other worktree the pick is what it always was.
//
// Two computers that run it in the same minute can still pick the same number; their files then
// share a path and the second pull request shows a conflict, and running this again picks the next
// one (lint:release-number fails that branch in the meantime).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareVersions, readChangelog } from './regen-latest-changelog.mjs';

const HERE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const USAGE = 'usage: npm run release:new -- [minor|patch]   (default minor; renumbering: src/data/changelog/README.md)';
const LOCK_NAME = 'release-new.lock';
const STALE_MS = 60_000;

const runner = (cwd) => (cmd, args) => {
  try { return execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch { return ''; }
};

/** The version after the highest one taken: its next minor, or its next patch. */
export function nextVersion(taken, bump) {
  const [major, minor, patch] = [...taken].sort(compareVersions).at(-1).split('.').map(Number);
  return bump === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}

/**
 * The versions a checkout holds on disk, tracked or not: src/data/changelog/<version>.js and, with
 * `records`, docs/releases/<version>.md or a folder of that name.
 */
export function numbersOnDisk(checkout, { records = true } = {}) {
  const found = new Set();
  const names = (dir) => { try { return fs.readdirSync(path.join(checkout, dir)); } catch { return []; } };
  for (const name of names('src/data/changelog')) {
    const m = /^(\d+\.\d+\.\d+)\.js$/.exec(name);
    if (m) found.add(m[1]);
  }
  if (records) {
    for (const name of names('docs/releases')) {
      const m = /^(\d+\.\d+\.\d+)(?:\.md)?$/.exec(name);
      if (m) found.add(m[1]);
    }
  }
  return found;
}

/** Every worktree of the repository `root` belongs to, its own included; none when git cannot say. */
export function worktrees(root) {
  return runner(root)('git', ['worktree', 'list', '--porcelain'])
    .split(/\r?\n/).filter((line) => line.startsWith('worktree ')).map((line) => line.slice('worktree '.length));
}

const real = (p) => { try { return fs.realpathSync.native(p); } catch { return path.resolve(p); } };
const samePlace = (a, b) => path.relative(real(a), real(b)) === '';

/** The git directory all worktrees of `root` share, or '' outside a repository. */
function commonDir(root) {
  const git = runner(root);
  const dir = git('git', ['rev-parse', '--path-format=absolute', '--git-common-dir']).trim()
    || git('git', ['rev-parse', '--git-common-dir']).trim();
  return dir ? path.resolve(root, dir) : '';
}

// ── The lock ───────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
const ageOf = (file) => { try { return Date.now() - fs.statSync(file).mtimeMs; } catch { return null; } };
const remove = (file) => { try { fs.rmSync(file, { force: true }); } catch { /* another run has it open: it is asked again */ } };

// A lock older than `staleMs` was left by a run that died. One run at a time may remove it, and
// that run looks at it again first: two runs that both saw the old lock would otherwise each remove
// "it", the second one removing the lock the first had just taken.
function removeStale(file, staleMs) {
  const turn = `${file}.stale`;
  try { fs.writeFileSync(turn, '', { flag: 'wx' }); } catch {
    const age = ageOf(turn);
    if (age !== null && age > staleMs) remove(turn); // left by a run that died right here
    return;
  }
  try {
    const age = ageOf(file);
    if (age !== null && age > staleMs) remove(file);
  } finally { remove(turn); }
}

/**
 * Runs `fn` while this run holds the lock file. A run that finds it held waits; a lock that is
 * `staleMs` old is taken over. When no lock can be had at all (a folder that cannot be written) it
 * says so and runs `fn` anyway: the number is then picked as it was before there was a lock.
 */
export async function withLock(file, fn, { staleMs = STALE_MS, pollMs = 100 } = {}) {
  const mine = `${process.pid} ${Date.now()} ${Math.random().toString(36).slice(2)}\n`;
  const giveUp = Date.now() + staleMs + 30_000;
  let refused = 0;
  let held = false;
  while (!held) {
    try {
      fs.writeFileSync(file, mine, { flag: 'wx' });
      held = true;
    } catch (error) {
      if (Date.now() > giveUp) break;
      if (error.code === 'EEXIST') {
        const age = ageOf(file);
        if (age === null) continue; // released between the two calls
        if (age > staleMs) removeStale(file, staleMs);
      } else if ((refused += 1) > 20) break; // Windows refuses for a moment while a lock is being removed; this is longer
      await sleep(pollMs);
    }
  }
  if (!held) console.warn(`⚠ could not take the release lock (${file}); picking a number without it`);
  try { return await fn(); } finally {
    // Only its own: a run that outlived a minute may find another run's lock here.
    if (held) { try { if (fs.readFileSync(file, 'utf8') === mine) remove(file); } catch { /* already gone */ } }
  }
}

const releaseFile = (version, date) => `// Release ${version}. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '${version}',
  date: '${date}',
  headline: '',
  changes: [
    { kind: 'feature', scope: 'system', title: '', desc: '' },
  ],
};
`;

/**
 * Picks the next free version and writes its release file into `root`, as one step under the
 * repository's lock. `taken` is what the caller already knows (main, open pull requests, this
 * checkout's changelog). The release files on disk, here and in every other worktree, are read
 * inside the lock, so a run that waited sees the file the run before it wrote.
 */
export async function takeNumber({ root, bump, taken = [], date, lock = {} }) {
  const pick = () => {
    const all = new Set(taken);
    for (const version of numbersOnDisk(root, { records: false })) all.add(version);
    for (const other of worktrees(root)) {
      if (samePlace(other, root)) continue;
      for (const version of numbersOnDisk(other)) all.add(version);
    }
    const version = nextVersion(all, bump);
    const file = path.join(root, 'src/data/changelog', `${version}.js`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, releaseFile(version, date));
    return { version, file };
  };
  const common = commonDir(root);
  return common ? withLock(path.join(common, LOCK_NAME), pick, lock) : pick();
}

async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    return 0;
  }
  const bump = argv[0] || 'minor';
  if (!['minor', 'patch'].includes(bump)) {
    console.error(USAGE);
    return 1;
  }
  const run = runner(HERE);
  const taken = new Set((await readChangelog()).all.map((e) => e.version));
  run('git', ['fetch', '-q', 'origin', 'main']);
  for (const m of run('git', ['show', 'origin/main:src/data/changelog.js']).matchAll(/version: '(\d+\.\d+\.\d+)'/g)) taken.add(m[1]);
  for (const m of run('git', ['ls-tree', '--name-only', 'origin/main', 'src/data/changelog/']).matchAll(/(\d+\.\d+\.\d+)\.js/g)) taken.add(m[1]);
  // gh lists only the first 100 files of a pull request, so one that deletes hundreds of files hides its
  // release file; its title ("5.203.0: ...") and its release record still name the number.
  const prs = run('gh', ['pr', 'list', '--state', 'open', '--limit', '100', '--json', 'files,title']);
  if (!prs) console.warn('⚠ could not list open pull requests (gh); numbers they hold are not counted');
  for (const m of prs.matchAll(/(?:src\/data\/changelog|docs\/releases)\/(\d+\.\d+\.\d+)\.(?:js|md)|"title":"(\d+\.\d+\.\d+)[: ]/g)) taken.add(m[1] || m[2]);

  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());
  const { file } = await takeNumber({ root: HERE, bump, taken, date });
  console.log(`wrote ${path.relative(HERE, file)}`);
  return 0;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = await main(process.argv.slice(2));
