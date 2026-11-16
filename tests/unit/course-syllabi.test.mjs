import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { SYLLABI, TERMS } from '../../src/data/course-syllabi.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { VIDEO_REGISTRY } from '../../src/data/video-registry.generated.js';
import { COURSE_GROUPS, EXAM_SCHEDULE } from '../../src/data/schedule.js';
import { NO_TIME, courseDocs, sessionPaper, syllabusDoc, teachingDoc, scopeConflicts, syllabiFor } from '../../src/lib/course-docs.js';
import { timetablePdf } from '../../src/lib/share-card/timetable-card.js';
import { topicOnPaper } from '../../src/lib/exam-scope.js';
import { statusLines } from '../../src/lib/share-card/course-doc-card.js';

// Pinned to the term the data describes, so the tests outlive the app's current term.
const TERM = '2569-1';
const Y5 = SYLLABI[TERM][5];
const NOW = new Date('2026-11-01T05:00:00Z');
const AT = { now: NOW, term: TERM };
const subject = (id) => SUBJECTS.find((s) => s.id === id);

test('every course of the year-5 term-1 programme has its syllabus, under its own code', () => {
  const codes = Object.values(Y5).map((c) => c.code).sort();
  assert.deepEqual(codes, [...COURSE_GROUPS.y5.codes].sort());
  for (const [id, c] of Object.entries(Y5)) {
    assert.equal(subject(id)?.code, c.code, `${id} is ${c.code} in the curriculum`);
    assert.ok(c.sources.length > 0 && c.sources.every((s) => s.title && s.where && /^\d{4}-\d{2}-\d{2}$/.test(s.checked)), `${id} names its sources`);
  }
});

test('every session is a dated row of this term that names who taught it and what topic', () => {
  const week = TERMS[TERM].midterm;
  for (const [id, c] of Object.entries(Y5)) {
    const topics = new Set(subject(id).topics.map((t) => t.id));
    let last = '';
    for (const s of c.sessions) {
      const where = `${id} ${s.date}`;
      assert.match(s.date, /^2026-(0[89]|1[01])-\d{2}$/, `${where}: a date inside the term`);
      assert.ok(s.date >= last, `${where}: sessions in date order`);
      last = s.date;
      assert.ok(s.date < week.start || s.date > week.end, `${where}: no class in the midterm week`);
      if (s.time) assert.match(s.time, /^\d{2}:\d{2}–\d{2}:\d{2}$/, `${where}: time as HH:MM–HH:MM`);
      if (!s.kind) assert.ok(s.lecturers.length > 0, `${where}: names its lecturers`);
      for (const t of s.topics) assert.ok(topics.has(t), `${where}: topic ${t} is one of ${id}'s`);
      if (s.change) assert.ok(s.change.text && s.change.posted <= c.evidenceUntil, `${where}: a change carries its text and a day it was posted on`);
      // The plan a row moved from, and the evidence that it ran.
      const planned = [].concat(s.planned || []);
      for (const d of planned) assert.match(d, /^2026-(0[89]|1[01])-\d{2}$/, `${where}: a planned day inside the term`);
      if (planned.length) assert.ok(planned.some((d) => d !== s.date), `${where}: a plan names another day`);
      if (s.held) assert.ok(s.date <= c.evidenceUntil && s.kind !== 'holiday', `${where}: held on or before ${c.evidenceUntil}, the last evidence read for the course`);
    }
  }
});

test('no text in the syllabi carries a middle dot', () => {
  assert.ok(!JSON.stringify(SYLLABI).includes('·'));
});

test('the scores a syllabus prints add up', () => {
  for (const [id, c] of Object.entries(Y5)) {
    if (!c.assessment) continue;
    assert.equal(c.assessment.items.reduce((n, i) => n + i.pct, 0), 100, `${id} totals 100`);
    for (const i of c.assessment.items) {
      if (i.parts) assert.equal(i.parts.reduce((n, [, p]) => n + p, 0), i.pct, `${id} ${i.label}: its lecturers' parts make its total`);
    }
  }
});

// The evidence for the split: a topic the 2569 syllabus teaches on one side of
// the midterm is never scoped to the other paper alone ('both' and
// 'continuous' are the curriculum's own call, recorded with their reasons).
test('no topic is scoped to the paper its 2569 sessions are not on', () => {
  assert.deepEqual(scopeConflicts(SUBJECTS, 5, TERM), []);
});

