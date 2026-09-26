import { test, expect } from './fixtures.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    window.__documentIdentity = crypto.randomUUID();
  });
  await page.route(/\/_vercel\/(?:insights|speed-insights)\/script\.js/, route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route(/\/rest\/v1\/library_docs(?:\?|$)/, route => route.fulfill({ json: [], headers: { 'access-control-allow-origin': '*' } }));
});

test('a feedback draft survives update signals, tab hiding, stale imports and subsequent navigation', async ({ page }) => {
  await page.goto('/app/feedback');
  const draft = page.locator('#vmx-feedback-message');
  await draft.fill('ยังเขียนไม่เสร็จ ขอเก็บข้อความนี้ไว้');
  const identity = await page.evaluate(() => window.__documentIdentity);
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('vmx-sw-update', { detail: { reason: 'service-worker', version: 'next' } }));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new CustomEvent('vite:preloadError', { cancelable: true, detail: {} }));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(draft).toHaveValue('ยังเขียนไม่เสร็จ ขอเก็บข้อความนี้ไว้');
  await expect(page.locator('.vmx-update-notice')).toHaveCount(0);
  await page.getByRole('button', { name: '← หน้าแรก', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
});

test('an actually failed optional chunk leaves the draft intact and its retry can be dismissed', async ({ page }) => {
  let chunkFailed = false;
  await page.route(/\/assets\/VetCalculator-[^/]+\.js/, route => { chunkFailed = true; return route.abort(); });
  await page.goto('/app/feedback');
  const draft = page.locator('#vmx-feedback-message');
  await draft.fill('เก็บงานไว้ก่อน ลองเครื่องคิดเลขภายหลัง');
  const identity = await page.evaluate(() => window.__documentIdentity);
  await page.evaluate(() => dispatchEvent(new Event('vmx-open-vetcalc')));
  const retry = page.getByRole('dialog').filter({ hasText: 'โหลดเครื่องคิดเลขไม่ได้' });
  await expect(retry).toBeVisible();
  await retry.getByRole('button', { name: 'ปิด', exact: true }).click();
  await expect(draft).toHaveValue('เก็บงานไว้ก่อน ลองเครื่องคิดเลขภายหลัง');
  expect(chunkFailed).toBe(true);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
});

test('a missing view chunk offers an explicit retry on a narrow screen without an automatic reload', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.route(/\/assets\/AboutView-[^/]+\.js/, route => route.abort());
  await page.goto('/app/about');
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'โหลดหน้านี้ใหม่', exact: true })).toBeVisible();
  expect(await page.evaluate(() => performance.getEntriesByType('navigation')[0].type)).toBe('navigate');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath('chunk-retry-mobile.png') });
});

test('choosing notes from the palette while already choosing a subject changes the intent in place', async ({ page }) => {
  await page.goto('/app/study');
  await expect(page.getByRole('textbox', { name: 'ค้นหาวิชา' })).toBeVisible();
  const historyLength = await page.evaluate(() => history.length);
  await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  await page.getByRole('textbox', { name: 'ค้นหาใน VetMock' }).fill('สรุปบทเรียน');
  // The ask-the-corpus button repeats the query and appears before results.
  // Select the actual Quick Action, rather than asking about its label.
  await page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' })
    .getByRole('button', { name: /^📓 สรุปบทเรียน สรุปจากสไลด์/ }).click();
  await expect(page.getByText('เลือกวิชาเพื่ออ่านสรุปจากสไลด์ พร้อมแหล่งอ้างอิงในแต่ละส่วน', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  // A subsequent practice request has no reading intent and must clear it.
  await page.evaluate(() => dispatchEvent(new CustomEvent('vmx-view-intent', { detail: { view: 'subject-select' } })));
  await expect(page.getByText('ฝึกแบบเลือกจำนวน — สุ่มข้อสอบตามจำนวนที่เลือก', { exact: true })).toBeVisible();
});

test('returning from Notes keeps the resources tab that opened it', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
  });
  await page.goto('/');
  await page.locator('.vmx-subject-card').filter({ hasText: /COM V/ }).first().click();
  await page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ' }).click();
  await page.locator('.vmx-mode-card').filter({ hasText: 'สรุปบทเรียน' }).click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible();
  await page.getByRole('button', { name: /ย้อนกลับ|หัวข้อ|topic/ }).first().click();
  await expect(page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ' })).toHaveAttribute('aria-selected', 'true');
});

test('standalone Atlas does not add an update banner or replace the active document', async ({ page }) => {
  await page.goto('/app/atlas');
  await expect(page.locator('.vmx-atlas-view')).toBeVisible();
  const identity = await page.evaluate(() => window.__documentIdentity);
  await page.evaluate(() => dispatchEvent(new CustomEvent('vmx-sw-update', { detail: { state: 'ready', reason: 'service-worker' } })));
  await expect(page.getByRole('button', { name: 'อัปเดตตอนนี้', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
});

test('an explicit library intent replaces conflicting old filters without replacing the document', async ({ page }) => {
  await page.goto('/app/library?q=old&subject=old-subject&kind=slide&semester=2&ay=2025');
  const input = page.getByRole('searchbox', { name: 'ค้นหาเอกสารในคลัง' });
  await expect(input).toHaveValue('old');
  // Exercise the mounted shelf before injecting an intent. Its initial input
  // value can paint before passive effects have installed the event listener.
  await input.fill('old search');
  await expect(page).toHaveURL(/q=old\+search/);
  const identity = await page.evaluate(() => window.__documentIdentity);
  await page.evaluate(() => {
    sessionStorage.setItem('vmx-library-subject', 'equine-medicine');
    dispatchEvent(new CustomEvent('vmx-view-intent', { detail: { view: 'library' } }));
  });
  await expect(input).toHaveValue('');
  await expect(page).toHaveURL(/\/app\/library\?subject=equine-medicine$/);
  expect(await page.evaluate(() => window.__documentIdentity)).toBe(identity);
  expect(await page.evaluate(() => sessionStorage.getItem('vmx-library-subject'))).toBeNull();
});
