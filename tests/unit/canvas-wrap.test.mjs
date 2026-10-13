// ============================================================
// canvas-wrap.test.mjs — card text wraps at Thai word boundaries
// ============================================================
// OV-tools-34. The Instagram card studio cut lines at spaces only. A Thai
// question stem has few spaces, so it was one unbreakable word and ran past
// the edge of the card. canvas-wrap breaks at the word boundaries Intl.Segmenter
// finds, and breaks a word wider than a whole line by grapheme without ever
// separating a base character from its marks.
//
// The width function here gives every mark zero width and every other letter
// the same width, so each assertion is about where lines break, not about a
// font. Every invariant is checked at many widths.
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { breakUnits, drawWrappedText, wrapLines } from '../../src/lib/canvas-wrap.js';

const GLYPH = 10;
const SPACE_W = 4;
const measure = (s) => [...s].reduce((w, ch) => w + (/\p{M}/u.test(ch) ? 0 : /\s/.test(ch) ? SPACE_W : GLYPH), 0);

const THAI_STEMS = [
  'สุนัขเพศผู้อายุสามปีมีอาการซึมและเบื่ออาหารมาสองวันตรวจร่างกายพบไข้เยื่อเมือกซีดตรวจเลือดพบเกล็ดเลือดต่ำข้อใดคือการวินิจฉัยแยกโรคที่เหมาะสมที่สุด',
  'โคนมอายุห้าปีคลอดลูกตัวที่สามเมื่อสัปดาห์ที่แล้วมีน้ำนมลดลงอย่างรวดเร็วและไม่กินอาหารหยาบ',
  'ไก่เนื้ออายุสามสัปดาห์ในโรงเรือนระบบปิดแสดงอาการหายใจลำบากและมีเสียงหวีดในหลอดลมโดยอัตราการตายสูงขึ้นอย่างรวดเร็ว',
  'ลูกสุกรแรกคลอดถ่ายเหลวสีเหลืองและอาเจียนภายในสามวันแรกของชีวิตเกิดในฝูงที่ไม่เคยได้รับวัคซีนมาก่อน',
];
const MIXED_STEMS = [
  'อุณหภูมิร่างกาย 40.2 องศาเซลเซียส (ค่าปกติ 38.0-39.2) ตรวจพบ E. coli จำนวน 1,500 โคโลนี และ Salmonella spp. ในอุจจาระ',
  'ข้อใดถูกต้อง: ก) ใช้ยา ข) งดอาหาร ค) ให้น้ำเกลือ 5% ง) ผ่าตัดทันที?!',
  'สุนัขน้ำหนัก 12.5 กก. ได้รับยา "amoxicillin" ขนาด 20 มก./กก. ทุก 12 ชม. นาน 7 วัน',
];
const WIDTHS = [60, 80, 100, 120, 150, 200, 250, 300, 400, 600];

const MARK_OR_FOLLOWER = /^[\p{M}ะ-ฺๅ-๎]/u;
const LEADING_VOWEL_END = /[เ-ไ]$/;
const strip = (s) => s.replace(/\s+/g, '');

function assertWellFormed(text, lines, maxW, label) {
  assert.ok(lines.length > 0, `${label}: some lines`);
  for (const line of lines) {
    assert.ok(measure(line) <= maxW, `${label}: "${line}" is ${measure(line)} wide, over ${maxW}`);
    assert.equal(line, line.trim(), `${label}: no stray space at the ends of "${line}"`);
    assert.ok(!MARK_OR_FOLLOWER.test(line), `${label}: "${line}" starts with a mark or a following vowel`);
    assert.ok(!LEADING_VOWEL_END.test(line), `${label}: "${line}" ends on a leading vowel`);
  }
  assert.equal(strip(lines.join('')), strip(text), `${label}: nothing dropped, nothing repeated, order kept`);
}

test('no line is wider than the card, at every width, for Thai with and without spaces', () => {
  for (const text of [...THAI_STEMS, ...MIXED_STEMS]) {
    for (const maxW of WIDTHS) assertWellFormed(text, wrapLines(measure, text, maxW), maxW, `${text.slice(0, 12)} @${maxW}`);
  }
});

test('the old behaviour is gone: a Thai stem with no spaces is no longer one line', () => {
  const stem = THAI_STEMS[0];
  assert.ok(measure(stem) > 1000, 'the stem is far wider than a card line');
  const lines = wrapLines(measure, stem, 840);
  assert.ok(lines.length >= 2);
  assert.ok(lines.every((l) => measure(l) <= 840));
});

test('lines break only at Thai word boundaries when every word fits', () => {
  const seg = new Intl.Segmenter('th', { granularity: 'word' });
  for (const text of THAI_STEMS) {
    const ends = new Set();
    let widest = 0;
    for (const s of seg.segment(text)) {
      ends.add(s.index + s.segment.length);
      widest = Math.max(widest, measure(s.segment));
    }
    for (const maxW of WIDTHS.filter((w) => w >= widest + 10)) {
      const lines = wrapLines(measure, text, maxW);
      let at = 0;
      lines.slice(0, -1).forEach((line) => {
        at += line.length;
        assert.ok(ends.has(at), `@${maxW}: broke inside a word after "${line}"`);
      });
    }
  }
});

