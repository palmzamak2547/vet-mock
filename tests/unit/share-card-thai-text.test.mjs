// ============================================================
// share-card-thai-text.test.mjs: share-card lines keep a number with its
// unit, can be balanced, and never strand a mark (canvas-wrap)
// ============================================================
// The old share cards drew each line whole and truncated with s.slice(0, n),
// which cut a consonant from its tone mark ("การถ่ายภาพทางส…" lost the ั).
// They now lay out through canvas-wrap. A stand-in measure (10 px a cluster)
// checks the rules the cards rely on, on top of tests/unit/canvas-wrap.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { breakUnits, breakClusters, wrapLines, keepTogether } from '../../src/lib/canvas-wrap.js';

const graphemes = new Intl.Segmenter('th', { granularity: 'grapheme' });
const measure = (s) => Array.from(graphemes.segment(String(s).replace(/\u00a0/gu, ' '))).length * 10;
const startsWithMark = (line) => /^\p{M}/u.test(line);
const words = new Intl.Segmenter('th', { granularity: 'word' });
// Word edges of the original text, counted without its spaces.
const wordBoundaries = (s) => {
  const ends = new Set([0]);
  let at = 0;
  for (const { segment } of words.segment(s)) {
    if (/^\s+$/u.test(segment)) continue;
    at += segment.length;
    ends.add(at);
  }
  return ends;
};

test('a number keeps its unit, and the space between them cannot break', () => {
  assert.ok(breakUnits('ทำไป 1,240 ข้อในเทอมนี้').includes('1,240\u00a0ข้อ'));
  assert.ok(breakUnits('อ่านต่อเนื่อง 14 วัน').includes('14\u00a0วัน'));
  const lines = wrapLines(measure, 'ทำข้อสอบไปแล้ว 1,240 ข้อ', 100);
  assert.ok(lines.some((l) => l.includes('1,240\u00a0ข้อ')), lines.join(' / '));
});

test('lines break only between words and never start with a mark', () => {
  const text = 'ทำข้อสอบไปแล้ว 1,240 ข้อในเทอมนี้ แม่นยำขึ้นเรื่อยๆ ทุกสัปดาห์ เก่งมากที่อ่านต่อเนื่องแม้ช่วงสอบจะหนัก';
  for (const width of [80, 120, 160, 200, 260, 340]) {
    for (const balance of [false, true]) {
      const lines = wrapLines(measure, text, width, { balance });
      const flat = text.replace(/\s+/gu, '');
      assert.equal(lines.join('').replace(/[\s\u00a0]+/gu, ''), flat, `${width}: text changed`);
      const edges = wordBoundaries(text);
      let at = 0;
      for (const [i, line] of lines.entries()) {
        assert.ok(!startsWithMark(line), `${width}: "${line}" starts with a mark`);
        assert.ok(measure(line) <= width, `${width}: "${line}" is too wide`);
        if (i === lines.length - 1) break;
        at += line.replace(/[\s\u00a0]+/gu, '').length;
        assert.ok(edges.has(at), `${width}: a break inside a word after "${line}"`);
      }
    }
  }
});

test('การ and ความ stay with the word they make into a noun', () => {
  assert.ok(breakUnits('ยาต้านการอักเสบที่ไม่ใช่สเตียรอยด์').includes('การอักเสบ'));
  assert.ok(breakUnits('ความดันโลหิตสูง').some((u) => u.startsWith('ความดัน')));
  const text = 'สุนัขได้รับยาต้านการอักเสบที่ไม่ใช่สเตียรอยด์ต่อเนื่อง และมีความดันโลหิตสูงเป็นเวลานาน';
  for (const width of [90, 120, 150, 180, 220, 260]) {
    for (const line of wrapLines(measure, text, width, { balance: true }).slice(0, -1)) {
      assert.ok(!/(การ|ความ)$/u.test(line), `${width}: "${line}" ends on a prefix`);
    }
  }
});

test('balanced lines keep the count and are as even as it allows', () => {
  const text = 'ทำไปเยอะมาก ใจสู้ ขอให้สอบผ่านทุกวิชาเลย';
  const greedy = wrapLines(measure, text, 300);
  const even = wrapLines(measure, text, 300, { balance: true });
  assert.equal(even.length, greedy.length);
  const spread = (ls) => Math.max(...ls.map(measure)) - Math.min(...ls.map(measure));
  assert.ok(spread(even) <= spread(greedy), `${even.join(' / ')} vs ${greedy.join(' / ')}`);
});

test('a one-line cut is made between clusters, with one ellipsis', () => {
  const name = 'การถ่ายภาพทางสัตวแพทย์ คลินิกสูติกรรมสัตว์เล็ก';
  for (const width of [60, 90, 130, 170]) {
    const [out] = wrapLines(measure, name, width, { maxLines: 1 });
    assert.ok(out.endsWith('…'), out);
    assert.ok(measure(out) <= width, out);
    const kept = out.slice(0, -1);
    assert.ok(name.startsWith(kept), `${width}: "${kept}" is not a start of the name`);
    assert.ok(!/^\p{M}/u.test(name.slice(kept.length)), `${width}: a mark was cut from "${kept}"`);
  }
  assert.deepEqual(breakClusters('สัตว์'), ['สั', 'ต', 'ว์']);
});

// From the stress sweep over every card the IG studio can draw (13 Oct 2026):
// breaks a reader trips on, each now held together.
const lineStarts = (text, re) => {
  // From 200 px (20 clusters): a glued phrase wider than the line is cut by
  // cluster, the last resort, and no card is that narrow.
  for (let width = 200; width <= 400; width += 10) {
    for (const line of wrapLines(measure, text, width)) if (re.test(line)) return `${width}: "${line}"`;
  }
  return null;
};

