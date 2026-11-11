// The way back to a hidden table: the passage opens in the same render as the tap.
//
// The card's "ดูตาราง" button bumps `openSignal` and scrolls to the passage on the next frame. Until
// 5.213.1 SmartPassage opened from an effect, one render later. When that render landed after the
// scroll had started, the reopened table made the page taller above the reader; WebKit kept the
// reader's place through the change and dropped the scroll, so the table was back but off screen
// (traced on a build of main: scrollY 346 of 346 before the tap, 611 of 611 after it, for good).
// It only passed when the render happened to win the race, which a slow phone loses.
//
// What a student sees is covered by tests/e2e/question-tables.spec.js ("the way back to a table").
// This pins the cause, so the effect does not come back.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('SmartPassage opens on a new openSignal while rendering, never from an effect', () => {
  const passage = read('src/components/SmartPassage.jsx');
  assert.doesNotMatch(passage, /useEffect\(\s*\(\)\s*=>\s*\{[^}]*openSignal[^}]*setOpen\(true\)/, 'opening from an effect is one render too late');
  assert.match(passage, /if \(openSignal !== seenSignal\) \{\s*setSeenSignal\(openSignal\);\s*if \(openSignal\) setOpen\(true\);\s*\}/);
  // The signal must not sit in any effect's dependency list either: that is the same late open.
  assert.doesNotMatch(passage, /\},\s*\[[^\]]*\bopenSignal\b[^\]]*\]\)/);
});

test('the card scrolls to the passage once, and jumps when the student turned motion down', () => {
  const card = read('src/components/Question.jsx');
  const handler = card.slice(card.indexOf('const focusPassage = () => {'), card.indexOf('// Header (bookmark + note + badge + image)'));
  assert.ok(handler.length > 100, 'focusPassage was not found where this test looks for it');
  assert.equal((handler.match(/scrollIntoView\(\{/g) || []).length, 1, 'one scroll with options');
  assert.match(handler, /behavior: motionIsReduced\(\) \? 'auto' : 'smooth'/);
  assert.match(card, /import \{ motionIsReduced \} from '\.\.\/lib\/motion-preferences\.js';/);
});
