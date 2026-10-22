// Journey audit: opens every public page at five widths in both themes and records what a
// reader would trip on. Run from vca/:
//   node scripts/journey-audit.mjs https://vca.vetmock.com [outDir]
// Per page, width and theme: console errors, sideways overflow, visible Thai text under 14 px,
// tap targets under 44 px, controls without a name, plus the accessibility snapshot and a
// screenshot in outDir. Not part of CI; the evidence behind docs/journeys.md and each release.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:43120';
const out = process.argv[3] || 'journey-audit';
const PATHS = (process.env.PATHS || '/,/practice,/practice?mode=mock,/exam,/bank,/library,/progress,/d/anatomy,/about,/community,/chat,/me').split(',');
const WIDTHS = (process.env.WIDTHS || '360,390,768,1280,1440').split(',').map(Number);
const THEMES = (process.env.THEMES || 'light,dark').split(',');
mkdirSync(out, { recursive: true });

// Runs in the page: everything visible that a reader reads or presses.
function inspect() {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05 && !el.closest('[aria-hidden="true"]');
  };
  const smallThai = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!/[฀-๿]/.test(n.data)) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || !vis(el)) continue;
    seen.add(el);
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 14) smallThai.push(`${px}px ${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${n.data.trim().slice(0, 40)}"`);
  }
  const smallTargets = [];
  const unnamed = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], [role="radio"], input, select, textarea, summary')) {
    if (!vis(el)) continue;
    const r = el.getBoundingClientRect();
    // Links inside running text are exempt (WCAG 2.5.8 inline exception).
    const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li');
    if (!inline && (r.width < 44 || r.height < 44)) smallTargets.push(`${Math.round(r.width)}x${Math.round(r.height)} ${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}"`);
    const name = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.textContent.trim() || el.querySelector('img[alt]')?.alt || (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) || el.getAttribute('placeholder');
    if (!name) unnamed.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
  }
  const doc = document.documentElement;
  return {
    overflowX: Math.max(0, doc.scrollWidth - doc.clientWidth),
    height: doc.scrollHeight,
    smallThai: smallThai.slice(0, 40), smallThaiCount: smallThai.length,
    smallTargets: smallTargets.slice(0, 60), smallTargetCount: smallTargets.length,
    unnamed,
  };
}

const browser = await chromium.launch();
const rows = [];
for (const theme of THEMES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 768 ? 800 : 900 },
      deviceScaleFactor: 2, isMobile: width < 768, hasTouch: width < 768,
      colorScheme: theme, serviceWorkers: 'block', locale: 'th-TH', timezoneId: 'Asia/Bangkok',
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
    for (const p of PATHS) {
      errors.length = 0;
      await page.goto(base + p, { waitUntil: 'networkidle' }).catch((e) => errors.push(`goto: ${e.message}`));
      await page.waitForTimeout(1200);
      const r = await page.evaluate(inspect);
      const slug = `${theme}-${width}${p.replace(/[/?=&]+/g, '_') || '_home'}`;
      writeFileSync(`${out}/${slug}.aria.yml`, await page.locator('body').ariaSnapshot().catch(() => ''));
      await page.screenshot({ path: `${out}/${slug}.png`, fullPage: false });
      rows.push({ theme, width, path: p, errors: [...errors], ...r });
      console.log(`${theme} ${width} ${p}: overflow ${r.overflowX}, thai<14 ${r.smallThaiCount}, targets<44 ${r.smallTargetCount}, unnamed ${r.unnamed.length}, errors ${errors.length}`);
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(`${out}/audit.json`, JSON.stringify(rows, null, 1));
