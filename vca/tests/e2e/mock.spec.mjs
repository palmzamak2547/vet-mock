// A mock exam: answer, flag, look over the map, submit through the sheet, read the result.
import { test, expect, answer } from './fixtures.mjs';

test('a mock opened from the menu runs at the exam pace', async ({ page }) => {
  await page.goto('/practice?mode=mock');
  await expect(page.locator('.builder-form')).toBeVisible();
  // 54 seconds a question, the paper's own pace, unless the student picks another.
  await expect(page.locator('input[name="perq"]:checked')).toHaveValue('54');
});

test('a 25-question mock exam from start to result', async ({ page, isMobile }) => {
  await page.goto('/practice?mode=mock&n=25&s=54');
  const go = page.locator('.builder-sum button.btn-ink');
  await expect(go).toBeEnabled();
  await go.click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 40_000 });
  await expect(page.locator('.run-mock .run-card [role="radio"]').first()).toBeVisible({ timeout: 40_000 });
  await expect(page.locator('.run-timer')).toBeVisible();
  await expect(page.locator('.run-count')).toContainText('25');

  await answer(page, 1, { isMobile });
  await expect(page.locator('.run-card [role="radio"][aria-checked="true"]')).toHaveCount(1);
  await expect(page.locator('.run-card .why')).toHaveCount(0); // no answers until it is submitted

  // F flags the question, G opens the map.
  await page.keyboard.press('KeyF');
  await expect(page.locator('.run-bar button[aria-pressed="true"]')).toHaveCount(1);
  await page.keyboard.press('KeyG');
  const map = page.locator('.sheet:has(.qmap)');
  await expect(map).toBeVisible();
  await expect(map.locator('.qmap-cell')).toHaveCount(25);
  await expect(map.locator('.qmap-cell.flag')).toHaveCount(1);

  // Submit from the map, then confirm.
  await map.locator('.sheet-actions button.btn-ink').click();
  const submit = page.locator('.sheet:has(.submit-tally)');
  await expect(submit).toBeVisible();
  await expect(submit.locator('.submit-tally')).toContainText('24');
  await submit.locator('.sheet-actions button.btn-ink').click();

  await expect(page).toHaveURL(/\/result\/[a-z0-9-]{4,40}$/, { timeout: 15_000 });
  await expect(page.locator('.result-hero')).toBeVisible();
  await expect(page.locator('.result-domains')).toBeVisible();
  const results = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:results:v1')));
  expect(results).toHaveLength(1);
  expect(results[0].mode).toBe('mock');
  expect(results[0].total).toBe(25);
  expect(results[0].answered).toBe(1);
  expect(results[0].flags).toHaveLength(1);
});
