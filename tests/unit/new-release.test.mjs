// npm run release:new (scripts/new-release.mjs): two worktrees on one computer never take one number.
//
// On 15 Nov 2026 two pull requests took 5.227.0 and two more took 5.227.2. Each pair came from two
// worktrees of one repository that ran release:new before either had pushed: the script counted the
// numbers on main and in open pull requests, and neither file was in either place yet. The second
// to merge then showed a conflict and was renumbered by hand.
//
// The pick now also counts every release file on disk in the other worktrees, committed or not, and
// the pick and the write are one step under a lock file in the common git directory. Each case
// below builds a throwaway repository with real worktrees; nothing here touches the network.
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { nextVersion, numbersOnDisk, takeNumber, withLock, worktrees } from '../../scripts/new-release.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = path.join(repoRoot, 'scripts', 'new-release.mjs');
const USAGE = 'usage: npm run release:new -- [minor|patch]   (default minor; renumbering: src/data/changelog/README.md)';
const DATE = '2026-11-15';
const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const put = (cwd, file, text) => { fs.mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true }); fs.writeFileSync(path.join(cwd, file), text); };
const release = (version) => `export default { version: '${version}', date: '${DATE}', headline: 'h', changes: [{ kind: 'fix', scope: 'system', title: 't', desc: 'd' }] };\n`;
const commit = (cwd, message) => { git(cwd, 'add', '-A'); git(cwd, 'commit', '-q', '-m', message); };
const has = (cwd, version) => fs.existsSync(path.join(cwd, 'src/data/changelog', `${version}.js`));

// A repository whose main holds 5.213.0, and as many worktrees beside it as a case asks for.
function repo() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-new-release-'));
  const main = path.join(base, 'main');
  fs.mkdirSync(main);
  git(main, 'init', '-q', '-b', 'main');
  git(main, 'config', 'core.autocrlf', 'false');
  put(main, 'src/data/changelog/5.213.0.js', release('5.213.0'));
  commit(main, 'base');
  const add = (name) => {
    const dir = path.join(base, name);
    git(main, 'worktree', 'add', '-q', '-b', name.replace(/\s+/g, '-'), dir);
    return dir;
  };
  const lock = path.join(main, '.git', 'release-new.lock');
  return { base, main, add, lock, done: () => fs.rmSync(base, { recursive: true, force: true }) };
}
// What main and the open pull requests show in every case: only 5.213.0.
const KNOWN = ['5.213.0'];

test('the next version is the next minor, or the next patch, of the highest one taken', () => {
  assert.equal(nextVersion(['5.9.0', '5.213.0', '5.212.4'], 'minor'), '5.214.0');
  assert.equal(nextVersion(new Set(['5.213.0', '5.213.2', '5.99.9']), 'patch'), '5.213.3');
});

test('two worktrees that each hold an unpushed release file: a third run takes neither number', async () => {
  const r = repo();
  try {
    const a = r.add('lane-a');
    const b = r.add('lane b'); // a folder name with a space in it
    const c = r.add('lane-c');
    assert.equal(worktrees(c).length, 4);
    put(a, 'src/data/changelog/5.214.0.js', release('5.214.0')); // written, not committed
    put(b, 'src/data/changelog/5.215.0.js', release('5.215.0'));
    commit(b, 'lane b takes 5.215.0'); // committed, not pushed
    // What the script went by until 15 Nov: main and the pull requests alone say 5.214.0 is free.
    assert.equal(nextVersion(KNOWN, 'minor'), '5.214.0');

    const taken = await takeNumber({ root: c, bump: 'minor', taken: KNOWN, date: DATE });
    assert.equal(taken.version, '5.216.0');
    assert.ok(has(c, '5.216.0'), 'the file is written into the checkout that asked');
    assert.equal(fs.readFileSync(taken.file, 'utf8').split('\n')[3], "  version: '5.216.0',");
    assert.ok(!has(a, '5.216.0') && !has(b, '5.216.0') && !has(r.main, '5.216.0'));

    // The first lane asks again (say, for a second release): it sees the others' files and its own.
    assert.equal((await takeNumber({ root: a, bump: 'patch', taken: KNOWN, date: DATE })).version, '5.216.1');
    assert.equal((await takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE })).version, '5.217.0');
  } finally { r.done(); }
});

