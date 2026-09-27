// The chart of what CUVET papers use is to scale where a reader lands on it (review round 1 blocker):
// after the #rs-papers link, every bar's width over its track equals its count over the largest count,
// with no further scrolling. Before the fix the bars stopped part way through growing there.
// OWNER: integrator.
import { test, expect } from '@playwright/test';
import { seenEntrance } from './research-runtime-helpers.mjs';

async function barsToScale(page) {
  // The bars finish growing about 1.6 s after the figure enters; poll until they have.
  await expect.poll(async () => {
    const rows = await page.$$eval('.rs-papers-row', (trs) => trs.map((tr) => {
      const bar = tr.querySelector('.rs-papers-bar');
      const track = tr.querySelector('.rs-papers-track');
      return { count: Number(tr.querySelector('.rs-papers-num').textContent), w: bar.getBoundingClientRect().width, tw: track.getBoundingClientRect().width };
    }));
    if (!rows.length) return 'no rows';
    const max = Math.max(...rows.map((r) => r.count));
    const off = rows.filter((r) => Math.abs(r.w / r.tw - r.count / max) > 0.01);
    return off.length ? `${off.length} of ${rows.length} bars not to scale` : 'ok';
  }, { timeout: 8_000 }).toBe('ok');
}

test('the chart is to scale after a jump to #rs-papers', async ({ page }) => {
  await seenEntrance(page);
  await page.goto('/#rs-papers');
  await expect(page.locator('.rs-papers-row').first()).toBeAttached();
  await page.evaluate(() => document.getElementById('rs-papers')?.scrollIntoView());
  await barsToScale(page);
});
