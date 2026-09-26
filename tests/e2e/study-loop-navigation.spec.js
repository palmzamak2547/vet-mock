import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('checklist Notes returns to the saved list position with its checkmark and browser history intact', async ({ page }, testInfo) => {
  await page.goto('/app/reading');
  await page.getByRole('button', { name: 'อ่านแล้ว Storage of raw milk', exact: true }).click();
  await page.getByRole('button', { name: 'เปิด Notes Storage of raw milk', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  const originTop = await page.evaluate(() => history.state.vmxNotesScroll);
  expect(originTop).toBeGreaterThan(100);
  await page.locator('.vmx-back-chip').filter({ hasText: 'รายการอ่าน' }).click();
  await expect(page).toHaveURL(/\/app\/reading$/);
  await expect(page.getByRole('button', { name: 'ยกเลิก Storage of raw milk', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(originTop, -1);
  await page.screenshot({ path: testInfo.outputPath('checklist-return.png') });
  await page.goForward();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('.vmx-back-chip')).toHaveAccessibleName('รายการอ่าน');
  await page.goBack();
  await expect(page).toHaveURL(/\/app\/reading$/);
});

test('Notes retry after a failed subject download keeps the checklist return destination', async ({ page, context, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || isMobile, 'one native-module reload proof; normal returns run in all engines');
  await page.goto('/app/reading');
  await page.getByRole('button', { name: 'เปิด Notes Storage of raw milk', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  const originTop = await page.evaluate(() => history.state.vmxNotesScroll);
  // After retry reloads, the origin's view module may be cold again.
  await page.route('**/assets/ReadingChecklistView-*.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 400));
    await route.continue();
  });
  await context.setOffline(true);
  await page.getByRole('button', { name: '🩺 COM IV', exact: true }).click();
  await expect(page.getByRole('heading', { name: /เปิดโน้ต.*ไม่สำเร็จ/ })).toBeVisible();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'ลองอีกครั้ง', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('.vmx-back-chip')).toHaveAccessibleName('รายการอ่าน');
  await page.locator('.vmx-back-chip').click();
  await expect(page).toHaveURL(/\/app\/reading$/);
  await expect(page.getByRole('button', { name: 'อ่านแล้ว Storage of raw milk', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(originTop, -1);
});

test('a Notes entry keeps its selected topic after opening an unrelated Wiki result and going Back', async ({ page }) => {
  await page.goto('/app/reading');
  await page.getByRole('button', { name: 'เปิด Notes Storage of raw milk', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('[data-reading-content]')).toContainText('Storage of raw milk');
  await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  await page.getByRole('textbox', { name: 'ค้นหาใน VetMock' }).fill('Rabies');
  const result = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' }).getByRole('button', { name: /Rabies — โรคพิษสุนัขบ้า VetWiki/ });
  await result.click();
  await expect(page).toHaveURL(/\/wiki\/com5\/rabies$/);
  await page.goBack();
  await expect(page.locator('[data-reading-content]')).toContainText('Storage of raw milk');
  await expect(page.locator('.vmx-back-chip')).toHaveAccessibleName('รายการอ่าน');
});

test('a delayed view does not take focus from the search dialog', async ({ page }) => {
  let releaseView;
  const ready = new Promise(resolve => { releaseView = resolve; });
  await page.route('**/assets/DashboardView-*.js', async route => {
    await ready;
    await route.continue();
  });
  await page.goto('/app/progress', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'ค้นหาใน VetMock' });
  await expect(search).toBeFocused();
  releaseView();
  await expect(page.locator('h1')).toContainText('ความคืบหน้า');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(search).toBeFocused();
});

test('a view that finishes while search is downloading keeps the search return focus', async ({ page }) => {
  let releaseView, releaseSearch;
  const viewReady = new Promise(resolve => { releaseView = resolve; });
  const searchReady = new Promise(resolve => { releaseSearch = resolve; });
  await page.route('**/assets/HomeView-*.js', async route => { await viewReady; await route.continue(); });
  await page.route('**/assets/CommandPalette-*.js', async route => { await searchReady; await route.continue(); });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const launch = page.getByRole('button', { name: 'ค้นหา', exact: true });
  await launch.click();
  releaseView();
  await expect(page.locator('.vmx-subject-card').first()).toBeVisible();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  releaseSearch();
  await expect(page.getByRole('textbox', { name: 'ค้นหาใน VetMock' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' })).toBeHidden();
  await expect(launch).toBeFocused();
});

test('a failed Notes download retains the intended subject on browser Forward', async ({ page, context }) => {
  await page.goto('/app/reading');
  await page.getByRole('button', { name: 'เปิด Notes Storage of raw milk', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toContainText('Storage of raw milk');
  await context.setOffline(true);
  await page.getByRole('button', { name: '🩺 COM IV', exact: true }).click();
  await expect(page.getByRole('heading', { name: /เปิดโน้ต.*ไม่สำเร็จ/ })).toBeVisible();
  await context.setOffline(false);
  await page.locator('.vmx-back-chip').click();
  await expect(page).toHaveURL(/\/app\/reading$/);
  await page.goForward();
  // A browser may retry the module or keep its failed-import cache. Either
  // result must name the intended subject, never reopen the previous milk note.
  await expect(page.locator('.vmx-hero p, [role="alert"]').filter({ hasText: /COM IV/ }).first()).toBeVisible();
});

test('Wiki to full Notes returns to the original article', async ({ page }) => {
  await page.goto('/wiki/com5/rabies');
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/ })).toBeVisible();
  await page.getByRole('button', { name: 'อ่านโน้ตเต็ม', exact: true }).click();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('.vmx-back-chip')).toHaveAccessibleName('บทความเดิม');
  await page.locator('.vmx-back-chip').click();
  await expect(page).toHaveURL(/\/wiki\/com5\/rabies$/);
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/ })).toBeVisible();
});

test('Dashboard restores a valid undated backup and keeps dated charts readable', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/app/progress');
  const history = await page.evaluate(() => [
    ...Array.from({ length: 5 }, (_, index) => ({ questionId: index + 1, subject: 'equine-medicine', year: 5, correct: true, date: Date.now() })),
    { questionId: 6, subject: 'equine-medicine', year: 5, correct: false },
  ]);
  await page.locator('input[type=file][accept=".json"]').setInputFiles({
    name: 'undated-history.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ history })),
  });
  await page.getByRole('button', { name: 'นำเข้าและทับรายการนี้', exact: true }).click();
  await expect(page.getByText('นำเข้าข้อมูลเรียบร้อยแล้ว หน้านี้อัปเดตทันที', { exact: true })).toBeVisible();
  await page.getByRole('dialog').getByRole('button').last().click();
  await expect(page.locator('svg[aria-label="กราฟการฝึก 7 วันล่าสุด"]')).toContainText('5 ข้อ, 100%');
  await expect(page.locator('svg[aria-label="กราฟความแม่นยำรายวิชา"]')).toContainText('100% (5 ข้อ)');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-history')).length)).toBe(6);
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('dashboard-restored.png') });
  expect(errors).toEqual([]);
});
