import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });

// The connected-apps page: reached from the profile hub, every calendar
// button points at this year's feed, and Anki gets a real import file of
// the pinned question.
test('connect apps: calendar feed links and an Anki file of pinned questions', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('connect-apps-seeded')) return;
    localStorage.setItem('connect-apps-seeded', '1');
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([{ id: 1, type: 'question', label: 'Sciatic', payload: { subject: 'surg2', id: 4 }, addedAt: 1 }]));
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: /โปรไฟล์/ }).first().click();
  await page.getByRole('button', { name: /เชื่อมแอป/ }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'เชื่อมแอป' })).toBeVisible();

  const feed = 'https://vetmock.com/api/calendar?year=4';
  await expect(page.getByRole('link', { name: 'Apple Calendar' })).toHaveAttribute('href', feed.replace('https:', 'webcal:'));
  await expect(page.getByRole('link', { name: 'Google Calendar' })).toHaveAttribute('href', `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feed.replace('https:', 'webcal:'))}`);
  await expect(page.getByRole('link', { name: 'Outlook' })).toHaveAttribute('href', new RegExp(`addfromweb\\?url=${encodeURIComponent(feed).replace(/[?.]/g, '\\$&')}`));

  const row = page.getByRole('listitem').filter({ hasText: 'ข้อที่ปักหมุด' });
  await expect(row).toContainText('1 ข้อ');
  const [download] = await Promise.all([page.waitForEvent('download'), row.getByRole('button', { name: 'ดาวน์โหลด' }).click()]);
  expect(download.suggestedFilename()).toBe('vetmock-pinned.txt');
  const text = await (await download.createReadStream()).toArray().then((c) => Buffer.concat(c).toString('utf8'));
  expect(text).toContain('#deck:VetMock::ข้อที่ปักหมุด');
  expect(text.trim().split('\n')).toHaveLength(6);
  await expect(page.getByRole('status').filter({ hasText: 'ดาวน์โหลดแล้ว 1 การ์ด' })).toBeVisible();
});
