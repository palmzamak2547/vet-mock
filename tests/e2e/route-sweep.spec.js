// Route sweep: no screen may break silently. Run on demand: `npm run test:e2e:sweep` (chromium-mobile
// and webkit-mobile; extra Playwright arguments pass through). The default e2e run skips this file
// (playwright.config.js ignores it unless VMX_ROUTE_SWEEP=1), so it cannot block a fix while it is
// advisory; it is meant to become a CI job, then a gate after the finals (4 Dec 2026).
//
// The routes come from the code: every view in `APP_VIEW_ROUTES` (src/lib/view-route.js), plus the
// two addresses in EXTRA_ROUTES. Every view App.jsx renders must have an address or a reason in
// NOT_ROUTED, so a new view that is neither fails here the day it is added.
//
// Each route is opened at a phone's width as a student (a year, a paper, history, review cards, a
// bookmark, a streak) and as a first-time visitor with nothing stored, and each visit asserts which
// screen it drew: `#main[data-view]` (App.jsx) names the view App shows, and OUTCOME below names the
// visits where the app is right to show something else (a page that needs an account shows the
// sign-in card; a first-time visitor on a year-scoped page gets the landing page). The table is
// checked against the code that decides those redirects, so it cannot drift. A visit fails on:
//   screen     it drew another screen than the one expected, or the error card
//   loading    the screen still said it was loading after LOADING_BUDGET_MS
//   console    a console error, a page error or an unhandled rejection
//   request    a failed same-origin request, or a script, style, picture or font answered with the
//              app's page (how the preview server hides a missing file)
//   blank      a main region with no text and no picture
//   overflow   the page scrolls sideways
//   text       the visible text "undefined", "NaN", "null" or "[object Object]"
// /api/* answers 503, the way a function that is down answers: no model or paid endpoint is ever
// reached, and every screen must survive its functions being down; an /api response is not counted
// as a failed request. Third-party hosts are cut off.
//
// KNOWN holds what main fails today, one row per route, persona and failure kind, with the date and
// why. It can only shrink: a row whose failure no longer happens fails the spec.
import { readFileSync } from 'node:fs';
import { test, expect, PINNED_NOW } from './fixtures.js';
import { APP_VIEW_ROUTES, YEAR_SCOPED_VIEW_IDS, frontDoorFor } from '../../src/lib/view-route.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

const LOADING_BUDGET_MS = 30_000;

// Views App.jsx renders that have no address of their own, and why.
const NOT_ROUTED = {
  landing: 'the front door at / for a visitor with no year (the visitor persona of / and of year-scoped routes)',
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
  lab: 'Imaging Practical, opened at /#lab (an extra route below)',
  'connect-apps': 'opened from settings with a signed-in account',
  'mock-exam': 'retired; renders the fallback only',
  'mock-results': 'retired; renders the fallback only',
};

// Addresses that are routes but not views of APP_VIEW_ROUTES: [view App shows, path].
const EXTRA_ROUTES = [
  ['knowledge', '/wiki'],
  ['lab', '/#lab'],
];

const appSource = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
const rendered = new Set([...appSource.matchAll(/\{\(?view === '([\w-]+)'(?: \|\| view === '([\w-]+)')?\)? &&/g)]
  .flatMap((m) => [m[1], m[2]]).filter(Boolean));
// App.jsx's own list of the views that draw the sign-in card for a visitor with no account.
const AUTH_REQUIRED = new Set([...(/const AUTH_REQUIRED_VIEWS = new Set\(\[([^\]]*)\]\)/.exec(appSource)?.[1] || '')
  .matchAll(/'([\w-]+)'/g)].map((m) => m[1]));

// Where the app is right not to draw the route's own screen. Every other visit must draw the view
// itself. 'auth-required': the view's sign-in card (this bundle has no account, so for both personas).
// 'landing': the landing page, for a first-time visitor on a year-scoped page (frontDoorFor).
const OUTCOME = {
  groups: { student: 'auth-required', visitor: 'auth-required' },
  'leaderboard-global': { student: 'auth-required', visitor: 'landing' },
  'account-settings': { student: 'auth-required', visitor: 'auth-required' },
  race: { student: 'auth-required', visitor: 'auth-required' },
  'review-queue': { student: 'auth-required', visitor: 'auth-required' },
  home: { visitor: 'landing' },
  'subject-select': { visitor: 'landing' },
  'sr-session': { visitor: 'landing' },
  dashboard: { visitor: 'landing' },
  'phase-select': { visitor: 'landing' },
  'reading-checklist': { visitor: 'landing' },
};
const expectedOutcome = (view, persona) => OUTCOME[view]?.[persona] || 'view';

// What main fails today. Each row: { route, persona, kind, since, why, projects? }. Only ever delete rows.
const KNOWN = [
];

const PERSONAS = ['student', 'visitor'];
const PHONE = { width: 390, height: 844 };
const ROUTES = [...Object.entries(APP_VIEW_ROUTES), ...EXTRA_ROUTES];

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

test('the expected redirects are exactly the ones the code makes', () => {
  expect(AUTH_REQUIRED.size, 'AUTH_REQUIRED_VIEWS read from App.jsx').toBeGreaterThan(3);
  for (const [view] of ROUTES) {
    for (const persona of PERSONAS) {
      const door = persona === 'visitor' ? frontDoorFor(view, { storedYearRaw: null, seenLanding: false }) : null;
      const code = door === 'landing' ? 'landing' : AUTH_REQUIRED.has(view) ? 'auth-required' : 'view';
      expect(`${view} as a ${persona}: ${expectedOutcome(view, persona)}`).toBe(`${view} as a ${persona}: ${code}`);
    }
  }
  expect([...YEAR_SCOPED_VIEW_IDS].every((v) => OUTCOME[v]?.visitor === 'landing')).toBe(true);
});

