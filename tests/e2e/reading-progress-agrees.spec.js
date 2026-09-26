import { test, expect } from './fixtures.js';

// The subject card prints "อ่านแล้ว X%" and the reading list prints its own
// percentage for the same reading. Once the list started following the chosen
// paper, a card that still divided by the whole subject would put two different
// numbers for the same work on two screens.
//
// สุขศาสตร์น้ำนม + เนื้อ is 13 midterm topics and 11 final ones. Ticking exactly
// the 13 means 100% on the midterm paper and 54% across the whole subject, so
// an unscoped denominator cannot pass this by accident.

test.setTimeout(90_000);

const MILK_MIDTERM_TOPICS = [
  'milk-overview', 'milk-quality-composition', 'milk-raw-std', 'milk-biosec-dairy',
  'milk-mastitis', 'milk-raw-storage', 'milk-products-storage', 'milk-quality-determination',
  'milk-microbiology', 'milk-borne-pathogens', 'milk-industry-std', 'milk-processing',
  'milk-cleaning',
];

async function seed(context, phase) {
  await context.addInitScript(({ p, topics }) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (p) window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
      const checklist = {};
      for (const id of topics) checklist[`topic:milk-meat-hygiene/${id}`] = Date.now();
      window.localStorage.setItem('vmx-reading-checklist', JSON.stringify(checklist));
    } catch {}
  }, { p: phase, topics: MILK_MIDTERM_TOPICS });
}

async function cardPercent(page) {
  const card = page.locator('.vmx-subject-card', { hasText: 'สุขศาสตร์น้ำนม' }).first();
  await expect(card).toBeVisible({ timeout: 20000 });
  const text = await card.innerText();
  const m = text.match(/อ่านแล้ว\s*(\d+)%/);
  return m ? Number(m[1]) : null;
}

test('the card counts the paper the reading list counts', async ({ page, context }) => {
  await seed(context, '1-mid');
  await page.goto('/app');
  expect(await cardPercent(page)).toBe(100);

  await page.goto('/app/reading');
  const subject = page.locator('text=/สุขศาสตร์น้ำนม.*หัวข้อ/').first();
  await expect(subject).toBeVisible({ timeout: 20000 });
  expect(await subject.innerText()).toContain('13/13');
});

test('the whole semester still divides by the whole subject', async ({ page, context }) => {
  await seed(context, null);
  await context.addInitScript(() => {
    try { window.localStorage.removeItem('vmx-selected-phase'); } catch {}
  });
  await page.goto('/app');
  const pct = await cardPercent(page);
  expect(pct).toBeGreaterThan(0);
  expect(pct).toBeLessThan(100); // 13 of 24
});
