// ============================================================
// bench-view-practice.test.mjs — the epidemiology bench says what it holds
// ============================================================
// OV-tools-36. The contents list printed "บทเรียนหลัก (60 นาที)" from a
// literal, while the eight core sections add up to 62. The label now follows
// the data, so editing a section's minutes cannot leave the list wrong.
//
// OV-tools-37. A check locks after one pick, and the only way to answer it
// again was "เริ่มนับใหม่", which appears once at least one check is cleared.
// A student whose first answers were all wrong had to reload the page. A wrong
// answer now offers "ลองอีกครั้ง" on that check.
//
// The real view is compiled from source and mounted under react-dom; the
// screening bench widget is stood in for, it is covered by its own tests.
// ============================================================
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';

import { ALL_CHECKS, MODULE5 } from '../../src/data/epi-module5.js';
import {
  bundleModule, buttonsWithText, click, findAll, installDom, mountElement, stubModule,
} from './helpers/mini-dom.mjs';

let dom;
let bundle;
let mod;

before(async () => {
  dom = installDom();
  bundle = await bundleModule({
    prefix: 'bench-view-',
    contents: "export { default as BenchView } from './src/views/BenchView.jsx';",
    plugins: [stubModule(/ScreeningBench\.jsx$/, 'export default function ScreeningBench() { return null; }')],
  });
  mod = bundle.mod;
});

after(() => {
  bundle?.dispose();
  dom?.restore();
});

const mountBench = (t) => mountElement(t, mod, dom.document, mod.createElement(mod.BenchView, {}));
const byClass = (root, cls) => findAll(root, (n) => (n.getAttribute('class') || '').split(/\s+/).includes(cls));
const textOf = (node) => node.textContent.replace(/\s+/g, ' ').trim();

const minutesOf = (group) => MODULE5.sections
  .filter((s) => s.group === group)
  .reduce((sum, s) => sum + (s.minutes || 0), 0);

test('each contents group prints the minutes its sections add up to', async (t) => {
  const { container } = await mountBench(t);
  const heads = byClass(container, 'vmx-lesson__tochead').map(textOf);
  assert.deepEqual(heads, [
    `บทเรียนหลัก (${minutesOf('core')} นาที)`,
    `ช่วงขยาย (${minutesOf('extended')} นาที)`,
  ]);
  // The labels must be the sums of what the page lists, not a second copy.
  const listed = byClass(container, 'vmx-lesson__sectionmin').map(textOf);
  assert.equal(listed.length, MODULE5.sections.length);
  const listedCore = MODULE5.sections
    .map((s, i) => (s.group === 'core' ? Number.parseInt(listed[i], 10) : 0))
    .reduce((a, b) => a + b, 0);
  assert.equal(listedCore, minutesOf('core'));
});

const firstCheck = MODULE5.sections[0].checks[0];
const wrongIndex = (check) => (check.answer + 1) % check.options.length;

const firstCheckNode = (container) => byClass(container, 'vmx-check')[0];
const optionButtons = (checkNode) => byClass(checkNode, 'vmx-check__option');
const pick = (checkNode, index) => click(mod, optionButtons(checkNode)[index]);
const progressLabel = (container) => textOf(byClass(container, 'vmx-lesson__progresslabel')[0]);

test('a wrong answer offers a retry that unlocks the check again', async (t) => {
  const { container } = await mountBench(t);
  assert.ok(firstCheck, 'section 1 has a check');
  const check = firstCheckNode(container);

  assert.equal(buttonsWithText(check, 'ลองอีกครั้ง').length, 0, 'nothing to retry before an answer');

  await pick(check, wrongIndex(firstCheck));
  assert.match(textOf(check), /ยังไม่ใช่/);
  assert.ok(optionButtons(check).every((b) => b.hasAttribute('disabled')), 'the check is locked after one pick');
  assert.equal(progressLabel(container), `ตอบถูกแล้ว 0 จาก ${ALL_CHECKS.length} ข้อ`);
  assert.equal(buttonsWithText(container, 'เริ่มนับใหม่').length, 0, 'the old reset is hidden while nothing is cleared');

  const retry = buttonsWithText(check, 'ลองอีกครั้ง');
  assert.equal(retry.length, 1, 'a wrong answer shows one retry button');
  await click(mod, retry[0]);

  assert.doesNotMatch(textOf(check), /ยังไม่ใช่/, 'the verdict is gone');
  assert.ok(optionButtons(check).every((b) => !b.hasAttribute('disabled')), 'the options accept a pick again');
  assert.equal(buttonsWithText(check, 'ลองอีกครั้ง').length, 0);

  await pick(check, firstCheck.answer);
  assert.match(textOf(check), /ถูกต้อง/);
  assert.equal(progressLabel(container), `ตอบถูกแล้ว 1 จาก ${ALL_CHECKS.length} ข้อ`);
  assert.equal(buttonsWithText(check, 'ลองอีกครั้ง').length, 0, 'a right answer needs no retry');
  assert.deepEqual(JSON.parse(dom.storage.getItem('vmx-epi-m5-progress-v1')), [firstCheck.id], 'the cleared check is remembered');
});

test('a right answer first time never shows a retry', async (t) => {
  const { container } = await mountBench(t);
  const check = firstCheckNode(container);
  await pick(check, firstCheck.answer);
  assert.match(textOf(check), /ถูกต้อง/);
  assert.equal(buttonsWithText(check, 'ลองอีกครั้ง').length, 0);
});

test('the bench renders without a React warning', () => {
  assert.deepEqual(dom.consoleErrors, []);
});
