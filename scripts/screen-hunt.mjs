#!/usr/bin/env node
// npm run hunt:screens [-- --out=<dir>] [--only=<substring>] [--combos=phone-light,desktop-dark]
//
// Report-only: walks the built app (`npm run build` first) and writes what looks or behaves wrong on
// each screen. It never fails on a finding, so it gates nothing; the route sweep
// (tests/e2e/route-sweep.spec.js) is the gate, and a finding here becomes a fix with its own guard.
//
// It reads more than the sweep does, at two widths (phone 390 and desktop 1280) and in both colour
// schemes, as a year-5 student on today's real calendar (the sweep pins 25 Sep):
//   placeholder  "รอเติม", "undefined", "null", "NaN", "TODO", "Lorem", "[object Object]", a bare N for a count
//   middot       a middle dot drawn as a separator (AGENTS.md rule 11)
//   comma        a comma set off by a space from the word before it ("0:06 , เฉลี่ย")
//   thai-small   Thai text drawn under 14 px (AGENTS.md, "UI and study flow")
//   ua-font      a control left at the browser's default font (13.333 px, not the app's typeface)
//   tap-small    a control smaller than 44 x 44 px (inline links inside a sentence are left out)
//   image        a picture that failed to load
//   clipped      text cut by its own box, or pushed past the screen's edge with no way to scroll to it
//   contrast     text under a 3:1 contrast against its nearest solid background (approximate)
//   overflow     the page scrolls sideways
//   console      a console error, a page error or an unhandled rejection
//   request      a failed same-origin request
// Beyond the routes it opens one subject of each year into its topic list, a notes reader, a wrap-up
// (when today has one), a practice set through to its results, the wiki and an article, the profile hub.
//
// Output: <out>/findings.json, <out>/summary.md and a picture per screen in <out>/shots/.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from '@playwright/test';
import { APP_VIEW_ROUTES } from '../src/lib/view-route.js';
import { QB, loadQB } from '../src/data/questions.js';
import { isQuestionDeliverable } from '../src/data/question-delivery.generated.js';
import { PORTS } from '../tests/e2e/local-port.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => process.argv.slice(2).find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=') ?? fallback;
const OUT = path.resolve(arg('out', path.join(ROOT, 'test-results', 'screen-hunt')));
const ONLY = arg('only', '');
const PORT = PORTS.local + 3000;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const ALL_COMBOS = [
  { id: 'phone-light', vp: 'phone', scheme: 'light' },
  { id: 'phone-dark', vp: 'phone', scheme: 'dark' },
  { id: 'desktop-light', vp: 'desktop', scheme: 'light' },
  { id: 'desktop-dark', vp: 'desktop', scheme: 'dark' },
];
const COMBOS = ALL_COMBOS.filter((c) => !arg('combos') || arg('combos').split(',').includes(c.id));
mkdirSync(path.join(OUT, 'shots'), { recursive: true });

