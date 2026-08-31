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
