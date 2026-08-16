// The orthography check must be silent on real Thai and loud on broken
// encoding. Both halves matter: a first version called "อยู่" and "คู่"
// violations, which put clean questions at the top of the report, and a check
// that cries wolf gets ignored exactly when it is right.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orthographyViolations } from '../../scripts/lib/../lint-thai-orthography.mjs';

test('silent on ordinary Thai, including below-vowel + tone', () => {
  for (const s of [
    'solitary nucleus จัดเป็น nuclei ชนิดใด และวางตัวอยู่ส่วนใดของ medulla oblongata',
    'ข้อใดจับคู่เอนไซม์ในน้ำนมกับบทบาทได้ถูกต้อง',
    'ระยะฟักตัวของ listeriosis จากการบริโภคน้ำนมดิบคือช่วงใด',
    'เนื้องอกชนิดนี้ถ่ายทอดโดยการสัมผัสโดยตรง เช่น การผสมพันธุ์',
  ]) {
    assert.equal(orthographyViolations(s).count, 0, `false positive on: ${s}`);
  }
});

test('loud on the vowel reordering a bad PDF text layer produces', () => {
  // pdftotext on a Thai deck emits leading vowels after their consonant and
  // tone marks adrift — this is the corruption CLAUDE.md warns about.
  const broken = 'ก่ีอนใหญ่ เ่ปน ข้อใด';
  assert.ok(orthographyViolations(broken).count > 0, 'must flag detached tone marks');
});

test('a tone mark with no consonant under it is flagged', () => {
  assert.ok(orthographyViolations('เ่ำ').count > 0);
  assert.ok(orthographyViolations('  ้  ').count > 0);
});

test('CANNOT catch spellable nonsense — documented, not a gap to paper over', () => {
  // The stem that started this: every syllable is legal Thai, the sentence
  // means nothing. Character rules pass it, and so does word segmentation.
  // Only a reader catches this class.
  const gibberish = 'พระวาเทินการีอินส่งกู่เพราะที่กรืในที่ลึงมีอะไหล่ทอนใจ';
  assert.equal(orthographyViolations(gibberish).count, 0,
    'if this ever becomes non-zero the check got stronger — update the claim in the header');
});
