// ============================================================
// topic-lecturer-button.test.mjs — a lecturer button opens a profile
// ============================================================
// B30: the topic card rendered 'อาจารย์ …' for any lecturer string that was
// not TBD. The tap ran getInstructorByLecturerString and did nothing when it
// found no one: 32 buttons opened nothing, and some read "อาจารย์ COM III
// Final 2019 past exam" or "อาจารย์ Surgery staff". The card now shows a
// profile button only when the directory resolves the string, and plain text
// (with no "อาจารย์") otherwise.
//
// The view's real lecturerChip, cut and run under vm over every curriculum
// topic with the real label and directory helpers.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { topicLecturerLabel } from '../../src/lib/lecturer-name.js';
import { getInstructorByLecturerString } from '../../src/data/instructors.js';

const SRC = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
function cut(start, end) {
  const a = SRC.indexOf(start);
  assert.notEqual(a, -1, `TopicSelectView must still contain ${JSON.stringify(start)}`);
  const b = SRC.indexOf(end, a);
  return SRC.slice(a, b + end.length);
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${cut('function lecturerChip(', '\n}\n')}\nthis.lecturerChip = lecturerChip;`, ctx);

function chips() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const t of s.topics || []) {
      const label = topicLecturerLabel(s.id, t.lecturer);
      const profile = label ? getInstructorByLecturerString(t.lecturer) : null;
      const chip = ctx.lecturerChip(label, profile);
      if (chip) out.push({ subject: s.id, topic: t.id, lecturer: t.lecturer, chip, profile });
    }
  }
  return out;
}

test('every profile button opens a profile', () => {
  const all = chips();
  const buttons = all.filter((c) => c.chip.kind === 'profile');
  assert.ok(buttons.length > 100, `expected the resolvable lecturers, saw ${buttons.length}`);
  for (const b of buttons) assert.ok(b.profile, `${b.subject}/${b.topic}: ${b.lecturer}`);
});

test('an unresolved lecturer string is plain text and never called อาจารย์', () => {
  const texts = chips().filter((c) => c.chip.kind === 'text');
  assert.ok(texts.length > 0, 'the corpus has lecturer strings with no directory profile');
  for (const t of texts) {
    assert.equal(t.profile, null);
    assert.doesNotMatch(t.chip.text, /^อาจารย์ /, `${t.subject}/${t.topic}: ${t.chip.text}`);
  }
  const pastExam = texts.find((t) => /past exam/i.test(t.lecturer));
  if (pastExam) assert.equal(pastExam.chip.text, pastExam.lecturer.trim());
});

test('the card renders the button only for a resolved profile', () => {
  assert.match(SRC, /\{lecturer\?\.kind === 'profile' && \(\s*<button/);
  assert.match(SRC, /\{lecturer\?\.kind === 'text' && \(\s*<span/);
  assert.doesNotMatch(SRC, /\{lecturerLabel && \(\s*<button/);
});
