// ============================================================
// A daily study reminder, kept by the student's own calendar
// ============================================================
// VetMock has no push channel, so the reminder is an event that repeats every
// day in the student's calendar: Google Calendar through its "create event"
// link, everything else through /api/calendar?study=HH:MM (one .ics). The
// calendar does the reminding, which means it cannot know whether today's set
// is already done: the copy says it reminds every day, and how to stop it.
// Times are Bangkok wall clock; Thailand has no daylight saving, so one UTC
// instant repeated daily stays on the same Bangkok time all year.
// ============================================================

import { recentSessions } from './study-record.js';

export const REMINDER_TIMES = Object.freeze(['07:00', '12:00', '18:00', '20:00', '21:00']);
export const DEFAULT_REMINDER = '20:00';
const ORIGIN = 'https://vetmock.com';
const BANGKOK_OFFSET_MIN = 7 * 60;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "20:00" -> { hour: 20, minute: 0 }; anything else -> null. */
export function parseTime(value) {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value ?? ''));
  return m ? { hour: Number(m[1]), minute: Number(m[2]) } : null;
}

const pad = (n) => String(n).padStart(2, '0');
const bangkokParts = (ms) => {
  const d = new Date(ms + BANGKOK_OFFSET_MIN * 60 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() };
};

/**
 * When this student usually starts practising: the median start time of
 * their sessions in the last 14 days, rounded to the half hour, or null with
 * fewer than 3 sessions (two points are not a habit). The clock is a circle:
 * sessions at 23:30 and 00:30 are an hour apart, not eleven, so the day is cut
 * at the widest gap between sessions before taking the median.
 */
export function usualStudyTime(history, now = Date.now()) {
  const since = now - 14 * DAY_MS;
  const starts = recentSessions(history, { limit: 200 })
    .filter((s) => s.startedAt >= since && s.startedAt <= now)
    .map((s) => bangkokParts(s.startedAt).minutes)
    .sort((a, b) => a - b);
  const n = starts.length;
  if (n < 3) return null;
  let cut = 0;
  let widest = -1;
  for (let i = 0; i < n; i++) {
    const gap = (i + 1 < n ? starts[i + 1] : starts[0] + 1440) - starts[i];
    if (gap > widest) { widest = gap; cut = (i + 1) % n; }
  }
  const line = [...starts.slice(cut), ...starts.slice(0, cut).map((v) => v + 1440)];
  const mid = n % 2 ? line[(n - 1) / 2] : (line[n / 2 - 1] + line[n / 2]) / 2;
  const half = (Math.round(mid / 30) * 30) % 1440;
  return `${pad(Math.floor(half / 60))}:${pad(half % 60)}`;
}

/** The first moment the reminder rings: today at that Bangkok time. */
function firstStart(time, now) {
  const { y, m, d } = bangkokParts(now);
  return Date.UTC(y, m - 1, d, time.hour, time.minute) - BANGKOK_OFFSET_MIN * 60 * 1000;
}
const stamp = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// RFC 5545 3.1: lines over 75 octets fold with CRLF + one space, never inside
// a UTF-8 character (Thai is three octets each). The same rule as
// lib/exam-calendar.js, kept here so the client bundle never pulls the
// timetable in for a reminder link.
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

const TITLE = 'ทำโจทย์ VetMock';
const DETAILS = `ชุดสั้น ๆ วันละชุด ${ORIGIN}/`;

/** One repeating event, as an .ics file. null for a time that does not parse. */
export function reminderIcs(value, { now = Date.now() } = {}) {
  const time = parseTime(value);
  if (!time) return null;
  const start = firstStart(time, now);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VetMock//Study reminder//TH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    // One id per time of day: adding it again updates the same event.
    `UID:study-${pad(time.hour)}${pad(time.minute)}@vetmock.com`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `URL:${ORIGIN}/`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${TITLE}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(fold).join('\r\n') + '\r\n';
}

/** Google Calendar's own "create event" page, filled in. */
export function googleReminderUrl(value, { now = Date.now() } = {}) {
  const time = parseTime(value);
  if (!time) return null;
  const start = firstStart(time, now);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    details: DETAILS,
    dates: `${stamp(start)}/${stamp(start + 15 * 60 * 1000)}`,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** The .ics for every other calendar app (Apple, Outlook, Samsung). */
export const reminderIcsUrl = (value) => (parseTime(value) ? `${ORIGIN}/api/calendar?study=${encodeURIComponent(value)}` : null);
