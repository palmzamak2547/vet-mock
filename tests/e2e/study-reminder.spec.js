// A daily study reminder: offered once on the result of the first set of a
// day, kept on the connected-apps page; on the web it is a repeating event in
// the student's own calendar, inside the Android app the app's own prompt.
import { test, expect } from './fixtures.js';
import { QB_EXOTIC } from '../../src/data/questions-exotic.js';

test.setTimeout(90_000);
test.use({ reducedMotion: 'reduce' });

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const KEY = new Map(QB_EXOTIC.filter((q) => q.topic === 'bird-infect' && (q.year ?? 4) === 4).map((q) => [norm(q.q), norm(q.options[q.answer])]));

async function seed(context, extra = {}) {
  await context.addInitScript((more) => {
    if (sessionStorage.getItem('__seeded')) return;
    sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    for (const [k, v] of Object.entries(more)) localStorage.setItem(k, v);
  }, extra);
}

async function finishOneSet(page) {
  await page.goto('/app/study');
  await page.locator('[data-subject="exotic"]').click();
  await page.locator('.vmx-topic-main', { hasText: 'โรคติดเชื้อในนก' }).click();
  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  if ((await toggle.getAttribute('aria-checked')) !== 'true') await toggle.click();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('1');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-option').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#main')).toBeFocused();
  const right = KEY.get(norm(await page.locator('.vmx-qtext').innerText()));
  await page.locator('.vmx-option', { hasText: right }).first().click();
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await expect(page.getByText('คะแนนตรวจอัตโนมัติ')).toBeVisible({ timeout: 15_000 });
}

test('the first set of a day offers a daily reminder once; a time fills both calendar links', async ({ page, context }) => {
  await seed(context);
  await finishOneSet(page);
  const offer = page.locator('.vmx-reminder-offer');
  await expect(offer).toContainText('ให้ปฏิทินเตือนทำโจทย์ทุกวันไหม');
  await offer.getByRole('button', { name: '07:00 น.' }).click();
  await expect(offer.getByRole('button', { name: '07:00 น.' })).toHaveAttribute('aria-pressed', 'true');
  const google = new URL(await offer.getByRole('link', { name: 'Google Calendar' }).getAttribute('href'));
  expect(google.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
  // 07:00 in Bangkok is 00:00 UTC.
  expect(google.searchParams.get('dates')).toMatch(/^\d{8}T000000Z\/\d{8}T001500Z$/);
  await expect(offer.getByRole('link', { name: /ปฏิทินอื่น/ })).toHaveAttribute('href', 'https://vetmock.com/api/calendar?study=07%3A00');
  await expect(offer).toContainText('ปฏิทินจะเตือนทุกวันเวลา 07:00 น. แม้วันนั้นทำโจทย์แล้ว');
  // "ไม่ต้อง" ends the offer for good.
  await offer.getByRole('button', { name: 'ไม่ต้อง', exact: true }).click();
  await expect(offer).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('vmx-reminder-offer'))).toBe('no');
});

test('an offer answered before is not shown again', async ({ page, context }) => {
  const yesterday = new Date(); yesterday.setHours(0, 0, 0, 0);
  await seed(context, {
    'vmx-reminder-offer': 'google',
    'vmx-streak': JSON.stringify({ streak: 2, lastDate: yesterday.getTime() - 86400000, freezeUsedAt: null }),
  });
  await finishOneSet(page);
  await expect(page.locator('.vmx-streak-moment')).toContainText('ต่อเนื่อง 3 วัน');
  await expect(page.locator('.vmx-reminder-offer')).toHaveCount(0);
});

test('inside the Android app the offer asks the app, and only on a tap', async ({ page, context }) => {
  await seed(context);
  await context.addInitScript(() => {
    window.__asked = 0;
    window.__reminder = null;
    window.VetMockApp = {
      notifications: { status: () => Promise.resolve('prompt'), request: () => { window.__asked += 1; return Promise.resolve('granted'); } },
      reminders: { set: (r) => { window.__reminder = r; } },
    };
  });
  await finishOneSet(page);
  const offer = page.locator('.vmx-reminder-offer');
  await expect(offer).toContainText('ให้ VetMock เตือนทำโจทย์ทุกวันไหม');
  expect(await page.evaluate(() => window.__asked)).toBe(0);
  await offer.getByRole('button', { name: '07:00 น.' }).click();
  await offer.getByRole('button', { name: 'ให้แอปเตือนเวลา 07:00 น.' }).click();
  await expect(offer).toContainText('แอปจะเตือนทุกวันเวลา 07:00 น.');
  expect(await page.evaluate(() => window.__asked)).toBe(1);
  expect(await page.evaluate(() => window.__reminder)).toEqual({ enabled: true, minute: 420 });
});

test('the connected-apps page keeps the reminder, suggesting the usual study time', async ({ page, context }) => {
  // Three sessions at 21:05 Bangkok (14:05 UTC) in the last two weeks, in any
  // runner's time zone.
  const now = new Date();
  const rows = [1, 2, 3].map((daysAgo, i) => ({
    date: Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo, 14, 5),
    questionId: i + 1, subject: 'exotic', correct: true,
  }));
  await seed(context, { 'vmx-history': JSON.stringify(rows) });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: /โปรไฟล์/ }).first().click();
  await page.getByRole('button', { name: /เชื่อมแอป/ }).first().click();
  const card = page.locator('article.vmx-conn-card', { hasText: 'เตือนทำโจทย์ทุกวัน' });
  await expect(card).toContainText('ราว 21:00 น.');
  await expect(card.getByRole('button', { name: '21:00 น.' })).toHaveAttribute('aria-pressed', 'true');
});
