import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });
const difficultyChunk = /\/assets\/question-difficulty\.generated-[^/]+\.js(?:\?.*)?$/;

async function seed(page, parked = false) {
  await page.addInitScript(({ parked }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    if (parked) localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, sessionId: '595de50e-e8d0-45a1-ad1b-4102161e867d',
      questions: [{ id: 60100, subject: 'equine-medicine', year: 5, type: 'mcq',
        q: 'ชุดเดิมที่ยังทำค้าง', options: ['A', 'B'], answer: 0 }], answers: { 60100: 1 },
      currentIdx: 0, useTimer: false, mode: 'quick', submitted: false,
      selectedYear: 5, selectedPhase: '1-mid', savedAt: Date.now(),
    }));
  }, { parked });
}

async function adaptiveConfig(page) {
  await page.goto('/app');
  await page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ }).click();
  await page.getByRole('button', { name: 'ปรับระดับ', exact: true }).click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('1');
}

test('a late adaptive chunk cannot reopen an exam after leaving its configuration', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await seed(page);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let intercepted = false;
  await page.route(difficultyChunk, async route => {
    const response = await route.fetch();
    const body = await response.text();
    intercepted = true;
    await gate;
    await route.fulfill({ response, body: `${body}\nwindow.__vmxDifficultyExecuted = true;` });
  });
  await adaptiveConfig(page);
  await page.getByRole('button', { name: /^เริ่มฝึก/ }).click();
  await expect.poll(() => intercepted).toBe(true);
  await page.getByRole('button', { name: '← หน้าแรก', exact: true }).click();
  await expect(page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ })).toBeVisible();
  release();
  await expect.poll(() => page.evaluate(() => window.__vmxDifficultyExecuted)).toBe(true);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ })).toBeVisible();
  await expect(page.locator('.vmx-question-card')).toHaveCount(0);

  await page.getByRole('button', { name: /^ฝึกตามสไลด์ปัจจุบัน / }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
  await expect(page.locator('.vmx-timer')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('failed adaptive loading preserves a parked set and ordinary practice remains available', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await seed(page, true);
  await page.route(difficultyChunk, route => route.fulfill({ status: 503, contentType: 'text/javascript', body: 'Unavailable' }));
  await adaptiveConfig(page);
  await page.getByRole('button', { name: /^เริ่มฝึก/ }).click();
  await page.getByRole('button', { name: 'เริ่มชุดใหม่ ทิ้งชุดเดิม', exact: true }).click();
  const notice = page.getByRole('dialog').filter({ hasText: 'ยังโหลดข้อมูลสำหรับชุดปรับระดับไม่สำเร็จ' });
  await expect(notice).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-inflight-exam:guest'))?.answers?.[60100])).toBe(1);
  await notice.getByRole('button', { name: 'เข้าใจแล้ว', exact: true }).click();
  await page.getByRole('button', { name: 'สุ่มทั่วไป', exact: true }).click();
  await page.getByRole('button', { name: /^เริ่มฝึก/ }).click();
  await page.getByRole('button', { name: 'เริ่มชุดใหม่ ทิ้งชุดเดิม', exact: true }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
  await expect(page.locator('.vmx-progress')).toContainText('1 / 1');
  expect(errors).toEqual([]);
});
