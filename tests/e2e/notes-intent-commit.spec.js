import { test, expect } from './fixtures.js';
import { SUBJECTS, yearForSubject, semesterForSubject } from '../../src/data/curriculum.js';
import { hasNotes } from '../../src/data/notes-registry.generated.js';

const subject = SUBJECTS.find(item => item.id === 'com4');
if (!subject?.topics?.length || !hasNotes(subject.id) || yearForSubject(subject.id) !== 4 || semesterForSubject(subject.id) !== 2) {
  throw new Error('Notes intent needs a real year-4 semester-2 subject with topics and notes');
}

test.use({ reducedMotion: 'reduce', serviceWorkers: 'block' });
test('Home notes intent reaches the subject reader tab and does not leak into normal practice', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('2-final'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  await page.route(/(\/_vercel\/(insights|speed-insights)\/script|va\.vercel-scripts\.com\/.*script)[^/]*\.js/,
    route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route(/\/rest\/v1\/library_docs(?:\?|$)/, route => route.fulfill({
    status: route.request().method() === 'OPTIONS' ? 204 : 200,
    headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'apikey, authorization, content-type, prefer, x-client-info' },
    contentType: 'application/json', body: route.request().method() === 'OPTIONS' ? '' : '[]',
  }));

  await page.goto('/app', { waitUntil: 'domcontentloaded' });
  await page.locator('.vmx-feature-menu').getByRole('button', { name: /^สรุปบทเรียน / }).click();
  await expect(page.getByText('เลือกวิชาเพื่ออ่านสรุปจากสไลด์ พร้อมแหล่งอ้างอิงในแต่ละส่วน', { exact: true })).toBeVisible();
  const aggregate = page.locator('.vmx-subject-card').filter({ hasText: 'รวมทุกวิชา' });
  await expect(aggregate).toHaveCount(0);
  const subjectCard = page.locator('.vmx-subject-card').filter({ hasText: subject.name });
  await expect(subjectCard).toHaveCount(1);
  await subjectCard.click();
  const resources = page.getByRole('tab', { name: 'สื่อเรียนและโหมดสอบ', exact: true });
  const topics = page.getByRole('tab', { name: 'ฝึกตามหัวข้อ', exact: true });
  await expect(resources).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'สื่อเรียนและโหมดสอบ', exact: true })).toBeVisible();
  await expect(page.locator('.vmx-hero')).toContainText(subject.name);

  await page.locator('main').getByRole('button', { name: 'หน้าแรก', exact: true }).click();
  await expect(subjectCard).toHaveCount(1);
  await subjectCard.click(); // Ordinary subject practice writer after reading.
  await expect(topics).toHaveAttribute('aria-selected', 'true');
  await expect(resources).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByRole('tabpanel', { name: 'ฝึกตามหัวข้อ', exact: true })).toBeVisible();
  // NAV_ITEMS' practice entry uses the same runNav action in both responsive menus.
  const practice = page.getByRole('navigation', { name: 'เมนูหลัก', exact: true })
    .getByRole('button', { name: /^(ฝึกข้อสอบ|ฝึก)$/ }).filter({ visible: true });
  await expect(practice).toHaveCount(1);
  await practice.click();
  await expect(aggregate).toHaveCount(1);
  await expect(aggregate).toBeEnabled();
});
