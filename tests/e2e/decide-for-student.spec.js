import { test, expect, PINNED_NOW, openAdjust, openHomeModes } from './fixtures.js';
import { ladderPreset } from '../../src/lib/practice-ladder.js';
import { initCard } from '../../src/hooks/sm2.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';

// The app decides for the student (src/lib/decide.js, docs/DECIDE-FOR-STUDENT.md):
// a topic opens ready to start with one line of what was set up and why, the
// review planner starts in one tap, and the first run goes from the year to
// Home with the timetable's paper. Every option waits under one disclosure.

test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';
const NOW = Date.parse(PINNED_NOW);

await loadQB();
// A year-5 bank question a flashcard can review: Home counts its due card.
const dueQuestion = QB.find((q) => q.year === 5 && isQuestionDeliverable(q) && isFlashcardCompatible(q));
if (!dueQuestion) throw new Error('fixture needs a year-5 flashcard question');
const dueCard = (id) => ({ [id]: { ...initCard(id), totalReviews: 1, repetitions: 1, interval: 1,
  lastReview: NOW - 4 * 86400000, nextReview: NOW - 2 * 86400000 } });

function seed(context, { year = '4', extra = {} } = {}) {
  return context.addInitScript(({ y, extra }) => {
    try {
      window.localStorage.setItem('vmx-selected-year', y);
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      // Seeded once: a reload must read what the app saved, not the seed again.
      if (!window.sessionStorage.getItem('decide-seeded')) {
        window.sessionStorage.setItem('decide-seeded', '1');
        for (const [k, v] of Object.entries(extra)) window.localStorage.setItem(k, v);
      }
    } catch {}
  }, { y: year, extra });
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
  await seed(context);
  const available = await openTopic(page);
  // What a topic tap has always made: rung 1 of the ladder, capped to the topic.
  const expected = ladderPreset('understand', { available }).numQuestions;

  await expect(page.locator('#vmx-config-summary')).toHaveText(`จัดให้แล้ว: ${expected} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.locator('.vmx-decide-why')).toHaveText(/^เริ่มขั้นแรก ข้อที่น่าจะง่ายมาก่อน เห็นเฉลยทุกข้อ/);
  const adjust = page.getByRole('button', { name: 'ปรับเอง', exact: true });
  await expect(adjust).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ })).toBeHidden();
  await expect(page.getByRole('switch', { name: /เฉลยทันที/ })).toBeHidden();

  await page.getByRole('button', { name: `เริ่มฝึก ${expected} ข้อ →`, exact: true }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-progress')).toContainText(`1 / ${expected}`);
});

test('a changed row is remembered as the student\'s own, and กลับไปใช้ค่าที่จัดให้ restores', async ({ page, context }) => {
  await seed(context);
  const available = await openTopic(page);
  const expected = ladderPreset('understand', { available }).numQuestions;
  const own = Math.max(1, Math.min(available, expected) - 1);

  await openAdjust(page);
  // B7: open, the start bar comes after the rows and a phone keeps it stuck in thumb reach.
  const bar = page.locator('.vmx-config-actions');
  // In the document after the rows (a stuck bar's box is where it sticks, not where it sits).
  expect(await bar.evaluate((el) => Boolean(document.getElementById('vmx-config-adjust').compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  if ((page.viewportSize()?.width ?? 1280) <= 640) {
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
  }
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(own));
  await expect(page.getByRole('button', { name: `เริ่มฝึก ${own} ข้อ →`, exact: true })).toBeVisible();

  // Back to the topics and in again: the next visit follows the student.
  await page.getByRole('button', { name: '← เลือกหัวข้อ', exact: true }).first().click();
  await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
  await expect(page.locator('#vmx-config-summary')).toHaveText(`ตั้งไว้แล้ว: ${own} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.locator('.vmx-decide-why')).toContainText('ตามที่คุณตั้งไว้');
  // The disclosure's open state is kept on this device.
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'true');

  // B12: the restore sits beside its reason, and the start takes the focus after it.
  const restore = page.locator('.vmx-decide-why').getByRole('button', { name: 'กลับไปใช้ค่าที่จัดให้', exact: true });
  await restore.click();
  await expect(page.locator('#vmx-config-summary')).toHaveText(`จัดให้แล้ว: ${expected} ข้อ, ไม่จับเวลา, เฉลยทันทีรายข้อ`);
  await expect(page.getByRole('button', { name: 'กลับไปใช้ค่าที่จัดให้', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: `เริ่มฝึก ${expected} ข้อ →`, exact: true })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('vmx-decide:practice.setup'))).toBeNull();
  await page.getByRole('button', { name: `เริ่มฝึก ${expected} ข้อ →`, exact: true }).click();
  await expect(page.locator('.vmx-progress')).toContainText(`1 / ${expected}`, { timeout: 30_000 });
});

