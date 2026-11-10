import { test, expect, PINNED_NOW, openAdjust } from './fixtures.js';
import { ladderPreset } from '../../src/lib/practice-ladder.js';
import { initCard } from '../../src/hooks/sm2.js';

// The app decides for the student (src/lib/decide.js, docs/DECIDE-FOR-STUDENT.md):
// a topic opens ready to start with one line of what was set up and why, the
// review planner starts in one tap, and the first run goes from the year to
// Home with the timetable's paper. Every option waits under one disclosure.

test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

function seedYear(context, year = '4') {
  return context.addInitScript((y) => {
    try {
      window.localStorage.setItem('vmx-selected-year', y);
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    } catch {}
  }, year);
}

/** The subject's topic card: its label ends with the topic's count, the count a set is drawn from. */
async function openTopic(page) {
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  const topic = page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT });
  await expect(topic).toBeVisible({ timeout: 20_000 });
  const label = (await topic.getAttribute('aria-label')) || (await topic.innerText());
  const available = Number((label.match(/([\d,]+)\s*ข้อ/) || [])[1]?.replace(/,/g, ''));
  expect(available, 'the topic card names its count').toBeGreaterThan(0);
  await topic.click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  return available;
}

test('a topic tap shows what was set up and starts in one tap, the same set as before', async ({ page, context }) => {
  await seedYear(context);
  const available = await openTopic(page);
  // What a topic tap has always made: rung 1 of the ladder, capped to the topic.
  const expected = ladderPreset('understand', { available }).numQuestions;

  await expect(page.locator('#vmx-config-summary')).toHaveText(`จัดให้แล้ว: ${expected} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.locator('.vmx-decide-why')).toHaveText(/^เริ่มขั้นแรก ข้อง่ายก่อน เห็นเฉลยทุกข้อ/);
  const adjust = page.getByRole('button', { name: 'ปรับเอง', exact: true });
  await expect(adjust).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ })).toBeHidden();
  await expect(page.getByRole('switch', { name: /เฉลยทันที/ })).toBeHidden();

  await page.getByRole('button', { name: `เริ่มฝึก ${expected} ข้อ →`, exact: true }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-progress')).toContainText(`1 / ${expected}`);
});

test('a changed row is remembered as the student\'s own, and กลับไปใช้ค่าที่จัดให้ restores', async ({ page, context }) => {
  await seedYear(context);
  const available = await openTopic(page);
  const expected = ladderPreset('understand', { available }).numQuestions;
  const own = Math.max(1, Math.min(available, expected) - 1);

  await openAdjust(page);
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(own));
  await expect(page.getByRole('button', { name: `เริ่มฝึก ${own} ข้อ →`, exact: true })).toBeVisible();

  // Back to the topics and in again: the next visit follows the student.
  await page.getByRole('button', { name: '← เลือกหัวข้อ', exact: true }).click();
  await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
  await expect(page.locator('#vmx-config-summary')).toHaveText(`ตั้งไว้แล้ว: ${own} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.locator('.vmx-decide-why')).toHaveText('ตามที่คุณตั้งไว้');
  // The disclosure's open state is kept on this device.
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('button', { name: 'กลับไปใช้ค่าที่จัดให้', exact: true }).click();
  await expect(page.locator('#vmx-config-summary')).toHaveText(`จัดให้แล้ว: ${expected} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.getByRole('button', { name: 'กลับไปใช้ค่าที่จัดให้', exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('vmx-decide:practice.setup'))).toBeNull();
  await page.getByRole('button', { name: `เริ่มฝึก ${expected} ข้อ →`, exact: true }).click();
  await expect(page.locator('.vmx-progress')).toContainText(`1 / ${expected}`, { timeout: 30_000 });
});

test('an exam keeps its rows in view', async ({ page, context }) => {
  await seedYear(context);
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  await page.getByRole('tab', { name: /สื่อเรียนและโหมดสอบ/ }).click();
  await page.getByRole('button', { name: /สอบจริง/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*โหมดสอบ/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveCount(0);
  await expect(page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ })).toBeVisible();
});

test('the first run lands on Home with the timetable\'s paper, and เปลี่ยน still changes it', async ({ page }) => {
  await page.goto('/app/year', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /ปี 5 LIVE/ }).click();
  // 25 Sep 18:15 (the pinned day): year 5 has sat its midterms, the final is ahead.
  await expect(page.locator('.vmx-subject-scope-why')).toHaveText('ตามตารางสอบ', { timeout: 20_000 });
  await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 ปลาย');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-selected-phase')))).toBe('1-final');
  await page.getByRole('button', { name: 'เปลี่ยนช่วงสอบ (Phase)' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ช่วงสอบ/ })).toBeVisible();
});

test.describe('own clock', () => {
  test.use({ pinCalendar: false });

  test('with no paper still to come, the year still asks for the phase', async ({ page }) => {
    // 20 Dec 2026: every paper of the term sat, the next term's table not in.
    await page.clock.setFixedTime(new Date('2026-12-20T10:00:00+07:00'));
    await page.goto('/app/year', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /ปี 5 LIVE/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ช่วงสอบ/ })).toBeVisible();
  });
});

test('the review planner says what today is and starts in one tap', async ({ page }) => {
  const now = Date.parse(PINNED_NOW);
  const card = { id: 9_100_101, type: 'flashcard', subject: 'epidemiology',
    front: 'การ์ดทดสอบการทบทวนวันนี้', q: 'การ์ดทดสอบการทบทวนวันนี้', back: 'คำตอบของการ์ดทดสอบ' };
  const srCards = { [card.id]: { ...initCard(card.id), totalReviews: 1, repetitions: 1, interval: 1,
    lastReview: now - 4 * 86400000, nextReview: now - 2 * 86400000 } };
  await page.addInitScript(({ srCards, card }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-user-flashcards', JSON.stringify([card]));
  }, { srCards, card });
  await page.goto('/app/review');

  await expect(page.locator('#vmx-srs-summary')).toContainText('จัดให้แล้ว: 1 ใบ, ปี 5, ทุกวิชา');
  await expect(page.locator('.vmx-decide-why')).toHaveText('ใบที่ค้างนานสุดมาก่อน ทีละ 25 ใบพอดีกับหนึ่งวัน');
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('group', { name: 'จำนวนวันนี้', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.getByText(card.front, { exact: true })).toBeVisible({ timeout: 20_000 });
});
