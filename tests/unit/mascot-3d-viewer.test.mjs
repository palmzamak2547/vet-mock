// ============================================================
// MascotSquad3DViewer — one study buddy in 3D: lifecycle, framing, phones
// ============================================================
// The viewer opens after every finished Pomodoro, on demand on Results, and
// on the Mochi page under the buddy row. These tests mount its real source
// (tests/helpers/fake-react.mjs) against the real three.js maths, animation
// mixer and scene graph, and Mochi's real Motion Kit model; only
// WebGLRenderer (no GPU in Node) and GLTFLoader (no network) are replaced,
// and both record what the component asked of them. What they pin:
//
// - The screen chooses the buddy (`id`, or Results' `initialId`); the viewer
//   has no chooser of its own. A change swaps the model inside one renderer,
//   only when the next model is ready, and the newcomer waves hello.
// - Mochi is drawn from the Motion Kit's own model: no download, the same
//   idle / wave / celebrate as the clinic mascots.
// - Framing follows the stage: a narrow phone stage puts the camera farther
//   back than a wide one, so nothing is cut.
// - A late model is discarded; swaps and unmount release geometry,
//   materials, the mixer and the GL context; no timer or frame outlives it.
// - Drawing stops off-screen, in a hidden tab, and once nothing moves
//   (reduced motion settles to a still frame); a 120 Hz screen draws at 60.
// - Before the first model, during a slow swap and while the GPU context is
//   away, the buddy's picture holds the stage; the context coming back
//   resumes 3D in the same renderer. No WebGL or a failed model shows the
//   picture with a note.
// - Head tracking turns the node named exactly 'Head', on top of the clip.
// - Reduced motion: no automatic celebration, no confetti, no idle button.
// - The stage lets the page scroll and only zooms on ctrl/meta or focus.

import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
async function microtasks(inst, rounds = 20) {
  for (let i = 0; i < rounds; i++) await Promise.resolve();
  inst.flush();
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
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    removeChild(c) { this.children = this.children.filter((x) => x !== c); c.parentNode = null; return c; },
    contains(c) { return c === this || this.children.includes(c); },
    remove() { this.parentNode?.removeChild(this); },
    addEventListener(t, f, o) { (listeners[t] ||= []).push({ f, o }); },
    removeEventListener(t, f) { listeners[t] = (listeners[t] || []).filter((x) => x.f !== f); },
    dispatch(t, e) { for (const { f } of listeners[t] || []) f(e); },
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight, right: this.clientWidth, bottom: this.clientHeight }; },
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
    { match: '\\.css$', contents: '' },
  ],
});
const T = globalThis.__mascotThree;
const css = readFileSync(path.join(repoRoot, 'src/styles-buddy.css'), 'utf8');

// ── A GLB as GLTFLoader would hand it over ────────────────────────────────
function gltfFor(id, { constantIdle = false, height = 0.8 } = {}) {
  const root = new T.Group();
  root.name = id;
  const body = new T.Mesh(new T.BoxGeometry(0.4, height, 0.4), new T.MeshStandardMaterial());
  body.name = `${id}-Body`;
  body.position.y = height / 2;
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
const picture = (inst) => findAll(inst.tree, (n) => n.type === 'img' && n.props.className === 'vmx-buddy-stage-picture')[0];
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
const pressed = (inst, text) => buttonByText(inst, text)?.props['aria-pressed'] === true;
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

test('the screen chooses the buddy: no chooser inside, a change swaps in place and the newcomer waves', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  const chooser = findAll(inst.tree, (n) => n.type === 'button' && /มูชา|ไกลดี้|พอร์กี้/.test(textOf(n)));
  assert.equal(chooser.length, 0, 'the viewer offers no buddy buttons of its own');
  assert.equal(idOf(loads[0].url), 'moocha');
  const [moocha] = resolveAll(inst);
  assert.ok(pressed(inst, 'หายใจ'), 'the first model starts on idle');
  inst.update({ id: 'porky' });
  assert.equal(idOf(loads[0].url), 'porky', 'the new buddy is requested');
  assert.ok(sceneOf().getObjectByName('moocha'), 'the last buddy stays on the pedestal until the next is ready');
  const [porky] = resolveAll(inst);
  assert.equal(sceneOf().getObjectByName('moocha'), undefined, 'then it leaves');
  assert.ok(moocha.parts.body.geometry.__disposed, 'and is released');
  assert.ok(sceneOf().getObjectByName('porky'));
  assert.ok(pressed(inst, 'โบกมือ'), 'the newcomer waves hello');
  assert.equal(GL.renderers.length, 1, 'one renderer for the whole mount');
  assert.match(canvasHost(inst).props['aria-label'], /พอร์กี้/, 'the stage is named after the buddy on it');
  inst.update({ id: 'porky' });
  assert.equal(loads.length, 0, 'the same buddy again loads nothing');
  inst.unmount();
  assert.ok(porky.parts.body.geometry.__disposed);
});

