// ============================================================
// app-flow-0926 — the set a student is working on, from start to parked
// ============================================================
// Bug-hunt round 2026-09-26, package "app-flow". Each test names the finding
// it pins. Where the rule is a decision it is a call into src/lib/app-flow.js
// or src/lib/current-phase.js; where the defect was wiring inside App.jsx (a
// stale closure, a missing clear), the test pins the construct, because
// rendering App is not something node can do.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parse } from '@babel/parser';
import {
  keyAnswerLocked, answeredCount, resumedDeadline, practicePreset,
  leavesReader, srPoolQuestions, questionPinPayload, unfinishedWork, PARKED_MAX_AGE_MS,
} from '../../src/lib/app-flow.js';
import { detectCurrentPhase } from '../../src/lib/current-phase.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const APP = read('src/App.jsx');
const appBody = parse(APP, { sourceType: 'module', plugins: ['jsx'] }).program.body
  .find(node => node.type === 'ExportDefaultDeclaration').declaration.body.body;
const startDeclaration = appBody.find(node => node.type === 'VariableDeclaration'
  && node.declarations.some(item => item.id.name === 'startExam'));
assert.ok(startDeclaration, 'startExam must remain findable in App');
const START_EXAM = APP.slice(startDeclaration.start, startDeclaration.end);
const SESSION = read('src/hooks/useExamSession.js');
const HOME = read('src/views/HomeView.jsx');
const EXAM = read('src/views/ExamView.jsx');
const PHASE = read('src/views/PhaseSelectView.jsx');
const YEAR = read('src/views/YearSelectView.jsx');
const SHEET = read('src/components/ShortcutSheet.jsx');
const CSS = read('src/styles.css');

/** The source of one top-level `const name = ...` in App, up to the next blank-line-separated const. */
function block(source, start, length = 4000) {
  const at = source.indexOf(start);
  assert.ok(at >= 0, `${start} moved: re-point this guard`);
  return source.slice(at, at + length);
}

// ── B03 ───────────────────────────────────────────────────────────────
test('B03: a revealed MCQ or true/false answer is locked for the keyboard as it is for the click', () => {
  const practice = { mode: 'quick', instantFeedback: true };
  const mcq = { type: 'mcq' };
  const tf = { type: 'tf' };
  assert.equal(keyAnswerLocked(mcq, 1, practice), true, 'a revealed MCQ must not take another digit');
  assert.equal(keyAnswerLocked(mcq, 0, practice), true, 'option 0 is an answer too');
  assert.equal(keyAnswerLocked(mcq, undefined, practice), false, 'an unanswered MCQ still takes the first digit');
  assert.equal(keyAnswerLocked(tf, false, practice), true, 'F then T must not flip a revealed false');
  assert.equal(keyAnswerLocked(tf, true, practice), true);
  assert.equal(keyAnswerLocked(tf, undefined, practice), false);
  assert.equal(keyAnswerLocked(mcq, 1, { mode: 'exam', instantFeedback: true }), false, 'an exam paper reveals nothing, so a changed mind is allowed');
  assert.equal(keyAnswerLocked(mcq, 1, { mode: 'quick', instantFeedback: false }), false, 'without feedback nothing is revealed');
  assert.equal(keyAnswerLocked({ type: 'fill' }, 'x', practice), false, 'written types grade at submit');
});

test('B03: the exam key handler asks the lock before answering', () => {
  const handler = block(APP, 'const locked = keyAnswerLocked(q, answers[q.id], { mode, instantFeedback });', 3200);
  assert.match(handler, /if \(!locked && displayIdx < displayToOriginal\.length\) answerCurrent\(displayToOriginal\[displayIdx\]\);/,
    'a digit must not answer a revealed MCQ');
  assert.match(handler, /else if \(q\.type === 'tf' && !locked\) \{/, 'T and F must not answer a revealed true/false');
  assert.match(handler, /\[view, currentIdx, questions, paletteOpen, answers, mode, instantFeedback\]\);/,
    'the effect re-binds when the answer, mode or feedback setting changes, or it reads a stale lock');
});

