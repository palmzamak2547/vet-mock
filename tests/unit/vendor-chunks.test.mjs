// ============================================================
// vendor-chunks.test.mjs — what the shared vendor chunk may hold
// ============================================================
// Every visitor loads the shared `vendor` chunk about two seconds after Home
// appears: the Supabase client is imported at idle, and it takes tslib and
// the Iceberg catalog from that chunk. The chunk rules used to end in a
// catch-all `return 'vendor'`, so every package without a rule of its own
// landed there too. The chunk grew to 666 KB, about 95% of it the PDF reader
// (pdf.js), pdf-lib's embedded fonts and DICOM decoder code, and a student
// who never opens a PDF downloaded and compiled all of it.
//
// The rules now keep `vendor` to a short allowlist. The PDF reader and
// pdf-lib's fonts get chunks of their own, the DICOM decoders stay with
// Cornerstone, and any other package is left to Rollup, which places it
// beside the code that imports it.
//
// pdf.js used to arrive with that idle chunk, so opening a PDF never had to
// fetch it. Now the first open fetches the reader chunk, and a failed fetch
// must leave the next attempt free to try again: the reader's error message
// says "try again", and that has to be possible without reloading the page.
// The library shelf, which warms the reader while it sits idle, warms pdf.js
// with it, so the first open from the shelf still waits only for the
// document, and a shelf visited online can open a cached deck offline.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import config from '../../vite.config.js';

const manualChunks = config.build.rollupOptions.output.manualChunks;

// Rollup ids are absolute paths; Vite hands them over with forward slashes,
// on Windows too.
const chunkOf = (modulePath) => manualChunks(`C:/work/vet-mock/node_modules/${modulePath}`);

test('the pdf.js reader gets its own chunk, out of the chunk every visit loads', () => {
  assert.equal(chunkOf('pdfjs-dist/build/pdf.mjs'), 'vendor-pdf-read');
  // The worker URL module (`?url`) travels with the reader that needs it.
  assert.equal(chunkOf('pdfjs-dist/build/pdf.worker.min.mjs?url'), 'vendor-pdf-read');
});

test("pdf-lib's embedded fonts and PNG codec travel with pdf-lib, not the shared chunk", () => {
  for (const id of [
    'pdf-lib/es/index.js',
    'pdf-lib/node_modules/pako/lib/inflate.js',
    'pdf-lib/node_modules/tslib/tslib.es6.js',
    '@pdf-lib/standard-fonts/es/index.js',
    '@pdf-lib/standard-fonts/node_modules/pako/lib/inflate.js',
    '@pdf-lib/upng/UPNG.js',
    '@pdf-lib/upng/node_modules/pako/lib/deflate.js',
  ]) assert.equal(chunkOf(id), 'vendor-pdf-write', id);
});

test('the shared vendor chunk is a short allowlist of packages the idle loaders share', () => {
  for (const id of [
    'tslib/tslib.es6.mjs',
    'iceberg-js/dist/index.mjs',
    '@vercel/analytics/dist/react/index.mjs',
    '@vercel/speed-insights/dist/react/index.mjs',
    'clsx/dist/clsx.mjs',
    'tailwind-merge/dist/bundle-mjs.mjs',
  ]) assert.equal(chunkOf(id), 'vendor', id);
});

test('a package without a rule is left to Rollup instead of joining the shared chunk', () => {
  // These all sat in the 666 KB chunk. Cornerstone imports them statically,
  // so Rollup pulls them into vendor-cornerstone; LIFF gets its own chunk.
  for (const id of [
    'pako/dist/pako.esm.mjs',
    'seedrandom/index.js',
    'utif/UTIF.js',
    'utif/node_modules/pako/index.js',
    'loglevel/lib/loglevel.js',
    'uuid/dist/esm-browser/v4.js',
    'lodash.get/index.js',
    'd3-array/src/index.js',
    '@line/liff/dist/lib/index.js',
    'whatwg-fetch/fetch.js',
    'some-future-package/index.js',
  ]) assert.equal(chunkOf(id), undefined, id);
});

test('the lossless JPEG decoder stays inside the Cornerstone chunk that loads it', () => {
  // Cornerstone imports it with import(); on its own it would become a chunk
  // fetched in the middle of decoding an image.
  assert.equal(chunkOf('jpeg-lossless-decoder-js/release/lossless.js'), 'vendor-cornerstone');
});

