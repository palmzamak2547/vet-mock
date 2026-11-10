// A table in a passage and in an explanation (src/lib/rich-blocks.js): the card
// draws it as a table, never as bars and dashes, and a wide one scrolls inside
// itself instead of widening the page.
//
// The questions are opened through a pin, as answer-evidence.spec.js does: a
// set drawn at random would not hold them.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks } from '../../src/lib/rich-blocks.js';

const tablesIn = (text) => splitBlocks(text).filter((b) => b.type === 'table');

async function pick(wanted) {
  for (const file of bankFiles('src/data')) {
    for (const q of (await readBank(file)).questions) if (wanted(q)) return q;
  }
  return null;
}

async function openPinned(page, q) {
  const pin = { id: 1, type: 'question', label: 'ข้อที่มีตาราง', payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript(([seed, year]) => {
    if (localStorage.getItem('question-tables-seeded')) return;
    localStorage.setItem('question-tables-seeded', '1');
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
}

const pageFits = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

test.setTimeout(90_000);

test('a passage that holds a table shows it as a table, and the page does not widen', async ({ page }) => {
  const q = await pick((x) => x.subject === 'epidemiology' && x.type === 'mcq' && tablesIn(x.passage).length === 1 && tablesIn(x.passage)[0].head.length >= 4);
  expect(q, 'no Epidemiology passage holds a table of four columns any more').toBeTruthy();
  const [table] = tablesIn(q.passage);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await openPinned(page, q);
  const pane = page.locator('.vmx-q-passage-pane');
  const drawn = pane.locator('table.vmx-qtable');
  await expect(drawn).toBeVisible();
  await expect(drawn.locator('tbody tr')).toHaveCount(table.rows.length);
  await expect(drawn.locator('thead th')).toHaveCount(table.head.filter(Boolean).length);
  for (const cell of table.rows[0].filter(Boolean)) await expect(drawn.locator('tbody tr').first()).toContainText(cell);
  // Nothing of the table's own syntax reaches the student.
  await expect(pane).not.toContainText('|---');
  await expect(pane).not.toContainText('| ');
  expect(await pageFits(page), 'the table scrolls inside itself').toBe(true);
  // The prose around it is still there, once.
  const prose = splitBlocks(q.passage).find((b) => b.type === 'text');
  if (prose) await expect(pane).toContainText(prose.text.slice(0, 40));
  expect(errors).toEqual([]);
});

test('an explanation that holds a table shows it as a table after the answer', async ({ page }) => {
  const q = await pick((x) => x.type === 'mcq' && Array.isArray(x.options) && !x.passage && !x.image && tablesIn(x.explain).length === 1);
  expect(q, 'no explanation holds a table any more').toBeTruthy();
  const [table] = tablesIn(q.explain);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await openPinned(page, q);
  await expect(page.locator('table.vmx-qtable')).toHaveCount(0);
  await page.locator('.vmx-option').first().click();
  const body = page.locator('.vmx-feedback-explain-body');
  await expect(body).toBeVisible();
  const drawn = body.locator('table.vmx-qtable');
  await expect(drawn).toBeVisible();
  await expect(drawn.locator('tbody tr')).toHaveCount(table.rows.length);
  await expect(body).not.toContainText('|---');
  expect(await pageFits(page), 'the table scrolls inside itself').toBe(true);
  expect(errors).toEqual([]);
});
