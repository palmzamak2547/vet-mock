// ============================================================
// Changing the comparison specimen leaves the main model alone (PF-15)
// ============================================================
// AtlasScene built the renderer and every view in one effect keyed on
// [specimen.id, comparison?.id, quality]. Picking another comparison therefore
// tore down the WebGL context, forced a context loss, and parsed and uploaded
// the unchanged primary model again: the stage flashed and waited.
//
// Entering or leaving comparison is different: it changes the stage layout. On
// a phone the panes stack and the stage grows from 320 to 600 px, and a WebGL
// canvas whose drawing buffer is resized after it has been shown stays blank in
// WebKit (both panes empty, rotating changes nothing). So a mode change starts
// on a fresh canvas sized for the new layout, as it always did, and only a
// change of WHICH specimen is compared keeps the renderer.
//
// The component is not mounted in a browser here. Its source is loaded with
// the JSX return cut off and run under a small hook harness that follows
// React's rule for passive effects (every changed effect's cleanup first, in
// declaration order, then every create). three.js is real; only the WebGL
// renderer, the orbit controls, the glTF parser and the asset cache are fakes,
// so the test counts renderers, resizes, downloads, parses and disposals
// directly. The browser half of the blank-pane bug is
// tests/e2e/atlas-library.spec.js:14 on webkit-mobile.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { atlasFitDistance, atlasMotionValue } from '../../src/lib/atlas-workspace.js';
import { atlasIsTap } from '../../src/lib/atlas.js';

const source = readFileSync(new URL('../../src/components/AtlasScene.jsx', import.meta.url), 'utf8');

class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
  }
  removeEventListener(type, fn) { this.listeners.get(type)?.delete(fn); }
  dispatchEvent(type, event = {}) { for (const fn of [...(this.listeners.get(type) || [])]) fn(event); }
  listenerCount() { let n = 0; for (const set of this.listeners.values()) n += set.size; return n; }
}

function element(rect) {
  const el = new Events();
  el.rect = rect;
  el.children = [];
  el.style = {};
  el.parentElement = null;
  el.setAttribute = () => {};
  el.getBoundingClientRect = () => ({
    ...el.rect, x: el.rect.left, y: el.rect.top,
    right: el.rect.left + el.rect.width, bottom: el.rect.top + el.rect.height,
  });
  Object.defineProperty(el, 'clientWidth', { get: () => el.rect.width });
  Object.defineProperty(el, 'clientHeight', { get: () => el.rect.height });
  el.prepend = (child) => { el.children.unshift(child); child.parentNode = el; };
  el.remove = () => {
    if (el.parentNode) el.parentNode.children = el.parentNode.children.filter((c) => c !== el);
    el.parentNode = null;
  };
  return el;
}

function specimen(id, count = 3) {
  const parts = Array.from({ length: count }, (_, i) => ({ id: `${id}-p${i}`, en: `${id} part ${i}` }));
  const profile = (quality) => ({ model: `${id}-${quality}.glb`, parts: parts.map((p) => p.id) });
  return {
    id, kind: 'segmented', title: id, titleEn: `${id} specimen`, authors: 'authors', license: 'licence',
    sourceUrl: 'https://example.invalid', parts, profiles: { quick: profile('quick'), detail: profile('detail') },
  };
}

// The stage as styles-atlas.css lays it out. Desktop: the stage keeps its size
// and the panes sit side by side. Phone: the stage is 320 px tall with one
// pane and 600 px with two stacked panes.
const LAYOUTS = {
  desktop: (comparing) => ({
    host: { left: 0, top: 0, width: 800, height: 400 },
    left: { left: 0, top: 0, width: comparing ? 400 : 800, height: 400 },
    right: { left: 400, top: 0, width: 400, height: 400 },
  }),
  phone: (comparing) => ({
    host: { left: 0, top: 0, width: 390, height: comparing ? 600 : 320 },
    left: { left: 0, top: 0, width: 390, height: comparing ? 294 : 320 },
    right: { left: 0, top: 306, width: 390, height: 294 },
  }),
};

