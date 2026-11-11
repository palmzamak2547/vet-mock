import { test, expect } from './fixtures.js';

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

test('a failed search chunk says so in the search box, keeps the page draft, and retries', async ({ page, browserName }) => {
  let failing = true;
  let chunkFailed = false;
  await page.route(//assets/CommandPalette-[^/]+.js/, route => {
    if (!failing) return route.continue();
    chunkFailed = true;
    return route.abort();
  });
  await page.goto('/app/feedback');
  // Typed after the navigation's focus hand-off to <main>, as a student can
  // (update-and-intent.spec.js explains it). Typed before it, WebKit moved
  // focus to <main> between fill's focus and its typing (3 of 20 runs).
  await expect(page.locator('#main')).toBeFocused();
  const draft = page.locator('#vmx-feedback-message');
  await draft.fill('ยังเขียนไม่เสร็จ ค้นหาภายหลังได้');
  const identity = await page.evaluate(() => window.__documentIdentity);
  const search = page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first();
  await search.click();
  // The frame stays, says the search did not open, and offers a retry.
  const frame = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await expect(frame).toHaveAttribute('data-palette-frame', 'failed');
  await expect(frame.getByRole('alert')).toContainText('เปิดการค้นหาไม่สำเร็จ');
  await expect(draft).toHaveValue('ยังเขียนไม่เสร็จ ค้นหาภายหลังได้');
  await frame.getByRole('button', { name: 'ปิด', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await draft.fill('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
  await expect(draft).toHaveValue('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
  // React.lazy remembers a rejected import. Opening again stays contained,
  // rather than remounting the entire page or reloading.
  await search.click();
  await expect(frame).toHaveAttribute('data-palette-frame', 'failed');
  const box = frame.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  await box.fill('schedule');
  expect(chunkFailed).toBe(true);
  // WebKit's failed import names no URL, so a fresh one cannot be asked for
  // (chunk-error.js importFresh); a production build there refetches nothing.
  if (browserName !== 'webkit') {
    failing = false;
    await frame.getByRole('button', { name: 'ลองอีกครั้ง', exact: true }).click();
    await expect(frame).not.toHaveAttribute('data-palette-frame', /./);
    await expect(box).toHaveValue('schedule');
    await expect(frame.locator('[data-flat-idx="0"]')).toContainText('ตารางเรียน');
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(draft).toHaveValue('แก้ข้อความต่อได้หลังปิดข้อความแจ้ง');
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

test('a failed loading animation still lets the requested page finish loading', async ({ page }) => {
  let finishView;
  const viewReady = new Promise(resolve => { finishView = resolve; });
  let loaderFailed = false;
  await page.route(/\/assets\/FeedbackView-[^/]+\.js/, async route => {
    await viewReady;
    await route.continue();
  });
  await page.route(/\/assets\/MotionLoader-[^/]+\.js/, route => {
    loaderFailed = true;
    return route.abort();
  });
  try {
    await page.goto('/app/feedback', { waitUntil: 'domcontentloaded' });
    const identity = await page.evaluate(() => window.__documentIdentity);
    await expect.poll(() => loaderFailed).toBe(true);
    await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('status').filter({ hasText: 'กำลังโหลด…' })).toBeVisible();
    finishView();
    const draft = page.locator('#vmx-feedback-message');
    await draft.fill('โหลดภาพประกอบไม่ได้ แต่ยังเขียนข้อความได้');
    await expect(draft).toHaveValue('โหลดภาพประกอบไม่ได้ แต่ยังเขียนข้อความได้');
    expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
  } finally {
    finishView();
  }
});
