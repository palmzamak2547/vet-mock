// ============================================================
// Wrap-up signal icons: one icon per kind of line, from the app's own set
// ============================================================
// What the lecturer stressed, what past papers asked and the usual mix-up are
// the three lines a student scans an item for. Each has one NavIcon glyph,
// used on the item and in the page's key, and never stands without its label
// (DESIGN_SYSTEM: status is not colour-only, no emoji as an icon).
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('the three glyphs are line icons in NavIcon, not emoji', () => {
  const icon = read('src/components/NavIcon.jsx');
  for (const name of ['said', 'sheet', 'caution']) assert.match(icon, new RegExp(`\\n  ${name}: `), `${name} is missing from NavIcon`);
});

test('every kind of line wears its icon beside its label, on the item and in the key', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /const SIGNAL_ICON = \{ emphasis: 'said', examined: 'sheet', pitfall: 'caution' \};/);
  // The label carries the words; the icon is decorative (NavIcon is aria-hidden).
  assert.match(view, /<NavIcon name=\{SIGNAL_ICON\[kind\]\} size=\{16\} \/><\/span>\n\s+\{children\}/);
  assert.match(view, /<SignalLabel kind="examined">มีในข้อสอบเก่า<\/SignalLabel>/);
  assert.match(view, /<SignalLabel kind="pitfall">ระวังสับสน<\/SignalLabel>/);
  for (const [name, label] of [['said', 'อาจารย์เน้น'], ['sheet', 'มีในข้อสอบเก่า'], ['caution', 'ระวังสับสน']]) {
    assert.match(view, new RegExp(`<NavIcon name="${name}" size=\\{16\\} /></span><span><b>${label}</b>`), `the key lacks ${label}`);
  }
  // No pitfall, no box: the block renders only with one.
  assert.match(view, /\{mode === 'full' && it\.pitfall && \(\n\s+<div className="vmx-wrap-pitfall">/);
});

test('each kind keeps one AA text colour', () => {
  const css = read('src/styles.css');
  assert.match(css, /\.is-emphasis > \.vmx-wrap-signal, \.vmx-wrap-signal\.is-emphasis \{ color: var\(--clr-sage-text\); \}/);
  assert.match(css, /\.is-examined > \.vmx-wrap-signal, \.vmx-wrap-signal\.is-examined \{ color: var\(--clr-gold-text\); \}/);
  assert.match(css, /\.is-pitfall > \.vmx-wrap-signal, \.vmx-wrap-signal\.is-pitfall \{ color: var\(--clr-rose-text\); \}/);
});