test('a session sits on the paper its date, its document or its evidence puts it on', () => {
  const at = (id, date) => Y5[id].sessions.find((s) => s.date === date);
  const paper = (id, date) => sessionPaper(Y5[id], at(id, date), TERM);
  assert.equal(paper('avian-medicine', '2026-09-15'), 'midterm');
  assert.equal(paper('avian-medicine', '2026-11-17'), null, 'the HIPRA activity, moved to 17 Nov, examines nothing');
  assert.equal(paper('avian-medicine', '2026-10-06'), 'final');
  assert.equal(paper('epidemiology', '2026-08-03'), 'final', 'a course with only a final puts every session on it');
  assert.equal(paper('epidemiology', '2026-09-28'), null, 'the 28 Sep content is not examined');
  assert.equal(paper('poa-clinical', '2026-08-05'), null, 'a course with no paper puts nothing on one');
  assert.equal(paper('equine-repro', '2026-10-08'), 'final', 'the stallion exam was taught after the midterm');
  assert.equal(paper('zoonoses', '2026-09-10'), 'midterm', 'the helminth class moved to 10 Sep sits before the midterm');
  assert.equal(paper('zoonoses', '2026-09-18'), 'midterm');
  assert.equal(paper('zoonoses', '2026-10-27'), 'final', 'the 27 Oct make-up taught Bacterial zoonoses I, after the midterm');
  assert.equal(paper('zoonoses', '2026-10-02'), 'final');
});

// The map of each paper: every class a paper examines is held by a topic the
// app puts on that paper, and every topic the app puts on a final is a class's.
test('every class a paper examines sits in a topic on that paper', () => {
  const phase = { midterm: '1-mid', final: '1-final' };
  // A review class revisits the course and teaches nothing of its own.
  const review = new Set(['epidemiology 2026-11-16']);
  const missing = [];
  for (const [id, c] of Object.entries(Y5)) {
    for (const s of c.sessions) {
      const p = sessionPaper(c, s, TERM);
      if (!p || review.has(`${id} ${s.date}`)) continue;
      if (!s.topics.some((t) => topicOnPaper(id, t, phase[p]))) missing.push(`${id} ${s.date} ${s.title.slice(0, 40)} (${p})`);
    }
  }
  assert.deepEqual(missing, []);
  const fiqc = Y5['food-industry'].sessions.find((s) => s.date === '2026-11-11');
  assert.ok(topicOnPaper('food-industry', fiqc.topics[0], '1-final'), 'the 11 Nov meat QC class is on the final');
  assert.ok(!topicOnPaper('food-industry', fiqc.topics[0], '1-mid'));
});

test('every topic on a year-5 final is taught by a class of the term, but tendon injuries', () => {
  // equine-tendon: no class, deck or recording of 2569 names it yet; the 12 Nov
  // lameness class is the likely one, and the topic stays on the final.
  const untaught = [];
  for (const [id, c] of Object.entries(Y5)) {
    if (!c.papers?.final) continue;
    const named = new Set(c.sessions.flatMap((s) => s.topics));
    for (const t of subject(id).topics) if (!t.hidden && t.examScope === 'final' && !named.has(t.id)) untaught.push(t.id);
  }
  assert.deepEqual(untaught, ['equine-tendon']);
});

test('the syllabus page says what each paper covers and when it sits', () => {
  const doc = syllabusDoc('avian-medicine', 5, AT);
  const [mid, fin] = doc.papers;
  assert.equal(mid.covers, 'เนื้อหาที่เรียน 4 ส.ค. ถึง 15 ก.ย., คะแนน 54%');
  assert.equal(fin.covers, 'เนื้อหาที่เรียน 6 ต.ค. ถึง 10 พ.ย., คะแนน 46%', 'the classes as they ran, the HIPRA activity not among them');
  assert.equal(mid.when, 'จันทร์ 21 ก.ย. 2569, 13:00–15:00, VET6 B01-03');
  assert.equal(fin.when, 'พุธ 2 ธ.ค. 2569, 08:30–10:30, VET6 807');
  assert.deepEqual(mid.groups.map((g) => g.who), ['ณทยา เจริญวิศาล', 'สมศักดิ์ ภัคภิญโญ', 'จิโรจ ศศิปรียจันทร์', 'เกรียงวิชญ์ ลิมปวิทยากุล']);
  assert.equal(doc.facts[0].text, 'ทุกวันอังคาร 13:00–16:00 ห้อง 807, 4 ส.ค. ถึง 17 พ.ย. 2569');
  assert.equal(doc.notes[0], 'วันเวลาและห้องสอบอาจเปลี่ยนตามประกาศ, วันเรียนหลัง 10 พ.ย. 69 เป็นวันตามแผน', 'the course’s own evidence date');
  assert.equal(doc.issued, '1 พ.ย. 2569');

  const epid = syllabusDoc('epidemiology', 5, AT);
  assert.deepEqual(epid.papers.map((p) => p.term), ['final']);
  assert.match(epid.papers[0].covers, /^สอบครั้งเดียว ไม่มีสอบกลางภาค, /);
  assert.ok(epid.notes.some((n) => n.includes('ไม่ออกสอบ')), 'the content that is not examined is said so');
  const poa = syllabusDoc('poa-clinical', 5, AT);
  assert.deepEqual(poa.papers, []);
  assert.equal(poa.noPaper, 'ไม่มีสอบกลางภาคและปลายภาคในตารางสอบของคณะ');
  assert.equal(syllabusDoc('swine-clinic', 5, AT).assessment, null, 'a syllabus that gives no split prints none');
});

