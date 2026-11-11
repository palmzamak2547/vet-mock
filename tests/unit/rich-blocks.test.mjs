// A table inside a passage or an explanation (src/lib/rich-blocks.js): what
// parses, what stays prose, where the offsets fall, how it is read aloud, and
// that nothing written before tables existed changes by a character.
import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightParts, isTableRow, splitBlocks, wholeExplain, wholeStem, tableCells, tablesToSpeech } from '../../src/lib/rich-blocks.js';
import { clipText } from '../../src/lib/tts-text.js';
import { lintQuestionTables } from '../../scripts/lint-question-tables.mjs';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

// The explanations that carry a figure (docs/releases/pending/visual-explanations.md). A new one is added here.
const FIGURES = ['epidemiology:214560', 'epidemiology:214561', 'epidemiology:214650', 'equine-repro:105571'];
const TABLE = '| | เพาะเชื้อบวก | เพาะเชื้อลบ |\n|---|---|---|\n| ELISA บวก | 102 | 40 |\n| ELISA ลบ | 38 | 224 |';
const BEFORE = 'ประเมิน ELISA ในโค 404 ตัว';
const AFTER = 'fecal culture เป็น gold standard';
const TEXT = `${BEFORE}\n\n${TABLE}\n\n${AFTER}`;

test('a text with no table is one block holding the same string', () => {
  for (const text of ['', 'plain', 'a | b', 'P(D+|T+) --- x', '| not a table |', 'line\n| a | b |\nline', '---\n| a |']) {
    assert.deepEqual(splitBlocks(text), [{ type: 'text', text, start: 0, end: text.length }]);
  }
  assert.deepEqual(splitBlocks(null), [{ type: 'text', text: '', start: 0, end: 0 }]);
});

test('a table between two runs of prose: three blocks whose offsets slice the source', () => {
  const blocks = splitBlocks(TEXT);
  assert.deepEqual(blocks.map((b) => b.type), ['text', 'table', 'text']);
  assert.equal(blocks[0].text, BEFORE);
  assert.equal(blocks[2].text, AFTER);
  for (const b of blocks) assert.equal(TEXT.slice(b.start, b.end), b.type === 'table' ? TABLE : b.text);
  assert.deepEqual(blocks[1].head, ['', 'เพาะเชื้อบวก', 'เพาะเชื้อลบ']);
  assert.deepEqual(blocks[1].rows, [['ELISA บวก', '102', '40'], ['ELISA ลบ', '38', '224']]);
});

test('a table alone, at the start and at the end of a text', () => {
  assert.deepEqual(splitBlocks(TABLE).map((b) => b.type), ['table']);
  assert.deepEqual(splitBlocks(`${TABLE}\n${AFTER}`).map((b) => b.type), ['table', 'text']);
  assert.deepEqual(splitBlocks(`${BEFORE}\n${TABLE}`).map((b) => b.type), ['text', 'table']);
  assert.deepEqual(splitBlocks(`${TABLE}\n\nกลาง\n\n${TABLE}`).map((b) => b.type), ['table', 'text', 'table']);
});

test('what is not a table stays prose: no rule line, a rule of another width, a header alone', () => {
  for (const text of [
    '| a | b |\n| 1 | 2 |',
    '| a | b |\n|---|\n| 1 | 2 |',
    '| a | b |\n|---|---|',
    '| a | b |\n\n|---|---|\n| 1 | 2 |',
  ]) assert.deepEqual(splitBlocks(text).map((b) => b.type), ['text'], JSON.stringify(text));
});

test('cells: an escaped bar stays inside, a short row is padded, a long one keeps its words', () => {
  assert.deepEqual(tableCells('| P(D+\\|T+) | 0.6 |'), ['P(D+|T+)', '0.6']);
  const [t] = splitBlocks('| a | b | c |\n|---|:---:|---:|\n| 1 |\n| 1 | 2 | 3 | 4 |');
  assert.deepEqual(t.rows, [['1', '', ''], ['1', '2', '3 | 4']]);
  assert.ok(isTableRow('  | a | b |  '));
  assert.ok(!isTableRow('a | b'));
});