function world(layout = 'desktop') {
  const w = {
    renderers: [], controls: [], loads: [], parsed: [], disposed: [], statuses: [], frames: new Map(),
    resizeObservers: [], nextFrame: 1, layout: LAYOUTS[layout],
  };
  class Renderer {
    constructor() {
      this.domElement = element({ left: 0, top: 0, width: 800, height: 400 });
      this.domElement.width = 800;
      this.domElement.height = 400;
      this.drawn = [];
      this.resizedOnScreen = false;
      w.renderers.push(this);
    }
    setPixelRatio(ratio) { this.pixelRatio = ratio; }
    setClearColor() {}
    setSize(width, height) {
      // A new drawing-buffer size for a canvas that has already drawn a frame.
      if (this.size && this.drawn.length && (this.size[0] !== width || this.size[1] !== height))
        this.resizedOnScreen = true;
      this.size = [width, height];
    }
    setScissorTest() {}
    clear() { this.drawn.push('clear'); }
    setViewport() {}
    setScissor() {}
    render(scene) {
      const names = [];
      scene.traverse((o) => { if (o.isMesh) names.push(o.name); });
      this.drawn.push(names);
    }
    dispose() { this.disposed = true; }
    forceContextLoss() { this.contextLost = true; }
  }
  class Controls extends Events {
    constructor(camera, domElement) {
      super();
      this.object = camera;
      this.domElement = domElement;
      this.target = new THREE.Vector3();
      w.controls.push(this);
    }
    update() { this.object.lookAt(this.target); return false; }
    dispose() { this.disposed = true; }
  }
  class Loader {
    async parseAsync(bytes) {
      w.parsed.push(bytes.model);
      const group = new THREE.Group();
      bytes.parts.forEach((id, index) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial());
        mesh.name = id;
        mesh.geometry.translate(index * 0.3 - 0.3, index * 0.1, 0);
        const dispose = mesh.geometry.dispose.bind(mesh.geometry);
        mesh.geometry.dispose = () => { w.disposed.push(`${bytes.model}:${id}`); dispose(); };
        group.add(mesh);
      });
      return { scene: group };
    }
  }
  async function loadAtlasAsset(profile, { signal, onProgress }) {
    w.loads.push(profile.model);
    await new Promise((resolve) => setImmediate(resolve));
    if (signal?.aborted) throw new Error('aborted');
    onProgress?.(100);
    return { bytes: { model: profile.model, parts: profile.parts }, cached: true, stored: true };
  }
  const win = Object.assign(new Events(), {
    devicePixelRatio: 2,
    matchMedia: () => ({ matches: true }),
  });
  const doc = Object.assign(new Events(), { hidden: false, documentElement: {} });
  const initial = w.layout(false);
  w.dom = {
    host: element(initial.host),
    left: element(initial.left),
    right: element(w.layout(true).right),
  };
  w.dom.host.parentElement = element(initial.host);
  w.window = win;
  w.document = doc;
  const globals = {
    T: { ...THREE, WebGLRenderer: Renderer },
    OrbitControls: Controls,
    GLTFLoader: Loader,
    loadAtlasAsset,
    atlasFitDistance,
    atlasMotionValue,
    atlasIsTap,
    window: win,
    document: doc,
    requestAnimationFrame: (fn) => { const id = w.nextFrame++; w.frames.set(id, fn); return id; },
    cancelAnimationFrame: (id) => { w.frames.delete(id); },
    ResizeObserver: class {
      constructor(fn) { this.fn = fn; w.resizeObservers.push(this); }
      observe() { if (!this.disconnected) this.fn([]); }
      disconnect() { this.disconnected = true; }
    },
    IntersectionObserver: class { observe() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    getComputedStyle: () => ({ getPropertyValue: () => '#7a9e7e', backgroundColor: '#ffffff' }),
    setTimeout: () => 0,
    clearTimeout: () => {},
  };
  w.flushFrames = () => {
    for (let i = 0; i < 20 && w.frames.size; i++) {
      const due = [...w.frames.entries()];
      w.frames.clear();
      for (const [, fn] of due) fn(performance.now());
    }
  };
  w.settle = async () => {
    for (let i = 0; i < 12; i++) await new Promise((resolve) => setImmediate(resolve));
    w.flushFrames();
  };
  w.globals = globals;
  return w;
}

