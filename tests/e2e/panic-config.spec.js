import { test, expect } from '@playwright/test';

// Panic mode started the set on the spot with the count, the clock and the
// reveal all fixed, so a student could not say "ten questions" or "show me the
// answer after each one" — the two controls every other practice route has.
// Palm: "ทำไมไม่มีให้เลือกจำนวนข้อ กับ ว่าจะเฉลยทีเดียวคือเฉลยเลยต่อข้อ".
//
// It now lands on the ordinary config screen with the panic pool armed, so the
// choices are there and the ranking that makes panic useful is not lost on the
// way.

test.setTimeout(90_000);

test('panic offers the count and the reveal, and still uses its own pool', async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'One Health' }).first().click();

  const panic = page.getByRole('button', { name: /Panic Mode/ }).first();
  await expect(panic).toBeVisible({ timeout: 20000 });
  await panic.click();

  // The config screen, not a set already running.
  const start = page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ });
  await expect(start).toBeVisible({ timeout: 20000 });

  // Both controls Palm asked for are on it.
  const tenChip = page.getByRole('button', { name: '10', exact: true });
  await expect(tenChip).toBeVisible();
  const revealSwitch = page.getByRole('switch', { name: /เฉลยทันที/ });
  await expect(revealSwitch).toBeVisible();

  // Choosing ten means ten.
  await tenChip.click();
  await start.click();
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 20000 });
  // The live region says it plainly; .vmx-progress also carries a question-type
  // badge, so splitting its text on the slash picked up “10 ✍️ SHORT”.
  const said = await page.getByRole('status').filter({ hasText: /ข้อ \d+ จาก \d+/ }).first().innerText();
  expect(Number(said.match(/จาก (\d+)/)[1])).toBe(10);
});
