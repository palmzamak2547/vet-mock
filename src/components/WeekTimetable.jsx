// ============================================================
// WeekTimetable — ตารางเรียนรายสัปดาห์ (จากตารางสอนของคณะ)
// ============================================================
// Answers the question a student actually asks: "วันนี้/พรุ่งนี้เรียนอะไร
// ที่ไหน" — so today's column is highlighted and the class happening right
// now is marked. Every row is a link into the material for that subject
// (notes or practice), which is the point of putting the timetable inside
// VetMock rather than leaving it as a PDF in a chat.
//
// Data: CLASS_TIMETABLE in src/data/schedule.js (transcribed from the
// official ตารางสอน). Rooms/times are shown exactly as published.
// ============================================================

import { CLASS_TIMETABLE, DOW_TH, getCurrentClass } from '../data/schedule.js';

export default function WeekTimetable({ year = 5, onOpenSubject, hasContent }) {
  const rows = CLASS_TIMETABLE[`y${year}`] || [];
  if (rows.length === 0) return null;

  const now = new Date();
  const todayDow = now.getDay();
  const current = getCurrentClass(year, now);
  const days = [1, 2, 3, 4, 5];

  return (
    <section aria-labelledby="vmx-week-title" style={{ marginBottom: 28 }}>
      <div className="vmx-section-label" style={{ marginBottom: 12 }}>
        <span id="vmx-week-title">ตารางเรียนสัปดาห์นี้</span>
        <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', fontWeight: 400 }}>
          จากตารางสอนของคณะ
        </span>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {days.map((dow) => {
          const dayRows = rows.filter((r) => r.dow === dow).sort((a, b) => a.start.localeCompare(b.start));
          if (dayRows.length === 0) return null;
          const isToday = dow === todayDow;
          return (
            <div
              key={dow}
              style={{
                border: `1px solid ${isToday ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                background: isToday ? 'var(--clr-surface)' : 'transparent',
                borderRadius: 'var(--r-md, 12px)',
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                <strong style={{ fontSize: 13.5, color: isToday ? 'var(--clr-sage-text)' : 'var(--clr-ink)' }}>
                  {DOW_TH[dow]}
                </strong>
                {isToday && (
                  <span style={{ fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage-text)', border: '1px solid var(--clr-sage)', borderRadius: 999, padding: '1px 7px' }}>
                    วันนี้
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginLeft: 'auto' }}>
                  {dayRows.length} คาบ
                </span>
              </div>

              <div style={{ display: 'grid', gap: 4 }}>
                {dayRows.map((c) => {
                  const isNow = current && current.code === c.code && current.start === c.start;
                  const openable = !!onOpenSubject && (!hasContent || hasContent(c.subject));
                  const Row = openable ? 'button' : 'div';
                  return (
                    <Row
                      key={`${c.code}-${c.start}`}
                      {...(openable
                        ? {
                          type: 'button',
                          onClick: () => onOpenSubject(c.subject),
                          title: `เปิดเนื้อหา ${c.title}`,
                        }
                        : {})}
                      style={{
                        all: openable ? 'unset' : undefined,
                        boxSizing: 'border-box',
                        cursor: openable ? 'pointer' : 'default',
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        gap: 10,
                        alignItems: 'center',
                        width: '100%',
                        minHeight: 44,
                        padding: '6px 8px',
                        borderRadius: 8,
                        background: isNow ? 'var(--clr-surface-2)' : 'transparent',
                      }}
                    >
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap' }}>
                        {c.start}-{c.end}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: openable ? 'var(--clr-ocean)' : 'var(--clr-ink)', lineHeight: 1.35 }}>
                          {c.title}
                          {c.kind === 'lab' && (
                            <span style={{ fontSize: 10.5, marginLeft: 6, color: 'var(--clr-ink-soft)', fontWeight: 400 }}>LAB</span>
                          )}
                        </span>
                        <span style={{ display: 'block', fontSize: 11.5, color: 'var(--clr-ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
                          {c.code}, {c.room}
                        </span>
                      </span>
                      {isNow && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--clr-rose-text)', whiteSpace: 'nowrap' }}>
                          กำลังเรียน
                        </span>
                      )}
                    </Row>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
