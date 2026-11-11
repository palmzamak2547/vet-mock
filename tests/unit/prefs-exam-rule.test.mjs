// The exam is untouched by customization: a palette never colours a verdict,
// the wrong-answer and timer colours belong to no palette, and nothing of the
// studio is reachable from or imported by a running set.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { accentCss } from '../../src/lib/prefs/accent.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const CSS = read('src/styles.css');
const ACCENT_TOKENS = /^--(clr-sage|clr-sage-text|clr-sage-soft|clr-sage-on|clr-gold|clr-gold-text|clr-gold-soft|clr-gold-on|vmx-color-learning|vmx-color-learning-on)$/;

function pinned(theme) {
  const head = theme === 'dark' ? '[data-theme="dark"][data-palette] :is(' : '[data-palette] :is(';
  const at = CSS.indexOf(`\n${head}`);
  assert.ok(at > 0, `the ${theme} verdict pin rule exists`);
  const line = CSS.slice(at + 1, CSS.indexOf('\n', at + 1));
  const selectors = line.slice(head.length, line.indexOf(')')).split(',').map((s) => s.trim());
  const vars = Object.fromEntries([...line.matchAll(/(--[\w-]+):\s*([^;}]+)/g)].map((m) => [m[1], m[2].trim()]));
  return { selectors, vars };
}

test('every verdict style in styles.css is pinned against the palettes', () => {
  const verdictClasses = new Set();
  for (const m of CSS.matchAll(/^([^{@/\n][^{\n]*)\{/gm)) {
    for (const sel of m[1].split(',')) {
      const s = sel.trim();
      if (/\[data-palette\]/.test(s)) continue;
      const hit = /(\.[\w-]+)?\.(is-correct|correct|correct-ans|is-right|reveal-correct)(?![\w-])|\.vmx-feedback-correct-val|\.vmx-check__why(?![\w-])/.exec(s);
      if (hit) verdictClasses.add(hit[0]);
    }
  }
  const { selectors } = pinned('light');
  const dark = pinned('dark').selectors;
  assert.deepEqual(dark, selectors, 'light and dark pin the same elements');
  const missing = [...verdictClasses].filter((c) => !selectors.some((s) => s === c || s.endsWith(c)));
  assert.deepEqual(missing, []);
});

test('the pinned sage is the theme\'s own sage', () => {
  const light = pinned('light').vars;
  const dark = pinned('dark').vars;
  assert.equal(light['--clr-sage'], '#4a6b4a');
  assert.equal(dark['--clr-sage'], '#7ba87b');
  assert.match(CSS, /:root, \[data-theme="light"\] \{[^}]*--clr-sage: #4a6b4a;/);
});

test('a palette re-colours the accent only: never the wrong answer, the timer or the page', () => {
  const offenders = [];
  for (const m of CSS.matchAll(/\n(\[data-theme="(?:light|dark)"\])?\[data-palette="[\w-]+"\] \{([^}]*)\}/g)) {
    for (const v of m[2].matchAll(/(--[\w-]+)\s*:/g)) if (!ACCENT_TOKENS.test(v[1])) offenders.push(`${m[0].trim().split('{')[0]} sets ${v[1]}`);
  }
  for (const h of [0, 120, 240]) {
    for (const v of accentCss(h).matchAll(/(--[\w-]+):/g)) if (!ACCENT_TOKENS.test(v[1])) offenders.push(`custom ${h} sets ${v[1]}`);
  }
  assert.deepEqual(offenders, []);
  assert.doesNotMatch(CSS, /\.vmx-timer[^{]*\{[^}]*--clr-sage/, 'the timer reads no accent');
});

test('exam screens import nothing of the studio or the preference table', () => {
  const files = [
    ...readdirSync(new URL('../../src/views/', import.meta.url)).filter((f) => /^Exam/.test(f)).map((f) => `src/views/${f}`),
    'src/components/Question.jsx',
  ];
  assert.ok(files.length >= 2);
  for (const f of files) {
    const text = read(f);
    assert.doesNotMatch(text, /prefs\/|StudioView|StudentCard|vmx-open-studio/, f);
  }
});

test('the studio cannot be opened over a running set', () => {
  const app = read('src/App.jsx');
  const opener = app.slice(app.indexOf("window.addEventListener('vmx-open-studio'") - 300, app.indexOf("window.addEventListener('vmx-open-studio'"));
  assert.match(opener, /!FOCUS_VIEWS\.has\(viewRef\.current\)/);
  assert.match(opener, /'sr-session', 'race'/);
  assert.match(app, /const FOCUS_VIEWS = new Set\(\['exam',/);
});
