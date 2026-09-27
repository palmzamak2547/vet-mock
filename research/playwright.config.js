// Research Studio end-to-end tests. Reuses the repo root's @playwright/test install (research/
// never installs it) and the same four projects as the main app's gate. Specs live in
// research/tests/e2e. Port 43121 by default (the research band 43100-43199 on this shared
// machine); RESEARCH_E2E_PORT overrides it for a parallel run. A strict port fails loudly
// instead of testing whatever else is listening.
import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.RESEARCH_E2E_PORT || 43121);
const localUrl = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results',
  testIgnore: ['**/zz-*.spec.js'],
  timeout: 30_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    timezoneId: 'Asia/Bangkok',
    baseURL: process.env.RESEARCH_BASE_URL || localUrl,
    // Offline and service-worker specs opt back in with test.use({ serviceWorkers: 'allow' }).
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'chromium-mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'] } },
    {
      name: 'firefox-desktop',
      timeout: 60_000,
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 800 },
        navigationTimeout: 45_000,
        launchOptions: { firefoxUserPrefs: { 'webgl.force-enabled': true, 'webgl.disabled': false } },
      },
    },
  ],
  webServer: process.env.RESEARCH_BASE_URL
    ? undefined
    : {
        command: `npx vite preview --host 127.0.0.1 --port ${port} --strictPort`,
        port,
        reuseExistingServer: false,
        timeout: 60_000,
      },
});
