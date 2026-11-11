// A palette re-colours the accent, never a verdict. Right and partly right
// read their own tokens (--clr-right*, --clr-part*), defined once per theme
// and set by no palette block; wrong answers read --clr-rose, which no
// palette sets either. Under cherry a right answer used to turn red beside
// the rose of a wrong one, and ocean, plum and mono gave it blue, purple and
// grey.
//
// The verdict rules are derived, not listed: any rule in any stylesheet under
// src/ whose selector names a verdict state (ok, correct, right, pass, found,
// hit, good, partial and the wrong side) or belongs to a ranked set (the
// review grade buttons, a lesson's compare panels), and any JSX line within
// eight lines below a verdict value (isCorrect, ok, correct, pct, verdict,
// hit, good, a score), must not read an accent token: --clr-sage*,
// --clr-gold*, --vmx-color-learning*, --clr-accent, or a :root alias of them
// such as --vm-green, with or without a fallback value.
//
// What it cannot see: a class composed by joining strings at run time
// (`'is-' + state`) whose state word is not written in the stylesheet, an
// inline colour more than eight lines from the value it depends on, a colour
// passed through a variable named without a verdict word, and canvas or SVG
// drawn from JavaScript constants. Those need a reader's eye.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const SRC = join(ROOT, 'src');
const walk = (dir, re, out = []) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, re, out); else if (re.test(n)) out.push(p);
  }
  return out;
};
const STYLES = walk(SRC, /\.css$/);
const rel = (p) => p.slice(ROOT.length).replace(/\\/g, '/');
const MAIN_CSS = readFileSync(join(SRC, 'styles.css'), 'utf8');

const STATE = /(?:^|[.\-_])(ok|is-ok|correct|is-correct|reveal-correct|correct-ans|correct-val|right|is-right|pass|is-pass|found|is-found|hit|is-hit|good|is-good|partial|is-partial|half|wrong|is-wrong|reveal-wrong|wrong-ans|incorrect|is-incorrect|fail|is-fail|miss|is-miss|bad|is-bad|alarm|is-alarm)(?![\w-])/;
// Ranked sets whose members are not named by a state word.
const RANKED = [/^\.vmx-sr-btn\./, /^\.vmx-lesson-compare__/];
// Classes that carry a state word but paint no verdict, each with its reason.
const NOT_VERDICTS = [
  [/^\.ad-/, 'the back office (one account), its health bars and flags'],
  [/^\.vw-found/, 'VetWiki search hits, a find, not a judged answer'],
];
// Verdict elements whose class names no state.
const NAMED = ['.vmx-check__verdict', '.vmx-check__why', '.vmx-aigrade-gap .vmx-kicker'];

// The accent tokens, and every :root alias that reads one (--vm-green ...).
function accentNames(css) {
  const names = new Set(['clr-accent']);
  const direct = /^(clr-sage|clr-gold|vmx-color-learning)/;
  const decls = [...css.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)];
  for (const [, n] of decls) if (direct.test(n)) names.add(n);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [, n, v] of decls) {
      if (names.has(n) || /^clr-(right|part|rose)/.test(n)) continue;
      if ([...v.matchAll(/var\(--([\w-]+)/g)].some(([, r]) => names.has(r))) { names.add(n); grew = true; }
    }
  }
  return names;
}
const ACCENTS = accentNames(MAIN_CSS);
const readsAccent = (text) => [...text.matchAll(/var\(\s*--([\w-]+)\s*[,)]/g)].map(([, n]) => n).find((n) => ACCENTS.has(n));

function rulesOf(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
}
export function verdictLeaks(css) {
  const leaks = [];
  for (const { sel, body } of rulesOf(css)) {
    const hit = readsAccent(body);
    if (!hit) continue;
    for (const s of sel.split(',').map((x) => x.trim())) {
      if (s.includes('[data-palette') || s.startsWith(':root') || s.startsWith('@')) continue;
      if (NOT_VERDICTS.some(([re]) => re.test(s))) continue;
      const classes = s.match(/\.[\w-]+/g) || [];
      if (classes.some((c) => STATE.test(c.slice(1))) || NAMED.includes(s) || RANKED.some((re) => re.test(s))) leaks.push(`${s} reads --${hit}`);
    }
  }
  return leaks;
}

