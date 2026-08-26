// ============================================================
// audit-contrast.mjs — WCAG AA text contrast, measured in a real browser
// ============================================================
// Why a browser and not a stylesheet scan: the worst contrast bug this
// app has had was invisible to CSS. A Home mode card wrote its accent
// as an inline `style={{ background: 'var(--clr-rose)' }}` while the
// class kept `color: var(--clr-ink-soft)`. Neither half looks wrong on
// its own; together they rendered an 11px label at 1.09:1 in dark mode
// and 2.16:1 in light — a badge nobody could read, shipped for five
// days. Only the composited, computed pixel values show it.
//
// Needs a preview server already running:
//     npx vite preview --port 4174    # or whatever preview_start gives
//     npm run audit:contrast -- --url http://localhost:4174
//
// Two traps this tool hit while being written, both of which made it
// report confident nonsense, so they are pinned here:
//
//   1. Translucent backgrounds. `rgba(194,109,109,0.1)` over a dark
//      surface is nearly the surface. Reading it as opaque rose called
//      two perfectly readable chips 1.9:1. Layers are composited down
//      to the first opaque ancestor instead.
//
//   2. color-mix(). Chrome serializes it as `color(srgb 0.99 0.97 0.94)`
//      — 0-to-1 floats, not bytes. Parsed as bytes, a cream surface
//      became rgb(1,1,1) and every label on it looked invisible.
//
// A contrast tool that cries wolf gets ignored, which is worse than not
// having one. If you add a color format, add it to toRgb.

import { chromium } from '@playwright/test';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.split('=').slice(1).join('=');
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
};

const URL = arg('url', 'http://localhost:4174/');
const THEMES = (arg('themes', 'light,dark')).split(',');

// Known and deliberately not failing the run. Each entry says WHY, so
// the list cannot quietly become a place to hide new regressions.
const KNOWN = [
  {
    match: /vmx-btn-primary|vmx-sidebar-label/,
    why: 'the single --clr-sage token: dark #5f8a5f gives white-on-sage 3.97 and sage-on-surface 4.05. '
       + 'One value cannot clear 4.5 both ways — it needs a darker fill and a lighter --clr-sage-text, '
       + 'the split --clr-rose-text already has. Brand-wide change, wants a decision not a patch.',
  },
  {
    match: /^Mock$/,
    why: 'the wordmark. Brand identity at display size, not body copy.',
    onText: true,
  },
];

const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const PAGE_FN = () => {
  // Parse any computed color into [r,g,b,a] with 0-255 channels.
  const toRgb = (s) => {
    const m = (s || '').match(/[\d.]+/g);
    if (!m) return null;
    const unit = /^color\(\s*srgb/i.test(s) ? 255 : 1;   // color(srgb ...) is 0-1
    const a = m.length > 3 ? +m[3] : 1;
    return [+m[0] * unit, +m[1] * unit, +m[2] * unit, a];
  };
  // Flatten every translucent layer down onto the first opaque ancestor.
  const bgOf = (el) => {
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const c = toRgb(getComputedStyle(n).backgroundColor);
      if (!c || c[3] === 0) continue;
      stack.push(c);
      if (c[3] >= 1) break;
    }
    stack.push([255, 255, 255, 1]);
    let [r, g, b] = stack[stack.length - 1];
    for (let i = stack.length - 2; i >= 0; i--) {
      const [sr, sg, sb, sa] = stack[i];
      r = sr * sa + r * (1 - sa); g = sg * sa + g * (1 - sa); b = sb * sa + b * (1 - sa);
    }
    return [r, g, b];
  };

  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const text = (el.textContent || '').trim();
    if (!text || el.children.length || text.length > 120) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 4 || box.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const fg = toRgb(cs.color);
    if (!fg || fg[3] === 0) continue;
    const size = parseFloat(cs.fontSize);
    out.push({
      text: text.slice(0, 48),
      cls: (el.className || '').toString().slice(0, 60),
      fg: fg.slice(0, 3),
      bg: bgOf(el),
      // AA: 4.5 for body text, 3.0 once it is 24px, or 18.66px bold.
      floor: size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5,
    });
  }
  return out;
};

const browser = await chromium.launch();
let failures = 0;
let excused = 0;

for (const theme of THEMES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(([t]) => {
    try {
      localStorage.setItem('vmx-selected-year', '4');
      localStorage.setItem('vmx-theme', JSON.stringify(t));
    } catch {}
  }, [theme]);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const applied = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (applied !== theme) {
    console.error(`✗ ${theme}: page rendered as "${applied}" — seed did not take, results would be meaningless`);
    process.exit(1);
  }

  const rows = (await page.evaluate(PAGE_FN))
    .map((r) => ({ ...r, ratio: +ratio(r.fg, r.bg).toFixed(2) }))
    .filter((r) => r.ratio < r.floor)
    .sort((a, b) => a.ratio - b.ratio);

  const real = [];
  for (const r of rows) {
    const known = KNOWN.find((k) => (k.onText ? k.match.test(r.text) : k.match.test(r.cls)));
    if (known) { excused++; continue; }
    real.push(r);
  }

  console.log(`\n${theme}: ${real.length} below AA${excused ? '' : ''}`);
  for (const r of real) {
    console.log(`   ${r.ratio} (needs ${r.floor})  ${JSON.stringify(r.text)}`);
    console.log(`        rgb(${r.fg.map(Math.round)}) on rgb(${r.bg.map(Math.round)})  |  ${r.cls}`);
  }
  failures += real.length;
  await ctx.close();
}

await browser.close();

if (excused) {
  console.log(`\n${excused} known item(s) excused:`);
  for (const k of KNOWN) console.log(`   • ${k.why}`);
}
console.log(failures ? `\n❌ ${failures} unexcused contrast failure(s).` : '\n✅ No unexcused contrast failures.');
process.exit(failures ? 1 : 0);
