// A long stem is typeset (src/lib/rich-blocks.js splitStem and proseBlocks,
// drawn by src/components/RichBlocks.jsx): the case above in body type, the
// lab values in a grid whose columns line up, the question alone as the
// heading. On the two Equine POA questions the owner photographed, at an iPad
// in landscape and at a phone: no character of the stem is lost or moved,
// the value column has one left edge per column of the grid, every row of the
// grid is as tall as the next (a glossary term made its row taller), the ask
// is the heading, and the page never scrolls sideways.
//
// Opened through a pin, as question-tables.spec.js does.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';

const IDS = [209599, 209588];
const SIZES = [{ width: 1180, height: 820 }, { width: 390, height: 664 }];

async function questionById(id) {
  for (const file of bankFiles('src/data')) {
    const q = (await readBank(file)).questions.find((x) => x.id === id);
    if (q) return q;
  }
  return null;
}

async function openPinned(page, q) {
  const pin = { id: 1, type: 'question', label: 'โจทย์ยาว', payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript(([seed, year]) => {
    if (localStorage.getItem('stem-typesetting-seeded')) return;
    localStorage.setItem('stem-typesetting-seeded', '1');
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

const collapse = (s) => s.replace(/\s+/g, ' ').trim();

test.setTimeout(90_000);

for (const id of IDS) {
  for (const size of SIZES) {
    test(`${id} at ${size.width} x ${size.height}: typeset, whole, the ask as the heading`, async ({ page }) => {
      const q = await questionById(id);
      expect(q).toBeTruthy();
      await page.setViewportSize(size);
      await openPinned(page, q);
      const stem = page.locator('.vmx-question-card .vmx-qstem');
      await expect(stem).toBeVisible();

      // Every character of the stem, in order.
      expect(collapse(await stem.innerText())).toBe(collapse(q.q));

      // The ask alone is the heading.
      const lines = q.q.split('\n').filter((l) => l.trim());
      const heading = stem.locator('h2.vmx-qtext');
      await expect(heading).toHaveCount(1);
      expect(collapse(await heading.innerText())).toBe(collapse(lines[lines.length - 1]));

      // Nothing marks a value as high, low, positive or negative: no cell has a colour of its own.
      const inks = await stem.locator('.vmx-rb-v, .vmx-rb-r').evaluateAll((els) => [...new Set(els.map((el) => getComputedStyle(el).color))]);
      expect(inks.length).toBeLessThanOrEqual(1);

      if (id === 209599) {
        const values = stem.locator('.vmx-rb-pairs > .vmx-rb-v');
        await expect(values).toHaveCount(21);
        const cells = await values.evaluateAll((els) => els.map((el) => {
          const r = el.getBoundingClientRect();
          return { left: Math.round(r.left), b: el.classList.contains('is-b') };
        }));
        const two = await stem.locator('.vmx-rb-pairs').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length > 3);
        if (size.width >= 1180) expect(two).toBe(true);
        if (size.width < 768) expect(two).toBe(false);
        // One left edge for the values of each column of the grid.
        const first = new Set(cells.filter((c) => !two || !c.b).map((c) => c.left));
        const second = new Set(cells.filter((c) => two && c.b).map((c) => c.left));
        expect(first.size).toBe(1);
        expect(second.size).toBeLessThanOrEqual(1);
        // Every row as tall as the next: the HCT row (a glossary term) used to be 4 px taller.
        const heights = await stem.locator('.vmx-rb-pairs > .vmx-rb-v').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
        const labels = await stem.locator('.vmx-rb-pairs > .vmx-rb-k').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
        const oneLine = Math.min(...heights);
        const hct = labels[2];
        expect(Math.abs(hct - labels[1])).toBeLessThan(1);
        // (On a phone a long label wraps to two lines; those rows are two lines tall, never one and a bit.)
        expect(heights.filter((h) => h < oneLine * 1.5).every((h) => h === oneLine)).toBe(true);
      }

      if (id === 209588) {
        await expect(stem.locator('.vmx-rb-results')).toHaveCount(3);
        await expect(stem.locator('.vmx-rb-lead').first()).toHaveText('Flexion test');
        // The results line up in one column per run.
        const lefts = await stem.locator('.vmx-rb-results').first().locator('.vmx-rb-r').evaluateAll((els) => new Set(els.map((el) => Math.round(el.getBoundingClientRect().left))).size);
        expect(lefts).toBe(1);
      }

      // On an iPad in landscape the ask is in view after one screen of scrolling.
      if (size.width >= 1180) {
        const bottom = await heading.evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
        expect(bottom).toBeLessThanOrEqual(size.height * 2);
      }

      // No sideways scroll.
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    });
  }
}
