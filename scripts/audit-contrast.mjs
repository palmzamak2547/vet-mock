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
// Runs inside `npm run lint:all`, so it starts and stops its own preview
// server and needs no setup:
//     npm run audit:contrast
//     npm run audit:contrast -- --landing                  # signed-out page
//     npm run audit:contrast -- --url https://vetmock.vercel.app/
//
// It measures the BUILT bundle in dist/, so it refuses to run against one
// older than src/ rather than reporting a confident answer about code
// nobody is shipping. Both pages are swept in one browser: the palettes
// only re-point CSS variables, so the twelve combinations are attribute
// flips on one loaded page, not twelve page loads.
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
//
// Three surfaces: the signed-in home page, the signed-out landing
// (--landing), and a live practice session (--exam). The exam screen was
// the documented blind spot for a while, and the first sweep of it found
// the correct-answer ✓ chip at 2.72:1 in dark mode — a hardcoded #fff on
// a fill that only that screen paints.
//
// --exam SAMPLES. It answers one randomly chosen question, so chrome that
// only some questions carry — the conflict flag chip, for one — appears
// in some runs and not others. A red run there is a real find; a green
// run is not a proof. That is worth knowing before reading silence as
// safety, and it is why lint-accent-tokens.mjs exists beside this: the
// token half IS deterministic and complete.
//
// Still not covered: every other route, and any state behind data this
// account does not have.

import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.split('=').slice(1).join('=');
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : fallback;
};

const REMOTE = arg('url', null);
const PORT = Number(arg('port', 41732));
const URL = REMOTE || `http://127.0.0.1:${PORT}/`;

// ── the build this measures ─────────────────────────────────────────
// Reading a stale dist/ is the one failure mode that matters here: it
// answers confidently about a bundle nobody is shipping, and a green
// gate is exactly when nobody looks twice. Newest mtime under src/ vs
// the built index — cheap, and wrong only in the safe direction (a
// touched-but-unchanged file asks for a rebuild that costs a minute).
function newestMtime(dir) {
  let newest = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    newest = Math.max(newest, e.isDirectory() ? newestMtime(full) : statSync(full).mtimeMs);
  }
  return newest;
}