// Load the component body with its imports and JSX return removed.
function loadScene(w) {
  const slots = [];
  let cursor = 0;
  let queued = [];
  const hooks = {
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useEffect(fn, deps) {
      const i = cursor++;
      const prev = slots[i];
      const changed = !prev || !deps || deps.length !== prev.deps.length
        || deps.some((dep, k) => !Object.is(dep, prev.deps[k]));
      if (!prev) slots[i] = { deps, destroy: undefined };
      slots[i].fn = fn;
      if (changed) queued.push({ slot: slots[i], fn, deps });
    },
    useCallback: (fn) => fn,
    useMemo: (fn) => fn(),
    useLayoutEffect() { throw new Error('the harness does not model layout effects'); },
  };
  let body = source.replace(/^import .*$/gm, '').replace('export default function AtlasScene(', 'function AtlasScene(');
  const jsx = body.lastIndexOf('\n  return (');
  assert.ok(jsx > 0, 'AtlasScene still ends in a JSX return');
  body = `${body.slice(0, jsx)}\n  return null;\n}\nreturn AtlasScene;`;
  const names = [...Object.keys(hooks), ...Object.keys(w.globals)];
  const AtlasScene = new Function(...names, body)(...Object.values(hooks), ...Object.values(w.globals));

  let props = null;
  return {
    render(next) {
      props = { ...props, ...next };
      // The CSS layout for this commit is in place before any effect runs.
      const rects = w.layout(Boolean(props.comparison));
      w.dom.host.rect = rects.host;
      w.dom.left.rect = rects.left;
      w.dom.right.rect = rects.right;
      cursor = 0;
      queued = [];
      AtlasScene(props);
      // React attaches refs before passive effects run. The first three refs
      // are the host and the two panes; the second pane only exists while
      // comparing.
      slots[0].current = w.dom.host;
      slots[1].current = w.dom.left;
      slots[2].current = props.comparison ? w.dom.right : null;
      for (const effect of queued) {
        const destroy = effect.slot.destroy;
        effect.slot.destroy = undefined;
        if (destroy) destroy();
      }
      for (const effect of queued) {
        effect.slot.destroy = effect.fn();
        effect.slot.deps = effect.deps;
      }
    },
    // What React.StrictMode does to a fresh mount in development: every
    // effect is destroyed, then every effect is created again.
    remount() {
      const effects = slots.filter((slot) => slot && 'deps' in slot);
      for (const slot of effects) {
        const destroy = slot.destroy;
        slot.destroy = undefined;
        if (typeof destroy === 'function') destroy();
      }
      for (const slot of effects) slot.destroy = slot.fn();
    },
    unmount() {
      for (const slot of slots) if (slot && typeof slot.destroy === 'function') slot.destroy();
    },
  };
}

function baseProps(w, primary, comparison) {
  return {
    specimen: primary,
    comparison,
    quality: 'quick',
    selected: primary.parts[0].id,
    visibleIds: primary.parts.map((p) => p.id),
    exploded: 0,
    coloured: true,
    ghost: false,
    cut: 0,
    command: { kind: 'reset', seq: 0 },
    onSelect: () => {},
    onStatus: (status) => w.statuses.push(status),
    onExport: () => {},
  };
}

const lastStatus = (w) => w.statuses.at(-1);
const lastFrame = (renderer) => {
  const at = renderer.drawn.lastIndexOf('clear');
  return renderer.drawn.slice(at + 1);
};
const ids = (item) => item.parts.map((p) => p.id);
const live = (w) => w.renderers.filter((renderer) => !renderer.disposed);

test('choosing another comparison keeps the renderer and the primary model', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse'), cat = specimen('cat');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  await w.settle();
  assert.equal(w.renderers.length, 1);
  assert.deepEqual(w.loads, ['dog-quick.glb', 'horse-quick.glb']);
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready', 'ready']);

  scene.render({ comparison: cat });
  await w.settle();
  assert.equal(w.renderers.length, 1, 'a comparison change built a second WebGL renderer');
  assert.ok(!w.renderers[0].contextLost, 'a comparison change forced the WebGL context to be lost');
  assert.ok(!w.renderers[0].disposed);
  assert.ok(!w.renderers[0].resizedOnScreen, 'the canvas on screen was given a new size');
  assert.deepEqual(w.loads, ['dog-quick.glb', 'horse-quick.glb', 'cat-quick.glb'], 'the primary model was fetched again');
  assert.deepEqual(w.parsed, ['dog-quick.glb', 'horse-quick.glb', 'cat-quick.glb'], 'the primary model was parsed again');
  assert.deepEqual(w.disposed.sort(), horse.parts.map((p) => `horse-quick.glb:${p.id}`).sort(), 'only the old comparison is disposed');
  assert.deepEqual(lastStatus(w).kind, 'ready');
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready', 'ready']);
  // Both panes still draw, the new comparison in the second one.
  assert.deepEqual(lastFrame(w.renderers[0]), [ids(dog), ids(cat)]);
  // The old comparison's controls are gone, and the pane is not listening twice.
  const horseControls = w.controls[1];
  assert.ok(horseControls.disposed);
  const perPane = w.dom.left.listenerCount();
  assert.equal(w.dom.right.listenerCount(), perPane, 'the second pane carries exactly one set of pointer listeners');
  scene.unmount();
});