// ---------- the page-side audit (runs in the browser; no closures) ----------
function audit() {
  const vw = document.documentElement.clientWidth;
  const THAI = /[฀-๿]/;
  const describe = (el) => {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 50);
    return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}${text ? ` "${text}"` : ''}`;
  };
  const shown = (el) => {
    if (!el.checkVisibility || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    if (r.right <= 0 || r.left >= vw) return false; // moved off screen on purpose (a skip link until focused)
    if (el.closest('[inert], [aria-hidden="true"]')) return false;
    return true;
  };
  const ownText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const out = [];
  const push = (kind, detail, examples = []) => out.push({ kind, detail, examples: examples.slice(0, 8), count: examples.length || 1 });

  // placeholder words and middle dots, in what a reader sees
  const text = document.body.innerText || '';
  const ctx = (i, len) => text.slice(Math.max(0, i - 40), i + len + 40).replace(/\s+/g, ' ');
  const placeholders = [];
  for (const m of text.matchAll(/รอเติม|\bTODO\b|\bFIXME\b|Lorem ipsum|\[object Object\]|(?<![\w.-])(?:undefined|NaN|null)(?![\w-])|\{\{|(?:^|[\s(])N(?=\s?(?:ข้อ|คน|หัวข้อ|วัน|ครั้ง|นาที|ชั่วโมง|เรื่อง|ชุด|บท)(?![฀-๿]))/g)) {
    placeholders.push(`${m[0].trim()} in "${ctx(m.index, m[0].length)}"`);
  }
  if (placeholders.length) push('placeholder', `${placeholders.length} placeholder word(s)`, [...new Set(placeholders)]);
  const dots = [];
  for (const m of text.matchAll(/[·∙・]/g)) dots.push(`"${ctx(m.index, 1)}"`);
  if (dots.length) push('middot', `${dots.length} middle dot(s)`, [...new Set(dots)]);
  const commas = [];
  for (const m of text.matchAll(/[^\s,] +,/g)) commas.push(`"${ctx(m.index, m[0].length)}"`);
  // A comma in a node of its own, drawn apart from the glyph before it on the same line (a flex gap or
  // a margin leaves no space character for the text scan to read).
  {
    const nodes = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) if (n.textContent.trim() && n.parentElement && shown(n.parentElement)) nodes.push(n);
    const glyph = (node, at) => { const r = document.createRange(); r.setStart(node, at); r.setEnd(node, at + 1); return r.getBoundingClientRect(); };
    for (let i = 1; i < nodes.length; i += 1) {
      const n = nodes[i];
      const at = n.textContent.search(/\S/);
      if (n.textContent[at] !== ',') continue;
      const p = nodes[i - 1];
      const end = p.textContent.search(/\s*$/) - 1;
      if (end < 0) continue;
      const a = glyph(p, end);
      const b = glyph(n, at);
      if (Math.abs(a.top - b.top) < 4 && b.left - a.right > 3) commas.push(`${Math.round(b.left - a.right)}px gap: "${p.textContent.trim().slice(-20)}" then "${n.textContent.trim().slice(0, 20)}"`);
    }
  }
  if (commas.length) push('comma', `${commas.length} comma(s) set off from the word before`, [...new Set(commas)]);

  // Thai under 14 px
  const small = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!THAI.test(n.textContent)) continue;
    const el = n.parentElement;
    if (!el || !shown(el)) continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 13.95) small.set(el, size);
  }
  if (small.size) push('thai-small', `${small.size} Thai text box(es) under 14 px`, [...small].map(([el, s]) => `${s}px ${describe(el)}`));

  // controls left at the browser's own typeface (no `font: inherit` and no family of their own): their
  // Thai is shaped in the system font, not the app's
  const appFont = getComputedStyle(document.body).fontFamily;
  const uaFont = [...document.querySelectorAll('button, input, select, textarea')]
    .filter((el) => shown(el) && !/Sarabun|Plex|Lato|mono/i.test(getComputedStyle(el).fontFamily) && getComputedStyle(el).fontFamily !== appFont)
    .map((el) => `${getComputedStyle(el).fontFamily.slice(0, 30)} ${parseFloat(getComputedStyle(el).fontSize)}px ${describe(el)}`);
  if (uaFont.length) push('ua-font', `${uaFont.length} control(s) in the browser's default font`, uaFont);

  // tap targets
  const tiny = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], [role="tab"], [role="link"], [role="checkbox"], [role="switch"], [role="menuitem"], [role="radio"], input:not([type="hidden"]), select, textarea, summary')) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);
    if (el.tagName === 'A' && cs.display === 'inline') {
      const parentText = (el.parentElement?.innerText || '').trim();
      if (parentText.length > (el.innerText || '').trim().length + 3) continue; // a link inside a sentence
    }
    let r = el.getBoundingClientRect();
    if ((el.type === 'checkbox' || el.type === 'radio') && el.closest('label')) r = el.closest('label').getBoundingClientRect();
    if (r.width < 44 || r.height < 44) tiny.push(`${Math.round(r.width)}x${Math.round(r.height)} ${describe(el)}`);
  }
  if (tiny.length) push('tap-small', `${tiny.length} control(s) under 44 px`, tiny);

  // pictures that failed
  const broken = [...document.images].filter((img) => (img.currentSrc || img.getAttribute('src')) && img.complete && img.naturalWidth === 0)
    .map((img) => `${img.currentSrc || img.getAttribute('src')} ${describe(img)}`);
  if (broken.length) push('image', `${broken.length} picture(s) failed to load`, broken);

  // clipped text
  const scrollsX = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if ((o === 'auto' || o === 'scroll') && a.scrollWidth > a.clientWidth + 1) return true; } return false; };
  const clipped = [];
  const lowContrast = [];
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => {
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      if (cs.filter !== 'none' || cs.mixBlendMode !== 'normal') return null;
      const c = parse(cs.backgroundColor);
      if (c && c.a >= 0.85) return c;
      if (c && c.a > 0.05) return null; // translucent layer over something unknown
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  for (const el of document.body.querySelectorAll('*')) {
    if (!ownText(el) || !shown(el)) continue;
    if (el.closest('svg, canvas, video, [contenteditable="true"], .vmx-skip-link')) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if ((cs.overflowX === 'hidden' || cs.overflowX === 'clip') && el.scrollWidth > el.clientWidth + 1 && cs.textOverflow !== 'ellipsis') {
      clipped.push(`cut sideways by ${el.scrollWidth - el.clientWidth}px: ${describe(el)}`);
    } else if ((cs.overflowY === 'hidden' || cs.overflowY === 'clip') && el.scrollHeight > el.clientHeight + 2 && cs.webkitLineClamp === 'none' && cs.position !== 'absolute') {
      clipped.push(`cut at the bottom by ${el.scrollHeight - el.clientHeight}px: ${describe(el)}`);
    } else if ((r.right > vw + 1 || r.left < -1) && cs.position !== 'fixed' && !scrollsX(el)) {
      clipped.push(`past the screen edge (${Math.round(r.left)}..${Math.round(r.right)} of ${vw}): ${describe(el)}`);
    }
    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (fg && bg && fg.a >= 0.6 && parseFloat(cs.opacity) === 1) {
      const mix = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
      const [hi, lo] = [lum(mix), lum(bg)].sort((x, y) => y - x);
      const ratio = (hi + 0.05) / (lo + 0.05);
      if (ratio < 3) lowContrast.push(`${ratio.toFixed(2)}:1 ${describe(el)}`);
    }
  }
  if (clipped.length) push('clipped', `${clipped.length} text box(es) clipped`, clipped);
  if (lowContrast.length) push('contrast', `${lowContrast.length} text box(es) under 3:1`, lowContrast);

  const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth;
  if (over > 1) push('overflow', `the page scrolls ${over}px sideways`);
  return out;
}

