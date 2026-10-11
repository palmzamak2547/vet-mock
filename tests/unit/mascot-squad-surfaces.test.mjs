// ============================================================
// Study-squad mascots on Results, the Mochi page and Pomodoro
// ============================================================
// The 3D viewer itself is pinned in mascot-3d-viewer.test.mjs. These pin the
// screens that host it:
//
// - Results: the companion card follows the Mochi preference, its 3D toggle
//   says whether it is open and is a full touch target.
// - Mochi page: the buddy row and the spotlight show the one buddy kept for
//   every screen (Palm 5.141.6: "Mochi เปลี่ยนไม่ได้มีแบบเดียว"), live; the
//   2D/3D pair exposes its state, is 44 px, names no library, shows the same
//   buddy in 3D behind a local ErrorBoundary, and is absent without WebGL2.
// - Pomodoro: the hatching chick stays unless the student picked a buddy
//   (Mochi included); the celebration dialog is named, takes and returns
//   focus, closes on Escape (useModalFocus), has its close control first,
//   shows a still picture under reduced motion or without WebGL2, has a flat
//   scrim, and does not open when the companion is off.

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mount, findAll, textOf, loadModule } from '../helpers/fake-react.mjs';

const read = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

// ── A small browser ────────────────────────────────────────────────────────
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size; },
};
globalThis.window = globalThis;
window.localStorage = globalThis.localStorage;
const winListeners = {};
globalThis.addEventListener = (t, f) => { (winListeners[t] ||= []).push(f); };
globalThis.removeEventListener = (t, f) => { winListeners[t] = (winListeners[t] || []).filter((x) => x !== f); };
globalThis.dispatchEvent = (e) => { for (const f of [...(winListeners[e.type] || [])]) f(e); return true; };
// A device with WebGL2 unless a test says otherwise (lib/buddy.js canShow3D
// probes once per bundle, so each screen module is loaded with the probe's
// answer already decided by this switch).
const gpu = { webgl2: true };
globalThis.document = {
  addEventListener() {}, removeEventListener() {}, visibilityState: 'visible', hidden: false,
  createElement: () => ({ getContext: (t) => (t === 'webgl2' && gpu.webgl2 ? { getExtension: () => ({ loseContext() {} }) } : null) }),
};
if (typeof globalThis.Event === 'undefined') globalThis.Event = class { constructor(type) { this.type = type; } };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
// PomodoroView arms a midnight refresh; never let a timer hold the runner open.
const realSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms, ...args) => { const t = realSetTimeout(fn, ms, ...args); t?.unref?.(); return t; };

const captured = { timer: null, selector: null, modal: [] };
globalThis.__surfaces = captured;
globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };

const motionStub = { match: 'useMotionPreferences(\\.js)?$', contents: 'export function useMotionPreferences() { return globalThis.__motion; }' };
const boundaryStub = { match: 'ErrorBoundary(\\.jsx)?$', contents: "export default function ErrorBoundary(props) { return { type: 'x-error-boundary', props }; }" };

beforeEach(() => {
  store.clear();
  captured.timer = null;
  captured.selector = null;
  captured.modal.length = 0;
  globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };
});

// ── Results ────────────────────────────────────────────────────────────────
test('Results: the companion card follows the Mochi preference; its 3D toggle is stateful and 44 px', () => {
  const s = read('src/views/ResultsView.jsx');
  assert.match(s, /useMotionPreferences\(\)/, 'Results reads the motion preferences');
  assert.match(s, /\.companion\s*&&\s*\w+\.mode\s*!==\s*'off'/, 'the card uses the same rule as Mochi');
  const card = s.indexOf('Study Squad Companion Encouragement');
  assert.ok(card !== -1);
  assert.match(s.slice(card, s.indexOf('<div', card)), /companionMascot && showCompanion &&/, 'the card renders only when the companion is on');
  const toggle = s.slice(s.indexOf('onClick={() => setShow3DViewer'), s.indexOf("'ปิดโมเดล 3D'"));
  assert.match(toggle, /aria-expanded=\{show3DViewer\}/, 'the toggle says whether the model is open');
  assert.match(toggle, /minHeight: 'var\(--touch-min\)'/, 'the toggle is a full touch target');
});

