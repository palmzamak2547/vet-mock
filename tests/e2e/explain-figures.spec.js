// A drawn figure in an explanation (src/lib/figure-spec.js): after an answer
// in practice the panel draws it as a labelled image, finished (every mark
// legible once the reveal has run), inside the phone's width, without moving
// the page; and the voice is never handed the block.
//
// The question is opened through a pin, as question-tables.spec.js does, and
// chosen from the bank by what it holds, lowest id first.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks, wholeExplain } from '../../src/lib/rich-blocks.js';

async function pick(kind) {
  const found = [];
  for (const file of bankFiles('src/data')) {
    for (const q of (await readBank(file)).questions) {
      if (q.type === 'mcq' && splitBlocks(q.explain).some((b) => b.type === 'figure' && b.fig.kind === kind)) found.push(q);
    }
  }
  return found.sort((a, b) => a.id - b.id)[0] || null;
}

test.setTimeout(90_000);

test('a 2x2 figure under a fresh answer: named, finished, inside the card, never read aloud', async ({ page }) => {
  const q = await pick('twobytwo');
  test.skip(!q, 'no question carries a 2x2 figure');
  expect(wholeExplain(q)).not.toContain('```');
  const pin = { id: 1, type: 'question', label: 'ข้อที่มีภาพ', payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript(([seed, year]) => {
    if (localStorage.getItem('explain-figures-seeded')) return;
    localStorage.setItem('explain-figures-seeded', '1');
    localStorage.setItem('vmx-selected-year', String(year));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([seed]));
  }, [pin, q.year]);
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  await card.click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  // No figure, and no figure code, before the answer.
  await expect(page.locator('figure.vmx-fig')).toHaveCount(0);

  await page.locator('.vmx-option').filter({ hasText: q.options[q.answer].slice(0, 24) }).first().click();
  const fig = page.locator('.vmx-instant-feedback figure.vmx-fig');
  await expect(fig).toBeVisible({ timeout: 15_000 });
  await expect(fig).toHaveAttribute('role', 'img');
  const label = await fig.getAttribute('aria-label');
  const calc = splitBlocks(q.explain).find((b) => b.type === 'figure').fig.calcs[0];
  expect(label).toContain(calc.result);
  // The fence never reaches the screen as text.
  await expect(page.locator('.vmx-instant-feedback')).not.toContainText('```');

  await fig.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  // Finished: the reveal has run (or was skipped) and every staged mark is opaque.
  await expect.poll(() => fig.evaluate((el) => [...el.querySelectorAll('[data-s]')].every((n) => getComputedStyle(n).opacity === '1')), { timeout: 5_000 }).toBe(true);
  await expect(fig.locator('.vmx-fig-calc .res').first()).toHaveText(calc.result);
  const fits = await fig.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const page = document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    const inside = [...el.querySelectorAll('.c, .vmx-fig-calc')].every((n) => { const r = n.getBoundingClientRect(); return r.left >= box.left - 1 && r.right <= box.right + 1; });
    return page && inside;
  });
  expect(fits).toBe(true);
});
