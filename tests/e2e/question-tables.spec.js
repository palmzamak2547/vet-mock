// A table in a passage and in an explanation (src/lib/rich-blocks.js): the card
// draws it as a table, never as bars and dashes; a wide one scrolls inside its
// frame, says so, and never widens the page; and a highlight drawn on the
// prose around a table stays on its words.
//
// The questions are opened through a pin, as answer-evidence.spec.js does: a
// set drawn at random would not hold them. Each is chosen from the bank by
// what it holds, lowest id first, so every machine opens the same one.
import { test, expect } from './fixtures.js';
import { bankFiles, readBank } from '../../scripts/lib/bank-file.mjs';
import { splitBlocks, wholeStem } from '../../src/lib/rich-blocks.js';
import { ELEVEN_TTS, clipKey, clipText, optionLabel, questionLang } from '../../src/lib/tts-text.js';

const tablesIn = (text) => splitBlocks(text).filter((b) => b.type === 'table');
const proseIn = (text) => splitBlocks(text).filter((b) => b.type === 'text');

async function pick(wanted) {
  const found = [];
  for (const file of bankFiles('src/data')) {
    for (const q of (await readBank(file)).questions) if (wanted(q)) found.push(q);
  }
  return found.sort((a, b) => a.id - b.id)[0] || null;
}

async function openPinned(page, q) {
  const pin = { id: 1, type: 'question', label: 'ข้อที่มีตาราง', payload: { id: q.id, subject: q.subject, stem: q.q }, addedAt: 1 };
  await page.addInitScript(([seed, year]) => {
    if (localStorage.getItem('question-tables-seeded')) return;
    localStorage.setItem('question-tables-seeded', '1');
    localStorage.setItem('vmx-selected-year', String(year));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pinboard', JSON.stringify([seed]));
  }, [pin, q.year]);
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  const card = page.getByRole('button').filter({ has: page.getByText(pin.label, { exact: true }) });
  await expect(card).toBeVisible({ timeout: 30_000 });
  await card.click();
  await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
}

const pageFits = (page) => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

// What a frame owes a student when its table is wider than it: a line that says so, and focus for the arrow keys.
async function expectFrameHonest(frame) {
  const wide = await frame.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
  const hint = frame.locator('xpath=following-sibling::*[1][contains(@class, "vmx-qtable-hint")]');
  await expect(hint).toHaveCount(wide ? 1 : 0);
  if (wide) await expect(frame).toHaveAttribute('tabindex', '0');
  else await expect(frame).not.toHaveAttribute('tabindex', /.*/);
  return wide;
}

test.setTimeout(90_000);

test('a passage that holds a table shows it as a table, and the page does not widen', async ({ page }) => {
  const q = await pick((x) => x.subject === 'epidemiology' && x.type === 'mcq' && tablesIn(x.passage).length === 1
    && tablesIn(x.passage)[0].head.length >= 4 && proseIn(x.passage).length > 0);
  expect(q, 'no Epidemiology passage holds one table of four columns under a lead sentence any more').toBeTruthy();
  const [table] = tablesIn(q.passage);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await openPinned(page, q);
  const pane = page.locator('.vmx-q-passage-pane');
  const drawn = pane.locator('table.vmx-qtable');
  await expect(drawn).toBeVisible();
  await expect(drawn.locator('tbody tr')).toHaveCount(table.rows.length);
  await expect(drawn.locator('thead th')).toHaveCount(table.head.filter(Boolean).length);
  for (const cell of table.rows[0].filter(Boolean)) await expect(drawn.locator('tbody tr').first()).toContainText(cell);
  // The first column names the rows, and the table is named by the passage's title.
  await expect(drawn.locator('tbody th[scope="row"]')).toHaveCount(table.rows.length);
  const frame = pane.locator('.vmx-qtable-wrap');
  const titleId = await frame.getAttribute('aria-labelledby');
  await expect(page.locator(`[id="${titleId}"]`)).toContainText(q.passage_title);
  await expectFrameHonest(frame);
  // Nothing of the table's own syntax reaches the student.
  await expect(pane).not.toContainText('|---');
  await expect(pane).not.toContainText('| ');
  expect(await pageFits(page), 'the table scrolls inside its frame').toBe(true);
  // The prose around it is still there.
  await expect(pane).toContainText(proseIn(q.passage)[0].text.slice(0, 40));
  // A data passage sits above the question at every width.
  const [passageBox, stemBox] = [await pane.boundingBox(), await page.locator('h2.vmx-qtext').boundingBox()];
  expect(stemBox.y).toBeGreaterThan(passageBox.y + passageBox.height - 1);
  expect(errors).toEqual([]);
});

