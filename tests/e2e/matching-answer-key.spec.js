import { test, expect } from '@playwright/test';

// A matching question has to show the answer it tells the student to look at.
//
// After revealing, the screen kept the student's own choice in a disabled
// select, put a ✗ beside the ones that were wrong, and printed a banner reading
// "ถูกบางคู่ — ดูเฉลยด้านล่าง". Nothing below it carried the answer: the correct
// value of each pair was never rendered anywhere on the page. A student who got
// three of four pairs wrong could not find out what the right pairing was from
// the page that had just told them to go and look.

test.setTimeout(90_000);

test('a wrong pair shows what the right pairing was', async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'One Health' }).first().click();
  await page.getByRole('button', { name: /ฝึกข้อสอบ Transdisciplinary collaboration/ }).first().click();
  // The topic holds more questions than the default count now (written ones
  // joined the multiple choice and the matching set), and a shorter random
  // draw can leave the matching question out. Ask for all of them.
  const countInput = page.locator('.vmx-config-panel input[type="number"]').first();
  if (await countInput.count()) await countInput.fill('40');
  await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 20000 });

  // Walk to the matching question in this small set.
  let rows = 0;
  for (let i = 0; i < 40; i += 1) {
    rows = await page.locator('.vmx-match-select-row').count();
    if (rows > 0) break;
    const next = page.getByRole('button', { name: /^ข้อถัดไป/ });
    if (!(await next.count())) break;
    await next.click();
    // A written question left blank asks before moving on (useExamSession);
    // the walk answers that dialog the way a student skipping would.
    const skip = page.getByRole('button', { name: 'ข้ามไปข้อถัดไป', exact: true });
    await skip.waitFor({ state: 'visible', timeout: 1500 }).then(() => skip.click()).catch(() => {});
    await page.waitForTimeout(300);
  }
  expect(rows, 'the topic should reach a matching question').toBeGreaterThan(0);

  // No answers before the reveal — otherwise the question answers itself.
  await expect(page.locator('.vmx-match-answer')).toHaveCount(0);

  // Answer every pair with the FIRST option, so at least one is wrong whenever
  // the question has more than one distinct right-hand value.
  const selects = page.locator('.vmx-match-native-select');
  const count = await selects.count();
  for (let i = 0; i < count; i += 1) {
    const options = await selects.nth(i).locator('option:not([disabled])').all();
    for (const opt of options) {
      const value = await opt.getAttribute('value');
      if (value) { await selects.nth(i).selectOption(value); break; }
    }
  }

  // No submit click: MatchDragDrop reveals as soon as every pair is filled,
  // which is what the student experiences in practice mode.
  await expect(page.locator('.vmx-match-reveal-banner')).toBeVisible({ timeout: 10000 });

  const state = await page.evaluate(() => {
    const wrongRows = document.querySelectorAll('.vmx-match-select-row.wrong').length;
    const answers = [...document.querySelectorAll('.vmx-match-answer')].map((e) => e.textContent.trim());
    const banner = document.querySelector('.vmx-match-reveal-banner')?.textContent || '';
    return { wrongRows, answers, banner };
  });

  // Every row that did not get it right carries the answer for that row.
  expect(state.answers.length).toBeGreaterThanOrEqual(state.wrongRows);
  for (const a of state.answers) {
    expect(a).toContain('เฉลย');
    // Not a bare label: the answer itself has to be there.
    expect(a.replace('เฉลย', '').trim().length).toBeGreaterThan(2);
  }

  // The banner no longer sends anyone to look below for something that is not
  // there. If any pair was missed, it says where the answers actually are.
  if (state.wrongRows > 0) {
    expect(state.banner).toContain('ใต้ช่องคำตอบ');
    expect(state.banner).not.toContain('ด้านล่าง');
  }
});
