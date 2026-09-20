// ============================================================
// dicom-file-release.test.mjs — a closed DICOM leaves the loader's registry
// ============================================================
// DicomViewport registers its File with the loader's wadouri fileManager, a
// module-global list that only grows: cleanup destroyed the tool group and
// the rendering engine but never released the entry, so every DICOM ever
// opened in the tab stayed referenced (audit MD-03, PF-07). The cleanup also
// let a load that finished after unmount create a tool group for an engine
// already destroyed.
//
// The load effect is lifted out of the component and run against the real
// fileManager module with Cornerstone's engine, tools and parser mocked, so
// the registry, the cancel guard and the released index are the shipped ones.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
// The registry module itself (no package export for it; same path the audit probe used).
import fileManager from '../../node_modules/@cornerstonejs/dicom-image-loader/dist/esm/imageLoader/wadouri/fileManager.js';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/components/lab/DicomViewport.jsx'), 'utf8').replace(/\r\n/g, '\n');

function loadEffect() {
  const anchor = 'useEffect(() => {\n    if (!file) return;';
  const start = SRC.indexOf(anchor);
  assert.notEqual(start, -1, 'the load effect must still start by checking for a file');
  const end = SRC.indexOf('\n  }, [file]);', start);
  assert.notEqual(end, -1, 'the load effect must still depend on the file');
  return SRC.slice(start + 'useEffect('.length, end) + '\n  }';
}

const settle = async () => { for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r)); };
const dcm = (name) => new File([new Uint8Array(1024)], name, { type: 'application/dicom' });
const indexOf = (imageId) => Number(imageId.split(':')[1]);

/** Mount the shipped effect for `file`; setStack resolves when `decode` is released. */
function mount(file, { decode = Promise.resolve() } = {}) {
  const log = [];
  const viewport = {
    setStack: () => decode, render() {}, setProperties() {}, resetProperties() {}, resetCamera() {}, csImage: null,
  };
  const toolGroup = { addTool() {}, addViewport() {}, setToolActive() {}, setToolPassive() {} };
  const context = {
    file, engineSeq: 0,
    viewportIdRef: { current: null }, toolGroupIdRef: { current: null }, engineRef: { current: null }, elRef: { current: {} },
    setStatus: (v) => log.push(['status', v]),
    setErrorMsg: (v) => log.push(['error', v]),
    setMeta() {}, setSpecies() {}, setActiveTool() {},
    ensureCornerstoneInit: async () => {},
    getDicomImageLoader: () => ({ wadouri: { fileManager } }),
    RenderingEngine: class { constructor(id) { this.id = id; } enableElement() {} getViewport() { return viewport; } destroy() { log.push(['engine-destroy', this.id]); } },
    Enums: { ViewportType: { STACK: 'stack' } },
    ToolGroupManager: {
      createToolGroup: (id) => { log.push(['toolgroup', id]); return toolGroup; },
      destroyToolGroup: (id) => log.push(['toolgroup-destroy', id]),
    },
    TOOLS: {},
    WindowLevelTool: { toolName: 'wl' }, PanTool: { toolName: 'pan' }, ZoomTool: { toolName: 'zoom' },
    ToolEnums: { MouseBindings: { Primary: 1, Auxiliary: 2, Secondary: 4 } },
    applySmartContrast: () => true,
    requestAnimationFrame: (fn) => fn(),
    dicomParser: { parseDicom: () => ({ string: () => '' }) },
    console: { error: (...args) => log.push(['console.error', String(args[1]?.message || args[1])]) },
  };
  const effect = vm.runInNewContext('(' + loadEffect() + ')', context);
  const cleanup = effect();
  assert.equal(typeof cleanup, 'function', 'the effect must return its cleanup');
  return { cleanup, log };
}

test('closing a viewport releases its own registry entry and keeps the other viewport\'s', async () => {
  const sibling = dcm('sibling-view.dcm');
  const siblingIndex = indexOf(fileManager.add(sibling)); // the other pane in compare mode
  const mine = dcm('this-view.dcm');
  const { cleanup, log } = mount(mine);
  await settle();
  assert.ok(log.some(([k, v]) => k === 'status' && v === 'ready'), 'the mocked load must reach ready');
  const myIndex = siblingIndex + 1;
  assert.equal(fileManager.get(myIndex), mine, 'the mount must have registered its file next');

  cleanup();
  assert.equal(fileManager.get(myIndex), undefined, 'the closed viewport\'s File is still held by the loader registry');
  assert.equal(fileManager.get(siblingIndex), sibling, 'cleanup must not touch another viewport\'s entry');
  fileManager.remove(siblingIndex);
});

test('thirty open/close cycles leave no stale registrations behind', async () => {
  const first = indexOf(fileManager.add(dcm('probe.dcm')));
  fileManager.remove(first);
  for (let i = 0; i < 30; i++) {
    const { cleanup } = mount(dcm(`cycle-${i}.dcm`));
    await settle();
    cleanup();
  }
  for (let i = 1; i <= 30; i++) assert.equal(fileManager.get(first + i), undefined, `cycle ${i} left its File registered`);
});

test('leaving while the image is still decoding: no late tool group, no error state, entry released', async () => {
  let finish;
  const decode = new Promise((r) => { finish = r; });
  const marker = indexOf(fileManager.add(dcm('marker.dcm')));
  fileManager.remove(marker);
  const file = dcm('slow-decode.dcm');
  const { cleanup, log } = mount(file, { decode });
  await settle();
  assert.equal(fileManager.get(marker + 1), file, 'the file is registered before the decode starts');
  const before = log.length;
  cleanup();
  assert.equal(fileManager.get(marker + 1), undefined, 'leaving mid-decode must still release the registry entry');
  finish();
  await settle();
  const after = log.slice(before);
  assert.ok(!after.some(([k]) => k === 'toolgroup'), 'a tool group was created for an engine the cleanup already destroyed');
  assert.ok(!after.some(([k, v]) => k === 'status' && v === 'error'), 'an abandoned load must not surface as an error');
  assert.ok(!after.some(([k]) => k === 'console.error'), 'an abandoned load must not be logged as a load error');
});

test('a decode that fails after leaving is neither reported nor logged, and a cleanup before registration is harmless', async () => {
  let fail;
  const decode = new Promise((_, reject) => { fail = reject; });
  const { cleanup, log } = mount(dcm('fails-late.dcm'), { decode });
  await settle();
  cleanup();
  fail(new Error('decoder gone'));
  await settle();
  assert.ok(!log.some(([k, v]) => k === 'status' && v === 'error'));
  assert.ok(!log.some(([k]) => k === 'console.error'));

  // Cleanup before Cornerstone even initialised: nothing registered, nothing to release, no throw.
  const early = mount(dcm('early-exit.dcm'), { decode: Promise.resolve() });
  early.cleanup();
  await settle();
  assert.ok(!early.log.some(([k]) => k === 'toolgroup'));
});