test('no verdict rule in any stylesheet reads a palette\'s accent', () => {
  const leaks = STYLES.flatMap((f) => verdictLeaks(readFileSync(f, 'utf8')).map((l) => `${rel(f)}: ${l}`));
  assert.deepEqual(leaks, []);
});

test('the stylesheet check catches a verdict rule that forgets (mutations)', () => {
  for (const bad of [
    '.vmx-results-pill.is-ok{color:var(--clr-sage-text)}',
    '.x-card.partial .k { border-color: var(--clr-gold); }',
    '.vmx-new-score.is-pass { background: var(--vmx-color-learning); }',
    '.vmx-check__verdict { color: var(--clr-sage-text); }',
    '.x-row.is-hit { color: var(--clr-sage-text, #355a39); }',
    '.x-row.correct { color: var(--vm-green); }',
    '.x-row.good{border:1px solid var(--clr-sage)}',
    '.vmx-sr-btn.easy { border-color: var(--clr-gold); }',
    '.vmx-lesson-compare__after.is-fine { color: var(--clr-sage-text); }',
    '.x-a.is-wrong, .x-b.is-right { color: var( --clr-sage ); }',
  ]) assert.ok(verdictLeaks(`${MAIN_CSS}\n${bad}\n`).length > 0, bad);
});

const block = (sel) => {
  const at = MAIN_CSS.indexOf(`\n${sel} {`);
  const body = MAIN_CSS.slice(at, MAIN_CSS.indexOf('\n}', at));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
};
const LIGHT = block(':root, [data-theme="light"]');
const DARK = { ...LIGHT, ...block('[data-theme="dark"]') };

test('verdict tokens are the house colours in both themes, and no palette sets them or rose', () => {
  for (const t of [LIGHT, DARK]) {
    assert.equal(t['--clr-right'], t['--clr-sage']);
    assert.equal(t['--clr-right-text'], t['--clr-sage-text']);
    assert.equal(t['--clr-part'], t['--clr-gold']);
    assert.equal(t['--clr-part-text'], t['--clr-gold-text']);
  }
  for (const f of STYLES) {
    for (const { sel, body } of rulesOf(readFileSync(f, 'utf8'))) {
      if (!sel.includes('[data-palette')) continue;
      assert.doesNotMatch(body, /--clr-right|--clr-part|--clr-rose/, `${rel(f)}: ${sel}`);
    }
  }
});

// WCAG 2.x contrast of the verdict pairs drawn as text or a label.
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const resolve = (t, v) => { const m = /^var\(--([\w-]+)\)$/.exec(v); return m ? resolve(t, t[`--${m[1]}`]) : v.toLowerCase(); };

test('verdict text and labels clear 4.5 on what they sit on, in both themes', () => {
  const fails = [];
  for (const [name, t] of [['light', LIGHT], ['dark', DARK]]) {
    const c = (k) => resolve(t, t[k]);
    const pairs = [
      ['right-text on bg', c('--clr-right-text'), c('--clr-bg')],
      ['right-text on surface', c('--clr-right-text'), c('--clr-surface')],
      ['right-text on surface-2', c('--clr-right-text'), c('--clr-surface-2')],
      ['right-text on right-soft (the "ถูก" pill, the answer box label)', c('--clr-right-text'), c('--clr-right-soft')],
      ['right-on on right (option letter, the answer-key marker)', c('--clr-right-on'), c('--clr-right')],
      ['part-text on surface', c('--clr-part-text'), c('--clr-surface')],
      ['part-text on part-soft', c('--clr-part-text'), c('--clr-part-soft')],
      ['rose-text on surface', c('--clr-rose-text'), c('--clr-surface')],
    ];
    for (const [what, fg, bg] of pairs) if (contrast(fg, bg) < 4.5) fails.push(`${name} ${what}: ${contrast(fg, bg).toFixed(2)}`);
  }
  assert.deepEqual(fails, []);
});