// The student's history and cards name real questions of their year, as a real student's do.
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

async function visit(page, path) {
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

// The screen a visit drew, read in the page.
function readScreen() {
  const main = document.querySelector('#main') || document.querySelector('main');
  const loading = !!main && (!!main.querySelector('.vmx-view-fallback')
    || [...main.querySelectorAll('[aria-busy="true"]')].some((el) => /กำลังโหลด/.test(el.textContent || '')));
  return {
    landing: !!document.querySelector('.lp-root main#lp-main'),
    view: document.querySelector('#main')?.getAttribute('data-view') || null,
    authCard: !!document.getElementById('vmx-auth-required-title'),
    errorCard: /หน้านี้ขัดข้อง/.test(main?.innerText || ''),
    loading,
  };
}

async function readPage(page) {
  return page.evaluate(() => {
    const main = document.querySelector('#main') || document.querySelector('main');
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

// Everything a visit is judged by, attached before the page loads. `judge` waits for the screen,
// then adds what the page shows; `failures` is the list both fill.
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
    const type = response.request().resourceType();
    if (['script', 'stylesheet', 'image', 'font'].includes(type) && (response.headers()['content-type'] || '').includes('text/html')) {
      add('request', `${new URL(url).pathname} ${type} answered with a page`);
    }
  });

  // expected: 'view' (with the view's id), 'auth-required' or 'landing'.
  const judge = async ({ expected, view, budget = LOADING_BUDGET_MS }) => {
    const want = (s) => (expected === 'landing' ? s.landing
      : s.view === view && !s.errorCard && (expected === 'auth-required' ? s.authCard : !s.authCard)) && !s.loading;
    const deadline = Date.now() + budget;
    let screen = await page.evaluate(readScreen).catch(() => ({}));
    while (!want(screen) && Date.now() < deadline) {
      await page.waitForTimeout(250);
      screen = await page.evaluate(readScreen).catch(() => ({}));
    }
    // Late effects (lazy chunks, fonts, a deferred fetch) get a moment to fail before the reading.
    await page.waitForTimeout(500);
    screen = await page.evaluate(readScreen).catch(() => ({}));
    const seen = await readPage(page);
    leaving = true;
    if (screen.loading) add('loading', `still loading after ${Math.round(budget / 1000)} s`);
    else if (!want(screen)) {
      const drew = screen.landing ? 'landing' : screen.errorCard ? 'the error card' : screen.authCard ? `${screen.view} sign-in card` : String(screen.view);
      add('screen', `expected ${expected === 'view' ? view : `${view} ${expected}`}, drew ${drew}`);
    }
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
  await page.setViewportSize(PHONE);
  const origin = new URL(baseURL).origin;
  const { judge } = await watchVisit(page, context, origin);
  await context.route('**/zz-sweep-probe', (route) => route.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><html><head><meta charset="utf-8"></head><body>
    <main id="main" data-view="home"><div aria-busy="true"><span style="display:none">กำลังโหลด</span></div></main>
    <div style="width:2000px">กว้างเกินจอ ราคา undefined บาท ได้ NaN คะแนน [object Object]</div>
    <img src="/zz-missing-asset.png" alt="">
    <script>console.error('boom'); Promise.reject(new Error('nobody caught this'));</script></body></html>` }));
  await page.goto('./zz-sweep-probe');
  const kinds = new Set((await judge({ expected: 'view', view: 'dashboard', budget: 1_000 })).map((f) => f.kind));
  expect([...kinds].sort()).toEqual(['blank', 'console', 'loading', 'overflow', 'request', 'text']);
  // A screen that is not the one expected, once it has finished loading.
  await page.evaluate(() => document.querySelector('#main [aria-busy]').remove());
  const screen = await page.evaluate(readScreen);
  expect(screen).toMatchObject({ view: 'home', loading: false, authCard: false, landing: false });
});

for (const [view, path] of ROUTES) {
  for (const persona of PERSONAS) {
    test(`${path} as a ${persona}`, async ({ page, context, baseURL }, info) => {
      // The loading budget plus a cold start on a busy machine; it bounds a stuck wait, nothing more.
      test.setTimeout(info.project.name === 'firefox-desktop' ? 180_000 : 120_000);
      await page.setViewportSize(PHONE);
      const origin = new URL(baseURL).origin;
      if (persona === 'student') await context.addInitScript(seedStudent, { now: Date.parse(PINNED_NOW), studied: await studiedQuestions() });
      const { judge } = await watchVisit(page, context, origin);
      await visit(page, path);
      const expected = expectedOutcome(view, persona);
      const failures = await judge({ expected, view });

      const project = info.project.name;
      const known = KNOWN.filter((k) => k.route === path && k.persona === persona && (!k.projects || k.projects.includes(project)));
      const unexpected = failures.filter((f) => !known.some((k) => k.kind === f.kind));
      const fixed = known.filter((k) => !failures.some((f) => f.kind === k.kind));
      for (const f of failures.filter((f) => !unexpected.includes(f))) info.annotations.push({ type: 'known', description: `${f.kind}: ${f.detail}` });
      info.annotations.push({ type: 'outcome', description: expected });
      expect(unexpected, `${path} as a ${persona} (${view}, expected ${expected}) on ${project}`).toEqual([]);
      expect(fixed.map((k) => `${k.kind} (${k.since}: ${k.why})`), 'allow-listed failures that no longer happen: delete their KNOWN rows').toEqual([]);
    });
  }
}