test('the teaching timetable lists every session and the faculty table’s papers in date order', () => {
  for (const { subject: id } of courseDocs(5, TERM)) {
    const doc = teachingDoc(id, 5, AT);
    const exams = EXAM_SCHEDULE.y5.filter((e) => e.subject === id && (e.term === 'midterm' || e.term === 'final'));
    const rows = doc.rows.filter((r) => r.kind === 'exam');
    assert.equal(rows.length, exams.length, `${id}: one row per paper`);
    for (const e of exams) {
      const r = rows.find((x) => x.paper === e.term);
      assert.equal(r.date, e.date, `${id} ${e.term} date`);
      assert.equal(r.lecturers, e.location, `${id} ${e.term} room`);
    }
    assert.equal(doc.rows.length - rows.length, Y5[id].sessions.length, `${id}: every session`);
    assert.deepEqual(doc.rows.map((r) => r.date), [...doc.rows.map((r) => r.date)].sort(), `${id}: in date order`);
  }
  const z = teachingDoc('zoonoses', 5, AT);
  const epi = z.rows.find((r) => r.date === '2026-11-13' && r.status === 'เดิม 9 ต.ค.');
  assert.match(epi.change, /ย้ายมาสอนวันนี้ \(กลุ่มไลน์ชั้นปี 30 ก\.ย\. 69\)$/, 'a moved class carries the announcement and its date');
  assert.equal(z.rows.find((r) => r.date === '2026-08-28').status, 'เดิม 14 และ 28 ส.ค.', 'two planned classes taught in one name both days');
  assert.equal(z.rows.find((r) => r.title === 'Prion zoonoses').status, 'เดิม 13 พ.ย.', 'taught on 4 Nov with Bacterial zoonoses II');
  assert.equal(teachingDoc('equine-medicine', 5, AT).rows.find((r) => r.date === '2026-11-12').status, '', 'a class past the course’s evidence is the plan, which the note says once');
  const swine = teachingDoc('swine-clinic', 5, AT);
  assert.equal(swine.rows.find((r) => r.title.startsWith('โรคปากและเท้าเปื่อย')).status, 'เดิม 16 ต.ค.', 'planned on a holiday, taught on 30 Oct');
  assert.equal(swine.rows.find((r) => r.title.includes('โคไลบาซิลโลซิส')).status, 'ยังไม่ทราบวัน', 'its 30 Oct slot went to another class, its day not yet known');
  assert.equal(swine.rows.find((r) => r.title === 'โรคระบบกล้ามเนื้อ กระดูกและการเคลื่อนไหว').status, 'เดิม 18 ก.ย.', 'taught on 11 Sep with the mycoplasma class');
  const epid26 = teachingDoc('epidemiology', 5, AT);
  assert.equal(epid26.rows.find((r) => r.date === '2026-10-26').status, 'ตามแผน', 'a past class with no evidence it ran says so');
  assert.ok(epid26.notes.includes('"ตามแผน" ใต้วันที่ คือยังไม่มีหลักฐานว่าสอนวันนั้นจริง'));
  assert.ok(!z.notes.some((n) => n.startsWith('"ตามแผน"')), 'a page with no such row does not explain the word');
  const epid = teachingDoc('epidemiology', 5, AT);
  // The module staff are five of the course's six lecturers: named once, as a team, not as everyone.
  assert.equal(epid.rows.find((r) => r.date === '2026-10-05').lecturers, 'ทีมผู้สอน 5 ท่าน');
  assert.match(epid.staff, /^ทีมผู้สอน 5 ท่าน: /);
  assert.equal(epid.rows.find((r) => r.date === '2026-08-31').lecturers, 'นิวัตร จันทร์ศิริพรชัย, นพวรรณ บัวมีธูป', 'the policy hour has its own lecturer');
  assert.deepEqual(syllabusDoc('epidemiology', 5, AT).facts.find((x) => x.label.startsWith('ทีมผู้สอน'))?.label, 'ทีมผู้สอน 5 ท่าน');
});

