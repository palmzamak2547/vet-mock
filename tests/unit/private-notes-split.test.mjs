// The import control splits a key into one database row per exam section.
// If the split drops or reorders questions the admin reads a paper that is
// not the paper, so the arithmetic gets a check of its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import { splitKey } from '../../src/lib/private-notes.js';

const key = {
  title: 'a paper',
  questions: [
    { n: 1, sectionFile: 's1', section: 'One' },
    { n: 2, sectionFile: 's1', section: 'One' },
    { n: 3, sectionFile: 's2', section: 'Two' },
  ],
};

test('one part per section, numbered from 1, in section order', () => {
  const parts = splitKey(key);
  assert.deepEqual(parts.map((p) => p.part), [1, 2]);
  assert.deepEqual(parts.map((p) => p.payload.sectionFile), ['s1', 's2']);
  assert.deepEqual(parts.map((p) => p.payload.section), ['One', 'Two']);
  assert.deepEqual(parts.map((p) => p.payload.range), [[1, 2], [3, 3]]);
});

test('every question survives the split exactly once', () => {
  const ns = splitKey(key).flatMap((p) => p.payload.questions.map((q) => q.n));
  assert.deepEqual(ns, [1, 2, 3]);
});

test('the paper-level fields ride on part 1 and are not repeated', () => {
  const parts = splitKey(key);
  assert.equal(parts[0].payload.meta.title, 'a paper');
  assert.equal(parts[0].payload.meta.questions, undefined);
  assert.equal(parts[1].payload.meta, undefined);
});

test('a file with no question list stores as a single part', () => {
  const parts = splitKey({ title: 'a note', body: 'text' });
  assert.equal(parts.length, 1);
  assert.equal(parts[0].payload.body, 'text');
});
