// A paragraph of a note is drawn. The notes once held 3,334 paragraphs in a shape no reader drew
// ({ text }), so a section could open on a bare list with nothing above it saying what it lists
// (scripts/lint-note-shapes.mjs keeps the shapes to the ones the readers know).
import { test, expect } from './fixtures.js';
import { NOTES_Y5_EPIDEMIOLOGY } from '../../src/data/notes-y5-epidemiology.js';

test.setTimeout(90_000);

// What the reader shows of a paragraph: its words without the marks for bold, italic and code.
const shownWords = (paragraph) => paragraph.replace(/\*\*|\*|`/g, '').slice(0, 40);

test('the notes reader draws the paragraphs of a note, not only its lists', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: /ค้นหาวิชา|Search subjects/ }).fill('Epidemiology');
  const card = page.locator('.lp-subject').filter({ hasText: /Epidemiology/i }).first();
  await expect(card).toBeVisible({ timeout: 20_000 });
  await card.click();
  const topic = page.locator('.vmx-topic-card').filter({ has: page.getByRole('button', { name: 'สรุป', exact: true }) }).first();
  await expect(topic).toBeVisible({ timeout: 20_000 });
  await topic.getByRole('button', { name: 'สรุป', exact: true }).click();
  const reader = page.locator('.vmx-notes-grid').first();
  await expect(reader).toBeVisible({ timeout: 20_000 });

  // Whichever note of the subject opened, its paragraphs are on the page.
  const shown = await reader.innerText();
  const note = Object.values(NOTES_Y5_EPIDEMIOLOGY).find((n) => shown.includes(n.title));
  expect(note, 'the reader opened a note of this subject').toBeTruthy();
  const paragraphs = note.sections.flatMap((s) => (s.body || []).filter((item) => typeof item === 'string'));
  expect(paragraphs.length, `"${note.title}" holds a paragraph; if the first topic changed, open one that does`).toBeGreaterThan(0);
  for (const paragraph of paragraphs.slice(0, 3)) await expect(reader).toContainText(shownWords(paragraph));
});
