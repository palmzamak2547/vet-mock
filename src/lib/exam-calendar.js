// ============================================================
// The exam timetable as an iCalendar feed (RFC 5545)
// ============================================================
// /api/calendar?year=5 serves this text; Google Calendar, Apple Calendar and
// Outlook subscribe to it by URL and refresh it themselves, so a moved paper
// reaches every student's phone without anyone re-importing a file.
// Times in schedule.js are Bangkok wall-clock (UTC+7, no DST): they are
// written as UTC instants (bangkokMs), which every calendar app shows in
// the reader's own zone. A paper whose time does not parse starts at 08:00
// and one without a duration lasts 180 minutes, the same rules as the
// countdown on Home.
// ============================================================

import { EXAM_SCHEDULE, bangkokMs, parseExamStart, examTitle } from '../data/schedule.js';

export const CALENDAR_YEARS = Object.keys(EXAM_SCHEDULE).map((k) => Number(k.slice(1))).sort();

const stamp = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// RFC 5545 3.3.11: backslash, semicolon and comma are escaped, newlines become \n.
const text = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// RFC 5545 3.1: lines over 75 octets fold with CRLF + one space, never inside
// a UTF-8 character (Thai is three octets each).
const utf8 = new TextEncoder();
function fold(line) {
  const out = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = utf8.encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** The feed for one curriculum year, or null when that year has no timetable. */
export function examCalendar(year, { now = Date.now() } = {}) {
  const exams = EXAM_SCHEDULE[`y${year}`];
  if (!exams) return null;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VetMock//Exam timetable//TH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${text(`ตารางสอบ VetMock ปี ${year}`)}`,
    'X-WR-TIMEZONE:Asia/Bangkok',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
  ];
  for (const exam of exams) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(exam.date || '')) continue;
    const start = parseExamStart(exam.time) || { hour: 8, minute: 0 };
    const startMs = bangkokMs(exam.date, start.hour, start.minute);
    const endMs = startMs + (exam.duration_min || 180) * 60 * 1000;
    const notes = [exam.code && `รหัสวิชา ${exam.code}`, exam.time && `เวลา ${exam.time}`, exam.notes].filter(Boolean).join('\n');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${exam.id}@vetmock.com`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(startMs)}`,
      `DTEND:${stamp(endMs)}`,
      `SUMMARY:${text(`สอบ ${examTitle(exam)}`)}`,
      ...(exam.location ? [`LOCATION:${text(exam.location)}`] : []),
      ...(notes ? [`DESCRIPTION:${text(notes)}`] : []),
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${text(`พรุ่งนี้สอบ ${examTitle(exam)}`)}`,
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
