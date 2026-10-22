import { test, expect } from './fixtures.js';

// On a 360 px phone the notes reader was 405 px wide: the grid's single track
// was `1fr` (minmax(auto, 1fr)), so a wide table set the column width and
// .vmx-app's overflow-x: clip cut every line on the right ("chief complai").
// The column now shrinks to the screen and the table scrolls inside its own box.

test.setTimeout(90_000);

test('the notes reader fits a 360 px phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  await page.getByRole('searchbox', { name: /ค้นหาวิชา|Search subjects/ }).fill('COM III');
  const card = page.locator('.lp-subject').filter({ hasText: /COM III/ }).first();
  await expect(card).toBeVisible({ timeout: 20000 });
  await card.click();
  const topic = page.locator('.vmx-topic-card').filter({ has: page.getByRole('button', { name: 'สรุป', exact: true }) }).first();
  await expect(topic).toBeVisible({ timeout: 20000 });
  await topic.getByRole('button', { name: 'สรุป', exact: true }).click();
  await expect(page.locator('.vmx-notes-grid').first()).toBeVisible({ timeout: 20000 });

  const over = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll('.vmx-notes-grid > *')]
      .map((el) => Math.round(el.getBoundingClientRect().right))
      .filter((right) => right > vw + 1);
  });
  expect(over).toEqual([]);
});
