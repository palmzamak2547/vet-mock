// ============================================================
// media-box.test.mjs — a figure keeps its place before its file arrives
// ============================================================
// An <img> with no width and height is zero high until its bytes come, then
// pushes everything under it down: the stem and the options of a question
// moved under the student's thumb, and a long note jumped once per figure.
// No picture in the app carried its size.
//
// Now the question card's figure (ZoomableImage) and a note's deck figures
// (SlideFigures) are drawn with the width and height the media registry
// measured, and height:auto, so the browser lays the final box out at once.
// The real components are compiled from source and mounted; what is read
// back is the <img> each one draws.
// ============================================================

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { QUESTION_MEDIA_SIZES } from '../../src/data/media-sizes.generated.js';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { slideImageSize } from '../../src/data/slide-image-sizes.generated.js';
import { loadMediaSizes, mediaSize } from '../../src/lib/media-size.js';
import { bundleModule, findAll, installDom, mountElement } from './helpers/mini-dom.mjs';

const FIGURE = '/figures/questions/q104006.webp';

// ── The lookup (src/lib/media-size.js) ───────────────────────────────
test('a figure\'s size is unknown until the sizes have arrived, then read without waiting', async () => {
  assert.equal(mediaSize(FIGURE), null, 'nothing is known before the banks load');
  const loading = loadMediaSizes();
  assert.equal(loadMediaSizes(), loading, 'one load, however many scopes ask');
  await loading;
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  assert.deepEqual(mediaSize(FIGURE), { width, height });
  assert.deepEqual(mediaSize(`${FIGURE}?v=2#top`), { width, height }, 'a query or a fragment names the same file');
  assert.equal(mediaSize('/figures/questions/no-such-figure.webp'), null);
  assert.equal(mediaSize('https://i.imgur.com/abc123.png'), null, 'a figure a student linked has no size here');
  for (const nothing of [null, undefined, '', 42, {}]) assert.equal(mediaSize(nothing), null);
});

test('an inline SVG figure gives its size from its viewBox', () => {
  const svg = (body) => `data:image/svg+xml;utf8,${encodeURIComponent(body)}`;
  assert.deepEqual(mediaSize(svg("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 160'><rect/></svg>")), { width: 460, height: 160 });
  assert.deepEqual(mediaSize(svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,300.5,120"></svg>')), { width: 300.5, height: 120 });
  assert.equal(mediaSize(svg("<svg xmlns='http://www.w3.org/2000/svg'><rect/></svg>")), null, 'no viewBox, no size');
  assert.equal(mediaSize(svg("<svg viewBox='0 0 0 0'></svg>")), null);
  assert.equal(mediaSize('data:image/png;base64,iVBORw0KGgo='), null);
  // A Thai label right where the head is cut must not throw.
  const long = svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'>${'<text>ภาพประกอบ</text>'.repeat(40)}</svg>`);
  for (let cut = 380; cut < 420; cut++) assert.doesNotThrow(() => mediaSize(long.slice(0, cut)));
  assert.deepEqual(mediaSize(long), { width: 200, height: 100 });
});

test('every figure the banks show has a size: a file from the registry, an inline one from its viewBox', async () => {
  await loadMediaSizes();
  let files = 0;
  let inline = 0;
  for (const bank of BANK_REGISTRY) {
    for (const q of await bank.load()) {
      for (const field of ['image', 'imagePath', 'explainImage']) {
        const src = q[field];
        if (!src) continue;
        const size = mediaSize(src);
        assert.ok(size && size.width > 0 && size.height > 0, `${q.subject}:${q.id} ${field} has no size`);
        if (String(src).startsWith('data:')) inline++; else files++;
      }
    }
  }
  assert.ok(files >= 150 && inline >= 9, `${files} file figures, ${inline} inline`);
});

// ── The bank loader's wait (src/data/questions.js) ──────────────────
test('the banks wait for the sizes only briefly: a slow or failed sizes file never holds a set up', async () => {
  const { mediaSizesSoon, SIZES_WAIT_MS } = await import('../../src/data/questions.js');
  assert.ok(SIZES_WAIT_MS > 0 && SIZES_WAIT_MS <= 2000, 'a wait a student would not notice');
  const timed = async (options) => { const t = performance.now(); await mediaSizesSoon(options); return performance.now() - t; };

  assert.ok(await timed({ load: () => Promise.resolve(), waitMs: 5000 }) < 1000, 'sizes that have landed end the wait at once');
  assert.ok(await timed({ load: () => Promise.reject(new Error('offline')), waitMs: 5000 }) < 1000, 'a failed load ends it at once too');
  const stalled = await timed({ load: () => new Promise(() => {}), waitMs: 60 });
  assert.ok(stalled >= 50 && stalled < 1500, `a file that never arrives is given 60 ms here, took ${stalled.toFixed(0)}`);
});

test('loading the banks brings the sizes with them', () => {
  // In a process of its own, where nothing else has asked for the sizes.
  const script = [
    "import { loadQBForYear } from './src/data/questions.js';",
    "import { mediaSize, mediaSizesLoaded } from './src/lib/media-size.js';",
    'const before = mediaSizesLoaded();',
    'await loadQBForYear(5);',
    `console.log(JSON.stringify({ before, after: mediaSizesLoaded(), size: mediaSize(${JSON.stringify(FIGURE)}) }));`,
  ].join('\n');
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: fileURLToPath(new URL('../..', import.meta.url)), encoding: 'utf8' });
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  assert.deepEqual(JSON.parse(out), { before: false, after: true, size: { width, height } });
});

