// textnote: a note is a stroke; wrapping keeps every line inside its width.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeTextNote, wrapLines, fontPx, isTextNote, textNoteAt } from '../../src/lib/textnote.js';
import { transformStroke } from '../../src/lib/lasso.js';

const measure = (s) => s.length * 10; // 10 px a character

test('an empty note is no note; text is trimmed at the end only', () => {
  assert.equal(makeTextNote([0.1, 0.1], '   \n ', { id: 'a', color: '#000' }), null);
  const n = makeTextNote([0.1, 0.2], '  CPV ติดทาง fecal-oral  \n', { id: 'a', color: '#000' });
  assert.equal(isTextNote(n), true);
  assert.equal(n.text, '  CPV ติดทาง fecal-oral');
  assert.deepEqual(n.points, [[0.1, 0.2]]);
  assert.equal(n.w, 0.5);
  assert.equal(makeTextNote([0.8, 0.2], 'x', { id: 'b', color: '#000' }).w.toFixed(2), '0.20', 'wraps before the page edge');
});

test('lines wrap on word boundaries, Thai included, and never overflow', () => {
  const lines = wrapLines('Canine parvovirus causes enteritis', 120, measure);
  assert.ok(lines.every((l) => measure(l) <= 120), JSON.stringify(lines));
  assert.equal(lines.join(' '), 'Canine parvovirus causes enteritis');
  const thai = wrapLines('โรคพิษสุนัขบ้าติดต่อผ่านน้ำลาย', 80, measure);
  assert.ok(thai.length > 1 && thai.every((l) => measure(l) <= 80), JSON.stringify(thai));
  assert.equal(thai.join(''), 'โรคพิษสุนัขบ้าติดต่อผ่านน้ำลาย');
  assert.deepEqual(wrapLines('a\nb', 500, measure), ['a', 'b'], 'newlines are kept');
  const long = wrapLines('Pneumonoultramicroscopic', 60, measure);
  assert.ok(long.every((l) => measure(l) <= 60), 'one word wider than the line is split');
});

test('a lasso resize grows the font and the wrap width together', () => {
  const n = makeTextNote([0.1, 0.1], 'Rabies', { id: 'a', color: '#000', size: 3 });
  const big = transformStroke(n, { k: 2, ox: 0.1, oy: 0.1 }, 'b');
  assert.equal(big.size, 6);
  assert.equal(+big.w.toFixed(3), 0.9, 'width doubled, kept within the page');
  assert.equal(fontPx(big, 1000), 48);
});

test('a tap finds the note under it, the top one first', () => {
  const ctx = { font: '', measureText: (s) => ({ width: s.length * 10 }) };
  const a = makeTextNote([0.1, 0.1], 'Rabies', { id: 'a', color: '#000' });
  const b = makeTextNote([0.1, 0.1], 'CPV', { id: 'b', color: '#000' });
  assert.equal(textNoteAt([a, b], [0.12, 0.11], 1000, 1000, ctx).id, 'b');
  assert.equal(textNoteAt([a, b], [0.6, 0.6], 1000, 1000, ctx), null);
  assert.equal(textNoteAt([{ id: 'p', mode: 'pen', points: [[0.1, 0.1]] }], [0.1, 0.1], 1000, 1000, ctx), null);
});
