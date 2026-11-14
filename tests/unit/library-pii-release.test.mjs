// ============================================================
// library-pii-release.test.mjs — a reviewed release of a hold is recorded, and only it
// ============================================================
// On 14 Nov 2026 four lecture decks were held because OCR of handwriting printed
// 13-digit runs; a person looked at the 11 flagged pages and released them with a
// one-off script, and the only record was a local file, so the next `check` would
// have held them again. `release` in scripts/library-pages.py now records the
// review in scripts/library-pii-reviews.json, keyed by the file's sha256_16, with
// the pages and how many findings of each kind sat on each. These pin that a
// released finding stays released, that a new one still holds, that the record
// is complete and holds no digits; and, for the audit, that a public row titled as
// a list of people whose text was never read is listed for a person to look at.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unseenRosterRows } from '../../scripts/audit-library-pii.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PAGES_PY = path.join(ROOT, 'scripts/library-pages.py');
const RECORD = path.join(ROOT, 'scripts/library-pii-reviews.json');

function python3(modules = '') {
  for (const cmd of ['python3', 'python']) {
    const r = spawnSync(cmd, ['-c', `import sys${modules}; print(sys.version_info[0])`], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === '3') return cmd;
  }
  return null;
}
const PY = python3();
const PY_FITZ = python3(', fitz');
const skip = (cmd) => (!cmd && !process.env.CI ? 'no Python 3 on this machine' : false);

// Digits are synthetic: a 13-digit run in the national-ID shape, belonging to nobody.
const RUN = '1 2345 67890 12 3';
const run = (code, env = {}) => {
  const r = spawnSync(PY, ['-I', '-c', code, PAGES_PY], { encoding: 'utf8', env: { ...process.env, ...env } });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
};
const LOAD = `
import sys, json, importlib.util
spec = importlib.util.spec_from_file_location('lp', sys.argv[1]); lp = importlib.util.module_from_spec(spec); spec.loader.exec_module(lp)
`;

test('a released finding stays released, and a new finding still holds', { skip: skip(PY) }, () => {
  const out = run(LOAD + `
deck = ['Opening slide with enough words to be kept', 'Slide with handwriting over it ${RUN} and more words after']
rel = {2: {'national': 1}}
st = lambda pages, r=None: lp.classify(pages, r)[0]
status, kept, notes = lp.classify(deck, rel)
print(json.dumps({
  'unreleased': st(deck),
  'released': status,
  'blanked': '67890' not in kept[2] and 'handwriting' in kept[2],
  'noted': notes.get('released_findings'),
  'again': st(deck, rel),
  'other_page': st(deck + ['Another slide 2 3456 78901 23 4 with words after'], rel),
  'more_on_page': st([deck[0], deck[1] + ' 3 4567 89012 34 5'], rel),
  'wrong_page': st(deck, {1: {'national': 1}}),
  'wrong_kind': st(deck, {2: {'student': 1}}),
}))`);
  assert.deepEqual(out, {
    unreleased: 'pii_held', released: 'ok', blanked: true, noted: { '2': { national: 1 } },
    again: 'ok', other_page: 'pii_held', more_on_page: 'pii_held', wrong_page: 'pii_held', wrong_kind: 'pii_held',
  });
});

