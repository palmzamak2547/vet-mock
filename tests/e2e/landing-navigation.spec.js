import { test, expect } from './fixtures.js';

// The landing's same-page links (the nav, the phone menu, the footer, the
// logo, the skip link) let the browser change the address fragment. App reads
// every history step as a route, so each of them took a new visitor from the
// landing to the year picker (found 2026-10-08; the earlier landing had the
// same plain links). They now scroll the landing and leave the address alone.

const SECTIONS = ['#solution', '#panic', '#lab', '#subjects', '#progress'];

// How far a section's top is from where a tap on its link leaves it: under the nav, at its own scroll
// margin. Read twice, 120 ms apart, and the larger kept, so a small number means the page has stopped there.
const offRest = (page, href) => page.locator(href).evaluate(async (el) => {
  const off = () => Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(el).scrollMarginTop));
  const first = off();
  await new Promise((done) => { setTimeout(done, 120); });
  return Math.max(first, off());
});
const arrives = (page, href) => expect.poll(() => offRest(page, href), { message: `${href} did not come to rest under the nav` }).toBeLessThan(2);

test('the phone menu closes and scrolls to the section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?e2e-fresh=1');
  await page.locator('.lp-nav-burger').click();
  await page.locator('#lp-mobile-menu .lp-mobile-menu-link[href="#subjects"]').click();
  await expect(page.locator('#subjects')).toBeInViewport();
  await expect(page.locator('#lp-mobile-menu')).toHaveAttribute('inert', '');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(new URL(page.url()).pathname).toBe('/');
});

// The two cases at desktop width run at a scale of 1, as a desktop screen has. The phone projects keep
// their 3x scale, which made 1280x800 into 3840x2400 pixels painted in software: the nav case took 35 s
// on WebKit, and in CI on 17 Nov 2026 its page died after 42 s of it and passed on the retry.
test.describe('at desktop width', () => {
  test.use({ deviceScaleFactor: 1 });

  // Each tap must bring its section to rest under the nav, which says more than "some of it is on screen".
  // Before 5.298.0 a tap could stop short of its section on WebKit, or not move the page at all: scroll
  // anchoring corrected the scroll position while the page's own motion ran, and the correction stopped the
  // smooth scroll in flight (10 of 40 runs of this case with six workers on 17 Nov 2026, none with anchoring
  // off; Chromium and Firefox finish the scroll either way). The landing now turns anchoring off.
  test('the nav scrolls the landing instead of leaving it', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/?e2e-fresh=1');
    // Tapped at once, before the sections below the hero have rendered: the tap
    // is held and served when they arrive, and the address still never changes.
    await page.locator('.lp-navlink[href="#progress"]').click();
    await arrives(page, '#progress');
    expect(new URL(page.url()).pathname).toBe('/');
    // The rule itself (styles-landing.css). An engine without scroll anchoring reports nothing for it.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowAnchor ?? 'none')).toBe('none');
    for (const href of SECTIONS) {
      await page.locator(`.lp-navlink[href="${href}"]`).click();
      await arrives(page, href);
      await expect(page.locator('.lp-nav')).toBeVisible();
      const url = new URL(page.url());
      expect(url.pathname, `${href} left the landing`).toBe('/');
      expect(url.hash, `${href} changed the address`).toBe('');
    }
  });

  test('the skip link moves focus to the landing content', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/?e2e-fresh=1');
    await page.locator('#subjects').waitFor();
    // Focused directly: WebKit's Tab skips links unless the reader turned that on.
    await page.locator('.lp-skip').focus();
    await expect(page.locator('.lp-skip')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lp-main')).toBeFocused();
    expect(new URL(page.url()).pathname).toBe('/');
  });
});
