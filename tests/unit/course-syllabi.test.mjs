import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { SYLLABI, CLASS_LINE_UNTIL } from '../../src/data/course-syllabi.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { COURSE_GROUPS, EXAM_SCHEDULE, SEMESTER } from '../../src/data/schedule.js';
import { courseDocs, sessionPaper, syllabusDoc, teachingDoc, scopeConflicts, syllabiFor } from '../../src/lib/course-docs.js';
import { timetablePdf } from '../../src/lib/share-card/timetable-card.js';

const Y5 = SYLLABI['2569-1'][5];
const NOW = new Date('2026-11-01T05:00:00Z');
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
  for (const [id, c] of Object.entries(Y5)) {
    const topics = new Set(subject(id).topics.map((t) => t.id));
    let last = '';
    for (const s of c.sessions) {
      const where = `${id} ${s.date}`;
      assert.match(s.date, /^2026-(0[89]|1[01])-\d{2}$/, `${where}: a date inside the term`);
      assert.ok(s.date >= last, `${where}: sessions in date order`);
      last = s.date;
      assert.ok(s.date < SEMESTER.midtermPeriod.start || s.date > SEMESTER.midtermPeriod.end, `${where}: no class in the midterm week`);
      if (s.time) assert.match(s.time, /^\d{2}:\d{2}–\d{2}:\d{2}$/, `${where}: time as HH:MM–HH:MM`);
      if (!s.kind) assert.ok(s.lecturers.length > 0, `${where}: names its lecturers`);
      for (const t of s.topics) assert.ok(topics.has(t), `${where}: topic ${t} is one of ${id}'s`);
      if (s.change) assert.ok(s.change.text && s.change.posted <= CLASS_LINE_UNTIL, `${where}: a change carries its text and a day it was posted on`);
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
  assert.deepEqual(scopeConflicts(SUBJECTS, 5), []);
});

test('a session sits on the paper its date, its document or its evidence puts it on', () => {
  const at = (id, date) => Y5[id].sessions.find((s) => s.date === date);
  const paper = (id, date) => sessionPaper(Y5[id], at(id, date));
  assert.equal(paper('avian-medicine', '2026-09-15'), 'midterm');
  assert.equal(paper('avian-medicine', '2026-09-29'), null, 'the HIPRA activity examines nothing');
  assert.equal(paper('avian-medicine', '2026-10-06'), 'final');
  assert.equal(paper('epidemiology', '2026-08-03'), 'final', 'a course with only a final puts every session on it');
  assert.equal(paper('epidemiology', '2026-09-28'), null, 'the 28 Sep content is not examined');
  assert.equal(paper('poa-clinical', '2026-08-05'), null, 'a course with no paper puts nothing on one');
  assert.equal(paper('equine-repro', '2026-09-17'), 'final', 'the stallion exam was taught after the midterm');
  assert.equal(paper('zoonoses', '2026-09-18'), 'midterm');
  assert.equal(paper('zoonoses', '2026-10-02'), 'final');
});

test('the syllabus page says what each paper covers and when it sits', () => {
  const doc = syllabusDoc('avian-medicine', 5, { now: NOW });
  const [mid, fin] = doc.papers;
  assert.equal(mid.covers, 'เนื้อหาที่เรียน 4 ส.ค. ถึง 15 ก.ย. (7 ครั้ง), คะแนน 54%');
  assert.equal(fin.covers, 'เนื้อหาที่เรียน 6 ต.ค. ถึง 17 พ.ย. (6 ครั้ง), คะแนน 46%');
  assert.equal(mid.when, 'จันทร์ 21 ก.ย. 2569, 13:00–15:00, VET6 B01-03');
  assert.equal(fin.when, 'พุธ 2 ธ.ค. 2569, 08:30–10:30, VET6 807');
  assert.deepEqual(mid.groups.map((g) => g.who), ['ณทยา เจริญวิศาล', 'สมศักดิ์ ภัคภิญโญ', 'จิโรจ ศศิปรียจันทร์', 'เกรียงวิชญ์ ลิมปวิทยากุล']);
  assert.equal(doc.facts[0].text, 'ทุกวันอังคาร 13:00–16:00 ห้อง 807, 4 ส.ค. ถึง 17 พ.ย. 2569 (14 ครั้ง)');
  assert.equal(doc.issued, '1 พ.ย. 2569');

  const epid = syllabusDoc('epidemiology', 5, { now: NOW });
  assert.deepEqual(epid.papers.map((p) => p.term), ['final']);
  assert.ok(epid.notes.some((n) => n.includes('ไม่ออกสอบ')), 'the content that is not examined is said so');
  const poa = syllabusDoc('poa-clinical', 5, { now: NOW });
  assert.deepEqual(poa.papers, []);
  assert.equal(poa.noPaper, 'ไม่มีสอบกลางภาคและปลายภาคในตารางสอบของคณะ');
  assert.equal(syllabusDoc('swine-clinic', 5, { now: NOW }).assessment, null, 'a syllabus that gives no split prints none');
});

test('the teaching timetable lists every session and the faculty table’s papers in date order', () => {
  for (const { subject: id } of courseDocs(5)) {
    const doc = teachingDoc(id, 5, { now: NOW });
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
  const z = teachingDoc('zoonoses', 5, { now: NOW });
  assert.match(z.rows.find((r) => r.date === '2026-10-09').change, /ย้ายไปสอน 13 พ.ย\. \(แจ้งในกลุ่มไลน์ชั้นปี 30 ก\.ย\. 69\)/);
  const epid = teachingDoc('epidemiology', 5, { now: NOW });
  assert.equal(epid.rows.find((r) => r.date === '2026-10-05').lecturers, 'ผู้สอนทั้ง 5 ท่าน');
  assert.match(epid.staff, /^ผู้สอนทั้ง 5 ท่าน: /);
});

test('another term or year has no documents, and the page lists none', () => {
  assert.deepEqual(courseDocs(4), []);
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
