import { test, expect } from '@playwright/test';

// The phase screen tells a student that เทอม 1 กลางภาค means "วิชาเทอม 1
// ไม่รวมเนื้อหาปลายภาค". The reading list did not keep that promise: it listed
// every topic of the year, so a year-5 student on กลางภาค was handed 86 topics
// that sit on the final paper — the whole meat-hygiene half of สุขศาสตร์น้ำนม
// among them — and their progress bar was measured against reading they are not
// being examined on yet.
//
// Nothing is erased. A tick on a final topic stays in storage and comes back
// under ปลายภาค, which the second test checks.
//
// Rows are matched by accessible name rather than exact text: each row renders
// as an icon, the topic label and the lecturer in one node, and a topic with a
// note has a second button beside it, so presence is .first() and absence is a
// count of zero.

test.setTimeout(90_000);

const MIDTERM_ROW = /Storage of raw milk/;   // milk half, taught before the midterm
const FINAL_ROW = /Slaughter hygiene design/; // meat half, taught after it

async function openChecklist(page, context, phase) {
  await context.addInitScript((p) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (p) window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
      else window.localStorage.removeItem('vmx-selected-phase');
    } catch {}
  }, phase);
  await page.goto('/app/reading');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20000 });
  // Wait for the list itself, not just the shell.
  await expect(page.getByRole('button', { name: /อ่านแล้ว/ }).first()).toBeVisible({ timeout: 20000 });
}

test('กลางภาค lists no topic that only sits on the final paper', async ({ page, context }) => {
  await openChecklist(page, context, '1-mid');
  await expect(page.getByRole('button', { name: MIDTERM_ROW }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: FINAL_ROW })).toHaveCount(0);
});

test('ปลายภาค still reaches its own topics', async ({ page, context }) => {
  await openChecklist(page, context, '1-final');
  await expect(page.getByRole('button', { name: FINAL_ROW }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: MIDTERM_ROW })).toHaveCount(0);
});

test('with no paper picked the whole year is still there', async ({ page, context }) => {
  await openChecklist(page, context, null);
  await expect(page.getByRole('button', { name: MIDTERM_ROW }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: FINAL_ROW }).first()).toBeVisible();
});
