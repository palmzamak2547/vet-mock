import { test, expect } from './fixtures.js';
import { Q_VISIBLE_COUNTS_BY_SUBJECT } from '../../src/data/q-counts.js';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  // This browser proof uses public bundled sources and a disposable empty
  // catalogue; it neither signs in nor writes to a live provider.
  await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, body: '[]',
    headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } }));
});

test('guest search drops saved gated destinations and former-account notes', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => {
    localStorage.setItem('vmx-user-sync-owner-v1', JSON.stringify('former-account'));
    localStorage.setItem('vmx-notes', JSON.stringify({ 100: 'Former account private note for regression' }));
    localStorage.setItem('vmx-omni-recents', JSON.stringify([
      { type: 'action', featureId: 'account-settings', label: 'Saved former account settings', payload: { kind: 'view', view: 'account-settings' } },
      { type: 'library-doc', label: 'Former account restricted lecture for regression', payload: { id: 'former-private', status: 'restricted' } },
    ]));
  });
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText('Saved former account settings');
  await expect(dialog).not.toContainText('Former account restricted lecture for regression');
  await expect(dialog).not.toContainText('Former account private note for regression');
  await expect(dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('a stale saved recent opens the current exam preset', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => {
    localStorage.setItem('vmx-omni-recents', JSON.stringify([{
      type: 'action', featureId: 'exam-mode', label: 'Obsolete exam action label',
      payload: { kind: 'practice', mode: 'exam', subject: 'all', practiceMode: 'all', numQuestions: 999, useTimer: false, timePerQ: 1 },
    }]));
  });
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await expect(dialog).not.toContainText('Obsolete exam action label');
  const first = dialog.locator('[data-flat-idx="0"]');
  await expect(first).toContainText('โหมดสอบ');
  await first.click();
  await expect(page.getByRole('heading', { name: 'ตั้งค่า โหมดสอบ' })).toBeVisible();
  await expect(page.getByRole('spinbutton', { name: 'จำนวนข้อแบบกำหนดเอง' })).toHaveValue('50');
  await expect(page.getByRole('button', { name: '50', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test.describe('search input timing', () => {
  test.use({ pinCalendar: false });

  test('Enter during the search debounce opens the newly typed destination', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
    const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
    const input = dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
    await expect(input).toBeFocused();
    await expect(dialog.locator('[data-flat-idx="0"]')).toContainText('หน้าแรก');
    await page.clock.install({ time: new Date('2026-09-25T18:15:00+07:00') });
    await page.clock.pauseAt(new Date('2026-09-25T18:15:01+07:00'));
    await input.fill('schedule');
    await expect(input).toHaveValue('schedule');
    await expect(dialog.locator('[data-flat-idx="0"]')).toContainText('หน้าแรก');
    await input.press('Enter');
    await page.clock.resume();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/app\/schedule$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ตาราง');
  });
});

test('composition keys keep search open, then ordinary keyboard selection and Escape still work', async ({ page }) => {
  await page.goto('/app');
  const launch = page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first();
  await launch.click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  const input = dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  await expect(input).toBeFocused();
  for (const key of ['Enter', 'ArrowDown', 'Escape']) {
    // Synthetic composition proves the browser event path, not a physical IME.
    await input.dispatchEvent('keydown', { key, isComposing: true });
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
  }
  await input.fill('schedule');
  await expect(dialog.locator('[data-flat-idx="0"]')).toContainText('ตารางเรียน');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/app\/schedule$/);
  await launch.click();
  await expect(input).toBeFocused();
  await input.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(launch).toBeFocused();
});

// The study card counts what the topic screen will show: any course, from any
// year (opening another year's course loads its banks), and for a course of
// the student's own year under the chosen period, that period's term and
// paper. Another year's course is counted whole: the period is the student's
// own calendar (5.144.4 review). An own-year course with nothing in the
// period says so (reviews of 5.144.2 and 5.144.3, 2026-10-12).
test('the study card offers any year\'s course at its count, and names the period when an own-year course holds none', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('vmx-selected-year', '4'));
  await page.goto('/app');
  await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  const box = dialog.getByRole('combobox', { name: 'ค้นหาใน VetMock' });
  await box.fill('ข้อสอบ vca');
  const card = dialog.locator('.vmx-omni-go-primary');
  await expect(card).toContainText('ฝึกข้อสอบ');
  await expect(card).toContainText(`${Q_VISIBLE_COUNTS_BY_SUBJECT.vca} ข้อ`);
  await expect(card).toContainText('ปี 5');
  // biochem-1 is a year-1, term-2 course; the selected period (เทอม 1 กลางภาค)
  // is year 4's calendar, so the course is offered whole.
  await box.fill('ข้อสอบ biochem');
  await expect(card).toContainText('ฝึกข้อสอบ');
  await expect(card).toContainText(`${Q_VISIBLE_COUNTS_BY_SUBJECT['biochem-1']} ข้อ`);
  await expect(card).toContainText('ปี 1');
  // COM V is year 4's own course and sits in term 2: the period holds none of
  // it. The card keeps its summary, clips and VetWiki, so the line sits inside it.
  await box.fill('ข้อสอบ com5');
  await expect(dialog.locator('.vmx-omni-go-missing').filter({ hasText: 'ข้อสอบวิชานี้ไม่อยู่ในช่วงสอบที่เลือก เปลี่ยนช่วงสอบก่อนจึงจะฝึกได้' })).toBeVisible();
  await expect(card).not.toContainText('ฝึกข้อสอบ');
});
