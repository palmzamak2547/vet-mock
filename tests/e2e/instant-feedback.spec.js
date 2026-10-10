// Instant answer feedback (โหมดฝึก) — e2e
// ============================================================
// The feature reveals ✓/✗ + the explanation the moment a choice
// question is answered, and LOCKS the options so the first instinct is
// what gets scored. Locking is where the risk lives: a `disabled`
// button drops keyboard focus to <body>, and a student navigating by
// Tab loses their place in the page on every single answer.
//
// The 4th matters most: exam mode showing per-question verdicts would
// invalidate a mock exam, and the guard for it is a single `mode !==
// 'exam'` in ExamView with nothing pinning it.
//
// ── Why the set is deterministic now ─────────────────────────────
// These tests used to draw a random 3-question set and SKIP whenever
// it held no MCQ (or, for the summary-button test, no VetWiki-linked
// question). A skip reads as green while proving nothing, and the draw
// is luck of the bank: the year-4 pool is ~96.7% MCQ, so the skip
// armed a one-in-a-thousand landmine and nothing more.
//
// The set now comes from measured bank facts, not a sample:
//   • exotic/bird-infect — 24 questions, 24/24 render option buttons
//     (type 'mcq' or untyped; True/False renders .vmx-tf-btn instead —
//     which is what the first draft of this note got wrong when it
//     picked com4/imha, a topic that holds True/False items) and 24/24
//     map to a VetWiki article.
//   • exotic, the whole subject — 151 questions, 151/151 render option
//     buttons, which is what makes the exam-mode set deterministic
//     (exam mode is a subject-level flow — topic cards only launch
//     practice; the 'สอบจริง' card on the subject screen is its entry).
// Re-measure before repointing either constant: loadQB(), filter
// year 4, and count (a) questions that would NOT render .vmx-option
// (any type outside 'mcq'/absent) and (b) questions for which
// articleForQuestion() returns nothing. Both counts must be zero.
//
// The invariant is DATA, and data changes: the day this topic gains a
// True/False, fill or written question, the first card below has no
// .vmx-option and the test fails RED with the question on screen.
// That is the intended failure — repoint the topic (or fix the bank)
// and keep going. Before, a random draw could not fail these tests;
// that was the problem, not the safety.

import { test, expect } from './fixtures.js';

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

// Every test in this file opens a fresh page and starts a practice set, so
// each one pays for a cold lazy-load of the question bank before it can even
// begin asserting. The default 30s budget occasionally ran out on the very
// first step under parallel workers — an intermittent, one-engine-at-a-time
// failure that looked like a UI bug and was not. Same 60s allowance
// system-polish and connected-study already use for comparable work.
test.setTimeout(60_000);

const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';

/**
 * /app/study → exotic → the bird-infect topic → a fixed-size practice
 * set on question 1, with the instant-feedback toggle already in
 * `instant`. The topic's bank renders option buttons on every
 * question, so the first card is an MCQ card; the helper ends by
 * asserting that, which is also the loud-red tripwire for the day the
 * bank changes shape.
 */
async function openTopicPractice(page, { count = 3, instant = true } = {}) {
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();

  // The topic card is the .vmx-topic-main button whose label names the topic.
  await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();

  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
  const toggle = page.getByRole('switch', { name: /เฉลยทันที/ });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-checked')) !== String(instant)) await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', String(instant));

  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(count));
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-option').first()).toBeVisible();
}

/** The exam entry on the subject screen's second tab: whole-subject pool, exam mode. */
async function openSubjectExam(page, { count = 3 } = {}) {
  await page.goto('/app/study');
  await page.locator(`[data-subject="${SUBJECT}"]`).click();

  // The mode cards (ฝึกซ้อม / สอบจริง) live on the subject screen's second
  // tab; the topic grid owns the first one.
  await page.getByRole('tab', { name: /สื่อเรียนและโหมดสอบ/ }).click();
  await page.getByRole('button', { name: /สอบจริง/ }).click();

  await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า/ })).toBeVisible();
  // The toggle must not even be offered — an exam has no per-question
  // verdicts to opt into.
  await expect(page.getByRole('switch', { name: /เฉลยทันที/ })).toHaveCount(0);

  await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill(String(count));
  await page.getByRole('button', { name: /เริ่ม/ }).click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.vmx-option').first()).toBeVisible();
}

test.describe('instant answer feedback', () => {
  test('reveals the verdict and locks the options on click', async ({ page }) => {
    await openTopicPractice(page);

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
    await openTopicPractice(page);

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
    await openTopicPractice(page, { instant: false });

    await page.locator('.vmx-option').first().click();
    await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
    await expect(page.locator('.vmx-option').first()).toBeEnabled();
  });

  test('never reveals in exam mode', async ({ page }) => {
    await openSubjectExam(page);

    await page.locator('.vmx-option').first().click();
    await expect(page.locator('.vmx-instant-feedback')).toHaveCount(0);
    await expect(page.locator('.vmx-live-score')).toHaveCount(0);
    // Still changeable — an exam lets you revisit your answer.
    await expect(page.locator('.vmx-option').first()).toBeEnabled();
  });

  // A wrong answer in practice mode is the moment the checked summary
  // earns its tap — the same button review already offers, now offered
  // at the exact second the miss happens. On the fixed topic every
  // question maps to an article, so the old "skip when this question has
  // no article" escape is gone: after the first miss the button MUST be
  // on screen, and clicking it must open the article's /wiki/ URL.
  // Six questions, because answering all six correctly is the only
  // failure left, and it is no better than a skip — a rare red telling
  // the truth beats a common green that proves nothing.
  test('a wrong answer offers the VetWiki summary and it navigates', async ({ page }) => {
    await openTopicPractice(page, { count: 6 });

    const wikiLink = /อ่านสรุปเรื่องนี้ใน VetWiki|จุดที่หลักฐานไม่ตรงกับที่บรรยาย/;
    for (let i = 0; i < 6; i++) {
      await page.locator('.vmx-option').first().click();
      const verdict = page.locator('.vmx-instant-feedback');
      await expect(verdict).toBeVisible();

      const picked = page.locator('.vmx-option.selected');
      const wasCorrect = await picked.evaluate((el) => el.classList.contains('is-correct'));

      if (!wasCorrect) {
        // The miss this test exists for — and on this topic there is no
        // question for which that is not true.
        const wikiButton = verdict.getByRole('button', { name: wikiLink });
        await expect(wikiButton).toBeVisible();

        await wikiButton.click();
        // openWiki() routes the knowledge view and writes the article's
        // path into the URL — the same deep-link the wiki share button
        // produces, so this is the navigation contract, not a cosmetic hop.
        await expect(page).toHaveURL(/\/wiki\//, { timeout: 15_000 });
        await expect(page.locator('.vmx-question-card')).toHaveCount(0);
        expect(consoleErrors.join('\n')).toBe('');
        return;
      }

      // Correct answer: the nudge must stay hidden — review's rule,
      // now pinned for instant feedback too.
      await expect(verdict.getByRole('button', { name: wikiLink })).toHaveCount(0);
      const next = page.getByRole('button', { name: /ข้อถัดไป/ }).first();
      if (!(await next.isVisible().catch(() => false))) break;
      await next.click();
      await expect(page.locator('.vmx-option').first()).toBeVisible();
    }

    throw new Error('six correct answers in a row on this topic — raise the set size, or repoint the topic to another strict one');
  });
});
