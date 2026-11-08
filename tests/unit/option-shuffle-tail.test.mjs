// ============================================================
// "ไม่มีข้อใดถูก" belongs on the last row, like "none of the above"
// ============================================================
// getShuffledOptions pins all/none-of-the-above rows to the bottom while
// the rest shuffle. Its TAIL_RE matched Thai rows that START with ถูกทั้ง /
// ผิดทุก / ทั้ง… — and the corpus's own "none of the above", ไม่มีข้อใดถูก,
// starts with ไม่มี, so it landed in the head and Fisher-Yates put it
// anywhere. "1. ไม่มีข้อใดถูก" above four real options reads as a broken
// question. Every one of the 23 authored instances had it last.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { getShuffledOptions } from '../../src/lib/option-shuffle.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const q = (id, options) => ({ id, options });
const NONE = 'ไม่มีข้อใดถูก';

test('ไม่มีข้อใดถูก renders last for every question and every session seed', () => {
  for (let id = 1; id <= 300; id++) {
    const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', 'd', NONE]));
    assert.equal(displayOptions[4], NONE, `id ${id}: none-of-the-above moved to row ${displayOptions.indexOf(NONE) + 1}`);
  }
});

test('the ไหน and ผิด variants pin too', () => {
  for (const tail of ['ไม่มีข้อไหนถูก', 'ไม่มีข้อใดผิด', 'ไม่มีข้อถูก']) {
    for (let id = 1; id <= 60; id++) {
      const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', tail]));
      assert.equal(displayOptions[3], tail, `${tail} did not stay last for id ${id}`);
    }
  }
});

test('ไม่มีข้อกำหนด is a real answer, not a tail, and still shuffles', () => {
  // "no requirement" is an ordinary option in the food-hygiene bank; pinning
  // it would give the answer away by position.
  let moved = 0;
  for (let id = 1; id <= 200; id++) {
    const { displayOptions } = getShuffledOptions(q(id, ['ไม่มีข้อกำหนด', 'b', 'c', 'd']));
    if (displayOptions[0] !== 'ไม่มีข้อกำหนด') moved++;
  }
  assert.ok(moved > 0, 'a real option was pinned by the tail rule');
});

// ── ทั้ง… says "both" or "the whole", and is usually the answer itself ───
// The rule pinned every row that starts with ทั้ง and a consonant. In this
// bank those rows are content: "ทั้งสองชนิดอุ้มไข่ไว้ที่ท้อง…", "ทั้งคู่ใช้ deep
// skin scraping", "ทั้งคืนไม่มีการสังเคราะห์แสง…", 95 rows in 64 questions.
// Pinned, each kept one row for every student, and where it was the key the
// key never moved: aquatic-clinic 204045 always showed it as E.
const THANG_CONTENT = [
  'ทั้งสองชนิดอุ้มไข่ไว้ที่ท้องจนกระทั่งไข่ฟักออกเป็นตัวอ่อน',
  'ทั้งคู่ใช้ deep skin scraping',
  'ทั้งคืนไม่มีการสังเคราะห์แสงแต่ยังใช้ออกซิเจน DO จึงต่ำสุดตอนเช้า',
  'ทั้งฟาร์มเพาะสุนัขและสถานพยาบาลสัตว์เข้าข่าย และต้องขออนุญาตซ้ำกับเจ้าพนักงานท้องถิ่นทุกปี',
  'ทั้งยุงและ Culicoides เป็นพาหะร่วมกันทั้งสองกลุ่ม',
  'ทั้งสองเหมือนกัน',
  'ทั้งหมด 50%',
  'ทั้งคู่ ~50%',
  // ถูก as the passive, not a verdict; ข้อ as a joint, not an option.
  'ทั้งสองถูกขับออกทางไต',
  'ทั้งสองข้อต่ออักเสบ',
];

test('a row that only starts with ทั้ง is content and still shuffles', () => {
  for (const content of THANG_CONTENT) {
    let moved = 0;
    for (let id = 1; id <= 200; id++) {
      const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', content]));
      if (displayOptions[3] !== content) moved++;
    }
    assert.ok(moved > 100, `"${content}" left the last row only ${moved}/200 times: it is being pinned`);
  }
});

test('a ทั้ง… row that sums up the options stays last', () => {
  const tails = [
    'ทั้งหมด', 'ทั้งหมดถูก', 'ทั้งหมดถูกต้อง', 'ทั้งหมดผิด', 'ทั้งหมดที่กล่าวมา', 'ทั้งหมดข้างต้น', 'ทั้งหมดนี้',
    'ทั้งสองข้อ', 'ทั้งสามข้อถูก', 'ทั้งคู่', 'ทั้งคู่ถูก', 'ทั้งสอง', 'ทั้งข้อ ก และ ข',
  ];
  for (const tail of tails) {
    for (let id = 1; id <= 60; id++) {
      const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', tail]));
      assert.equal(displayOptions[3], tail, `"${tail}" did not stay last for id ${id}`);
    }
  }
});

