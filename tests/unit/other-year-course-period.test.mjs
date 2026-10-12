// ============================================================
// other-year-course-period.test.mjs: another year's course is studied whole,
// and every finished bank load reaches App
// ============================================================
// 5.144.4 review: under เทอม 1 ปลายภาค (the period this term defaults to) the
// study card withheld practice from 12 of 22 year-4 courses for a year-5
// student, because the selected year's term and paper were applied to another
// year's course. And a load that finished after the student had left the
// course never bumped App's revision, so its config screen said none.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { phaseForCourse } from '../../src/lib/exam-scope.js';
import { yearForSubject } from '../../src/data/curriculum.js';
import { Q_VISIBLE_COUNTS_BY_SUBJECT } from '../../src/data/q-counts.js';
import { detectStudyIntent, studyActions } from '../../src/lib/omni-intents.js';
import { buildExamPool } from '../../src/lib/exam-pool.js';
import { QB, loadQB, loadQBForYear, onQBMerged } from '../../src/data/questions.js';

test('the period narrows only a course of the selected year', () => {
  assert.equal(phaseForCourse('com5', 4, '1-final'), '1-final', 'own year');
  assert.equal(phaseForCourse('com5', 5, '1-final'), null, 'another year');
  assert.equal(phaseForCourse('all', 5, '1-final'), '1-final');
  assert.equal(phaseForCourse('com5', null, '1-final'), '1-final', 'no year chosen: nothing to compare');
  assert.equal(phaseForCourse('no-such-course', 5, '1-final'), '1-final', 'a course of no known year keeps the period');
  assert.equal(phaseForCourse('com5', 5, null), null);
});

test('every finished load is told to its listeners once, whoever started it', async () => {
  const told = [];
  const stop = onQBMerged((scope) => told.push(scope));
  await loadQBForYear(4);
  await loadQBForYear(4);
  stop();
  await loadQBForYear(5);
  assert.deepEqual(told, ['year-4'], 'one call for the load, none for the cached repeat or after unsubscribing');
});

test('another year\'s course: the card offers what the pool serves, under every period', async () => {
  await loadQB();
  // A full load holds every year: the year checks the config count and Start
  // make must say so (they kept waiting after SR's ทุกปี, fourth review).
  const { isQBYearLoaded } = await import('../../src/data/questions.js');
  for (const year of [1, 2, 3, 4, 5]) assert.equal(isQBYearLoaded(year), true, `year ${year} after a full load`);
  const wrong = [];
  for (const year of [1, 2, 3, 4, 5]) {
    for (const phase of [null, '1-mid', '1-final', '2-mid', '2-final']) {
      for (const id of Object.keys(Q_VISIBLE_COUNTS_BY_SUBJECT)) {
        const courseYear = yearForSubject(id);
        if (courseYear == null || courseYear === year) continue;
        const r = detectStudyIntent(`ข้อสอบ ${id}`, { selectedYear: year, selectedPhase: phase });
        const card = r?.subjects.find((s) => s.meta.id === id);
        if (!card) continue;
        const offered = studyActions(card, r.want).actions.find((a) => a.target === 'practice')?.count || 0;
        const served = buildExamPool({
          questions: QB, practiceMode: 'all', subject: id, topic: null, questionCategory: 'all',
          selectedYear: year, selectedPhase: phase, bookmarks: [], weakQuestions: [], history: [],
        }).length;
        if (offered !== served || offered === 0) wrong.push(`${id} from year ${year} ${phase || 'no period'}: card ${offered}, pool ${served}`);
      }
    }
  }
  assert.deepEqual(wrong, []);
});

