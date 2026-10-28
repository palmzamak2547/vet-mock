import { test, expect } from './fixtures.js';

// A returning student whose saved pick names a paper that is over lands on the
// paper current now (hooks/useSelectedPhase.js). On 28 Oct a กลางภาค picked in
// September still scoped every set, with the final four weeks away. The pinned
// day is 25 Sep 18:15, after every midterm.

function seed(context, phase) {
  return context.addInitScript(([p]) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      // Seeded once: a reload must read what the app saved, not the seed again.
      if (window.localStorage.getItem('vmx-selected-phase') == null) {
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
      }
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    } catch {}
  }, [phase]);
}

test.describe('a pick saved before its paper ended', () => {
  // No anchor: the pick was saved before the midterm, as every pick before this release was.
  test.use({ phasePickedAtPin: false });

  test('moves to the final on the next visit and says so in one line', async ({ page, context }) => {
    await seed(context, '1-mid');
    await page.goto('/app');
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 ปลาย');
    await expect(page.getByRole('status').filter({ hasText: 'เปลี่ยนเป็นเทอม 1 ปลายภาคให้แล้ว' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-selected-phase')))).toBe('1-final');
    // Once: the next visit opens on the final with nothing to announce.
    await page.reload();
    await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 ปลาย');
    await expect(page.locator('.vmx-phase-moved')).toHaveCount(0);
  });
});

test('a pick made after its paper ended stays, and nothing is announced', async ({ page, context }) => {
  // The fixture anchors a seeded pick to the pinned instant: revising the midterm after it.
  await seed(context, '1-mid');
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('.vmx-subject-scope')).toContainText('เทอม 1 กลาง');
  await expect(page.locator('.vmx-phase-moved')).toHaveCount(0);
});
