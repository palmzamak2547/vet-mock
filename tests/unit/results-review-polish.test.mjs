// ============================================================
// Results and Review: what the student reads after a set
// ============================================================
// Three small defects on the screens a student lands on after every
// revision set, each pinned where it actually went wrong: the shareable
// Story card captioned a different verdict from the screen it was shared
// from, some labels were unreadable in dark mode, and the separator the
// app does not use in UI copy crept back into this week's surfaces.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const results = read('../../src/views/ResultsView.jsx');

// ---------------------------------------------------------------
// COPY-01: the Story card's caption ladder
// ---------------------------------------------------------------
// buildScoreCard draws on a canvas and cannot be rendered here, so the
// caption ladder is lifted out of the source and run as written, with the
// same `reached` line the function itself uses.
function cardCaption({ correct, total, isWritingOnly = false }) {
  const fn = results.slice(results.indexOf('function buildScoreCard('), results.indexOf('// Phase label map'));
  const reachedLine = fn.match(/const reached = [^;]+;/)?.[0];
  const from = fn.indexOf('let msg =');
  const ladder = fn.slice(from, fn.indexOf('ctx.font', from));
  assert.ok(reachedLine && ladder.includes('msg'), 'the caption ladder must still be findable in buildScoreCard');
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  // eslint-disable-next-line no-new-func
  return new Function('PRACTICE_PASS_PCT', 'pct', 'correct', 'total', 'isWritingOnly',
    `${reachedLine}\n${ladder}\nreturn msg;`)(60, pct, correct, total, isWritingOnly);
}

