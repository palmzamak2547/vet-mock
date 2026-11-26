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
import { QUESTIONS_MID86_EQUINE_MEDICINE } from '../../src/data/questions-mid86-equine-medicine.js';

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

// Runs in the page: English words drawn run together, or a capital in the middle of a two-tone heading.
// Thai writes words without spaces, so a heading read part by part came out "Tablefor classes and
// exams", and "เลือก <em>หัวข้อ</em>" came out "Choose Topic".
function wordsOutOfPlace() {
  const root = document.documentElement;
  const keeps = (el) => {
    const marked = el.closest('[lang]');
    return (marked && marked !== root) || el.closest('[translate="no"],[contenteditable=""],[contenteditable="true"],script,style,noscript,template');
  };
  const edgeText = (node, last) => {
    if (node.nodeType === 3) return node;
    if (node.nodeType !== 1) return null;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let found = null;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      found = n;
      if (!last) break;
    }
    return found;
  };
  const glyph = (node, at) => {
    const range = document.createRange();
    range.setStart(node, at);
    range.setEnd(node, at + 1);
    return range.getBoundingClientRect();
  };
  const found = new Set();
  for (const el of document.body.querySelectorAll('*')) {
    if (keeps(el)) continue;
    const kids = el.childNodes;
    for (let i = 0; i + 1 < kids.length; i++) {
      const left = edgeText(kids[i], true);
      const right = edgeText(kids[i + 1], false);
      if (!left || !right || !/[A-Za-z]$/.test(left.nodeValue) || !/^[A-Za-z]/.test(right.nodeValue)) continue;
      if (keeps(left.parentElement) || keeps(right.parentElement)) continue;
      const a = glyph(left, left.nodeValue.length - 1);
      const b = glyph(right, 0);
      // Drawn apart (another line, a chip's padding, a gap) is not run together.
      if (!a.width || !b.width || Math.abs(a.top - b.top) > a.height / 2 || b.left - a.right > 2) continue;
      const word = left.nodeValue.match(/[A-Za-z]+$/)[0] + right.nodeValue.match(/^[A-Za-z]+/)[0];
      if (!/^(VetMock|VetWiki)$/.test(word)) found.add(`run together: ${left.nodeValue.trim().slice(-30)}|${right.nodeValue.trim().slice(0, 30)}`);
    }
  }
  // A name keeps its capital anywhere; an accent that ends a word ("Vet<em>Wiki</em>") is read with it.
  const NAME = /^(VetMock|VetWiki|Instagram|Q bank|PDF|VCA|Mochi|XP|Term \d|Year \d)\b/;
  for (const em of document.querySelectorAll('h1 em, h2 em, h3 em')) {
    const heading = em.parentElement;
    if (keeps(heading)) continue;
    const nodes = [...heading.childNodes];
    const before = nodes.slice(0, nodes.indexOf(em)).map((n) => n.textContent).join('');
    const after = nodes.slice(nodes.indexOf(em) + 1).map((n) => n.textContent).join('').trim();
    const own = before.match(/\S*$/)[0] + em.textContent.trim();
    if ((before.trim() && /^[A-Z]/.test(em.textContent.trim()) && !NAME.test(own)) || (/^[A-Z]/.test(after) && !NAME.test(after))) {
      found.add(`capital mid-heading: ${heading.textContent.replace(/\s+/g, ' ').trim()}`);
    }
  }
  // A capture written into an English word joins two words in one string ("Exam{a}" read "ExamMidterm
  // ended 21 Sep"): a capital right after a small letter, which only a name has.
  const JOINED = /^(VetMock|VetWiki|PubMed|YouTube|iPhone|iPad|iOS|macOS|GitHub|pH|iApp|DekDokVet|WebP)$/;
  const texts = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = texts.nextNode(); n; n = texts.nextNode()) {
    if (!n.parentElement || keeps(n.parentElement)) continue;
    for (const [word] of n.nodeValue.matchAll(/[A-Za-z]*[a-z][A-Z][A-Za-z]*/g)) {
      if (!JOINED.test(word)) found.add(`glued: ${word}`);
    }
  }
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
    const words = await page.evaluate(wordsOutOfPlace);
    report({ path, view, lang, overflow, left, words });
    expect(lang, `${path}: <html lang>`).toBe('en');
    expect(overflow, `${path}: the English page scrolls sideways`).toBeLessThanOrEqual(1);
    expect(left, `${path}: Thai left in the English interface`).toEqual([]);
    expect(words, `${path}: English words out of place`).toEqual([]);
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

