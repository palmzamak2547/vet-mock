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

// Pen-only mode is switched on the first time the reader sees a stylus, which
// is the normal state on the one device this feature is for: an iPad with a
// Pencil. In that mode a finger scrolls instead of drawing. onPointerDown
// registers EVERY pointer with the pinch bookkeeping before it decides what
// the pointer is for, but onPointerUp returned early on the pan branch — so
// the scrolling finger was never taken back out. It sat there as a phantom
// contact, and the next single finger down counted as the SECOND finger of a
// pinch: one finger dragging now zoomed the document, and scrolling was over
// for the rest of the session.
test('a finger that scrolled in pen-only mode does not become half of a pinch', async ({ page }) => {
  await openReaderWithPdf(page);

  const pageWidth = () => page.evaluate(() => (
    document.querySelector('[data-page="1"] canvas')?.width || 0
  ));

  // One stylus contact turns pen-only mode on, the way it does for a student
  // who has just picked up their Pencil.
  const penOnly = await page.evaluate(() => {
    const ov = [...document.querySelectorAll('canvas')]
      .find((c) => getComputedStyle(c).position === 'absolute');
    const r = ov.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + Math.min(r.height / 2, 120);
    const fire = (type, id, pointerType, cx, cy) => ov.dispatchEvent(new PointerEvent(type, {
      pointerId: id, pointerType, clientX: cx, clientY: cy, bubbles: true, cancelable: true,
      isPrimary: true, pressure: type === 'pointerup' ? 0 : 0.5, buttons: type === 'pointerup' ? 0 : 1,
    }));
    fire('pointerdown', 1, 'pen', x, y);
    fire('pointerup', 1, 'pen', x, y);
    window.__fire = fire;
    window.__anchor = { x, y };
    return true;
  });
  expect(penOnly).toBe(true);
  await page.waitForTimeout(300);

  const before = await pageWidth();
  expect(before, 'the page must have rendered before the gesture test').toBeGreaterThan(0);

  // A finger scrolls the page, then lifts.
  await page.evaluate(() => {
    const { x, y } = window.__anchor;
    window.__fire('pointerdown', 2, 'touch', x, y);
    window.__fire('pointermove', 2, 'touch', x, y - 40);
    window.__fire('pointerup', 2, 'touch', x, y - 40);
  });
  await page.waitForTimeout(200);

  // A single finger, on its own, drags a long way. That is a scroll, not a
  // pinch, and it must not change the zoom.
  await page.evaluate(() => {
    const { x, y } = window.__anchor;
    window.__fire('pointerdown', 3, 'touch', x + 10, y);
    window.__fire('pointermove', 3, 'touch', x + 150, y);
    window.__fire('pointermove', 3, 'touch', x + 300, y);
    window.__fire('pointerup', 3, 'touch', x + 300, y);
  });
  await page.waitForTimeout(1200);

  expect(await pageWidth(), 'one finger dragging zoomed the document').toBe(before);
});

