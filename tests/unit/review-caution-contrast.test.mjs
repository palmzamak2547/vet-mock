// Review's caution box reads at 4.5:1 or better (review of pull request 247).
// Its "แหล่งที่มา:" line was drawn in --clr-ink-soft on --clr-rose-soft: 3.65:1 in light
// and 2.72:1 in dark. Text on --clr-rose-soft reads --clr-rose-soft-text, as the verdict
// colours set it, and both ratios are pinned here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const css = read('src/styles.css');
const review = read('src/views/ReviewView.jsx');

// A token's value in the first block that opens with `head`.
const token = (head, name) => {
  const at = css.indexOf(head);
  assert.ok(at >= 0, `no block ${head}`);
  const block = css.slice(at, css.indexOf('\n}', at));
  const m = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `${name} in ${head}`);
  return m[1];
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test("the caution box's sources line reads the text token made for rose-soft", () => {
  const at = review.indexOf('แหล่งที่มา: {q.flag.sources.join');
  assert.ok(at > 0);
  const line = review.slice(review.lastIndexOf('<div', at), at);
  assert.match(line, /color: 'var\(--clr-rose-soft-text\)'/);
});

test('that text clears 4.5:1 on rose-soft in both themes: 4.77 light, 4.76 dark', () => {
  const light = ratio(token(':root, [data-theme="light"] {', '--clr-rose-soft-text'), token(':root, [data-theme="light"] {', '--clr-rose-soft'));
  const dark = ratio(token('[data-theme="dark"] {', '--clr-rose-soft-text'), token('[data-theme="dark"] {', '--clr-rose-soft'));
  assert.equal(light.toFixed(2), '4.77');
  assert.equal(dark.toFixed(2), '4.76');
  assert.ok(light >= 4.5 && dark >= 4.5);
});
