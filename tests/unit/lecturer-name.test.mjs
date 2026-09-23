// ============================================================
// One lecturer, one name on the topic screen (UI-20)
// ============================================================
// The topic screen lists "อ.น.สพ.ดร.ธีรพล ชินกังสดาร" in the lecturer
// section and, on the topic cards below it, "อาจารย์ Teerapol
// Chinkangsadarn (2026)" — two naming systems for one person, plus a year
// that is the same on every card and means nothing to a student. Some cards
// said "อาจารย์ TBD".
//
// A topic card now shows the name the lecturer section shows, resolved from
// lecturer-sets.js; a lecturer with no set keeps the curriculum string, with
// no year; TBD shows no lecturer button at all.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { topicLecturerLabel } from '../../src/lib/lecturer-name.js';
import { LECTURER_SETS, lecturerTopics } from '../../src/data/lecturer-sets.js';
import { SUBJECTS } from '../../src/data/curriculum.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('UI-20: the equine topic cards name each lecturer the way the lecturer section does', () => {
  const eq = SUBJECTS.find((s) => s.id === 'equine-medicine');
  const setNames = new Set(LECTURER_SETS['equine-medicine'].lecturers.flatMap((l) => l.name.split(' และ ')));
  // Every topic on the midterm screen, where both sections are drawn.
  const midterm = eq.topics.filter((t) => t.examScope === 'midterm' && !t.hidden);
  assert.ok(midterm.length >= 7);
  for (const t of midterm) {
    const label = topicLecturerLabel('equine-medicine', t.lecturer);
    assert.ok(label, `${t.id}: no lecturer label`);
    assert.ok(setNames.has(label.name), `${t.id}: "${label.name}" is not a name the lecturer section shows`);
  }
});

test('UI-20: a spelling drift in the surname still finds the person, and a shared given name does not', () => {
  // curriculum.js spells him Jarutumnasaki, lecturer-sets.js Jarutummasiri.
  assert.deepEqual(topicLecturerLabel('equine-medicine', 'Thapana Jarutumnasaki'), { name: 'น.สพ.ฐาปนา จรัสธรรมสิริ', titled: true });
  // Two Theerawats teach equine reproduction; only Tharasanit has a set.
  assert.equal(topicLecturerLabel('equine-repro', 'Theerawat Tharasanit').name, 'รศ.น.สพ.ดร.ธีรวัฒน์ ธาราศานิต');
  assert.deepEqual(topicLecturerLabel('equine-repro', 'Theerawat Swangchan-Uthai'), { name: 'Theerawat Swangchan-Uthai', titled: false });
});

test('UI-20: initials in brackets and two-lecturer topics resolve too', () => {
  assert.equal(topicLecturerLabel('milk-meat-hygiene', 'จักรกริศน์ เนื่องจำนงค์ (CN)').name, 'รศ.น.สพ.ดร.จักรกริศน์ เนื่องจำนงค์');
  assert.equal(topicLecturerLabel('one-health', 'Kamonpan Charoenkul + Alongkorn Amonsin').name,
    'อ.สพ.ญ.ดร.กมลพรรณ เจริญกุล และ ศ.น.สพ.ดร.อลงกร อมรศิลป์');
});

test('UI-20: TBD and blank lecturers show nothing; a lecturer with no set keeps the curriculum string', () => {
  for (const v of ['TBD', 'tbd', ' TBD ', '', null, undefined]) assert.equal(topicLecturerLabel('equine-medicine', v), null);
  assert.deepEqual(topicLecturerLabel('equine-medicine', 'Weerapongse Tangjitjaroen'), { name: 'Weerapongse Tangjitjaroen', titled: false });
  assert.deepEqual(topicLecturerLabel('swine-clinic', 'Somebody Else'), { name: 'Somebody Else', titled: false });
});

test('UI-20: every lecturer-set topic resolves to its own lecturer across all set subjects', () => {
  for (const [sid, set] of Object.entries(LECTURER_SETS)) {
    const subj = SUBJECTS.find((s) => s.id === sid);
    for (const lec of set.lecturers) {
      for (const id of lecturerTopics(lec)) {
        const t = subj?.topics?.find((x) => x.id === id);
        if (!t) continue;
        const label = topicLecturerLabel(sid, t.lecturer);
        // A deck can span a colleague's topic (Sawita's practice deck sits on
        // equine-intro, Teerapol's topic), so the label must be SOME set
        // lecturer's name, never an English fallback.
        if (label && label.titled === false) {
          const setGiven = set.lecturers.flatMap((l) => (l.lecturers || [l.lecturer]))
            .map((p) => p.split(/\s+/)[0].toLowerCase());
          assert.ok(!setGiven.includes(String(t.lecturer).split(/\s+/)[0].toLowerCase()),
            `${sid}:${id} "${t.lecturer}" matches a set lecturer's given name but did not resolve`);
        }
        if (label?.titled) assert.ok(set.lecturers.some((l) => l.name.split(' และ ').includes(label.name) || l.name === label.name), `${sid}:${id}`);
      }
    }
  }
});

test('UI-20: the topic card shows no year and no TBD, and opens the profile with the stored string', () => {
  const view = read('src/views/TopicSelectView.jsx');
  assert.doesNotMatch(view, /lecturer_year/, 'the card still prints the lecturer year');
  assert.match(view, /const lecturerLabel = topicLecturerLabel\(subject, t\.lecturer\);/);
  // The lookup behind the profile modal still gets the curriculum string.
  assert.match(view, /onClick=\{\(\) => openInstructorFor\(t\.lecturer\)\}/);
  assert.match(view, /\{lecturerLabel && \(/);
});
