// Writing studio e2e: lasso and notebooks (2026-10-21).
// ============================================================
// Lasso: a loop takes the stroke it surrounds; dragging the box stores the
// moved stroke under a new id and tombstones the old one (so sync drops it on
// every device); one undo puts the original back. Deleting from the action
// bar is undone in one step too, even when it emptied the page.
// Notebooks: a new notebook opens in the reader with its pages; adding a page
// keeps the ink already written; the shelf lists the notebook afterwards.
// Every assertion that matters reads IndexedDB, not the canvas alone.

import fs from 'node:fs';
import { test, expect } from './fixtures.js';

// Production's Content-Security-Policy, as vercel.json serves it. The local
// preview sends none, so a notebook opened through a blob: URL passed here
// and failed on vetmock.com (5.156.0: connect-src has no blob:). Pages in
// this spec get the real policy, minus upgrade-insecure-requests, which
// would send the http preview's own requests to https.
const PROD_CSP = (() => {
  const conf = JSON.parse(fs.readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
  for (const h of conf.headers || []) {
    const csp = (h.headers || []).find((x) => x.key === 'Content-Security-Policy');
    if (csp && /connect-src/.test(csp.value) && /default-src 'self'/.test(csp.value)) {
      return csp.value.replace(/;\s*upgrade-insecure-requests/, '');
    }
  }
  throw new Error('no app CSP in vercel.json');
})();

async function withProductionCsp(page) {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const res = await route.fetch();
    await route.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': PROD_CSP } });
  });
}

const TINY_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
  + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

async function settledPage(page, n = 1) {
  let last = null;
  await expect.poll(async () => {
    const now = await page.evaluate((num) => {
      const row = document.querySelector(`[data-page="${num}"]`);
      if (!row || row.getAttribute('data-render-state') !== 'ready') return null;
      const r = row.getBoundingClientRect();
      return [r.left, r.top, r.width, r.height].map(Math.round).join(',') + `/${row.querySelector('canvas')?.width || 0}`;
    }, n);
    const steady = now !== null && now === last;
    last = now;
    return steady;
  }, { timeout: 30_000, intervals: [150, 250], message: `page ${n} never settled` }).toBe(true);
}

async function openReaderWithPdf(page) {
  await page.goto('/app/tools/pdf');
  await page.locator('input[type=file]').setInputFiles({ name: 'e2e.pdf', mimeType: 'application/pdf', buffer: TINY_PDF });
  await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible({ timeout: 30_000 });
  await settledPage(page, 1);
}

const overlayBox = (page, n = 1) => page.evaluate((num) => {
  const ov = document.querySelector(`[data-page="${num}"] canvas:nth-of-type(2)`);
  const r = ov.getBoundingClientRect();
  const top = Math.max(r.top, 0); const bottom = Math.min(r.bottom, window.innerHeight);
  const left = Math.max(r.left, 0); const right = Math.min(r.right, window.innerWidth);
  return { x: left, y: top, w: right - left, h: bottom - top };
}, n);

const record = (page) => page.evaluate(() => new Promise((resolve) => {
  const req = indexedDB.open('vmx-pdf-annotations');
  req.onsuccess = () => {
    const all = req.result.transaction('docs', 'readonly').objectStore('docs').getAll();
    all.onsuccess = () => { req.result.close(); resolve(all.result || []); };
    all.onerror = () => resolve([]);
  };
  req.onerror = () => resolve([]);
}));
const firstRecord = async (page) => (await record(page))[0] || null;
const strokes = async (page, p = '1') => (await firstRecord(page))?.strokesByPage?.[p] || [];

async function drawLine(page, box, fy) {
  await page.mouse.move(box.x + box.w * 0.25, box.y + box.h * fy);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.6, box.y + box.h * fy, { steps: 10 });
  await page.mouse.up();
}

async function lassoAround(page, box, fy) {
  // A loop well clear of the line at height fy.
  const pts = [[0.15, fy - 0.08], [0.7, fy - 0.08], [0.7, fy + 0.08], [0.15, fy + 0.08], [0.15, fy - 0.07]];
  await page.mouse.move(box.x + box.w * pts[0][0], box.y + box.h * pts[0][1]);
  await page.mouse.down();
  for (const [x, y] of pts.slice(1)) await page.mouse.move(box.x + box.w * x, box.y + box.h * y, { steps: 6 });
  await page.mouse.up();
}

