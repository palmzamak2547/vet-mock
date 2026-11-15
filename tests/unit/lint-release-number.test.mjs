// lint:release-number: a branch whose release number main already took from another pull request
// fails, locally and on a pull request's merge commit, while a branch that only edits an old release
// file, or takes a free number, passes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkReleaseNumbers } from '../../scripts/lint-release-number.mjs';

const git = (cwd, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...args], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const put = (cwd, file, text) => { mkdirSync(join(cwd, file, '..'), { recursive: true }); writeFileSync(join(cwd, file), text); };
const commit = (cwd, msg) => { git(cwd, 'add', '-A'); git(cwd, 'commit', '-q', '-m', msg); };

function repo() {
  const dir = mkdtempSync(join(tmpdir(), 'lint-release-'));
  git(dir, 'init', '-q', '-b', 'main');
  put(dir, 'src/data/changelog.js', "export const CHANGELOG = [{ version: '5.100.0' }];\n");
  put(dir, 'src/data/changelog/5.213.0.js', "export default { version: '5.213.0' };\n");
  commit(dir, 'base');
  git(dir, 'switch', '-q', '-c', 'lane');
  return dir;
}
const check = (dir) => checkReleaseNumbers({ cwd: dir, main: 'main', fetch: false });

test('a number another pull request merged first fails, with the file named', () => {
  const dir = repo();
  try {
    put(dir, 'src/data/changelog/5.214.0.js', "export default { version: '5.214.0', headline: 'mine' };\n");
    commit(dir, 'lane takes 5.214.0');
    assert.deepEqual(check(dir).problems, []);
    git(dir, 'switch', '-q', 'main');
    put(dir, 'src/data/changelog/5.214.0.js', "export default { version: '5.214.0', headline: 'theirs' };\n");
    put(dir, 'docs/releases/5.214.0.md', 'theirs\n');
    commit(dir, 'other pull request 5.214.0');
    git(dir, 'switch', '-q', 'lane');
    const { problems } = check(dir);
    assert.equal(problems.length, 2, problems.join('\n'));
    assert.match(problems[0], /5\.214\.0: main already has src\/data\/changelog\/5\.214\.0\.js/);
    assert.match(problems[1], /docs\/releases\/5\.214\.0\.md/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('a version in main\'s legacy changelog.js fails', () => {
  const dir = repo();
  try {
    put(dir, 'src/data/changelog/5.100.0.js', "export default { version: '5.100.0' };\n");
    commit(dir, 'lane reuses a legacy number');
    assert.match(check(dir).problems.join('\n'), /changelog\.js already lists it/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('editing a release file the branch started with, or taking a free number, passes', () => {
  const dir = repo();
  try {
    put(dir, 'src/data/changelog/5.213.0.js', "export default { version: '5.213.0', headline: 'typo fixed' };\n");
    put(dir, 'src/data/changelog/5.215.0.js', "export default { version: '5.215.0' };\n");
    commit(dir, 'lane');
    git(dir, 'switch', '-q', 'main');
    put(dir, 'src/data/changelog/5.214.0.js', "export default { version: '5.214.0' };\n");
    commit(dir, 'other');
    git(dir, 'switch', '-q', 'lane');
    assert.deepEqual(check(dir).problems, []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('on a pull request\'s merge commit, a number main took after the merge was made fails', () => {
  const dir = repo();
  try {
    put(dir, 'src/data/changelog/5.214.0.js', "export default { version: '5.214.0', headline: 'mine' };\n");
    commit(dir, 'lane');
    // The merge commit CI checks out: main as it was, plus the lane.
    git(dir, 'switch', '-q', '--detach', 'main');
    git(dir, 'merge', '-q', '--no-ff', 'lane', '-m', 'merge');
    const merge = git(dir, 'rev-parse', 'HEAD').trim();
    // Main then moves on, taking the same number from another pull request.
    git(dir, 'switch', '-q', 'main');
    put(dir, 'src/data/changelog/5.214.0.js', "export default { version: '5.214.0', headline: 'theirs' };\n");
    commit(dir, 'other');
    git(dir, 'switch', '-q', '--detach', merge);
    assert.match(check(dir).problems.join('\n'), /5\.214\.0: main already has/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('with no main to compare it skips and says so, never fails', () => {
  const dir = repo();
  try {
    const r = checkReleaseNumbers({ cwd: dir, main: 'refs/remotes/nowhere/main', fetch: false });
    assert.deepEqual(r.problems, []);
    assert.match(r.notes.join(), /skipped/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
