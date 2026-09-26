// ============================================================
// index-jsonld-years.test.mjs — the app's JSON-LD names the years it covers
// ============================================================
// B60: index.html's WebApplication featureList still said "MCQ practice
// questions across years 1, 4 and 5" while the description in the same block
// said ปี 1-5, and every prerendered /app/* and /wiki/* shell copies this
// block. The claim is checked against the generated question counts.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Q_VISIBLE_COUNTS_BY_YEAR } from '../../src/data/q-counts.js';

const HTML = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

test('the featureList names the years that carry questions', () => {
  const years = Object.entries(Q_VISIBLE_COUNTS_BY_YEAR)
    .filter(([, n]) => n > 0)
    .map(([y]) => Number(y))
    .sort((a, b) => a - b);
  const range = years.length && years.every((y, i) => y === years[0] + i)
    ? `${years[0]}-${years[years.length - 1]}`
    : years.join(', ');
  assert.match(HTML, new RegExp(`"MCQ practice questions across years ${range}"`));
  assert.doesNotMatch(HTML, /across years 1, 4 and 5/);
  assert.match(HTML, new RegExp(`ครอบคลุมปี ${range}`), 'the description in the same block agrees');
});
