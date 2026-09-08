import { test, expect } from '@playwright/test';
import { MOCHI_POSE_ASSETS } from '../../src/data/mochi-poses.generated.js';

test.setTimeout(90_000);
// Cached service-worker images would bypass the deliberate network failures.
// PWA/offline behavior has its own suites; these cases exercise the UI and image fallback.
test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('custom'));
    localStorage.setItem('vmx-consent-prefs', JSON.stringify({ analytics: false, personal: false }));
  });
});

async function open(page, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { await page.goto(url, { waitUntil: 'domcontentloaded' }); break; }
    catch (error) {
      if (attempt === 2 || !/NS_BINDING_ABORTED|NS_ERROR_FAILURE|frame was detached|interrupted by another navigation|Frame load interrupted/i.test(String(error))) throw error;
      await page.waitForTimeout(100 * (attempt + 1));
    }
  }
  await expect(page.locator('#main, #lp-main').first()).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('.vmx-view-fallback')).toHaveCount(0, { timeout: 25_000 });
}
async function startQuestions(page, exam = false) {
  await open(page, '/');
  await page.getByRole('button', { name: exam ? /Exam Mode|จำลองสนามสอบ/i : /Quick Practice|ฝึกแบบเลือกจำนวน/i }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า/ })).toBeVisible();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('10');
  if (!exam) {
    const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
    if ((await toggle.getAttribute('aria-checked')) !== 'true') await toggle.click();
  }
  await page.getByRole('button', { name: /เริ่มฝึก|เริ่มสอบ/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  for (let i = 0; i < 10; i++) {
    if (await page.locator('.vmx-option').first().isVisible()) return;
    await page.getByRole('button', { name: /ถัดไป/ }).click();
  }
  throw new Error('No MCQ found in this ten-question fixture');
}

test('Mochi inhabits real study destinations without fetching the 3D engine', async ({ page }) => {
  const requests = [], errors = [];
  page.on('request', r => requests.push(r.url()));
  page.on('pageerror', e => errors.push(e.message));
  for (const [path, slot, pose] of [
    ['/', 'welcome', 'wave'], ['/app/study', 'wayfinding', 'curious'],
    ['/app/schedule', 'wayfinding', 'think'], ['/app/library', 'wayfinding', 'read'],
    ['/app/progress', 'wayfinding', 'read'], ['/app/reading', 'page-intro', 'read'],
    ['/wiki/com5/rabies', 'wiki-reading', 'read'],
  ]) {
    await open(page, path);
    const mascot = page.locator(`#main [data-mochi-slot="${slot}"]`).first();
    await expect(mascot).toBeVisible({ timeout: 25_000 });
    await expect(mascot).toHaveAttribute('data-mochi-pose', pose);
    await mascot.scrollIntoViewIfNeeded();
    await expect(mascot.locator('img')).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => mascot.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), { timeout: 15_000, message: path + ' Mochi image decoded' }).toBe(true);
    await expect(mascot.locator('img')).toHaveAttribute('src', MOCHI_POSE_ASSETS[pose]);
    expect(await mascot.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(requests.filter(url => /vendor-atlas|renderer-3d|mochi-smooth.*glb/.test(url))).toEqual([]);
  expect(errors).toEqual([]);
});

test('practice feedback follows the actual verdict and never precedes an answer', async ({ page }) => {
  await startQuestions(page);
  await expect(page.locator('#main [data-mochi-slot]')).toHaveCount(0);
  await page.locator('.vmx-option').first().press('Enter');
  const verdict = page.locator('.vmx-instant-feedback');
  await expect(verdict).toBeVisible();
  const correct = (await verdict.getAttribute('class')).includes('is-ok');
  await expect(verdict.locator('[data-mochi-slot=feedback]')).toHaveAttribute('data-mochi-pose', correct ? 'correct' : 'encourage');
  await expect(page.locator('.vmx-option').first()).toBeFocused();
});

test('a real exam remains free of mascot feedback even after answering', async ({ page }) => {
  await startQuestions(page, true);
  await expect(page.locator('[data-mochi-slot]')).toHaveCount(0);
  await page.locator('.vmx-option').first().click();
  await expect(page.locator('.vmx-instant-feedback, [data-mochi-slot]')).toHaveCount(0);
  await expect(page.locator('.vmx-option').first()).toBeEnabled();
});

test('one preference hides companions everywhere while the learning UI remains available', async ({ page }) => {
  await open(page, '/app/mochi');
  await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'แสดง Mochi ในหน้าต่าง ๆ ของ VetMock' }).uncheck();
  for (const path of ['/', '/app/study', '/app/progress', '/app/reading']) {
    await open(page, path);
    await expect(page.locator('[data-mochi-slot]')).toHaveCount(0);
    await expect(page.locator('#main h1')).toBeVisible();
  }
});

test('failed optional artwork stays local to the illustration and does not break navigation', async ({ page }) => {
  let release;
  let intercepted = 0;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route(/\/motion\/poses\/[^/]+\.svg$/, async route => { intercepted++; await ready; await route.abort(); });
  await open(page, '/app/study');
  const search = page.getByRole('textbox', { name: 'ค้นหาวิชา', exact: true });
  await search.fill('Mochi draft stays');
  await expect.poll(() => intercepted).toBeGreaterThan(0);
  await page.evaluate(() => { window.__mochiDraftSentinel = true; });
  release();
  const mascot = page.locator('#main [data-mochi-slot=wayfinding]');
  await expect(mascot.locator('img')).toHaveAttribute('src', '/motion/assets/mochi.png', { timeout: 15_000 });
  await expect(search).toHaveValue('Mochi draft stays');
  expect(await page.evaluate(() => window.__mochiDraftSentinel)).toBe(true);
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*วิชา/ })).toBeVisible();
});

test('greetings settle, reduced motion stays still, and SR reveals preserve the controls', async ({ page }) => {
  await open(page, '/');
  const greeting = page.locator('#main [data-mochi-slot=welcome]');
  await expect(greeting).toHaveAttribute('data-mochi-settled', 'true', { timeout: 10_000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(greeting).not.toHaveClass(/is-reacting/);
  await open(page, '/app/review');
  await expect(page.locator('[data-mochi-slot=review-intro]')).toHaveAttribute('data-mochi-pose', 'read');
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.locator('[data-mochi-slot=review-card]')).toHaveAttribute('data-mochi-pose', 'think');
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await expect(page.locator('[data-mochi-slot=review-card]')).toHaveAttribute('data-mochi-pose', 'read');
  await expect(page.locator('.vmx-sr-grade')).toBeVisible();
  await page.getByRole('button', { name: /^Good/ }).click();
  await expect(page.locator('[data-mochi-slot=review-card]')).toHaveAttribute('data-mochi-pose', 'think');
});