test('highlights keep their offsets around a table and never fall inside it', () => {
  const table = TEXT.indexOf(TABLE);
  const hls = [{ id: 1, start: 0, end: 7 }, { id: 2, start: table - 4, end: table + TABLE.length + 6 }];
  const parts = highlightParts(TEXT, hls);
  assert.deepEqual(parts.map((p) => p.type), ['text', 'table', 'text']);
  const said = parts.filter((p) => p.type === 'text').map((p) => p.segs.map((s) => s.text).join(''));
  assert.deepEqual(said, [BEFORE, AFTER], 'every character of the prose is drawn once');
  assert.deepEqual(parts[0].segs.map((s) => [s.text, s.hl?.id ?? 0]), [[BEFORE.slice(0, 7), 1], [BEFORE.slice(7, -2), 0], [BEFORE.slice(-2), 2]]);
  assert.deepEqual(parts[2].segs.map((s) => [s.text, s.hl?.id ?? 0]), [[AFTER.slice(0, 4), 2], [AFTER.slice(4), 0]]);
  // A passage with no table is one run from offset 0, as before tables existed.
  assert.deepEqual(highlightParts('abcdef', [{ id: 9, start: 2, end: 4 }]), [{ type: 'text', text: 'abcdef', start: 0, end: 6, segs: [{ text: 'ab' }, { text: 'cd', hl: { id: 9, start: 2, end: 4 } }, { text: 'ef' }] }]);
  assert.deepEqual(highlightParts('', []), []);
});

test('read aloud: a row at a time, each value after its column name', () => {
  const said = tablesToSpeech(TEXT);
  assert.equal(said, `${BEFORE}\nELISA บวก, เพาะเชื้อบวก: 102, เพาะเชื้อลบ: 40\nELISA ลบ, เพาะเชื้อบวก: 38, เพาะเชื้อลบ: 224\n${AFTER}`);
  assert.equal(tablesToSpeech('| Method | Temp |\n|---|---|\n| Freezer | -20 |\n| LN2 | |'), 'Method: Freezer, Temp: -20\nMethod: LN2');
  // A dash says nothing; a tick and a cross say yes and no, in the language of the text around the table.
  assert.equal(tablesToSpeech('| Organism | Tape | Scrape |\n|---|---|---|\n| Mites | ✓ | × |\n| Yeast | - | ✓ |'),
    'Organism: Mites, Tape: yes, Scrape: no\nOrganism: Yeast, Scrape: yes');
  assert.equal(tablesToSpeech('สรุป\n\n| | พบ |\n|---|---|\n| ไร | ✓ |\n| ยีสต์ | ✗ |'), 'สรุป\nไร, พบ: ใช่\nยีสต์, พบ: ไม่ใช่');
  const clip = clipText(TEXT, 'th');
  assert.ok(!/[|]|---/.test(clip), clip);
});

