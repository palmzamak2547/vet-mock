import { test, expect } from '@playwright/test';

// The screening bench prints a 2x2 table of five-figure counts inside a side
// panel. At iPad width the panel is narrower than the table's smallest size and
// the totals column was cut at the edge — Palm's screenshot shows 74,66… /
// 25,34… / 100,00… with nothing to scroll and no way to read the rest.
//
// A number a student cannot finish reading is the same failure as an answer key
// that is not there: the page shows something that cannot be used. The table now
// scrolls inside its panel, so every figure is reachable at any width.

test.setTimeout(90_000);

for (const width of [1280, 834, 390]) {
  test(`every figure in the 2x2 table is reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/app/bench');
    const table = page.locator('.vmx-bench-table').first();
    await expect(table).toBeVisible({ timeout: 20000 });

    const geo = await page.evaluate(() => {
      const t = document.querySelector('.vmx-bench-table');
      const wrap = document.querySelector('.vmx-bench-table-scroll');
      const cells = [...t.querySelectorAll('td, th')];
      const wrapBox = wrap.getBoundingClientRect();
      // A cell is unreachable if it extends past the scroll container AND the
      // container cannot be scrolled to bring it into view.
      const scrollable = wrap.scrollWidth > wrap.clientWidth + 1;
      const overflowing = cells.filter((c) => c.getBoundingClientRect().right > wrapBox.right + 1).length;
      return {
        scrollable,
        overflowing,
        canScroll: getComputedStyle(wrap).overflowX,
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });

    // Either everything fits, or the container is genuinely scrollable.
    if (geo.overflowing > 0) {
      expect(geo.scrollable, 'cells past the edge must be scrollable to').toBe(true);
    }
    expect(geo.canScroll).toBe('auto');
    // And the table never pushes the whole page sideways.
    expect(geo.pageOverflow).toBe(false);
  });
}
