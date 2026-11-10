// The faculty directory is 1,188 KB of JavaScript (300 KB gzip), 828 KB of it
// publication lists. The topic screen and the search palette imported all of
// it to answer "does this lecturer string name someone with a profile?" and
// to match names. They read a slim index now, and the directory loads when a
// profile opens. These tests pin what keeps that honest: the index is the
// directory's own rows minus the heavy fields, a lecturer string resolves to
// the same person through either list, and neither screen imports the
// directory again.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { ALL_INSTRUCTORS, getInstructorBySlug, getInstructorByLecturerString } from '../../src/data/instructors.js';
import { INSTRUCTOR_INDEX, findInstructorByLecturerString } from '../../src/data/instructor-index.js';
import { INDEX_FIELDS, generateInstructorIndex, OUT } from '../../scripts/regen-instructor-index.mjs';
import { sameGenerated } from '../../scripts/lib/same-generated.mjs';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('the checked-in index is what the directory generates today', async () => {
  assert.ok(sameGenerated(readFileSync(OUT, 'utf8'), await generateInstructorIndex()),
    'instructor-index.generated.js is stale: npm run regen:instructor-index');
});

test('one row per person, in the directory order, with nothing heavy', () => {
  assert.deepEqual(INSTRUCTOR_INDEX.map((row) => row.slug), ALL_INSTRUCTORS.map((instructor) => instructor.slug));
  for (const row of INSTRUCTOR_INDEX) {
    for (const key of Object.keys(row)) assert.ok(INDEX_FIELDS.includes(key), `${row.slug} carries ${key}`);
    const full = getInstructorBySlug(row.slug);
    for (const key of Object.keys(row)) assert.deepEqual(row[key], full[key], `${row.slug}.${key}`);
  }
  const size = Buffer.byteLength(read('src/data/instructor-index.generated.js'));
  const directory = Buffer.byteLength(read('src/data/instructors-directory.js'));
  assert.ok(size * 8 < directory, `the index is ${size} bytes against the directory's ${directory}: a heavy field came back`);
});

test('a lecturer string names the same person through the index as through the directory', () => {
  const strings = new Set();
  for (const subject of SUBJECTS) for (const topic of subject.topics || []) if (topic.lecturer) strings.add(topic.lecturer);
  // Names as a student or a search would type them, too.
  for (const instructor of ALL_INSTRUCTORS) for (const name of [instructor.nameEn, instructor.nameTh, ...(instructor.aliases || [])]) if (name) strings.add(name);
  assert.ok(strings.size > 400, `expected the curriculum's lecturer strings, saw ${strings.size}`);
  let resolved = 0;
  for (const text of strings) {
    const slim = findInstructorByLecturerString(text);
    const full = getInstructorByLecturerString(text);
    assert.equal(slim?.slug ?? null, full?.slug ?? null, text);
    if (slim) resolved += 1;
  }
  assert.ok(resolved > 300, `only ${resolved} strings resolved`);
  assert.equal(findInstructorByLecturerString('TBD'), null);
  assert.equal(findInstructorByLecturerString(''), null);
});

test('an opened profile is the full record, whichever row opened it', () => {
  const row = INSTRUCTOR_INDEX.find((r) => getInstructorBySlug(r.slug).papers?.length);
  assert.ok(row && !('papers' in row));
  assert.ok(getInstructorBySlug(row.slug).papers.length > 0);
  const src = read('src/components/InstructorProfile.jsx');
  assert.match(src, /getInstructorBySlug\(instructor\.slug\) \|\| instructor/);
});

test('the topic screen and the palette do not import the directory', () => {
  for (const path of ['src/views/TopicSelectView.jsx', 'src/components/CommandPalette.jsx', 'src/App.jsx', 'src/app/lazy-views.js', 'src/data/instructor-index.js', 'src/lib/instructor-lookup.js']) {
    const src = read(path);
    // An import, static or dynamic; a comment may name the file.
    assert.doesNotMatch(src, /(?:from\s*|import\s*\(\s*)['"][^'"]*\/instructors(?:-directory)?\.js['"]/, `${path} imports the directory`);
    assert.doesNotMatch(src, /(?:from\s*|import\s*\(\s*)['"][^'"]*\/InstructorModal\.jsx['"]/, `${path} opens the modal without its loader`);
  }
  assert.match(read('src/views/TopicSelectView.jsx'), /import\('\.\.\/data\/instructor-index\.js'\)/);
  assert.match(read('src/components/CommandPalette.jsx'), /from '\.\.\/data\/instructor-index\.js'/);
  // Vite files the directory by this substring; the index must not match it.
  assert.match(read('vite.config.js'), /id\.includes\('data\/instructors'\)\) return 'data-instructors'/);
});

test('a profile that is still downloading shows the loading bar, and a failed one says so', () => {
  // One place opens a profile, for the palette and for a topic's lecturer chip.
  assert.match(read('src/App.jsx'), /<OptionalFeature label="ข้อมูลอาจารย์"[\s\S]{0,120}?pending=\{<OverlayPending label="กำลังเปิดข้อมูลอาจารย์" \/>\}>\s*<InstructorProfile /);
  assert.match(read('src/App.jsx'), /<TopicSelectView onOpenInstructor=\{setOpenInstructor\}/);
  assert.match(read('src/views/TopicSelectView.jsx'), /if \(found\) onOpenInstructor\?\.\(found\);/);
  assert.match(read('src/components/OptionalFeature.jsx'), /<Suspense fallback=\{pending\}>/);
});
