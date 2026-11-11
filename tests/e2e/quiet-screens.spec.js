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

test('a disagreement with the lecture is marked once, at its section, and nowhere else', async ({ page }) => {
  // The list view, where every topic row used to carry a tag and the bar a filter.
  await page.addInitScript(() => localStorage.setItem('vmx-wiki-layout', 'list'));
  await page.goto('/wiki');
  await expect(page.locator('.vw-topic').first()).toBeVisible();
  await expect(page.locator('.vw-conflict-chip')).toHaveCount(0);
  await expect(page.locator('.vw-filter')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'ดูหัวข้อที่มีจุดเหล่านี้' })).toHaveCount(0);
  // Rabies holds a recorded point (corrections.js): its section shows it.
  await page.goto('/wiki/com5/rabies');
  await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible();
  await expect(page.locator('.vw-section .vmx-conflict').first()).toBeVisible();
  await expect(page.locator('.vw-section .vmx-conflict').first()).toContainText('ที่สอนในคาบ');
  await expect(page.locator('.vw-flag')).toHaveCount(0);
  await expect(page.locator('.vw-legend')).toHaveCount(0);
  await expect(page.locator('.vw-strip-cell.is-conflict')).toHaveCount(0);
});