test('in a question with ทั้ง… rows the key can sit on any row', async () => {
  const all = [];
  for (const bank of BANK_REGISTRY) all.push(...(await bank.load()));
  // Each id stands for another session: the order is seeded by id and session.
  // The first four keys are ทั้ง… rows; in cliapprum 2121 two pinned ทั้ง…
  // distractors held rows C and D, so its key only ever showed as A or B.
  for (const key of ['aquatic-clinic:204045', 'equine-medicine:207523', 'food-industry:207074', 'swine-clinic:105586', 'cliapprum:2121']) {
    const x = all.find((item) => `${item.subject}:${item.id}` === key);
    assert.ok(x && x.options.some((o) => String(o).startsWith('ทั้ง')), `${key} no longer has a ทั้ง… row`);
    const rows = new Set();
    for (let id = 1; id <= 200; id++) rows.add(getShuffledOptions({ ...x, id }).originalToDisplay[x.answer]);
    assert.equal(rows.size, x.options.length, `${key}: the key only ever showed as ${[...rows].sort().map((r) => 'ABCDE'[r]).join(', ')}`);
  }
});

// ── Catch-alls the rule did not know ─────────────────────────────────────
// "All correct" and "All incorrect" (poultry 1744-1751) and "ไม่มีข้อใดกล่าวผิด"
// (repro-lect 52062) are authored last, as every other catch-all is, but no
// alternative matched them, so they shuffled above the options they cover.
test('All correct, All incorrect and ไม่มีข้อใดกล่าวผิด stay last like the other catch-alls', () => {
  for (const tail of ['All correct', 'All incorrect', 'all correct.', 'ไม่มีข้อใดกล่าวผิด', 'ไม่มีข้อใดกล่าวถูก', 'ไม่มีข้อไหนกล่าวผิด']) {
    for (const n of [4, 5]) {
      for (let id = 1; id <= 60; id++) {
        const heads = Array.from({ length: n - 1 }, (_, i) => `option-${i}`);
        const { displayOptions } = getShuffledOptions(q(id, [...heads, tail]));
        assert.equal(displayOptions[n - 1], tail, `"${tail}" (id ${id}, ${n} options) landed on row ${displayOptions.indexOf(tail) + 1}`);
      }
    }
  }
  for (let id = 1; id <= 60; id++) {
    const { displayOptions } = getShuffledOptions(q(id, ['a', 'b', 'c', 'All correct', 'All incorrect']));
    assert.deepEqual(displayOptions.slice(3), ['All correct', 'All incorrect'], `poultry 1749's two catch-alls, id ${id}`);
  }
  // A sentence that only begins with the words is an answer, and shuffles.
  const sentence = 'All correct doses depend on body weight';
  let moved = 0;
  for (let id = 1; id <= 200; id++) {
    if (getShuffledOptions(q(id, ['a', 'b', 'c', sentence])).displayOptions[3] !== sentence) moved++;
  }
  assert.ok(moved > 100, `"${sentence}" left the last row only ${moved}/200 times: it is being pinned`);
});

test('every authored All correct, All incorrect and ไม่มีข้อใดกล่าวผิด in the real corpus stays on its bottom row', async () => {
  const all = [];
  for (const bank of BANK_REGISTRY) all.push(...(await bank.load()));
  const CATCH_ALL = /^(?:all\s+(?:in)?correct|ไม่มีข้อ(?:ใด|ไหน)?กล่าว(?:ถูก|ผิด))\s*\.?$/i;
  const withOne = all.filter((x) => Array.isArray(x?.options) && x.noShuffle !== true
    && x.options.some((o) => CATCH_ALL.test(String(o).trim())));
  assert.ok(withOne.length >= 7, `expected the corpus's All correct / ไม่มีข้อใดกล่าวผิด questions, found ${withOne.length}`);
  for (const x of withOne) {
    const label = `${x.subject}:${x.id}`;
    const tails = x.options.flatMap((o, i) => (CATCH_ALL.test(String(o).trim()) ? [i] : []));
    const bottom = tails.map((_, k) => x.options.length - tails.length + k);
    assert.deepEqual(tails, bottom, `${label} authored a catch-all above an ordinary option`);
    assert.deepEqual(getShuffledOptions(x).displayToOriginal.slice(-tails.length), tails, `${label} shuffled a catch-all off the bottom`);
  }
});

test('every authored ไม่มีข้อใดถูก in the real corpus is last, and stays last on screen', async () => {
  const all = [];
  for (const bank of BANK_REGISTRY) all.push(...(await bank.load()));
  const withNone = all.filter((x) => Array.isArray(x?.options) && x.options.some((o) => String(o).trim() === NONE));
  assert.ok(withNone.length >= 20, `expected the corpus's none-of-the-above questions, found ${withNone.length}`);
  for (const x of withNone) {
    const last = x.options.length - 1;
    assert.equal(String(x.options[last]).trim(), NONE, `${x.subject}:${x.id} authored ${NONE} somewhere other than last`);
    const { displayOptions } = getShuffledOptions(x);
    assert.equal(String(displayOptions[last]).trim(), NONE, `${x.subject}:${x.id} shuffled ${NONE} off the last row`);
  }
});
