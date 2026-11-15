import { test, expect } from './fixtures.js';

// The wrap-up as a revision deck: one card per screen, recall first, open,
// then judge. Assertions read the card on screen and the counts the page
// prints, never today's content, so new wrap-up content cannot turn this red.

// Each test walks Home, the subject and the deck, some twice: room for a busy machine.
test.setTimeout(60_000);

async function openDeck(page, context) {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '5');
      if (window.localStorage.getItem('vmx-selected-phase') == null) {
        window.localStorage.setItem('vmx-selected-phase', JSON.stringify('1-final'));
      }
      window.localStorage.setItem('vmx-seen-landing', '1');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
      window.localStorage.setItem('vmx-wrap-mode', 'deck');
    } catch {}
  });
  await page.goto('/app');
  await enter(page);
}

// The wrap-up has no address of its own: after a reload the student comes back through the subject.
async function enter(page) {
  await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สุกร' }).first().click({ timeout: 20000 });
  await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 20000 });
  await expect(page.locator('.vmx-deck-card')).toBeVisible({ timeout: 20000 });
}

const where = (page) => page.locator('.vmx-deck-where > span').first();
const title = (page) => page.locator('#vmx-deck-title');
const pileCount = (page) => page.locator('.vmx-deck-pile-btn b');
// An empty pile is a line that opens nothing (no button), not "ต้องทวน 0".
async function pileIsEmpty(page) {
  await expect(page.locator('.vmx-deck-pile-empty')).toHaveText('ยังไม่มีใบที่ต้องทวน');
  await expect(page.locator('.vmx-deck-pile-btn')).toHaveCount(0);
}
async function total(page) {
  return Number(/จาก (\d+)/.exec(await where(page).innerText())[1]);
}

test('a card is covered until opened, and is judged only after it is seen', async ({ page, context }) => {
  await openDeck(page, context);
  await expect(where(page)).toHaveText(/^ใบที่ 1 จาก \d+$/);
  const n = await total(page);
  // Covered: every part is a closed button, and there is nothing to judge yet.
  const heads = page.locator('.vmx-deck-facet-h');
  expect(await heads.count()).toBeGreaterThan(0);
  for (const h of await heads.all()) await expect(h).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'จำได้' })).toHaveCount(0);
  await expect(page.getByText('นึกก่อน แล้วค่อยเปิด')).toBeVisible();
  // Said once on the screen, beside the card.
  await expect(page.getByText(/นึก(ให้ได้)?ก่อน แล้วค่อยเปิด/)).toHaveCount(1);
  // Nothing marked yet: nothing to open.
  await pileIsEmpty(page);

  // One part can be opened alone.
  await heads.first().click();
  await expect(heads.first()).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  // Everything but the lecturer's long list is open.
  for (const h of await page.locator('.vmx-deck-facet:not(.is-emphasis) .vmx-deck-facet-h').all()) {
    await expect(h).toHaveAttribute('aria-expanded', 'true');
  }
  const first = await title(page).innerText();
  await page.getByRole('button', { name: 'จำได้' }).click();
  await expect(where(page)).toHaveText(`ใบที่ 2 จาก ${n}`);
  await expect(title(page)).not.toHaveText(first);
  await expect(title(page)).toBeFocused();
  await expect(page.locator('.vmx-deck-segs i').first()).toHaveClass(/is-known/);
  // The new card starts covered again.
  await expect(page.getByRole('button', { name: 'เปิดคำตอบ' })).toBeVisible();
  // Thumb-sized controls, measured once the arriving card has settled (it rises in, slightly scaled).
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
  for (const b of [page.getByRole('button', { name: 'เปิดคำตอบ' }), page.locator('.vmx-deck-pile-btn'), heads.first()]) {
    expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
});

test('a card marked ต้องทวน comes back in its own round', async ({ page, context }) => {
  await openDeck(page, context);
  const first = await title(page).innerText();
  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  await page.getByRole('button', { name: 'ต้องทวน', exact: true }).click();
  await expect(pileCount(page)).toHaveText('1');
  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  await page.getByRole('button', { name: 'จำได้' }).click();

  await page.locator('.vmx-deck-pile-btn').click();
  const sheet = page.getByRole('dialog');
  await expect(sheet.getByRole('heading', { name: 'ต้องทวน 1 ใบ' })).toBeVisible();
  await expect(sheet.locator('.vmx-deck-pile li')).toHaveCount(1);
  await expect(sheet.locator('.vmx-deck-pile li')).toContainText(first);
  await sheet.getByRole('button', { name: 'ทวน 1 ใบนี้อีกรอบ' }).click();

  await expect(sheet).toHaveCount(0);
  await expect(title(page)).toHaveText(first);
  await expect(where(page)).toContainText('รอบทวน เหลือ 1 ใบ');
  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  await page.getByRole('button', { name: 'จำได้' }).click();
  // The round is over: what is left to revise, with nothing left.
  await expect(page.getByRole('heading', { name: 'จำได้ครบทุกใบที่ผ่านมา' })).toBeVisible();
  await pileIsEmpty(page);
  // Two cards seen, the rest not: the strip says so, and the way on is the
  // first unseen card, not only a restart that would wipe the marks.
  const n = await page.locator('.vmx-deck-segs i').count();
  await expect(where(page)).toHaveText(`ผ่านไปแล้ว 2 จาก ${n} ใบ`);
  await page.getByRole('button', { name: 'ทวนต่อจากใบที่ 3' }).click();
  await expect(where(page)).toHaveText(`ใบที่ 3 จาก ${n}`);
  await expect(page.locator('.vmx-deck-segs i').nth(0)).toHaveClass(/is-known/);
});