test('the lasso moves a stroke as a new stroke, and one undo puts it back', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  await drawLine(page, box, 0.3);
  await expect.poll(async () => (await strokes(page)).length, { message: 'the line should be stored' }).toBe(1);
  const [orig] = await strokes(page);

  await page.locator('button[aria-label^="เลือกเส้น"]').click();
  await lassoAround(page, box, 0.3);
  const sel = page.locator('.vmx-lasso-box');
  await expect(sel).toBeVisible();
  await expect(page.locator('.vmx-lasso-bar')).toHaveAttribute('aria-label', 'จัดการ 1 เส้นที่เลือก');

  const b = await sel.boundingBox();
  const dragPx = Math.min(box.h * 0.25, 160);
  const pageH = await page.evaluate(() => document.querySelector('[data-page="1"]').getBoundingClientRect().height);
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + dragPx, { steps: 8 });
  await page.mouse.up();

  await expect.poll(async () => {
    const r = await firstRecord(page);
    const list = r?.strokesByPage?.['1'] || [];
    return list.length === 1 && list[0].id !== orig.id && (r.deleted || []).includes(orig.id);
  }, { message: 'the moved stroke should be stored under a new id, the old one tombstoned' }).toBe(true);
  const [moved] = await strokes(page);
  expect(moved.points[0][1] - orig.points[0][1], 'moved by the distance dragged').toBeCloseTo(dragPx / pageH, 2);
  expect(Math.abs(moved.points[0][0] - orig.points[0][0])).toBeLessThan(0.01);

  await page.locator('button[aria-label="ย้อนกลับ"]').click();
  await expect.poll(async () => {
    const list = await strokes(page);
    return list.length === 1 && Math.abs(list[0].points[0][1] - orig.points[0][1]) < 0.002;
  }, { message: 'one undo should put the stroke back where it was' }).toBe(true);
  await expect(page.locator('.vmx-lasso-box')).toHaveCount(0);
});

test('deleting from the lasso bar is undone in one step, even on an emptied page', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  await drawLine(page, box, 0.3);
  await drawLine(page, box, 0.34);
  await expect.poll(async () => (await strokes(page)).length).toBe(2);

  await page.locator('button[aria-label^="เลือกเส้น"]').click();
  await page.mouse.move(box.x + box.w * 0.1, box.y + box.h * 0.2);
  await page.mouse.down();
  for (const [x, y] of [[0.8, 0.2], [0.8, 0.45], [0.1, 0.45], [0.1, 0.21]]) {
    await page.mouse.move(box.x + box.w * x, box.y + box.h * y, { steps: 6 });
  }
  await page.mouse.up();
  await expect(page.locator('.vmx-lasso-bar')).toHaveAttribute('aria-label', 'จัดการ 2 เส้นที่เลือก');
  await page.locator('button[aria-label="ลบเส้นที่เลือก"]').click();
  await expect.poll(async () => (await strokes(page)).length, { message: 'both strokes should be deleted' }).toBe(0);

  const undo = page.locator('button[aria-label="ย้อนกลับ"]');
  await expect(undo, 'undo stays available after the page was emptied').toBeEnabled();
  await undo.click();
  await expect.poll(async () => (await strokes(page)).length, { message: 'one undo brings both back' }).toBe(2);
});

test('a notebook opens with its pages, keeps its ink when a page is added, and stays on the shelf', async ({ page }) => {
  await withProductionCsp(page);
  const blocked = [];
  page.on('console', (m) => { if (/Content Security Policy/.test(m.text())) blocked.push(m.text().slice(0, 160)); });
  await page.goto('/app/tools/pdf');
  await page.getByRole('radio', { name: 'ตาราง' }).click();
  await page.getByLabel('ชื่อสมุด').fill('สมุดทดสอบ e2e');
  await page.getByRole('button', { name: 'สร้างสมุด' }).click();
  await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-page]')).toHaveCount(4);
  await settledPage(page, 1);

  const box = await overlayBox(page);
  await drawLine(page, box, 0.3);
  await expect.poll(async () => {
    const r = (await record(page)).find((x) => String(x.docHash || '').startsWith('nb:'));
    return r?.strokesByPage?.['1']?.length || 0;
  }, { message: 'ink in the notebook should be stored under its notebook key' }).toBe(1);

  await page.locator('button[aria-label="เครื่องมืออื่น"]').click();
  await page.getByRole('menuitem', { name: 'เพิ่มหน้ากระดาษ' }).click();
  await expect(page.locator('[data-page]')).toHaveCount(5, { timeout: 30_000 });
  await expect.poll(async () => {
    const r = (await record(page)).find((x) => String(x.docHash || '').startsWith('nb:'));
    return r?.strokesByPage?.['1']?.length || 0;
  }, { message: 'adding a page keeps the ink already written' }).toBe(1);

  await page.goto('/app/tools/pdf');
  const shelved = page.locator('.vmx-nb-open', { hasText: 'สมุดทดสอบ e2e' });
  await expect(shelved).toBeVisible();
  await expect(shelved).toContainText('5 หน้า');
  expect(blocked, 'nothing the notebook does may be refused by production CSP').toEqual([]);
});

