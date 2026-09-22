// ============================================================
// thai-copy-labels.test.mjs — study-screen copy that told the student
// something false, or told it in the wrong language
// ============================================================
// These are JSX text and attribute strings; the app is not mounted headless,
// so they are pinned at the source, the way the rest of this suite pins copy.
// Each test names what a student saw before the fix.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { updateStreak } from '../../src/hooks/utils.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const count = (src, needle) => src.split(needle).length - 1;

// ── Practice feedback banner ────────────────────────────────────────────────

test('the wrong-answer banner never says the answer is marked with a tick', () => {
  const src = read('src/components/Question.jsx');
  const start = src.indexOf('function InstantFeedback(');
  assert.ok(start > 0, 'InstantFeedback must still exist');
  const body = src.slice(start, start + src.slice(start).search(/\r?\n\}\r?\n/));

  // A true/false statement that is false shows its เฉลย as "✗ False", so a
  // banner promising a ✓ mark sat directly above an ✗. It also read "ถูกถูก".
  assert.ok(!body.includes('ทำเครื่องหมาย ✓'), 'the banner still points at a ✓ that a False answer does not have');
  assert.ok(!body.includes('ถูกถูก'));
  assert.ok(body.includes("'✗ ยังไม่ใช่ ดูเฉลยด้านล่าง'"), 'the wrong branch points at the เฉลย row instead');
  assert.ok(body.includes("'✓ คุณตอบถูก'"), 'the right branch is pinned by e2e and stays');

  // "ด้านล่าง" is only true while every caller hands over a correct answer and
  // the row renders on a miss. Both callers do; the true/false one says ✗ False.
  assert.match(body, /\(alwaysShowCorrect \|\| !ok\) && correctNode != null/);
  const callers = src.split('<InstantFeedback').slice(1).map((s) => s.slice(0, s.indexOf('/>')));
  assert.equal(callers.length, 2, 'MCQ and true/false are the two callers');
  for (const caller of callers) assert.match(caller, /correctNode=\{/);
  assert.ok(callers[1].includes("correctIsTrue ? '✓ True' : '✗ False'"));
});
