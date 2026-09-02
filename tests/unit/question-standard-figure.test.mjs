import assert from 'node:assert/strict';
import test from 'node:test';

import { needsFigure } from '../../scripts/lib/question-standard.mjs';

test('a Fig. locator cannot pass without its figure', () => {
  assert.equal(needsFigure({ id: 999991, q: 'คำกำกับใต้ Fig. 1 ระบุอะไร' }), true);
});

test('a self-contained anatomy question does not require its source figure', () => {
  assert.equal(needsFigure({
    id: 999992,
    q: 'คู่ส่วนสมองปลาและหน้าที่ใดถูกต้อง',
  }), false);
});
