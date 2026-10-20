// Lane Z2 of the 2026-10-20 polish: the faculty modal's close control, the
// notes pickers' order, the consent state, touch-only motion choices and the
// ambient frame cap.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule, mount, findAll, textOf, settle } from '../helpers/fake-react.mjs';
import { createScope } from '../../src/lib/motion-kit/core.js';

const modalFocusStub = { match: '/hooks/useModalFocus\\.js$', contents: 'export const useModalFocus = (o) => { globalThis.__modalOpts = o; return { current: null }; };' };

test('faculty modal: a 44 px close button sits in a sticky header at the top, before the body', async () => {
  const { default: InstructorModal } = await loadModule('src/components/InstructorModal.jsx', { stubs: [modalFocusStub] });
  let closed = 0;
  const onClose = () => { closed++; };
  const v = mount(InstructorModal, { instructor: { nameTh: 'อ. ทดสอบ', nameEn: 'Test', position: 'p', department: 'd', institution: 'i', papers: [] }, onClose });
  const dialog = findAll(v.tree, n => n.props?.role === 'dialog')[0];
  const first = findAll(dialog, n => n.type === 'button')[0];
  assert.ok(first, 'a close button exists');
  assert.match(first.props['aria-label'] || textOf(first), /ปิด/);
  assert.ok(Number.parseInt(first.props.style?.minHeight, 10) >= 44 && Number.parseInt(first.props.style?.minWidth, 10) >= 44, 'at least 44 px');
  // The button lives in the dialog's first child (the header), which sticks.
  const header = [].concat(dialog.props.children).find(Boolean);
  assert.equal(header.props.style?.position, 'sticky');
  assert.equal(findAll(header, n => n === first).length, 1, 'the close button is in the sticky header');
  first.props.onClick();
  assert.equal(closed, 1);
  assert.equal(globalThis.__modalOpts.onClose, onClose, 'Escape and focus return still go through useModalFocus');
});

test('notes: the subject picker comes before the topic picker', async t => {
  globalThis.__notesFixture = { first: { title: 'First', icon: '', sections: [{ heading: 'One', body: ['x'] }] } };
  const { default: NotesView } = await loadModule('src/views/NotesView.jsx', { stubs: [
    { match: '\\.css$', contents: '' },
    { match: '/data/note-corpus\\.js$', contents: `export const NOTE_SUBJECT_IDS = ['fa', 'fb']; export const clearNotesSubjectCache = () => {}; export const getCachedNotesSubject = () => globalThis.__notesFixture; export const loadNotesSubject = async () => globalThis.__notesFixture; export const preloadNotesSubject = () => {};` },
    { match: '/data/curriculum\\.js$', contents: `export const SUBJECTS = [{ id: 'fa', name: 'A', icon: '', semester: 1, topics: [{ id: 'first' }] }, { id: 'fb', name: 'B', icon: '', semester: 2, topics: [] }]; export const YEARS = [{ id: 5, label: 'ปี 5' }]; export const yearForSubject = () => 5;` },
    { match: '/components/(Mochi|ReadingEffects|MotionLoader|SlideFigures|ConflictNote|FeatureTip|ImageAnnotator|TemplateLibrary|BackBar|NavIcon)\\.jsx$', contents: 'export default (p) => p && p.children ? p.children : null;' },
    { match: '/components/MotionFeedback\\.jsx$', contents: 'export const MotionEnter = (p) => p.children;' },
    { match: '/lib/richtext\\.jsx$', contents: 'export const RichText = (p) => p.text;' },
    { match: '/lib/vetwiki/registry\\.js$', contents: 'export const hasTopic = () => false;' },
    { match: '/lib/vetwiki/corrections\\.js$', contents: 'export const correctionsFor = () => [];' },
    { match: '/lib/vetwiki/schema\\.js$', contents: 'export const sectionId = (s, t, h) => `${s}--${t}--${h}`;' },
    { match: '/lib/feature-registry\\.js$', contents: 'export const FEATURE_FLAGS = {};' },
    { match: '/lib/note-retry\\.js$', contents: 'export const saveNoteRetryTarget = () => true;' },
    { match: '/lib/quests\\.js$', contents: "export const recordQuestEvent = () => {}; export const todayKey = () => '2026-10-12';" },
  ] });
  const prior = { window: globalThis.window, localStorage: globalThis.localStorage };
  globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  globalThis.window = { history: { state: null, replaceState() {} }, print() {} };
  const v = mount(NotesView, { subject: 'fa', initialTopic: 'first', goHome: () => {} });
  t.after(() => { v.unmount(); globalThis.window = prior.window; globalThis.localStorage = prior.localStorage; });
  await settle(v);
  const labels = findAll(v.tree, n => n.type === 'label' && /vmx-notes-picker-field/.test(n.props.className || '')).map(n => textOf(findAll(n, s => s.type === 'span')[0]));
  assert.deepEqual(labels, ['วิชา', 'หัวข้อ']);
});