// Chromium keeps a failed dynamic import failed until a reload; its error names
// the chunk. importBank retries that chunk under a fresh query (a new module and
// a new fetch), only for this site's own /assets/ files.
test('a failed bank import is retried under a fresh URL, and only for this site\'s assets', async () => {
  const { importBank } = await import('../../src/data/questions.js');
  const failed = (url) => () => Promise.reject(new TypeError(`Failed to fetch dynamically imported module: ${url}`));
  const asked = [];
  const importer = async (href) => { asked.push(href); return { QB_COM5: ['q1', 'q2'] }; };
  const origin = 'https://vetmock.com';
  const got = await importBank(failed('https://vetmock.com/assets/data-q-com5-Ab12.js'), 'QB_COM5', { importer, origin });
  assert.deepEqual(got, ['q1', 'q2']);
  assert.equal(asked.length, 1);
  assert.match(asked[0], /^https:\/\/vetmock\.com\/assets\/data-q-com5-Ab12\.js\?retry=\d+$/);
  // A second failure gets a different query, so a retry that failed offline is not reused.
  await importBank(failed('https://vetmock.com/assets/data-q-com5-Ab12.js'), 'QB_COM5', { importer, origin });
  assert.notEqual(asked[1], asked[0]);
  // Another origin, a path outside /assets/, or an error with no URL: the original error stands.
  for (const fn of [failed('https://evil.example/assets/x.js'), failed('https://vetmock.com/src/x.js'), () => Promise.reject(new TypeError('Importing a module script failed.'))]) {
    await assert.rejects(importBank(fn, 'QB_COM5', { importer, origin }));
  }
  assert.equal(asked.length, 2, 'nothing else was imported');
  // A load that works is left alone.
  assert.deepEqual(await importBank(async () => ['ok'], 'QB_COM5', { importer, origin }), ['ok']);
});

// Each bank chunk has to stand alone. A file two banks import lands inside one
// bank's chunk, and the other bank's chunk imports that chunk: COM IV took two
// SVGs from COM III's, so after an offline attempt COM IV could not load again
// even under importBank's fresh URL (its import of COM III's chunk stayed
// failed), and with it every year-4 load.
test('no file is imported by two question banks', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const dir = new URL('../../src/data/', import.meta.url);
  const importers = new Map();
  for (const name of readdirSync(dir).filter((f) => /^questions-.+\.js$/.test(f))) {
    const text = readFileSync(new URL(name, dir), 'utf8');
    for (const m of text.matchAll(/from\s+['"]\.\/([^'"]+)['"]/g)) {
      importers.set(m[1], [...(importers.get(m[1]) || []), name]);
    }
  }
  const shared = [...importers].filter(([, banks]) => banks.length > 1).map(([file, banks]) => `${file}: ${banks.join(', ')}`);
  assert.deepEqual(shared, []);
});

// A retry that brings back a chunk without this bank's export (two banks in
// one chunk export namespace objects under short names) keeps the first error:
// the load fails visibly instead of passing with no questions (437 VCA ones).
test('a retried chunk that does not export the bank by name keeps the first error', async () => {
  const { importBank } = await import('../../src/data/questions.js');
  const first = new TypeError('Failed to fetch dynamically imported module: https://vetmock.com/assets/data-q-vca-X1.js');
  const merged = async () => ({ a: { QB_VCA: ['q'] }, q: { QB_VCA_REVIEWED: ['r'] } });
  await assert.rejects(importBank(() => Promise.reject(first), 'QB_VCA', { importer: merged, origin: 'https://vetmock.com' }), (err) => err === first);
});

test('a bank that is not a list fails the merge and is not marked loaded', async () => {
  const { mergeBanks } = await import('../../src/data/questions.js');
  const loaded = new Set();
  const target = [];
  assert.throws(() => mergeBanks([{ file: 'a.js', questions: ['q1'] }, { file: 'b.js', questions: undefined }], loaded, target), /b\.js/);
  assert.equal(loaded.size, 0, 'nothing marked loaded');
  assert.deepEqual(target, [], 'nothing merged from a failed load');
  mergeBanks([{ file: 'a.js', questions: ['q1'] }, { file: 'a.js', questions: ['q1'] }], loaded, target);
  assert.deepEqual(target, ['q1'], 'each bank once');
});
