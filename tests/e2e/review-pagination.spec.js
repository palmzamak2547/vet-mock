import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });

async function openReview(page, withoutObserver = false) {
  await page.addInitScript(({ withoutObserver }) => {
    if (withoutObserver) window.IntersectionObserver = undefined;
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const questions = Array.from({ length: 80 }, (_, index) => ({
      id: 60100 + index, subject: 'vca', year: 4, type: 'mcq',
      q: `ตรวจรายการเฉลยข้อ ${index + 1}`, options: ['คำตอบถูก', 'คำตอบผิด'], answer: 0,
    }));
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '482d5d3f-1390-4e16-9dfb-a2b4b0349d40', questions,
      answers: Object.fromEntries(questions.map((q, index) => [q.id, index < 40 ? 1 : 0])),
      currentIdx: 79, useTimer: false, mode: 'quick', selectedYear: 4, selectedPhase: '2-final',
      submitted: true, localSaved: false, detailsSaved: false,
      submittedAt: Date.now(), savedAt: Date.now(),
    }));
  }, { withoutObserver });
  await page.goto('/app');
  await page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ }).click();
  await page.getByRole('button', { name: 'ดูเฉลย', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'เฉลย ข้อสอบ', exact: true })).toBeVisible();
}

test('review keeps loading after equal-size filters replace a completed list', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openReview(page);
  const rows = page.locator('.vmx-review-item');
  const tail = page.getByText(/กำลังโหลด \d+ ข้อถัดไป…/);
  await expect(rows).toHaveCount(30);
  await tail.scrollIntoViewIfNeeded();
  await expect(rows).toHaveCount(40);
  await expect(page.getByRole('heading', { name: 'ตรวจรายการเฉลยข้อ 40', exact: true })).toBeVisible();

  for (const [label, last] of [['ถูก', 80], ['ผิด', 40]]) {
    await page.getByRole('button', { name: new RegExp(`^${label}\\s*40$`) }).click();
    await expect(rows).toHaveCount(30);
    await tail.scrollIntoViewIfNeeded();
    await expect(rows).toHaveCount(40);
    await expect(page.getByRole('heading', { name: `ตรวจรายการเฉลยข้อ ${last}`, exact: true })).toBeVisible();
  }

  await page.getByRole('button', { name: /^ทั้งหมด\s*80$/ }).click();
  await expect(rows).toHaveCount(30);
  await tail.scrollIntoViewIfNeeded();
  await expect(rows).toHaveCount(60);
  await tail.scrollIntoViewIfNeeded();
  await expect(rows).toHaveCount(80);
  await expect(tail).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('review exposes every row when IntersectionObserver is unavailable', async ({ page }) => {
  await openReview(page, true);
  await expect(page.locator('.vmx-review-item')).toHaveCount(40);
  await page.getByRole('button', { name: /^ถูก\s*40$/ }).click();
  await expect(page.locator('.vmx-review-item')).toHaveCount(40);
  await page.getByRole('button', { name: /^ทั้งหมด\s*80$/ }).click();
  await expect(page.locator('.vmx-review-item')).toHaveCount(80);
  await expect(page.getByText(/กำลังโหลด \d+ ข้อถัดไป…/)).toHaveCount(0);
});
