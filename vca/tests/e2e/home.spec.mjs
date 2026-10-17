// The front door: the countdown, the one-tap start, and a page that fits the screen.
import { test, expect, overflow, answer } from './fixtures.mjs';

test('home shows the countdown to the next round and fits the screen', async ({ page }) => {
  await page.goto('/');
  const countdown = page.locator('a.countdown');
  await expect(countdown).toBeVisible();
  await expect(countdown).toHaveAttribute('href', '/exam');
  await expect(countdown).toContainText('98');
  await expect(page.locator('h1')).toBeVisible();
  // The whole page, wall to footer, after every section has come into view.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('footer')).toBeVisible();
  expect(await overflow(page)).toBe(0);
});

test('the countdown opens the exam page', async ({ page }) => {
  await page.goto('/');
  await page.locator('a.countdown').click();
  await expect(page).toHaveURL(/\/exam$/);
  await expect(page.locator('.ticket')).toHaveCount(2);
});

test('the primary button starts ten questions at once', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.locator('.hero .ctas button.btn-ink').click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.run-count')).toContainText('10');
  await answer(page, 0, { isMobile });
  await expect(page.locator('.run-card .why .verdict')).toBeVisible();
});

test('a theme toggle switches the page and remembers it', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  expect(['light', 'dark']).toContain(before);
  await page.locator('.theme-btn').first().click();
  const after = before === 'dark' ? 'light' : 'dark';
  await expect(html).toHaveAttribute('data-theme', after);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:prefs') || 'null'));
  expect(saved?.theme).toBe(after);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', after);
});

test('an unknown address shows the not-found page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.locator('.empty-page')).toBeVisible();
  await expect(page.locator('.empty-page h1')).toBeVisible();
  await expect(page.locator('.empty-page a[href="/"]')).toBeVisible();
});
