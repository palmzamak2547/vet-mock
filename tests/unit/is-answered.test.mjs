// ============================================================
// "Answered" means answered, not "a value is present"
// ============================================================
// Clearing an answer leaves the key in place: emptying an essay stores '',
// and MatchDragDrop's ล้างทั้งหมด stores {}. ExamView counted with
// `answers[q.id] !== undefined`, which both pass, so the submit dialog
// reported cleared questions as answered — and since it derived "remaining"
// from that same count, it suppressed its own "you left N blank" warning at
// the moment it mattered most.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { isAnswered } from '../../src/hooks/utils.js';
import * as utils from '../../src/hooks/utils.js';

test('a cleared answer is not an answer', () => {
  assert.equal(isAnswered(''), false, 'an emptied essay counted as answered');
  assert.equal(isAnswered('   '), false, 'whitespace counted as answered');
  assert.equal(isAnswered({}), false, 'a cleared match question counted as answered');
  assert.equal(isAnswered(undefined), false);
  assert.equal(isAnswered(null), false);
});

test('a real answer counts, including the falsy ones', () => {
  // Option A is index 0 and False is `false`; a truthiness check would drop
  // both, which is the mirror-image bug of the one being fixed.
  assert.equal(isAnswered(0), true, 'choosing the first option was discarded');
  assert.equal(isAnswered(false), true, 'answering False was discarded');
  assert.equal(isAnswered(3), true);
  assert.equal(isAnswered(true), true);
  assert.equal(isAnswered('ตอบ'), true);
  assert.equal(isAnswered({ a: 'b' }), true);
});

test('ExamView asks the shared question everywhere', () => {
  const SRC = readFileSync(new URL('../../src/views/ExamView.jsx', import.meta.url), 'utf8');
  assert.ok(
    !SRC.includes('answers[q.id] !== undefined'),
    'a raw presence check is back in ExamView — it will count cleared answers again',
  );
  assert.ok(SRC.includes('isAnswered(answers[q.id])'), 'ExamView no longer uses the shared predicate');
});

test('the submit dialog and its warning are counted the same way', () => {
  // The bug was not just a wrong number: "remaining" is derived from
  // "answered", so one bad predicate silenced the warning too.
  const SRC = readFileSync(new URL('../../src/views/ExamView.jsx', import.meta.url), 'utf8');
  const dialog = SRC.slice(SRC.indexOf('vmx-submit-title') - 700, SRC.indexOf('vmx-submit-title') + 900);
  assert.ok(dialog.includes('isAnswered(answers[q.id])'), 'the submit dialog counts with a different rule');
  assert.ok(dialog.includes('questions.length - answered'), 'remaining is no longer derived from answered');
});

test('a cleared fill-in-the-blank is not an answer either', () => {
  // Fill stores one string per blank; typing into a blank and deleting it
  // leaves [''] behind. Arrays are objects, so the pair-map rule above
  // counted that as answered — the one shape this function did not cover.
  assert.equal(isAnswered(['']), false, 'an emptied blank counted as answered');
  assert.equal(isAnswered(['', '']), false, 'two emptied blanks counted as answered');
  assert.equal(isAnswered(['   ']), false, 'whitespace in a blank counted as answered');
  assert.equal(isAnswered(['gauze']), true);
  assert.equal(isAnswered(['', 'padding']), true, 'one filled blank is an answer in progress');
});

// ── Results and Review, after the submit dialog ──────────────────────
// The submit dialog called an erased answer unanswered, and then Results and
// Review called it wrong: both still tested `!== undefined`, so a cleared
// blank, a cleared matching set or an emptied essay sat under ผิด, joined the
// redo-wrong set and was missing from ข้าม. The score never changed (a blank
// is not correct either way); every count around it did.
//
// These run each screen's own counting code, lifted out of the view.

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const REVIEW = read('src/views/ReviewView.jsx');
const RESULTS = read('src/views/ResultsView.jsx');

const pairs = [{ left: 'L1', right: 'R1' }, { left: 'L2', right: 'R2' }];
const FIXTURE = [
  // Cleared: typed, then erased.
  { q: { id: 1, type: 'fill', blanks: ['gauze'] }, ua: [''], is: 'skipped' },
  { q: { id: 2, type: 'match', pairs }, ua: {}, is: 'skipped' },
  { q: { id: 3, type: 'essay' }, ua: '   ', is: 'skipped' },
  // Never touched.
  { q: { id: 4, type: 'mcq', options: ['a', 'b'], answer: 1 }, ua: undefined, is: 'skipped' },
  // Real answers, including the falsy ones.
  { q: { id: 5, type: 'mcq', options: ['a', 'b'], answer: 1 }, ua: 0, is: 'wrong' },
  { q: { id: 6, type: 'tf', answer: false }, ua: false, is: 'correct' },
  // Attempts in progress stay attempts.
  { q: { id: 7, type: 'match', pairs }, ua: { 0: 'R1' }, is: 'wrong' },
  { q: { id: 8, type: 'fill', blanks: ['gauze', 'pad'] }, ua: ['', 'pad'], is: 'wrong' },
];
const questions = FIXTURE.map((f) => f.q);
const answers = Object.fromEntries(FIXTURE.filter((f) => f.ua !== undefined).map((f) => [f.q.id, f.ua]));
const idsWhere = (is) => FIXTURE.filter((f) => f.is === is).map((f) => f.q.id);