function readyState() {
  const main = document.querySelector('#main') || document.querySelector('main');
  const loading = !!main && (!!main.querySelector('.vmx-view-fallback')
    || [...main.querySelectorAll('[aria-busy="true"]')].some((el) => /กำลังโหลด/.test(el.textContent || '')));
  return { ok: !!main && !loading && (main.innerText || '').trim().length > 0, view: document.querySelector('#main')?.getAttribute('data-view') || (document.querySelector('.lp-root') ? 'landing' : null) };
}

// ---------- the browser side ----------
const isNoise = (t) => /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|_vercel\/(insights|speed-insights)|Unrecognized feature|downloadable font|__cf_bm|rejected for invalid domain/i.test(t);
const findings = [];
const screens = [];

async function newContext(browser, combo, seed) {
  const base = combo.vp === 'phone' ? { ...devices['iPhone 13'], deviceScaleFactor: 2 } : { viewport: { width: 1280, height: 800 } };
  const context = await browser.newContext({ ...base, colorScheme: combo.scheme, timezoneId: 'Asia/Bangkok', serviceWorkers: 'block', locale: 'th-TH' });
  await context.addInitScript(() => {
    window.addEventListener('unhandledrejection', (e) => console.error(`unhandledrejection: ${e.reason && e.reason.stack ? e.reason.stack.split(String.fromCharCode(10))[0] : String(e.reason)}`));
  });
  if (seed) await context.addInitScript(seed.fn, seed.arg);
  await context.route((url) => url.origin !== ORIGIN, (route) => route.abort());
  await context.route((url) => url.pathname.startsWith('/api/'), (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable_in_test"}' }));
  const page = await context.newPage();
  const live = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const t = msg.text();
    const url = msg.location?.().url || '';
    if (/^Failed to load resource/i.test(t) || isNoise(`${t} ${url}`)) return;
    if (url && !url.startsWith(ORIGIN) && !/^unhandledrejection/.test(t)) return;
    live.push({ kind: 'console', detail: t.slice(0, 240) });
  });
  page.on('pageerror', (e) => { if (!isNoise(e.message)) live.push({ kind: 'console', detail: `pageerror: ${e.message.slice(0, 240)}` }); });
  page.on('response', (res) => {
    const url = res.url();
    if (!url.startsWith(ORIGIN) || url.includes('/api/') || url.includes('/_vercel/')) return;
    if (res.status() >= 400) live.push({ kind: 'request', detail: `${new URL(url).pathname} ${res.status()}` });
    else if (['script', 'stylesheet', 'image', 'font'].includes(res.request().resourceType()) && (res.headers()['content-type'] || '').includes('text/html')) live.push({ kind: 'request', detail: `${new URL(url).pathname} answered with a page` });
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    const why = req.failure()?.errorText || '';
    if (!url.startsWith(ORIGIN) || url.includes('/api/') || /ERR_ABORTED|cancelled/i.test(why)) return;
    live.push({ kind: 'request', detail: `${new URL(url).pathname} ${why}` });
  });
  return { context, page, live };
}

