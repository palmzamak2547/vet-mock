// A table inside a passage or an explanation (src/lib/rich-blocks.js): what
// parses, what stays prose, where the offsets fall, how it is read aloud, and
// that nothing written before tables existed changes by a character.
import test from 'node:test';
import assert from 'node:assert/strict';
import { highlightParts, isTableRow, splitBlocks, tableCells, tablesToSpeech } from '../../src/lib/rich-blocks.js';
import { clipText } from '../../src/lib/tts-text.js';
import { lintQuestionTables } from '../../scripts/lint-question-tables.mjs';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

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
  assert.equal(said, `${BEFORE}\nELISA บวก: เพาะเชื้อบวก 102, เพาะเชื้อลบ 40\nELISA ลบ: เพาะเชื้อบวก 38, เพาะเชื้อลบ 224\n${AFTER}`);
  assert.equal(tablesToSpeech('| Method | Temp |\n|---|---|\n| Freezer | -20 |\n| LN2 | |'), 'Method Freezer, Temp -20\nMethod LN2');
  const clip = clipText(TEXT, 'th');
  assert.ok(!/[|]|---/.test(clip), clip);
});

test('the bank: a text with no table is spoken as it was, and every table is one the card draws', async () => {
  const questions = [];
  for (const file of bankFiles('src/data')) questions.push(...(await readBank(file)).questions);
  let plain = 0;
  let withTable = 0;
  for (const q of questions) {
    for (const text of [q.q, q.explain, q.passage, q.model_answer, ...(Array.isArray(q.options) ? q.options : [])]) {
      if (typeof text !== 'string') continue;
      if (splitBlocks(text).some((b) => b.type === 'table')) {
        withTable++;
        assert.ok(!/[|]|-{3}/.test(clipText(text, 'th')), `${q.subject}:${q.id} still says bars or dashes`);
      } else {
        plain++;
        assert.equal(tablesToSpeech(text), text);
      }
    }
  }
  assert.ok(plain > 30000, `read ${plain} texts`);
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
});
