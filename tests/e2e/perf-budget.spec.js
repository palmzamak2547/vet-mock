// Performance budgets measured in a browser (perf-budgets.json), Chromium only:
//
//   • Home on a first visit: how many requests it makes and how many image bytes it downloads.
//   • Layout shift (CLS) of Home, a practice set, its results and a VetWiki article: the median of
//     three first visits, against 0.01 ("good" in Core Web Vitals) or, where a page is not there yet,
//     the number measured when the budget was written (AGENTS.md lists the gap).
//
// The JavaScript and CSS sizes are checked without a browser by `npm run perf:budget`, and timings
// (INP, LCP, frame times) by `npm run perf`, by hand: a runner with no GPU cannot time animation.
// A budget here is an alarm, so each number has to be one the machine cannot move:
//   • every run opens a context as empty as a first visit (no cache, no storage, no worker);
//   • the calendar is pinned (fixtures.js), so Home draws the same cards on every day;
//   • any request to a host other than the preview server is aborted. It still counts as a request, so a
//     new third-party call is seen, but a slow font CDN cannot move a layout or a download;
//   • a screen is measured when the app says it is ready (its heading, the card, the score), then once the
//     fonts, the images in view and the app's idle work have finished and the network has gone quiet.
//
// To change a budget, measure again: UPDATE_PERF_BUDGETS=1 npx playwright test tests/e2e/perf-budget.spec.js
// --project=chromium-desktop --workers=1 (then --project=chromium-mobile) rewrites that project's numbers.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { test, expect, PINNED_NOW, installPinnedCalendar, setPracticeCount } from './fixtures.js';
import { median, budgetFor, requestBudgetFor, clsBudgetFor, ceil4 } from '../../scripts/lib/perf-logic.mjs';
import { watchNetwork, settlePage } from '../../scripts/lib/perf-browser.mjs';

const BUDGETS_URL = new URL('../../perf-budgets.json', import.meta.url);
const budgets = JSON.parse(readFileSync(BUDGETS_URL, 'utf8'));
const UPDATE = process.env.UPDATE_PERF_BUDGETS === '1';
const RUNS = 3;

// The practice set is drawn from one topic whose 24 questions all render option buttons
// (tests/e2e/instant-feedback.spec.js explains the choice and how to re-measure it).
const SUBJECT = 'exotic';
const TOPIC_HAS_TEXT = 'โรคติดเชื้อในนก';
const WIKI_ARTICLE = '/wiki/com5/rabies';

// ── In the page ────────────────────────────────────────────────────────

/** Runs before the app's own scripts: collects layout shifts the way the Layout Instability API reports them. */
function watchLayoutShifts() {
  const state = { total: 0, shifts: [], markTotal: 0, markCount: 0 };
  window.__cls = state;
  const describe = (node) => {
    if (!node || node.nodeType !== 1) return '(text)';
    const classes = [...node.classList].slice(0, 3).join('.');
    return `${node.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`;
  };
  const take = (entries) => {
    for (const entry of entries) {
      // A shift within half a second of a tap or key is the page answering the student, which the metric leaves out.
      if (entry.hadRecentInput) continue;
      state.total += entry.value;
      state.shifts.push({
        value: entry.value,
        at: Math.round(entry.startTime),
        sources: (entry.sources || []).map((s) => `${describe(s.node)} y ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h ${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`),
      });
    }
  };
  const observer = new PerformanceObserver((list) => take(list.getEntries()));
  observer.observe({ type: 'layout-shift', buffered: true });
  // The observer's callback is a later task; takeRecords hands over what it has not delivered yet.
  window.__clsMark = () => { take(observer.takeRecords()); state.markTotal = state.total; state.markCount = state.shifts.length; };
  window.__clsRead = () => { take(observer.takeRecords()); return { cls: state.total - state.markTotal, shifts: state.shifts.slice(state.markCount) }; };
}

// ── Contexts, requests, readiness ──────────────────────────────────────

