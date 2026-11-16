import { test, expect } from './fixtures.js';

// "ปรับแต่งการ์ด" (src/views/StudioView.jsx): opened from the card on the
// profile hub; every pick shows on the card at once and is kept when the
// student leaves and comes back; "คืนค่าเริ่มต้น" puts the card back; the
// share image is drawn from the same card.
test.setTimeout(90_000);
test.use({ reducedMotion: 'reduce', serviceWorkers: 'block' });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
  });
});

async function openHub(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const row = page.getByRole('button', { name: 'โปรไฟล์', exact: true });
  await expect(row.first()).toBeVisible({ timeout: 30_000 });
  await row.first().click();
  await expect(page.locator('.vmx-hero h1')).toContainText('โปรไฟล์');
}

async function openStudio(page) {
  await openHub(page);
  const tile = page.getByTestId('hub-card');
  await expect(tile.getByRole('figure', { name: /การ์ดของ/ })).toBeVisible();
  await tile.getByRole('button', { name: 'ปรับแต่งการ์ด' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'ปรับแต่งการ์ด' })).toBeVisible({ timeout: 30_000 });
}

test('the hub card opens the studio, a pick shows at once and is still there after leaving', async ({ page }) => {
  await openStudio(page);
  const card = page.locator('.vmx-studio__stage .vmx-scard');
  await expect(card).toHaveAttribute('data-backdrop', 'paw-trail');
  await page.getByRole('radiogroup', { name: 'พื้นหลัง' }).getByRole('radio', { name: 'กล้องจุลทรรศน์' }).click();
  await expect(card).toHaveAttribute('data-backdrop', 'microscope');
  await expect(card.locator('img.vmx-scard__bd')).toHaveAttribute('src', /microscope/);
  await expect(page.getByRole('status').filter({ hasText: 'การ์ดเก็บไว้ในเครื่องนี้' })).toBeVisible();

  // Leave, come back: the hub shows the same card, and so does the studio.
  await page.getByRole('button', { name: 'โปรไฟล์' }).first().click();
  await expect(page.getByTestId('hub-card').locator('.vmx-scard')).toHaveAttribute('data-backdrop', 'microscope');
  await page.getByTestId('hub-card').getByRole('button', { name: 'ปรับแต่งการ์ด' }).click();
  await expect(card).toHaveAttribute('data-backdrop', 'microscope');

  // A frame not yet earned says how to earn it and changes nothing.
  const gilt = page.getByRole('radiogroup', { name: 'กรอบ' }).getByRole('radio', { name: /ขอบทอง/ });
  await expect(gilt).toContainText('ได้เมื่อมีถ้วย');
  await expect(gilt).toHaveAttribute('aria-disabled', 'true');
  // force: a locked frame is aria-disabled, which Playwright will not click; a finger still can.
  await gilt.click({ force: true });
  await expect(card).toHaveAttribute('data-frame', 'plain');

  // Reset says what it resets and puts the first card back.
  const reset = page.getByRole('button', { name: 'คืนค่าเริ่มต้น' });
  await reset.click();
  await expect(card).toHaveAttribute('data-backdrop', 'paw-trail');
  await expect(reset).toBeDisabled();
});

test('the share image is drawn from the card the student styled', async ({ page }) => {
  await openStudio(page);
  await page.getByRole('radiogroup', { name: 'พื้นหลัง' }).getByRole('radio', { name: 'ทุ่งหญ้า' }).click();
  await page.getByRole('button', { name: 'แชร์การ์ด' }).click();
  const sheet = page.getByRole('dialog', { name: 'แชร์การ์ด' });
  const image = sheet.getByRole('img', { name: /การ์ดของ/ });
  await expect(image).toBeVisible({ timeout: 30_000 });
  await expect(image).toHaveAttribute('src', /^(blob:|data:image\/png)/);
  const size = await image.evaluate(async (img) => { await img.decode(); return [img.naturalWidth, img.naturalHeight]; });
  expect(size).toEqual([1080, 1920]);
  await sheet.getByRole('button', { name: 'ปิด' }).click();
  await expect(sheet).toHaveCount(0);
});

test('on a phone the card stays in view while the controls scroll, and nothing hides under the tab bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await openStudio(page);
  const reset = page.getByRole('button', { name: 'คืนค่าเริ่มต้น' });
  await reset.scrollIntoViewIfNeeded();
  const stage = await page.locator('.vmx-studio__stage').boundingBox();
  expect(stage.y).toBeGreaterThanOrEqual(-1);
  expect(stage.y).toBeLessThan(80);
  const button = await reset.boundingBox();
  const bar = await page.locator('.vmx-bottom-nav').boundingBox().catch(() => null);
  if (bar) expect(button.y + button.height).toBeLessThanOrEqual(bar.y + 1);
  expect(button.height).toBeGreaterThanOrEqual(44);
});
