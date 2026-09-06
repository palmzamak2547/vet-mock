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

// Keep local E2E isolated from ordinary Vite previews. Reusing whatever owns
// port 4173 once made a green suite test a different app entirely. A dedicated
// strict port fails loudly instead; PLAYWRIGHT_PORT remains available for
// parallel local runs.
const localE2ePort = Number(process.env.PLAYWRIGHT_PORT || 41731);
const localE2eUrl = `http://127.0.0.1:${localE2ePort}`;

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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || localE2eUrl,
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
      use: {
        ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 },
        // CI supplies Xvfb and Mesa so Firefox exercises a real WebGL backend.
        ...(process.env.CI && process.platform === 'linux' ? { headless: false } : {}),
      },
    },
  ],
  // Spin up a fresh production preview automatically. Never reuse an unknown
  // listener: stale/wrong-app previews must make the gate fail, not pass.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run preview -- --host 127.0.0.1 --port ${localE2ePort} --strictPort`,
        port: localE2ePort,
        reuseExistingServer: false,
        timeout: 60_000,
      },
});
