import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { EXAM_SCHEDULE, bangkokMs, parseExamStart } from '../../src/data/schedule.js';
import { examTimetable, durationLabel, dateRangeLabel } from '../../src/lib/exam-timetable.js';
import { timetablePdf } from '../../src/lib/share-card/timetable-card.js';

const startMs = (e) => {
  const s = parseExamStart(e.time) || { hour: 8, minute: 0 };
  return bangkokMs(e.date, s.hour, s.minute);
};

test('durations and date ranges read the way the page prints them', () => {
  assert.equal(durationLabel(180), '3 ชั่วโมง');
  assert.equal(durationLabel(90), '1 ชั่วโมง 30 นาที');
  assert.equal(durationLabel(45), '45 นาที');
  assert.equal(durationLabel(null), '');
  assert.equal(dateRangeLabel('2026-11-23', '2026-11-27'), '23 ถึง 27 พ.ย. 2569');
  assert.equal(dateRangeLabel('2026-11-23', '2026-12-04'), '23 พ.ย. ถึง 4 ธ.ค. 2569');
  assert.equal(dateRangeLabel('2026-11-30', '2026-12-04', { year: false }), '30 พ.ย. ถึง 4 ธ.ค.');
  assert.equal(dateRangeLabel('2026-12-30', '2027-01-02'), '30 ธ.ค. 2569 ถึง 2 ม.ค. 2570');
  assert.equal(dateRangeLabel('2026-10-28', '2026-10-28'), '28 ต.ค. 2569');
});

// Every paper on the timetable, an hour before it starts: the printed period
// holds it, holds only its own term, never reaches into another term's papers,
// and calls past exactly the papers that have ended.
test('the printed period is the one each paper belongs to', () => {
  for (const [key, exams] of Object.entries(EXAM_SCHEDULE)) {
    const year = Number(key.slice(1));
    for (const exam of exams) {
      const now = new Date(startMs(exam) - 3_600_000);
      const t = examTimetable(year, now);
      const row = t.rows.find((r) => r.id === exam.id);
      assert.ok(row, `${exam.id} is on its own period's page`);
      assert.equal(row.past, false, `${exam.id} is not past an hour before it starts`);
      assert.deepEqual([...new Set(t.rows.map((r) => r.id).map((id) => exams.find((e) => e.id === id).term))], [exam.term], `${exam.id}: one term per page`);
      const dates = t.rows.map((r) => r.date);
      assert.deepEqual(dates, [...dates].sort(), `${exam.id}: rows in date order`);
      assert.deepEqual(t.weeks.flatMap((w) => w.rows), t.rows, `${exam.id}: weeks partition the rows`);
      assert.deepEqual(t.weeks.map((w) => w.label), t.weeks.map((_, i) => `สัปดาห์ที่ ${i + 1}`));
      for (const r of t.rows) {
        const e = exams.find((x) => x.id === r.id);
        const ended = startMs(e) + (e.duration_min || 180) * 60_000 <= now.getTime();
        assert.equal(r.past, ended, `${r.id} past flag at ${now.toISOString()}`);
      }
    }
  }
});

test('the year-5 finals print as two weeks of five papers, with time, room and the course print', () => {
  const t = examTimetable(5, new Date('2026-10-28T22:00:00+07:00'));
  assert.equal(t.title, 'ตารางสอบปลายภาค');
  assert.equal(t.kicker, 'ชั้นปีที่ 5 (Vet 86)');
  assert.equal(t.range, '23 พ.ย. ถึง 4 ธ.ค. 2569');
  assert.equal(t.issued, '28 ต.ค. 2569');
  assert.equal(t.file, 'vetmock-exam-timetable-y5-final-2569-1');
  assert.deepEqual(t.weeks.map((w) => [w.range, w.rows.length]), [['23 ถึง 27 พ.ย.', 5], ['30 พ.ย. ถึง 4 ธ.ค.', 5]]);
  for (const r of t.rows) {
    assert.match(r.time, /^\d\d:\d\d–\d\d:\d\d$/, `${r.id} time`);
    assert.ok(['เช้า', 'บ่าย'].includes(r.session), `${r.id} session`);
    assert.ok(r.room && r.duration && r.cover?.src, `${r.id} room, duration and print`);
  }
});

test('after the last paper the page keeps the last period, every paper past', () => {
  const t = examTimetable(5, new Date('2027-01-15T10:00:00+07:00'));
  assert.equal(t.term, 'final');
  assert.ok(t.rows.length > 0 && t.rows.every((r) => r.past));
  assert.equal(examTimetable(99), null);
});

// An 8x11 JPEG stands in for the drawn page.
const JPEG = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAALAAgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6gooorIo//9k=', 'base64');

test('the PDF is one A4 page carrying the page and its Thai title', async () => {
  const bytes = await timetablePdf(Uint8Array.from(JPEG), { title: 'ตารางสอบปลายภาค ชั้นปีที่ 5' });
  const doc = await PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(), 1);
  const page = doc.getPage(0);
  assert.equal(Math.round(page.getWidth()), 595);
  assert.equal(Math.round(page.getHeight()), 842);
  assert.equal(doc.getTitle(), 'ตารางสอบปลายภาค ชั้นปีที่ 5');
});
