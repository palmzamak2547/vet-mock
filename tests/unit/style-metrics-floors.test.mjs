// ============================================================
// style-metrics-floors.test.mjs — what styles.css actually resolves to
// ============================================================
// Four defects the 2026-09-20 UI audit measured on real screens, each one a
// number the cascade produced rather than a number anyone wrote down:
//
//   - Thai heading metrics. On a 390px phone the subject-card title ran at
//     16px / 1.2, and the sara u under "สุข" sat on the mai tho over "เนื้อ"
//     on the next line. The Home hero h1 ran at 1.15 with -0.01em tracking,
//     against the 1.2 / 0 rule for headings that can carry Thai.
//   - Touch targets. The controls added for exam week (wrap-up strip and
//     entry buttons, the reading-mode switch, the lecturer buttons and names,
//     the topic screen's reveal switch) measured 18-39px tall against the
//     44px floor. The sticky wrap-up index takes the 36px compromise instead,
//     because at 44px the bar would cover the heading of the item it jumps to.
//   - Opacity on text. The countdown's day letters (ink-soft at 0.7, 0.45 on
//     weekends) and the XP chip's total (0.75) blended below 4.5:1.
//   - A cascade bug. `.vmx-lect-cover-foot .s { padding: 0 }` and
//     `.vmx-lect-cover .s { padding: 2px 10px 10px }` are both (0,2,0), the
//     later one won, and the session date sat 10px right of the deck title.
//
// No browser runs here, so this resolves the cascade itself: every rule in
// styles.css, its @media conditions at a given viewport width, selector
// specificity, source order, !important, inheritance, and the one piece of
// the user-agent sheet that matters for these properties (form controls
// reset line-height and letter-spacing to `normal`). The selector matcher
// knows type, class, id and attribute selectors joined by descendant or
// child combinators; a selector with any pseudo-class is a state (hover,
// focus, disabled, :has) and is treated as not matching the resting element.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const CSS = read('../../src/styles.css');
const XP_CHIP = read('../../src/components/XpChip.jsx');

// ── Stylesheet parsing ────────────────────────────────────────────────

/** Split on `sep` where it is not inside (), [] or a string. */
function splitTop(str, sep) {
  const out = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  for (const ch of str) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[') depth += 1;
    else if (ch === ')' || ch === ']') depth -= 1;
    if (ch === sep && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

const BOX_SIDES = ['top', 'right', 'bottom', 'left'];

/** Declarations of one block, with the box shorthands expanded to longhands. */
function parseDecls(body) {
  const decls = [];
  for (const piece of splitTop(body, ';')) {
    const colon = piece.indexOf(':');
    if (colon <= 0) continue;
    const prop = piece.slice(0, colon).trim().toLowerCase();
    let value = piece.slice(colon + 1).trim();
    const important = /!\s*important$/i.test(value);
    if (important) value = value.replace(/\s*!\s*important$/i, '').trim();
    if (prop === 'padding' || prop === 'margin') {
      const v = value.split(/\s+/);
      const sides = [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]];
      BOX_SIDES.forEach((side, i) => decls.push({ prop: `${prop}-${side}`, value: sides[i], important }));
    } else if (prop === 'font') {
      // Only the keyword form is used on the controls under test. `font`
      // resets line-height with the rest; it never touches letter-spacing.
      if (value === 'inherit') decls.push({ prop: 'line-height', value: 'inherit', important });
    } else {
      decls.push({ prop, value, important });
    }
  }
  return decls;
}

function parseSheet(css) {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [];
  const walk = (text, conds) => {
    let i = 0;
    while (i < text.length) {
      const open = text.indexOf('{', i);
      if (open === -1) break;
      let prelude = text.slice(i, open);
      const semi = prelude.lastIndexOf(';');
      if (semi !== -1) prelude = prelude.slice(semi + 1);
      prelude = prelude.trim();
      let depth = 1;
      let j = open + 1;
      while (j < text.length && depth) {
        if (text[j] === '{') depth += 1;
        else if (text[j] === '}') depth -= 1;
        j += 1;
      }
      const body = text.slice(open + 1, j - 1);
      if (/^@(media|supports)\b/.test(prelude)) walk(body, [...conds, prelude]);
      else if (!prelude.startsWith('@')) {
        rules.push({ selectors: splitTop(prelude, ','), decls: parseDecls(body), conds, order: rules.length });
      }
      i = j;
    }
  };
  walk(src, []);
  return rules;
}

const RULES = parseSheet(CSS);

// ── Tokens and colours ────────────────────────────────────────────────

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
const THEMES = { light: LIGHT, dark: { ...LIGHT, ...tokenBlock('[data-theme="dark"]') } };

/** Substitute var() references until none are left. */
function resolveVars(value, tokens = LIGHT) {
  let v = String(value);
  for (let n = 0; n < 8 && v.includes('var('); n += 1) {
    v = v.replace(/var\((--[a-z0-9-]+)(?:,\s*([^()]+))?\)/gi, (_, name, fallback) => {
      const got = tokens[name] ?? fallback;
      assert.ok(got !== undefined, `${name} is not a token and has no fallback`);
      return got.trim();
    });
  }
  return v;
}

function rgb(value, tokens) {
  const v = resolveVars(value, tokens).trim();
  let m;
  if ((m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i))) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  if ((m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/))) {
    return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  }
  return assert.fail(`cannot read the colour ${value}`);
}

