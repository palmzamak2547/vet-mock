import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
test('whole-body default opens and keeps source organs through layer and quality changes', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/app/atlas');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 45000 });
  await expect(page.getByRole('heading', { name: 'Visible dog · whole-body anatomy', exact: true })).toBeVisible();
  await expect(page.getByText('32 / 32 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  const systems = page.getByRole('button', { name: /ชั้นโครงสร้าง · 12 ระบบ/ });
  await expect(systems).toHaveAttribute('aria-expanded', 'false');
  await systems.click();
  for (const [name, count] of [['ผิวหนัง', 31], ['กล้ามเนื้อ', 30], ['โครงกระดูก', 29]]) {
    await page.getByRole('button', { name: `ปิดชั้น ${name}`, exact: true }).click();
    await expect(page.getByText(`${count} / 32 ชิ้นที่แสดง`, { exact: true })).toBeVisible();
  }
  await systems.click();
  await page.getByRole('searchbox', { name: 'ค้นหาโครงสร้าง', exact: true }).fill('Right kidney');
  await page.getByRole('button', { name: 'เลือก Right kidney', exact: true }).click();
  await page.getByRole('button', { name: 'ดูเฉพาะชิ้นนี้', exact: true }).click();
  await expect(page.getByText('1 / 32 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'คุณภาพ', exact: true }).selectOption('detail');
  await expect(page.locator('[data-atlas-state]')).toHaveAttribute('data-atlas-state', 'ready', { timeout: 45000 });
  await expect(page.getByText('1 / 32 ชิ้นที่แสดง', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/specimen=canine-visible-ajou&part=right-kidney/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