async function serveLocalBuild() {
  const index = 'dist/index.html';
  if (!existsSync(index)) {
    console.error('✗ no dist/ to measure. Run `npm run build` first.');
    process.exit(1);
  }
  if (newestMtime('src') > statSync(index).mtimeMs) {
    console.error('✗ dist/ is older than src/. Run `npm run build` — measuring a stale');
    console.error('  bundle would report contrast for code that is not being shipped.');
    process.exit(1);
  }
  // Spawn vite's bin with this node, not `npx` through a shell: shell:true
  // on Windows concatenates rather than escapes its arguments, and a lint
  // gate has no business opening that door.
  // Refuse a port that is already answering. --strictPort makes vite exit
  // when the port is taken, but the wait loop below would then happily
  // connect to whatever OTHER server is on it and measure that instead —
  // which is how this gate spent a run reporting a failure that had
  // already been fixed, against a stale preview left running by hand.
  try {
    const res = await fetch(URL, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      console.error(`✗ something is already serving ${URL}. Stop it, or pass --port.`);
      process.exit(1);
    }
  } catch {}

  const server = spawn(process.execPath,
    [join('node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return server;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  server.kill();
  console.error(`✗ preview server never came up on ${URL}`);
  process.exit(1);
}
const THEMES = (arg('themes', 'light,dark')).split(',');
// Sweeping themes alone checks 2 of 12 combinations: five alternate
// palettes re-point the accent, and for a long time they re-pointed only
// --clr-sage while --clr-sage-text stayed the default green, so a cherry
// theme rendered rose everywhere and green in every accent label.
const PALETTES = (arg('palettes', 'default,ocean,plum,cherry,mono,forest')).split(',');
const LANDING = process.argv.includes('--landing');
const EXAM = process.argv.includes('--exam');
// Quiet by default so a green gate is one line inside lint:all.
const VERBOSE = process.argv.includes('--verbose');

// Known and deliberately not failing the run. Each entry says WHY, so
// the list cannot quietly become a place to hide new regressions.
const KNOWN = [
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

const server = REMOTE ? null : await serveLocalBuild();
const browser = await chromium.launch();
let failures = 0;
let excused = 0;

try {
  // One context, one load per page. Switching palette is a CSS-variable
  // swap, so flipping the attributes is the same measurement as twelve
  // navigations and turns a two-minute sweep into a few seconds — which
  // is the difference between a gate people run and one they skip.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((seedYear) => {
    try {
      // Without the year seed the app opens its signed-out landing page
      // instead of home — two different stylesheets, so both are worth
      // sweeping. --landing swaps which one this run measures.
      if (seedYear) localStorage.setItem('vmx-selected-year', '4');
    } catch {}
  }, !LANDING);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // --exam walks into a practice session and answers one question wrong,
  // because that screen renders states no other page does: the correct-
  // answer chip, the wrong pick, the warning timer. It was the documented
  // blind spot, and the first sweep of it found a ✓ chip at 2.72 in dark.
  if (EXAM) {
    await page.getByRole('button', { name: /Quick Practice|ฝึกแบบเลือกจำนวน/i }).first().click();
    await page.getByRole('spinbutton', { name: /จำนวนข้อ.*กำหนดเอง/ }).fill('3');
    await page.getByRole('button', { name: /เริ่มฝึก/ }).click();
    await page.locator('.vmx-question-card').waitFor({ timeout: 20_000 });
    const opts = page.locator('.vmx-option');
    // Last option, so a wrong pick is likely and both verdict states paint.
    if (await opts.count()) await opts.last().click();
    await page.waitForTimeout(500);
    if (!(await page.locator('.vmx-question-card').isVisible())) {
      console.error('✗ --exam never reached a question card; nothing was measured');
      process.exit(1);
    }
  }

  // The app stamps data-theme after it boots, so wait for the attribute
  // rather than a fixed delay — a fixed delay reports "theme null" on a
  // slow start and looks like the seed failed.
  await page.waitForFunction(() => document.documentElement.hasAttribute('data-theme'), null, { timeout: 20_000 });

  // Kill transitions before measuring anything. Flipping data-theme in
  // place leaves the page mid-interpolation, and getComputedStyle happily
  // reports the halfway colour: the first run of this loop produced 394
  // failures against values like rgb(32,28,24), which is no token in this
  // app — it is dark-mode ink caught on its way to light. A page that is
  // still animating is not a page you can measure.
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });

  for (const theme of THEMES) for (const palette of PALETTES) {
    const label = `${theme}/${palette}`;
    const applied = await page.evaluate(([t, p]) => {
      const el = document.documentElement;
      el.setAttribute('data-theme', t);
      if (p === 'default') el.removeAttribute('data-palette');
      else el.setAttribute('data-palette', p);
      return { theme: el.getAttribute('data-theme'), palette: el.getAttribute('data-palette') || 'default' };
    }, [theme, palette]);
    // Assert it stuck. If the app syncs these attributes back from its own
    // state, every reading after the first would silently be the same
    // palette twelve times over — a clean sweep that measured nothing.
    if (applied.theme !== theme || applied.palette !== palette) {
      console.error(`✗ ${label}: page rendered as ${applied.theme}/${applied.palette} — the flip did not stick, results would be meaningless`);
      process.exit(1);
    }

    // Two frames: one for the variable swap to apply, one for layout.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

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

    if (real.length || VERBOSE) console.log(`${label.padEnd(16)} ${real.length} below AA`);
    for (const r of real) {
      console.log(`   ${r.ratio} (needs ${r.floor})  ${JSON.stringify(r.text)}`);
      console.log(`        rgb(${r.fg.map(Math.round)}) on rgb(${r.bg.map(Math.round)})  |  ${r.cls}`);
    }
    failures += real.length;
  }
} finally {
  await browser.close();
  server?.kill();
}

if (excused) {
  console.log(`\n${excused} known item(s) excused:`);
  for (const k of KNOWN) console.log(`   • ${k.why}`);
}
console.log(failures ? `\n❌ ${failures} unexcused contrast failure(s).` : '\n✅ No unexcused contrast failures.');
process.exit(failures ? 1 : 0);