const over = (top, base) => [0, 1, 2].map((i) => top[i] * top[3] + base[i] * (1 - top[3])).concat(1);
const luminance = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// ── Media conditions ──────────────────────────────────────────────────

function mediaPartHolds(part, env) {
  if (/\bprint\b/.test(part) || /^\s*not\b/.test(part)) return false;
  const features = [...part.matchAll(/\(([^()]+)\)/g)].map((m) => m[1].trim());
  return features.every((f) => {
    let m;
    if ((m = f.match(/^max-width:\s*([\d.]+)px$/))) return env.width <= +m[1];
    if ((m = f.match(/^min-width:\s*([\d.]+)px$/))) return env.width >= +m[1];
    // Phones are coarse and hoverless, desktops fine and hovering.
    if ((m = f.match(/^hover:\s*(\w+)$/))) return (m[1] === 'hover') === env.width > 1023;
    if ((m = f.match(/^pointer:\s*(\w+)$/))) return (m[1] === 'fine') === env.width > 1023;
    return false; // reduced motion, landscape, anything unmodelled: the default reader has none
  });
}

function condHolds(cond, env) {
  if (cond.startsWith('@supports')) return !/^@supports\s+not\b/.test(cond);
  return splitTop(cond.replace(/^@media\s*/, ''), ',').some((part) => mediaPartHolds(part, env));
}

// ── Selectors ─────────────────────────────────────────────────────────

/** A document node: `el('button.vmx-lect-btn.is-primary')`. */
function el(spec) {
  const [tag, ...classes] = spec.split('.');
  return { tag, classes: new Set(classes) };
}