test('Results still passes initialId; a celebration plays once, returns to idle and never rebuilds', () => {
  const inst = mount(Viewer, { initialId: 'oto', initialAction: 'celebrate' });
  attach(inst);
  assert.equal(idOf(loads[0].url), 'oto');
  resolveAll(inst);
  assert.ok(pressed(inst, 'ดีใจ'), 'the celebration starts when the model arrives');
  for (let i = 0; i < 6; i++) frames(inst, 30);
  assert.equal(GL.renderers.length, 1, 'one WebGLRenderer for the whole mount');
  assert.equal(GL.renderers[0].disposed, false, 'the live renderer was never torn down');
  assert.ok(pressed(inst, 'หายใจ'), 'after celebrating once the mascot is back on idle');
  inst.unmount();
  assert.equal(timers.list.size, 0, 'no celebration timer outlives the viewer');
  assert.equal(raf.cbs.size, 0, 'no animation frame outlives the viewer');
});

test('Mochi is built from the Motion Kit model: no download, it moves, waves and celebrates', async () => {
  const inst = mount(Viewer, { id: 'mochi', initialAction: 'celebrate' });
  attach(inst);
  await microtasks(inst);
  assert.equal(loads.length, 0, 'no GLB is fetched for Mochi');
  const mochi = sceneOf() && (() => { let m = null; sceneOf().traverse((o) => { if (o.name === 'Mochi') m = o; }); return m; })();
  assert.ok(mochi, 'Mochi stands on the pedestal');
  const box = new T.Box3().setFromObject(mochi.getObjectByName('Body'));
  assert.ok(Math.abs(box.max.y - box.min.y - 0.86) < 0.02, `scaled to the squad's height (${(box.max.y - box.min.y).toFixed(3)})`);
  assert.ok(Math.abs(box.min.y) < 0.02, 'standing on the pedestal');
  assert.ok(pressed(inst, 'ดีใจ'), 'the first clip is the one the screen asked for');
  const bodyNode = mochi.getObjectByName('Body');
  const heights = new Set();
  for (let i = 0; i < 40; i++) { frames(inst, 3); heights.add(bodyNode.position.y.toFixed(4)); }
  assert.ok(heights.size > 3, 'the celebrate pose moves the body');
  frames(inst, 200);
  assert.ok(pressed(inst, 'หายใจ'), 'after the 4.4 s celebration Mochi returns to idle');
  inst.update({ id: 'glidy' });
  resolveAll(inst);
  assert.equal((() => { let m = null; sceneOf().traverse((o) => { if (o.name === 'Mochi') m = o; }); return m; })(), null, 'Mochi leaves when another buddy is ready');
  inst.update({ id: 'mochi' });
  await microtasks(inst);
  assert.ok(pressed(inst, 'โบกมือ'), 'Mochi picked again waves hello');
  inst.unmount();
});