test('a release record in another worktree holds its number too, as a file or as a folder', async () => {
  const r = repo();
  try {
    const a = r.add('lane-a');
    const b = r.add('lane-b');
    put(a, 'docs/releases/5.214.0.md', 'proof\n');
    put(b, 'docs/releases/5.215.0/walk.md', 'notes\n');
    put(b, 'docs/releases/README.md', 'not a release\n');
    put(b, 'src/data/changelog/README.md', 'not a release\n');
    assert.deepEqual([...numbersOnDisk(a)], ['5.213.0', '5.214.0']);
    assert.deepEqual([...numbersOnDisk(b)], ['5.213.0', '5.215.0']);
    assert.deepEqual([...numbersOnDisk(b, { records: false })], ['5.213.0']);
    assert.equal((await takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE })).version, '5.216.0');
  } finally { r.done(); }
});

test('with no other worktree the pick is what it was: the highest of what is known and this checkout', async () => {
  const r = repo();
  try {
    assert.equal(worktrees(r.main).length, 1);
    // Its own release record was never read, and still is not.
    put(r.main, 'docs/releases/5.300.0.md', 'a record with no release file\n');
    assert.equal((await takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE })).version, '5.214.0');
    assert.equal((await takeNumber({ root: r.main, bump: 'patch', taken: [...KNOWN, '5.220.0'], date: DATE })).version, '5.220.1');
    assert.ok(!fs.existsSync(r.lock), 'the lock is removed when the run ends');
  } finally { r.done(); }
});

