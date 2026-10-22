// Anki import text: headers Anki reads, one row per answerable question, no
// way for question text to break a field or inject markup.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ankiText } from '../../src/lib/anki-export.js';

test('one tab-separated row per question with the answer on the back', () => {
  const { text, count } = ankiText([
    { id: 1, subject: 'surg2', type: 'mcq', q: 'Nerve?', options: ['Femoral', 'Sciatic'], answer: 1, explain: '**Sciatic** n.\nnear fossa' },
    { id: 2, subject: 'com5', type: 'tf', q: 'RAV kills faster', answer: true },
    { id: 3, subject: 'surg2', type: 'fill', q: 'A ____ B', blanks: ['gauze'] },
    { id: 4, subject: 'x', type: 'mcq', q: 'broken', options: [] , answer: 3 },
  ], { deck: 'VetMock::ปักหมุด' });
  const lines = text.trim().split('\n');
  assert.deepEqual(lines.slice(0, 5), ['#separator:tab', '#html:true', '#notetype:Basic', '#deck:VetMock::ปักหมุด', '#tags column:3']);
  assert.equal(count, 3);
  const rows = lines.slice(5).map((l) => l.split('\t'));
  assert.ok(rows.every((r) => r.length === 3));
  assert.match(rows[0][0], /A\. Femoral<br>B\. Sciatic/);
  assert.match(rows[0][1], /^<b>B\. Sciatic<\/b><br><br><b>Sciatic<\/b> n\.<br>near fossa$/);
  assert.equal(rows[1][1], '<b>ถูก</b>');
  assert.equal(rows[2][2], 'vetmock surg2');
});

test('question text cannot add a field, a line or markup', () => {
  const { text } = ankiText([{ type: 'tf', q: 'a\tb\n<script>x</script>', answer: false }]);
  const row = text.trim().split('\n').at(-1).split('\t');
  assert.equal(row.length, 3);
  assert.equal(row[0], 'a b<br>&lt;script&gt;x&lt;/script&gt;<br><br>ถูก หรือ ผิด');
});
