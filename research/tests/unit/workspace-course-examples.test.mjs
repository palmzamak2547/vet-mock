// The sample-size screen's course examples: inputs pinned to the committed course fixture, and every
// word about them in both dictionaries (review round 2: the fixture's English strings and a deck file
// name were shown as UI copy on Thai screens). OWNER: workspace role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COURSE_EXAMPLES, missingRequired } from '../../src/workspace/lib/course-examples.js';
import ws from '../../src/i18n/workspace.js';

const course = JSON.parse(readFileSync(new URL('../fixtures/course/epi-course-2026.json', import.meta.url), 'utf8'));

test('every sample-size example in the course fixture is on the screen with the same inputs', () => {
  const fromFixture = course.items.filter((i) => i.method.startsWith('ss.'));
  assert.equal(COURSE_EXAMPLES.length, fromFixture.length);
  for (const it of fromFixture) {
    const ex = COURSE_EXAMPLES.find((e) => e.id === it.id);
    assert.ok(ex, `example ${it.id} missing`);
    assert.equal(ex.method, it.method);
    assert.deepEqual(ex.input, it.input, `inputs of ${it.id}`);
  }
});

test('each example has its name, answer and formula in Thai and English, and a readable deck name', () => {
  for (const lang of ['th', 'en']) {
    for (const ex of COURSE_EXAMPLES) {
      for (const k of [`ws.ss.example.${ex.id}`, `ws.ss.ex.${ex.id}.answer`, `ws.ss.ex.${ex.id}.formula`, `ws.ss.deck.${ex.deck}`]) {
        assert.ok(ws[lang][k], `${lang} ${k}`);
        assert.ok(!/_TC|\^|z_a/.test(ws[lang][k]), `${lang} ${k} reads like a file name or plain-text math: ${ws[lang][k]}`);
      }
      if (ex.explain) assert.ok(ws[lang][`ws.ss.ex.${ex.id}.explain`]);
    }
  }
  // The course answers in the dictionary are the fixture's answers.
  for (const it of course.items.filter((i) => i.method.startsWith('ss.'))) {
    for (const num of String(it.courseAnswer).match(/\d+(\.\d+)?/g) || []) assert.ok(ws.en[`ws.ss.ex.${it.id}.answer`].includes(num), `${it.id}: ${num}`);
  }
});

test('missingRequired names the empty inputs that stop a calculation', () => {
  assert.deepEqual(missingRequired('ss.proportion', { p: 0.5 }), ['d']);
  assert.deepEqual(missingRequired('ss.proportion', { baseN: 544, N: 2000 }), []);
  assert.deepEqual(missingRequired('ss.proportion', {}), ['p', 'd']);
  assert.deepEqual(missingRequired('ss.caseControl', { OR: 3, p0: 0.25 }), []);
  assert.deepEqual(missingRequired('ss.paired', {}), ['d']);
});
