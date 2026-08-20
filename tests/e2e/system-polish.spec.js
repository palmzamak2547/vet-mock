import { expect, test } from '@playwright/test';

const COLD_CHUNK_TIMEOUT = 20_000;
test.setTimeout(60_000);

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '4');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    } catch {}
  });
});

test('stable destinations survive direct load, refresh and browser history', async ({ page }) => {
  await page.goto('/app/videos');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/คลิป.*ย้อนหลัง/, { timeout: COLD_CHUNK_TIMEOUT });
  await expect(page).toHaveURL(/\/app\/videos$/);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/คลิป.*ย้อนหลัง/);
  await expect(page).toHaveURL(/\/app\/videos$/);

  await page.getByRole('button', { name: /หน้าแรก/ }).first().click();
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
  await page.evaluate(() => new Promise((resolve) => {
    window.addEventListener('popstate', resolve, { once: true });
    window.history.back();
  }));
  await expect(page).toHaveURL(/\/app\/videos$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/คลิป.*ย้อนหลัง/);
});

test('unknown app destinations canonicalize safely to home', async ({ page }) => {
  try {
    await page.goto('/app/not-a-feature');
  } catch (error) {
    // Some engines report the app's immediate replaceState canonicalization as
    // an aborted/interrupted document navigation even though Home is ready.
    if (!/NS_BINDING_ABORTED|interrupted by another navigation/.test(String(error))) throw error;
  }
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('shared modal behavior traps focus, closes on Escape and restores focus', async ({ page }) => {
  await page.goto('/');
  const searchButton = page.getByRole('button', { name: 'ค้นหา', exact: true });
  await expect(searchButton).toBeVisible();
  await searchButton.click();

  const dialog = page.getByRole('dialog', { name: 'Command palette' });
  const searchInput = page.getByRole('textbox', { name: 'ค้นหาใน VetMock' });
  await expect(dialog).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  await expect(searchInput).toBeFocused({ timeout: COLD_CHUNK_TIMEOUT });

  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(searchButton).toBeFocused();
});

test('signed-out direct links keep their URL and show the auth boundary', async ({ page }) => {
  await page.goto('/app/race');
  const authBoundary = page.locator('section[aria-labelledby="vmx-auth-required-title"]');
  await expect(authBoundary.getByRole('heading', { name: /หน้านี้ใช้บัญชี VetMock/ })).toBeVisible();
  await expect(page).toHaveURL(/\/app\/race$/);
  await expect(authBoundary.getByRole('button', { name: /เข้าสู่ระบบ/ })).toBeVisible();
  await expect(authBoundary.getByRole('button', { name: /กลับหน้าแรก/ })).toBeVisible();
});

async function expectNoUnnamedFormControls(page, screen) {
  const unnamed = await page.locator('input:not([type="hidden"]), textarea, select').evaluateAll((nodes) => (
    nodes.filter((el) => {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      if (!box.width || !box.height || style.visibility === 'hidden' || style.display === 'none') return false;
      if (el.labels?.length) return false;
      if (el.getAttribute('aria-label')?.trim()) return false;
      const labelledBy = el.getAttribute('aria-labelledby');
      if (labelledBy && labelledBy.split(/\s+/).every((id) => document.getElementById(id)?.textContent?.trim())) return false;
      return true;
    }).map((el) => ({
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      placeholder: el.getAttribute('placeholder') || '',
      className: el.className || '',
    }))
  ));
  expect(unnamed, `${screen} has visible form controls without accessible names`).toEqual([]);
}

test('key public forms expose an accessible name for every visible control', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !!isMobile, 'one semantic audit is enough; behavior is covered cross-engine');

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoUnnamedFormControls(page, 'home');

  await page.goto('/app/feedback');
  await expect(page.getByRole('heading', { name: /แจ้งปัญหา/ })).toBeVisible();
  await expectNoUnnamedFormControls(page, 'feedback');

  await page.goto('/app/questions');
  await page.getByRole('button', { name: /เพิ่มข้อสอบ/ }).click();
  await expectNoUnnamedFormControls(page, 'question manager');

  await page.goto('/app/account');
  await page.locator('section[aria-labelledby="vmx-auth-required-title"]').getByRole('button', { name: /เข้าสู่ระบบ/ }).click();
  const authHeading = page.getByRole('heading', { name: /ยินดีต้อนรับ VetMock/ });
  const unavailableHeading = page.getByRole('heading', { name: /เข้าสู่ระบบไม่พร้อมใช้งานชั่วคราว/ });
  await expect(authHeading.or(unavailableHeading)).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  await expectNoUnnamedFormControls(page, await authHeading.isVisible() ? 'authentication' : 'auth unavailable state');
});

test('a failed VetWiki article chunk offers a working retry', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !!isMobile, 'one network recovery proof is enough');
  await page.addInitScript(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register = () => Promise.reject(new Error('service worker blocked for network recovery test'));
    }
  });
  let failedOnce = false;
  let blockChunk = true;
  await page.route('**/assets/*.js', async (route) => {
    if (blockChunk && /\/(?:subject-)?com5\.generated-/.test(route.request().url())) {
      failedOnce = true;
      await route.abort('failed');
      return;
    }
    await route.continue();
  });

  await page.goto('/wiki/com5/rabies');
  await expect(page.getByText('โหลดบทความไม่สำเร็จ', { exact: true })).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  blockChunk = false;
  await page.getByRole('button', { name: 'ลองอีกครั้ง' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/ })).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  expect(failedOnce).toBe(true);
});

test('an offline Notes chunk retries without losing the selected subject', async ({ page, context, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !!isMobile, 'one native-module recovery proof is enough');
  await page.addInitScript(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register = () => Promise.reject(new Error('service worker blocked for Notes recovery test'));
    }
  });

  await page.goto('/');
  await page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first().click();
  const rabies = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
  await expect(rabies).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  await rabies.getByRole('button', { name: 'สรุป', exact: true }).click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });

  await context.setOffline(true);
  await page.getByRole('button', { name: '🩺 COM IV', exact: true }).click();
  await expect(page.getByText(/การเชื่อมต่อสะดุด.*COM IV.*ข้อมูลเดิมยังอยู่ครบ/)).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });

  await context.setOffline(false);
  await page.getByRole('button', { name: 'ลองอีกครั้ง', exact: true }).click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible({ timeout: COLD_CHUNK_TIMEOUT });
  await expect(page.getByText(/🩺 COM IV · เนื้อหาจากสไลด์เลกเชอร์/)).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('vmx-notes-retry-target'))).toBeNull();
});
