// ============================================================
// Topic notes: a warning sign only where the note warns (UI-14)
// ============================================================
// Every topic card with a lecturerNote rendered "⚠️ " in front of it, so a
// neutral provenance line ("ตารางสอน Vet 86 3106510 (2569)", on 8 of the 23
// equine topics) read as "something is wrong with this topic", and the three
// notes whose data already began with ⚠️ rendered two of them.
//
// The icon cannot simply go: some notes are what a student uses to skip a
// topic this week — "ไม่ออกสอบ", "สอนแต่ไม่ออกข้อสอบ", a lecture the
// timetable puts "หลังสอบกลางภาค". Those carry lecturerNoteKind: 'caveat' in
// curriculum.js and keep exactly one ⚠️; the card draws it, the data never
// does. This file is the guard that a caveat cannot lose its mark.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SUBJECTS, SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

// Every topic that carries a note, keyed subject:topic.
const NOTES = new Map();
for (const s of [...SUBJECTS, ...Object.values(SUBJECTS_BY_YEAR).flat()]) {
  for (const t of s.topics || []) {
    if (t.lecturerNote || t.lecturerNoteKind) NOTES.set(`${s.id}:${t.id}`, t);
  }
}

// A note that says the topic is not on the paper, or not on this one.
const OFF_THE_PAPER = /ไม่ออก(?:ข้อ)?สอบ|หลังสอบกลางภาค/;

// "หลังสอบ" that does NOT describe this cohort's topic. equine-respi is the
// last lecture BEFORE Vet 86's midterm; the "(Vet 85 เรียนหลังสอบ)" is about
// the seniors' timetable. A warning sign there would tell a student the one
// thing the note says is false. Any new bare "หลังสอบ" must be decided here.
const NOT_A_CAVEAT = new Map([
  ['equine-medicine:equine-respi', 'Vet 86 sits it before the midterm; the หลังสอบ is Vet 85'],
]);

test('the walk reaches every lecturerNote in curriculum.js', () => {
  // A note on a topic the exports do not reach would escape every check below.
  const inSource = (read('src/data/curriculum.js').match(/lecturerNote: '/g) || []).length;
  assert.equal(NOTES.size, inSource);
});

test('UI-14: every note that says a topic is off the paper carries the caveat flag', () => {
  const missing = [...NOTES].filter(([, t]) => OFF_THE_PAPER.test(t.lecturerNote || '') && t.lecturerNoteKind !== 'caveat')
    .map(([k, t]) => `${k}: ${t.lecturerNote}`);
  assert.deepEqual(missing, []);
});

test('UI-14: every note that mentions ไม่ออกสอบ or หลังสอบ is flagged, or is a recorded exception', () => {
  const undecided = [...NOTES]
    .filter(([k, t]) => /ไม่ออก(?:ข้อ)?สอบ|หลังสอบ/.test(t.lecturerNote || '') && t.lecturerNoteKind !== 'caveat' && !NOT_A_CAVEAT.has(k))
    .map(([k, t]) => `${k}: ${t.lecturerNote}`);
  assert.deepEqual(undecided, []);
  for (const k of NOT_A_CAVEAT.keys()) {
    assert.ok(NOTES.has(k), `${k} is listed as an exception but has no note any more`);
    assert.notEqual(NOTES.get(k).lecturerNoteKind, 'caveat', `${k} is flagged after all; drop it from NOT_A_CAVEAT`);
  }
});

test('UI-14: the seven off-the-paper notes named in the audit keep their mark', () => {
  for (const k of [
    'epidemiology:epidem-eid-pandemic', 'epidemiology:epidem-economics',
    'aquatic-clinic:aqua-fish-diseases', 'aquatic-clinic:aqua-aquarium-vet',
    'food-industry:fiqc-aquatic', 'zoonoses:zoo-mycoses', 'swine-clinic:swine-trichinosis',
  ]) {
    assert.ok(NOTES.has(k), `${k} lost its note`);
    assert.equal(NOTES.get(k).lecturerNoteKind, 'caveat', `${k} is not flagged`);
  }
});

test('UI-14: no note renders two warning signs, and the flag is well-formed', () => {
  for (const [k, t] of NOTES) {
    // The card draws the leading icon from the flag; the data never does.
    assert.ok(!/^\s*⚠/.test(t.lecturerNote || ''), `${k} starts with its own ⚠️`);
    if (t.lecturerNoteKind !== undefined) {
      assert.equal(t.lecturerNoteKind, 'caveat', `${k}: unknown lecturerNoteKind ${t.lecturerNoteKind}`);
      assert.ok(t.lecturerNote, `${k}: a caveat flag with no note`);
    }
  }
});

test('UI-14: the topic card draws the ⚠️ for a caveat only, and a neutral note plainly', () => {
  const view = read('src/views/TopicSelectView.jsx');
  assert.doesNotMatch(view, /<span className="vmx-topic-note">⚠️ \{t\.lecturerNote\}<\/span>/,
    'the unconditional icon is back');
  assert.match(view, /const caveat = t\.lecturerNoteKind === 'caveat'/);
  // Exactly one icon, drawn for a caveat only, and hidden from the screen
  // reader, which hears the caveat itself instead.
  assert.equal((view.match(/⚠️/g) || []).length, 1, 'one warning sign in the topic card markup');
  assert.match(view, /\{caveat && <span aria-hidden="true">⚠️ <\/span>\}/);
  // The note sits inside a button whose aria-label replaces its contents, so
  // a caveat has to be in that label or a screen-reader user never hears
  // "ไม่ออกสอบ".
  assert.match(view, /const primaryLabel = `\$\{primaryLabelBase\}\$\{isRead \? ', อ่านแล้ว' : ''\}\$\{caveat && !isEmpty \? `, \$\{t\.lecturerNote\}` : ''\}`;/);
});

test('UI-14: a neutral note reads upright at 12px; a caveat reads in full ink', () => {
  const css = read('src/styles.css');
  const rule = css.match(/\n\.vmx-topic-note \{([^}]*)\}/)?.[1];
  assert.ok(rule, '.vmx-topic-note moved');
  assert.match(rule, /font-size: 12px;/);
  assert.doesNotMatch(rule, /font-style: italic/, 'slanted Thai at this size is harder to read');
  assert.match(css, /\.vmx-topic-note\.is-caveat \{[^}]*color: var\(--clr-ink\);/);
});
