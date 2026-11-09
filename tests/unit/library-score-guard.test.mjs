// ============================================================
// library-score-guard.test.mjs — a score sheet never becomes a library document
// ============================================================
// On 2 Nov 2026 two score announcements were found public in library_docs, one
// with seven pages of searchable text, and two more had been archived by hand
// on 20 Oct. Nothing in the code stopped them. These pin the gates that do now:
// the title rule (scripts/lib/library-pii.mjs) at the manifest, at both bulk
// ingests and at the one-file uploader; the count of student IDs per page in
// library-pages.py; and the audit that looks for either on production.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isScoreTitle, scoreTitleMatch, scoreSheetReason, readableTitle, ROSTER_ID_PATTERN, ROSTER_IDS,
} from '../../scripts/lib/library-pii.mjs';
import { buildManifest } from '../../scripts/mcv-manifest.mjs';
import { publicationMetadata } from '../../scripts/ingest-library.mjs';
import { scoreTitleRows, rosterSql } from '../../scripts/audit-library-pii.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// The four rows archived by hand, titles exactly as stored.
const FOUND_PUBLIC = [
  'คะแนนสอบ Midterm (คะแนนดิบ)', // com4, 2 Nov: 7 pages of searchable text
  'คะแนนกลางภาค', // poultry, 2 Nov: a spreadsheet
  'ประกาศคะแนนกลางภาค ปีการศึกษา 2567', // principles-vet-med, 20 Oct
  'คะแนนสอบกลางภาค (corrected)', // vet-parasit-1, 20 Oct
];

test('the four score announcements found public read as score titles', () => {
  for (const title of FOUND_PUBLIC) assert.ok(isScoreTitle(title), title);
});

test('other ways a score or grade announcement is titled, Thai and English', () => {
  for (const title of [
    'ประกาศ คะแนนสอบปลายภาค', 'ผลสอบกลางภาค', 'ผลการสอบ lab', 'คะแนนเก็บ', 'คะแนน quiz 2', 'สรุปคะแนน', 'ใบคะแนน',
    'ประกาศเกรด 3106414', 'เกรดรายวิชา', 'ผลการเรียน ภาคต้น', 'คะแนน', 'Midterm scores', 'Final exam grades',
    'Quiz 1 marks', 'Score Midterm 2025', 'Exam results', 'Score sheet', 'Grades', 'GPAX', 'Raw score',
  ]) assert.ok(isScoreTitle(title), title);
});

test('lecture titles that share the words are not score titles', () => {
  for (const title of [
    'Class 10 G.6 คะแนน PISA ลดลง', // a gen-ed lecture topic: คะแนน alone means "score" in any sense
    'Philosophy paper grading rubrics',
    '01 Hematopoietic Sys-Lecture',
    'Meat Hygiene: Pest control (ชุดปี 2567)',
    'รายงาน (Zoonotic Disease Report) 10 คะแนน', // an assignment's weight
    'Heart murmur grades', 'Mast cell tumour grade 3', 'การจัดเกรดซากสุกร', 'Grades of lameness',
    'ผลการสอบสวนโรคพิษสุนัขบ้า', // สอบสวน is an outbreak investigation
    'ผลการเรียนรู้ที่คาดหวัง', // learning outcomes
    'Interpretation of laboratory test results', 'California mastitis test scores', 'Body condition scoring in dairy cows',
    'ข้อสอบกลางภาค 2567', 'Final exam',
    'รายชื่อกลุ่มปฏิบัติการ', // a roster by content, which is library-pages.py's job, not the title's
  ]) assert.equal(scoreTitleMatch(title), null, title);
});

test('a name is read the way MyCourseVille hands it over', () => {
  // Thai flattened to escapes, a backslash before each Thai letter, underscores.
  assert.equal(readableTitle('u0e04u0e30u0e41u0e19u0e19u0e2au0e2du0e1a_Midterm'), 'คะแนนสอบ Midterm');
  assert.ok(isScoreTitle('u0e04u0e30u0e41u0e19u0e19u0e2au0e2du0e1a_Midterm'));
  assert.ok(isScoreTitle('\\ค\\ะ\\แ\\น\\น\\ก\\ล\\า\\ง\\ภ\\า\\ค'));
  assert.ok(isScoreTitle('Midterm_score.xlsx'));
});

test('a manifest item is judged by its name, its folder and its file name, not a description', () => {
  assert.match(scoreSheetReason({ name: 'Midterm', folder: 'ประกาศคะแนน' }), /^folder "ประกาศคะแนน"/);
  assert.match(
    scoreSheetReason({ name: 'ประกาศ', url: 'https://mycourseville-default.s3.amazonaws.com/m/u0e04u0e30u0e41u0e19u0e19u0e2au0e2du0e1a_Final-838816-17561234.pdf' }),
    /^file "คะแนนสอบ Final"/,
  );
  assert.match(scoreSheetReason({ title: 'Lecture 3', path: 'C:\\inbox\\คะแนนกลางภาค.pdf' }), /^file /);
  assert.equal(scoreSheetReason({ title: 'Course syllabus', description: 'สัดส่วนคะแนนสอบกลางภาค 40%' }), null);
});