test('dragging a corner handle resizes the selection, with its line width', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  await drawLine(page, box, 0.3);
  await expect.poll(async () => (await strokes(page)).length).toBe(1);
  const [orig] = await strokes(page);

  await page.locator('button[aria-label^="เลือกเส้น"]').click();
  await lassoAround(page, box, 0.3);
  const handle = page.locator('.vmx-lasso-handle.is-br');
  await expect(handle).toBeVisible();
  const h = await handle.boundingBox();
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + h.width / 2 + box.w * 0.15, h.y + h.height / 2 + box.h * 0.05, { steps: 8 });
  await page.mouse.up();

  await expect.poll(async () => {
    const [st] = await strokes(page);
    return !!st && st.id !== orig.id && st.size > orig.size;
  }, { message: 'the resized stroke should be stored bigger, under a new id' }).toBe(true);
  const [big] = await strokes(page);
  const span = (s) => s.points[s.points.length - 1][0] - s.points[0][0];
  expect(span(big)).toBeGreaterThan(span(orig) * 1.2);
});

test('tape covers an answer until it is tapped, never reaches the ink, and is covered again next time', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  const inkPixels = () => page.evaluate(() => {
    const ov = document.querySelector('[data-page="1"] canvas:nth-of-type(2)');
    const d = ov.getContext('2d').getImageData(0, 0, ov.width, ov.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++; return n;
  });

  await page.locator('button[aria-label^="เทปปิดคำตอบ"]').click();
  await page.mouse.move(box.x + box.w * 0.2, box.y + box.h * 0.3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.w * 0.6, box.y + box.h * 0.36, { steps: 8 });
  await page.mouse.up();

  await expect.poll(async () => (await strokes(page)).filter((s) => s.mode === 'tape').length,
    { message: 'the tape should be stored as a tape stroke' }).toBe(1);
  expect(await inkPixels(), 'a tape is never painted into the ink').toBe(0);
  const tape = page.locator('.vmx-tape:not(.is-draft)');
  await expect(tape).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.vmx-tape-count')).toHaveText('0/1');

  await tape.click();
  await expect(tape).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.vmx-tape-count')).toHaveText('1/1');
  await page.locator('.vmx-tape-count').click();
  await expect(tape, 'peel-all with everything peeled covers them again').toHaveAttribute('aria-pressed', 'false');
  await page.locator('.vmx-tape-count').click();
  await expect(tape).toHaveAttribute('aria-pressed', 'true');

  // A tap is not a tape.
  await page.mouse.click(box.x + box.w * 0.5, box.y + box.h * 0.7);
  await expect.poll(async () => (await strokes(page)).filter((s) => s.mode === 'tape').length).toBe(1);

  // Reopening the same file: the tape is back, and covering again.
  await openReaderWithPdf(page);
  await expect(page.locator('.vmx-tape:not(.is-draft)')).toHaveAttribute('aria-pressed', 'false');
});

test('a typed note is stored as a stroke, painted into the ink, and edited in place with one-step undo', async ({ page }) => {
  await openReaderWithPdf(page);
  const box = await overlayBox(page);
  const inkPixels = () => page.evaluate(() => {
    const ov = document.querySelector('[data-page="1"] canvas:nth-of-type(2)');
    const d = ov.getContext('2d').getImageData(0, 0, ov.width, ov.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++; return n;
  });
  const notes = async () => (await strokes(page)).filter((s) => s.mode === 'text');

  await page.locator('button[aria-label^="ข้อความ"]').click();
  await page.mouse.click(box.x + box.w * 0.2, box.y + box.h * 0.3);
  const editor = page.locator('.vmx-textnote-editor');
  await expect(editor).toBeFocused();
  await page.keyboard.type('CPV ติดทาง fecal-oral');
  await page.keyboard.press('Control+Enter');
  await expect(editor).toHaveCount(0);
  await expect.poll(async () => (await notes()).map((s) => s.text)).toEqual(['CPV ติดทาง fecal-oral']);
  await expect.poll(inkPixels, { message: 'the note is painted into the ink' }).toBeGreaterThan(50);

  // Tapping the note opens it with its text; the edit replaces it under a new id.
  const [first] = await notes();
  await page.mouse.click(box.x + box.w * 0.22, box.y + box.h * 0.3 + 6);
  await expect(editor).toHaveValue('CPV ติดทาง fecal-oral');
  await page.keyboard.type(' (เชื้อทนมาก)');
  await page.mouse.click(box.x + box.w * 0.5, box.y + box.h * 0.8); // tap away saves
  await expect(editor).toHaveCount(0);
  await expect.poll(async () => (await notes()).map((s) => s.text)).toEqual(['CPV ติดทาง fecal-oral (เชื้อทนมาก)']);
  expect((await notes())[0].id).not.toBe(first.id);
  expect((await notes()).length, 'a tap away does not start a second note').toBe(1);

  await page.locator('button[aria-label="ย้อนกลับ"]').click();
  await expect.poll(async () => (await notes()).map((s) => s.text), { message: 'one undo brings the old text back' })
    .toEqual(['CPV ติดทาง fecal-oral']);

  // Esc on a fresh box leaves nothing behind.
  await page.mouse.click(box.x + box.w * 0.3, box.y + box.h * 0.6);
  await expect(editor).toBeFocused();
  await page.keyboard.type('ไม่เอา');
  await page.keyboard.press('Escape');
  await expect(editor).toHaveCount(0);
  expect((await notes()).length).toBe(1);
});