function parseCompound(c) {
  const m = c.match(/^(\*|[a-z][a-z0-9-]*)?((?:[.#][\w-]+|\[[^\]]+\]|:root)*)$/i);
  if (!m) return null;
  const tag = m[1] && m[1] !== '*' ? m[1].toLowerCase() : null;
  const classes = [...m[2].matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
  const ids = [...m[2].matchAll(/#([\w-]+)/g)].map((x) => x[1]);
  const attrs = [...m[2].matchAll(/\[[^\]]+\]/g)].length;
  const root = m[2].includes(':root');
  return { tag, classes, ids, attrs, root, spec: [ids.length, classes.length + attrs + (root ? 1 : 0), tag ? 1 : 0] };
}

const parsedSelectors = new Map();
function parseSelector(sel) {
  if (parsedSelectors.has(sel)) return parsedSelectors.get(sel);
  let result = null;
  const bare = sel.replace(/\[[^\]]*\]/g, '[]');
  if (!/::?(?!root\b)[a-z-]/i.test(bare) && !/[+~]/.test(bare)) {
    const tokens = sel.replace(/\s*>\s*/g, ' > ').trim().split(/\s+/);
    const parts = [];
    let comb = null;
    let ok = true;
    for (const t of tokens) {
      if (t === '>') { comb = '>'; continue; }
      const c = parseCompound(t);
      if (!c) { ok = false; break; }
      parts.push({ c, comb: parts.length ? (comb || ' ') : null });
      comb = null;
    }
    if (ok && parts.length) {
      const spec = parts.reduce((s, p) => s.map((n, i) => n + p.c.spec[i]), [0, 0, 0]);
      result = { parts, spec };
    }
  }
  parsedSelectors.set(sel, result);
  return result;
}

function compoundMatches(c, node) {
  if (c.tag && c.tag !== node.tag) return false;
  if (c.root && node.tag !== 'html') return false;
  if (c.ids.length || c.attrs) return false; // the chains below carry neither
  return c.classes.every((k) => node.classes.has(k));
}

function selectorMatches({ parts }, chain) {
  const rec = (pi, ni) => {
    if (!compoundMatches(parts[pi].c, chain[ni])) return false;
    if (pi === 0) return true;
    if (parts[pi].comb === '>') return ni > 0 && rec(pi - 1, ni - 1);
    for (let k = ni - 1; k >= 0; k -= 1) if (rec(pi - 1, k)) return true;
    return false;
  };
  return rec(parts.length - 1, chain.length - 1);
}

const cmpSpec = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);

/** The winning author declaration of `prop` on the last node of `chain`. */
function declared(chain, prop, env) {
  let best = null;
  for (const rule of RULES) {
    if (!rule.conds.every((c) => condHolds(c, env))) continue;
    let spec = null;
    for (const sel of rule.selectors) {
      const p = parseSelector(sel);
      if (p && selectorMatches(p, chain) && (!spec || cmpSpec(p.spec, spec) > 0)) spec = p.spec;
    }
    if (!spec) continue;
    for (const d of rule.decls) {
      if (d.prop !== prop) continue;
      const cand = { value: d.value, important: d.important, spec, order: rule.order };
      if (!best
        || (cand.important && !best.important)
        || (cand.important === best.important
          && (cmpSpec(cand.spec, best.spec) > 0
            || (cmpSpec(cand.spec, best.spec) === 0 && cand.order >= best.order)))) best = cand;
    }
  }
  return best;
}

const INHERITED = new Set(['line-height', 'letter-spacing', 'color', 'font-family', 'text-transform', 'font-variant-numeric']);
// Every engine's UA sheet resets these on form controls, so a <button>
// does not inherit them from body.
const UA_FORM_RESET = { tags: new Set(['button', 'input', 'select', 'textarea']), props: new Set(['line-height', 'letter-spacing']) };

/** The computed value of `prop` for the last node of `chain`, or null for the initial value. */
function computed(chain, prop, env) {
  for (let n = chain.length; n > 0; n -= 1) {
    const d = declared(chain.slice(0, n), prop, env);
    if (d && d.value !== 'inherit') return d.value;
    if (!d && UA_FORM_RESET.tags.has(chain[n - 1].tag) && UA_FORM_RESET.props.has(prop)) return 'normal';
    if (!d && !INHERITED.has(prop)) return null;
  }
  return null;
}

const px = (value) => {
  if (value === null) return 0;
  const m = resolveVars(value).match(/^(-?[\d.]+)px$/);
  assert.ok(m || resolveVars(value) === '0', `${value} is not a px length`);
  return m ? +m[1] : 0;
};

const PHONE = { width: 390 };
const DESKTOP = { width: 1280 };

const APP = ['html', 'body', 'div', 'div.vmx-app', 'main.vmx-main'].map(el);
const chain = (...specs) => [...APP, ...specs.map(el)];

// ── The sheet parsed ──────────────────────────────────────────────────

test('the cascade model reads the stylesheet it is testing', () => {
  assert.ok(RULES.length > 1500, `only ${RULES.length} rules parsed from styles.css`);
  // Two known answers: the 44px token, and html/body line-height reaching a div.
  assert.equal(resolveVars('var(--touch-min)'), '44px');
  assert.equal(computed(chain('div', 'p'), 'line-height', DESKTOP), '1.65');
  // The UA reset: a bare button does not inherit body's 1.65.
  assert.equal(computed(chain('div', 'button'), 'line-height', DESKTOP), 'normal');
});

// ── UI-03: Thai heading metrics ───────────────────────────────────────

test('the hero h1 keeps Thai heading metrics (line-height >= 1.2, letter-spacing 0) at every width', () => {
  const h1 = chain('div', 'div.vmx-hero', 'h1');
  for (const env of [PHONE, DESKTOP]) {
    const lh = computed(h1, 'line-height', env);
    const ls = computed(h1, 'letter-spacing', env);
    assert.ok(Number(lh) >= 1.2, `.vmx-hero h1 line-height ${lh} at ${env.width}px; the stacked marks of a wrapped Thai line need 1.2`);
    assert.ok(ls === null || ls === '0' || ls === 'normal', `.vmx-hero h1 letter-spacing ${ls} at ${env.width}px; negative tracking squeezes Thai tone marks together`);
  }
});

test('a wrapped subject-card title on a phone leaves room between a below-vowel and the next line\'s tone mark', () => {
  // 16px at 1.2 is 3.2px of leading: the sara u under สุข touched the mai
  // tho over เนื้อ. 1.35 gives 5.6px.
  const title = chain('div', 'div.vmx-subject-grid', 'button.vmx-subject-card', 'div.title');
  const lh = computed(title, 'line-height', PHONE);
  assert.ok(Number(lh) >= 1.35, `.vmx-subject-card .title line-height ${lh} at 390px`);
  assert.equal(computed(title, 'font-size', PHONE), '16px', 'the phone title size moved; re-check the leading against it');
});

// ── UI-10: touch targets ──────────────────────────────────────────────

const TOUCH = {
  'Home wrap-up strip button': chain('div', 'div.vmx-wrap-strip', 'button.vmx-wrap-strip-btn'),
  'topic-screen wrap-up entry button': chain('div', 'div.vmx-wrap-entry', 'button.vmx-wrap-entry-btn'),
  'wrap-up reading-mode switch': chain('div.vmx-wrap', 'div.vmx-wrap-mode', 'button'),
  'wrap-up reading-mode switch (on)': chain('div.vmx-wrap', 'div.vmx-wrap-mode', 'button.is-on'),
  'lecturer practice button': chain('div.vmx-lect-list', 'article.vmx-lect', 'div.vmx-lect-actions', 'button.vmx-lect-btn'),
  'lecturer primary practice button': chain('div.vmx-lect-list', 'article.vmx-lect', 'div.vmx-lect-actions', 'button.vmx-lect-btn.is-primary'),
  'lecturer name (opens the profile)': chain('div.vmx-lect-list', 'article.vmx-lect', 'header.vmx-lect-head', 'button.vmx-lect-name'),
  'topic-screen reveal switch': chain('div.vmx-lect-list', 'div.vmx-lect-reveal', 'div.vmx-reveal-toggle', 'button'),
  'topic-screen reveal switch (on)': chain('div.vmx-lect-list', 'div.vmx-lect-reveal', 'div.vmx-reveal-toggle', 'button.is-on'),
};

test('the exam-week controls are at least 44px tall on a phone, and the box is the tap area', () => {
  // `* { box-sizing: border-box }` makes min-height the whole visible box.
  assert.equal(computed(chain('button'), 'box-sizing', PHONE), 'border-box');
  for (const [name, node] of Object.entries(TOUCH)) {
    for (const env of [PHONE, DESKTOP]) {
      const h = px(computed(node, 'min-height', env));
      assert.ok(h >= 44, `${name}: min-height ${h}px at ${env.width}px`);
      assert.match(String(computed(node, 'display', env)), /^(inline-)?flex$/, `${name}: needs a flex box to centre its label`);
      assert.equal(computed(node, 'align-items', env), 'center', `${name}: the label must sit in the middle of the taller box`);
    }
  }
});

test('the exam screen\'s reveal switch keeps its layout (only the topic-screen instance grew)', () => {
  // The same RevealTimingToggle renders under a written answer and a
  // matching set mid-exam. Exam-week layout there stays exactly as it was.
  for (const node of [
    chain('div.vmx-question', 'div.vmx-reveal-toggle', 'button'),
    chain('div.vmx-question', 'div.vmx-reveal-toggle', 'button.is-on'),
  ]) {
    for (const env of [PHONE, DESKTOP]) {
      assert.equal(computed(node, 'min-height', env), null);
      assert.equal(computed(node, 'padding-top', env), '5px');
      assert.equal(computed(node, 'padding-left', env), '11px');
    }
  }
});

test('the sticky wrap-up index uses the 36px compromise and stays shorter than the jump offset', () => {
  const index = chain('div.vmx-wrap', 'nav.vmx-wrap-index');
  const chip = chain('div.vmx-wrap', 'nav.vmx-wrap-index', 'a');
  const item = chain('div.vmx-wrap', 'div.vmx-wrap-group', 'article.vmx-wrap-item');
  for (const env of [PHONE, DESKTOP]) {
    const chipH = px(computed(chip, 'min-height', env));
    assert.equal(chipH, 36, `wrap-index chip min-height ${chipH}px at ${env.width}px`);
    const bar = chipH + px(computed(index, 'padding-top', env)) + px(computed(index, 'padding-bottom', env));
    const offset = px(computed(item, 'scroll-margin-top', env));
    assert.ok(bar <= offset, `the sticky index is ${bar}px tall and an item it jumps to stops ${offset}px down: the bar covers its heading`);
  }
});

// ── UI-13: opacity on text ────────────────────────────────────────────

/** Effective contrast of a text node: its colour times every opacity down the chain, over `bg`. */
function textContrast(node, env, tokens, bgValue) {
  const bg = rgb(bgValue, tokens);
  let alpha = 1;
  for (let n = 1; n <= node.length; n += 1) {
    const o = declared(node.slice(0, n), 'opacity', env);
    if (o) alpha *= Number(o.value);
  }
  const fg = rgb(computed(node, 'color', env), tokens);
  return ratio(over([fg[0], fg[1], fg[2], fg[3] * alpha], bg), bg);
}

const COUNTDOWN = ['section.vmx-countdown', 'button.vmx-countdown-strip'];
const day = (mod, part) => chain(...COUNTDOWN, `span.vmx-countdown-day${mod}`, `span.${part}`);

test('the countdown strip\'s day letters and dates clear 4.5:1 in both themes, weekends included', () => {
  for (const env of [PHONE, DESKTOP]) {
    for (const [theme, tokens] of Object.entries(THEMES)) {
      for (const mod of ['', '.is-weekend', '.is-exam', '.is-done']) {
        for (const part of ['vmx-countdown-dow', 'vmx-countdown-daynum']) {
          const r = textContrast(day(mod, part), env, tokens, 'var(--clr-surface)');
          assert.ok(r >= 4.5, `${part}${mod || ''} ${r.toFixed(2)}:1 in ${theme} at ${env.width}px`);
        }
      }
    }
  }
});

test('weekend dates still recede from weekday dates, with a token instead of opacity', () => {
  for (const [theme, tokens] of Object.entries(THEMES)) {
    const weekday = textContrast(day('', 'vmx-countdown-daynum'), DESKTOP, tokens, 'var(--clr-surface)');
    const weekend = textContrast(day('.is-weekend', 'vmx-countdown-daynum'), DESKTOP, tokens, 'var(--clr-surface)');
    assert.ok(weekend < weekday, `${theme}: a weekend date (${weekend.toFixed(2)}) reads as strongly as a weekday (${weekday.toFixed(2)})`);
  }
  // Today's date keeps its filled circle on a weekend too.
  assert.equal(computed(day('.is-weekend.is-today', 'vmx-countdown-daynum'), 'color', DESKTOP), 'var(--clr-sage-on)');
});

/** The inline style object of the first element after `marker`. */
function inlineStyle(src, marker) {
  const at = src.indexOf(marker);
  assert.notEqual(at, -1, `${marker} is no longer in the source`);
  const open = src.indexOf('style={{', at);
  const close = src.indexOf('}}', open);
  assert.ok(open !== -1 && close !== -1 && open - at < 600, `could not isolate the inline style after ${marker}`);
  return src.slice(open + 'style={{'.length, close);
}

test('the XP chip total clears 4.5:1 in both themes', () => {
  const chip = inlineStyle(XP_CHIP, 'className={`vmx-xp-chip${');
  const total = inlineStyle(XP_CHIP, 'className="vmx-xp-chip-total"');
  const opacity = Number((total.match(/\bopacity:\s*([\d.]+)/) || [null, 1])[1]);
  const color = chip.match(/\bcolor:\s*'([^']+)'/)[1];
  const fill = chip.match(/\bbackground:\s*'([^']+)'/)[1];
  // The chip sits in the header, on the page or on a surface card.
  for (const [theme, tokens] of Object.entries(THEMES)) {
    for (const page of ['var(--clr-bg)', 'var(--clr-surface)']) {
      const bg = over(rgb(fill, tokens), rgb(page, tokens));
      const fg = rgb(color, tokens);
      const r = ratio(over([fg[0], fg[1], fg[2], opacity], bg), bg);
      assert.ok(r >= 4.5, `XP total ${r.toFixed(2)}:1 in ${theme} on ${page}`);
    }
  }
});

// ── UI-15: the deck card's session date ───────────────────────────────

test('the session date under a deck cover starts on the same left edge as the deck title', () => {
  const cover = ['div.vmx-lect-list', 'article.vmx-lect', 'div.vmx-lect-strip', 'div.vmx-lect-cover'];
  const title = chain(...cover, 'button.vmx-lect-cover-hit', 'span.t');
  const date = chain(...cover, 'div.vmx-lect-cover-foot', 'span.s');
  // Left inset from the card's edge: margin plus padding of every box inside it.
  const inset = (node, env) => {
    let sum = 0;
    for (let n = APP.length + cover.length + 1; n <= node.length; n += 1) {
      const box = node.slice(0, n);
      sum += px(computed(box, 'padding-left', env)) + px(computed(box, 'margin-left', env));
    }
    return sum;
  };
  for (const env of [PHONE, DESKTOP]) {
    const t = inset(title, env);
    const s = inset(date, env);
    assert.ok(Math.abs(t - s) <= 1, `deck title starts ${t}px in, session date ${s}px in, at ${env.width}px`);
    assert.equal(px(computed(date, 'padding-bottom', env)), 0, 'the date carries a second bottom padding under the footer\'s');
  }
});

// ── UI-02: the exam-week labels read in the page's Thai face ──────────
// The wrap-up page and the Home countdown are what a student reads the night
// before a paper. Their small labels were a Latin eyebrow style — the mono
// face, 0.06-0.1em tracking, uppercase — set on Thai: JetBrains Mono has no
// Thai glyphs, so "สอบกลางภาค", "ชม. นาที วินาที" and the wrap-up pills fell
// back to the loopless IBM Plex face beside the looped Sarabun around them,
// with gaps between the letters. Digits may stay tabular; the face and the
// tracking may not.

/** The first face a font-family value asks for, var() resolved. */
const firstFace = (value) => (value === null ? null
  : resolveVars(value).split(',')[0].replace(/['"]/g, '').trim());

function assertThaiLabel(name, node) {
  for (const env of [PHONE, DESKTOP]) {
    const face = firstFace(computed(node, 'font-family', env));
    assert.equal(face, 'Sarabun', `${name}: font-family starts with ${face} at ${env.width}px`);
    const ls = computed(node, 'letter-spacing', env);
    assert.ok(ls === null || ls === '0' || ls === 'normal', `${name}: letter-spacing ${ls} at ${env.width}px pulls Thai marks off their consonants`);
    const tt = computed(node, 'text-transform', env);
    assert.ok(tt === null || tt === 'none', `${name}: text-transform ${tt} at ${env.width}px`);
  }
}

const WRAP_ITEM = ['div.vmx-wrap', 'section.vmx-wrap-group', 'article.vmx-wrap-item'];
const COUNTDOWN_LEAD = ['section.vmx-countdown', 'div.vmx-countdown-lead'];
const EXAM_WEEK_LABELS = {
  'wrap-up eyebrow': chain('div.vmx-wrap', 'header.vmx-wrap-hero', 'div.vmx-wrap-eyebrow'),
  'wrap-up pill': chain('div.vmx-wrap', 'header.vmx-wrap-hero', 'div.vmx-wrap-meta', 'span.vmx-wrap-pill'),
  'wrap-up list label': chain(...WRAP_ITEM, 'div.vmx-wrap-cols', 'div.vmx-wrap-list', 'div.vmx-wrap-list-label'),
  'wrap-up source line': chain(...WRAP_ITEM, 'div.vmx-wrap-cols', 'div.vmx-wrap-list', 'ul', 'li', 'small.vmx-wrap-src'),
  'topic-screen wrap-up eyebrow': chain('section.vmx-wrap-entry', 'div.vmx-wrap-entry-text', 'div.vmx-wrap-entry-eyebrow'),
  'Home wrap-up strip label': chain('div.vmx-wrap-strip', 'span.vmx-wrap-strip-label'),
  'countdown eyebrow': chain(...COUNTDOWN_LEAD, 'span.vmx-countdown-eyebrow'),
  'countdown eyebrow date range': chain(...COUNTDOWN_LEAD, 'span.vmx-countdown-eyebrow', 'span'),
  'countdown units (ชม. นาที วินาที)': chain(...COUNTDOWN_LEAD, 'span.vmx-countdown-clock', 'i'),
  'countdown units under a day': chain('section.vmx-countdown.is-hours', 'div.vmx-countdown-lead', 'span.vmx-countdown-clock', 'i'),
};

test('UI-02: the wrap-up and countdown labels are Sarabun, untracked and not uppercased', () => {
  for (const [name, node] of Object.entries(EXAM_WEEK_LABELS)) assertThaiLabel(name, node);
});

test('UI-02: the wrap-up pills keep their dates aligned with tabular digits, and the countdown digits stay mono', () => {
  const pill = EXAM_WEEK_LABELS['wrap-up pill'];
  for (const env of [PHONE, DESKTOP]) {
    assert.equal(computed(pill, 'font-variant-numeric', env), 'tabular-nums');
    // The digits of the clock are digits only: they keep the mono face.
    const digits = chain(...COUNTDOWN_LEAD, 'span.vmx-countdown-clock', 'b');
    assert.match(resolveVars(computed(digits, 'font-family', env)), /JetBrains Mono/);
  }
});
