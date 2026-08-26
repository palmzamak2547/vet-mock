// ============================================================
// derive-accent-roles.mjs — compute the fill / text split for every
// palette, instead of hand-picking twenty hex values.
// ============================================================
// An accent used both as a button background under white text AND as
// text on the page surface is being asked to be two opposite things.
// Dark-mode --vmx-color-learning #5f8a5f proved it: white-on-it 3.97,
// it-on-surface 4.05, neither clearing 4.5, and no single lightness
// can satisfy both.
//
// So each accent gets two derived values, hue and saturation held so
// the palette still reads as itself:
//
//   fill — the accent as a background
//   on   — the label that sits ON the fill (#fff or --clr-bg)
//   text — the accent as text, clearing bg, surface AND surface-2
//
// Solving the fill against BOTH #fff and --clr-bg at once is
// unsatisfiable by construction — one wants it dark, the other light —
// which is the same mistake as one token doing two jobs, one level up.
// So the fill and its label are solved as a pair: pick the better label,
// and only move the fill if even that cannot clear.
//
// Caveat worth knowing before trusting a value: this solves against the
// three BASE surfaces. Accent-tinted surfaces (a color-mix card) sit
// lighter than any of them, and cherry's #ab4747 cleared every base
// surface at 4.55 while landing on 4.485 on a tinted card. Verify with
// scripts/audit-contrast.mjs, which measures the real composited pixel.
//
// Run: node scripts/derive-accent-roles.mjs
// Prints the CSS to paste. It does not edit styles.css — a colour
// change should be looked at before it lands.

import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

