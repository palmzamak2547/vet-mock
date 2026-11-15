// ============================================================
// WeekTimetable — ตารางเรียนรายสัปดาห์ (จากตารางสอนของคณะ)
// ============================================================
// Answers the question a student actually asks: "วันนี้/พรุ่งนี้เรียนอะไร
// ที่ไหน". Shut, the block is that one day: today while a class is still to
// come or under way, else the next day that has one, with nothing to press.
// "ทั้งสัปดาห์" opens the five days in place, and there every row is a link
// into the material for its subject (notes or practice), which is the point
// of putting the timetable inside VetMock rather than leaving it as a PDF in
// a chat. The week is mounted only once it is asked for.
//
// Data: CLASS_TIMETABLE in src/data/schedule.js (transcribed from the
// official ตารางสอน). Times and rooms are shown exactly as published; a class
// is called by its course's own name, the one Home and the exam rows use,
// because the faculty's abbreviations are cut short ("VET EPIDEMI (LAB)").
// A room every class of a day shares is said once, beside the day, and the
// class under way says so under its own time.
//
// The timetable is for the term's class weeks only. In the midterm and final
// periods the faculty suspends classes, so the block gives way to a line
// saying so; once the last paper is over it describes a term that has ended,
// so the section is hidden. "Today" is Bangkok's day, whatever the device's
// zone. `now` and `defaultExpanded` are for tests; the app never passes them.
// ============================================================

import { useId, useState } from 'react';
import {
  CLASS_TIMETABLE, DOW_TH, bangkokClock, examTitle, getClassesForDay, getCurrentClass, getNextClass, termPhase,
} from '../data/schedule.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const byStart = (a, b) => a.start.localeCompare(b.start);
// The room a day's classes share, or null when they differ.
const sharedRoom = (rows) => (rows.length > 0 && rows.every((r) => r.room === rows[0].room) ? rows[0].room : null);

export default function WeekTimetable({ year = 5, onOpenSubject, hasContent, now = new Date(), defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  // The body rises in only after a tap changed it, never when the page arrives.
  const [toggled, setToggled] = useState(false);
  const bodyId = useId();

  const rows = CLASS_TIMETABLE[`y${year}`] || [];
  if (rows.length === 0) return null;

  const term = termPhase(now);
  if (term.phase === 'after') return null;

  if (term.phase !== 'classes') {
    return (
      <section aria-label="ตารางเรียนสัปดาห์นี้" className="vmx-sched-week">
        <p role="status" className="vmx-sched-suspended">
          <strong>ช่วงสอบ งดเรียนตามตาราง</strong>
          <span>{term.labelTh}</span>
        </p>
      </section>
    );
  }

  const todayDow = bangkokClock(now).dow;
  const current = getCurrentClass(year, now);
  // The day in question: getNextClass skips a day whose classes are over, the
  // weekend and an exam period, and looks seven days ahead at most.
  const next = getNextClass(year, now);
  const focusAt = next ? new Date(new Date(now).getTime() + next.dayOffset * DAY_MS) : null;
  const focusRows = focusAt ? getClassesForDay(year, focusAt) : [];
  const focusTag = next?.dayOffset === 0 ? 'วันนี้' : next?.dayOffset === 1 ? 'พรุ่งนี้' : null;

  const dayLine = (dow, tag, dayRows) => (
    <p className="vmx-sched-day">
      <strong>{DOW_TH[dow]}</strong>{tag && <span className="vmx-sched-tag">{tag}</span>}
      {sharedRoom(dayRows) && <span className="vmx-sched-room">{sharedRoom(dayRows)}</span>}
    </p>
  );

  const classRow = (c, dayRows, link) => {
    const isNow = !!current && c.dow === todayDow && current.code === c.code && current.start === c.start;
    const name = `${examTitle(c)}${c.kind === 'lab' ? ' (แล็บ)' : ''}`;
    const cells = (
      <>
        <span className="vmx-sched-time">{`${c.start}-${c.end}`}{isNow && <span className="vmx-sched-now">กำลังเรียน</span>}</span>
        <span className="vmx-sched-name">{name}</span>
        {!sharedRoom(dayRows) && <span className="vmx-sched-room">{c.room}</span>}
      </>
    );
    const key = `${c.dow}-${c.code}-${c.start}`;
    if (!link) return <li key={key} className="vmx-sched-class">{cells}</li>;
    const openable = !!onOpenSubject && (!hasContent || hasContent(c.subject));
    return (
      <li key={key}>
        {openable
          ? <button type="button" className="vmx-sched-class" onClick={() => onOpenSubject(c.subject)} title={`เปิดเนื้อหา ${name}`}>{cells}</button>
          : <div className="vmx-sched-class">{cells}</div>}
      </li>
    );
  };

  return (
    <section aria-label="ตารางเรียนสัปดาห์นี้" className="vmx-sched-week">
      <div className="vmx-sched-head">
        {expanded
          ? <p className="vmx-sched-label">ตารางเรียน</p>
          : next
            ? dayLine(next.dow, focusTag, focusRows)
            : <p className="vmx-sched-idle">ไม่มีเรียนใน 7 วันนี้</p>}
        <button
          type="button"
          className="vmx-sched-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => { setExpanded((open) => !open); setToggled(true); }}
        >
          ทั้งสัปดาห์
        </button>
      </div>

      <div id={bodyId} key={expanded ? 'week' : 'day'} className={`vmx-sched-week-body${toggled ? ' is-toggled' : ''}`}>
        {expanded ? (
          <div className="vmx-sched-days">
            {[1, 2, 3, 4, 5].map((dow) => {
              const dayRows = rows.filter((r) => r.dow === dow).sort(byStart);
              if (dayRows.length === 0) return null;
              return (
                <div key={dow} className="vmx-sched-daygroup">
                  {dayLine(dow, dow === todayDow ? 'วันนี้' : null, dayRows)}
                  <ul className="vmx-sched-classes">{dayRows.map((c) => classRow(c, dayRows, true))}</ul>
                </div>
              );
            })}
            <p className="vmx-sched-source">จากตารางสอนของคณะ</p>
          </div>
        ) : (
          focusRows.length > 0 && <ul className="vmx-sched-classes">{focusRows.map((c) => classRow(c, focusRows, false))}</ul>
        )}
      </div>
    </section>
  );
}
