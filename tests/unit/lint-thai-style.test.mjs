// ============================================================
// lint:thai-style holds the house style a pattern can judge (docs/THAI-STYLE.md)
// ============================================================
// Palm, 14 Nov 2026: the product's Thai should read like real people talking,
// with nothing odd in it and nothing hyped. Most of that needs a reader. A
// few phrases nearly always have a plainer form in an interface, and those
// are counted per file and may only go down.
//
// Each rule is pinned on both sides: the phrases it must catch, taken from
// the product's own strings, and the ordinary Thai that shares their letters
// and must pass (ทำการ์ด, ความสามารถ, ถูกต้อง, ตอบถูกเพิ่มขึ้น, รายการโปรด,
// ไม่มีการคุมสอบ). A rule that cries wolf gets switched off, so the second
// half matters as much as the first.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  RULES, ruleHits, findIssues, lintTree, lowerBudget, compareBudget, readBudget, BUDGET_FILE,
} from '../../scripts/lint-thai-style.mjs';
import { extractStrings } from '../../scripts/lint-ui-copy.mjs';

const rulesOf = (text) => ruleHits(text).map((h) => h.rule);
const hits = (text, rule) => rulesOf(text).includes(rule);

const CASES = {
  'tham-kan': {
    catch: ['ทำการบันทึกข้อมูล', 'กดเพื่อทำการลบ'],
    pass: ['ยังไม่มีข้อสอบให้ทำการ์ด', 'ทำการบ้านเสร็จแล้ว', 'เวลาทำการ 8.00 น.'],
  },
  'mii-kan-event': {
    catch: ['ข้อมูลตารางสอบอาจมีการเปลี่ยนแปลง', 'เอกสารจะขึ้นที่นี่เมื่อมีการเพิ่มเข้าคลัง'],
    pass: ['เป็นผลฝึกทำเอง ไม่มีการคุมสอบ', 'มีการติดเชื้อร่วมด้วย', 'มีการ์ดทั้งหมด 12 ใบ'],
  },
  'in-order-to': {
    catch: ['เพื่อที่จะเริ่มใช้งาน', 'ในการที่จะส่งผลสอบ'],
    pass: ['เพื่อเริ่มใช้งาน', 'ใช้ในการตรวจ'],
  },
  'samart-dai': {
    catch: ['ไม่สามารถกู้คืนได้', 'ไม่สามารถเปิดไมค์ได้'],
    pass: ['Infectivity คือความสามารถทำให้ติดเชื้อ', 'กู้คืนไม่ได้'],
  },
  'passive-thuk': {
    catch: ['ความคืบหน้าจะถูกเก็บไว้ให้กลับมาทำต่อได้', 'ข้อความถูกส่งไปที่ทีมงาน', 'จะถูกดึงเข้าคิวทบทวน'],
    pass: ['คำตอบถูกต้อง', 'ถูกตั้งแต่ครั้งแรก', 'ข้อที่ตอบถูกเพิ่มขึ้น 5 ข้อ', 'ชื่อนี้ถูกใช้ไปแล้ว', 'ตอบถูกส่งผลให้คะแนนขึ้น', 'ถูก/ผิด'],
  },
  'essay-connector': {
    catch: ['อย่างไรก็ตาม ข้อมูลยังอยู่', 'นอกจากนี้ยังเปิดสรุปได้', 'ทั้งนี้ขึ้นกับวิชา'],
    pass: ['ข้อมูลยังอยู่ แต่ยังไม่ซิงก์', 'ทั้งหมด 20 ข้อ'],
  },
  please: {
    catch: ['กรุณาลองใหม่', 'บันทึกไม่สำเร็จ โปรดลองใหม่', 'โปรดยืนยันกับหัวปีอีกครั้ง'],
    pass: ['เพิ่มในรายการโปรด', 'ของโปรดของ Mochi', 'ลองใหม่อีกครั้ง', 'เปิดโปรแกรมอ่าน PDF', 'โปรไฟล์'],
  },
  'riap-roi': {
    catch: ['นำเข้าข้อมูลเรียบร้อยแล้ว', '✓ บันทึกโปรไฟล์เรียบร้อย'],
    pass: ['ความเรียบร้อยของแผล', 'บันทึกแล้ว'],
  },
  'dam-noen-kan': {
    catch: ['ดำเนินการต่อด้วย Google'],
    pass: ['ไปต่อด้วย Google'],
  },
  hype: {
    catch: ['สุดยอดมากเลย!', 'เก่งสุดๆ เลย', 'สู้ๆ นะ', 'เทพ!', 'ลุยต่อกันนะ'],
    pass: ['ถูก 18 จาก 20 ข้อ', 'ทำต่อจากครั้งล่าสุด', 'จุดสูงสุดของกราฟ'],
  },
  'thai-exclamation': {
    catch: ['สมัครสำเร็จ!', 'คัดลอกรหัสแล้ว ส่งให้เพื่อนได้เลย !'],
    pass: ['บันทึกแล้ว', 'Hello!', 'x !== y', 'สมัครแล้ว (Beta!)'],
  },
};