// ── Mochi page ─────────────────────────────────────────────────────────────
// Shared by the screens below: no stylesheet, and the 3D viewer is a stub (it
// is pinned in mascot-3d-viewer.test.mjs; bundling it would pull in three.js).
const cssStub = { match: '\\.css$', contents: '' };
const viewerStub = { match: 'MascotSquad3DViewer(\\.jsx)?$', contents: 'export default function MascotSquad3DViewer() { return null; }' };
const mochiStubs = [
  motionStub,
  boundaryStub,
  cssStub,
  viewerStub,
  { match: 'BackBar(\\.jsx)?$', contents: 'export default function BackBar() { return null; }' },
  { match: 'MotionSettings(\\.jsx)?$', contents: 'export default function MotionSettings() { return null; }' },
  { match: 'MotionSurface(\\.jsx)?$', contents: 'export default function MotionSurface() { return null; }' },
  { match: 'StudyBreak(\\.jsx)?$', contents: 'export default function StudyBreak() { return null; }' },
  { match: 'BuddySelector(\\.jsx)?$', contents: 'export default function BuddySelector(props) { globalThis.__surfaces.selector = props; return null; }' },
  { match: 'MotionFeedback(\\.jsx)?$', contents: 'export function MotionButton(props) { return { type: "button", props }; }' },
  { match: 'motion-kit/catalog(\\.js)?$', contents: "export const EFFECTS = [{ id: 'mochi-hello', group: 'mochi', th: 'สวัสดี', hint: '', name: 'hello' }]; export const GROUPS = [{ id: 'mochi', name: 'Mochi' }];" },
];
const { default: MochiView } = await loadModule('src/views/MochiView.jsx', { stubs: mochiStubs });
const modeButtons = (tree) => {
  const group = findAll(tree, (n) => n.props?.role === 'group' && n.props['aria-label'] === 'รูปแบบการแสดงคู่หู')[0];
  return group ? findAll(group, (n) => n.type === 'button') : [];
};
const spotlightOf = (tree) => findAll(tree, (n) => n.props?.className === 'vmx-buddy-spotlight')[0];
// Child components run when the tree is read; that is when the stubs capture.
const readTree = (inst) => findAll(inst.tree, () => false);

test('Mochi page: the buddy row and the spotlight show the buddy kept for every screen', () => {
  let inst = mount(MochiView, { goHome() {} });
  readTree(inst);
  assert.equal(captured.selector.selectedId, 'mochi', 'no pick: Mochi is the buddy');
  assert.match(textOf(spotlightOf(inst.tree)), /โมจิ/, 'and the spotlight shows Mochi');
  inst.unmount();
  store.set('vmx-selected-buddy', 'glidy');
  inst = mount(MochiView, { goHome() {} });
  readTree(inst);
  assert.equal(captured.selector.selectedId, 'glidy', 'a buddy picked in Pomodoro is the one shown here');
  const spot = textOf(spotlightOf(inst.tree));
  assert.match(spot, /ไกลดี้/);
  assert.match(spot, /สัตว์แปลก/, 'with its clinic');
  // A pick in the row (or another tab) updates the spotlight live.
  store.set('vmx-selected-buddy', 'porky');
  globalThis.dispatchEvent({ type: 'vmx-buddy-changed' });
  inst.flush();
  assert.match(textOf(spotlightOf(inst.tree)), /พอร์กี้/, 'the spotlight follows the pick');
  const picture = findAll(spotlightOf(inst.tree), (n) => n.type === 'img')[0];
  assert.match(picture.props.src, /characters\/porky/);
  assert.equal(picture.props['data-arrive'], '', 'the new buddy hops in once');
  picture.props.onAnimationEnd();
  inst.flush();
  assert.equal(findAll(spotlightOf(inst.tree), (n) => n.type === 'img')[0].props['data-arrive'], undefined, 'and only once');
  inst.unmount();
});

