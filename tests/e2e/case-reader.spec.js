// The case reader, slice 1 (work/case-reader/DESIGN.md): the full-screen sheet, the hand and the
// word-snapping highlighter, at the four sizes the design was drawn at, on question 209588 (an equine
// case whose findings are in its stem) and on an Epidemiology passage shared by several questions with
// a table. What a student could lose if any of it were wrong: the place they were reading, a mark (or a
// mark landing on the wrong words), a mark drawn by a finger that only meant to scroll, the clock or an
// answer in a timed paper.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks } from '../../src/lib/rich-blocks.js';
import { caseKey, marksStorageKey } from '../../src/lib/case-marks.js';

test.setTimeout(120_000);

const SIZES = [
  { name: 'ipad-land', width: 1180, height: 820 },
  { name: 'ipad-port', width: 820, height: 1180 },
  { name: 'phone', width: 390, height: 664 },
  { name: 'desktop', width: 1280, height: 800 },
];

let bank = null;
async function questions() {
  if (bank) return bank;
  bank = [];
  for (const file of bankFiles('src/data')) bank.push(...(await readBank(file)).questions);
  return bank;
}
async function byId(id) { return (await questions()).find((q) => q.id === id); }
async function epidShared() {
  const all = (await questions()).filter((q) => q.subject === 'epidemiology' && q.passage && splitBlocks(q.passage).some((b) => b.type === 'table'));
  const counts = new Map();
  for (const q of all) counts.set(q.passage, (counts.get(q.passage) || 0) + 1);
  return all.filter((q) => counts.get(q.passage) > 1).sort((a, b) => a.id - b.id)[0];
}

async function openPinned(page, q, label = 'เคสที่ปักไว้') {
  const pin = { id: 1, type: 'question', label, payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript(([seed, year]) => {
    if (localStorage.getItem('case-reader-seeded')) return;
    localStorage.setItem('case-reader-seeded', '1');
    localStorage.setItem('vmx-selected-year', String(year));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([seed]));
  }, [pin, q.year]);
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  const card = page.getByRole('button').filter({ has: page.getByText(label, { exact: true }) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  await card.click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.vmx-q-passage-pane [data-off]').first()).toBeVisible();
  // The question's figure sits above the case: let it arrive, or the page moves under the pointer.
  await page.evaluate(() => Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((ok) => { img.onload = ok; img.onerror = ok; })))));
  // The pane's tools load with the case.
  await expect(page.locator('.vmx-case-tools.is-waiting')).toHaveCount(0);
}

// The passage offset of the first character whose line reaches below client height `top`, measured
// by the test itself (not by the code under test).
const topChar = (page, rootSel, top) => page.evaluate(([rootSel, top]) => {
  const root = document.querySelector(rootSel);
  for (const run of root.querySelectorAll('[data-off]')) {
    if (run.getBoundingClientRect().bottom <= top) continue;
    const walker = document.createTreeWalker(run, NodeFilter.SHOW_TEXT);
    let at = Number(run.dataset.off);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      for (let i = 0; i < n.nodeValue.length; i++) {
        const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
        const b = r.getClientRects()[0];
        if (b && b.height && b.bottom > top) return at + i;
      }
      at += n.nodeValue.length;
    }
  }
  // Below every line of prose (in a table after it): the last character.
  const runs = [...root.querySelectorAll('[data-off]')];
  const last = runs[runs.length - 1];
  return last ? Number(last.dataset.off) + last.textContent.length - 1 : null;
}, [rootSel, top]);

// Where character `off` sits, as a client box.
const charBox = (page, rootSel, off) => page.evaluate(([rootSel, off]) => {
  const root = document.querySelector(rootSel);
  for (const run of root.querySelectorAll('[data-off]')) {
    const from = Number(run.dataset.off);
    if (off < from || off >= from + run.textContent.length) continue;
    const walker = document.createTreeWalker(run, NodeFilter.SHOW_TEXT);
    let at = from;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (off < at + n.nodeValue.length) {
        const r = document.createRange(); r.setStart(n, off - at); r.setEnd(n, off - at + 1);
        const b = r.getClientRects()[0] || r.getBoundingClientRect();
        return { top: b.top, bottom: b.bottom, left: b.left, height: b.height };
      }
      at += n.nodeValue.length;
    }
  }
  return null;
}, [rootSel, off]);