const VERDICT_VALUE = /\b(isCorrect|isCorrectAnswer|isPartial|scorePct|liveScore|currentQ\.answer|score\.correct|accPct|r\.pct|d\.pct|cov\.pct|pct|ok|correct|verdict|verdictMeta|hit|isHit|good|overallPct)\b|Math\.abs\(gap\)/;
// Lines that read the accent next to such a word but paint no verdict,
// each reviewed (12 Nov 2026) with its reason.
const NOT_VERDICT_LINES = [
  [/ContributeView\.jsx$/, /toast\.kind === 'ok'/, 'a save toast, not a judged answer'],
  [/SyncStatusNotice\.jsx$/, /online \?/, 'the connection state'],
  [/DailyGoalCard\.jsx$/, /hit \? 'var\(--vmx-color-success\)'/, 'goal progress; the goal met is already the fixed success colour'],
  [/NightRankCard\.jsx$/, /linear-gradient\(90deg, var\(--clr-gold\)/, 'a progress bar'],
  [/QuestsPanel\.jsx$/, /^\s*: 'var\(--clr-sage\)',\s*$/, 'a quest progress bar'],
  [/XpChip\.jsx$/, /background: 'var\(--clr-sage, #4a6b4a\)'/, 'the level progress bar'],
  [/ReadingChecklistView\.jsx$/, /function ProgressBar/, 'a reading progress bar'],
  [/RaceView\.jsx$/, /isMe \? 'var\(--clr-sage\)'|i === 0 \?/, 'a race: who is ahead, not a judged answer'],
  [/OSCEDrill\.jsx$/, /must hit/, 'the word is in a tooltip'],
  [/ReportConcern\.jsx$/, /role="status"/, 'a report was sent'],
  [/TermLinkedRichText\.jsx$/, /text-decoration-color/, 'the word is in a comment about tap targets'],
  [/DashboardView\.jsx$/, /\{streak \|\| 0\}/, 'the streak count'],
  [/ResultsView\.jsx$/, /\{skipCount\}|\{hint && |เร็วกว่า/, 'skipped count, a copy hint, the faster player'],
  [/ReviewView\.jsx$/, /id: 'bookmarked'|\{hint && /, 'the bookmark filter, a share hint'],
  [/WikiLinkForQuestion\.jsx$/, /conflicts/, 'a VetWiki link, toned by its conflicts'],
];
export function jsxLeaks(text, name = '') {
  const leaks = [];
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const hit = readsAccent(line);
    if (!hit) return;
    const ctx = lines.slice(Math.max(0, i - 8), i + 1).join(' ');
    if (!VERDICT_VALUE.test(ctx)) return;
    if (NOT_VERDICT_LINES.some(([f, re]) => f.test(name) && re.test(line))) return;
    leaks.push(`${name}:${i + 1} reads --${hit}`);
  });
  return leaks;
}

test('JSX beside a verdict value reads verdict tokens, not the accent', () => {
  const leaks = walk(SRC, /\.jsx$/).flatMap((p) => jsxLeaks(readFileSync(p, 'utf8'), rel(p)));
  assert.deepEqual(leaks, []);
});

test('the JSX check catches a verdict colour that forgets (mutations)', () => {
  for (const bad of [
    "<span style={{ color: isCorrect ? 'var(--clr-sage-text)' : 'var(--clr-rose-text)' }} />",
    "const tone = pct >= 80 ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-rose)';",
    "<b style={{ color: verdict === 'win' ? 'var(--clr-accent)' : 'inherit' }} />",
    "if (ok) {\n  a();\n  b();\n  c();\n  d();\n  e();\n  return <i style={{ color: 'var(--vm-green)' }} />;\n}",
    "<div style={{ color: Math.abs(gap) <= 1 ? 'var(--clr-gold-text)' : 'var(--clr-rose-text)' }} />",
  ]) assert.ok(jsxLeaks(bad, 'Mutant.jsx').length > 0, bad);
});
