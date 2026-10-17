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
  // The pace reads as a promise: so many a day, and the bank is done by the exam.
  await expect(page.locator('.plan-t')).toContainText('ก็ครบ');
  await expect(page.locator('.plan-t')).not.toContainText('จะครบอีก');
});

test('the exam page keeps the parts of the paper and the domains of the exam apart', async ({ page }) => {
  await page.goto('/exam');
  // The centre's own wording for the two parts of the paper; the nineteen domains are หมวดวิชา.
  await expect(page.locator('.ticket-k').first()).toContainText('หมวด 2');
  await expect(page.locator('#asks-h')).toHaveText('ข้อสอบออกหมวดวิชาไหนบ้าง');
  await expect(page.locator('.band')).toContainText('ค่าสมัครสอบต่อหมวด');
});

// A share sheet is drawn into <body>: its button sits inside a glass pane, and a parent with a
// backdrop-filter would otherwise hold the "fixed" sheet inside its own box (shown clipped).
test('a share sheet opened from inside a glass pane fills the screen and gives focus back', async ({ page }) => {
  await page.goto('/exam');
  const open = page.locator('.xhero-actions button', { hasText: 'แชร์' });
  await open.click();
  const veil = page.locator('.sheet-veil');
  await expect(veil).toBeVisible();
  const { width, height } = page.viewportSize();
  expect(await veil.boundingBox()).toMatchObject({ x: 0, y: 0, width, height });
  expect(await veil.evaluate((n) => n.parentElement === document.body)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(veil).toBeHidden();
  await expect(open).toBeFocused();
});

test('progress: an empty chart says so in one line, and an export says it was saved', async ({ page }) => {
  await page.goto('/progress');
  await expect(page.locator('.activity .hint')).toHaveText('ยังไม่มีวันที่ฝึก');
  await expect(page.locator('.activity-bars')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ส่งออก' }).click();
  expect((await download).suggestedFilename()).toMatch(/^vetmock-vca-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByRole('button', { name: 'บันทึกไฟล์แล้ว' })).toBeVisible();
  await expect(page.locator('.data [role="status"]')).toHaveText(/บันทึกไฟล์ vetmock-vca-.*\.json แล้ว/);
  // It is a moment's word, not a state: the button goes back to what it was.
  await expect(page.getByRole('button', { name: 'ส่งออก' })).toBeVisible({ timeout: 8000 });
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
