// ============================================================
// dicom-file-release.test.mjs — a closed DICOM leaves nothing behind
// ============================================================
// DicomViewport registers its File with the loader's wadouri fileManager, a
// module-global list that only grows: cleanup destroyed the tool group and
// the rendering engine but never released the entry, so every DICOM ever
// opened in the tab stayed referenced (audit MD-03, PF-07). The cleanup also
// let a load that finished after unmount create a tool group for an engine
// already destroyed.
//
// Releasing the File was not enough. The decoded image stays in Cornerstone's
// image cache, and the wadouri loader stamps every dicomfile image with a
// sharedCacheKey: LRU eviction skips those entries, so they are never evicted,
// and removeImageLoadObject(id) without { force: true } throws "Cannot
// decache an image with a shared cache key" (MD-03 verifier). An iPad opening
// case after case kept every radiograph in memory until the tab reloaded.
//
// The load effect is lifted out of the component and run against the real
// fileManager, the real Cornerstone image cache and the real loader dataset
// cache, with the engine, tools and pixel decoding mocked, so the registry,
// the cache entries, the cancel guard and the released index are the shipped
// ones.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire, registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
// The registry module itself (no package export for it; same path the audit probe used).
import fileManager from '../../node_modules/@cornerstonejs/dicom-image-loader/dist/esm/imageLoader/wadouri/fileManager.js';

const ROOT = resolve(process.cwd());
const nodeModule = (p) => pathToFileURL(join(ROOT, 'node_modules', p)).href;
const SRC = readFileSync(join(ROOT, 'src/components/lab/DicomViewport.jsx'), 'utf8').replace(/\r\n/g, '\n');

// Cornerstone's dist/esm uses extensionless relative imports, and the loader's
// dataset cache imports the whole @cornerstonejs/core package (vtk.js, WebGL)
// only for its event bus. Resolve the extensionless paths and hand the loader a
// core that exports just that bus, from core's own modules, so the dataset
// cache and the image cache below are the real ones.
const CORE_EVENTS = 'vetmock-test:cornerstone-core-events';
const DICOM_PARSER = 'vetmock-test:dicom-parser';
registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '');
    if (parent.includes('/@cornerstonejs/dicom-image-loader/')) {
      if (specifier === '@cornerstonejs/core') return { url: CORE_EVENTS, shortCircuit: true };
      if (specifier === 'dicom-parser') return { url: DICOM_PARSER, shortCircuit: true };
    }
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!parent.includes('/@cornerstonejs/') || !['ERR_MODULE_NOT_FOUND', 'ERR_UNSUPPORTED_DIR_IMPORT'].includes(error.code)) throw error;
      try { return nextResolve(`${specifier}.js`, context); } catch { return nextResolve(`${specifier}/index.js`, context); }
    }
  },
  load(url, context, nextLoad) {
    if (url === CORE_EVENTS) {
      return {
        format: 'module',
        shortCircuit: true,
        source: [
          `export { default as eventTarget } from ${JSON.stringify(nodeModule('@cornerstonejs/core/dist/esm/eventTarget.js'))};`,
          `export { default as triggerEvent } from ${JSON.stringify(nodeModule('@cornerstonejs/core/dist/esm/utilities/triggerEvent.js'))};`,
          `export * as Enums from ${JSON.stringify(nodeModule('@cornerstonejs/core/dist/esm/enums/index.js'))};`,
          'export const utilities = {};',
        ].join('\n'),
      };
    }
    if (url === DICOM_PARSER) {
      return {
        format: 'module',
        shortCircuit: true,
        source: [
          "import { createRequire } from 'node:module';",
          `const parser = createRequire(${JSON.stringify(nodeModule('dicom-parser/package.json'))})('dicom-parser');`,
          'export const parseDicom = parser.parseDicom;',
          'export default parser;',
        ].join('\n'),
      };
    }
    return nextLoad(url, context);
  },
});

