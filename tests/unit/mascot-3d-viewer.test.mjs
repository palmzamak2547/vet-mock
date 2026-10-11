// ============================================================
// MascotSquad3DViewer — lifecycle, failure paths, motion and input
// ============================================================
// The 3D study-squad viewer opens by itself after every finished Pomodoro and
// on demand on Results and the Mochi page. These tests mount its real source
// (tests/helpers/fake-react.mjs) against the real three.js maths, animation
// mixer and scene graph; only WebGLRenderer (no GPU in Node) and GLTFLoader
// (no network) are replaced, and both record what the component asked of
// them. What they pin:
//
// - A celebration never rebuilds the renderer: one WebGLRenderer per mount,
//   the model swaps inside it, celebrate plays once and returns to idle.
// - A model that finishes loading after the student picked another one is
//   thrown away and disposed; it cannot take over the mixer or the head.
// - Unmount and model swaps release geometry, materials, the mixer and the
//   GL context; no timer or animation frame outlives the viewer.
// - The render loop stops off-screen and in a hidden tab.
// - No WebGL, a lost context or a failed model shows the 2D mascot instead
//   of taking the screen down.
// - Head tracking turns the node named exactly 'Head', on top of the clip.
// - Reduced motion: no automatic celebration and no confetti.
// - The canvas lets the page scroll and only zooms on ctrl/meta or focus.

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mount, findAll, textOf, loadModule, repoRoot } from '../helpers/fake-react.mjs';

// ── A minimal browser ──────────────────────────────────────────────────────
let now = 1000;
const raf = { next: 1, cbs: new Map() };
const timers = { next: 1, list: new Map() };
const docListeners = {};
const io = [];
const ro = [];
const env = { fine: false, cssVars: {} };

globalThis.window = globalThis;
globalThis.devicePixelRatio = 3;
globalThis.requestAnimationFrame = (cb) => { const id = raf.next++; raf.cbs.set(id, cb); return id; };
globalThis.cancelAnimationFrame = (id) => { raf.cbs.delete(id); };
globalThis.setTimeout = (fn, ms = 0) => { const id = timers.next++; timers.list.set(id, { fn, at: now + ms }); return id; };
globalThis.clearTimeout = (id) => { timers.list.delete(id); };
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.matchMedia = (q) => ({ matches: q.includes('pointer: fine') ? env.fine : false, addEventListener() {}, removeEventListener() {} });
globalThis.getComputedStyle = () => ({ getPropertyValue: (name) => env.cssVars[name] || '' });
globalThis.IntersectionObserver = class { constructor(cb) { this.cb = cb; this.targets = []; io.push(this); } observe(el) { this.targets.push(el); } unobserve() {} disconnect() { this.dead = true; } };
globalThis.ResizeObserver = class { constructor(cb) { this.cb = cb; this.targets = []; ro.push(this); } observe(el) { this.targets.push(el); } unobserve() {} disconnect() { this.dead = true; } };
globalThis.MutationObserver = class { constructor(cb) { this.cb = cb; } observe() {} disconnect() { this.dead = true; } };
const doc = {
  hidden: false,
  visibilityState: 'visible',
  activeElement: null,
  documentElement: { dataset: {} },
  addEventListener(t, f) { (docListeners[t] ||= []).push(f); },
  removeEventListener(t, f) { docListeners[t] = (docListeners[t] || []).filter((x) => x !== f); },
};
globalThis.document = doc;
try { globalThis.performance.now = () => now; } catch { Object.defineProperty(globalThis, 'performance', { value: { now: () => now }, configurable: true }); }

function advance(ms) {
  const end = now + ms;
  for (;;) {
    const due = [...timers.list.entries()].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
    if (!due) break;
    timers.list.delete(due[0]);
    now = Math.max(now, due[1].at);
    due[1].fn();
  }
  now = end;
}
function frames(inst, n, ms = 1000 / 60) {
  for (let i = 0; i < n; i++) {
    advance(ms);
    const cbs = [...raf.cbs.values()];
    raf.cbs.clear();
    for (const cb of cbs) cb(now);
    inst.flush();
  }
}