test('Mochi page: 2D/3D is a stateful pair in plain Thai; 3D shows the same buddy behind a local boundary', () => {
  store.set('vmx-selected-buddy', 'oto');
  const inst = mount(MochiView, { goHome() {} });
  const [twoD, threeD] = modeButtons(inst.tree);
  assert.ok(twoD && threeD, 'two view buttons');
  assert.deepEqual([twoD.props['aria-pressed'], threeD.props['aria-pressed']], [true, false], '2D starts pressed');
  for (const b of [twoD, threeD]) {
    assert.doesNotMatch(textOf(b), /Three\.js|Chibi|\p{Extended_Pictographic}/u, `"${textOf(b)}": no library name, no emoji icon`);
    assert.notEqual(textOf(b).trim(), '3D', 'not the exact name of the Mochi lab\'s own 3D switch');
  }
  threeD.props.onClick();
  inst.flush();
  assert.equal(modeButtons(inst.tree)[1].props['aria-pressed'], true, '3D is pressed once chosen');
  const boundary = findAll(inst.tree, (n) => n.type === 'x-error-boundary');
  assert.equal(boundary.length, 1, 'the 3D viewer renders inside an ErrorBoundary');
  assert.ok(boundary[0].props.fallback, 'with a fallback that keeps the page');
  const suspense = boundary[0].props.children;
  assert.equal(suspense.props.children.props.id, 'oto', 'the 3D viewer shows the chosen buddy');
  assert.ok(suspense.props.fallback, 'and its picture holds the stage while the 3D code loads');
  const css = read('src/styles-buddy.css');
  assert.match(css.match(/\.vmx-buddy-mode button \{[^}]*\}/)[0], /min-height: var\(--touch-min\)/, '44 px through the token');
  inst.unmount();
});

test('Mochi page: no WebGL2 means no 3D switch at all; a game door only when the app can open the game', async () => {
  gpu.webgl2 = false;
  const { default: MochiNo3D } = await loadModule('src/views/MochiView.jsx', { stubs: mochiStubs });
  const inst = mount(MochiNo3D, { goHome() {} });
  gpu.webgl2 = true;
  assert.equal(modeButtons(inst.tree).length, 0, 'a switch that could only apologise is not shown');
  assert.equal(findAll(inst.tree, (n) => n.type === 'x-error-boundary').length, 0, 'and no 3D is mounted');
  assert.equal(findAll(inst.tree, (n) => n.type === 'button' && /เกมลูกไก่/.test(textOf(n))).length, 0, 'no game door without a way to open the game');
  inst.unmount();
  let opened = 0;
  const withGame = mount(MochiView, { goHome() {}, onOpenFocus() {}, onOpenGame() { opened++; } });
  const door = findAll(withGame.tree, (n) => n.type === 'button' && /เกมลูกไก่/.test(textOf(n)))[0];
  assert.ok(door, 'the game door appears when the app passes onOpenGame');
  door.props.onClick();
  assert.equal(opened, 1);
  assert.ok(findAll(withGame.tree, (n) => n.type === 'button' && textOf(n) === 'จับเวลาอ่านพร้อมช่วงพัก')[0], 'the focus door keeps its name');
  assert.equal(findAll(withGame.tree, (n) => n.props?.id === 'buddy').length, 1, 'the buddy section can be linked to');
  withGame.unmount();
});

// ── Pomodoro ───────────────────────────────────────────────────────────────
const { default: PomodoroView } = await loadModule('src/views/PomodoroView.jsx', {
  stubs: [
    motionStub,
    boundaryStub,
    { match: 'BackBar(\\.jsx)?$', contents: 'export default function BackBar() { return null; }' },
    { match: 'PomodoroTimer(\\.jsx)?$', contents: 'export default function PomodoroTimer(props) { globalThis.__surfaces.timer = props; return null; }' },
    { match: 'BuddySelector(\\.jsx)?$', contents: 'export default function BuddySelector(props) { globalThis.__surfaces.selector = props; return null; }' },
    { match: 'useModalFocus(\\.js)?$', contents: 'export function useModalFocus(opts) { globalThis.__surfaces.modal.push(opts); return { current: null }; }' },
    cssStub,
    viewerStub,
  ],
});

const dialogOf = (tree) => findAll(tree, (n) => n.props?.role === 'dialog')[0];
// Child components run when the tree is read; that is when the stubs capture.
const expand = (inst) => findAll(inst.tree, () => false);
function finishFocus(inst) {
  expand(inst);
  assert.ok(captured.timer?.onSessionComplete, 'the timer was rendered');
  captured.timer.onSessionComplete({ durationMin: 25, completed: true });
  inst.flush();
  expand(inst);
}