test('Home\'s free-practice card opens with its rows, and what is set there is not remembered for topics', async ({ page, context }) => {
  await seed(context);
  await page.goto('/app');
  await openHomeModes(page);
  await page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  // B4: a fresh session's clock is on (App's default), so the app did not decide this set.
  await expect(page.locator('#vmx-config-summary')).toHaveText(/^ชุดนี้:/);
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('7');
  expect(await page.evaluate(() => localStorage.getItem('vmx-decide:practice.setup'))).toBeNull();
});

test('an exam keeps its rows in view', async ({ page, context }) => {
  await seed(context);
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();
  await page.getByRole('tab', { name: /สื่อเรียนและโหมดสอบ/ }).click();
  await page.getByRole('button', { name: /สอบจริง/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*โหมดสอบ/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveCount(0);
  await expect(page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ })).toBeVisible();
  // B2: stepping down to rung 1 keeps the strip just tapped on screen.
  await page.getByRole('button', { name: /ทำความเข้าใจ/ }).click();
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: /ทำความเข้าใจ/ })).toBeVisible();
});

test('the first run lands on Home with the timetable\'s paper, and เปลี่ยน still changes it', async ({ page }) => {
  await page.goto('/app/year', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /ปี 5 LIVE/ }).click();
  // 25 Sep 18:15 (the pinned day): year 5 has sat its midterms, the final is ahead.
  await expect(page.locator('.vmx-subject-scope-why')).toHaveText('ตามตารางสอบ', { timeout: 20_000 });
  await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 ปลาย');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-selected-phase')))).toBe('1-final');

  // A11: the phase screen still works as a screen: the timetable's paper is
  // recommended, the bottom nav steps aside, and a hand pick is the student's.
  await page.getByRole('button', { name: 'เปลี่ยนช่วงสอบ (Phase)' }).click();
  await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ช่วงสอบ/ })).toBeVisible();
  await expect(page.getByText('แนะนำ', { exact: true })).toBeVisible();
  await expect(page.locator('.vmx-bottom-nav')).toHaveCount(0);
  await page.getByRole('button', { name: /เทอม 1 กลางภาค/ }).click();
  await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 กลาง', { timeout: 20_000 });
  // A10: a paper picked by hand is never said to be the timetable's.
  await expect(page.locator('.vmx-subject-scope-why')).toHaveCount(0);
});

test.describe('own clock', () => {
  test.use({ pinCalendar: false });

  test('with no paper still to come, the year still asks, and the pick there is the student\'s', async ({ page }) => {
    // 20 Dec 2026: every paper of the term sat, the next term's table not in.
    await page.clock.setFixedTime(new Date('2026-12-20T10:00:00+07:00'));
    await page.goto('/app/year', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /ปี 5 LIVE/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*ช่วงสอบ/ })).toBeVisible();
    await page.getByRole('button', { name: /เทอม 1 ปลายภาค/ }).click();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.vmx-subject-scope-why')).toHaveCount(0);
  });
});