function fakeElement(extra = {}) {
  const listeners = {};
  return {
    clientWidth: 400,
    clientHeight: 330,
    children: [],
    style: {},
    parentNode: null,
    listeners,
    set innerHTML(_) { for (const c of this.children) c.parentNode = null; this.children = []; },
    get innerHTML() { return ''; },
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); c.parentNode = null; return c; },
    contains(c) { return c === this || this.children.includes(c); },
    remove() { this.parentNode?.removeChild(this); },
    addEventListener(t, f, o) { (listeners[t] ||= []).push({ f, o }); },
    removeEventListener(t, f) { listeners[t] = (listeners[t] || []).filter((x) => x.f !== f); },
    dispatch(t, e) { for (const { f } of listeners[t] || []) f(e); },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 400, height: 330, right: 400, bottom: 330 }),
    focus() { doc.activeElement = this; },
    setPointerCapture() {}, releasePointerCapture() {}, hasPointerCapture() { return false; },
    ...extra,
  };
}

// ── The module under test, three swapped at the GPU and network edges ─────
const THREE_REAL = path.join(repoRoot, 'node_modules/three/build/three.module.js').replace(/\\/g, '/');
const GL = { renderers: [], fail: false };
const loads = [];
globalThis.__mascotGL = GL;
globalThis.__mascotLoads = loads;
globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };

const threeStub = `
import * as REAL from '${THREE_REAL}';
export * from '${THREE_REAL}';
globalThis.__mascotThree = REAL;
for (const C of [REAL.BufferGeometry, REAL.Material, REAL.Texture]) {
  const original = C.prototype.dispose;
  if (C.prototype.__wrapped) continue;
  C.prototype.dispose = function () { this.__disposed = (this.__disposed || 0) + 1; return original.call(this); };
  C.prototype.__wrapped = true;
}
export class WebGLRenderer {
  constructor(opts) {
    const GL = globalThis.__mascotGL;
    if (GL.fail) throw new Error('Error creating WebGL context.');
    this.opts = opts || {};
    const listeners = {};
    this.domElement = {
      style: {}, parentNode: null, listeners,
      addEventListener(t, f) { (listeners[t] ||= []).push(f); },
      removeEventListener(t, f) { listeners[t] = (listeners[t] || []).filter((x) => x !== f); },
      dispatch(t, e) { for (const f of listeners[t] || []) f(e); },
      remove() { this.parentNode?.removeChild(this); },
    };
    this.shadowMap = {};
    this.renders = 0;
    this.disposed = false;
    this.lost = false;
    GL.renderers.push(this);
  }
  setSize(w, h) { this.size = [w, h]; }
  setPixelRatio(r) { this.pixelRatio = r; }
  setClearColor() {}
  render(scene, camera) { this.renders++; this.lastScene = scene; this.lastCamera = camera; }
  dispose() { this.disposed = true; }
  forceContextLoss() { this.lost = true; }
}
`;
const loaderStub = `
export class GLTFLoader {
  load(url, onLoad, onProgress, onError) { globalThis.__mascotLoads.push({ url, onLoad, onError }); }
}
`;
const motionStub = `export function useMotionPreferences() { return globalThis.__motion; }`;

const { default: Viewer } = await loadModule('src/components/MascotSquad3DViewer.jsx', {
  stubs: [
    { match: '^three$', contents: threeStub },
    { match: 'GLTFLoader\\.js$', contents: loaderStub },
    { match: 'useMotionPreferences(\\.js)?$', contents: motionStub },
  ],
});
const T = globalThis.__mascotThree;

