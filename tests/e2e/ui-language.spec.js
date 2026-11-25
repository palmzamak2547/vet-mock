// The interface in English (src/lib/ui-translate.js): every screen a student reaches shows no Thai of
// its own, the page says it is English, and switching back to Thai gives the page exactly as it was.
// Content keeps its own language: an element marked with `lang` (a question, a note, a name) and
// everything inside it is left as written, so only the interface is counted.
//
// The walk over every route runs on chromium-mobile, a phone's width; the switch itself on every
// project. A string this finds belongs in src/data/ui-en.js, or, when it is content, under an element
// that carries its language.
import { appendFileSync } from 'node:fs';
import { test, expect, PINNED_NOW } from './fixtures.js';
import { ROUTES, seedStudent, studiedQuestions, visit, readScreen } from './lib/routes.js';
import { encodeQuizSet } from '../../src/lib/share-link.js';
import { QB_EXOTIC } from '../../src/data/questions-exotic.js';

// Runs in the page before it loads: Thai a canvas draws (a game's prompt), which no text walk sees.
function recordCanvasThai() {
  const draw = CanvasRenderingContext2D.prototype.fillText;
  window.__vmxCanvasThai = new Set();
  CanvasRenderingContext2D.prototype.fillText = function fillText(text, ...rest) {
    if (/[\u0E00-\u0E7F]/.test(String(text))) window.__vmxCanvasThai.add(String(text));
    return draw.call(this, text, ...rest);
  };
}

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
  // Drawn first: before React's first frame there is no #main, so nothing is loading and there is no
  // Thai to find. Read then, a route passed with an empty page (26 Nov: 2 of 8 reads of the review queue).
  await expect.poll(async () => {
    const screen = await page.evaluate(readScreen);
    return (screen.landing || screen.view !== null) && !screen.loading;
  }, { timeout: LOADING_BUDGET_MS }).toBe(true);
  // Lazy parts of a screen (counts, cards) arrive a moment after the frame.
  await page.waitForTimeout(600);
}

// The page's text with its digits masked: Home's countdown ticks every second while it is read.
const pageText = () => document.body.innerText.replace(/\d/g, '#');

// Parts of Home arrive late (the plan, the cohort): read it once it has held still for two seconds.
async function steadyText(page) {
  let last = null;
  let since = Date.now();
  for (const end = Date.now() + 20_000; Date.now() < end;) {
    const now = await page.evaluate(pageText);
    if (now !== last) { last = now; since = Date.now(); } else if (Date.now() - since >= 2000) break;
    await page.waitForTimeout(250);
  }
  return last;
}

// VMX_UI_LANG_REPORT=<file> keeps one JSON line per route, from every worker, to work through.
const report = (row) => { if (process.env.VMX_UI_LANG_REPORT) appendFileSync(process.env.VMX_UI_LANG_REPORT, `${JSON.stringify(row)}\n`); };

for (const [view, path] of ROUTES) {
  test(`${path} in English shows no Thai of its own`, async ({ page, context }, info) => {
    test.skip(info.project.name !== 'chromium-mobile', 'the walk runs at a phone width on one engine');
    test.setTimeout(90_000);
    await page.setViewportSize(PHONE);
    await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
    await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
    await context.addInitScript(recordCanvasThai);
    await visit(page, path);
    await settle(page);
    // VetWiki's index draws its featured topic once the topics are in; the walk reads it drawn.
    if (path === '/wiki') await page.locator('.vw-featured').waitFor({ timeout: LOADING_BUDGET_MS });
    expect((await page.evaluate(readScreen)).errorCard, `${path}: the English page crashed`).toBe(false);
    const lang = await page.evaluate(() => document.documentElement.lang);
    const left = [
      ...await page.evaluate(thaiLeftovers),
      ...await page.evaluate(() => [...(window.__vmxCanvasThai || [])].map((t) => `@canvas ${t}`)),
    ];
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    report({ path, view, lang, overflow, left });
    expect(lang, `${path}: <html lang>`).toBe('en');
    expect(overflow, `${path}: the English page scrolls sideways`).toBeLessThanOrEqual(1);
    expect(left, `${path}: Thai left in the English interface`).toEqual([]);
  });
}

