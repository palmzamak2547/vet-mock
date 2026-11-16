// The case pane keeps each account's marks on each case apart (components/case/CasePane.jsx).
// It replaced SmartPassage in 5.240.0; this replaces that file's scope test. What it guards:
// the marks saved before the release are never written or removed, a clear has a way back that
// lands on the case it came from even after the card moved on, an unreadable record is never
// written over, and the next account on the device sees none of the last one's marks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadModule, mount as mountNow, settle, findAll, textOf } from '../helpers/fake-react.mjs';

// The pane's tools load with the case, a moment after it draws.
async function mount(Comp, props) { const inst = mountNow(Comp, props); await settle(inst); return inst; }
import { QB_ENGPROF } from '../../src/data/questions-engprof.js';
import { legacyPassageHash, caseKey, marksStorageKey } from '../../src/lib/case-marks.js';
import { quoteAt } from '../../src/lib/case-ops.js';

const A = QB_ENGPROF.find((q) => q.passage);
const B = QB_ENGPROF.find((q) => q.passage && q.passage !== A.passage);
const props = (q, ownerId = null) => ({ text: q.passage, title: q.passage_title, subject: q.subject, ownerId });
const legacy = (q) => `vmx-pass-${legacyPassageHash(q.passage)}`;
const keyOf = (q, ownerId = null) => marksStorageKey(ownerId, caseKey({ subject: q.subject, title: q.passage_title, passage: q.passage }));

function seeded() {
  const values = new Map();
  for (const [q, label, color] of [[A, 'A', '#1a1a1a'], [B, 'B', '#1e6fc7']]) {
    values.set(`${legacy(q)}-hl`, JSON.stringify([{ id: label, start: 0, end: 8, color: 'yellow' }]));
    values.set(`${legacy(q)}-dr`, JSON.stringify([{ color, width: 2, points: [[0, 0, 0.5], [10, 10, 0.5]] }]));
  }
  return values;
}

async function setup(values, { failGet = () => false, stubs = [] } = {}) {
  const writes = [];
  const storage = {
    getItem(key) { if (failGet(key)) throw new Error('Unreadable storage'); return values.get(key) ?? null; },
    setItem(key, value) { writes.push(key); values.set(key, String(value)); },
    removeItem(key) { writes.push(`-${key}`); values.delete(key); },
  };
  globalThis.window = { localStorage: storage, addEventListener() {}, removeEventListener() {} };
  const { default: CasePane } = await loadModule('src/components/case/CasePane.jsx', { stubs: [{ match: '\.css$', contents: '' }, ...stubs] });
  return { CasePane, writes };
}

const marks = (tree) => findAll(tree, (n) => n.type === 'mark');
const button = (tree, label) => findAll(tree, (n) => n.type === 'button' && n.props['aria-label'] === label)[0];

test('the old marks are adopted as a copy, and clearing leaves the old keys as they were', async () => {
  const values = seeded();
  const saved = Object.fromEntries(values);
  const { CasePane, writes } = await setup(values);
  const pane = await mount(CasePane, props(A));
  assert.equal(textOf(marks(pane.tree)[0]), A.passage.slice(0, 8), 'the old highlight, on its words');
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 0);
  assert.match(textOf(pane.tree), /ล้างแล้ว 2 รอย/);
  for (const [k, v] of Object.entries(saved)) assert.equal(values.get(k), v, `${k} untouched`);
  assert.ok(!writes.some((k) => k.startsWith('-')), 'nothing removed');
  assert.ok(!writes.some((k) => k.startsWith('vmx-pass-')), 'no old key written');
  // Read again: still cleared (adoption happens once), and undo brings them back.
  const again = await mount(CasePane, props(A));
  assert.equal(marks(again.tree).length, 0);
  pane.unmount(); again.unmount();
});

