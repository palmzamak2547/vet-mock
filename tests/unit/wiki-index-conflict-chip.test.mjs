// A disagreement between the lecture and the evidence is marked ONCE, at the
// section it concerns (ConflictNote, with both sides and what to write in the
// exam). Until 5.214 the same 202 points in 91 of 224 topics were also a tag
// on every index row, a count on each shelf volume, a "!" in every contents
// list with a legend to explain it, a cell in the article header, a filter and
// a footer with its own count and button.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const view = read('src/views/KnowledgeView.jsx');
const shelves = read('src/components/WikiShelves.jsx');

test('the index, the shelves, the contents and the header carry no conflict marker', () => {
  for (const gone of ['vw-conflict-chip', 'ConflictLegend', 'vw-flag', 'vw-filter', 'onlyConflicts', 'is-conflict', 'ดูหัวข้อที่มีจุดเหล่านี้', 'conflictCountFor']) {
    assert.ok(!view.includes(gone), `KnowledgeView still has ${gone}`);
  }
  assert.ok(!shelves.includes('s.conflicts'), 'a shelf volume still counts conflicts');
  assert.ok(!/หลักฐานไม่ตรงกับที่บรรยาย/.test(view), 'the old marker words are still on a wiki screen');
});

test('the one marker stays at its section, one per recorded point', () => {
  const section = view.slice(view.indexOf('const Section = React.memo'), view.indexOf('// Library pages that name'));
  assert.match(section, /\(s\.corrections \|\| \[\]\)\.map\(\(c, k\) => \(/);
  assert.match(section, /<ConflictNote item=\{c\} \/>/);
});

test('the marker says it in plain Thai, both sides and the exam line', () => {
  const note = read('src/components/ConflictNote.jsx');
  for (const words of ['ตรงนี้แหล่งอ้างอิงไม่ตรงกับที่สอน', 'ที่สอนในคาบ', 'แหล่งอ้างอิงว่า', 'ตอนสอบ']) {
    assert.ok(note.includes(words), `ConflictNote lost "${words}"`);
  }
});
