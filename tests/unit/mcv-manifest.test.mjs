// Turning a MyCourseVille dump into an ingest manifest. The year mapping
// is the part worth pinning: it is what gives 3,600 files their shelf
// without anyone tagging them by hand, and it has to refuse politely when
// a course does not follow the convention.
import test from 'node:test';
import assert from 'node:assert/strict';
import { yearFromCourseNo, termOf, buildManifest } from '../../scripts/mcv-manifest.mjs';

test('the fifth digit of a faculty course number is the study year', () => {
  // Verified against this account's own nine terms rather than assumed —
  // the first guess (fourth digit) was wrong. Every faculty course in
  // 2022/1 carries a 1 here, 2023/1 a 2, up to 2026/1 with a 5, matching
  // the year each was actually sat.
  assert.equal(yearFromCourseNo('3100101'), 1);   // Biology Laboratory
  assert.equal(yearFromCourseNo('3101206'), 2);
  assert.equal(yearFromCourseNo('3103305'), 3);
  assert.equal(yearFromCourseNo('3106414'), 4);   // Companion Animal Clinical Sciences II
  assert.equal(yearFromCourseNo('3107415'), 4);
  assert.equal(yearFromCourseNo('3107522'), 5);
});

test('a course from another faculty gets no year rather than a wrong one', () => {
  // 2302171 is Chemistry for Health Science — a Faculty of Science service
  // course whose digits say nothing about vet study years.
  assert.equal(yearFromCourseNo('2302171'), null);
  assert.equal(yearFromCourseNo('short'), null);
  assert.equal(yearFromCourseNo(''), null);
  assert.equal(yearFromCourseNo(null), null);
});

test('a fifth digit outside 1-6 is not a study year', () => {
  assert.equal(yearFromCourseNo('3100901'), null);
  assert.equal(yearFromCourseNo('3107915'), null);
});

test('term comes from the course, and a malformed one yields null', () => {
  assert.deepEqual(termOf({ year: '2025', semester: '1' }), { academicYear: 2025, semester: 1 });
  assert.deepEqual(termOf({ year: '2026', semester: '3' }), { academicYear: 2026, semester: 3 });
  assert.deepEqual(termOf({ year: 'x', semester: '9' }), { academicYear: null, semester: null });
});

test('a manifest carries every file with its course and term', () => {
  const dump = {
    courses: [{ cv_cid: '67995', course_no: '3107415', title: 'Companion Animal Clinical Sciences I', year: '2025', semester: '1' }],
    materials: {
      67995: {
        folders: {
          'Lecture Slides': [{ name: 'urinary 2', url: 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/a.pdf' }],
          'Heart sounds': [{ name: 'normal dog', url: 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/b.mp4' }],
          _other: [{ name: 'drive one', url: 'https://drive.google.com/file/d/x/view' }],
        },
      },
    },
  };
  const m = buildManifest(dump);
  assert.equal(m.length, 3);
  for (const x of m) {
    assert.equal(x.year, 4);
    assert.equal(x.semester, 1);
    assert.equal(x.academicYear, 2025);
    assert.equal(x.courseNo, '3107415');
    // subject stays null on purpose: a course number is not a curriculum
    // subject id, and inventing one would fail to match the question bank.
    assert.equal(x.subject, null);
  }
  // The Drive link is kept in the manifest — it is catalogued, not copied.
  assert.ok(m.some((x) => x.url.includes('drive.google.com')));
});

test('materials for a course not in the dump are dropped, not crashed on', () => {
  const m = buildManifest({ courses: [], materials: { 999: { folders: { a: [{ name: 'x', url: 'https://mycourseville/x.pdf' }] } } } });
  assert.deepEqual(m, []);
});

test('the manifest is stably ordered so a re-run is diffable', () => {
  const dump = {
    courses: [{ cv_cid: '1', course_no: '3106414', title: 'T', year: '2025', semester: '1' }],
    materials: { 1: { folders: { B: [{ name: 'b', url: 'https://mycourseville/b.pdf' }], A: [{ name: 'a', url: 'https://mycourseville/a.pdf' }] } } },
  };
  assert.deepEqual(buildManifest(dump).map((x) => x.folder), ['A', 'B']);
});
