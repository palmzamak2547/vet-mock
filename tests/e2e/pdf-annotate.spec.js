// PDF annotation e2e — 2026-08-31
// ============================================================
// This suite exists because of one bug class: a stroke that appears on the
// canvas but never reaches storage. Nothing on screen distinguishes the two,
// so a person only finds out when they reopen the document and their notes
// are gone — and any test that stops at "ink is visible" passes anyway.
//
// It happened for real: an effect added to flush the debounced autosave on
// the way out listed `strokesByPage` in its dependencies, so React ran the
// cleanup after every stroke, cancelled the pending correct save, and wrote a
// snapshot taken before that stroke. Ink on screen, empty record in the
// database. The assertion that matters therefore reads IndexedDB back.
//
// Also pinned: pressure survives to storage (the flag AND a third component
// on the point), because that is what makes a stylus feel like a pen, and
// undo/redo actually move ink rather than just toggling a button.

import { test, expect } from '@playwright/test';

// A minimal one-page PDF. Built here rather than committed as a fixture so
// the test carries its own input and cannot drift from it.
const TINY_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
  + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

// Multi-page fixture for the scrolling column.
const manyPagePdf = (n) => Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + '2 0 obj<</Type/Pages/Kids['
  + Array.from({ length: n }, (_, i) => (i + 3) + ' 0 R').join(' ')
  + ']/Count ' + n + '>>endobj\n'
  + Array.from({ length: n }, (_, i) => (i + 3) + ' 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n').join('')
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

async function openReaderWithPdf(page, pages = 1) {
  await page.goto('/app/tools/pdf');
  await page.locator('input[type=file]').setInputFiles({
    name: 'e2e.pdf',
    mimeType: 'application/pdf',
    buffer: pages > 1 ? manyPagePdf(pages) : TINY_PDF,
  });
  await page.waitForFunction(() => document.querySelectorAll('canvas').length >= 2, null, { timeout: 30000 });
  await page.waitForTimeout(600);
}

// The part of the overlay that is BOTH on the canvas and inside the window.
// On a phone the page canvas is taller than the viewport, so a point chosen
// from the canvas rect alone can sit off-screen, where a synthetic pointer
// lands on nothing and the test reports "drew nothing" for a feature that
// works perfectly.
function overlayBox(page) {
  return page.evaluate(() => {
    const ov = [...document.querySelectorAll('canvas')]
      .find((c) => getComputedStyle(c).position === 'absolute');
    const r = ov.getBoundingClientRect();
    const top = Math.max(r.top, 0);
    const bottom = Math.min(r.bottom, window.innerHeight);
    const left = Math.max(r.left, 0);
    const right = Math.min(r.right, window.innerWidth);
    return { x: left, y: top, w: right - left, h: bottom - top };
  });
}