// The in-app message the card has to agree with, read the same way.
function screenMessage({ correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const start = results.indexOf('const reached = score.total > 0');
  const reachedLine = results.slice(start, results.indexOf(';', start) + 1);
  const msgStart = results.indexOf('const msg = autoQs.length === 0');
  const msgExpr = results.slice(msgStart, results.indexOf(';', msgStart) + 1);
  // eslint-disable-next-line no-new-func
  return new Function('PRACTICE_PASS_PCT', 'score', 'autoQs', 'writingAttempted', 'writingQs',
    `${reachedLine}\n${msgExpr}\nreturn msg;`)(60, { correct, total, pct }, { length: total }, 0, []);
}

// Width on the 1080 px canvas is set by what the eye sees, so Thai
// combining marks (vowels above and below, tone marks) do not count.
const visibleGlyphs = (s) => [...s.replace(/\p{M}/gu, '')].length;

test('COPY-01: the Story card reaches the same verdict as the Results screen', () => {
  const cases = [
    { correct: 20, total: 20, head: 'ถูกทุกข้อ' },
    { correct: 19, total: 20, head: 'แม่นดีมาก' },
    { correct: 17, total: 20, head: 'แม่นดีมาก' },
    { correct: 13, total: 20, head: 'ถึงเกณฑ์ซ้อม' },
    { correct: 12, total: 20, head: 'ถึงเกณฑ์ซ้อม' },
    // 28/47 rounds to 60 but did not reach the bar, on either surface.
    { correct: 28, total: 47, head: 'ยังมีจุดที่ควรทบทวน' },
    { correct: 9, total: 20, head: 'ยังมีจุดที่ควรทบทวน' },
  ];
  for (const c of cases) {
    const card = cardCaption(c);
    const screen = screenMessage(c);
    assert.ok(card.startsWith(c.head), `${c.correct}/${c.total}: the card says "${card}"`);
    assert.ok(screen.startsWith(c.head), `${c.correct}/${c.total}: the screen says "${screen}"`);
  }
  assert.equal(cardCaption({ correct: 20, total: 20 }), 'ถูกทุกข้อ รักษาระดับนี้ไว้');
  assert.equal(cardCaption({ correct: 17, total: 20 }), 'แม่นดีมาก ลองเพิ่มจำนวนข้อดู');
  assert.equal(cardCaption({ correct: 13, total: 20 }), 'ถึงเกณฑ์ซ้อมแล้ว ทบทวนข้อที่ผิดต่อ');
  assert.equal(cardCaption({ correct: 9, total: 20 }), 'ยังมีจุดที่ควรทบทวน เริ่มจากข้อที่ผิด');
  assert.equal(cardCaption({ correct: 5, total: 20 }), 'เริ่มใหม่ได้เสมอ');
});

test('COPY-01: no card caption claims a pass, and every one fits the canvas line', () => {
  const captions = new Set([{ correct: 0, total: 3, isWritingOnly: true }]
    .concat(Array.from({ length: 21 }, (_, correct) => ({ correct, total: 20 })))
    .concat([{ correct: 28, total: 47 }, { correct: 0, total: 0 }])
    .map(cardCaption));
  for (const msg of captions) {
    assert.ok(!msg.includes('ผ่าน'), `the app does not grade a pass: "${msg}"`);
    assert.ok(!/ครับ|ค่ะ/.test(msg), `no polite particle appears anywhere else in UI copy: "${msg}"`);
    assert.ok(!msg.includes('ใกล้แล้ว'), `80 percent and up is not "almost there": "${msg}"`);
    // 30 is the widest caption the card has always drawn at 44 px.
    assert.ok(visibleGlyphs(msg) <= 30, `"${msg}" is ${visibleGlyphs(msg)} glyphs wide`);
  }
});

// ---------------------------------------------------------------
// UI-09: dark-mode contrast on the retry card and the review label
// ---------------------------------------------------------------
// The colours are inline style literals, so the test reads them out of the
// JSX, resolves them against the theme tokens in styles.css, and measures
// with the WCAG formula. Text under 18.66 px bold needs 4.5:1.
const css = read('../../src/styles.css');
const review = read('../../src/views/ReviewView.jsx');

const cssBlock = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `styles.css no longer has ${selector}`);
  return css.slice(at, css.indexOf('\n}', at));
};
const tokensOf = (text) => Object.fromEntries(
  [...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const LIGHT = tokensOf(cssBlock(':root, [data-theme="light"]'));
// The dark block only overrides; anything it leaves alone comes from :root.
const DARK = { ...LIGHT, ...tokensOf(cssBlock('[data-theme="dark"]')) };
const THEMES = { light: LIGHT, dark: DARK };

const hexRgb = (h) => {
  let s = h.slice(1);
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
function rgbOf(value, tokens) {
  const v = value.trim();
  if (v === 'white') return [255, 255, 255];
  if (v.startsWith('#')) return hexRgb(v);
  let m = v.match(/^var\((--[\w-]+)(?:,\s*(.+))?\)$/);
  if (m) return tokens[m[1]] != null ? rgbOf(tokens[m[1]], tokens) : rgbOf(m[2], tokens);
  // color-mix in srgb interpolates the encoded channels linearly.
  m = v.match(/^color-mix\(in srgb,\s*(\S+)\s+(\S+),\s*(.+)\)$/);
  if (m) {
    const pct = m[2].startsWith('var(') ? tokens[m[2].slice(4, -1)] : m[2];
    const f = parseFloat(pct) / 100;
    const a = rgbOf(m[1], tokens);
    const b = rgbOf(m[3], tokens);
    return a.map((x, i) => x * f + b[i] * (1 - f));
  }
  throw new Error(`cannot resolve colour ${v}`);
}
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (fg, bg, tokens) => {
  const [hi, lo] = [luminance(rgbOf(fg, tokens)), luminance(rgbOf(bg, tokens))].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

// The primary action card on Results, in either of its two variants.
function actionCard(opener) {
  const at = results.indexOf(opener);
  assert.ok(at >= 0, `the Results action card opened by ${opener} is gone`);
  const block = results.slice(at, results.indexOf('</button>', at));
  return {
    backgrounds: [...block.matchAll(/background: '([^']+)'/g)].map((m) => m[1]),
    colors: [...block.matchAll(/(?<![\w-])color: '([^']+)'/g)].map((m) => m[1]),
  };
}

test('UI-09: both Results action cards and their ลุย pills read at 4.5:1 in light and dark', () => {
  for (const opener of ['onClick={handleRedoWrong}', 'onClick={() => handleContinueMore(5)}']) {
    const { backgrounds, colors } = actionCard(opener);
    assert.equal(backgrounds.length, 2, `${opener}: one card fill and one pill fill`);
    assert.equal(colors.length, 3, `${opener}: title, subtitle and pill text`);
    const [card, pill] = backgrounds;
    const [title, subtitle, pillText] = colors;
    for (const [theme, tokens] of Object.entries(THEMES)) {
      for (const [what, fg, bg] of [['title', title, card], ['subtitle', subtitle, card], ['pill', pillText, pill]]) {
        const r = contrast(fg, bg, tokens);
        assert.ok(r >= 4.5, `${opener} ${what} in ${theme}: ${fg} on ${bg} is ${r.toFixed(2)}:1`);
      }
    }
  }
});

test('UI-09: the ลุย pills take the on-colour token, so every palette keeps its hue and its contrast', () => {
  const retry = actionCard('onClick={handleRedoWrong}');
  const more = actionCard('onClick={() => handleContinueMore(5)}');
  assert.match(retry.backgrounds[1], /^var\(--clr-rose\b/);
  assert.match(more.backgrounds[1], /^var\(--clr-sage\b/);
  // The palettes recolour sage only, so the sage pill is the one to walk.
  for (const palette of ['ocean', 'plum', 'cherry', 'mono', 'forest']) {
    const light = { ...LIGHT, ...tokensOf(cssBlock(`[data-palette="${palette}"]`)) };
    const dark = { ...DARK, ...tokensOf(cssBlock(`[data-theme="dark"][data-palette="${palette}"]`)) };
    for (const [theme, tokens] of [['light', light], ['dark', dark]]) {
      const r = contrast(more.colors[2], more.backgrounds[1], tokens);
      assert.ok(r >= 4.5, `${palette} ${theme}: the sage pill is ${r.toFixed(2)}:1`);
    }
  }
});

test('UI-09: the topic name on each reviewed question is readable on every subject colour', async () => {
  const { SUBJECTS } = await import('../../src/data/curriculum.js');
  const { subjectText } = await import('../../src/hooks/utils.js');
  const expr = review.match(/\{topicMeta \? <>, <span style=\{\{ color: (.+?), fontWeight: 600 \}\}>/)?.[1];
  assert.ok(expr, 'the topic label in the review head is gone');
  // eslint-disable-next-line no-new-func
  const colourFor = new Function('subj', 'subjectText', `return ${expr};`);
  const coloured = SUBJECTS.filter((s) => s.color);
  assert.ok(coloured.some((s) => s.color === '#8b5a3d'), 'the subject that failed at 2.65:1 must still be measured');
  // Answered rows sit on surface; skipped rows on surface-2.
  for (const s of coloured) {
    for (const [theme, tokens] of Object.entries(THEMES)) {
      for (const bg of ['var(--clr-surface)', 'var(--clr-surface-2)']) {
        const r = contrast(colourFor(s, subjectText), bg, tokens);
        assert.ok(r >= 4.5, `${s.id} topic label in ${theme} on ${bg}: ${r.toFixed(2)}:1`);
      }
    }
  }
  assert.equal(colourFor(undefined, subjectText), 'var(--clr-ink-soft)', 'no subject still falls back to the soft ink');
});
