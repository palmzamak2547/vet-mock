import { test, expect } from './fixtures.js';

// Reading notes and the wiki on a phone (16 Nov 2026): the floating pill sat
// over the last line, a table wider than the screen was cut with nothing to
// say it scrolls, the notes tables and callouts fell to 13 px on a desktop,
// a source title was a 19 px line to tap, the wiki printed a source's raw file
// name, and the wiki index left out seven subjects that have notes.

test.setTimeout(120_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/(^|\/)Mochi\.jsx$/, (route) => route.fulfill({ contentType: 'application/javascript', body: 'export default function Mochi() { return null; }' }));
});

const PHONE = { width: 390, height: 664 };

test('a wide wiki table says it scrolls sideways, and scrolls', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/wiki/one-health/oh-gmo');
  const frame = page.locator('.vw-table.is-wide').first();
  await expect(frame).toBeVisible({ timeout: 30_000 });
  await expect(frame).toHaveAttribute('tabindex', '0');
  await expect(page.locator('.vmx-scroll-hint').first()).toHaveText(/เลื่อนตารางไปด้านข้าง/);
  const moved = await frame.evaluate((el) => { el.scrollLeft = 120; return el.scrollLeft; });
  expect(moved).toBeGreaterThan(0);
});

test('source titles are 44 px to tap and the source line reads as a label', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/wiki/one-health/oh-vet-role');
  const cite = page.locator('.vw-src-cite a').first();
  await expect(cite).toBeAttached({ timeout: 30_000 });
  const heights = await page.locator('.vw-src-cite a').evaluateAll((els) => els.map((a) => a.getBoundingClientRect().height));
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44);
  const lines = await page.locator('.vw-source').allTextContents();
  expect(lines.length).toBeGreaterThan(0);
  expect(lines.filter((t) => t.includes('_'))).toEqual([]);
});

test('every subject with notes is in the wiki index; a notes-only one opens the notes', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/wiki');
  const list = page.locator('.vw-notes-only');
  await expect(list).toBeVisible({ timeout: 30_000 });
  await expect(list.getByRole('button', { name: /3101206/ })).toBeVisible();
  await list.getByRole('button', { name: /3101206/ }).click();
  await expect(page.locator('.vmx-notes-grid').first()).toBeVisible({ timeout: 30_000 });
});

test('the pill never covers the last line of the notes', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/wiki/one-health/oh-gmo');
  await page.getByRole('button', { name: 'อ่านโน้ตเต็ม' }).click();
  await expect(page.locator('.vmx-notes-section-body').first()).toBeVisible({ timeout: 30_000 });
  const covered = await page.evaluate(async () => {
    const bodies = document.querySelectorAll('.vmx-notes-section-body');
    const last = bodies[bodies.length - 1];
    const range = document.createRange();
    range.selectNodeContents(last);
    const rects = [...range.getClientRects()].filter((r) => r.height > 0);
    const lastLineDocY = rects.reduce((m, r) => Math.max(m, r.bottom), 0) + window.scrollY;
    const hits = [];
    const frame = () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    // Walk the last line from the bottom of the screen up to the top.
    for (let y = lastLineDocY - window.innerHeight + 4; y < lastLineDocY; y += 24) {
      window.scrollTo(0, y);
      await frame();
      await new Promise((done) => setTimeout(done, 60));
      const pill = document.querySelector('.vmx-reading-return');
      if (!pill) continue;
      const p = pill.getBoundingClientRect();
      const lineTop = lastLineDocY - window.scrollY - 24;
      const lineBottom = lastLineDocY - window.scrollY;
      if (p.top < lineBottom && p.bottom > lineTop) hits.push(Math.round(y));
    }
    return hits;
  });
  expect(covered).toEqual([]);
});

test('notes tables and callouts are 14 px or more on a desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/wiki/one-health/oh-gmo');
  await page.getByRole('button', { name: 'อ่านโน้ตเต็ม' }).click();
  await expect(page.locator('.vmx-notes-section-body').first()).toBeVisible({ timeout: 30_000 });
  const sizes = await page.locator('.vmx-notes-section-body table, .vmx-notes-callout').evaluateAll((els) => els.map((el) => parseFloat(getComputedStyle(el).fontSize)));
  expect(sizes.length).toBeGreaterThan(0);
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(14);
});
