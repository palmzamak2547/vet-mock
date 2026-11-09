import { test, expect } from './fixtures.js';
import { CHANGELOG } from '../../src/data/changelog-all.js';
import { truncateThai } from '../../src/lib/thai-text.js';

const SEEN_KEY = 'vmx-seen-changelog';

// Home announces every release this device has not seen, and a first visit has
// seen every release the build carries (src/lib/changelog-seen.js). So each
// test visits once, reads the build's releases from the set that visit kept,
// marks one unseen and loads Home again. The versions come from the page, never
// typed by hand: the spec follows whatever is in `dist` (the built assets here
// can predate the newest generated entry, and a stale dist must not turn a
// green release-note flow red), and looks each one up in the source changelog.
async function announce(page, pick = (versions) => versions[0]) {
  await page.goto('/');
  const stripLink = page.locator('.vmx-link-btn')
    .filter({ hasText: /อัปเดตล่าสุด|มีอะไรใหม่/ });
  await expect(stripLink).toBeVisible();
  // A first visit is met by no announcement: the newest release reads as seen.
  await expect(stripLink).toHaveText(/^อัปเดตล่าสุด \(/);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), SEEN_KEY)).not.toBeNull();
  const versions = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SEEN_KEY);
  expect(versions.length, 'the first visit kept every release the build carries').toBeGreaterThan(1);
  const version = pick(versions);
  await page.evaluate(([key, v]) => {
    localStorage.setItem(key, JSON.stringify(JSON.parse(localStorage.getItem(key)).filter((x) => x !== v)));
  }, [SEEN_KEY, version]);
  await page.reload();
  await expect(stripLink).toHaveText(`มีอะไรใหม่ (${version})`);
  const entry = CHANGELOG.find((item) => item.version === version);
  expect(entry, `the build carries release ${version}, which has a changelog entry`).toBeTruthy();
  return { stripLink, entry, newest: versions[0] };
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('the update chip names what changed instead of saying the system updated', async ({ page }) => {
  const { entry } = await announce(page);
  // The chip's tooltip carries the untruncated headline and the release date.
  const chip = page.getByTitle(entry.headline);
  await expect(chip).toBeVisible();
  await expect(chip).not.toContainText('อัปเดตระบบ');
  await expect(chip.locator('span').first()).toHaveText(truncateThai(entry.headline, 30));
  await expect(chip).toContainText(`${entry.changes.length} รายการ`);
});

test('tapping the chip opens the announcement with the whole change list already expanded', async ({ page }) => {
  const { entry } = await announce(page);
  const chip = page.getByTitle(entry.headline);
  await chip.click();
  const notice = page.locator('.vmx-changelog-notice');
  await expect(notice).toBeVisible();
  await expect(notice.locator('.vmx-changelog-title')).toHaveText(entry.headline);
  // Details start open — one tap yields the whole list, no second step.
  await expect(notice.locator('li')).toHaveCount(entry.changes.length);
  for (const change of entry.changes) {
    await expect(notice).toContainText(change.title);
  }
  const toggle = notice.getByRole('button', { name: /รายละเอียด/ });
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveText('ซ่อนรายละเอียด');
  // Two changelog affordances on screen at once read as a glitch.
  await expect(chip).toHaveCount(0);
});

test('the ✕ closes the announcement and the bottom strip re-opens the release', async ({ page }) => {
  const { stripLink, entry } = await announce(page);
  const notice = page.locator('.vmx-changelog-notice');
  await page.getByTitle(entry.headline).click();
  await page.getByRole('button', { name: 'ปิดประกาศ', exact: true }).click();
  await expect(notice).toHaveCount(0);
  // A read release is no longer new news.
  await expect(stripLink).toHaveText(`อัปเดตล่าสุด (${entry.version})`);
  // The link itself opens the note again, list expanded, and hands it focus.
  await stripLink.click();
  await expect(notice).toBeVisible();
  await expect(notice.locator('li')).toHaveCount(entry.changes.length);
  await expect(notice).toBeFocused();
  // One changelog affordance at a time: the note is open, so the chip is gone.
  await expect(page.getByTitle(entry.headline)).toHaveCount(0);
  await expect(stripLink).toHaveText(`มีอะไรใหม่ (${entry.version})`);
});

test('on a phone the bottom strip opens the release note by itself, unread or read', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const { stripLink, entry } = await announce(page);
  const notice = page.locator('.vmx-changelog-notice');
  // The note opens from the link and nothing else: no chip tap in between.
  // It is the .is-forced one, which the ≤600px rule does NOT hide, and the
  // link sits at the bottom of Home while the note sits at the top, so the
  // note has to be brought into view and handed focus as well.
  const expectOpenedByLink = async () => {
    await expect(notice).toBeVisible();
    await expect(notice.locator('li').first()).toBeVisible();
    await expect(notice).toBeInViewport();
    await expect(notice).toBeFocused();
  };

  // Unread: the release has not been opened yet.
  await expect(notice).toHaveCount(0);
  await stripLink.scrollIntoViewIfNeeded();
  await stripLink.click();
  await expectOpenedByLink();

  // After closing it with the ✕, the same link opens it again.
  await page.getByRole('button', { name: 'ปิดประกาศ', exact: true }).click();
  await expect(notice).toHaveCount(0);
  await expect(stripLink).toHaveText(`อัปเดตล่าสุด (${entry.version})`);
  await stripLink.scrollIntoViewIfNeeded();
  await stripLink.click();
  await expectOpenedByLink();
});

// A number is taken when a pull request opens, so a lower one can merge after
// a higher one a device has already closed. The old banner kept that one
// version and never announced the lower release; now it is announced, once.
test('a release that merged after a higher number is announced, and then reads as seen', async ({ page }) => {
  const { stripLink, entry, newest } = await announce(page, (versions) => versions[1]);
  expect(entry.version).not.toBe(newest);
  const chip = page.getByTitle(entry.headline);
  await expect(chip).toBeVisible();
  await expect(chip).toContainText(`${entry.changes.length} รายการ`);
  await chip.click();
  const notice = page.locator('.vmx-changelog-notice');
  await expect(notice.locator('.vmx-changelog-title')).toHaveText(entry.headline);
  await expect(notice.locator('li')).toHaveCount(entry.changes.length);
  await page.getByRole('button', { name: 'ปิดประกาศ', exact: true }).click();
  await expect(notice).toHaveCount(0);
  await expect(stripLink).toHaveText(`อัปเดตล่าสุด (${newest})`);
  await expect(page.getByTitle(entry.headline)).toHaveCount(0);
  // Kept as seen, so the next visit stays quiet (tests/unit/changelog-seen.test.mjs walks that visit).
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SEEN_KEY)).toContain(entry.version);
});