// The body of `const <name> = useMemo(() => { ... }, [` in a view.
function memoBody(src, name) {
  const m = src.match(new RegExp(`const ${name} = useMemo\\(\\(\\) => \\{([\\s\\S]*?)\\n {2}\\}, \\[`));
  assert.ok(m, `the view no longer memoises ${name}`);
  return m[1];
}
const run = (body, scope) => vm.runInContext(`(() => {${body}\n})()`, vm.createContext({ ...utils, ...scope }));

test('Review counts an erased answer as skipped, like the submit dialog did', () => {
  const counts = run(memoBody(REVIEW, 'counts'), { questions, answers, bookmarks: [], notes: {} });
  assert.deepEqual(
    { skipped: counts.skipped, correct: counts.correct, wrong: counts.wrong },
    { skipped: 4, correct: 1, wrong: 3 },
    'a cleared blank, matching set or essay is counted under ผิด',
  );
  assert.equal(counts.skipped + counts.correct + counts.wrong, questions.length);
});

test("Review's ข้าม filter shows the erased answers, and ผิด does not", () => {
  const body = memoBody(REVIEW, 'filtered');
  const shown = (filter) => run(body, { questions, answers, bookmarks: [], notes: {}, filter }).map((q) => q.id);
  assert.deepEqual(shown('skipped'), idsWhere('skipped'));
  assert.deepEqual(shown('wrong'), idsWhere('wrong'));
  assert.deepEqual(shown('correct'), idsWhere('correct'));
});

test('Results: skipped, wrong and correct add up to the auto-marked questions', () => {
  const m = RESULTS.match(/\n {2}const wrongCount = ([^\n]+);\n {2}const skipCount = ([^\n]+);\n/);
  assert.ok(m, 'ResultsView no longer derives wrongCount and skipCount side by side');
  const autoQs = questions.filter((q) => !utils.isWritingType(q));
  const scope = vm.createContext({ ...utils, autoQs, answers });
  const wrongCount = vm.runInContext(m[1], scope);
  const skipCount = vm.runInContext(m[2], scope);
  const correct = autoQs.filter((q) => utils.isCorrect(q, answers[q.id])).length;
  assert.equal(skipCount, 3, 'the cleared blank and the cleared matching set are missing from ข้าม');
  assert.equal(wrongCount, 3);
  assert.equal(skipCount + wrongCount + correct, autoQs.length);
});

test('Results and Review hold the same no-raw-presence-check rule as ExamView', () => {
  // The redo-wrong set, the weak-spot list and the topic pattern on Results,
  // and the row badge on Review, are all built from this same question.
  const raw = /\b(?:answers\[q\.id\]|ua|userAns)\s*[!=]==\s*undefined/g;
  for (const [name, src] of [['ReviewView', REVIEW], ['ResultsView', RESULTS]]) {
    const hits = src.match(raw) || [];
    assert.deepEqual(hits, [], `${name} still asks whether an answer merely exists`);
  }
  assert.ok(REVIEW.includes('const answered = isAnswered(userAns);'), 'the Review row decides answered its own way');
});

// ── A number in a short answer is a number, not a run of digits (OV-exam-4) ──
// The short-answer auto-grade counted a keyword as mentioned when its text
// appeared anywhere, so a keyword '5' was found inside '15' or '54', and
// '5 วัน' inside '15 วัน'. SmartGrader's checklist had the opposite slip: its
// word-boundary variants for Latin and numbers were dropped when shorter than
// four characters, so a one-digit keyword was never found at all. Both now
// ask one shared question, keywordHit.

const shortQ = (keywords) => ({ id: 'kw', type: 'short', keywords });

test('a number keyword is not found inside a longer number', () => {
  assert.equal(utils.isCorrect(shortQ(['5']), 'ให้ยา 15 วัน'), false, "'5' was found inside '15'");
  assert.equal(utils.isCorrect(shortQ(['5']), 'ได้ 54 ตัว'), false, "'5' was found inside '54'");
  assert.equal(utils.isCorrect(shortQ(['5']), 'ราคา 1,500 บาท'), false, "'5' was found inside '1,500'");
  assert.equal(utils.isCorrect(shortQ(['5']), 'ขนาด 2.5 มก.'), false, "'5' was found inside '2.5'");
  assert.equal(utils.isCorrect(shortQ(['5']), 'ให้ยา 5 วัน'), true);
  assert.equal(utils.isCorrect(shortQ(['5']), '5'), true, "'5' alone is the keyword");
  assert.equal(utils.isCorrect(shortQ(['5']), 'ให้ 5mg'), true, 'a unit written against the number still counts');
});

