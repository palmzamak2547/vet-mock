#!/usr/bin/env node
// ============================================================
// standard.mjs — the VetMock Standard, one line per clause
// ============================================================
// Usage:
//   npm run standard                  run the cheap checks and print one line per clause
//   npm run standard -- --json        the same as JSON, for machines
//   npm run standard -- --no-run      read files only: spawn no lint, no network
//   npm run standard -- --sweep=FILE  read a route-sweep result (a Playwright log or JSON report)
//
// docs/VETMOCK-STANDARD.md is the page; this is its measure. Every clause there has a row in CLAUSES
// below with the same id, and tests/unit/standard.test.mjs fails when the two disagree.
//
// It reports and never fails: the exit code is 0 whatever it finds, until the owner decides which
// clauses gate. A clause is `met`, `not met` (with the number), or `not measured` (with the reason:
// walked by hand, needs a build or a browser, or the source it reads is absent).
//
// What it runs: the lints that finish in seconds (the copy, the answer voice, colours, tokens, Thai
// spelling, the glossary, the question standard), each with a 90 s limit, all at once. What it reads:
// perf-budgets.json and perf-baseline.json (numbers recorded by perf:budget and npm run perf), the
// stylesheets and JSX (static scans), the CI workflow, the route sweep's KNOWN list, the data
// scorecard (scripts/scorecard.mjs) when it exists, and main's last CI result through `gh` when it is
// installed. It never builds, never opens a browser and stays under two minutes.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch { return null; } };
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

export const SECTIONS = ['design', 'motion', 'language', 'data', 'speed', 'stability', 'everywhere', 'release'];
export const STATUSES = ['met', 'not met', 'not measured'];

// ---------- helpers ----------

function walk(dir, exts, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(rel, exts, out); }
    else if (exts.some((x) => e.name.endsWith(x)) && !e.name.includes('.generated.')) out.push(rel);
  }
  return out;
}

const stripCssComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// Every rule of a stylesheet as { selector, body, media }, one level of @media/@supports deep.
export function cssRules(css) {
  const src = stripCssComments(css);
  const rules = [];
  let i = 0;
  const media = [];
  let buf = '';
  while (i < src.length) {
    const c = src[i];
    if (c === '{') {
      const head = buf.trim();
      buf = '';
      if (/^@(media|supports|layer|container)/.test(head)) { media.push(head); i++; continue; }
      if (/^@keyframes|^@font-face|^@property/.test(head)) {
        let depth = 1, j = i + 1;
        while (j < src.length && depth) { if (src[j] === '{') depth++; else if (src[j] === '}') depth--; j++; }
        rules.push({ selector: head, body: src.slice(i + 1, j - 1), media: media.join(' ') });
        i = j; continue;
      }
      const end = src.indexOf('}', i);
      rules.push({ selector: head, body: src.slice(i + 1, end), media: media.join(' ') });
      i = end + 1; continue;
    }
    if (c === '}') { media.pop(); buf = ''; i++; continue; }
    if (c === ';' && buf.trim().startsWith('@')) { buf = ''; i++; continue; }
    buf += c; i++;
  }
  return rules;
}

const decls = (body, prop) => [...body.matchAll(new RegExp(`(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`, 'g'))].map((m) => m[1].trim());

// JSX tags of a kind, each as its attribute text, read with brace depth so `=>` does not end a tag.
export function jsxTags(src, names) {
  const out = [];
  const re = new RegExp(`<(${names.join('|')})(?=[\\s/>])`, 'g');
  let m;
  while ((m = re.exec(src))) {
    let depth = 0, j = m.index + m[0].length, quote = null;
    for (; j < src.length; j++) {
      const c = src[j];
      if (quote) { if (c === quote && src[j - 1] !== '\\') quote = null; continue; }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '>' && depth === 0) break;
    }
    out.push({ name: m[1], attrs: src.slice(m.index + m[0].length, j), at: m.index });
  }
  return out;
}

const lineOf = (src, at) => src.slice(0, at).split('\n').length;

