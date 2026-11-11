// The practice and exam flows as a student meets them (hunt of 11 Nov 2026):
// a fill-in item's key in practice and not in a timed paper, one move per
// double tap, one exit dialog for the X and for Back, a card usable at
// 188 CSS px, a results page whose first screen holds the score and the next
// step, and an exam clock the device's time cannot stretch. Sets are seeded
// as parked sets and resumed, so each test starts on a known question.
import { test, expect } from './fixtures.js';
import { QUESTIONS_MID86_AQUATIC_CLINIC as AQ } from '../../src/data/questions-mid86-aquatic-clinic.js';

const FILL = AQ.find((q) => q.id === 202455);
const MATCH = AQ.find((q) => q.id === 202471);
const MCQ = AQ.filter((q) => (q.type ?? 'mcq') === 'mcq' && Array.isArray(q.options)).slice(0, 4);

async function resume(page, context, { questions, mode = 'quick', timed = false, answers = {}, currentIdx = 0, deadlineIn = 600_000 }) {
  await context.addInitScript(({ questions, mode, timed, answers, currentIdx, deadlineIn }) => {
    if (sessionStorage.getItem('__learner-seed')) return;
    sessionStorage.setItem('__learner-seed', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const now = Date.now();
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, questions, answers, currentIdx, useTimer: timed, timePerQ: 60, mode, submitted: false,
      selectedYear: 5, savedAt: now, examStartTime: now - 58_000,
      ...(timed ? { questionDeadline: now + deadlineIn, clock: 'session' } : {}),
    }));
  }, { questions, mode, timed, answers, currentIdx, deadlineIn });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
}
const position = (page) => page.locator('.vmx-progress').innerText().then((t) => Number(t.match(/(\d+)\s*\//)?.[1]));

async function openResults(page, context, width) {
  await page.setViewportSize({ width, height: 812 });
  const qs = MCQ.slice(0, 3);
  const answers = Object.fromEntries(qs.map((q, i) => [q.id, i === 0 ? q.answer : (q.answer + 1) % q.options.length]));
  await resume(page, context, { questions: qs, mode: 'quick', answers, currentIdx: 2 });
  await page.getByRole('button', { name: 'ดูผลลัพธ์ →', exact: true }).click();
  await expect(page.getByText('คะแนนตรวจอัตโนมัติ')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
}

// item 1
test('a fill-in item shows its key in practice once checked, and nothing in a timed paper', async ({ page, context }) => {
  await resume(page, context, { questions: [FILL, ...MCQ.slice(0, 1)] });
  const inputs = page.locator('.vmx-fill-input');
  const check = page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true });
  await expect(check).toBeDisabled();
  const n = await inputs.count();
  for (let i = 0; i < n; i++) await inputs.nth(i).fill(i === 0 ? 'ผิด' : String(FILL.blanks[i]));
  await check.click();
  const panel = page.locator('.vmx-instant-feedback');
  await expect(panel).toContainText('ยังไม่ใช่');
  await expect(panel).toContainText(FILL.blanks[0]);
  await expect(panel).toContainText('เหตุผล');
  await expect(inputs.first()).toHaveJSProperty('readOnly', true);
  await expect(page.getByText('ดูเต็มหลังเฉลย')).toHaveCount(0);
});

// item 1
test('a timed paper offers no check on a fill-in item and shows no key', async ({ page, context }) => {
  await resume(page, context, { questions: [FILL, ...MCQ.slice(0, 1)], mode: 'exam', timed: true });
  const inputs = page.locator('.vmx-fill-input');
  const n = await inputs.count();
  for (let i = 0; i < n; i++) await inputs.nth(i).fill(String(FILL.blanks[i]));
  await expect(page.getByRole('button', { name: 'ตรวจคำตอบ' })).toHaveCount(0);
  await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
  await expect(inputs.first()).toHaveJSProperty('readOnly', false);
});

// item 2
test('a double tap on ข้อถัดไป, or a double key press, moves one question', async ({ page, context }) => {
  await resume(page, context, { questions: MCQ, mode: 'exam', timed: true });
  expect(await position(page)).toBe(1);
  await page.locator('.vmx-exam-next').dblclick();
  await expect.poll(() => position(page)).toBe(2);
  await page.waitForTimeout(300);
  expect(await position(page)).toBe(2);
  await page.locator('.vmx-qtext').click();
  await page.keyboard.press('j');
  await page.keyboard.press('j');
  await page.waitForTimeout(300);
  expect(await position(page)).toBe(3);
  await page.locator('.vmx-exam-prev').dblclick();
  await page.waitForTimeout(300);
  expect(await position(page)).toBe(2);
});

// item 3
test('the X and the browser Back ask the same question, and it keeps the set', async ({ page, context }) => {
  await resume(page, context, { questions: MCQ, mode: 'exam', timed: true });
  await page.locator('.vmx-option').first().click();
  const dialog = page.getByRole('dialog');
  await page.locator('.vmx-exam-top-left button').first().click();
  await expect(dialog).toBeVisible();
  const fromX = (await dialog.innerText()).replace(/\s+/g, ' ').trim();
  await dialog.getByRole('button', { name: 'ทำต่อ', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.goBack();
  await expect(dialog).toBeVisible();
  const fromBack = (await dialog.innerText()).replace(/\s+/g, ' ').trim();
  expect(fromBack).toBe(fromX);
  expect(fromBack).toContain('6 ชั่วโมง');
  await dialog.getByRole('button', { name: 'เก็บไว้แล้วออก', exact: true }).click();
  await expect(page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ })).toBeVisible();
});

