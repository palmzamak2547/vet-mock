// Defect sweep: every screen a student can reach, looked at by twelve named detectors
// (tests/e2e/lib/defects.js), at four sizes, in both colour schemes and in five states. Run on demand:
// `npm run sweep:defects` (scripts/defect-sweep.mjs builds nothing; build the connected bundle first,
// as its header says). The default e2e run and CI leave this file out (playwright.config.js), because
// a full pass takes about an hour.
//
// Why it exists: the library document's loading screen drew the mascot over the title and the
// percentage over the size line for weeks, because no test ever looked at a screen while it loaded.
//
// What a visit is: the routes of tests/e2e/lib/routes.js (the route sweep's own list) plus the landing
// page, as a signed-in Chula student modelled the way student-profile.spec.js models one (a session
// planted as data, every database request answered here, nothing real called), in five states:
//   settled   a student with history; the page given up to 20 s to finish loading
//   loading   data, question banks, documents and pictures held back while the page is looked at
//   empty     a new student with no history
//   failed    every data call answers 500 and each lazy chunk fails once
//   offline   the screen open, then the network gone and the screen opened again from inside the app
// and, beyond landing on routes, the main flows (FLOWS below), each step looked at the same way.
// /api/* answers 503 (500 when failed), as a function that is down answers; no model or paid endpoint
// is reached. Third-party hosts are cut off.
//
// Each finding is written to work/defect-sweep/raw/ with a cropped picture in work/defect-sweep/shots/;
// scripts/defect-sweep.mjs gathers them into findings.json and holds the counts to
// tests/e2e/defect-baseline.json, which may only fall. tests/e2e/lib/defect-allow.js lists what is
// meant to look that way, each with its reason.
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, PINNED_NOW } from './fixtures.js';
import { ROUTES, studiedQuestions, isNoise, visit, readScreen } from './lib/routes.js';
import * as D from './lib/defects.js';
import { ALLOW } from './lib/defect-allow.js';
import { isUnknownAppPath } from '../../src/lib/view-route.js';
import { QB, loadQB } from '../../src/data/questions.js';

const HOST = 'mpovsdzdggvksmeehqfj.supabase.co';
const TOKEN_KEY = 'sb-mpovsdzdggvksmeehqfj-auth-token';
const UID = '44444444-4444-4444-8444-444444444444';
const STUDENT_NO = '6600000048';
const b64 = (v) => Buffer.from(JSON.stringify(v)).toString('base64url');
const USER = {
  id: UID, email: `${STUDENT_NO}@student.chula.ac.th`, aud: 'authenticated', role: 'authenticated',
  identities: [{ provider: 'google', identity_data: { email: `${STUDENT_NO}@student.chula.ac.th`, email_verified: true, custom_claims: { hd: 'student.chula.ac.th' } } }],
  app_metadata: { provider: 'google', providers: ['google'] },
  // identity_intro_done: the first-run name step was answered on an earlier visit, so Home is Home.
  // The step itself has its own spec (student-profile.spec.js).
  user_metadata: { full_name: 'Modeled Student', identity_intro_done: true },
  created_at: '2026-01-01T00:00:00Z', email_confirmed_at: '2026-01-01T00:00:00Z',
};
const SESSION = {
  access_token: `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: UID, aud: 'authenticated', role: 'authenticated', exp: 4102444800 })}.modeled-only`,
  refresh_token: 'modeled-only-not-a-real-session', token_type: 'bearer', expires_in: 3600, expires_at: 4102444800, user: USER,
};
const PROFILE = { id: UID, username: 'sweep_student', avatar_emoji: '🐾', created_at: '2026-01-01T00:00:00Z' };

const SCHEMES = ['light', 'dark'];
const env = (k) => process.env[k] || '';
const ONLY = env('VMX_DEFECT_ONLY');
const WANT_STATES = env('VMX_DEFECT_STATES') ? env('VMX_DEFECT_STATES').split(',') : D.STATES;
const WANT_SIZES = env('VMX_DEFECT_SIZES') ? D.SIZES.filter((s) => env('VMX_DEFECT_SIZES').split(',').includes(s.id)) : D.SIZES;
const WANT_SCHEMES = env('VMX_DEFECT_SCHEMES') ? env('VMX_DEFECT_SCHEMES').split(',') : SCHEMES;
const PARTS = env('VMX_DEFECT_PARTS') ? env('VMX_DEFECT_PARTS').split(',') : ['routes', 'probe', 'flows'];
const DEV = env('VMX_DEFECT_DEV') === '1'; // against the dev server: React's own warnings are printed there only
// VMX_DEFECT_SCALE=3 draws the pictures at three times the size, for checking a finding by eye.
if (env('VMX_DEFECT_SCALE')) test.use({ deviceScaleFactor: Number(env('VMX_DEFECT_SCALE')) });
const ROUTE_LIST = [...ROUTES, ['landing', '/']].filter(([, p]) => !ONLY || (ONLY.startsWith('=') ? p === ONLY.slice(1) : p.includes(ONLY)));
const DATA_CHUNK = /\/assets\/(data-|questions-|notes-|search-index|summar|video-summ|evidence|wiki-)/;