// A matching question's answers are content too: the dropdown lists them as written, and a row that
// shows its key shows it as written. Equine 202394's first answer, กระเพาะอาหาร, is also a dictionary word.
test('a matching question in the English interface lists its answers as the bank wrote them', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine reads the card');
  test.setTimeout(90_000);
  await page.setViewportSize(PHONE);
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  const q = QUESTIONS_MID86_EQUINE_MEDICINE.find((x) => x.id === 202394);
  await page.goto(`/?qset=${encodeQuizSet([q])}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const rows = page.locator('.vmx-match-native-select');
  // The dropdown's own words read English once the page has been read.
  await expect(rows.first().locator('option[value=""]')).toHaveText('— Choose an answer —', { timeout: LOADING_BUDGET_MS });
  const listed = (await rows.first().locator('option:not([value=""])').allTextContents()).map((s) => s.trim()).sort();
  expect(listed).toEqual([...q.pairs.map((p) => p.right), ...q.distractors].sort());
  await expect(rows.first()).toHaveAttribute('aria-label', `Match item 1: ${q.pairs[0].left}`);
  // A wrong pick shows the row's key; the next row marks the answer taken, in English.
  await rows.first().selectOption(q.pairs[1].right);
  await expect(page.locator('.vmx-match-answer-text').first()).toHaveText(q.pairs[0].right);
  await expect(rows.nth(1).locator('option:disabled')).toHaveText(`[Used] ${q.pairs[1].right}`);
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

// A two-tone heading is one sentence in English, its accent on the words the English marks, and Thai
// comes back part by part.
test('a two-tone heading reads as one sentence and keeps its accent', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine reads the heading');
  test.setTimeout(90_000);
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  await visit(page, '/app/schedule');
  await settle(page);
  const heading = page.locator('h1').filter({ has: page.locator('em') }).first();
  await expect(heading).toHaveText('Class and exam schedule');
  await expect(heading.locator('em')).toHaveText('schedule');
  await page.locator('button.vmx-theme-btn[aria-expanded]').first().click();
  await page.getByRole('button', { name: 'ไทย', exact: true }).click();
  await expect(heading).toHaveText('ตารางเรียนและสอบ');
  await expect(heading.locator('em')).toHaveText('เรียนและสอบ');
});

// A label cut to "Exam mo…" reads as broken. The bottom bar, the exam-period pill, Home's tiles and its streak
// row show their English whole at 375 px, the narrowest phone the sheets are drawn at.
test('the bottom bar, the exam-period pill, Home\'s tiles and streak row show their English whole', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'chromium-mobile', 'one engine measures the labels');
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 375, height: 812 });
  await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
  await context.addInitScript(() => { try { localStorage.setItem('vmx-lang', JSON.stringify('en')); } catch { /* the visit says so */ } });
  // A clamped label loses whole lines. A one-line label ends in an ellipsis however little it overflows
  // ("Exam mode" lacked a pixel), so a copy drawn at its own width is measured against the room it has.
  // The heatmap's day labels must end before its first column of cells, which is drawn over them.
  const clipped = () => [
    ...[...document.querySelectorAll('.vmx-bottom-nav-label, .vmx-context-pill, .vmx-context-label, .vmx-quick-tile-label, .vmx-streak-mini-text')]
      .filter((el) => {
        if (!el.getClientRects().length) return false;
        if (getComputedStyle(el).webkitLineClamp !== 'none') return el.scrollHeight > el.clientHeight + 1;
        const copy = el.cloneNode(true);
        copy.style.cssText = 'position: absolute; visibility: hidden; width: max-content; max-width: none';
        el.after(copy);
        const need = copy.getBoundingClientRect().width;
        copy.remove();
        return need > el.getBoundingClientRect().width + 0.5;
      }),
    ...[...document.querySelectorAll('.vmx-heatmap-wrapper svg')].flatMap((svg) => {
      const grid = Math.min(...[...svg.querySelectorAll('rect')].map((cell) => cell.getBoundingClientRect().left));
      return [...svg.querySelectorAll('text')].filter((label) => {
        const box = label.getBoundingClientRect();
        return box.left < grid && box.right > grid + 0.5;
      });
    }),
  ].map((el) => el.textContent.trim());
  const cut = [];
  for (const path of ['/app/home', '/app/study', '/app/progress']) {
    await visit(page, path);
    await settle(page);
    cut.push(...(await page.evaluate(clipped)).map((label) => `${path}: ${label}`));
  }
  expect(cut, 'labels cut short').toEqual([]);
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