test('Pomodoro: the hatching chick stays unless the student picked a buddy', () => {
  let inst = mount(PomodoroView, { goHome() {} });
  expand(inst);
  assert.equal(captured.timer.avatar, null, 'no pick: the timer keeps the hatching chick its lines talk about');
  assert.equal(captured.selector.selectedId, 'chicky', 'and the selector shows the chick as the buddy');
  inst.unmount();
  store.set('vmx-selected-buddy', 'porky');
  inst = mount(PomodoroView, { goHome() {} });
  expand(inst);
  assert.equal(captured.timer.avatar?.id, 'porky', 'an explicit pick replaces the chick');
  inst.unmount();
});

test('Pomodoro: the celebration dialog is named, managed for focus and Escape, and its close comes first', () => {
  store.set('vmx-selected-buddy', 'porky');
  const inst = mount(PomodoroView, { goHome() {} });
  finishFocus(inst);
  const dialog = dialogOf(inst.tree);
  assert.ok(dialog, 'the celebration opens after a finished focus session');
  assert.equal(dialog.props['aria-modal'], 'true');
  assert.equal(dialog.props['data-vmx-modal'], 'true', 'joins the app modal stack');
  const labelId = dialog.props['aria-labelledby'];
  assert.ok(labelId, 'the dialog is named');
  const heading = findAll(dialog, (n) => n.props?.id === labelId)[0];
  assert.match(textOf(heading), /สำเร็จ/, 'by its heading');
  const modal = captured.modal.at(-1);
  assert.equal(modal.active, true, 'useModalFocus takes focus, traps Tab, handles Escape and restores focus');
  const buttons = findAll(dialog, (n) => n.type === 'button');
  const first = buttons[0];
  assert.equal(first.props['aria-label'] || textOf(first), 'ปิด', 'the first control in the dialog closes it');
  assert.equal(first.props.style.minHeight, 'var(--touch-min)');
  assert.doesNotMatch(textOf(dialog), /พักผ่อนสักครู่ \//, 'one label per button');
  modal.onClose();
  inst.flush();
  assert.equal(dialogOf(inst.tree), undefined, 'Escape (onClose) closes the dialog');
  inst.unmount();
});

test('Pomodoro: reduced motion shows a still picture; the companion switched off shows no dialog', () => {
  store.set('vmx-selected-buddy', 'porky');
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  let inst = mount(PomodoroView, { goHome() {} });
  finishFocus(inst);
  let dialog = dialogOf(inst.tree);
  assert.ok(dialog, 'the dialog still congratulates');
  assert.equal(findAll(dialog, (n) => n.type === 'x-error-boundary').length, 0, 'no 3D viewer is mounted');
  assert.equal(findAll(dialog, (n) => n.type === 'img' && /characters\/porky/.test(n.props.src)).length, 1, 'the buddy appears as a still picture');
  inst.unmount();

  globalThis.__motion = { preferences: { mode: 'auto', companion: false }, systemReduced: false, reduced: false };
  inst = mount(PomodoroView, { goHome() {} });
  finishFocus(inst);
  dialog = dialogOf(inst.tree);
  assert.equal(dialog, undefined, 'no celebration dialog when the companion is off');
  assert.ok(store.get('vmx-pomodoro'), 'the session is still recorded');
  inst.unmount();

  globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };
  inst = mount(PomodoroView, { goHome() {} });
  finishFocus(inst);
  dialog = dialogOf(inst.tree);
  assert.equal(findAll(dialog, (n) => n.type === 'x-error-boundary').length, 1, 'otherwise the 3D viewer opens behind a local boundary');
  inst.unmount();
});

// The buddy is one pick for every screen (lib/buddy.js). Mochi is on the
// roster: picked, it sits in the ring and celebrates in 3D like the others.
const viewerIn = (dialog) => {
  const boundary = findAll(dialog, (n) => n.type === 'x-error-boundary')[0];
  const suspense = boundary?.props.children;
  return suspense?.props?.children ?? null;
};

