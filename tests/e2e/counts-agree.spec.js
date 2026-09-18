import { test, expect } from '@playwright/test';

// One number, four screens. A student reads a count on the subject card, then
// on รวมทุกหัวข้อ, then on the config screen, then on the button that starts the
// set — and every one of them has been wrong at some point in a different way:
// the card counted the whole subject while the session served one paper, the
// topic numerator and denominator came from different piles, and Panic offered
// 158 and then said 302.
//
// This walks the chain a student walks and insists the number does not change
// on the way. It does not recompute anything; if the four disagree, one of them
// is lying to somebody sitting an exam next week.

test.setTimeout(120_000);

const num = (s) => {
  const m = String(s).replace(/,/g, '').match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

async function open(page, context, { year, phase }) {
  await context.addInitScript(({ y, p }) => {
    try {
      window.localStorage.setItem('vmx-selected-year', String(y));
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
    } catch {}
  }, { y: year, p: phase });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
}

for (const phase of ['1-mid', '1-final']) {
  test(`the count on the card survives the walk to the start button (${phase})`, async ({ page, context }) => {
    await open(page, context, { year: 5, phase });

    // A subject with questions on both papers, so neither run is a no-op.
    const card = page.locator('.vmx-subject-card', { hasText: 'คลินิกสัตว์น้ำ' }).first();
    await expect(card).toBeVisible({ timeout: 20000 });
    const onCard = num((await card.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]);
    expect(onCard, 'the subject card prints a count').toBeGreaterThan(0);

    await card.click();
    await expect(page.getByRole('heading', { level: 1, name: /เลือก.*หัวข้อ/ })).toBeVisible({ timeout: 20000 });

    const allTopics = page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first();
    await expect(allTopics).toBeVisible();
    const onAll = num((await allTopics.innerText()).match(/(\d[\d,]*)\s*ข้อ/)?.[1]);
    expect(onAll, 'รวมทุกหัวข้อ counts the same paper as the card').toBe(onCard);

    await allTopics.click();
    const start = page.getByRole('button', { name: /^เริ่ม(ฝึก|สอบ)/ });
    await expect(start).toBeVisible({ timeout: 20000 });
    const inSet = num(await page.getByText(/มี [\d,]+ ข้อในชุดนี้/).innerText());
    expect(inSet, 'the config screen counts the pool it will draw from').toBe(onCard);
    // The button carries the CHOSEN count, which is a slice of the pool, so it
    // may be smaller — never larger than what exists to draw from.
    expect(num(await start.innerText()), 'the start button cannot offer more than the pool holds').toBeLessThanOrEqual(inSet);
  });
}