test('framing follows the stage: a narrow phone stage puts the camera farther back', () => {
  const distanceFor = (w, h) => {
    GL.renderers.length = 0;
    const inst = mount(Viewer, { id: 'moocha' });
    attach(inst, fakeElement({ clientWidth: w, clientHeight: h }));
    resolveAll(inst);
    frames(inst, 2);
    const cam = GL.renderers.at(-1).lastCamera;
    const z = cam.position.z;
    inst.unmount();
    return z;
  };
  const wide = distanceFor(400, 330);
  const narrow = distanceFor(250, 330);
  const landscape = distanceFor(560, 232);
  assert.ok(narrow > wide, `narrow ${narrow.toFixed(2)} vs wide ${wide.toFixed(2)}: farther back on the narrow stage`);
  assert.ok(Number.isFinite(landscape) && landscape > 0.5 && landscape < 10, 'a short landscape stage frames too');

  // What "not cut" means: the pedestal rim projects inside the stage. The old
  // fixed camera (0.55 up, 2.4 back, looking at 0.5) cut it on this stage.
  const rim = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    rim.push(new T.Vector3(Math.cos(a) * 0.58, 0, Math.sin(a) * 0.58), new T.Vector3(Math.cos(a) * 0.58, -0.035, Math.sin(a) * 0.58));
  }
  const worst = (cam) => {
    cam.updateMatrixWorld(true);
    let m = 0;
    for (const p of rim) { const v = p.clone().project(cam); m = Math.max(m, Math.abs(v.x), Math.abs(v.y)); }
    return m;
  };
  const old = new T.PerspectiveCamera(30, 250 / 330, 0.1, 20);
  old.position.set(0, 0.55, 2.4);
  old.lookAt(0, 0.5, 0);
  assert.ok(worst(old) > 1, `the old camera cut the pedestal on a 250 px stage (reach ${worst(old).toFixed(3)})`);
  GL.renderers.length = 0;
  const fitted = mount(Viewer, { id: 'moocha' });
  attach(fitted, fakeElement({ clientWidth: 250, clientHeight: 330 }));
  resolveAll(fitted);
  frames(fitted, 2);
  const reach = worst(GL.renderers.at(-1).lastCamera);
  assert.ok(reach <= 0.93, `the fitted camera keeps the pedestal inside with a margin (reach ${reach.toFixed(3)})`);
  fitted.unmount();

  // A resize (turning the phone) refits the same model.
  const inst = mount(Viewer, { id: 'moocha' });
  const host = attach(inst, fakeElement({ clientWidth: 400, clientHeight: 330 }));
  resolveAll(inst);
  frames(inst, 2);
  const before = GL.renderers.at(-1).lastCamera.position.z;
  host.clientWidth = 250;
  ro.find((o) => o.targets.includes(host)).cb([{ target: host }]);
  frames(inst, 2);
  assert.deepEqual(GL.renderers.at(-1).size, [250, 330]);
  assert.ok(GL.renderers.at(-1).lastCamera.position.z > before, 'the camera steps back on the narrower stage');
  assert.ok(worst(GL.renderers.at(-1).lastCamera) <= 0.93, 'and the pedestal stays inside after turning the phone');
  inst.unmount();
});

test('a model that loads late is discarded and cannot take over the buddy on screen', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  inst.update({ id: 'glidy' });
  inst.update({ id: 'porky' });
  const porkyJob = loads.findIndex((j) => idOf(j.url) === 'porky');
  assert.notEqual(porkyJob, -1, 'porky was requested');
  const [job] = loads.splice(porkyJob, 1);
  const porky = gltfFor('porky');
  job.onLoad(porky);
  inst.flush();
  const late = resolveAll(inst); // moocha and glidy finish after porky
  frames(inst, 70);
  const scene = sceneOf();
  for (const g of late) {
    assert.equal(scene.getObjectByName(g.parts.root.name), undefined, `${g.parts.root.name} is not in the scene`);
    assert.ok(g.parts.body.geometry.__disposed, `${g.parts.root.name}'s late geometry is disposed`);
    assert.ok(g.parts.body.material.__disposed, `${g.parts.root.name}'s late material is disposed`);
  }
  assert.ok(scene.getObjectByName('porky'), 'porky is the model on the stage');
  const z = new T.Euler().setFromQuaternion(porky.parts.head.quaternion, 'YXZ').z;
  assert.ok(Math.abs(z) > 0.005, `porky's own clip is driving its head (z=${z})`);
  inst.unmount();
});

