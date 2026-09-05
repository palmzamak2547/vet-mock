// ============================================================
// a11y-inline-floors.test.mjs — inline styles must not defeat the
// stylesheet's accessibility floors
// ============================================================
// styles.css keeps every text control at >= 16px (iOS Safari zooms the
// page when a focused control is smaller — inside an exam that is a
// zoom-and-reflow on the clock, and the page stays zoomed after the dialog
// closes) and every label at >= 4.5:1. Neither rule carries !important, so
// an inline `fontSize: 14` or a hardcoded '#888' quietly wins. Three places
// did exactly that:
//
//   - ConfirmDialog's prompt textarea/input — the 'แจ้งปัญหาข้อนี้' report a
//     student opens mid-exam — at 14px inline.
//   - SmartGrader's calibration submit: `predicted` starts '', so the
//     button renders disabled first, and its label was white on
//     --clr-surface-2 (~1.2:1) — a blank cream pill until a digit was typed.
//   - QuestionManagerView's multi-select hint (the only place Shift+click is
//     explained): #888 on a 4% white wash over the cream page, ~3.1:1 in the
//     default light theme.
//
// A browser cannot be driven from here, so these read the JSX and resolve
// the colour tokens straight out of styles.css, the way lint-accent-tokens
// does, and check the numbers the stylesheet promises.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const CSS = read('../../src/styles.css');
const confirmDialog = read('../../src/components/ConfirmDialog.jsx');
const smartGrader = read('../../src/components/SmartGrader.jsx');
const questionManager = read('../../src/views/QuestionManagerView.jsx');

// ── Token resolution ──────────────────────────────────────────────────

/** The custom properties declared in one top-level block of styles.css. */
function tokenBlock(selector) {
  const at = CSS.indexOf(`${selector} {`);
  assert.notEqual(at, -1, `${selector} block is missing from styles.css`);
  const end = CSS.indexOf('\n}', at);
  const block = CSS.slice(at, end).replace(/\/\*[\s\S]*?\*\//g, '');
  return Object.fromEntries(
    [...block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)].map((m) => [m[1], m[2].trim()]),
  );
}

const LIGHT = tokenBlock(':root, [data-theme="light"]');
// Dark only overrides; anything it does not name is inherited from light.
const DARK = { ...LIGHT, ...tokenBlock('[data-theme="dark"]') };
const THEMES = { light: LIGHT, dark: DARK };

/** A CSS colour (hex, rgb/rgba, or var() over the given tokens) as [r,g,b,a]. */
function rgb(value, tokens, depth = 0) {
  assert.ok(depth < 8, `token cycle while resolving ${value}`);
  const v = String(value).trim();
  let m;
  if ((m = v.match(/^var\((--[a-z0-9-]+)(?:,\s*([^)]+))?\)$/i))) {
    const def = tokens[m[1]];
    assert.ok(def || m[2], `${m[1]} is not a token in styles.css and has no fallback`);
    return rgb(def || m[2], tokens, depth + 1);
  }
  if ((m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i))) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  if ((m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/))) {
    return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  }
  assert.fail(`cannot read the colour ${value}`);
}

/** Composite a (possibly translucent) colour over an opaque one. */
const over = (top, base) => [0, 1, 2].map((i) => Math.round(top[i] * top[3] + base[i] * (1 - top[3]))).concat(1);

const luminance = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ── JSX extraction ────────────────────────────────────────────────────

/** The opening tag of the <tag> that carries `marker`, up to its `/>`. */
function control(src, tag, marker) {
  const at = src.indexOf(marker);
  assert.notEqual(at, -1, `${marker} is no longer in the source`);
  const open = src.lastIndexOf(`<${tag}`, at);
  const close = src.indexOf('/>', at);
  assert.ok(open !== -1 && close !== -1, `could not isolate the <${tag}> around ${marker}`);
  return src.slice(open, close);
}

const inlineFontSize = (jsx) => {
  const m = jsx.match(/\bfontSize:\s*([\d.]+)/);
  return m ? +m[1] : null;
};

// ── 16px floor ────────────────────────────────────────────────────────

