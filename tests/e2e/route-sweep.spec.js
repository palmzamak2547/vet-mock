// Route sweep: no screen may break silently.
//
// The routes come from the code, not from a list typed here: every view in `APP_VIEW_ROUTES`
// (src/lib/view-route.js, the map that gives a view its /app/* address) is opened, so a view is
// covered the day it gets an address. And every view App.jsx renders must either have an address
// or be named in NOT_ROUTED below with the reason it has none, so a new view that is neither fails
// here the day it is added.
//
// Each route is opened twice at a phone's width, as a student with a year, a paper, history and
// review cards, and as a first-time visitor with nothing stored. Each visit fails on:
//   console    a console error, a page error or an unhandled rejection
//   request    a failed same-origin request (a missing chunk, asset or data file)
//   blank      a main region with no text and no picture
//   overflow   the page scrolls sideways
//   text       the visible text "undefined", "NaN", "null" or "[object Object]"
// /api/* is answered 503 by the stub below, the way a function that is down answers: no model or
// paid endpoint is ever reached, every screen must survive its functions being down, and an /api
// response is not counted as a failed request. Third-party hosts are cut off.
//
// KNOWN holds what main fails today, one row per route, persona and failure, with the date and why.
// It can only shrink: a row whose failure no longer happens fails the spec, so the fix that makes
// it pass also deletes the row.
//
// CI runs it on a runner of its own, chromium-mobile only (it sets a phone's width for every project
// anyway), so the other runners stay inside their caps; run it locally on all four with
// `npx playwright test tests/e2e/route-sweep.spec.js`.
import { readFileSync } from 'node:fs';
import { test, expect, PINNED_NOW } from './fixtures.js';
import { APP_VIEW_ROUTES } from '../../src/lib/view-route.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

// The student's history and cards name real questions of their year, as a real student's do. Loaded
// on first use, so a runner that skips the sweep never loads the bank for it.
let studiedOnce;
function studiedQuestions() {
  studiedOnce ??= loadQB().then(() => {
    const picked = QB.filter((q) => q.year === 5 && isQuestionDeliverable(q) && (q.type === 'mcq' || q.type === 'tf')).slice(0, 12)
      .map((q) => ({ id: q.id, subject: q.subject }));
    if (picked.length < 12) throw new Error('the sweep needs twelve year-5 questions for its student');
    return picked;
  });
  return studiedOnce;
}

// Views App.jsx renders that have no address of their own, and why. Each still has to be rendered
// (checked below), so the list cannot keep a view that is gone.
const NOT_ROUTED = {
  landing: 'the front door at / for a visitor with no year (opened here as the visitor persona of /)',
  auth: 'sign-in screen, opened from a button; this bundle has no backend to sign in to',
  'topic-select': 'needs a chosen subject: a step of the practice flow',
  config: 'needs a chosen subject and topic: a step of the practice flow',
  exam: 'needs a running set',
  results: 'needs a finished set',
  review: 'needs a finished set',
  wrapup: 'needs a chosen paper wrap-up, opened from Home',
  notes: 'needs a chosen subject; reached from a topic',
  knowledge: 'the wiki reader, served at /wiki/* (opened below as an extra route)',
  wiki: 'the wiki reader, served at /wiki/* (opened below as an extra route)',
  profile: 'a personal hub opened from the bar; view-route.js explains why it has no link',
  'group-detail': 'needs a signed-in account and a chosen group',
  lab: 'Imaging Practical, opened at /#lab',
  'connect-apps': 'opened from settings with a signed-in account',
  'mock-exam': 'retired; renders the fallback only',
  'mock-results': 'retired; renders the fallback only',
};

// Addresses that are routes but not views of APP_VIEW_ROUTES.
const EXTRA_ROUTES = [
  ['wiki', '/wiki'],
  ['lab', '/#lab'],
];

// What main fails today. Each row: route, persona, failure kind, date, why. Only ever delete rows.
const KNOWN = [
];

const PERSONAS = ['student', 'visitor'];
const PHONE = { width: 390, height: 844 };

