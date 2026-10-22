// The front door: the countdown, the one-tap start, and a page that fits the screen.
import { test, expect, overflow, answer } from './fixtures.mjs';

test('home shows the countdown to the next round and fits the screen', async ({ page }) => {
  await page.goto('/');
  const countdown = page.locator('main a.countdown');
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
  await page.locator('main a.countdown').click();
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

// The footer closes on the same countdown and a way in, beside the VCA letters.
test('the footer offers the countdown and a start', async ({ page }) => {
  await page.goto('/');
  const go = page.locator('footer .foot-go');
  await expect(go.locator('a.countdown')).toHaveAttribute('href', '/exam');
  await go.getByRole('link', { name: 'เริ่มฝึก' }).click();
  await expect(page).toHaveURL(/\/practice/);
});

// Pressing start swaps the words for "กำลังเตรียม" in place: the button keeps its size, so the
// row beside and below it holds still (it used to move up 66 px on a phone).
test('the start button keeps its size while the set is prepared', async ({ page }) => {
  let release;
  const held = new Promise((r) => { release = r; });
  await page.route('**/bank/**', async (route) => { await held; await route.continue(); });
  await page.goto('/');
  const start = page.locator('.hero .ctas button.btn-ink');
  const mock = page.locator('.hero .ctas a.btn-glass');
  await expect(start).toBeVisible();
  const before = { start: await start.boundingBox(), mock: await mock.boundingBox() };
  await start.click();
  await expect(start).toBeDisabled();
  await expect(start).toHaveAccessibleName(/กำลังเตรียม/);
  const during = { start: await start.boundingBox(), mock: await mock.boundingBox() };
  expect(during.start.width).toBeCloseTo(before.start.width, 0);
  expect(during.mock.y).toBeCloseTo(before.mock.y, 0);
  release();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
});
