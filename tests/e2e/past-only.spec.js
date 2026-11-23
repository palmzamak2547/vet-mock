import { test, expect, openAdjust } from './fixtures.js';

// Practise only the questions that have been on a real paper (ข้อสอบเก่า).
// A friend's ask, 23 Nov 2026. The topic screen's switch changes every count
// on the grid, a card opens the config screen on exactly the set it counted,
// the config screen can switch back, the set started is that size, and the
// switch is where the student left it next time.
//
// past-only-practice.test.mjs holds the sets themselves over the whole bank;
// this walks the real screens at every width the suite runs.

test.setTimeout(90_000);

test('ข้อสอบเก่า: the grid counts past papers and the set a card opens is that set', async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'โรคติดต่อระหว่างสัตว์-คน' }).first().click();

  const pool = page.getByRole('group', { name: 'ข้อที่ใช้ฝึก' });
  await expect(pool).toBeVisible({ timeout: 20000 });
  const every = pool.getByRole('button', { name: 'ทุกข้อ', exact: true });
  const past = pool.getByRole('button', { name: 'ข้อสอบเก่า', exact: true });
  await expect(every).toHaveAttribute('aria-pressed', 'true');

  const allCard = page.locator('.vmx-subject-card', { hasText: 'รวมทุกหัวข้อ' }).first();
  const plainAll = Number((await allCard.innerText()).match(/(\d+) ข้อ/)[1]);
  await past.click();
  await expect(past).toHaveAttribute('aria-pressed', 'true');
  await expect(allCard).toContainText(/ข้อสอบเก่า \d+ ข้อ/);
  const pastAll = Number((await allCard.innerText()).match(/ข้อสอบเก่า (\d+) ข้อ/)[1]);
  expect(pastAll).toBeGreaterThan(0);
  expect(pastAll).toBeLessThanOrEqual(plainAll);
  // The share chip would only repeat what every card now says.
  await expect(page.locator('.vmx-topic-past')).toHaveCount(0);
  // A topic with questions but no past paper stays in place and opens nothing.
  const bare = page.locator('.vmx-topic-card[data-no-past] .vmx-topic-main');
  if (await bare.count()) {
    await expect(bare.first()).toBeDisabled();
    await expect(bare.first()).toContainText('ไม่มีข้อสอบเก่า');
  }

  const card = page.locator('.vmx-topic-card:not([data-no-past]) .vmx-topic-main').filter({ hasText: /ข้อสอบเก่า \d+ ข้อ/ }).first();
  const onCard = Number((await card.innerText()).match(/ข้อสอบเก่า (\d+) ข้อ/)[1]);
  await card.click();

  const start = page.getByRole('button', { name: /^เริ่มฝึก/ });
  await expect(start).toBeVisible({ timeout: 20000 });
  await expect(page.locator('#vmx-config-summary')).toContainText('ข้อสอบเก่า');
  await openAdjust(page);
  const row = page.getByRole('group', { name: 'ข้อที่ใช้' });
  await expect(row.getByRole('button', { name: 'ข้อสอบเก่า', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText(/^มี \d+ ข้อในชุดนี้$/)).toHaveText(`มี ${onCard} ข้อในชุดนี้`);

  // Every question of the topic, then back: the count follows each.
  await row.getByRole('button', { name: 'ทุกข้อ', exact: true }).click();
  await expect(page.locator('#vmx-config-summary')).not.toContainText('ข้อสอบเก่า');
  const plain = Number((await page.getByText(/^มี \d+ ข้อในชุดนี้$/).innerText()).match(/(\d+)/)[1]);
  expect(plain).toBeGreaterThanOrEqual(onCard);
  await row.getByRole('button', { name: 'ข้อสอบเก่า', exact: true }).click();
  await expect(page.getByText(/^มี \d+ ข้อในชุดนี้$/)).toHaveText(`มี ${onCard} ข้อในชุดนี้`);

  const wanted = Number((await start.innerText()).match(/(\d+)/)[1]);
  expect(wanted).toBeLessThanOrEqual(onCard);
  await start.click();
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 20000 });
  const said = await page.getByRole('status').filter({ hasText: /ข้อ \d+ จาก \d+/ }).first().innerText();
  expect(Number(said.match(/จาก (\d+)/)[1])).toBe(wanted);
});

test('the switch is kept on the device, and the plain grid is untouched until it is used', async ({ page, context }) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    } catch {}
  });
  await page.goto('/app');
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'คลินิกสัตว์น้ำ' }).first().click();
  const pool = page.getByRole('group', { name: 'ข้อที่ใช้ฝึก' });
  await expect(pool).toBeVisible({ timeout: 20000 });
  // Untouched: the percentage chip still says what share is past papers.
  await expect(page.locator('.vmx-topic-past').first()).toBeVisible();
  await pool.getByRole('button', { name: 'ข้อสอบเก่า', exact: true }).click();

  // A new visit: the app opens on Home, and the subject is opened again.
  await page.reload();
  await expect(page.locator('.vmx-subject-grid')).toBeVisible({ timeout: 20000 });
  await page.locator('.vmx-subject-card', { hasText: 'คลินิกสัตว์น้ำ' }).first().click();
  const again = page.getByRole('group', { name: 'ข้อที่ใช้ฝึก' });
  await expect(again).toBeVisible({ timeout: 20000 });
  await expect(again.getByRole('button', { name: 'ข้อสอบเก่า', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await again.getByRole('button', { name: 'ทุกข้อ', exact: true }).click();
  await expect(page.locator('.vmx-topic-past').first()).toBeVisible();
});
