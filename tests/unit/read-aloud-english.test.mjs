// Read-aloud marks no phrase in English text (review of pull request 247).
// The voice reads the Thai question; with the English stem or options on screen the
// phrase highlight matched stray Latin terms ("PCV2") in the English text. The stem's
// and the options' containers are withheld from the highlight while English is shown.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const card = readFileSync(new URL('../../src/components/Question.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const at = card.indexOf('container: (kind, option = -1) =>');
const container = card.slice(at, card.indexOf('\n    // The element kept above the bar', at));

test('no stem to mark while the English stem is on screen', () => {
  assert.match(card, /const shownEnglishStem = Boolean\(english\?\.q\);/);
  assert.match(container, /saysTable \|\| stemShortened \|\| shownEnglishStem \? null : stemRef\.current/);
});

test('no option row to mark while the English options are on screen', () => {
  assert.match(card, /const shownEnglishOptions = Array\.isArray\(english\?\.options\);/);
  assert.match(container, /\(shownEnglishOptions \? null : stemRef\.current/);
});
