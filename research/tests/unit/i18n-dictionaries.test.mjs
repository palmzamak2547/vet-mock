// Every area dictionary: Thai and English carry the same keys, keys use the area prefix, no empty
// strings, and the copy rules hold in both languages (M1-DESIGN.md 4.3). OWNER: runtime role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = fileURLToPath(new URL('../../src/i18n/', import.meta.url));
const PREFIX = {
  common: 'common.', terms: 'term.', workspace: 'ws.', report: 'report.', landing: 'landing.', entrance: 'entrance.',
  intake: 'intake.', stats: 'stats.', epi: 'epi.', runtime: 'runtime.',
};

const files = readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js');

test('every dictionary file has a known area', () => {
  for (const f of files) assert.ok(PREFIX[f.replace(/\.js$/, '')], `unknown dictionary ${f}`);
  for (const area of Object.keys(PREFIX)) assert.ok(files.includes(`${area}.js`), `missing dictionary ${area}.js`);
});

// Copy rules. Middle dot and the other Thai word for student are also failed by the main app's
// lint:ui-copy; this file adds the ellipsis, the star glyph, Thai digits and bracket placeholders.
const BANNED = [
  { re: /·|•|・/, why: 'middle dot or bullet used as a separator' },
  { re: /…|\.\.\./, why: 'ellipsis' },
  { re: /[★☆✶✳]/, why: 'star glyph' },
  { re: /นักศึกษา/, why: 'use นิสิต' },
  { re: /[๐-๙]/, why: 'Thai digits in UI copy (use Arabic digits)' },
];

for (const f of files) {
  const area = f.replace(/\.js$/, '');
  test(`${area}: same keys in th and en, prefixed, non-empty, copy rules`, async () => {
    const dict = (await import(pathToFileURL(path.join(dir, f)).href)).default;
    assert.ok(dict && typeof dict.th === 'object' && typeof dict.en === 'object', 'default export { th, en }');
    const th = Object.keys(dict.th).sort();
    const en = Object.keys(dict.en).sort();
    assert.deepEqual(th, en, 'th and en keys differ');
    for (const lang of ['th', 'en']) {
      for (const [k, v] of Object.entries(dict[lang])) {
        assert.ok(k.startsWith(PREFIX[area]), `${k} must start with ${PREFIX[area]}`);
        assert.equal(typeof v, 'string', `${lang} ${k} is not a string`);
        assert.ok(v.trim().length > 0, `${lang} ${k} is empty`);
        for (const { re, why } of BANNED) assert.ok(!re.test(v), `${lang} ${k}: ${why}: ${v}`);
      }
    }
  });
}