test('the new comparison starts from the camera the student left the primary at', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse'), cat = specimen('cat');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  await w.settle();
  scene.render({ command: { kind: 'left', seq: 1 } });
  w.flushFrames();
  const primary = w.controls[0].object;
  const turned = primary.position.clone();
  scene.render({ comparison: cat });
  await w.settle();
  const comparisonCamera = w.controls.at(-1).object;
  assert.ok(primary.position.distanceTo(turned) < 1e-9, 'the primary camera moved when only the comparison changed');
  assert.ok(comparisonCamera.position.distanceTo(primary.position) < 1e-9, 'the cameras no longer move together');
  assert.ok(w.controls.at(-1).target.distanceTo(w.controls[0].target) < 1e-9);
  scene.unmount();
});

test('on a phone, entering and leaving compare never resizes a canvas that is already on screen', async () => {
  const w = world('phone');
  const dog = specimen('dog'), horse = specimen('horse'), cat = specimen('cat');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, null));
  await w.settle();
  assert.deepEqual(w.renderers[0].size, [390, 320]);
  assert.deepEqual(lastFrame(w.renderers[0]), [ids(dog)], 'the single pane drew before compare was pressed');

  // Compare: the panes stack and the stage grows to 600 px.
  scene.render({ comparison: horse, command: { kind: 'reset', seq: 1 } });
  await w.settle();
  assert.deepEqual(w.renderers.filter((r) => r.resizedOnScreen), [],
    'a canvas already on screen was given a new size; WebKit never shows it again');
  assert.equal(live(w).length, 1, 'exactly one WebGL context is alive');
  assert.ok(w.renderers[0].disposed && w.renderers[0].contextLost, 'the single-pane context was released');
  assert.deepEqual(live(w)[0].size, [390, 600]);
  assert.deepEqual(lastFrame(live(w)[0]), [ids(dog), ids(horse)], 'both stacked panes draw');
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready', 'ready']);

  // Another comparison keeps the stacked layout, so it keeps the canvas too.
  const comparing = live(w)[0];
  scene.render({ comparison: cat });
  await w.settle();
  assert.deepEqual(live(w), [comparing], 'choosing another comparison built a new renderer');
  assert.ok(!comparing.resizedOnScreen);
  assert.deepEqual(lastFrame(comparing), [ids(dog), ids(cat)]);
  assert.equal(w.parsed.filter((model) => model === 'dog-quick.glb').length, 2,
    'the primary is parsed once per layout, not again for a new comparison');

  // Back to one pane: the stage shrinks, and gets its own canvas again.
  scene.render({ comparison: null, command: { kind: 'reset', seq: 2 } });
  await w.settle();
  assert.deepEqual(w.renderers.filter((r) => r.resizedOnScreen), []);
  assert.equal(live(w).length, 1);
  assert.deepEqual(live(w)[0].size, [390, 320]);
  assert.deepEqual(lastFrame(live(w)[0]), [ids(dog)]);
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready']);
  assert.equal(w.dom.right.listenerCount(), 0, 'the removed pane kept its pointer listeners');
  scene.unmount();
  assert.equal(live(w).length, 0);
});

