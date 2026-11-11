// A figure inside an explanation (src/lib/figure-spec.js): how a block parses,
// that it never reaches the voice, that the height held for it is decided
// before the drawing arrives, and that lint:question-figures holds every
// number, label and claim in it to the question.
import test from 'node:test';
import assert from 'node:assert/strict';
import { splitBlocks, tablesToSpeech, wholeExplain, hasFigure, highlightParts } from '../../src/lib/rich-blocks.js';
import { parseFigure, figureHeight, FIGURE_KINDS } from '../../src/lib/figure-spec.js';
import { lintQuestionFigures, evaluate } from '../../scripts/lint-question-figures.mjs';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

const fence = (kind, lines) => ['```figure ' + kind, ...lines, '```'].join('\n');
const OR = fence('twobytwo', ['cols: มดลูกอักเสบ | ปกติ', 'row: ฉีดยาคุมกำเนิด | 10 | 6', 'row: ไม่ฉีดยาคุมกำเนิด | 5 | 12', 'calc: OR = (10 x 12)/(6 x 5) = 120/30 = 4']);
const TEXT = `**หลัก** case-control\n${OR}\n**แปลผล** ค่า 4`;

test('a figure fence is its own block, with the prose around it and its offsets', () => {
  const blocks = splitBlocks(TEXT);
  assert.deepEqual(blocks.map((b) => b.type), ['text', 'figure', 'text']);
  assert.equal(blocks[0].text, '**หลัก** case-control');
  assert.equal(TEXT.slice(blocks[1].start, blocks[1].end), OR);
  assert.equal(blocks[2].text, '**แปลผล** ค่า 4');
  assert.ok(hasFigure(TEXT));
  assert.ok(!hasFigure('no figure ``` here'));
});

test('an unclosed fence stays prose, and a text without one is unchanged', () => {
  const open = 'a\n```figure bars\nbar: x | 1';
  assert.deepEqual(splitBlocks(open), [{ type: 'text', text: open, start: 0, end: open.length }]);
  assert.equal(splitBlocks('plain text')[0].text, 'plain text');
});

test('the 2x2 parses its cells, margins and calc, with the middle steps kept', () => {
  const fig = splitBlocks(TEXT)[1].fig;
  assert.deepEqual(fig.errors, []);
  assert.deepEqual(fig.cols, ['มดลูกอักเสบ', 'ปกติ']);
  assert.deepEqual(fig.rows[1], { label: 'ไม่ฉีดยาคุมกำเนิด', cells: ['5', '12'] });
  assert.deepEqual(fig.calcs[0], { label: 'OR', expr: '(10 x 12)/(6 x 5)', num: '10 x 12', den: '6 x 5', mid: ['120/30'], result: '4', key: false });
});

test('every kind parses its own keys; a line it does not read is an error', () => {
  const iv = parseFigure('interval', 'null: 1\nrow: OR | 2.19 | 0.51 | 9.43\nnote: ครอบค่า 1');
  assert.deepEqual([iv.nil, iv.rows[0].est, iv.rows[0].lo, iv.rows[0].hi, iv.note], [1, 2.19, 0.51, 9.43, 'ครอบค่า 1']);
  const bars = parseFigure('bars', 'head: a | b\nbar: 90% | 270\nbar: 95% | 384 | key');
  assert.deepEqual(bars.bars.map((b) => [b.value, b.key]), [[270, false], [384, true]]);
  const tl = parseFigure('timeline', 'unit: ชม.\nstart: คลอด\nat: 2 | ลูกกินนมได้ | key\nspan: 6 - 12 | ดูดซึม');
  assert.deepEqual(tl.events.map((e) => [e.at, e.to ?? null, e.key]), [[2, null, true], [6, 12, false]]);
  const flow = parseFigure('flow', 'lane: แบบอนุกรม | key\nstep: ชุดแรก\nstep: 7 | ประเมินสมมติฐาน | case-control | key');
  assert.deepEqual(flow.lanes[0].steps[1], { no: '7', label: 'ประเมินสมมติฐาน', detail: 'case-control', key: true });
  const sc = parseFigure('scale', 'band: | 0.40 | Fair\nband: 0.40 | 0.59 | moderate | key\nvalue: kappa = 0.460');
  assert.deepEqual([sc.bands[0].lo, sc.bands[0].hi, sc.bands[1].key, sc.value.value], [null, 0.4, true, 0.46]);
  assert.equal(parseFigure('bars', 'colour: red').errors.length, 1);
  assert.equal(parseFigure('pie', 'x: 1').errors.length, 1);
  assert.deepEqual(Object.keys(FIGURE_KINDS), ['twobytwo', 'interval', 'bars', 'timeline', 'flow', 'scale']);
});

test('the height held for a figure comes from its content alone, and grows with it', () => {
  const two = figureHeight(parseFigure('bars', 'bar: a | 1\nbar: b | 2'));
  const four = figureHeight(parseFigure('bars', 'bar: a | 1\nbar: b | 2\nbar: c | 3\nbar: d | 4'));
  assert.ok(two > 0 && four > two);
  for (const kind of Object.keys(FIGURE_KINDS)) assert.ok(figureHeight(parseFigure(kind, '')) > 0, kind);
});

