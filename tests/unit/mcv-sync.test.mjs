// ============================================================
// mcv-sync.test.mjs — MyCourseVille against the library, in one command
// ============================================================
// scripts/mcv-sync.mjs replaced five steps done by hand. What it must keep true:
// the library's own rows are the base of the diff (no file from a previous pull),
// the default run changes nothing, and a file is shelved only when every gate
// passes. Anything doubtful is held with its reason: a score announcement, a
// list of students, a file whose text cannot be read, bytes the library already
// has under any status.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  describe, insertSql, inspect, localSetup, permissionEvidence, reconcile, run, sameTextSql, shelve, textDoubt, urlKey,
} from '../../scripts/mcv-sync.mjs';
import { rosterReason, rosterTitleMatch } from '../../scripts/lib/library-pii.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const S3 = 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2026_1/1/materials/';
const sha16 = (bytes) => createHash('sha256').update(bytes).digest('hex').slice(0, 16);

const COURSE = { cv_cid: '1', course_no: '3109501', title: 'Food Industry and Quality Control [Section 1]', year: '2026', semester: '1' };
const dumpOf = (folders) => ({ term: '2026/1', courses: [COURSE], materials: { 1: { folders } }, errors: [] });
const libraryRow = (over) => ({ slug: 'a-row', title: 'A row', status: 'public', text_status: 'ok', sha256_16: 'f'.repeat(16), source_url: null, ...over });
const fate = (items, name) => items.find((item) => item.name === name)?.fate;

// ── one upload, one key ──────────────────────────────────────────────

test('an upload has one key in every form its URL has been written down', () => {
  const flattened = `${S3}u0e15u0e23u0e35_Esophageal_2025-838816-17561234567890.pdf`; // how the catalog stored it until Nov 2026
  const encoded = `${S3}%E0%B8%95%E0%B8%A3%E0%B8%B5_Esophageal_2025-838816-17561234567890.pdf`; // how the bridge lists it now
  const raw = `${S3}ตรี_Esophageal_2025-838816-17561234567890.pdf`;
  assert.equal(urlKey(encoded), flattened);
  assert.equal(urlKey(raw), flattened);
  assert.equal(urlKey(flattened), flattened);
  // A plain URL is its own key, and two uploads never share one.
  const plain = `${S3}Zoonoses_(5th_year_student___2569)-100004-17000000000004.pdf`;
  assert.equal(urlKey(plain), plain);
  assert.notEqual(urlKey(plain), urlKey(plain.replace('17000000000004', '17000000000005')));
  // An emoji is two UTF-16 units, each flattened the way the old listing flattened its two escapes.
  assert.equal(urlKey(`${S3}%F0%9F%8F%85_deck.pdf`), `${S3}ud83cudfc5_deck.pdf`);
  // A share link's ?e= token differs between copies of the same link; a stray % is compared as it came.
  assert.equal(urlKey('https://chula-my.sharepoint.com/:b:/g/personal/someone/EXample?e=AbC123'), 'https://chula-my.sharepoint.com/:b:/g/personal/someone/EXample');
  assert.equal(urlKey(`${S3}50%_solution.pdf`), `${S3}50%_solution.pdf`);
});

// ── the listing against the catalog ──────────────────────────────────

test('a file the library holds is not listed, whatever its status and whichever way its URL was stored', () => {
  const dump = dumpOf({
    'Lecture Slides': [
      { name: 'ตรี Esophageal', url: `${S3}%E0%B8%95%E0%B8%A3%E0%B8%B5_Esophageal-838816-17561234567890.pdf` },
      { name: 'Archived once', url: `${S3}archived-838816-17561234567891.pdf` },
      { name: 'Shared deck', url: 'https://chula-my.sharepoint.com/:b:/g/personal/someone/EXample?e=AbC123' },
      { name: 'Brand new', url: `${S3}brand_new-838816-17561234567892.pdf` },
    ],
  });
  const catalog = [
    libraryRow({ slug: 'thai', source_url: `${S3}u0e15u0e23u0e35_Esophageal-838816-17561234567890.pdf` }),
    libraryRow({ slug: 'gone', status: 'archived', text_status: 'pii_held', source_url: `${S3}archived-838816-17561234567891.pdf` }),
    libraryRow({ slug: 'share', source_url: 'https://chula-my.sharepoint.com/:b:/g/personal/someone/EXample' }),
  ];
  const result = reconcile(dump, catalog);
  assert.deepEqual(result.items.map((item) => item.name), ['Brand new']);
  assert.equal(result.listed, 4);
  assert.equal(result.inLibrary, 3);
  assert.equal(result.items[0].fate, undefined, 'a new PDF waits for its bytes');
  assert.equal(result.items[0].academicYear, 2026);
  // With no rows at all, everything is new: the diff needs no file from an earlier pull.
  assert.equal(reconcile(dump, []).items.length, 4);
});

