// ============================================================
// latest-changelog.generated.js — one release in the entry chunk, not 100+
// ============================================================
// HomeView and Sidebar render only the newest release. Importing it from
// changelog.js kept the whole history in the entry chunk (Rollup cannot
// tree-shake CHANGELOG[0] away from its array), so a generated module
// carries just that entry. These contracts keep the copy honest and keep
// the consumers off the full file.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const full = await import('../../src/data/changelog-all.js');
const gen = await import('../../src/data/latest-changelog.generated.js');

test('the generated module carries exactly the newest release and the scope labels', () => {
  assert.deepEqual(gen.LATEST_CHANGELOG, full.CHANGELOG[0]);
  assert.deepEqual(gen.SCOPE_LABELS, full.SCOPE_LABELS);
  assert.equal(gen.LATEST_CHANGELOG, gen.LATEST_CHANGELOG, 'sanity');
});

test('the entry-chunk consumers import the generated module, not the full history', () => {
  for (const file of ['../../src/views/HomeView.jsx', '../../src/components/Sidebar.jsx']) {
    const src = read(file);
    assert.match(src, /from '\.\.\/data\/latest-changelog\.generated\.js'/, `${file} must import the generated module`);
    assert.doesNotMatch(src, /from '\.\.\/data\/changelog\.js'/, `${file} must not import the full history`);
  }
});

test('build, dev and the unit suite write the modules first, and lint:data validates the releases', () => {
  const pkg = JSON.parse(read('../../package.json'));
  assert.match(pkg.scripts.build, /^node scripts\/regen-latest-changelog\.mjs && vite build/);
  assert.equal(pkg.scripts.predev, 'node scripts/regen-latest-changelog.mjs');
  assert.match(pkg.scripts['test:unit'], /--import \.\/tests\/unit\/setup-generated\.mjs/);
  assert.match(pkg.scripts['test:unit:utc'], /setup-generated\.mjs/);
  assert.equal(pkg.scripts['lint:changelog-latest'], 'node scripts/regen-latest-changelog.mjs --check');
  assert.match(pkg.scripts['lint:data'], /npm run lint:changelog-latest/);
  // Derived files are not committed: two releases in flight would both rewrite them.
  const ignored = read('../../.gitignore');
  for (const f of ['src/data/latest-changelog.generated.js', 'src/data/changelog-releases.generated.js']) assert.match(ignored, new RegExp(`^${f}$`, 'm'));
});

// One file per release (src/data/changelog/<version>.js), so two releases never edit the same lines.
test('release files join the history newest first, and a misnamed or repeated version is a problem', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { readChangelog } = await import('../../scripts/regen-latest-changelog.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'changelog-'));
  const release = (v) => `export default { version: '${v}', date: '2099-01-01', headline: 'h', changes: [{ kind: 'fix', scope: 'system', title: 't', desc: 'd' }] };\n`;
  try {
    writeFileSync(join(dir, '99.1.0.js'), release('99.1.0'));
    writeFileSync(join(dir, '99.0.9.js'), release('99.0.9'));
    let r = await readChangelog(dir);
    assert.deepEqual(r.problems, []);
    assert.deepEqual(r.all.slice(0, 2).map((e) => e.version), ['99.1.0', '99.0.9']);
    assert.equal(r.all.length, r.history.length + 2);
    writeFileSync(join(dir, '99.2.0.js'), release('99.0.9'));
    r = await readChangelog(dir);
    assert.ok(r.problems.some((p) => /99\.2\.0\.js: version is 99\.0\.9/.test(p)), r.problems.join('\n'));
    assert.ok(r.problems.some((p) => /99\.0\.9 appears twice/.test(p)), r.problems.join('\n'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