test('Home shows one mode first in a full row, keeps due reviews in view, and the rest under โหมดอื่น', async ({ page, context }) => {
  await seed(context, { year: '5', extra: { 'vmx-sr-cards': JSON.stringify(dueCard(dueQuestion.id)) } });
  await page.goto('/app');
  const first = page.locator('.vmx-mode-first');
  await expect(first).toBeVisible({ timeout: 20_000 });
  const toggle = page.getByRole('button', { name: 'โหมดอื่น', exact: true });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  // B5: a card due for review is never only behind โหมดอื่น.
  await expect(first.locator('.vmx-mode-card', { hasText: 'ทบทวนตามรอบ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ })).toBeHidden();
  await openHomeModes(page);
  await expect(page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ })).toBeVisible();
  // B8: the toggle is a chip, not a bar across the column.
  const [toggleBox, firstBox] = [await toggle.boundingBox(), await first.boundingBox()];
  expect(toggleBox.width).toBeLessThan(firstBox.width * 0.6);
});

test('a lone first mode takes the whole row and its reason sits right under it', async ({ page, context }) => {
  await seed(context, { year: '5' });
  await page.goto('/app');
  const first = page.locator('.vmx-mode-first');
  await expect(first).toHaveAttribute('data-count', '1', { timeout: 20_000 });
  const [grid, card] = [await first.boundingBox(), await first.locator('.vmx-mode-card').boundingBox()];
  expect(Math.abs(card.width - grid.width)).toBeLessThan(2);
});

test('the review planner says what today is and starts in one tap', async ({ page }) => {
  const card = { id: 9_100_101, type: 'flashcard', subject: 'epidemiology',
    front: 'การ์ดทดสอบการทบทวนวันนี้', q: 'การ์ดทดสอบการทบทวนวันนี้', back: 'คำตอบของการ์ดทดสอบ' };
  await page.addInitScript(({ srCards, card }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-user-flashcards', JSON.stringify([card]));
  }, { srCards: dueCard(card.id), card });
  await page.goto('/app/review');

  // B5: the line says what the session holds.
  // The bank's unseen cards join the queue too, and the line says so.
  await expect(page.locator('#vmx-srs-summary')).toHaveText(/^จัดให้แล้ว: 25 ใบ \(ค้างทบทวน 1, ใหม่ [\d,]+\), ปี 5, ทุกวิชา/, { timeout: 20_000 });
  await expect(page.locator('.vmx-decide-why')).toHaveText('ใบที่ค้างนานสุดมาก่อน');
  await expect(page.getByRole('button', { name: 'ปรับเอง', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('group', { name: 'จำนวนวันนี้', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.getByText(card.front, { exact: true })).toBeVisible({ timeout: 20_000 });
});

test('the planner line follows a row the moment it is tapped, and a size nobody chose is not theirs', async ({ page }) => {
  const card = { id: 9_100_102, type: 'flashcard', subject: 'epidemiology',
    front: 'การ์ดทดสอบขนาดรอบ', q: 'การ์ดทดสอบขนาดรอบ', back: 'คำตอบ' };
  await page.addInitScript(({ srCards, card }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-user-flashcards', JSON.stringify([card]));
    // A3: Home's plan wrote its count into this key until 5.192.1.
    if (!sessionStorage.getItem('size-seeded')) { sessionStorage.setItem('size-seeded', '1'); localStorage.setItem('vmx-sr-session-size', '7'); }
  }, { srCards: dueCard(card.id), card });
  await page.goto('/app/review');
  await expect(page.locator('#vmx-srs-summary')).toHaveText(/^จัดให้แล้ว:/);
  await openAdjust(page);
  await expect(page.getByRole('button', { name: '25 ใบ', exact: true })).toHaveAttribute('aria-pressed', 'true');
  // A2: the line changes with the tap, not a render later.
  await page.getByRole('button', { name: /^ทั้งหมด \(/ }).click();
  await expect(page.locator('#vmx-srs-summary')).toHaveText(/^ตั้งไว้แล้ว:/);
  await page.locator('.vmx-decide-why').getByRole('button', { name: 'กลับไปใช้ค่าที่จัดให้', exact: true }).click();
  await expect(page.locator('#vmx-srs-summary')).toHaveText(/^จัดให้แล้ว:/);
  await expect(page.getByRole('button', { name: '25 ใบ', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('a cold planner counts before it claims anything', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route(/\/assets\/data-q-/, async (route) => { await held; await route.continue(); });
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.goto('/app/review');
  // B6: no "0 ใบ" and no "nothing due" while the bank is still on its way.
  await expect(page.locator('#vmx-srs-summary')).toHaveText('กำลังนับใบที่ถึงรอบ…', { timeout: 20_000 });
  release();
  await expect(page.locator('#vmx-srs-summary')).not.toHaveText('กำลังนับใบที่ถึงรอบ…', { timeout: 30_000 });
});