test('a course that lists nothing while the library holds its files is reported, never read as "nothing new"', () => {
  // Two 2026/1 courses kept their files outside folders, and the listing came back empty for them for months.
  const course = (cv_cid, course_no) => ({ cv_cid, course_no, title: 'A course [Section 1]', year: '2026', semester: '1' });
  const files = 'https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2026_1/';
  const dump = {
    term: '2026/1',
    courses: [COURSE, course('2', '3107520'), course('3', '3107507'), course('4', '3109504')],
    materials: { 1: { folders: { _other: [{ name: 'Deck', url: `${S3}deck-838816-17561234567890.pdf` }] } }, 2: { folders: {} }, 3: { folders: {} } },
    errors: [{ cv_cid: '4', course_no: '3109504', error: 'request failed (Timeout)' }],
  };
  const catalog = [
    libraryRow({ source_url: `${files}2/materials/fish_1-838816-17561234567890.pdf` }),
    libraryRow({ source_url: `${files}2/materials/fish_2-838816-17561234567891.pdf`, status: 'archived' }),
    libraryRow({ source_url: `${files}4/materials/prion-838816-17561234567892.pdf` }), // its course failed to list: said once, by the bridge
    libraryRow({ source_url: `${files}22/materials/another_course-838816-17561234567893.pdf` }),
  ];
  assert.deepEqual(reconcile(dump, catalog).silent, [
    { cv_cid: '2', course_no: '3107520', error: 'it lists no files, yet the library holds 2 from it: the listing may be broken' },
  ]);
  // A course with nothing listed and nothing shelved is an empty course.
  assert.deepEqual(reconcile(dump, []).silent, []);
});

