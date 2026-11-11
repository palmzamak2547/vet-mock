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

// A 2x2 that reads the passage's table: one cell over its column's total (the reading the table does not draw).
const SE = fence('twobytwo', ['cols: เพาะเชื้อบวก | เพาะเชื้อลบ', 'row: ELISA บวก | 102 | 40', 'row: ELISA ลบ | 38 | 224', 'sum: รวม | 140 | 264', 'calc: Sensitivity = 102/140 = 0.73']);
const Q = (over = {}) => ({
  subject: 'epidemiology', id: 1, type: 'mcq',
  passage: 'ELISA ในโค 404 ตัว\n\n| | เพาะเชื้อบวก | เพาะเชื้อลบ |\n|---|---|---|\n| ELISA บวก | 102 | 40 |\n| ELISA ลบ | 38 | 224 |\n| รวม | 140 | 264 |',
  q: 'sensitivity ของ ELISA คำนวณจากข้อใด', options: ['102/142', '102/140'], answer: 1,
  explain: '**Sensitivity** คือ ...\n' + SE, explainSay: 'Sensitivity คือสัดส่วนที่ให้ผลบวก 102/140 = 0.73',
  ...over,
});
const problems = (over) => lintQuestionFigures([Q(over)]).problems;
const caught = (over, what) => assert.ok(problems(over).some((p) => p.includes(what)), JSON.stringify(problems(over)));

test('lint: a figure that says only what the question holds passes', () => {
  assert.deepEqual(problems({}), []);
});

test('lint: an explanation with a figure keeps its paragraph for the voice', () => {
  caught({ explainSay: undefined }, 'explainSay');
});

test('lint: a number, a label or a sum the question does not hold fails', () => {
  caught({ explain: SE.replace('= 0.73', '= 0.74') }, 'does not give 0.74');
  caught({ explain: SE.replace('cols: เพาะเชื้อบวก', 'cols: ติดเชื้อ') }, '"ติดเชื้อ"');
  caught({ explain: SE.replace('| 38 | 224', '| 38 | 225') }, '225');
});

test('lint: a 2x2 keeps the passage\'s cells under the passage\'s headers, and its totals add up', () => {
  caught({ explain: SE.replace('row: ELISA บวก | 102 | 40', 'row: ELISA บวก | 40 | 102') }, 'not the sum of its cells');
  caught({ explain: SE.replace('cols: เพาะเชื้อบวก | เพาะเชื้อลบ', 'cols: เพาะเชื้อลบ | เพาะเชื้อบวก') }, 'the passage\'s table has');
  // Redrawing the table with a cross product only adds nothing a reader cannot see in the table.
  caught({ explain: SE.replace('calc: Sensitivity = 102/140 = 0.73', 'calc: OR = (102 x 224)/(40 x 38) = 15.03') }, 'adds no reading');
});

test('lint: the accent goes on what answers, once, and never in a passage', () => {
  const q = { subject: 's', id: 2, type: 'mcq', q: 'ขนาดตัวอย่างที่ระดับความเชื่อมั่น 95%', options: ['270', '384', '663'], answer: 1, explainSay: 'ระดับความเชื่อมั่น 90% ได้ 270 และ 95% ได้ 384 ส่วน 99% ได้ 663' };
  const bars = (a, b, c = '') => fence('bars', ['head: ระดับความเชื่อมั่น', `bar: 90% | 270${a}`, `bar: 95% | 384${b}`, `bar: 99% | 663${c}`]);
  assert.deepEqual(lintQuestionFigures([{ ...q, explain: bars('', ' | key') }]).problems, []);
  assert.ok(lintQuestionFigures([{ ...q, explain: bars('', '', ' | key') }]).problems.some((p) => p.includes('a wrong option')));
  assert.ok(lintQuestionFigures([{ ...q, explain: bars(' | key', ' | key') }]).problems.some((p) => p.includes('one accent')));
  assert.ok(lintQuestionFigures([{ ...q, explain: bars('', '') }]).problems.some((p) => p.includes('flags the mark')));
  // Hostile: a passage figure that would show the answer before the student answers.
  assert.ok(lintQuestionFigures([{ ...q, passage: 'ขนาดตัวอย่าง\n' + bars('', ' | key'), explain: 'x' }]).problems.some((p) => p.includes('flags no mark')));
});

