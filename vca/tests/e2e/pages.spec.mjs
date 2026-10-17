// The exam page, the bank, the library and a domain page.
import fs from 'node:fs';
import { test, expect, overflow } from './fixtures.mjs';

test('the exam page: two tickets, my exam date, calendars', async ({ page }) => {
  await page.goto('/exam');
  await expect(page.locator('.ticket')).toHaveCount(2);
  await expect(page.locator('.xhero-h')).toContainText('98');
  await expect(page.locator('.alm')).toBeVisible();
  await expect(page.locator('.asks .ask')).toHaveCount(20);

  const mine = page.locator('.xhero-actions button[aria-pressed]');
  await expect(mine).toHaveAttribute('aria-pressed', 'false');
  await mine.click();
  await expect(mine).toHaveAttribute('aria-pressed', 'true');
  const examDate = await page.evaluate(() => JSON.parse(localStorage.getItem('vca:progress:v1')).examDate);
  expect(examDate).toBe('2027-01-23');

  // The calendar sheet: one Google Calendar link per part, and the .ics file for the rest.
  await page.locator('.xhero-actions .cal-btn').click();
  const google = page.locator('.sheet a.cal-opt');
  await expect(google).toHaveCount(2);
  await expect(google.first()).toHaveAttribute('href', /calendar\.google\.com\/calendar\/render\?action=TEMPLATE.*dates=20270123T063000Z%2F20270123T093000Z/);
  const download = page.waitForEvent('download');
  await page.locator('.sheet button.cal-opt').click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.ics$/);
  const body = fs.readFileSync(await file.path(), 'utf8');
  expect(body).toContain('BEGIN:VCALENDAR');
  expect(body).toContain('DTSTART:20270123T063000Z');
  expect(await overflow(page)).toBe(0);
});

test('the exam date set on the exam page carries to the home countdown', async ({ page }) => {
  await page.goto('/exam');
  await page.locator('.xhero-actions button[aria-pressed]').click();
  await page.goto('/');
  await expect(page.locator('main a.countdown')).toContainText('98');
});

test('bank search finds Leptospira', async ({ page }) => {
  await page.goto('/bank?q=Leptospira');
  await expect(page.locator('.bk').first()).toBeVisible({ timeout: 40_000 });
  expect(await page.locator('.bk').count()).toBeGreaterThan(0);
  await expect(page.locator('.bk-stem').first()).toBeVisible();
  expect(await overflow(page)).toBe(0);
});

test('the library lists documents', async ({ page }) => {
  await page.goto('/library');
  await expect(page.locator('a.doc').first()).toBeVisible({ timeout: 20_000 });
  expect(await page.locator('a.doc').count()).toBeGreaterThan(5);
  await expect(page.locator('a.doc').first()).toHaveAttribute('target', '_blank');
  expect(await overflow(page)).toBe(0);
});

test('a domain page links to the exam page', async ({ page }) => {
  await page.goto('/d/swine');
  await expect(page.locator('.dhero')).toBeVisible();
  await expect(page.locator('.dhero h1')).toBeVisible();
  const toExam = page.locator('.dhero a[href="/exam"]');
  await expect(toExam).toBeVisible();
  await toExam.click();
  await expect(page).toHaveURL(/\/exam$/);
  await expect(page.locator('.ticket')).toHaveCount(2);
});

test('an unknown domain is not found', async ({ page }) => {
  await page.goto('/d/no-such-domain');
  await expect(page.locator('.empty-page')).toBeVisible();
});
