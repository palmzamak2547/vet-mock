// ============================================================
// exam-scope.test.mjs
// ============================================================
// The separation Palm asked for: "กลางภาคก็ควรอยู่กลางภาค ปลายภาคก็ต้องอยู่
// ปลายภาค". Each case here is a way the two piles used to mix.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  scopeForPhase, scopeForTopic, scopeOfQuestion, questionInScope, countByScope, EXAM_SCOPES,
} from '../../src/lib/exam-scope.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

test('a phase names a paper, and a year alone names none', () => {
  assert.equal(scopeForPhase('1-mid'), 'midterm');
  assert.equal(scopeForPhase('2-mid'), 'midterm');
  assert.equal(scopeForPhase('1-final'), 'final');
  assert.equal(scopeForPhase('2-final'), 'final');
  assert.equal(scopeForPhase(null), null);
  assert.equal(scopeForPhase('1'), null);
});

test('a question inherits its topic, and the topic wins over the question', () => {
  // Find a real topic that declares a scope, so the test moves with the data.
  let found = null;
  for (const s of SUBJECTS) {
    for (const t of s.topics || []) {
      if (EXAM_SCOPES.includes(t.examScope)) { found = { subject: s.id, topic: t.id, scope: t.examScope }; break; }
    }
    if (found) break;
  }
  assert.ok(found, 'at least one curriculum topic must declare examScope');
  assert.equal(scopeForTopic(found.subject, found.topic), found.scope);
  assert.equal(scopeOfQuestion({ subject: found.subject, topic: found.topic }), found.scope);

  // A past paper that disagrees with where the topic sits THIS year does not
  // move the question: the paper it was copied from belonged to another cohort,
  // and Palm's instruction for that case is to go by the topic ("อาจมีบางปีที่
  // ไม่ตรงกับรุ่นปัจจุบันก็ให้เทียบหัวข้อเอา"). Letting the question's own tag
  // win put four conservation questions into a Vet 86 midterm set for a lecture
  // that had not happened yet; making the two agree as an AND then hid eleven
  // questions from both papers at once.
  const other = found.scope === 'midterm' ? 'final' : 'midterm';
  assert.equal(
    scopeOfQuestion({ subject: found.subject, topic: found.topic, examScope: other }),
    found.scope,
    'this year’s topic placement decides which paper a question is on',
  );
});

test('both sits on either paper, continuous on neither', () => {
  assert.equal(questionInScope({ examScope: 'both' }, 'midterm'), true);
  assert.equal(questionInScope({ examScope: 'both' }, 'final'), true);
  assert.equal(questionInScope({ examScope: 'continuous' }, 'midterm'), false);
  assert.equal(questionInScope({ examScope: 'continuous' }, 'final'), false);
  assert.equal(questionInScope({ examScope: 'midterm' }, 'final'), false);
  assert.equal(questionInScope({ examScope: 'final' }, 'midterm'), false);
});

test('no wanted scope keeps everything, and an unknown scope is never filtered out', () => {
  assert.equal(questionInScope({ examScope: 'midterm' }, null), true);
  // The day someone adds a topic and forgets the field, a student must not
  // silently lose those questions. The lint catches the omission; the engine
  // does not punish the student for it.
  assert.equal(questionInScope({ subject: 'nope', topic: 'nope' }, 'midterm'), true);
  assert.equal(questionInScope({}, 'final'), true);
});

test('countByScope separates the piles and names the unknown one', () => {
  const t = countByScope([
    { examScope: 'midterm' }, { examScope: 'midterm' }, { examScope: 'final' },
    { examScope: 'both' }, { examScope: 'continuous' }, { subject: 'x', topic: 'y' },
  ]);
  assert.deepEqual(t, { midterm: 2, final: 1, both: 1, continuous: 1, unknown: 1 });
});

test('a question cannot sit on a paper its own lecture is not on', () => {
  // Find a real topic that sits on exactly one paper, and hand it a question
  // tagged with the other one. That is not hypothetical: the aquatic
  // conservation questions are tagged midterm because Vet 85 sat that lecture
  // before their midterm, while Vet 86 is taught it after theirs. Reading the
  // question's tag alone put them into a midterm set for a lecture that has
  // not happened, while the topic list — which does follow the timetable —
  // was not showing that topic at all.
  let found = null;
  for (const s of SUBJECTS) {
    for (const t of s.topics || []) {
      if (t.examScope === 'midterm' || t.examScope === 'final') {
        found = { subject: s.id, topic: t.id, scope: t.examScope };
        break;
      }
    }
    if (found) break;
  }
  assert.ok(found, 'at least one curriculum topic must sit on exactly one paper');
  const other = found.scope === 'midterm' ? 'final' : 'midterm';

  assert.equal(
    questionInScope({ subject: found.subject, topic: found.topic, examScope: other }, other),
    false,
    'the senior cohort’s paper does not move a lecture onto this year’s',
  );
  assert.equal(
    questionInScope({ subject: found.subject, topic: found.topic, examScope: found.scope }, found.scope),
    true,
    'a question that agrees with the timetable is still served',
  );
  // A topic with no scope of its own keeps everything, as always.
  assert.equal(questionInScope({ subject: 'nope', topic: 'nope', examScope: 'midterm' }, 'midterm'), true);
});