test('unmount releases geometry, materials, the mixer, observers and the GL context', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  const [moocha] = resolveAll(inst);
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
  assert.ok(moocha.parts.headMesh.material.__disposed, 'the model on stage is disposed with the scene');
  assert.equal(raf.cbs.size, 0, 'no frame is scheduled after unmount');
  assert.equal(timers.list.size, 0, 'no timer is pending after unmount');
  assert.ok(io.every((o) => o.dead) && ro.every((o) => o.dead), 'observers are disconnected');
  assert.equal((docListeners.visibilitychange || []).length, 0, 'the visibility listener is removed');
});

test('the loop stops off-screen and in a hidden tab, and a 120 Hz screen draws at 60', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  const host = attach(inst);
  resolveAll(inst);
  const r = GL.renderers[0];
  assert.equal(r.opts.powerPreference, 'low-power', 'asks for the low-power GPU');
  assert.ok(r.pixelRatio <= 1.5, `pixel ratio is capped (got ${r.pixelRatio} on a DPR-3 screen)`);
  const observer = io.find((o) => o.targets.includes(host));
  assert.ok(observer, 'an IntersectionObserver watches the stage');
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
  const at120 = r.renders;
  frames(inst, 60, 1000 / 120);
  const drawn = r.renders - at120;
  assert.ok(drawn >= 28 && drawn <= 32, `120 Hz frames for half a second draw ~30 times, not 60 (drew ${drawn})`);
  inst.unmount();
});

test('reduced motion settles to a still frame and a touch wakes it', () => {
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  const inst = mount(Viewer, { id: 'moocha' });
  const host = attach(inst);
  resolveAll(inst);
  frames(inst, 60);
  const r = GL.renderers[0];
  assert.equal(raf.cbs.size, 0, 'nothing moves, so nothing is scheduled');
  const still = r.renders;
  frames(inst, 30);
  assert.equal(r.renders, still, 'and nothing is redrawn');
  canvasHost(inst).props.onPointerDown({ clientX: 100, clientY: 100, pointerType: 'touch', pointerId: 1, currentTarget: host, timeStamp: now });
  assert.ok(raf.cbs.size > 0, 'a touch wakes the loop');
  // A flick: 8 px per 60 Hz event for ten events, lifted while moving.
  for (let i = 1; i <= 10; i++) {
    advance(1000 / 60);
    canvasHost(inst).props.onPointerMove({ clientX: 100 + i * 8, clientY: 100, pointerType: 'touch', currentTarget: host, timeStamp: now });
  }
  canvasHost(inst).props.onPointerUp({ currentTarget: host, timeStamp: now });
  frames(inst, 300);
  assert.ok(r.renders > still, 'the turn is drawn');
  assert.equal(raf.cbs.size, 0, 'and once it has settled the loop stops again');
  inst.unmount();
});

test('the buddy\'s picture holds the stage before the model and during a slow swap', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  assert.equal(canvasHost(inst).props['data-ready'], undefined, 'no empty pedestal before the model');
  assert.equal(picture(inst).props['data-hidden'], undefined, 'the picture shows meanwhile');
  assert.match(picture(inst).props.src, /characters\/moocha/);
  resolveAll(inst);
  assert.equal(canvasHost(inst).props['data-ready'], '', 'the model fades in');
  assert.equal(picture(inst).props['data-hidden'], '', 'and the picture out');
  inst.update({ id: 'glidy' });
  assert.equal(canvasHost(inst).props['data-ready'], '', 'a quick swap keeps the last buddy on stage');
  advance(300);
  inst.flush();
  assert.equal(canvasHost(inst).props['data-ready'], undefined, 'a slow one hides it');
  assert.match(picture(inst).props.src, /characters\/glidy/, 'and shows the new buddy\'s picture');
  assert.equal(picture(inst).props['data-hidden'], undefined);
  assert.equal(buttonByText(inst, 'โบกมือ').props.disabled, true, 'moves wait for the model');
  resolveAll(inst);
  assert.equal(canvasHost(inst).props['data-ready'], '');
  assert.equal(buttonByText(inst, 'โบกมือ').props.disabled, false);
  inst.unmount();
});

