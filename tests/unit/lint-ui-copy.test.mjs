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

test('the old spellings เช็ค, อัพ and three dots are found wherever a screen shows text (COPY-23)', () => {
  const found = issues([
    'export default ({ busy }) => (<div>',
    '  <p>ลองเช็คอีกครั้ง</p>',
    "  <button title=\"อัพ IG Story\">{busy ? 'กำลังส่ง...' : 'ส่ง'}</button>",
    "  {console.log('เช็ค...')}",
    "  <p>{'a b'.replace('...', '…')}</p>",
    "  <p>{'เช็กแล้ว อัปเดตแล้ว กำลังโหลด…'}</p>",
    '</div>);',
  ].join('\n')).spelling;
  assert.deepEqual(found.map((s) => `${s.token}>${s.fix}`).sort(), ['...>…', 'อัพ>อัป', 'เช็ค>เช็ก'].sort());
});

test('quoted lecture text in VetWiki and generated files keep the spelling they were written in', () => {
  const source = "export const c = { lectureSays: 'ให้เช็ค reflux...' };";
  assert.deepEqual(issues(source, 'src/lib/vetwiki/corrections.js').spelling, []);
  assert.deepEqual(issues(source, 'src/lib/vetwiki/verification-generated.js').spelling, []);
  assert.equal(issues(source, 'src/views/Fixture.jsx').spelling.length, 2);
});

test('the spelling budget only goes down, and a new file starts at zero', () => {
  const before = { englishLeaks: { 'src/views/A.jsx': 1 }, spellingDrift: { 'src/views/A.jsx': 2, 'src/views/B.jsx': 1 } };
  const after = lowerBudget(before, { 'src/views/A.jsx': 1 }, { 'src/views/A.jsx': 3, 'src/views/B.jsx': 0, 'src/views/New.jsx': 2 });
  assert.deepEqual(after.spellingDrift, { 'src/views/A.jsx': 2 });
  assert.deepEqual(after.englishLeaks, { 'src/views/A.jsx': 1 });
  assert.deepEqual(lowerBudget(after, { 'src/views/A.jsx': 1 }).spellingDrift, after.spellingDrift,
    'a caller that passes no spelling counts leaves the spelling budget alone');
});

test('the tree passes: no middle dot and no นักศึกษา in UI copy, English words within budget', () => {
  assert.ok(existsSync(new URL(`../../${BUDGET_FILE}`, import.meta.url)), `${BUDGET_FILE} records the English-word baseline`);
  const budget = readBudget();
  assert.ok(Object.keys(budget.englishLeaks).length > 0);
  assert.ok(budget.spellingDrift && typeof budget.spellingDrift === 'object', `${BUDGET_FILE} records the spelling baseline`);
  for (const entry of budget.allow) assert.ok(entry.file && entry.text && entry.reason, 'every allow entry says why');
  const result = lintTree({ budget });
  assert.deepEqual(result.dots.map((r) => `${r.file}:${r.line} ${r.text}`), []);
  assert.deepEqual(result.students.map((r) => `${r.file}:${r.line} ${r.text}`), []);
  assert.deepEqual(result.over, []);
  assert.deepEqual(result.spellingOver, []);
});

test('the Atlas e2e pins follow the rewritten copy', () => {
  const spec = readFileSync(new URL('../e2e/atlas-visible-dog.spec.js', import.meta.url), 'utf8');
  assert.ok(!spec.includes('·'), 'the Visible dog spec still pins a middle dot the page no longer shows');
});
