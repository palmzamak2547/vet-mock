import test from 'node:test';
import assert from 'node:assert/strict';
import { plainText, shareText, lineUrl, lineShareUrl, markdownWithSources, htmlWithSources, ankiTsv, reviewTimes, googleCalendarUrl, icsFile } from '../../src/lib/share.js';

test('share text with no sources strips markdown and citations, ends with the address', () => {
  const t = shareText('ระยะฟักตัว rabies', '**Rabies** ฟักตัว 1 ถึง 3 เดือน [1]\n\n- ระยะแรก [2]');
  assert.ok(!t.includes('**') && !t.includes('[1]'));
  assert.ok(t.endsWith('ถามต่อที่ https://ai.vetmock.com'));
});

test('share text keeps citation numbers and lists the sources they point to, two with one title told apart', () => {
  const sources = [
    { n: 1, title: 'CIRD complex + Canine Distemper', subtitle: '16. Biphasic clinical signs' },
    { n: 2, title: 'CIRD complex + Canine Distemper', subtitle: '4. อาการทางคลินิก' },
  ];
  const t = shareText('q', '**Myoclonus** กระตุก [1][2]', { sources });
  assert.ok(t.includes('Myoclonus กระตุก [1][2]'));
  assert.ok(t.includes('แหล่งที่มา\n1. CIRD complex + Canine Distemper, 16. Biphasic clinical signs\n2. CIRD complex + Canine Distemper, 4. อาการทางคลินิก'));
  assert.ok(t.endsWith('ถามต่อที่ https://ai.vetmock.com'));
});

test('a long answer is cut where a paragraph ends, marked, and never loses its sources or link', () => {
  const md = Array.from({ length: 30 }, (_, i) => `ย่อหน้า ${i + 1} ${'ข้อความ '.repeat(12)}`).join('\n\n');
  const t = shareText('q', md, { sources: [{ n: 1, title: 'Rabies', subtitle: 'COM5' }], limit: 900 });
  assert.ok(t.length <= 1000, String(t.length));
  assert.ok(/\n…\n/.test(t), 'marked as cut');
  assert.ok(/ข้อความ\s*\n…/.test(t), 'cut after a whole paragraph');
  assert.ok(t.includes('1. Rabies, COM5') && t.endsWith('ถามต่อที่ https://ai.vetmock.com'));
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

test('plain text keeps the answer readable: breaks, bullets, tables, no markers', () => {
  const md = '## หัวข้อ\n\n**Rabies** ฟักตัว 1 ถึง 3 เดือน [1]\n\n- ระยะแรก [2]\n- ระยะสอง\n\n| ระยะ | อาการ |\n| --- | --- |\n| A | B |\n\nดู [VetWiki](https://vetmock.com/wiki) *Lyssavirus*';
  assert.equal(plainText(md), 'หัวข้อ\n\nRabies ฟักตัว 1 ถึง 3 เดือน\n\n• ระยะแรก\n• ระยะสอง\n\nระยะ / อาการ\nA / B\n\nดู VetWiki (https://vetmock.com/wiki) Lyssavirus');
});

// a long Thai answer with eight sources: about 13 KB as a LINE URL before fitting
const longQ = 'อาการของไข้หัดสุนัขมีอะไรบ้าง';
const longMd = Array.from({ length: 40 }, (_, i) => `ย่อหน้า ${i + 1} ${'อาการทางระบบประสาทของไข้หัดสุนัข [1] '.repeat(6)}`).join('\n\n');
const eight = Array.from({ length: 8 }, (_, i) => ({ n: i + 1, title: `CIRD complex + Canine Distemper บทที่ ${i + 1}`, subtitle: 'อาการทางคลินิกและการวินิจฉัย' }));

test('the LINE link fits line.me (414 past about 8,190 bytes) and keeps every source and the link', () => {
  const url = lineShareUrl(longQ, longMd, eight);
  assert.ok(url.length <= 8000, String(url.length));
  const text = decodeURIComponent(url.split('text=')[1]);
  assert.ok(text.includes('แหล่งที่มา\n1. ') && text.includes('\n8. CIRD'), 'all eight sources');
  assert.ok(/\n…\n/.test(text), 'marked as cut');
  assert.ok(text.endsWith('ถามต่อที่ https://ai.vetmock.com'));
});

test('a short answer goes to LINE whole', () => {
  const sources = [{ n: 1, title: 'Rabies' }];
  assert.equal(decodeURIComponent(lineShareUrl('q', 'สั้น [1]', sources).split('text=')[1]), shareText('q', 'สั้น [1]', { sources }));
});

test('with only some sources listed, citation marks keep only the listed numbers', () => {
  const sources = [1, 2, 3, 4, 5].map((n) => ({ n, title: `S${n}` }));
  const t = shareText('q', 'ก [1] ข [2, 5] ค [4–5] ง [3]', { sources, maxSources: 3 });
  assert.ok(t.startsWith('q\n\nก [1] ข [2] ค ง [3]\n\n'), t);
  assert.ok(t.includes('3. S3') && !t.includes('4. S4'));
});

test('the calendar reminder stays well inside Google Calendar\'s URL limit (400 past about 16 KB)', () => {
  const details = shareText(longQ, longMd, { sources: eight, limit: 900, maxSources: 3 });
  const url = googleCalendarUrl(`ทบทวน: ${longQ}`, details, new Date('2026-10-29T13:00:00Z'));
  assert.ok(url.length < 14000, String(url.length));
});
