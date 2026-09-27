// Small synthetic files, one per intake rule [M1-DESIGN.md 8.6]. Each file's expected result is
// written by hand in expected.json beside it (never computed by the code under test).
// Run from research/:  node tests/fixtures/intake/make-fixtures.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// windows-874 (TIS-620): ASCII as is, Thai U+0E01..U+0E5B -> 0xA1..0xFB
function tis620(text) {
  const out = Buffer.alloc(text.length);
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) out[i] = c;
    else if (c >= 0x0e01 && c <= 0x0e5b) out[i] = c - 0x0e01 + 0xa1;
    else throw new Error('not in windows-874');
  }
  return out;
}
const utf16le = (text) => Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, 'utf16le')]);

const THAI = 'ชนิด,จำนวน\r\nไก่,3\r\nเป็ด,๕\r\n';
const files = {
  'utf8-bom.csv': Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(THAI, 'utf8')]),
  'utf8-nobom.csv': Buffer.from(THAI, 'utf8'),
  'utf16le-tab.txt': utf16le('ชนิด\tจำนวน\r\nไก่\t3\r\nเป็ด\t5\r\n'),
  'tis620.csv': tis620(THAI),
  // ASCII header first: strict UTF-8 fails at the first Thai byte, 0-based offset 15 ("species,count\r\n" is 15 bytes)
  'tis620-late.csv': tis620('species,count\r\nไก่,3\r\n'),
  'zero-width.csv': Buffer.from('ชนิด,จำนวน\nไก่,1\nไก่​,2\nเป็ด,3\n', 'utf8'),
  // SARA AM typed as NIKHAHIT + SARA AA in the third row
  'sara-am.csv': Buffer.from('แหล่ง,จำนวน\nน้ำ,1\nน้ํา,2\nบก,3\n', 'utf8'),
  'quotes-semicolon.csv': Buffer.from('id;note;n\r\n1;"line one\r\nline two";5\r\n2;"he said ""hi""";6\r\n3;plain;7\r\n', 'utf8'),
  'title-row.csv': Buffer.from('แบบสำรวจฟาร์ม ปี 2569,,\r\n,,\r\nฟาร์ม,จำนวนโค,ผล\r\nF01,12,บวก\r\nF02,8,ลบ\r\n', 'utf8'),
  'excel-serials.csv': Buffer.from('วันที่ตรวจ,ผล\n45000,บวก\n45001,ลบ\n61,ลบ\n', 'utf8'),
  'feb29-be.csv': Buffer.from('วันเกิด,เพศ\n29/02/2567,เมีย\n15/03/2566,ผู้\n', 'utf8'),
};

const expected = {
  'utf8-bom.csv': { encoding: 'utf-8-bom', header: ['ชนิด', 'จำนวน'], rows: [['ไก่', '3'], ['เป็ด', '๕']] },
  'utf8-nobom.csv': { encoding: 'utf-8', header: ['ชนิด', 'จำนวน'], rows: [['ไก่', '3'], ['เป็ด', '๕']] },
  'utf16le-tab.txt': { encoding: 'utf-16le', delimiter: '\t', header: ['ชนิด', 'จำนวน'], rows: [['ไก่', '3'], ['เป็ด', '5']] },
  'tis620.csv': { encoding: 'windows-874', firstBadByte: 0, header: ['ชนิด', 'จำนวน'], rows: [['ไก่', '3'], ['เป็ด', '๕']] },
  'tis620-late.csv': { encoding: 'windows-874', firstBadByte: 15, header: ['species', 'count'], rows: [['ไก่', '3']] },
  'zero-width.csv': { invisibleCells: 1, levels: ['ไก่', 'เป็ด'] },
  'sara-am.csv': { lookalike: { a: 'น้ํา', b: 'น้ำ' } },
  'quotes-semicolon.csv': { delimiter: ';', header: ['id', 'note', 'n'], rows: [['1', 'line one\r\nline two', '5'], ['2', 'he said "hi"', '6'], ['3', 'plain', '7']] },
  'title-row.csv': { headerRow: 2, header: ['ฟาร์ม', 'จำนวนโค', 'ผล'], rows: [['F01', '12', 'บวก'], ['F02', '8', 'ลบ']] },
  // 45000 = 2023-03-15 in the 1900 system, 2027-03-16 in the 1904 system (1,462 days later); 61 = 1900-03-01
  'excel-serials.csv': { type: 'date', excelSerial: true, iso1900: ['2023-03-15', '2023-03-16', '1900-03-01'], iso1904: ['2027-03-16', '2027-03-17', '1904-03-02'] },
  // 29/02/2567 exists as BE 2567 = CE 2024, not as CE 2567
  'feb29-be.csv': { era: 'BE', feb29OnlyBE: true, iso: ['2024-02-29', '2023-03-15'] },
};

for (const [name, bytes] of Object.entries(files)) fs.writeFileSync(path.join(here, name), bytes);
fs.writeFileSync(path.join(here, 'expected.json'), JSON.stringify(expected, null, 1) + '\n');
console.log('wrote', Object.keys(files).length, 'files');
