import { test, expect } from '@playwright/test';

// The topic list must show the paper the student picked, and only that paper.
//
// Every topic in curriculum.js carries examScope, and nothing read it. Choosing
// กลางภาค still listed all ten equine reproduction topics, so endometritis, the
// male organs, AI, surgery and pregnancy — all marked 'final' — appeared with no
// questions behind them and the line "รอเนื้อหาเพิ่ม", which tells a student the
// content is on its way when the truth is that the topic is not on their paper.
//
// Filtering on the topic's declared scope alone is wrong in the other direction.
// Three equine and seven aquatic topics are marked 'final' while holding
// questions scoped 'midterm' — ten in equine dentistry, seven in equine
// respiratory — so a declared-scope filter would have taken 36 real midterm
// questions off a student revising for the midterm. A topic belongs on the paper
// it HAS questions for, or the paper it says it is on; it is hidden only when it
// says it is not on this paper and has nothing for it.

function seed(context, phase) {
  return context.addInitScript(([p]) => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (p) window.localStorage.setItem('vmx-selected-phase', JSON.stringify(p));
    } catch {}
  }, [phase]);
}

async function openSubject(page, thaiName) {
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: thaiName }).first().click();
  await expect(page.locator('.vmx-topic-card, .vmx-mode-card').first()).toBeVisible({ timeout: 20000 });
}

test('midterm hides the topics that only sit on the final paper', async ({ page, context }) => {
  await seed(context, '1-mid');
  await openSubject(page, 'การสืบพันธุ์ในม้า');

  const body = page.locator('.vmx-app');
  // 'final' with no midterm questions behind them — off this paper entirely.
  for (const label of ['Endometritis in mare', 'Male reproductive organ functions', 'Artificial insemination']) {
    await expect(body.getByText(label, { exact: false })).toHaveCount(0);
  }
  // 'both' sits on either paper.
  await expect(body.getByText('Reproductive infectious dz in stallion', { exact: false }).first()).toBeVisible();
});

test('the final paper keeps its own topics', async ({ page, context }) => {
  await seed(context, '1-final');
  await openSubject(page, 'การสืบพันธุ์ในม้า');
  const body = page.locator('.vmx-app');
  await expect(body.getByText('Endometritis in mare', { exact: false }).first()).toBeVisible();
  await expect(body.getByText('Reproductive infectious dz in stallion', { exact: false }).first()).toBeVisible();
});

test('the whole semester still reaches every topic', async ({ page, context }) => {
  // The questions recorded from another cohort's midterm are not lost: their
  // topics are on this year's final paper, and on the no-phase view.
  await seed(context, null);
  await openSubject(page, 'การสืบพันธุ์ในม้า');
  const body = page.locator('.vmx-app');
  for (const label of ['Endometritis in mare', 'Artificial insemination', 'Pregnancy & parturition']) {
    await expect(body.getByText(label, { exact: false }).first()).toBeVisible();
  }
});

// The number on a subject card is the paper the student picked.
//
// The handler that opens the card already scoped it, and its comment says why:
// "phase-blind it said 338 for เวชปฏิบัติม้า and served 57". That fix never
// reached the line that prints the number, so the card kept announcing the
// whole subject: 457 questions on Milk Hygiene under ปลายภาค, which has none,
// and 100 on Epidemiology under กลางภาค, which has none.
async function cardCount(page, thaiName) {
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  const card = page.locator('.vmx-subject-card', { hasText: thaiName }).first();
  await expect(card).toBeVisible();
  const text = await card.locator('.count').innerText();
  const m = text.match(/([\d,]+)\s*ข้อ/);
  return m ? Number(m[1].replace(/,/g, '')) : 0;
}

test('a subject card counts the paper, not the whole subject', async ({ page, context }) => {
  await seed(context, '1-final');
  // Milk Hygiene is a midterm-only subject: 457 on the midterm, none on the final.
  expect(await cardCount(page, 'สุขศาสตร์น้ำนม')).toBe(0);
  // Equine medicine has both, and the final is the smaller pile.
  const eqFinal = await cardCount(page, 'เวชปฏิบัติม้า');
  expect(eqFinal).toBeGreaterThan(0);
  expect(eqFinal).toBeLessThan(338);
});

test('the other paper gets its own number', async ({ page, context }) => {
  await seed(context, '1-mid');
  expect(await cardCount(page, 'สุขศาสตร์น้ำนม')).toBeGreaterThan(0);
  // Epidemiology sits no midterm paper.
  expect(await cardCount(page, 'ระบาดวิทยา')).toBe(0);
});

test('with no paper picked the card still shows the whole subject', async ({ page, context }) => {
  await seed(context, null);
  expect(await cardCount(page, 'สุขศาสตร์น้ำนม')).toBeGreaterThan(0);
  expect(await cardCount(page, 'ระบาดวิทยา')).toBeGreaterThan(0);
});
