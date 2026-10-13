import { test, expect } from './fixtures.js';
import { FEATURE_CATEGORIES } from '../../src/lib/feature-registry.js';

// Categories come from the registry, not from this file, so the spec fails when
// the menu drops or renames a group Palm asked for on 2026-10-11 rather than
// when someone edits a string here.
const categoryLabel = (id) => FEATURE_CATEGORIES.find((cat) => cat.id === id).label;

function groupFor(page, label) {
  return page.locator('.vmx-feature-group')
    .filter({ has: page.getByRole('heading', { level: 3, name: label, exact: true }) });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('the home menu is grouped under the categories the feedback asked for', async ({ page }) => {
  await page.goto('/');
  const menu = page.locator('.vmx-feature-menu');
  await expect(menu).toBeVisible();
  const registered = FEATURE_CATEGORIES.map((cat) => cat.label);
  // No group outside the registry.
  for (const rendered of await menu.locator('.vmx-feature-group-heading h3').allTextContents()) {
    expect(registered, `"${rendered.trim()}" is not a registered category`).toContain(rendered.trim());
  }
  // Groups that replaced the old module-ordered sections. Since the game moved
  // into the rest place (5.144.5), the social group holds only account
  // features (race, groups), so this signed-out student has none to show; the
  // unit test in nav-surfaces pins what it holds once signed in.
  for (const id of ['tune', 'focus']) {
    await expect(menu.getByRole('heading', { level: 3, name: categoryLabel(id), exact: true })).toBeVisible();
  }
  await expect(menu.getByRole('heading', { level: 3, name: categoryLabel('social'), exact: true })).toHaveCount(0);
});

test('panic mode is back in its practice group instead of vanishing from Home', async ({ page }) => {
  await page.goto('/');
  const practice = groupFor(page, categoryLabel('practice'));
  await expect(practice).toHaveCount(1);
  const panic = practice.locator('.vmx-feature-card').filter({ hasText: 'ทบทวนเร่งด่วน' });
  await expect(panic).toHaveCount(1);
  await expect(panic).toContainText('ทบทวนเร่งด่วน');
});

test('expanding a group reveals the rest of its items', async ({ page }) => {
  await page.goto('/');
  const menu = page.locator('.vmx-feature-menu');
  await expect(menu).toBeVisible();
  const group = menu.locator('.vmx-feature-group')
    .filter({ has: page.locator('.vmx-feature-more'), visible: true })
    .first();
  const more = group.locator('.vmx-feature-more');
  await expect(more).toBeVisible();
  const hidden = Number((await more.textContent()).match(/(\d+)/)[1]);
  expect(hidden).toBeGreaterThan(0);
  const shown = await group.locator('.vmx-feature-card').count();
  await expect(more).toHaveAttribute('aria-expanded', 'false');
  await more.click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await expect(group.locator('.vmx-feature-card')).toHaveCount(shown + hidden);
  await expect(more).toHaveText(/แสดงน้อยลง/);
  await more.click();
  await expect(group.locator('.vmx-feature-card')).toHaveCount(shown);
});
