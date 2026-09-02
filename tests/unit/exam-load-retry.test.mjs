// ============================================================
// Exam-start recovery + Home subject grid — source contracts
// ============================================================
// The question bank loads lazily, so a flaky connection can fail the tap
// that starts an exam. That failure must offer a retry that re-runs the
// same start with the same configuration — not a dead-end notice. On Home,
// the per-subject bookmark counts are memoised so the bank is indexed when
// the bookmarks change, not on every render; and the progress bar moves on
// the shared motion tokens like every other animated surface.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const app = read('../../src/App.jsx');
const home = read('../../src/views/HomeView.jsx');
const css = read('../../src/styles.css');

test('a failed question-bank load offers a retry that re-runs the same start', () => {
  assert.doesNotMatch(app, /alertDialog\(\{ title: 'โหลดคลังโจทย์ไม่ได้'/, 'the dead-end notice is back');
  assert.match(app, /function offerBankRetry\(\) \{\n  return confirmDialog\(\{[\s\S]*?confirmLabel: 'ลองใหม่'/);
  const retries = app.match(/if \(await offerBankRetry\(\)\) return startExam\(overrides\);/g) || [];
  assert.equal(retries.length, 2, 'both load paths (scoped load and the full-bank fallback) must offer the retry');
});

test('SubjectGrid memoises the per-subject bookmark counts ahead of its early return', () => {
  const start = home.indexOf('function SubjectGrid(');
  assert.ok(start >= 0, 'SubjectGrid is gone');
  const body = home.slice(start);
  const memo = body.indexOf('const bookmarksBySubject = useMemo(');
  const earlyReturn = body.indexOf('if (!subjects?.length)');
  assert.ok(memo >= 0, 'bookmark counts are no longer memoised');
  assert.ok(earlyReturn > memo, 'the hook must run before the empty-year early return');
  assert.match(body, /\}, \[bookmarks, customQuestions, QB\.length\]\);/);
  // Stable empty defaults: a fresh [] per render would defeat the memo.
  assert.match(body, /customQuestions = NO_ITEMS, readingChecklist = \{\}, bookmarks = NO_ITEMS/);
  assert.match(home, /customQuestions=\{customQuestions \|\| NO_ITEMS\}/);
  assert.doesNotMatch(home, /customQuestions=\{customQuestions \|\| \[\]\}/);
});

test('the progress bar fill moves on the shared motion tokens', () => {
  assert.match(css, /\.vmx-progress-fill \{[^}]*transition: width var\(--dur-slow\) var\(--ease-out\);/);
  assert.doesNotMatch(css, /\.vmx-progress-fill \{[^}]*transition: width 0\.3s;/);
});
