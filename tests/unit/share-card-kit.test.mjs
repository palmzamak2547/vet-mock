// ============================================================
// share-card-kit.test.mjs: the share cards' rules that need no canvas
// ============================================================
// The cards are drawn in the browser (tests/e2e/share-cards.spec.js reads
// the drawn files back). What decides a card's words, dates, colours and
// layout is plain code, tested here.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PALETTES, thaiDate, layoutProblems, fitCard, STORY, POST, LIVE, SIZE } from '../../src/lib/share-card/kit.js';
import { academicYear, phaseLine } from '../../src/lib/share-card/phase-card.js';
import { studyTime, subjectRows } from '../../src/lib/phase-wrapped.js';
import { dailyTitle, dailyLine } from '../../src/lib/share-card/daily-card.js';
import { cleanText, cardOptions } from '../../src/lib/share-card/ig-card.js';

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

test('every colour a card sets text in reads at 4.5:1 on its paper, light and dark', () => {
  for (const [theme, p] of Object.entries(PALETTES)) {
    for (const key of ['ink', 'soft', 'sage', 'rose', 'gold']) {
      const c = contrast(p[key], p.bg);
      assert.ok(c >= 4.5, `${theme}.${key} ${p[key]} on ${p.bg} is ${c.toFixed(2)}:1`);
    }
  }
});

test('dates print in Thai with the Buddhist year; the academic year turns in June', () => {
  assert.equal(thaiDate('2026-10-13'), '13 ต.ค. 2569');
  assert.equal(thaiDate(new Date(2027, 0, 5)), '5 ม.ค. 2570');
  assert.equal(thaiDate('not a date'), '');
  assert.equal(thaiDate(null), '');
  assert.equal(academicYear('2026-10-10'), 2569);
  assert.equal(academicYear('2027-03-20'), 2569, 'term 2 belongs to the year it began in');
  assert.equal(academicYear('2027-06-01'), 2570);
  assert.equal(academicYear('nope'), null);
});

test('the recap line claims only what the numbers show', () => {
  assert.equal(phaseLine({ qCount: 0 }), '');
  assert.match(phaseLine({ qCount: 120, correctPct: 88, longestStreak: 9 }), /แม่นและสม่ำเสมอ/);
  assert.match(phaseLine({ qCount: 120, correctPct: 81, longestStreak: 2 }), /แม่นยำ/);
  assert.match(phaseLine({ qCount: 120, correctPct: 50, longestStreak: 15 }), /สองสัปดาห์/);
  assert.match(phaseLine({ qCount: 499, correctPct: 50, longestStreak: 3 }), /ทุกข้อที่ทำ/, '499 is not "more than five hundred"');
  assert.match(phaseLine({ qCount: 500, correctPct: 50, longestStreak: 3 }), /ห้าร้อย/);
  assert.match(phaseLine({ qCount: 80, correctPct: 64, longestStreak: 3 }), /ถึงเกณฑ์ซ้อม/);
  assert.doesNotMatch(phaseLine({ qCount: 200, correct: 119, correctPct: 60, longestStreak: 3 }), /ถึงเกณฑ์/,
    '119 of 200 is 59.5%, rounded up to 60 on screen but short of the bar');
  assert.doesNotMatch(phaseLine({ qCount: 120, correctPct: 90, longestStreak: 9 }), /เทอม/, 'a phase is half a term');
  for (const s of [{ qCount: 80, correctPct: 64 }, { qCount: 80, correctPct: 30 }]) {
    assert.ok(!phaseLine(s).includes('ผ่าน'), 'practice reaches a bar; it is not graded a pass');
  }
  assert.deepEqual(studyTime(390), ['6.5', 'ชม.']);
  assert.deepEqual(studyTime(930), ['16', 'ชม.']);
  assert.deepEqual(studyTime(598), ['10', 'ชม.'], '598 min used to print "10.0" beside 600 min\'s "10"');
  assert.deepEqual(studyTime(75_000), ['1,250', 'ชม.']);
  assert.deepEqual(studyTime(40), ['40', 'นาที']);
  assert.deepEqual(studyTime(0.4), ['<1', 'นาที'], 'one question used to read "0.0 ชม."');
});