const pdf = (n) => Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
  + `2 0 obj<</Type/Pages/Kids[${Array.from({ length: n }, (_, i) => `${i + 3} 0 R`).join(' ')}]/Count ${n}>>endobj\n`
  + Array.from({ length: n }, (_, i) => `${i + 3} 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 400 500]>>endobj\n`).join('')
  + 'trailer<</Root 1 0 R>>\n', 'latin1');

// ---------------------------------------------------------------------------------------------
// The network every visit runs on. `net.state` may change during a test (a held document, offline).
async function network(context, origin, net) {
  net.gate = new Promise((resolve) => { net.release = resolve; });
  net.served500 = [];
  net.failedOnce = new Set();
  const hold = async () => { if (net.holding) await net.gate; };
  await context.routeWebSocket(/supabase\.co/, (ws) => ws.close());
  await context.route('**/*', async (route) => {
    const req = route.request();
    let url;
    try { url = new URL(req.url()); } catch { return route.abort(); }
    try {
      if (url.origin === origin) {
        const p = url.pathname;
        if (p === '/__deck-test.pdf') {
          if (net.holdDocument) await net.documentGate;
          return route.fulfill(req.isNavigationRequest() ? { body: '<p>deck</p>', contentType: 'text/html' } : { body: pdf(3), contentType: 'application/pdf' });
        }
        if (p.startsWith('/api/')) {
          if (net.state === 'loading') await hold();
          if (p === '/api/library-file' && net.state !== 'failed') return route.fulfill({ json: { url: net.deckUrl || '/__deck-test.pdf' } });
          const status = net.state === 'failed' ? 500 : 503;
          if (status === 500) net.served500.push(p);
          return route.fulfill({ status, contentType: 'application/json', body: '{"error":"unavailable_in_test"}' });
        }
        if (/\/_vercel\//.test(p)) return route.fulfill({ contentType: 'application/javascript', body: '' });
        const type = req.resourceType();
        if (net.state === 'loading' && (type === 'image' || type === 'media' || ((type === 'fetch' || type === 'xhr') && !p.startsWith('/@')) || (type === 'script' && DATA_CHUNK.test(p)))) await hold();
        if (net.state === 'failed' && type === 'script' && /\/assets\/.*\.js$/.test(p) && !net.entry.has(p) && !net.failedOnce.has(p)) {
          net.failedOnce.add(p);
          return route.fulfill({ status: 500, body: 'failed once in test' });
        }
        return route.continue();
      }
      if (net.deckUrl && req.url().startsWith(net.deckUrl)) return route.continue();
      if (url.hostname === HOST) return database(route, req, url, net, hold);
      return route.abort();
    } catch {
      return undefined; // the page went away while this request waited
    }
  });
}

async function database(route, req, url, net, hold) {
  const p = url.pathname; const m = req.method();
  const json = (body, status = 200, headers = {}) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body), headers });
  if (p === '/rest/v1/rpc/chula_access_state') return json({ enforce: true, signed_in: true, member: true, uid: UID });
  if (p.startsWith('/auth/v1/user')) return json(USER);
  if (p.startsWith('/auth/v1/token')) return json(SESSION);
  if (p.startsWith('/auth/v1/')) return json({});
  if (net.state === 'loading') await hold();
  if (net.state === 'failed') { net.served500.push(p); return json({ message: 'the database answered 500 in test', code: 'XX000' }, 500); }
  const one = /pgrst\.object/.test(req.headers().accept || '');
  if (p === '/rest/v1/profiles') return json(one ? PROFILE : [PROFILE]);
  if (p === '/rest/v1/rpc/ensure_profile') return json(PROFILE);
  if (p === '/rest/v1/rpc/sync_user_data_v2') {
    // A receipt the sync engine accepts (src/lib/user-data-atomic.js): every operation acknowledged.
    let ops = [];
    try { ops = req.postDataJSON()?.p_operations || []; } catch { /* no body */ }
    net.revision = (net.revision || 1) + 1;
    const base = net.account || { user_id: UID, history: [], sr_cards: {}, bookmarks: [], notes: {}, custom_questions: [] };
    return json({ row: { ...base, sync_version: 2, sync_revision: net.revision, sync_clock: Date.now() }, acknowledged: ops.map((o) => o.id), conflicts: [] });
  }
  if (p === '/rest/v1/user_data' && m === 'GET') {
    const row = net.account;
    if (!row) return one ? json({ code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'JSON object requested, multiple (or no) rows returned' }, 406) : json([]);
    return json(one ? row : [row]);
  }
  if (p.startsWith('/storage/v1/') || p.startsWith('/functions/v1/')) return json({ error: 'unavailable_in_test' }, 503);
  if (m === 'GET' || m === 'HEAD') {
    if (one) return json({ code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'JSON object requested, multiple (or no) rows returned' }, 406);
    return json([], 200, { 'content-range': '*/0' });
  }
  if (p.startsWith('/rest/v1/rpc/')) return json([]);
  return json([], 201);
}