// ── A GLB as GLTFLoader would hand it over ────────────────────────────────
function gltfFor(id, { constantIdle = false } = {}) {
  const root = new T.Group();
  root.name = id;
  const body = new T.Mesh(new T.BoxGeometry(0.4, 0.4, 0.4), new T.MeshStandardMaterial());
  body.name = `${id}-Body`;
  root.add(body);
  const head = new T.Object3D();
  head.name = 'Head';
  root.add(head);
  // chicky, hootie, mimi and pawsy carry an unanimated sphere named Head_Mesh
  // under Head; the old traversal ended on it.
  const headMesh = new T.Mesh(new T.SphereGeometry(0.26, 8, 6), new T.MeshStandardMaterial());
  headMesh.name = 'Head_Mesh';
  head.add(headMesh);
  const q0 = [0, 0, 0, 1];
  const qz = new T.Quaternion().setFromEuler(new T.Euler(0, 0, 0.02)).toArray();
  const idleValues = constantIdle ? [...q0, ...q0, ...q0] : [...q0, ...qz, ...q0];
  const animations = [
    new T.AnimationClip('idle', 2, [new T.QuaternionKeyframeTrack('Head.quaternion', [0, 1, 2], idleValues)]),
    new T.AnimationClip('wave', 1.5, [new T.QuaternionKeyframeTrack('Head.quaternion', [0, 0.75, 1.5], [...q0, ...qz, ...q0])]),
    new T.AnimationClip('celebrate', 1.6, [new T.QuaternionKeyframeTrack('Head.quaternion', [0, 0.8, 1.6], [...q0, ...qz, ...q0])]),
  ];
  return { scene: root, animations, parts: { root, body, head, headMesh } };
}
const idOf = (url) => url.match(/models\/([a-z]+)\.glb/)[1];
function resolveNext(inst, opts) {
  const job = loads.shift();
  const gltf = gltfFor(idOf(job.url), opts);
  job.onLoad(gltf);
  inst.flush();
  return gltf;
}
function resolveAll(inst, opts) {
  const out = [];
  for (let guard = 0; loads.length && guard < 30; guard++) out.push(resolveNext(inst, opts));
  return out;
}

// ── Driving the component ─────────────────────────────────────────────────
const canvasHost = (inst) => findAll(inst.tree, (n) => typeof n.type === 'string' && n.props?.onPointerDown && n.props?.ref)[0];
function attach(inst, el = fakeElement()) {
  const host = canvasHost(inst);
  assert.ok(host, 'the canvas host is rendered');
  if (typeof host.props.ref === 'function') host.props.ref(el);
  else host.props.ref.current = el;
  inst.flush();
  return el;
}
const buttonByText = (inst, text) => findAll(inst.tree, (n) => n.type === 'button' && textOf(n).includes(text))[0];
function click(inst, text) {
  const b = buttonByText(inst, text);
  assert.ok(b, `a button reading ${text}`);
  b.props.onClick?.({ currentTarget: b });
  inst.flush();
}
const pressedStyle = (inst, text) => buttonByText(inst, text)?.props.style?.background === 'var(--clr-ink)';
const sceneOf = () => GL.renderers.at(-1)?.lastScene;
const confetti = () => {
  let p = null;
  sceneOf()?.traverse((o) => { if (o.isPoints) p = o; });
  return p;
};

beforeEach(() => {
  GL.renderers.length = 0;
  GL.fail = false;
  loads.length = 0;
  raf.cbs.clear();
  timers.list.clear();
  io.length = 0;
  ro.length = 0;
  for (const k of Object.keys(docListeners)) delete docListeners[k];
  doc.hidden = false;
  doc.visibilityState = 'visible';
  doc.activeElement = null;
  env.fine = false;
  env.cssVars = {};
  globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };
});

test('a celebration plays once, returns to idle and never rebuilds the renderer', () => {
  const inst = mount(Viewer, { initialId: 'moocha', initialAction: 'celebrate' });
  attach(inst);
  click(inst, 'พอร์กี้');
  resolveAll(inst);
  assert.ok(pressedStyle(inst, 'ดีใจ'), 'the celebration starts when the model arrives');
  // Three seconds of frames and timers: the 1.6 s clip ends and the 2 s
  // confetti window closes. The old effect rebuilt the scene on each flip.
  for (let i = 0; i < 6; i++) { frames(inst, 30); resolveAll(inst); }
  assert.equal(GL.renderers.length, 1, 'one WebGLRenderer for the whole mount');
  assert.equal(GL.renderers[0].disposed, false, 'the live renderer was never torn down');
  assert.ok(pressedStyle(inst, 'หายใจ'), 'after celebrating once the mascot is back on idle');
  inst.unmount();
  assert.equal(timers.list.size, 0, 'no celebration timer outlives the viewer');
  assert.equal(raf.cbs.size, 0, 'no animation frame outlives the viewer');
});

