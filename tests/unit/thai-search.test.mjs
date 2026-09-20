// Every case here is a way Thai search fails in real lecture decks, written
// down as a test because "it feels more accurate" is not a claim anyone can
// check. Each one fails against a plain `text.toLowerCase().includes(q)`.

import test from 'node:test';
import assert from 'node:assert/strict';
import { findIn, searchPages, fold, hasThai, pageTextFromItems } from '../../src/lib/thai-search.js';

const naive = (h, n) => h.toLowerCase().includes(n.toLowerCase());

test('a word split across two pdf.js runs is still found', async () => {
  // pdf.js cuts a Thai line wherever the renderer moved the pen, routinely
  // mid-word. This is the single commonest reason a search comes back empty.
  const page = 'หลักการการวินิจ ฉัยโรคปอดบวมในสุนัข';
  assert.equal(naive(page, 'วินิจฉัย'), false, 'the naive matcher was supposed to fail here');
  assert.ok(findIn(page, 'วินิจฉัย'), 'a word broken across runs was not found');
});

test('an invisible zero-width space does not hide a word', async () => {
  const page = 'การ​วินิจฉัย​แยกโรค';
  assert.equal(naive(page, 'การวินิจฉัย'), false);
  assert.ok(findIn(page, 'การวินิจฉัย'));
});

test('สระอำ matches whether the exporter wrote one codepoint or two', async () => {
  const composed = 'จำนวนสัตว์ป่วย';
  const decomposed = 'จํานวนสัตว์ป่วย'; // U+0E4D + U+0E32
  assert.notEqual(composed, decomposed, 'the two spellings are meant to differ byte-wise');
  assert.ok(findIn(decomposed, 'จำนวน'), 'a decomposed สระอำ in the page was not matched');
  assert.ok(findIn(composed, 'จํานวน'), 'a decomposed สระอำ in the query was not matched');
});

test('Thai and Arabic digits are the same number', async () => {
  assert.ok(findIn('ปีการศึกษา ๒๕๖๘', '2568'));
  assert.ok(findIn('ปีการศึกษา 2568', '๒๕๖๘'));
});

test('a missing tone mark still finds the word, and says it was loose', async () => {
  const page = 'เชื้อแบคทีเรียก่อโรค';
  const hit = findIn(page, 'เชือแบคทีเรีย'); // no ้
  assert.ok(hit, 'a tone-mark slip returned nothing at all');
  assert.equal(hit.loose, true, 'a relaxed match was not reported as relaxed');
  // …and an exact match must NOT be reported as loose.
  assert.equal(findIn(page, 'แบคทีเรีย').loose, false);
});

test('English keeps its word boundaries', async () => {
  // Thai queries fold spaces away because a Thai word never contains one.
  // Doing that to English would make "the cat" match "theca t".
  assert.ok(findIn('the cat sat', 'cat sat'));
  assert.equal(findIn('theca t', 'cat'), null, 'an English query matched across a word break');
  assert.equal(hasThai('cat'), false);
  assert.equal(hasThai('แมว'), true);
});

test('the quote comes from the original text, not the folded one', async () => {
  const page = 'อาการ​ทางคลินิกของโรคพิษสุนัขบ้าในโค และการวินิจฉัยแยกโรค';
  const [hit] = searchPages([null, page], 'พิษสุนัขบ้า');
  assert.ok(hit, 'nothing found');
  assert.equal(hit.page, 1);
  assert.ok(hit.quote.includes('พิษสุนัขบ้า'), 'the quote did not contain the thing that was searched for');
  assert.ok(!hit.quote.includes('​'), 'a zero-width space leaked into what the reader sees');
});

test('offsets point at the real text so a highlight would land correctly', async () => {
  const page = 'บทที่ ๓ การวินิจ ฉัยโรค';
  const hit = findIn(page, 'วินิจฉัย');
  assert.ok(hit);
  // The match starts at the ว of วินิจ and ends after the ย of ฉัย, spanning
  // the space pdf.js inserted between the runs.
  assert.equal(page[hit.at], 'ว');
  assert.equal(page.slice(hit.at, hit.end).replace(/\s/g, ''), 'วินิจฉัย');
});