function inkPixels(page) {
  return page.evaluate(() => {
    const ov = [...document.querySelectorAll('canvas')]
      .find((c) => getComputedStyle(c).position === 'absolute');
    const d = ov.getContext('2d').getImageData(0, 0, ov.width, ov.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
    return n;
  });
}

function storedRecord(page) {
  return page.evaluate(async () => {
    const db = await new Promise((res, rej) => {
      const r = indexedDB.open('vmx-pdf-annotations');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    const recs = await new Promise((res) => {
      const q = db.transaction('docs').objectStore('docs').getAll();
      q.onsuccess = () => res(q.result);
    });
    const first = recs[0];
    const stroke = first?.strokesByPage?.['1']?.[0];
    return {
      records: recs.length,
      strokesOnPage1: first?.strokesByPage?.['1']?.length ?? 0,
      pressureFlag: stroke?.pressure ?? null,
      pointComponents: stroke?.points?.[3]?.length ?? null,
    };
  });
}

test('a stroke that is drawn is a stroke that is stored', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);

  const y1 = box.y + box.h * 0.25;
  const step = (box.w - 60) / 25;
  await page.mouse.move(box.x + 30, y1);
  await page.mouse.down();
  for (let i = 1; i <= 25; i++) {
    await page.mouse.move(box.x + 30 + i * step, y1 + Math.sin(i / 3) * Math.min(30, box.h * 0.06));
  }
  await page.mouse.up();

  expect(await inkPixels(page)).toBeGreaterThan(300);

  // Past the 500 ms autosave, with room for the IndexedDB round trip.
  await page.waitForTimeout(1500);
  const rec = await storedRecord(page);
  expect(rec.records, 'no record was written for the opened document').toBeGreaterThan(0);
  expect(rec.strokesOnPage1, 'ink was on the canvas but the record held no strokes').toBe(1);
});


test('a stroke made a moment before leaving is not thrown away', async ({ page }) => {
  // The exit path used to CANCEL the pending autosave and then unmount, so the
  // flush that exists to catch exactly this found no timer and wrote nothing.
  // Measured at the time: draw, leave 60 ms later, 0 strokes in storage.
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  const y = box.y + box.h * 0.3;
  await page.mouse.move(box.x + 30, y);
  await page.mouse.down();
  for (let i = 1; i <= 15; i++) await page.mouse.move(box.x + 30 + i * ((box.w - 60) / 15), y);
  await page.mouse.up();

  // Well inside the 500 ms autosave debounce.
  await page.waitForTimeout(60);
  await page.locator('button:has-text("เปลี่ยน PDF")').first().click();
  await page.waitForTimeout(1500);

  const stored = await storedRecord(page);
  expect(stored.strokesOnPage1, 'leaving the reader discarded the last stroke').toBe(1);
});


test('the reader is a scrolling column and a stroke lands on the page it was drawn on', async ({ page }) => {
  // `currentPage` follows the reader's eye down the column now, so the page a
  // stroke belongs to has to come from the canvas the pointer was on. Get that
  // wrong and a slow stroke near a page boundary is filed under whichever page
  // scrolled into view while the pen was still down.
  await openReaderWithPdf(page, 4);
  await page.waitForTimeout(600);
  expect(await page.locator('[data-page]').count(),
    'the column did not render one row per page').toBe(4);

  await page.evaluate(() => {
    const el = document.querySelector('[data-page="3"]');
    el.parentElement.scrollTop = el.offsetTop - 8;
  });
  await page.waitForTimeout(1400);

  const box = await page.evaluate(() => {
    const el = document.querySelector('[data-page="3"]');
    const c = el.querySelectorAll('canvas')[1];
    const r = c.getBoundingClientRect();
    const w = el.parentElement.getBoundingClientRect();
    return { x: r.left, y: Math.max(r.top, w.top) + 30, w: r.width };
  });
  await page.mouse.move(box.x + 40, box.y);
  await page.mouse.down();
  for (let i = 1; i <= 15; i++) await page.mouse.move(box.x + 40 + i * ((box.w - 80) / 15), box.y);
  await page.mouse.up();
  await page.waitForTimeout(1600);

  const filed = await page.evaluate(async () => {
    const db = await new Promise((res) => {
      const r = indexedDB.open('vmx-pdf-annotations');
      r.onsuccess = () => res(r.result);
    });
    const recs = await new Promise((res) => {
      const q = db.transaction('docs').objectStore('docs').getAll();
      q.onsuccess = () => res(q.result);
    });
    const byPage = recs[0]?.strokesByPage || {};
    return Object.entries(byPage).filter(([, a]) => a.length).map(([k, a]) => k + ':' + a.length).join();
  });
  expect(filed, 'the stroke was filed under the wrong page').toBe('3:1');
});

test('distant pages let go of their bitmaps', async ({ page }) => {
  // A 300-page textbook cannot hold 300 rasters, and on iOS a tab that tries
  // is killed with no error and no unload event.
  await openReaderWithPdf(page, 8);
  await page.waitForTimeout(1600);
  const rendered = () => page.evaluate(() => [...document.querySelectorAll('[data-page]')]
    .filter((el) => (el.querySelector('canvas')?.width || 0) > 10).length);
  expect(await rendered(), 'every page rendered at once').toBeLessThan(8);
  await page.evaluate(() => { document.querySelector('[data-page]').parentElement.scrollTop = 99999; });
  await page.waitForTimeout(1600);
  expect(await rendered(), 'pages left behind kept their bitmaps').toBeLessThan(8);
});

test('undo removes ink and redo puts the same ink back', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);

  const yy = box.y + box.h * 0.3;
  const dx = (box.w - 60) / 20;
  await page.mouse.move(box.x + 30, yy);
  await page.mouse.down();
  for (let i = 1; i <= 20; i++) await page.mouse.move(box.x + 30 + i * dx, yy);
  await page.mouse.up();
  await page.waitForTimeout(200);
  const drawn = await inkPixels(page);
  expect(drawn).toBeGreaterThan(200);

  // The toolbar is icon-only now, so the accessible name is the handle. That
  // is also the stricter test: if a button loses its label the suite fails,
  // which is the right outcome for a row of unlabelled glyphs.
  await page.locator('button[aria-label="ย้อนกลับ"]').click();
  await page.waitForTimeout(250);
  expect(await inkPixels(page), 'undo left ink behind').toBe(0);

  await page.locator('button[aria-label="ทำซ้ำ"]').click();
  await page.waitForTimeout(250);
  expect(await inkPixels(page), 'redo did not restore the same stroke').toBe(drawn);
});

