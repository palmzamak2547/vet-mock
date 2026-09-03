// ============================================================
// convert-fonts.mjs — self-hosted Sarabun woff2 pipeline
// ============================================================
// Sarabun shipped as 17 full TTFs (~1.3 MB) while only 6 are wired
// into @font-face, and the Google Fonts CDN also serves the same
// family (double-load, DESIGN_SYSTEM perf debt). This converts the 6
// wired weights to woff2 and rewrites the @font-face URLs, so the
// CDN segment can be dropped and the dead TTFs deleted.
//
// Subset is broad, not page-specific: Thai block in full (every
// combining mark — ่ ้ ็ ์ ํ — and both Thai digits), Latin-1 +
// Latin Extended-A (Thai-transliteration diacritics), punctuation,
// and the U+200B..200D range the question corpus uses for separators.
// Subsetting to only what one page happens to show would break the
// next page's rare glyph; the whole point of a study app is the long
// tail of pathology terms.
//
// Run after adding a weight to @font-face:
//   node scripts/convert-fonts.mjs
// Regenerating overwrites public/fonts/ — the outputs are committed
// so CI and Vercel never need the TTFs at all.
// ============================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import subsetFont from 'subset-font';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC_DIR = `${ROOT}public/Sarabun`;
const OUT_DIR = `${ROOT}public/fonts`;

// weight → source file. These are exactly the six @font-face rules in
// src/styles.css; anything else in public/Sarabun is unreferenced.
const WEIGHTS = [
  { css: '400', file: 'Sarabun-Regular.ttf', out: 'sarabun-400.woff2' },
  { css: '500', file: 'Sarabun-Medium.ttf', out: 'sarabun-500.woff2' },
  { css: '600', file: 'Sarabun-SemiBold.ttf', out: 'sarabun-600.woff2' },
  { css: '700', file: 'Sarabun-Bold.ttf', out: 'sarabun-700.woff2' },
  { css: 'i400', file: 'Sarabun-Italic.ttf', out: 'sarabun-i400.woff2' },
  { css: 'i700', file: 'Sarabun-BoldItalic.ttf', out: 'sarabun-i700.woff2' },
];

function charset() {
  let s = '';
  // Thai block complete: consonants, vowels (both rows), all combining
  // marks, Thai digits, punctuation.
  for (let c = 0x0e01; c <= 0x0e5b; c++) s += String.fromCodePoint(c);
  // Latin basics + Latin-1 supplement + Latin Extended-A
  s += ' !"#$%&\'()*+,-./0123456789:;<=>?@';
  s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`';
  s += 'abcdefghijklmnopqrstuvwxyz{|}~';
  for (let c = 0xa0; c <= 0xff; c++) s += String.fromCodePoint(c);
  for (let c = 0x100; c <= 0x17f; c++) s += String.fromCodePoint(c);
  // General punctuation incl. – — ' ' " " … and the separators the
  // corpus uses (ZWSP/ZWNJ/ZWJ/LRM/RLM).
  for (let c = 0x2000; c <= 0x206f; c++) s += String.fromCodePoint(c);
  // Arrows (→ used in UI copy) + bullets (• ‣)
  for (let c = 0x2190; c <= 0x21ff; c++) s += String.fromCodePoint(c);
  for (let c = 0x2022; c <= 0x2023; c++) s += String.fromCodePoint(c);
  return s;
}

mkdirSync(OUT_DIR, { recursive: true });
const chars = charset();
let totalIn = 0, totalOut = 0;
for (const w of WEIGHTS) {
  const ttf = readFileSync(`${SRC_DIR}/${w.file}`);
  const woff2 = await subsetFont(ttf, chars, { format: 'woff2' });
  writeFileSync(`${OUT_DIR}/${w.out}`, woff2);
  totalIn += ttf.length;
  totalOut += woff2.length;
  console.log(`${w.file} → ${w.out}: ${(ttf.length / 1024).toFixed(0)} KB → ${(woff2.length / 1024).toFixed(0)} KB`);
}
console.log(`total: ${(totalIn / 1024).toFixed(0)} KB → ${(totalOut / 1024).toFixed(0)} KB (${((1 - totalOut / totalIn) * 100).toFixed(0)}% smaller)`);