test('Pomodoro: the picked buddy, Mochi included, is in the ring and in the celebration', () => {
  store.set('vmx-selected-buddy', 'mochi');
  const inst = mount(PomodoroView, { goHome() {} });
  expand(inst);
  assert.equal(captured.timer.avatar?.id, 'mochi', 'Mochi replaces the chick when picked');
  assert.equal(captured.timer.buddyName, 'โมจิ', 'and the lines name it');
  assert.equal(captured.selector.selectedId, 'mochi', 'the row shows the pick');
  finishFocus(inst);
  const viewer = viewerIn(dialogOf(inst.tree));
  assert.equal(viewer?.props.id, 'mochi', 'the 3D celebration shows the picked buddy');
  assert.equal(viewer?.props.initialAction, 'celebrate');
  const fallback = findAll(dialogOf(inst.tree), (n) => n.type === 'x-error-boundary')[0].props.fallback;
  assert.match(fallback.props.mascot.src, /celebrate/, 'a failure shows Mochi\'s drawn celebrate pose');
  inst.unmount();
});

test('Pomodoro: a pick made on another screen shows without a reload', () => {
  const inst = mount(PomodoroView, { goHome() {} });
  expand(inst);
  assert.equal(captured.timer.avatar, null);
  store.set('vmx-selected-buddy', 'hootie');
  globalThis.dispatchEvent({ type: 'vmx-buddy-changed' });
  inst.flush();
  expand(inst);
  assert.equal(captured.timer.avatar?.id, 'hootie');
  inst.unmount();
});

test('Pomodoro: the celebration scrim is flat, its layer is a token, and no WebGL2 means a picture', () => {
  store.set('vmx-selected-buddy', 'porky');
  const inst = mount(PomodoroView, { goHome() {} });
  finishFocus(inst);
  const dialog = dialogOf(inst.tree);
  assert.equal(dialog.props.style.backdropFilter, undefined, 'no blur under a full-screen dialog');
  assert.equal(dialog.props.style.zIndex, 'var(--z-modal)', 'the modal layer token, not a magic number');
  assert.doesNotMatch(textOf(dialog), /กำลังโหลด/, 'no loading text in the moment');
  inst.unmount();
  const src = read('src/views/PomodoroView.jsx');
  assert.match(src, /celebrate3D = celebrationOpen && !reduced && canShow3D\(\)/, '3D only when the device can draw it');
  assert.doesNotMatch(src, /Session วันนี้|'Streak'|ตลอด session|\(focus \/ break\)/, 'labels in plain Thai');
});

test('Mochi page: /app/mochi#buddy opens on the buddy section', () => {
  const saved = { location: globalThis.location, raf: globalThis.requestAnimationFrame, caf: globalThis.cancelAnimationFrame, byId: globalThis.document.getElementById };
  let scrolled = null;
  globalThis.location = { hash: '#buddy' };
  globalThis.requestAnimationFrame = (cb) => { cb(); return 1; };
  globalThis.cancelAnimationFrame = () => {};
  globalThis.document.getElementById = (id) => (id === 'buddy' ? { scrollIntoView: (opts) => { scrolled = opts; } } : null);
  try {
    const inst = mount(MochiView, { goHome() {} });
    assert.deepEqual(scrolled, { block: 'start' }, 'the buddy section is scrolled into view');
    inst.unmount();
    scrolled = null;
    globalThis.location = { hash: '' };
    const plain = mount(MochiView, { goHome() {} });
    assert.equal(scrolled, null, 'without the hash the page opens at the top');
    plain.unmount();
  } finally {
    globalThis.location = saved.location;
    globalThis.requestAnimationFrame = saved.raf;
    globalThis.cancelAnimationFrame = saved.caf;
    globalThis.document.getElementById = saved.byId;
  }
});

test('the mini game speaks plain Thai: no storage or server words on screen', () => {
  const src = read('src/views/OfflineGameView.jsx');
  assert.doesNotMatch(src, /localStorage\)|server<|ขึ้น server|อีสเตอร์เอ้ก/, 'no build words in the copy');
  assert.match(src, /คะแนนสูงสุดเก็บไว้ในเครื่องนี้เท่านั้น/);
});
