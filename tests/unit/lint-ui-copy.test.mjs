// ============================================================
// lint:ui-copy keeps middle dots and นักศึกษา out of the screens (COPY-11)
// ============================================================
// Middle dots had been cleaned out of screen after screen by hand, and came
// back with every new one: 32 lines were left in the atlas pages and their
// exported images, the Mochi lab, the calculator and the back office, because
// only the video summaries and the glossary were ever checked for them. Only
// UI copy is held to it: a question explanation or a cited source keeps what
// its source wrote, and a regex that strips a leading dot off a label is how
// copy gets cleaned, not copy.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  extractStrings, findIssues, lintTree, lowerBudget, readBudget, BUDGET_FILE,
} from '../../scripts/lint-ui-copy.mjs';

const issues = (source, file = 'src/views/Fixture.jsx', options) => findIssues(extractStrings(source, file), options);
const dots = (source, file, options) => issues(source, file, options).dots.map((r) => r.text);

test('a middle dot anywhere a screen shows text fails', () => {
  const cases = [
    'export default () => <p>สำรวจ · เปรียบเทียบ</p>;',
    'export default ({ n }) => <span>{n} ตัวอย่าง · ชนิดสัตว์</span>;',
    'export default () => <button aria-label="ปิด · ออก" />;',
    'export default () => <input placeholder="ไทย · English" />;',
    'export default () => <a title="เปิด · ปิด" />;',
    'export default ({ on }) => <span>{on ? "ภาพ · 3D" : "ภาพ"}</span>;',
    'export default ({ s }) => <em>{`${s} · ของสัตว์`}</em>;',
    'export const go = () => confirmDialog({ title: "ลบ?", body: "ลบแล้ว · เอากลับไม่ได้" });',
    'export const go = () => showToast("บันทึกแล้ว · ซิงก์แล้ว");',
    'export const go = (el) => { el.textContent = "รอเล่นต่อ · กดอีกครั้ง"; };',
    'export const go = (ctx) => ctx.fillText(`Atlas · ${1}`, 0, 0);',
    'export const go = (xs) => xs.filter(Boolean).join(" · ");',
    'export default () => <Result label="RER (30·BW + 70)" />;',
  ];
  for (const source of cases) assert.equal(dots(source).length, 1, source);
});

test('นักศึกษา in UI copy fails; the reader is นิสิต', () => {
  assert.equal(issues('export default () => <p>สำหรับนักศึกษาสัตวแพทย์</p>;').students.length, 1);
  assert.equal(issues('export default () => <p>สำหรับนิสิตสัตวแพทย์</p>;').students.length, 0);
});

test('patterns, logs, comments and content keep their middle dots', () => {
  const clean = [
    "export const f = (s) => s.replace(/^[\\d\\s.·\\-]+/, '').trim();",
    "export const f = (s) => s.replace('·', ', ');",
    "export const f = (s) => s.split(' · ');",
    "export const f = (s) => s.includes('·');",
    "export const re = new RegExp('[·•]');",
    "export const f = () => console.warn('cache · miss');",
    '// สำรวจ · เปรียบเทียบ\nexport const x = 1;',
    '/* a · b */\nexport default () => <p>{/* a · b */}ok</p>;',
    "export const q = { explain: 'CuSO4·5H2O ใช้ได้', why: 'ก · ข' };",
    "export const claim = { statement: 'ขั้นตอน · pasteurization', review: { rationale: '229 of 902 (25·4%)' } };",
  ];
  for (const source of clean) assert.deepEqual(dots(source), [], source);
});

test('a reviewed allow-list entry exempts exactly that text in that file', () => {
  const source = "export default ({ xs }) => <p>{xs.join('  ·  ').replace(/·/g, '—')}</p>;";
  const allow = [{ file: 'src/components/SummaryModal.jsx', text: '  ·  ', reason: 'replaced on the same line' }];
  assert.deepEqual(dots(source, 'src/components/SummaryModal.jsx', { allow }), []);
  assert.equal(dots(source, 'src/components/Other.jsx', { allow }).length, 1);
  assert.equal(dots("export default () => <p>{' · '}</p>;", 'src/components/SummaryModal.jsx', { allow }).length, 1);
});

test('English words the app already has Thai for are counted only where a screen renders them', () => {
  const found = issues([
    'export default () => (<div className="Next">',
    '  <button aria-label="Export">x</button>',
    '  <button>Next</button>',
    '  {console.log("Sync")}',
    '</div>);',
  ].join('\n')).leaks;
  assert.deepEqual(found.map((l) => l.token).sort(), ['Export', 'Next']);
});

test('the English-word budget only goes down, and a new file starts at zero', () => {
  const before = { englishLeaks: { 'src/views/A.jsx': 3, 'src/views/B.jsx': 2 } };
  const after = lowerBudget(before, { 'src/views/A.jsx': 5, 'src/views/B.jsx': 1, 'src/views/New.jsx': 4 });
  assert.deepEqual(after.englishLeaks, { 'src/views/A.jsx': 3, 'src/views/B.jsx': 1 });
  assert.deepEqual(lowerBudget(after, { 'src/views/A.jsx': 0 }).englishLeaks, {});
});

test('the tree passes: no middle dot and no นักศึกษา in UI copy, English words within budget', () => {
  assert.ok(existsSync(new URL(`../../${BUDGET_FILE}`, import.meta.url)), `${BUDGET_FILE} records the English-word baseline`);
  const budget = readBudget();
  assert.ok(Object.keys(budget.englishLeaks).length > 0);
  for (const entry of budget.allow) assert.ok(entry.file && entry.text && entry.reason, 'every allow entry says why');
  const result = lintTree({ budget });
  assert.deepEqual(result.dots.map((r) => `${r.file}:${r.line} ${r.text}`), []);
  assert.deepEqual(result.students.map((r) => `${r.file}:${r.line} ${r.text}`), []);
  assert.deepEqual(result.over, []);
});

test('the Atlas e2e pins follow the rewritten copy', () => {
  const spec = readFileSync(new URL('../e2e/atlas-visible-dog.spec.js', import.meta.url), 'utf8');
  assert.ok(!spec.includes('·'), 'the Visible dog spec still pins a middle dot the page no longer shows');
});
