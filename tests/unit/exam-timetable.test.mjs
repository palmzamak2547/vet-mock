import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { EXAM_SCHEDULE, bangkokMs, parseExamStart } from '../../src/data/schedule.js';
import { examTimetable, periodOf, paperOverMs, durationLabel, dateRangeLabel } from '../../src/lib/exam-timetable.js';
import { timetablePdf, rowMetrics, ROWS, BODY_BOTTOM } from '../../src/lib/share-card/timetable-card.js';

const startMs = (e) => {
  const s = parseExamStart(e.time) || { hour: 8, minute: 0 };
  return bangkokMs(e.date, s.hour, s.minute);
};
// Written out again rather than imported: a paper is over at its start plus
// its duration (three hours when it has none), and a paper whose time does not
// parse is over when its Bangkok day is.
const overMs = (e) => (parseExamStart(e.time)
  ? startMs(e) + (e.duration_min || 180) * 60_000
  : Date.parse(`${e.date}T00:00:00+07:00`) + 86_400_000);

test('durations and date ranges read the way the page prints them', () => {
  assert.equal(durationLabel(180), '3 ชั่วโมง');
  assert.equal(durationLabel(90), '1 ชั่วโมง 30 นาที');
  assert.equal(durationLabel(45), '45 นาที');
  assert.equal(durationLabel(null), '');
  // Minutes are whole on the page, however the duration was worked out.
  assert.equal(durationLabel(89.6), '1 ชั่วโมง 30 นาที');
  assert.equal(durationLabel(59.5), '1 ชั่วโมง');
  assert.equal(durationLabel(44.4), '44 นาที');
  assert.equal(durationLabel('90'), '1 ชั่วโมง 30 นาที');
  assert.equal(durationLabel(0.4), '');
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
      const terms = [...new Set(t.rows.map((r) => exams.find((e) => e.id === r.id).term).filter(Boolean))];
      assert.ok(terms.length <= 1, `${exam.id}: one term per page, not ${terms}`);
      if (exam.term) assert.deepEqual(terms, [exam.term], `${exam.id}: its own term's page`);
      assert.equal(t.term, terms[0] || null, `${exam.id}: the page's term is its papers'`);
      const sat = t.rows.map((r) => startMs(exams.find((e) => e.id === r.id)));
      assert.deepEqual(sat, [...sat].sort((a, b) => a - b), `${exam.id}: rows in the order they are sat`);
      assert.deepEqual(t.weeks.flatMap((w) => w.rows), t.rows, `${exam.id}: weeks partition the rows`);
      assert.deepEqual(t.weeks.map((w) => w.label), t.weeks.map((_, i) => `สัปดาห์ที่ ${i + 1}`));
      for (const r of t.rows) {
        const e = exams.find((x) => x.id === r.id);
        assert.equal(r.past, overMs(e) <= now.getTime(), `${r.id} past flag at ${now.toISOString()}`);
      }
    }
  }
});

// Synthetic lists: a paper the faculty left without a term must neither take
// the page over (the next paper, with the finals dropped and the title gone)
// nor drop out of it (a finals page that left it off).
const paper = (id, date, time, extra = {}) => ({
  id, subject: `test-${id}`, title: `${id.toUpperCase()} — สอบ`, date, time, duration_min: 120, location: 'VET6 807', ...extra,
});
const at = (iso) => new Date(iso);
const ids = (p) => p.rows.map((r) => r.id);

test('a lab final with no term joins the finals around it, under their title', () => {
  const list = [
    paper('m1', '2026-09-21', '08:30-09:30', { term: 'midterm' }),
    paper('lab', '2026-11-20', '13:00-14:00', { duration_min: 60 }),
    paper('f1', '2026-11-23', '13:00-15:00', { term: 'final' }),
    paper('f2', '2026-11-24', '08:30-10:30', { term: 'final' }),
  ];
  // The lab paper is the next one: the page is still the finals.
  const before = periodOf(list, at('2026-11-19T12:00:00+07:00'));
  assert.equal(before.term, 'final');
  assert.equal(before.title, 'ตารางสอบปลายภาค');
  assert.deepEqual(ids(before), ['lab', 'f1', 'f2']);
  assert.equal(before.subjects, 3);
  assert.equal(before.range, '20 ถึง 24 พ.ย. 2569');
  // Once it is over, it stays on the page, past.
  const after = periodOf(list, at('2026-11-21T09:00:00+07:00'));
  assert.equal(after.title, 'ตารางสอบปลายภาค');
  assert.deepEqual(after.rows.map((r) => [r.id, r.past]), [['lab', true], ['f1', false], ['f2', false]]);
  // The midterm, two months off, is on neither.
  assert.deepEqual(after.weeks.map((w) => w.rows.map((r) => r.id)), [['lab'], ['f1', 'f2']]);
});

