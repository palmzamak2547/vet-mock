// Local exports (M1-DESIGN.md 14; competitor-gaps.md D4(c)): Word-ready HTML, CSV with a BOM, TSV,
// hidden PII columns left out, and a PNG that declares its dpi. The expected pHYs bytes were made with
// Python zlib.crc32 on 27 Sep 2026 (b'pHYs' + ppm 11811 twice + unit 1). OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tableToHtml, tableToCsv, tableToTsv, withoutHidden, setPngDpi, readPngDpi, pixelsFor } from '../../src/lib/runtime/export.js';

const table = {
  caption: 'ตารางที่ 1 ลักษณะของโค <ฟาร์ม>',
  columns: ['ตัวแปร', 'ผลบวก (n = 146)', 'เบอร์โทร', 'p'],
  rows: [
    ['อายุ (เดือน), มัธยฐาน', '30 (21 ถึง 43)', '0001234567', '< 0.001'],
    ['ฟาร์ม "A", ขนาด', 41, '0007654321', null],
    ['open', Infinity, '000', 0.049],
  ],
  hidden: [false, false, true, false],
  note: 'Welch t-test | 95% CI | ข้อมูล 3f2a9c1b',
};

test('hidden PII columns never appear in any export', () => {
  for (const out of [tableToHtml(table), tableToCsv(table), tableToTsv(table)]) {
    assert.ok(!out.includes('เบอร์โทร') && !out.includes('0001234567') && !out.includes('0007654321'));
  }
  assert.deepEqual(withoutHidden(table).columns, ['ตัวแปร', 'ผลบวก (n = 146)', 'p']);
});

test('HTML for Word: escaped, inline borders, numbers right-aligned, caption and provenance note', () => {
  const html = tableToHtml(table);
  assert.ok(html.startsWith('<table style="border-collapse:collapse;'));
  assert.ok(html.includes('&lt;ฟาร์ม&gt;') && !html.includes('<ฟาร์ม>'));
  assert.ok(html.includes('ฟาร์ม &quot;A&quot;, ขนาด'));
  assert.ok(/text-align:right;">41</.test(html));
  assert.ok(/text-align:right;">30 \(21 ถึง 43\)</.test(html));
  assert.ok(/text-align:right;">&lt; 0.001</.test(html));
  assert.ok(/text-align:left;">อายุ/.test(html));
  assert.ok(html.endsWith('Welch t-test | 95% CI | ข้อมูล 3f2a9c1b</p>'));
});

test('CSV: UTF-8 BOM, RFC 4180 quoting, CRLF, empty for missing, Infinity spelled out', () => {
  const csv = tableToCsv(table);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  const lines = csv.slice(1).split('\r\n');
  assert.equal(lines[0], 'ตัวแปร,ผลบวก (n = 146),p');
  assert.equal(lines[1], '"อายุ (เดือน), มัธยฐาน",30 (21 ถึง 43),< 0.001');
  assert.equal(lines[2], '"ฟาร์ม ""A"", ขนาด",41,');
  assert.equal(lines[3], 'open,Infinity,0.049');
  assert.equal(lines[4], '');
});

test('TSV for the plain clipboard flavour', () => {
  assert.equal(tableToTsv({ columns: ['a', 'b'], rows: [['x\ty', 'line\nbreak']] }), 'a\tb\nx y\tline break');
});

test('print size: pixels = width / 25.4 x dpi', () => {
  assert.equal(pixelsFor(85, 300), 1004);
  assert.equal(pixelsFor(170, 600), 4016);
  assert.equal(pixelsFor(25.4, 300), 300);
});

test('the PNG gets a pHYs chunk after IHDR with the right CRC, replacing any earlier one', () => {
  const png = Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC', 'base64'));
  assert.equal(readPngDpi(png), null);
  const at300 = setPngDpi(png, 300);
  const hex = Buffer.from(at300).toString('hex');
  assert.ok(hex.includes('000000097048597300002e2300002e230178a53f76'), 'pHYs bytes and CRC as computed by zlib');
  assert.equal(hex.indexOf('70485973'), 8 * 2 + 25 * 2 + 4 * 2, 'right after the 25-byte IHDR chunk');
  assert.equal(readPngDpi(at300), 300);
  const at600 = setPngDpi(at300, 600);
  assert.equal(readPngDpi(at600), 600);
  assert.equal(at600.length, at300.length, 'the old pHYs is replaced, not added twice');
  assert.throws(() => setPngDpi(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), 300));
});