test('a model that loads late is discarded and cannot take over the mascot on screen', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  click(inst, 'ไกลดี้');
  click(inst, 'พอร์กี้');
  const porkyJob = loads.findIndex((j) => idOf(j.url) === 'porky');
  assert.notEqual(porkyJob, -1, 'porky was requested');
  const [job] = loads.splice(porkyJob, 1);
  const porky = gltfFor('porky');
  job.onLoad(porky);
  inst.flush();
  const late = resolveAll(inst); // moocha and/or glidy finish after porky
  frames(inst, 70);
  const scene = sceneOf();
  for (const g of late) {
    assert.equal(scene.getObjectByName(g.parts.root.name), undefined, `${g.parts.root.name} is not in the scene`);
    assert.ok(g.parts.body.geometry.__disposed, `${g.parts.root.name}'s late geometry is disposed`);
    assert.ok(g.parts.body.material.__disposed, `${g.parts.root.name}'s late material is disposed`);
  }
  assert.ok(scene.getObjectByName('porky'), 'porky is the model on the stage');
  const z = new T.Euler().setFromQuaternion(porky.parts.head.quaternion, 'YXZ').z;
  assert.ok(Math.abs(z) > 0.005, `porky's own idle clip is driving its head (z=${z})`);
  inst.unmount();
});

test('model swaps and unmount release geometry, materials, the mixer and the GL context', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  const [moocha] = resolveAll(inst);
  frames(inst, 3);
  click(inst, 'พอร์กี้');
  assert.ok(moocha.parts.body.geometry.__disposed, 'the outgoing model geometry is disposed on swap');
  assert.ok(moocha.parts.headMesh.material.__disposed, 'the outgoing model materials are disposed on swap');
  assert.equal(sceneOf().getObjectByName('moocha'), undefined, 'the outgoing model left the scene');
  const [porky] = resolveAll(inst);
  frames(inst, 3);
  const scene = sceneOf();
  const meshes = [];
  scene.traverse((o) => { if (o.isMesh || o.isPoints) meshes.push(o); });
  assert.ok(meshes.length >= 5, 'pedestal, ring, shadow, confetti and the model are in the scene');
  inst.unmount();
  const r = GL.renderers[0];
  assert.equal(r.disposed, true, 'renderer.dispose() on unmount');
  assert.equal(r.lost, true, 'renderer.forceContextLoss() on unmount');
  for (const m of meshes) {
    assert.ok(m.geometry.__disposed, `${m.name || m.type} geometry disposed`);
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    for (const mat of mats) assert.ok(mat.__disposed, `${m.name || m.type} material disposed`);
  }
  assert.ok(porky.parts.body.geometry.__disposed, 'the last model is disposed too');
  assert.equal(raf.cbs.size, 0, 'no frame is scheduled after unmount');
  assert.equal(timers.list.size, 0, 'no timer is pending after unmount');
  assert.ok(io.every((o) => o.dead) && ro.every((o) => o.dead), 'observers are disconnected');
  assert.equal((docListeners.visibilitychange || []).length, 0, 'the visibility listener is removed');
});

test('the render loop stops off-screen and in a hidden tab, and resumes after', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  const host = attach(inst);
  resolveAll(inst);
  const r = GL.renderers[0];
  assert.equal(r.opts.powerPreference, 'low-power', 'asks for the low-power GPU');
  assert.ok(r.pixelRatio <= 1.5, `pixel ratio is capped (got ${r.pixelRatio} on a DPR-3 screen)`);
  assert.ok(ro.some((o) => o.targets.includes(host)), 'a ResizeObserver watches the canvas host');
  const observer = io.find((o) => o.targets.includes(host));
  assert.ok(observer, 'an IntersectionObserver watches the canvas host');
  frames(inst, 3);
  const before = r.renders;
  observer.cb([{ isIntersecting: false, target: host }]);
  assert.equal(raf.cbs.size, 0, 'off-screen: no frame is scheduled');
  frames(inst, 5);
  assert.equal(r.renders, before, 'off-screen: nothing is drawn');
  observer.cb([{ isIntersecting: true, target: host }]);
  frames(inst, 2);
  assert.ok(r.renders > before, 'back on screen: drawing resumes');
  doc.hidden = true; doc.visibilityState = 'hidden';
  for (const f of docListeners.visibilitychange || []) f();
  const hiddenAt = r.renders;
  frames(inst, 5);
  assert.equal(r.renders, hiddenAt, 'hidden tab: nothing is drawn');
  doc.hidden = false; doc.visibilityState = 'visible';
  for (const f of docListeners.visibilitychange || []) f();
  frames(inst, 2);
  assert.ok(r.renders > hiddenAt, 'visible again: drawing resumes');
  // A resize is read from the host, not the window.
  host.clientWidth = 300;
  ro.find((o) => o.targets.includes(host)).cb([{ target: host }]);
  assert.deepEqual(r.size, [300, 330]);
  inst.unmount();
});