test('a lost GPU context shows the picture and comes back in the same renderer', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  resolveAll(inst);
  frames(inst, 3);
  const r = GL.renderers[0];
  let prevented = false;
  r.domElement.dispatch('webglcontextlost', { preventDefault() { prevented = true; } });
  inst.flush();
  assert.equal(prevented, true, 'the loss is marked restorable');
  assert.ok(canvasHost(inst), 'the stage stays mounted');
  assert.equal(canvasHost(inst).props['data-ready'], undefined, 'the dead canvas is hidden');
  assert.equal(picture(inst).props['data-hidden'], undefined, 'the buddy\'s picture shows');
  assert.doesNotMatch(textOf(inst.tree), /เปิดภาพ 3D ไม่ได้/, 'no claim that the device cannot draw 3D');
  assert.equal(raf.cbs.size, 0, 'drawing stops');
  assert.doesNotMatch(textOf(inst.tree), /ลาก/, 'and the turning hint goes, since there is nothing to turn');
  assert.equal(r.disposed, false, 'nothing is torn down');
  r.domElement.dispatch('webglcontextrestored', {});
  inst.flush();
  assert.equal(canvasHost(inst).props['data-ready'], '', 'the context is back: 3D again');
  const back = r.renders;
  frames(inst, 3);
  assert.ok(r.renders > back, 'drawing resumes');
  assert.equal(GL.renderers.length, 1, 'in the same renderer');
  inst.unmount();
});

test('no WebGL or a failed model shows the 2D buddy with a short note', () => {
  GL.fail = true;
  let inst;
  assert.doesNotThrow(() => {
    inst = mount(Viewer, { id: 'porky' });
    attach(inst);
  }, 'a device without WebGL must not throw into the screen');
  let still = findAll(inst.tree, (n) => n.type === 'img' && /characters\/porky/.test(n.props.src) && n.props.className !== 'vmx-buddy-stage-picture');
  assert.equal(still.length, 1, 'the still picture of the chosen buddy is shown');
  assert.match(textOf(inst.tree), /เปิดภาพ 3D ไม่ได้/, 'with a short note saying why');
  assert.equal(loads.length, 0, 'no model is fetched for a device that cannot draw it');
  assert.equal(findAll(inst.tree, (n) => n.type === 'button').length, 0, 'and no moves to press');
  inst.unmount();

  GL.fail = false;
  inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  loads.shift().onError(new Error('404'));
  inst.flush();
  still = findAll(inst.tree, (n) => n.type === 'img' && /characters\/moocha/.test(n.props.src) && n.props.className !== 'vmx-buddy-stage-picture');
  assert.equal(still.length, 1, 'a model that fails to load shows the still picture');
  assert.match(textOf(inst.tree), /โหลดโมเดล 3D ไม่สำเร็จ/);
  inst.update({ id: 'oto' });
  resolveAll(inst);
  assert.doesNotMatch(textOf(inst.tree), /ไม่สำเร็จ/, 'the next buddy loads normally');
  assert.ok(sceneOf().getObjectByName('oto'));
  inst.unmount();
});

test('head tracking turns the node named Head, on top of the playing clip', () => {
  const inst = mount(Viewer, { id: 'moocha' });
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
  const inst2 = mount(Viewer, { id: 'moocha' });
  const host2 = attach(inst2);
  const [g2] = resolveAll(inst2, { constantIdle: true });
  canvasHost(inst2).props.onPointerMove({ clientX: 400, clientY: 165, pointerType: 'mouse', currentTarget: host2 });
  frames(inst2, 400);
  const yaw2 = new T.Euler().setFromQuaternion(g2.parts.head.quaternion, 'YXZ').y;
  assert.ok(yaw2 > 0.4 && yaw2 < 0.47, `the offset settles at its target and does not accumulate (yaw ${yaw2.toFixed(3)})`);
  inst2.unmount();
});