test('the daily card names the day plainly and encourages without inventing', () => {
  assert.equal(dailyTitle('correct'), 'วันนี้ตอบถูก');
  assert.equal(dailyTitle('wrong'), 'วันนี้พลาด');
  assert.equal(dailyTitle('missed'), 'ข้อประจำวัน');
  assert.match(dailyLine({ todayStatus: 'correct', streak: 8, correct: 7, total: 7 }), /ตอบถูกครบทั้งสัปดาห์/);
  // The streak counts days answered, right or wrong: a nine-day run with two
  // wrong days in the visible week is not "right for more than a week".
  assert.doesNotMatch(dailyLine({ todayStatus: 'correct', streak: 9, correct: 5, total: 7 }), /ตอบถูก/);
  assert.match(dailyLine({ todayStatus: 'correct', streak: 9, correct: 5, total: 7 }), /เกินสัปดาห์/);
  assert.doesNotMatch(dailyLine({ todayStatus: 'correct', streak: 7, correct: 5, total: 7 }), /เกินสัปดาห์/, 'seven days is a week, not more');
  assert.match(dailyLine({ todayStatus: 'correct', streak: 1, correct: 1, total: 7 }), /อีกหนึ่งข้อ/);
  assert.match(dailyLine({ todayStatus: 'wrong', streak: 0, correct: 6, total: 7 }), /วันเดียว/);
  assert.ok(!/[\u{1F300}-\u{1FAFF}]/u.test(dailyLine({ todayStatus: 'wrong', streak: 0, correct: 1, total: 7 })), 'no emoji on a drawn card');
});

test('an IG card shows what a student reads, with ถูก and ผิด for a true-or-false', () => {
  assert.equal(cleanText('**ยา**  ★ ต้าน\nการอักเสบ'), 'ยา ต้าน การอักเสบ');
  assert.deepEqual(cardOptions({ type: 'tf' }), ['ถูก', 'ผิด']);
  assert.deepEqual(cardOptions({ type: 'mcq', options: ['a', '**b**', 'c', 'd', 'e', 'f'] }), ['a', 'b', 'c', 'd', 'e']);
});

const box = (text, left, top, right, bottom, extra = {}) => ({ text, left, top, right, bottom, size: SIZE.s, role: 'text', ...extra });

test('the layout check catches text outside the frame, too small, or running into another', () => {
  const ok = box('ข้อ', LIVE.left, LIVE.top, LIVE.left + 100, LIVE.top + 60);
  assert.deepEqual(layoutProblems([ok]), []);
  assert.match(layoutProblems([box('a', LIVE.left - 20, LIVE.top, LIVE.left + 50, LIVE.top + 40)])[0], /sideways/);
  assert.match(layoutProblems([box('a', LIVE.left, LIVE.bottom - 10, LIVE.left + 50, LIVE.bottom + 30)])[0], /live area/);
  assert.match(layoutProblems([box('ข้อ', LIVE.left, LIVE.top, LIVE.left + 50, LIVE.top + 30, { size: 30 })])[0], /30 px/);
  const overlap = layoutProblems([ok, box('วัน', LIVE.left + 50, LIVE.top + 30, LIVE.left + 150, LIVE.top + 90)]);
  assert.ok(overlap.some((p) => p.includes('runs into')));
  // The post frame has its own live area.
  assert.deepEqual(layoutProblems([box('a', POST.live.left, POST.live.top, POST.live.left + 40, POST.live.top + 40)], { frame: POST }), []);
});

test('fitCard takes the largest clean size, opens the gaps it can, and draws only the answer in full', () => {
  const calls = [];
  // A fake card: content height grows with size and gap; anything taller
  // than the live area is a problem.
  const draw = (size, gap, dry) => {
    calls.push({ size, gap, dry });
    const height = size * 100 + gap * 200;
    return { frame: STORY, boxes: [box('x', LIVE.left, LIVE.top, LIVE.left + 10, LIVE.top + height)] };
  };
  const live = LIVE.bottom - LIVE.top; // 1158
  const { card, problems } = fitCard({ sizes: [12, 9, 6], maxGap: 2, draw });
  assert.deepEqual(problems, []);
  const final = calls[calls.length - 1];
  assert.equal(final.dry, false, 'the last call draws in full');
  assert.equal(calls.filter((c) => !c.dry).length, 1, 'only one full drawing');
  assert.equal(final.size, 9, '12 does not fit (1400 px), 9 does');
  // The largest gap that keeps 40 px above the signature: 900 + 200 g <= 1118.
  assert.ok(final.gap > 1 && 900 + final.gap * 200 <= live - 40 + 1e-6, `gap ${final.gap}`);
  assert.equal(card.boxes[0].bottom - card.boxes[0].top, 900 + final.gap * 200);
});

// A stand-in canvas: every glyph is half its font size wide, and each canvas
// records the text set on it, so a test can see what a card would print.
function fakeCanvas() {
  const printed = [];
  const ctx = new Proxy({ font: '10px x' }, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'measureText') {
        return (s) => {
          const size = Number(/(\d+(?:\.\d+)?)px/.exec(t.font)?.[1] || 10);
          const width = [...String(s)].length * size * 0.5;
          // As a real canvas does: the ink's left edge measured from the pen, by alignment.
          const left = t.textAlign === 'right' ? width : t.textAlign === 'center' ? width / 2 : 0;
          const descent = /[gjpqy]/.test(String(s)) ? size * 0.35 : size * 0.05;
          return { width, actualBoundingBoxLeft: left, actualBoundingBoxRight: width - left, actualBoundingBoxAscent: size * 0.8, actualBoundingBoxDescent: descent };
        };
      }
      if (k === 'fillText') return (s) => printed.push(String(s));
      return () => {};
    },
    set(t, k, v) { t[k] = v; return true; },
  });
  return { width: 0, height: 0, printed, getContext: () => ctx };
}

