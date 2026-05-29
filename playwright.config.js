// Palm 2026-05-24: smoke e2e config. retries=1, 30s timeout.
// Tests live in tests/e2e/. Local dev: `npx playwright test`.
// CI: `.github/workflows/smoke-e2e.yml` runs against `npm run preview`.
//
// 2026-05-27 — cross-engine expansion. Was chromium-only; now covers
// all 3 engines so Safari-only / Gecko-only regressions get caught
// before iOS / Firefox users hit them:
//   • chromium-desktop  — fast baseline (Blink, 1280×800)
//   • chromium-mobile   — narrow viewport baseline (Blink, iPhone 13 size)
//   • webkit-mobile     — REAL Safari engine at iPhone 13 size. This is
//                         the one that matters most: VetMock is a PWA
//                         with heavy iOS usage, and Safari has its own
//                         quirks (Intl, date parsing, backdrop-filter,
//                         100vh/dvh, IndexedDB timing).
//   • firefox-desktop   — Gecko engine (1280×800).
// CI installs all 3 browser engines (chromium + webkit + firefox).

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    // Tests default to a local Vite preview server (see webServer
    // below). Override via PLAYWRIGHT_BASE_URL=https://vetmock.vercel.app
    // to smoke-test the actual production build.
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      // iPhone 13 viewport on the Blink engine — fast narrow-viewport
      // baseline. Kept alongside webkit-mobile so a failure can be
      // attributed to engine (webkit-only) vs layout (both fail).
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
    {
      // REAL Safari engine at iPhone 13 size. devices['iPhone 13'] is
      // webkit by default, so we DON'T override browserName here — this
      // is the genuine iOS Safari smoke. Catches Safari-only quirks the
      // chromium projects can't see.
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'] },
    },
    {
      // Gecko engine, desktop viewport. Catches Firefox-only regressions
      // (flexbox gap edge cases, focus-visible, scrollbar sizing).
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } },
    },
  ],
  // Spin up `npm run preview` automatically. Reuses an existing
  // server if one is already running (useful for iteration).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run preview',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
