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
import { readFileSync } from 'node:fs';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { QUESTION_MEDIA_SIZES } from '../../src/data/media-sizes.generated.js';
import { SLIDE_IMAGES } from '../../src/data/slide-images.generated.js';
import { slideImageSize } from '../../src/data/slide-image-sizes.generated.js';
import { loadMediaSizes, mediaSize } from '../../src/lib/media-size.js';
import { safeImageUrl } from '../../src/lib/safe-url.js';
import { bundleModule, findAll, installDom, mountElement, reactProps, stubModule } from './helpers/mini-dom.mjs';

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
        // As the cards ask: every one of them hands the figure safeImageUrl(path), which
        // answers with the path as a browser spells it, and that is what is looked up.
        const shown = safeImageUrl(src);
        assert.ok(shown, `${q.subject}:${q.id} ${field} is a figure the cards refuse to draw: ${String(src).slice(0, 80)}`);
        const size = mediaSize(shown);
        assert.ok(size && size.width > 0 && size.height > 0, `${q.subject}:${q.id} ${field} has no size as the card asks for it (${shown.slice(0, 80)})`);
        assert.deepEqual(size, mediaSize(src), `${q.subject}:${q.id} ${field}: the raw path and the card's path name one size`);
        if (String(src).startsWith('data:')) inline++; else files++;
      }
    }
  }
  assert.ok(files >= 150 && inline >= 9, `${files} file figures, ${inline} inline`);
});

test('a path the browser spells differently still finds its size', async () => {
  await loadMediaSizes();
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  // safeImageUrl answers with the browser's spelling: a space becomes %20, a Thai letter its bytes.
  assert.equal(safeImageUrl('/figures/questions/ภาพ 1.webp'), '/figures/questions/%E0%B8%A0%E0%B8%B2%E0%B8%9E%201.webp');
  // An escaped spelling of a recorded path is the same file.
  assert.deepEqual(mediaSize(FIGURE.replace('q104006', '%71104006')), { width, height });
  assert.equal(mediaSize('/figures/questions/%E0%A4%A.webp'), null, 'a broken escape names nothing, and does not throw');
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

// ── A picture that does not come ─────────────────────────────────────
// The frame the card kept for a picture went when the picture failed: an 80 px
// note took its place and the stem and the options moved up by 111 to 401 px.
const byClass = (container, name) => findAll(container, (n) => (n.getAttribute('class') || '').split(' ').includes(name));
const fire = (node, handler) => mod.act(async () => { reactProps(node)[handler]({ stopPropagation() {}, preventDefault() {} }); });

test('a picture that fails to load keeps its frame: the note, the description and a retry stand in its place', async (t) => {
  await mod.loadMediaSizes();
  const alt = 'แผนภาพแสดงระยะห่างที่แนะนำระหว่างคน';
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.ZoomableImage, { src: FIGURE, alt, maxHeight: 420 }));
  const [width, height] = QUESTION_MEDIA_SIZES[FIGURE];
  assert.equal(byClass(container, 'vmx-zoom-missing').length, 0);
  // While the file is on the way the frame is the card's surface, not a white page.
  assert.deepEqual(byClass(container, 'vmx-zoom-frame').map((n) => n.getAttribute('class')), ['vmx-zoom-frame']);

  await fire(images(container)[0], 'onError');
  assert.equal(images(container).length, 0);
  const [missing] = byClass(container, 'vmx-zoom-missing');
  // The same box: the picture's own shape, under the same cap.
  assert.equal(missing.style.aspectRatio, `${width} / ${height}`);
  assert.equal(missing.style.maxHeight, '420px');
  assert.equal(byClass(container, 'vmx-zoom-missing-note')[0].textContent, 'ภาพโหลดไม่ได้');
  assert.equal(byClass(container, 'vmx-zoom-missing-note')[0].getAttribute('role'), 'status');
  assert.equal(byClass(container, 'vmx-zoom-missing-alt')[0].textContent, alt, 'the description is read where the picture would be');
  // The strip's place is the retry's: the frame, the strip and what is under them stay where they were.
  const [retry] = byClass(container, 'vmx-zoom-retry');
  assert.equal(retry.tagName, 'BUTTON');
  assert.equal(retry.textContent, 'ลองโหลดอีกครั้ง');
  assert.ok((retry.getAttribute('class') || '').split(' ').includes('vmx-zoom-hint'), 'the retry is drawn as the strip is');
  assert.equal(findAll(container, (n) => n.tagName === 'BUTTON').length, 1, 'no zoom control for a picture that is not there');

  // The retry asks for the file again, in the same frame.
  await fire(retry, 'onClick');
  const [again] = images(container);
  assert.equal(again.getAttribute('src'), FIGURE);
  assert.equal(again.getAttribute('width'), String(width));
  assert.equal(byClass(container, 'vmx-zoom-missing').length, 0);
  await fire(again, 'onLoad');
  assert.deepEqual(byClass(container, 'vmx-zoom-frame').map((n) => n.getAttribute('class')), ['vmx-zoom-frame is-loaded'], 'white behind a loaded picture, for line art with a clear ground');
  assert.deepEqual(dom.consoleErrors, []);
});

