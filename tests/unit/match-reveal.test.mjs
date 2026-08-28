// Instant feedback must not reveal — or lock — a match question before it
// is finished.
//
// MatchDragDrop read `revealAnswer` directly. That prop is the practice
// session's SETTING, not a statement about this question, so with instant
// feedback on (the default) every dropdown rendered `disabled` and the
// answer key printed before the student had touched it: match questions
// were unanswerable AND spoiled. MCQ gets this right one file up by
// requiring an answer on record.
//
// The rule is duplicated here rather than imported because it lives inside
// a React component; if that line changes, this test is the thing that
// says what it was for.
import test from 'node:test';
import assert from 'node:assert/strict';

const isRevealed = (revealAnswer, filledCount, totalSlots) =>
  Boolean(revealAnswer) && totalSlots > 0 && filledCount === totalSlots;

test('an untouched match question is neither revealed nor locked', () => {
  assert.equal(isRevealed(true, 0, 4), false);
});

test('a partly answered match question stays open — locking it would strand the rest', () => {
  assert.equal(isRevealed(true, 1, 4), false);
  assert.equal(isRevealed(true, 3, 4), false);
});

test('a completed match question reveals', () => {
  assert.equal(isRevealed(true, 4, 4), true);
});

test('instant feedback off never reveals, however complete', () => {
  assert.equal(isRevealed(false, 4, 4), false);
});

test('a question with no pairs cannot count as complete', () => {
  // 0 === 0 would otherwise read as "finished" and lock an empty question.
  assert.equal(isRevealed(true, 0, 0), false);
});
