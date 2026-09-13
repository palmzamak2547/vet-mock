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
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null, questions: [{ id: 6006, subject: 'vca', type: 'mcq', q: 'ตรวจการคืนเวลาที่เหลือของข้อสอบ', options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' }],
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

// The whole point of the session clock: moving between questions must not buy
// more time. Under the old per-question clock, stepping forward and back
// refilled the budget, so an "exam" could be held open indefinitely.
test('an exam clock is a budget for the paper, not a refill per question', async ({ page }) => {
  await page.route(/\/_vercel\/(insights|speed-insights)\/script\.js/, (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('session-clock-fixture')) {
      sessionStorage.setItem('session-clock-fixture', '1');
      const now = Date.now();
      const q = (id, text) => ({ id, subject: 'vca', type: 'mcq', q: text, options: ['A', 'B', 'C'], answer: 1, explain: 'ตัวอย่างสำหรับตรวจการทำงานของเวลา' });
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null,
        questions: [q(6101, 'ข้อแรกของชุดจับเวลารวม'), q(6102, 'ข้อสองของชุดจับเวลารวม')],
        answers: {}, currentIdx: 0, useTimer: true, timePerQ: 60,
        // 40s left of a two-question paper: less than one question's 60s, so a
        // refill on navigation would be unmistakable.
        questionDeadline: now + 40_000, examStartTime: now - 80_000,
        savedAt: now, mode: 'exam', clock: 'session', selectedYear: 4, selectedPhase: '2-final',
      }));
    }
  });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const timer = page.locator('.vmx-timer');
  await expect(timer).toBeVisible();

  const readSeconds = async () => {
    const [m, s] = (await timer.innerText()).split(':').map(Number);
    return m * 60 + s;
  };
  const atStart = await readSeconds();
  expect(atStart).toBeLessThanOrEqual(40);
  expect(atStart).toBeGreaterThan(0);

  // Forward, then back. Either move used to hand out a fresh 60 seconds.
  await page.getByRole('button', { name: /ถัดไป|Next/ }).first().click();
  const afterNext = await readSeconds();
  expect(afterNext).toBeLessThanOrEqual(atStart);

  await page.getByRole('button', { name: /ก่อนหน้า|Previous|ย้อนกลับ/ }).first().click();
  const afterPrev = await readSeconds();
  expect(afterPrev).toBeLessThanOrEqual(atStart);

  // And when it runs out it ends the paper where they stand, rather than
  // carrying them to the next question with a new budget.
  await page.clock.install();
  await page.clock.setSystemTime(Date.now() + 120_000);
  await page.clock.runFor(1100);
  await expect(timer).toHaveCount(0);
  await expect(page.getByText(/Auto-graded Score|คะแนนตรวจอัตโนมัติ/)).toBeVisible();
});
