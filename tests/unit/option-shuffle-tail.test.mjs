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
