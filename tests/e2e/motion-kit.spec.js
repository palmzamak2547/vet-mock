import { test, expect } from '@playwright/test';
import { EFFECTS, GROUPS } from '../../src/lib/motion-kit/catalog.js';
import { STATES } from '../../src/lib/motion-kit/mochi/motion.js';

test.setTimeout(90_000);
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
  });
});
async function open(page) {
  await page.goto('/app/mochi', { waitUntil: 'domcontentloaded' });
  // A cold WebKit page can still be inside Suspense at five seconds while
  // the cross-engine suite is busy. Wait for this view's actual readiness.
  await expect(page.getByRole('heading', { level: 1, name: 'พักกับ Mochi' })).toBeVisible({ timeout: 20_000 });
  await page.getByText('ดูตัวอย่างเอฟเฟกต์และท่า Mochi', { exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).toHaveAttribute('data-ready', 'true', { timeout: 20_000 });
}
async function pick(page, effect) {
  const select = page.getByRole('combobox', { name: 'เลือกกิจกรรม', exact: true });
  if (await select.isVisible()) await select.selectOption(effect.id);
  else await page.locator('.vmx-mochi-choices').getByRole('button', { name: `${effect.th} ${effect.name}`, exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).toHaveAttribute('data-effect', effect.id);
}
async function group(page, id) {
  if (!(await page.getByRole('group', { name: 'หมวดกิจกรรม' }).isVisible())) {
    await page.getByText('ดูตัวอย่างเอฟเฟกต์และท่า Mochi', { exact: true }).click();
  }
  const item = GROUPS.find(g => g.id === id);
  await page.getByRole('group', { name: 'หมวดกิจกรรม' }).getByRole('button', { name: new RegExp(`^${item.name}`) }).click();
}

test('all 60 activities switch cleanly, with no duplicate canvas or console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await open(page);
  for (const g of GROUPS) {
    await group(page, g.id);
    for (const effect of EFFECTS.filter(e => e.group === g.id)) {
      await pick(page, effect);
      await expect(page.getByRole('heading', { level: 2, name: effect.th, exact: true })).toBeVisible();
      expect(await page.locator('.vmx-motion-stage .vm-particles').count()).toBeLessThanOrEqual(1);
      expect(await page.locator('.vmx-motion-stage .vm-mochi-rig').count()).toBeLessThanOrEqual(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, effect.id).toBeLessThanOrEqual(1);
    }
  }
  await page.getByRole('button', { name: 'กลับไปเรียน', exact: true }).first().click();
  await expect(page.locator('.vmx-motion-stage, .vm-mochi-webgl')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Mochi keeps one rig through all 27 poses and pauses without losing the chosen pose', async ({ page }) => {
  await open(page);
  const pose = page.getByRole('combobox', { name: 'ท่าของ Mochi ทั้ง 27 ท่า' });
  for (const state of Object.keys(STATES)) {
    await pose.selectOption(state);
    await expect(pose).toHaveValue(state);
    await expect(page.locator('.vm-mochi-rig')).toHaveCount(1);
  }
  // The real update banner must coexist with Pause/Resume and fixed mobile nav.
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('vmx-sw-update', { detail: { version: 'motion-control-regression' } })));
  await expect(page.getByText('มีเวอร์ชันใหม่พร้อมใช้', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'พักการเคลื่อนไหว', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).toHaveClass(/vm-paused/);
  const before = await page.locator('[data-rig=body]').getAttribute('transform');
  await page.waitForTimeout(160);
  expect(await page.locator('[data-rig=body]').getAttribute('transform')).toBe(before);
  await page.getByRole('button', { name: 'เล่นต่อ', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage')).not.toHaveClass(/vm-paused/);
});

test('quiet preference persists, reduced motion remains functional, games keep real local counts', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.locator('.vmx-motion-stage')).toHaveClass(/vm-quiet/);
  await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  await page.getByRole('combobox', { name: 'การเคลื่อนไหว', exact: true }).selectOption('off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-vmx-motion', 'off');
  await group(page, 'play');
  await pick(page, EFFECTS.find(e => e.id === 'fetch'));
  await page.getByRole('button', { name: 'โยนบอลให้ Mochi ↗', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage .vm-game-status')).toContainText('เก็บบอลแล้ว 1 ครั้ง');
  await pick(page, EFFECTS.find(e => e.id === 'bubbles'));
  for (let i = 1; i < 12; i++) await page.getByRole('button', { name: `จิ้มฟองที่ ${i}`, exact: true }).click();
  await page.getByRole('button', { name: 'จิ้มฟองที่ 12', exact: true }).press('Enter');
  await expect(page.locator('.vmx-motion-stage .vm-game-status')).toContainText('หมดแล้ว');
  await expect(page.getByRole('button', { name: 'จิ้มฟองที่ 12', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'เริ่มกิจกรรมใหม่', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage .vm-game-status')).toHaveText('จิ้มฟองได้ 0/12 ฟอง');
  await pick(page, EFFECTS.find(e => e.id === 'memory'));
  const symbols = await page.locator('.vm-memory-tile').evaluateAll(nodes => nodes.map(n => n.dataset.symbol));
  for (const s of new Set(symbols)) {
    for (const i of symbols.map((v, i) => v === s ? i : -1).filter(i => i >= 0)) await page.locator('.vm-memory-tile').nth(i).click();
  }
  await expect(page.locator('.vmx-motion-stage .vm-game-status')).toContainText('ครบทุกคู่แล้ว! ใช้ 4 ตา');
  await pick(page, EFFECTS.find(e => e.id === 'breath'));
  await page.locator('.vmx-motion-stage').getByRole('button', { name: 'เริ่มหายใจไปด้วยกัน', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage .vm-breath-circle strong')).toHaveText('หายใจเข้า');
  await expect(page.locator('.vmx-motion-stage .vm-breath-circle span')).not.toHaveText('4 วินาที', { timeout: 2500 });
  await page.locator('.vmx-motion-stage').getByRole('button', { name: 'พักก่อน', exact: true }).click();
  await expect(page.locator('.vmx-motion-stage .vm-breath-circle strong')).toHaveText('พักได้ตามสบาย');
});

test('3D is optional, preserves the selected model when switching presets, and cleans up on leave', async ({ page }) => {
  const requests = [];
  page.on('request', r => requests.push(r.url()));
  await open(page);
  expect(requests.some(url => /vendor-atlas|renderer-3d/.test(url))).toBe(false);
  await page.getByRole('button', { name: '3D', exact: true }).click();
  await expect(page.locator('.vm-mochi-webgl')).toBeVisible({ timeout: 20_000 });
  const canvasId = await page.locator('.vm-mochi-webgl').evaluate(el => {
    el.dataset.testIdentity = 'same-rig'; return el.dataset.testIdentity;
  });
  await pick(page, EFFECTS.find(e => e.id === 'mochi-dance'));
  await expect(page.locator('.vm-mochi-webgl')).toHaveAttribute('data-test-identity', canvasId);
  await expect(page.getByRole('button', { name: '3D', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'หมุนมุมมอง ↻', exact: true }).click();
  await group(page, 'play');
  await expect(page.locator('.vm-mochi-webgl')).toHaveCount(0);
});

test('blocked WebGL falls back to 2D without breaking activity selection', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...rest) { return /webgl/i.test(type) ? null : original.call(this, type, ...rest); };
  });
  await open(page);
  await page.getByRole('button', { name: '3D', exact: true }).click();
  await expect(page.locator('.vm-mochi-status')).toContainText('ใช้ 2D ต่อได้เลย', { timeout: 20_000 });
  await expect(page.getByRole('button', { name: '2D', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await pick(page, EFFECTS.find(e => e.id === 'mochi-pet'));
  await expect(page.locator('.vm-mochi-rig')).toBeVisible();
});

test('interaction previews, loader progress and celebrations work without changing study data', async ({ page }) => {
  await open(page);
  const before = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /history|bookmark|streak|notes/.test(key))));
  await group(page, 'interaction');
  for (const effect of EFFECTS.filter(e => e.group === 'interaction')) {
    await pick(page, effect);
    const stage = page.locator('.vmx-motion-stage');
    if (effect.id === 'accordion') await stage.locator('summary').click();
    else await stage.getByRole('button').first().click();
    await expect(stage.locator('.vm-feedback')).not.toHaveText('ลองกดเล่นได้เลย');
    if (effect.id === 'flip') {
      await expect(stage.locator('.vm-flip-front')).toHaveAttribute('aria-hidden', 'true');
      await stage.getByRole('button').first().click();
      await expect(stage.locator('.vm-flip-front')).toHaveAttribute('aria-hidden', 'false');
    }
  }
  await group(page, 'loading');
  await pick(page, EFFECTS.find(e => e.id === 'progress'));
  await page.getByRole('slider', { name: 'ความคืบหน้าเป็นเปอร์เซ็นต์' }).fill('76');
  await expect(page.locator('.vmx-motion-stage [role=progressbar]')).toHaveAttribute('aria-valuenow', '76');
  await group(page, 'celebration');
  for (const effect of EFFECTS.filter(e => e.group === 'celebration')) {
    await pick(page, effect);
    await page.locator('.vmx-motion-stage').getByRole('button').click();
    await expect(page.locator('.vm-particles')).toHaveCount(1);
  }
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => /history|bookmark|streak|notes/.test(key))))).toEqual(before);
});

test('failed preference storage reports the failure while keeping the current choice usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'vmx-motion-settings') throw new DOMException('Quota exceeded', 'QuotaExceededError');
      return original.call(this, key, value);
    };
  });
  await open(page);
  await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  await page.getByRole('combobox', { name: 'การเคลื่อนไหว', exact: true }).selectOption('quiet');
  await expect(page.locator('.vmx-motion-notice')).toContainText('เก็บไว้ถาวรไม่ได้');
  await expect(page.locator('.vmx-motion-stage')).toHaveClass(/vm-quiet/);
});

test('320px dark mode keeps every control reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() => localStorage.setItem('vmx-theme', 'dark'));
  await open(page);
  await page.getByText('ตั้งค่า Mochi และการเคลื่อนไหว', { exact: true }).click();
  for (const g of GROUPS) {
    await group(page, g.id);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const select = page.getByRole('combobox', { name: 'เลือกกิจกรรม', exact: true });
    await expect(select).toBeVisible();
  }
  const controls = await page.locator('.vmx-mochi-page button, .vmx-mochi-page select, .vmx-mochi-page summary').evaluateAll(nodes => nodes.filter(n => n.getClientRects().length).map(n => ({ text: n.textContent, height: n.getBoundingClientRect().height })));
  expect(controls.filter(n => n.height < 43.5)).toEqual([]);
});
