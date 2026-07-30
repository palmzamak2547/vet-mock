// ============================================================
// AcademicCalendar — ปฏิทินลงทะเบียน/ชำระเงิน + ทะเบียนกลุ่มรายวิชา
// ============================================================
// The registrar publishes these as posters that get lost in a chat. They
// are pure deadlines, so the useful form is "what is open right now, and
// how long do I have" — active windows first, with the days remaining, and
// the one-line action (which CUNEX status to pick, which group code to
// type). Past milestones are collapsed away.
//
// Data: ACADEMIC_MILESTONES + COURSE_GROUPS in src/data/schedule.js.
// ============================================================

import { useState } from 'react';
import {
  ACADEMIC_MILESTONES, COURSE_GROUPS, SEMESTER,
  fmtThaiRange, fmtThaiDate, getActiveMilestones, getUpcomingEvents,
} from '../data/schedule.js';

const KIND_LABEL = {
  registration: 'ลงทะเบียน',
  payment: 'ชำระเงิน',
  checkpoint: 'ตรวจรายชื่อ',
  deadline: 'เดดไลน์',
};

function MilestoneRow({ m }) {
  const urgent = m.active && (m.kind === 'payment' || m.kind === 'deadline');
  return (
    <div
      style={{
        border: `1px solid ${m.active ? (urgent ? 'var(--clr-rose)' : 'var(--clr-sage)') : 'var(--clr-border)'}`,
        background: m.active ? 'var(--clr-surface)' : 'transparent',
        borderRadius: 'var(--r-md, 12px)',
        padding: '11px 13px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-ink-soft)' }}>
          {KIND_LABEL[m.kind] || m.kind}
        </span>
        <strong style={{ fontSize: 13.5, color: 'var(--clr-ink)', flex: '1 1 auto', minWidth: 0 }}>
          {m.titleTh}
        </strong>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap' }}>
          {fmtThaiRange(m.start, m.end)}
        </span>
      </div>

      <div style={{ marginTop: 5, fontSize: 12.5, color: m.active && urgent ? 'var(--clr-rose-text)' : 'var(--clr-sage-text)', fontWeight: 600 }}>
        {m.active
          ? (m.daysLeftToEnd === 0 ? 'วันสุดท้ายวันนี้' : `เปิดอยู่ เหลืออีก ${m.daysLeftToEnd} วัน`)
          : `จะเริ่มในอีก ${m.daysLeft} วัน`}
        {m.endTimeTh ? ` · ${m.endTimeTh}` : ''}
      </div>

      {m.noteTh && (
        <div style={{ marginTop: 5, fontSize: 12, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>{m.noteTh}</div>
      )}
      {m.warnTh && (
        <div style={{ marginTop: 5, fontSize: 12, color: 'var(--clr-rose-text)', lineHeight: 1.6 }}>⚠️ {m.warnTh}</div>
      )}
    </div>
  );
}

/** งานที่ประกาศผ่านสโมสร/ฝ่ายนิสิต — มีวัน เวลา ห้อง และลิงก์ข้อมูลจริง */
function EventRow({ e }) {
  const soon = e.daysLeft <= 7;
  return (
    <div
      style={{
        border: `1px solid ${soon ? 'var(--clr-gold)' : 'var(--clr-border)'}`,
        background: soon ? 'var(--clr-surface)' : 'transparent',
        borderRadius: 'var(--r-md, 12px)',
        padding: '11px 13px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--clr-ink-soft)' }}>
          กิจกรรม
        </span>
        <strong style={{ fontSize: 13.5, color: 'var(--clr-ink)', flex: '1 1 auto', minWidth: 0 }}>{e.titleTh}</strong>
      </div>
      <div style={{ marginTop: 5, fontSize: 12.5, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)' }}>
        {fmtThaiDate(e.date)} · {e.start}-{e.end} น. · {e.location}
      </div>
      <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 600, color: soon ? 'var(--clr-gold-text)' : 'var(--clr-ink-soft)' }}>
        {e.daysLeft === 0 ? 'วันนี้' : e.daysLeft === 1 ? 'พรุ่งนี้' : `อีก ${e.daysLeft} วัน`}
        {e.noteTh ? ` · ${e.noteTh}` : ''}
      </div>
      {Array.isArray(e.links) && e.links.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {e.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, padding: '6px 11px', borderRadius: 999, background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)', color: 'var(--clr-ink)', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center', boxSizing: 'border-box' }}
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AcademicCalendar({ year = 5 }) {
  const [showAll, setShowAll] = useState(false);
  const active = getActiveMilestones(14);
  const events = getUpcomingEvents(year, 60);
  const group = COURSE_GROUPS[`y${year}`];
  const list = showAll ? ACADEMIC_MILESTONES.map((m) => ({ ...m, active: false, daysLeft: null })) : active;

  return (
    <section aria-labelledby="vmx-cal-title" style={{ marginBottom: 28 }}>
      {events.length > 0 && (
        <>
          <div className="vmx-section-label" style={{ marginBottom: 12 }}>
            <span>กิจกรรมที่กำลังจะถึง</span>
            <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 400 }}>ประกาศจากคณะ/สโมสร</span>
          </div>
          <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
            {events.map((e) => <EventRow key={e.id} e={e} />)}
          </div>
        </>
      )}

      <div className="vmx-section-label" style={{ marginBottom: 12 }}>
        <span id="vmx-cal-title">ปฏิทินลงทะเบียนและชำระเงิน</span>
        <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 400 }}>{SEMESTER.labelTh}</span>
      </div>

      {active.length === 0 && !showAll && (
        <div className="vmx-empty" style={{ fontSize: 13 }}>
          ไม่มีกำหนดการลงทะเบียนในช่วง 14 วันนี้
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {list.map((m) => (
          <MilestoneRow key={m.id} m={showAll ? { ...m, active: false } : m} />
        ))}
      </div>

      <button
        type="button"
        className="vmx-link-btn"
        onClick={() => setShowAll((v) => !v)}
        style={{ marginTop: 8, fontSize: 12.5, color: 'var(--clr-ink-soft)' }}
      >
        {showAll ? 'แสดงเฉพาะช่วงที่เกี่ยวกับตอนนี้' : `ดูกำหนดการทั้งหมด (${ACADEMIC_MILESTONES.length} รายการ)`}
      </button>

      {group && (
        <div style={{ marginTop: 14, padding: '13px 15px', borderRadius: 'var(--r-md, 12px)', background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--clr-ink)', marginBottom: 6 }}>
            ลงทะเบียนทั้งชุดด้วยรหัสกลุ่ม{' '}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage-text)' }}>{group.groupCode}</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--clr-ink-soft)', lineHeight: 1.65 }}>
            {group.howTo}
            <br />
            รวม {group.courseCount} รายวิชา {group.credits} หน่วยกิต (ตอนเรียน {group.section})
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--clr-rose-text)', lineHeight: 1.6 }}>⚠️ {group.warning}</div>
        </div>
      )}
    </section>
  );
}
