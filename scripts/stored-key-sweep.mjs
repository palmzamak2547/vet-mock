// Stored-key sweep: every localStorage key the code names, set in turn to a
// JSON null, to the text "undefined" and to a cut-off JSON string, loaded on
// Home and on each screen whose view reads the key. A load breaks when it
// throws a page error the clean load does not, shows the error card
// ("หน้านี้ขัดข้อง") or leaves #main empty. Run it against a built preview
// before a release:
//   npm run build && npx vite preview --host 127.0.0.1 --port 4342 --strictPort
//   node scripts/stored-key-sweep.mjs http://127.0.0.1:4342 [concurrency] [key-substring]
// First run 11 Nov 2026: 109 keys, 366 loads; on main one break
// (vmx-quests-streak = null, Home), none after the fixes. Network beyond the
// preview is blocked and /api answers 503, so it needs no account.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://127.0.0.1:4342';
const conc = Number(process.argv[3] || 3);
const only = process.argv[4] || '';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'src');

// Seeded so /app opens at all; not swept.
const SEED = { 'vmx-seen-landing': '1', 'vmx-selected-year': '5', 'vmx-consent': '"essential"', 'vmx-theme': '"light"' };
const walk = (d) => fs.readdirSync(d).flatMap((n) => {
  const p = path.join(d, n);
  return fs.statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(n) ? [p] : [];
});
const app = fs.readFileSync(path.join(SRC, 'App.jsx'), 'utf8');
const route = Object.fromEntries([...fs.readFileSync(path.join(SRC, 'lib/view-route.js'), 'utf8')
  .matchAll(/'?([a-z-]+)'?: '(\/app\/[a-z-]+)'/g)].map((m) => [m[1], m[2]]));
const viewOf = { KnowledgeView: 'knowledge' };
for (const m of app.matchAll(/view === '([a-z-]+)' && <(\w+)/g)) viewOf[m[2]] = m[1];
route.knowledge = '/wiki';

// A key: the first argument of a storage call, a *KEY* constant or a synced field's localKey.
const KEY_RE = /(?:(?:getItem|setItem|removeItem|storage\.get|storage\.set|useLocalStorage|readStoredJson|safeRead\w*|read\w*(?:LS|Json|Store)\w*|load\w*)\(\s*|[A-Z_]*KEY[A-Z_]*\s*=\s*|localKey:\s*)['"`](vmx-[a-z0-9-]+(?::[a-z0-9-]+)?)['"`]/g;
const keyFiles = new Map();
for (const f of walk(SRC)) {
  if (/\.generated\.|[\\/]data[\\/]/.test(f)) continue;
  for (const m of fs.readFileSync(f, 'utf8').matchAll(KEY_RE)) {
    if (!keyFiles.has(m[1])) keyFiles.set(m[1], new Set());
    keyFiles.get(m[1]).add(path.basename(f, path.extname(f)));
  }
}
const routesFor = (k) => [...new Set(['/app', ...[...keyFiles.get(k)].map((c) => route[viewOf[c]]).filter(Boolean)])];
const VALUES = { null: 'null', undefined: 'undefined', truncated: '{"v":[1,2' };
const jobs = [];
for (const k of [...keyFiles.keys()].sort()) {
  if (k in SEED || (only && !k.includes(only))) continue;
  for (const [label, raw] of Object.entries(VALUES)) for (const r of routesFor(k)) jobs.push({ k, label, raw, r });
}
console.log(`${keyFiles.size} keys, ${jobs.length} loads`);

const browser = await chromium.launch();
async function probe({ k, raw, r }) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, serviceWorkers: 'block', locale: 'th-TH', timezoneId: 'Asia/Bangkok' });
  await ctx.addInitScript(({ seed, k, raw }) => {
    try {
      if (window !== window.top) return;
      for (const [key, v] of Object.entries(seed)) localStorage.setItem(key, v);
      if (k) localStorage.setItem(k, raw);
    } catch { /* storage refused */ }
  }, { seed: SEED, k, raw });
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.origin !== new URL(base).origin) return route.abort();
    if (u.pathname.startsWith('/api/')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"offline"}' });
    return route.continue();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)));
  try {
    await page.goto(base + r, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => ({
      boundary: /หน้านี้ขัดข้อง/.test(document.body.innerText),
      main: (document.querySelector('#main')?.innerText || '').trim().length,
    }));
    return { errors, ...state };
  } catch (e) {
    return { errors: [...errors, 'load: ' + e.message.slice(0, 80)], boundary: false, main: 0 };
  } finally { await ctx.close(); }
}
const baseline = {};
for (const r of new Set(jobs.map((j) => j.r))) baseline[r] = await probe({ r });
const breaks = [];
let i = 0;
async function worker() {
  while (i < jobs.length) {
    const job = jobs[i++];
    const res = await probe(job);
    const b = baseline[job.r];
    const newErrors = res.errors.filter((e) => !b.errors.includes(e));
    if (newErrors.length || (res.boundary && !b.boundary) || (res.main < 40 && b.main >= 40)) {
      breaks.push({ ...job, ...res, newErrors });
      console.log(`BREAK ${job.k}=${job.label} ${job.r}: error card ${res.boundary}, main ${res.main} chars, ${newErrors[0] || ''}`);
    }
  }
}
await Promise.all(Array.from({ length: conc }, worker));
console.log(`done: ${breaks.length} breaking loads of ${jobs.length}`);
await browser.close();
process.exitCode = breaks.length ? 1 : 0;
