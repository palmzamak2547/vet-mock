// The community on the dev server, where online/demo.js stands in for the backend: the board
// reads signed out, a sign-in leads to a profile, a thread gets a reply, a room gets a message,
// and a question in the bank leads to its threads.
import { test, expect, overflow } from './fixtures.mjs';

// Onboarding: who you are, about you, what you are revising, then the welcome with three ways in.
async function join(page, handle = 'palm_vet') {
  await page.locator('.acct-btn').click();
  await page.locator('.signin-google').click();
  const form = page.locator('.sheet .pform');
  await expect(form).toBeVisible();
  await expect(page.locator('.steps li.on')).toContainText('ตัวตน');
  await form.getByLabel('ชื่อที่แสดง').fill('ปาล์ม');
  await form.getByLabel('ชื่อผู้ใช้').fill(handle);
  await expect(form.locator('.claim-note.is-free')).toContainText(`vca.vetmock.com/u/${handle}`);
  await expect(page.locator('.sheet .pcard-name')).toHaveText('ปาล์ม');
  await form.locator('.pform-go .btn-ink').click();
  await expect(page.locator('.steps li.on')).toContainText('เกี่ยวกับคุณ');
  await form.locator('.pform-go .btn-ink').click();
  await expect(page.locator('.steps li.on')).toContainText('หมวดที่สนใจ');
  await form.locator('.pform-focus .chip').first().click();
  await expect(form.locator('.pform-focus .chip[aria-pressed="true"]')).toHaveCount(1);
  await form.locator('.pform-go .btn-ink').click();
  const welcome = page.locator('.sheet .welcome');
  await expect(welcome.locator('.pcard.is-stamped .pcard-stamp')).toBeVisible();
  await expect(welcome.locator('.welcome-h')).toHaveText(`@${handle} เป็นของคุณแล้ว`);
  await expect(welcome.locator('.welcome-go a, .welcome-go button, .welcome-ways a')).toHaveCount(4);
  await page.keyboard.press('Escape');
  await expect(welcome).toBeHidden();
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

// Photos: a profile picture framed in the cropper, pictures on a thread and on a reply, and the
// full-screen viewer. The demo backend keeps the files in the tab.
const PHOTO = new URL('../../public/icons/icon-512.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

test('a profile picture, and pictures on a thread and a reply', async ({ page }) => {
  await page.goto('/community');
  await join(page, 'photo_vet');

  await page.locator('.acct-btn').click();
  await page.locator('.sheet').getByRole('button', { name: /แก้ไขโปรไฟล์|โปรไฟล์/ }).first().click();
  await page.locator('.photo-pick input[type="file"]').setInputFiles(PHOTO);
  await expect(page.locator('.crop-stage')).toBeVisible();
  await page.locator('.crop-zoom input').fill('1.5');
  await page.locator('.crop-go .btn-ink').click();
  await expect(page.locator('.sheet .pcard .av.has-photo')).toBeVisible();
  await page.locator('.pform-go .btn-ink').click();
  await expect(page.locator('.acct-btn .av.has-photo')).toBeVisible();

  await page.goto('/community/new');
  const form = page.locator('.compose-form');
  await form.getByLabel('หัวข้อ').fill('รูปรอยโรคที่ไม่แน่ใจ');
  await form.getByLabel('รายละเอียด').fill('ช่วยดูหน่อย');
  await form.locator('.compose-media input[type="file"]').setInputFiles([PHOTO, PHOTO]);
  await expect(form.locator('.tray-item.is-ready')).toHaveCount(2);
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('.thread .mg-2 .mg-item')).toHaveCount(2);

  await page.locator('.thread .mg-item').first().click();
  await expect(page.locator('.lb')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lb')).toHaveAttribute('aria-label', 'รูป 2 จาก 2');
  await page.keyboard.press('Escape');
  await expect(page.locator('.lb')).toHaveCount(0);

  // A reply can be a picture alone.
  await page.locator('.composer input[type="file"]').setInputFiles(PHOTO);
  await expect(page.locator('.composer .tray-item.is-ready')).toHaveCount(1);
  await page.locator('.composer button[type="submit"]').click();
  await expect(page.locator('.cmt .mg .mg-item')).toHaveCount(1);
  expect(await overflow(page)).toBe(0);
});

// The link preview a profile shares (online/cover.js): drawn in the page at the size every
// network asks for, and not blank.
test('a profile cover draws at 1200 x 630', async ({ page }) => {
  await page.goto('/community');
  const out = await page.evaluate(async () => {
    const { drawCover } = await import('/src/online/cover.js');
    const blob = await drawCover({ name: 'ปาล์ม', handle: 'palm_vet', avatar: '🐶', tone: 'verd', school: 'จุฬาลงกรณ์มหาวิทยาลัย', cohort: 'Vet 86', round: '2/2569', focus: ['equine', 'swine'] });
    const bmp = await createImageBitmap(blob);
    return { type: blob.type, size: blob.size, w: bmp.width, h: bmp.height };
  });
  expect(out).toMatchObject({ type: 'image/jpeg', w: 1200, h: 630 });
  expect(out.size).toBeGreaterThan(30_000);
});
