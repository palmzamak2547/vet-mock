// A drawn figure in an explanation (src/lib/figure-spec.js): after an answer
// in practice the panel draws it as a labelled image beside the whole
// explanation, finished, inside its box at 320, 360 and 188 px (200% zoom) as
// well as the engine's own width, and nothing below it moves when its drawing
// arrives late; the voice is never handed the block.
//
// The question is opened through a pin, as question-tables.spec.js does, and
// chosen from the bank by what it holds, lowest id first.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks, wholeExplain } from '../../src/lib/rich-blocks.js';
import { parseFigure } from '../../src/lib/figure-spec.js';

async function pick(kind) {
  const found = [];
  for (const file of bankFiles('src/data')) {
    for (const q of (await readBank(file)).questions) {
      if (q.type === 'mcq' && splitBlocks(q.explain).some((b) => b.type === 'figure' && b.kind === kind)) found.push(q);
    }
  }
  return found.sort((a, b) => a.id - b.id)[0] || null;
}

async function answer(page, q, { width, delay = 0 } = {}) {
  if (width) await page.setViewportSize({ width, height: 800 });
  if (delay) await page.route(/ExplainFigure/, async (route) => { await new Promise((r) => setTimeout(r, delay)); await route.continue(); });
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
  // No figure before the answer.
  await expect(page.locator('figure.vmx-fig')).toHaveCount(0);
  await page.locator('.vmx-option').filter({ hasText: q.options[q.answer] }).first().click();
}

// Every mark inside the figure's box, no cell's numeral wider than its cell, no page scroll sideways.
const fits = (fig) => fig.evaluate((el) => {
  const box = el.getBoundingClientRect();
  const out = [...el.querySelectorAll('*')].filter((n) => { const r = n.getBoundingClientRect(); return r.width && (r.left < box.left - 1 || r.right > box.right + 1 || r.bottom > box.bottom + 1); });
  const cells = [...el.querySelectorAll('.c')].filter((c) => [...c.children].some((ch) => ch.getBoundingClientRect().width > c.clientWidth + 1));
  return { out: out.length, cells: cells.length, page: document.documentElement.scrollWidth <= document.documentElement.clientWidth };
});

test.setTimeout(120_000);

test('a 2x2 figure under a fresh answer: named, finished, beside its whole text, never read aloud', async ({ page }) => {
  const q = await pick('twobytwo');
  test.skip(!q, 'no question carries a 2x2 figure');
  expect(wholeExplain(q)).not.toContain('```');
  await answer(page, q);
  const fig = page.locator('.vmx-instant-feedback figure.vmx-fig');
  await expect(fig).toBeVisible({ timeout: 15_000 });
  await expect(fig).toHaveAttribute('role', 'img');
  const block = splitBlocks(q.explain).find((b) => b.type === 'figure');
  const calc = parseFigure(block.kind, block.body).calcs[0];
  expect(await fig.getAttribute('aria-label')).toContain(calc.result);
  // The fence never reaches the screen as text, and every sentence of the explanation is still there.
  const panel = page.locator('.vmx-instant-feedback');
  await expect(panel).not.toContainText('```');
  for (const line of q.explain.split('\n').filter((l) => /^\*\*[^*]+\*\*/.test(l))) await expect(panel).toContainText(line.replace(/\*\*/g, '').slice(0, 30));
  await fig.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  // Finished: the emphasis has come in (or was never held back).
  await expect.poll(() => fig.evaluate((el) => [...el.querySelectorAll('[data-s]')].every((n) => getComputedStyle(n).opacity === '1')), { timeout: 5_000 }).toBe(true);
  await expect(fig.locator('.vmx-fig-calc .res').first()).toHaveText(calc.result);
  expect(await fits(fig)).toEqual({ out: 0, cells: 0, page: true });
});

for (const width of [320, 360, 188]) {
  for (const kind of ['twobytwo', 'timeline']) {
    test(`the ${kind} figure fits its box at ${width} px`, async ({ page }) => {
      const q = await pick(kind);
      test.skip(!q, `no question carries a ${kind} figure`);
      await answer(page, q, { width });
      const fig = page.locator('.vmx-instant-feedback figure.vmx-fig');
      await expect(fig).toBeVisible({ timeout: 15_000 });
      expect(await fits(fig)).toEqual({ out: 0, cells: 0, page: true });
    });
  }
}

test('a drawing that arrives late moves nothing below it', async ({ page }) => {
  const q = await pick('twobytwo');
  test.skip(!q, 'no question carries a 2x2 figure');
  await answer(page, q, { width: 375, delay: 4_000 });
  const slot = page.locator('.vmx-instant-feedback .vmx-fig-slot');
  await expect(slot.locator('.is-hold')).toBeVisible({ timeout: 10_000 });
  const below = () => slot.evaluate((el) => { const next = el.nextElementSibling || el.parentElement.nextElementSibling; return Math.round(next.getBoundingClientRect().top + window.scrollY); });
  const before = await below();
  await expect(slot.locator('figure.vmx-fig')).toBeVisible({ timeout: 15_000 });
  expect(Math.abs((await below()) - before)).toBeLessThanOrEqual(1);
});