test('zoom keeps the point under the cursor put and never widens the layout', async ({ page }) => {
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

  // Mark a content point: a fixed fraction of page 1, and where that fraction
  // sits in client space right now. After the zoom the SAME fraction of the
  // SAME page must still be near that client position — this is the assertion
  // the old test lacked, which is how the anchor restore could lose its only
  // call site in a refactor and stay green.
  const mark = () => page.evaluate(() => {
    const row = document.querySelector('[data-page="1"]');
    const b = row.getBoundingClientRect();
    return { x: b.left + b.width * 0.5, y: b.top + b.height * 0.4 };
  });
  const pt = await mark();
  // mouse.wheel is unsupported in mobile WebKit, so mobile zooms with the
  // toolbar button instead — whose anchor falls back to the middle of the
  // frame, so the same stays-put assertion still means something as long as
  // the marked point IS that middle. Desktop keeps the ctrl+wheel-at-a-point
  // path, which exercises the pointer-anchored branch.
  let wheelWorks = true;
  try {
    await page.mouse.move(pt.x, pt.y);
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, -120);
    await page.keyboard.up('Control');
  } catch {
    wheelWorks = false;
    await page.keyboard.up('Control').catch(() => {});
  }
  if (!wheelWorks) {
    // Re-mark at the frame's centre so the assertion matches the button's
    // centre-anchored zoom.
    const centred = await page.evaluate(() => {
      const row = document.querySelector('[data-page="1"]');
      const wrap = row.closest('div[style*="overflow"]') || row.parentElement;
      const w = wrap.getBoundingClientRect();
      const cy = w.top + w.height / 2;
      const b = row.getBoundingClientRect();
      return { fy: (cy - b.top) / b.height, cx: w.left + w.width / 2, cy };
    });
    await page.locator('button[aria-label="ขยาย"]').click();
    await page.waitForTimeout(1400);
    const rowAfter = await page.evaluate((fy) => {
      const b = document.querySelector('[data-page="1"]').getBoundingClientRect();
      return { y: b.top + fy * b.height };
    }, centred.fy);
    expect(Math.abs(rowAfter.y - centred.cy), 'button zoom lost the frame centre').toBeLessThan(48);
  }
  await page.waitForTimeout(1400);
  if (wheelWorks) {
    const ptAfter = await mark();
    expect(Math.abs(ptAfter.x - pt.x), 'zoom lost the point under the cursor (x)').toBeLessThan(48);
    expect(Math.abs(ptAfter.y - pt.y), 'zoom lost the point under the cursor (y)').toBeLessThan(48);
  }

  const after = await measure();
  expect(after.pageWidth, 'zoom did not re-render the page larger').toBeGreaterThan(before.pageWidth);

  // The page frame scrolls the oversized page; nothing ABOVE it may size to
  // the page. Without min-width:0 down the reading-mode chain the zoomed
  // page's intrinsic width propagated up, main outgrew the container, and the
  // app shell clipped the toolbar's right-hand buttons off screen.
  const overflow = await page.evaluate(() => {
    const main = document.querySelector('.vmx-main');
    const parent = main.parentElement;
    return Math.round(main.getBoundingClientRect().width - parent.getBoundingClientRect().width);
  });
  expect(overflow, 'zoom widened the layout past its container').toBeLessThanOrEqual(1);

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


// Unlike storedRecord above (a summary for the older tests), this returns the
// record RAW: the eraser/colour/shape tests assert on exact stroke lists,
// tombstones and point counts.
function storedRecordRaw(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const req = indexedDB.open('vmx-pdf-annotations');
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('docs', 'readonly');
      const all = tx.objectStore('docs').getAll();
      all.onsuccess = () => { db.close(); resolve(all.result?.[0] || null); };
      all.onerror = () => { db.close(); resolve(null); };
    };
    req.onerror = () => resolve(null);
  }));
}