test('the way back from a clear returns the marks to their own case after the card moved on', async () => {
  const values = seeded();
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, props(A));
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  pane.update(props(B));   // a timed paper moved to the next question, on another passage
  assert.equal(textOf(marks(pane.tree)[0]), B.passage.slice(0, 8));
  const undo = findAll(pane.tree, (n) => n.type === 'button' && textOf(n) === 'ย้อนกลับ')[0];
  undo.props.onClick();
  pane.flush();
  assert.equal(textOf(marks(pane.tree)[0]), B.passage.slice(0, 8), 'B as it was');
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 2, 'A has its marks back');
  pane.update(props(A));
  assert.equal(textOf(marks(pane.tree)[0]), A.passage.slice(0, 8));
  // Back on A, the restore is the last thing done there: undo takes it back, redo brings it again.
  button(pane.tree, 'ย้อนกลับ').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 0, 'undo takes back the restore, not the clear before it');
  button(pane.tree, 'ทำซ้ำ').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 1);
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 2);
  pane.unmount();
});

test('undo and redo in the pane', async () => {
  const values = seeded();
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, props(A));
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 0);
  button(pane.tree, 'ย้อนกลับ').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 1);
  button(pane.tree, 'ทำซ้ำ').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 0);
  pane.unmount();
});

test('an unreadable record shows nothing and is never written over', async () => {
  const values = seeded();
  values.set(keyOf(B), '{');
  const { CasePane, writes } = await setup(values, { failGet: (k) => k === 'never' });
  const pane = await mount(CasePane, props(B));
  assert.equal(marks(pane.tree).length, 0);
  writes.length = 0;
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.deepEqual(writes, []);
  assert.equal(values.get(keyOf(B)), '{');
  pane.update(props(A));
  assert.equal(marks(pane.tree).length, 1, 'the next case reads as usual');
  pane.unmount();
});

test('storage that throws on read gives an empty pane that writes nothing', async () => {
  const values = seeded();
  const { CasePane, writes } = await setup(values, { failGet: () => true });
  const pane = await mount(CasePane, props(A));
  assert.equal(marks(pane.tree).length, 0);
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.deepEqual(writes, []);
  pane.unmount();
});

test('the next account on the device sees none of the last account\'s marks', async () => {
  const values = seeded();
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, props(A, 'u1'));
  assert.equal(marks(pane.tree).length, 1, 'u1 was signed in at first run: adopted');
  pane.update(props(A, 'u2'));
  assert.equal(marks(pane.tree).length, 0, 'u2 on the same device');
  pane.update(props(A, null));
  assert.equal(marks(pane.tree).length, 0, 'a visitor after sign-out');
  pane.update(props(A, 'u1'));
  assert.equal(marks(pane.tree).length, 1, 'u1 again');
  pane.unmount();
});

test('an undo after a clear ends its way back, so the way back can never take the marks away again', async () => {
  const values = seeded();
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, props(A));
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.match(textOf(pane.tree), /ล้างแล้ว 2 รอย/);
  button(pane.tree, 'ย้อนกลับ').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 1);
  assert.doesNotMatch(textOf(pane.tree), /ล้างแล้ว/, 'the toast is gone');
  button(pane.tree, 'ย้อนกลับ').props.onClick();   // nothing left to undo
  pane.flush();
  assert.equal(marks(pane.tree).length, 1);
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 2);
  pane.unmount();
});

test('the toast\'s own ย้อนกลับ brings the cleared marks back, under a name of its own', async () => {
  const values = seeded();
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, props(A));
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  const toast = button(pane.tree, 'ย้อนกลับการล้างทั้งหมด');
  assert.ok(toast, 'the toast names what it takes back');
  assert.equal(textOf(toast), 'ย้อนกลับ', 'and its name holds the word it shows');
  assert.equal(findAll(pane.tree, (n) => n.type === 'button' && n.props['aria-label'] === 'ย้อนกลับ').length, 1, 'one button named ย้อนกลับ, the toolbar\'s');
  toast.props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 1);
  assert.doesNotMatch(textOf(pane.tree), /ล้างแล้ว/);
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 2);
  pane.unmount();
});