test('the next question\'s picture starts over: a failure does not follow the card', async (t) => {
  await mod.loadMediaSizes();
  const container = dom.document.createElement('div');
  dom.document.body.appendChild(container);
  const root = mod.createRoot(container);
  t.after(async () => { await mod.act(async () => { root.unmount(); }); dom.document.body.removeChild(container); });
  await mod.act(async () => { root.render(mod.createElement(mod.ZoomableImage, { src: FIGURE, alt: 'ภาพแรก' })); });
  await fire(images(container)[0], 'onError');
  assert.equal(byClass(container, 'vmx-zoom-missing').length, 1);
  const other = Object.keys(QUESTION_MEDIA_SIZES).find((p) => p !== FIGURE);
  await mod.act(async () => { root.render(mod.createElement(mod.ZoomableImage, { src: other, alt: 'ภาพถัดไป' })); });
  assert.equal(byClass(container, 'vmx-zoom-missing').length, 0, 'the new picture is asked for, in its own frame');
  assert.equal(images(container)[0].getAttribute('src'), other);
});

test('a note\'s deck figures are drawn with their width and height, once the map has loaded', async (t) => {
  const [sectionId, figures] = Object.entries(SLIDE_IMAGES).find(([, list]) => list.length >= 2);
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId, source: 'deck p.3' }));
  // The map and the sizes are two lazy modules; let them arrive.
  for (let i = 0; i < 20 && images(container).length === 0; i++) await mod.act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  const drawn = images(container);
  assert.deepEqual(drawn.map((n) => n.getAttribute('src')), figures);
  for (const [i, img] of drawn.entries()) {
    const [width, height] = slideImageSize(img.getAttribute('src'));
    assert.equal(img.getAttribute('width'), String(width));
    assert.equal(img.getAttribute('height'), String(height));
    assert.equal(img.style.height, 'auto');
    assert.equal(img.style.width, '100%');
    // Never wider than its own pixels (an 84 px picture was drawn 652 px wide), and never
    // taller than most of the screen: the width is held to what gives that height.
    assert.equal(img.style.maxWidth, `min(${width}px, calc(80vh * ${(width / height).toFixed(4)}))`);
    // Each figure of a section has a name of its own.
    assert.equal(img.getAttribute('alt'), `ภาพจากสไลด์ deck p.3 ภาพที่ ${i + 1}`);
  }
  assert.equal(new Set(drawn.map((n) => n.getAttribute('alt'))).size, drawn.length);
  // "บันทึกภาพ" is a control of its own, with an icon and no arrow character.
  const links = findAll(container, (n) => n.tagName === 'A');
  assert.equal(links.length, drawn.length);
  for (const link of links) {
    assert.equal(link.getAttribute('class'), 'vmx-slide-save');
    assert.equal(link.textContent, 'บันทึกภาพ');
  }
});

