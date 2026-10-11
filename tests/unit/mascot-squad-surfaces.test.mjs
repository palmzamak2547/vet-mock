// ============================================================
// Study-squad mascots on Results, the Mochi page and Pomodoro
// ============================================================
// The 3D viewer itself is pinned in mascot-3d-viewer.test.mjs. These pin the
// screens that host it:
//
// - Results: the companion card follows the Mochi preference, its 3D toggle
//   says whether it is open and is a full touch target.
// - Mochi page: the 2D/3D switch exposes its state, is 44 px, names no
//   library, and the 3D viewer sits behind a local ErrorBoundary.
// - Pomodoro: the hatching chick stays unless the student picked a buddy;
//   the celebration dialog is named, takes and returns focus, closes on
//   Escape (useModalFocus), has its close control first, shows a still
//   picture under reduced motion and does not open when the companion is off.

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
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.dispatchEvent = () => true;
globalThis.document = { addEventListener() {}, removeEventListener() {}, visibilityState: 'visible', hidden: false };
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
const { default: MochiView } = await loadModule('src/views/MochiView.jsx', {
  stubs: [
    motionStub,
    boundaryStub,
    { match: 'BackBar(\\.jsx)?$', contents: 'export default function BackBar() { return null; }' },
    { match: 'MotionSettings(\\.jsx)?$', contents: 'export default function MotionSettings() { return null; }' },
    { match: 'MotionSurface(\\.jsx)?$', contents: 'export default function MotionSurface() { return null; }' },
    { match: 'StudyBreak(\\.jsx)?$', contents: 'export default function StudyBreak() { return null; }' },
    { match: 'MotionFeedback(\\.jsx)?$', contents: 'export function MotionButton(props) { return { type: "button", props }; }' },
    { match: 'motion-kit/catalog(\\.js)?$', contents: "export const EFFECTS = [{ id: 'mochi-hello', group: 'mochi', th: 'สวัสดี', hint: '', name: 'hello' }]; export const GROUPS = [{ id: 'mochi', name: 'Mochi' }];" },
  ],
});

test('Mochi page: the 2D/3D switch is stateful, 44 px and plain Thai; 3D sits behind a local boundary', () => {
  const inst = mount(MochiView, { goHome() {} });
  const switchButtons = findAll(inst.tree, (n) => n.type === 'button' && /การ์ด 2D|3D/.test(textOf(n)) && !/ตัวอย่าง/.test(textOf(n)));
  assert.equal(switchButtons.length, 2, 'two view buttons');
  for (const b of switchButtons) {
    assert.ok('aria-pressed' in b.props, `"${textOf(b)}" exposes aria-pressed`);
    assert.equal(b.props.style.minHeight, 'var(--touch-min)', `"${textOf(b)}" uses the touch token`);
  }
  assert.deepEqual(switchButtons.map((b) => b.props['aria-pressed']), [true, false], '2D starts pressed');
  const threeD = switchButtons[1];
  assert.doesNotMatch(textOf(threeD), /Three\.js|Chibi/, 'no library name on the button');
  threeD.props.onClick();
  inst.flush();
  const again = findAll(inst.tree, (n) => n.type === 'button' && 'aria-pressed' in n.props && /3D/.test(textOf(n)) && !/2D/.test(textOf(n)))[0];
  assert.equal(again.props['aria-pressed'], true, '3D is pressed once chosen');
  const boundary = findAll(inst.tree, (n) => n.type === 'x-error-boundary');
  assert.equal(boundary.length, 1, 'the 3D viewer renders inside an ErrorBoundary');
  assert.ok(boundary[0].props.fallback, 'with a fallback that keeps the page');
  inst.unmount();
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
