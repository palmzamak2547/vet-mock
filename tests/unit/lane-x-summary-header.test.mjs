// The clip summary header shows what a student reads, not authoring metadata.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf } from '../helpers/fake-react.mjs';

const stubs = [
  { match: '/hooks/useModalFocus\.js$', contents: 'export const useModalFocus = () => ({ current: null });' },
  { match: '/hooks/useMotionPreferences\.js$', contents: 'export const useMotionPreferences = () => ({ reduced: true });' },
  { match: '/components/RecallQuiz\.jsx$', contents: 'export default () => null;' },
  { match: '/components/PinButton\.jsx$', contents: 'export default () => null;' },
  { match: '^react-dom$', contents: 'export const createPortal = n => n;' },
];
const entry = process.env.LANE_X_ENTRY || 'src/components/SummaryModal.jsx';
const { default: SummaryModal } = await loadModule(entry, { stubs });

const summary = { videoId: 'v1', title: 'หัวข้อ', subject: 'aquatic-clinic', date: '2025-10-14',
  durationMin: 42, instructor: 'อ. ตัวอย่าง', summary: 'x', examFormat: 'ปรนัย 20 ข้อ' };

test('header shows the Thai subject name and a Thai date, not the raw id and ISO date', () => {
  const view = mount(SummaryModal, { summary, onClose() {} });
  const text = textOf(view.tree);
  assert.ok(text.includes('คลินิกสัตว์น้ำ'), text);
  assert.ok(!/AQUATIC-CLINIC/i.test(text), 'raw subject id leaked');
  assert.ok(!text.includes('2025-10-14'), 'ISO date leaked');
  assert.ok(/2568/.test(text), 'Thai (Buddhist) year expected');
});

test('no English kicker, and the .md button is named in Thai', () => {
  const view = mount(SummaryModal, { summary, onClose() {} });
  const text = textOf(view.tree);
  assert.ok(!/exam format/i.test(text));
  assert.ok(text.includes('แนวข้อสอบ'));
  const md = findAll(view.tree, n => n.type === 'button' && /\.md/.test(textOf(n)));
  assert.equal(md.length, 1);
  assert.ok(textOf(md[0]).includes('ดาวน์โหลด'));
  assert.equal(typeof md[0].props.onClick, 'function', 'function kept');
});

test('an unknown subject id is left out rather than printed raw', () => {
  const view = mount(SummaryModal, { summary: { ...summary, subject: 'zzz-unknown' }, onClose() {} });
  assert.ok(!/zzz-unknown/i.test(textOf(view.tree)));
});