test('the listing alone holds a score sheet, a roster, an external link and a file that is not a PDF', () => {
  const dump = dumpOf({
    _other: [
      { name: 'คะแนนสอบกลางภาค (แก้ไข)', url: `${S3}Avian_Med_2569-100001-17000000000001.pdf` },
      { name: 'รายชื่อและกลุ่มนิสิตปี 5 (1-2569)', url: `${S3}groups-100002-17000000000002.pdf` },
      { name: 'Module 1', url: 'https://example.github.io/Module1/index.html' },
      { name: 'Worksheet', url: `${S3}worksheet-100003-17000000000003.docx` },
      { name: 'Scores of nothing', url: `${S3}Midterm_scores-838816-17561234.xlsx` },
      { name: 'Lecture 4', url: `${S3}lecture_4-838832-17872000000000.pdf` },
    ],
  });
  const { items } = reconcile(dump, []);
  const reason = (name) => items.find((item) => item.name === name).reason;
  assert.equal(items.length, 6);
  assert.match(reason('คะแนนสอบกลางภาค (แก้ไข)'), /^a score or grade announcement is never shelved: name ".+" reads as คะแนนสอบ/);
  assert.match(reason('Scores of nothing'), /never shelved: file "Midterm scores"/);
  assert.match(reason('รายชื่อและกลุ่มนิสิตปี 5 (1-2569)'), /^a list of students is a person's decision: name .+รายชื่อ/);
  assert.match(reason('Module 1'), /^an external link \(example\.github\.io\)/);
  assert.match(reason('Worksheet'), /^a \.docx file: only a PDF's text can be read/);
  assert.deepEqual(items.filter((item) => item.fate === 'held').length, 5);
  assert.equal(fate(items, 'Lecture 4'), undefined);
});

test('a title reads as a list of students, groups, seats or attendance; a lesson that shares the words does not', () => {
  const rosters = [
    'รายชื่อและกลุ่มนิสิตปี 5 (1-2569)', 'รายชื่อแบ่งกลุ่ม PBL KUB (updated 5-8)', 'ใบรายชื่อลงทะเบียนครั้งที่ 1', 'รายชื่อ CR สำหรับสอบแลป',
    'รายชื่อเข้าเรียนปฏิบัติการวันที่ 11 กย 68', 'การแบ่งกลุ่มปฏิบัติการ', 'ใบเช็คชื่อ workshop', 'ประกาศ สรุปการเข้าเรียน', 'สรุปผลการเข้าเรียน midterm',
    'ผังที่นั่งสอบปลายภาค', 'รายชื่อผู้มีสิทธิ์สอบ', 'Student list 2026', 'Group list (lab)', 'Seating plan final exam', 'Attendance week 3',
    'Lab roster', 'List of students by group', 'Sign-up sheet',
  ];
  for (const title of rosters) assert.ok(rosterTitleMatch(title), `should be held: ${title}`);
  const lessons = [
    'รายชื่อที่สำคัญในปฏิบัติการ integument', 'รายชื่อสิ่งที่ต้องรู้ในปฏิบัติการส่วนหัวและคอ', 'รายชื่อในปฏิบัติการ 31 สค', 'PBL สำหรับกลุ่มที่ 1 และ กลุ่มที่ 10',
    'คำอธิบายงานกลุ่ม', 'ระเบียบคณะ ว่าด้วยเรื่องการเข้าและการลาเรียนของนิสิต', 'Blood group', 'Assignment (group)_immunomodulatory agent',
    'Class 5 Group Activity (Mortality)', 'Drug list for small animals', 'Problem list and differential diagnosis', 'Seat belt injuries in dogs',
  ];
  for (const title of lessons) assert.equal(rosterTitleMatch(title), null, `should pass: ${title}`);
  // Read the way a score title is: the name, the folder and the file name of the upload.
  assert.match(rosterReason({ name: 'File 1', folder: 'PBL และรายชื่อกลุ่ม' }), /^folder /);
  assert.match(rosterReason({ name: 'File 1', url: `${S3}%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD_lab-100002-17000000000006.pdf` }), /^file "รายชื่อ lab"/);
  assert.equal(rosterReason({ name: 'Lecture 4', folder: 'Lecture Slides', url: `${S3}lecture_4-838832-17872000000000.pdf` }), null);
});

// ── bytes: duplicate, held or ready ──────────────────────────────────

const PDF = { deck: Buffer.from('%PDF deck'), twin: Buffer.from('%PDF deck'), held: Buffer.from('%PDF archived once'), roster: Buffer.from('%PDF roster'), scan: Buffer.from('%PDF scan'), fresh: Buffer.from('%PDF fresh') };

function fakes({ bytes = {}, verdicts = {}, checkError, sameText = [] } = {}) {
  const calls = { fetched: [], checked: [], saved: [], sql: [] };
  return {
    calls,
    sql: async (query, opts = {}) => { calls.sql.push({ query, readOnly: opts.readOnly === true }); return sameText; },
    fetchFile: async (url) => {
      calls.fetched.push(url);
      const hit = Object.entries(bytes).find(([needle]) => url.includes(needle));
      if (!hit) return { ok: false, status: 403 };
      return { ok: true, status: 200, bytes: hit[1] };
    },
    saveFile: (buf) => { const file = `tmp/${calls.saved.length}.pdf`; calls.saved.push({ file, buf }); return file; },
    checkPdfs: async (files) => {
      calls.checked.push(...files);
      const map = new Map();
      for (const file of files) {
        const buf = calls.saved.find((s) => s.file === file).buf;
        const verdict = Object.entries(verdicts).find(([text]) => buf.toString().includes(text))?.[1];
        if (verdict) map.set(file, { file, ...verdict });
      }
      if (checkError) map.error = checkError;
      return map;
    },
  };
}

test('bytes decide the rest: a duplicate of any row, a twin in the same run, a text that leaves a doubt', async () => {
  const names = ['Deck', 'Deck again', 'Back under a new URL', 'Laboratory handout', 'Scanned handout', 'Gone', 'Empty', 'Fresh', 'คะแนนสอบ'];
  const dump = dumpOf({ 'Lecture Slides': names.map((name, i) => ({ name, url: `${S3}f${i}-838816-1756123456789${i}.pdf` })) });
  const catalog = [libraryRow({ slug: 'archived-once', title: 'Archived once', status: 'archived', sha256_16: sha16(PDF.held) })];
  const { items } = reconcile(dump, catalog);
  const io = fakes({
    bytes: { 'f0-': PDF.deck, 'f1-': PDF.twin, 'f2-': PDF.held, 'f3-': PDF.roster, 'f4-': PDF.scan, 'f6-': Buffer.alloc(0), 'f7-': PDF.fresh },
    verdicts: {
      deck: { status: 'ok', page_count: 12, notes: {} },
      roster: { status: 'pii_held', page_count: 2, notes: { id_matches: 8, roster_pages: [2] } },
      scan: { status: 'no_text', page_count: 3, notes: {} },
      // "fresh" gets no verdict: the check died on it.
    },
    checkError: 'No module named fitz',
  });
  await inspect(items, catalog, io);
  const by = (name) => items.find((item) => item.name === name);

  assert.equal(by('Deck').fate, 'shelve');
  assert.equal(by('Deck').pages, 12);
  assert.equal(by('Deck').sha256_16, sha16(PDF.deck));
  assert.equal(by('Deck again').fate, 'duplicate');
  assert.match(by('Deck again').reason, /the same bytes as "Deck", listed in this run/);
  // An archived document does not come back because it was uploaded again.
  assert.equal(by('Back under a new URL').fate, 'duplicate');
  assert.deepEqual(by('Back under a new URL').duplicateOf, { slug: 'archived-once', title: 'Archived once', status: 'archived' });
  assert.match(by('Back under a new URL').reason, /"Archived once" \(archived-once, archived\)/);
  assert.equal(by('Laboratory handout').fate, 'held');
  assert.match(by('Laboratory handout').reason, /page 2 lists students \(8 ID-like numbers\)/);
  assert.equal(by('Scanned handout').fate, 'held');
  assert.match(by('Scanned handout').reason, /no page has text to read/);
  assert.match(by('Gone').reason, /the download answered 403/);
  assert.match(by('Empty').reason, /empty on MyCourseVille/);
  // No verdict is a doubt, never a pass.
  assert.equal(by('Fresh').fate, 'held');
  assert.match(by('Fresh').reason, /its text was not checked \(No module named fitz\)/);

  // What the listing already held is never fetched, and only undecided bytes reach the text check.
  assert.equal(io.calls.fetched.some((url) => url.includes('f8-')), false);
  assert.equal(io.calls.fetched.length, 8);
  assert.equal(io.calls.checked.length, 4, 'deck, roster, scan and fresh: not the duplicates');
});

test('a deck saved again is a duplicate of the stored copy, whatever its bytes', async () => {
  // On 1 Nov 2026 a 110-page deck came back from MyCourseVille 4 MB lighter: other bytes, a new URL, the same words
  // on every page. library-pages.py's fingerprint of the text is what the stored pages hash to.
  const names = ['Marine mammals', 'Biosecurity', 'Biosecurity (v2 upload)', 'Photo plates', 'New deck'];
  const dump = dumpOf({ _other: names.map((name, i) => ({ name, url: `${S3}t${i}-838816-1756123456780${i}.pdf` })) });
  const { items } = reconcile(dump, []);
  const md5 = (c) => c.repeat(32);
  const io = fakes({
    bytes: { 't0-': Buffer.from('%PDF resaved'), 't1-': Buffer.from('%PDF bio one'), 't2-': Buffer.from('%PDF bio two'), 't3-': Buffer.from('%PDF plates'), 't4-': Buffer.from('%PDF new') },
    verdicts: {
      resaved: { status: 'ok', page_count: 110, text_chars: 48_000, text_md5: md5('a') },
      'bio one': { status: 'ok', page_count: 31, text_chars: 9_000, text_md5: md5('b') },
      'bio two': { status: 'ok', page_count: 31, text_chars: 9_000, text_md5: md5('b') },
      plates: { status: 'ok', page_count: 110, text_chars: 60, text_md5: md5('a') }, // too little text to call it the same deck
      new: { status: 'partial', page_count: 87, text_chars: 30_000, text_md5: md5('c') },
    },
    sameText: [{ slug: 'marine-mammals-52bd37', title: 'Marine mammals (2026)', status: 'public', text_status: 'ok', md5: md5('a') }],
  });
  await inspect(items, [], io);
  const by = (name) => items.find((item) => item.name === name);

  assert.equal(by('Marine mammals').fate, 'duplicate');
  assert.deepEqual(by('Marine mammals').duplicateOf, { slug: 'marine-mammals-52bd37', title: 'Marine mammals (2026)', status: 'public' });
  assert.match(by('Marine mammals').reason, /^the same text across the same 110 pages as "Marine mammals \(2026\)" \(marine-mammals-52bd37, public\)$/);
  assert.equal(by('Biosecurity').fate, 'shelve');
  assert.equal(by('Biosecurity (v2 upload)').fate, 'duplicate');
  assert.match(by('Biosecurity (v2 upload)').reason, /the same text across the same 31 pages as "Biosecurity", listed in this run/);
  assert.equal(by('Photo plates').fate, 'shelve');
  assert.equal(by('New deck').fate, 'shelve');

  // One read-only question for the whole run, about documents of those page counts only.
  assert.equal(io.calls.sql.length, 1);
  assert.equal(io.calls.sql[0].readOnly, true);
  assert.equal(io.calls.sql[0].query, sameTextSql([{ md5: md5('b'), pages: 31 }, { md5: md5('a'), pages: 110 }, { md5: md5('c'), pages: 87 }]));
  assert.match(io.calls.sql[0].query, /where k\.page_count in \(31, 110, 87\)/);
  assert.match(io.calls.sql[0].query, new RegExp(`where t\\.md5 in \\('${md5('b')}', '${md5('a')}', '${md5('c')}'\\)$`));
  assert.match(io.calls.sql[0].query, /md5\(string_agg\(p\.body, ' ' order by p\.page\)\)/);
  // Nothing but page counts and fingerprints is ever written into that statement.
  assert.doesNotMatch(sameTextSql([{ md5: "x'; drop table library_docs; --", pages: '1; select 1' }, { md5: md5('a'), pages: 2 }]), /drop|select 1/);
});

test('every status library-pages.py can give is a pass or a stated doubt', () => {
  assert.equal(textDoubt({ status: 'ok' }), null);
  assert.equal(textDoubt({ status: 'partial', notes: { garbled_pages: 3 } }), null);
  assert.match(textDoubt({ status: 'pii_held', notes: { id_matches: 1 } }), /a student or national ID number \(1\)/);
  assert.match(textDoubt({ status: 'garbled' }), /does not decode/);
  assert.match(textDoubt({ status: 'unreadable', notes: { error: 'no objects found' } }), /does not open as a PDF \(no objects found\)/);
  assert.match(textDoubt({ status: 'something new' }), /was not checked/);
  assert.match(textDoubt(undefined), /was not checked/);
});

// ── the run ──────────────────────────────────────────────────────────

const READY = dumpOf({
  'Lecture Slides': [
    { name: 'ตรี &amp; Esophageal', url: `${S3}%E0%B8%95%E0%B8%A3%E0%B8%B5_Esophageal-838816-17561234567890.pdf` },
    { name: 'รายชื่อนิสิต', url: `${S3}names-838816-17561234567891.pdf` },
  ],
});

function runDeps({ catalog = [], refuseWrites = false, putStatus = 200, keepRow = true, readBack } = {}) {
  const io = fakes({ bytes: { Esophageal: PDF.deck }, verdicts: { deck: { status: 'ok', page_count: 12, text_chars: 4_000, text_md5: 'd'.repeat(32), notes: {} } } });
  const log = { sql: [], put: [], readBack: [] };
  const never = (what) => () => { throw new Error(`${what} must not happen in a run that changes nothing`); };
  let inserted = [];
  return {
    log,
    ...io,
    bucket: 'vetmock-library',
    sql: async (query, opts = {}) => {
      log.sql.push({ query, readOnly: opts.readOnly === true });
      if (/^select slug, title, status/.test(query)) return catalog;
      if (query.startsWith('select d.slug, d.title, d.status, d.text_status, t.md5')) return [];
      if (refuseWrites) throw new Error('a write was sent');
      if (query.startsWith('insert into library_docs')) {
        const [, , json] = query.match(/jsonb_to_recordset\((\$r[0-9a-f]{12}\$)([\s\S]*)\1::jsonb\)/);
        inserted = JSON.parse(json);
        return inserted.map((row) => ({ slug: row.slug }));
      }
      return keepRow ? inserted.map((row) => ({ slug: row.slug, storage_key: row.storage_key })) : [];
    },
    readFile: refuseWrites ? never('reading a file to upload') : (file) => io.calls.saved.find((s) => s.file === file).buf,
    put: refuseWrites ? never('an upload') : async (key, bytes, mime, bucket) => { log.put.push({ key, bytes, mime, bucket }); return { ok: putStatus === 200, status: putStatus }; },
    readBack: refuseWrites ? never('a read-back') : async (slug) => { log.readBack.push(slug); return readBack ?? PDF.deck; },
    inserted: () => inserted,
  };
}

test('the default run changes nothing: two read-only questions to the catalog, no upload, no insert', async () => {
  const deps = runDeps({ refuseWrites: true });
  const result = await run({ dump: READY, day: '2026-11-13' }, deps);
  assert.equal(result.mode, 'check');
  assert.deepEqual(deps.log.sql.map((call) => call.readOnly), [true, true], 'every statement sent is marked read-only for the database to enforce');
  assert.match(deps.log.sql[0].query, /^select .+ from library_docs$/, 'every row, every status');
  assert.ok(deps.log.sql.every((call) => call.query.startsWith('select ')));
  assert.equal(fate(result.items, 'รายชื่อนิสิต'), 'held');
  assert.equal(fate(result.items, 'ตรี &amp; Esophageal'), 'shelve');
  assert.equal(result.term, '2026/1');
  assert.equal(result.courses, 1);
});

test('--shelve shelves what passed every gate, on the basis every MyCourseVille row has, and leaves the rest', async () => {
  const deps = runDeps();
  const result = await run({ dump: READY, shelve: true, day: '2026-11-13' }, deps);
  const shelved = result.items.find((item) => item.name === 'ตรี &amp; Esophageal');
  assert.equal(fate(result.items, 'รายชื่อนิสิต'), 'held');
  assert.equal(shelved.fate, 'shelved');

  // One object, content-addressed, with the bytes that were checked.
  assert.equal(deps.log.put.length, 1);
  const sha = sha16(PDF.deck);
  assert.equal(deps.log.put[0].key, `docs/${sha}/ตรี-esophageal-${sha.slice(0, 6)}.pdf`);
  assert.equal(deps.log.put[0].bytes, PDF.deck);
  assert.equal(deps.log.put[0].mime, 'application/pdf');

  // One row, written by the insert that guards on hash and slug.
  const [row] = deps.inserted();
  assert.equal(deps.inserted().length, 1);
  assert.equal(row.title, 'ตรี & Esophageal');
  assert.equal(row.sha256_16, sha);
  assert.equal(row.storage_key, deps.log.put[0].key);
  assert.equal(row.source_url, READY.materials[1].folders['Lecture Slides'][0].url, 'the listing URL, kept as the source');
  assert.equal(row.license, 'instructor-permission');
  assert.equal(row.status, 'public');
  assert.equal(row.academic_year, 2026);
  assert.equal(row.semester, 1);
  assert.equal(row.year, 5);
  assert.equal(row.description, 'Lecture Slides');
  assert.equal(row.permission_evidence, permissionEvidence(shelved, '2026-11-13'));
  const insert = deps.log.sql.find((call) => call.query.startsWith('insert into library_docs'));
  assert.equal(insert.readOnly, false);
  assert.match(insert.query, /where not exists \(select 1 from library_docs d where d\.sha256_16 = i\.sha256_16 or d\.slug = i\.slug\)/);

  // Shelved means read back through the catalog, not merely uploaded.
  assert.deepEqual(deps.log.readBack, [row.slug]);
  assert.equal(shelved.slug, row.slug);
});

test('a file is shelved or it is failed with what stopped it: never a row without its file', async () => {
  const outcome = async (opts) => {
    const deps = runDeps(opts);
    const result = await run({ dump: READY, shelve: true, day: '2026-11-13' }, deps);
    return { item: result.items.find((item) => item.name.includes('Esophageal')), deps };
  };
  const refused = await outcome({ putStatus: 500 });
  assert.equal(refused.item.fate, 'failed');
  assert.match(refused.item.reason, /R2 answered 500 to the upload/);
  assert.equal(refused.deps.log.sql.some((call) => call.query.startsWith('insert')), false, 'no row for an object that did not go up');

  const noRow = await outcome({ keepRow: false });
  assert.equal(noRow.item.fate, 'failed');
  assert.match(noRow.item.reason, /the catalog has no row for it/);

  const otherBytes = await outcome({ readBack: Buffer.from('%PDF something else') });
  assert.equal(otherBytes.item.fate, 'failed');
  assert.match(otherBytes.item.reason, /read back from R2 is not the file that was uploaded/);
});

test('the rights gate still refuses a score sheet that reaches the shelving step by any route', async () => {
  const item = { fate: 'shelve', file: 'tmp/0.pdf', sha256_16: sha16(PDF.deck), courseNo: '3109501', folder: '_other', name: 'คะแนนกลางภาค', url: `${S3}x-1-17561234567890.pdf`, year: 5, semester: 1, academicYear: 2026 };
  const puts = [];
  await shelve([item], { day: '2026-11-13', bucket: 'b', readFile: () => PDF.deck, put: async (...args) => { puts.push(args); return { ok: true }; }, sql: async () => [], readBack: async () => PDF.deck });
  assert.equal(item.fate, 'failed');
  assert.match(item.reason, /a score or grade announcement is never ingested/);
  assert.equal(puts.length, 0);
});

test('the insert carries its rows as data and knows every column it writes', () => {
  const rows = [{ slug: "o'brien-$tag$-abc123", title: 'ตรี "quoted" $r000000000000$', sha256_16: 'a'.repeat(16), byte_size: 12, description: null }];
  const sql = insertSql(rows);
  const [, tag, json] = sql.match(/jsonb_to_recordset\((\$r[0-9a-f]{12}\$)([\s\S]*)\1::jsonb\)/);
  assert.deepEqual(JSON.parse(json), rows);
  assert.equal(json.includes(tag), false);
  assert.match(sql, /^insert into library_docs \(slug, title, kind, /);
  assert.match(sql, /byte_size bigint/);
  assert.match(sql, /returning slug$/);
  // A column the ingest starts filling must be added here, not silently dropped.
  assert.throws(() => insertSql([{ slug: 's', lecturer: 'x' }]), /a column this insert does not know: lecturer/);
});

test('the rights line names the course area, the term and the day, and says a routine sync shelved it', () => {
  const item = { courseNo: '3109503', folder: 'Lecture Slides', academicYear: 2026, semester: 1 };
  assert.equal(
    permissionEvidence(item, '2026-11-13'),
    "Course material the instructor uploaded to the 3109503 Lecture Slides area on MyCourseVille for the enrolled 2026/1 cohort; shelved on 2026-11-13 by the project owner's routine MyCourseVille sync on the same basis as the existing 2026/1 rows (no new instructor statement was collected).",
  );
  assert.match(permissionEvidence({ ...item, folder: '_other' }, '2026-11-13'), /to the 3109503 course area on MyCourseVille/);
});

test('a run is told in the order a reader acts on it, each held file with its reason', async () => {
  const result = await run({ dump: { ...READY, errors: [{ cv_cid: '9', course_no: '3107507', error: 'request failed (Timeout)' }] }, day: '2026-11-13' }, runDeps());
  const lines = describe(result);
  assert.equal(lines[0], 'MyCourseVille 2026/1: 1 course, 2 files listed, 0 already in the library, 2 not.');
  assert.match(lines[1], /NOT LISTED: course 3107507: request failed \(Timeout\)/);
  assert.deepEqual(result.errors, [{ cv_cid: '9', course_no: '3107507', error: 'request failed (Timeout)' }], 'what the bridge could not list, then any course gone silent');
  const text = lines.join('\n');
  assert.ok(text.indexOf('Would be shelved (1)') < text.indexOf('Held for a person (1)'));
  assert.match(text, /3109501 \S+ {2}Lecture Slides \/ ตรี & Esophageal {2}\[12 pages, 1 KB\]/);
  assert.match(text, /รายชื่อนิสิต\n {6}a list of students is a person's decision/);
});

// ── what only this machine knows ─────────────────────────────────────

test('secrets and the bridge come from the environment first, then from the checkout\'s ignored files', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-mcv-sync-test-'));
  try {
    const worktree = path.join(tmp, 'worktree');
    const main = path.join(tmp, 'main');
    fs.mkdirSync(worktree);
    fs.mkdirSync(main);
    fs.writeFileSync(path.join(main, '.r2env'), 'R2_ACCOUNT_ID=acct-from-file\r\nCLOUDFLARE_API_TOKEN="cf-from-file"\n# a comment\nR2_BUCKET=vetmock-library\n');
    fs.writeFileSync(path.join(main, '.mcp.json'), JSON.stringify({
      mcpServers: {
        'supabase-vetmock': { command: 'npx', env: { SUPABASE_ACCESS_TOKEN: 'token-from-file' } },
        mcv: { command: '/opt/python/bin/python3', args: ['/opt/bridge/server.py'] },
      },
    }));
    // A linked worktree has no ignored files of its own: the main checkout's are read.
    const setup = localSetup({ R2_ACCOUNT_ID: 'acct-from-env', PATH: '/bin' }, [worktree, main]);
    assert.equal(setup.env.R2_ACCOUNT_ID, 'acct-from-env', 'the environment wins');
    assert.equal(setup.env.CLOUDFLARE_API_TOKEN, 'cf-from-file');
    assert.equal(setup.env.SUPABASE_ACCESS_TOKEN, 'token-from-file');
    assert.equal(setup.env.PATH, '/bin');
    assert.equal(setup.python, '/opt/python/bin/python3');
    assert.equal(setup.bridgeCli, path.join('/opt/bridge', 'cli.py'));

    const bare = localSetup({ SUPABASE_ACCESS_TOKEN: 'token-from-env' }, [worktree]);
    assert.deepEqual(bare, { env: { SUPABASE_ACCESS_TOKEN: 'token-from-env' }, python: 'python', bridgeCli: null });
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

// ── the text check itself ────────────────────────────────────────────
// library-pages.py reads the PDF. PyMuPDF is on the machine that runs the sync
// and not in CI, so this runs wherever it can and the gates above run everywhere.

function pythonWithPyMuPdf() {
  for (const cmd of ['python3', 'python']) {
    const probe = spawnSync(cmd, ['-I', '-c', 'import fitz, sys; print(sys.version_info[0])'], { encoding: 'utf8' });
    if (probe.status === 0 && probe.stdout.trim() === '3') return cmd;
  }
  return null;
}
const PY = pythonWithPyMuPdf();

// Running numbers from 99901 keep the fixture off any real student's ID.
const MAKE_PDFS = `
import fitz, sys
out = sys.argv[1]
def pdf(name, pages, **save):
    doc = fitz.open()
    doc.set_metadata({'title': name})
    for text in pages:
        page = doc.new_page()
        if text:
            page.insert_textbox(fitz.Rect(40, 40, 560, 800), text, fontsize=9)
    doc.save(out + '/' + name + '.pdf', **save)
DECK = ['Canine distemper: aetiology, clinical signs and control in a kennel. ' * 3, 'Vaccination schedule and maternal antibody interference in puppies.']
pdf('deck', DECK)
pdf('resaved', DECK, deflate=True, garbage=4)
pdf('roster', ['Laboratory groups for week 3, rooms and tables for each group.', ' '.join('%d 653 %d 31' % (i, 99900 + i) for i in range(1, 9))])
pdf('scan', ['', ''])
open(out + '/notpdf.pdf', 'w').write('<html><body>Sign in with your university account to continue to this file.</body></html>')
`;

test('library-pages.py check reads a PDF on disk and says ok, held, no text or unreadable', { skip: PY ? false : 'no Python 3 with PyMuPDF on this machine' }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-mcv-check-'));
  try {
    const made = spawnSync(PY, ['-I', '-c', MAKE_PDFS, tmp], { encoding: 'utf8' });
    assert.equal(made.status, 0, made.stderr);
    const files = ['deck', 'roster', 'scan', 'notpdf', 'resaved'].map((name) => path.join(tmp, `${name}.pdf`));
    const run = spawnSync(PY, ['-I', 'scripts/library-pages.py', 'check', ...files], { cwd: ROOT, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const [deck, roster, scan, notpdf, resaved] = run.stdout.trim().split(/\r?\n/).map((line) => JSON.parse(line));
    assert.deepEqual([deck.file, deck.status, deck.page_count, deck.pages_read], [files[0], 'ok', 2, 2]);
    // The same deck saved again: other bytes, the same fingerprint of its text.
    assert.notEqual(sha16(fs.readFileSync(files[0])), sha16(fs.readFileSync(files[4])));
    assert.match(deck.text_md5, /^[0-9a-f]{32}$/);
    assert.equal(resaved.text_md5, deck.text_md5);
    assert.equal(resaved.text_chars, deck.text_chars);
    assert.ok(deck.text_chars > 200);
    assert.equal(roster.status, 'pii_held');
    assert.deepEqual(roster.notes, { id_matches: 8, roster_pages: [2] }, 'counts and page numbers only: no text from around an ID');
    assert.equal(roster.text_md5, null, 'and no fingerprint of a text that is not kept');
    assert.equal(scan.status, 'no_text');
    assert.equal(notpdf.status, 'unreadable', 'a saved sign-in page is not a document, however much text it has');
    // The command's own reading of those four verdicts.
    assert.deepEqual([deck, roster, scan, notpdf].map((v) => textDoubt(v) === null), [true, false, false, false]);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