function hexRgb(h) {
  let x = h.replace('#', '');
  if (x.length === 3) x = x.split('').map((c) => c + c).join('');
  const n = parseInt(x.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function contrast(a, b) {
  const L = (rgb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
  const x = L(hexRgb(a)), y = L(hexRgb(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

function runCmd(cmd, args, { timeout = 90_000 } = {}) {
  return new Promise((resolve) => {
    const started = Date.now();
    let out = '';
    let child;
    try {
      // One command string: npm is a .cmd on Windows and needs the shell, and the arguments here are this
      // file's own constants, never input.
      child = spawn([cmd, ...args].join(' '), { cwd: ROOT, shell: true, env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' } });
    } catch (e) { resolve({ code: null, out: String(e), ms: 0 }); return; }
    const timer = setTimeout(() => { out += '\n[standard: timed out]'; child.kill(); }, timeout);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { out += d; });
    child.on('error', (e) => { clearTimeout(timer); resolve({ code: null, out: out + String(e), ms: Date.now() - started }); });
    child.on('close', (code) => { clearTimeout(timer); resolve({ code, out, ms: Date.now() - started }); });
  });
}
const npmRun = (script, extra = []) => runCmd('npm', ['run', '-s', script, ...(extra.length ? ['--', ...extra] : [])]);

const met = (value, note) => ({ status: 'met', value, note });
const notMet = (value, note) => ({ status: 'not met', value, note });
const notMeasured = (note, value = null) => ({ status: 'not measured', value, note });
const byTarget = (ok, value, note) => (ok ? met(value, note) : notMet(value, note));
const hand = (lastSeen, smallest) => notMeasured(`walked by hand${lastSeen ? `; last seen: ${lastSeen}` : ''}. Smallest automated check: ${smallest}`);

// ---------- static scans (cheap, file reads only) ----------

function scanCss() {
  const files = walk('src', ['.css']);
  const all = files.map((f) => ({ file: f, css: read(f) || '' }));
  const rules = all.flatMap(({ file, css }) => cssRules(css).map((r) => ({ ...r, file })));
  const reducedText = rules.filter((r) => /prefers-reduced-motion|data-vmx-motion/.test(r.media + r.selector)).map((r) => r.selector + ' ' + r.body).join('\n');

  const smallFont = rules.filter((r) => !r.selector.startsWith('@')).flatMap((r) => decls(r.body, 'font-size').filter((v) => {
    const px = v.match(/^(\d+(?:\.\d+)?)px/);
    return (px && Number(px[1]) < 14) || /var\(--text-xs\)/.test(v) || (/^0?\.\d+rem|^0?\.\d+em/.test(v) && parseFloat(v) * 16 < 14 && v.endsWith('rem'));
  }).map(() => `${r.file}: ${r.selector.slice(0, 60)}`));

  const headingSel = /(^|[\s,>])h[1-3]([\s,.:[]|$)|title|heading|hero|display/i;
  // :lang(en) rules style English-only text, which may keep its tight tracking.
  const tightHeadings = rules.filter((r) => headingSel.test(r.selector) && !r.selector.startsWith('@') && !r.selector.includes(':lang(en)')).filter((r) => {
    const ls = decls(r.body, 'letter-spacing').some((v) => /^-/.test(v));
    const lh = decls(r.body, 'line-height').some((v) => /^\d*\.?\d+$/.test(v) && Number(v) < 1.2);
    return ls || lh;
  }).map((r) => `${r.file}: ${r.selector.slice(0, 60)}`);

  const zLiteral = rules.flatMap((r) => decls(r.body, 'z-index').filter((v) => /^-?\d+/.test(v) && Math.abs(parseInt(v, 10)) > 1).map((v) => `${r.file}: ${r.selector.slice(0, 50)} z-index ${v}`));

  const LAYOUT = /(^|[\s,])(all|width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*|max-height|min-height)(\s|,|$)/;
  const layoutTransitions = rules.flatMap((r) => [...decls(r.body, 'transition'), ...decls(r.body, 'transition-property')]
    .filter((v) => v !== 'none' && v.split(',').some((part) => LAYOUT.test(' ' + part.trim().split(/\s+/)[0] + ' ')))
    .map((v) => `${r.file}: ${r.selector.slice(0, 50)} transition ${v.slice(0, 40)}`));

  const slowTransitions = rules.flatMap((r) => decls(r.body, 'transition').filter((v) => {
    const durs = [...v.matchAll(/(\d*\.?\d+)(ms|s)(?![a-z])/g)].map((m) => (m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1])));
    return durs.length && durs[0] > 300;
  }).map((v) => `${r.file}: ${r.selector.slice(0, 50)} ${v.slice(0, 40)}`));

  const keyframes = rules.filter((r) => r.selector.startsWith('@keyframes')).map((r) => ({ name: r.selector.replace('@keyframes', '').trim(), body: r.body, file: r.file }));
  const layoutKeyframes = keyframes.filter((k) => /(^|[;{\s])(width|height|top|left|right|bottom|margin|padding|max-height)\s*:/.test(k.body)).map((k) => `${k.file}: @keyframes ${k.name}`);
  const users = (name) => rules.filter((r) => !r.selector.startsWith('@') && [...decls(r.body, 'animation'), ...decls(r.body, 'animation-name')].some((v) => new RegExp(`(^|[\\s,])${name.replace(/[-]/g, '\\-')}([\\s,]|$)`).test(v)));
  const used = keyframes.filter((k) => users(k.name).length);
  const uncovered = used.filter((k) => {
    if (reducedText.includes(k.name)) return false;
    return !users(k.name).some((r) => r.selector.split(',').some((s) => s.trim() && reducedText.includes(s.trim())));
  }).map((k) => `${k.file}: @keyframes ${k.name}`);
  const blanket = rules.filter((r) => /prefers-reduced-motion/.test(r.media) && /(^|,)\s*\*/.test(r.selector) && /animation(-duration)?\s*:|transition(-duration)?\s*:/.test(r.body)).map((r) => `${r.file}: ${r.selector.slice(0, 40)}`);

  return { files: files.length, smallFont, tightHeadings, zLiteral, layoutTransitions, slowTransitions, keyframes: used.length, layoutKeyframes, uncovered, blanket };
}

function scanJsx() {
  const files = [...walk('src/views', ['.jsx']), ...walk('src/components', ['.jsx']), 'src/App.jsx'].filter(exists);
  const clickNoRole = [];
  const imgNoAlt = [];
  const smallInline = [];
  const zInline = [];
  let inlineStyles = 0;
  const CORE = ['src/views/HomeView.jsx', 'src/views/ExamView.jsx', 'src/components/Question.jsx', 'src/views/ResultsView.jsx', 'src/views/TopicSelect.jsx', 'src/views/SubjectSelect.jsx'];
  let coreInline = 0;
  for (const f of files) {
    // Comment lines are blanked (kept as empty lines so line numbers hold): they mention <img> in prose.
    const src = (read(f) || '').split('\n').map((l) => (/^\s*(\/\/|\*|\/\*)/.test(l) ? '' : l)).join('\n');
    for (const t of jsxTags(src, ['div', 'span', 'li', 'td', 'tr', 'section', 'article', 'img'])) {
      if (t.name === 'img') {
        if (!/\salt\s*=/.test(' ' + t.attrs) && !/\{\s*\.\.\./.test(t.attrs)) imgNoAlt.push(`${f}:${lineOf(src, t.at)}`);
        continue;
      }
      // A dialog's backdrop (closed by Escape too, through useModalFocus) and a handler that only stops
      // propagation are not actions a keyboard needs to reach.
      const backdrop = /className=["'{][^"'}]*(overlay|backdrop|scrim)/.test(t.attrs);
      const stopOnly = /onClick=\{\s*\(?\w*\)?\s*=>\s*\w+\.stopPropagation\(\)\s*\}/.test(t.attrs);
      const keyed = /\sonKey(Down|Up)\s*=/.test(' ' + t.attrs);
      if (/\sonClick\s*=/.test(' ' + t.attrs) && !/\srole\s*=/.test(' ' + t.attrs) && !backdrop && !stopOnly && !keyed) clickNoRole.push(`${f}:${lineOf(src, t.at)}`);
    }
    const styles = (src.match(/style=\{\{/g) || []).length;
    inlineStyles += styles;
    if (CORE.includes(f)) coreInline += styles;
    for (const m of src.matchAll(/fontSize:\s*['"]?(\d+(?:\.\d+)?)(px)?['"]?/g)) if (Number(m[1]) < 14) smallInline.push(`${f}:${lineOf(src, m.index)}`);
    for (const m of src.matchAll(/zIndex:\s*(\d+)/g)) if (Number(m[1]) > 1) zInline.push(`${f}:${lineOf(src, m.index)}`);
  }
  return { files: files.length, clickNoRole, imgNoAlt, smallInline, zInline, inlineStyles, coreInline, core: CORE };
}

function themeContrast() {
  const css = read('src/styles.css') || '';
  const block = (start) => {
    const at = css.indexOf(start);
    if (at < 0) return {};
    const body = css.slice(at, css.indexOf('\n}', at));
    const v = {};
    for (const m of body.matchAll(/(--clr-[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) v[m[1]] = m[2];
    return v;
  };
  const light = block(':root, [data-theme="light"] {');
  const dark = { ...light, ...block('[data-theme="dark"] {') };
  const pairs = [];
  for (const [theme, t] of [['light', light], ['dark', dark]]) {
    for (const ink of ['--clr-ink', '--clr-ink-soft']) for (const bg of ['--clr-bg', '--clr-surface', '--clr-surface-2']) {
      if (t[ink] && t[bg]) pairs.push({ theme, ink, bg, ratio: Math.round(contrast(t[ink], t[bg]) * 100) / 100 });
    }
  }
  return pairs;
}

function perfNumbers() {
  let budgets = null, baseline = null;
  try { budgets = JSON.parse(read('perf-budgets.json')); } catch {}
  try { baseline = JSON.parse(read('perf-baseline.json')); } catch {}
  return { budgets, baseline };
}

function ageDays(iso) { const t = Date.parse(iso); return Number.isFinite(t) ? Math.floor((Date.now() - t) / 86_400_000) : null; }

function parseSweep(file) {
  const text = file ? (() => { try { return fs.readFileSync(path.resolve(file), 'utf8'); } catch { return null; } })() : null;
  if (!text) return null;
  try {
    const j = JSON.parse(text);
    const s = j.stats || {};
    if (Number.isFinite(s.expected)) return { passed: s.expected, failed: (s.unexpected || 0), flaky: s.flaky || 0, file };
  } catch {}
  const passed = Number((text.match(/(\d+)\s+passed/) || [])[1] || 0);
  const failed = Number((text.match(/(\d+)\s+failed/) || [])[1] || 0);
  const flaky = Number((text.match(/(\d+)\s+flaky/) || [])[1] || 0);
  return passed + failed ? { passed, failed, flaky, file } : null;
}

// ---------- the clauses ----------
// Each clause: id, section, text (true or false), check (the command), good (the usual line), best (what
// the best products measurably reach, with source), target (at or above best), doc, measure(ctx).

export const CLAUSES = [
  // Design and layout
  { id: 'D1', section: 'design', text: 'No Thai text is set under 14 px: every font size under 14 px in the source sits on a Latin-only element.',
    check: 'npm run standard (static scan of src/**/*.css and inline fontSize)', good: 'WCAG sets no size; 12 px is common', best: 'not found as a measured figure; Thai stacked marks need about 14 px to read (AGENTS.md "UI and study flow")', target: '0 declarations under 14 px outside a reviewed Latin-only list', doc: 'AGENTS.md (UI and study flow), docs/DESIGN_SYSTEM.md',
    measure: ({ css, jsx }) => { const n = css.smallFont.length + jsx.smallInline.length; return byTarget(n === 0, n, `${css.smallFont.length} in stylesheets, ${jsx.smallInline.length} inline; no Latin-only list exists yet, so every one counts`); } },
  { id: 'D2', section: 'design', text: 'Every heading that can carry Thai has line-height of at least 1.2 and no negative letter-spacing.',
    check: 'npm run standard (static scan of heading, title and hero rules)', good: 'none published', best: 'not found as a measured figure; first principles: stacked Thai marks collide below 1.2', target: '0 heading rules with line-height under 1.2 or negative tracking', doc: 'AGENTS.md Rule 11',
    measure: ({ css }) => byTarget(css.tightHeadings.length === 0, css.tightHeadings.length, 'selector match is a proxy (h1-h3, title, heading, hero, display); a Latin-only display numeral may be exempt') },
  { id: 'D3', section: 'design', text: 'No themed surface hardcodes a hex colour in app source.',
    check: 'npm run lint:hex-budget', good: 'the ratchet passes (no file over its baseline)', best: 'design-token systems ship 0 literal colours in components (first principles: every literal breaks a theme)', target: '0 hexes outside the token layer and the reviewed exempt list', doc: 'docs/DESIGN_SYSTEM.md Rules 1-2',
    measure: ({ lint }) => { const r = lint['lint:hex-budget']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/(\d+) hexes/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0, n, `ratchet ${r.code === 0 ? 'passes' : 'FAILS'}; ${(r.out.match(/across (\d+) files/) || [])[1]} files`) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'D4', section: 'design', text: 'Every var(--token) the styles use names a defined token.',
    check: 'npm run lint:css-tokens', good: 'the ratchet passes', best: 'first principles: an undefined token is an unthemed surface', target: '0 undefined tokens', doc: 'docs/css-token-baseline.json',
    measure: ({ lint }) => { const r = lint['lint:css-tokens']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/(\d+) baselined/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0 && r.code === 0, n, `ratchet ${r.code === 0 ? 'passes' : 'FAILS'}`) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'D5', section: 'design', text: 'Reading text (ink and soft ink on every base surface, light and dark) reaches 7:1.',
    check: 'npm run standard (token contrast); npm run audit:contrast for the rendered page', good: 'WCAG 2.2 AA: 4.5:1 (SC 1.4.3)', best: 'WCAG 2.2 AAA: 7:1 (SC 1.4.6)', target: '7:1 for reading text, 4.5:1 for every other text, on the rendered page', doc: 'scripts/audit-contrast.mjs, scripts/lint-accent-tokens.mjs',
    measure: ({ contrastPairs }) => { if (!contrastPairs.length) return notMeasured('tokens not found in src/styles.css'); const low = contrastPairs.filter((p) => p.ratio < 7); const min = Math.min(...contrastPairs.map((p) => p.ratio)); return byTarget(low.length === 0, `min ${min}:1`, low.length ? `under 7:1: ${low.map((p) => `${p.theme} ${p.ink} on ${p.bg} ${p.ratio}`).join('; ')}` : `${contrastPairs.length} pairs`); } },
  { id: 'D6', section: 'design', text: 'Every accent text token clears 4.5:1 on every surface it can land on, tinted ones included.',
    check: 'npm run lint:accent-tokens', good: 'WCAG 2.2 AA: 4.5:1', best: 'same (AA is what the best design systems ship for accents)', target: '4.5:1 on every surface', doc: 'scripts/lint-accent-tokens.mjs',
    measure: ({ lint }) => { const r = lint['lint:accent-tokens']; if (!r) return notMeasured('lint not run (--no-run)'); return byTarget(r.code === 0, r.code === 0 ? 'all clear' : 'fails', null); } },
  { id: 'D7', section: 'design', text: 'Every stacking layer uses a --z-* token, never a literal z-index above 1.',
    check: 'npm run standard (static scan)', good: 'none published', best: 'first principles: one ladder, no fights', target: '0 literal z-index values above 1', doc: 'docs/DESIGN_SYSTEM.md (z-index ladder)',
    measure: ({ css, jsx }) => { const n = css.zLiteral.length + jsx.zInline.length; return byTarget(n === 0, n, `${css.zLiteral.length} in stylesheets, ${jsx.zInline.length} inline`); } },
  { id: 'D8', section: 'design', text: 'The core study screens (Home, subject, topic, question, exam, results) carry no inline style objects: type, spacing and colour come from one system.',
    check: 'npm run standard (count of style={{ in the six core files)', good: 'none published', best: 'first principles: one system, no exceptions', target: '0 inline style objects in the six core files', doc: 'docs/DESIGN_SYSTEM.md (Components, debt)',
    measure: ({ jsx }) => byTarget(jsx.coreInline === 0, jsx.coreInline, `app-wide ${jsx.inlineStyles} across ${jsx.files} files`) },
  { id: 'D9', section: 'design', text: 'Every tap target is at least 44 by 44 CSS px, and primary actions at least 48.',
    check: 'walked by hand', good: 'WCAG 2.2 AA: 24 px (SC 2.5.8)', best: 'Material Design: 48 dp; Apple HIG: 44 pt', target: '44 px floor, 48 px for a primary action', doc: 'docs/DESIGN_SYSTEM.md, STABILITY.md section 4',
    measure: () => hand('5.149.1 polish sweep', 'measure every button and link box in tests/e2e/route-sweep.spec.js and fail under 44 px') },
  { id: 'D10', section: 'design', text: 'Every screen designs four states besides the happy path: loading (shaped like the content), empty (with the next action), error (with a retry) and offline.',
    check: 'walked by hand', good: 'a spinner and a blank list', best: 'not found as a measured figure', target: '4 of 4 states on every routed screen', doc: 'AGENTS.md Rule 11',
    measure: () => hand('docs/ux/journeys.md, 2026-10-21 (J6 empty review tab with no path)', 'a route-sweep pass that opens each route with the network failed and with empty storage and asserts a retry or a next action') },

  // Motion
  { id: 'M1', section: 'motion', text: 'Every CSS transition animates only transform, opacity, colour or shadow on small elements, never layout properties or `all`.',
    check: 'npm run standard (static scan of transition declarations)', good: 'none published', best: 'compositor-only motion (web.dev "Stick to compositor-only properties"; Modern Web Guidance, motion guides)', target: '0 layout or `all` transitions', doc: 'docs/DESIGN_SYSTEM.md Rule 4',
    measure: ({ css }) => byTarget(css.layoutTransitions.length === 0, css.layoutTransitions.length, null) },
  { id: 'M2', section: 'motion', text: 'No @keyframes animates a layout property.',
    check: 'npm run standard (static scan)', good: 'none published', best: 'compositor-only motion (as M1)', target: '0', doc: 'docs/DESIGN_SYSTEM.md Rule 4',
    measure: ({ css }) => byTarget(css.layoutKeyframes.length === 0, css.layoutKeyframes.length, null) },
  { id: 'M3', section: 'motion', text: 'Every animation in use has its own reduced-motion rule (per effect, not a blanket switch-off).',
    check: 'npm run standard (static scan: each used @keyframes is named, or its selector appears, in a reduced-motion block)', good: 'WCAG 2.2 SC 2.3.3 (AAA): motion from interaction can be disabled', best: 'per-effect fallbacks that keep information-carrying motion (Modern Web Guidance, "respect reduced-motion preferences")', target: 'every used animation covered, 0 blanket rules', doc: 'docs/DESIGN_SYSTEM.md (Motion)',
    measure: ({ css }) => byTarget(css.uncovered.length === 0 && css.blanket.length === 0, `${css.keyframes - css.uncovered.length}/${css.keyframes} covered`, `${css.blanket.length} blanket prefers-reduced-motion rule(s) on *`) },
  { id: 'M4', section: 'motion', text: 'No interface transition lasts longer than 300 ms.',
    check: 'npm run standard (static scan of transition durations)', good: 'Material 3: short and medium durations run 50 to 400 ms', best: 'interaction feedback within 200 ms (RAIL response window is 100 ms)', target: '0 transitions over 300 ms; tap feedback within 100 ms', doc: 'docs/DESIGN_SYSTEM.md (--dur tokens)',
    measure: ({ css }) => byTarget(css.slowTransitions.length === 0, css.slowTransitions.length, null) },
  { id: 'M5', section: 'motion', text: 'Opening a screen (navigate, practice, results) keeps the 95th-percentile frame within one 60 Hz frame on a phone with the CPU slowed 4x.',
    check: 'npm run perf (by hand, plugged in); recorded in perf-baseline.json', good: '16.7 ms a frame at 60 Hz (RAIL)', best: 'RAIL: produce each frame in 10 ms or less; 8.3 ms on a 120 Hz display', target: 'p95 at most 16.7 ms, no frame over 50 ms', doc: 'docs/ux/journeys.md, AGENTS.md (Performance)',
    measure: ({ perf }) => { const m = perf.baseline?.metrics; if (!m) return notMeasured('perf-baseline.json missing'); const keys = ['navigate.frameP95', 'practice.openP95', 'results.openP95']; const vals = keys.map((k) => `${k.split('.')[0]} ${m[k]?.median}`); const ok = keys.every((k) => m[k]?.median <= 16.7); return byTarget(ok, vals.join(', ') + ' ms', `recorded ${ageDays(perf.baseline.meta?.recordedAt)} days ago`); } },
  { id: 'M6', section: 'motion', text: 'Scrolling Home, results and a wiki article keeps the 95th-percentile frame within one 60 Hz frame.',
    check: 'npm run perf; perf-baseline.json', good: '16.7 ms (RAIL)', best: '10 ms of work a frame (RAIL)', target: 'p95 at most 16.7 ms', doc: 'perf-baseline.json',
    measure: ({ perf }) => { const m = perf.baseline?.metrics; if (!m) return notMeasured('perf-baseline.json missing'); const keys = ['home.scrollP95', 'results.scrollP95', 'wiki.scrollP95']; const ok = keys.every((k) => m[k]?.median <= 16.7); return byTarget(ok, keys.map((k) => `${k.split('.')[0]} ${m[k]?.median}`).join(', ') + ' ms', `recorded ${ageDays(perf.baseline.meta?.recordedAt)} days ago`); } },

  // Language
  { id: 'L1', section: 'language', text: 'The screens print no middle dot and never call the reader นักศึกษา.',
    check: 'npm run lint:ui-copy', good: 'none published', best: 'a copy lint run on every change (words reviewed like code)', target: '0 and 0', doc: 'scripts/lint-ui-copy.mjs, docs/THAI-STYLE.md',
    measure: ({ lint }) => { const r = lint['lint:ui-copy']; if (!r) return notMeasured('lint not run (--no-run)'); const d = Number((r.out.match(/(\d+) middle dots/) || [])[1]); const s = Number((r.out.match(/(\d+) นักศึกษา/) || [])[1]); return Number.isFinite(d) ? byTarget(d === 0 && s === 0 && r.code === 0, `${d} dots, ${s} นักศึกษา`, null) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'L2', section: 'language', text: 'No screen uses an English word where the app already has the Thai word.',
    check: 'npm run lint:ui-copy (englishLeaks in docs/ui-copy-budget.json)', good: 'the budget does not grow', best: 'one term per concept (glossary-driven copy)', target: '0', doc: 'docs/ui-copy-budget.json, src/data/glossary.js',
    measure: ({ lint }) => { const r = lint['lint:ui-copy']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/(\d+) English words/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0, n, null) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'L3', section: 'language', text: 'Every word has one spelling across the screens (เช็ก, อัป, หน้าแรก, the ellipsis character).',
    check: 'npm run lint:ui-copy (spellingDrift)', good: 'the budget does not grow', best: 'one spelling per word', target: '0', doc: 'docs/ui-copy-budget.json, docs/THAI-STYLE.md',
    measure: ({ lint }) => { const r = lint['lint:ui-copy']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/(\d+) old spellings/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0, n, null) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'L4', section: 'language', text: 'No explanation or model answer narrates its source, the deck, the lecturer or the paper.',
    check: 'npm run lint:answer-voice', good: 'none published', best: 'same lint at 0', target: '0', doc: 'scripts/lint-answer-voice.mjs',
    measure: ({ lint }) => { const r = lint['lint:answer-voice']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/narrate instead of explain:\s*(\d+)/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0 && r.code === 0, n, (r.out.match(/scanned [^\n]+/) || [''])[0]) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'L5', section: 'language', text: 'Every stem reads as an exam question, and no Thai in a question breaks spelling rules.',
    check: 'npm run lint:question-voice && npm run lint:thai-orthography', good: 'none published', best: 'same lints at 0', target: '0 and 0', doc: 'docs/QUESTION-STANDARD.md',
    measure: ({ lint }) => { const a = lint['lint:question-voice'], b = lint['lint:thai-orthography']; if (!a || !b) return notMeasured('lint not run (--no-run)'); const n = Number((b.out.match(/(\d+) question\(s\) contain/) || [])[1]); return byTarget(a.code === 0 && b.code === 0 && n === 0, `voice ${a.code === 0 ? 'ok' : 'fails'}, orthography ${Number.isFinite(n) ? n : '?'}`, null); } },
  { id: 'L6', section: 'language', text: 'Every term the screens use comes from the glossary, with no ambiguous entry.',
    check: 'npm run lint:glossary', good: 'none published', best: 'one term per concept', target: '0 ambiguous terms', doc: 'src/data/glossary.js',
    measure: ({ lint }) => { const r = lint['lint:glossary']; if (!r) return notMeasured('lint not run (--no-run)'); return byTarget(r.code === 0, r.code === 0 ? (r.out.match(/(\d+) glossary entries/) || ['ok'])[0] : 'fails', 'checks the glossary itself, not that screens use it'); } },
  { id: 'L7', section: 'language', text: 'Every visible string follows the Thai style guide.',
    check: 'docs/THAI-STYLE.md and its checks', good: 'none published', best: 'a style guide whose rules are lints', target: 'every rule of the guide a lint at 0', doc: 'docs/THAI-STYLE.md',
    measure: () => (exists('docs/THAI-STYLE.md') ? notMeasured('the guide is present; its rules have no aggregate check yet') : notMeasured('docs/THAI-STYLE.md is not on this branch yet (its own branch)')) },

  // Data
  { id: 'A1', section: 'data', text: 'Every property on the data scorecard (organised, correct, linked, retrievable, stable, predictive) meets its target.',
    check: 'npm run scorecard', good: 'none published', best: 'not found as a measured figure', target: 'every scorecard row met', doc: 'docs/DATA-INTEGRITY-ROADMAP.md, scripts/scorecard.mjs',
    measure: ({ scorecard }) => {
      if (!scorecard) return notMeasured('scripts/scorecard.mjs is not on this branch yet (its own branch)');
      if (scorecard.skipped) return notMeasured('not run (--no-run)');
      const rows = scorecard.rows;
      if (!rows) return notMeasured(`scorecard ran (exit ${scorecard.code}) but its JSON was not readable`);
      const ok = rows.filter((r) => r.met === true || r.status === 'met').length;
      return byTarget(ok === rows.length, `${ok}/${rows.length} met`, null);
    } },
  { id: 'A2', section: 'data', text: 'No question breaks the question standard (source named in the stem, narrating explanation, no citation, deck as origin, missing figure, invalid prediction data).',
    check: 'npm run lint:question-standard', good: 'the ratchet does not grow', best: 'same at 0', target: '0 defects', doc: 'docs/QUESTION-STANDARD.md',
    measure: ({ lint }) => { const r = lint['lint:question-standard']; if (!r) return notMeasured('lint not run (--no-run)'); const n = Number((r.out.match(/(\d+) defect\(s\)/) || [])[1]); return Number.isFinite(n) ? byTarget(n === 0 && r.code === 0, n, (r.out.match(/across (\d+) questions/) || [''])[0]) : notMeasured(`could not read the lint output (exit ${r.code})`); } },
  { id: 'A3', section: 'data', text: 'Every count a document states matches the generated inventory.',
    check: 'npm run stats:check', good: 'none published', best: 'counts derived, never typed', target: 'no drift', doc: 'AGENTS.md Rule 6',
    measure: ({ lint }) => { const r = lint['stats:check']; if (!r) return notMeasured('lint not run (--no-run)'); return byTarget(r.code === 0, r.code === 0 ? 'no drift' : 'drift', null); } },
  { id: 'A4', section: 'data', text: 'Every data integrity lint passes on main (lint:data, 70+ checks).',
    check: 'npm run lint:data (CI Build on every pull request)', good: 'green CI', best: 'same', target: 'green on every main commit', doc: 'package.json lint:data',
    measure: ({ ci }) => (ci?.build ? byTarget(ci.build.conclusion === 'success', `Build ${ci.build.conclusion} on ${ci.build.sha}`, null) : notMeasured('main CI not read (gh missing, offline or --no-run)')) },

  // Speed
  { id: 'S1', section: 'speed', text: 'A tap answers within 100 ms on a phone with the CPU slowed 4x (INP), the answer tap included.',
    check: 'npm run perf (by hand); perf-baseline.json', good: 'Core Web Vitals: INP 200 ms', best: 'RAIL: input handled within 50 ms, response within 100 ms; 74% of mobile sites reach 200 ms (Web Almanac 2024)', target: 'every interaction at most 100 ms', doc: 'AGENTS.md (Performance), perf-baseline.json',
    measure: ({ perf }) => { const m = perf.baseline?.metrics; if (!m) return notMeasured('perf-baseline.json missing'); const keys = ['answer.inp', 'next.inp', 'navigate.inp', 'sheet.inp']; const worst = Math.max(...keys.map((k) => m[k]?.median ?? 0)); return byTarget(worst <= 100, keys.map((k) => `${k.split('.')[0]} ${m[k]?.median}`).join(', ') + ' ms', `recorded ${ageDays(perf.baseline.meta?.recordedAt)} days ago`); } },
  { id: 'S2', section: 'speed', text: 'No long task (over 50 ms) runs inside an interaction.',
    check: 'npm run perf; perf-baseline.json interactions.longTasks', good: 'RAIL: idle work in chunks of 50 ms', best: 'RAIL: 0 tasks over 50 ms during input', target: '0', doc: 'AGENTS.md (Performance)',
    measure: ({ perf }) => { const m = perf.baseline?.metrics; if (!m?.['interactions.longTasks']) return notMeasured('perf-baseline.json missing'); const n = m['interactions.longTasks'].median; return byTarget(n === 0, `${n} long tasks, ${m['interactions.blocking']?.median} ms blocking`, null); } },
  { id: 'S3', section: 'speed', text: 'Home and a wiki article paint their largest content within 1.5 s on a phone with the CPU slowed 4x.',
    check: 'npm run perf; perf-baseline.json', good: 'Core Web Vitals: LCP 2.5 s (59% of mobile sites, Web Almanac 2024)', best: 'RAIL: repeat loads under 2 s', target: 'at most 1,500 ms', doc: 'perf-baseline.json',
    measure: ({ perf }) => { const m = perf.baseline?.metrics; if (!m) return notMeasured('perf-baseline.json missing'); const h = m['home.lcp']?.median, w = m['wiki.lcp']?.median; return byTarget(h <= 1500 && w <= 1500, `home ${h}, wiki ${w} ms`, null); } },
  { id: 'S4', section: 'speed', text: 'Nothing moves after first paint: layout shift is 0 on Home, practice, results and a wiki article.',
    check: 'tests/e2e/perf-budget.spec.js (CI); perf-budgets.json cls', good: 'Core Web Vitals: CLS 0.1', best: 'CLS 0 (79% of mobile sites reach 0.1, Web Almanac 2024)', target: '0', doc: 'perf-budgets.json',
    measure: ({ perf }) => { const c = perf.budgets?.cls?.projects; if (!c) return notMeasured('perf-budgets.json missing'); const vals = Object.values(c).flatMap((p) => Object.values(p).map((x) => x.measured)); const worst = Math.max(...vals); return byTarget(worst === 0, `worst ${worst} over ${vals.length} page and engine pairs`, null); } },
  { id: 'S5', section: 'speed', text: 'The first load fetches at most 150 KB of JavaScript, gzipped.',
    check: 'npm run perf:budget (after a build); perf-budgets.json', good: '365 KiB compressed JS for a 3 s load on a P75 phone (Russell, "Performance Inequality Gap 2024")', best: 'median first-party JS 168 KB, p25 68 KB (Web Almanac 2024, mobile)', target: 'at most 150,000 bytes gzipped', doc: 'perf-budgets.json, docs/GITFLOW.md section 1',
    measure: ({ perf }) => { const r = perf.budgets?.bundle?.routes?.firstLoad; if (!r) return notMeasured('perf-budgets.json missing'); return byTarget(r.js.measured <= 150_000, `${r.js.measured} bytes JS, ${r.css.measured} CSS`, 'as recorded in perf-budgets.json'); } },
  { id: 'S6', section: 'speed', text: 'No route outgrows its size budget.',
    check: 'npm run perf:budget (CI Build)', good: 'the alarm stays silent', best: 'same', target: 'every route within budget', doc: 'perf-budgets.json',
    measure: ({ ci }) => (ci?.build ? byTarget(ci.build.conclusion === 'success', `Build ${ci.build.conclusion}`, 'perf:budget runs inside Build') : notMeasured('main CI not read')) },
  { id: 'S7', section: 'speed', text: 'A first visit to Home makes at most 40 requests and fetches at most 250 KB of images on a phone.',
    check: 'tests/e2e/perf-budget.spec.js (CI); perf-budgets.json firstLoad', good: 'median mobile page: 66 requests, 900 KB of images (Web Almanac 2024)', best: 'p10 to p25: 22 to 39 requests, 62 to 263 KB of images (Web Almanac 2024)', target: 'at most 40 requests and 250,000 image bytes', doc: 'perf-budgets.json, AGENTS.md (Performance)',
    measure: ({ perf }) => { const p = perf.budgets?.firstLoad?.projects?.['chromium-mobile']; if (!p) return notMeasured('perf-budgets.json missing'); return byTarget(p.requests.measured <= 40 && p.imageBytes.measured <= 250_000, `${p.requests.measured} requests, ${p.imageBytes.measured} image bytes`, 'as recorded in perf-budgets.json'); } },
  { id: 'S8', section: 'speed', text: 'The app ships at most three text font files, 150 KB in all, and fetches no font from another host.',
    check: 'npm run standard (sizes of the woff2 files public/fonts holds)', good: 'median mobile homepage: 111 KB of fonts (Web Almanac 2024)', best: 'p25: 1 font request (Web Almanac 2024)', target: 'at most 3 files, 150,000 bytes', doc: 'docs/DESIGN_SYSTEM.md (Typography)',
    measure: () => { let files = []; try { files = fs.readdirSync(path.join(ROOT, 'public/fonts')).filter((f) => f.endsWith('.woff2')); } catch {} if (!files.length) return notMeasured('public/fonts not found'); const bytes = files.reduce((s, f) => s + fs.statSync(path.join(ROOT, 'public/fonts', f)).size, 0); const remote = [...new Set([...(read('index.html') || '').matchAll(/fonts\.googleapis\.com\/css2\?([^"']+)/g)].flatMap((m) => [...m[1].matchAll(/family=([^:&]+)/g)].map((x) => x[1].replace(/\+/g, ' '))))]; return byTarget(files.length <= 3 && bytes <= 150_000 && remote.length === 0, `${files.length} local files, ${bytes} bytes; ${remote.length} families from Google Fonts`, `local files shipped, not all fetched on every visit${remote.length ? `; remote: ${remote.join(', ')}` : ''}`); } },
  { id: 'S9', section: 'speed', text: 'The next screen is ready before the tap: opening a main screen from Home fetches nothing new.',
    check: 'walked by hand', good: 'a spinner on navigation', best: 'prerender or prefetch of likely next pages (Modern Web Guidance, performance guides)', target: '0 network requests on the tap for the six main screens', doc: 'docs/ux/journeys.md',
    measure: () => hand(null, 'an e2e spec that waits for idle on Home, then counts requests made by tapping each bottom-bar destination') },

  // Stability and bugs
  { id: 'B1', section: 'stability', text: 'Main is green: the last Smoke E2E on main passed.',
    check: 'gh run list --branch main --workflow smoke-e2e.yml', good: 'green most of the time', best: 'green on every commit', target: 'green on every main commit', doc: 'AGENTS.md (OWNER DECISION 2026-10-22)',
    measure: ({ ci }) => (ci?.smoke ? byTarget(ci.smoke.conclusion === 'success', `Smoke ${ci.smoke.conclusion} on ${ci.smoke.sha}`, null) : notMeasured('main CI not read (gh missing, offline or --no-run)')) },
  { id: 'B2', section: 'stability', text: 'No screen prints a console error, fails a request, draws blank, stays loading, scrolls sideways or prints undefined, NaN or null (the route sweep), and its known-failure list is empty.',
    check: 'npm run test:e2e:sweep (after a build)', good: 'Lighthouse "errors in console": 0 on the page tested', best: 'the same on every route, every persona', target: 'every route passes, KNOWN empty', doc: 'AGENTS.md Rule 12, tests/e2e/route-sweep.spec.js',
    measure: ({ sweep }) => {
      const spec = read('tests/e2e/route-sweep.spec.js') || '';
      const known = (spec.match(/const KNOWN = \[([\s\S]*?)\n\];/) || [, ''])[1].split('\n').filter((l) => /route\s*:/.test(l)).length;
      if (!sweep) return known === 0 ? notMeasured(`KNOWN is empty; no sweep result given (--sweep=FILE)`, `KNOWN ${known}`) : notMet(`KNOWN ${known}`, 'no sweep result given');
      return byTarget(sweep.failed === 0 && known === 0, `${sweep.passed} passed, ${sweep.failed} failed, KNOWN ${known}`, sweep.file);
    } },
  { id: 'B3', section: 'stability', text: 'The route sweep runs on every pull request.',
    check: 'npm run standard (reads .github/workflows/smoke-e2e.yml)', good: 'on demand', best: 'on every change', target: 'in the required checks', doc: 'AGENTS.md Rule 12',
    measure: () => { const y = read('.github/workflows/smoke-e2e.yml') || ''; const on = /route-sweep|VMX_ROUTE_SWEEP|test:e2e:sweep/.test(y); return byTarget(on, on ? 'in CI' : 'on demand only', 'AGENTS.md: gates after 4 Dec'); } },
  { id: 'B4', section: 'stability', text: 'No e2e spec failed both attempts on a main commit whose pull request had passed (no flake).',
    check: 'node scripts/ci-reuse-shadow-report.mjs --since=<date>', good: 'retries hide flakes', best: '0 flakes', target: '0 over the last 30 days', doc: 'AGENTS.md (E2E and CI)',
    measure: () => notMeasured('needs the GitHub API and minutes; last report 9 Nov: 2 of 24 would-skip pushes red (read-aloud.spec.js:152, library-doc-open.spec.js:97)') },
  { id: 'B5', section: 'stability', text: 'Every bug fix lands with a guard shown failing on the old code.',
    check: 'walked by hand (review)', good: 'a fix', best: 'a fix plus a regression test', target: 'every fix', doc: 'AGENTS.md Rule 12',
    measure: () => hand(null, 'a pull request template section "Guard" that a CI step requires on fix: titles') },

  // Works everywhere
  { id: 'W1', section: 'everywhere', text: 'The e2e suite runs on all four engines (Chromium desktop and phone, WebKit phone, Firefox desktop) on every pull request.',
    check: 'npm run standard (reads .github/workflows/smoke-e2e.yml)', good: 'one engine', best: 'every engine students use', target: '4 of 4', doc: 'AGENTS.md (E2E and CI)',
    measure: () => { const y = read('.github/workflows/smoke-e2e.yml') || ''; const want = ['chromium-desktop', 'chromium-mobile', 'webkit-mobile', 'firefox-desktop']; const have = want.filter((p) => y.includes(`project: ${p}`)); return byTarget(have.length === 4, `${have.length}/4`, have.join(', ')); } },
  { id: 'W2', section: 'everywhere', text: 'Every route renders at 320, 390 and 1280 px wide with no sideways scroll, in every engine.',
    check: 'npm run test:e2e:sweep (390 px, phone engines only today)', good: '390 px on one engine', best: '320 px to desktop in every engine', target: '3 widths x 4 engines', doc: 'tests/e2e/route-sweep.spec.js',
    measure: () => notMet('390 px, Chromium and WebKit phone', 'the sweep runs one width; 320 px and desktop and Firefox are not swept') },
  { id: 'W3', section: 'everywhere', text: 'No div, span, li or cell takes a click without a role (keyboard and screen reader can reach every action).',
    check: 'npm run standard (static JSX scan)', good: 'WCAG 2.2 SC 2.1.1 (A)', best: 'native elements for every control', target: '0', doc: 'docs/DESIGN_SYSTEM.md (Accessibility invariants)',
    measure: ({ jsx }) => byTarget(jsx.clickNoRole.length === 0, jsx.clickNoRole.length, jsx.clickNoRole.slice(0, 3).join(', ')) },
  { id: 'W4', section: 'everywhere', text: 'Every image has an alt attribute (empty for decoration).',
    check: 'npm run standard (static JSX scan)', good: 'WCAG 2.2 SC 1.1.1 (A)', best: 'same', target: '0 missing', doc: 'docs/DESIGN_SYSTEM.md',
    measure: ({ jsx }) => byTarget(jsx.imgNoAlt.length === 0, jsx.imgNoAlt.length, jsx.imgNoAlt.slice(0, 3).join(', ')) },
  { id: 'W5', section: 'everywhere', text: 'The page declares Thai as its language.',
    check: 'npm run standard (reads index.html)', good: 'WCAG 2.2 SC 3.1.1 (A)', best: 'same', target: 'lang="th"', doc: 'index.html',
    measure: () => { const h = read('index.html') || ''; const lang = (h.match(/<html[^>]*lang="([^"]+)"/) || [])[1]; return byTarget(lang === 'th', lang || 'none', null); } },
  { id: 'W6', section: 'everywhere', text: 'Nothing that could work offline waits on the network: a screen opened once opens offline, and one never opened says so in plain words with a retry.',
    check: 'tests/e2e/connectivity-status.spec.js and atlas-offline.spec.js (CI); walked by hand for the rest', good: 'an offline banner', best: 'offline-first study (service worker cache, local writes synced later)', target: 'every screen a student opened once works offline', doc: 'docs/UPDATE-AND-FLOW-CONTRACT.md, docs/ux/journeys.md J11',
    measure: () => hand('2026-10-21 J11; ErrorBoundary now names the offline case', 'a sweep pass with the network cut after one online visit per route') },
  { id: 'W7', section: 'everywhere', text: 'Every screen works with the keyboard alone and is named for a screen reader.',
    check: 'walked by hand', good: 'WCAG 2.2 AA', best: 'an automated accessibility scan (axe) at 0 violations on every route', target: '0 violations on every route', doc: 'docs/DESIGN_SYSTEM.md',
    measure: () => hand('2026-08-12 scoped WCAG pass (docs/UX_AUDIT.md)', 'run an accessibility rule engine inside the route sweep and add its findings to KNOWN') },

  // Release
  { id: 'R1', section: 'release', text: 'Every pull request a student can see states its layout and its four states, through the pull request template.',
    check: 'npm run standard (looks for .github/pull_request_template.md)', good: 'a free-form description', best: 'a template the reviewer checks against', target: 'a template with loading, empty, error and offline', doc: 'AGENTS.md Rule 11',
    measure: () => { const t = read('.github/pull_request_template.md') || read('.github/PULL_REQUEST_TEMPLATE.md') || ''; const ok = ['loading', 'empty', 'error', 'offline'].every((w) => t.toLowerCase().includes(w)); return byTarget(ok, t ? (ok ? 'template has all four' : 'template lacks a state') : 'no template', null); } },
  { id: 'R2', section: 'release', text: 'A wave merges only after its changed paths are walked on a production build at phone and desktop width and the route sweep passes, signed in the pull request.',
    check: 'walked by hand', good: 'green CI', best: 'not found as a measured figure', target: 'every wave', doc: 'docs/VETMOCK-STANDARD.md (The release rule)',
    measure: () => hand(null, 'B3 (the sweep in CI) plus R1 (the template line "Walked on ... at ...")') },
];

// ---------- run ----------

export async function measureAll({ run = true, sweepFile = null } = {}) {
  const t0 = Date.now();
  const LINTS = ['lint:ui-copy', 'lint:answer-voice', 'lint:hex-budget', 'lint:css-tokens', 'lint:accent-tokens', 'lint:thai-orthography', 'lint:glossary', 'lint:question-standard', 'lint:question-voice', 'stats:check'];
  const lint = {};
  let scorecard = exists('scripts/scorecard.mjs') ? { skipped: true } : null;
  let ci = null;
  if (run) {
    const jobs = LINTS.map(async (s) => { lint[s] = await npmRun(s); });
    if (scorecard) jobs.push((async () => {
      const r = await runCmd('node', ['scripts/scorecard.mjs', '--json']);
      let rows = null;
      try { const j = JSON.parse(r.out.slice(r.out.indexOf('{') >= 0 && (r.out.indexOf('[') < 0 || r.out.indexOf('{') < r.out.indexOf('[')) ? r.out.indexOf('{') : r.out.indexOf('['))); rows = Array.isArray(j) ? j : (j.rows || j.properties || j.clauses || null); } catch {}
      scorecard = { code: r.code, rows };
    })());
    jobs.push((async () => {
      const q = async (wf) => {
        const r = await runCmd('gh', ['run', 'list', '--branch', 'main', '--workflow', wf, '--limit', '5', '--json', 'conclusion,headSha,status'], { timeout: 20_000 });
        if (r.code !== 0) return null;
        try { const done = JSON.parse(r.out).find((x) => x.status === 'completed'); return done ? { conclusion: done.conclusion, sha: done.headSha.slice(0, 8) } : null; } catch { return null; }
      };
      const [build, smoke] = await Promise.all([q('build.yml'), q('smoke-e2e.yml')]);
      ci = build || smoke ? { build, smoke } : null;
    })());
    await Promise.all(jobs);
  }
  const ctx = { css: scanCss(), jsx: scanJsx(), contrastPairs: themeContrast(), perf: perfNumbers(), lint, scorecard, ci, sweep: parseSweep(sweepFile) };
  const results = CLAUSES.map((c) => {
    let r;
    try { r = c.measure(ctx); } catch (e) { r = notMeasured(`check crashed: ${e.message}`); }
    return { id: c.id, section: c.section, text: c.text, check: c.check, good: c.good, best: c.best, target: c.target, doc: c.doc, status: r.status, value: r.value ?? null, note: r.note ?? null };
  });
  const totals = Object.fromEntries(STATUSES.map((s) => [s, results.filter((r) => r.status === s).length]));
  const bySection = Object.fromEntries(SECTIONS.map((s) => [s, Object.fromEntries(STATUSES.map((st) => [st, results.filter((r) => r.section === s && r.status === st).length]))]));
  return { generatedAt: new Date().toISOString(), ms: Date.now() - t0, ran: run, totals, bySection, clauses: results, details: { css: ctx.css, jsx: { ...ctx.jsx, core: undefined }, contrast: ctx.contrastPairs } };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const sweepFile = (args.find((a) => a.startsWith('--sweep=')) || '').slice(8) || null;
  const report = await measureAll({ run: !args.includes('--no-run'), sweepFile });
  if (args.includes('--json')) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    const mark = { met: 'met         ', 'not met': 'NOT MET     ', 'not measured': 'not measured' };
    for (const s of SECTIONS) {
      console.log(`\n${s}`);
      for (const c of report.clauses.filter((x) => x.section === s)) {
        console.log(`  ${c.id.padEnd(4)} ${mark[c.status]}  ${c.value ?? ''}${c.status !== 'met' && c.note ? `  (${c.note})` : ''}`);
      }
    }
    const t = report.totals;
    console.log(`\nVetMock Standard: ${t.met} met, ${t['not met']} not met, ${t['not measured']} not measured, of ${report.clauses.length} clauses (${(report.ms / 1000).toFixed(1)} s). docs/VETMOCK-STANDARD.md`);
  }
  process.exit(0);
}
