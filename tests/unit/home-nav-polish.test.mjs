// ============================================================
// Home + navigation polish — contracts that keep the fixes honest
// ============================================================
// Source-level guards for a small batch of UX work: the practice presets
// on Home stay memoised (the render body used to index the whole question
// bank on every re-render), the mobile bottom nav keeps its animated
// active indicator with a reduced-motion fallback, three result tiles
// never leave an orphan on a phone, and the keyboard hint on Home matches
// the shortcut the exam actually accepts.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../../src/views/HomeView.jsx');
const nav = read('../../src/components/BottomNav.jsx');
const css = read('../../src/styles.css');

test('the practice presets are computed inside useMemo, not in the render body', () => {
  const memoStart = home.indexOf('const practicePresets = useMemo(');
  assert.ok(memoStart >= 0, 'practicePresets memo is gone');
  const memoEnd = home.indexOf('}, [history, yearSubjects, QB.length]);', memoStart);
  assert.ok(memoEnd > memoStart, 'the memo lost its dependency list');
  const memoBody = home.slice(memoStart, memoEnd);
  assert.match(memoBody, /for \(const q of QB\)/, 'the bank index no longer lives in the memo');
  assert.match(memoBody, /vmx-last-session-config/, 'the last-session read no longer lives in the memo');
  // The JSX must consume the memo — a second, inline scan would undo the fix.
  const jsxStart = home.indexOf('return (\n    <>');
  const jsx = home.slice(jsxStart);
  assert.doesNotMatch(jsx, /for \(const q of QB\) if \(isQuestionDeliverable\(q\)\) qIndex/, 'the render body scans the bank again');
  assert.doesNotMatch(jsx, /\{!isScaffoldYear && \(\(\) => \{/, 'the practice-mode IIFE is back');
});

test('the home keyboard hint matches the digits the exam accepts', () => {
  assert.match(home, /<span className="vmx-kbd">1-5<\/span> เพื่อเลือก MCQ/);
  assert.doesNotMatch(home, /vmx-kbd">1-4</);
});

test('home chips use theme tokens rather than hexes that cannot flip in dark mode', () => {
  assert.doesNotMatch(home, /'#a73d4a'|'#8a3340'|'#3a8aa8'/);
  assert.match(home, /border: '1px solid var\(--clr-rose\)'/);
  assert.match(home, /color: 'var\(--clr-ocean-text\)'/);
});

test('the bottom nav active indicator is a real element with a reduced-motion fallback', () => {
  assert.match(nav, /<span className="vmx-bottom-nav-icon">[\s\S]*?<span className="vmx-bottom-nav-pill" aria-hidden="true" \/>[\s\S]*?<NavIcon name=\{item\.icon\} \/>/);
  assert.match(css, /\.vmx-bottom-nav-pill \{[\s\S]*?pointer-events: none;/);
  assert.match(css, /\.vmx-bottom-nav-item\.active \.vmx-bottom-nav-pill \{ opacity: 1; transform: scale\(1\); \}/);
  // Position is information: reduced motion drops the transition, never the pill.
  const rm = css.slice(css.indexOf('.vmx-bottom-nav-pill, .vmx-bottom-nav-icon { transition: none; }') - 60);
  assert.match(rm, /prefers-reduced-motion: reduce/);
  // Never a ::before hit-zone (STABILITY.md rule 1).
  assert.doesNotMatch(css, /\.vmx-bottom-nav-item::before/);
  // Longhand before the shorthand so Safari < 14.1 still positions it.
  assert.match(css, /top: -5px; right: -12px; bottom: -5px; left: -12px;\n\s*inset: -5px -12px;/);
});

test('three result tiles take three columns on a phone, with a two-column fallback', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 640px)'));
  assert.match(mobile, /\.vmx-stat-grid \{ grid-template-columns: repeat\(2, 1fr\); \}/);
  assert.match(mobile, /\.vmx-stat-grid:has\(> :nth-child\(3\):last-child\) \{ grid-template-columns: repeat\(3, 1fr\); \}/);
});
