// Code that left the first load (perf-budgets.json lazyOnly) loads only when it is needed, and the first
// screen is the same whether or not it can load.
import { test, expect, installPinnedCalendar, PINNED_NOW } from './fixtures.js';

const chunk = (name) => new RegExp(`/assets/${name}-[A-Za-z0-9_-]+\\.js$`);
const ORIGIN_MOVE = chunk('origin-move');

async function watch(page, pattern) {
  const seen = [];
  page.on('request', (r) => { if (pattern.test(new URL(r.url()).pathname)) seen.push(r.url()); });
  return seen;
}

// The DOM the first paint shows, with the app's own moving parts (clock text, random keys) left as they are:
// both loads of a pair run against the same seed, so they draw the same thing.
async function firstScreen(page) {
  await page.locator('#root > *').first().waitFor();
  await page.waitForLoadState('load');
  return page.locator('#root').evaluate((root) => root.innerHTML.replace(/\s+id="[^"]*:r[0-9a-z]+:[^"]*"/g, ''));
}

const RETURNING_Y5 = { 'vmx-selected-year': '5', 'vmx-seen-landing': '1', 'vmx-bookmarks': '[90001]' };
const seed = (entries) => (values) => { for (const [k, v] of Object.entries(values)) localStorage.setItem(k, v); };

// Two fresh browsers with the same seed and the same pinned clock: one may fetch the lazy code, one may not.
async function freshPage(browser, entries, block) {
  const { baseURL, viewport, userAgent, isMobile, hasTouch, deviceScaleFactor } = test.info().project.use;
  const ctx = await browser.newContext({ baseURL, viewport, userAgent, isMobile, hasTouch, deviceScaleFactor });
  await ctx.addInitScript(installPinnedCalendar, { pinned: Date.parse(PINNED_NOW) });
  await ctx.addInitScript(seed(entries), entries);
  const page = await ctx.newPage();
  if (block) await page.route(block, (route) => route.abort());
  return page;
}

for (const [who, entries] of [['a first-time visitor', {}], ['a returning Year-5 student', RETURNING_Y5]]) {
  test(`${who}: the move code is never fetched, and blocking it changes nothing on the first screen`, async ({ browser }) => {
    const normal = await freshPage(browser, entries, null);
    const fetched = await watch(normal, ORIGIN_MOVE);
    await normal.goto('/');
    const shown = await firstScreen(normal);
    expect(fetched).toEqual([]);

    const blocked = await freshPage(browser, entries, ORIGIN_MOVE);
    await blocked.goto('/');
    expect(await firstScreen(blocked)).toBe(shown);
    await normal.context().close();
    await blocked.context().close();
  });
}

test('mid-move: the inbox is merged before the app first draws, and nothing is lost', async ({ page, context }) => {
  const inbox = { fields: { 'vmx-bookmarks': '[90002,90003]' }, owner: null };
  await context.addInitScript(([values, inboxValue]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries(values)) localStorage.setItem(k, v);
    localStorage.setItem('vmx-move-inbox', inboxValue);
    // What the store can read when the app's first element appears.
    new MutationObserver((_, obs) => {
      const root = document.getElementById('root');
      if (!root?.firstElementChild) return;
      obs.disconnect();
      window.__atFirstDraw = { inbox: localStorage.getItem('vmx-move-inbox'), bookmarks: localStorage.getItem('vmx-bookmarks') };
    }).observe(document, { childList: true, subtree: true });
  }, [RETURNING_Y5, JSON.stringify(inbox)]);
  const fetched = await watch(page, ORIGIN_MOVE);
  await page.goto('/');
  await page.locator('#root > *').first().waitFor();
  const at = await page.evaluate(() => window.__atFirstDraw);
  expect(fetched.length).toBe(1);
  expect(at.inbox).toBeNull();
  expect(JSON.parse(at.bookmarks).sort()).toEqual([90001, 90002, 90003]);
});

test('mid-move with the move code unreachable: the app starts and the inbox waits for the next boot', async ({ page, context }) => {
  const inbox = JSON.stringify({ fields: { 'vmx-bookmarks': '[90002]' }, owner: null });
  await context.addInitScript(([values, inboxValue]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries(values)) localStorage.setItem(k, v);
    localStorage.setItem('vmx-move-inbox', inboxValue);
  }, [RETURNING_Y5, inbox]);
  await page.route(ORIGIN_MOVE, (route) => route.abort());
  await page.goto('/');
  await page.locator('#root > *').first().waitFor();
  expect(await page.evaluate(() => localStorage.getItem('vmx-move-inbox'))).toBe(inbox);

  await page.unroute(ORIGIN_MOVE);
  await page.reload();
  await page.locator('#root > *').first().waitFor();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('vmx-move-inbox'))).toBeNull();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('vmx-bookmarks'))).sort()).toEqual([90001, 90002]);
});
