// Leaving a set asks one question, whichever way the student leaves.
//
// The X button offered เก็บไว้แล้วออก / ทำต่อ with the six-hour note; the
// browser's Back offered ออกจากชุด / ยกเลิก without it, for the same action
// (both park the set). Both now take their words from lib/exit-set.js, and
// neither file may spell an exit dialog of its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { exitSetDialog } from '../../src/lib/exit-set.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

test('the exit dialog keeps the set and says for how long', () => {
  const qs = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const d = exitSetDialog({ questions: qs, answers: { 1: 0, 2: [''] }, timed: true });
  assert.equal(d.title, 'ออกจากชุดนี้?');
  assert.equal(d.confirmLabel, 'เก็บไว้แล้วออก');
  assert.equal(d.cancelLabel, 'ทำต่อ');
  assert.match(d.body, / 1 จาก 3 ข้อ /, 'a blank typed into and deleted is not answered');
  assert.match(d.body, /6 ชั่วโมง/);
  assert.match(d.body, /เวลาที่เหลือจะหยุดนับ/);
  assert.doesNotMatch(exitSetDialog({ questions: qs, answers: {}, timed: false }).body, /จาก|เวลาที่เหลือ/);
});

test('the X button and the Back guard both ask through exitSetDialog, and spell no exit dialog of their own', () => {
  const app = read('src/App.jsx');
  const exam = read('src/views/ExamView.jsx');
  assert.match(exam, /\{\.\.\.exitSetDialog\(\{ questions, answers, timed: useTimer \}\)\}/);
  assert.match(app, /confirmDialog\(\{\s*\.\.\.exitSetDialog\(/);
  for (const [name, src] of [['App.jsx', app], ['ExamView.jsx', exam]]) {
    assert.doesNotMatch(src, /['"`]ออกจากชุด['"`]|confirmLabel[:=]\s*["'{`]*เก็บไว้แล้วออก|title[:=]\s*["'{`]*ออกจากชุดนี้\?/, `${name} spells an exit dialog of its own`);
  }
});