async function settle(page) {
  const started = Date.now();
  const deadline = started + 40_000;
  let s = await page.evaluate(readyState).catch(() => ({}));
  while (!s.ok && Date.now() < deadline) { await page.waitForTimeout(250); s = await page.evaluate(readyState).catch(() => ({})); }
  const ms = Date.now() - started;
  await page.waitForTimeout(600);
  return { ...(await page.evaluate(readyState).catch(() => ({}))), ms };
}

async function record(ctx, combo, name) {
  if (ONLY && !name.includes(ONLY)) return;
  const { page, live } = ctx;
  const state = await settle(page);
  // Walk down the page once so lazy pictures and sections load, then come back up.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  }).catch(() => {});
  await page.waitForTimeout(500);
  const found = await page.evaluate(audit).catch((e) => [{ kind: 'audit', detail: String(e).slice(0, 200), examples: [], count: 1 }]);
  for (const l of live.splice(0)) found.push({ ...l, examples: [], count: 1 });
  const file = `${name.replace(/[^\w.-]+/g, '_')}__${combo.id}.png`;
  await page.screenshot({ path: path.join(OUT, 'shots', file), fullPage: combo.id === 'phone-light' }).catch(() => {});
  screens.push({ screen: name, combo: combo.id, view: state.view || null, ready: !!state.ok, ms: state.ms, findings: found.length, url: page.url().replace(ORIGIN, '') });
  if (!state.ok) found.push({ kind: 'not-ready', detail: `still loading or empty after 40 s (view ${state.view})`, examples: [], count: 1 });
  for (const f of found) findings.push({ screen: name, combo: combo.id, shot: `shots/${file}`, ...f });
  process.stdout.write(`${combo.id} ${name}: ${found.map((f) => f.kind).join(', ') || 'clean'}\n`);
}

async function go(page, url) {
  for (let i = 0; i < 3; i += 1) {
    try { await page.goto(`${ORIGIN}${url}`, { waitUntil: 'domcontentloaded', timeout: 30_000 }); return; } catch (e) { if (i === 2) throw e; await page.waitForTimeout(300); }
  }
}

const tryStep = async (label, fn) => { try { await fn(); return true; } catch (e) { process.stdout.write(`  (skipped ${label}: ${String(e.message || e).split('\n')[0].slice(0, 140)})\n`); return false; } };

function seedStudent({ now, studied, year }) {
  try {
    const day = 86_400_000;
    localStorage.setItem('vmx-selected-year', String(year));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    localStorage.setItem('vmx-history', JSON.stringify(studied.map((q, i) => ({ date: now - i * 3_600_000, questionId: q.id, subject: q.subject, year: 5, correct: i % 3 !== 0 }))));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(Object.fromEntries(studied.slice(0, 3).map(({ id }) => [id, { questionId: id, easeFactor: 2.5, interval: 1, repetitions: 1, lapses: 0, totalReviews: 1, lastReview: now - 3 * day, nextReview: now - day }]))));
    localStorage.setItem('vmx-bookmarks', JSON.stringify([studied[0].id]));
    localStorage.setItem('vmx-streak', JSON.stringify({ streak: 3, lastDate: now - day, freezeUsedAt: null }));
  } catch { /* storage refused */ }
}

