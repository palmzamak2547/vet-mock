import { expect, test } from '@playwright/test';

// The study library is a connected feature: without VITE_SUPABASE_* the catalog
// cannot load, and CI deliberately builds without those. So this spec guards
// what is true in every environment — the route resolves, the lazy chunk loads,
// the view renders its own heading and controls, and nothing throws.
//
// Grouping, filtering and ปีการศึกษา rendering are covered by
// tests/unit/library.test.mjs, which needs no browser and no credentials.

// vite preview answers /_vercel/insights/script.js and
// /_vercel/speed-insights/script.js with its HTML 404 page, and the browser
// parsing that HTML as JS throws "Unexpected token '<'". Whether those two
// injected scripts fail before or after the assertion is a race, which is how
// this spec passed a full PR run and then failed the identical tree on main.
//
// Stub them with valid empty JS instead of filtering the error message: a
// pageerror carries no URL, so a message filter broad enough to catch this
// noise would also swallow a first-party chunk being served the SPA fallback —
// the exact failure the assertion below exists to catch. The real Vercel CDN
// serves the correct scripts in production; only the preview server needs this.
async function stubVercelAnalytics(page) {
  await page.route(
    /(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/,
    (route) => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
}

test.describe('Study library', () => {
  // The PWA service worker must stay out of this spec. Once it controls the
  // page it re-fetches same-origin requests from the worker context, which
  // Playwright's page.route cannot intercept — so the stubs above and below
  // silently stop applying, and under vite preview the SW-mediated analytics
  // requests come back 200 text/html and throw the very SyntaxErrors the
  // strict assertion then reports. Reproduced deterministically by priming a
  // page until navigator.serviceWorker.controller was set: both scripts
  // answered text/html and threw. That is also why this spec passed a full PR
  // run and failed the identical tree on main — whether the SW claims in time
  // is a machine-speed race. The SW has its own coverage; this spec's subject
  // is the library view.
  test.use({ serviceWorkers: 'block' });

  test('Home exposes reading entry points before expanding the feature menu', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('vmx-selected-year', '5');
      localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
      localStorage.setItem('vmx-seen-landing', '1');
      localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    });
    await stubVercelAnalytics(page);
    await page.goto('/');
    const menu = page.locator('.vmx-feature-menu');
    await expect(menu.getByRole('button', { name: /^สรุปบทเรียน / })).toBeVisible({ timeout: 20_000 });
    await menu.getByRole('button', { name: /^คลังเอกสาร / }).click();
    await expect(page).toHaveURL(/\/app\/library$/);
    await expect(page.getByRole('button', { name: 'เปิด PDF ของฉัน', exact: true })).toBeVisible();
  });

  test('the personal reader and shelf connect without losing the shelf search', async ({ page }) => {
    await stubVercelAnalytics(page);
    await page.goto('/app/tools/pdf');
    await page.getByRole('button', { name: 'เปิดคลังเอกสาร', exact: true }).click();
    const search = page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' });
    await search.fill('VCA Pharmacology');
    await expect(page).toHaveURL(/q=VCA\+Pharmacology/);
    await page.getByRole('button', { name: 'เปิด PDF ของฉัน', exact: true }).click();
    await expect(page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'กลับคลังเอกสาร', exact: true }).click();
    await expect(search).toHaveValue('VCA Pharmacology');
    await expect(page).toHaveURL(/\/app\/library\?q=VCA\+Pharmacology$/);
  });

  test('a shelf document does not reopen when switching to a personal PDF', async ({ page }) => {
    await stubVercelAnalytics(page);
    const pdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
      + '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n'
      + '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n'
      + 'trailer<</Root 1 0 R>>\n', 'latin1');
    let documentRequests = 0;
    await page.route('**/api/library-file?slug=*', (route) => route.fulfill({ json: { url: '/__reading-fixture.pdf' } }));
    await page.route('**/__reading-fixture.pdf', (route) => {
      documentRequests++;
      return route.fulfill({ body: pdf, contentType: 'application/pdf' });
    });
    await page.goto('/app/library?q=VCA%20Pharmacology');
    const card = page.locator('.vmx-lib-card').filter({ has: page.getByRole('heading', { name: 'Pharmacology & Toxicology (VCA58-68)', exact: true }) });
    await card.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click();
    await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'กลับคลังเอกสาร', exact: true })).toBeVisible();

    // Browser Back retains the old reader payload in App until the next open.
    await page.goBack();
    await expect(page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' })).toHaveValue('VCA Pharmacology');
    await page.getByRole('button', { name: 'เปิด PDF ของฉัน', exact: true }).click();
    const chooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true }).click();
    await (await chooserPromise).setFiles({ name: 'my-own-notes.pdf', mimeType: 'application/pdf', buffer: pdf });
    await expect(page.locator('[data-page="1"][data-render-state="ready"]')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('my-own-notes.pdf', { exact: true }).first()).toBeVisible();
    expect(documentRequests).toBe(1);
  });

  test('the file picker is keyboard accessible and errors stay readable on a narrow dark screen', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('vmx-theme', JSON.stringify('dark')));
    await stubVercelAnalytics(page);
    await page.goto('/app/tools/pdf');
    const pick = page.getByRole('button', { name: 'เลือกไฟล์ PDF', exact: true });
    await expect(pick).toBeVisible({ timeout: 20_000 });
    await pick.focus();
    await expect(pick).toBeFocused();
    const chooserPromise = page.waitForEvent('filechooser');
    await pick.press('Enter');
    await (await chooserPromise).setFiles({ name: 'wrong.txt', mimeType: 'text/plain', buffer: Buffer.from('not a PDF') });
    await expect(page.getByRole('alert')).toContainText('ไฟล์ต้องเป็น PDF เท่านั้น');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    const box = await pick.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    await expect(page.getByRole('button', { name: 'เปิดคลังเอกสาร', exact: true })).toBeVisible();
  });

  test('/app/library renders a reload-safe route without page errors', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await stubVercelAnalytics(page);

    // Stub the optional catalog read the same way the imaging case list is
    // stubbed, so a network wobble cannot masquerade as a render regression.
    await page.route(/\/rest\/v1\/library_docs(?:\?|$)/, async (route) => {
      const corsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, OPTIONS',
        'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info',
      };
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: corsHeaders });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', headers: corsHeaders, body: '[]' });
    });

    await page.goto('/app/library');

    await expect(page.getByRole('heading', { level: 1, name: 'คลังเอกสารการเรียน' }))
      .toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' })).toBeVisible();

    // Original VCA sources are available even without a connected catalog.
    // Searching for a missing title must still reach an honest empty state.
    await page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' }).fill('no-such-vca-document-314159');
    await expect(page.locator('.vmx-empty-state')).toBeVisible({ timeout: 15_000 });

    expect(pageErrors).toEqual([]);
  });

  test('VCA sources open owned copies when Google Drive is unavailable', async ({ page }) => {
    await stubVercelAnalytics(page);
    await page.context().route(/https:\/\/(drive|docs)\.google\.com\//, (route) => route.abort());
    await page.route('**/api/library-file?slug=*', (route) => route.fulfill({ json: { url: '/__archive-test.pdf' } }));
    await page.context().route('**/__archive-test.pdf', (route) => route.fulfill({ body: '<p>Owned archive copy</p>', contentType: 'text/html' }));
    await page.goto('/app/library?q=VCA%20Pharmacology');
    const card = page.locator('.vmx-lib-card').filter({ has: page.getByRole('heading', { name: 'Pharmacology & Toxicology (VCA58-68)', exact: true }) });
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByRole('button', { name: 'เปิดอ่าน', exact: true })).toBeVisible();
    await card.getByText(/ไฟล์ที่เกี่ยวข้อง/).click();
    await expect(card.getByRole('button', { name: 'เปิด DOCX จากคลัง', exact: true })).toBeVisible();
    await expect(card.getByRole('link', { name: 'ที่มาใน Google Drive' }).last()).toHaveAttribute('href', 'https://docs.google.com/document/d/1UgefaMtbTexqQ1s-a2npPj2EMgcbQUpf/edit');
    const popupPromise = page.waitForEvent('popup');
    await card.getByRole('button', { name: 'เปิดไฟล์ต้นฉบับ' }).click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(/\/__archive-test\.pdf$/);
    await expect(popup.getByText('Owned archive copy')).toBeVisible();
    await popup.close();
  });

  test('the library keeps a visible way back out', async ({ page }) => {
    await stubVercelAnalytics(page);
    await page.goto('/app/library');
    await expect(page.getByRole('heading', { level: 1, name: 'คลังเอกสารการเรียน' }))
      .toBeVisible({ timeout: 15_000 });

    // BackBar is the only way out of a sub-view on mobile, so it must exist.
    await expect(page.getByRole('button', { name: 'กลับหน้าแรก' }).first()).toBeVisible();
  });
});