test('reduced motion: no automatic celebration, no confetti, no idle button', () => {
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  const inst = mount(Viewer, { id: 'moocha', initialAction: 'celebrate' });
  attach(inst);
  resolveAll(inst);
  frames(inst, 30);
  assert.equal(buttonByText(inst, 'หายใจ'), undefined, 'idle holds a still rest pose, so it has no button');
  assert.equal(confetti().material.opacity, 0, 'no confetti appears');
  click(inst, 'ดีใจ');
  frames(inst, 30);
  assert.equal(confetti().material.opacity, 0, 'a tap on celebrate plays the clip without confetti');
  inst.update({ id: 'porky' });
  resolveAll(inst);
  assert.equal(pressed(inst, 'โบกมือ'), false, 'a new buddy does not wave on its own');
  inst.unmount();

  // Turning reduced motion on while a celebration runs stops it at once.
  globalThis.__motion = { preferences: { mode: 'auto', companion: true }, systemReduced: false, reduced: false };
  const live = mount(Viewer, { id: 'moocha', initialAction: 'celebrate' });
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
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  resolveAll(inst);
  const r = GL.renderers.at(-1);
  r.forceContextLoss = () => { throw new Error('context already lost'); };
  r.dispose = () => { throw new Error('context already lost'); };
  assert.doesNotThrow(() => inst.unmount());
});

test('the stage lets the page scroll, zooms only on ctrl/meta or focus, and offers a way back to the front', () => {
  const inst = mount(Viewer, { id: 'moocha' });
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
  assert.equal(wheel({}), true, 'once the stage has focus the wheel zooms');
  inst.flush();
  assert.ok(buttonByText(inst, 'กลับด้านหน้า'), 'a zoomed view offers the way back');
  click(inst, 'กลับด้านหน้า');
  assert.equal(buttonByText(inst, 'กลับด้านหน้า'), undefined, 'facing front again, the control goes away');
  canvasHost(inst).props.onPointerDown({ clientX: 100, clientY: 100, pointerType: 'touch', pointerId: 1, currentTarget: host });
  canvasHost(inst).props.onPointerMove({ clientX: 300, clientY: 100, pointerType: 'touch', currentTarget: host });
  canvasHost(inst).props.onPointerUp({ currentTarget: host });
  inst.flush();
  assert.ok(buttonByText(inst, 'กลับด้านหน้า'), 'turned away from the front: the control appears');
  assert.doesNotMatch(textOf(inst.tree), /ซูม/, 'a touch screen is not promised zoom');
  inst.unmount();

  env.fine = true;
  const inst2 = mount(Viewer, { id: 'moocha' });
  assert.doesNotMatch(textOf(inst2.tree), /ลาก/, 'no turning hint before there is a model to turn');
  attach(inst2);
  resolveAll(inst2);
  assert.match(textOf(inst2.tree), /ซูม/, 'a mouse user is told how to zoom');
  inst2.unmount();
});

test('moves are 44 px and stateful, the stage is named, labels are plain Thai with no emoji icons', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  resolveAll(inst);
  const moves = findAll(inst.tree, (n) => n.type === 'button');
  assert.equal(moves.length, 3);
  for (const b of moves) {
    assert.equal(b.props.className, 'vmx-buddy-action', `"${textOf(b)}" is a buddy move`);
    assert.ok('aria-pressed' in b.props, `"${textOf(b)}" says whether it is playing`);
    assert.doesNotMatch(textOf(b), /\p{Extended_Pictographic}/u, `"${textOf(b)}" carries no emoji icon`);
  }
  assert.match(css.match(/\.vmx-buddy-action \{[^}]*\}/)[0], /min-height: var\(--touch-min\)/);
  assert.match(css.match(/\.vmx-buddy-face \{[^}]*\}/)[0], /min-height: var\(--touch-min\)/);
  const host = canvasHost(inst);
  assert.equal(host.props.role, 'img');
  assert.match(host.props['aria-label'], /มูชา/, 'the stage is named after the buddy');
  const text = textOf(inst.tree);
  assert.doesNotMatch(text, /\((Idle|Wave|Celebrate)\)|Three\.js|\p{Extended_Pictographic}/u, 'no English parentheticals, library names or emoji');
  inst.unmount();
});

