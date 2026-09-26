// ============================================================
// challenge-verdict-contrast.test.mjs — the challenge kicker reads in both themes
// ============================================================
// B43 (bug hunt 2026-09-26). The challenge box on Results painted its 12 px
// bold kicker "ผลการท้า จาก …" in fixed hex verdict colours (#4a6b4a,
// #a73d4a, #b88940) over a 12% tint of the same colour: 2.7:1 in dark mode
// for win and lose, 2.5:1 in light mode for a tie. Text that size needs
// 4.5:1. The rest of Results already uses the --clr-*-text tokens.
//
// The test reads the colour the kicker actually uses out of the JSX, resolves
// it against styles.css, lays the box tint over the page and measures.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(rel, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const css = read('../../src/styles.css');
const results = read('../../src/views/ResultsView.jsx');

const cssBlock = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `styles.css no longer has ${selector}`);
  return css.slice(at, css.indexOf('\n}', at));
};
const tokensOf = (text) => Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const LIGHT = tokensOf(cssBlock(':root, [data-theme="light"]'));
const DARK = { ...LIGHT, ...tokensOf(cssBlock('[data-theme="dark"]')) };

const hexRgb = (h) => {
  let s = h.slice(1);
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
function rgbOf(value, tokens) {
  const v = value.trim();
  if (v.startsWith('#')) return hexRgb(v);
  const m = v.match(/^var\((--[\w-]+)(?:,\s*(.+))?\)$/);
  if (m) return tokens[m[1]] != null ? rgbOf(tokens[m[1]], tokens) : rgbOf(m[2], tokens);
  throw new Error(`cannot resolve colour ${v}`);
}
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const over = (tint, base, alpha) => tint.map((c, i) => c * alpha + base[i] * (1 - alpha));

// The verdictMeta entry for one verdict, as an object of its string fields.
function verdictEntry(verdict) {
  const at = results.indexOf('const verdictMeta = {');
  assert.ok(at >= 0, 'the challenge box no longer builds verdictMeta');
  const line = results.slice(at).match(new RegExp(`\\n\\s+${verdict}:\\s+\\{([^\\n]+)\\},?\\n`));
  assert.ok(line, `verdictMeta has no ${verdict} entry`);
  return Object.fromEntries([...line[1].matchAll(/(\w+): '([^']+)'/g)].map((m) => [m[1], m[2]]));
}

test('B43: the challenge kicker reads at 4.5:1 for every verdict, in light and dark', () => {
  const kicker = results.match(/className="vmx-kicker" style=\{\{ color: verdictMeta\.(\w+), marginBottom: 6 \}\}>\s*\n\s*ผลการท้า/);
  assert.ok(kicker, 'the challenge kicker no longer takes its colour from verdictMeta');
  const field = kicker[1];
  for (const verdict of ['win', 'lose', 'tie']) {
    const entry = verdictEntry(verdict);
    const text = entry[field];
    const tint = entry.tint ?? entry.color;
    assert.ok(text && tint, `${verdict}: no text or tint colour`);
    for (const [theme, tokens] of [['light', LIGHT], ['dark', DARK]]) {
      for (const base of ['--clr-bg', '--clr-surface']) {
        // The strongest corner of the gradient is a 12% tint.
        const bg = over(rgbOf(tint, tokens), rgbOf(`var(${base})`, tokens), 0.12);
        const r = ratio(rgbOf(text, tokens), bg);
        assert.ok(r >= 4.5, `${verdict} ${theme} on ${base}: ${text} is ${r.toFixed(2)}:1`);
      }
    }
  }
});

test('B43: the verdict colours are theme tokens, not fixed hex', () => {
  for (const verdict of ['win', 'lose', 'tie']) {
    for (const [key, value] of Object.entries(verdictEntry(verdict))) {
      if (key === 'icon' || key === 'label' || key === 'copy') continue;
      assert.match(value, /^var\(--clr-/, `${verdict}.${key} is ${value}`);
    }
  }
});