test('the deck is where it was after a reload, and a broken record starts it clean', async ({ page, context }) => {
  await openDeck(page, context);
  const n = await total(page);
  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  await page.getByRole('button', { name: 'ต้องทวน', exact: true }).click();
  await page.getByRole('button', { name: 'เปิดคำตอบ' }).click();
  await page.getByRole('button', { name: 'จำได้' }).click();
  await expect(where(page)).toHaveText(`ใบที่ 3 จาก ${n}`);

  await page.reload();
  await enter(page);
  await expect(where(page)).toHaveText(`ใบที่ 3 จาก ${n}`);
  await expect(pileCount(page)).toHaveText('1');
  await expect(page.locator('.vmx-deck-segs i').nth(0)).toHaveClass(/is-again/);
  await expect(page.locator('.vmx-deck-segs i').nth(1)).toHaveClass(/is-known/);
  // Recall first, after a reload too.
  await expect(page.getByRole('button', { name: 'เปิดคำตอบ' })).toBeVisible();

  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('vmx-wrap-deck-')));
  expect(keys.length).toBe(1);
  await page.evaluate((k) => localStorage.setItem(k, '{"v":1,"pos":'), keys[0]);
  await page.reload();
  await enter(page);
  await expect(where(page)).toHaveText(`ใบที่ 1 จาก ${n}`);
  await pileIsEmpty(page);
});

test('the keyboard does what a tap does', async ({ page, context }) => {
  await openDeck(page, context);
  const n = await total(page);
  await page.locator('body').click({ position: { x: 2, y: 2 } }).catch(() => {});
  await page.evaluate(() => document.activeElement?.blur());
  // A mark waits for the open card, as the buttons do.
  await page.keyboard.press('2');
  await expect(where(page)).toHaveText(`ใบที่ 1 จาก ${n}`);
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: 'จำได้' })).toBeVisible();
  await page.keyboard.press('1');
  await expect(where(page)).toHaveText(`ใบที่ 2 จาก ${n}`);
  await expect(pileCount(page)).toHaveText('1');
  await expect(title(page)).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('2');
  await expect(where(page)).toHaveText(`ใบที่ 3 จาก ${n}`);
  await page.keyboard.press('ArrowLeft');
  await expect(where(page)).toHaveText(`ใบที่ 2 จาก ${n}`);
  await page.keyboard.press('ArrowRight');
  await expect(where(page)).toHaveText(`ใบที่ 3 จาก ${n}`);

  // A part opens from the keyboard like any button.
  await page.locator('.vmx-deck-facet-h').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.vmx-deck-facet-h').first()).toHaveAttribute('aria-expanded', 'true');

  // The pile opens as a dialog, takes the focus and closes on Escape.
  await page.locator('.vmx-deck-pile-btn').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'ต้องทวน 1 ใบ' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.vmx-deck-pile-btn')).toBeFocused();
});

test('the quick round shows the keywords and the mix-up uncovered, and moves on without a mark', async ({ page, context }) => {
  await openDeck(page, context);
  const n = await total(page);
  await page.getByRole('button', { name: 'รอบเร็ว' }).click();
  await expect(page.getByRole('button', { name: 'รอบเร็ว' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.vmx-deck-facet-h')).toHaveCount(0);
  await expect(page.locator('.vmx-deck-quick .vmx-wrap-keylist li').first()).toBeVisible();
  await page.getByRole('button', { name: 'ถัดไป' }).click();
  await expect(where(page)).toHaveText(`ใบที่ 2 จาก ${n}`);
  await pileIsEmpty(page);
  await expect(page.locator('.vmx-deck-segs i').first()).not.toHaveClass(/is-/);
  await page.getByRole('button', { name: 'ต้องทวน', exact: true }).click();
  await expect(pileCount(page)).toHaveText('1');
});