test('mcv-manifest leaves a score announcement out of the manifest and says why', () => {
  const dump = {
    courses: [{ cv_cid: '70001', course_no: '3106414', title: 'Companion Animal Clinical Sciences II', year: '2025', semester: '2' }],
    materials: {
      70001: {
        folders: {
          'Lecture Slides': [{ name: 'Urinary tract 1', url: 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/a.pdf' }],
          _other: [{ name: FOUND_PUBLIC[0], url: 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/b.pdf' }],
        },
      },
    },
  };
  const skipped = [];
  const manifest = buildManifest(dump, skipped);
  assert.deepEqual(manifest.map((m) => m.name), ['Urinary tract 1']);
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].name, FOUND_PUBLIC[0]);
  assert.match(skipped[0].reason, /คะแนนสอบ/);
  // Callers that never asked for the list still get a manifest without it.
  assert.equal(buildManifest(dump).length, 1);
});

test('the ingest refuses one carried in by hand, before any byte is read, whatever its licence or status', () => {
  for (const status of ['draft', 'public', 'archived']) {
    assert.throws(
      () => publicationMetadata({ name: FOUND_PUBLIC[1], license: 'CC-BY-4.0', status }),
      /refused, a score or grade announcement is never ingested/,
    );
  }
  assert.equal(publicationMetadata({ name: 'Urinary tract 1', license: 'CC-BY-4.0' }).status, 'draft');

  // ingest-local-docs.mjs calls the same gate: a dry run stops on it.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-score-guard-'));
  try {
    const file = path.join(tmp, 'sheet.pdf');
    const manifest = path.join(tmp, 'manifest.json');
    fs.writeFileSync(file, 'fixture');
    fs.writeFileSync(manifest, JSON.stringify([{ path: file, title: FOUND_PUBLIC[2], license: 'CC-BY-4.0' }]));
    const run = spawnSync(process.execPath, ['scripts/ingest-local-docs.mjs', `--manifest=${manifest}`, `--rows-out=${path.join(tmp, 'rows.json')}`, '--dry-run'], { cwd: ROOT, encoding: 'utf8' });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /score or grade announcement/);
    assert.equal(fs.existsSync(path.join(tmp, 'rows.json')), false, 'no row may be written');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('the one-file uploader refuses a score title before it reads the file', () => {
  const run = spawnSync(process.execPath, [
    'scripts/upload-library-doc.mjs', path.join(os.tmpdir(), 'no-such-file.pdf'),
    '--title', FOUND_PUBLIC[3], '--license', 'cc-by-4.0', '--dry-run',
  ], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /refused, a score or grade announcement is never ingested/);
});

test('the audit lists public rows with a score title, and only those', () => {
  const rows = [
    { id: 'a', title: FOUND_PUBLIC[0], status: 'archived' },
    { id: 'b', title: FOUND_PUBLIC[1], status: 'public' },
    { id: 'c', title: 'Class 10 G.6 คะแนน PISA ลดลง', status: 'public' },
    { id: 'd', title: 'ประกาศ', status: 'public', source_url: 'https://mycourseville-default.s3.amazonaws.com/m/Midterm_scores-838816-17561234.pdf' },
  ];
  assert.deepEqual(scoreTitleRows(rows).map((r) => r.id), ['b', 'd']);
});

// A roster as library-pages.py's selftest builds it, for the JavaScript and SQL
// side of the same pattern: seat number, ID in the com4 sheet's groups, score.
// Running numbers from 99901 keep the fixtures off any real student's ID.
const SHEET = 'คะแนนสอบ Midterm ' + Array.from({ length: 24 }, (_, k) => `${k + 1} 653 ${99901 + k} 31 ${41 + k}`).join(' ');
const count = (text) => (text.match(new RegExp(ROSTER_ID_PATTERN, 'g')) || []).length;

test('the student-ID pattern counts a roster and leaves registration numbers and decimals alone', () => {
  assert.equal(count(SHEET), 24);
  assert.equal(count('สมาชิกกลุ่ม 6649990122 6649990223 6649990324'), 3);
  assert.equal(count('พ่อพันธุ์โคนม 5000000149 1.25 5000000249 2.25'), 0);
  assert.equal(count('ค่าที่วัดได้ 0.6539900120 0.6539900121 0.6539900122'), 0);
  assert.equal(count('ISBN 9786161234567 and order no. 4006381333931'), 0);
});

test('library-pages.py, the audit and this module share one pattern and one threshold', () => {
  const py = fs.readFileSync(path.join(ROOT, 'scripts/library-pages.py'), 'utf8');
  assert.ok(py.includes(`ROSTER_ID = re.compile(r'${ROSTER_ID_PATTERN}')`), 'library-pages.py must carry the pattern verbatim');
  assert.ok(py.includes(`ROSTER_IDS = ${ROSTER_IDS}\n`) || py.includes(`ROSTER_IDS = ${ROSTER_IDS}\r\n`), 'and the same threshold');
  assert.ok(rosterSql().includes(`'${ROSTER_ID_PATTERN}'`), 'the audit runs the same pattern in SQL');
  assert.match(rosterSql(), new RegExp(`>= ${ROSTER_IDS}\\b`));
});

// The detector itself is Python. CI's Ubuntu image has python3; a machine
// without one skips here and CI still runs it.
function python3() {
  for (const cmd of ['python3', 'python']) {
    const r = spawnSync(cmd, ['-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === '3') return cmd;
  }
  return null;
}
const PY = python3();

test('library-pages.py holds a page of student IDs and keeps ordinary pages (its selftest)', { skip: !PY && !process.env.CI ? 'no Python 3 on this machine' : false }, () => {
  assert.ok(PY, 'CI must have Python 3');
  const run = spawnSync(PY, ['-I', 'scripts/library-pages.py', 'selftest'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /selftest ok/);
});