// Runs in the page: the signed-in student's preferences on this device (their history, review cards
// and bookmark live in their account row, answered by database()), or a visitor with nothing chosen.
function seedPersona({ persona, key, session, now }) {
  try {
    if (window !== window.top) return;
    localStorage.setItem(key, JSON.stringify(session));
    if (persona === 'visitor') { localStorage.setItem('vmx-consent', JSON.stringify('essential')); return; }
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    // Nothing of the account's own data is stored here: a guest's data on the device would be offered
    // for import at sign-in (src/lib/user-data-atomic.js), which a returning student never sees.
    void now;
  } catch { /* storage refused */ }
}

// The account row of a student with history, as the database holds it (src/lib/user-data-sync.js
// USER_DATA_FIELDS, remote keys): the same twelve questions the route sweep's student has studied.
function accountRow(studied, now) {
  const day = 86_400_000;
  return {
    user_id: UID,
    history: studied.map((q, i) => ({ date: now - i * 3_600_000, questionId: q.id, subject: q.subject, year: 5, phase: '1-mid', correct: i % 3 !== 0 })),
    sr_cards: Object.fromEntries(studied.slice(0, 3).map(({ id }) => [id, { questionId: id, easeFactor: 2.5, interval: 1, repetitions: 1, lapses: 0, totalReviews: 1, lastReview: now - 3 * day, nextReview: now - day }])),
    bookmarks: [studied[0].id], notes: {}, custom_questions: [],
    updated_at: new Date(now - day).toISOString(), sync_version: 2, sync_revision: 1, sync_clock: now - day,
  };
}

// Harness stubs so a pressed control that prints, shares or copies leaves a trace the probe can see.
function stubSideEffects() {
  const mark = (what) => { try { document.body.setAttribute('data-vmx-side', `${what}-${Date.now()}`); } catch { /* none */ } };
  window.print = () => mark('print');
  try { if (navigator.share) navigator.share = async () => mark('share'); } catch { /* read only */ }
  try { if (navigator.clipboard) navigator.clipboard.writeText = async () => mark('copy'); } catch { /* read only */ }
}

async function prepare(page, context, baseURL, { persona = 'student', state = 'settled' } = {}) {
  const origin = new URL(baseURL).origin;
  const studied = await studiedQuestions();
  const now = Date.parse(PINNED_NOW);
  const net = { state, holding: state === 'loading', entry: new Set(), account: persona === 'student' ? accountRow(studied, now) : null };
  if (state === 'failed') {
    const html = await (await context.request.get(`${origin}/`)).text().catch(() => '');
    for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)) net.entry.add(m[1]);
  }
  await context.addInitScript(D.installObservers);
  await context.addInitScript(stubSideEffects);
  await context.addInitScript(seedPersona, { persona, key: TOKEN_KEY, session: SESSION, now });
  await network(context, origin, net);
  const log = { console: [] };
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    const react = /^Warning: |Each child in a list should have a unique|Can't perform a React state update|Cannot update a component|unique "key" prop/.test(text);
    if (type !== 'error' && !(DEV && type === 'warning' && react)) return;
    if (/^Failed to load resource/i.test(text)) return;
    const url = msg.location?.().url || '';
    if (url && !url.startsWith(origin) && !/^unhandledrejection/.test(text)) return;
    if (isNoise(`${text} ${url}`)) return;
    if (DEV && /\[vite\]|hmr|websocket/i.test(text)) return;
    log.console.push({ text: text.slice(0, 300), react });
  });
  page.on('pageerror', (e) => { if (!isNoise(e.message)) log.console.push({ text: `pageerror: ${e.message.slice(0, 300)}` }); });
  return { net, log, origin };
}

// ---------------------------------------------------------------------------------------------
// Waits for the screen and watches loading while it does. Returns what it saw.
async function watch(page, { until = 'settled', ms = D.STUCK_MS }) {
  const start = Date.now();
  const spinners = new Map();
  let longSilent = [];
  let read = { loading: true, what: [] }; let screen = {};
  while (Date.now() - start < ms) {
    read = await page.evaluate(D.readLoading).catch(() => ({ loading: true, what: [], silent: [] }));
    screen = await page.evaluate(readScreen).catch(() => ({}));
    const now = Date.now();
    const present = new Set();
    for (const s of read.silent || []) {
      present.add(s.sig);
      if (!spinners.has(s.sig)) spinners.set(s.sig, { since: now, rect: s.rect });
      else if (now - spinners.get(s.sig).since > D.SPINNER_MS && !longSilent.some((l) => l.sig === s.sig)) longSilent.push({ sig: s.sig, rect: s.rect });
    }
    for (const k of [...spinners.keys()]) if (!present.has(k)) spinners.delete(k);
    const settled = !read.loading && !screen.loading && (screen.view || screen.landing || screen.errorCard);
    if (until === 'settled' && settled) return { settled: true, read, screen, longSilent, elapsed: now - start };
    await page.waitForTimeout(400);
  }
  return { settled: false, read, screen, longSilent, elapsed: Date.now() - start };
}

const ERROR_WORDS = /ไม่สำเร็จ|ล้มเหลว|ผิดพลาด|ขัดข้อง|โหลดไม่|ไม่ได้|ลองใหม่|ลองอีกครั้ง|เชื่อมต่อ|ออฟไลน์|ไม่พร้อม|ไม่มีอินเทอร์เน็ต|error|retry|failed|offline/i;

