import { test, expect } from './fixtures.js';

test.use({ serviceWorkers: 'block' });
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '4');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('custom'));
    localStorage.setItem('vmx-consent-prefs', JSON.stringify({ analytics: false, personal: false }));
  });
});

// The theme panel takes focus only when it is opened from the keyboard. A tap
// leaves focus on the button, so a phone's page does not scroll to the panel.
test('the theme panel takes focus from the keyboard, not from a tap', async ({ page }) => {
  await page.goto('/app', { waitUntil: 'domcontentloaded' });
  const button = page.getByRole('button', { name: 'ตัวเลือกธีม จานสี และภาษา', exact: true });
  const panel = page.getByRole('dialog', { name: 'ตั้งค่าธีม จานสี และภาษา', exact: true });
  await button.click();
  await expect(panel).toBeVisible();
  // Give the open effect its frame, then focus must still not be inside the panel.
  await page.waitForTimeout(150);
  expect(await panel.evaluate((el) => el.contains(document.activeElement))).toBe(false);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  await expect.poll(() => panel.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
});
