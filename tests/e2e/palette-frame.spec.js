import { test, expect } from './fixtures.js';

// The search palette is a lazy chunk; on a cold phone it arrived 4 to 9 s after
// the tap with nothing on screen, and keys typed meanwhile went nowhere. The
// frame (PaletteFrame.jsx) is in the entry chunk: the box is on screen and
// focused at once, what is typed is kept, and the palette takes it over.

const CHUNK = /\/assets\/CommandPalette-[^/]+\.js/;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/\/_vercel\/(?:insights|speed-insights)\/script\.js/, route => route.fulfill({ contentType: 'application/javascript', body: '' }));
});

test('a slow search chunk shows the box at once and keeps what is typed', async ({ page }) => {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let asked = 0;
  await page.route(CHUNK, async route => {
    asked += 1;
    // Three seconds, or until the test has typed: whichever is later.
    await Promise.all([held, new Promise(r => setTimeout(r, 3000))]);
    await route.continue();
  });
  await page.goto('/app/about');
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  const box = dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  // The frame, long before the chunk is let through.
  await expect(dialog).toHaveAttribute('data-palette-frame', 'pending', { timeout: 1500 });
  await expect(box).toBeFocused();
  await expect(dialog.getByRole('status')).toContainText('กำลังเปิดการค้นหา');
  await page.keyboard.type('schedu');
  await expect(box).toHaveValue('schedu');
  expect(asked).toBe(1);
  release();
  // The palette takes over with the same text, focused, and searches it.
  await expect(dialog).not.toHaveAttribute('data-palette-frame', /./, { timeout: 15_000 });
  await expect(box).toHaveValue('schedu');
  await expect(box).toBeFocused();
  await page.keyboard.type('le');
  await expect(box).toHaveValue('schedule');
  await expect(dialog.locator('[data-flat-idx="0"]')).toContainText('ตารางเรียน');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('Escape closes the frame, and the next open starts empty', async ({ page }) => {
  let release;
  const held = new Promise(resolve => { release = resolve; });
  await page.route(CHUNK, async route => { await held; await route.continue(); });
  await page.goto('/app/about');
  await expect(page.locator('#main')).toBeFocused();
  const launch = page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first();
  await launch.click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  const box = dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  await expect(box).toBeFocused();
  await page.keyboard.type('ketamine');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  release();
  await launch.click();
  await expect(box).toBeFocused();
  await expect(box).toHaveValue('');
});
