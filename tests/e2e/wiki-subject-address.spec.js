import { test, expect } from './fixtures.js';

// /wiki/<subject> opened the plain /wiki index and dropped the subject
// (screens hunt, 11 Nov 2026). It now opens the index at that subject and keeps
// its address; an unknown subject still falls back to the index.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/(^|\/)Mochi\.jsx$/, route => route.fulfill({ contentType: 'application/javascript', body: 'export default function Mochi() { return null; }' }));
});

test('a subject address opens the wiki index at that subject and keeps the address', async ({ page }) => {
  await page.goto('/wiki/com5');
  const section = page.locator('#wiki-subject-com5');
  await expect(section).toBeVisible();
  await expect(section).toBeInViewport();
  await expect(page).toHaveURL(/\/wiki\/com5$/);
});

test('an unknown subject falls back to the plain index', async ({ page }) => {
  await page.goto('/wiki/no-such-subject');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('VetWiki');
  await expect(page).toHaveURL(/\/wiki$/);
});