test('no WebGL, a lost context or a failed model shows the 2D mascot instead', () => {
  GL.fail = true;
  let inst;
  assert.doesNotThrow(() => {
    inst = mount(Viewer, { initialId: 'moocha' });
    attach(inst);
    click(inst, 'พอร์กี้');
  }, 'a device without WebGL must not throw into the screen');
  let still = findAll(inst.tree, (n) => n.type === 'img' && /characters\/porky/.test(n.props.src));
  assert.equal(still.length, 1, 'the still picture of the chosen mascot is shown');
  assert.match(textOf(inst.tree), /เปิดภาพ 3D ไม่ได้/, 'with a short note saying why');
  assert.equal(loads.length, 0, 'no model is fetched for a device that cannot draw it');
  inst.unmount();

  GL.fail = false;
  inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  loads.shift().onError(new Error('404'));
  inst.flush();
  still = findAll(inst.tree, (n) => n.type === 'img' && /characters\/moocha/.test(n.props.src));
  assert.equal(still.length, 1, 'a model that fails to load shows the still picture');
  assert.match(textOf(inst.tree), /โหลดโมเดล 3D ไม่สำเร็จ/);
  inst.unmount();

  inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  resolveAll(inst);
  const canvas = GL.renderers.at(-1).domElement;
  canvas.dispatch('webglcontextlost', { preventDefault() {} });
  inst.flush();
  still = findAll(inst.tree, (n) => n.type === 'img' && /characters\/moocha/.test(n.props.src));
  assert.equal(still.length, 1, 'a lost GPU context falls back to the still picture');
  assert.equal(raf.cbs.size, 0, 'and stops drawing');
  inst.unmount();
});

test('head tracking turns the node named Head, on top of the playing clip', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  const host = attach(inst);
  const [g] = resolveAll(inst);
  canvasHost(inst).props.onPointerMove({ clientX: 400, clientY: 165, pointerType: 'mouse', currentTarget: host });
  frames(inst, 120);
  const yaw = new T.Euler().setFromQuaternion(g.parts.head.quaternion, 'YXZ').y;
  assert.ok(yaw > 0.3, `the head turns toward the pointer (yaw ${yaw.toFixed(3)} rad, target 0.45)`);
  assert.ok(Math.abs(new T.Euler().setFromQuaternion(g.parts.headMesh.quaternion).y) < 1e-6, 'Head_Mesh is left alone');
  inst.unmount();

  // A clip whose value does not change: three's mixer skips the write, so a
  // per-frame offset must not stack up.
  const inst2 = mount(Viewer, { initialId: 'moocha' });
  const host2 = attach(inst2);
  const [g2] = resolveAll(inst2, { constantIdle: true });
  canvasHost(inst2).props.onPointerMove({ clientX: 400, clientY: 165, pointerType: 'mouse', currentTarget: host2 });
  frames(inst2, 400);
  const yaw2 = new T.Euler().setFromQuaternion(g2.parts.head.quaternion, 'YXZ').y;
  assert.ok(yaw2 > 0.4 && yaw2 < 0.47, `the offset settles at its target and does not accumulate (yaw ${yaw2.toFixed(3)})`);
  inst2.unmount();
});