// Looks at what is on screen now and returns its findings (not yet written).
async function look(page, { size, contrast = true }) {
  const found = [];
  const stat = await page.evaluate(D.scanPage, { touch: size.touch }).catch((e) => [{ detector: 'console', detail: `the sweep could not read this screen: ${String(e).slice(0, 120)}`, a: { sig: 'sweep', text: '', rect: null } }]);
  found.push(...stat);
  found.push(...await page.evaluate(D.scanUnderBars).catch(() => []));
  if (contrast) {
    const c = await page.evaluate(D.scanContrast, {}).catch(() => ({ findings: [] }));
    found.push(...c.findings);
  }
  return found;
}

// Writes one visit's findings with their pictures.
async function record(page, testId, findings, where) {
  const rows = [];
  let pictures = 0;
  for (const f of findings) {
    const row = { ...where, ...f };
    const allowed = D.allowedBy(ALLOW, row);
    if (allowed) row.allowed = allowed.reason;
    else if (pictures < 30 && (f.a?.rect || f.b?.rect)) { row.picture = await D.picture(page, row, where); pictures += 1; }
    row.signature = D.signature(row);
    rows.push(row);
  }
  return rows;
}

function consoleFindings(log, net, state, mainText) {
  const out = [];
  for (const c of log.console) out.push({ detector: 'console', detail: `${c.react ? 'React warning' : 'error'}: ${c.text}`, a: { sig: 'console', text: c.text.slice(0, 60), rect: null } });
  if (state === 'failed' && net.served500.length && !ERROR_WORDS.test(mainText)) {
    const paths = [...new Set(net.served500.map((p) => p.replace(/[0-9a-f-]{20,}/g, ':id')))].slice(0, 4).join(', ');
    out.push({ detector: 'console', detail: `failed request not explained: ${net.served500.length} data request(s) answered 500 (${paths}) and the screen says nothing`, a: { sig: 'screen', text: '', rect: null } });
  }
  log.console.length = 0;
  return out;
}

// One visit of a route at one size in one state.
async function visitOnce(page, context, { path, size, state, net, log }) {
  const found = [];
  await page.setViewportSize({ width: size.width, height: size.height });
  if (state === 'offline') {
    await context.setOffline(false);
    // Open the screen, step to another screen and back while online (so this document already holds
    // both screens' code, as a student's open app does), then lose the network and come back to it:
    // the screen mounts again and asks for its data with no connection.
    await visit(page, path);
    await watch(page, { ms: D.STUCK_MS });
    const away = path.startsWith('/app/about') ? '/app/privacy' : '/app/about';
    await page.evaluate((to) => { history.pushState(null, '', to); dispatchEvent(new PopStateEvent('popstate')); }, away);
    await watch(page, { ms: 8_000 });
    await context.setOffline(true);
    await page.evaluate(() => history.back());
    await page.waitForTimeout(400);
  } else {
    await visit(page, path);
  }
  if (state === 'loading') {
    const w = await watch(page, { until: 'time', ms: 5_000 });
    for (const s of w.longSilent) found.push({ detector: 'stuck', detail: `a spinner with no words for more than ${D.SPINNER_MS / 1000} s while data loads`, a: { sig: s.sig, text: '', rect: s.rect } });
    found.push(...await look(page, { size }));
    found.push(...consoleFindings(log, net, state, ''));
    return found;
  }
  const w = await watch(page, { ms: D.STUCK_MS });
  if (!w.settled) {
    const why = (w.read.what || []).join(', ') || (w.screen?.view ? 'the view fallback' : 'no screen drawn in #main');
    found.push({ detector: 'stuck', detail: `still loading after ${D.STUCK_MS / 1000} s (${why})`, a: { sig: (w.read.what || [])[0] || 'main', text: '', rect: { x: 0, y: 0, w: size.width, h: size.height } } });
  }
  for (const s of w.longSilent) found.push({ detector: 'stuck', detail: `a spinner with no words for more than ${D.SPINNER_MS / 1000} s`, a: { sig: s.sig, text: '', rect: s.rect } });
  if (w.screen?.errorCard) found.push({ detector: 'console', detail: 'the error card (หน้านี้ขัดข้อง) is drawn', a: { sig: 'main', text: 'หน้านี้ขัดข้อง', rect: null } });
  // Two pictures of where things sit, 1.5 s apart, nobody touching the page.
  await page.waitForTimeout(700);
  const first = await page.evaluate(D.snapshotPositions).catch(() => ({}));
  await page.waitForTimeout(1500);
  const second = await page.evaluate(D.snapshotPositions).catch(() => ({}));
  for (const m of D.comparePositions(first, second).slice(0, 10)) {
    const [tag, text] = m.key.split('|');
    found.push({ detector: 'shift', detail: `moved ${m.move} px between two looks 1.5 s apart after the screen settled`, a: { sig: `${tag.toLowerCase()}${m.key.split('|')[2] ? `.${m.key.split('|')[2].trim().split(/\s+/).slice(0, 3).join('.')}` : ''}`, text, rect: { x: m.to.x, y: m.to.y, w: m.to.w, h: m.to.h } } });
  }
  const shifts = await page.evaluate(() => (window.__vmxDefects ? window.__vmxDefects.shifts.splice(0) : [])).catch(() => []);
  const seen = new Set();
  for (const s of shifts) {
    const k = `${s.sig}|${s.text}`;
    if (seen.has(k)) continue;
    seen.add(k);
    found.push({ detector: 'shift', detail: `layout shift of ${s.move} px after first paint`, a: { sig: s.sig || 'unknown', text: s.text, rect: { x: Math.round(s.curr.x), y: Math.round(s.curr.y), w: Math.round(s.curr.w), h: Math.round(s.curr.h) } } });
  }
  found.push(...await look(page, { size }));
  const mainText = await page.evaluate(() => (document.querySelector('#main') || document.body).innerText || '').catch(() => '');
  found.push(...consoleFindings(log, net, state, mainText));
  if (state === 'offline') await context.setOffline(false);
  return found;
}