test('ๆ and ฯ never start a line, with or without the space before them', () => {
  assert.ok(breakUnits('วงกลมซ้ำ ๆ แล้ว').includes('ซ้ำ\u00a0ๆ'));
  assert.equal(lineStarts('ต้องทำซ้ำ ๆ จนกว่าจะชิน และทำซ้ำๆ ทุกวัน', /^[ๆฯ]/u), null);
});

test('a silent final (ซ์ ด์) and the rest of an open syllable stay with the syllable they end', () => {
  for (const text of ['โรคแอนแทรกซ์ในโค', 'ยาสเตียรอยด์ระยะยาว', 'นมพาสเจอร์ไรส์', 'ยาอะม็อกซีซิลลิน']) {
    const units = breakUnits(text);
    assert.ok(!units.some((u) => /^[ก-ฮ][ิุ]?์/u.test(u)), `${text}: ${units.join(' | ')}`);
    assert.ok(!units.join('|').includes('เจ|อ') && !units.join('|').includes('็|อ'), `${text}: ${units.join(' | ')}`);
    assert.ok(!units.some((u) => /^[ก-ฮ]$/u.test(u)), `${text}: a lone consonant ${units.join(' | ')}`);
  }
  // Chromium's dictionary split these where Node's does not: the rules hold on its pieces too.
  assert.deepEqual(keepTogether(['วัคซี', 'น']), ['วัคซีน']);
  assert.deepEqual(keepTogether(['สเตียรอย', 'ด์']), ['สเตียรอยด์']);
  assert.deepEqual(keepTogether(['พาสเจ', 'อร์ไรส์']), ['พาสเจอร์ไรส์']);
});

test('a Thai abbreviation stays whole and keeps the number after it', () => {
  // Chromium splits พ.ศ. into พ. and ศ.
  assert.ok(keepTogether(['(ฉบับ', 'ที่', ' ', '406)', ' ', 'พ.', 'ศ.', ' ', '2562']).includes('พ.ศ.'));
  assert.ok(breakUnits('(ฉบับที่ 406) พ.ศ. 2562 ตรวจพบ').includes('พ.ศ.\u00a02562'));
  assert.ok(keepTogether(['ตาม', ' ', 'พ.', 'ร.', 'บ.', ' ', 'ควบคุม']).includes('พ.ร.บ.'));
  assert.ok(breakUnits('ค.ศ. 2020').includes('ค.ศ.\u00a02020'));
});

test('a number keeps its Latin or Thai unit, its exponent and the comparison before it', () => {
  assert.ok(breakUnits('Dexamethasone 0.01 mg/kg').includes('0.01\u00a0mg/kg'));
  assert.ok(breakUnits('ความดัน 45 mmHg').includes('45\u00a0mmHg'));
  assert.ok(breakUnits('CRT 4 วินาที').includes('4\u00a0วินาที'));
  assert.ok(breakUnits('ทุก 6 ชั่วโมง, ต่อ').includes('6\u00a0ชั่วโมง,'));
  assert.ok(breakUnits('ค่า 10⁻⁷ M').includes('10⁻⁷\u00a0M'));
  assert.ok(breakUnits('CRT > 3 วินาที').some((u) => u.includes('>\u00a03\u00a0วินาที')));
  assert.ok(breakUnits('ค่า ≥ 3.0 mmol/L').some((u) => u.includes('≥\u00a03.0\u00a0mmol/L')));
  assert.equal(lineStarts('ถ้า CRT > 3 วินาที และค่า ≥ 3.0 mmol/L ให้ยา ± butorphanol', /^[<>≤≥±=]/u), null);
});

test('พระราช stays one word, a comparison holds its short left side, and an arrow may open a line', () => {
  assert.deepEqual(keepTogether(['และ', 'พระ', 'ราชบัญญัติ']), ['และ', 'พระราชบัญญัติ']);
  assert.ok(breakUnits('80 ml ÷ 4 hr = 70 + maintenance').some((u) => u.includes('hr\u00a0=\u00a070')));
  assert.ok(breakUnits('Methods → Results → Discussion').includes('→'), 'a chain of steps may break before an arrow');
});

test("a vet's compounds stay whole however the browser's dictionary splits them", () => {
  // Chromium's pieces, from the studio sweep; Node's dictionary keeps these whole.
  assert.deepEqual(keepTogether(['ใน', 'ขั้น', 'ตอน', ' ', 'Advanced']), ['ใน', 'ขั้นตอน', ' ', 'Advanced']);
  assert.deepEqual(keepTogether(['กล้าม', 'เนื้อ', 'ลาย']), ['กล้ามเนื้อ', 'ลาย']);
  assert.deepEqual(keepTogether(['ให้', 'ยาปฏิ', 'ชีวนะ']), ['ให้', 'ยาปฏิชีวนะ']);
  assert.deepEqual(keepTogether(['ขั้น', ' ', 'ตอน']), ['ขั้น', ' ', 'ตอน'], 'a space between is the writer\'s own break');
});

test('ทาง stays with the field it names, so a subject title never ends a line on it', () => {
  assert.ok(breakUnits('เภสัชวิทยาทางสัตวแพทย์ II').includes('ทางสัตวแพทย์'));
  for (let width = 80; width <= 240; width += 10) {
    for (const line of wrapLines(measure, 'การถ่ายภาพทางการแพทย์ และเภสัชวิทยาทางสัตวแพทย์ II', width, { balance: true })) {
      assert.ok(!/ทาง$/u.test(line), `${width}: "${line}"`);
    }
  }
});
