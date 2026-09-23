// ============================================================
// dead-weight.test.mjs — nothing ships, installs or misleads without a user
// ============================================================
// One commit in July added a Drizzle schema for nineteen tables that exist in
// no migration, a mock-session "server" held in a Map, and two views nothing
// renders. A later one installed Tailwind and shadcn for a folder that never
// existed. Each looked like a working part of the app: agents read the schema
// as the database, tests named after exam-flow guarantees exercised the
// in-memory copy, and every install carried the packages.
//
// These checks keep the next one from settling in quietly:
//   • a runtime dependency must be imported by JavaScript the app, the API
//     or a script actually runs;
//   • a component, view or stylesheet under src/ must have an importer.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => relative(ROOT, p).split(sep).join('/');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

const JS = ['.js', '.jsx', '.mjs', '.cjs'];
// Static imports, re-exports, side-effect imports, dynamic imports with a
// literal, and require().
const SPEC_RE = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(['"])([^'"\n]+)\1/g;
const specsOf = (source) => [...source.matchAll(SPEC_RE)].map((m) => m[2]);

test('every runtime dependency is imported by code the app, the API or a script runs', () => {
  const files = [
    ...['src', 'api', 'scripts', 'workers'].flatMap((d) => walk(join(ROOT, d), JS)),
    ...['vite.config.js', 'playwright.config.js'].map((f) => join(ROOT, f)).filter(existsSync),
  ];
  const used = new Set();
  for (const f of files) {
    for (const spec of specsOf(readFileSync(f, 'utf8'))) {
      if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) continue;
      const parts = spec.split('/');
      used.add(spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]);
    }
  }
  const unused = Object.keys(pkg.dependencies || {}).filter((name) => !used.has(name));
  assert.deepEqual(unused, [], `installed for every user but imported by nothing: ${unused.join(', ')}`);
});

test('every component, view and stylesheet under src/ has an importer', () => {
  const srcFiles = walk(join(ROOT, 'src'), JS);
  const imported = new Set();
  for (const f of srcFiles) {
    for (const spec of specsOf(readFileSync(f, 'utf8'))) {
      if (!spec.startsWith('.')) continue;
      const base = resolve(dirname(f), spec.split('?')[0]);
      for (const c of [base, ...JS.map((e) => base + e), ...JS.map((e) => join(base, 'index' + e))]) imported.add(c);
    }
  }
  for (const html of ['index.html', 'atlas.html']) {
    const text = readFileSync(join(ROOT, html), 'utf8');
    for (const m of text.matchAll(/(?:src|href)=["']\/?(src\/[^"']+)["']/g)) imported.add(join(ROOT, m[1]));
  }
  const candidates = [
    ...walk(join(ROOT, 'src', 'components'), ['.jsx']),
    ...walk(join(ROOT, 'src', 'views'), ['.jsx']),
    ...walk(join(ROOT, 'src'), ['.css']),
  ];
  const orphans = candidates.filter((f) => !imported.has(f)).map(rel);
  assert.deepEqual(orphans, [], `nothing imports: ${orphans.join(', ')}`);
});
