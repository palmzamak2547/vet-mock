// ============================================================
// A resumed exam comes back the way it was graded
// ============================================================
// The autosave stored only { questions, answers, currentIdx }. `mode` is
// App state that resets to 'quick' on reload, and ExamView computes
// `revealAnswer = mode !== 'exam' && instantFeedback` — so reopening a
// parked MOCK showed the answer key, with already-answered options locked.
// The timer settings were lost the same way, turning a timed mock untimed.
//
// No \b anywhere in this file, deliberately. It is ASCII-only (so it never
// fires next to Thai), and a mistyped escape silently becomes a BACKSPACE
// character — a pattern that matches nothing and a test that passes for the
// wrong reason. Plain substring checks cannot fail that way.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
const EXAM = readFileSync(new URL('../../src/views/ExamView.jsx', import.meta.url), 'utf8');

// The record is assembled into inflightRef and written by writeInflight
// (on a debounce, a 3 s ceiling, and on pagehide/visibilitychange), so the
// fields live where the snapshot is BUILT, not where setItem is called.
const autosave = APP.slice(
  APP.indexOf('inflightRef.current = {'),
  APP.indexOf('inflightWrittenAtRef.current >= 3000'),
);
const resume = APP.slice(
  APP.indexOf('const resumePendingExam'),
  APP.indexOf('const dismissPendingExam'),
);

test('the parked record carries the settings that change grading', () => {
  assert.ok(autosave.length > 0, 'could not locate the autosave record');
  for (const field of ['mode', 'practiceMode', 'useTimer', 'timePerQ']) {
    assert.ok(
      autosave.includes(field + ','),
      `autosave dropped ${field} — resume would invent one`,
    );
  }
});

test('resume puts those settings back', () => {
  assert.ok(resume.length > 0, 'could not locate resumePendingExam');
  assert.ok(resume.includes('saved.mode'), 'resume does not restore mode');
  assert.ok(resume.includes('saved.useTimer'), 'resume does not restore the timer');
  assert.ok(resume.includes('saved.timePerQ'), 'resume does not restore the per-question time');
});

test('restoring is conditional, so an older record is not force-graded as an exam', () => {
  assert.ok(resume.includes('if (saved.mode)'), 'an older record with no mode would be coerced');
  assert.ok(
    !resume.includes("saved.mode || 'exam'"),
    'defaulting a missing mode to exam mislabels resumed practice sets',
  );
});

test('mode is still what decides whether the key is shown', () => {
  // If this stops being true, the restore above is guarding the wrong thing.
  assert.ok(
    EXAM.includes("mode !== 'exam'"),
    'ExamView no longer derives reveal from mode — re-check what resume must restore',
  );
});
