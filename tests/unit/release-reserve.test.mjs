// Two lanes can never take the same release number (scripts/lib/release-reserve.mjs).
//
// Until 11 Nov 2026 `release:new` saw only numbers in open pull requests, so two lanes that ran it
// before either opened its pull request took the same one: 5.206.0, 5.207.0 and 5.212.0 were each
// taken twice. The race below is that morning with more lanes: separate processes, separate clones,
// one remote, all asking at once from the same view of main. Each must come back with its own
// number, and the remote must hold exactly one reservation per number.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { nextVersion, reservedVersions, takeNextVersion, RESERVE_PREFIX } from '../../scripts/lib/release-reserve.mjs';

const exec = promisify(execFile);
const lib = pathToFileURL(join(import.meta.dirname, '../../scripts/lib/release-reserve.mjs')).href;
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

function world(lanes) {
  const dir = mkdtempSync(join(tmpdir(), 'release-reserve-'));
  const remote = join(dir, 'remote.git');
  git(dir, 'init', '-q', '--bare', remote);
  const clones = [];
  for (let i = 0; i < lanes; i++) {
    const c = join(dir, `lane-${i}`);
    git(dir, 'clone', '-q', remote, c);
    git(c, 'config', 'user.name', `lane ${i}`);
    git(c, 'config', 'user.email', `lane${i}@example.invalid`);
    clones.push(c);
  }
  return { dir, remote, clones };
}

test('the next version raises the newest by the asked part', () => {
  assert.equal(nextVersion(['5.212.0', '5.9.3', '5.213.0'], 'minor'), '5.214.0');
  assert.equal(nextVersion(['5.212.0', '5.213.0'], 'patch'), '5.213.1');
  assert.equal(nextVersion(['5.213.0', 'not-a-version'], 'minor'), '5.214.0');
});

test('five processes racing from one view of main all get different numbers', async () => {
  const lanes = 5;
  const { dir, remote, clones } = world(lanes);
  try {
    const script = join(dir, 'take.mjs');
    writeFileSync(script, `import { takeNextVersion } from ${JSON.stringify(lib)};
const r = await takeNextVersion({ cwd: process.argv[2], taken: ['5.213.0'], bump: 'minor', label: 'lane' });
console.log(JSON.stringify(r));`);
    const results = await Promise.all(clones.map((c) => exec(process.execPath, [script, c], { encoding: 'utf8' })
      .then(({ stdout }) => JSON.parse(stdout))));
    for (const r of results) assert.equal(r.reserved, true, JSON.stringify(r));
    const versions = results.map((r) => r.version).sort();
    assert.equal(new Set(versions).size, lanes, `duplicates: ${versions}`);
    // Every number from 5.214.0 up was taken by exactly one lane: no gaps, no doubles.
    assert.deepEqual(versions, Array.from({ length: lanes }, (_, i) => `5.${214 + i}.0`).sort());
    const held = await reservedVersions({ cwd: clones[0] });
    assert.deepEqual([...held].sort(), versions);
    // At least one lane found a number taken and moved on; that is the race really happening.
    assert.ok(results.some((r) => r.attempts > 1));
    // A reservation names its branch and carries none of the branch's files.
    const sha = git(remote, 'rev-parse', `${RESERVE_PREFIX}5.214.0`).trim();
    assert.match(git(remote, 'log', '-1', '--format=%s', sha).trim(), /^Release 5\.214\.0 reserved for lane$/);
    assert.equal(git(remote, 'ls-tree', sha).trim(), '');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a later caller skips numbers reserved but not yet in any pull request', async () => {
  const { dir, clones } = world(2);
  try {
    const first = await takeNextVersion({ cwd: clones[0], taken: ['5.213.0'], label: 'a' });
    const second = await takeNextVersion({ cwd: clones[1], taken: ['5.213.0'], label: 'b' });
    assert.deepEqual([first.version, first.attempts, second.version, second.attempts], ['5.214.0', 1, '5.215.0', 1]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('an unreachable remote falls back to the unreserved pick and says why', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'release-reserve-'));
  try {
    git(dir, 'init', '-q');
    git(dir, 'remote', 'add', 'origin', join(dir, 'no-such-remote.git'));
    const r = await takeNextVersion({ cwd: dir, taken: ['5.213.0'] });
    assert.equal(r.version, '5.214.0');
    assert.equal(r.reserved, false);
    assert.match(r.reason, /could not read/);
    const off = await takeNextVersion({ cwd: dir, taken: ['5.213.0'], noReserve: true });
    assert.deepEqual([off.version, off.reserved], ['5.214.0', false]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('release:new keeps its options and documents them', () => {
  const out = execFileSync(process.execPath, [join(import.meta.dirname, '../../scripts/new-release.mjs'), '--help'], { encoding: 'utf8' });
  for (const word of ['minor', 'patch', '--no-reserve', '--remote', '--help']) assert.ok(out.includes(word), word);
  assert.throws(() => execFileSync(process.execPath, [join(import.meta.dirname, '../../scripts/new-release.mjs'), 'major'], { stdio: 'pipe' }));
});