test('an IG card sets a long option smaller instead of cutting it, and reports one that cannot fit', async () => {
  globalThis.document = { createElement: fakeCanvas };
  try {
    const { drawIgCard } = await import('../../src/lib/share-card/ig-card.js');
    // 80 characters: three lines at 44 px (36 a line), two at 36 px (45 a line).
    const long = 'abcd '.repeat(16).trim();
    const fits = drawIgCard({ type: 'mcq', q: 'question', options: [long, 'b', 'c', 'd', 'e'] });
    assert.deepEqual(fits.problems, []);
    assert.ok(fits.card.canvas.printed.includes('b'), 'the stand-in recorded the card');
    assert.ok(!fits.card.canvas.printed.some((s) => s.endsWith('…')), 'an option was printed with its end cut off');
    const huge = 'abcd '.repeat(60).trim();
    const tooLong = drawIgCard({ type: 'mcq', q: 'question', options: [huge, 'b', 'c', 'd', 'e'] });
    assert.ok(tooLong.problems.some((p) => /option A is cut short/.test(p)), tooLong.problems.join('; '));
  } finally {
    delete globalThis.document;
  }
});

test('a card waits for every font face it sets', async () => {
  // The first card drawn after a cold load used the fallback for any face
  // missing here: the options (Plex 500) and the artwork credit (Fraunces 400).
  const { LOADS } = await import('../../src/lib/share-card/fonts.js');
  const waited = new Set(LOADS.map(([font]) => font.replace(' 64px ', ' ')));
  const family = { serif: '"VetMock Card Serif"', numeral: '"Fraunces"', label: '"IBM Plex Sans Thai"' };
  const set = new Set();
  for (const name of readdirSync('src/lib/share-card')) {
    const src = readFileSync(`src/lib/share-card/${name}`, 'utf8');
    for (const m of src.matchAll(/weight: (\d+)[^}]*?family: FAMILY\.(\w+)/g)) set.add(`${m[1]} ${family[m[2]]}`);
    for (const m of src.matchAll(/fontOf\((\d+), [^,]+, FAMILY\.(\w+)\)/g)) set.add(`${m[1]} ${family[m[2]]}`);
  }
  assert.ok(set.size >= 6, `found ${set.size} faces`);
  // The serif is one variable face; Fraunces has 400, 600 and 800, and 700 draws with 800.
  const face = (f) => f.replace(/^\d+ "VetMock Card Serif"/, '700 "VetMock Card Serif"').replace(/^700 "Fraunces"/, '800 "Fraunces"');
  for (const f of set) assert.ok(waited.has(face(f)), `${f} is set on a card but not loaded first`);
});

test('the score card names a mixed set for what it is, and claims writing only when there was some', async () => {
  globalThis.document = { createElement: fakeCanvas };
  try {
    const { drawScoreCard, scoreLine } = await import('../../src/lib/share-card/score-card.js');
    // The results screen passes 'all' for any set of more than one subject.
    const { card } = drawScoreCard({ pct: 75, correct: 15, total: 20, passPct: 60, mode: 'practice', subjectName: null, completedAt: Date.UTC(2026, 9, 13) }, {});
    assert.ok(card.canvas.printed.includes('หลายวิชา'), card.canvas.printed.slice(0, 6).join(' | '));
    assert.ok(!card.canvas.printed.includes('รวมทุกวิชา'), 'a three-subject set was called every subject');
    assert.doesNotMatch(scoreLine({ isWritingOnly: true, writingDone: 0 }), /เขียนตอบแล้ว/);
    assert.match(scoreLine({ isWritingOnly: true, writingDone: 2 }), /เขียนตอบแล้ว/);
  } finally {
    delete globalThis.document;
  }
});

test('card.fit sizes a title by its ink, which can reach past its advance', async () => {
  // Chromium set a long recap title 1.2 px past the column: its ink is wider
  // than the advance width the fit used to read.
  const ctx = {
    font: '',
    measureText() {
      const size = Number(/(\d+)px/.exec(ctx.font)[1]);
      return { width: size * 10, actualBoundingBoxLeft: 0, actualBoundingBoxRight: size * 10.04 };
    },
  };
  globalThis.document = { createElement: () => ({ getContext: () => ctx }) };
  try {
    const { createCard } = await import('../../src/lib/share-card/kit.js');
    const card = createCard('light', 1, STORY);
    assert.equal(card.fit('x', 1000, { max: 100, min: 50 }), 99, 'at 100 px the ink is 1004 px wide in a 1000 px column');
    assert.equal(card.fit('x', 2000, { max: 100, min: 50 }), 100);
  } finally {
    delete globalThis.document;
  }
});

