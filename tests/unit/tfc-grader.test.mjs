// True or false with a written correction (type 'tfc').
//
// The paper's format: a statement; the student marks ถูก or ผิด, and a statement marked ผิด must be
// put right in writing. The stored answer is an array of strings, the shape a fill-in item stores:
// ['T'], or ['F', 'the correction']. The score is all or nothing: the verdict must be the key's,
// and when the key is ผิด the correction must be the key's too (by the fill-in rules), unless the
// item says the correction can only be judged by the student (fix.selfCheck).
//
// No tfc item is in the bank yet: content in this format comes only from papers and records in
// this format. Every case here is a fixture.
import test from 'node:test';
import assert from 'node:assert/strict';

import * as utils from '../../src/hooks/utils.js';
import { questionRevision, acceptedQuestionRevisions } from '../../src/lib/study-events.js';
import { scoreSubmission } from '../../api/_lib/exam-scoring.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const { isCorrect, isAnswered, answerOutcome, reviewOutcome, isWritingType, questionCategory, timeForQuestion } = utils;

const TRUE = { id: 9001, subject: 'gen', year: 5, type: 'tfc', q: 'Insulin ลดระดับน้ำตาลในเลือด', answer: true };
const FALSE = {
  id: 9002, subject: 'gen', year: 5, type: 'tfc', q: 'Glucocorticoids แนะนำให้ใช้รักษา shock ทุกประเภทเป็น routine', answer: false,
  fix: { wrong: 'ทุกประเภทเป็น routine', right: 'เฉพาะ CIRCI', accept: ['critical illness-related corticosteroid insufficiency'], sentence: 'Glucocorticoids ใช้เฉพาะ CIRCI ไม่ใช้เป็น routine ใน shock' },
};
const NUMBER = { id: 9003, subject: 'gen', year: 5, type: 'tfc', q: 'ค่า DEB ที่เหมาะกับการเจริญเติบโตคือ 150 mEq/kg', answer: false, fix: { wrong: '150', right: '250', sentence: 'ค่า DEB ที่เหมาะกับการเจริญเติบโตคือ 250 mEq/kg' } };
const SELF = { id: 9004, subject: 'gen', year: 5, type: 'tfc', q: 'วัคซีนเชื้อตายกระตุ้นภูมิได้ดีกว่าเชื้อเป็นเสมอ', answer: false, fix: { wrong: 'ดีกว่าเชื้อเป็นเสมอ', right: 'ขึ้นกับชนิดวัคซีนและวิธีให้', sentence: 'วัคซีนเชื้อเป็นมักกระตุ้นภูมิได้กว้างกว่า', selfCheck: true } };

test('the verdict alone decides a true statement', () => {
  assert.equal(isCorrect(TRUE, ['T']), true);
  assert.equal(isCorrect(TRUE, ['F', 'เพิ่ม']), false, 'marked ผิด on a true statement');
  assert.equal(isCorrect(TRUE, ['F', '']), false);
});

test('a false statement needs the verdict and the correction', () => {
  assert.equal(isCorrect(FALSE, ['F', 'เฉพาะ CIRCI']), true);
  assert.equal(isCorrect(FALSE, ['F', 'เฉพาะ circi ']), true, 'case and spacing are writing, not knowledge');
  assert.equal(isCorrect(FALSE, ['F', 'ใช้เฉพาะ CIRCI เท่านั้น']), true, 'more words around the key, as in a fill-in blank');
  assert.equal(isCorrect(FALSE, ['T']), false, 'wrong verdict');
  assert.equal(isCorrect(FALSE, ['F', 'septic shock']), false, 'right verdict, correction off');
  assert.equal(isCorrect(FALSE, ['F', '']), false, 'right verdict, nothing written');
  assert.equal(isCorrect(FALSE, ['F']), false);
  assert.equal(isCorrect(FALSE, ['F', 'ไม่ใช่เฉพาะ CIRCI']), false, 'a negated key is not the key');
  assert.equal(isCorrect(FALSE, ['F', 'เฉพาะ CIRCI หรือ septic shock']), false, 'two answers in one field');
  assert.equal(isCorrect(NUMBER, ['F', '250']), true);
  assert.equal(isCorrect(NUMBER, ['F', '250 mEq/kg']), true);
  assert.equal(isCorrect(NUMBER, ['F', '2500']), false, 'a longer number is another number');
  assert.equal(isCorrect(NUMBER, ['F', '150']), false);
});

