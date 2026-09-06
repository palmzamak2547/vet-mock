import { test, expect } from '@playwright/test';
test.use({ serviceWorkers: 'block' });

test('direct Atlas entry avoids exam, account and Home bundles', async ({ page }) => {
  const paths = [];
  page.on('request', request => paths.push(new URL(request.url()).pathname));
  await page.goto('/app/atlas');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  expect(paths.some(path => /HomeView|vendor-supabase|data-q-/.test(path))).toBe(false);
  const offlineManifest = await (await page.request.get('/atlas-offline.json')).json();
  expect(offlineManifest.assets.some(asset => /HomeView|vendor-supabase|data-q-|data-video-summaries-(?!barrel)/.test(asset.url))).toBe(false);
  await page.getByRole('button', { name: 'เปลี่ยนเป็นโหมดมืด', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready');
});

test('public atlas entry remains useful without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/atlas/`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('สัตว์ต่างชนิด');
    await expect(page.getByRole('link', { name: /เปิดสำรวจ 3D/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'แหล่งโมเดลต้นฉบับ', exact: true }).first()).toBeVisible();
  } finally { await context.close(); }
});
