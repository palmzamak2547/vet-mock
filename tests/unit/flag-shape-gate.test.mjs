import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { questionNeedsAnswerReview } from '../../src/lib/question-prediction.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

const BANK_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'data');

// The delivery gate and the question card read the same `flag` field. The
// card treats anything that is not `{ severity, note }` as an UNCLEAR
// conflict and shows the student an empty explanation; the gate used to
// treat the same value as "no unclear flag here" and deliver the question
// as verified. These tests pin the gate to the card's reading: a flag the
// app cannot explain is a flag the app cannot vouch for.

test('a flag written as a bare string fails closed', () => {
  // The exact strings the bank carries today.
  for (const flag of ['verify-2026', 'tricky-stem', 'corrected-from-student', 'minor']) {
    assert.equal(
      questionNeedsAnswerReview({ answerStatus: 'verified', flag }),
      true,
      `flag: '${flag}' must not pass the gate`,
    );
  }
});

test('an object flag the card could not explain fails closed too', () => {
  assert.equal(questionNeedsAnswerReview({ flag: { severity: 'critical', note: 'x' } }), true);
  assert.equal(questionNeedsAnswerReview({ flag: { severity: 'major' } }), true);
  assert.equal(questionNeedsAnswerReview({ flag: { severity: 'minor', note: '   ' } }), true);
  assert.equal(questionNeedsAnswerReview({ flag: {} }), true);
  assert.equal(questionNeedsAnswerReview({ flag: true }), true);
  assert.equal(questionNeedsAnswerReview({ flag: ['minor'] }), true);
});

test('a documented major or minor conflict is still deliverable with its warning', () => {
  assert.equal(questionNeedsAnswerReview({
    flag: { severity: 'major', note: 'ข้อสอบเก่าเฉลยอีกแบบ เลกเชอร์ปัจจุบันสอนอีกแบบ' },
  }), false);
  assert.equal(questionNeedsAnswerReview({
    flag: { severity: 'minor', note: 'หน่วยในโจทย์ต่างจากสไลด์' },
  }), false);
  // unclear stays blocked, as before
  assert.equal(questionNeedsAnswerReview({
    flag: { severity: 'unclear', note: 'ยังหาแหล่งอ้างอิงยืนยันไม่ได้' },
  }), true);
  // no flag at all is not a review request
  assert.equal(questionNeedsAnswerReview({}), false);
  assert.equal(questionNeedsAnswerReview({ flag: null }), false);
  assert.equal(questionNeedsAnswerReview({ answerStatus: 'verified' }), false);
  // an explicit review request wins over a well-formed flag
  assert.equal(questionNeedsAnswerReview({
    answerStatus: 'needs-review',
    flag: { severity: 'minor', note: 'x' },
  }), true);
});

test('every bank question with a flag the card cannot explain is out of the delivery gate', async () => {
  const { BLOCKED_QUESTIONS, isQuestionDeliverable } = await import('../../src/data/question-delivery.generated.js');
  const blockedKeys = new Set(BLOCKED_QUESTIONS.map((item) => item.key));
  const leaked = [];
  for (const file of bankFiles(BANK_DIR)) {
    const { questions } = await readBank(file);
    for (const q of questions) {
      if (!q.flag) continue;
      const documented = typeof q.flag === 'object'
        && (q.flag.severity === 'major' || q.flag.severity === 'minor')
        && typeof q.flag.note === 'string'
        && q.flag.note.trim().length > 0;
      if (documented) continue;
      const key = `${q.subject}:${q.id}`;
      if (!blockedKeys.has(key) || isQuestionDeliverable(q)) leaked.push(`${key} flag=${JSON.stringify(q.flag)}`);
    }
  }
  assert.deepEqual(leaked, [], 'these flagged questions are served as verified');
});
