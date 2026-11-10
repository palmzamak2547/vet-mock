// A note's body holds only shapes the readers draw (scripts/lint-note-shapes.mjs). A paragraph
// written as { text } was drawn by no reader: 3,334 of them sat in the files and on no screen.
import test from 'node:test';
import assert from 'node:assert/strict';
import { bodyProblems, normalizeBody, noteFiles, shapeProblem } from '../../scripts/lint-note-shapes.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

test('the five shapes the readers draw pass, and a paragraph object does not', () => {
  assert.equal(shapeProblem('ย่อหน้า'), null);
  assert.equal(shapeProblem({ bullets: ['a', { label: 'b', value: 'c' }] }), null);
  assert.equal(shapeProblem({ sub: 'หัวข้อย่อย', body: ['x'] }), null);
  assert.equal(shapeProblem({ table: { headers: ['a'], rows: [['1']] } }), null);
  assert.equal(shapeProblem({ callout: 'ระวัง', kind: 'warn' }), null);
  assert.match(shapeProblem({ text: 'ย่อหน้า' }), /not a shape the readers draw.*--write/);
  assert.match(shapeProblem({ text: 'x', bullets: ['a'] }), /not a shape the readers draw/);
  assert.match(shapeProblem({ callout: 'x', kind: 'note' }), /kind is tip, warn or flag/);
  assert.match(shapeProblem(''), /empty paragraph/);
  assert.match(shapeProblem(null), /neither a string nor an object/);
  // A problem inside a sub-section is found, and says where.
  assert.deepEqual(bodyProblems([{ sub: 's', body: ['ok', { text: 'x' }] }]).map((p) => p.split(' ')[0]), ['[0].body[1]']);
});

test('a paragraph object becomes the plain string, in its place', () => {
  assert.deepEqual(normalizeBody([{ text: 'a' }, { bullets: ['b'] }, 'c']), ['a', { bullets: ['b'] }, 'c']);
  assert.deepEqual(normalizeBody([{ text: 'intro', bullets: ['b'] }]), ['intro', { bullets: ['b'] }]);
  assert.deepEqual(
    normalizeBody([{ sub: 's', body: [{ text: 'x' }, { callout: 'c', kind: 'tip' }] }]),
    [{ sub: 's', body: ['x', { callout: 'c', kind: 'tip' }] }],
  );
  const drawn = [{ bullets: ['b'] }, 'c', { table: { headers: [], rows: [] } }];
  assert.deepEqual(normalizeBody(drawn), drawn);
});

test('every note in the repository holds only shapes the readers draw', async () => {
  let items = 0;
  for (const file of noteFiles()) {
    const mod = await import(pathToFileURL(path.resolve(file)).href);
    const notes = Object.values(mod).find((v) => v && typeof v === 'object');
    for (const [id, note] of Object.entries(notes)) {
      for (const section of note.sections || []) {
        assert.deepEqual(bodyProblems(section.body), [], `${path.basename(file)} ${id} "${section.heading}"`);
        items += (section.body || []).length;
      }
    }
  }
  assert.ok(items > 5000, `${items} top-level body items read`);
});