test('fix.accept lists further right corrections', () => {
  assert.equal(isCorrect(FALSE, ['F', 'critical illness-related corticosteroid insufficiency']), true);
  assert.equal(isCorrect({ ...FALSE, fix: { ...FALSE.fix, accept: undefined } }, ['F', 'critical illness-related corticosteroid insufficiency']), false);
  assert.equal(isCorrect({ ...FALSE, fix: { ...FALSE.fix, accept: 'not a list' } }, ['F', 'เฉพาะ CIRCI']), true, 'a malformed accept is no accept');
});

test('fix.selfCheck scores the verdict and leaves the correction to the student', () => {
  assert.equal(isCorrect(SELF, ['F', 'ไม่เสมอไป']), true);
  assert.equal(isCorrect(SELF, ['F', '']), true, 'the verdict is what is scored');
  assert.equal(isCorrect(SELF, ['T']), false);
});

test('only the stored shape is an answer: an array of strings, never a boolean', () => {
  for (const ua of [true, false, 'T', 'F', 0, 1, {}, { 0: 'T' }, [], [''], ['t'], ['X'], [true], ['T', 'x', 'y'].slice(0, 0), null, undefined]) {
    assert.equal(isCorrect(TRUE, ua), false, `true key, answer ${JSON.stringify(ua)}`);
    assert.equal(isCorrect(FALSE, ua), false, `false key, answer ${JSON.stringify(ua)}`);
  }
  assert.equal(isCorrect({ ...TRUE, answer: 'true' }, ['T']), false, 'a key that is not a boolean marks nothing right');
  assert.equal(isCorrect({ ...FALSE, fix: undefined }, ['F', 'x']), false, 'a false key with no correction to grade against is not gradable');
});

test('the display outcome separates a right verdict with a correction that is off', () => {
  const { tfcOutcome } = utils;
  assert.equal(typeof tfcOutcome, 'function', 'utils exports tfcOutcome');
  assert.deepEqual(tfcOutcome(TRUE, ['T']), { answered: true, verdict: true, fix: 'none', correct: true });
  assert.deepEqual(tfcOutcome(TRUE, ['F', 'เพิ่ม']), { answered: true, verdict: false, fix: 'none', correct: false });
  assert.deepEqual(tfcOutcome(FALSE, ['F', 'เฉพาะ CIRCI']), { answered: true, verdict: true, fix: 'ok', correct: true });
  assert.deepEqual(tfcOutcome(FALSE, ['F', 'septic shock']), { answered: true, verdict: true, fix: 'off', correct: false });
  assert.deepEqual(tfcOutcome(FALSE, ['T']), { answered: true, verdict: false, fix: 'none', correct: false });
  assert.deepEqual(tfcOutcome(SELF, ['F', 'ไม่เสมอไป']), { answered: true, verdict: true, fix: 'self', correct: true });
  assert.deepEqual(tfcOutcome(FALSE, undefined), { answered: false, verdict: false, fix: 'none', correct: false });
  // The outcome never disagrees with the score.
  for (const q of [TRUE, FALSE, NUMBER, SELF]) for (const ua of [['T'], ['F', ''], ['F', 'เฉพาะ CIRCI'], ['F', '250'], ['F', 'zzz'], undefined, [], true]) {
    assert.equal(tfcOutcome(q, ua).correct, isCorrect(q, ua), `${q.id} ${JSON.stringify(ua)}`);
  }
});