const { default: cache } = await import(nodeModule('@cornerstonejs/core/dist/esm/cache/cache.js'));
const { default: dataSetCacheManager } = await import(nodeModule('@cornerstonejs/dicom-image-loader/dist/esm/imageLoader/wadouri/dataSetCacheManager.js'));
const dicomParser = createRequire(join(ROOT, 'package.json'))('dicom-parser');

function loadEffect() {
  const anchor = 'useEffect(() => {\n    if (!file) return;';
  const start = SRC.indexOf(anchor);
  assert.notEqual(start, -1, 'the load effect must still start by checking for a file');
  const end = SRC.indexOf('\n  }, [file]);', start);
  assert.notEqual(end, -1, 'the load effect must still depend on the file');
  return SRC.slice(start + 'useEffect('.length, end) + '\n  }';
}

const settle = async () => { for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r)); };
const indexOf = (imageId) => Number(imageId.split(':')[1]);
const plain = (value) => JSON.parse(JSON.stringify(value));

/** A minimal Part 10 file (explicit VR little endian) that dicom-parser reads. */
function dicomBytes(species) {
  const element = (group, el, vr, value) => {
    const header = Buffer.alloc(8);
    header.writeUInt16LE(group, 0); header.writeUInt16LE(el, 2); header.write(vr, 4, 'ascii'); header.writeUInt16LE(value.length, 6);
    return Buffer.concat([header, value]);
  };
  const even = (bytes, pad) => (bytes.length % 2 ? Buffer.concat([bytes, Buffer.from([pad])]) : bytes);
  const meta = element(0x0002, 0x0010, 'UI', even(Buffer.from('1.2.840.10008.1.2.1'), 0));
  const metaLength = Buffer.alloc(4); metaLength.writeUInt32LE(meta.length);
  return Buffer.concat([
    Buffer.alloc(128), Buffer.from('DICM'),
    element(0x0002, 0x0000, 'UL', metaLength), meta,
    element(0x0010, 0x2201, 'LO', even(Buffer.from(species), 0x20)),
  ]);
}
const dcm = (name, species = 'CANINE') => new File([dicomBytes(species)], name, { type: 'application/dicom' });

// A decoded radiograph's footprint in the image cache (a 2k x 2k 16-bit DR plate).
const DECODED_BYTES = 8 * 1024 * 1024;

/**
 * What StackViewport.setStack does with a dicomfile imageId: loadAndCacheImage
 * (core StackViewport.js:1456) runs the wadouri loader and keeps the result in
 * the core image cache. The loader is reproduced minus pixel decoding: it reads
 * the File as the load starts (loadFileRequest), parses it into the loader's
 * dataset cache, makes decache unload that dataset (loadImage.js:9-13) and
 * stamps the file index on the image as its sharedCacheKey (loadImage.js:31,
 * :105), which the cache copies onto the entry (core cache.js:393).
 */
function loadAndCacheDicomFile(imageId, decode) {
  const uri = imageId.slice(imageId.indexOf(':') + 1);
  const bytes = fileManager.get(Number(uri)).arrayBuffer();
  const imageLoadObject = { cancelFn: undefined, decache: undefined, promise: undefined };
  imageLoadObject.promise = dataSetCacheManager.load(uri, () => bytes, imageId).then(async (dataSet) => {
    imageLoadObject.decache = () => dataSetCacheManager.unload(uri);
    await decode; // the pixel decode, under the test's control
    return { imageId, sizeInBytes: DECODED_BYTES, sharedCacheKey: uri, data: dataSet };
  });
  cache.putImageLoadObject(imageId, imageLoadObject).catch(() => { /* reported through setStack */ });
  return imageLoadObject.promise;
}

const idleState = () => ({ cacheBytes: cache.getCacheSize(), dataSets: dataSetCacheManager.getInfo().numberOfDataSetsCached });

