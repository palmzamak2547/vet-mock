import { test, expect, PINNED_NOW } from './fixtures.js';
import summary from '../../src/data/video-summary-clips/WRttiWQ7D9s.js';
import { parseLocalExtras } from '../../src/lib/local-extras.js';

const pin = { id: 1, type: 'summary', label: 'พินสรุปเก่าที่ต้องกลับไปอ่าน', addedAt: 1,
  payload: { videoId: summary.videoId, subject: summary.subject,
    title: 'ชื่อจากพินที่ไม่ใช่สรุปต้นฉบับ', summary: 'PIN-SPOOF-NOT-CANONICAL' } };
const bodyModule = /\/assets\/WRttiWQ7D9s-[^/]+\.js(?:\?.*)?$/;
const playback = /https:\/\/(?:[^/]+\.)?youtube(?:-nocookie)?\.com\/(?:iframe_api|embed\/)/;

test.use({ reducedMotion: 'reduce', pinCalendar: false });
test.beforeEach(async ({ page }) => {
  // This clock keeps flowing across the explicit recovery reload, so the
  // freshly written ticket does not appear future-dated in the new document.
  await page.clock.install({ time: new Date(PINNED_NOW) });
  expect(parseLocalExtras({ format: 'vetmock-local-extras-v1', data: { 'vmx-pinboard': [pin] } }).success).toBe(true);
  await page.addInitScript(pin => {
    if (localStorage.getItem('pinboard-summary-seeded')) return;
    localStorage.setItem('pinboard-summary-seeded', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([pin]));
  }, pin);
  await page.route(/https:\/\/(?:[^/]+\.)?(?:youtube(?:-nocookie)?\.com|ytimg\.com)\//, route => route.abort());
  await page.route('**/api/playlist?*', route => route.fulfill({ json: { items: [] } }));
});

test('a saved summary pin opens its authored reader without a video player', async ({ page }) => {
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  const reader = page.locator('.vmx-summary-modal');
  const playbackRequests = [];
  page.on('request', request => { if (playback.test(request.url())) playbackRequests.push(request.url()); });
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  await expect(card).toHaveCount(1);
  const moduleResponse = page.waitForResponse(response => bodyModule.test(response.url()));
  await card.click();
  expect((await moduleResponse).ok()).toBe(true);
  await expect(reader).toBeVisible();
  await expect(page.locator('#vmx-summary-title')).toHaveText(summary.title);
  await expect(reader.locator('.vmx-summary-body')).toContainText('ante-mortem');
  await expect(reader).not.toContainText(pin.payload.summary);
  await expect(page.getByRole('button', { name: 'ปิดเครื่องเล่นวิดีโอ', exact: true })).toHaveCount(0);
  await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
  expect(playbackRequests).toEqual([]);
});

test('a failed summary body request offers explicit reload into the same authored reader', async ({ page }) => {
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  const reader = page.locator('.vmx-summary-modal');
  const playbackRequests = [];
  page.on('request', request => { if (playback.test(request.url())) playbackRequests.push(request.url()); });
  let fail = true, failedRequests = 0, successfulRequests = 0;
  await page.route(bodyModule, route => {
    if (fail) { failedRequests++; return route.abort('failed'); }
    successfulRequests++;
    return route.continue();
  });
  await page.addInitScript(() => { window.__summaryReturnDocument = crypto.randomUUID(); });
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  const originalDocument = await page.evaluate(() => window.__summaryReturnDocument);
  const savedPin = await page.evaluate(() => localStorage.getItem('vmx-pinboard'));
  await card.click();
  await expect(reader).toBeVisible();
  await expect(page.locator('#vmx-summary-title')).toHaveText(summary.title);
  await expect(reader.locator('.vmx-summary-body')).toContainText('โหลดสรุปคลิปไม่สำเร็จ');
  await expect(reader.locator('.vmx-summary-body')).toContainText('โหลดหน้าใหม่เพื่อเปิดสรุปนี้อีกครั้ง');
  expect(failedRequests).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__summaryReturnDocument)).toBe(originalDocument);
  await expect(page.getByRole('button', { name: 'ปิดเครื่องเล่นวิดีโอ', exact: true })).toHaveCount(0);
  await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
  fail = false;
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.getByRole('button', { name: 'โหลดหน้าใหม่แล้วเปิดสรุป', exact: true }).click(),
  ]);
  expect(await page.evaluate(() => window.__summaryReturnDocument)).not.toBe(originalDocument);
  expect(await page.evaluate(() => localStorage.getItem('vmx-pinboard'))).toBe(savedPin);
  await expect(reader.locator('.vmx-summary-body')).toContainText('ante-mortem');
  await expect(page.locator('#vmx-summary-title')).toHaveText(summary.title);
  expect(successfulRequests).toBeGreaterThan(0);
  await expect(reader).not.toContainText('โหลดสรุปคลิปไม่สำเร็จ');
  await expect(page.getByRole('button', { name: 'ปิดเครื่องเล่นวิดีโอ', exact: true })).toHaveCount(0);
  await expect(page.locator('iframe[src*="youtube"]')).toHaveCount(0);
  expect(playbackRequests).toEqual([]);
});
