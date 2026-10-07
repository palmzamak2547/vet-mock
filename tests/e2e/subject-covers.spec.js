import { test, expect } from './fixtures.js';
import { SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';

test('subject covers keep their layout and keyboard destination when artwork fails', async ({ page, context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-final'));
  });
  let failedRequests = 0;
  await page.route('**/subject-art/epidemiology.webp', route => {
    failedRequests += 1;
    return route.abort();
  });
  await page.goto('/app/study');
  const aggregate = page.locator('[data-subject="all"]');
  await expect(aggregate).toBeVisible();
  await expect.poll(() => aggregate.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);

  const subject = SUBJECTS_BY_YEAR[5].find(item => item.id === 'epidemiology');
  const card = page.locator('[data-subject="epidemiology"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeEnabled();
  await expect(card).toContainText(subject.name);
  await expect.poll(() => failedRequests).toBeGreaterThan(0);
  await expect(card.locator('img')).toHaveCSS('visibility', 'hidden');
  const layout = await card.evaluate(element => ({
    artBottom: element.querySelector('.vmx-subject-cover').getBoundingClientRect().bottom,
    titleTop: element.querySelector('.title').getBoundingClientRect().top,
    right: element.getBoundingClientRect().right,
    viewport: document.documentElement.clientWidth,
  }));
  expect(layout.artBottom).toBeLessThanOrEqual(layout.titleTop);
  expect(layout.right).toBeLessThanOrEqual(layout.viewport);
  await card.press('Enter');
  await expect(page.locator('.vmx-topic-card').first()).toBeVisible();
});
