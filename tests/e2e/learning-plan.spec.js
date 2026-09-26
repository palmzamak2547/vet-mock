import { test, expect, PINNED_NOW } from './fixtures.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';
import { scopeOfQuestion } from '../../src/lib/exam-scope.js';
import { initCard } from '../../src/hooks/sm2.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';

await loadQB();
const compatible = QB.filter(q => isQuestionDeliverable(q) && isFlashcardCompatible(q));
const mid = compatible.find(q => q.year === 5 && scopeOfQuestion(q) === 'midterm');
const final = compatible.find(q => q.year === 5 && scopeOfQuestion(q) === 'final');
const otherYear = compatible.find(q => q.year === 4 && scopeOfQuestion(q) === 'midterm');
if (!mid || !final || !otherYear) throw new Error('Review fixture needs real cards in both papers and years');
const privateCard = { id: 70001, type: 'flashcard', subject: final.subject,
  front: 'การ์ดส่วนตัวสำหรับตรวจการทบทวน', q: 'การ์ดส่วนตัวสำหรับตรวจการทบทวน',
  back: 'คำตอบส่วนตัวสำหรับตรวจการทบทวน' };
const now = Date.parse(PINNED_NOW);
const srCards = Object.fromEntries([mid, final, otherYear, privateCard].map(q => [q.id, {
  ...initCard(q.id), totalReviews: 1, repetitions: 1, interval: 1,
  lastReview: now - 4 * 86400000, nextReview: now - (q === privateCard ? 3 : 2) * 86400000,
}]));

async function seed(page, storageFailure = false) {
  await page.addInitScript(({ srCards, privateCard, mid, now, storageFailure }) => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-history', JSON.stringify(Array.from({ length: 6 }, (_, i) => ({
      date: now - i * 60000, questionId: mid.id, subject: mid.subject, year: 5, phase: '1-mid', correct: true,
    }))));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(srCards));
    localStorage.setItem('vmx-user-flashcards', JSON.stringify([privateCard]));
    localStorage.setItem('vmx-sr-subject-filter', JSON.stringify('com3'));
    localStorage.setItem('vmx-sr-year-scope', JSON.stringify('all'));
    localStorage.setItem('vmx-sr-phase-scope', JSON.stringify('all'));
    if (storageFailure) {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (this === localStorage && key.startsWith('vmx-sr-') && key !== 'vmx-sr-cards') {
          throw new DOMException('Test preference write failure', 'QuotaExceededError');
        }
        return write.call(this, key, value);
      };
    }
  }, { srCards, privateCard, mid, now, storageFailure });
  await page.route(/\/_vercel\/(?:insights|speed-insights)\/script\.js/, r => r.fulfill({ body: '' }));
}

const dueCount = page => page.getByText('Due ทบทวน', { exact: true }).locator('..').locator('div').last();

