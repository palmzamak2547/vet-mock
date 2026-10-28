import fs from 'node:fs';
import { test, expect } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

// Safari on iPad drew right-aligned and centred Thai lines starting at their
// anchor (Palm's iPad, 28 Oct): the semester, the issue date and every room
// ran off the page. Playwright's WebKit does not reproduce it, so the page must
// never ask the canvas to align Thai text at all; card.text places it itself.
test('the printed page never relies on canvas alignment for Thai text', async ({ page }) => {
  await page.addInitScript(() => {
    const seen = (window.__thaiAligns = []);
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (/[฀-๿]/.test(String(text))) seen.push(this.textAlign);
      return fill.call(this, text, ...rest);
    };
  });
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: 'ดาวน์โหลดตารางสอบ' }).click();
  await expect(page.locator('.vmx-timetable-preview')).toHaveAttribute('data-state', 'ready', { timeout: 60_000 });
  const aligns = await page.evaluate(() => [...new Set(window.__thaiAligns)]);
  expect(aligns.length).toBeGreaterThan(0);
  expect(aligns.filter((a) => a !== 'left' && a !== 'start')).toEqual([]);
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
  // The status line clears after 3.2 s, and Firefox delivered the download
  // event to Playwright later than that (vetmock.com, 28 Oct: the line was
  // already empty when read after the event). So it is watched from the click.
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    expect(dialog.getByRole('status')).toHaveText('ดาวน์โหลด PDF แล้ว'),
    dialog.getByRole('button', { name: 'ดาวน์โหลด PDF' }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('vetmock-exam-timetable-y5-final-2569-1.pdf');
  const bytes = fs.readFileSync(await download.path());
  expect(bytes.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  await dialog.getByRole('button', { name: 'ปิด' }).click();
  await expect(dialog).toBeHidden();
});
