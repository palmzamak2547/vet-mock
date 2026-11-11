import { test, expect } from './fixtures.js';
import { encodeQuizSet } from '../../src/lib/share-link.js';

test.use({ serviceWorkers: 'block' });

test('a shared VCA set loads the reviewed bank and grades the corrected egg calculation', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  const encoded = encodeQuizSet([{ subject: 'vca', id: 200340 }]);
  await page.goto(`/?qset=${encoded}`);
  await expect(page.getByRole('heading', { name: /hen-day egg production 85%/ })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('group', { name: 'ตัวเลือกคำตอบ' }).getByRole('button', { name: /^[A-E] 1615$/ }).click();
  // "คุณตอบถูก", not "ถูกต้อง". On a true/false question the old
  // wording read as a verdict on the statement, and sat right above an
  // explanation that opened with "ไม่ถูกต้อง" about that same statement.
  await expect(page.getByText('✓ คุณตอบถูก', { exact: true })).toBeVisible();
  await expect(page.getByText(/1,700 × 0\.95 = 1,615/)).toBeVisible();
  await page.getByRole('button', { name: /ที่มา:/ }).click();
  await expect(page.getByText(/หน้า 9/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'เปิดเอกสารต้นฉบับ (อ้างหน้า 9 ข้อ 2)' })).toHaveAttribute('href', '/api/library-file?source=1zcwLGGxCXE3SYkVpLYfRk3jmk6WLcqkB&open=1');
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});

test('the source panel lists the references the key was checked against, after the answer, at 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.goto(`/?qset=${encodeQuizSet([{ subject: 'vca', id: 200253 }])}`);
  await expect(page.getByRole('heading', { name: /immune-mediated hemolytic anemia/ })).toBeVisible({ timeout: 20_000 });
  // Before the answer the panel does not open, so no reference is on the page.
  await expect(page.getByRole('link', { name: 'Cornell eClinpath: RBC shape changes' })).toHaveCount(0);
  await page.getByRole('group', { name: 'ตัวเลือกคำตอบ' }).getByRole('button', { name: /^[A-E] Spherocyte$/ }).click();
  await page.getByRole('button', { name: /ที่มา:/ }).click();
  const ref = page.getByRole('link', { name: 'Cornell eClinpath: RBC shape changes' });
  await expect(ref).toHaveAttribute('href', 'https://eclinpath.com/hematology/morphologic-features/red-blood-cells/poikilocytosis/');
  await expect(ref).toHaveAttribute('target', '_blank');
  await expect(ref).toHaveAttribute('rel', 'noopener noreferrer nofollow');
  await expect(page.getByText('Spherocytes', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /อ้างหน้า 4 ข้อ 4\)$/ })).toBeVisible();
  const width = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});