test('the existing chunk rules are unchanged', () => {
  assert.equal(chunkOf('react/index.js'), 'vendor-react');
  assert.equal(chunkOf('react-dom/client.js'), 'vendor-react');
  assert.equal(chunkOf('scheduler/index.js'), 'vendor-react');
  assert.equal(chunkOf('lucide-react/dist/esm/lucide-react.js'), 'vendor-icons');
  assert.equal(chunkOf('three/build/three.module.js'), 'vendor-atlas');
  assert.equal(chunkOf('valibot/dist/index.js'), 'vendor-validation');
  assert.equal(chunkOf('@supabase/supabase-js/dist/index.mjs'), 'vendor-supabase');
  assert.equal(chunkOf('@supabase/phoenix/priv/static/phoenix.mjs'), 'vendor-supabase');
  for (const id of [
    '@cornerstonejs/core/dist/esm/index.js',
    '@cornerstonejs/dicom-image-loader/dist/esm/index.js',
    '@kitware/vtk.js/index.js',
    'dicom-parser/dist/dicomParser.min.js',
    'gl-matrix/esm/index.js',
    'comlink/dist/esm/comlink.mjs',
  ]) assert.equal(chunkOf(id), 'vendor-cornerstone', id);
  assert.equal(manualChunks('C:/work/vet-mock/src/data/questions-com3.js'), 'data-q-com3');
  assert.equal(manualChunks('C:/work/vet-mock/src/views/HomeView.jsx'), undefined);
});

test('a failed pdf.js load is not remembered, so the next open can try again', async () => {
  const source = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const start = source.indexOf('let _pdfjsPromise = null;');
  const end = source.indexOf('\nexport default function PdfAnnotateView');
  assert.ok(start !== -1 && end > start, 'the reader must still load pdf.js through loadPdfjs');
  const code = source.slice(start, end)
    .replaceAll('import.meta.url', '__metaUrl')
    .replaceAll('import(', '__import(');

  const pdfjs = { GlobalWorkerOptions: {} };
  let readerLoads = 0;
  const context = vm.createContext({
    URL,
    __metaUrl: 'https://vetmock.test/assets/PdfAnnotateView.js',
    __import: async (specifier) => {
      if (specifier === 'pdfjs-dist') {
        readerLoads += 1;
        if (readerLoads === 1) throw new TypeError('Failed to fetch dynamically imported module');
        return pdfjs;
      }
      return { default: '/assets/pdf.worker.min.mjs' };
    },
  });
  const loadPdfjs = vm.runInContext(`${code}\n;loadPdfjs`, context);

  await assert.rejects(loadPdfjs(), /Failed to fetch/);
  assert.equal(await loadPdfjs(), pdfjs, 'the second open must fetch the reader again');
  assert.equal(pdfjs.GlobalWorkerOptions.workerSrc, '/assets/pdf.worker.min.mjs');
  assert.equal(await loadPdfjs(), pdfjs);
  assert.equal(readerLoads, 2, 'a reader that loaded is kept, not fetched again');
});

test('the library shelf warms pdf.js along with the reader while it sits idle', async () => {
  // Before the split, pdf.js came with the idle vendor chunk, so the shelf's
  // warm-up of the reader was enough for the first open to wait only for
  // document bytes. The reader now imports pdf.js only when a document opens.
  const source = readFileSync(new URL('../../src/views/LibraryView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const start = source.indexOf('// Warm the reader chunk');
  const end = source.indexOf('}, []);', start);
  assert.ok(start !== -1 && end > start, 'the shelf must still warm the reader while it sits idle');
  const code = source.slice(start, end + '}, []);'.length).replaceAll('import(', '__import(');

  const warmed = [];
  const context = vm.createContext({
    useEffect: (effect) => { effect(); },
    window: { requestIdleCallback: (fn) => { fn(); return 1; }, cancelIdleCallback: () => {} },
    setTimeout,
    clearTimeout,
    __import: async (specifier) => { warmed.push(specifier); throw new TypeError('offline'); },
  });
  vm.runInContext(code, context);
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual([...warmed].sort(), ['./PdfAnnotateView.jsx', 'pdfjs-dist']);
});