test('a second section reads the loaded map in its first render: its figures are there from the first paint', async (t) => {
  const [sectionId, figures] = Object.entries(SLIDE_IMAGES).find(([, list]) => list.length === 1);
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId, source: 'Avian p.4' }));
  assert.deepEqual(images(container).map((n) => n.getAttribute('src')), figures, 'no wait, no empty first frame');
  assert.equal(images(container)[0].getAttribute('alt'), 'ภาพจากสไลด์ Avian p.4', 'a section\'s only figure needs no number');
});

// The map and the sizes were one Promise.all, kept for the life of the page: a
// sizes chunk that did not arrive took every figure of every note with it.
test('when the sizes do not arrive the figures are still drawn, as they were before sizes existed', async (t) => {
  const broken = await bundleModule({
    prefix: 'media-box-nosizes-',
    contents: "export { default as SlideFigures } from './src/components/SlideFigures.jsx';",
    plugins: [stubModule(/slide-image-sizes\.generated\.js$/, "throw new TypeError('Failed to fetch dynamically imported module: https://vetmock.example/assets/slide-image-sizes.js');")],
  });
  t.after(() => broken.dispose());
  const [sectionId, figures] = Object.entries(SLIDE_IMAGES).find(([, list]) => list.length >= 2);
  const { container } = await mountElement(t, broken.mod, dom.document, broken.mod.createElement(broken.mod.SlideFigures, { sectionId, source: 'deck p.3' }));
  for (let i = 0; i < 40 && images(container).length === 0; i++) await broken.mod.act(async () => { await new Promise((r) => setTimeout(r, 5)); });
  const drawn = images(container);
  assert.deepEqual(drawn.map((n) => n.getAttribute('src')), figures, 'every figure of the section is there');
  for (const img of drawn) {
    assert.equal(img.hasAttribute('width'), false);
    assert.equal(img.style.width, '100%');
  }
  // A section opened later draws at once from the map, and asks for the sizes again without looping.
  const [next, nextFigures] = Object.entries(SLIDE_IMAGES).find(([id, list]) => id !== sectionId && list.length === 1);
  const later = await mountElement(t, broken.mod, dom.document, broken.mod.createElement(broken.mod.SlideFigures, { sectionId: next }));
  assert.deepEqual(images(later.container).map((n) => n.getAttribute('src')), nextFigures);
  await broken.mod.act(async () => { await new Promise((r) => setTimeout(r, 30)); });
  assert.deepEqual(images(later.container).map((n) => n.getAttribute('src')), nextFigures);
  assert.deepEqual(dom.consoleErrors, []);
});

test('the note figures\' loader forgets a failure instead of keeping it for the life of the page', () => {
  const src = readFileSync(new URL('../../src/components/SlideFigures.jsx', import.meta.url), 'utf8');
  // The sizes fail soft, the map's failure clears the kept promise, and both are asked for afresh.
  assert.match(src, /importFresh\(\(\) => import\('\.\.\/data\/slide-image-sizes\.generated\.js'\)\)\.catch\(\(\) => null\)/);
  assert.match(src, /importFresh\(\(\) => import\('\.\.\/data\/slide-images\.generated\.js'\)\)/);
  assert.match(src, /\}, \(error\) => \{\s*_promise = null;\s*throw error;\s*\}\)/);
  assert.match(src, /if \(!sized\) _promise = null;/);
});

test('a section with no figure draws nothing, and nothing warns', async (t) => {
  const { container } = await mountElement(t, mod, dom.document, mod.createElement(mod.SlideFigures, { sectionId: 'vet-histo--no-such--section' }));
  assert.equal(container.childNodes.length, 0);
  assert.deepEqual(dom.consoleErrors, []);
});
