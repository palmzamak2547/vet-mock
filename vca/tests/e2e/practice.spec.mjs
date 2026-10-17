// Practice: keys reveal and advance, a set built for one domain runs to its result.
import { test, expect, overflow, answer } from './fixtures.mjs';

const start = async (page, query) => {
  await page.goto(`/practice?${query}`);
  const go = page.locator('.builder-sum button.btn-ink');
  await expect(go).toBeEnabled();
  await go.click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
};

test('1 picks an option and shows the verdict; Enter goes on', async ({ page }) => {
  await start(page, 'd=swine&n=10');
  await expect(page.locator('.run-count b')).toHaveText('1');
  await page.keyboard.press('Digit1');
  await expect(page.locator('.run-card .why .verdict')).toBeVisible();
  await expect(page.locator('.run-card [role="radio"][aria-checked="true"]')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page.locator('.run-count b')).toHaveText('2');
  await expect(page.locator('.run-card .why')).toHaveCount(0);
});

test('a ten-question swine set runs to its result', async ({ page, isMobile }) => {
  await start(page, 'd=swine&n=10');
  expect(await overflow(page)).toBe(0);
  for (let i = 1; i <= 10; i += 1) {
    await expect(page.locator('.run-count b')).toHaveText(String(i));
    await answer(page, i % 2, { isMobile });
    await expect(page.locator('.run-card .why .verdict')).toBeVisible();
    await page.locator('.run-actions button.btn-ink').click();
  }
  await expect(page).toHaveURL(/\/result\/[a-z0-9-]{4,40}$/, { timeout: 15_000 });
  await expect(page.locator('.result-hero')).toBeVisible();
  await expect(page.locator('.rv-list .rv')).toHaveCount(10);
  // Every answer was kept on this device.
  const seen = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('vca:progress:v1')).q).length);
  expect(seen).toBe(10);
  expect(await overflow(page)).toBe(0);
});

test('the builder keeps its choices in the address', async ({ page }) => {
  await page.goto('/practice?d=swine,equine&n=20');
  await expect(page.locator('.builder-form')).toBeVisible();
  await expect(page.locator('.builder-form button.chip[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('.builder-sum .sum-n')).toContainText('20');
  expect(await overflow(page)).toBe(0);
});
