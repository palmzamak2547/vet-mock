// ============================================================
// pomodoro-run.test.mjs — a running Pomodoro survives the rest of VetMock
// (B66) and keeps to the times the student set (B70)
// ============================================================
// B66. Every anchor lived in PomodoroTimer's component state, and the timer
// is mounted only on the focus screen. Opening the library, notes or a
// question set unmounted it: the session ended with no record, and /app/focus
// reopened idle at 25:00.
// B70. (a) Strict Mode relied on a 5 s setTimeout alone; a page suspended
// while hidden could see the visible event first and survive any absence.
// (b) The break lines said "5 นาที" / "15 นาที" whatever was set. (c) The
// sliders fed the running phase, so dragging Focus below the time spent ended
// it at once and logged the new slider value as its length.
//
// PomodoroTimer runs from its real source: JSX compiled with the esbuild Vite
// ships, the real lib/pomodoro-run.js, React's hooks swapped for a small
// deterministic harness, and a clock the test moves.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { transformWithEsbuild } = await import('vite');

// ── Environment ───────────────────────────────────────────────────────────
const rows = new Map();
const docListeners = new Map();
let now = Date.UTC(2026, 8, 26, 3, 0, 0);
const realNow = Date.now;
Date.now = () => now;
globalThis.window = {
  localStorage: {
    getItem: (k) => (rows.has(k) ? rows.get(k) : null),
    setItem: (k, v) => rows.set(k, String(v)),
    removeItem: (k) => rows.delete(k),
  },
  dispatchEvent: () => true,
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
};
globalThis.document = {
  hidden: false,
  addEventListener: (t, fn) => docListeners.set(t, fn),
  removeEventListener: (t) => docListeners.delete(t),
};
test.after(() => { Date.now = realNow; });

const run = await import('../../src/lib/pomodoro-run.js');

// ── Harness ───────────────────────────────────────────────────────────────
const h = (type, props, ...children) => ({ type, props: props || {}, children: children.flat(Infinity) });

async function compileTimer() {
  const file = 'src/components/PomodoroTimer.jsx';
  const src = readFileSync(resolve(process.cwd(), file), 'utf8').replace(/\r\n/g, '\n');
  const body = src.replace(/^import[\s\S]*?from\s+'[^']+';\s*$/gm, '').replace('export default function ', 'function ');
  const { code } = await transformWithEsbuild(body, file, { loader: 'jsx', jsx: 'transform', jsxFactory: 'h', jsxFragment: 'Fragment' });
  // Only what the component imports from lib/pomodoro-run.js, as it ships.
  const fromRun = /import\s*\{([^}]*)\}\s*from\s*'\.\.\/lib\/pomodoro-run\.js'/.exec(src)?.[1]
    .split(',').map((n) => n.trim()).filter(Boolean) || [];
  return (hooks) => {
    const scope = {
      h, Fragment: 'Fragment', ...hooks, ...Object.fromEntries(fromRun.map((n) => [n, run[n]])),
      PomodoroChick: 'PomodoroChick', FocusBackdrop: 'FocusBackdrop', StudyBreak: 'StudyBreak', MotionButton: 'MotionButton',
    };
    return new Function(...Object.keys(scope), `${code}\nreturn PomodoroTimer;`)(...Object.values(scope));
  };
}
const make = await compileTimer();

const live = new Set();
test.afterEach(() => { for (const v of live) v.unmount(); live.clear(); });

