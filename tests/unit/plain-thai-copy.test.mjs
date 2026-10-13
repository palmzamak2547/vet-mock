// ============================================================
// plain-thai-copy.test.mjs — one word per concept, and a next step after
// every failure (round-2 copy sweep, 2026-10-11)
// ============================================================
// What a student saw before each fix:
//   - the contribute form offered "Multi-select" although it stores one
//     answer index and no screen can render a multi-answer question
//     (OV-critic-1), and its button sent the question "เข้า review queue";
//   - guest mode had four names: "แบบ Guest", "ใช้งานแบบผู้เยี่ยมชม",
//     "ใช้งานแบบไม่ login (single-player)" and a "guest" username on the
//     buddies list, while presence itself publishes "นิสิต" (COPY-16);
//   - "รุ่น" meant both a cohort and an older app version (COPY-18);
//   - the exam header said WRITING/SHORT next to a card whose own badge says
//     เขียนบรรยาย/ตอบสั้น (COPY-08, OV-ui-22);
//   - five failures said only what went wrong (COPY-15).
// The app is not mounted headless except where fake-react can drive it, so
// most of this is pinned at the source, the way the rest of the suite pins
// copy.
// ============================================================

import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';
import { DICT } from '../../src/views/landing/dict.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const GUEST = 'โหมดผู้เยี่ยมชม';

// ── Contribute form ─────────────────────────────────────────────────────────

let ContributeView;
before(async () => {
  const mod = await loadModule('src/views/ContributeView.jsx', {
    stubs: [
      { match: '/lib/contributions\\.js$', contents: `
        export const CONTRIBUTION_SOURCE_TYPES = [];
        export const validateSubmission = () => ({ ok: false, errors: [], warnings: [] });
        export const submitProposal = async () => ({});
        export const fetchMyReputation = async () => null;
        export const fetchMySubmissions = async () => [];
        export const statusMeta = () => ({ label: '', color: '', bg: '' });
        export const ROLE_META = new Proxy({}, { get: () => ({ label: '', color: '', bg: '', icon: '' }) });
        export const ensureContributorRow = async () => {};` },
      { match: '/BackBar\\.jsx$', contents: 'export default function BackBar() { return null; }' },
      { match: '/StatePanel\\.jsx$', contents: 'export default function StatePanel() { return null; }' },
    ],
  });
  ContributeView = mod.default;
});

test('the contribute form offers only the two types it can store: one answer index, MCQ or true/false', () => {
  const inst = mount(ContributeView, { user: { id: 'u1' }, goHome() {}, setView() {}, selectedYear: 4 });
  const typeButtons = findAll(inst.tree, (n) => n?.type === 'button' && 'aria-pressed' in (n.props || {}));
  assert.deepEqual(typeButtons.map((b) => textOf(b).trim()), ['MCQ (เลือก 1)', 'True / False']);
  const src = read('src/views/ContributeView.jsx');
  assert.ok(!src.includes("id: 'multi'") && !src.includes('Multi-select'), 'the multi-select type is still offered');
  inst.unmount();
});

test('the contribute button says who receives the question, in Thai', () => {
  const inst = mount(ContributeView, { user: { id: 'u1' }, goHome() {}, setView() {}, selectedYear: 4 });
  const text = textOf(inst.tree);
  assert.match(text, /📨 ส่งคำถามให้ทีมตรวจ/);
  assert.doesNotMatch(text, /review queue/);
  inst.unmount();
});

// ── Guest mode has one name ─────────────────────────────────────────────────

test('guest mode is called โหมดผู้เยี่ยมชม wherever a screen names it', () => {
  assert.match(DICT.th.lgGuest, new RegExp(GUEST), 'the landing sign-in sheet');
  const unavailable = read('src/components/AuthRequiredState.jsx');
  assert.ok(unavailable.includes(GUEST), 'the sign-in-unavailable panel');
  assert.ok(!unavailable.includes('Guest'), 'the panel still says Guest');
  const auth = read('src/views/AuthView.jsx');
  assert.ok(auth.includes(`← ใช้งานใน${GUEST}`), 'the sign-in page back button');
  assert.ok(!auth.includes('single-player') && !auth.includes('ไม่ login'), 'the sign-in page still names guest mode another way');
});

