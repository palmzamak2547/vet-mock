import { test, expect } from './fixtures.js';
import { parseUserBackup } from '../../src/lib/user-data-schema.js';
import { parseLocalExtras } from '../../src/lib/local-extras.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

test.use({ reducedMotion: 'reduce' });

for (const kind of ['question', 'note']) test(`Pinboard opens ${kind === 'question' ? 'a numeric ID 0 question' : 'a restored bare-qKey note after reload'}`, async ({ page }) => {
  const question = { id: kind === 'question' ? 0 : 'pinboard-bare-note-fixture', subject: 'surg2', year: 4,
    type: 'tf', q: kind === 'question' ? 'ข้อส่วนตัวหมายเลขศูนย์จากพิน' : 'ข้อส่วนตัวของโน้ตที่คืนจากข้อมูลสำรอง', answer: true };
  const parsed = parseUserBackup({ customQuestions: [question] });
  expect(parsed.success).toBe(true);
  expect(isQuestionDeliverable(question)).toBe(true);
  const pin = { id: 1, type: kind, label: kind === 'question' ? 'พินข้อส่วนตัว ID 0' : 'พินโน้ตจากข้อมูลสำรอง',
    payload: kind === 'question' ? { id: question.id, subject: question.subject, stem: question.q }
      : { qKey: question.id, subject: question.subject, snapshot: 'โน้ตที่บันทึกไว้' }, addedAt: 1 };
  const archive = { format: 'vetmock-local-extras-v1', data: { 'vmx-pinboard': [pin] } };
  expect(parseLocalExtras(archive).success).toBe(true);

  await page.addInitScript(({ questions, pin, bundle }) => {
    if (localStorage.getItem('pinboard-recovery-seeded')) return;
    localStorage.setItem('pinboard-recovery-seeded', '1');
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-custom-q', JSON.stringify(questions));
    // Exercise both original raw pins and the bundle produced by a supported restore.
    if (pin.type === 'note') localStorage.setItem('vmx-local-extras-v1', JSON.stringify(bundle));
    else localStorage.setItem('vmx-pinboard', JSON.stringify([pin]));
  }, { questions: parsed.data.customQuestions, pin, bundle: archive.data });

  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  // The card is the outer role=button; its child is the separate delete control.
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  await expect(card).toHaveCount(1);
  await expect(card).toBeVisible();
  if (kind === 'note') {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(card).toBeVisible();
  }
  await card.click();
  await expect(page.locator('.vmx-question-card')).toHaveCount(1);
  await expect(page.locator('.vmx-question-card .vmx-qtext')).toHaveText(question.q);
  await expect(page.locator('.vmx-progress')).toContainText('1 / 1');
});
