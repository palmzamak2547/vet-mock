// GET /api/calendar?year=5 — the exam timetable as an iCalendar feed that
// Google Calendar, Apple Calendar and Outlook subscribe to by URL. Public
// data only (src/data/schedule.js); the CDN keeps it for an hour.
import { examCalendar } from '../src/lib/exam-calendar.js';

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }
  const year = Number.parseInt(String(req.query.year || ''), 10);
  const body = Number.isInteger(year) ? examCalendar(year) : null;
  if (!body) return res.status(404).json({ error: 'no_timetable_for_year' });
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="vetmock-exams-year-${year}.ics"`);
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(body);
}