/** A context as empty as a first visit: the project's own device, the pinned calendar, a signed-out student of year 4. */
async function openFirstVisit(browser, options) {
  const { baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId } = options;
  const context = await browser.newContext({ baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId, serviceWorkers: 'block' });
  await context.addInitScript(installPinnedCalendar, { pinned: Date.parse(PINNED_NOW) });
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('vmx-selected-year', '4');
      window.localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    } catch { /* storage is optional */ }
  });
  await context.addInitScript(watchLayoutShifts);
  // Nothing outside the preview server is reached; the attempt is still a request (watchNetwork).
  const origin = new URL(baseURL).origin;
  await context.route((url) => /^https?:$/.test(url.protocol) && url.origin !== origin, (route) => route.abort());
  const network = watchNetwork(context, origin);
  const page = await context.newPage();
  // PERF_BUDGET_CPU=4 runs the spec as on a runner four times slower, to see which numbers move with the machine.
  const slowdown = Number(process.env.PERF_BUDGET_CPU || 1);
  if (slowdown > 1) await (await context.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: slowdown });
  return { context, page, network };
}

const markShifts = (page) => page.evaluate(() => window.__clsMark());
const readShifts = (page) => page.evaluate(() => window.__clsRead());

async function homeReady(page) {
  await expect(page.locator('.vmx-hero h1')).toBeVisible();
  await expect(page.locator('main#main')).toBeVisible();
  await page.waitForFunction(() => ![...document.querySelectorAll('main [aria-busy="true"]')].some((el) => /กำลังโหลด/.test(el.textContent || '')));
}

// ── Reporting ──────────────────────────────────────────────────────────

const round4 = (n) => Math.round(n * 1e4) / 1e4;

function explain(name, runs, budget) {
  const m = median(runs.map((r) => r.cls));
  const w = runs.reduce((a, b) => (b.cls > a.cls ? b : a));
  const shifts = w.shifts.slice().sort((a, b) => b.value - a.value).slice(0, 5)
    .map((s) => `    ${round4(s.value)} at ${s.at} ms  ${s.sources.join(' | ') || '(no source)'}`).join('\n');
  return `${name}: CLS median ${round4(m)} (runs ${runs.map((r) => round4(r.cls)).join(', ')}), budget ${budget}\n  largest shifts of the worst run:\n${shifts || '    (none recorded)'}`;
}

let summaryStarted = false;

/** What was measured, printed on every run (a pass included) so the numbers can be read from the log and the job summary. */
function record(testInfo, line) {
  testInfo.annotations.push({ type: 'perf', description: line });
  console.log(`perf-budget ${testInfo.project.name}: ${line}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const heading = summaryStarted ? '' : '\n### Performance budgets measured in the browser\n\n';
    summaryStarted = true;
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${heading}- ${testInfo.project.name}: ${line}\n`);
  }
}

/** UPDATE_PERF_BUDGETS=1: write what this project measured, with the budget rule applied, instead of judging it. */
function rewrite(patch) {
  const file = JSON.parse(readFileSync(BUDGETS_URL, 'utf8'));
  patch(file);
  writeFileSync(BUDGETS_URL, `${JSON.stringify(file, null, 2)}\n`);
}

const clsRow = (limit, runs) => {
  const m = median(runs.map((r) => r.cls));
  return { measured: ceil4(m), budget: clsBudgetFor(limit, m) };
};

// ── The specs ──────────────────────────────────────────────────────────

