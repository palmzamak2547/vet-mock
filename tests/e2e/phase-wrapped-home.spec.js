// The day after a phase ends, Home offers its recap only to a student who has
// something to recap. On 26 Sep 2026 the card replaced the welcome card (tour
// launcher, Mochi) for everyone, including a student with no history.
import { test, expect } from './fixtures.js';

const AFTER_MIDTERM = new Date('2026-09-27T10:00:00+07:00');

async function seed(context, history) {
  await context.addInitScript((rows) => {
    try {
      localStorage.setItem('vmx-seen-landing', '1');
      localStorage.setItem('vmx-selected-year', '5');
      localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      localStorage.removeItem('vmx-welcome-dismissed');
      localStorage.removeItem('vmx-onboarding-seen');
      if (rows) localStorage.setItem('vmx-history', JSON.stringify(rows));
    } catch {}
  }, history);
}

test('a student with no history keeps the welcome card after the midterm ends', async ({ page, context }) => {
  await seed(context, null);
  await page.clock.setFixedTime(AFTER_MIDTERM);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'เปิดคำแนะนำการใช้งาน' })).toBeVisible();
  await expect(page.getByText('สรุปผลการเรียนประจำเทอม')).toHaveCount(0);
});

test('a student who practised during the midterm is offered the recap', async ({ page, context }) => {
  await seed(context, [
    { date: '2026-09-20T20:00:00+07:00', questionId: 6011, correct: true, subject: 'zoonoses', year: 5, phase: '1-mid' },
  ]);
  await page.clock.setFixedTime(AFTER_MIDTERM);
  await page.goto('/');
  await expect(page.getByText('สรุปผลการเรียนประจำเทอม')).toBeVisible();
  await expect(page.getByRole('button', { name: 'ดูสรุปการเรียนของเทอมที่จบ' })).toBeVisible();
});