test('answered, filled, outcome, category and time treat tfc as a typed, auto-marked type', () => {
  const { fillFilled } = utils;
  assert.equal(isAnswered(['T']), true);
  assert.equal(isAnswered(['F', '']), true, 'a verdict is an answer for results and the redo set');
  assert.equal(fillFilled(TRUE, ['T']), true);
  assert.equal(fillFilled(FALSE, ['F', '']), false, 'ผิด with nothing written is not answered in full');
  assert.equal(fillFilled(FALSE, ['F', '  ']), false);
  assert.equal(fillFilled(FALSE, ['F', 'x']), true);
  assert.equal(fillFilled(TRUE, ['F', '']), false, 'the map cannot know the key: ผิด always needs its correction');
  assert.equal(fillFilled(FALSE, undefined), false);
  assert.equal(answerOutcome(FALSE, ['F', 'เฉพาะ CIRCI']), 'correct');
  assert.equal(answerOutcome(FALSE, ['F', 'zzz']), 'wrong');
  assert.equal(answerOutcome(FALSE, undefined), 'skipped');
  assert.equal(reviewOutcome(FALSE, ['T']), 'wrong', 'auto-marked, never ประเมินเอง');
  assert.equal(isWritingType(FALSE), false, 'it counts in the auto-graded score');
  assert.equal(questionCategory(FALSE), 'writing', 'it needs a keyboard, so it goes with the typed kinds');
  assert.equal(timeForQuestion(FALSE, 60), 75);
  assert.equal(timeForQuestion(TRUE, 60), 75, 'the time cannot depend on the key');
  assert.equal(timeForQuestion(TRUE, 0), 0);
});

test('the practice filters place tfc with the typed kinds, and nowhere it cannot be answered', async () => {
  const tf = { id: 9010, subject: 'gen', year: 5, type: 'tf', q: 'ข้อความ', answer: true };
  const mcq = { id: 9011, subject: 'gen', year: 5, type: 'mcq', q: 'คำถาม', options: ['a', 'b'], answer: 0 };
  const pool = [TRUE, FALSE, tf, mcq];
  const ids = (questionCategory) => buildExamPool({ questions: pool, subject: 'gen', questionCategory }).map((q) => q.id).sort();
  assert.deepEqual(ids('tf'), [9010], 'the true/false set is tap-only items');
  assert.deepEqual(ids('mcq-only'), [9011]);
  assert.deepEqual(ids('writing'), [9001, 9002]);
  assert.deepEqual(ids('mcq'), [9010, 9011]);
});

test('the revision of a tfc item moves with its key and its correction', () => {
  const rev = questionRevision(FALSE);
  assert.notEqual(questionRevision({ ...FALSE, answer: true }), rev);
  assert.notEqual(questionRevision({ ...FALSE, fix: { ...FALSE.fix, right: 'CIRCI' } }), rev);
  assert.notEqual(questionRevision({ ...FALSE, fix: { ...FALSE.fix, accept: [] } }), rev);
  assert.notEqual(questionRevision({ ...FALSE, fix: { ...FALSE.fix, selfCheck: true } }), rev);
  assert.equal(questionRevision({ ...FALSE, explain: 'เหตุผล' }), rev);
});

test('the server re-score agrees with the device for tfc, answer by answer', () => {
  const questions = [TRUE, FALSE, NUMBER, SELF];
  const catalog = new Map(questions.map((q) => [String(q.id), q]));
  const papers = [
    { 9001: ['T'], 9002: ['F', 'เฉพาะ CIRCI'], 9003: ['F', '250 mEq/kg'], 9004: ['F', 'ไม่เสมอไป'] },
    { 9001: ['F', 'เพิ่ม'], 9002: ['F', 'septic shock'], 9003: ['T'], 9004: ['T'] },
    { 9001: ['T'], 9002: ['T'], 9003: ['F', '2500'] },
    {},
  ];
  for (const answers of papers) {
    const device = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    // The answers as they travel: through JSON, as the outbox stores and sends them.
    const body = JSON.parse(JSON.stringify({
      id: '11111111-1111-4111-8111-111111111111', question_ids: questions.map((q) => q.id), answers,
      question_versions: Object.fromEntries(questions.map((q) => [q.id, questionRevision(q)])), correct: 0, mode: 'exam',
    }));
    const scored = scoreSubmission(body, catalog);
    assert.equal(scored.score_source, 'server');
    assert.equal(scored.correct, device, JSON.stringify(answers));
    assert.equal(scored.total, 4);
  }
  for (const q of questions) assert.ok(acceptedQuestionRevisions(q).includes(questionRevision(q)));
});

test('the bank holds no tfc item in this release', async () => {
  let n = 0;
  for (const entry of BANK_REGISTRY) for (const q of await entry.load()) if (q.type === 'tfc') n += 1;
  assert.equal(n, 0, 'tfc content comes later, only from papers and records in that format; when it lands, this test goes and reveal-every-type walks the bank items');
});
