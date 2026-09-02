// ============================================================
// Score burst — the party stays decorative
// ============================================================
// A strong result gets a one-shot confetti scatter behind the score. These
// contracts keep it honest: it only fires for a real set and a real score,
// it never carries information or blocks a tap, it plays on compositor
// properties after the digits have landed, and it does not exist under
// prefers-reduced-motion.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const results = read('../../src/views/ResultsView.jsx');
const burst = read('../../src/components/ScoreBurst.jsx');
const css = read('../../src/styles.css');

test('the burst fires only for a strong score over at least three graded questions', () => {
  assert.match(results, /const celebrate = autoQs\.length >= 3 && score\.pct >= 80;/);
  assert.match(results, /<div className="vmx-results-hero">\n\s*\{celebrate && <ScoreBurst strong=\{score\.pct === 100\} \/>\}/);
});

test('the burst is hidden from assistive tech and deterministic', () => {
  assert.match(burst, /aria-hidden="true"/);
  assert.doesNotMatch(burst, /Math\.random/);
  assert.match(burst, /'--dx': `\$\{dx\}px`, '--dy': `\$\{dy\}px`, '--rot':/);
});

test('the burst never gets in the way and sits behind the score text', () => {
  const rule = css.match(/\.vmx-burst \{[^}]*\}/)?.[0] || '';
  assert.match(rule, /pointer-events: none;/);
  assert.match(rule, /z-index: -1;/);
  // Longhand offsets before the inset shorthand (STABILITY rule 6).
  assert.match(rule, /top: 0; right: 0; bottom: 0; left: 0; inset: 0;/);
  // z-index -1 only stays inside the card because the hero isolates.
  const hero = css.match(/\.vmx-results-hero \{[^}]*\}/)?.[0] || '';
  assert.match(hero, /position: relative; isolation: isolate; overflow: hidden;/);
});

test('the burst waits for the digit roll and animates compositor properties only', () => {
  assert.match(css, /animation-delay: calc\(650ms \+ var\(--i\) \* 22ms\);/);
  const frames = css.match(/@keyframes vmx-burst-fly \{[\s\S]*?\n\}/)?.[0] || '';
  assert.ok(frames, 'keyframes are gone');
  assert.doesNotMatch(frames, /\b(width|height|top|left|margin|box-shadow|filter)\s*:/);
  assert.match(frames, /transform: translate\(calc\(-50% \+ var\(--dx\)\)/);
});

test('reduced motion removes the burst entirely', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\n  \.vmx-burst \{ display: none; \}\n\}/);
});
