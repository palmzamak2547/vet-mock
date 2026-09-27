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
  lab: 'lab.', models: 'models.', measure: 'measure.', data: 'data.', graphs: 'graphs.', tools: 'tools.', trust: 'trust.',
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

// Review round 2: a key written twice in one area file silently keeps only the later string.
test('no dictionary key is written twice in its area file', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const dir = new URL('../../src/i18n/', import.meta.url);
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.js') && x !== 'index.js')) {
    const src = readFileSync(new URL(f, dir), 'utf8');
    const keys = [...src.matchAll(/^\s*\[?'([a-z]+\.[A-Za-z0-9_.-]+)'\s*[,:]/gm)].map((m) => m[1]);
    const seen = new Map();
    for (const k of keys) seen.set(k, (seen.get(k) || 0) + 1);
    // Object-style files list each key once per language (th and en), row-style files once in all.
    const perLang = /^\s*th:\s*\{/m.test(src) || /\bth:\s*\{/.test(src);
    const limit = perLang ? 2 : 1;
    const dup = [...seen].filter(([, c]) => c > limit).map(([k]) => k);
    assert.deepEqual(dup, [], `${f}: ${dup.join(', ')}`);
  }
});