// ── The components ───────────────────────────────────────────────────
let dom;
let bundle;
let mod;

before(async () => {
  dom = installDom();
  bundle = await bundleModule({
    prefix: 'media-box-',
    contents: [
      "export { default as ZoomableImage } from './src/components/ZoomableImage.jsx';",
      "export { default as SlideFigures } from './src/components/SlideFigures.jsx';",
      "export { loadMediaSizes, mediaSizesLoaded } from './src/lib/media-size.js';",
    ].join('\n'),
  });
  mod = bundle.mod;
});
after(() => {
  bundle?.dispose();
  dom?.restore();
});

const images = (container) => findAll(container, (n) => n.tagName === 'IMG');

test('a card drawn before the sizes have arrived asks for them itself and is drawn again with its box', async (t) => {
  // Nothing has loaded the sizes in this bundle: a set kept on the device can
  // open before the banks do.
  assert.equal(mod.mediaSizesLoaded(), false);
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.ZoomableImage, { src: FIGURE, alt: 'แผนภาพ' }));
  for (let i = 0; i < 20 && !images(container)[0].hasAttribute('width'); i++) await mod.act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  assert.equal(images(container)[0].getAttribute('width'), String(width));
  assert.equal(images(container)[0].getAttribute('height'), String(height));
  assert.equal(mod.mediaSizesLoaded(), true);
});

test('the question figure is drawn with its width and height, and keeps the height it was capped at', async (t) => {
  await mod.loadMediaSizes();
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.ZoomableImage, { src: FIGURE, alt: 'แผนภาพ', maxHeight: 420 }));
  const [img] = images(container);
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  assert.equal(img.getAttribute('width'), String(width));
  assert.equal(img.getAttribute('height'), String(height));
  // The height attribute alone would fix the image at its pixel height; auto lets the ratio decide.
  assert.equal(img.style.height, 'auto');
  assert.equal(img.style.maxHeight, '420px');
  assert.equal(img.getAttribute('src'), FIGURE);
});

test('a figure with no known size is drawn as before, with neither attribute', async (t) => {
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.ZoomableImage, { src: 'https://i.imgur.com/abc123.png', alt: 'ภาพ' }));
  const [img] = images(container);
  assert.equal(img.hasAttribute('width'), false);
  assert.equal(img.hasAttribute('height'), false);
});

test('a note\'s deck figures are drawn with their width and height, once the map has loaded', async (t) => {
  const [sectionId, figures] = Object.entries(SLIDE_IMAGES).find(([, list]) => list.length >= 2);
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId, source: 'deck p.3' }));
  // The map and the sizes are two lazy modules; let them arrive.
  for (let i = 0; i < 20 && images(container).length === 0; i++) await mod.act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  const drawn = images(container);
  assert.deepEqual(drawn.map((n) => n.getAttribute('src')), figures);
  for (const img of drawn) {
    const [width, height] = slideImageSize(img.getAttribute('src'));
    assert.equal(img.getAttribute('width'), String(width));
    assert.equal(img.getAttribute('height'), String(height));
    assert.equal(img.style.height, 'auto');
    assert.equal(img.style.width, '100%');
  }
});

test('a second section reads the loaded map in its first render: its figures are there from the first paint', async (t) => {
  const [sectionId, figures] = Object.entries(SLIDE_IMAGES).find(([, list]) => list.length === 1);
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId }));
  assert.deepEqual(images(container).map((n) => n.getAttribute('src')), figures, 'no wait, no empty first frame');
});

test('a section with no figure draws nothing, and nothing warns', async (t) => {
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId: 'vet-histo--no-such--section' }));
  assert.equal(container.childNodes.length, 0);
  assert.deepEqual(dom.consoleErrors, []);
});