test('the whole-stroke eraser tombstones the stroke it touches and redo brings it back', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  // Two separated strokes.
  const y1 = box.y + box.h * 0.3;
  const y2 = box.y + box.h * 0.6;
  for (const y of [y1, y2]) {
    await page.mouse.move(box.x + box.w * 0.2, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.w * 0.7, y, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(900);
  let rec = await storedRecordRaw(page);
  expect(rec.strokesByPage['1'].length, 'two strokes should be stored').toBe(2);

  // Switch to the eraser, open its options with a second tap, pick
  // whole-stroke mode.
  await page.locator('button[aria-label="ยางลบ"]').click();
  await page.locator('button[aria-label="ยางลบ, แตะซ้ำเพื่อเลือกโหมดลบ"]').click();
  await page.locator('button:text-is("ลบทั้งเส้นที่แตะ")').click();
  // Close the options panel — it sits in normal flow and pushes the page
  // down, so every coordinate remembered from before it opened now misses.
  await page.locator('button[aria-label="ยางลบ, แตะซ้ำเพื่อเลือกโหมดลบ"]').click();
  const box2 = await overlayBox(page);

  // One tap on the first stroke takes the whole stroke.
  await page.mouse.click(box2.x + box2.w * 0.45, box2.y + box2.h * 0.3);
  await page.waitForTimeout(900);
  rec = await storedRecordRaw(page);
  expect(rec.strokesByPage['1'].length, 'the touched stroke should be gone').toBe(1);
  expect((rec.deleted || []).length, 'the deletion must be a tombstone').toBe(1);

  // Redo puts the same ink back under a NEW id (tombstones only grow).
  await page.locator('button[aria-label="ทำซ้ำ"]').click();
  await page.waitForTimeout(900);
  rec = await storedRecordRaw(page);
  expect(rec.strokesByPage['1'].length, 'redo should restore the stroke').toBe(2);
  expect((rec.deleted || []).length, 'the tombstone must survive the redo').toBe(1);
});

test('a colour mixed in the custom picker is the colour the stroke stores', async ({ page }) => {
  await openReaderWithPdf(page);
  // Tap the pen (already in hand) to open options, mix a colour.
  await page.locator('button[aria-label="ปากกา"]').click();
  await page.locator('input[aria-label="สีกำหนดเอง"]').evaluate((el) => {
    el.value = '#123456';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const box = await overlayBox(page);
  const y = box.y + box.h * 0.5;
  await page.mouse.move(box.x + box.w * 0.2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.6, y, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  const rec = await storedRecordRaw(page);
  const stroke = rec.strokesByPage['1'][rec.strokesByPage['1'].length - 1];
  expect(stroke.color, 'the stroke should carry the custom colour').toBe('#123456');
});

test('a rough rectangle held still snaps to a clean five-point rectangle', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  const x0 = box.x + box.w * 0.25;
  const x1 = box.x + box.w * 0.65;
  const y0 = box.y + box.h * 0.25;
  const y1 = box.y + box.h * 0.55;
  await page.mouse.move(x0, y0);
  await page.mouse.down();
  // Around the box with enough samples to read as edges-with-corners.
  await page.mouse.move(x1, y0, { steps: 8 });
  await page.mouse.move(x1, y1, { steps: 8 });
  await page.mouse.move(x0, y1, { steps: 8 });
  await page.mouse.move(x0, y0 + 4, { steps: 8 });
  // Hold still: the snap timer arms on the last movement and fires at 600ms.
  await page.waitForTimeout(1000);
  await page.mouse.up();
  await page.waitForTimeout(900);
  const rec = await storedRecordRaw(page);
  const stroke = rec.strokesByPage['1'][rec.strokesByPage['1'].length - 1];
  expect(stroke.points.length, 'the held stroke should have snapped to a rectangle').toBe(5);
});


// Two tabs on the same document used to overwrite each other's ink.
// saveAnnotations merged against `mirror`, a per-tab in-memory map populated
// when THAT tab opened the file, and then put() the whole record. So a second
// tab's autosave wrote a record built from a picture taken before the first
// tab drew anything, and the first tab's strokes were gone from storage while
// still sitting on its screen — invisible until the file is reopened.
//
// The other tab is simulated by writing a record straight into IndexedDB, the
// way that tab's own put() would have.
test('a save merges with what is already stored instead of replacing it', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);

  // This tab draws once, so a record exists and we know its hash.
  await page.mouse.move(box.x + box.w * 0.2, box.y + box.h * 0.3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.6, box.y + box.h * 0.3, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(900);

  const first = await storedRecordRaw(page);
  expect(first, 'the first stroke must be stored').toBeTruthy();
  const hash = first.hash;

  // Another tab saves a stroke of its own on page 2.
  await page.evaluate(({ h }) => new Promise((resolve) => {
    const req = indexedDB.open('vmx-pdf-annotations');
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('docs', 'readwrite');
      const store = tx.objectStore('docs');
      const get = store.get(h);
      get.onsuccess = () => {
        const rec = get.result;
        rec.strokesByPage = { ...(rec.strokesByPage || {}), 2: [{ id: 'other-tab-stroke', points: [[0.1, 0.1], [0.2, 0.2]] }] };
        store.put(rec);
      };
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); resolve(false); };
    };
    req.onerror = () => resolve(false);
  }), { h: hash });

  // This tab, whose mirror knows nothing about that, draws again and saves.
  await page.mouse.move(box.x + box.w * 0.2, box.y + box.h * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.6, box.y + box.h * 0.5, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(1200);

  const after = await storedRecordRaw(page);
  const otherTabStrokes = (after?.strokesByPage?.[2] || []).filter((s) => s.id === 'other-tab-stroke');
  expect(otherTabStrokes.length, 'the other tab\'s stroke was overwritten').toBe(1);
  expect((after?.strokesByPage?.[1] || []).length, 'this tab\'s own strokes must survive too').toBeGreaterThanOrEqual(2);
});
