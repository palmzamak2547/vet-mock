// GET /api/calendar?year=5 — the exam timetable as an iCalendar feed that
// Google Calendar, Apple Calendar and Outlook subscribe to by URL. Public
// data only (src/data/schedule.js); the CDN keeps it for an hour.
// GET /api/calendar?study=20:00 — one daily study reminder at that Bangkok
// time, as a file to add (lib/study-reminder.js); same caching.
import { examCalendar } from '../src/lib/exam-calendar.js';
import { reminderIcs, parseTime } from '../src/lib/study-reminder.js';

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }
  if (req.query.study !== undefined) {
    const time = parseTime(String(req.query.study));
    const ics = time ? reminderIcs(String(req.query.study)) : null;
    if (!ics) return res.status(400).json({ error: 'study_time_is_hh_mm' });
    const hhmm = `${String(time.hour).padStart(2, '0')}${String(time.minute).padStart(2, '0')}`;
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="vetmock-study-${hhmm}.ics"`);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(ics);
  }
  const year = Number.parseInt(String(req.query.year || ''), 10);
  const body = Number.isInteger(year) ? examCalendar(year) : null;
  if (!body) return res.status(404).json({ error: 'no_timetable_for_year' });
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="vetmock-exams-year-${year}.ics"`);
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(body);
}
