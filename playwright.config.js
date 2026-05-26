// Palm 2026-05-24: smoke e2e config — keeps it MINIMAL to avoid
// CI flakiness. Single chromium project, retries=1, 30s timeout.
// Tests live in tests/e2e/. Local dev: `npx playwright test`.
// CI: `.github/workflows/smoke-e2e.yml` runs against `npm run preview`.

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
      // iPhone 13 viewport + UA, but force chromium engine. The
      // `devices['iPhone 13']` preset is webkit by default (Playwright
      // bundles Apple's engine for iOS emulation) — that's an extra
      // ~90 MB on CI runners and a webkit-install step we don't need
      // for a layout/JS-error smoke. Project name now matches reality.
      // Trade-off: doesn't catch Safari-only quirks (Intl.Locale,
      // backdrop-filter old syntax, etc.) — those need a separate
      // webkit project if/when we want them.
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
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
