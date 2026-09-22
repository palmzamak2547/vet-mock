// ============================================================
// student-error-copy.test.mjs — no raw exception text on screen
// ============================================================
// lib/errors.js has had thaiError for a long time: it turns "Failed to
// fetch", "JWT expired" and timeouts into Thai, lets a message that is
// already Thai through, and otherwise shows a fallback the caller chooses.
// Five screens went around it and put the exception's own text in front of
// the student:
//
//   LeaderboardView   setError(err?.message || ...)   PostgREST English
//   RaceView          setError(failure.message || ...) "Failed to fetch"
//   ClozeEditor       `บันทึกไม่ได้: ${e?.message || e}`
//   ImageAnnotator    'บันทึก PNG ผิดพลาด: ' + e.message  "Tainted canvases..."
//   DashboardView     backup import printed the JSON parser's message
//                     ("Unexpected token < in JSON at position 0")
//
// None of these can run in node (JSX, canvas, FileReader), so the contract
// is pinned at the source level, the way group-delete-error.test.mjs does.
// The last test is a ratchet over every view and component: no setter or
// alert may print `x.message || ...` again. Files other packages own and
// have not fixed yet are listed by name; the list may only shrink.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const IMPORT = /import \{[^}]*\bthaiError\b[^}]*\} from '\.\.\/lib\/errors\.js';/;

function assertRouted(rel, pattern, label) {
  const src = read(rel);
  assert.match(src, IMPORT, `${rel}: thaiError must come from lib/errors.js`);
  const m = src.match(pattern);
  assert.ok(m, `${rel}: ${label} must go through thaiError(e, '<Thai fallback>')`);
  assert.match(m[1], /[ก-๙]/, `${rel}: the fallback must be Thai`);
  assert.doesNotMatch(m[1], /·/, `${rel}: no middle dot in UI copy`);
}

test('the leaderboard load error is Thai', () => {
  assertRouted('src/views/LeaderboardView.jsx', /setError\(thaiError\(err, '([^']+)'\)\)/, 'the load failure');
});

test('a race action error is Thai', () => {
  assertRouted('src/views/RaceView.jsx', /catch \(failure\) \{ setError\(thaiError\(failure, '([^']+)'\)\); \}/, 'act()');
});

test('a cloze save error is Thai', () => {
  const rel = 'src/components/ClozeEditor.jsx';
  assertRouted(rel, /catch \(e\) \{\s*setError\(thaiError\(e, '([^']+)'\)\);/, 'the save failure');
  assert.doesNotMatch(read(rel), /\$\{e\?\.message/, 'the raw exception is still interpolated');
});

test('an annotated-image export error is Thai and says what to do', () => {
  const rel = 'src/components/ImageAnnotator.jsx';
  assertRouted(rel, /catch \(e\) \{(?:\s*\/\/[^\n]*)*\s*alertDialog\(thaiError\(e, '([^']+)'\)\);/, 'the PNG export failure');
  assert.doesNotMatch(read(rel), /e\.message \|\| 'unknown'/);
});

test('a broken backup file is named as such, with no parser text', () => {
  const rel = 'src/views/DashboardView.jsx';
  const src = read(rel);
  const at = src.indexOf('อ่านไฟล์ backup ไม่สำเร็จ');
  assert.notEqual(at, -1, 'the backup-read failure dialog must still exist');
  const block = src.slice(src.lastIndexOf('} catch (error) {', at), src.indexOf('reader.onerror', at));
  assert.doesNotMatch(block, /error\??\.message/, 'the parser message must not reach the dialog');
  assert.match(block, /error instanceof SyntaxError \? 'ไฟล์นี้ไม่ใช่ไฟล์สำรองของ VetMock'/,
    'a file that is not JSON is called what it is');
  assert.match(block, /thaiError\(error, '[^']*[ก-๙][^']*'\)/, 'any other failure goes through thaiError');
  assert.match(src, IMPORT, `${rel}: thaiError must come from lib/errors.js`);
});

// Owned by other packages in this release; each will route its own site
// through thaiError. Each file keeps the one offending line it has today and
// no more: fixing it never breaks this test, adding a second one does.
const NOT_YET = new Map([
  ['src/views/FeedbackView.jsx', 1],
  ['src/views/QuestionManagerView.jsx', 1],
  ['src/views/ReviewQueueView.jsx', 1],
  ['src/components/lab/DicomViewport.jsx', 1],
  ['src/components/lab/TagInspector.jsx', 1],
]);

test('no view or component prints an exception message into state or an alert', () => {
  // `setX(err?.message || ...)`, `alertDialog('...' + (e.message || ...))`,
  // `${e?.message || e}` inside a setter. A regex test on the message
  // (ContributeView classifies auth errors that way) is not display. The scan
  // reads one line at a time, so a setter spread over several lines is not
  // seen; this guards the one-line form every listed site used.
  const PRINTS = /\b(?:set[A-Z]\w*|alertDialog|alert)\s*\(.*?\b\w+\??\.message\s*\|\|/;
  const CLASSIFIES = /\.test\(\s*\w+\??\.message\s*\|\|/;
  const offenders = [];
  for (const dir of ['src/views', 'src/components']) {
    for (const name of readdirSync(join(ROOT, dir), { recursive: true })) {
      const rel = `${dir}/${String(name).replace(/\\/g, '/')}`;
      if (!/\.(jsx?|tsx?)$/.test(rel)) continue;
      const found = [];
      read(rel).split(/\r?\n/).forEach((line, i) => {
        if (PRINTS.test(line) && !CLASSIFIES.test(line)) found.push(`${rel}:${i + 1}: ${line.trim()}`);
      });
      if (found.length > (NOT_YET.get(rel) ?? 0)) offenders.push(...found);
    }
  }
  assert.deepEqual(offenders, [], `raw exception text reaches a student:\n${offenders.join('\n')}`);
});
