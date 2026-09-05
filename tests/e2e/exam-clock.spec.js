import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('a resumed timer preserves its deadline and expires after a suspended interval', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('clock-fixture')) {
      sessionStorage.setItem('clock-fixture', '1');
      const now = Date.now();
      localStorage.setItem('vmx-inflight-exam', JSON.stringify({
        questions: [{ id: 6006, subject: 'vca', type: 'mcq', q: 'ตรวจการคืนเวลาที่เหลือของข้อสอบ', options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' }],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 60,
        questionDeadline: now + 25_000, examStartTime: now - 35_000,
        savedAt: now, mode: 'exam', selectedYear: 4, selectedPhase: '2-final',
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-timer')).toBeVisible();
  const before = await page.locator('.vmx-timer').innerText();
  const [minutes, seconds] = before.split(':').map(Number);
  expect(minutes * 60 + seconds).toBeLessThanOrEqual(25);
  expect(minutes * 60 + seconds).toBeGreaterThan(0);
  await page.clock.install();
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
  await expect(page.locator('.vmx-timer')).toHaveCount(0);
  await expect(page.getByText(/Auto-graded Score|คะแนนตรวจอัตโนมัติ/)).toBeVisible();
});
