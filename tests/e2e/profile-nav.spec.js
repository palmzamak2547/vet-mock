import { test, expect } from './fixtures.js';

// The fifth bottom-bar slot used to be the VetWiki shortcut. Owner feedback
// 2026-10-11 ("ย้ายช่อง short cut vet wiki ด้านล่างขวาออก ใส่ profile เข้าไปแทน")
// moved it to a PROFILE hub that also carries the personal study controls, so
// the bar now ends at โปรไฟล์ and VetWiki is one row inside the hub.
// This spec holds both halves: the bar's last destination, and the hub that
// destination opens.
//
// The hub deliberately has no URL of its own: it is a personal screen, so
// `view-route.js` keeps it out of the route table (and lint:og therefore does
// not demand a public 1200×630 share cover for it). Every test reaches it the
// way a student does — through the nav row itself.

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    // The year front door would otherwise hold a seeded-year visitor on
    // year-select instead of Home, and the bar is what is under test.
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
  });
});

// The rail (desktop) and the bottom bar (phone) draw the same NAV_ITEMS, so
// one row always carries the label; click whichever this viewport shows.
async function openProfileHub(page) {
  const row = page.getByRole('button', { name: 'โปรไฟล์', exact: true });
  await expect(row.first()).toBeVisible();
  await row.first().click();
  await expect(page.locator('.vmx-hero h1')).toContainText('โปรไฟล์');
}

test('the bottom bar ends at the profile hub, not at the VetWiki shortcut', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the bottom bar is the phone surface; the desktop rail owns the sidebar');
  await page.goto('/');

  const bar = page.locator('.vmx-bottom-nav');
  await expect(bar).toBeVisible();
  const items = bar.getByRole('button');
  await expect(items).toHaveCount(5);
  await expect(items.last()).toHaveText('โปรไฟล์');
  // VetWiki left the bar; it must still be reachable from inside the hub.
  await expect(bar).not.toContainText('VetWiki');

  await items.last().click();
  await expect(page.locator('.vmx-hero h1')).toContainText('โปรไฟล์');
});

test('the profile hub carries the stats section, the study lists and VetWiki', async ({ page }) => {
  await page.goto('/');
  await openProfileHub(page);

  const hub = page.locator('main');
  await expect(hub.locator('.vmx-hero h1')).toHaveText('โปรไฟล์ ของฉัน');

  // Stats — the streak is read from the saved record, so the tiles show even
  // for a brand-new browser with no history at all.
  await expect(hub.getByRole('heading', { name: 'สถิติของฉัน' })).toBeVisible();
  await expect(hub.getByText('วันต่อเนื่อง')).toBeVisible();
  await expect(hub.getByText('ข้อวันนี้')).toBeVisible();
  await expect(hub.getByText('ข้อทั้งหมด')).toBeVisible();

  // Personal study lists, settings and the app itself.
  await expect(hub.getByRole('heading', { name: 'การเรียนของฉัน' })).toBeVisible();
  await expect(hub.getByRole('button', { name: /รายการอ่าน/ })).toBeVisible();
  await expect(hub.getByRole('heading', { name: 'การตั้งค่า' })).toBeVisible();
  await expect(hub.getByRole('heading', { name: 'แอปของฉัน' })).toBeVisible();

  // The bar's old destination, now one tap inside the hub.
  const wikiRow = hub.locator('[data-testid="profile-vetwiki-row"]');
  await expect(wikiRow).toBeVisible();
  await expect(wikiRow).toContainText('VetWiki');
  await wikiRow.click();
  await expect(page).toHaveURL(/\/wiki/);
  await expect(page.getByRole('heading', { level: 1, name: 'VetWiki' })).toBeVisible({ timeout: 10_000 });
});

test('the hub works signed out and its Back returns to Home', async ({ page }) => {
  await page.goto('/');
  await openProfileHub(page);

  const hub = page.locator('main');
  // A guest gets the invitation and still gets every setting below it. The
  // invite button itself is drawn only where Supabase is configured, so the
  // copy both states carry is what is asserted here.
  await expect(hub.getByText('กำลังใช้งานแบบไม่เข้าสู่ระบบ')).toBeVisible();
  await expect(hub.getByText(/เก็บความคืบหน้าลงบัญชี/)).toBeVisible();
  await expect(hub.getByRole('heading', { name: 'การตั้งค่า' })).toBeVisible();
  await expect(hub.getByRole('heading', { name: 'แอปของฉัน' })).toBeVisible();

  await page.locator('.vmx-back-chip').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.vmx-hero h1')).toContainText(/พร้อมฝึกสำหรับ|สวัสดี/);
});