const appSource = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
const rendered = new Set([...appSource.matchAll(/\{\(?view === '([\w-]+)'(?: \|\| view === '([\w-]+)')?\)? &&/g)]
  .flatMap((m) => [m[1], m[2]]).filter(Boolean));

test('every view App.jsx renders has an address or a reason it has none', () => {
  const routed = new Set(Object.keys(APP_VIEW_ROUTES));
  const missing = [...rendered].filter((v) => !routed.has(v) && !(v in NOT_ROUTED));
  expect(missing, 'a view with no address and no reason: add it to APP_VIEW_ROUTES or NOT_ROUTED').toEqual([]);
  const stale = Object.keys(NOT_ROUTED).filter((v) => !rendered.has(v) && v !== 'landing');
  expect(stale, 'NOT_ROUTED names a view App.jsx no longer renders').toEqual([]);
  const unrendered = [...routed].filter((v) => !rendered.has(v));
  expect(unrendered, 'an address for a view App.jsx does not render').toEqual([]);
  expect(rendered.size).toBeGreaterThan(30);
});

const ROUTES = [...Object.entries(APP_VIEW_ROUTES), ...EXTRA_ROUTES];

function seedStudent({ now, studied }) {
  try {
    const day = 86_400_000;
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    localStorage.setItem('vmx-history', JSON.stringify(studied.map((q, i) => ({
      date: now - i * 3_600_000, questionId: q.id, subject: q.subject, year: 5, phase: '1-mid', correct: i % 3 !== 0,
    }))));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(Object.fromEntries(studied.slice(0, 3).map(({ id }) => [id, {
      questionId: id, easeFactor: 2.5, interval: 1, repetitions: 1, lapses: 0, totalReviews: 1,
      lastReview: now - 3 * day, nextReview: now - day,
    }]))));
    localStorage.setItem('vmx-bookmarks', JSON.stringify([studied[0].id]));
    localStorage.setItem('vmx-streak', JSON.stringify({ streak: 3, lastDate: now - day, freezeUsedAt: null }));
  } catch { /* storage refused: the visit itself will say so */ }
}

const isNoise = (text) => /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|_vercel\/(insights|speed-insights)|Unrecognized feature|downloadable font.*fonts\.gstatic\.com|__cf_bm|rejected for invalid domain/i.test(text);

async function visit(page, origin, path) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(`.${path}`, { waitUntil: 'domcontentloaded' });
      return;
    } catch (error) {
      // The transient navigation cancels mobile-compat.spec.js retries, and only those.
      if (!/NS_BINDING_ABORTED|NS_ERROR_FAILURE|unknown error|frame was detached|interrupted by another navigation|Frame load interrupted/i.test(String(error)) || attempt === 2) throw error;
      await page.waitForTimeout(100 * (attempt + 1));
    }
  }
}

async function settle(page, info) {
  const t0 = Date.now();
  await page.locator('main').first().waitFor({ state: 'attached', timeout: 20_000 }).catch(() => {});
  await page.waitForFunction(() => {
    const main = document.querySelector('main');
    if (!main) return false;
    return ![...main.querySelectorAll('[aria-busy="true"]')].some((el) => /กำลังโหลด/.test(el.textContent || ''));
  }, null, { timeout: 8_000 }).catch(() => {
    // Reported, not failed: a part still loading after 8 s with every function down may be a stuck
    // spinner or only a slow machine, and this spec does not guess which.
    info?.annotations.push({ type: 'still-loading', description: 'a part of main still said กำลังโหลด after 8 s' });
  });
  info?.annotations.push({ type: 'settle-ms', description: String(Date.now() - t0) });
  // Late effects (lazy chunks, fonts, a deferred fetch) get a moment to fail before the reading.
  await page.waitForTimeout(500);
}

async function readPage(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const mainText = main ? (main.innerText || '').trim() : '';
    const pictures = main ? [...main.querySelectorAll('img, svg, canvas, video, picture')].filter(visible).length : 0;
    const root = document.documentElement;
    const text = document.body ? document.body.innerText || '' : '';
    const words = [...new Set([...text.matchAll(/\[object Object\]|(?<![\w.-])(?:undefined|NaN|null)(?![\w-])/g)].map((m) => m[0]))];
    const context = words.map((w) => { const i = text.indexOf(w); return text.slice(Math.max(0, i - 40), i + w.length + 40).replace(/\s+/g, ' '); });
    return {
      hasMain: !!main,
      mainVisible: !!main && visible(main),
      mainText: mainText.length,
      pictures,
      overflow: Math.max(root.scrollWidth, document.body?.scrollWidth || 0) - root.clientWidth,
      words, context,
    };
  });
}