function mount(props) {
  const slots = [];
  const effects = [];
  let cursor = 0; let effectCursor = 0; let dirty = false;
  const queued = [];
  const changed = (a, b) => !a || !b || a.length !== b.length || a.some((d, n) => !Object.is(d, b[n]));
  const hooks = {
    useState(init) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof init === 'function' ? init() : init;
      return [slots[i], (v) => {
        const next = typeof v === 'function' ? v(slots[i]) : v;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useRef(init) { const i = cursor++; if (!(i in slots)) slots[i] = { current: init }; return slots[i]; },
    useMemo(fn, deps) {
      const i = cursor++;
      if (!(i in slots) || changed(slots[i].deps, deps)) slots[i] = { deps, value: fn() };
      return slots[i].value;
    },
    useCallback(fn, deps) { return hooks.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const i = effectCursor++;
      const prev = effects[i];
      if (!prev || !deps || changed(prev.deps, deps)) queued.push({ i, fn, deps });
    },
  };
  const Component = make(hooks);
  const view = {
    tree: null,
    render(next = props) {
      props = next;
      let guard = 0;
      do {
        if (++guard > 30) throw new Error('render loop');
        cursor = 0; effectCursor = 0; dirty = false;
        view.tree = Component(props);
        for (const e of queued.splice(0)) {
          effects[e.i]?.cleanup?.();
          const cleanup = e.fn();
          effects[e.i] = { deps: e.deps, cleanup: typeof cleanup === 'function' ? cleanup : null };
        }
      } while (dirty);
      return view;
    },
    unmount() {
      if (!live.delete(view)) return;
      for (const e of effects) e?.cleanup?.();
    },
  };
  live.add(view);
  return view.render(props);
}

const textOf = (node) => (node == null || typeof node === 'boolean' ? ''
  : typeof node !== 'object' ? String(node)
    : Array.isArray(node) ? node.map(textOf).join('') : textOf(node.children));
function findAll(node, pred, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (Array.isArray(node)) { for (const n of node) findAll(n, pred, out); return out; }
  if (pred(node)) out.push(node);
  return findAll(node.children, pred, out);
}
const clock = (view) => findAll(view.tree, (n) => n.type === 'div' && /^\d\d:\d\d$/.test(textOf(n)))[0] && textOf(findAll(view.tree, (n) => n.type === 'div' && /^\d\d:\d\d$/.test(textOf(n)))[0]);
const status = (view) => textOf(findAll(view.tree, (n) => n.props?.['aria-live'] === 'polite')[0]);
const button = (view, label) => findAll(view.tree, (n) => n.props?.['aria-label'] === label)[0];
const MIN = 60_000;

function fresh({ strictFocus = false, focusMin = 25, shortBreakMin = 5, longBreakMin = 15 } = {}) {
  rows.clear(); docListeners.clear(); document.hidden = false;
  const log = [];
  const props = { config: { focusMin, shortBreakMin, longBreakMin, strictFocus }, onSessionComplete: (s) => log.push(s) };
  return { props, log };
}

// ── B66 ───────────────────────────────────────────────────────────────────
test('a focus left for another screen is still running when the student comes back', () => {
  const { props, log } = fresh();
  let view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  now += 10 * MIN;
  view.unmount(); // the student opens the library
  now += 3 * MIN;
  view = mount(props); // and comes back to /app/focus
  assert.equal(clock(view), '12:00');
  assert.match(status(view), /กำลังโฟกัส/);
  assert.deepEqual(log, [], 'nothing was recorded while it ran');
});

test('a focus that finished while the student was elsewhere is recorded, and its break resumes on time', () => {
  const { props, log } = fresh();
  let view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  view.unmount();
  now += 27 * MIN; // focus ended two minutes ago
  view = mount(props);
  assert.deepEqual(log, [{ durationMin: 25, completed: true }]);
  assert.equal(clock(view), '03:00', 'the break started when the focus ended');
  view.unmount();
  now += 60 * MIN; // and the break is long over too
  view = mount(props);
  assert.match(status(view), /พร้อมเริ่ม/);
  assert.equal(log.length, 1, 'recorded once');
  assert.equal(rows.has(run.POMODORO_RUN_KEY), false);
});

test('Strict Mode: leaving the focus screen for longer than the grace fails the session, a short hop does not', () => {
  let { props, log } = fresh({ strictFocus: true });
  let view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  view.unmount();
  now += 3_000;
  view = mount(props);
  assert.match(status(view), /กำลังโฟกัส/);
  assert.deepEqual(log, []);

  ({ props, log } = fresh({ strictFocus: true }));
  view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  now += 4 * MIN;
  view.unmount();
  now += 40 * MIN; // gone past the whole focus
  view = mount(props);
  assert.match(status(view), /ลูกไก่หนี/);
  assert.deepEqual(log, [{ durationMin: 25, completed: false }], 'recorded as failed, never as completed');
});

test('reset and a finished break leave nothing to restore', () => {
  const { props } = fresh();
  let view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  assert.equal(rows.has(run.POMODORO_RUN_KEY), true);
  button(view, 'รีเซ็ต').props.onClick();
  view.render();
  view.unmount();
  assert.equal(rows.has(run.POMODORO_RUN_KEY), false);
  view = mount(props);
  assert.equal(clock(view), '25:00');
});

// ── B70 ───────────────────────────────────────────────────────────────────
test('(a) Strict Mode fails on the wall clock when a suspended page wakes', () => {
  const { props, log } = fresh({ strictFocus: true });
  const view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  document.hidden = true;
  docListeners.get('visibilitychange')();
  now += 60_000; // the phone was locked; the 5 s timer never got to run
  document.hidden = false;
  docListeners.get('visibilitychange')(); // the visible event runs first
  view.render();
  assert.match(status(view), /ลูกไก่หนี/);
  assert.deepEqual(log, [{ durationMin: 25, completed: false }]);
});

test('(a) a glance under the grace keeps the session', () => {
  const { props, log } = fresh({ strictFocus: true });
  const view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  document.hidden = true;
  docListeners.get('visibilitychange')();
  now += 2_000;
  document.hidden = false;
  docListeners.get('visibilitychange')();
  view.render();
  assert.match(status(view), /กำลังโฟกัส/);
  assert.deepEqual(log, []);
});

test('(b) the break line says the break length the student set', () => {
  assert.equal(run.statusLabel('shortBreak', true, 10), 'พักสายตา 10 นาที');
  assert.match(run.statusLabel('longBreak', true, 30), /^พักยาว 30 นาที/);
  const { props } = fresh({ shortBreakMin: 10 });
  const view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  now += 25 * MIN;
  view.render();
  assert.equal(clock(view), '10:00');
  assert.equal(status(view), 'พักสายตา 10 นาที');
});

test('(c) moving a slider mid-session changes the next phase, not the running one', () => {
  const { props, log } = fresh();
  const view = mount(props);
  button(view, 'เริ่ม focus session').props.onClick();
  view.render();
  now += 12 * MIN;
  view.render({ ...props, config: { ...props.config, focusMin: 10 } });
  assert.equal(clock(view), '13:00', 'the running focus kept its 25 minutes');
  assert.deepEqual(log, []);
  now += 13 * MIN;
  view.render();
  assert.deepEqual(log, [{ durationMin: 25, completed: true }], 'logged as the length that ran');
  now += 5 * MIN;
  view.render();
  assert.match(status(view), /พร้อมเริ่ม/);
  assert.equal(clock(view), '10:00', 'the next focus uses the new slider value');
});

test('a stored run that cannot be read is ignored', () => {
  const { props } = fresh();
  rows.set(run.POMODORO_RUN_KEY, '{not json');
  assert.equal(run.loadRun(), null);
  rows.set(run.POMODORO_RUN_KEY, JSON.stringify({ state: 'focus', startedAt: 'x', runMin: 25 }));
  assert.equal(run.loadRun(), null);
  assert.equal(clock(mount(props)), '25:00');
});
