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

test('a passage comes first on the front, and a table is a table on both sides', () => {
  const data = 'ประเมิน ELISA ในโค 404 ตัว\n\n| | เพาะเชื้อบวก | เพาะเชื้อลบ |\n|---|---|---|\n| ELISA บวก | 102 | 40 |';
  const { text } = ankiText([{
    id: 5, subject: 'epidemiology', type: 'mcq', q: 'ความชุกคำนวณจากข้อใด', options: ['140/404', '102/404'], answer: 0,
    passage: data, passage_title: 'ELISA <b>', explain: 'ดูจากตาราง\n\n| a | b |\n|---|---|\n| 1 | <2> |',
  }]);
  const [front, back] = text.trim().split('\n').at(-1).split('\t');
  assert.match(front, /^<b>ELISA &lt;b&gt;<\/b><br>ประเมิน ELISA ในโค 404 ตัว<br><table /);
  assert.match(front, /<tr><th><\/th><th>เพาะเชื้อบวก<\/th><th>เพาะเชื้อลบ<\/th><\/tr><tr><td>ELISA บวก<\/td><td>102<\/td><td>40<\/td><\/tr><\/table><br><br>ความชุกคำนวณจากข้อใด/);
  assert.match(back, /ดูจากตาราง<br><table [^>]*><tr><th>a<\/th><th>b<\/th><\/tr><tr><td>1<\/td><td>&lt;2&gt;<\/td><\/tr><\/table>$/);
  assert.ok(!/\|---/.test(front + back), 'no table syntax reaches the card');
});

test('a figure goes on the front by an address Anki can open, or the question is left out and counted', () => {
  const { text, count, noFigure } = ankiText([
    { id: 6, subject: 'repro', type: 'mcq', q: 'ดูภาพประกอบ', options: ['a', 'b'], answer: 0, imagePath: '/images/questions/repro/x.webp' },
    { id: 7, subject: 'surg2', type: 'tf', q: 'ดูภาพประกอบ', answer: true, image: '/figures/y.png' },
    { id: 8, subject: 'surg2', type: 'tf', q: 'local', answer: true, image: 'blob:https://vetmock.com/1' },
    { id: 9, subject: 'surg2', type: 'tf', q: 'tracker', answer: true, image: 'https://evil.example/p.png' },
  ]);
  assert.equal(count, 2);
  assert.equal(noFigure, 2);
  const fronts = text.trim().split('\n').slice(5).map((l) => l.split('\t')[0]);
  assert.match(fronts[0], /^<img src="https:\/\/vetmock\.com\/images\/questions\/repro\/x\.webp"><br><br>ดูภาพประกอบ/);
  assert.match(fronts[1], /^<img src="https:\/\/vetmock\.com\/figures\/y\.png">/);
});