// Everything a visit is judged by, attached before the page loads. `judge` adds what the page
// shows once it has settled; `failures` is the list both fill.
async function watchVisit(page, context, origin) {
  await context.addInitScript(() => {
    window.addEventListener('unhandledrejection', (event) => {
      const r = event.reason;
      console.error(`unhandledrejection: ${r && r.stack ? r.stack.split(String.fromCharCode(10))[0] : String(r)}`);
    });
  });
  await context.route((url) => url.origin !== origin, (route) => route.abort());
  await context.route((url) => url.pathname.startsWith('/api/'), (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable_in_test"}' }));
  const failures = [];
  const sameOrigin = (url) => { try { return new URL(url).origin === origin; } catch { return false; } };
  const isApi = (url) => { try { return new URL(url).pathname.startsWith('/api/'); } catch { return false; } };
  const add = (kind, detail) => { if (!failures.some((f) => f.kind === kind && f.detail === detail)) failures.push({ kind, detail }); };
  let leaving = false;
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const url = msg.location?.().url || '';
    const text = msg.text();
    // A resource that failed to load is judged by the request rules below, not twice here.
    if (/^Failed to load resource/i.test(text)) return;
    if (url && !sameOrigin(url) && !/^unhandledrejection/.test(text)) return;
    if (isNoise(`${text} ${url}`)) return;
    add('console', text.slice(0, 300));
  });
  page.on('pageerror', (error) => { if (!isNoise(error.message)) add('console', `pageerror: ${error.message.slice(0, 300)}`); });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (leaving || !sameOrigin(url) || isApi(url)) return;
    const reason = request.failure()?.errorText || '';
    // A request the page itself cancelled (a lazy image scrolled away, a superseded fetch).
    if (/ERR_ABORTED|NS_BINDING_ABORTED|cancelled/i.test(reason)) return;
    add('request', `${new URL(url).pathname} ${reason}`);
  });
  page.on('response', (response) => {
    const url = response.url();
    if (leaving || !sameOrigin(url) || isApi(url) || url.includes('/_vercel/')) return;
    if (response.status() >= 400) { add('request', `${new URL(url).pathname} ${response.status()}`); return; }
    // The server's page fallback answers a missing file with the app's HTML and a 200 (vite
    // preview does; so would a rewrite). A script, style, picture or font that comes back as a
    // page is a missing file.
    const type = response.request().resourceType();
    if (['script', 'stylesheet', 'image', 'font'].includes(type) && (response.headers()['content-type'] || '').includes('text/html')) {
      add('request', `${new URL(url).pathname} ${type} answered with a page`);
    }
  });
  const judge = async (info) => {
    await settle(page, info);
    const seen = await readPage(page);
    leaving = true;
    if (!seen.hasMain || !seen.mainVisible || (seen.mainText === 0 && seen.pictures === 0)) {
      add('blank', `main ${seen.hasMain ? (seen.mainVisible ? 'empty' : 'hidden') : 'missing'}`);
    }
    if (seen.overflow > 1) add('overflow', `${seen.overflow}px wider than the screen`);
    for (const [i, w] of seen.words.entries()) add('text', `"${w}" in "${seen.context[i]}"`);
    return failures;
  };
  return { judge };
}

// The detectors themselves: a page made to break every rule must be caught on every rule.
test('the sweep catches each kind of failure', async ({ page, context, baseURL }) => {
  test.skip(!!process.env.CI && !process.env.VMX_ROUTE_SWEEP, 'runs with the sweep');
  await page.setViewportSize(PHONE);
  const origin = new URL(baseURL).origin;
  const { judge } = await watchVisit(page, context, origin);
  await context.route('**/zz-sweep-probe', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><body>
    <main></main><div style="width:2000px">กว้างเกินจอ ราคา undefined บาท ได้ NaN คะแนน [object Object]</div>
    <img src="/zz-missing-asset.png" alt="">
    <script>console.error('boom'); Promise.reject(new Error('nobody caught this'));</script></body></html>` }));
  await page.goto('./zz-sweep-probe');
  const kinds = new Set((await judge()).map((f) => f.kind));
  expect([...kinds].sort()).toEqual(['blank', 'console', 'overflow', 'request', 'text']);
});

for (const [view, path] of ROUTES) {
  for (const persona of PERSONAS) {
    test(`${path} as a ${persona}`, async ({ page, context, baseURL }, info) => {
      test.skip(!!process.env.CI && !process.env.VMX_ROUTE_SWEEP, 'CI runs the sweep on a runner of its own (smoke-e2e.yml, "route sweep")');
      // A student's first visit to a screen that reads the whole bank (progress, questions) took 30 s on a
      // loaded machine; the budget bounds a stuck wait, it is not what is asserted.
      test.setTimeout(info.project.name === 'firefox-desktop' ? 180_000 : 120_000);
      await page.setViewportSize(PHONE);
      const origin = new URL(baseURL).origin;
      if (persona === 'student') await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
      const { judge } = await watchVisit(page, context, origin);
      await visit(page, origin, path);
      const failures = await judge(info);

      const project = info.project.name;
      const known = KNOWN.filter((k) => k.route === path && k.persona === persona && (!k.projects || k.projects.includes(project)));
      const unexpected = failures.filter((f) => !known.some((k) => k.kind === f.kind));
      const fixed = known.filter((k) => !failures.some((f) => f.kind === k.kind));
      for (const f of failures.filter((f) => !unexpected.includes(f))) info.annotations.push({ type: 'known', description: `${f.kind}: ${f.detail}` });
      expect(unexpected, `${path} as a ${persona} (${view}) on ${project}`).toEqual([]);
      expect(fixed.map((k) => `${k.kind} (${k.since}: ${k.why})`), 'allow-listed failures that no longer happen: delete their KNOWN rows').toEqual([]);
    });
  }
}