// ── colour maths ────────────────────────────────────────────────────
const hex2rgb = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgb2hex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const rgb2hsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  if (!d) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0))
    : max === g ? (b - r) / d + 2
      : (r - g) / d + 4;
  return [h / 6, s, l];
};
const hsl2rgb = ([h, s, l]) => {
  if (!s) { const v = l * 255; return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const k = (t) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [k(h + 1 / 3) * 255, k(h) * 255, k(h - 1 / 3) * 255];
};

/** Slide lightness (hue + saturation fixed) until every `against` colour
 *  clears `target`. `dir` is which way to walk first. Returns the closest
 *  value to the original that works, or null if none does. */
function solve(hex, against, target, dir) {
  const [h, s, l0] = rgb2hsl(hex2rgb(hex));
  const ok = (l) => {
    const rgb = hsl2rgb([h, s, l]);
    return against.every((a) => ratio(rgb, hex2rgb(a)) >= target);
  };
  for (const sign of [dir, -dir]) {
    for (let step = 0; step <= 100; step++) {
      const l = l0 + sign * step * 0.005;
      if (l < 0 || l > 1) break;
      if (ok(l)) return rgb2hex(hsl2rgb([h, s, l]));
    }
  }
  return null;
}

// ── read the palettes out of the stylesheet ─────────────────────────
function block(selector) {
  const at = CSS.indexOf(selector + ' {');
  if (at === -1) return null;
  const body = CSS.slice(at, CSS.indexOf('\n}', at));
  const vars = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

// The light block is declared `:root, [data-theme="light"] {` — a bare
// ':root {' lookup finds a much later utility block instead.
const BASE = { light: block(':root, [data-theme="light"]'), dark: block('[data-theme="dark"]') };
const PALETTES = ['ocean', 'plum', 'cherry', 'mono', 'forest'];
const TARGET = 4.5;

const resolve = (vars, base, name) => {
  let v = vars[name] ?? base[name];
  const ref = /var\(--([\w-]+)\)/.exec(v || '');
  if (ref) v = vars[ref[1]] ?? base[ref[1]];
  return v;
};

// Three accent families, same three roles. Sage's fill lives behind the
// --vmx-color-learning interaction token; gold and rose are used as
// fills directly, so the accent itself carries that role.
const FAMILIES = [
  { name: 'sage',  accent: 'clr-sage',  text: 'clr-sage-text',  fill: 'vmx-color-learning', on: 'vmx-color-learning-on' },
  { name: 'gold',  accent: 'clr-gold',  text: 'clr-gold-text',  fill: 'clr-gold',           on: 'clr-gold-on' },
  { name: 'rose',  accent: 'clr-rose',  text: 'clr-rose-text',  fill: 'clr-rose',           on: 'clr-rose-on' },
  // The two remaining interaction fills. They are never used as text, so
  // only their labels matter — but a fill whose label is hardcoded is the
  // same bug wearing a different name.
  // Not palette-overridden, so two values each — but they are used as text
  // and were the last two accents with no readable variant.
  { name: 'ocean', accent: 'clr-ocean', text: 'clr-ocean-text', fill: 'clr-ocean', on: 'clr-ocean-on' },
  { name: 'plum',  accent: 'clr-plum',  text: 'clr-plum-text',  fill: 'clr-plum',  on: 'clr-plum-on' },
  { name: 'danger', accent: 'vmx-color-danger', text: null, fill: 'vmx-color-danger', on: 'vmx-color-danger-on' },
  { name: 'ok',     accent: 'vmx-color-success', text: null, fill: 'vmx-color-success', on: 'vmx-color-success-on' },
];

console.log('# fill = the accent as a background');
console.log('# on   = the label that sits ON the fill (white or --clr-bg)');
console.log('# text = the accent as text, clearing bg + surface + surface-2\n');

const rows = [];

for (const theme of ['light', 'dark']) {
  const base = BASE[theme];
  const surfaces = [base['clr-bg'], base['clr-surface'], base['clr-surface-2']];

  // Chips and cards tint their surface with 10-12% of the accent, which
  // lands LIGHTER than any base surface in light mode and darker in
  // dark. Solving only against the bases produced values that cleared
  // every surface I thought to check and then failed at 4.47 on a tinted
  // chip — three times, on three different accents. So the tint is a
  // constraint, not a caveat.
  // Over BOTH bases: the chip that first exposed this sits on surface-2,
  // not surface, and a tint over the wrong base is off by the 0.03 that
  // decides 4.47 from 4.50.
  const tints = (accent) => {
    const [ar, ag, ab] = hex2rgb(accent);
    return ['clr-surface', 'clr-surface-2'].map((key) => {
      const [sr, sg, sb] = hex2rgb(base[key]);
      const a = 0.12;
      return rgb2hex([ar * a + sr * (1 - a), ag * a + sg * (1 - a), ab * a + sb * (1 - a)]);
    });
  };

  for (const palette of [null, ...PALETTES]) {
    const sel = palette
      ? (theme === 'dark' ? `[data-theme="dark"][data-palette="${palette}"]` : `[data-palette="${palette}"]`)
      : (theme === 'dark' ? '[data-theme="dark"]' : ':root, [data-theme="light"]');
    const vars = palette ? block(sel) : base;
    if (!vars) continue;

    for (const fam of FAMILIES) {
      const accent = resolve(vars, base, fam.accent);
      if (!accent) continue;
      // A palette that does not re-point this family inherits the base
      // value, and re-emitting it would bury the ones that DO differ.
      const overridden = !palette || (vars[fam.accent] !== undefined);
      let fill = resolve(vars, base, fam.fill) || accent;

      // Fill and label are a PAIR — solving one value against both #fff
      // and --clr-bg is unsatisfiable by construction. Pick the better
      // label, move the fill only if even that cannot clear.
      // --clr-ink matters: in LIGHT theme both #fff and --clr-bg are pale,
      // so a pale accent like gold had no readable label on offer at all
      // and the solver darkened the fill instead of just writing on it in
      // ink, which is 4.89 on gold as it already stands.
      const candidates = [
        ['#ffffff', '#ffffff'],
        [base['clr-bg'], 'var(--clr-bg)'],
        [base['clr-ink'], 'var(--clr-ink)'],
      ];
      let best = candidates
        .map(([hex, css]) => ({ hex, css, r: ratio(hex2rgb(fill), hex2rgb(hex)) }))
        .sort((a, b) => b.r - a.r)[0];
      if (best.r < TARGET) {
        const moved = solve(fill, [best.hex], TARGET, best.hex === '#ffffff' ? -1 : +1);
        if (moved) { fill = moved; best = { ...best, r: ratio(hex2rgb(fill), hex2rgb(best.hex)) }; }
      }

      const against = [...surfaces, ...tints(accent)];
      const text = fam.text ? solve(accent, against, TARGET, theme === 'dark' ? +1 : -1) : null;
      const textR = text ? Math.min(...against.map((a) => ratio(hex2rgb(text), hex2rgb(a)))) : 0;

      rows.push({ sel, fam, theme, palette, overridden, accent, fill, on: best.css, onR: best.r, text, textR });
    }
  }
}

let lastSel = null;
for (const r of rows) {
  if (r.sel !== lastSel) { console.log(`\n${r.sel}`); lastSel = r.sel; }
  const flag = r.overridden ? '' : '  (inherited)';
  console.log(`  ${r.fam.name.padEnd(5)} fill ${r.fill}  on ${r.on.padEnd(15)} ${r.onR.toFixed(2)}   text ${r.text || '—'}  ${r.textR.toFixed(2)}${flag}`);
}

console.log('\n/* ---- paste: only what this selector actually re-points ---- */');
lastSel = null;
for (const r of rows) {
  if (!r.overridden) continue;
  if (r.sel !== lastSel) {
    if (lastSel !== null) console.log('}');
    console.log(`${r.sel} {`);
    lastSel = r.sel;
  }
  if (r.fam.text) console.log(`  --${r.fam.text}: ${r.text};`);
  console.log(`  --${r.fam.on}: ${r.on};`);
}
if (lastSel !== null) console.log('}');
