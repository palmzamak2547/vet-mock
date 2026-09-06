import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
test('CT organ composites stay identifiable across isolation and quality changes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/app/atlas#specimen=canine-abdomen-pixelbeaker&part=lungs');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await expect(page.getByText('5 / 5 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await expect(page.getByText('เส้นแสดงแนวจำลอง ไม่ใช่รูปร่างกล้ามเนื้อ', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'ปิดชั้น โครงกระดูก', exact: true }).click();
  await expect(page.getByText('4 / 5 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ค้นหาโครงสร้าง', exact: true }).fill('pancreas');
  await page.getByRole('button', { name: 'เลือก Vascular, liver and pancreas (composite)', exact: true }).click();
  await page.getByRole('button', { name: 'ดูเฉพาะชิ้นนี้', exact: true }).click();
  await expect(page.getByText('1 / 5 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'คุณภาพ', exact: true }).selectOption('detail');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 30000 });
  await expect(page.getByRole('heading', { name: 'Vascular, liver and pancreas (composite)', exact: true })).toBeVisible();
  await expect(page.getByText('1 / 5 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/part=vascular-liver-pancreas/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
