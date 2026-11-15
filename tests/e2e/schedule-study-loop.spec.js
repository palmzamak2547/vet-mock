import { test, expect, openAdjust } from './fixtures.js';
import { EXAM_SCHEDULE, CLASS_TIMETABLE, examTitle } from '../../src/data/schedule.js';
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
  const card = page.locator('.vmx-dash-card').filter({ has: page.getByRole('heading', { name: examTitle(exam) }) });
  await card.getByRole('button', { name: 'ฝึกข้อสอบวิชานี้', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ตั้งค่า การฝึก', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-selected-phase')))).toBe('1-final');
  await openAdjust(page);
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible();
  const key = inflightExamKey(null);
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null')?.selectedPhase, key)).toBe('1-final');
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  expect(saved.questions.length).toBeGreaterThan(0);
  expect(saved.questions.every(question => question.subject === exam.subject && questionInScope(question, 'final'))).toBe(true);
});

// The config screen is drawn before the set has been counted. When the count
// lands, ปรับเอง must stay where it was and keep a press made before it: on
// 15 Nov a press made as the bank arrived was lost (main, chromium-desktop,
// the test above).
const anyBank = /(?:\/assets\/data-q-[^/]+\.js|\/src\/data\/questions-[^/]+\.js)(?:\?.*)?$/;
for (const press of [false, true]) {
  test(`ปรับเอง ${press ? 'keeps a press made' : 'holds still'} while the practice set is counted`, async ({ page }) => {
    // Every bank of year 5 is held, and after the release they arrive four at a time.
    test.setTimeout(90_000);
    let release;
    const held = new Promise(resolve => { release = resolve; });
    // A request that was dropped while it waited (the page moved on) must not fail the check.
    await page.route(anyBank, async route => { await held; await route.continue().catch(() => {}); });
    try {
      const exam = EXAM_SCHEDULE.y5.find(item => item.term === 'final'
        && Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE['1-final'][item.subject] > 0);
      // The load event waits for the held banks on Firefox, and on WebKit the
      // held requests can keep the document-ready event (and the font file)
      // waiting behind them, so the visit counts as arrived once the document
      // has been answered and the checks below wait for what they need.
      await page.goto('/app/schedule', { waitUntil: 'commit' });
      const card = page.locator('.vmx-dash-card').filter({ has: page.getByRole('heading', { name: examTitle(exam) }) });
      await card.getByRole('button', { name: 'ฝึกข้อสอบวิชานี้', exact: true }).click();
      const summary = page.locator('#vmx-config-summary');
      await expect(summary).toHaveText('กำลังตรวจจำนวนข้อ…');
      const toggle = page.getByRole('button', { name: 'ปรับเอง', exact: true });
      // Fonts can queue behind the held banks; wait for them for a few seconds only, and again after the release.
      const fontsReady = () => page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 5000))]));
      await fontsReady();
      const before = await toggle.boundingBox();
      // A press flips the rows whichever way they were drawn, and the count
      // landing afterwards leaves them the way the press set them.
      const pressed = press && (await toggle.getAttribute('aria-expanded')) !== 'true' ? 'true' : 'false';
      if (press) {
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', pressed);
      }
      release();
      await expect(summary).not.toHaveText('กำลังตรวจจำนวนข้อ…', { timeout: 60_000 });
      await expect(page.locator('.vmx-config-start')).toContainText(/เริ่มฝึก \d/);
      if (press) {
        await expect(toggle).toHaveAttribute('aria-expanded', pressed);
        const rows = page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ });
        await (pressed === 'true' ? expect(rows).toBeVisible() : expect(rows).toBeHidden());
        return;
      }
      await fontsReady();
      const after = await toggle.boundingBox();
      test.info().annotations.push({ type: 'adjust-toggle-shift', description: `top ${(after.y - before.y).toFixed(2)} px, left ${(after.x - before.x).toFixed(2)} px` });
      expect(Math.abs(after.y - before.y), 'ปรับเอง moved down or up').toBeLessThanOrEqual(0.5);
      expect(Math.abs(after.x - before.x), 'ปรับเอง moved sideways').toBeLessThanOrEqual(0.5);
    } finally { release(); }
  });
}

// The suite's pinned day (25 Sep) is inside the midterm, when the timetable says classes are suspended,
// so this one sets its own clock in a teaching week.
test.describe('in a teaching week', () => {
  test.use({ pinCalendar: false });
test('a timetable class with notes and no current-paper practice opens reading and returns', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-13T10:00:00+07:00') });
  const lesson = CLASS_TIMETABLE.y5.find(item => hasNotes(item.subject)
    && !Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE['1-mid'][item.subject]);
  expect(lesson).toBeTruthy();
  await page.goto('/app/schedule');
  // The page opens on one day's classes; the five days, each class a link, are behind "ทั้งสัปดาห์".
  await page.getByRole('button', { name: 'ทั้งสัปดาห์', exact: true }).click();
  // A class is called by its course's own name, the one the exam rows use.
  await page.getByRole('button', { name: new RegExp(examTitle(lesson).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
  await expect(page.locator('.vmx-notes-grid')).toBeVisible();
  await expect(page.locator('[data-reading-content]')).toBeVisible();
  await expect(page.locator('[data-reading-content]')).not.toBeEmpty();
  await page.getByRole('button', { name: /ตารางเรียนและสอบ/ }).first().click();
  await expect(page.getByRole('heading', { name: /ตาราง\s*เรียนและสอบ/ })).toBeVisible();
});
});
