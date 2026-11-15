// The exam header with main's language toggle (5.223.0), after a walk of the live site
// and the review of pull request 247:
// - with EN chosen, the line that says Thai is shown once a set, not under every stem;
// - the ไทย/EN buttons are real 44 px targets, on a row of their own at 360 px and under;
// - the live score keeps its place before the first answer, so the card does not jump
//   down when that answer lands.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { englishNoteFor, NO_ENGLISH_ITEM, NO_ENGLISH_SET } from '../../src/lib/question-language.js';

const read = (f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const q = (id) => ({ id });
const T = { 1: { q: 'one' }, 3: { q: 'three' } };

test('a mixed set says it once, on its first question with no English', () => {
  const set = [q(1), q(2), q(3), q(4)];
  assert.deepEqual(set.map((_, i) => englishNoteFor(set, i, T)), [null, NO_ENGLISH_ITEM, null, null]);
});

test('a set with no English at all says it once, at the start', () => {
  const set = [q(7), q(8), q(9)];
  assert.deepEqual(set.map((_, i) => englishNoteFor(set, i, T)), [NO_ENGLISH_SET, null, null]);
});

test('a fully translated set, or translations not loaded, says nothing', () => {
  assert.equal(englishNoteFor([q(1), q(3)], 0, T), null);
  assert.equal(englishNoteFor([q(2)], 0, null), null);
});

test('the lines are plain Thai with no dash, and the card prints only what the session hands it', () => {
  for (const line of [NO_ENGLISH_ITEM, NO_ENGLISH_SET]) assert.doesNotMatch(line, /[—–·]/);
  const card = read('src/components/Question.jsx');
  assert.match(card, /\{englishNote && !english && <p className="vmx-en-missing">\{englishNote\}<\/p>\}/);
  assert.match(read('src/views/ExamView.jsx'), /englishNote=\{lang === 'en' \? englishNoteFor\(questions, currentIdx, translationsById\) : null\}/);
});

test('the ไทย/EN buttons are real 44 px targets, with no pseudo-element hit area', () => {
  const css = read('src/styles.css');
  const at = css.indexOf('.vmx-lang-btn {');
  const rule = css.slice(at, css.indexOf('}', at));
  assert.match(rule, /min-width: 44px;/);
  assert.match(rule, /min-height: 44px;/);
  assert.doesNotMatch(css, /\.vmx-lang-btn::(before|after)/);
});

test('at 360 px and under the language row sits below the exit and the position', () => {
  const css = read('src/styles.css');
  assert.match(css, /@media \(max-width: 360px\) \{\n  \.vmx-exam-top \{ grid-template-areas: "exit pill \." "right right right"; row-gap: 8px; \}/);
});

test('the live score holds its place before the first answer', () => {
  const exam = read('src/views/ExamView.jsx');
  assert.match(exam, /if \(!graded\.length\) return <div className="vmx-live-score is-empty" aria-hidden="true">/);
  const css = read('src/styles.css');
  assert.match(css, /\.vmx-live-score\.is-empty \{ visibility: hidden; \}/);
  assert.match(css, /\.vmx-live-score \{[^}]*min-width: 7ch;/);
});
