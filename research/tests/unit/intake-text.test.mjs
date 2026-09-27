// Intake: Thai text, decoding and CSV parsing [M1-DESIGN.md 8.1, 8.2, 8.6]. Expected results for the
// small files are in tests/fixtures/intake/expected.json, written by hand (make-fixtures.mjs).
// OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { thaiDigitsToArabic, hasThaiDigit, cleanCell, compareThai, hasSplitSaraAm, joinSaraAm } from '../../src/lib/intake/thai.js';
import { decodeBytes, sha256Hex, firstInvalidUtf8 } from '../../src/lib/intake/decode.js';
import { parseDelimited, detectHeaderRow, sniffDelimiter, splitRecords } from '../../src/lib/intake/csv.js';

const fx = (name) => new Uint8Array(readFileSync(new URL(`../fixtures/intake/${name}`, import.meta.url)));
const expected = JSON.parse(readFileSync(new URL('../fixtures/intake/expected.json', import.meta.url), 'utf8'));

test('Thai digits become Arabic before any number is read (methods.md 5.2: Number("๕") is NaN)', () => {
  assert.ok(Number.isNaN(Number('๕')));
  assert.equal(thaiDigitsToArabic('๑๒.๕'), '12.5');
  assert.equal(thaiDigitsToArabic('๐๕/๐๘/๒๕๖๙'), '05/08/2569');
  assert.equal(thaiDigitsToArabic('F07 ไก่'), 'F07 ไก่');
  assert.ok(hasThaiDigit('๒๕๖๙') && !hasThaiDigit('2569'));
});

test('cleanCell: NFC never NFKC, zero-width removed, spaces trimmed and collapsed', () => {
  const zw = cleanCell('ไก่​');
  assert.deepEqual(zw, { value: 'ไก่', trimmed: false, invisible: 1, normalized: false });
  assert.notEqual('ไก่', 'ไก่​');
  const sp = cleanCell('  ลูกผสม   โฮลสไตน์ ');
  assert.equal(sp.value, 'ลูกผสม โฮลสไตน์');
  assert.ok(sp.trimmed);
  // NFC keeps SARA AM (U+0E33); NFKC would split it into NIKHAHIT + SARA AA
  const am = cleanCell('น้ำ');
  assert.equal(am.value, 'น้ำ');
  assert.equal('น้ำ'.normalize('NFKC').includes('ํา'), true);
  assert.equal(am.value.includes('ํา'), false);
  // typed as two keys, NFC leaves it as two code points: shown as a look-alike, never merged silently
  const split = 'น้ํา';
  assert.equal(cleanCell(split).value, split);
  assert.ok(hasSplitSaraAm(split));
  assert.equal(joinSaraAm(split), 'น้ำ');
  assert.deepEqual(cleanCell('abc', { trim: false }), { value: 'abc', trimmed: false, invisible: 0, normalized: false });
});

test('Intl.Collator("th") order: กา, ไก่, ข้าว, เป็ด (code-point order would put ไก่ last)', () => {
  assert.deepEqual(['เป็ด', 'ข้าว', 'ไก่', 'กา'].sort(compareThai), ['กา', 'ไก่', 'ข้าว', 'เป็ด']);
});

test('UTF-8 validator finds the first bad byte, rejects overlongs and surrogates', () => {
  assert.equal(firstInvalidUtf8(new Uint8Array([0x61, 0x62])), -1);
  assert.equal(firstInvalidUtf8(new Uint8Array([0x61, 0xa1])), 1);
  assert.equal(firstInvalidUtf8(new Uint8Array([0xc0, 0x80])), 0); // overlong NUL
  assert.equal(firstInvalidUtf8(new Uint8Array([0xed, 0xa0, 0x80])), 0); // surrogate
  assert.equal(firstInvalidUtf8(new Uint8Array([0x61, 0xe0, 0xb8])), 1); // cut short
  assert.equal(firstInvalidUtf8(new Uint8Array([0xe0, 0xb8, 0x81])), -1); // ก
});

for (const name of ['utf8-bom.csv', 'utf8-nobom.csv', 'utf16le-tab.txt', 'tis620.csv', 'tis620-late.csv']) {
  test(`decode and parse ${name} (fixtures/intake/expected.json)`, () => {
    const e = expected[name];
    const dec = decodeBytes(fx(name));
    assert.equal(dec.encoding, e.encoding, 'encoding');
    assert.equal(dec.replacementChars, 0);
    if (e.firstBadByte !== undefined) {
      assert.equal(dec.reasonKey, 'intake.encoding.fallback874');
      assert.equal(dec.params.byte, e.firstBadByte);
    }
    const p = parseDelimited(dec.text);
    assert.deepEqual(p.header, e.header);
    assert.deepEqual(p.rows, e.rows);
    if (e.delimiter) assert.equal(p.delimiter, e.delimiter);
  });
}

test('strict UTF-8 fails on TIS-620 bytes, windows-874 reads them (methods.md 5.1)', () => {
  const bytes = fx('tis620.csv');
  assert.throws(() => new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  const forced = decodeBytes(bytes, { encoding: 'utf-8' });
  assert.ok(forced.replacementChars > 0, 'a forced UTF-8 read shows replacement characters');
  assert.equal(forced.reasonKey, 'intake.encoding.chosenWithErrors');
});

test('sha256Hex matches the FIPS 180-2 example "abc"', async () => {
  assert.equal(await sha256Hex(new TextEncoder().encode('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('CSV: quotes, doubled quotes, embedded CRLF, semicolon sniffed', () => {
  const e = expected['quotes-semicolon.csv'];
  const text = decodeBytes(fx('quotes-semicolon.csv')).text;
  assert.equal(sniffDelimiter(text).delimiter, ';');
  const p = parseDelimited(text);
  assert.equal(p.delimiter, e.delimiter);
  assert.deepEqual(p.header, e.header);
  assert.deepEqual(p.rows, e.rows);
  assert.equal(p.ragged, 0);
});

test('CSV: a title line and a blank line above the table are skipped', () => {
  const e = expected['title-row.csv'];
  const p = parseDelimited(decodeBytes(fx('title-row.csv')).text);
  assert.equal(p.headerRow, e.headerRow);
  assert.deepEqual(p.header, e.header);
  assert.deepEqual(p.rows, e.rows);
  assert.equal(detectHeaderRow([['a', 'b'], ['1', '2']]), 0);
});

test('CSV: ragged rows keep every value; Excel trailing commas are not data; blank rows counted', () => {
  const p = parseDelimited('a,b\n1,2,,,\n3\n\n4,5,extra\n');
  assert.deepEqual(p.header, ['a', 'b', '']);
  assert.deepEqual(p.rows, [['1', '2', ''], ['3', '', ''], ['4', '5', 'extra']]);
  assert.equal(p.ragged, 2);
  assert.equal(p.extraColumns, 1);
  assert.equal(p.blankRowsDropped, 1);
  assert.deepEqual(splitRecords('x\ry\r\n', ','), [['x'], ['y']]);
});