// The top of what a reader of the pane sees: under the pane's top bar, inside the pane where it scrolls.
const paneTop = (page) => page.evaluate(() => {
  const pane = document.querySelector('.vmx-q-passage-pane');
  const scrolls = pane.scrollHeight > pane.clientHeight + 1 && getComputedStyle(pane).overflowY !== 'visible';
  return Math.max(scrolls ? pane.getBoundingClientRect().top : 0, document.querySelector('.vmx-case-top').getBoundingClientRect().bottom);
});

// Scrolls the reader into the middle of the case text.
async function readHalfway(page) {
  // The question's figure sits above the case: let it arrive first, or the page grows under the reader.
  await page.evaluate(() => Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((ok) => { img.onload = ok; img.onerror = ok; })))));
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
  await page.evaluate(() => {
    const pane = document.querySelector('.vmx-q-passage-pane');
    const text = pane.querySelector('.vmx-case-text');
    const scrolls = pane.scrollHeight > pane.clientHeight + 1 && getComputedStyle(pane).overflowY !== 'visible';
    if (scrolls) pane.scrollTop = Math.round((pane.scrollHeight - pane.clientHeight) / 2);
    else window.scrollTo(0, window.scrollY + text.getBoundingClientRect().top + text.offsetHeight * 0.4);
  });
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
}

const SHEET = '.vmx-case-sheet .vmx-case-text';
const PANE = '.vmx-q-passage-pane .vmx-case-text';
const sheetTop = (page) => page.locator('.vmx-case-sheet-scroll').evaluate((el) => el.getBoundingClientRect().top);
const noSideScroll = (page) => page.evaluate(() => {
  const doc = document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  const sheet = document.querySelector('.vmx-case-sheet');
  const sc = document.querySelector('.vmx-case-sheet-scroll');
  // The sheet is fixed, so the page cannot show it overflowing: every part of it must lie inside the window.
  const inside = !sheet || [sheet, ...sheet.querySelectorAll('.vmx-case-tool, .vmx-case-sheet-col, .vmx-case-ask')]
    .every((el) => { const r = el.getBoundingClientRect(); return !r.width || (r.left >= -0.5 && r.right <= window.innerWidth + 0.5); });
  return doc && inside && (!sc || sc.scrollWidth <= sc.clientWidth + 1);
});
const intersects = (a, b) => !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);