test('lint: pairings the text does not make fail (a step under another number, an estimate off its interval)', () => {
  const q = { subject: 's', id: 3, type: 'mcq', q: 'ในขั้นตอนที่ 7 ประเมินสมมติฐาน ใช้วิธีใด', options: ['ค่าฐาน', 'ระบาดวิทยาเชิงวิเคราะห์'], answer: 1, explainSay: 'การเทียบกับค่าฐานอยู่ในขั้นตอนที่ 2 และต้องใช้ระบาดวิทยาเชิงวิเคราะห์' };
  const flow = (a, b) => fence('flow', [`step: ${a} | เทียบกับค่าฐาน`, `step: ${b} | ประเมินสมมติฐาน | ระบาดวิทยาเชิงวิเคราะห์ | key`]);
  assert.deepEqual(lintQuestionFigures([{ ...q, explain: flow(2, 7) }]).problems, []);
  assert.ok(lintQuestionFigures([{ ...q, explain: flow(3, 7) }]).problems.some((p) => p.includes('as step 3')));
  const iv = { subject: 's', id: 4, type: 'mcq', q: 'ได้ OR = 2.19, CI = 0.51-9.43 ข้อใดถูก', say: 'E- D- = 3, OR = 2.19, CI = 0.51-9.43 ข้อใดถูก', options: ['a', 'b'], answer: 0, explainSay: 'ช่วงความเชื่อมั่น 0.51-9.43 ครอบค่า 1' };
  const interval = (est) => fence('interval', ['null: 1', `row: OR | ${est} | 0.51 | 9.43`, 'note: ครอบค่า 1']);
  assert.deepEqual(lintQuestionFigures([{ ...iv, explain: interval('2.19') }]).problems, []);
  assert.ok(lintQuestionFigures([{ ...iv, explain: interval('3') }]).problems.length > 0);
});

test('parser: a repeated key, a ratio bound at or below 0, an unchecked note are refused', () => {
  assert.ok(parseFigure('twobytwo', 'cols: a | b\ncols: c | d').errors.some((e) => e.includes('twice')));
  assert.ok(parseFigure('interval', 'null: 1\nrow: OR | 2 | 0 | 5').errors.some((e) => e.includes('above 0')));
  assert.ok(parseFigure('interval', 'null: 1\nrow: OR | 9 | 1 | 5').errors.some((e) => e.includes('outside')));
  assert.ok(parseFigure('bars', 'bar: a | x').errors.some((e) => e.includes('not a number')));
  const iv = { subject: 's', id: 5, type: 'mcq', q: 'OR = 2.19, CI = 1.5-9.43 ข้อใดถูก', options: ['a'], answer: 0, explainSay: 'OR = 2.19, CI = 1.5-9.43 ครอบค่า 1' };
  const p = lintQuestionFigures([{ ...iv, explain: fence('interval', ['null: 1', 'row: OR | 2.19 | 1.5 | 9.43', 'note: ครอบค่า 1']) }]).problems;
  assert.ok(p.some((x) => x.includes('no interval crosses')), JSON.stringify(p));
});

test('the bank: no passage figure flags an answer, and a passage figure reaches the card with none flagged', async () => {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  for (const q of questions) {
    if (typeof q.passage !== 'string' || !q.passage.includes('```figure')) continue;
    for (const b of splitBlocks(q.passage).filter((x) => x.type === 'figure')) assert.ok(!JSON.stringify(b.fig).includes('"key":true'), q.id);
  }
  const shown = highlightParts('ข้อมูล\n' + fence('bars', ['bar: a | 1 | key']))[1].fig;
  assert.equal(shown.bars[0].key, false);
});

test('the bank: every figure parses and passes', async () => {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  const { problems, figures } = lintQuestionFigures(questions);
  assert.deepEqual(problems, []);
  assert.ok(figures >= 4);
});
