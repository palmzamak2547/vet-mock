import { test, expect } from './fixtures.js';

// Quiet screens (AGENTS.md "Quiet screens"): what a student did not come for
// is either gone or folded into one row. One test per removed or folded
// thing, each failing on the build before 5.214.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('the wiki index opens on its search, with no lede and no library counts', async ({ page }) => {
  await page.goto('/wiki');
  await expect(page.locator('#vw-search')).toBeVisible();
  await expect(page.locator('.vw-tagline')).toBeVisible();
  await expect(page.locator('.vw-lede')).toHaveCount(0);
  await expect(page.locator('.vw-totals')).toHaveCount(0);
});
