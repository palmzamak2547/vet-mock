// ============================================================
// View fallback — the footer must not jump when a view's chunk lands
// ============================================================
// Measured on a throttled phone profile: Home boot had a single layout
// shift worth 0.16 CLS — the footer painted inside the first screen while
// the fallback held 60vh, then got pushed off it by the rendered view. The
// fallback now reserves a full viewport, so the footer starts below the
// fold and its later move is not a shift.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const bar = read('../../src/components/TopLoadingBar.jsx');
const css = read('../../src/styles.css');

test('the view fallback reserves a full viewport through a stylesheet class', () => {
  assert.match(bar, /className="vmx-view-fallback"/);
  assert.doesNotMatch(bar, /minHeight: '60vh'/);
  assert.match(css, /\.vmx-view-fallback \{ min-height: 100vh; min-height: 100dvh; \}/);
});
