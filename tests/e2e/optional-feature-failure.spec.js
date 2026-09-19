import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    window.__documentIdentity = crypto.randomUUID();
  });
  await page.route(/\/_vercel\/(?:insights|speed-insights)\/script\.js/, route => route.fulfill({ contentType: 'application/javascript', body: '' }));
});

test('a failed search chunk closes the overlay and preserves the editable feedback draft', async ({ page }) => {
  let chunkFailed = false;
  await page.route(/\/assets\/CommandPalette-[^/]+\.js/, route => { chunkFailed = true; return route.abort(); });
  await page.goto('/app/feedback');
  const draft = page.locator('#vmx-feedback-message');
  await draft.fill('ยังเขียนไม่เสร็จ ค้นหาภายหลังได้');
  const identity = await page.evaluate(() => window.__documentIdentity);
  const search = page.getByRole('button', { name: 'ค้นหา', exact: true });
  await search.click();
  const notice = page.getByRole('dialog', { name: 'เปิดการค้นหาไม่สำเร็จ' });
  await expect(notice).toBeVisible();
  await expect(draft).toHaveValue('ยังเขียนไม่เสร็จ ค้นหาภายหลังได้');
  await notice.getByRole('button', { name: 'ปิด', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await draft.fill('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
  await expect(draft).toHaveValue('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
  // React.lazy remembers a rejected import. Trying again must remain
  // contained too, rather than remounting the entire page or reloading.
  await search.click();
  await expect(notice).toBeVisible();
  await notice.getByRole('button', { name: 'ปิด', exact: true }).click();
  await expect(draft).toHaveValue('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
  expect(chunkFailed).toBe(true);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
});

test('a failed automatic highlight helper leaves the page usable without a dialog', async ({ page }) => {
  let chunkFailed = false;
  await page.route(/\/assets\/HighlightToCard-[^/]+\.js/, route => { chunkFailed = true; return route.abort(); });
  await page.goto('/app/feedback');
  const draft = page.locator('#vmx-feedback-message');
  await expect(draft).toBeVisible();
  await expect.poll(() => chunkFailed).toBe(true);
  const identity = await page.evaluate(() => window.__documentIdentity);
  await draft.fill('เครื่องมือเสริมขัดข้องแต่หน้านี้ยังใช้ได้');
  await expect(draft).toHaveValue('เครื่องมือเสริมขัดข้องแต่หน้านี้ยังใช้ได้');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
});
