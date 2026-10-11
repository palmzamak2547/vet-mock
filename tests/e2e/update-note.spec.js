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
  await page.getByTitle(entry.headline).click();
  await page.getByRole('button', { name: 'ปิดประกาศ', exact: true }).click();
  await expect(page.locator('.vmx-changelog-notice')).toHaveCount(0);
  // A read release is no longer new news.
  await expect(stripLink).toHaveText(`อัปเดตล่าสุด (${entry.version})`);
  await stripLink.click();
  await expect(page.getByTitle(entry.headline)).toBeVisible();
  await expect(stripLink).toHaveText(`มีอะไรใหม่ (${entry.version})`);
});

test('on a phone the bottom strip still leads to the release note', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const { stripLink, entry } = await releaseUnderTest(page);
  // The headline chip itself sits in the vitals rail, a container no
  // viewport hides, so it stays visible on a phone too — but this strip
  // link is what a phone user is guaranteed either way. Tapping it
  // re-surfaces the release note, and the note it opens is the .is-forced
  // one that the ≤600px rule does NOT hide.
  await expect(stripLink).toBeVisible();
  await stripLink.click();
  const chip = page.getByTitle(entry.headline);
  await expect(chip).toBeVisible();
  await chip.click();
  await expect(page.locator('.vmx-changelog-notice')).toBeVisible();
  await expect(page.locator('.vmx-changelog-notice li').first()).toBeVisible();
});