test('reduced motion: no automatic celebration and no confetti', () => {
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  const inst = mount(Viewer, { initialId: 'moocha', initialAction: 'celebrate' });
  attach(inst);
  resolveAll(inst);
  frames(inst, 30);
  assert.ok(pressedStyle(inst, 'หายใจ'), 'the model starts on idle');
  assert.equal(confetti().material.opacity, 0, 'no confetti appears');
  click(inst, 'ดีใจ');
  frames(inst, 30);
  assert.equal(confetti().material.opacity, 0, 'a tap on celebrate plays the clip without confetti');
  inst.unmount();

  // Turning reduced motion on while a celebration runs stops it at once.
  globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };
  const live = mount(Viewer, { initialId: 'moocha', initialAction: 'celebrate' });
  attach(live);
  resolveAll(live);
  frames(live, 20);
  assert.ok(confetti().material.opacity > 0.5, 'confetti while motion is allowed');
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  live.render();
  frames(live, 90);
  assert.ok(confetti().material.opacity < 0.01, 'the confetti fades out as soon as reduced motion is chosen');
  assert.equal(timers.list.size, 0, 'and its timer is cleared');
  live.unmount();
});

test('unmounting after the GPU refused a call never throws into the screen', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  resolveAll(inst);
  const r = GL.renderers.at(-1);
  r.forceContextLoss = () => { throw new Error('context already lost'); };
  r.dispose = () => { throw new Error('context already lost'); };
  assert.doesNotThrow(() => inst.unmount());
});

test('the canvas lets the page scroll and only zooms on ctrl/meta or focus', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  const host = attach(inst);
  resolveAll(inst);
  const hostNode = canvasHost(inst);
  assert.equal(hostNode.props.style.touchAction, 'pan-y', 'vertical swipes scroll the page');
  const wheel = (extra) => {
    let prevented = false;
    for (const { f } of host.listeners.wheel || []) f({ deltaY: 100, preventDefault() { prevented = true; }, ...extra });
    return prevented;
  };
  assert.equal(wheel({}), false, 'a plain wheel scrolls the page');
  assert.equal(wheel({ ctrlKey: true }), true, 'ctrl + wheel (and trackpad pinch) zooms');
  assert.equal(wheel({ metaKey: true }), true, 'cmd + wheel zooms');
  doc.activeElement = host;
  assert.equal(wheel({}), true, 'once the canvas has focus the wheel zooms');
  assert.doesNotMatch(textOf(inst.tree), /ซูม/, 'a touch screen is not promised zoom');
  inst.unmount();

  env.fine = true;
  const inst2 = mount(Viewer, { initialId: 'moocha' });
  assert.match(textOf(inst2.tree), /ซูม/, 'a mouse user is told how to zoom');
  inst2.unmount();
});

test('controls are 44 px, named and stateful; the canvas has a name; labels are plain Thai', () => {
  const inst = mount(Viewer, { initialId: 'moocha' });
  const chips = findAll(inst.tree, (n) => n.type === 'button' && 'aria-pressed' in n.props);
  assert.equal(chips.length, 9, 'every mascot chip exposes aria-pressed');
  assert.equal(chips.filter((c) => c.props['aria-pressed'] === true).length, 1, 'exactly one is pressed');
  for (const b of findAll(inst.tree, (n) => n.type === 'button')) {
    assert.equal(b.props.style?.minHeight, 'var(--touch-min)', `"${textOf(b)}" meets the touch minimum`);
  }
  const host = canvasHost(inst);
  assert.equal(host.props.role, 'img');
  assert.match(host.props['aria-label'], /มูชา/, 'the canvas is named after the mascot');
  const text = textOf(inst.tree);
  assert.doesNotMatch(text, /\((Idle|Wave|Celebrate)\)|Three\.js/, 'no English parentheticals or library names');
  inst.unmount();
});

test('the stage follows the theme instead of a fixed white', () => {
  env.cssVars = { '--clr-surface': ' #2b2419', '--clr-border': '#524332' };
  const inst = mount(Viewer, { initialId: 'moocha' });
  attach(inst);
  const stage = findAll(inst.tree, (n) => typeof n.props?.style?.background === 'string' && /radial-gradient/.test(n.props.style.background))[0];
  assert.ok(stage, 'the stage has a gradient background');
  assert.match(stage.props.style.background, /var\(--clr-surface/, 'built from theme tokens');
  assert.doesNotMatch(stage.props.style.background, /248,\s*250,\s*252/, 'not the fixed near-white');
  let pedestal = null;
  sceneOf().traverse((o) => { if (o.isMesh && o.geometry?.type === 'CylinderGeometry') pedestal = o; });
  assert.equal(pedestal.material.color.getHexString(), '2b2419', 'the pedestal takes the theme surface colour');
  inst.unmount();
});