test('undo in an earlier stage of a case never removes a later stage\'s mark', async () => {
  // The stages of a case share its first 200 characters, so they share one record of marks.
  const stage1 = A.passage;
  const stage3 = `${A.passage}
Rechecked two days later: the swelling had spread to the hock.`;
  const at = stage3.indexOf('swelling');
  const early = { id: 'early', kind: 'range', style: 'wash', start: 0, end: 8, color: 'lemon', quote: quoteAt(stage3, 0, 8) };
  const late = { id: 'late', kind: 'range', style: 'wash', start: at, end: at + 8, color: 'lemon', quote: quoteAt(stage3, at, at + 8) };
  const values = new Map([[keyOf(A), JSON.stringify({ v: 1, marks: [early, late] })]]);
  const { CasePane } = await setup(values);
  const pane = await mount(CasePane, { ...props(A), text: stage3 });
  assert.equal(marks(pane.tree).length, 2);
  // At stage 3: clear, then the toast's way back (an op that adds both marks, on stage 3's undo).
  button(pane.tree, 'ล้างทั้งหมด').props.onClick();
  pane.flush();
  button(pane.tree, 'ย้อนกลับการล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.equal(marks(pane.tree).length, 2);
  // Back to stage 1, which shows only the early mark: its undo has nothing of stage 3's to undo.
  pane.update({ ...props(A), text: stage1 });
  assert.equal(marks(pane.tree).length, 1);
  button(pane.tree, 'ย้อนกลับ').props.onClick();
  pane.flush();
  assert.deepEqual(JSON.parse(values.get(keyOf(A))).marks.map((m) => m.id).sort(), ['early', 'late'], 'the later stage keeps its mark');
  pane.update({ ...props(A), text: stage3 });
  assert.equal(marks(pane.tree).length, 2);
  pane.unmount();
});

test('on a phone, the sheet\'s ล้างทั้งหมด also removes the pen strokes drawn before the case reader', async () => {
  // A phone has no pen tools any more, but its pane still draws the strokes an older release let it make:
  // the sheet's clear is the only clear a phone has, so it takes them too, with the same way back.
  const values = seeded();
  const saved = Object.fromEntries(values);
  const { CasePane } = await setup(values, {
    stubs: [{ match: '/CaseSheet\\.jsx$', contents: 'export default (p) => <button aria-label="sheet-clear" onClick={p.onClear} />;' }],
  });
  const history = { state: null, pushState(s) { this.state = s; }, replaceState(s) { this.state = s; }, back() {} };
  Object.assign(globalThis.window, {
    history, scrollY: 0, scrollTo() {},
    matchMedia: (query) => ({ matches: query === '(max-width: 767px)', addEventListener() {}, removeEventListener() {} }),
  });
  const pane = await mount(CasePane, props(A));
  assert.equal(button(pane.tree, 'ล้างทั้งหมด'), undefined, 'a phone\'s pane has no tools of its own');
  findAll(pane.tree, (n) => n.type === 'button' && textOf(n) === 'อ่านเต็มจอ')[0].props.onClick();
  await settle(pane);
  button(pane.tree, 'sheet-clear').props.onClick();
  pane.flush();
  assert.match(textOf(pane.tree), /ล้างแล้ว 2 รอย/, 'the highlight and the old stroke');
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 0);
  for (const [k, v] of Object.entries(saved)) assert.equal(values.get(k), v, `${k} untouched`);
  button(pane.tree, 'ย้อนกลับการล้างทั้งหมด').props.onClick();
  pane.flush();
  assert.equal(JSON.parse(values.get(keyOf(A))).marks.length, 2, 'the way back returns both');
  pane.unmount();
});

// A chunk that its own lazy parts import from gets short export names and no `default`, and those parts
// keep asking for it under its first address: after one failed download the case could never load
// (CaseSlot.jsx, importFresh). So what the hand, the tools and the sheet share with the pane reaches
// them as props or arguments, never as an import.
test('the hand, the tools and the sheet import nothing that is in the pane\'s chunk', () => {
  const inPaneChunk = ['CasePane.jsx', 'CaseText.jsx', 'case-marks.js', 'case-entry.js', 'hand-policy.js'];
  for (const file of ['components/case/CaseSheet.jsx', 'components/case/CaseTools.jsx', 'lib/ink/case-hand.js', 'lib/case-ops.js']) {
    const src = readFileSync(new URL(`../../src/${file}`, import.meta.url), 'utf8');
    const imported = [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1].split('/').pop());
    for (const name of inPaneChunk) assert.ok(!imported.includes(name), `${file} imports ${name}`);
  }
});