test('outside a git repository it still picks and writes, with no lock and no other worktree', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-new-release-plain-'));
  try {
    // The system temp folder is in no repository; on a machine where it is, this case has nothing to say.
    let inside = false;
    try { inside = git(dir, 'rev-parse', '--is-inside-work-tree').trim() === 'true'; } catch { /* not a repository */ }
    if (inside) return;
    assert.deepEqual(worktrees(dir), []);
    assert.equal((await takeNumber({ root: dir, bump: 'minor', taken: KNOWN, date: DATE })).version, '5.214.0');
    assert.ok(has(dir, '5.214.0'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('four runs started together in four worktrees take four numbers', async () => {
  const r = repo();
  try {
    const lanes = [r.main, r.add('lane-a'), r.add('lane-b'), r.add('lane-c')];
    const child = [
      `import { takeNumber } from ${JSON.stringify(pathToFileURL(SCRIPT).href)};`,
      'const [root] = process.argv.slice(1);',
      `const { version } = await takeNumber({ root, bump: 'minor', taken: ${JSON.stringify(KNOWN)}, date: '${DATE}' });`,
      'console.log(version);',
    ].join('\n');
    const runs = await Promise.all(lanes.map((root) => new Promise((resolve) => {
      const p = spawn(process.execPath, ['--input-type=module', '-e', child, root], { stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '';
      let err = '';
      p.stdout.on('data', (b) => { out += b; });
      p.stderr.on('data', (b) => { err += b; });
      p.on('close', (status) => resolve({ root, status, version: out.trim(), err }));
    })));
    for (const run of runs) assert.equal(run.status, 0, run.err);
    assert.deepEqual(runs.map((run) => run.version).sort(), ['5.214.0', '5.215.0', '5.216.0', '5.217.0']);
    for (const run of runs) assert.ok(has(run.root, run.version), `${run.version} is in the worktree that took it`);
    assert.ok(!fs.existsSync(r.lock), 'no lock is left behind');
  } finally { r.done(); }
});

test('a run waits while another holds the lock, and removes only its own', async () => {
  const r = repo();
  try {
    fs.writeFileSync(r.lock, 'another run\n');
    let done = false;
    const waiting = takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE, lock: { pollMs: 20 } }).then((taken) => { done = true; return taken; });
    await sleep(300);
    assert.equal(done, false, 'it waits while the lock is held');
    assert.ok(!has(r.main, '5.214.0'), 'and writes nothing meanwhile');
    fs.rmSync(r.lock);
    assert.equal((await waiting).version, '5.214.0');
    assert.ok(!fs.existsSync(r.lock));

    // A run that outlived a minute can find another run's lock in place of its own: that one stays.
    await withLock(r.lock, () => { fs.writeFileSync(r.lock, 'the run that took over\n'); });
    assert.equal(fs.readFileSync(r.lock, 'utf8'), 'the run that took over\n');
  } finally { r.done(); }
});

test('a lock a minute old was left by a run that died: it is taken over', async () => {
  const r = repo();
  try {
    fs.writeFileSync(r.lock, 'a run that died\n');
    const old = new Date(Date.now() - 2 * 60_000);
    fs.utimesSync(r.lock, old, old);
    const started = Date.now();
    assert.equal((await takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE, lock: { pollMs: 20 } })).version, '5.214.0');
    assert.ok(Date.now() - started < 20_000, 'without waiting out a minute');
    assert.ok(!fs.existsSync(r.lock));
    // A lock 50 seconds old is still someone's.
    fs.writeFileSync(r.lock, 'a slow run\n');
    const recent = new Date(Date.now() - 50_000);
    fs.utimesSync(r.lock, recent, recent);
    let done = false;
    const waiting = takeNumber({ root: r.main, bump: 'minor', taken: KNOWN, date: DATE, lock: { pollMs: 20 } }).then((taken) => { done = true; return taken; });
    await sleep(300);
    assert.equal(done, false);
    fs.rmSync(r.lock);
    assert.equal((await waiting).version, '5.215.0');
  } finally { r.done(); }
});

// ── The command itself: its interface and its messages are what they were ──
test('--help prints the usage, and anything but minor or patch is refused with it', () => {
  const help = spawnSync(process.execPath, [SCRIPT, '--help'], { encoding: 'utf8' });
  assert.equal(help.status, 0);
  assert.equal(help.stdout, `${USAGE}\n`);
  const bad = spawnSync(process.execPath, [SCRIPT, 'major'], { encoding: 'utf8' });
  assert.equal(bad.status, 1);
  assert.equal(bad.stderr, `${USAGE}\n`);
  assert.equal(bad.stdout, '');
});

test('run as a command in a checkout it writes the file and says so, as before', () => {
  const r = repo();
  try {
    // The script works on the checkout it sits in, so it runs from a copy inside the throwaway one.
    for (const rel of ['scripts/new-release.mjs', 'scripts/regen-latest-changelog.mjs', 'scripts/lib/same-generated.mjs']) {
      put(r.main, rel, fs.readFileSync(path.join(repoRoot, rel), 'utf8'));
    }
    put(r.main, 'package.json', '{"type":"module"}\n');
    put(r.main, 'src/data/changelog.js', `export const SCOPE_LABELS = {};\nexport const CHANGELOG = [${release('5.100.0').replace('export default ', '').replace(/;\n$/, '')}];\n`);
    const a = r.add('lane-a');
    put(a, 'src/data/changelog/5.213.1.js', release('5.213.1'));
    // No remote and no gh here: main and the pull requests cannot be read, which the script says once.
    const env = { ...process.env };
    for (const name of ['GH_REPO', 'GH_TOKEN', 'GITHUB_TOKEN', 'GH_HOST']) delete env[name];
    const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());
    const before = today();
    const run = spawnSync(process.execPath, ['scripts/new-release.mjs', 'patch'], { cwd: r.main, encoding: 'utf8', env });
    assert.equal(run.status, 0, run.stderr);
    // 5.213.1 is free on main; the other worktree holds it, so this one gets 5.213.2.
    assert.equal(run.stdout, `wrote ${path.join('src', 'data', 'changelog', '5.213.2.js')}\n`);
    assert.equal(run.stderr, '⚠ could not list open pull requests (gh); numbers they hold are not counted\n');
    const lines = fs.readFileSync(path.join(r.main, 'src/data/changelog/5.213.2.js'), 'utf8').split('\n');
    // The date is the Bangkok day of the run (either day, when the run crossed midnight there).
    assert.ok([`  date: '${before}',`, `  date: '${today()}',`].includes(lines[4]), lines[4]);
    lines[4] = '  date: <the Bangkok day>,';
    assert.deepEqual(lines, [
      '// Release 5.213.2. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in',
      '// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.',
      'export default {',
      "  version: '5.213.2',",
      '  date: <the Bangkok day>,',
      "  headline: '',",
      '  changes: [',
      "    { kind: 'feature', scope: 'system', title: '', desc: '' },",
      '  ],',
      '};',
      '',
    ]);
  } finally { r.done(); }
});