test('the voice never meets a figure, and a highlight never lands in one', () => {
  assert.ok(!tablesToSpeech(TEXT).includes('figure'));
  assert.ok(!tablesToSpeech(TEXT).includes('calc:'));
  assert.equal(wholeExplain({ explain: TEXT, explainSay: 'ย่อหน้าเดิม' }), 'ย่อหน้าเดิม');
  const parts = highlightParts(TEXT, [{ id: 1, start: 0, end: TEXT.length }]);
  assert.equal(parts[1].type, 'figure');
  assert.equal(parts[1].segs, undefined);
});

test('the arithmetic a calc claims is checked to its own decimals', () => {
  assert.equal(evaluate('(10 x 12)/(6 x 5)'), 4);
  assert.equal(evaluate('(0.39 - 0.04)/0.39').toFixed(2), '0.90');
  assert.equal(evaluate('1,200 / 2'), 600);
  assert.equal(evaluate('abc'), null);
});

const Q = (over = {}) => ({
  subject: 'epidemiology', id: 1, type: 'mcq',
  passage: 'สุนัข 33 ตัว\n\n| | มดลูกอักเสบ | ปกติ |\n|---|---|---|\n| ฉีดยาคุมกำเนิด | 10 | 6 |\n| ไม่ฉีดยาคุมกำเนิด | 5 | 12 |',
  q: 'ค่า odds ratio (OR) แปลว่าอย่างไร', options: ['น้อยกว่า', 'มากกว่า'], answer: 1,
  explain: TEXT, explainSay: 'OR = (10 x 12)/(6 x 5) = 120/30 = 4 ค่า 4',
  ...over,
});

test('lint: a figure that says only what the question holds passes', () => {
  assert.deepEqual(lintQuestionFigures([Q()]).problems, []);
});

test('lint: an explanation with a figure keeps its paragraph for the voice', () => {
  const { problems } = lintQuestionFigures([Q({ explainSay: undefined })]);
  assert.ok(problems.some((p) => p.includes('explainSay')));
});

test('lint: a number, a label or a sum the question does not hold fails', () => {
  const wrongSum = TEXT.replace('= 120/30 = 4', '= 120/30 = 5');
  assert.ok(lintQuestionFigures([Q({ explain: wrongSum })]).problems.some((p) => p.includes('does not give 5')));
  const newLabel = TEXT.replace('cols: มดลูกอักเสบ', 'cols: ติดเชื้อ');
  assert.ok(lintQuestionFigures([Q({ explain: newLabel })]).problems.some((p) => p.includes('"ติดเชื้อ"')));
  const newNumber = TEXT.replace('| 5 | 12', '| 5 | 13');
  assert.ok(lintQuestionFigures([Q({ explain: newNumber })]).problems.some((p) => p.includes('13')));
});

test('lint: the accent goes on what answers, once', () => {
  const q = { subject: 's', id: 2, type: 'mcq', q: 'ขนาดตัวอย่างที่ระดับความเชื่อมั่น 95%', options: ['270', '384'], answer: 1, explainSay: 'ระดับความเชื่อมั่น 90% 270 95% 384' };
  const bars = (a, b) => fence('bars', ['head: ระดับความเชื่อมั่น', `bar: 90% | 270${a}`, `bar: 95% | 384${b}`]);
  assert.deepEqual(lintQuestionFigures([{ ...q, explain: bars('', ' | key') }]).problems, []);
  assert.ok(lintQuestionFigures([{ ...q, explain: bars(' | key', '') }]).problems.some((p) => p.includes('neither the correct option')));
  assert.ok(lintQuestionFigures([{ ...q, explain: bars(' | key', ' | key') }]).problems.some((p) => p.includes('one accent')));
});

test('lint: no figure in a stem or an option, none restating its own table, none past the glance limit', () => {
  assert.ok(lintQuestionFigures([Q({ q: `x\n${OR}` })]).problems.some((p) => p.includes(' q: ')));
  const both = `| ระดับ | n |\n|---|---|\n| 90% | 270 |\n| 95% | 384 |\n${fence('bars', ['bar: 90% | 270', 'bar: 95% | 384'])}`;
  const q = { subject: 's', id: 3, type: 'mcq', q: 'n', options: ['384'], answer: 0, explain: both, explainSay: '90% 270 95% 384' };
  assert.ok(lintQuestionFigures([q]).problems.some((p) => p.includes('restates the table')));
  const many = fence('bars', Array.from({ length: 9 }, (_, i) => `bar: 9${i} | ${i}`));
  assert.ok(lintQuestionFigures([{ ...q, explain: many }]).problems.some((p) => p.includes('at a glance')));
});

test('the bank: every figure parses and passes', async () => {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  const { problems, figures } = lintQuestionFigures(questions);
  assert.deepEqual(problems, []);
  assert.ok(figures >= 8);
});