/** Mount the shipped effect for `file`; the image decode finishes when `decode` settles. */
function mount(file, { decode = Promise.resolve() } = {}) {
  const log = [];
  const releases = [];
  const viewport = {
    async setStack([imageId]) { viewport.csImage = await loadAndCacheDicomFile(imageId, decode); },
    render() {}, setProperties() {}, resetProperties() {}, resetCamera() {}, csImage: null,
  };
  const toolGroup = { addTool() {}, addViewport() {}, setToolActive() {}, setToolPassive() {} };
  // The real image cache, with its removals recorded so the options can be checked.
  const watchedCache = new Proxy(cache, {
    get(target, key) {
      if (key === 'removeImageLoadObject') {
        return (id, options) => { releases.push([id, plain(options ?? null)]); return target.removeImageLoadObject(id, options); };
      }
      const value = target[key];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
  const context = {
    file, engineSeq: 0,
    viewportIdRef: { current: null }, toolGroupIdRef: { current: null }, engineRef: { current: null }, elRef: { current: {} },
    setStatus: (v) => log.push(['status', v]),
    setErrorMsg: (v) => log.push(['error', v]),
    setMeta() {}, setSpecies: (v) => log.push(['species', v]), setActiveTool() {},
    ensureCornerstoneInit: async () => {},
    getDicomImageLoader: () => ({ wadouri: { fileManager, dataSetCacheManager } }),
    RenderingEngine: class { constructor(id) { this.id = id; } enableElement() {} getViewport() { return viewport; } destroy() { log.push(['engine-destroy', this.id]); } },
    Enums: { ViewportType: { STACK: 'stack' } },
    cache: watchedCache,
    ToolGroupManager: {
      createToolGroup: (id) => { log.push(['toolgroup', id]); return toolGroup; },
      destroyToolGroup: (id) => log.push(['toolgroup-destroy', id]),
    },
    TOOLS: {},
    WindowLevelTool: { toolName: 'wl' }, PanTool: { toolName: 'pan' }, ZoomTool: { toolName: 'zoom' },
    ToolEnums: { MouseBindings: { Primary: 1, Auxiliary: 2, Secondary: 4 } },
    applySmartContrast: () => true,
    requestAnimationFrame: (fn) => fn(),
    dicomParser,
    Uint8Array,
    console: { error: (...args) => log.push(['console.error', String(args[1]?.message || args[1])]) },
  };
  const effect = vm.runInNewContext('(' + loadEffect() + ')', context);
  const cleanup = effect();
  assert.equal(typeof cleanup, 'function', 'the effect must return its cleanup');
  return { cleanup, log, releases, viewport };
}

const cachedIdOf = (m) => m.viewport.csImage?.imageId;

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

test('closing a viewport drops its decoded image and parsed file; the compare pane keeps its own', async () => {
  const idle = idleState();
  const other = mount(dcm('compare-left.dcm'));
  const mine = mount(dcm('compare-right.dcm'));
  await settle();
  const otherId = cachedIdOf(other);
  const myId = cachedIdOf(mine);
  assert.ok(otherId && myId && otherId !== myId, 'both panes must have loaded their own image');
  assert.ok(cache.getImageLoadObject(myId) && cache.getImageLoadObject(otherId));
  assert.equal(cache.getCacheSize(), idle.cacheBytes + 2 * DECODED_BYTES);
  assert.equal(dataSetCacheManager.getInfo().numberOfDataSetsCached, idle.dataSets + 2);

  mine.cleanup();
  assert.ok(!cache.getImageLoadObject(myId), 'the closed viewport\'s radiograph is still in the image cache');
  assert.equal(dataSetCacheManager.isLoaded(String(indexOf(myId))), false, 'the closed viewport\'s parsed file is still cached');
  assert.ok(cache.getImageLoadObject(otherId), 'closing one pane evicted the other pane\'s image');
  assert.ok(dataSetCacheManager.isLoaded(String(indexOf(otherId))), 'closing one pane unloaded the other pane\'s dataset');
  assert.equal(cache.getCacheSize(), idle.cacheBytes + DECODED_BYTES);

  other.cleanup();
  assert.deepEqual(idleState(), idle);
});

test('the release is forced: the loader\'s shared cache key makes an unforced one a silent no-op', async () => {
  const m = mount(dcm('forced.dcm'));
  await settle();
  const id = cachedIdOf(m);
  assert.ok(id, 'the image must have loaded');
  // Without force the real cache refuses this entry, and the cleanup's try/catch would swallow it.
  assert.throws(() => cache.removeImageLoadObject(id), /shared cache key/);
  assert.ok(cache.getImageLoadObject(id));

  m.cleanup();
  assert.deepEqual(m.releases, [[id, { force: true }]], 'the cleanup must release exactly its own image, with force');
  assert.ok(!cache.getImageLoadObject(id));
});

test('thirty open/close cycles return the registry, the image cache and the dataset cache to idle', async () => {
  const first = indexOf(fileManager.add(dcm('probe.dcm')));
  fileManager.remove(first);
  const idle = idleState();
  for (let i = 0; i < 30; i++) {
    const { cleanup } = mount(dcm(`cycle-${i}.dcm`));
    await settle();
    cleanup();
  }
  for (let i = 1; i <= 30; i++) assert.equal(fileManager.get(first + i), undefined, `cycle ${i} left its File registered`);
  assert.equal(cache.getCacheSize(), idle.cacheBytes, 'decoded radiographs piled up in the image cache');
  assert.equal(dataSetCacheManager.getInfo().numberOfDataSetsCached, idle.dataSets, 'parsed files piled up in the loader\'s dataset cache');
});

test('leaving while the image is still decoding: no late tool group, no error state, entry released', async () => {
  const warn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    let finish;
    const decode = new Promise((r) => { finish = r; });
    const marker = indexOf(fileManager.add(dcm('marker.dcm')));
    fileManager.remove(marker);
    const file = dcm('slow-decode.dcm');
    const { cleanup, log, releases } = mount(file, { decode });
    await settle();
    assert.equal(fileManager.get(marker + 1), file, 'the file is registered before the decode starts');
    const imageId = `dicomfile:${marker + 1}`;
    assert.ok(cache.getImageLoadObject(imageId), 'the pending image must already be in the cache');
    const before = log.length;
    cleanup();
    assert.equal(fileManager.get(marker + 1), undefined, 'leaving mid-decode must still release the registry entry');
    assert.deepEqual(releases, [[imageId, { force: true }]]);
    assert.ok(!cache.getImageLoadObject(imageId), 'leaving mid-decode left the pending image in the cache');
    finish();
    await settle();
    assert.ok(!cache.getImageLoadObject(imageId), 'the late decode must not put the image back');
    const after = log.slice(before);
    assert.ok(!after.some(([k]) => k === 'toolgroup'), 'a tool group was created for an engine the cleanup already destroyed');
    assert.ok(!after.some(([k, v]) => k === 'status' && v === 'error'), 'an abandoned load must not surface as an error');
    assert.ok(!after.some(([k]) => k === 'console.error'), 'an abandoned load must not be logged as a load error');
  } finally {
    console.warn = warn;
  }
  // Cornerstone's own notice for an image purged before it finished loading is expected, nothing else.
  assert.ok(warnings.every((w) => /purged from the cache before it completed loading/.test(w)), warnings.join('\n'));
});

test('a decode that fails after leaving is neither reported nor logged, and a cleanup before registration is harmless', async () => {
  let fail;
  const decode = new Promise((_, reject) => { fail = reject; });
  const { cleanup, log } = mount(dcm('fails-late.dcm'), { decode });
  await settle();
  cleanup();
  const debug = console.debug;
  console.debug = () => {}; // Cornerstone's own "Error caching image" trace for the failed load
  try {
    fail(new Error('decoder gone'));
    await settle();
  } finally {
    console.debug = debug;
  }
  assert.ok(!log.some(([k, v]) => k === 'status' && v === 'error'));
  assert.ok(!log.some(([k]) => k === 'console.error'));

  // Cleanup before Cornerstone even initialised: nothing registered, nothing to release, no throw.
  const early = mount(dcm('early-exit.dcm'), { decode: Promise.resolve() });
  early.cleanup();
  await settle();
  assert.ok(!early.log.some(([k]) => k === 'toolgroup'));
  assert.deepEqual(early.releases, []);
});