test('the stage follows the theme: a flat themed backdrop, and the pedestal takes the surface colour', () => {
  env.cssVars = { '--clr-surface': ' #2b2419', '--clr-border': '#524332' };
  const inst = mount(Viewer, { id: 'moocha' });
  attach(inst);
  const stage = css.match(/\.vmx-buddy-stage \{[^}]*\}/)[0];
  assert.match(stage, /background: var\(--clr-surface-2\)/, 'the backdrop is a theme token');
  assert.doesNotMatch(stage, /gradient|#[0-9a-f]{3,6}\b|rgb/i, 'no fixed colour and no gradient');
  let pedestal = null;
  sceneOf().traverse((o) => { if (o.isMesh && o.geometry?.type === 'CylinderGeometry') pedestal = o; });
  assert.equal(pedestal.material.color.getHexString(), '2b2419', 'the pedestal takes the theme surface colour');
  inst.unmount();
});

test('reduced motion: a turn stops when the finger lifts, and facing front is instant', () => {
  globalThis.__motion = { preferences: { mode: 'quiet', companion: true }, systemReduced: false, reduced: true };
  const inst = mount(Viewer, { id: 'moocha' });
  const host = attach(inst);
  resolveAll(inst);
  frames(inst, 40);
  const group = () => sceneOf().getObjectByName('moocha').parent;
  canvasHost(inst).props.onPointerDown({ clientX: 100, clientY: 100, pointerType: 'touch', pointerId: 1, currentTarget: host, timeStamp: now });
  for (let i = 1; i <= 6; i++) {
    advance(1000 / 60);
    canvasHost(inst).props.onPointerMove({ clientX: 100 + i * 12, clientY: 100, pointerType: 'touch', currentTarget: host, timeStamp: now });
  }
  canvasHost(inst).props.onPointerUp({ currentTarget: host, timeStamp: now });
  frames(inst, 60);
  const settled = group().rotation.y;
  assert.ok(Math.abs(settled - 72 * 0.008) < 0.01, `the model stops where the finger left it (${settled.toFixed(3)} rad), no flick`);
  inst.flush();
  click(inst, 'กลับด้านหน้า');
  frames(inst, 1);
  assert.ok(Math.abs(group().rotation.y) < 1e-9, 'facing front is immediate under reduced motion');
  inst.unmount();
});

test('a tap on the buddy says hi (it waves); a turn does not', () => {
  const inst = mount(Viewer, { id: 'moocha' });
  const host = attach(inst);
  const tap = () => {
    canvasHost(inst).props.onPointerDown({ clientX: 200, clientY: 160, pointerType: 'touch', pointerId: 1, currentTarget: host, timeStamp: now });
    advance(80);
    canvasHost(inst).props.onPointerUp({ currentTarget: host, timeStamp: now });
    inst.flush();
  };
  tap();
  assert.equal(pressed(inst, 'โบกมือ'), false, 'nothing to wave before the model is on stage');
  resolveAll(inst);
  assert.ok(pressed(inst, 'หายใจ'));
  tap();
  assert.ok(pressed(inst, 'โบกมือ'), 'a tap makes the buddy wave');
  frames(inst, 120);
  assert.ok(pressed(inst, 'หายใจ'), 'and it goes back to idle');
  canvasHost(inst).props.onPointerDown({ clientX: 200, clientY: 160, pointerType: 'touch', pointerId: 1, currentTarget: host, timeStamp: now });
  advance(50);
  canvasHost(inst).props.onPointerMove({ clientX: 240, clientY: 160, pointerType: 'touch', currentTarget: host, timeStamp: now });
  canvasHost(inst).props.onPointerUp({ currentTarget: host, timeStamp: now });
  inst.flush();
  assert.equal(pressed(inst, 'โบกมือ'), false, 'a turn is not a poke');
  inst.unmount();
});
