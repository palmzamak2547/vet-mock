// A parked set keeps the question objects it began with (App.jsx writeInflight). Resumed after a
// release, it used to finish on the old passage, explanation and figure path, so a renamed figure
// showed as missing. Resume now takes each question from the current bank by id
// (refreshParkedQuestions in src/lib/exam-recovery.js) and leaves the student's answers, order and
// time where they are, beside the questions in the parked record. A question whose answer would
// mean something else (its options, pairs, blanks, distractors or type changed) stays as parked,
// and so does one the bank no longer has.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { refreshParkedQuestions, PARKED_ANSWER_SPACE } from '../../src/lib/exam-recovery.js';

const mcq = (over = {}) => ({ id: 101, subject: 'com5', year: 4, type: 'mcq', q: 'stem', options: ['a', 'b', 'c', 'd'], answer: 1,
  explain: 'old explanation', passage: 'old passage', image: '/figures/old.webp', ...over });

test('content edited in a release reaches a resumed set; order and every other question are untouched', () => {
  const parked = [mcq(), mcq({ id: 102, q: 'second' })];
  const bank = [mcq({ explain: 'new explanation', passage: 'new passage', image: '/figures/q101.webp', say: 'stem as a sentence' }), mcq({ id: 102, q: 'second' })];
  const out = refreshParkedQuestions(parked, bank);
  assert.deepEqual(out.questions.map((q) => q.id), [101, 102], 'same questions, same order');
  assert.equal(out.questions[0].passage, 'new passage');
  assert.equal(out.questions[0].explain, 'new explanation');
  assert.equal(out.questions[0].image, '/figures/q101.webp', 'a renamed figure is found under its new name');
  assert.equal(out.questions[0].say, 'stem as a sentence', 'a field added in the release arrives too');
  assert.equal(out.questions[0], bank[0], 'the bank object itself, so every screen reads the same copy');
  assert.deepEqual(out.refreshed, [101, 102]);
});

test('a field removed in the release is gone from the resumed question', () => {
  const out = refreshParkedQuestions([mcq()], [mcq({ image: undefined })]);
  assert.equal(out.questions[0].image, undefined);
});

test('options that changed keep the parked question, so the picked index still means the picked option', () => {
  for (const [field, value] of [['options', ['a', 'c', 'b', 'd']], ['options', ['a', 'b', 'c', 'd', 'e']], ['type', 'tf']]) {
    const parked = [mcq()];
    const out = refreshParkedQuestions(parked, [mcq({ [field]: value, explain: 'new explanation' })]);
    assert.equal(out.questions[0], parked[0], `${field} changed: the parked copy stays whole`);
    assert.deepEqual(out.kept, [101]);
  }
  const match = { id: 5, subject: 'x', type: 'match', q: 'm', pairs: [{ left: 'L1', right: 'R1' }, { left: 'L2', right: 'R2' }] };
  const swapped = { ...match, pairs: [{ left: 'L2', right: 'R2' }, { left: 'L1', right: 'R1' }] };
  assert.equal(refreshParkedQuestions([match], [swapped]).questions[0], match);
  const fill = { id: 6, subject: 'x', type: 'fill', q: '__ and __', blanks: [['a'], ['b']] };
  assert.equal(refreshParkedQuestions([fill], [{ ...fill, blanks: [['a'], ['b'], ['c']] }]).questions[0], fill);
  assert.deepEqual(PARKED_ANSWER_SPACE, ['type', 'options', 'pairs', 'distractors', 'blanks']);
});

test('a corrected key with the same options is taken: the student keeps the option they picked, graded by the key now', () => {
  const out = refreshParkedQuestions([mcq()], [mcq({ answer: 2 })]);
  assert.equal(out.questions[0].answer, 2);
  assert.deepEqual(out.questions[0].options, mcq().options, 'the index the student holds names the same option text');
});

test('a question the bank no longer has, or an id that now names another subject\'s question, stays as parked', () => {
  const own = { id: 101, subject: 'custom', type: 'mcq', q: 'my own', options: ['x', 'y'], answer: 0 };
  const gone = mcq({ id: 999 });
  const out = refreshParkedQuestions([gone, own], [mcq()]);
  assert.equal(out.questions[0], gone);
  assert.equal(out.questions[1], own);
  assert.deepEqual(out.missing, [999, 101]);
});

test('the order the options were shown in is kept from the parked copy', () => {
  const out = refreshParkedQuestions([mcq({ noShuffle: true })], [mcq({ explain: 'new' })]);
  assert.equal(out.questions[0].explain, 'new');
  assert.equal(out.questions[0].noShuffle, true);
  const unset = refreshParkedQuestions([mcq()], [mcq({ noShuffle: true })]);
  assert.equal(unset.questions[0].noShuffle, undefined);
});

test('two subjects that use one id each find their own question', () => {
  const a = mcq({ id: 7, subject: 'com4', explain: 'com4 old' });
  const b = mcq({ id: 7, subject: 'com5', explain: 'com5 old' });
  const bank = [mcq({ id: 7, subject: 'com4', explain: 'com4 new' }), mcq({ id: 7, subject: 'com5', explain: 'com5 new' })];
  const out = refreshParkedQuestions([a, b], bank);
  assert.deepEqual(out.questions.map((q) => q.explain), ['com4 new', 'com5 new'], 'the one loaded last does not hide the other');
  assert.deepEqual(out.missing, []);
});

test('App resumes through the guarded runner and shows the card busy meanwhile', () => {
  const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const fn = app.slice(app.indexOf('const resumePendingExam = useCallback('), app.indexOf('const dismissPendingExam'));
  assert.match(fn, /resumeFlightRef\.current\(async \(\) => \{/, 'one resume at a time');
  assert.match(fn, /resumeParkedSet\(\{/);
  assert.match(fn, /stillCurrent: \(saved\) => eventContextRef\.current\.owner === owner && viewRef\.current === 'home'\s*&& parkedStillCurrent\(window\.localStorage, owner, saved\)/);
  assert.match(fn, /onBusy: setResumeBusy/);
  assert.match(app, /pendingResume: resumeBusy && pendingResume \? \{ \.\.\.pendingResume, busy: true \} : pendingResume/, 'Home is told the resume is running');
  const card = readFileSync(new URL('../../src/components/NextActionCard.jsx', import.meta.url), 'utf8');
  assert.match(card, /busy: !!pendingResume\.busy/);
  assert.match(card, /disabled=\{action\.busy \|\| undefined\}/, 'the card cannot be tapped again while it opens');
});

