import { test, expect } from './fixtures.js';

// The landing's same-page links (the nav, the phone menu, the footer, the
// logo, the skip link) let the browser change the address fragment. App reads
// every history step as a route, so each of them took a new visitor from the
// landing to the year picker (found 2026-10-08; the earlier landing had the
// same plain links). They now scroll the landing and leave the address alone.

const SECTIONS = ['#solution', '#panic', '#lab', '#subjects', '#progress'];

test('the nav scrolls the landing instead of leaving it', async ({ page }) => {
  // Six smooth scrolls at 1280x800: on webkit-mobile that is 3840x2400 pixels
  // painted in software here, slow but correct (see the chrome test in
  // connected-study.spec.js).
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/?e2e-fresh=1');
  // Tapped at once, before the sections below the hero have rendered: the tap
  // is held and served when they arrive, and the address still never changes.
  await page.locator('.lp-navlink[href="#progress"]').click();
  await expect(page.locator('#progress')).toBeInViewport();
  expect(new URL(page.url()).pathname).toBe('/');
  for (const href of SECTIONS) {
    await page.locator(`.lp-navlink[href="${href}"]`).click();
    await expect(page.locator(href)).toBeInViewport();
    await expect(page.locator('.lp-nav')).toBeVisible();
    const url = new URL(page.url());
    expect(url.pathname, `${href} left the landing`).toBe('/');
    expect(url.hash, `${href} changed the address`).toBe('');
  }
});

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