async function answerCurrent(page) {
  const mcq = page.locator('.vmx-option:visible').first();
  if (await mcq.isVisible().catch(() => false)) return mcq.click();
  const tf = page.getByRole('group', { name: /True.*False|ตัวเลือก.*True/i }).getByRole('button').first();
  if (await tf.isVisible().catch(() => false)) return tf.click();
  const blanks = page.locator('.vmx-fill-input:visible');
  if (await blanks.count()) { for (const b of await blanks.all()) await b.fill('ทดสอบ'); return undefined; }
  const writing = page.locator('.vmx-question-card textarea:visible').first();
  if (await writing.isVisible().catch(() => false)) return writing.fill('คำตอบทดสอบ');
  return undefined;
}

async function runCombo(browser, combo, studied) {
  const now = Date.now();
  const student = (year = 5) => ({ fn: seedStudent, arg: { now, studied, year } });

  // 1. every route, as a year-5 student
  const s = await newContext(browser, combo, student(5));
  const routes = [...Object.entries(APP_VIEW_ROUTES).map(([v, p]) => [`route ${p}`, p, v]), ['route /wiki', '/wiki'], ['wiki article', '/wiki/com5/rabies'], ['route /#lab', '/#lab']];
  for (const [name, url] of routes) {
    if (ONLY && !name.includes(ONLY)) continue;
    await go(s.page, url);
    await record(s, combo, name);
  }

  // 2. Home's deeper screens: profile hub, wrap-up, a practice set to its results
  if (!ONLY || /profile|wrap|practice|results|config|question/.test(ONLY)) {
    await go(s.page, '/');
    await settle(s.page);
    if (await tryStep('profile hub', async () => {
      await s.page.getByRole('button', { name: 'โปรไฟล์', exact: true }).first().click({ timeout: 8_000 });
      await s.page.waitForTimeout(400);
    })) await record(s, combo, 'profile hub');

    await go(s.page, '/');
    await settle(s.page);
    if (await tryStep('wrap-up', async () => {
      await s.page.locator('.vmx-wrap-strip-btn').first().click({ timeout: 8_000 });
    })) await record(s, combo, 'wrap-up');

    await go(s.page, '/');
    await settle(s.page);
    const ok = await tryStep('practice config', async () => {
      const modes = s.page.getByRole('button', { name: 'โหมดอื่น', exact: true });
      if ((await modes.getAttribute('aria-expanded', { timeout: 8_000 })) !== 'true') await modes.click();
      await s.page.getByRole('button', { name: /ฝึกแบบเลือกจำนวน/ }).first().click({ timeout: 8_000 });
      await s.page.getByRole('heading', { level: 1, name: /ตั้งค่า.*การฝึก/ }).waitFor({ timeout: 15_000 });
    });
    if (ok) {
      await record(s, combo, 'practice config');
      if (await tryStep('practice question', async () => {
        const adjust = s.page.getByRole('button', { name: 'ปรับเอง', exact: true });
        if ((await adjust.getAttribute('aria-expanded', { timeout: 8_000 })) !== 'true') await adjust.click();
        await s.page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('2');
        await s.page.getByRole('button', { name: /เริ่มฝึก/ }).first().click();
        await s.page.locator('.vmx-question-card').waitFor({ timeout: 30_000 });
      })) {
        await record(s, combo, 'practice question');
        await tryStep('answer', () => answerCurrent(s.page));
        await s.page.waitForTimeout(500);
        await record(s, combo, 'practice answered');
        if (await tryStep('results', async () => {
          await s.page.getByRole('button', { name: 'ข้อถัดไป →', exact: true }).click({ timeout: 8_000 });
          await answerCurrent(s.page);
          await s.page.waitForTimeout(300);
          const done = s.page.getByRole('button', { name: /ดูผลลัพธ์ →|ส่งข้อสอบ ✓/ }).first();
          await done.click({ timeout: 8_000 });
          const confirm = s.page.getByRole('button', { name: 'ส่งข้อสอบ', exact: true });
          if (await confirm.isVisible({ timeout: 1_500 }).catch(() => false)) await confirm.click();
          await s.page.getByText(/คะแนนตรวจอัตโนมัติ|ฝึกข้อเขียนเสร็จแล้ว|Auto-graded Score/).first().waitFor({ timeout: 20_000 });
        })) await record(s, combo, 'practice results');
      }
    }
  }
  await s.context.close();

  // 3. one subject of each year into its topic list, and one notes reader
  for (const year of [1, 2, 3, 4, 5, 6]) {
    const name = `year ${year} topic list`;
    if (ONLY && !name.includes(ONLY) && !(year === 3 && 'notes reader'.includes(ONLY))) continue;
    const y = await newContext(browser, combo, student(year));
    // The first cards are "every subject" and the VCA compilation, which go straight to a set, and a course with
    // nothing in it yet does not open: take the first course that has content.
    const courses = y.page.locator('.vmx-subject-card').filter({ hasNotText: /รวมทุกวิชา|VCA|ยังไม่มีเนื้อหา/ });
    const openCourse = async (i) => {
      await go(y.page, '/app/study');
      const card = courses.nth(i);
      await card.waitFor({ timeout: 20_000 });
      // A pointer click can be refused while something floats over the card; the hunt reads screens, so
      // it presses the card the way a keyboard does when the pointer cannot reach it.
      await card.click({ timeout: 5_000 }).catch(() => card.evaluate((el) => el.click()));
      await y.page.locator('.vmx-topic-card, .vmx-mode-card').first().waitFor({ timeout: 20_000 });
    };
    if (await tryStep(name, () => openCourse(0))) {
      await record(y, combo, name);
      // A wrap-up, opened from the first year-5 course that has one.
      if (year === 5) {
        for (let i = 0; i < 12; i += 1) {
          if (i > 0 && !(await tryStep(`course ${i}`, () => openCourse(i)))) break;
          const wrap = y.page.locator('.vmx-wrap-entry-btn').first();
          if (await wrap.isVisible().catch(() => false)) {
            await wrap.click();
            await record(y, combo, 'wrap-up');
            break;
          }
        }
        await openCourse(0).catch(() => {});
      }
      const notes = y.page.locator('.vmx-topic-card').filter({ has: y.page.getByRole('button', { name: 'สรุป', exact: true }) }).first();
      if (await notes.isVisible().catch(() => false) && !screens.some((x) => x.screen === 'notes reader' && x.combo === combo.id)) {
        if (await tryStep('notes reader', async () => {
          await notes.getByRole('button', { name: 'สรุป', exact: true }).click();
          await y.page.locator('.vmx-notes-grid').first().waitFor({ timeout: 20_000 });
        })) await record(y, combo, `notes reader`);
      }
    } else {
      // No course opened: keep a picture of the subject list as the student saw it.
      await go(y.page, '/app/study');
      await record(y, combo, `year ${year} subject list (no course opened)`);
    }
    await y.context.close();
  }

  // 4. the first-time visitor's front door
  const v = await newContext(browser, combo, null);
  await go(v.page, '/');
  await record(v, combo, 'landing (visitor)');
  await v.context.close();
}

