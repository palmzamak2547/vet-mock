import { test, expect } from './fixtures.js';

// The profile hub is the permanent place to install the app. Chromium raises
// `beforeinstallprompt` once, while the student is still on Home; the hub only
// mounts when โปรไฟล์ is tapped, long after. The install row has to survive
// that, so the event is raised on Home here and the hub is opened afterwards.

test.use({ reducedMotion: 'reduce' });

const GUIDANCE = /เปิดด้วย Chrome หรือ Safari/;
const INSTALL_BUTTON = 'ติดตั้ง VetMock เป็นแอปบนเครื่อง';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
  });
});

// What Chromium dispatches: cancelable, with prompt() and userChoice. The page
// counts prompt() calls so the test can tell the event was really used.
function raiseInstallPrompt() {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  window.__installPromptCalls = 0;
  event.prompt = () => { window.__installPromptCalls += 1; return Promise.resolve(); };
  event.userChoice = Promise.resolve({ outcome: 'dismissed', platform: 'web' });
  window.dispatchEvent(event);
}

async function openHome(page) {
  await page.goto('/');
  await expect(page.locator('.vmx-command-center')).toBeVisible();
}

async function openProfileHub(page) {
  const row = page.getByRole('button', { name: 'โปรไฟล์', exact: true });
  await expect(row.first()).toBeVisible();
  await row.first().click();
  await expect(page.locator('.vmx-hero h1')).toContainText('โปรไฟล์');
  return page.locator('main');
}

test('an install prompt raised on Home is still offered in the hub, and is spent by one tap', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'only Chromium-family browsers raise beforeinstallprompt');
  await openHome(page);
  await page.evaluate(raiseInstallPrompt);

  const hub = await openProfileHub(page);
  const install = hub.getByRole('button', { name: INSTALL_BUTTON });
  await expect(install).toBeVisible();
  await expect(hub.getByText(GUIDANCE)).toHaveCount(0);

  await install.click();
  await expect.poll(() => page.evaluate(() => window.__installPromptCalls)).toBe(1);
  // A prompt can be used once: the row gives way to the how-to line, not to a dead button.
  await expect(install).toHaveCount(0);
  await expect(hub.getByText(GUIDANCE)).toBeVisible();
});

test('the hub keeps the install row after the chip was dismissed on Home', async ({ page, context }) => {
  await context.addInitScript(() => localStorage.setItem('vmx-pwa-install-dismissed', '1'));
  await openHome(page);
  await page.evaluate(raiseInstallPrompt);

  const hub = await openProfileHub(page);
  await expect(hub.getByRole('button', { name: INSTALL_BUTTON })).toBeVisible();
  // The hub is the permanent place to install: it has no "never show again".
  await expect(hub.getByRole('button', { name: 'ปิดข้อความนี้' })).toHaveCount(0);
});

test('with no prompt and no Safari steps the hub says how to install instead of showing nothing', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'iOS Safari has its own install steps behind the chip');
  await openHome(page);

  const hub = await openProfileHub(page);
  await expect(hub.getByText(GUIDANCE)).toBeVisible();
  await expect(hub.getByRole('button', { name: INSTALL_BUTTON })).toHaveCount(0);
});
