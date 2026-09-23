// ============================================================
// The lecturer section holds its place while it loads (UI-22)
// ============================================================
// LecturerSets is its own lazy chunk. Its Suspense fallback was one line of
// bare text, "กำลังโหลด", so when the chunk landed the section grew by one
// to four lecturer cards and shoved the topic list down while the student
// was reaching for it. Measured with the chunk held back 1.5 s (a cold first
// visit after a release): cumulative layout shift 0.20-0.23 on the equine
// and One Health topic screens at 390 and 1280px, almost all of it the
// topic grid and its section label.
//
// The fallback now draws one skeleton card per lecturer the set actually
// has, built from the real card's own layout classes, so the space it takes
// is the space the section will take.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const view = read('src/views/TopicSelectView.jsx');
const css = read('src/styles.css');

test('UI-22: the LecturerSets fallback is a skeleton, not a bare loading line', () => {
  const at = view.search(/<LecturerSets\s/);
  const suspense = view.lastIndexOf('<Suspense', at);
  const opener = view.slice(suspense, at);
  assert.doesNotMatch(opener, /fallback=\{<div className="vmx-lect-intro">กำลังโหลด<\/div>\}/);
  assert.match(opener, /fallback=\{<LecturerSetsSkeleton count=\{lecturerCount\} \/>\}/);
});

test('UI-22: the skeleton reserves one card per lecturer in the set, in the real card classes', () => {
  assert.match(view, /const lecturerCount = LECTURER_SETS\[subject\]\?\.lecturers\?\.length \|\| 1;/);
  const fn = view.slice(view.indexOf('function LecturerSetsSkeleton'));
  assert.ok(fn.length > 0, 'LecturerSetsSkeleton is gone');
  const body = fn.slice(0, fn.indexOf('\n}\n'));
  for (const cls of ['vmx-lect-list', 'vmx-lect ', 'vmx-lect-head', 'vmx-lect-strip', 'vmx-lect-actions']) {
    assert.ok(body.includes(cls.trim()), `the skeleton does not use ${cls.trim()}`);
  }
  // Decorative to assistive tech, with one status line saying what is coming.
  assert.match(body, /aria-busy="true"/);
  assert.match(body, /role="status"/);
  assert.match(body, /aria-hidden="true"/);
});

test('UI-22: the skeleton blocks carry the real cover and button geometry, and the shimmer stops under reduced motion', () => {
  assert.match(css, /\.vmx-lect-skel-cover \{[^}]*flex: 0 0 232px;[^}]*\}/);
  assert.match(css, /\.vmx-lect-skel-btn \{[^}]*height: var\(--touch-min\);[^}]*\}/);
  assert.match(css, /@media \(max-width: 600px\) \{[^}]*\.vmx-lect-skel-cover \{ flex-basis: 204px;/);
  // The shared skeleton already stops shimmering under reduced motion.
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.vmx-skeleton,[\s\S]*?\{ animation: none; \}/);
});