test('every rule has cases on both sides, and the docs section it points to exists', () => {
  const guide = readFileSync(new URL('../../docs/THAI-STYLE.md', import.meta.url), 'utf8');
  for (const rule of RULES) {
    assert.ok(CASES[rule.id], `${rule.id} has test cases`);
    assert.ok(CASES[rule.id].catch.length && CASES[rule.id].pass.length, `${rule.id} has both sides`);
    assert.match(guide, new RegExp(`^#+ ${rule.section.replace('.', '\\.')}[ .]`, 'm'), `THAI-STYLE.md has section ${rule.section} for ${rule.id}`);
  }
});

for (const [id, { catch: bad, pass: good }] of Object.entries(CASES)) {
  test(`${id}: catches the stiff form and passes ordinary Thai`, () => {
    for (const text of bad) assert.ok(hits(text, id), `${id} should catch: ${text}`);
    for (const text of good) assert.ok(!hits(text, id), `${id} should pass: ${text}`);
  });
}

test('only copy is read: patterns, logs and content keys are left alone', () => {
  const src = `
    const a = s.replace('กรุณา', '');
    console.log('กรุณาลองใหม่');
    const q = { explain: 'อย่างไรก็ตาม ยาตัวนี้ไม่ใช่ตัวเลือกแรก' };
    export default () => <p>กรุณาลองใหม่</p>;
  `;
  const found = findIssues(extractStrings(src, 'src/views/Fixture.jsx'));
  assert.deepEqual(found.map((h) => [h.rule, h.text]), [['please', 'กรุณาลองใหม่']]);
});

test('English-only strings are never read', () => {
  const found = findIssues(extractStrings('export default () => <p>Done!</p>;', 'src/views/Fixture.jsx'));
  assert.deepEqual(found, []);
});

test('the budget only goes down, and drops rows at zero', () => {
  const counts = Object.fromEntries(RULES.map((r) => [r.id, {}]));
  counts.please = { 'a.jsx': 2, 'b.jsx': 5 };
  const budget = { rules: { please: { 'a.jsx': 3, 'b.jsx': 4, 'c.jsx': 1 } } };
  const next = lowerBudget(budget, counts);
  assert.deepEqual(next.rules.please, { 'a.jsx': 2, 'b.jsx': 4 });
  // With no budget yet, today's counts become the caps.
  assert.deepEqual(lowerBudget(null, counts).rules.please, { 'a.jsx': 2, 'b.jsx': 5 });
});

test('a file over its budget fails, a file with no row may have none', () => {
  const counts = Object.fromEntries(RULES.map((r) => [r.id, {}]));
  counts.hype = { 'a.jsx': 2 };
  assert.deepEqual(compareBudget(counts, { rules: { hype: { 'a.jsx': 2 } } }).ok, true);
  assert.deepEqual(compareBudget(counts, { rules: { hype: { 'a.jsx': 1 } } }).over, [{ rule: 'hype', file: 'a.jsx', n: 2, cap: 1 }]);
  assert.deepEqual(compareBudget(counts, { rules: {} }).over, [{ rule: 'hype', file: 'a.jsx', n: 2, cap: 0 }]);
});

test('the tree is within its recorded budget, and an empty budget would fail it', () => {
  assert.ok(existsSync(new URL(`../../${BUDGET_FILE}`, import.meta.url)), `${BUDGET_FILE} is committed`);
  const result = lintTree({ budget: readBudget() });
  assert.deepEqual(result.over, [], 'new Thai that reads as translated, stiff or hyped; see docs/THAI-STYLE.md');
  assert.ok(result.hits.length > 0, 'the scan reads the product');
  assert.equal(compareBudget(result.counts, { rules: {} }).ok, false);
});
