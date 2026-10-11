import { test, expect } from './fixtures.js';
import { CHANGELOG } from '../../src/data/changelog.js';
import { truncateThai } from '../../src/lib/thai-text.js';

// The release the build is actually running. Home keys its announcement by
// version, so the spec reads the version the app itself prints on the bottom
// strip and looks that release up in the source changelog — it then follows
// whatever is in `dist` instead of a number typed by hand (the built assets
// here predate the newest generated entry, and a stale dist must not turn a
// green release-note flow red).
async function releaseUnderTest(page) {
  const stripLink = page.locator('.vmx-link-btn')
    .filter({ hasText: /อัปเดตล่าสุด|มีอะไรใหม่/ });
  await expect(stripLink).toBeVisible();
  const label = (await stripLink.textContent()) || '';
  const version = label.match(/\(([^)]+)\)/)?.[1];
  const entry = CHANGELOG.find((item) => item.version === version);
  expect(entry, `the build reports release ${version}, which has a changelog entry`).toBeTruthy();
  return { stripLink, entry };
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
  await page.goto('/');
  const { entry } = await releaseUnderTest(page);
  // The chip's tooltip carries the untruncated headline and the release date.
  const chip = page.getByTitle(entry.headline);
  await expect(chip).toBeVisible();
  await expect(chip).not.toContainText('อัปเดตระบบ');
  await expect(chip.locator('span').first()).toHaveText(truncateThai(entry.headline, 30));
  await expect(chip).toContainText(`${entry.changes.length} รายการ`);
});

test('tapping the chip opens the announcement with the whole change list already expanded', async ({ page }) => {
  await page.goto('/');
  const { entry } = await releaseUnderTest(page);
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
  await page.goto('/');
  const { stripLink, entry } = await releaseUnderTest(page);
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
  await page.goto('/');
  const { stripLink, entry } = await releaseUnderTest(page);
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
