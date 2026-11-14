// ============================================================
// Wrap-up progress strip: "5 จาก 28", from an IntersectionObserver
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { currentItem, progressLabel, READING_BAND } from '../../src/lib/wrap-progress.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('the item being read is the first in the band, else the one read last', () => {
  assert.equal(currentItem(new Set([4, 5]), 0), 4);
  assert.equal(currentItem(new Set([7]), 2), 7);
  assert.equal(currentItem(new Set(), 6), 6, 'a gap between two items keeps the last');
  assert.equal(currentItem(new Set(), undefined), 0, 'the page\'s top starts at item 1');
  assert.equal(currentItem(new Set([NaN, -1, 3]), 0), 3, 'a stray value is never an item');
});

test('the count is from one, bounded, and says nothing for an empty page', () => {
  assert.equal(progressLabel(4, 28), '5 จาก 28');
  assert.equal(progressLabel(0, 28), '1 จาก 28');
  assert.equal(progressLabel(40, 28), '28 จาก 28');
  assert.equal(progressLabel(-3, 28), '1 จาก 28');
  assert.equal(progressLabel(0, 0), '');
});

test('the band starts under the sticky index, so an item hidden by the bar is not the one being read', () => {
  const top = Number(/^-(\d+)px/.exec(READING_BAND)[1]);
  const css = read('src/styles.css');
  const margin = Number(/\.vmx-wrap-item \{[^}]*scroll-margin-top: (\d+)px/.exec(css)[1]);
  assert.ok(top >= margin, `band top ${top}px is above the ${margin}px the sticky bar covers`);
});

test('the view observes items, never the scroll, and respects reduced motion per effect', () => {
  const view = read('src/views/WrapUpView.jsx');
  assert.match(view, /new IntersectionObserver\(/);
  assert.doesNotMatch(view, /addEventListener\(\s*['"]scroll/, 'a scroll listener is back');
  assert.doesNotMatch(view, /onScroll=/);
  assert.match(view, /data-n=\{n - 1\}/);
  assert.match(view, /aria-current=\{i === here \? 'location' : undefined\}/);
  assert.match(view, /<span className="vmx-wrap-where">\{progressLabel\(here, items\.length\)\}<\/span>/);
  assert.match(view, /behavior: reducedMotion\(\) \? 'auto' : 'smooth'/);
  const css = read('src/styles.css');
  assert.match(css, /\.vmx-wrap-where \{ position: sticky; left: 0;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{ \.vmx-wrap-index a \{ transition: none; \} \}/);
});