// ── B06 ───────────────────────────────────────────────────────────────
test('B06: a parked set gets back the time it had left, not a deadline that ran out while it was parked', () => {
  const savedAt = 1_000_000;
  const saved = { questionDeadline: savedAt + 30 * 60_000, savedAt };
  const hourLater = savedAt + 60 * 60_000;
  assert.equal(resumedDeadline(saved, hourLater), hourLater + 30 * 60_000, 'thirty minutes left when parked is thirty minutes on return');
  assert.equal(resumedDeadline({ questionDeadline: savedAt - 1, savedAt }, hourLater), savedAt - 1, 'time that had already run out stays out');
  assert.equal(resumedDeadline({ questionDeadline: 5, savedAt: undefined }, hourLater), 5, 'a record without savedAt keeps its old deadline');
  assert.equal(resumedDeadline({}, hourLater), null);
});

test('B06: resume goes through the paused deadline, and leaving writes the set first', () => {
  const prime = block(SESSION, 'const primeFromSaved = useCallback', 2400);
  assert.match(prime, /const deadline = resumedDeadline\(saved\);/, 'primeFromSaved must resume on the paused clock');
  assert.doesNotMatch(prime, /setQuestionDeadline\(saved\.questionDeadline\)/, 'the wall-clock deadline is what submitted the paper on reopen');
  const goHome = block(APP, 'const goHome = () => {', 900);
  assert.ok(goHome.indexOf('writeInflight()') >= 0 && goHome.indexOf('writeInflight()') < goHome.indexOf('session.resetSession()'),
    'goHome writes the parked set before it resets the session, so its savedAt is the moment it was parked');
});