test('release records a review that the next check honours, for this file only', { skip: PY_FITZ ? false : 'no Python 3 with PyMuPDF on this machine (the build job installs none, as in mcv-sync.test.mjs)' }, () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pii-release-'));
  try {
    const env = { LIBRARY_PII_REVIEWS: path.join(tmp, 'reviews.json') };
    const make = (name, pages) => {
      const f = path.join(tmp, name);
      const r = spawnSync(PY_FITZ, ['-I', '-c', `
import fitz, sys, json
d = fitz.open()
for t in json.loads(sys.argv[2]):
    d.new_page().insert_text((72, 72), t)
d.save(sys.argv[1])`, f, JSON.stringify(pages)], { encoding: 'utf8' });
      assert.equal(r.status, 0, r.stderr);
      return f;
    };
    const py = (...args) => spawnSync(PY_FITZ, ['-I', PAGES_PY, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
    const check = (f) => JSON.parse(py('check', f).stdout);
    const deck = make('deck.pdf', ['Opening slide with enough words to be kept here', `Slide with handwriting over it ${RUN} and more words after`]);
    assert.equal(check(deck).status, 'pii_held');

    // Refused: nothing on that page, a thin reason, digits in the reason.
    assert.notEqual(py('release', deck, '--pages=1', '--reason=A slide with ink over it, nothing personal').status, 0);
    assert.notEqual(py('release', deck, '--pages=2', '--reason=too short').status, 0);
    assert.notEqual(py('release', deck, '--pages=2', '--reason=Page with the number 1234567890123 on it, looked at').status, 0);
    assert.equal(fs.existsSync(env.LIBRARY_PII_REVIEWS), false, 'a refused release records nothing');

    const ok = py('release', deck, '--pages=2', '--slug=test-deck', '--date=2026-11-14', '--reason=A lecture slide with handwriting over it, no name or ID, checked on the rendered page');
    assert.equal(ok.status, 0, ok.stderr);
    const record = JSON.parse(fs.readFileSync(env.LIBRARY_PII_REVIEWS, 'utf8'));
    assert.equal(record.releases.length, 1);
    assert.deepEqual(record.releases[0].pages, { 2: { national: 1 } });
    assert.doesNotMatch(JSON.stringify(record), /\d{9}/, 'the record holds no copy of what the check found');
    const after = check(deck);
    assert.equal(after.status, 'ok');
    assert.equal(after.sha256_16, record.releases[0].sha256_16);

    // The same words in another file are another file: it needs its own review.
    const copy = make('copy.pdf', ['Opening slide with enough words to be kept here', `Slide with handwriting over it ${RUN} and more words after`, 'A third page']);
    assert.equal(check(copy).status, 'pii_held');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('the tracked record is complete: today\'s four releases, shaped, with no digits copied', () => {
  const data = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  const bySha = Object.fromEntries(data.releases.map((r) => [r.sha256_16, r]));
  const pages = (sha) => Object.keys(bySha[sha].pages).map(Number).sort((a, b) => a - b);
  assert.deepEqual(pages('2c249b3e8decb76f'), [98]);
  assert.deepEqual(pages('431a1410a9a34bcc'), [66]);
  assert.deepEqual(pages('d61d29d1dd03f3a8'), [38, 49, 101, 151, 193, 229, 258, 268]);
  assert.deepEqual(pages('db1dd1baaff85b84'), [71]);
  for (const r of data.releases) {
    assert.match(r.sha256_16, /^[0-9a-f]{16}$/);
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(r.reason.length >= 15, 'every release says why');
    for (const kinds of Object.values(r.pages)) {
      for (const [kind, n] of Object.entries(kinds)) {
        assert.ok(['student', 'national', 'roster'].includes(kind));
        assert.ok(Number.isInteger(n) && n > 0);
      }
    }
  }
  assert.doesNotMatch(fs.readFileSync(RECORD, 'utf8'), /\d{9}/, 'no run of digits is copied into the record');
});

test('the audit lists a public list-of-people title whose text was never read, and not teaching material', () => {
  const row = (id, title, text_status = null, status = 'public') => ({ id, title, text_status, status });
  const rows = [
    row('a', 'รายชื่อนิสิตที่เข้าเรียนปฏิบัติการ'), // never read (spreadsheet or scan)
    row('b', 'รายชื่อเข้าเรียนปฏิบัติการสัตวแพทย์', 'no_text'), // a scan with no text layer
    row('c', 'ใบเช็คชื่อ Lab 3', 'garbled'),
    row('d', 'ใบรายชื่อ กลุ่ม 2', 'unreadable'),
    row('e', 'Attendance sheet week 4'),
    row('f', 'Sign-in sheet'),
    row('g', 'รายชื่อที่สำคัญในปฏิบัติการ integument'), // a list of structures
    row('h', 'รายชื่อสิ่งที่ต้องรู้ Skeletal system'),
    row('i', 'รายชื่อนิสิต ปี 5', 'ok'), // its text was read: the text check decides
    row('j', 'รายชื่อนิสิต ปี 5', 'pii_held'), // already held
    row('k', 'รายชื่อนิสิต ปี 5', null, 'archived'), // not public
    row('l', 'Digital slide scan-list', 'garbled'),
  ];
  assert.deepEqual(unseenRosterRows(rows).map((r) => r.id), ['a', 'b', 'c', 'd', 'e', 'f']);
  assert.match(unseenRosterRows(rows)[0].reason, /รายชื่อ/);
});
