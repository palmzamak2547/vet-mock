import { test, expect } from './fixtures.js';

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
  // This browser proof uses public bundled sources and a disposable empty
  // catalogue; it neither signs in nor writes to a live provider.
  await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, body: '[]',
    headers: { 'content-type': 'application/json', 'content-range': '0-0/0' } }));
});

test('guest search drops saved gated destinations and former-account notes', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => {
    localStorage.setItem('vmx-user-sync-owner-v1', JSON.stringify('former-account'));
    localStorage.setItem('vmx-notes', JSON.stringify({ 100: 'Former account private note for regression' }));
    localStorage.setItem('vmx-omni-recents', JSON.stringify([
      { type: 'action', featureId: 'account-settings', label: 'Saved former account settings', payload: { kind: 'view', view: 'account-settings' } },
      { type: 'library-doc', label: 'Former account restricted lecture for regression', payload: { id: 'former-private', status: 'restricted' } },
    ]));
  });
  await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText('Saved former account settings');
  await expect(dialog).not.toContainText('Former account restricted lecture for regression');
  await expect(dialog).not.toContainText('Former account private note for regression');
  await expect(dialog.getByRole('textbox', { name: 'ค้นหาใน VetMock' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('a stale saved recent opens the current exam preset', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(() => {
    localStorage.setItem('vmx-omni-recents', JSON.stringify([{
      type: 'action', featureId: 'exam-mode', label: 'Obsolete exam action label',
      payload: { kind: 'practice', mode: 'exam', subject: 'all', practiceMode: 'all', numQuestions: 999, useTimer: false, timePerQ: 1 },
    }]));
  });
  await page.getByRole('button', { name: 'ค้นหา', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'ค้นหาอัจฉริยะ' });
  await expect(dialog).not.toContainText('Obsolete exam action label');
  const first = dialog.locator('[data-flat-idx="0"]');
  await expect(first).toContainText('โหมดสอบ');
  await first.click();
  await expect(page.getByRole('heading', { name: 'ตั้งค่า โหมดสอบ' })).toBeVisible();
  await expect(page.getByRole('spinbutton', { name: 'จำนวนข้อแบบกำหนดเอง' })).toHaveValue('50');
  await expect(page.getByRole('button', { name: '50', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
