import { test, expect, PINNED_NOW } from './fixtures.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isFlashcardCompatible } from '../../src/hooks/sr-filter.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';
import { initCard } from '../../src/hooks/sm2.js';
import { SUBJECTS, yearForSubject, semesterForSubject } from '../../src/data/curriculum.js';

await loadQB();
const srQuestion = QB.find(q => q.subject === 'com4' && isFlashcardCompatible(q) && isQuestionDeliverable(q));
const priorSubject = SUBJECTS.find(subject => subject.id === 'avian-medicine');
if (!priorSubject || yearForSubject(priorSubject.id) !== 5 || semesterForSubject(priorSubject.id) !== 1
  || !QB.some(q => q.subject === priorSubject.id && isQuestionDeliverable(q))) throw new Error('Prior subject fixture must be available in year 5 semester 1');
const weakQuestion = QB.find(q => q.year === 5 && q.subject !== priorSubject.id && q.type === 'mcq' && isQuestionDeliverable(q));
if (!srQuestion || !weakQuestion) throw new Error('Learning identity needs real COM IV recall and other year-5 practice questions');
const now = Date.parse(PINNED_NOW);

test.use({ reducedMotion: 'reduce' });
async function seed(page, values = {}) {
  await page.addInitScript(values => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, JSON.stringify(value));
  }, values);
}

test('a year-5 student resumes a remembered COM IV review and Hard records successful recall', async ({ page }, info) => {
  const card = { ...initCard(srQuestion.id), totalReviews: 1, nextReview: now - 86400000 };
  await seed(page, {
    'vmx-sr-cards': { [srQuestion.id]: card }, 'vmx-sr-subject-filter': 'com4',
    'vmx-sr-year-scope': 'current', 'vmx-sr-phase-scope': 'all', 'vmx-sr-session-size': 1,
  });
  await page.goto('/app/review', { waitUntil: 'domcontentloaded' });
  const start = page.getByRole('button', { name: 'เริ่ม Session →', exact: true });
  await expect(start).toBeEnabled();
  await start.click();
  await expect(page.locator('.vmx-flashcard .front')).toContainText(srQuestion.q);
  await page.getByRole('button', { name: 'แสดงคำตอบ (Space)', exact: true }).click();
  await page.getByRole('button', { name: /^Hard/ }).click();
  await expect(page.locator('.vmx-score-frac')).toHaveText('1 ได้, 0 ต้องทบทวน');
  await expect.poll(() => page.evaluate(id => JSON.parse(localStorage.getItem('vmx-sr-cards'))[id]?.totalReviews, srQuestion.id)).toBe(2);
  await page.screenshot({ path: info.outputPath('com4-hard-summary.png') });
});

for (const mode of ['weak', 'bookmarks']) test(`Dashboard ${mode} practice survives a prior named-subject selection`, async ({ page }, info) => {
  await seed(page, { 'vmx-history': [{ date: now - 1000, questionId: weakQuestion.id, subject: weakQuestion.subject,
    year: 5, phase: '1-mid', correct: false }], 'vmx-bookmarks': [weakQuestion.id] });
  await page.goto('/app', { waitUntil: 'domcontentloaded' });
  const named = page.locator('.vmx-subject-card').filter({ hasText: priorSubject.name });
  await named.click();
  await expect(page.getByRole('heading', { level: 1, name: 'เลือก หัวข้อ', exact: true })).toBeVisible();
  await expect(page.locator('.vmx-hero')).toContainText(priorSubject.name);
  await page.getByRole('button', { name: /คืบหน้า/ }).filter({ visible: true }).first().click();
  await expect(page.locator('h1')).toContainText('ความคืบหน้า');
  const launch = page.getByRole('button', { name: mode === 'weak' ? 'ทำข้อที่อ่อน (1)' : 'ทำ Bookmarks (1)', exact: true });
  await launch.click();
  await expect(page.locator('.vmx-hero')).toContainText(mode === 'weak' ? 'Weak Spots — ข้อที่ผิดบ่อย' : 'Bookmark — เฉพาะข้อที่บันทึก');
  await page.getByRole('button', { name: /^เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toContainText(weakQuestion.q);
  await expect(page.locator('.vmx-progress')).toContainText('1 / 1');
  await page.screenshot({ path: info.outputPath(`dashboard-${mode}-correct-pool.png`) });
});
