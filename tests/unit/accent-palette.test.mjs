// "สีของฉัน" (src/lib/prefs/accent.js) and the six named palettes: a palette
// a student can pick cannot make the screen unreadable, computed here for
// every hue 0-359 and for every palette block in styles.css, light and dark.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  deriveTheme, accentCss, parseHue, contrast, mix, oklabDistance, BASE,
} from '../../src/lib/prefs/accent.js';
import { PALETTE_IDS } from '../../src/lib/prefs/table.js';

const AA = 4.5;
const UI = 3;

test('every hue, light and dark: text, muted text, the primary button, the focus ring and the verdicts', () => {
  const failures = [];
  for (const theme of ['light', 'dark']) {
    const b = BASE[theme];
    for (let h = 0; h < 360; h += 1) {
      const v = deriveTheme(h, theme);
      const fail = (what) => failures.push(`${theme} ${h}: ${what}`);
      for (const [k, x] of Object.entries(v)) if (!/^#[0-9a-f]{6}$/.test(x)) fail(`${k} is ${x}`);
      // body and muted text are the page's own and are untouched by the hue
      for (const s of [b.bg, b.surface, b.surface2]) {
        if (contrast(b.ink, s) < AA) fail('body text');
        if (contrast(b.inkSoft, s) < AA) fail('muted text');
      }
      if (contrast(v['--vmx-color-learning-on'], v['--vmx-color-learning']) < AA) fail('primary button label');
      if (contrast(v['--clr-sage-on'], v['--clr-sage']) < AA) fail('label on the accent fill');
      for (const s of [b.bg, b.surface]) if (contrast(v['--clr-sage'], s) < UI) fail('focus ring / accent against the page');
      const tints = ['--clr-sage', '--clr-gold'].flatMap((a) => [mix(v[a], b.surface, 0.12), mix(v[a], b.surface2, 0.12)]);
      for (const s of [b.bg, b.surface, b.surface2, ...tints]) {
        if (contrast(v['--clr-sage-text'], s) < AA) fail('accent text');
        if (contrast(v['--clr-gold-text'], s) < AA) fail('second accent text');
      }
      if (contrast(v['--clr-gold-on'], v['--clr-gold']) < AA) fail('label on the second accent');
      if (oklabDistance(v['--clr-sage'], b.correct) < 0.09) fail('accent looks like a right answer');
      if (oklabDistance(v['--clr-sage'], b.wrong) < 0.09) fail('accent looks like a wrong answer');
    }
  }
  assert.deepEqual(failures, []);
});

test('the derived sheet only holds what the pre-paint check lets through', () => {
  const allowed = /^[\[\]a-z0-9="#:;{}. -]+$/i;
  for (let h = 0; h < 360; h += 7) assert.match(accentCss(h), allowed);
  assert.ok(accentCss(10).startsWith('[data-palette="custom"]{'));
  // The same allow-list is written into index.html's script.
  assert.ok(readFileSync(new URL('../../index.html', import.meta.url), 'utf8').includes('/^[\\[\\]a-z0-9="#:;{}. -]+$/i'));
});

test('a stored hue is an integer 0-359 and nothing else', () => {
  for (const ok of ['0', '359', '42', 7]) assert.equal(parseHue(ok), Number(ok));
  for (const bad of [null, undefined, '', '360', '-1', '1.5', '1e2', ' 4', '0x10', '__proto__', '9'.repeat(400), {}, []]) assert.equal(parseHue(bad), null, String(bad).slice(0, 20));
});

// ── The named palettes, read straight from styles.css ───────────────────────
const CSS = readFileSync(new URL('../../src/styles.css', import.meta.url), 'utf8');
function block(sel) {
  const at = CSS.indexOf(`\n${sel} {`);
  if (at === -1) return {};
  const body = CSS.slice(at, CSS.indexOf('\n}', at));
  const vars = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
function resolved(theme, palette) {
  const base = theme === 'light' ? block(':root, [data-theme="light"]') : { ...block(':root, [data-theme="light"]'), ...block('[data-theme="dark"]') };
  const p = palette === 'default' ? {} : { ...block(`[data-palette="${palette}"]`), ...block(`[data-theme="${theme}"][data-palette="${palette}"]`) };
  const all = { ...base, ...p };
  const get = (name, depth = 0) => {
    const v = all[name];
    if (!v || depth > 8) return null;
    const ref = /^var\(--([\w-]+)\)$/.exec(v);
    return ref ? get(ref[1], depth + 1) : v;
  };
  return get;
}

test('the six named palettes keep AA for body, muted, accent text and the primary button', () => {
  const failures = [];
  for (const palette of PALETTE_IDS.filter((p) => p !== 'custom')) {
    for (const theme of ['light', 'dark']) {
      const get = resolved(theme, palette);
      const hex = (n) => { const v = get(n); return /^#[0-9a-f]{6}$/i.test(v || '') ? v.toLowerCase() : /^#fff$/i.test(v || '') ? '#ffffff' : null; };
      const surfaces = ['clr-bg', 'clr-surface', 'clr-surface-2'].map(hex);
      const need = (ok, what) => { if (!ok) failures.push(`${palette}/${theme}: ${what}`); };
      for (const name of ['clr-ink', 'clr-ink-soft', 'clr-sage', 'clr-sage-text', 'vmx-color-learning', 'vmx-color-learning-on']) need(hex(name), `${name} unresolved (${get(name)})`);
      if (failures.length) continue;
      for (const s of surfaces) {
        need(contrast(hex('clr-ink'), s) >= AA, 'body text');
        need(contrast(hex('clr-ink-soft'), s) >= AA, 'muted text');
        need(contrast(hex('clr-sage-text'), s) >= AA, `accent text on ${s}`);
      }
      need(contrast(hex('vmx-color-learning-on'), hex('vmx-color-learning')) >= AA, 'primary button');
      need(contrast(hex('clr-sage'), hex('clr-bg')) >= UI, 'focus ring');
    }
  }
  assert.deepEqual(failures, []);
});

test('every palette the table offers has its CSS (custom has its derived sheet)', () => {
  for (const id of PALETTE_IDS) {
    if (id === 'default' || id === 'custom') continue;
    assert.ok(CSS.includes(`[data-palette="${id}"] {`), id);
  }
});
