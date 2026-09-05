import assert from 'node:assert/strict';
import test from 'node:test';

import { needsFigure } from '../../scripts/lib/question-standard.mjs';

test('a Fig. locator cannot pass without its figure', () => {
  assert.equal(needsFigure({ id: 999991, q: 'คำกำกับใต้ Fig. 1 ระบุอะไร' }), true);
});

test('PDF line breaks and spaces cannot hide a missing figure', () => {
  for (const q of ['จาก ภาพ ลูกศรระบุอวัยวะใด', 'ดัง\nรูป รอยโรคนี้เกิดจากอะไร', 'ตาม ภาพเป็นพยาธิชนิดใด']) {
    assert.equal(needsFigure({ id: 999993, q }), true);
  }
  assert.equal(needsFigure({ id: 999994, q: 'จาก ภาพรวมของการระบาด ควรเฝ้าระวังอะไร' }), false);
  assert.equal(needsFigure({ id: 999995, q: 'การประเมินจาก รูปแบบการแพร่เชื้อจัดเป็นแบบใด' }), false);
});

test('a self-contained anatomy question does not require its source figure', () => {
  assert.equal(needsFigure({
    id: 999992,
    q: 'คู่ส่วนสมองปลาและหน้าที่ใดถูกต้อง',
  }), false);
});