test('a paragraph reports its ink bottom and its line-box bottom, the second the same whatever the glyphs', async () => {
  const ctx = {
    font: '',
    textAlign: 'left',
    fillText() {},
    measureText(s) {
      const size = Number(/(\d+)px/.exec(ctx.font)[1]);
      const deep = /[gjpqy]/.test(s);
      return { width: s.length * size * 0.5, actualBoundingBoxLeft: 0, actualBoundingBoxRight: s.length * size * 0.5, actualBoundingBoxAscent: size * 0.7, actualBoundingBoxDescent: deep ? size * 0.35 : size * 0.02 };
    },
  };
  globalThis.document = { createElement: () => ({ getContext: () => ctx }) };
  try {
    const { createCard } = await import('../../src/lib/share-card/kit.js');
    const card = createCard('light', 1, STORY);
    const deep = card.para('ag', 100, 400, 800, { size: 48 });
    const flat = card.para('aa', 100, 400, 800, { size: 48 });
    assert.ok(flat.bottom < deep.bottom, 'bottom is the ink');
    assert.equal(flat.lineBottom, deep.lineBottom);
  } finally {
    delete globalThis.document;
  }
});

test('the options on an IG card sit an even step apart, whatever their glyphs', async () => {
  // They ran unevenly: an option with no vowel below ended higher, and the
  // next one was set closer to it.
  globalThis.document = { createElement: fakeCanvas };
  try {
    const { drawIgCard } = await import('../../src/lib/share-card/ig-card.js');
    const { card } = drawIgCard({ type: 'mcq', q: 'question', options: ['gap', 'aaa', 'gap', 'aaa'] });
    const tops = card.boxes.filter((b) => b.role === 'letter').map((b) => b.top);
    const steps = tops.slice(1).map((t, i) => t - tops[i]);
    assert.equal(steps.length, 3);
    assert.ok(Math.max(...steps) - Math.min(...steps) < 0.5, `steps ${steps.join(', ')}`);
  } finally {
    delete globalThis.document;
  }
});

test('the recap names one subject plainly, and shows a weakest only when it is lower', () => {
  const a = { id: 'a', name: 'COM V', pct: 0 };
  assert.deepEqual(subjectRows({ strongestSubject: a, weakestSubject: a }), { best: { label: 'วิชาที่ฝึก', subject: a, single: true }, weak: null },
    'one subject at 0% was "ทำได้ดีที่สุด" in green');
  const b = { id: 'b', name: 'B', pct: 75 };
  const c = { id: 'c', name: 'C', pct: 75 };
  assert.equal(subjectRows({ strongestSubject: b, weakestSubject: c }).weak, null, 'a tie is not "needs review"');
  const d = { id: 'd', name: 'D', pct: 50 };
  assert.equal(subjectRows({ strongestSubject: b, weakestSubject: d }).weak.subject, d);
  assert.deepEqual(subjectRows({}), { best: null, weak: null });
});

test('a score short of the practice bar says by how much', async () => {
  globalThis.document = { createElement: fakeCanvas };
  try {
    const { drawScoreCard } = await import('../../src/lib/share-card/score-card.js');
    const short = drawScoreCard({ pct: 60, correct: 28, total: 47, passPct: 60, mode: 'practice', subjectName: 'X', completedAt: Date.UTC(2026, 9, 13) }, {});
    // The number keeps its unit with a no-break space.
    const plain = (card) => card.canvas.printed.map((t) => t.replace(/\u00a0/gu, ' '));
    assert.ok(plain(short.card).includes('อีก 1 ข้อถึงเกณฑ์ซ้อม'), '28 of 47 showed 60 beside a 60% bar and nothing else');
    const reached = drawScoreCard({ pct: 60, correct: 12, total: 20, passPct: 60, mode: 'practice', subjectName: 'X', completedAt: Date.UTC(2026, 9, 13) }, {});
    assert.ok(!plain(reached.card).some((t) => t.startsWith('อีก')));
    const big = drawScoreCard({ pct: 100, correct: 99998, total: 99999, passPct: 60, mode: 'practice', subjectName: 'X', completedAt: Date.UTC(2026, 9, 13) }, {});
    assert.ok(plain(big.card).includes('ถูก 99,998 จาก 99,999 ข้อ'), plain(big.card).join(' | '));
  } finally {
    delete globalThis.document;
  }
});