test('an explanation that holds a table shows it as a table after the answer', async ({ page }) => {
  const q = await pick((x) => x.type === 'mcq' && Array.isArray(x.options) && !x.passage && !x.image && tablesIn(x.explain).length === 1);
  expect(q, 'no explanation holds a table any more').toBeTruthy();
  const [table] = tablesIn(q.explain);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await openPinned(page, q);
  await expect(page.locator('table.vmx-qtable')).toHaveCount(0);
  await page.locator('.vmx-option').first().click();
  const body = page.locator('.vmx-feedback-explain-body');
  await expect(body).toBeVisible();
  const drawn = body.locator('table.vmx-qtable');
  await expect(drawn).toBeVisible();
  await expect(drawn.locator('tbody tr')).toHaveCount(table.rows.length);
  await expect(body).not.toContainText('|---');
  await expectFrameHonest(body.locator('.vmx-qtable-wrap'));
  expect(await pageFits(page), 'the table scrolls inside its frame').toBe(true);
  expect(errors).toEqual([]);
});

test('a highlight stays on its words around a table, and a table takes none', async ({ page }) => {
  // A passage of several tables with a line of prose above each: offsets after a table are what can go wrong.
  const q = await pick((x) => x.subject === 'epidemiology' && tablesIn(x.passage).length >= 2 && proseIn(x.passage).length >= 3);
  expect(q, 'no passage holds prose between two tables any more').toBeTruthy();
  const prose = proseIn(q.passage);
  const [lead, between] = [prose[0], prose[2]];   // the lead sentence, and a line that follows a table

  await openPinned(page, q);
  const pane = page.locator('.vmx-q-passage-pane');
  await pane.getByTitle(/^ไฮไลท์ข้อความ/).click();
  // Select as a drag would, then let go: the component reads the selection on mouseup.
  const select = (from, to) => page.evaluate(([a, b]) => {
    const point = (spec) => {
      const el = spec.run != null ? document.querySelector(`.vmx-q-passage-pane [data-off="${spec.run}"]`)
        : document.querySelector('.vmx-q-passage-pane table.vmx-qtable tbody td');
      const text = document.createTreeWalker(el, NodeFilter.SHOW_TEXT).nextNode();
      return [text, spec.end ? text.nodeValue.length : 0];
    };
    const range = document.createRange();
    range.setStart(...point(a));
    range.setEnd(...point(b));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.querySelector('.vmx-q-passage-pane [data-off]').parentElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  }, [from, to]);

  // A whole line that sits after a table.
  await select({ run: between.start }, { run: between.start, end: true });
  await expect(pane.locator('mark')).toHaveText([between.text]);
  // From the lead sentence into a cell: the mark ends where the prose ends.
  await select({ run: lead.start }, { table: true });
  await expect(pane.locator('mark')).toHaveText([lead.text, between.text]);
  // Inside a table alone: nothing.
  await select({ table: true }, { table: true, end: true });
  await expect(pane.locator('mark')).toHaveCount(2);

  // The marks are kept by their place in the passage's text: the same words after a reload.
  await page.goto('/app/pinboard', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button').filter({ has: page.getByText('ข้อที่มีตาราง', { exact: true }) }).click();
  await expect(page.locator('.vmx-q-passage-pane mark')).toHaveText([lead.text, between.text], { timeout: 30_000 });
});

test('a stem whose numbers moved to a table is still read aloud with them', async ({ page }) => {
  // The lowest such question whose spoken sentence holds a number its stem on screen does not.
  const numbers = (s) => String(s).match(/\d+/g) || [];
  const q = await pick((x) => typeof x.say === 'string' && x.type === 'mcq' && tablesIn(x.passage).length > 0
    && numbers(x.say).some((n) => !numbers(x.q).includes(n)));
  expect(q, 'no question keeps a spoken stem any more').toBeTruthy();

  // The clip host as a recording run leaves it: every clip of this question in the ElevenLabs
  // generation, the stem named by the sentence in `say`, with its word timings. (As in
  // read-aloud.spec.js: the clips are a few bytes and playback is stubbed in the page.)
  const options = q.options.map(String);
  const lang = questionLang(wholeStem(q), options);
  const key = (text) => clipKey(text, ELEVEN_TTS);
  const said = await key(clipText(wholeStem(q), lang));
  const shown = await key(clipText(q.q, questionLang(q.q, options)));
  const manifest = [said];
  for (let i = 0; i < options.length; i++) manifest.push(await key(optionLabel(i, lang)), await key(clipText(options[i], lang)));
  const asked = { clips: [], words: [], live: 0 };
  await page.addInitScript((ms) => {
    HTMLMediaElement.prototype.canPlayType = () => 'probably';
    const NativeAudio = window.Audio;
    window.Audio = function Audio(src) { const el = new NativeAudio(); el.__src = String(src || ''); return el; };
    Object.defineProperty(HTMLMediaElement.prototype, 'src', {
      configurable: true,
      get() { return this.__src || ''; },
      set(v) { clearTimeout(this.__t); this.__src = String(v); },
    });
    const removeAttribute = Element.prototype.removeAttribute;
    HTMLMediaElement.prototype.removeAttribute = function (name) { if (name === 'src') this.__src = ''; return removeAttribute.call(this, name); };
    HTMLMediaElement.prototype.load = function () {};
    HTMLMediaElement.prototype.play = function play() {
      const src = this.__src || '';
      if (!src || src.startsWith('data:')) return Promise.resolve();
      const el = this;
      clearTimeout(el.__t);
      queueMicrotask(() => el.dispatchEvent(new Event('playing')));
      el.__t = setTimeout(() => { if (el.__src === src) el.dispatchEvent(new Event('ended')); }, ms);
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function () { clearTimeout(this.__t); };
  }, 8000);
  await page.route('https://tts.vetmock.com/**', (route) => {
    const url = route.request().url();
    const ok = { status: 200, headers: { 'access-control-allow-origin': '*' } };
    if (url.endsWith(`/m/${q.subject}.json`)) return route.fulfill({ ...ok, contentType: 'application/json', body: JSON.stringify(url.includes('/e1/') ? manifest : []) });
    const [, name, ext] = url.match(/([0-9a-f]{16})\.(mp4|json)$/) || [];
    if (!url.includes('/e1/') || !manifest.includes(name)) return route.fulfill({ status: 404, headers: ok.headers, body: '' });
    if (ext === 'json') {
      asked.words.push(name);
      return route.fulfill({ ...ok, contentType: 'application/json', body: JSON.stringify({ w: clipText(wholeStem(q), lang).split(/\s+/).map((_, i) => i * 0.05) }) });
    }
    asked.clips.push(name);
    return route.fulfill({ ...ok, contentType: 'audio/mp4', body: Buffer.from('clip') });
  });
  await page.route('**/api/tts*', (route) => { asked.live += 1; return route.fulfill({ status: 502, body: 'no' }); });

  await openPinned(page, q);
  await expect(page.locator('.vmx-q-passage-pane table.vmx-qtable').first()).toBeVisible();
  await expect(page.locator('h2.vmx-qtext')).toHaveText(q.q);
  await page.getByRole('button', { name: 'อ่านคำถามออกเสียง' }).click();

  // The clip asked for is the one named by the sentence that holds the numbers, never the stem on screen's.
  await expect.poll(() => asked.clips, { timeout: 30_000 }).toContain(said);
  expect(asked.clips).not.toContain(shown);
  // While the stem is read: the bar says the table is read too, the table carries the reading edge, and
  // no phrase is marked, because the words being said are not the words of the stem on screen.
  await expect(page.getByRole('region', { name: 'เสียงอ่าน' })).toContainText('โจทย์และตาราง');
  await expect(page.locator('.vmx-q-passage-pane')).toHaveClass(/is-reading/);
  await expect.poll(() => asked.words, { timeout: 10_000 }).toContain(said);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => Boolean(globalThis.CSS?.highlights?.has('vmx-reading')))).toBe(false);
  expect(asked.live, 'the live voice is not asked while the clips exist').toBe(0);
});