test('privacy: the current consent choice is marked, by aria-pressed and a visible tick', async () => {
  const { default: PrivacyView } = await loadModule('src/views/PrivacyView.jsx', { stubs: [{ match: '/components/BackBar\\.jsx$', contents: 'export default () => null;' }] });
  const buttonsFor = (allowed) => {
    const v = mount(PrivacyView, { goHome() {}, setView() {}, consent: allowed ? 'custom' : 'essential', analyticsAllowed: allowed, onConsent() {} });
    return findAll(v.tree, n => n.type === 'button' && n.props['aria-pressed'] !== undefined).map(b => [textOf(b).trim(), b.props['aria-pressed']]);
  };
  const off = buttonsFor(false), on = buttonsFor(true);
  assert.equal(off.length, 2);
  assert.deepEqual(off.map(x => x[1]), [true, false]);
  assert.deepEqual(on.map(x => x[1]), [false, true]);
  assert.match(off[0][0], /✓/);
  assert.match(on[1][0], /✓/);
  assert.doesNotMatch(off[1][0], /✓/);
});

test('catalog: the drag-to-play group is offered everywhere, its effects follow a finger as well as a mouse', async () => {
  const { GROUPS, EFFECTS } = await import('../../src/lib/motion-kit/catalog.js');
  const drag = GROUPS.find(g => g.id === 'cursor');
  assert.ok(drag && !/เมาส์/.test(drag.name), 'named for what it does on any device');
  assert.ok(EFFECTS.filter(e => e.group === 'cursor').some(e => /แตะ|นิ้ว/.test(e.hint || '')), 'its hints already say a tap or a finger works');
});

test('Mochi page: every group shows on touch, and the count is separate from the name', async () => {
  const { default: MochiView } = await loadModule('src/views/MochiView.jsx', { stubs: [
    { match: '/components/(BackBar|MotionSettings|MotionSurface|StudyBreak|BuddySelector|ErrorBoundary|MascotStill|MascotSquad3DViewer)\\.jsx$', contents: 'export default () => null;' },
    { match: '/components/MotionFeedback\\.jsx$', contents: 'export const MotionButton = () => null;' },
    { match: '/hooks/useBuddy\\.js$', contents: "export const useBuddy = () => ({ buddy: { id: 'mochi', nameTh: 'm', name: 'M', role: '', species: '', src: '', alt: '' } });" },
    { match: '/lib/buddy\\.js$', contents: 'export const canShow3D = () => false;' },
    { match: '/lib/art-fallback\\.js$', contents: 'export const artImgFallback = () => {};' },
  ] });
  const prior = { window: globalThis.window, document: globalThis.document };
  globalThis.window = { matchMedia: (q) => ({ matches: /hover: none|pointer: coarse/.test(q) }) };
  globalThis.document = { getElementById: () => null };
  try {
    const v = mount(MochiView, { goHome() {} });
    await settle(v);
    findAll(v.tree, n => n.type === 'details')[0].props.onToggle({ currentTarget: { open: true } });
    await settle(v);
    const groups = findAll(v.tree, n => n.type === 'div' && n.props.className === 'vmx-mochi-groups')[0];
    const buttons = findAll(groups, n => n.type === 'button');
    assert.ok(buttons.length > 0);
    assert.ok(buttons.some(b => /ลากเล่น/.test(textOf(b))), 'the drag-to-play group is there on a touch device');
    for (const b of buttons) assert.match(b.props['aria-label'], /^\S.* \d+$/, 'name, a space, then the count');
  } finally {
    for (const [k, val] of Object.entries(prior)) { if (val === undefined) delete globalThis[k]; else globalThis[k] = val; }
  }
});

test('ambient scope: a fps cap runs the loop at about 30 per second and nothing while hidden', () => {
  const originals = Object.fromEntries(['window', 'document', 'requestAnimationFrame', 'cancelAnimationFrame', 'IntersectionObserver'].map(k => [k, globalThis[k]]));
  const frames = new Map(), media = new EventTarget(), doc = new EventTarget(), root = new EventTarget();
  let id = 0;
  media.matches = false; doc.hidden = false;
  root.classList = { toggle() {}, remove() {} };
  globalThis.window = { matchMedia: () => media };
  globalThis.document = doc;
  globalThis.requestAnimationFrame = cb => { frames.set(++id, cb); return id; };
  globalThis.cancelAnimationFrame = k => frames.delete(k);
  globalThis.IntersectionObserver = undefined;
  try {
    const scope = createScope(root, { fps: 30 });
    let runs = 0;
    const dts = [];
    scope.frame((dt) => { runs++; dts.push(dt); });
    let now = 0;
    for (let i = 0; i < 60; i++) { now += 1000 / 60; const p = [...frames.values()]; frames.clear(); p.forEach(fn => fn(now)); }
    assert.ok(runs >= 28 && runs <= 31, `one second of 60 Hz frames ran ${runs} times`);
    assert.ok(dts.slice(1).every(d => d > 0.03 && d < 0.04), 'dt spans the skipped frame');
    doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange'));
    assert.equal(frames.size, 0, 'no frame is requested while the tab is hidden');
    scope.destroy();
  } finally {
    for (const [k, val] of Object.entries(originals)) { if (val === undefined) delete globalThis[k]; else globalThis[k] = val; }
  }
});
