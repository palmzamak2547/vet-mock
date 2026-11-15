// ============================================================
// AcademicCalendar — ปฏิทินลงทะเบียน/ชำระเงิน + ทะเบียนกลุ่มรายวิชา
// ============================================================
// The registrar publishes these as posters that get lost in a chat. They
// are pure deadlines, so the useful form is "what is open right now, and
// how long do I have" — active windows first, with the days remaining, and
// the one-line action (which CUNEX status to pick, which group code to
// type). Past milestones are collapsed away.
//
// The schedule page keeps the whole calendar behind one row
// (ScheduleView.jsx: the row says the window that closes first, and this
// component is mounted when it is opened), so it carries no title of its own.
// A window reads as urgent only when that changes what a student does today:
// a one-day deadline, and a payment window in its last PAYMENT_NOTICE_DAYS,
// the rule Home's chip follows (the term's payment window is open for months).
//
// Data: ACADEMIC_MILESTONES + COURSE_GROUPS in src/data/schedule.js.
// `now` is for tests; the app never passes it.
// ============================================================

import { useState } from 'react';
import {
  ACADEMIC_MILESTONES, COURSE_GROUPS, PAYMENT_NOTICE_DAYS,
  describeMilestone, fmtThaiRange, fmtThaiDate, getActiveMilestones, getUpcomingEvents, semesterLabelTh,
} from '../data/schedule.js';

function MilestoneRow({ m }) {
  const urgent = m.active && (m.kind === 'deadline' || (m.kind === 'payment' && m.daysLeftToEnd <= PAYMENT_NOTICE_DAYS));
  // Three states, not two: a window can be open, still ahead, or already
  // closed. The "ดูกำหนดการทั้งหมด" list covers the whole semester, so
  // without the closed case a past window either printed
  // "จะเริ่มในอีก null วัน" or claimed it had not started yet.
  const tone = urgent ? ' is-urgent' : m.active ? ' is-open' : m.past ? '' : ' is-ahead';
  return (
    <li className={`vmx-cal-row${tone}`}>
      <div className="vmx-cal-row-head">
        <strong className="vmx-cal-title">{m.titleTh}</strong>
        <span className="vmx-cal-dates">{fmtThaiRange(m.start, m.end)}</span>
      </div>
      <p className="vmx-cal-status">
        {m.active
          ? (m.daysLeftToEnd === 0 ? 'วันสุดท้ายวันนี้' : `เปิดอยู่ เหลืออีก ${m.daysLeftToEnd} วัน`)
          : m.past
            ? 'ปิดแล้ว'
            : (m.daysLeft === 0 ? 'เริ่มวันนี้' : `จะเริ่มในอีก ${m.daysLeft} วัน`)}
        {m.endTimeTh && !m.past ? `, ${m.endTimeTh}` : ''}
      </p>
      {m.noteTh && <p className="vmx-cal-note">{m.noteTh}</p>}
      {m.warnTh && <p className="vmx-cal-warn">{m.warnTh}</p>}
    </li>
  );
}

/** งานที่ประกาศผ่านสโมสร/ฝ่ายนิสิต — มีวัน เวลา ห้อง และลิงก์ข้อมูลจริง */
function EventRow({ e }) {
  return (
    <li className={`vmx-cal-row${e.daysLeft <= 7 ? ' is-soon' : ''}`}>
      <div className="vmx-cal-row-head">
        <strong className="vmx-cal-title">{e.titleTh}</strong>
      </div>
      <p className="vmx-cal-dates">{fmtThaiDate(e.date)}, {e.start}-{e.end} น., {e.location}</p>
      <p className="vmx-cal-status">
        {e.daysLeft === 0 ? 'วันนี้' : e.daysLeft === 1 ? 'พรุ่งนี้' : `อีก ${e.daysLeft} วัน`}
        {e.noteTh ? `, ${e.noteTh}` : ''}
      </p>
      {Array.isArray(e.links) && e.links.length > 0 && (
        <div className="vmx-cal-links">
          {e.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="vmx-cal-link">{l.label} ↗</a>
          ))}
        </div>
      )}
    </li>
  );
}

export default function AcademicCalendar({ year = 5, now = new Date() }) {
  const [showAll, setShowAll] = useState(false);
  const active = getActiveMilestones(14, now);
  const events = getUpcomingEvents(year, 60, now);
  const group = COURSE_GROUPS[`y${year}`];
  // The box sits under the next term's registration rows, so it names the
  // term its code registers, from the group's own data.
  const groupTerm = group ? semesterLabelTh(group.semester) : '';
  // The full list must carry real offsets too — the row renders "อีก N วัน"
  // from them, so blanking them printed the literal string "null".
  // NB: pass through an arrow — `.map(describeMilestone)` would hand the array
  // index to the `now` parameter, dating every row from 1970.
  const list = showAll ? ACADEMIC_MILESTONES.map((m) => describeMilestone(m, now)) : active;

  return (
    <div className="vmx-cal">
      {events.length > 0 && (
        <div>
          <p className="vmx-cal-label">กิจกรรมที่กำลังจะถึง</p>
          <ul className="vmx-cal-list">
            {events.map((e) => <EventRow key={e.id} e={e} />)}
          </ul>
        </div>
      )}

      <div>
        {events.length > 0 && <p className="vmx-cal-label">ลงทะเบียนและชำระเงิน</p>}
        {list.length === 0 && <p className="vmx-cal-none">ไม่มีกำหนดการลงทะเบียนในช่วง 14 วันนี้</p>}
        {/* describeMilestone already decided active/past for both lists —
            forcing active:false here is what made an OPEN window read as
            "not started yet" in the full list. */}
        <ul className="vmx-cal-list">
          {list.map((m) => <MilestoneRow key={m.id} m={m} />)}
        </ul>
        <button type="button" className="vmx-link-btn vmx-cal-all" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'แสดงเฉพาะช่วงที่เกี่ยวกับตอนนี้' : `ดูกำหนดการทั้งหมด (${ACADEMIC_MILESTONES.length} รายการ)`}
        </button>
      </div>

      {group && (
        <div className="vmx-cal-group">
          <p className="vmx-cal-group-title">
            {groupTerm ? `${groupTerm}: ` : ''}ลงทะเบียนทั้งชุดด้วยรหัสกลุ่ม{' '}
            <span className="vmx-cal-group-code">{group.groupCode}</span>
          </p>
          <p className="vmx-cal-note">
            {group.howTo}
            <br />
            รวม {group.courseCount} รายวิชา {group.credits} หน่วยกิต (ตอนเรียน {group.section})
          </p>
          <p className="vmx-cal-warn">{group.warning}</p>
        </div>
      )}
    </div>
  );
}
