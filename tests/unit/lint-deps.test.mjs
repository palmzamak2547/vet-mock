// lint:deps (scripts/lint-deps.mjs): a package a file imports is declared by
// its own app's package.json, never borrowed from a hoisted parent.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { importsOf, packageOf, lint } from '../../scripts/lint-deps.mjs';

test('an import names its package; paths, builtins and aliases are not packages', () => {
  assert.equal(packageOf('playwright'), 'playwright');
  assert.equal(packageOf('@napi-rs/canvas'), '@napi-rs/canvas');
  assert.equal(packageOf('@vercel/analytics/react'), '@vercel/analytics');
  assert.equal(packageOf('pdfjs-dist/legacy/build/pdf.mjs?url'), 'pdfjs-dist');
  for (const notPackage of ['./x.js', '../lib/y.js', 'node:fs', 'fs', 'path', 'virtual:pwa', 'npm:react']) {
    assert.equal(packageOf(notPackage), null, notPackage);
  }
  assert.equal(packageOf('@vetmock/lib/richtext.jsx', ['@vetmock']), null);
});

test('static, dynamic and required imports are all read, comments are not', () => {
  const found = importsOf([
    "import { chromium } from 'playwright';",
    "const esb = await import('esbuild');",
    "const sharp = require('sharp');",
    "export { x } from '@scope/pkg/sub';",
    "// import nothing from 'in-a-comment';",
  ].join('\n'));
  assert.deepEqual([...found].sort(), ['@scope/pkg', 'esbuild', 'playwright', 'sharp']);
});

test('every app declares what it imports (DEP-2)', () => {
  const { undeclared } = lint();
  assert.deepEqual(undeclared.map((u) => `${u.app}:${u.name}`), []);
});

test('lint:deps runs in lint:data', () => {
  const { scripts } = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(scripts['lint:deps'], 'node scripts/lint-deps.mjs');
  assert.ok(scripts['lint:data'].split(' && ').includes('npm run lint:deps'));
});
