import { test, expect } from '@playwright/test';
import { encodeQuizSet } from '../../src/lib/share-link.js';

test.use({ serviceWorkers: 'block' });

test('a shared VCA set loads the reviewed bank and grades the corrected egg calculation', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  const encoded = encodeQuizSet([{ subject: 'vca', id: 200340 }]);
  await page.goto(`/?qset=${encoded}`);
  await expect(page.getByRole('heading', { name: /hen-day egg production 85%/ })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('group', { name: 'ตัวเลือกคำตอบ' }).getByRole('button', { name: /^[A-E] 1615$/ }).click();
  await expect(page.getByText('✓ ถูกต้อง!', { exact: true })).toBeVisible();
  await expect(page.getByText(/1,700 × 0\.95 = 1,615/)).toBeVisible();
  await page.getByRole('button', { name: /ที่มา:/ }).click();
  await expect(page.getByText(/หน้า 9/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'เปิดเอกสารต้นฉบับ (อ้างหน้า 9)' })).toHaveAttribute('href', 'https://drive.google.com/file/d/1zcwLGGxCXE3SYkVpLYfRk3jmk6WLcqkB/view');
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});