// The card around a question turns English; the question, its choices and its key stay as written.
// Exotic 50053's last choice, หัวใจ, is also the interface's word for a life in the game.
test('a question in the English interface reads exactly as the bank wrote it', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine reads the card');
  test.setTimeout(90_000);
  await page.setViewportSize(PHONE);
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  const q = QB_EXOTIC.find((x) => x.id === 50053);
  await page.goto(`/?qset=${encodeQuizSet([q])}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const choices = page.locator('.vmx-option-text');
  await expect(choices).toHaveCount(q.options.length, { timeout: LOADING_BUDGET_MS });
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  // The card shuffles the choices.
  expect((await choices.allInnerTexts()).map(norm).sort()).toEqual([...q.options].sort());
  expect(norm(await page.locator('body').innerText())).toContain(norm(q.q));
  await expect.poll(() => page.evaluate(thaiLeftovers)).toEqual([]);
});

// The page owns its text: what it writes stands, even the English the translator last wrote there,
// and a part it takes away takes its English with it.
test('the page\'s own writes win over the English', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine runs the page\'s writes');
  test.setTimeout(90_000);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  await visit(page, '/app/home');
  await settle(page);
  const text = (id) => page.evaluate((i) => document.getElementById(i)?.textContent, id);
  const frame = () => page.evaluate(() => new Promise((done) => requestAnimationFrame(() => setTimeout(done, 0))));
  await page.evaluate(() => {
    const typed = document.createElement('p');
    typed.id = 'vmx-t-typed';
    typed.textContent = 'ปลา';
    const counted = document.createElement('p');
    counted.id = 'vmx-t-counted';
    counted.append('2', ' ปลา');
    document.body.append(typed, counted);
  });
  await frame();
  expect(await text('vmx-t-typed')).toBe('Fish');
  expect(await page.evaluate(() => document.getElementById('vmx-t-counted').firstChild.nodeValue), 'two parts read as one').toBe('2 Fish');
  await page.evaluate(() => {
    document.getElementById('vmx-t-typed').firstChild.nodeValue = 'Fish';
    document.getElementById('vmx-t-counted').lastChild.remove();
  });
  await frame();
  expect(await text('vmx-t-counted'), 'the Thai part went, and its English with it').toBe('2');
  await page.locator('button.vmx-theme-btn[aria-expanded]').first().click();
  await page.getByRole('button', { name: 'ไทย', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  expect(await text('vmx-t-typed'), 'what the student typed stays').toBe('Fish');
});

// A release note is written per release, in Thai, and the dictionary reads it only in part: opened in
// English, the note around it is English and the notes keep their language.
test('the what\'s-new note in English keeps the release notes as written', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine reads the note');
  test.setTimeout(90_000);
  await page.setViewportSize(PHONE);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  await visit(page, '/app/home');
  await settle(page);
  await page.getByRole('button', { name: /^(What’s new|Latest update)$/ }).click();
  await expect(page.locator('.vmx-changelog-title').first()).toBeVisible();
  await expect.poll(() => page.evaluate(thaiLeftovers)).toEqual([]);
});

// The recap card is a canvas the page's translator cannot reach: a switch draws it again, in English.
test('the recap card is drawn again in English when the language switches', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine draws the card');
  test.setTimeout(90_000);
  await page.setViewportSize(PHONE);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await context.addInitScript(recordCanvasThai);
  await visit(page, '/app/wrapped');
  await settle(page);
  const card = page.locator('.vmx-share-preview img');
  await expect(card).toHaveAttribute('alt', /^สรุป/, { timeout: LOADING_BUDGET_MS });
  await page.evaluate(() => window.__vmxCanvasThai.clear());
  await page.locator('button.vmx-theme-btn[aria-expanded]').first().click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(card).toHaveAttribute('alt', /^Exam period summary/, { timeout: LOADING_BUDGET_MS });
  await expect.poll(() => page.evaluate(thaiLeftovers)).toEqual([]);
  expect(await page.evaluate(() => [...window.__vmxCanvasThai]), 'Thai drawn on the card after the switch').toEqual([]);
  // The English words fit as the Thai ones do: nothing cut short, nothing over the signature.
  await expect(page.locator('.vmx-share-preview')).toHaveAttribute('data-layout', 'clean');
});

// English that cannot be fetched (a first visit offline) leaves the page Thai and the menu saying so;
// a press once online loads it. Chromium keeps a failed import failed, so that press must fetch afresh.
test('English that cannot load leaves the page and the menu Thai, and a later press loads it', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'WebKit names no URL in its import error, so there is none to fetch afresh');
  test.setTimeout(90_000);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await visit(page, '/app/home');
  await settle(page);
  // The translator and the dictionary, under any query.
  const english = /\/assets\/ui-(?:en|translate)-[^/?]+\.js(?:\?.*)?$/;
  await page.route(english, (route) => route.abort());
  const openMenu = () => page.locator('button.vmx-theme-btn[aria-expanded]').first().click();
  await openMenu();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await openMenu();
  await expect(page.getByRole('button', { name: 'ไทย', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await page.unroute(english);
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('switching to English and back gives the Thai page exactly as it was', async ({ page, context }) => {
  test.setTimeout(90_000);
  // The wordmark's words rotate unless motion is reduced (Wordmark.jsx).
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await visit(page, '/app/home');
  await settle(page);
  const thai = await steadyText(page);
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('th');

  // The theme menu's own button: the saved-questions button beside it shares the class.
  const openMenu = () => page.locator('button.vmx-theme-btn[aria-expanded]').first().click();
  await openMenu();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect.poll(() => page.evaluate(thaiLeftovers)).toEqual([]);
  expect(await page.evaluate(() => localStorage.getItem('vmx-lang'))).toBe(JSON.stringify('en'));

  await openMenu();
  await page.getByRole('button', { name: 'ไทย', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
  await expect.poll(() => page.evaluate(pageText)).toBe(thai);
});
