// A held key cannot move on and then submit a paper (review of pull request 247).
// Holding Enter on the second-last question moved to the last, the repeat
// opened the submit dialog, whose ส่งข้อสอบ button takes focus, and the next
// repeat pressed it. Only a fresh press moves on or submits: the exam's key
// handlers in App.jsx ignore a repeat on the keys that move on or submit, and
// the dialog's confirm ignores a repeated Enter or Space.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const app = read('src/App.jsx');
const exam = read('src/views/ExamView.jsx');

// The text of a branch: from its condition to the first call that moves or submits.
const branch = (src, start, end) => {
  const at = src.indexOf(start);
  assert.ok(at > 0, `no branch starting ${start}`);
  return src.slice(at, src.indexOf(end, at));
};

test('Enter and Space in the exam ignore a repeat before they move on or ask to submit', () => {
  const b = branch(app, "if (e.key === ' ' || e.key === 'Enter') {", "if (currentIdx < questions.length - 1) nextQ();");
  assert.match(b, /if \(e\.repeat\) return;/);
});

test('the j shortcut ignores a repeat before it moves on or asks to submit', () => {
  const b = branch(app, "if (k === 'j' || k === 'J') {", 'if (currentIdx < questions.length - 1) nextQ(); else');
  assert.match(b, /if \(e\.repeat\) return;/);
});

test('a held right arrow does not run through the paper', () => {
  assert.match(app, /if \(e\.key === 'ArrowRight' && !e\.repeat\) \{ if \(currentIdx < questions\.length - 1\) nextQ\(\); \}/);
});

test("the submit dialog's confirm, which takes focus, ignores a repeated Enter or Space", () => {
  const b = branch(exam, 'onClick={() => { setConfirmSubmit(false); nextQ(); }}', 'autoFocus');
  assert.match(b, /onKeyDown=\{\(e\) => \{ if \(e\.repeat && \(e\.key === 'Enter' \|\| e\.key === ' '\)\) e\.preventDefault\(\); \}\}/);
});