test('a classmate with no username is นิสิต on the buddies list, the name presence publishes', () => {
  assert.match(read('src/hooks/useStudyBuddies.js'), /\(shown && username\) \|\| 'นิสิต'/);
  const panel = read('src/components/StudyBuddiesPanel.jsx');
  assert.ok(panel.includes("b.username || 'นิสิต'"));
  assert.ok(!panel.includes("|| 'guest'"), 'the panel still falls back to guest');
});

// ── รุ่น is a cohort, never an app version ──────────────────────────────────

test('a saved set from an older version of the app says เวอร์ชันก่อน', () => {
  const compiled = buildSync({
    entryPoints: [fileURLToPath(new URL('../../src/components/NextActionCard.jsx', import.meta.url))],
    bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', packages: 'external', write: false,
  });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(createRequire(import.meta.url), mod, mod.exports);
  const html = renderToStaticMarkup(createElement(mod.exports.default, {
    history: [{ correct: true }], subjects: [{ id: 'com3', name: 'COM III' }],
    practiceCounts: { all: 100, com3: 100 }, pendingResume: { legacy: true, answered: 2, qCount: 5, ageMin: 1 },
  }));
  assert.match(html, /พบชุดค้างจากเวอร์ชันก่อน/);
  assert.doesNotMatch(html, /รุ่นก่อน/);
});

// ── The exam header names a written question the way its card does ─────────

test('the exam header chip uses the card badge words, not WRITING/SHORT', () => {
  const exam = read('src/views/ExamView.jsx');
  const card = read('src/components/Question.jsx');
  const label = (type) => card.match(new RegExp(`^  ${type}: '([^']+)',$`, 'm'))?.[1];
  assert.equal(label('essay'), 'เขียนบรรยาย');
  assert.equal(label('short'), 'ตอบสั้น');
  const chip = exam.slice(exam.indexOf('className="vmx-exam-type-chip"'), exam.indexOf('</span>', exam.indexOf('className="vmx-exam-type-chip"')));
  assert.ok(chip.includes(`currentQ.type === 'essay' ? '${label('essay')}' : '${label('short')}'`), 'the chip text');
  assert.doesNotMatch(chip, /WRITING|SHORT/);
  // Thai with letter spacing pulls marks off their base in some engines, and
  // the mono stack has no Thai glyphs of its own.
  assert.match(chip, /fontFamily: 'var\(--vmx-sans\)'/);
  assert.doesNotMatch(chip, /letterSpacing: '0\.06em'/);
});

// ── Every failure says what to do next ──────────────────────────────────────

test('an image-occlusion save or read failure says what to try', () => {
  const view = read('src/views/ImageOcclusionView.jsx');
  assert.ok(!view.includes("setToast('บันทึกไม่สำเร็จ')"), 'the save failure is still bare');
  assert.ok(view.includes("setToast('บันทึกไม่สำเร็จ ลองลบชุดที่ไม่ใช้แล้ว หรือใช้รูปที่ไฟล์เล็กลง')"));
  assert.ok(view.includes("setError('อ่านไฟล์ไม่ได้ ลองเลือกไฟล์ภาพอื่น')"));
});

test('the daily question challenge link offers a way out when it cannot be made or copied', () => {
  const modal = read('src/components/TodaysQModal.jsx');
  assert.ok(modal.includes("setChallengeHint('สร้างลิงก์ข้อนี้ไม่ได้ ใช้ปุ่มแชร์ผลลัพธ์แทน')"));
  // As ReviewView and ResultsView do: the link was built, so show it.
  assert.ok(modal.includes("'คัดลอกไม่ได้ กดค้างที่ลิงก์เพื่อคัดลอกเอง: ' + url"));
  assert.ok(modal.includes("overflowWrap: 'anywhere'"), 'a long link wraps inside the modal');
});

test('a share card that cannot be shared or saved says how to keep it', () => {
  const panel = read('src/components/ShareCardPanel.jsx');
  // Inside LINE or Instagram the picture is still there to press and hold.
  assert.ok(panel.includes('กดค้างที่รูปด้านบน แล้วเลือกบันทึกรูป'));
  assert.ok(panel.includes("flash('คัดลอกรูปไม่ได้ ใช้บันทึกรูปแทน')"), 'a failed image copy names the other way');
  assert.ok(!panel.includes("flash('แชร์ไม่ได้')"), 'no bare failure');
});