test.describe('performance budgets', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'layout shift and request budgets are measured on Chromium only');

  test('Home on a first visit: requests, image bytes and layout shift stay inside their budgets', async ({ browser, baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId }, testInfo) => {
    test.setTimeout(60_000);
    const project = testInfo.project.name;
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const { context, page, network } = await openFirstVisit(browser, { baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId });
      try {
        await page.goto('/', { waitUntil: 'load' });
        await homeReady(page);
        // The app checks that it is online 1.5 s after it mounts (src/hooks/useOnlineStatus.js): a count taken
        // before that request would depend on how fast the machine is, so wait for the request itself.
        await network.seen(/\/favicon\.ico\?t=\d+/);
        await settlePage(page, network);
        runs.push({ ...(await readShifts(page)), ...(await network.summary()) });
      } finally {
        await context.close();
      }
    }
    const requests = median(runs.map((r) => r.requests));
    const imageBytes = median(runs.map((r) => r.imageBytes));
    // The run whose count is the median, so a failing message can name what that visit asked for.
    const typical = runs.find((r) => r.requests === requests) || runs[0];
    const kinds = Object.entries(typical.byType).sort((a, b) => b[1] - a[1]).map(([kind, n]) => `${kind} ${n}`).join(', ');
    const biggest = typical.largestImages.map((i) => `${i.path} ${i.bytes}`).join('; ');
    record(testInfo, `Home first visit: ${requests} requests (runs ${runs.map((r) => r.requests).join(', ')}; ${median(runs.map((r) => r.external))} external, aborted; ${kinds}), ${imageBytes} image bytes (runs ${runs.map((r) => r.imageBytes).join(', ')}; largest ${biggest}), CLS ${runs.map((r) => round4(r.cls)).join(', ')}`);

    if (UPDATE) {
      rewrite((file) => {
        file.firstLoad.projects[project] = {
          requests: { measured: requests, budget: requestBudgetFor(requests, file.headroom) },
          imageBytes: { measured: imageBytes, budget: budgetFor(imageBytes, file.headroom) },
        };
        file.cls.projects[project] = { ...(file.cls.projects[project] || {}), home: clsRow(file.cls.limit, runs) };
      });
      return;
    }
    const limits = budgets.firstLoad.projects[project];
    const cls = budgets.cls.projects[project];
    expect(limits, `perf-budgets.json has no firstLoad budget for ${project}`).toBeTruthy();
    expect(cls?.home, `perf-budgets.json has no CLS budget for Home on ${project}`).toBeTruthy();
    expect(requests, `Home made ${requests} requests on a first visit (${kinds}), budget ${limits.requests.budget} (measured ${limits.requests.measured} when it was set)`).toBeLessThanOrEqual(limits.requests.budget);
    expect(imageBytes, `Home downloaded ${imageBytes} image bytes on a first visit (largest: ${biggest}), budget ${limits.imageBytes.budget} (measured ${limits.imageBytes.measured} when it was set)`).toBeLessThanOrEqual(limits.imageBytes.budget);
    expect(median(runs.map((r) => r.cls)), explain('Home', runs, cls.home.budget)).toBeLessThanOrEqual(cls.home.budget);
  });

  // A budget that always reads 0 is worth nothing if the probe behind it is blind. This pushes Home's content down
  // by a known amount, after the screen has settled and with no tap before it, and the probe must say so.
  test('the layout-shift probe sees a shift it is shown', async ({ browser, baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId }) => {
    test.setTimeout(60_000);
    const { context, page, network } = await openFirstVisit(browser, { baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId });
    try {
      await page.goto('/', { waitUntil: 'load' });
      await homeReady(page);
      await settlePage(page, network);
      await markShifts(page);
      await page.evaluate(() => {
        const spacer = document.createElement('div');
        spacer.style.height = '160px';
        document.querySelector('main#main').prepend(spacer);
      });
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      const { cls, shifts } = await readShifts(page);
      expect(cls, `a 160 px spacer above Home moved nothing the probe could see (${JSON.stringify(shifts)})`).toBeGreaterThan(0.05);
    } finally {
      await context.close();
    }
  });

  test('a practice set and its results do not move once drawn', async ({ browser, baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId }, testInfo) => {
    test.setTimeout(90_000);
    const project = testInfo.project.name;
    const set = [];
    const results = [];
    for (let i = 0; i < RUNS; i++) {
      const { context, page, network } = await openFirstVisit(browser, { baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId });
      try {
        await page.goto('/app/study', { waitUntil: 'load' });
        await page.locator(`[data-subject="${SUBJECT}"]`).click();
        await page.locator('.vmx-topic-main', { hasText: TOPIC_HAS_TEXT }).click();
        await expect(page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ })).toBeVisible();
        const start = await setPracticeCount(page, 1);

        // The set: from pressing start until the first card is drawn and everything it waits for has arrived.
        await markShifts(page);
        await start.click();
        await expect(page.locator('.vmx-question-card')).toBeVisible({ timeout: 30_000 });
        await expect(page.locator('.vmx-option').first()).toBeVisible();
        await expect(page.locator('#main')).toBeFocused();
        await settlePage(page, network);
        set.push(await readShifts(page));

        // The results: from "ดูผลลัพธ์ →" until the score is drawn and settled. A practice set with every
        // answer in opens its result at once (5.163.0); the "ส่งข้อสอบ?" check is for a paper or for blanks.
        await page.locator('.vmx-option').first().click();
        const toResults = page.getByRole('button', { name: /ดูผลลัพธ์/ });
        await expect(toResults).toBeVisible();
        await markShifts(page);
        await toResults.click();
        await expect(page.getByText(/Auto-graded Score|Writing Practice Done|คะแนนตรวจอัตโนมัติ|ฝึกข้อเขียนเสร็จแล้ว/)).toBeVisible();
        await settlePage(page, network);
        results.push(await readShifts(page));
      } finally {
        await context.close();
      }
    }
    record(testInfo, `practice set CLS ${set.map((r) => round4(r.cls)).join(', ')}; results CLS ${results.map((r) => round4(r.cls)).join(', ')}`);

    if (UPDATE) {
      rewrite((file) => {
        file.cls.projects[project] = { ...(file.cls.projects[project] || {}), practice: clsRow(file.cls.limit, set), results: clsRow(file.cls.limit, results) };
      });
      return;
    }
    const cls = budgets.cls.projects[project];
    expect(cls?.practice && cls?.results, `perf-budgets.json has no CLS budget for the practice set and results on ${project}`).toBeTruthy();
    expect(median(set.map((r) => r.cls)), explain('Practice set', set, cls.practice.budget)).toBeLessThanOrEqual(cls.practice.budget);
    expect(median(results.map((r) => r.cls)), explain('Results', results, cls.results.budget)).toBeLessThanOrEqual(cls.results.budget);
  });

  test('a VetWiki article does not move once drawn', async ({ browser, baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId }, testInfo) => {
    test.setTimeout(60_000);
    const project = testInfo.project.name;
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const { context, page, network } = await openFirstVisit(browser, { baseURL, viewport, userAgent, deviceScaleFactor, isMobile, hasTouch, timezoneId });
      try {
        await page.goto(WIKI_ARTICLE, { waitUntil: 'load' });
        await expect(page.locator('main h1.vw-title')).toBeVisible();
        await expect(page.locator('main')).toContainText(/Rabies|พิษสุนัขบ้า/);
        await settlePage(page, network);
        runs.push(await readShifts(page));
      } finally {
        await context.close();
      }
    }
    record(testInfo, `VetWiki article ${WIKI_ARTICLE} CLS ${runs.map((r) => round4(r.cls)).join(', ')}`);

    if (UPDATE) {
      rewrite((file) => {
        file.cls.projects[project] = { ...(file.cls.projects[project] || {}), wikiArticle: clsRow(file.cls.limit, runs) };
      });
      return;
    }
    const cls = budgets.cls.projects[project];
    expect(cls?.wikiArticle, `perf-budgets.json has no CLS budget for the VetWiki article on ${project}`).toBeTruthy();
    expect(median(runs.map((r) => r.cls)), explain('VetWiki article', runs, cls.wikiArticle.budget)).toBeLessThanOrEqual(cls.wikiArticle.budget);
  });
});