test('a final missing its term stays on the finals page, next or not', () => {
  const list = [
    paper('f1', '2026-11-23', '13:00-15:00', { term: 'final' }),
    paper('f2', '2026-11-25', '13:00-15:00'),
    paper('f3', '2026-11-27', '08:30-10:30', { term: 'final' }),
  ];
  for (const now of ['2026-11-22T09:00:00+07:00', '2026-11-24T09:00:00+07:00', '2026-11-26T09:00:00+07:00']) {
    const p = periodOf(list, at(now));
    assert.equal(p.title, 'ตารางสอบปลายภาค', now);
    assert.deepEqual(ids(p), ['f1', 'f2', 'f3'], now);
  }
  // With no paper carrying a term, the page makes no claim about which.
  const unmarked = periodOf(list.map(({ term, ...e }) => e), at('2026-11-22T09:00:00+07:00'));
  assert.equal(unmarked.term, null);
  assert.equal(unmarked.title, 'ตารางสอบ');
  assert.equal(periodOf([], at('2026-11-22T09:00:00+07:00')), null);
});

test('papers on one day print in the order they are sat, an untimed one last', () => {
  const p = periodOf([
    paper('pm', '2026-11-23', '13:00-15:00', { term: 'final' }),
    paper('tba', '2026-11-23', 'รอประกาศ', { term: 'final' }),
    paper('am', '2026-11-23', '08:30-10:30', { term: 'final' }),
    paper('next-day', '2026-11-24', '08:30-10:30', { term: 'final' }),
  ], at('2026-11-22T12:00:00+07:00'));
  assert.deepEqual(ids(p), ['am', 'pm', 'tba', 'next-day']);
});

test('a paper whose time does not parse is past only once its Bangkok day is over', () => {
  const untimed = paper('lab', '2026-11-25', '~2 ชม.', { term: 'final', duration_min: undefined });
  assert.equal(paperOverMs(untimed), Date.parse('2026-11-26T00:00:00+07:00'));
  // 11:00 is 08:00 plus three hours, the hour it used to turn past.
  for (const [now, past] of [
    ['2026-11-25T11:00:00+07:00', false],
    ['2026-11-25T23:59:59+07:00', false],
    ['2026-11-26T00:00:00+07:00', true],
  ]) assert.equal(periodOf([untimed], at(now)).rows[0].past, past, now);
  const row = periodOf([untimed], at('2026-11-25T11:00:00+07:00')).rows[0];
  assert.equal(row.session, '', 'no morning or afternoon claimed for it');
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

// The page's capacity, without a canvas. The body starts where the title
// block ends, measured on the year-5 finals page on 28 Oct 2026: 433 to 437.5
// under the regular title and 379 to 383.5 under the compact one in WebKit,
// Firefox and Chromium. The tallest of each is used here.
const TOPS = { regular: 438, compact: 384 };

test('regular rows while they fit, compact ones up to sixteen papers', () => {
  const ten = rowMetrics({ top: TOPS, rows: 10, weeks: 2 });
  assert.equal(ten.compact, false);
  assert.equal(ten.h, 89);
  assert.equal(ten.headers, 2 * ROWS.regular.weekH + ROWS.regular.weekGap);
  assert.ok(ten.end <= BODY_BOTTOM);
  assert.deepEqual(ten.lines, [-5, 27]);

  for (let rows = 1; rows <= 16; rows++) {
    for (let weeks = 1; weeks <= Math.min(3, rows); weeks++) {
      const m = rowMetrics({ top: TOPS, rows, weeks });
      assert.ok(m.fits, `${rows} papers in ${weeks} weeks fit`);
      assert.ok(m.end <= BODY_BOTTOM, `${rows} papers in ${weeks} weeks end at ${m.end}`);
      assert.equal(m.end, m.top + m.headers + rows * m.h);
      assert.ok(m.h >= ROWS.compact.min && m.h <= ROWS.regular.max);
      // Compact only when the regular rows would not fit.
      assert.equal(m.compact, !rowMetrics({ top: TOPS, rows, weeks, mode: 'regular' }).fits, `${rows}/${weeks}`);
    }
  }
  const sixteen = rowMetrics({ top: TOPS, rows: 16, weeks: 3 });
  assert.equal(sixteen.compact, true);
  assert.equal(sixteen.h, ROWS.compact.min);
  assert.deepEqual(sixteen.lines, [-4, 24]);
});

test('rows that cannot fit say so, and where they would end', () => {
  // Regular rows stop at 66 px: thirteen papers in three weeks no longer
  // fit them and go compact; seventeen pass the body even compact.
  assert.equal(rowMetrics({ top: TOPS, rows: 13, weeks: 3, mode: 'regular' }).fits, false);
  const over = rowMetrics({ top: TOPS, rows: 17, weeks: 3 });
  assert.equal(over.compact, true);
  assert.equal(over.fits, false);
  assert.equal(over.h, ROWS.compact.min);
  assert.ok(over.end > BODY_BOTTOM, `ends at ${over.end}`);
  // One number serves both titles.
  assert.equal(rowMetrics({ top: 500, rows: 4, weeks: 1 }).top, 500);
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
