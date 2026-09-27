// Every dictionary key the landing and the entrance ask for exists in both languages, and no
// landing key is left unused (M1-DESIGN.md 4). Keys built from a template (`landing.c${i}.body`)
// must match at least one key. OWNER: landing role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import landing from '../../src/i18n/landing.js';
import entrance from '../../src/i18n/entrance.js';
import common from '../../src/i18n/common.js';
import terms from '../../src/i18n/terms.js';

const src = fileURLToPath(new URL('../../src/', import.meta.url));
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(js|jsx)$/.test(name)) out.push(p);
  }
  return out;
}
const files = [...walk(path.join(src, 'landing')), ...walk(path.join(src, 'entrance'))];
const code = files.map((f) => readFileSync(f, 'utf8')).join('\n');
const dicts = [landing, entrance, common, terms];
const has = (lang, key) => dicts.some((d) => Object.prototype.hasOwnProperty.call(d[lang], key));
const allKeys = (lang) => dicts.flatMap((d) => Object.keys(d[lang]));

const literal = [...code.matchAll(/t\(\s*'((?:landing|entrance|common|term)\.[A-Za-z0-9_.]+)'/g)].map((m) => m[1]);
const ternary = [...code.matchAll(/['"]((?:landing|entrance)\.[A-Za-z0-9_.]+)['"]/g)].map((m) => m[1]);
const templates = [...code.matchAll(/`((?:landing|entrance)\.[^`]*\$\{[^`]*)`/g)].map((m) => m[1]);

test('every literal key used exists in Thai and English', () => {
  const keys = new Set([...literal, ...ternary].filter((k) => !k.endsWith('.')));
  assert.ok(keys.size > 50, `found ${keys.size} keys`);
  for (const k of keys) for (const lang of ['th', 'en']) assert.ok(has(lang, k), `${lang} missing ${k}`);
});

test('every template key matches at least one key', () => {
  for (const tpl of templates) {
    const re = new RegExp(`^${tpl.replace(/[.]/g, '\\.').replace(/\$\{[^}]*\}/g, '[A-Za-z0-9_]+')}$`);
    for (const lang of ['th', 'en']) assert.ok(allKeys(lang).some((k) => re.test(k)), `${lang}: nothing matches ${tpl}`);
  }
});

test('no landing or entrance key is unused', () => {
  const tplRes = templates.map((tpl) => new RegExp(`^${tpl.replace(/[.]/g, '\\.').replace(/\$\{[^}]*\}/g, '[A-Za-z0-9_]+')}$`));
  const used = new Set([...literal, ...ternary]);
  for (const d of [landing, entrance]) {
    for (const k of Object.keys(d.th)) {
      assert.ok(used.has(k) || tplRes.some((re) => re.test(k)), `unused key ${k}`);
    }
  }
});
