import test from 'node:test';
import assert from 'node:assert/strict';
import { shareText, lineUrl, markdownWithSources, htmlWithSources, ankiTsv, reviewTimes, googleCalendarUrl, icsFile } from '../../src/lib/share.js';

test('share text strips markdown and citations, cuts on a word, ends with the address', () => {
  const t = shareText('ระยะฟักตัว rabies', '**Rabies** ฟักตัว 1 ถึง 3 เดือน [1]\n\n- ระยะแรก [2]', 1400);
  assert.ok(!t.includes('**') && !t.includes('[1]'));
  assert.ok(t.endsWith('ถามต่อที่ https://ai.vetmock.com'));
  const long = shareText('q', 'คำ '.repeat(2000), 300);
  assert.ok(long.length < 400 && long.includes('…'));
});

test('LINE share URL carries the text, encoded', () => {
  const u = lineUrl('สวัสดี & ok');
  assert.ok(u.startsWith('https://line.me/R/share?text='));
  assert.equal(decodeURIComponent(u.split('text=')[1]), 'สวัสดี & ok');
});

test('markdown and HTML exports keep sources as links, and escape', () => {
  const src = [{ n: 1, title: 'Rabies <wiki>', url: 'https://vetmock.com/wiki/com5/rabies' }];
  assert.ok(markdownWithSources('q', 'a', src).includes('1. [Rabies <wiki>](https://vetmock.com/wiki/com5/rabies)'));
  const h = htmlWithSources('<q>', '<p>a</p>', src);
  assert.ok(h.includes('&lt;q&gt;') && h.includes('Rabies &lt;wiki&gt;') && h.includes('<p>a</p>'));
});

test('Anki file: header, one tab-separated note per question, answer on the back', () => {
  const tsv = ankiTsv([{ stem: 'A\tB\nC', options: ['x', 'y'], answer: 1, explain: 'because' }]);
  const lines = tsv.trim().split('\n');
  assert.equal(lines[0], '#separator:tab');
  const [front, back] = lines[3].split('\t');
  assert.ok(front.includes('A B<br>C') && front.includes('B. y'));
  assert.ok(back.startsWith('B. y') && back.includes('because'));
  assert.equal(lines[3].split('\t').length, 2);
});

test('review times: 1, 3 and 7 days out at 20:00 local', () => {
  const now = new Date(2026, 9, 27, 9, 30);
  const t = reviewTimes(now);
  assert.deepEqual(t.map((d) => [d.getDate(), d.getHours(), d.getMinutes()]), [[28, 20, 0], [30, 20, 0], [3, 20, 0]]);
});

test('calendar links and files are well formed', () => {
  const start = new Date(Date.UTC(2026, 9, 28, 13, 0));
  const g = new URL(googleCalendarUrl('ทบทวน', 'รายละเอียด', start));
  assert.equal(g.searchParams.get('dates'), '20261028T130000Z/20261028T133000Z');
  const ics = icsFile('ทบทวน: rabies, dog; test', 'บรรทัดยาว '.repeat(40), [start, start], 30, start);
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.ok(ics.includes('SUMMARY:ทบทวน: rabies\\, dog\\; test'));
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, `folded: ${line.slice(0, 30)}`);
});