async function waitForServer() {
  for (let i = 0; i < 120; i += 1) {
    try { const r = await fetch(ORIGIN); if (r.ok) return; } catch { /* not yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`preview server never answered on ${ORIGIN}`);
}

await loadQB();
const studied = QB.filter((q) => q.year === 5 && isQuestionDeliverable(q) && (q.type === 'mcq' || q.type === 'tf')).slice(0, 12).map((q) => ({ id: q.id, subject: q.subject }));
const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], { cwd: ROOT, shell: process.platform === 'win32', stdio: 'ignore' });
let code = 0;
try {
  await waitForServer();
  const browser = await chromium.launch();
  await Promise.all(COMBOS.map((c) => runCombo(browser, c, studied).catch((e) => { code = 1; console.error(`${c.id} stopped: ${e.stack || e}`); })));
  await browser.close();
} finally {
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
  else server.kill();
}

writeFileSync(path.join(OUT, 'findings.json'), `${JSON.stringify({ at: new Date().toISOString(), screens, findings }, null, 2)}\n`);
const byKind = {};
for (const f of findings) (byKind[f.kind] ||= new Map()).set(f.screen, [...(byKind[f.kind].get(f.screen) || []), f.combo]);
const lines = ['# Screen hunt', '', `${screens.length} screen visits, ${findings.length} findings, ${new Date().toISOString()}`, ''];
for (const [kind, m] of Object.entries(byKind).sort()) {
  lines.push(`## ${kind} (${m.size} screens)`, '');
  for (const [screen, combos] of m) lines.push(`- ${screen}: ${combos.join(', ')}`);
  lines.push('');
}
writeFileSync(path.join(OUT, 'summary.md'), `${lines.join('\n')}\n`);
console.log(`\n${screens.length} visits, ${findings.length} findings -> ${OUT}`);
process.exit(code);
