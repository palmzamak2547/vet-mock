// The community on the dev server, where online/demo.js stands in for the backend: the board
// reads signed out, a sign-in leads to a profile, a thread gets a reply, a room gets a message,
// and a question in the bank leads to its threads.
import { test, expect, overflow } from './fixtures.mjs';

async function join(page, handle = 'palm_vet') {
  await page.locator('.acct-btn').click();
  await page.locator('.signin-google').click();
  const form = page.locator('.sheet .pform');
  await expect(form).toBeVisible();
  await form.getByLabel('ชื่อที่แสดง').fill('ปาล์ม');
  await form.getByLabel('ชื่อผู้ใช้').fill(handle);
  await form.locator('.pform-go .btn-ink').click();
  await expect(form).toBeHidden();
  await expect(page.locator('.acct-btn.is-in')).toBeVisible();
}

test('the board reads without an account and asks to sign in to join', async ({ page }) => {
  await page.goto('/community');
  await expect(page.locator('a.post-card')).toHaveCount(3);
  await expect(page.locator('.join')).toBeVisible();
  await page.locator('a.post-card').first().click();
  await expect(page.locator('.thread-title')).toContainText('Milk fever');
  await expect(page.locator('.cmt')).toHaveCount(2);
  await expect(page.locator('.cmts .join')).toBeVisible();
  expect(await overflow(page)).toBe(0);
});

test('sign in, make a profile, start a thread and reply to it', async ({ page }) => {
  await page.goto('/community');
  await join(page);
  await expect(page.locator('.join')).toHaveCount(0);

  await page.locator('.board-go a', { hasText: 'ตั้งกระทู้' }).click();
  const form = page.locator('.compose-form');
  await form.getByLabel('หัวข้อ').fill('จำ milk fever กับ grass tetany ยังไงดี');
  await form.getByLabel('รายละเอียด').fill('สับสนทุกครั้งที่เจอ');
  await form.locator('button[type="submit"]').click();

  await expect(page.locator('.thread-title')).toHaveText('จำ milk fever กับ grass tetany ยังไงดี');
  await expect(page).toHaveURL(/\/community\/p\/[0-9a-f-]+$/);
  await page.locator('#reply-body').fill('ขอบคุณครับ');
  await page.locator('.composer button[type="submit"]').click();
  await expect(page.locator('.cmt .cmt-body')).toHaveText('ขอบคุณครับ');
  await expect(page.locator('#reply-body')).toHaveValue('');

  const like = page.locator('.thread-acts .act').first();
  await like.click();
  await expect(like).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/me');
  await expect(page).toHaveURL(/\/u\/palm_vet$/);
  await expect(page.locator('.prof-name')).toHaveText('ปาล์ม');
  await expect(page.locator('.prof-posts a.post-card')).toHaveCount(1);
  expect(await overflow(page)).toBe(0);
});

test('talk in the lobby', async ({ page, isMobile }) => {
  await page.goto('/chat');
  await expect(page.locator('.chat-out .join')).toBeVisible();
  await join(page);
  await page.locator('.room-link', { hasText: 'ห้องรวม' }).click();
  await expect(page).toHaveURL(/\/chat\/lobby$/);
  await expect(page.locator('.msgs .msg')).toHaveCount(4);

  const box = page.locator('#chat-input');
  await box.fill('สวัสดีครับ');
  if (isMobile) await page.locator('.room-send').tap();
  else await box.press('Enter');
  await expect(page.locator('.mgroup.is-me .msg-body')).toHaveText('สวัสดีครับ');
  await expect(box).toHaveValue('');
  // On a phone a conversation has the screen to itself, and back leads to the rooms.
  if (isMobile) {
    await expect(page.locator('.tabbar')).toBeHidden();
    await page.locator('.room-back').tap();
    await expect(page.locator('.rooms')).toBeVisible();
  }
  expect(await overflow(page)).toBe(0);
});

test('a question in the bank leads to its threads', async ({ page }) => {
  await page.goto('/bank?q=Leptospira');
  const first = page.locator('.bk').first();
  await expect(first).toBeVisible({ timeout: 40_000 });
  await first.locator('button', { hasText: 'ดูเฉลย' }).click();
  const talk = first.locator('.prov-talk');
  await expect(talk).toHaveAttribute('href', /^\/community\?q=\d+&d=[a-z-]+$/);
  await talk.click();
  await expect(page.locator('.peek .peek-stem')).toBeVisible();
  await expect(page.locator('.empty-h')).toContainText('ยังไม่มีกระทู้เกี่ยวกับข้อนี้');
});