test('the way back to a table shows only while the table is off screen, clear of the next button, and reopens a hidden table', async ({ page }) => {
  const q = await pick((x) => x.subject === 'epidemiology' && x.type === 'mcq' && tablesIn(x.passage).length === 1 && proseIn(x.passage).length > 0);
  expect(q, 'no Epidemiology passage holds a table under a lead sentence any more').toBeTruthy();
  await page.setViewportSize({ width: 390, height: 520 });   // short enough that the options sit below the table
  await openPinned(page, q);
  const pane = page.locator('.vmx-q-passage-pane');
  const back = page.locator('.vmx-passage-fab');
  await expect(pane.locator('table.vmx-qtable')).toBeVisible();
  // Over the table it names, the button would only hide the table's last cells.
  await expect(back).toHaveCount(0);

  // The student hides the table, then scrolls down to the options.
  await pane.getByRole('button', { expanded: true }).click();
  await expect(pane.locator('table.vmx-qtable')).toHaveCount(0);
  await expect(pane.getByRole('button', { expanded: false })).toContainText('แสดงตาราง');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(back).toBeVisible();
  await expect(back).toContainText('ดูตาราง');
  const next = page.locator('.vmx-exam-actions .vmx-btn').last();
  const [b, n] = [await back.boundingBox(), await next.boundingBox()];
  const apart = b.y + b.height <= n.y || b.y >= n.y + n.height || b.x + b.width <= n.x || b.x >= n.x + n.width;
  expect(apart, 'the button sits on the next button').toBe(true);

  // One tap brings the table back: opened again and scrolled to.
  await back.click();
  await expect(pane.locator('table.vmx-qtable')).toBeVisible();
  await expect(pane.locator('table.vmx-qtable')).toBeInViewport();
  await expect(back).toHaveCount(0);
});
