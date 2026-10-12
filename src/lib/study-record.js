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
export const DOW_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
export const DOW_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** Local calendar day as YYYY-MM-DD, in the browser's own zone (the app is
 *  read in Bangkok and the fixtures pin Asia/Bangkok). */
export const dayKey = (value) => new Date(value).toLocaleDateString('en-CA');

/** A history row's time as a number, or null when the row carries none. */
export function rowTime(value) {
  if (value == null || value === '') return null;
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}

/** "จันทร์ 12 ต.ค." for a date. */
export function shortThaiDay(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${DOW_FULL[d.getDay()]} ${d.getDate()} ${TH_MONTHS[d.getMonth()]}`;
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
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const track = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dayKey(d);
    const count = counts.get(key) || 0;
    track.push({
      date: key,
      day: d.getDate(),
      dow: d.getDay(),
      dowLabel: DOW_SHORT[d.getDay()],
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
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const key = dayKey(ts);
  if (key === dayKey(now)) return `วันนี้ ${time}`;
  if (key === dayKey(now - DAY_MS)) return `เมื่อวาน ${time}`;
  return shortThaiDay(ts);
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
