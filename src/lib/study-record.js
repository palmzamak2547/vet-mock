// ============================================================
// study-record.js — the student's own record, computed in one place
// ============================================================
// Pure helpers behind the profile hub and Home's rhythm strip:
//   • weekTrack        the last seven local days and how much was done each
//   • recentSessions   what was practised lately, as sessions rather than
//                      one row per answer
//   • sessionWhen      "วันนี้ 13:40" for a session's start
//   • subjectsStarted  how many of the year's subjects have a read topic
//   • classRowLabel    the one line Home and the hub print for the next class,
//                      so the two cannot word it differently
//
// No React, no storage, no clock of their own: `now` is a parameter, so a
// test pins it and a 02:00 Bangkok day boundary is a plain assertion. Every
// reader of `history` here tolerates what a backup or an old sync can carry:
// a timestamp, an ISO string, or no date at all.
// ============================================================

import { isTopicRead } from './study-progress.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const DOW_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const DOW_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// Days and clock times are Bangkok's (UTC+7, no daylight saving), never the
// device's: on a phone or a CI runner set to UTC, 00:30 in Bangkok fell on the
// previous day, so the strip, "วันนี้ N ข้อ" and "วันนี้ 00:30" disagreed with
// the streak and the timetable, which already read Bangkok's clock.
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
/** A Date whose UTC fields read Bangkok's wall clock at that instant. */
const bangkokWall = (value) => new Date(new Date(value).getTime() + BANGKOK_OFFSET_MS);

/** Bangkok calendar day as YYYY-MM-DD; '' for a value that is not a time. */
export const dayKey = (value) => {
  const b = bangkokWall(value);
  return Number.isNaN(b.getTime()) ? '' : b.toISOString().slice(0, 10);
};

/** A history row's time as a number, or null when the row carries none. */
export function rowTime(value) {
  if (value == null || value === '') return null;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}

/** "จันทร์ 12 ต.ค." for a date. */
export function shortThaiDay(value) {
  const b = bangkokWall(value);
  if (Number.isNaN(b.getTime())) return '';
  return `${DOW_FULL[b.getUTCDay()]} ${b.getUTCDate()} ${TH_MONTHS[b.getUTCMonth()]}`;
}

/**
 * The last seven local days ending today, oldest first:
 *   { date, day, dow, dowLabel, isToday, studied, count }
 * `count` is answers recorded that day; `studied` is count > 0.
 */
export function weekTrack(history, now = Date.now()) {
  const counts = new Map();
  for (const row of Array.isArray(history) ? history : []) {
    const t = rowTime(row?.date);
    if (t == null) continue;
    const key = dayKey(t);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const track = [];
  for (let i = 6; i >= 0; i--) {
    // Bangkok keeps no daylight saving, so a day is always 24 hours back.
    const b = bangkokWall(new Date(now).getTime() - i * DAY_MS);
    const key = b.toISOString().slice(0, 10);
    const count = counts.get(key) || 0;
    track.push({
      date: key,
      day: b.getUTCDate(),
      dow: b.getUTCDay(),
      dowLabel: DOW_SHORT[b.getUTCDay()],
      isToday: i === 0,
      studied: count > 0,
      count,
    });
  }
  return track;
}

/**
 * Recent practice as sessions, newest first, at most `limit`.
 * Consecutive answers in one subject with less than `gapMs` between them
 * are one session; a change of subject or a longer pause starts another.
 * Rows that share one timestamp are one graded set (App writes every row of
 * a set with the set's completion time), so they stay one session even when
 * the set crosses subjects; such a session's subject is 'all'.
 *   { subject, startedAt, endedAt, total, correct }
 */
export function recentSessions(history, { limit = 4, gapMs = 45 * 60 * 1000 } = {}) {
  const rows = (Array.isArray(history) ? history : [])
    .map((row) => ({ t: rowTime(row?.date), subject: row?.subject || null, correct: row?.correct === true }))
    .filter((row) => row.t != null && row.subject)
    .sort((a, b) => a.t - b.t);
  const sessions = [];
  for (const row of rows) {
    const last = sessions[sessions.length - 1];
    const sameSet = last && row.t === last.endedAt;
    if (last && (sameSet || (last.subject === row.subject && row.t - last.endedAt <= gapMs))) {
      if (last.subject !== row.subject) last.subject = 'all';
      last.endedAt = row.t;
      last.total += 1;
      if (row.correct) last.correct += 1;
    } else {
      sessions.push({ subject: row.subject, startedAt: row.t, endedAt: row.t, total: 1, correct: row.correct ? 1 : 0 });
    }
  }
  return sessions.reverse().slice(0, Math.max(0, limit));
}

/** "วันนี้ 13:40", "เมื่อวาน 09:12", or the day for anything older. */
export function sessionWhen(ts, now = Date.now()) {
  const b = bangkokWall(ts);
  if (Number.isNaN(b.getTime())) return '';
  const time = `${String(b.getUTCHours()).padStart(2, '0')}:${String(b.getUTCMinutes()).padStart(2, '0')}`;
  const key = dayKey(ts);
  if (key === dayKey(now)) return `วันนี้ ${time}`;
  if (key === dayKey(now - DAY_MS)) return `เมื่อวาน ${time}`;
  return shortThaiDay(ts);
}

/** Topics read among these subjects, one per subject and topic, as the reading
 *  list counts them. Counting the stored keys instead added a topic twice once
 *  its old bare key was promoted to the subject/topic key (both stay), and kept
 *  counting a topic unticked everywhere, beside เริ่มแล้ว 0 จาก N วิชา. */
export function topicsRead(checklist, subjects) {
  let read = 0;
  for (const s of Array.isArray(subjects) ? subjects : []) {
    for (const t of s?.topics || []) if (t && !t.hidden && isTopicRead(checklist, s.id, t.id)) read += 1;
  }
  return read;
}

/** Of the subjects that have topics, how many have at least one read topic. */
export function subjectsStarted(checklist, subjects) {
  let started = 0;
  let total = 0;
  for (const s of Array.isArray(subjects) ? subjects : []) {
    const topics = (s?.topics || []).filter((t) => t && !t.hidden);
    if (topics.length === 0) continue;
    total += 1;
    if (topics.some((t) => isTopicRead(checklist, s.id, t.id))) started += 1;
  }
  return { started, total };
}

/** The next-class line: "กำลังเรียน <title>" while one is in session, else
 *  "<พรุ่งนี้ | วันX | ><start> น. <title>". `truncate` shortens the title
 *  for the surface that prints it. */
export function classRowLabel(nextClass, currentClass, truncate = (s) => s) {
  if (!nextClass) return '';
  const when = currentClass
    ? 'กำลังเรียน'
    : `${nextClass.dayOffset === 1 ? 'พรุ่งนี้ ' : nextClass.dayOffset > 1 ? `วัน${DOW_FULL[nextClass.dow] || ''} ` : ''}${nextClass.start} น.`;
  return `${when} ${truncate(String(nextClass.title || ''))}`.trim();
}
