import { test, expect } from './fixtures.js';
import { FAMILY } from '../../src/lib/family/family.js';

// The other VetMock sites from the landing: each one, by the family list's own name, in the
// landing's family section and its footer; a followed link carries the theme on screen (and the
// language, where the site has one); an arrival takes them into this site's keys and out of the
// address. Nothing here signs anyone in: the other sites are answered by the spec.

const OTHERS = FAMILY.filter((m) => m.id !== 'main');

test('the landing lists every other site, and a link carries the theme on screen', async ({ page }) => {
  for (const m of OTHERS) {
    await page.route(`${m.url}**`, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>ok</title>' }));
  }
  // A theme the student picked travels; one the system picked does not (the next case).
  await page.addInitScript(() => { try { localStorage.setItem('vmx-theme', JSON.stringify('dark')); } catch { /* ignore */ } });
  await page.goto('/?e2e-fresh=1');
  // No scroll first: the section's heading reveals as it scrolls in, and the click below scrolls
  // to the link and waits for it to settle.
  const section = page.locator('#family');
  for (const m of OTHERS) {
    const link = section.locator(`a[data-family="${m.id}"]`);
    await expect(link).toHaveAttribute('href', m.url);
    await expect(link).toContainText(m.name);
    await expect(page.locator(`.lp-foot-family a[data-family="${m.id}"]`)).toHaveCount(1);
  }
  await expect(section.locator('a[data-family="main"]')).toHaveCount(0);

  const lang = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-landing-lang') || '"th"'));
  await Promise.all([
    page.waitForURL((u) => u.hostname === 'research.vetmock.com'),
    section.locator('a[data-family="research"]').click(),
  ]);
  const arrived = new URL(page.url());
  expect(arrived.searchParams.get('vmt')).toBe('dark');
  expect(arrived.searchParams.get('vml')).toBe(lang === 'en' ? 'en' : 'th');
});

test('a student who follows the system theme sends none', async ({ page }) => {
  await page.route('https://vca.vetmock.com/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>ok</title>' }));
  await page.goto('/?e2e-fresh=1');
  await Promise.all([
    page.waitForURL((u) => u.hostname === 'vca.vetmock.com'),
    page.locator('#family a[data-family="vca"]').click(),
  ]);
  expect(new URL(page.url()).searchParams.has('vmt')).toBe(false);
});

test('an arrival from another site shows its theme and language for this visit only, then leaves a clean address', async ({ page }) => {
  await page.goto('/?vmt=dark&vml=en&e2e-fresh=1#family');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const url = new URL(page.url());
  expect(url.searchParams.has('vmt')).toBe(false);
  expect(url.searchParams.has('vml')).toBe(false);
  expect(url.searchParams.get('e2e-fresh')).toBe('1');
  // never written over the saved choice; kept for this visit only
  expect(await page.evaluate(() => [localStorage.getItem('vmx-theme'), localStorage.getItem('vmx-landing-lang')])).not.toContain('"en"');
  expect(await page.evaluate(() => localStorage.getItem('vmx-theme'))).not.toBe('"dark"');
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('vmx-family-visit')))).toEqual({ theme: 'dark', lang: 'en' });
});

test('a value outside the allowed set is dropped, not applied', async ({ page }) => {
  await page.goto('/?vmt=%22%3E%3Cb%3E&e2e-fresh=1');
  // The saved key holds nothing or the app's own value (it writes its default, "system", on
  // mount); the visit holds no theme; the page shows a real theme: never the address's value.
  const saved = await page.evaluate(() => localStorage.getItem('vmx-theme'));
  expect([null, '"system"', '"light"', '"dark"']).toContain(saved);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('vmx-family-visit') || '{}').theme ?? null)).toBeNull();
  expect(['light', 'dark']).toContain(await page.evaluate(() => document.documentElement.getAttribute('data-theme')));
  expect(await page.evaluate(() => document.documentElement.hasAttribute('data-theme-chosen'))).toBe(false);
  expect(new URL(page.url()).searchParams.has('vmt')).toBe(false);
});
