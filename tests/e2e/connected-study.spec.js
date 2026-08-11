import { expect, test } from '@playwright/test';

async function firstVisible(locator) {
  for (let index = 0; index < await locator.count(); index += 1) {
    const candidate = locator.nth(index);
    if (await candidate.isVisible()) return candidate;
  }
  return null;
}

async function openVisible(locator) {
  const candidate = await firstVisible(locator);
  if (candidate) {
    await candidate.click();
    return candidate;
  }
  throw new Error('No visible matching control');
}

test.describe('connected study experience', () => {
  // These tests exercise lazy network boundaries directly. A previously
  // activated app service worker can satisfy chunks before Playwright routes
  // see them, which would make the deterministic slow-chunk regression inert.
  test.use({ serviceWorkers: 'block' });

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('vmx-selected-year', '4');
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
        window.localStorage.setItem('vmx-seen-landing', '1');
        window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      } catch {}
    });
  });

  test('topic opens its exact Notes and governed VetWiki resources', async ({ page }) => {
    // The article URL must become shareable at click time, not only after the
    // large lazy VetWiki chunk has downloaded and mounted. Holding that chunk
    // gives this regression a deterministic signal for slow devices/networks.
    let releaseWikiChunk;
    let markWikiChunkRequested;
    const wikiChunkRequested = new Promise((resolve) => { markWikiChunkRequested = resolve; });
    const wikiChunkRelease = new Promise((resolve) => { releaseWikiChunk = resolve; });
    await page.route(/\/assets\/KnowledgeView-[^/]+\.js(?:\?.*)?$/, async (route) => {
      markWikiChunkRequested();
      await wikiChunkRelease;
      await route.continue();
    });

    await page.goto('/');
    const com5 = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
    await expect(com5).toBeVisible({ timeout: 15_000 });
    await com5.click();

    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible();
    const rabies = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
    await expect(rabies).toBeVisible();
    await expect(rabies.getByRole('button', { name: /Notes/ })).toBeVisible();
    await expect(rabies.getByRole('button', { name: /VetWiki/ })).toBeVisible();

    await rabies.getByRole('button', { name: /Notes/ }).click();
    await expect(page.getByRole('heading', { name: /Rabies.*โรคพิษสุนัขบ้า/i })).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /ย้อนกลับ|หัวข้อ|topic/ }).first().click();
    const rabiesAgain = page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first();
    await expect(rabiesAgain).toBeVisible();
    await rabiesAgain.getByRole('button', { name: /VetWiki/ }).click();

    await wikiChunkRequested;
    await expect(page).toHaveURL(/\/wiki\/com5\/rabies/, { timeout: 1_000 });
    releaseWikiChunk();
    await expect(page.getByRole('heading', { level: 1, name: /Rabies/i })).toBeVisible({ timeout: 15_000 });

    await page.goBack();
    await expect(page).toHaveURL(/^https?:\/\/[^/]+\/$/);
    await expect(page.locator('.vmx-topic-card').filter({ hasText: /Rabies/ }).first()).toBeVisible();
  });

  test('video subject scope applies only to contextual navigation', async ({ page }) => {
    await page.goto('/');
    const com5 = page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first();
    await expect(com5).toBeVisible({ timeout: 15_000 });
    await com5.click();

    const subjectVideos = page.locator('.vmx-mode-card').filter({ hasText: /playlist/ }).first();
    await expect(subjectVideos).toBeEnabled();
    await subjectVideos.click();
    await expect(page.locator('.vmx-chip.active')).toContainText('COM V');
    await expect(page.locator('.vmx-chip').first()).not.toHaveClass(/active/);

    await page.locator('.vmx-back-chip').first().click();
    const globalVideos = page.locator('.vmx-feature-card').filter({ hasText: /YouTube playlist/ }).first();
    await expect(globalVideos).toBeVisible();
    await globalVideos.click();
    await expect(page.locator('.vmx-chip').first()).toHaveClass(/active/);
  });
});

test.describe('landing accessibility', () => {
  test('consent stays compact and login dialog manages focus', async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('vmx-selected-year');
        window.localStorage.removeItem('vmx-seen-landing');
        window.localStorage.removeItem('vmx-consent');
      } catch {}
    });
    await page.goto('/?e2e-fresh=1');

    const consent = page.getByRole('region', { name: /remember where|จำที่ที่/ });
    await expect(consent).toBeVisible();
    const consentBox = await consent.boundingBox();
    const viewport = page.viewportSize();
    expect(consentBox.height).toBeLessThan(Math.min(230, viewport.height * 0.38));

    await consent.locator('.lp-cookie-prefs').click();
    await expect(page.getByRole('switch').first()).toBeFocused();
    await page.locator('.lp-cookie-card .vmx-btn-primary').click();
    await expect(page.locator('.lp-cookie-dock')).toBeHidden();

    const signInControls = page.getByRole('button', { name: /Sign In|เข้าสู่ระบบ/ });
    let returnTarget = await firstVisible(signInControls);
    if (!returnTarget) {
      returnTarget = page.getByRole('button', { name: 'Menu' });
      await returnTarget.click();
    }
    await openVisible(signInControls);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: /Email|อีเมล/ })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(returnTarget).toBeFocused();
  });
});
