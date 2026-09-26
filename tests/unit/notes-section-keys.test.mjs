// ============================================================
// notes-section-keys.test.mjs — a note section keeps its own state and number
// ============================================================
// B32: SectionBlock was keyed by its index in the filtered list and owns its
// open/closed state, so collapsing §3 in one topic left the next topic's §3
// collapsed, the search moved that state onto whatever landed in the slot,
// and the header printed the filtered position (the 7th section read §1).
// No runtime seam renders the view in node, so this pins the source.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../../src/views/NotesView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('sections are keyed by their id and number, never their filtered slot', () => {
  const map = SRC.slice(SRC.indexOf('{filteredSections.map('), SRC.indexOf('</ReadingEffects>'));
  assert.match(map, /key=\{`\$\{id\}@\$\{number\}`\}/);
  assert.doesNotMatch(map, /key=\{idx\}/);
  assert.match(map, /const number = sectionNumber\.get\(section\);/);
});

test('the § label is the section number in its topic, not its place in the search results', () => {
  assert.match(SRC, /const sectionNumber = useMemo\(\(\) => new Map\(topicSections\.map\(\(sec, i\) => \[sec, i \+ 1\]\)\), \[topicSections\]\);/);
  const block = SRC.slice(SRC.indexOf('const SectionBlock = memo('), SRC.indexOf('\n});', SRC.indexOf('const SectionBlock = memo(')));
  assert.match(block, /§\{number\}/);
  assert.doesNotMatch(block, /§\{idx \+ 1\}/);
});