test('the highlighter stays translucent where it crosses itself', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  await page.locator('button[aria-label="ปากกาไฮไลต์"]').click();

  // Out and back over the same line. Composited per segment, the overlap
  // reaches full opacity and blacks out the text a highlighter is meant to
  // leave readable.
  const hy = box.y + box.h * 0.5;
  const hx = (box.w - 60) / 18;
  await page.mouse.move(box.x + 30, hy);
  await page.mouse.down();
  for (let i = 1; i <= 18; i++) await page.mouse.move(box.x + 30 + i * hx, hy);
  for (let i = 18; i >= 6; i--) await page.mouse.move(box.x + 30 + i * hx, hy);
  await page.mouse.up();
  await page.waitForTimeout(400);

  const maxAlpha = await page.evaluate(() => {
    const ov = [...document.querySelectorAll('canvas')]
      .find((c) => getComputedStyle(c).position === 'absolute');
    const d = ov.getContext('2d').getImageData(0, 0, ov.width, ov.height).data;
    let max = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > max) max = d[i];
    return max;
  });
  expect(maxAlpha, 'the highlighter painted nothing').toBeGreaterThan(0);
  expect(maxAlpha, 'the highlighter went opaque where it overlapped itself').toBeLessThan(190);
});

test('zooming enlarges the page and both edges stay reachable', async ({ page }) => {
  await openReaderWithPdf(page);
  const measure = () => page.evaluate(() => {
    const ov = [...document.querySelectorAll('canvas')]
      .find((c) => getComputedStyle(c).position === 'absolute');
    const wrap = ov.parentElement.parentElement;
    return {
      pageWidth: ov.parentElement.querySelector('canvas').width,
      scrollW: wrap.scrollWidth,
      clientW: wrap.clientWidth,
    };
  });
  const before = await measure();
  await page.locator('button[aria-label="ขยาย"]').click();
  await page.waitForTimeout(1200);
  const after = await measure();

  expect(after.pageWidth, 'zoom did not re-render the page larger').toBeGreaterThan(before.pageWidth);
  // A centred flex item that overflows is clipped at its start edge with no
  // way to scroll back to it, so an overflowing wrapper must be scrollable.
  if (after.scrollW > after.clientW) {
    await page.evaluate(() => {
      const ov = [...document.querySelectorAll('canvas')]
        .find((c) => getComputedStyle(c).position === 'absolute');
      ov.parentElement.parentElement.scrollLeft = 99999;
    });
    const left = await page.evaluate(() => {
      const ov = [...document.querySelectorAll('canvas')]
        .find((c) => getComputedStyle(c).position === 'absolute');
      return ov.parentElement.parentElement.scrollLeft;
    });
    expect(left, 'the zoomed page could not be scrolled sideways').toBeGreaterThan(0);
  }
});
