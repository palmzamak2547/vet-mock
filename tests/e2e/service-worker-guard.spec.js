// The suite must not run against the production service worker.
//
// 2026-09-09: the two noisiest specs (instant-feedback, pdf-annotate) were the
// only two that had never opted out, and between them they produced 16 of the
// 21 failed/flaky entries across eleven recent runs. The mechanism is not
// subtle: the real worker registers, finds itself out of date, and the app
// raises <div role="status" class="vmx-update-notice"> — which is fixed to the
// bottom of the viewport, directly over the primary CTA. Playwright then waits
// out the full budget reporting "intercepts pointer events", and the whole
// deployment sits behind a red required check for a defect that is not there.
//
// The opt-out now lives in playwright.config.js `use` instead of in sixteen
// separate files. This test exists so that removing it fails loudly rather
// than quietly re-arming a class of flake nobody will connect to the config.
// tests/e2e/atlas-offline.spec.js is the one deliberate exception and declares
// `serviceWorkers: 'allow'` itself — that is where worker behaviour is tested.
import { test, expect } from '@playwright/test';

test('the production service worker is blocked by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toBeVisible();

  const state = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return { supported: false };
    let registrations = -1;
    try {
      registrations = (await navigator.serviceWorker.getRegistrations()).length;
    } catch { /* some engines refuse the call outright, which is also blocked */ }
    return {
      supported: true,
      // Playwright's block swaps register() for its own function, so the
      // source stops reading as a built-in.
      registerIsNative: String(navigator.serviceWorker.register).includes('[native code]'),
      controlled: !!navigator.serviceWorker.controller,
      registrations,
    };
  });

  if (!state.supported) return; // nothing to block
  expect(state.registerIsNative).toBe(false);
  expect(state.controlled).toBe(false);
  expect(state.registrations).toBeLessThanOrEqual(0);

  // The update notice is what actually eats the click; assert the symptom too.
  await expect(page.locator('.vmx-update-notice')).toHaveCount(0);
  expect(
    await page.evaluate(() => document.documentElement.dataset.vmxUpdateStatus ?? null),
  ).toBeNull();
});
