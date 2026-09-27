// One word per concept across every dictionary (review round 1). The chosen words live in
// src/i18n/terms.js (term.codebook, term.studyDesign, term.cell, term.median, term.pValue,
// term.confounder, term.intercept, term.yates, term.fisher); this test fails on the other spellings
// the review found side by side on the same screens. OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = fileURLToPath(new URL('../../src/i18n/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js');

// Placeholders ({design}) are not words on the screen.
const text = (s) => String(s).replace(/\{\w+\}/g, '');

const TH = [
  { re: /(?<![A-Za-z])codebook(?![A-Za-z])/, use: 'รหัสตัวแปร' },
  { re: /(?<![A-Za-z])design(?! effect)(?![A-Za-z])/, use: 'รูปแบบการศึกษา' },
  { re: /เซลล์/, use: 'ช่อง' },
  { re: /(?<![A-Za-z])median(?![A-Za-z])/, use: 'มัธยฐาน' },
  { re: /(?<![A-Za-z])p-values?(?![A-Za-z])/, use: 'ค่า p' },
  { re: /(?<!แปร)ตัวกวน/, use: 'ตัวแปรกวน' },
  { re: /Yates correction/, use: 'Yates continuity correction' },
  { re: /Fisher exact/, use: "Fisher's exact test" },
];
const EN = [
  { re: /Yates correction/, use: 'Yates continuity correction' },
  { re: /Fisher exact/, use: "Fisher's exact test" },
];

test('Thai and English copy use one word per concept', async () => {
  const found = [];
  for (const f of files) {
    const dict = (await import(pathToFileURL(path.join(dir, f)).href)).default;
    for (const [lang, rules] of [['th', TH], ['en', EN]]) {
      for (const [key, value] of Object.entries(dict[lang] || {})) {
        if (key === 'term.codebook' || key === 'term.median' || key === 'term.pValue') continue;
        for (const r of rules) if (r.re.test(text(value))) found.push(`${f} ${lang} ${key}: use "${r.use}"`);
      }
    }
  }
  assert.deepEqual(found, []);
});

test('the chosen words are in terms.js in both languages', async () => {
  const terms = (await import(pathToFileURL(path.join(dir, 'terms.js')).href)).default;
  for (const k of ['codebook', 'studyDesign', 'cell', 'median', 'pValue', 'confounder', 'intercept', 'yates', 'fisher']) {
    assert.ok(terms.th[`term.${k}`] && terms.en[`term.${k}`], `term.${k}`);
  }
});
