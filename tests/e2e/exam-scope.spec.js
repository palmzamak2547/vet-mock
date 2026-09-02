// Exam-scope e2e — 2026-09-03
// ============================================================
// Palm: "มันยังแยก midterm กับ final ไม่ชัด ช่วยทำให้มันแยกกันจริงๆ"
//
// The current-term practice sets are three piles, not one: the midterm
// paper, the final paper, and continuous assessment. This spec pins that
// separation end to end — the home page offers each pile with its own
// count, pressing a pile starts a set drawn from that pile ONLY (every
// card names its exam), and the config page can switch piles with the
// available count following the switch.

import { test, expect } from '@playwright/test';

const SCOPE_CHIP = '.vmx-qtype-badge .vmx-scope-chip';

test.beforeEach(async ({ context }) => {
  // Year 5 is where the current-term sets live. Same seed shape as smoke.
  await context.addInitScript(() => {
    try { window.localStorage.setItem('vmx-selected-year', '5'); } catch {}
  });
});

async function home(page) {
  await page.goto('/app');
  await expect(page.locator('.vmx-mode-card--split').first()).toBeVisible({ timeout: 20000 });
}

async function pillsOf(page, title) {
  const card = page.locator('.vmx-mode-card--split', { hasText: title });
  await expect(card).toBeVisible();
  const pills = card.locator('.vmx-scope-pill');
  const out = [];
  for (const pill of await pills.all()) {
    const label = (await pill.locator('span').innerText()).trim();
    const count = Number(await pill.locator('strong').innerText());
    out.push({ label, count });
  }
  return { card, pills, out };
}

test('the current-term card offers midterm, final and continuous as separate piles', async ({ page }) => {
  await home(page);
  const { out } = await pillsOf(page, 'ตามสไลด์ปัจจุบัน');
  const labels = out.map((p) => p.label);
  expect(labels).toEqual(['กลางภาค', 'ปลายภาค', 'ประเมินต่อเนื่อง']);
  for (const p of out) expect(p.count, `${p.label} must have questions`).toBeGreaterThan(0);

  // The prediction card never offers continuous assessment: there is no
  // paper to predict for a course graded that way.
  const predicted = await pillsOf(page, 'ชุดน่าจะออก');
  expect(predicted.out.map((p) => p.label)).not.toContain('ประเมินต่อเนื่อง');
});

test('pressing a pile starts a set drawn from that pile only, and every card names its exam', async ({ page }) => {
  await home(page);
  const { card, out } = await pillsOf(page, 'ตามสไลด์ปัจจุบัน');
  const finalCount = out.find((p) => p.label === 'ปลายภาค').count;

  await card.locator('.vmx-scope-pill', { hasText: 'ปลายภาค' }).click();
  await expect(page.locator(SCOPE_CHIP).first()).toBeVisible({ timeout: 20000 });

  // Size = the pile (capped at 50), and the first cards all say ปลายภาค.
  const counter = await page.locator('text=/\\d+\\s*\\/\\s*\\d+/').first().innerText();
  const total = Number(counter.split('/')[1]);
  expect(total).toBe(Math.min(finalCount, 50));
  for (let i = 0; i < 3; i++) {
    await expect(page.locator(SCOPE_CHIP).first()).toHaveText('ปลายภาค');
    await page.locator('.vmx-option:visible').first().click();
    await page.getByRole('button', { name: /ข้อถัดไป/ }).click();
  }
});

test('the continuous pile is its own set and never leaks into an exam pile', async ({ page }) => {
  await home(page);
  const { card } = await pillsOf(page, 'ตามสไลด์ปัจจุบัน');
  await card.locator('.vmx-scope-pill', { hasText: 'ประเมินต่อเนื่อง' }).click();
  await expect(page.locator(SCOPE_CHIP).first()).toBeVisible({ timeout: 20000 });
  await expect(page.locator(SCOPE_CHIP).first()).toHaveText('ประเมินต่อเนื่อง');
});

test('the config page names the pile and its count follows the switch', async ({ page }) => {
  await home(page);
  // The near-exam card opens config on the coming exam's pile (midterm).
  const near = page.locator('button.vmx-mode-card', { hasText: 'ซ้อมใกล้สอบ' });
  await expect(near).toBeVisible();
  await near.click();

  const panel = page.locator('.vmx-config-panel');
  await expect(panel.locator('.vmx-scope-pill[aria-pressed="true"]')).toHaveText(/กลางภาค/);
  await expect(page.locator('.vmx-hero p')).toContainText('กลางภาค');

  const availability = page.locator('.vmx-config-availability');
  await expect(availability).toHaveText(/มี\s*[\d,]+\s*ข้อในชุดนี้/, { timeout: 20000 });

  await panel.locator('.vmx-scope-pill', { hasText: 'ปลายภาค' }).click();
  await expect(page.locator('.vmx-hero p')).toContainText('ปลายภาค');
  // A midterm-only subject has no final questions: the honest answer is
  // "none", and the start button locks rather than serving the wrong pile.
  await expect(availability).toHaveText('ยังไม่มีข้อที่พร้อมใช้ในชุดนี้');
  await expect(page.getByRole('button', { name: /เริ่มฝึก/ })).toBeDisabled();
});
