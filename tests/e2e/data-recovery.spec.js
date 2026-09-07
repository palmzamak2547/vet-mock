import { test, expect } from '@playwright/test';
test.use({ serviceWorkers: 'block' });

async function seedRecovery(page, failure) {
  await page.addInitScript(({ failure }) => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (!sessionStorage.getItem('recovery-fixture')) {
      sessionStorage.setItem('recovery-fixture', '1');
      sessionStorage.setItem('fail-save', failure);
      localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
        ownerId: null, sessionId: '62e266ae-cafe-4b1f-a9ba-fffb8ee007e4',
        questions: [{ id: 6011, subject: 'vca', year: 4, type: 'mcq', q: 'ตรวจการกู้คำตอบที่ส่งแล้ว', options: ['A', 'B', 'C'], answer: 1 }],
        answers: { 6011: 1 }, currentIdx: 0, useTimer: false, mode: 'quick',
        submitted: true, localSaved: false, detailsSaved: false, submittedAt: Date.now(), savedAt: Date.now(),
        selectedYear: 4, selectedPhase: '2-final',
      }));
    }
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && key.startsWith('vmx-user-') && sessionStorage.getItem('fail-save') === 'core') {
        throw new DOMException('Fixture quota', 'QuotaExceededError');
      }
      return write.call(this, key, value);
    };
    const transaction = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function(...args) {
      if (this.name === 'vmx-study-events-v1' && args[1] === 'readwrite' && sessionStorage.getItem('fail-save') === 'details') {
        throw new DOMException('Fixture quota', 'QuotaExceededError');
      }
      return transaction.apply(this, args);
    };
  }, { failure });
}
for (const failure of ['core', 'details']) {
  test(`submitted answers survive reload when ${failure} storage fails`, async ({ page }) => {
    await seedRecovery(page, failure);
    await page.goto('/app');
    await page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ }).click();
    await expect(page.locator('[aria-label="สถานะการบันทึกผลสอบ"]')).toContainText(/ยัง.*ไม่ได้/);
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-inflight-exam:guest'))?.answers?.[6011])).toBe(1);
    await page.reload();
    await expect(page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ })).toBeVisible();
    await page.evaluate(() => sessionStorage.setItem('fail-save', 'off'));
    await page.getByRole('button', { name: /กู้ผลชุดที่ยังบันทึกไม่สำเร็จ/ }).click();
    await expect(page.getByText(/Auto-graded Score|คะแนนตรวจอัตโนมัติ/)).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('vmx-inflight-exam:guest'))).toBe(null);
    const stored = await page.evaluate(async () => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('vmx-study-events-v1'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
      });
      return new Promise(resolve => { const request = db.transaction('events').objectStore('events').getAll(); request.onsuccess = () => resolve(request.result.map(row => row.event.answer)); });
    });
    expect(stored).toEqual([1]);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-history')).filter(row => row.questionId === 6011).length)).toBe(1);
  });
}

test('privacy choice persists and daily time plan remains usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/app/privacy');
  await expect(page.getByRole('heading', { name: /ข้อมูลและ.*ความเป็นส่วนตัว/ })).toBeVisible();
  await page.getByRole('button', { name: 'ใช้เฉพาะที่จำเป็น' }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-consent')))).toBe('essential');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