test('runs are joined without a separator, lines with a newline', async () => {
  // Joining every run with a space is what created the split-word bug; the
  // line break is the only separator pdf.js actually asserts.
  const items = [
    { str: 'การวินิจ' }, { str: 'ฉัยโรค', hasEOL: true },
    { str: 'ในสุนัขและแมว' },
  ];
  const text = pageTextFromItems(items);
  assert.equal(text, 'การวินิจฉัยโรค\nในสุนัขและแมว');
  assert.ok(findIn(text, 'วินิจฉัยโรค'));
});

test('a Thai query crosses the line break pdf.js inserted', async () => {
  // A sentence wrapped across two visual lines is still one sentence.
  const text = 'การรักษาโรค\nพิษสุนัขบ้า';
  assert.ok(findIn(text, 'โรคพิษสุนัขบ้า'), 'a phrase wrapped onto the next line was not found');
});

test('fold is stable and reversible through its index map', async () => {
  const src = 'ก​ข ค๑';
  const f = fold(src, { dropSpaces: true });
  assert.equal(f.text.length, f.map.length, 'the index map does not line up with the folded text');
  for (let i = 0; i < f.map.length; i++) {
    assert.ok(f.map[i] >= 0 && f.map[i] < src.length, 'an index map entry points outside the source');
  }
});

test('an empty or whitespace query finds nothing rather than everything', async () => {
  assert.equal(findIn('อะไรก็ตาม', ''), null);
  assert.equal(findIn('อะไรก็ตาม', '   '), null);
  assert.deepEqual(searchPages([null, 'อะไรก็ตาม'], ''), []);
});

// The offsets a hit reports are what the reader slices its quote with, so
// they have to point into the text as it was extracted — not into the cleaned
// copy the matcher folded. Every case below is a way the two drift apart.

test('offsets survive the invisible characters before the match', async () => {
  // A long Thai line carries a zero-width word-break hint between almost
  // every word. With the map built on the cleaned copy, the hit sat sixty
  // characters early and the quote did not contain the word at all.
  const page = 'A​'.repeat(60) + 'วินิจฉัย' + ' tail';
  const hit = findIn(page, 'วินิจฉัย');
  assert.ok(hit);
  assert.equal(hit.at, page.indexOf('วินิจฉัย'), 'the match started before the word');
  assert.equal(page.slice(hit.at, hit.end), 'วินิจฉัย');
  const [shown] = searchPages([null, page], 'วินิจฉัย');
  assert.ok(shown.quote.includes('วินิจฉัย'), 'the quote did not contain the word that was searched for');
});

test('a decomposed สระอำ spans both of its source codepoints', async () => {
  const page = 'สรุป จํานวนสัตว์ป่วย'; // U+0E4D + U+0E32
  const hit = findIn(page, 'จำนวน');
  assert.ok(hit);
  assert.equal(hit.at, page.indexOf('จ'));
  assert.equal(page.slice(hit.at, hit.end), 'จํานวน', 'the slice cut the decomposed vowel in half');
});

test('a Latin accent that NFC composes does not shift the Thai after it', async () => {
  // 'e' + COMBINING ACUTE is two code units that NFC makes one; a map built
  // on the normalised string is then one short for everything after it.
  const page = 'café latte เชื้อแบคทีเรีย';
  const hit = findIn(page, 'เชื้อ');
  assert.ok(hit);
  assert.equal(page.slice(hit.at, hit.end), 'เชื้อ');
  const latin = findIn(page, 'café');
  assert.ok(latin, 'the composed spelling in the query did not match the decomposed page');
  assert.equal(page.slice(latin.at, latin.end).normalize('NFC'), 'café');
});

test('Thai digits, run breaks and a tone slip all keep original offsets', async () => {
  const page = 'ปี ๒๕๖๘​ การ​วินิจ ฉัย​โรค';
  const year = findIn(page, '2568');
  assert.equal(page.slice(year.at, year.end), '๒๕๖๘');
  const exact = findIn(page, 'วินิจฉัย');
  assert.equal(exact.loose, false);
  assert.equal(page.slice(exact.at, exact.end).replace(/[\s​]/g, ''), 'วินิจฉัย');
  const loose = findIn(page, 'วินิจฉย'); // no ั
  assert.equal(loose.loose, true);
  assert.equal(page.slice(loose.at, loose.end).replace(/[\s​]/g, ''), 'วินิจฉัย');
});

test('English offsets are original too, past an invisible prefix', async () => {
  const page = '​​see the cat';
  const hit = findIn(page, 'the cat');
  assert.equal(page.slice(hit.at, hit.end), 'the cat');
});