// ── B07 ───────────────────────────────────────────────────────────────
test('B07: a redo round is review: practice mode, no leaderboard row, flagged for the results page', () => {
  const replay = block(APP, 'const replayQuestions = useCallback', 3200);
  assert.match(replay, /setSessionKind\(redo \? 'redo' : 'normal'\);/, 'the round must say whether it is a redo');
  assert.match(replay, /if \(redo\) setMode\('quick'\);/, 'a redo of revealed questions runs in practice mode, with feedback');
  assert.match(APP, /const replayWrongRound = useCallback\(\(qs\) => replayQuestions\(qs, \{ redo: true \}\), \[replayQuestions\]\);/);
  const finish = block(APP, 'const finishExam = async () => {', 5200);
  assert.match(finish, /const runResult = user && autoQs\.length && sessionKind !== 'redo' \? \{/,
    'a redo round must not queue a leaderboard result');
  assert.match(APP, /replayQuestions: replayWrongRound, challengeSender, sessionKind,/, 'ResultsView redoes through the flagged round and is told the kind');
  assert.match(APP, /clock: session\.clockKind\(\),\s*\n\s*sessionKind,/, 'the parked record keeps the kind, so a resumed redo stays a redo');
  assert.match(APP, /setSessionKind\(saved\.sessionKind === 'redo' \? 'redo' : 'normal'\);/);
  assert.match(START_EXAM, /setSessionKind\('normal'\);/);
  const results = read('src/views/ResultsView.jsx');
  assert.match(results, /if \(sessionKind !== 'redo' && allSameSubj && score\.total >= 5\) \{/,
    'a redo round must not write or announce a personal best');
});

// ── B08 ───────────────────────────────────────────────────────────────
test('B08: a cross-subject preset clears the topic left over from browsing', () => {
  const preset = practicePreset({ mode: 'exam', numQuestions: 50, useTimer: true, timePerQ: 60 });
  assert.equal(preset.topic, null);
  assert.equal(preset.subject, 'all');
  assert.equal(preset.mode, 'exam');
  assert.equal(preset.numQuestions, 50);
  assert.deepEqual(practicePreset({}), { mode: 'quick', subject: 'all', topic: null, practiceMode: 'all' });
  for (const [name, src] of [['HomeView', HOME], ['App palette', APP]]) {
    const at = src.indexOf('const p = practicePreset(inv);');
    assert.ok(at >= 0, `${name}: onPractice must go through practicePreset`);
    assert.match(src.slice(at, at + 500), /setTopic\??\.?\(p\.topic\)/, `${name}: onPractice must apply the cleared topic`);
  }
  assert.match(APP.slice(APP.indexOf('const p = practicePreset(inv);'), APP.indexOf('const p = practicePreset(inv);') + 600),
    /setPanicPending\(false\)/, 'the palette can be opened on the config screen, where a Panic set may be pending');
});

// ── B09 ───────────────────────────────────────────────────────────────
test('B09: after the midterms end the picker recommends the final', () => {
  const at = (iso) => new Date(iso);
  assert.equal(detectCurrentPhase(at('2026-09-26T10:00:00+07:00'), 5), '1-final', 'day after the last year-5 midterm');
  assert.equal(detectCurrentPhase(at('2026-10-15T10:00:00+07:00'), 5), '1-final', 'October is between the papers');
  assert.equal(detectCurrentPhase(at('2026-10-15T10:00:00+07:00'), 4), '1-final');
  assert.equal(detectCurrentPhase(at('2026-09-20T10:00:00+07:00'), 5), '1-mid', 'the midterm is still ahead');
  assert.equal(detectCurrentPhase(at('2026-09-25T10:00:00+07:00'), 5), '1-mid', 'the zoonoses paper is still being sat');
  assert.equal(detectCurrentPhase(at('2026-09-25T12:00:00+07:00'), 5), '1-final', 'year 5 sat its last midterm at 11:30');
  assert.equal(detectCurrentPhase(at('2026-09-25T12:00:00+07:00'), 4), '1-mid', 'year 4 sits food safety at 13:00');
  assert.equal(detectCurrentPhase(at('2026-10-15T10:00:00+07:00'), 2), '1-final', 'a year without a timetable follows the faculty exam periods');
  assert.equal(detectCurrentPhase(at('2026-08-10T10:00:00+07:00'), 5), '1-mid', 'the start of term looks ahead to the midterm');
  assert.equal(detectCurrentPhase(at('2027-01-15T10:00:00+07:00'), 5), '2-mid', 'past the timetable the month heuristic answers');
  for (const [name, src] of [['PhaseSelectView', PHASE], ['YearSelectView', YEAR]]) {
    assert.doesNotMatch(src, /detectCurrentPhase\(\)/, `${name} must pass the year it recommends for`);
  }
  assert.match(PHASE, /detectCurrentPhase\(new Date\(\), selectedYear\)/);
  assert.match(YEAR, /detectCurrentPhase\(new Date\(\), y\.id\)/);
});

// ── B11 ───────────────────────────────────────────────────────────────
test('B11: the resume card counts answers that say something', () => {
  assert.equal(answeredCount({ 1: 0, 2: '', 3: '   ', 4: 'ตับ', 5: [], 6: false }), 3);
  assert.equal(answeredCount(null), 0);
  assert.match(APP, /answered: answeredCount\(saved\.answers\),/);
  assert.doesNotMatch(APP, /Object\.keys\((saved|parked)\.answers \|\| \{\}\)\.length/, 'a cleared blank is not an answer');
});

// ── B20 ───────────────────────────────────────────────────────────────
test('B20: leaving the reader by any route forgets the deck and where back went', () => {
  assert.equal(leavesReader('pdf-annotate', 'home'), true);
  assert.equal(leavesReader('pdf-annotate', 'topic-select'), true);
  assert.equal(leavesReader('topic-select', 'pdf-annotate'), false, 'arriving is not leaving');
  assert.equal(leavesReader('pdf-annotate', 'pdf-annotate'), false);
  const effect = block(APP, 'const readerPrevViewRef = useRef(view);', 700);
  assert.match(effect, /if \(leavesReader\(prev, view\)\) \{\s*\n\s*setLibraryDoc\(null\);\s*\n\s*setPdfLibraryReturnPath\(null\);\s*\n\s*setPdfReturnView\('library'\);/);
  assert.match(APP, /onOpenLibrary=\{openLibraryFromReader\}/, "'เปิดคลังเอกสาร' and a shelf file in ไฟล์ล่าสุด open the shelf, not the last origin");
  assert.match(block(APP, 'const openLibraryFromReader = () => {', 300), /setView\('library'\);/);
});

// ── B25 / B63 ─────────────────────────────────────────────────────────
test('B25/B63: starting a set asks before throwing away unfinished work', () => {
  assert.equal(unfinishedWork({ questions: [{}, {}], answers: { 1: 0 } })?.answered, 1);
  assert.equal(unfinishedWork({ questions: [{}], answers: { 1: '' } }), null, 'nothing answered, nothing to lose');
  assert.equal(unfinishedWork({ questions: [{}], answers: { 1: 0 }, submitted: true }), null, 'a submitted set is not unfinished');
  const now = 50 * 60 * 60 * 1000;
  assert.equal(unfinishedWork({ questions: [{}], answers: { 1: 0 }, savedAt: now - 7 * 60 * 60 * 1000 }, now), null,
    'a set parked past the six-hour window is not offered back on Home, so it is nothing to ask about');
  assert.equal(unfinishedWork({ questions: [{}], answers: { 1: 0 }, savedAt: now - 60 * 60 * 1000 }, now)?.answered, 1);
  assert.equal(PARKED_MAX_AGE_MS, 6 * 60 * 60 * 1000);
  const start = START_EXAM;
  const askAt = start.indexOf('await confirmReplaceUnfinished()');
  assert.ok(askAt >= 0, 'startExam must ask first: the tour, Home launchers and the palette all start through it');
  assert.match(start, /if \(!\(await confirmReplaceUnfinished\(\)\) \|\| !current\(\)\) return;/,
    'both consent and the still-current request must survive the confirmation');
  assert.ok(askAt < start.indexOf('setPendingResume(null);'), 'ask before the resume card is dropped');
  const selectionAt = start.indexOf('const firstTime = picked[0]');
  const currentAt = start.indexOf('if (!current()) return;', selectionAt);
  const sessionAt = start.indexOf('session.startNewSession(');
  assert.ok(selectionAt > askAt && currentAt > selectionAt && sessionAt > currentAt,
    'complete selection must pass the current-request check before starting the session');
  for (const clear of ['setPendingResume(null);', "setSessionKind('normal');", 'setChallengeSender(null);']) {
    const at = start.indexOf(clear);
    assert.ok(at > currentAt && at < sessionAt, `${clear} belongs only to the successful start`);
    assert.equal(start.indexOf(clear, at + clear.length), -1, `${clear} must not also run before selection succeeds`);
  }
});

test('B25: the glossary related-questions listener starts through the current startExam', () => {
  assert.match(APP, /const startExamRef = useRef\(null\);/);
  assert.match(APP, /\n\s*startExamRef\.current = startExam;\n/, 'refreshed on every render, not inside an effect');
  const listener = block(APP, 'const onOpenRelated = (e) => {', 400);
  assert.match(listener, /startExamRef\.current\?\.\(\{ onlyIds: ids,/, 'a first-render startExam stamps sessionOwner=null and the set can never be submitted');
  assert.doesNotMatch(listener, /(^|[^.\w])startExam\(\{/);
});

// ── B64 ───────────────────────────────────────────────────────────────
test('B64: a challenge belongs to the set the link started, not to the next one', () => {
  assert.match(START_EXAM, /setChallengeSender\(null\);/);
  assert.match(block(APP, 'const replayQuestions = useCallback', 3200), /setChallengeSender\(null\);/);
});

// ── B67 ───────────────────────────────────────────────────────────────
test('B67: P pins the question on screen; keys nothing listens for are gone from the handler and the sheet', () => {
  assert.deepEqual(questionPinPayload({ subject: 'zoonoses', id: 7, q: 'x'.repeat(100) }), {
    type: 'question', payload: { subject: 'zoonoses', id: 7, stem: 'x'.repeat(80) }, label: 'x'.repeat(60),
  });
  for (const dead of ['vmx-q-pin-toggle', 'vmx-q-flag-toggle', 'vmx-review-next', 'vmx-review-prev']) {
    assert.ok(!APP.includes(`'${dead}'`), `${dead} has no listener anywhere, so the key does nothing`);
  }
  assert.match(APP, /questionPinPayload\(q\)/, 'P toggles the pin through the pinboard itself');
  assert.doesNotMatch(APP, /view === 'review' && \(k === 'b' \|\| k === 'B'\)/, 'B in review toggled whichever question was on screen at submit');
  assert.ok(!SHEET.includes("label: 'ทำเครื่องหมาย (flag)'"), 'the sheet advertises a flag key that does nothing');
});

// ── B68 ───────────────────────────────────────────────────────────────
test("B68: Home's due count and the SR session count the same pool", () => {
  const bank = [{ id: 1, type: 'mcq', q: 'ยาใด', options: ['a', 'b'] }, { id: 2, type: 'match' }];
  const mine = [{ id: 900001, type: 'flashcard' }, { id: 950001, type: 'cloze' }, { id: 990001, type: 'image-occlusion' }];
  const pool = srPoolQuestions(bank, [], mine, isFlashcardCompatible);
  assert.deepEqual(pool.map((q) => q.id), [1, 900001, 950001, 990001], 'the student\'s own cards are in the pool, a match question is not');
  // Main (5.132.0) moved the Home due count into HomeView; the guard follows it there.
  const HOME = read('src/views/HomeView.jsx');
  const stats = block(HOME, 'const cardStats = useMemo', 900);
  assert.match(stats, /loadUserFlashcards\(\), \.\.\.loadOcclusionCards\(\)/, 'the student\'s own cards are in Home\'s pool');
  assert.match(stats, /srCardFor\(srCards, q\) \|\| initCard\(q\.id\)/,
    'a renumbered card keeps its history under its old id; the session reads it through srCardFor, so Home must too');
});

test('B68: the record Home reads for a renumbered card is the one the session reads', async () => {
  const { srCardFor } = await import('../../src/lib/user-flashcards.js');
  const srCards = { 41: { nextReview: 0, totalReviews: 3, repetitions: 2, interval: 6 } };
  const renumbered = { id: 900041, type: 'flashcard', legacyId: 41 };
  assert.equal(srCards[renumbered.id], undefined, 'a lookup by the new id alone finds nothing, and the card read as new');
  assert.equal(srCardFor(srCards, renumbered)?.totalReviews, 3);
});

// ── B42 ───────────────────────────────────────────────────────────────
test('B42: on a phone the exam header parts never overlap', () => {
  const phone = CSS.slice(CSS.indexOf('.vmx-exam-top { gap: 8px; }') - 3000, CSS.indexOf('.vmx-exam-top { gap: 8px; }') + 900);
  assert.match(phone, /\.vmx-exam-top-right \{ gap: 6px; flex-wrap: wrap; justify-content: flex-end; row-gap: 4px; \}/,
    'the clock and live score wrap inside their track instead of spilling into the middle');
  assert.match(CSS, /@media \(max-width: 379px\) \{\s*\n\s*\.vmx-exam-type-chip \{ display: none; \}/,
    'below 380 px the SHORT/WRITING chip leaves; the card\'s own badge already says ตอบสั้น/เขียนบรรยาย');
  assert.match(CSS, /\.vmx-exam-type-chip \{ display: inline-flex; \}/);
  assert.match(EXAM, /className="vmx-exam-type-chip"/);
  assert.doesNotMatch(EXAM.slice(EXAM.indexOf('vmx-exam-type-chip') - 200, EXAM.indexOf('vmx-exam-type-chip') + 700), /display: 'inline-flex'/,
    'an inline display would beat the media rule that hides the chip');
  // The geometry the finding measured: JetBrains Mono advances 0.6 em.
  const mono = (n, px, track = 0) => n * (0.6 * px + track);
  const timer = mono(5, 16) + 2 * 14 + 2;
  const score = mono('✓ 10/12'.length, 13);
  const progress = mono(2, 16) + mono(' / 50'.length, 13);
  const chip = 8 + 12 + 4 + mono('WRITING'.length, 11, 0.66) + 8 + 8;
  for (const vw of [320, 340, 360, 375, 390]) {
    const content = vw - 32;
    const middle = progress + (vw <= 379 ? 0 : chip);
    const track = (content - 2 * 8 - middle) / 2;
    // Wrapping puts clock and score on separate lines, so each must fit alone.
    assert.ok(Math.max(timer, score) <= track, `${vw}px: the right track is ${track.toFixed(1)}px`);
  }
});
