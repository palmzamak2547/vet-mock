import { test, expect } from './fixtures.js';
import { EXAM_SCHEDULE, CLASS_TIMETABLE } from '../../src/data/schedule.js';
import { Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE } from '../../src/data/q-counts.js';
import { hasNotes } from '../../src/data/notes-registry.generated.js';
import { questionInScope } from '../../src/lib/exam-scope.js';
import { inflightExamKey } from '../../src/lib/exam-recovery.js';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

test('a final timetable entry launches its own paper despite the selected midterm', async ({ page }) => {
  const exam = EXAM_SCHEDULE.y5.find(item => item.term === 'final'
    && Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE['1-final'][item.subject] > 0);
  expect(exam).toBeTruthy();
  await page.goto('/app/schedule');
  const card = page.locator('.vmx-dash-card').filter({ has: page.getByRole('heading', { name: exam.title }) });
  await card.getByRole('button', { name: 'ฝึกข้อสอบวิชานี้ →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ตั้งค่า การฝึก', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-selected-phase')))).toBe('1-final');
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
  const key = inflightExamKey(null);
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null')?.selectedPhase, key)).toBe('1-final');
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(saved.questions.length).toBeGreaterThan(0);
  expect(saved.questions.every(question => question.subject === exam.subject && questionInScope(question, 'final'))).toBe(true);
});

test('a timetable class with notes and no current-paper practice opens reading and returns', async ({ page }) => {
  const lesson = CLASS_TIMETABLE.y5.find(item => hasNotes(item.subject)
    && !Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE['1-mid'][item.subject]);
  expect(lesson).toBeTruthy();
  await page.goto('/app/schedule');
  await page.getByRole('button', { name: new RegExp(lesson.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('[data-reading-content]')).not.toBeEmpty();
  await page.getByRole('button', { name: /ตารางเรียนและสอบ/ }).first().click();
  await expect(page.getByRole('heading', { name: /ตาราง\s*เรียนและสอบ/ })).toBeVisible();
});