// A class that ran on the other side of the midterm from its plan changes
// which paper it is on; each is named here, so a new one is looked at.
test('the only class taught across the midterm from its plan is the stallion exam, and it sits on the final', () => {
  const week = TERMS[TERM].midterm;
  const side = (d) => (d < week.start ? 'midterm' : 'final');
  const crossed = [];
  for (const [id, c] of Object.entries(Y5)) {
    for (const s of c.sessions) if ([].concat(s.planned || []).some((d) => side(d) !== side(s.date))) crossed.push([id, s.date]);
  }
  assert.deepEqual(crossed, [['equine-repro', '2026-10-08']]);
  assert.equal(sessionPaper(Y5['equine-repro'], Y5['equine-repro'].sessions.find((s) => s.date === '2026-10-08'), TERM), 'final');
});

test('every term with syllabi has its calendar, and every course the day its own evidence ends', () => {
  for (const term of Object.keys(SYLLABI)) {
    const t = TERMS[term];
    assert.ok(t?.labelTh && t.midterm?.start && t.midterm?.end && t.final?.start && t.final?.end, `${term} has its exam weeks`);
    assert.equal(t.evidenceUntil, undefined, `${term}: no term-wide evidence date, each course has its own`);
    for (const [year, courses] of Object.entries(SYLLABI[term])) {
      for (const [id, c] of Object.entries(courses)) {
        assert.match(c.evidenceUntil || '', /^\d{4}-\d{2}-\d{2}$/, `${term} y${year} ${id} says where its evidence ends`);
        assert.ok(c.evidenceUntil <= t.final.end, `${id}: evidence inside the term`);
      }
    }
  }
});

test('each course is marked as far as its own evidence reaches, not as far as another course’s', () => {
  // The class LINE export ends on 28 Oct; the recordings of some courses run later.
  for (const [id, c] of Object.entries(Y5)) assert.ok(c.evidenceUntil >= '2026-10-28', `${id}: at least the class LINE export`);
  assert.equal(Y5['swine-clinic'].evidenceUntil, '2026-11-06');
  assert.equal(Y5['food-industry'].evidenceUntil, '2026-10-28');
  const swine = Y5['swine-clinic'].sessions.find((s) => s.date === '2026-11-06');
  assert.equal(swine.held, true, 'the 6 Nov swine class is recorded, so it is marked as run');
  // The same weeks in two courses: unheld inside a course’s reach reads as the plan; past it the row is blank.
  const poa = teachingDoc('poa-clinical', 5, AT);
  assert.equal(poa.rows.find((r) => r.date === '2026-10-28').status, 'ตามแผน');
  assert.equal(poa.rows.find((r) => r.date === '2026-11-04').status, '');
  const oh = teachingDoc('one-health', 5, AT);
  assert.equal(oh.rows.find((r) => r.date === '2026-11-04').status, '', 'recorded on 4 Nov');
  assert.ok(syllabusDoc('one-health', 5, AT).notes[0].endsWith('หลัง 11 พ.ย. 69 เป็นวันตามแผน'));
  assert.ok(syllabusDoc('food-industry', 5, AT).notes[0].endsWith('หลัง 28 ต.ค. 69 เป็นวันตามแผน'));
});

test('a moved class’s status breaks between dates, never inside one, and keeps its spaces', () => {
  const card = { style() {}, measure: (s) => s.length * 10 };
  assert.deepEqual(statusLines(card, 'เดิม 7 และ 21 ส.ค.', 1000, {}), ['เดิม 7 และ 21 ส.ค.']);
  assert.deepEqual(statusLines(card, 'เดิม 7 และ 21 ส.ค.', 120, {}), ['เดิม 7', 'และ 21 ส.ค.']);
  assert.deepEqual(statusLines(card, 'เดิม 7, 14 และ 21 ส.ค.', 120, {}), ['เดิม 7, 14', 'และ 21 ส.ค.']);
  assert.deepEqual(statusLines(card, 'เดิม 7, 14 และ 21 ส.ค.', 70, {}), ['เดิม 7,', '14', 'และ 21 ส.ค.']);
});

