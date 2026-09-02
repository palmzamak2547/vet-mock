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
const full = await import('../../src/data/changelog.js');
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

test('build and dev regenerate the module first, and the lint guards the checked-in copy', () => {
  const pkg = JSON.parse(read('../../package.json'));
  assert.match(pkg.scripts.build, /^node scripts\/regen-latest-changelog\.mjs && vite build/);
  assert.equal(pkg.scripts.predev, 'node scripts/regen-latest-changelog.mjs');
  assert.equal(pkg.scripts['lint:changelog-latest'], 'node scripts/regen-latest-changelog.mjs --check');
  assert.match(pkg.scripts['lint:all'], /npm run lint:changelog-latest/);
});