test('the bank: a text with no table is spoken as it was, and every table is one the card draws', async () => {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  let plain = 0;
  let withTable = 0;
  const figured = [];
  for (const q of questions) {
    for (const text of [q.q, q.explain, q.passage, q.model_answer, ...(Array.isArray(q.options) ? q.options : [])]) {
      if (typeof text !== 'string') continue;
      if (splitBlocks(text).some((b) => b.type === 'table')) {
        withTable++;
        assert.ok(!/[|]|-{3}/.test(clipText(text, 'th')), `${q.subject}:${q.id} still says bars or dashes`);
      }
      // Judged without the parser: a text with no run of three dashes cannot hold a rule line, so it
      // cannot hold a table, and a voice must be handed the very same string. Recorded clips are named
      // by that string.
      // The explanations that carry a drawn figure are named, one by one, in FIGURES below; every other text is held
      // to the same string as before.
      if (text === q.explain && FIGURES.includes(`${q.subject}:${q.id}`)) { figured.push(`${q.subject}:${q.id}`); continue; }
      if (!text.includes('---')) {
        plain++;
        assert.equal(tablesToSpeech(text), text, `${q.subject}:${q.id}`);
      }
    }
  }
  assert.ok(plain > 30000, `read ${plain} texts`);
  // Each named explanation does carry a figure, its voice is its explainSay, and none is spoken as markup.
  assert.deepEqual(figured.sort(), [...FIGURES].sort());
  for (const id of FIGURES) {
    const q = questions.find((x) => `${x.subject}:${x.id}` === id);
    assert.ok(splitBlocks(q.explain).some((b) => b.type === 'figure'), `${id} names a figure it does not carry`);
    assert.equal(wholeExplain(q), q.explainSay, `${id} speaks something other than its paragraph`);
    assert.ok(!/```|figure|calc:|step:|bar:/.test(tablesToSpeech(q.explain)), `${id} would speak its figure`);
  }
  assert.ok(withTable >= 12, `${withTable} texts hold a table`);
  assert.deepEqual(lintQuestionTables(questions).problems, []);
});

test('the lint names a table where it cannot be drawn and a table that does not parse', () => {
  const q = (over) => ({ subject: 's', id: 1, q: 'stem', options: ['a', 'b'], explain: 'why', ...over });
  const messages = (over) => lintQuestionTables([q(over)]).problems.join('\n');
  assert.equal(messages({ passage: TEXT, explain: TABLE }), '');
  assert.match(messages({ q: `ข้อมูล\n${TABLE}` }), /s:1 q: a table row/);
  assert.match(messages({ options: ['a', '| x | y |'] }), /s:1 options\[1\]/);
  assert.match(messages({ model_answer: TABLE }), /s:1 model_answer/);
  assert.match(messages({ explain: '| a | b |\n| 1 | 2 |' }), /no table holds/);
  assert.match(messages({ explain: '| a | b |\n|---|---|\n| 1 | 2 | 3 |' }), /row 1 has 3 cells under a header of 2/);
  assert.match(messages({ passage: '| a |\n|---|\n| 1 |' }), /a table of 1 columns/);
  assert.match(messages({ passage: '| | |\n|---|---|\n| 1 | 2 |' }), /header is empty/);
  assert.match(messages({ passage: '| a | b | c | d | e | f | g |\n|---|---|---|---|---|---|---|\n| 1 | 2 | 3 | 4 | 5 | 6 | 7 |' }), /a table of 7 columns/);
  // A row that lost a bar, a table with no outer bars, a table in a matching question's explanation.
  assert.match(messages({ explain: `${TABLE}\n| รวม | 140 | 264` }), /lost its closing bar/);
  assert.match(messages({ explain: `รวม | 140 | 264 |\n${TABLE}` }), /lost its opening bar/);
  assert.match(messages({ passage: 'a | b\n---|---\n1 | 2' }), /without its outer bars/);
  assert.match(messages({ type: 'match', explain: TABLE }), /matching question/);
  // A formula between bars is not a row, in an option or in an explanation.
  assert.equal(messages({ options: ['|x − μ|', '|x| + |y|'], explain: 'ผลต่างคือ |0.39 − 0.04| = |−0.35|\n|a| > |b|' }), '');
});

// A stem whose numbers moved into a passage table keeps the sentence that says them (`say`): a passage is
// not read aloud, and a clip recorded for that sentence is named by it.
test('the spoken stem is `say` where a question has one, and its numbers are the numbers on screen', async () => {
  assert.equal(wholeStem({ q: 'short', say: 'the sentence with 12 and 36' }), 'the sentence with 12 and 36');
  assert.equal(wholeStem({ q: 'short' }), 'short');
  assert.equal(wholeStem({ q: 'short', say: '' }), 'short');
  assert.equal(wholeStem(null), '');

  const q = (over) => ({
    subject: 's', id: 1, type: 'mcq', options: ['a', 'b'], q: 'จากข้อมูลนี้ odds ratio คำนวณจากข้อใด',
    passage: 'ข้อมูลเป็นดังนี้\n\n| | เคย | ไม่เคย |\n|---|---|---|\n| Case | 8 | 4 |',
    say: 'case เคยสัมผัส 8 ราย ไม่เคย 4 ราย odds ratio คำนวณจากข้อใด',
    ...over,
  });
  const messages = (over) => lintQuestionTables([q(over)]).problems.join('\n');
  assert.equal(messages({}), '');
  assert.match(messages({ say: 'case เคยสัมผัส 8 ราย odds ratio คำนวณจากข้อใด' }), /never says 4/);
  assert.match(messages({ say: 'case 12 ราย เคยสัมผัส 8 ราย ไม่เคย 4 ราย' }), /says 12, which the screen does not show/);
  assert.match(messages({ passage: 'เคย 8 ราย ไม่เคย 4 ราย' }), /only a question whose passage holds a table/);
  assert.match(messages({ say: 'จากข้อมูลนี้ odds ratio คำนวณจากข้อใด' }), /differs from the stem/);
  assert.match(messages({ say: '| a | b |' }), /say: a table row/);
  // A passage that is only a table says nothing about what the table is, and neither does a second table with no line of its own.
  assert.match(messages({ passage: '| | เคย | ไม่เคย |\n|---|---|---|\n| Case | 8 | 4 |' }), /no sentence above it/);
  assert.match(messages({ passage: 'ข้อมูลเป็นดังนี้\n\n| | เคย |\n|---|---|\n| Case | 8 |\n\n| | ไม่เคย |\n|---|---|\n| Case | 4 |' }), /no sentence above it/);
  assert.equal(messages({ passage: 'กลุ่มแรก\n\n| | เคย |\n|---|---|\n| Case | 8 |\n\nกลุ่มที่สอง\n\n| | ไม่เคย |\n|---|---|\n| Case | 4 |' }), '');
  // A figure in the passage's title is on screen too.
  assert.match(messages({ passage_title: 'การศึกษาปี 1854' }), /never says 1854, which the title/);
  // The stem and `say` ask the same thing: a stem reworded without its `say` is caught by its last words.
  assert.match(messages({ q: 'จากข้อมูลนี้ ข้อใดไม่ใช่วิธีคำนวณ odds ratio' }), /edit both/);

  // The bank: every spoken stem belongs to a question that shows a table, and says more than its stem does.
  let spoken = 0;
  for (const file of bankFiles('src/data')) {
    for (const question of (await readBank(file)).questions) {
      if (question.say == null) continue;
      spoken++;
      assert.ok(splitBlocks(question.passage).some((b) => b.type === 'table'), `${question.subject}:${question.id}`);
      assert.ok(question.say.length > question.q.length, `${question.subject}:${question.id} says less than it shows`);
    }
  }
  assert.ok(spoken >= 13, `${spoken} questions have a spoken stem`);
});

// The standard forbids a stem that names a document ("จากตาราง" of a deck nobody is holding). A table
// the question carries in its own passage is on screen with the stem, so the stem may point at it.
test('a stem may point at a table only when the question carries one', async () => {
  const { namesDocument } = await import('../../scripts/lib/question-standard.mjs');
  const passage = 'ข้อมูลเป็นดังนี้\n\n| | เคย |\n|---|---|\n| Case | 8 |';
  assert.equal(namesDocument({ q: 'จากตาราง odds ratio คำนวณจากข้อใด', passage }), false);
  assert.equal(namesDocument({ q: 'จากตาราง odds ratio คำนวณจากข้อใด' }), true);
  assert.equal(namesDocument({ q: 'จากตาราง odds ratio คำนวณจากข้อใด', passage: 'เนื้อเรื่องที่ไม่มีตาราง' }), true);
  assert.equal(namesDocument({ q: 'จากตารางในสไลด์ odds ratio คำนวณจากข้อใด', passage }), true, 'a slide is still a document');
});

// An explanation laid out as steps keeps the paragraph it was written as in `explainSay`: the voice, the
// coach and the AI's corpus read the paragraph, and a clip recorded for it keeps its name.
test('the whole explanation is `explainSay` where a question has one, and it holds the figures on screen', async () => {
  const { wholeExplain } = await import('../../src/lib/rich-blocks.js');
  assert.equal(wholeExplain({ explain: 'steps', explainSay: 'the paragraph' }), 'the paragraph');
  assert.equal(wholeExplain({ explain: 'steps' }), 'steps');
  assert.equal(wholeExplain({ explain: 'steps', explainSay: '' }), 'steps');
  assert.equal(wholeExplain(null), '');

  const q = (over) => ({
    subject: 's', id: 1, type: 'mcq', q: 'ค่า relative risk เท่ากับเท่าใด', options: ['0.6', '1.5', '3.0', '6.0'],
    explain: '**แทนค่า** (30/50) / (20/100) = 3.0\n\n❌ ทำไมข้ออื่นผิด\n— 0.6 คือ incidence ของกลุ่มสัมผัส',
    explainSay: 'RR = (30/50) / (20/100) = 3.0 ค่า 0.6 คือ incidence ของกลุ่มสัมผัส',
    ...over,
  });
  const messages = (over) => lintQuestionTables([q(over)]).problems.join('\n');
  assert.equal(messages({}), '');
  // A figure the paragraph says and the screen dropped, and one the screen brings from nowhere.
  assert.match(messages({ explain: '**แทนค่า** (30/50) / (20/100) = 3.0' }), /voice says 0\.6, which the explanation on screen does not show/);
  assert.match(messages({ explain: '**แทนค่า** (30/50) / (20/100) = 3.0\n0.6 คือ incidence 77' }), /shows 77, which neither its paragraph nor the question holds/);
  // A figure that comes from an option is the question's own.
  assert.equal(messages({ explain: '**แทนค่า** (30/50) / (20/100) = 3.0\n— "6.0" และ 0.6 ไม่ใช่ RR' }), '');
  assert.match(messages({ explainSay: q({}).explain }), /differs from the explanation/);
  assert.match(messages({ explainSay: '| a | b |' }), /explainSay: a table row/);

  // The bank: every kept paragraph belongs to an explanation that is laid out on more than one line.
  let kept = 0;
  for (const file of bankFiles('src/data')) {
    for (const question of (await readBank(file)).questions) {
      if (question.explainSay == null) continue;
      kept++;
      assert.ok(question.explain.includes('\n'), `${question.subject}:${question.id} keeps a paragraph beside an explanation of one line`);
    }
  }
  assert.ok(kept >= 16, `${kept} explanations keep their paragraph`);
});
