// One failed script request must never blank the app. React's lazy() keeps a
// failed download failed until a reload, and a part outside any boundary takes
// the whole screen with it (the header's level chip did, 16 Nov 2026). Every
// lazily loaded part goes through lazyWithRetry (src/lib/lazy-retry.js), which
// asks once more under a fresh URL, and optional parts render inside
// <OptionalFeature>. This test refuses a bare lazy() anywhere else in src/.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const HELPER = 'src/lib/lazy-retry.js';

// Files that still hold a bare lazy(), each with the reason it is not fixed.
// This list may only shrink: an entry whose file no longer needs it fails too.
const ALLOWED = new Map([
  ['src/views/ResultsView.jsx', 'results flow, changed only in its own reviewed pull request'],
  ['src/views/ReviewView.jsx', 'results flow, changed only in its own reviewed pull request'],
]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(m?js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// Comments are blanked so a sentence about lazy() is not read as a call.
function code(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
}

export function bareLazySites(src) {
  const body = code(src);
  const sites = [];
  for (const m of body.matchAll(/(?<![\w$])(?:React\.)?lazy\s*\(/g)) sites.push(m.index);
  // `import { lazy } from 'react'` (or `lazy as x`) is the start of one.
  for (const m of body.matchAll(/import\s*(?:\w+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]react['"]/g)) {
    if (/(?<![\w$])lazy(?![\w$])/.test(m[1])) sites.push(m.index);
  }
  return sites;
}

const files = walk(path.join(ROOT, 'src')).map((f) => path.relative(ROOT, f).replace(/\\/g, '/'));

test('no bare lazy() outside the helper and the shrinking allow list', () => {
  const offenders = [];
  for (const rel of files) {
    if (rel === HELPER || ALLOWED.has(rel)) continue;
    if (bareLazySites(fs.readFileSync(path.join(ROOT, rel), 'utf8')).length) offenders.push(rel);
  }
  assert.deepEqual(offenders, [], `load these through lazyWithRetry from ${HELPER} (and wrap an optional part in <OptionalFeature>)`);
});

test('every allow-listed file still needs its entry', () => {
  for (const rel of ALLOWED.keys()) {
    const full = path.join(ROOT, rel);
    assert.ok(fs.existsSync(full), `${rel} is gone: remove it from ALLOWED`);
    assert.ok(bareLazySites(fs.readFileSync(full, 'utf8')).length > 0, `${rel} no longer has a bare lazy(): remove it from ALLOWED`);
  }
  assert.ok(ALLOWED.size <= 2, 'the allow list may only shrink');
});

test('the detector sees the forms it must refuse and ignores the rest', () => {
  assert.equal(bareLazySites("const A = lazy(() => import('./A.jsx'));").length, 1);
  assert.equal(bareLazySites("const A = React.lazy(() => import('./A.jsx'));").length, 1);
  assert.equal(bareLazySites("import { Suspense, lazy as later } from 'react';").length, 1);
  assert.equal(bareLazySites("const A = lazyWithRetry(() => import('./A.jsx'));").length, 0);
  assert.equal(bareLazySites("// const A = lazy(() => import('./A.jsx'));").length, 0);
  assert.equal(bareLazySites('<img loading="lazy" />').length, 0);
});

test('the header level chip is optional: its failure cannot take the header down', () => {
  const header = fs.readFileSync(path.join(ROOT, 'src/components/HeaderBar.jsx'), 'utf8');
  assert.match(header, /<OptionalFeature>\s*<XpChip /);
});

test('lazyWithRetry asks once more under a fresh URL and keeps a named export on retry', () => {
  const helper = fs.readFileSync(path.join(ROOT, HELPER), 'utf8');
  assert.match(helper, /lazy\(\(\) => importFresh\(load\)\.then\(pick\)\)/);
});
