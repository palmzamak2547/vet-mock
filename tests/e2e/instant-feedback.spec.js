// Instant answer feedback (โหมดฝึก) — e2e
// ============================================================
// The feature reveals ✓/✗ + the explanation the moment a choice
// question is answered, and LOCKS the options so the first instinct is
// what gets scored. Locking is where the risk lives: a `disabled`
// button drops keyboard focus to <body>, and a student navigating by
// Tab loses their place in the page on every single answer.
//
// The unit guard that shipped with the feature covers the schema/RLS
// side; nothing exercised the actual reveal in a browser. These tests
// do, on the two paths a student can take:
//
//   1. mouse — click an option, expect verdict + explanation + lock
//   2. keyboard — Enter on a focused option, expect focus to survive
//   3. the toggle — off means no reveal at all
//   4. exam mode never reveals, whatever the toggle says
//
// The 4th matters most: exam mode showing per-question verdicts would
// invalidate a mock exam, and the guard for it is a single `mode !==
// 'exam'` in ExamView with nothing pinning it.

import { test, expect } from '@playwright/test';

const noise = /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|Unrecognized feature|_vercel\/(insights|speed-insights)|Failed to load resource.*404|downloadable font|Unexpected token '<'|expected expression, got '<'|__cf_bm|rejected for invalid domain/i;

let consoleErrors = [];

test.beforeEach(async ({ page, context }) => {
  consoleErrors = [];
  await context.addInitScript(() => {
    try { window.localStorage.setItem('vmx-selected-year', '4'); } catch {}
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const combined = msg.text() + ' ' + (msg.location?.().url || '');
    if (!noise.test(combined)) consoleErrors.push(combined);
  });
});

/** Home → config → 3-question practice set, sitting on question 1. */
async function startPractice(page, { instant = true } = {}) {
  await page.goto('/');
  await page.getByRole('button', { name: /Quick Practice|ฝึกแบบเลือกจำนวน/i }).first().click();
  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');

  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-checked')) !== String(instant)) await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', String(instant));

  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 15_000 });
}

/** Walk forward until a multiple-choice question is on screen.
 *
 *  Returns 'found' | 'no-mcq'. True/False counts as a legitimate reason
 *  to walk on rather than a breakage — the feature handles tf too, these
 *  tests just assert the MCQ specifics. It deliberately does NOT return a bare
 *  false, because a set with no MCQ and a set whose options failed to
 *  render look identical from outside, and 95.2% of the corpus is MCQ —
 *  so "no MCQ here" is far more likely to be the bug than the reason to
 *  skip. Anything that is neither an MCQ nor a recognisable writing
 *  control throws instead of quietly skipping the test. */
async function findMcq(page) {
  for (let i = 0; i < 6; i++) {
    if (await page.locator('.vmx-option').first().isVisible().catch(() => false)) return 'found';
    const writing = await page.locator('.vmx-fill-input, .vmx-match-select, .vmx-match-native-select, .vmx-tf-btn, textarea').count();
    if (!writing) {
      throw new Error('question card has no MCQ options and no writing control — the answer controls did not render');
    }
    const next = page.getByRole('button', { name: /ถัดไป/ });
    if (!(await next.isVisible().catch(() => false))) return 'no-mcq';
    await next.click();
  }
  return 'no-mcq';
}

test.describe('instant answer feedback', () => {
  test('reveals the verdict and locks the options on click', async ({ page }) => {
    await startPractice(page);
    test.skip((await findMcq(page)) !== 'found', 'this random set drew no multiple-choice question');

    await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
    await page.locator('.vmx-option').first().click();

    const verdict = page.locator('.vmx-instant-feedback');
    await expect(verdict).toBeVisible();
    // Exactly one option is marked correct, whatever was picked.
    await expect(page.locator('.vmx-option.is-correct')).toHaveCount(1);
    // Every option locks — first instinct is what gets scored.
    const options = page.locator('.vmx-option');
    for (let i = 0; i < (await options.count()); i++) {
      await expect(options.nth(i)).toBeDisabled();
    }
    expect(consoleErrors.join('\n')).toBe('');
  });

  test('keeps keyboard focus in the page after the options lock', async ({ page }) => {
    await startPractice(page);
    test.skip((await findMcq(page)) !== 'found', 'this random set drew no multiple-choice question');

    await page.locator('.vmx-option').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.vmx-instant-feedback')).toBeVisible();

    // The button that took the Enter is now disabled. If nothing catches
    // the focus it lands on <body>, and the next Tab restarts from the
    // top of the document instead of continuing past the question.
    const focused = await page.evaluate(() => document.activeElement?.tagName || 'NONE');
    expect(focused, 'focus fell out of the page when the options locked').not.toBe('BODY');
  });

  test('stays silent when the toggle is off', async ({ page }) => {
    await startPractice(page, { instant: false });
    test.skip((await findMcq(page)) !== 'found', 'this random set drew no multiple-choice question');

    await page.locator('.vmx-option').first().click();
    await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
    await expect(page.locator('.vmx-option').first()).toBeEnabled();
  });

  test('never reveals in exam mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Exam Mode|จำลองสนามสอบ/i }).first().click();
    await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า/ })).toBeVisible();
    // The toggle must not even be offered — an exam has no per-question
    // verdicts to opt into.
    await expect(page.getByRole('switch', { name: /เฉลยทันที/ })).toHaveCount(0);

    await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');
    await page.getByRole('button', { name: /เริ่ม/ }).click();
    await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 15_000 });
    test.skip((await findMcq(page)) !== 'found', 'this random set drew no multiple-choice question');

    await page.locator('.vmx-option').first().click();
    await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
    await expect(page.locator('.vmx-live-score')).toHaveCount(0);
    // Still changeable — an exam lets you revisit your answer.
    await expect(page.locator('.vmx-option').first()).toBeEnabled();
  });
});