// ---------------------------------------------------------------------------------------------
if (PARTS.includes('routes')) {
  for (const [view, path] of ROUTE_LIST) {
    for (const state of WANT_STATES) {
      for (const scheme of WANT_SCHEMES) {
        test(`${view} ${path} ${state} ${scheme}`, async ({ page, context, baseURL }) => {
          test.setTimeout(420_000);
          await page.emulateMedia({ colorScheme: scheme });
          const persona = view === 'landing' ? 'visitor' : state === 'empty' ? 'empty' : 'student';
          const { net, log } = await prepare(page, context, baseURL, { persona, state });
          const rows = [];
          for (const size of WANT_SIZES) {
            const where = { route: view === 'landing' ? '/ (landing)' : path, view, state, size: size.id, scheme, build: DEV ? 'dev' : 'build' };
            let found;
            try {
              found = await visitOnce(page, context, { path, size, state, net, log });
            } catch (error) {
              found = [{ detector: 'console', detail: `the sweep could not finish this visit: ${String(error).split('\n')[0].slice(0, 160)}`, a: { sig: 'sweep', text: '', rect: null }, unreached: true }];
            }
            rows.push(...await record(page, `${path}|${state}|${scheme}|${size.id}`, found, where));
          }
          net.release();
          D.writeFindings(`routes|${path}|${view}|${state}|${scheme}|${DEV ? 'dev' : 'build'}`, rows);
        });
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Every control pressed once on each settled screen: dead controls, and the focus of what opens.
async function probeControls(page, context, { path, size, log, net, where, chrome = false }) {
  const found = [];
  const open = async () => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await visit(page, path);
    await watch(page, { ms: D.STUCK_MS });
    await page.waitForTimeout(500);
    await page.evaluate(D.learnNoise, 900);
    return page.evaluate(D.listControls, { max: 30, chrome });
  };
  let list = await open();
  const total = list.length;
  for (let i = 0; i < total; i += 1) {
    const c = list[i];
    if (!c) break;
    if (c.download || c.target === '_blank') continue;
    if (c.href && !/^(#|javascript:)/.test(c.href)) {
      let u;
      try { u = new URL(c.href, page.url()); } catch { continue; }
      if (u.origin === new URL(page.url()).origin && isUnknownAppPath(u.pathname)) {
        found.push({ detector: 'dead', detail: `a link to the not-found screen (${u.pathname})`, a: { sig: c.sig, text: c.text, rect: c.rect } });
      }
      continue;
    }
    const el = page.locator(`[data-vmx-probe="${i}"]`);
    if (!(await el.count().catch(() => 0))) continue;
    await el.scrollIntoViewIfNeeded({ timeout: 2_000 }).catch(() => {});
    const boxNow = await el.boundingBox().catch(() => null);
    if (!boxNow) continue;
    let requests = 0; let popup = false;
    const onReq = () => { requests += 1; };
    const onPopup = (p) => { popup = true; p.close().catch(() => {}); };
    page.on('request', onReq);
    context.on('page', onPopup);
    await page.evaluate(D.armWatch);
    await page.mouse.click(boxNow.x + boxNow.width / 2, boxNow.y + boxNow.height / 2).catch(() => {});
    await page.waitForTimeout(700);
    page.off('request', onReq);
    context.off('page', onPopup);
    const w = await page.evaluate(D.readWatch).catch(() => null);
    if (!w) { list = await open(); continue; }
    const acted = w.urlChanged || w.mutations > 0 || w.dialogOpened || w.focusMoved || requests > 0 || popup;
    if (!acted) {
      found.push({ detector: 'dead', detail: 'pressed, and nothing happened: no navigation, no change on screen, no request, no dialog', a: { sig: c.sig, text: c.text, rect: c.rect } });
      continue;
    }
    if (w.dialogOpened) {
      const d = await page.evaluate(D.readDialog).catch(() => null);
      if (d) {
        const dRect = d.rect;
        if (!d.focusInside) found.push({ detector: 'focus', detail: `a dialog opened from "${c.text}" and focus stayed outside it`, a: { sig: d.sig, text: d.label, rect: dRect }, b: { sig: c.sig, text: c.text, rect: c.rect } });
        let left = false;
        for (let t = 0; t < 14 && !left; t += 1) {
          await page.keyboard.press('Tab');
          left = await page.evaluate(() => {
            const all = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open], [aria-modal="true"]')];
            const top = all[all.length - 1];
            return !!top && !top.contains(document.activeElement);
          }).catch(() => false);
        }
        if (left) found.push({ detector: 'focus', detail: `Tab leaves the dialog opened from "${c.text}"`, a: { sig: d.sig, text: d.label, rect: dRect } });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        const after = await page.evaluate(D.readDialog).catch(() => null);
        if (after && after.sig === d.sig) found.push({ detector: 'focus', detail: `Escape does not close the dialog opened from "${c.text}"`, a: { sig: d.sig, text: d.label, rect: dRect } });
        else {
          const back = await page.evaluate((i) => {
            const a = document.activeElement;
            if (!a || a === document.body || !a.isConnected) return 'nothing';
            if (a.getAttribute('data-vmx-probe') === String(i)) return 'trigger';
            return 'elsewhere';
          }, i).catch(() => 'nothing');
          if (back === 'nothing') found.push({ detector: 'focus', detail: `closing the dialog opened from "${c.text}" returns focus to nothing`, a: { sig: c.sig, text: c.text, rect: c.rect } });
        }
      }
    }
    log.console.length = 0;
    list = await open();
  }
  void net; void where;
  return found;
}

if (PARTS.includes('probe') && !DEV) {
  for (const [view, path] of ROUTE_LIST) {
    test(`${view} ${path} controls`, async ({ page, context, baseURL }) => {
      test.setTimeout(900_000);
      await page.emulateMedia({ colorScheme: 'light' });
      const { net, log } = await prepare(page, context, baseURL, { persona: view === 'landing' ? 'visitor' : 'student', state: 'settled' });
      const rows = [];
      for (const size of WANT_SIZES.filter((s) => s.id === '390x664' || s.id === '1280x800')) {
        const where = { route: view === 'landing' ? '/ (landing)' : path, view, state: 'settled', size: size.id, scheme: 'light', build: 'build', probe: true };
        let found;
        // The header, rail and bottom bar are pressed once, on the about page.
        try {
          found = await probeControls(page, context, { path, size, log, net, where });
          if (path === '/app/about') found.push(...await probeControls(page, context, { path, size, log, net, where, chrome: true }));
        } catch (error) {
          found = [{ detector: 'console', detail: `the control probe could not finish: ${String(error).split('\n')[0].slice(0, 160)}`, a: { sig: 'sweep', text: '', rect: null }, unreached: true }];
        }
        // Pictures of dead controls are taken on a fresh load of the screen.
        await visit(page, path).catch(() => {});
        await watch(page, { ms: 8_000 }).catch(() => {});
        rows.push(...await record(page, `${path}|controls|${size.id}`, found, where));
      }
      net.release();
      D.writeFindings(`probe|${path}|${view}`, rows);
    });
  }
}

// ---------------------------------------------------------------------------------------------
// The main flows, each step looked at with the same detectors.
let typedSetOnce;
function typedSet() {
  typedSetOnce ??= loadQB().then(() => {
    const ids = [70001, 2123, 3, 53001, 202462, 51020, 51032, 821, 202274];
    return ids.map((id) => QB.find((q) => q.id === id)).filter(Boolean);
  });
  return typedSetOnce;
}
const kindOf = (q) => `${q.type || 'mcq'}${q.passage ? '+passage' : ''}${q.image || q.imagePath ? '+figure' : ''}${/\n\|/.test(q.passage || '') ? '+table' : ''}`;

function parkSet({ key, uid, questions, mode, timed }) {
  if (sessionStorage.getItem('__defect-seed')) return;
  sessionStorage.setItem('__defect-seed', '1');
  const now = Date.now();
  localStorage.setItem(key, JSON.stringify({
    ownerId: uid, questions, answers: {}, currentIdx: 0, useTimer: timed, timePerQ: 60, mode, submitted: false,
    selectedYear: 5, savedAt: now, examStartTime: now - 30_000, ...(timed ? { questionDeadline: now + 3_600_000, clock: 'session' } : {}),
  }));
}

async function answerCurrent(page) {
  const card = page.locator('.vmx-question-card').first();
  const opt = card.locator('.vmx-options button').first();
  if (await opt.count()) { await opt.click({ timeout: 3_000 }).catch(() => {}); }
  const tf = card.locator('.vmx-tf-btn');
  const rows = await tf.count();
  if (rows) for (let i = 0; i < rows; i += 2) await tf.nth(i).click({ timeout: 2_000 }).catch(() => {});
  const fills = card.locator('.vmx-fill-input');
  for (let i = 0; i < await fills.count(); i += 1) await fills.nth(i).fill('ทดสอบ').catch(() => {});
  const selects = card.locator('select');
  for (let i = 0; i < await selects.count(); i += 1) await selects.nth(i).selectOption({ index: 1 }).catch(() => {});
  const area = card.locator('textarea').first();
  if (await area.count()) await area.fill('คำตอบทดสอบของนักศึกษา ใช้ดูหน้าจอเท่านั้น').catch(() => {});
}

// A 1.5 MB deck sent at about 200 KB a second, with its length, from a port of its own.
async function slowDeckServer() {
  const { createServer } = await import('node:http');
  const head = pdf(3).toString('latin1').replace('trailer', `%${'x'.repeat(1_500_000)}
trailer`);
  const body = Buffer.from(head, 'latin1');
  const server = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/pdf', 'content-length': body.length, 'access-control-allow-origin': '*', 'access-control-expose-headers': 'content-length' });
    let at = 0;
    const timer = setInterval(() => {
      if (at >= body.length || res.destroyed) { clearInterval(timer); res.end(); return; }
      res.write(body.subarray(at, at + 20_000)); at += 20_000;
    }, 100);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${server.address().port}/deck.pdf`, close: () => server.close() };
}

const FLOWS = {
  // Topic to result through the real screens, then one question of each type the bank has, parked and resumed.
  async practice(page, step) {
    await visit(page, '/app/study');
    await step('subject list');
    // A subject whose topics hold questions (the first card can be one with notes only).
    await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สัตว์ปีก' }).first().click({ timeout: 20_000 });
    await step('topic list');
    await page.getByRole('button', { name: /ฝึกข้อสอบ/ }).first().click({ timeout: 20_000 });
    await step('practice setup');
    await page.getByRole('button', { name: /เริ่มฝึก/ }).first().click({ timeout: 20_000 });
    await step('first question');
  },
  'typed set': async (page, step, ctx) => {
    await ctx.park('quick', false);
    await visit(page, '/app');
    await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click({ timeout: 20_000 });
    for (const q of ctx.questions) {
      await step(`question ${kindOf(q)}`);
      await answerCurrent(page);
      const check = page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true });
      if (await check.isVisible().catch(() => false) && await check.isEnabled().catch(() => false)) {
        await check.click().catch(() => {});
        await step(`answered ${kindOf(q)}`);
      }
      const next = page.getByRole('button', { name: /ข้อถัดไป|ดูผลลัพธ์|ส่งข้อสอบ/ }).filter({ visible: true }).last();
      await next.click({ timeout: 5_000 }).catch(() => {});
      const dialog = page.getByRole('dialog').filter({ visible: true });
      if (await dialog.count().catch(() => 0)) { await step('submit dialog'); await dialog.getByRole('button').filter({ hasNotText: /ยกเลิก|กลับ|ทำต่อ/ }).last().click().catch(() => {}); }
    }
    await step('results');
  },
  'timed exam': async (page, step, ctx) => {
    await ctx.park('exam', true);
    await visit(page, '/app');
    await page.getByRole('button', { name: /ทำต่อจากครั้งล่าสุด/ }).click({ timeout: 20_000 });
    for (const q of ctx.questions) {
      await step(`exam question ${kindOf(q)}`);
      await answerCurrent(page);
      const next = page.getByRole('button', { name: /ข้อถัดไป|ส่งข้อสอบ/ }).filter({ visible: true }).last();
      await next.click({ timeout: 5_000 }).catch(() => {});
    }
    const dialog = page.getByRole('dialog').filter({ visible: true });
    await dialog.first().waitFor({ timeout: 5_000 }).catch(() => {});
    if (await dialog.count().catch(() => 0)) { await step('submit dialog'); await dialog.getByRole('button').filter({ hasNotText: /ยกเลิก|กลับ|ทำต่อ/ }).last().click().catch(() => {}); }
    await step('exam results');
  },
  async review(page, step) {
    await visit(page, '/app/review');
    await step('review planner');
    await page.getByRole('button', { name: 'เริ่มทบทวน', exact: true }).click({ timeout: 20_000 });
    await step('review card');
    await page.getByRole('button', { name: /แสดงคำตอบ/ }).first().click({ timeout: 10_000 });
    await step('review answer');
  },
  async library(page, step, ctx) {
    await visit(page, '/app/library?q=VCA%20Pharmacology');
    await step('library shelf');
    // The deck comes from a server that sends it slowly, with its length, as a large deck arrives on a
    // phone: the reader shows its download progress, the screen where the mascot once sat on the title.
    const server = await slowDeckServer();
    ctx.net.deckUrl = server.url;
    try {
      const card = page.locator('.vmx-lib-card').first();
      await card.getByRole('button', { name: 'เปิดอ่าน', exact: true }).click({ timeout: 20_000 });
      await page.waitForTimeout(2500);
      await step('document loading', { state: 'loading', wait: false });
      await page.waitForTimeout(2500);
      await step('document loading, later', { state: 'loading', wait: false });
      await page.locator('[data-page="1"][data-render-state="ready"]').waitFor({ timeout: 40_000 }).catch(() => {});
      await step('document open');
    } finally {
      server.close();
    }
  },
  async notes(page, step) {
    await visit(page, '/app/study');
    await page.locator('.vmx-subject-card', { hasText: 'ระบาดวิทยา' }).first().click({ timeout: 20_000 });
    await step('topics with notes');
    await page.locator('.vmx-topic-card').getByRole('button', { name: 'สรุป', exact: true }).first().click({ timeout: 20_000 });
    await step('subject notes');
  },
  async 'wrap-up'(page, step) {
    await visit(page, '/app');
    await page.locator('.vmx-subject-card', { hasText: 'อายุรศาสตร์สุกร' }).first().click({ timeout: 20_000 });
    await page.locator('.vmx-wrap-entry-btn').first().click({ timeout: 20_000 });
    await page.locator('.vmx-wrap-item').first().waitFor({ timeout: 20_000 });
    await step('wrap-up page');
  },
  async profile(page, step) {
    await visit(page, '/app');
    await page.getByRole('button', { name: 'โปรไฟล์', exact: true }).filter({ visible: true }).first().click({ timeout: 20_000 });
    await step('profile hub');
    const edit = page.getByRole('button', { name: /แก้ไข|เปลี่ยนชื่อ|ตั้งชื่อ/ }).filter({ visible: true }).first();
    await edit.click({ timeout: 10_000 });
    await step('profile editor');
  },
  async 'groups and race'(page, step) {
    await visit(page, '/app/groups');
    await step('groups');
    const create = page.getByRole('button', { name: /สร้างกลุ่ม/ }).filter({ visible: true }).first();
    if (await create.count()) { await create.click().catch(() => {}); await step('create group'); }
    await visit(page, '/app/race');
    await step('race');
  },
  async search(page, step) {
    await visit(page, '/app/about');
    await page.getByRole('button', { name: /^ค้นหา/ }).filter({ visible: true }).first().click({ timeout: 20_000 });
    await step('search open');
    await page.getByRole('combobox', { name: 'ค้นหาใน VetMock' }).fill('parvovirus');
    await page.waitForTimeout(1500);
    await step('search results');
  },
};

const FLOW_COMBOS = [
  { size: D.SIZES[0], scheme: 'light' },
  { size: D.SIZES[0], scheme: 'dark' },
  { size: D.SIZES[3], scheme: 'light' },
].filter((c) => WANT_SIZES.includes(c.size) && WANT_SCHEMES.includes(c.scheme));

if (PARTS.includes('flows')) {
  for (const [name, flow] of Object.entries(FLOWS)) {
    if (ONLY && !name.includes(ONLY)) continue;
    for (const { size, scheme } of FLOW_COMBOS) {
      test(`flow ${name} ${size.id} ${scheme}`, async ({ page, context, baseURL }) => {
        test.setTimeout(600_000);
        await page.emulateMedia({ colorScheme: scheme });
        await page.setViewportSize({ width: size.width, height: size.height });
        const { net, log } = await prepare(page, context, baseURL, { persona: 'student', state: 'settled' });
        const questions = await typedSet();
        const ctx = {
          net, questions,
          park: (mode, timed) => context.addInitScript(parkSet, { key: `vmx-inflight-exam:user:${UID}`, uid: UID, questions, mode, timed }),
        };
        const rows = [];
        const unreached = [];
        let n = 0;
        const step = async (label, { state = 'settled', wait = true } = {}) => {
          n += 1;
          if (wait) {
            const w = await watch(page, { ms: D.STUCK_MS });
            if (!w.settled) rows.push(...await record(page, name, [{ detector: 'stuck', detail: `still loading after ${D.STUCK_MS / 1000} s at "${label}"`, a: { sig: (w.read.what || [])[0] || 'main', text: '', rect: null } }], { route: `flow: ${name}`, step: label, view: name, state, size: size.id, scheme, build: DEV ? 'dev' : 'build' }));
            await page.waitForTimeout(600);
          }
          const found = await look(page, { size });
          const mainText = await page.evaluate(() => (document.querySelector('#main') || document.body).innerText || '').catch(() => '');
          found.push(...consoleFindings(log, net, state, mainText));
          // One picture of the whole view per step, for reading the findings against.
          mkdirSync(path.join(D.OUT_DIR, 'steps'), { recursive: true });
          await page.screenshot({ path: path.join(D.OUT_DIR, 'steps', `${name.replace(/\W+/g, '-')}-${size.id}-${scheme}-${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 55, animations: 'disabled', timeout: 8_000 }).catch(() => {});
          rows.push(...await record(page, name, found, { route: `flow: ${name}`, step: `${String(n).padStart(2, '0')} ${label}`, view: name, state, size: size.id, scheme, build: DEV ? 'dev' : 'build' }));
        };
        try {
          await flow(page, step, ctx);
        } catch (error) {
          unreached.push({ flow: name, after: n, error: String(error).split('\n')[0].slice(0, 200) });
        }
        const shifts = await page.evaluate(() => (window.__vmxDefects ? window.__vmxDefects.shifts.splice(0) : [])).catch(() => []);
        void shifts; // a flow is driven by presses, so its layout shifts are not "with nobody touching the page"
        net.release();
        if (net.releaseDocument) net.releaseDocument();
        D.writeFindings(`flow|${name}|${size.id}|${scheme}|${DEV ? 'dev' : 'build'}`, rows.map((r) => r));
        if (unreached.length) D.writeFindings(`unreached|${name}|${size.id}|${scheme}|${DEV ? 'dev' : 'build'}`, unreached.map((u) => ({ ...u, detector: 'unreached', size: size.id, scheme })));
      });
    }
  }
}
