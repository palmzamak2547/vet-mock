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
  await page.goto('/?e2e-fresh=1');
  const section = page.locator('#family');
  await section.scrollIntoViewIfNeeded();
  for (const m of OTHERS) {
    const link = section.locator(`a[data-family="${m.id}"]`);
    await expect(link).toHaveAttribute('href', m.url);
    await expect(link).toContainText(m.name);
    await expect(page.locator(`.lp-foot-family a[data-family="${m.id}"]`)).toHaveCount(1);
  }
  await expect(section.locator('a[data-family="main"]')).toHaveCount(0);

  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const lang = await page.evaluate(() => JSON.parse(localStorage.getItem('vmx-landing-lang') || '"th"'));
  await Promise.all([
    page.waitForURL((u) => u.hostname === 'research.vetmock.com'),
    section.locator('a[data-family="research"]').click(),
  ]);
  const arrived = new URL(page.url());
  expect(arrived.searchParams.get('vmt')).toBe(theme);
  expect(arrived.searchParams.get('vml')).toBe(lang === 'en' ? 'en' : 'th');
});

test('an arrival from another site takes the theme and language once, then leaves a clean address', async ({ page }) => {
  await page.goto('/?vmt=dark&vml=en&e2e-fresh=1#family');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const url = new URL(page.url());
  expect(url.searchParams.has('vmt')).toBe(false);
  expect(url.searchParams.has('vml')).toBe(false);
  expect(url.searchParams.get('e2e-fresh')).toBe('1');
  expect(await page.evaluate(() => [localStorage.getItem('vmx-theme'), localStorage.getItem('vmx-landing-lang')])).toEqual(['"dark"', '"en"']);
});

test('a value outside the allowed set is dropped, not applied', async ({ page }) => {
  await page.goto('/?vmt=%22%3E%3Cb%3E&e2e-fresh=1');
  expect(await page.evaluate(() => localStorage.getItem('vmx-theme'))).not.toContain('<');
  expect(new URL(page.url()).searchParams.has('vmt')).toBe(false);
});
