// Back and Forward return to where the reader was. A new page starts at its top, as it always did;
// a page reached by Back or Forward gets the place it had when the reader left it, even when its
// content arrives late (the bank's list, a reload) or the page above the fold changed meanwhile.
import { test, expect } from './fixtures.mjs';

const scrollY = (page) => page.evaluate(() => Math.round(window.scrollY));

// Close to where it was: the page may settle a pixel or two either way.
async function expectNear(page, want, why) {
  await expect.poll(() => scrollY(page), { message: why, timeout: 8000, intervals: [100, 200, 400] }).toBeGreaterThan(want - 3);
  await expect.poll(() => scrollY(page), { message: why }).toBeLessThan(want + 3);
}

/**
 * Where the page was at the moment of the last click, as the page saw it. The test tool's own
 * click scrolls a target that a fixed bar covers (the tab bar over a card at the foot of the
 * screen) before it presses, so the place to compare with is the one the reader left from.
 */
async function watchClicks(page) {
  await page.evaluate(() => addEventListener('click', () => { window.__clickY = Math.round(scrollY); }, true));
  return () => page.evaluate(() => window.__clickY);
}

// With motion on, where the pages arrive through view transitions and the entrances play.
test.describe('with motion on', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('Back to the home page lands where the reader left it', async ({ page, isMobile }) => {
    await page.goto('/');
    await expect(page.locator('.dcard').first()).toBeVisible();
    const clickedAt = await watchClicks(page);
    await page.evaluate(() => window.scrollTo(0, 1700));
    const card = page.locator('.dcard').nth(4);
    await card.scrollIntoViewIfNeeded();
    await (isMobile ? card.tap() : card.click());
    await expect(page).toHaveURL(/\/d\/[a-z-]+$/);
    const left = await clickedAt();
    expect(left).toBeGreaterThan(1000);
    // A new page starts at its top.
    await expectNear(page, 0, 'a new page starts at the top');
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expectNear(page, left, 'Back restores the home page');
    // And forward again, then back once more: the place is kept for every visit.
    await page.goForward();
    await expect(page).toHaveURL(/\/d\/[a-z-]+$/);
    await page.goBack();
    await expectNear(page, left, 'Back a second time');
  });
});

test('Back to the bank lands where the reader left it, though its list arrives late', async ({ page, isMobile }) => {
  await page.goto('/bank?d=swine');
  await expect(page.locator('.bk').first()).toBeVisible({ timeout: 40_000 });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expectNear(page, 1500, 'scrolled to 1500');
  // A press at the link's own place, as a hand would: the test tool's click can scroll a sticky
  // link "into view" first (see watchClicks).
  const away = await (isMobile ? page.locator('.tabbar a[href="/progress"]') : page.locator('.topnav a[href="/progress"]')).boundingBox();
  await page.mouse.click(away.x + away.width / 2, away.y + away.height / 2);
  await expect(page).toHaveURL(/\/progress$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/bank/);
  await expectNear(page, 1500, 'Back restores the bank');
});

// A footnote number in the almanac jumps down the page by an address of its own (#note-3, an entry
// the browser makes): Back from it returns to the table.
test('Back from a footnote jump returns to the table', async ({ page }) => {
  await page.goto('/exam');
  const clickedAt = await watchClicks(page);
  const note = page.locator('.alm-subj sup a').first();
  await note.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -200));
  await note.click();
  await expect(page).toHaveURL(/#note-\d+$/);
  const left = await clickedAt();
  expect(left).toBeGreaterThan(300);
  await expect.poll(() => scrollY(page)).not.toBe(left);
  await page.goBack();
  await expectNear(page, left, 'Back from the footnote');
});

// A reload keeps the place too, though the library's list arrives after the page has loaded.
test('a reload keeps the place', async ({ page }) => {
  await page.goto('/library');
  await expect(page.locator('a.doc').first()).toBeVisible({ timeout: 20_000 });
  await page.evaluate(() => window.scrollTo(0, 900));
  await expectNear(page, 900, 'scrolled');
  // The page notes where it is a moment after the scrolling stops.
  await page.waitForTimeout(600);
  await page.reload();
  await expect(page.locator('a.doc').first()).toBeVisible({ timeout: 20_000 });
  await expectNear(page, 900, 'after a reload');
});
