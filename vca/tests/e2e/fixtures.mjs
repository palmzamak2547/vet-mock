// Shared by every spec: the day is fixed to 17 Oct 2569 (98 days before round 2/2569), and a
// test fails on any console error or uncaught exception the page raised.
import { test as base, expect } from '@playwright/test';

export const TODAY = new Date('2026-10-17T10:00:00+07:00');

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(TODAY);
    await use(page);
  },
  pageErrors: [async ({ page }, use) => {
    const errors = [];
    page.on('console', (m) => {
      // The dev server's reload channel reconnecting is the test server's business, not the page's.
      if (m.type() === 'error' && !m.location().url.includes('/@vite/client')) errors.push(`${m.text()} (${m.location().url})`);
    });
    page.on('pageerror', (e) => errors.push(`uncaught: ${e.message}`));
    await use(errors);
    expect(errors, 'the page logged errors').toEqual([]);
  }, { auto: true }],
});

export { expect };

/** Horizontal overflow of the page in CSS pixels (0 when nothing sticks out). */
export const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** Pick option `row` (0-based) of the current question: a tap on a phone, a key on a desk. */
export async function answer(page, row, { isMobile }) {
  if (isMobile) await page.locator('.run-card [role="radio"]').nth(row).tap();
  else await page.keyboard.press(`Digit${row + 1}`);
}
