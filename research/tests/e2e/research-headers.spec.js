// The deployed headers are the ones research/vercel.json declares [M1-DESIGN.md 20]: the CSP (connect
// only to this origin and Supabase Auth, no inline scripts, no frames), COOP same-origin for the
// sign-in redirect, and the cache rules (index.html and sw.js revalidate, hashed assets immutable).
// `vite preview` does not apply vercel.json, so this spec runs only against a deployment:
// RESEARCH_BASE_URL=https://research.vetmock.com npx playwright test research-headers.
// OWNER: runtime role.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
const declared = Object.fromEntries(config.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key.toLowerCase(), h.value]));

test.skip(!process.env.RESEARCH_BASE_URL, 'headers come from Vercel; set RESEARCH_BASE_URL to a deployment');

test('every page carries the declared security headers', async ({ request }) => {
  for (const path of ['/', '/app', '/app/p/00000000-0000-4000-8000-000000000000', '/licenses']) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const h = res.headers();
    for (const [key, value] of Object.entries(declared)) expect(h[key], `${path} ${key}`).toBe(value);
    expect(h['cache-control'], `${path} revalidates`).toMatch(/max-age=0/);
  }
});

test('the CSP names only this origin and Supabase Auth, and forbids inline script and frames', () => {
  const csp = declared['content-security-policy'];
  expect(csp).toContain("script-src 'self';");
  expect(csp).toMatch(/connect-src 'self' https:\/\/[a-z0-9]+\.supabase\.co;/);
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain('unsafe-eval');
  expect(declared['cross-origin-opener-policy']).toBe('same-origin');
});

test('sw.js and the manifest are served as themselves, not the app shell', async ({ request }) => {
  const sw = await request.get('/sw.js');
  expect(sw.status()).toBe(200);
  expect(sw.headers()['content-type']).toMatch(/javascript/);
  expect(sw.headers()['cache-control']).toMatch(/max-age=0/);
  expect(await sw.text()).not.toContain('__RS_PRECACHE__');
  const mf = await request.get('/manifest.webmanifest');
  expect(mf.status()).toBe(200);
  expect(JSON.parse(await mf.text()).start_url).toBe('/app');
});

test('hashed assets are immutable', async ({ request, page }) => {
  await page.goto('/');
  const asset = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => new URL(e.name).pathname).find((p) => p.startsWith('/assets/')));
  expect(asset).toBeTruthy();
  const res = await request.get(asset);
  expect(res.headers()['cache-control']).toContain('immutable');
});
