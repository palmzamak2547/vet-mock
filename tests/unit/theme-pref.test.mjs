// ============================================================
// theme-pref.test.mjs — one rule for the theme on screen
// ============================================================
// A stored 'light' or 'dark' is the student's pick. Anything else (nothing
// stored yet, 'system') follows the phone. index.html paints that rule before
// React loads, App and the Atlas entry keep to it after, and a toggle that
// flips the theme flips what is on screen, never the word 'system'.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { effectiveTheme, THEME_SYSTEM } from '../../src/lib/theme-pref.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('a pick wins; no pick or system follows the phone', () => {
  assert.equal(effectiveTheme('light', true), 'light');
  assert.equal(effectiveTheme('dark', false), 'dark');
  assert.equal(effectiveTheme(THEME_SYSTEM, true), 'dark');
  assert.equal(effectiveTheme(THEME_SYSTEM, false), 'light');
  assert.equal(effectiveTheme(null, true), 'dark');
  assert.equal(effectiveTheme('nonsense', false), 'light');
});

test('index.html, App and the Atlas entry start from the same rule', () => {
  const html = read('index.html');
  assert.match(html, /if \(t !== 'light' && t !== 'dark'\) \{\s*t = \(window\.matchMedia && window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches\)/,
    'index.html paints a pick, else the phone');
  for (const file of ['src/App.jsx', 'src/atlas-main.jsx']) {
    const src = read(file);
    assert.match(src, /useLocalStorage\('vmx-theme', THEME_SYSTEM\)/, `${file}: a new device starts on the phone's setting`);
    assert.match(src, /effectiveTheme\(/, `${file}: what is painted comes from the shared rule`);
  }
});
