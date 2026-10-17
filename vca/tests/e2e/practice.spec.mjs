// Practice: keys reveal and advance, a set built for one domain runs to its result.
import { test, expect, overflow, answer } from './fixtures.mjs';

const start = async (page, query) => {
  await page.goto(`/practice?${query}`);
  const go = page.locator('.builder-sum button.btn-ink');
  await expect(go).toBeEnabled();
  await go.click();
  await expect(page).toHaveURL(/\/session$/, { timeout: 30_000 });
  await expect(page.locator('.run-card [role="radio"]').first()).toBeVisible({ timeout: 30_000 });
};

test('1 picks an option and shows the verdict; Enter goes on', async ({ page }) => {
  await start(page, 'd=swine&n=10');
  await expect(page.locator('.run-count b')).toHaveText('1');
  await page.keyboard.press('Digit1');
  await expect(page.locator('.run-card .why .verdict')).toBeVisible();
  await expect(page.locator('.run-card [role="radio"][aria-checked="true"]')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page.locator('.run-count b')).toHaveText('2');
  await expect(page.locator('.run-card .why')).toHaveCount(0);
});

test('a ten-question swine set runs to its result', async ({ page, isMobile }) => {
  await start(page, 'd=swine&n=10');
  expect(await overflow(page)).toBe(0);
  for (let i = 1; i <= 10; i += 1) {
    await expect(page.locator('.run-count b')).toHaveText(String(i));
    await answer(page, i % 2, { isMobile });
    await expect(page.locator('.run-card .why .verdict')).toBeVisible();
    await page.locator('.run-actions button.btn-ink').click();
  }
  await expect(page).toHaveURL(/\/result\/[a-z0-9-]{4,40}$/, { timeout: 15_000 });
  await expect(page.locator('.result-hero')).toBeVisible();
  await expect(page.locator('.rv-list .rv')).toHaveCount(10);
  // Every answer was kept on this device.
  const seen = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('vca:progress:v1')).q).length);
  expect(seen).toBe(10);
  expect(await overflow(page)).toBe(0);
  // The way out to the revision apps: each option shows its app's own mark.
  await page.getByRole('button', { name: /ส่งออกไป Anki/ }).click();
  const sheet = page.getByRole('dialog', { name: 'ส่งออก' }).or(page.locator('.export-list'));
  await expect(page.locator('.export-list .brand-tile')).toHaveCount(4);
  await page.screenshot({ path: test.info().outputPath('export.png') });
  await expect(sheet.first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet.first()).toBeHidden();
  // The date has its Buddhist-era year (the clock is fixed to 17 Oct 2569).
  await expect(page.locator('.result-facts li').first()).toContainText('17 ต.ค. 2569');
  // The invitation sits in the glass hero, and its sheet still takes the whole screen.
  await page.getByRole('button', { name: 'ชวนเพื่อนมาซ้อม' }).click();
  const veil = page.locator('.sheet-veil');
  await expect(veil).toBeVisible();
  const { width, height } = page.viewportSize();
  expect(await veil.boundingBox()).toMatchObject({ x: 0, y: 0, width, height });
  await page.keyboard.press('Escape');
  await expect(veil).toBeHidden();
});

test('/session with no set to run goes to the set builder, frame and all', async ({ page, isMobile }) => {
  await page.goto('/session');
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator('.builder-form')).toBeVisible();
  await expect(page.locator('.topbar')).toBeVisible();
  await expect(page.locator('footer.footer')).toBeAttached();
  if (isMobile) await expect(page.locator('.tabbar')).toBeVisible();
  // The entry was replaced, so Back does not return to an empty /session.
  expect(await page.evaluate(() => history.length)).toBeLessThanOrEqual(2);
});

test('the set builder names the domains หมวดวิชา and a part of the paper หมวด', async ({ page }) => {
  await page.goto('/practice?mode=mock&n=200');
  await expect(page.locator('.builder-sum .sum-list')).toContainText('หมวดวิชา');
  await expect(page.locator('.builder-sum .sum-real')).toContainText('ข้อสอบจริง 1 หมวด');
});

test('the builder keeps its choices in the address', async ({ page }) => {
  await page.goto('/practice?d=swine,equine&n=20');
  await expect(page.locator('.builder-form')).toBeVisible();
  await expect(page.locator('.builder-form button.chip[aria-pressed="true"]')).toHaveCount(2);
  await expect(page.locator('.builder-sum .sum-n')).toContainText('20');
  expect(await overflow(page)).toBe(0);
});

// Leaving from the leave sheet skips the page's view transition: snapshotting the closing glass
// sheet crashed WebKit's tab every time (press sweep, 18 Oct). Chromium can't crash here, so this
// checks the cause: no page transition starts while a sheet is on screen.
test.describe('with motion on', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });
  test('pause from the leave sheet goes home without a page transition', async ({ page }) => {
    await start(page, 'd=swine&n=10');
    await page.evaluate(() => {
      window.__vt = [];
      new MutationObserver(() => window.__vt.push(document.documentElement.dataset.vt || ''))
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-vt'] });
    });
    await page.getByRole('button', { name: 'พักหรือจบชุดนี้' }).click();
    await page.getByRole('button', { name: 'พักไว้ก่อน กลับหน้าแรก' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('ทำต่อ').first()).toBeVisible();
    expect(await page.evaluate(() => window.__vt)).not.toContain('page');
  });
});
