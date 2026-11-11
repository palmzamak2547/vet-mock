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

// The verdict pin itself is tests/unit/verdict-palette-pin.test.mjs.

test('"สีของฉัน" re-colours the accent only, like the named palettes', () => {
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
