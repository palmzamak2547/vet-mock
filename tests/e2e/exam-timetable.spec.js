import fs from 'node:fs';
import { test, expect } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

// The suite's pinned day (25 Sep) is after the last midterm paper, so the
// page to print is the finals.
test('the exam timetable downloads as an A4 PDF whose layout check is clean', async ({ page }) => {
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  const dialog = page.getByRole('dialog', { name: 'ตารางสอบปลายภาค' });
  const preview = dialog.locator('.vmx-timetable-preview');
  await expect(preview).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  await expect(preview).toHaveAttribute('data-layout', 'clean');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    dialog.getByRole('button', { name: 'ดาวน์โหลด PDF' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('vetmock-exam-timetable-y5-final-2569-1.pdf');
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  await expect(dialog.getByRole('status')).toHaveText('ดาวน์โหลด PDF แล้ว');
  await dialog.getByRole('button', { name: 'ปิด' }).click();
  await expect(dialog).toBeHidden();
});
