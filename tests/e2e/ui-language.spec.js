// The interface in English (src/lib/ui-translate.js): every screen a student reaches shows no Thai of
// its own, the page says it is English, and switching back to Thai gives the page exactly as it was.
// Content keeps its own language: an element marked with `lang` (a question, a note, a name) and
// everything inside it is left as written, so only the interface is counted.
//
// The walk over every route runs on chromium-mobile, a phone's width; the switch itself on every
// project. A string this finds belongs in src/data/ui-en.js, or, when it is content, under an element
// that carries its language.
import { writeFileSync } from 'node:fs';
import { test, expect, PINNED_NOW } from './fixtures.js';
import { ROUTES, seedStudent, studiedQuestions, visit, readScreen } from './lib/routes.js';

const PHONE = { width: 390, height: 844 };
const LOADING_BUDGET_MS = 30_000;

// Runs in the page: the Thai the interface still shows, outside content marked with its language.
function thaiLeftovers() {
  const THAI = /[\u0E00-\u0E7F]/;
  const root = document.documentElement;
  const keeps = (el) => {
    const marked = el.closest('[lang]');
    return (marked && marked !== root) || el.closest('[translate="no"],[contenteditable=""],[contenteditable="true"],script,style,noscript,template');
  };
  const found = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue.trim();
    if (!text || !THAI.test(text)) continue;
    const el = node.parentElement;
    if (!el || keeps(el)) continue;
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if ((!box.width && !box.height) || style.visibility === 'hidden') continue;
    found.add(text.replace(/\s+/g, ' ').slice(0, 140));
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[placeholder],[alt]')) {
    if (keeps(el)) continue;
    for (const name of ['aria-label', 'title', 'placeholder', 'alt']) {
      const value = el.getAttribute(name);
      if (value && THAI.test(value)) found.add(`@${name} ${value.slice(0, 120)}`);
    }
  }
  if (THAI.test(document.title)) found.add(`@title ${document.title}`);
  return [...found];
}

async function settle(page) {
  await expect.poll(async () => (await page.evaluate(readScreen)).loading, { timeout: LOADING_BUDGET_MS }).toBe(false);
  // Lazy parts of a screen (counts, cards) arrive a moment after the frame.
  await page.waitForTimeout(600);
}

const report = [];
test.afterAll(() => {
  if (process.env.VMX_UI_LANG_REPORT && report.length) writeFileSync(process.env.VMX_UI_LANG_REPORT, JSON.stringify(report, null, 1));
});

for (const [view, path] of ROUTES) {
  test(`${path} in English shows no Thai of its own`, async ({ page, context }, info) => {
    test.skip(info.project.name !== 'chromium-mobile', 'the walk runs at a phone width on one engine');
    test.setTimeout(90_000);
    await page.setViewportSize(PHONE);
    await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
    await context.addInitScript(() => { try { localStorage.setItem('vmx-landing-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
    await visit(page, path);
    await settle(page);
    const lang = await page.evaluate(() => document.documentElement.lang);
    const left = await page.evaluate(thaiLeftovers);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    report.push({ path, view, lang, overflow, left });
    expect(lang, `${path}: <html lang>`).toBe('en');
    expect(overflow, `${path}: the English page scrolls sideways`).toBeLessThanOrEqual(1);
    expect(left, `${path}: Thai left in the English interface`).toEqual([]);
  });
}

test('switching to English and back gives the Thai page exactly as it was', async ({ page, context }) => {
  test.setTimeout(90_000);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await visit(page, '/app/home');
  await settle(page);
  const thai = await page.evaluate(() => document.body.innerText);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('th');

  const openMenu = () => page.locator('.vmx-theme-btn').first().click();
  await openMenu();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect.poll(() => page.evaluate(thaiLeftovers)).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('vmx-landing-lang'))).toBe(JSON.stringify('en'));

  await openMenu();
  await page.getByRole('button', { name: 'ไทย', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect.poll(() => page.evaluate(() => document.body.innerText)).toBe(thai);
});