test('a Thai keyword with a number in it keeps the number whole', () => {
  assert.equal(utils.isCorrect(shortQ(['5 วัน']), 'รักษา 15 วัน'), false, "'5 วัน' was found inside '15 วัน'");
  assert.equal(utils.isCorrect(shortQ(['5 วัน']), 'รักษา 5 วัน'), true);
  assert.equal(utils.isCorrect(shortQ(['5 วัน']), 'รักษาต่อเนื่อง5 วัน'), true, 'Thai runs words together; no space is needed before the number');
});

test('Thai keywords still match inside running Thai text', () => {
  assert.equal(utils.isCorrect(shortQ(['สื่อสาร']), 'สัตวแพทย์สื่อสารความเสี่ยง'), true);
  assert.equal(utils.isCorrect(shortQ(['ไข้หวัดนก']), 'โรคไข้หวัดนกในสัตว์ปีก'), true);
});

test('a Latin keyword starts a word, and may be a stem of it', () => {
  assert.equal(utils.isCorrect(shortQ(['cat']), 'a concatenated string'), false, "'cat' was found inside 'concatenated'");
  assert.equal(utils.isCorrect(shortQ(['men']), 'only women answered'), false, "'men' was found inside 'women'");
  assert.equal(utils.isCorrect(shortQ(['cat']), 'Cats shed'), true);
  assert.equal(utils.isCorrect(shortQ(['virus']), 'two viruses'), true);
  assert.equal(utils.isCorrect(shortQ(['cells']), 'one cell'), true);
  assert.equal(utils.isCorrect(shortQ(['T-cell']), 'T cell response'), true, 'punctuation reads as a space on both sides');
  assert.equal(utils.isCorrect(shortQ(['serotype 2']), 'serotype 22'), false);
  assert.equal(utils.isCorrect(shortQ(['serotype 2']), 'Serotype 2.'), true);
  // The bank writes stems, and its own model answers rely on them.
  assert.equal(utils.isCorrect(shortQ(['Strept']), 'เกิดจาก Streptococcus agalactiae'), true);
  assert.equal(utils.isCorrect(shortQ(['apx']), 'ใช้ ApxIV ELISA'), true);
  assert.equal(utils.isCorrect(shortQ(['herpes']), 'koi herpesvirus disease'), true);
});

test('the bank\'s own numeric keywords: one digit is found, and only as itself', () => {
  // questions-engprof.js has a keyword list ['460', '207', '5', '30', ...];
  // two of its keywords are enough to show a whole grade turning on '5'.
  const q = shortQ(['460', '5']);
  assert.equal(utils.isCorrect(q, '460 15'), false, "'5' counted from '15'");
  assert.equal(utils.isCorrect(q, '460 5'), true);
});

test("SmartGrader's checklist finds a one-digit keyword, and only as itself", async () => {
  const { loadModule } = await import('../helpers/fake-react.mjs');
  const { keywordCoverage } = await loadModule('src/components/SmartGrader.jsx', {
    stubs: [{ match: 'AiGradePanel\.jsx$', contents: 'export default function AiGradePanel() { return null; }' }],
  });
  assert.deepEqual(keywordCoverage('ให้ยา 5 วัน', ['5']).found, ['5'], 'a one-digit keyword was never found');
  assert.deepEqual(keywordCoverage('ให้ยา 15 วัน', ['5']).found, [], "'5' was found inside '15'");
  assert.deepEqual(keywordCoverage('รักษา 15 วัน', ['5 วัน']).found, [], "'5 วัน' was found inside '15 วัน'");
  assert.deepEqual(keywordCoverage('รักษา 5 วัน', ['5 วัน']).found, ['5 วัน']);
  // What it already did right stays right.
  assert.deepEqual(keywordCoverage('two viruses, one cell', ['virus', 'cells']).found, ['virus', 'cells']);
  assert.deepEqual(keywordCoverage('สัตวแพทย์สื่อสารความเสี่ยง', ['สื่อสาร']).found, ['สื่อสาร']);
  assert.deepEqual(keywordCoverage('a concatenated string', ['cat']).found, []);
  assert.equal(keywordCoverage('anything', ['', '  ']).found.length + keywordCoverage('anything', ['', '  ']).missing.length, 0, 'a blank keyword is neither found nor missing');
});

test('the auto-grade and the checklist ask the same question', () => {
  const SG = read('src/components/SmartGrader.jsx');
  assert.match(SG, /import \{[^}]*\bkeywordHit\b[^}]*\} from '\.\.\/hooks\/utils\.js'/, 'SmartGrader matches keywords its own way');
  assert.match(read('src/hooks/utils.js'), /keys\.filter\(\(k\) => keywordHit\(/, 'the short-answer grade matches keywords its own way');
});