for (const size of SIZES) {
  for (const which of ['209588', 'epidemiology']) {
    test(`${size.name}: the sheet opens and closes at the same place, on ${which}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      const q = which === '209588' ? await byId(209588) : await epidShared();
      await openPinned(page, q);
      await readHalfway(page);
      // A short case scrolled past its middle takes its top bar with it: the student brings the button back first.
      await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).scrollIntoViewIfNeeded();
      const before = await topChar(page, PANE, await paneTop(page));
      // How many of its lines the character sits below the top of what the reader sees (between -1 and 0
      // on a line of prose; more where the top is in a table).
      const lines = async (root, off, top) => { const b = await charBox(page, root, off); return (b.top - top) / b.height; };
      const inPane = await lines(PANE, before, await paneTop(page));
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(before).not.toBeNull();

      // The button stays at the top of the pane while the case scrolls: a tap there does not move the page.
      await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
      expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollY)).toBeLessThanOrEqual(1);
      const sheet = page.getByRole('dialog');
      await expect(sheet).toBeVisible();
      await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
      // The character the pane showed on top is on the sheet's first line (unless the sheet ends first).
      const top = await sheetTop(page);
      const box = await charBox(page, SHEET, before);
      // Unless the sheet ends first and cannot scroll that far.
      const atEnd = await page.locator('.vmx-case-sheet-scroll').evaluate((el) => el.scrollTop >= el.scrollHeight - el.clientHeight - 1);
      if (!atEnd) {
        const inSheet = (box.top - top) / box.height;
        expect(Math.abs(inSheet - inPane), `${inSheet} lines on the sheet, ${inPane} in the pane`).toBeLessThanOrEqual(1.5 + 0.3 * Math.abs(inPane));
      }
      // The ask stays in sight, the tools never cover text, and nothing scrolls sideways.
      await expect(sheet.locator('.vmx-case-ask')).toBeInViewport();
      const tools = await sheet.locator('.vmx-case-tools').boundingBox();
      const column = await sheet.locator('.vmx-case-sheet-col').boundingBox();
      const scroller = await sheet.locator('.vmx-case-sheet-scroll').boundingBox();
      const visibleColumn = { x: column.x, y: scroller.y, width: column.width, height: scroller.height };
      expect(intersects(tools, visibleColumn), 'the tools sit over the text').toBe(false);
      expect(await noSideScroll(page)).toBe(true);
      for (const b of await sheet.locator('.vmx-case-tool:visible').all()) {
        const r = await b.boundingBox();
        expect(Math.round(r.width)).toBeGreaterThanOrEqual(44);
        expect(Math.round(r.height)).toBeGreaterThanOrEqual(44);
      }

      // Close: the page where it was, and the pane at the character the sheet had on top.
      const sheetFirst = await topChar(page, SHEET, top);
      await sheet.getByRole('button', { name: 'กลับไปที่คำถาม' }).click();
      await expect(sheet).toHaveCount(0);
      await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
      expect(Math.abs((await page.evaluate(() => window.scrollY)) - scrollY)).toBeLessThanOrEqual(1);
      const back = await topChar(page, PANE, await paneTop(page));
      // The same line: the pane's top character is at most a line's length from where the student was.
      expect(Math.abs(back - before)).toBeLessThanOrEqual(Math.max(80, Math.abs(sheetFirst - before) + 80));
      await expect(page.locator('.vmx-question-card')).toBeVisible();
    });
  }
}

// A drag across words, as a mouse (desktop) or a pen (tablet) makes it: one mark, on whole words.
async function dragAcross(page, rootSel, fromOff, toOff, pointerType = 'mouse') {
  // A hand drags across what it can see: bring the first word into view.
  const first = await charBox(page, rootSel, fromOff);
  const vh = await page.evaluate(() => window.innerHeight);
  if (first.top < 80 || first.bottom > vh - 120) await page.evaluate((dy) => window.scrollBy(0, dy), first.top - vh / 3);
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
  const a = await charBox(page, rootSel, fromOff);
  const b = await charBox(page, rootSel, toOff);
  const ax = a.left + 2; const ay = a.top + a.height / 2;
  const bx = b.left + 2; const by = b.top + b.height / 2;
  if (pointerType === 'mouse') {
    await page.mouse.move(ax, ay);
    await page.mouse.down();
    await page.mouse.move(bx, by, { steps: 12 });
    await page.mouse.up();
    return;
  }
  await page.evaluate(([rootSel, ax, ay, bx, by, type]) => new Promise((done) => {
    const target = document.querySelector(rootSel);
    const fire = (kind, x, y) => target.dispatchEvent(new PointerEvent(kind, { bubbles: true, cancelable: true, pointerId: 7, pointerType: type, isPrimary: true, clientX: x, clientY: y, pressure: 0.5, button: 0, buttons: kind === 'pointerup' ? 0 : 1 }));
    fire('pointerdown', ax, ay);
    let i = 0;
    const step = () => {
      i++;
      fire('pointermove', ax + ((bx - ax) * i) / 12, ay + ((by - ay) * i) / 12);
      if (i < 12) requestAnimationFrame(step);
      else requestAnimationFrame(() => { fire('pointerup', bx, by); requestAnimationFrame(done); });
    };
    requestAnimationFrame(step);
  }), [rootSel, ax, ay, bx, by, pointerType]);
}

const stored = (page, q, ownerId = null) => page.evaluate((key) => {
  const rec = JSON.parse(localStorage.getItem(key) || '{"marks":[]}');
  return rec.marks.filter((m) => m.kind === 'range').map((m) => [m.start, m.end]);
}, marksStorageKey(ownerId, caseKey({ subject: q.subject, title: q.passage_title, passage: q.passage })));

for (const size of SIZES) {
  test(`${size.name}: a dragged highlight snaps to words and keeps its text range in the pane, on the sheet and at another size`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    const q = await byId(209588);
    await openPinned(page, q);
    const phone = size.width < 768;
    const word = 'ไร่ฝึกสัตวแพทย์';
    const from = q.passage.indexOf(word) + 2;       // inside the first word
    const to = q.passage.indexOf('นครปฐม') + 3;     // inside the last
    let root = PANE;
    if (phone) {
      await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      root = SHEET;
    } else {
      await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'ปากกาไฮไลต์' }).click();
    }
    await dragAcross(page, root, from, to, size.width >= 768 && size.width < 1280 ? 'pen' : 'mouse');
    const marks = page.locator(`${root} mark`);
    await expect(marks.first()).toBeVisible();
    const [range] = await stored(page, q);
    // Whole words: it starts at the start of a word and ends at the end of one, never mid-syllable.
    const text = q.passage.slice(range[0], range[1]);
    expect(text.startsWith('ไร่') || text.startsWith('ณ') || text.startsWith('ฝึก')).toBe(true);
    expect(text.endsWith('นครปฐม')).toBe(true);
    expect((await marks.allTextContents()).join('')).toBe(text);

    // The same range on the other surface.
    if (phone) await page.getByRole('button', { name: 'กลับไปที่คำถาม' }).click();
    else await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
    const other = phone ? PANE : SHEET;
    await expect(page.locator(`${other} mark`).first()).toBeVisible();
    expect((await page.locator(`${other} mark`).allTextContents()).join('')).toBe(text);
    // Another size (a rotation): the same words, the same stored offsets.
    await page.setViewportSize({ width: size.height, height: size.width });
    await expect(page.locator(`${other} mark`).first()).toBeVisible();
    expect((await page.locator(`${other} mark`).allTextContents()).join('')).toBe(text);
    expect(await stored(page, q)).toEqual([range]);
  });
}

test('the eraser removes a highlight with a tap; undo and redo; clear all has a way back', async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 820 });
  const q = await byId(209588);
  await openPinned(page, q);
  const pane = page.locator('.vmx-q-passage-pane');
  await pane.getByRole('button', { name: 'ปากกาไฮไลต์' }).click();
  await dragAcross(page, PANE, q.passage.indexOf('ไร่ฝึก') + 1, q.passage.indexOf('นครปฐม') + 2);
  await expect(pane.locator('mark')).not.toHaveCount(0);
  // Picking a tool moves no button.
  const before = await pane.getByRole('button', { name: 'ล้างทั้งหมด' }).boundingBox();
  await pane.getByRole('button', { name: 'ยางลบ' }).click();
  expect(await pane.getByRole('button', { name: 'ล้างทั้งหมด' }).boundingBox()).toEqual(before);
  await pane.locator('mark').first().click();
  await expect(pane.locator('mark')).toHaveCount(0);
  await pane.getByRole('button', { name: 'ย้อนกลับ', exact: true }).click();
  await expect(pane.locator('mark')).not.toHaveCount(0);
  await pane.getByRole('button', { name: 'ทำซ้ำ' }).click();
  await expect(pane.locator('mark')).toHaveCount(0);
  await pane.getByRole('button', { name: 'ย้อนกลับ', exact: true }).click();
  await pane.getByRole('button', { name: 'ล้างทั้งหมด' }).click();
  await expect(pane.locator('mark')).toHaveCount(0);
  await page.locator('.vmx-case-toast').getByRole('button', { name: 'ย้อนกลับ' }).click();
  await expect(pane.locator('mark')).not.toHaveCount(0);
});

test('drawing does not re-render React per pointer move, and the frame time of a long drag', async ({ page, browserName }, info) => {
  // React's own hook for developer tools counts commits, with no test code in the app.
  await page.addInitScript(() => {
    window.__commits = 0;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      supportsFiber: true, renderers: new Map(), inject() { return 1; },
      onCommitFiberRoot() { window.__commits++; }, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
    };
  });
  await page.setViewportSize({ width: 1280, height: 800 });
  // The longest passage in the bank.
  const q = (await questions()).filter((x) => x.passage).sort((a, b) => b.passage.length - a.passage.length)[0];
  await openPinned(page, q);
  await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const box = await page.locator('.vmx-case-sheet-col').boundingBox();
  const top = await sheetTop(page);
  const x0 = box.x + 4; const y0 = top + 20;
  await page.mouse.move(x0, y0);
  await page.evaluate(() => { performance.clearMeasures(); window.__frames = []; let last = performance.now(); const tick = (t) => { window.__frames.push(t - last); last = t; if (window.__frames.length < 2000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  await page.mouse.down();
  const commitsAtDown = await page.evaluate(() => window.__commits);
  const moves = 150;
  for (let i = 1; i <= moves; i++) await page.mouse.move(x0 + (box.width - 8) * (i / moves), y0 + 400 * (i / moves));
  const commitsDuring = (await page.evaluate(() => window.__commits)) - commitsAtDown;
  await page.mouse.up();
  await expect(page.locator(`${SHEET} mark`).first()).toBeVisible();
  const { paint, frames } = await page.evaluate(() => ({
    paint: performance.getEntriesByName('vmx-case-paint').map((e) => e.duration),
    frames: window.__frames.slice(2),
  }));
  const p = (xs, q) => { if (!xs.length) return NaN; const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
  info.annotations.push({ type: 'paint-ms', description: `n=${paint.length} p50=${p(paint, 0.5).toFixed(2)} p95=${p(paint, 0.95).toFixed(2)} max=${Math.max(...paint).toFixed(2)}` });
  info.annotations.push({ type: 'frame-ms', description: `n=${frames.length} p50=${p(frames, 0.5).toFixed(2)} p95=${p(frames, 0.95).toFixed(2)}` });
  console.log(`[case-reader] ${q.id} ${q.passage.length} chars, ${moves} moves: commits during drag ${commitsDuring}; paint ${info.annotations.at(-2).description}; frames ${info.annotations.at(-1).description}`);
  // Headless WebKit on Windows gives a page about one frame a second, so frames are measured on Chromium only.
  if (browserName === 'chromium') expect(paint.length).toBeGreaterThan(5);
  // No React commit while the pointer moves: the wet wash is painted straight into the DOM.
  expect(commitsDuring).toBe(0);
});

test('inside a running timed exam the sheet changes neither the clock nor the answer', async ({ page }) => {
  const q = await epidShared();
  const second = (await questions()).find((x) => x.passage === q.passage && x.id !== q.id);
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.addInitScript(({ questions }) => {
    if (sessionStorage.getItem('case-exam-fixture')) return;
    sessionStorage.setItem('case-exam-fixture', '1');
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    const now = Date.now();
    localStorage.setItem('vmx-inflight-exam:guest', JSON.stringify({
      ownerId: null, questions, answers: {}, currentIdx: 0, useTimer: true, timePerQ: 600,
      questionDeadline: now + 600_000, examStartTime: now - 5_000, savedAt: now,
      mode: 'quick', clock: 'per-question', selectedYear: 5,
    }));
  }, { questions: [q, second] });
  await page.goto('/app');
  await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click();
  const timer = page.locator('.vmx-exam-top-right .vmx-timer');
  await expect(timer).toBeVisible();
  const deadline = () => page.evaluate(() => JSON.parse(localStorage.getItem('vmx-inflight-exam:guest') || 'null')?.questionDeadline);
  const option = page.locator('.vmx-option').first();
  await option.click();
  const deadlineBefore = await deadline();
  const picked = await page.locator('.vmx-option[aria-pressed="true"], .vmx-option.selected, .vmx-option[aria-checked="true"]').count();

  await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
  // The sheet shows the same clock, and the ask of this question.
  await expect(sheet.locator('.vmx-timer')).toBeVisible();
  await expect(sheet.locator('.vmx-case-ask')).toContainText(q.q.slice(0, 20));
  // Keys typed while it is open belong to it: the arrow keys do not turn the page.
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.vmx-sr-only[role="status"]')).toHaveText('ข้อ 1 จาก 2');
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveCount(0);
  // The deadline as the session keeps it: the same instant (a re-save may round it below a millisecond).
  expect(Math.abs((await deadline()) - deadlineBefore)).toBeLessThan(5);
  expect(await page.locator('.vmx-option[aria-pressed="true"], .vmx-option.selected, .vmx-option[aria-checked="true"]').count()).toBe(picked);
  await expect(page.locator('.vmx-sr-only[role="status"]')).toHaveText('ข้อ 1 จาก 2');
  await expect(timer).toBeVisible();
});

// Real touches, through the browser's own input pipeline (Chromium's DevTools protocol): a finger's
// drag scrolls and marks nothing; a pen marks; with เขียนด้วยนิ้ว on, one finger marks.
test('a finger scrolls and marks nothing, a pen marks, and the finger switch lets one finger write', async ({ page, browserName }, info) => {
  test.skip(browserName !== 'chromium' || !info.project.use.hasTouch, 'touches need a touch device on Chromium');
  await page.setViewportSize({ width: 390, height: 664 });
  const q = await byId(209588);
  await openPinned(page, q);
  await page.locator('.vmx-q-passage-pane').getByRole('button', { name: 'อ่านเต็มจอ' }).click();
  const sheet = page.getByRole('dialog');
  await expect(sheet).toBeVisible();
  const cdp = await page.context().newCDPSession(page);
  const scroller = sheet.locator('.vmx-case-sheet-scroll');
  const box = await sheet.locator('.vmx-case-sheet-col').boundingBox();
  const sbox = await scroller.boundingBox();
  const x = box.x + box.width / 2;
  const touch = async (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  // One finger dragged up the text, as a thumb scrolls.
  const swipe = async (y, dy) => {
    await touch('touchStart', [{ x, y }]);
    for (let i = 1; i <= 10; i++) await touch('touchMove', [{ x, y: y - (dy * i) / 10 }]);
    await touch('touchEnd', []);
  };

  // A finger swipe up the text: the sheet scrolls, no mark.
  const scrolledBefore = await scroller.evaluate((el) => el.scrollTop);
  await swipe(sbox.y + sbox.height * 0.7, 250);
  await expect.poll(() => scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(scrolledBefore + 50);
  await expect(sheet.locator('mark')).toHaveCount(0);

  // A pen drag across words marks them (pointer type pen), and the switch then hides: a pen was seen.
  const switchBtn = sheet.getByRole('button', { name: /เขียนด้วยนิ้ว/ });
  await expect(switchBtn).toBeVisible();
  await switchBtn.click();
  await expect(switchBtn).toHaveAttribute('aria-pressed', 'true');
  // With the switch on, one finger writes.
  const off = await topChar(page, SHEET, (await sheetTop(page)) + 40);
  const a = await charBox(page, SHEET, off);
  await touch('touchStart', [{ x: a.left + 2, y: a.top + a.height / 2 }]);
  for (let i = 1; i <= 10; i++) await touch('touchMove', [{ x: a.left + 2 + i * 20, y: a.top + a.height / 2 }]);
  await touch('touchEnd', []);
  await expect(sheet.locator('mark')).not.toHaveCount(0);
  const marked = await sheet.locator('mark').count();
  // Two fingers at once scroll and leave no dot.
  const y0 = sbox.y + sbox.height * 0.6;
  const before2 = await scroller.evaluate((el) => el.scrollTop);
  await touch('touchStart', [{ x: x - 30, y: y0, id: 1 }, { x: x + 30, y: y0, id: 2 }]);
  for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: x - 30, y: y0 - i * 20, id: 1 }, { x: x + 30, y: y0 - i * 20, id: 2 }]);
  await touch('touchEnd', []);
  await expect.poll(() => scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(before2 + 40);
  await expect(sheet.locator('mark')).toHaveCount(marked);

  // A pen: it marks with the switch off, and from then on the switch is not offered.
  await switchBtn.click();
  const b = await topChar(page, SHEET, (await sheetTop(page)) + 120);
  await dragAcross(page, SHEET, b, b + 12, 'pen');
  await expect.poll(() => sheet.locator('mark').count()).toBeGreaterThan(marked);
  await expect(switchBtn).toHaveCount(0);
  // And a finger, after a pen was seen, never marks even if it drags.
  const count = await sheet.locator('mark').count();
  await swipe(sbox.y + sbox.height * 0.7, 150);
  await expect(sheet.locator('mark')).toHaveCount(count);
  expect(await noSideScroll(page)).toBe(true);
});
