// End-to-end checks of the VCA site in Chromium, on a desk and on a phone. Motion is reduced
// and the clock fixed (tests/e2e/fixtures.mjs), so a run reads the same on any day.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defineConfig } from '@playwright/test';

// Below every ephemeral range (Linux 32768-60999), so no outgoing connection can be holding it
// when the suite starts its server (see the root playwright.config.js). VCA_E2E_PORT lets a
// second checkout run the suite beside the first without reusing its dev server; unset, the
// default below is the one CI and everyone else uses (tests/unit/e2e-ports.test.mjs holds it).
const PORT = Number(process.env.VCA_E2E_PORT || 24125);
const chromium = process.env.PLAYWRIGHT_CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /.*\.spec\.mjs$/,
  // Failure screenshots and snapshots go outside the repository.
  outputDir: path.join(os.tmpdir(), 'vca-e2e-results'),
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: 'chromium',
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'off',
    launchOptions: chromium ? { executablePath: chromium } : {},
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `node scripts/build-bank.mjs --quiet && npx vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