test('the stylesheet still floors text controls at 16px', () => {
  assert.match(
    CSS,
    /input\[type="text"\][^{]*textarea[^{]*\{ font-size: max\(16px, 1em\); \}/,
    'the iOS anti-zoom floor for inputs/textareas is gone from styles.css',
  );
});

test("the report-a-question prompt's textarea and input stay at the 16px floor", () => {
  for (const [tag, marker] of [['textarea', 'rows={3}'], ['input', 'type="text"']]) {
    const size = inlineFontSize(control(confirmDialog, tag, marker));
    assert.ok(
      size === null || size >= 16,
      `ConfirmDialog <${tag}> sets fontSize ${size} inline — below 16px iOS zooms on focus, mid-exam`,
    );
  }
});

test("the calibration score input stays at the 16px floor", () => {
  const size = inlineFontSize(control(smartGrader, 'input', 'type="number"'));
  assert.ok(size === null || size >= 16, `SmartGrader number input sets fontSize ${size} inline`);
});

// ── Calibration submit ────────────────────────────────────────────────

function calibrationButton() {
  const at = smartGrader.indexOf('ทาย → เริ่มตรวจ');
  assert.notEqual(at, -1, 'the calibration submit label moved');
  const open = smartGrader.lastIndexOf('<button', at);
  assert.notEqual(open, -1, 'no <button> before the calibration label');
  return smartGrader.slice(open, at);
}

/** An inline style value that is either a literal or a `predicted ? a : b`. */
function byState(jsx, name) {
  const m = jsx.match(new RegExp(`\\b${name}: (?:predicted \\? '([^']+)' : '([^']+)'|'([^']+)')`));
  assert.ok(m, `${name} is not set inline on the calibration button`);
  return m[3] !== undefined ? { enabled: m[3], disabled: m[3] } : { enabled: m[1], disabled: m[2] };
}

test('the calibration submit is readable before a prediction is typed, in both themes', () => {
  const jsx = calibrationButton();
  assert.match(jsx, /disabled=\{!predicted\}/, 'the button should still start disabled');
  const background = byState(jsx, 'background');
  const color = byState(jsx, 'color');
  for (const [theme, tokens] of Object.entries(THEMES)) {
    for (const state of ['disabled', 'enabled']) {
      const r = ratio(rgb(color[state], tokens), rgb(background[state], tokens));
      assert.ok(
        r >= 4.5,
        `${theme} theme, ${state}: ${color[state]} on ${background[state]} reads ${r.toFixed(2)}:1`,
      );
    }
  }
});

test('the calibration submit meets the 44px touch floor without the class that dims disabled labels', () => {
  const jsx = calibrationButton();
  assert.match(jsx, /\bminHeight: 44\b/, 'the bare <button> was ~28px tall');
  // .vmx-btn:disabled is opacity 0.45 — on this button, disabled is the
  // DEFAULT state, so the class would push the label back under 4.5:1.
  assert.doesNotMatch(jsx, /className=[^>]*vmx-btn/, 'use an inline floor here, not .vmx-btn');
});

// ── Multi-select hint ─────────────────────────────────────────────────

test('the multi-select hint clears 4.5:1 on the page ground in both themes', () => {
  const at = questionManager.indexOf('คลิกที่ข้อเพื่อเลือก');
  assert.notEqual(at, -1, 'the multi-select hint text moved');
  const jsx = questionManager.slice(questionManager.lastIndexOf('<div', at), at);
  const color = jsx.match(/\bcolor: '([^']+)'/)?.[1];
  const background = jsx.match(/\bbackground: '([^']+)'/)?.[1];
  assert.ok(color && background, 'the hint must set both its colour and its background inline');
  for (const [theme, tokens] of Object.entries(THEMES)) {
    const ground = rgb('var(--clr-bg)', tokens);
    const fill = over(rgb(background, tokens), ground);
    const ink = over(rgb(color, tokens), fill);
    const r = ratio(ink, fill);
    assert.ok(r >= 4.5, `${theme} theme: ${color} on ${background} over the page reads ${r.toFixed(2)}:1`);
  }
});
