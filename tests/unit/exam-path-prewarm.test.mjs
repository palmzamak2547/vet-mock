import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Every chunk on the exam path must already be in memory before a deploy can
// take its URL away.
//
// Vercel swaps the whole build atomically. An open tab keeps the old
// index.html, so the moment a lazy chunk is requested by its old hash the file
// is gone and the import rejects. The service worker cannot save this one: it
// caches hashed assets cache-first, which protects any chunk the device has
// already fetched, and a chunk the student has never opened was never fetched.
//
// So the exam path is warmed deliberately when the exam starts. That covered
// ResultsView and ReviewView after a student was stranded on a blank screen at
// submit on 2026-05-08 — but ReviewView lazy-loads ImageAnnotator and QComments
// itself, and those were not warmed. The failure just moved one screen later:
// submit works, the answers open, and then a question carrying an image never
// renders.
//
// This test reads the dynamic imports out of the exam path and fails if any of
// them is missing from the warm-up. It exists so the next person who adds a
// lazy import to the answer screen finds out here rather than from a student
// mid-exam.

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const SRC = path.join(ROOT, 'src');

const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

// Specifiers are written relative to the file that contains them; compare them
// as paths under src/ so './lib/confetti.js' in App.jsx and '../lib/confetti.js'
// in ResultsView.jsx are recognised as the same module.
function importsIn(rel) {
  const text = read(rel);
  const dir = path.dirname(rel);
  const out = new Set();
  for (const m of text.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue; // bare specifiers come from node_modules
    out.add(path.posix.normalize(path.posix.join(dir, spec)));
  }
  return out;
}

function warmedOnExamStart() {
  const app = read('App.jsx');
  const start = app.indexOf("if (view === 'exam') {");
  assert.notEqual(start, -1, 'the exam-start warm-up block has moved or been removed');
  const end = app.indexOf('}, [view]);', start);
  assert.notEqual(end, -1, 'could not find the end of the exam-start warm-up effect');
  const block = app.slice(start, end);
  const out = new Set();
  for (const m of block.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    out.add(path.posix.normalize(path.posix.join('.', m[1])));
  }
  return out;
}

test('every lazy chunk on the exam path is warmed before the exam starts', () => {
  const warm = warmedOnExamStart();

  // The screens a student passes through after tapping submit. ExamView itself
  // is already loaded — they are looking at it.
  const reachable = new Set([
    ...importsIn('views/ResultsView.jsx'),
    ...importsIn('views/ReviewView.jsx'),
  ]);

  assert.ok(reachable.size > 0, 'found no dynamic imports at all — the extraction is broken');

  const missing = [...reachable].filter((spec) => !warm.has(spec));
  assert.deepEqual(
    missing,
    [],
    'These are loaded on the answer path but not warmed when the exam starts, so a '
      + 'deploy mid-exam makes them 404:\n  '
      + missing.join('\n  ')
      + "\nAdd them to the `if (view === 'exam')` effect in App.jsx.",
  );
});

test('the views themselves are warmed, not just their children', () => {
  const warm = warmedOnExamStart();
  for (const view of ['views/ResultsView.jsx', 'views/ReviewView.jsx']) {
    assert.ok(warm.has(view), `${view} is not warmed when the exam starts`);
  }
});
