import { test, expect } from '@playwright/test';

// On a true/false question, three things told the student three different
// stories at once.
//
// The chosen button was filled red — because the CSS filled True green and
// False red to say WHICH option was picked, not whether it was right. So a
// correct False answer arrived in the same red the app uses for a mistake. The
// banner above it read "✓ ถูกต้อง!", which in Thai also reads as a verdict on
// the statement rather than on the student. And the explanation directly below
// opened with "ไม่ถูกต้อง", which really was about the statement.
//
// Now the fill is neutral until the answer is revealed and then means only
// correctness, the banner says "คุณตอบถูก", and the statement's own verdict is
// printed even when the student got it right — because on this question type
// "you answered correctly" and "the statement is false" are both true at once,
// and only one of them used to be on screen.

test.setTimeout(90_000);

const TF_TOPIC = 'Omphalitis / Ascites / Staphylococcosis';

async function startTopic(page, context) {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สัตว์ปีก' }).first().click();
  await page.getByRole('button', { name: new RegExp(`ฝึกข้อสอบ ${TF_TOPIC.replace(/[/]/g, '\\/')}`) }).first().click();
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  // Wait for the set to render. Checking straight after the click found no
  // question and no next button, so the walk below broke out on its first
  // pass and reported that the topic had no true/false question — while the
  // screenshot showed one on screen.
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 20000 });
}

test('a correct answer never arrives in the colour of a mistake', async ({ page, context }) => {
  await startTopic(page, context);

  // Walk to a true/false question. Three of this topic's questions are
  // true/false, but the set is drawn in a random order and the topic has grown
  // to thirteen questions, so a six-question walk missed all three about one
  // run in five. Walk the whole set instead; the loop still ends at the last
  // question because the "next" button stops existing there.
  let found = false;
  for (let i = 0; i < 40 && !found; i += 1) {
    const tfRow = page.locator('.vmx-tf-row');
    if (await tfRow.count()) { found = true; break; }
    const next = page.getByRole('button', { name: /ข้อถัดไป/ });
    if (!(await next.count())) break;
    await next.click();
    await page.waitForTimeout(250);
  }
  expect(found, 'the topic should reach a true/false question').toBe(true);

  const buttons = page.locator('.vmx-tf-btn');
  await expect(buttons).toHaveCount(2);

  // Before answering, neither option may be wearing a verdict colour.
  const preClasses = await buttons.evaluateAll((els) => els.map((e) => e.className));
  for (const c of preClasses) {
    expect(c).not.toContain('reveal-correct');
    expect(c).not.toContain('reveal-wrong');
  }

  await buttons.first().click();
  await expect(page.locator('.vmx-instant-feedback')).toBeVisible({ timeout: 10000 });

  // .vmx-tf-btn carries `transition: all 0.15s`, and getComputedStyle during a
  // transition returns the interpolated value — reading straight after the
  // class flips gave the colour the button was leaving, which is why this
  // assertion passed alone and failed in a full run. Wait for the fill to
  // settle before measuring it.
  await expect
    .poll(async () => page.evaluate(() => {
      const [first, second] = [...document.querySelectorAll('.vmx-tf-btn')]
        .map((e) => getComputedStyle(e).backgroundColor);
      return first === second;
    }), { timeout: 5000 })
    .toBe(false);

  const state = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.vmx-tf-btn')];
    const fb = document.querySelector('.vmx-instant-feedback');
    return {
      ok: !!fb && fb.classList.contains('is-ok'),
      banner: fb?.querySelector('.v')?.textContent || '',
      hasAnswerLine: !!fb?.querySelector('.a'),
      buttons: els.map((e) => ({
        picked: e.className.includes('selected-'),
        correct: e.className.includes('reveal-correct'),
        wrong: e.className.includes('reveal-wrong'),
        bg: getComputedStyle(e).backgroundColor,
      })),
    };
  });

  // The verdict is on exactly one option, and the student's pick wears the
  // colour of what actually happened.
  expect(state.buttons.filter((b) => b.correct)).toHaveLength(1);
  const picked = state.buttons.find((b) => b.picked);
  expect(picked, 'the clicked option should be marked as picked').toBeTruthy();
  if (state.ok) {
    expect(picked.correct, 'a right answer must not be the option marked wrong').toBe(true);
    expect(picked.wrong).toBe(false);
    expect(state.banner).toContain('คุณตอบถูก');
  } else {
    expect(picked.wrong).toBe(true);
  }

  // The statement's own verdict is on screen either way, so "you answered
  // correctly" and "this statement is false" can both be read without
  // contradicting each other.
  expect(state.hasAnswerLine).toBe(true);

  // Whatever the two options are, they are not both wearing the same colour.
  const [a, b] = state.buttons.map((x) => x.bg);
  expect(a).not.toBe(b);
});
