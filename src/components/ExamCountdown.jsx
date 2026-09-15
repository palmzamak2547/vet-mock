// ============================================================
// ExamCountdown — the exam period, as a clock and a row of days
// ============================================================
// The old next-exam chip printed "6 วัน" beside a title. True, and not the
// thing a student a week out actually wants to know, which is the SHAPE of
// what is coming: nine papers, two a day, Monday to Friday, one of them
// three hours. So the number is big enough to read from across the room,
// under it a clock that actually counts — hours, minutes, seconds, live —
// and under that one cell per calendar day from today to the last paper:
// plain days as faint dots, exam days as a stack of pills, one per paper,
// in that paper's colour. Two pills on a Tuesday is the information.
//
// The clock is the part Palm asked for by name. The first version showed
// days only, on the theory that seconds are anxiety; that was narrowing his
// ask without asking. A countdown counts.
//
// Everything about WHEN comes from src/lib/exam-countdown.js and the
// published timetable. This file only draws, and owns the one-second tick
// so the rest of the home page does not re-render with it.
//
// States:
//   a week out       6 วัน, then 13 ชม. 42 นาที 07 วินาที, then the caption
//   under a day      the clock becomes the hero; the day number steps aside
//   during a paper   "กำลังสอบอยู่" and the clock counts to the END of it
//   inside the week  days to the NEXT paper, "สอบไปแล้ว 4 จาก 9 วิชา"
//
// The day number rolls up from zero ONCE per page load (same discipline as
// the wordmark settle) and every cell arrives a beat after the one before.
// Under prefers-reduced-motion nothing moves — except the clock, which is
// information, not decoration. The tick stops while the tab is hidden.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { fmtThaiDate, msUntilExam } from '../data/schedule.js';
import { examEndMs, splitCountdown } from '../lib/exam-countdown.js';

const DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const startTime = (exam) => (exam.time || '').split('-')[0].trim();
const two = (n) => String(n).padStart(2, '0');

let rolledThisLoad = false;

function useRollUp(target, enabled) {
  const [value, setValue] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) { setValue(target); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const dur = 560;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - (1 - p) * (1 - p) * (1 - p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);
  return value;
}

/** Wall-clock, once a second, paused while the tab is hidden. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let id = 0;
    const stop = () => { if (id) { window.clearInterval(id); id = 0; } };
    const start = () => { stop(); setNow(Date.now()); id = window.setInterval(() => setNow(Date.now()), 1000); };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return now;
}

export default function ExamCountdown({ window: w, subjects = [], onOpenSchedule }) {
  // Read once, never again: returning from a question must not re-roll.
  const animate = useRef(
    !rolledThisLoad
    && typeof window !== 'undefined'
    && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  rolledThisLoad = true;

  const nowMs = useNow();
  const next = w?.next;
  const sitting = w?.countdown?.kind === 'now';
  // Counting to the start of the next paper, or, once it has begun, to the
  // moment it ends — the same instant getNextExam rolls over.
  const targetMs = !next ? 0 : sitting ? examEndMs(next) : nowMs + msUntilExam(next, new Date(nowMs));
  const clock = splitCountdown(targetMs - nowMs);
  const shown = useRollUp(clock.days, animate.current);
  if (!w) return null;

  const nameOf = (exam) => subjects.find((s) => s.id === exam.subject)?.name
    || String(exam.title || '').split(' — ')[0];
  const nextWhen = `${fmtThaiDate(next.date).split(' ')[0]} ${startTime(next)}`;
  const hoursOnly = clock.days === 0;

  const caption = sitting
    ? `${nameOf(next)}${next.location ? ` ห้อง ${next.location}` : ''} เหลือเวลาสอบอีก`
    : w.inWindow
      ? `สอบไปแล้ว ${w.done} จาก ${w.papers.length} วิชา ต่อไป ${nameOf(next)} ${nextWhen}`
      : `${w.papers.length} วิชา เริ่มที่ ${nameOf(next)} ${nextWhen}`;

  const ariaLabel = sitting
    ? `${w.label} กำลังสอบ ${nameOf(next)}`
    : `${w.label} อีก ${clock.days} วัน ${clock.hours} ชั่วโมง ${w.range} ${caption}`;

  return (
    <section
      className={`vmx-countdown${animate.current ? ' vmx-countdown-enter' : ''}${hoursOnly ? ' is-hours' : ''}${sitting ? ' is-sitting' : ''}`}
      aria-label={ariaLabel}
    >
      <div className="vmx-countdown-lead">
        <span className="vmx-countdown-eyebrow">
          {sitting ? 'กำลังสอบอยู่' : w.label} <span>{w.range}</span>
        </span>
        {!hoursOnly && (
          <span className="vmx-countdown-num" aria-hidden="true">
            {shown}<span className="vmx-countdown-unit">วัน</span>
          </span>
        )}
        <span className="vmx-countdown-clock" aria-hidden="true">
          <b>{two(clock.hours)}</b><i>ชม.</i>
          <b>{two(clock.minutes)}</b><i>นาที</i>
          <b>{two(clock.seconds)}</b><i>วินาที</i>
        </span>
        <span className="vmx-countdown-caption" aria-hidden="true">{caption}</span>
      </div>

      {w.cells.length > 0 && (
        <button
          type="button"
          className="vmx-countdown-strip"
          onClick={() => onOpenSchedule?.()}
          aria-label="ดูตารางสอบ"
        >
          {w.cells.map((c, i) => (
            <span
              key={c.date}
              className={`vmx-countdown-day${c.exams.length ? ' is-exam' : ''}${c.today ? ' is-today' : ''}${c.done ? ' is-done' : ''}${c.weekend ? ' is-weekend' : ''}`}
              style={{ '--i': i }}
              title={c.exams.length
                ? `${fmtThaiDate(c.date)}: ${c.exams.map((e) => `${nameOf(e)} ${e.time || ''}`.trim()).join(', ')}`
                : fmtThaiDate(c.date)}
            >
              <span className="vmx-countdown-dow">{DOW[c.dow]}</span>
              <span className="vmx-countdown-daynum">{c.day}</span>
              {c.exams.length
                ? c.exams.map((e) => (
                  <span key={e.id} className="vmx-countdown-pill" style={{ '--exam-color': e.color }}>
                    {c.done ? '✓' : e.icon}
                  </span>
                ))
                : <span className="vmx-countdown-dot" />}
            </span>
          ))}
        </button>
      )}
    </section>
  );
}
