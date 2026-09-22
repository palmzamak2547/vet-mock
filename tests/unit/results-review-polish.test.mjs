// ============================================================
// Results and Review: what the student reads after a set
// ============================================================
// Three small defects on the screens a student lands on after every
// revision set, each pinned where it actually went wrong: the shareable
// Story card captioned a different verdict from the screen it was shared
// from, some labels were unreadable in dark mode, and the separator the
// app does not use in UI copy crept back into this week's surfaces.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const results = read('../../src/views/ResultsView.jsx');

// ---------------------------------------------------------------
// COPY-01: the Story card's caption ladder
// ---------------------------------------------------------------
// buildScoreCard draws on a canvas and cannot be rendered here, so the
// caption ladder is lifted out of the source and run as written, with the
// same `reached` line the function itself uses.
function cardCaption({ correct, total, isWritingOnly = false }) {
  const fn = results.slice(results.indexOf('function buildScoreCard('), results.indexOf('// Phase label map'));
  const reachedLine = fn.match(/const reached = [^;]+;/)?.[0];
  const from = fn.indexOf('let msg =');
  const ladder = fn.slice(from, fn.indexOf('ctx.font', from));
  assert.ok(reachedLine && ladder.includes('msg'), 'the caption ladder must still be findable in buildScoreCard');
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  // eslint-disable-next-line no-new-func
  return new Function('PRACTICE_PASS_PCT', 'pct', 'correct', 'total', 'isWritingOnly',
    `${reachedLine}\n${ladder}\nreturn msg;`)(60, pct, correct, total, isWritingOnly);
}

// The in-app message the card has to agree with, read the same way.
function screenMessage({ correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const start = results.indexOf('const reached = score.total > 0');
  const reachedLine = results.slice(start, results.indexOf(';', start) + 1);
  const msgStart = results.indexOf('const msg = autoQs.length === 0');
  const msgExpr = results.slice(msgStart, results.indexOf(';', msgStart) + 1);
  // eslint-disable-next-line no-new-func
  return new Function('PRACTICE_PASS_PCT', 'score', 'autoQs', 'writingAttempted', 'writingQs',
    `${reachedLine}\n${msgExpr}\nreturn msg;`)(60, { correct, total, pct }, { length: total }, 0, []);
}

// Width on the 1080 px canvas is set by what the eye sees, so Thai
// combining marks (vowels above and below, tone marks) do not count.
const visibleGlyphs = (s) => [...s.replace(/\p{M}/gu, '')].length;

test('COPY-01: the Story card reaches the same verdict as the Results screen', () => {
  const cases = [
    { correct: 20, total: 20, head: 'ถูกทุกข้อ' },
    { correct: 19, total: 20, head: 'แม่นดีมาก' },
    { correct: 17, total: 20, head: 'แม่นดีมาก' },
    { correct: 13, total: 20, head: 'ถึงเกณฑ์ซ้อม' },
    { correct: 12, total: 20, head: 'ถึงเกณฑ์ซ้อม' },
    // 28/47 rounds to 60 but did not reach the bar, on either surface.
    { correct: 28, total: 47, head: 'ยังมีจุดที่ควรทบทวน' },
    { correct: 9, total: 20, head: 'ยังมีจุดที่ควรทบทวน' },
  ];
  for (const c of cases) {
    const card = cardCaption(c);
    const screen = screenMessage(c);
    assert.ok(card.startsWith(c.head), `${c.correct}/${c.total}: the card says "${card}"`);
    assert.ok(screen.startsWith(c.head), `${c.correct}/${c.total}: the screen says "${screen}"`);
  }
  assert.equal(cardCaption({ correct: 20, total: 20 }), 'ถูกทุกข้อ รักษาระดับนี้ไว้');
  assert.equal(cardCaption({ correct: 17, total: 20 }), 'แม่นดีมาก ลองเพิ่มจำนวนข้อดู');
  assert.equal(cardCaption({ correct: 13, total: 20 }), 'ถึงเกณฑ์ซ้อมแล้ว ทบทวนข้อที่ผิดต่อ');
  assert.equal(cardCaption({ correct: 9, total: 20 }), 'ยังมีจุดที่ควรทบทวน เริ่มจากข้อที่ผิด');
  assert.equal(cardCaption({ correct: 5, total: 20 }), 'เริ่มใหม่ได้เสมอ');
});

test('COPY-01: no card caption claims a pass, and every one fits the canvas line', () => {
  const captions = new Set([{ correct: 0, total: 3, isWritingOnly: true }]
    .concat(Array.from({ length: 21 }, (_, correct) => ({ correct, total: 20 })))
    .concat([{ correct: 28, total: 47 }, { correct: 0, total: 0 }])
    .map(cardCaption));
  for (const msg of captions) {
    assert.ok(!msg.includes('ผ่าน'), `the app does not grade a pass: "${msg}"`);
    assert.ok(!/ครับ|ค่ะ/.test(msg), `no polite particle appears anywhere else in UI copy: "${msg}"`);
    assert.ok(!msg.includes('ใกล้แล้ว'), `80 percent and up is not "almost there": "${msg}"`);
    // 30 is the widest caption the card has always drawn at 44 px.
    assert.ok(visibleGlyphs(msg) <= 30, `"${msg}" is ${visibleGlyphs(msg)} glyphs wide`);
  }
});