test('another term or year has no documents, and the page lists none', () => {
  assert.deepEqual(courseDocs(4, TERM), []);
  assert.deepEqual(syllabiFor(5, '2569-2'), {});
  assert.equal(syllabusDoc('avian-medicine', 5, { term: '2569-2' }), null);
});

test('a document of two pages is a two-page PDF', async () => {
  // The fixture exam-timetable.test.mjs embeds: an 8x11 baseline JPEG.
  const JPEG = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6gooorIo//9k=', 'base64');
  const bytes = await timetablePdf([Uint8Array.from(JPEG), Uint8Array.from(JPEG)], { title: 'ตารางสอน' });
  const doc = await PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 2);
});

// Classes marked as run before the recordings were checked against the data on
// 16 Nov 2026: their evidence is the class LINE export or the first recordings
// listing, neither of which the repository holds. This list only shrinks.
const HELD_BEFORE_CHECK = new Set([
  'epidemiology 2026-10-12', 'epidemiology 2026-10-19', 'aquatic-clinic 2026-08-04',
  'avian-medicine 2026-08-18', 'avian-medicine 2026-09-08', 'avian-medicine 2026-10-20',
  'poa-clinical 2026-08-05', 'poa-clinical 2026-08-26', 'poa-clinical 2026-09-02', 'poa-clinical 2026-09-09',
  'poa-clinical 2026-09-16', 'poa-clinical 2026-09-30', 'poa-clinical 2026-10-07', 'poa-clinical 2026-10-14',
  'milk-meat-hygiene 2026-09-02', 'milk-meat-hygiene 2026-09-09', 'milk-meat-hygiene 2026-09-16',
  'one-health 2026-08-19', 'one-health 2026-09-02', 'food-industry 2026-08-19', 'food-industry 2026-09-02',
  'equine-repro 2026-08-06', 'zoonoses 2026-09-04', 'zoonoses 2026-09-18',
  'swine-clinic 2026-08-14', 'swine-clinic 2026-08-28',
]);
const LINE_UNTIL = '2026-10-28';
const recordings = (id) => Object.values(VIDEO_REGISTRY).filter((v) => v.year === 5 && v.term === 1 && v.subject === id && v.date);

test('a class marked as run has a recording on its day or a dated notice, and every recording has its class', () => {
  for (const [id, c] of Object.entries(Y5)) {
    const recs = recordings(id);
    const days = new Set(recs.map((v) => v.date));
    for (const s of c.sessions.filter((x) => x.held)) {
      const key = `${id} ${s.date}`;
      assert.ok(days.has(s.date) || s.change?.posted || HELD_BEFORE_CHECK.has(key), `${key}: marked as run with no recording that day and no notice`);
    }
    for (const v of recs) {
      assert.ok(v.date <= c.evidenceUntil, `${id}: the recording of ${v.date} is past the course's evidence date`);
      assert.ok(c.sessions.some((s) => s.date === v.date && s.held), `${id}: the recording of ${v.date} (${v.title}) has no class marked as run that day`);
    }
    const latest = [LINE_UNTIL, ...recs.map((v) => v.date)].sort().at(-1);
    assert.equal(c.evidenceUntil, latest, `${id}: the evidence date is its latest recording or the end of the class LINE export`);
  }
  for (const key of HELD_BEFORE_CHECK) {
    const [id, date] = key.split(' ');
    assert.ok(Y5[id].sessions.some((s) => s.date === date && s.held), `${key}: still a class marked as run`);
    assert.ok(!recordings(id).some((v) => v.date === date), `${key}: has a recording now, drop it from the list`);
  }
});

test('a class off the weekly day with no hours from its evidence says the time is not known', () => {
  const z = teachingDoc('zoonoses', 5, AT);
  for (const r of z.rows.filter((x) => x.date === '2026-11-04')) assert.equal(r.time, NO_TIME, `${r.title}: a Wednesday class of a Friday course`);
  assert.equal(z.rows.find((r) => r.date === '2026-08-07' && r.kind === 'session').time, '', 'on the weekly day the slot gives the hours');
  assert.equal(teachingDoc('avian-medicine', 5, AT).rows.find((r) => r.date === '2026-10-19').time, '09:00–10:00', 'hours from a notice stay');
});