test('Home plan and SR agree on paper, due count, private cards, and a bounded session', async ({ page }, info) => {
  await seed(page);
  await page.goto('/app');
  const action = page.locator('.vmx-next-action[data-kind="sr"]');
  await expect(action).toContainText('ทบทวนตามรอบ 2 ข้อ');
  await expect(page.locator('.vmx-next-actions')).not.toContainText('เสริมจุดอ่อน');
  await page.locator('#vmx-daily-minutes').selectOption('15');
  await expect(page.getByText(/เผื่ออ่านเฉลย .* นาที/)).toBeVisible();
  await page.screenshot({ path: info.outputPath('home-plan.png'), fullPage: false });
  await action.click();
  await expect(page).toHaveURL(/\/app\/review$/);
  await expect(page.getByRole('combobox', { name: 'วิชา', exact: true })).toHaveValue('all');
  await expect(page.getByRole('button', { name: 'กลางภาค', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dueCount(page)).toHaveText('2ใบ');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-sr-session-size')))).toBe(2);

  await page.getByRole('button', { name: 'ทุกช่วง', exact: true }).click();
  await expect(dueCount(page)).toHaveText('3ใบ');
  await page.getByRole('button', { name: 'กลางภาค', exact: true }).click();
  await expect(dueCount(page)).toHaveText('2ใบ');
  await page.getByRole('button', { name: 'เริ่ม Session →', exact: true }).click();
  await expect(page.getByText(privateCard.front, { exact: true })).toBeVisible();
  await expect(page.locator('.vmx-progress')).toContainText('1 / 2');
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await expect(page.getByText(privateCard.back, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Good/ }).click();
  await expect(page.locator('.vmx-progress')).toContainText('2 / 2');
  // Opposite-paper and other-year records remain saved, not purged by scope.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-sr-cards')));
  expect(saved[final.id]).toEqual(srCards[final.id]);
  expect(saved[otherYear.id]).toEqual(srCards[otherYear.id]);
  expect(saved[privateCard.id].totalReviews).toBe(2);
  await page.getByRole('button', { name: 'หยุดและออก', exact: true }).click();
  await expect(page.locator('#vmx-daily-minutes')).toHaveValue('15');
});

test('Home review mode resets old filters and scope chips fit at 320px', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await seed(page);
  await page.goto('/app');
  const mode = page.locator('.vmx-mode-card').filter({ hasText: 'ทบทวนตามรอบ' });
  await expect(mode).toContainText('2 ข้อค้างทบทวน');
  await mode.click();
  await expect(dueCount(page)).toHaveText('2ใบ');
  const subject = page.getByRole('combobox', { name: 'วิชา', exact: true });
  await expect(subject).toHaveValue('all');
  await subject.selectOption(final.subject);
  await expect(dueCount(page)).toHaveText(`${mid.subject === final.subject ? 2 : 1}ใบ`);
  await subject.selectOption('all');
  await expect(dueCount(page)).toHaveText('2ใบ');
  await expect(page.getByRole('button', { name: 'กลางภาค', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const escapes = await page.getByRole('group', { name: 'ขอบเขตข้อสอบ', exact: true }).evaluate(el => {
    const r = el.getBoundingClientRect();
    return r.left < -1 || r.right > document.documentElement.clientWidth + 1;
  });
  expect(escapes).toBe(false);
  const startTop = await page.getByRole('button', { name: 'เริ่ม Session →', exact: true })
    .evaluate(el => el.getBoundingClientRect().top + window.scrollY);
  expect(startTop).toBeLessThan(1150);
  await page.screenshot({ path: info.outputPath('review-320.png'), fullPage: true });
});

test('a thin subject is capped by the real exam pool from Home through the opened set', async ({ page }) => {
  const pool = buildExamPool({ questions: QB, practiceMode: 'all', subject: 'com1', questionCategory: 'all',
    selectedYear: 4, selectedPhase: '1-mid' });
  expect(pool.length).toBeGreaterThan(0);
  const count = Math.min(12, pool.length);
  await seed(page);
  await page.addInitScript(({ question, now }) => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-sr-cards', '{}');
    localStorage.setItem('vmx-history', JSON.stringify(Array.from({ length: 6 }, (_, i) => ({
      date: now - i * 60000, questionId: question.id, subject: question.subject,
      year: 4, phase: '1-mid', correct: i === 0,
    }))));
  }, { question: pool[0], now });
  await page.goto('/app');
  const action = page.locator('.vmx-next-action[data-kind="weak"]');
  await expect(action).toContainText(`${count} ข้อ`);
  await action.click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
  await expect(page.locator('.vmx-progress')).toContainText(`/ ${count}`);
});

test('failed preference writes explain the retained filters instead of silently changing the plan', async ({ page }) => {
  await seed(page, true);
  await page.goto('/app');
  await page.locator('.vmx-next-action[data-kind="sr"]').click();
  await expect(page.getByRole('dialog')).toContainText('โปรดตรวจวิชา ช่วงสอบ และจำนวนการ์ดก่อนเริ่ม');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-sr-subject-filter')))).toBe('com3');
  await expect(page.getByRole('heading', { name: 'หน้านี้ขัดข้อง', exact: true })).toHaveCount(0);
});
