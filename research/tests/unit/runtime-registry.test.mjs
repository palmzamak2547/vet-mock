// The registry, the licences list and the verified flag stay true to what exists (M1-DESIGN.md 5,
// 10.3, 13.5, A10). OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CANDIDATES, REGISTERED, IMPLEMENTED } from '../../src/lib/runtime/registry.js';
import { METHODS } from '../../src/lib/runtime/catalog.js';
import { NOTICES, STDLIB_TOTAL, STDLIB_BSL, LICENSE_TEXTS } from '../../src/licenses/notices.js';
import { collect, render } from '../../scripts/regen-verified.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test('every M1 method has exactly one candidate implementation, and nothing else does', () => {
  const m1 = METHODS.filter((m) => m.milestone === 'M1').map((m) => m.id).sort();
  assert.deepEqual(Object.keys(CANDIDATES).sort(), m1);
  for (const c of Object.values(CANDIDATES)) assert.equal(typeof c.impl, 'function');
});

test('a registered method has left its "not implemented" stub', () => {
  for (const id of REGISTERED) {
    assert.ok(CANDIDATES[id], `${id} is not a candidate`);
    const { module, fn } = CANDIDATES[id];
    const src = readFileSync(here(`../../src/lib/${module}`), 'utf8');
    assert.ok(!src.includes(`not implemented: ${module.replace(/\.js$/, '')}.${fn}`), `${id}: ${module} ${fn} is still a stub`);
  }
  assert.deepEqual(Object.keys(IMPLEMENTED).sort(), [...REGISTERED].sort());
});

test('verified.generated.js is current', () => {
  const { verified } = collect({ fixturesDir: here('../fixtures'), unitDir: here('.') });
  const current = readFileSync(here('../../src/lib/runtime/verified.generated.js'), 'utf8').replace(/\r\n/g, '\n');
  assert.equal(current, render(verified), 'run node scripts/regen-verified.mjs');
});

test('the licences list matches the lockfile', () => {
  const lock = JSON.parse(readFileSync(here('../../package-lock.json'), 'utf8'));
  const prod = new Map();
  for (const [k, v] of Object.entries(lock.packages)) if (k && !v.dev) prod.set(k.replace(/^.*node_modules\//, ''), v);
  for (const n of NOTICES) {
    const name = n.name.startsWith('xlsx') ? 'xlsx' : n.name;
    assert.ok(prod.has(name), `${name} is not in the production tree`);
    assert.equal(prod.get(name).version, n.version, `${name} version`);
    assert.equal(prod.get(name).license, n.license, `${name} licence`);
    assert.ok(LICENSE_TEXTS[n.text], `${name} has no licence text`);
  }
  const stdlib = [...prod.entries()].filter(([k]) => k.startsWith('@stdlib/'));
  assert.equal(stdlib.length, STDLIB_TOTAL);
  assert.equal(stdlib.filter(([, v]) => /BSL/.test(v.license)).length, STDLIB_BSL);
  const direct = Object.keys(lock.packages[''].dependencies || {});
  for (const d of direct) {
    if (d.startsWith('@stdlib/') || d === 'xlsx') continue;
    assert.ok(NOTICES.some((n) => n.name === d), `direct dependency ${d} is missing from the licences page`);
  }
  const files = { react: 'react/LICENSE', 'react-dom': 'react-dom/LICENSE', valibot: 'valibot/LICENSE.md', tanstack: '@tanstack/react-virtual/LICENSE', supabase: '@supabase/supabase-js/LICENSE', phoenix: '@supabase/phoenix/LICENSE.md', iceberg: 'iceberg-js/LICENSE', tslib: 'tslib/LICENSE.txt', xlsx: 'xlsx/LICENSE', stdlib: '@stdlib/math-base-special-gammainc/LICENSE' };
  for (const [id, f] of Object.entries(files)) {
    assert.ok(LICENSE_TEXTS[id], id);
    assert.ok(existsSync(here(`../../node_modules/${f}`)), f);
  }
});
