// The prerendered VetWiki pages carry words a crawler and a chat preview show
// as they are: the meta description and the Article JSON-LD. Two of them used
// a middle dot as a separator (the house rule forbids it) and the JSON-LD named
// the site "VetMock · VetWiki", while index.html already names the site VetMock.
//
// scripts/prerender-wiki.mjs needs a built dist/, and unit tests run before the
// build, so this reads the script's source. The description expression is
// evaluated on fixture values, so it checks what the page would say and not
// only how the line is spelled.
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../scripts/prerender-wiki.mjs', import.meta.url), 'utf8');
// Comments may talk about the dot; only code can ship it.
const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('the prerender script ships no middle dot in any string it writes', () => {
  assert.doesNotMatch(code, /·/);
});

test('the article description joins its parts with a dash and commas', () => {
  const m = code.match(/const description = (`[^`]*`)\.slice\(0, 300\);/);
  assert.ok(m, 'the description template literal moved: update this test with it');
  const build = new Function('k', 't', 'subjectName', 'checked', `return ${m[1]};`);
  const out = build({ summary: 'สรุปสั้น', title: 'ชื่อ', sections: [1, 2, 3] }, { subject: 'vp' }, () => 'พยาธิวิทยา', 'ตรวจทานแล้ว');
  assert.equal(out, 'สรุปสั้น — พยาธิวิทยา, 3 หัวข้อย่อย, ตรวจทานแล้ว');
});

test('the Article JSON-LD names the wiki section VetWiki and not the site twice', () => {
  const m = code.match(/isPartOf:\s*\{([^}]*)\}/);
  assert.ok(m, 'isPartOf moved: update this test with it');
  assert.match(m[1], /name:\s*'VetWiki'/);
  assert.doesNotMatch(m[1], /VetMock/);
});
