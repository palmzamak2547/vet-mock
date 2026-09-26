// ============================================================
// attempts-skip-blanks.test.mjs — a blank is not a wrong attempt
// ============================================================
// B02 (bug hunt 2026-09-26). finishExam turns every auto-graded question of
// a submitted set into a history row, and a question left blank grades as
// correct:false. Answer 2 of a 50-question mock and submit: 48 questions
// the student never saw land in the wrong pool and the "ทบทวนข้อที่ตอบผิด"
// chip, earn wrong-answer XP, tick the "ทำ 15 ข้อ" quest, and bump the
// streak, while Results and Review call the same 48 ข้าม.
//
// createAttemptEntries keeps one row per question: the detailed log and the
// leaderboard payload (question_versions for every question, blanks scored
// 0) need them. answeredAttempts is the set that counts as practice.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import { createAttemptEntries, answeredAttempts, newStudySessionId } from '../../src/lib/study-events.js';
import { answerOutcome } from '../../src/hooks/utils.js';

const mcq = (id) => ({ id, type: 'mcq', subject: 'com3', options: ['a', 'b'], answer: 1 });
const fill = { id: 11, type: 'fill', subject: 'com3', blanks: ['gauze'] };
const match = { id: 12, type: 'match', subject: 'com3', pairs: [{ left: 'L', right: 'R' }] };
const questions = [mcq(1), mcq(2), mcq(3), mcq(4), fill, match];
// 1 right, 1 wrong (index 0 is falsy but answered), 3 never touched,
// a fill typed then erased, a matching set cleared.
const answers = { 1: 1, 2: 0, 11: [''], 12: {} };

const entries = () => createAttemptEntries({ questions, answers, sessionId: newStudySessionId(), now: 1000 });

test('the detailed rows still cover every question, blanks as not correct', () => {
  const rows = entries();
  assert.equal(rows.length, questions.length);
  assert.equal(rows.filter((r) => r.correct).length, 1);
});

test('only answered questions count as practice', () => {
  const rows = answeredAttempts(entries());
  assert.deepEqual(rows.map((r) => r.questionId), [1, 2]);
  assert.deepEqual(rows.map((r) => r.correct), [true, false]);
});

test('practice rows agree with what Results and Review call answered', () => {
  const kept = new Set(answeredAttempts(entries()).map((r) => r.questionId));
  for (const q of questions) {
    assert.equal(kept.has(q.id), answerOutcome(q, answers[q.id]) !== 'skipped', `question ${q.id}`);
  }
});

test('a set with nothing answered is no practice at all', () => {
  const rows = createAttemptEntries({ questions, answers: {}, sessionId: newStudySessionId() });
  assert.equal(rows.length, questions.length);
  assert.deepEqual(answeredAttempts(rows), []);
});

test('finishExam builds practice rows from answered attempts only (App wiring)', async () => {
  const { readFileSync } = await import('node:fs');
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /import \{ createAttemptEntries, answeredAttempts \} from '\.\/lib\/study-events\.js';/);
  assert.match(app, /let newEntries = answeredAttempts\(detailedEntries\)\.map\(/,
    'history, XP, quests and the streak must come from answered questions only');
  assert.match(app, /appendStudyEvents\(eventOwner, detailedEntries\)/, 'the detailed log still carries every question');
  assert.match(app, /question_versions: Object\.fromEntries\(detailedEntries\.map\(/, 'the leaderboard payload still carries every question');
});