test('leaving compare gives the primary pane the full stage and releases the comparison', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  await w.settle();
  scene.render({ comparison: null });
  await w.settle();
  assert.equal(live(w).length, 1);
  assert.ok(w.renderers[0].disposed && w.renderers[0].contextLost);
  assert.deepEqual(w.disposed.sort(), [...ids(dog).map((id) => `dog-quick.glb:${id}`),
    ...ids(horse).map((id) => `horse-quick.glb:${id}`)].sort());
  assert.equal(w.dom.right.listenerCount(), 0, 'the removed pane kept its pointer listeners');
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready']);
  assert.deepEqual(lastFrame(live(w)[0]), [ids(dog)]);
  assert.equal(w.controls.at(-1).object.aspect, 2, 'the primary camera did not take the full-width aspect');
  scene.unmount();
});

test('a new specimen or quality still rebuilds everything, and unmount releases it all', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  await w.settle();
  scene.render({ quality: 'detail' });
  await w.settle();
  assert.equal(w.renderers.length, 2);
  assert.ok(w.renderers[0].disposed && w.renderers[0].contextLost);
  assert.deepEqual(w.loads.slice(2), ['dog-detail.glb', 'horse-detail.glb']);
  assert.equal(w.renderers[1].pixelRatio, 2, 'detail keeps the higher pixel ratio');
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready', 'ready']);
  assert.equal(new Set(w.disposed).size, w.disposed.length, 'a mesh was disposed twice');

  scene.unmount();
  assert.ok(w.renderers[1].disposed && w.renderers[1].contextLost);
  assert.equal(w.window.listenerCount(), 0, 'window listeners left behind');
  assert.equal(w.document.listenerCount(), 0, 'document listeners left behind');
  assert.equal(w.dom.left.listenerCount() + w.dom.right.listenerCount(), 0);
  assert.equal(w.frames.size, 0, 'a frame is still scheduled after unmount');
  assert.equal(new Set(w.disposed).size, w.disposed.length, 'a mesh was disposed twice');
  assert.equal(w.disposed.length, 4 * 3, 'every loaded mesh is disposed exactly once');
});

test('a comparison that arrives while the renderer is gone does nothing', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse');
  w.globals.T = { ...w.globals.T, WebGLRenderer: class { constructor() { throw new Error('no WebGL'); } } };
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, null));
  await w.settle();
  assert.equal(lastStatus(w).kind, 'error');
  scene.render({ comparison: horse });
  await w.settle();
  assert.deepEqual(w.loads, []);
  assert.equal(lastStatus(w).kind, 'error');
  scene.unmount();
});

test('a comparison cleared while it is still downloading leaves no error and no stray view', async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse'), cat = specimen('cat');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  scene.render({ comparison: cat });
  scene.render({ comparison: null });
  await w.settle();
  assert.equal(live(w).length, 1);
  assert.ok(!w.parsed.includes('horse-quick.glb') && !w.parsed.includes('cat-quick.glb'),
    'an abandoned comparison was still parsed');
  assert.ok(w.statuses.every((status) => status.kind !== 'error'), 'an abandoned download surfaced as an error');
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready']);
  assert.deepEqual(lastFrame(live(w)[0]), [ids(dog)]);
  scene.unmount();
});

test("StrictMode's destroy-and-create leaves one live renderer carrying both views", async () => {
  const w = world();
  const dog = specimen('dog'), horse = specimen('horse');
  const scene = loadScene(w);
  scene.render(baseProps(w, dog, horse));
  scene.remount();
  await w.settle();
  assert.equal(w.renderers.length, 2);
  assert.ok(w.renderers[0].disposed && !w.renderers[1].disposed);
  assert.deepEqual(lastStatus(w).views.map((v) => v.kind), ['ready', 'ready']);
  assert.deepEqual(lastFrame(w.renderers[1]), [ids(dog), ids(horse)]);
  scene.unmount();
  assert.equal(w.window.listenerCount(), 0);
});

test('the page keeps the ready primary on screen while a new comparison loads', () => {
  const view = readFileSync(new URL('../../src/views/AtlasView.jsx', import.meta.url), 'utf8');
  const start = view.indexOf('aria-label="ตัวอย่างที่เปรียบเทียบ"');
  assert.ok(start > 0, 'the comparison picker is still there');
  const picker = view.slice(start, view.indexOf('</select>', start));
  assert.ok(picker.includes('compareId: e.target.value'));
  assert.ok(!picker.includes('setStatus'), 'choosing a comparison resets the whole stage to loading');
});