test('digits, decimals and the marks next to a word stay with it', () => {
  const text = MIXED_STEMS[0];
  for (const maxW of WIDTHS.filter((w) => w >= 100)) {
    const lines = wrapLines(measure, text, maxW);
    for (const number of text.match(/\d+(?:[.,-]\d+)*/g)) {
      assert.ok(lines.some((l) => l.includes(number)), `@${maxW}: "${number}" was split across lines`);
    }
    for (const line of lines.slice(1)) {
      assert.ok(!/^[,.;:!?)\]%]/.test(line), `@${maxW}: "${line}" starts with closing punctuation`);
    }
    for (const line of lines.slice(0, -1)) {
      assert.ok(!/[(\["“‘]$/.test(line), `@${maxW}: "${line}" ends with an opening bracket or quote`);
    }
  }
});

test('a word wider than the line is broken by grapheme, never mid-cluster', () => {
  const longThai = 'ภาวะแทรกซ้อนที่เกิดจากการติดเชื้อแบคทีเรียในกระแสเลือด'.replace(/\s/g, '');
  const longLatin = 'Pneumonoultramicroscopicsilicovolcanoconiosis';
  for (const text of [longThai, longLatin]) {
    for (const maxW of [50, 80, 120]) {
      for (const segment of [true, false]) {
        const lines = wrapLines(measure, text, maxW, { segment });
        assertWellFormed(text, lines, maxW, `${text.slice(0, 8)} @${maxW} segment=${segment}`);
        assert.equal(lines.join(''), text);
      }
    }
  }
});

test('without Intl.Segmenter the fallback still keeps marks with their base', () => {
  for (const text of [...THAI_STEMS, ...MIXED_STEMS]) {
    for (const maxW of WIDTHS) {
      assertWellFormed(text, wrapLines(measure, text, maxW, { segment: false }), maxW, `fallback ${text.slice(0, 12)} @${maxW}`);
    }
  }
  assert.deepEqual(breakUnits('ab cd', { segment: false }), ['ab', ' ', 'cd']);
});

test('maxLines keeps at most that many lines and ends the last with an ellipsis', () => {
  const text = THAI_STEMS[0];
  for (const maxLines of [1, 2, 3]) {
    for (const maxW of [100, 200, 300]) {
      const lines = wrapLines(measure, text, maxW, { maxLines });
      assert.equal(lines.length, maxLines, `@${maxW}: ${maxLines} lines`);
      const last = lines[lines.length - 1];
      assert.ok(last.endsWith('…'), `@${maxW}: "${last}" should end with an ellipsis`);
      assert.ok(lines.every((l) => measure(l) <= maxW), `@${maxW}: every line fits, the ellipsis included`);
      assert.ok(!LEADING_VOWEL_END.test(last.replace(/…$/, '')), `@${maxW}: the cut does not strand a leading vowel`);
    }
  }
  const short = 'ตอบสั้น ๆ';
  // ๆ keeps a no-break space to the word it repeats.
  assert.deepEqual(wrapLines(measure, short, 400, { maxLines: 2 }).map((l) => l.replace(/\u00a0/gu, ' ')), [short], 'text that fits gets no ellipsis');
  const exactlyTwo = wrapLines(measure, 'กขคงจฉชซ กขคงจฉชซ', 100, { maxLines: 2 });
  assert.ok(!exactlyTwo.join('').includes('…'), 'text that just fits in maxLines gets no ellipsis');
});

test('empty and whitespace-only text draw nothing', () => {
  assert.deepEqual(wrapLines(measure, '', 100), []);
  assert.deepEqual(wrapLines(measure, '  \n\t ', 100), []);
  assert.deepEqual(wrapLines(measure, undefined, 100), []);
});

test('newlines and runs of spaces collapse to one space', () => {
  assert.deepEqual(wrapLines(measure, 'ab\n\ncd   ef', 1000), ['ab cd ef']);
});

test('a single grapheme wider than the line still makes progress', () => {
  const lines = wrapLines(measure, 'กขค', 5);
  assert.deepEqual(lines, ['ก', 'ข', 'ค']);
});

test('drawWrappedText draws each line one line height apart and says how many it drew', () => {
  const drawn = [];
  const ctx = {
    measureText: (s) => ({ width: measure(s) }),
    fillText: (s, x, y) => drawn.push([s, x, y]),
  };
  const n = drawWrappedText(ctx, THAI_STEMS[1], 80, 290, 300, 67);
  assert.equal(n, drawn.length);
  assert.ok(n >= 2);
  drawn.forEach(([line, x, y], i) => {
    assert.equal(x, 80);
    assert.equal(y, 290 + i * 67);
    assert.ok(measure(line) <= 300);
  });
  assert.equal(drawWrappedText(ctx, 'ข้อความยาวมากกว่าสองบรรทัดแน่นอนเพราะไม่มีช่องว่างเลยสักที่', 0, 0, 100, 10, 2), 2);
});

test('the IG card studio wraps with this module and keeps no copy of the space-only splitter', () => {
  // The studio draws through the share-card kit, whose text goes through here.
  const view = readFileSync(new URL('../../src/views/IgCardStudioView.jsx', import.meta.url), 'utf8');
  const card = readFileSync(new URL('../../src/lib/share-card/ig-card.js', import.meta.url), 'utf8');
  const kit = readFileSync(new URL('../../src/lib/share-card/kit.js', import.meta.url), 'utf8');
  assert.match(view, /from '\.\.\/lib\/share-card\/ig-card\.js'/);
  assert.match(card, /from '\.\/kit\.js'/);
  assert.match(kit, /from '\.\.\/canvas-wrap\.js'/);
  for (const src of [view, card, kit]) {
    assert.doesNotMatch(src, /function wrapText/);
    assert.doesNotMatch(src, /split\(\/\(\\s\+\)\/\)/);
  }
});
