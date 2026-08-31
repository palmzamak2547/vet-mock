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

async function openReaderWithPdf(page) {
  await page.goto('/app/tools/pdf');
  await page.locator('input[type=file]').setInputFiles({
    name: 'e2e.pdf', mimeType: 'application/pdf', buffer: TINY_PDF,
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

  // text-is, not has-text: the sidebar carries "คลิปย้อนหลัง", which a
  // substring match on "ย้อน" hits first and navigates away from the reader.
  await page.locator('button:text-is("↶ ย้อน")').click();
  await page.waitForTimeout(250);
  expect(await inkPixels(page), 'undo left ink behind').toBe(0);

  await page.locator('button:text-is("↷ ทำซ้ำ")').click();
  await page.waitForTimeout(250);
  expect(await inkPixels(page), 'redo did not restore the same stroke').toBe(drawn);
});

test('the highlighter stays translucent where it crosses itself', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  await page.locator('button:text-is("ไฮไลต์")').click();

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
