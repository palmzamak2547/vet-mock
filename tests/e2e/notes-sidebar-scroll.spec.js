import { test, expect } from '@playwright/test';

// ทวนเนื้อหา put the topic picker in a sticky column beside the article, but
// the picker lists every subject and every topic of the open one, so on a wide
// screen it was routinely taller than the viewport — and a sticky element
// taller than the viewport cannot stick. The two columns scrolled against each
// other: the article moved, then stopped while the nav caught up. Palm called
// it "เลื่อนใช้ยากๆ".
//
// The picker now has a ceiling and scrolls inside itself, so sticky does what
// it was put there to do.

test.setTimeout(90_000);

test('the topic picker holds still instead of scrolling the page with it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // ทวนเนื้อหา has no URL of its own, so it is reached the way a student
  // reaches it: a subject card, then สรุป on a topic that has notes.
  await page.goto('/');
  const card = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
  await expect(card).toBeVisible({ timeout: 20000 });
  await card.click();
  const topic = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
  await expect(topic).toBeVisible({ timeout: 20000 });
  await topic.getByRole('button', { name: 'สรุป', exact: true }).click();

  const sidebar = page.locator('.vmx-notes-sidebar').first();
  await expect(sidebar).toBeVisible({ timeout: 20000 });

  const geo = await page.evaluate(() => {
    const el = document.querySelector('.vmx-notes-sidebar');
    const cs = getComputedStyle(el);
    return {
      position: cs.position,
      overflowY: cs.overflowY,
      height: el.getBoundingClientRect().height,
      viewport: window.innerHeight,
      scrollable: el.scrollHeight > el.clientHeight + 1,
    };
  });

  expect(geo.position).toBe('sticky');
  expect(geo.overflowY).toBe('auto');
  // A sticky column must fit on screen or it cannot stick.
  expect(geo.height).toBeLessThanOrEqual(geo.viewport);
});
