// Exam-phase e2e — 2026-09-03
// ============================================================
// Palm: "เรามีให้เลือกชั้นปี กับกลางภาค ปลายภาคอยู่แล้ว" — the app has ONE
// phase selector (ปี → เทอม 1 กลางภาค / ปลายภาค), and this spec pins that
// it is the only thing that decides which exam's questions a current-term
// set holds, and that the home page visibly follows it: the set's card
// names the phase and its count, every card in the set says which paper it
// belongs to, and each subject card says whether that subject sits a paper
// in the chosen phase — read off the faculty exam timetable — so a course
// with no midterm (Epidemiology) or no paper at all (POA) never stands in
// the midterm grid as if it had one.

import { test, expect } from '@playwright/test';

const SCOPE_CHIP = '.vmx-qtype-badge .vmx-scope-chip';

// The app stores selections as JSON (src/hooks/useStorage.js), so a phase
// id has to be seeded as a JSON string.
function seed(context, phase) {
  return context.addInitScript(([p]) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (p) window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
    } catch {}
  }, [phase]);
}

async function home(page) {
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
}

function subjectCard(page, thaiName) {
  return page.locator('.vmx-subject-card', { hasText: thaiName }).first();
}

async function scopedCard(page) {
  const card = page.locator('button.vmx-mode-card', { hasText: 'ตามสไลด์ปัจจุบัน' });
  await expect(card).toBeVisible();
  const sub = await card.locator('.sub').innerText();
  const count = Number((sub.match(/(\d+)\s*ข้อ/) || [])[1]);
  return { card, sub, count };
}

test('midterm phase: the card, the set and the subject grid all speak midterm', async ({ page, context }) => {
  await seed(context, '1-mid');
  await home(page);

  const { card, sub, count } = await scopedCard(page);
  expect(sub).toContain('กลางภาค');
  expect(count).toBeGreaterThan(0);

  // The faculty timetable: Avian sits a midterm on 21 Sep; Epidemiology and
  // POA have no midterm paper.
  await expect(subjectCard(page, 'อายุรศาสตร์สัตว์ปีก').locator('.vmx-subject-exam')).toHaveText(/สอบกลางภาค 21 ก\.ย\./);
  await expect(subjectCard(page, 'ระบาดวิทยา').locator('.vmx-subject-exam')).toHaveText('ไม่มีสอบกลางภาค');
  await expect(subjectCard(page, 'POA').locator('.vmx-subject-exam')).toHaveText('ไม่มีสอบกลางภาค');

  // No second control anywhere on the page.
  await expect(page.locator('.vmx-scope-pill')).toHaveCount(0);

  await card.click();
  await expect(page.locator(SCOPE_CHIP).first()).toBeVisible({ timeout: 20000 });
  const counter = await page.locator('text=/\\d+\\s*\\/\\s*\\d+/').first().innerText();
  expect(Number(counter.split('/')[1])).toBe(Math.min(count, 50));
  for (let i = 0; i < 3; i++) {
    await expect(page.locator(SCOPE_CHIP).first()).toHaveText('กลางภาค');
    await page.locator('.vmx-option:visible').first().click();
    await page.getByRole('button', { name: /ข้อถัดไป/ }).click();
  }
});

test('final phase: the same page flips to the final paper', async ({ page, context }) => {
  await seed(context, '1-final');
  await home(page);

  const { card, sub, count } = await scopedCard(page);
  expect(sub).toContain('ปลายภาค');
  expect(count).toBeGreaterThan(0);

  await expect(subjectCard(page, 'ระบาดวิทยา').locator('.vmx-subject-exam')).toHaveText(/สอบปลายภาค 4 ธ\.ค\./);
  await expect(subjectCard(page, 'อายุรศาสตร์สัตว์ปีก').locator('.vmx-subject-exam')).toHaveText(/สอบปลายภาค 2 ธ\.ค\./);
  await expect(subjectCard(page, 'POA').locator('.vmx-subject-exam')).toHaveText('ไม่มีสอบปลายภาค');

  await card.click();
  await expect(page.locator(SCOPE_CHIP).first()).toBeVisible({ timeout: 20000 });
  await expect(page.locator(SCOPE_CHIP).first()).toHaveText('ปลายภาค');
});

test('no phase: the whole semester, and the grid carries no exam lines', async ({ page, context }) => {
  await seed(context, null);
  await home(page);
  const { sub } = await scopedCard(page);
  expect(sub).toContain('ทั้งเทอม');
  await expect(page.locator('.vmx-subject-exam')).toHaveCount(0);
});

// Reproduced on production 2026-09-04: with year 3 and เทอม 1 กลางภาค selected,
// all nine subject cards read "ไม่มีสอบกลางภาค" — พยาธิวิทยา and เภสัชวิทยา
// included. schedule.js simply has no timetable for year 3, and an empty
// lookup was rendering as a statement of fact.
test('a year with no timetable in the app makes no claim about its exams', async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '3');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.vmx-subject-card')).not.toHaveCount(0);
  await expect(page.locator('.vmx-subject-exam')).toHaveCount(0);
});

test('the config page names the phase it was opened under', async ({ page, context }) => {
  await seed(context, '1-mid');
  await home(page);
  const near = page.locator('button.vmx-mode-card', { hasText: 'ซ้อมใกล้สอบ' });
  await expect(near).toBeVisible();
  await near.click();
  await expect(page.locator('.vmx-hero p')).toContainText('กลางภาค');
  await expect(page.locator('.vmx-scope-pill')).toHaveCount(0);
  await expect(page.locator('.vmx-config-availability')).toHaveText(/มี\s*[\d,]+\s*ข้อในชุดนี้/, { timeout: 20000 });
});
