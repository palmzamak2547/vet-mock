import { useEffect, useState } from 'react';
import { EXAM_SCHEDULE, fmtThaiDate, getUpcomingExams, shortCountdown } from '../data/schedule.js';
import { SUBJECTS } from '../data/curriculum.js';
import { QB } from '../data/questions.js';

export default function ScheduleView({ goHome, setSubject, setMode, setView, setPracticeMode }) {
  const [showPast, setShowPast] = useState(false);
  const [, setTick] = useState(0);
  const allExams = getUpcomingExams('y4');
  const hasImminent = allExams.some((e) => e.daysLeft <= 1 && e.daysLeft >= 0 && shortCountdown(e));
  useEffect(() => {
    if (!hasImminent) return;
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, [hasImminent]);
  const pastCount = allExams.filter((e) => e.daysLeft < 0).length;
  const exams = showPast ? allExams : allExams.filter((e) => e.daysLeft >= 0);

  const practiceSubject = (subjId) => {
    setSubject(subjId);
    setPracticeMode('all');
    setMode('quick');
    setView('config');
  };

  const hasQuestions = (subjId) => QB.some((q) => q.subject === subjId);

  return (
    <>
      <div className="vmx-hero">
        <h1>📅 ตาราง<em>สอบ Final</em></h1>
        <p>Vet 86 · Semester 2/2568 · อัพเดตล่าสุดจากข้อสอบเก่าและประกาศ</p>
      </div>

      <div className="vmx-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <span>ปี 4 · Final Exams ({exams.length})</span>
        {pastCount > 0 && (
          <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setShowPast(!showPast)}>
            {showPast ? `🙈 ซ่อนสอบที่ผ่านแล้ว (${pastCount})` : `👁 แสดงสอบที่ผ่านแล้ว (${pastCount})`}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 30 }}>
        {exams.map((exam) => {
          const isPast = exam.daysLeft < 0;
          const isToday = exam.daysLeft === 0;
          const isUrgent = exam.daysLeft > 0 && exam.daysLeft <= 7;
          return (
            <div key={exam.id} className="vmx-dash-card" style={{
              borderLeft: `4px solid ${exam.color}`,
              opacity: isPast ? 0.5 : 1,
              position: 'relative',
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Date block */}
                <div style={{
                  minWidth: 90,
                  textAlign: 'center',
                  padding: '12px 8px',
                  borderRadius: 12,
                  background: isUrgent ? 'var(--clr-rose-soft)' : 'var(--clr-surface-2)',
                  border: `1px solid ${isUrgent ? 'var(--clr-rose)' : 'var(--clr-border)'}`,
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: 'var(--clr-ink-soft)', textTransform: 'uppercase' }}>
                    {new Date(exam.date).toLocaleDateString('en', { month: 'short' })}
                  </div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: 'var(--clr-ink)' }}>
                    {new Date(exam.date).getDate()}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--clr-ink-soft)', marginTop: 4 }}>
                    {(() => {
                      if (isPast) return 'ผ่านแล้ว';
                      const cd = shortCountdown(exam);
                      if (cd) return cd.text;
                      if (isToday) return '🔥 วันนี้!';
                      return `อีก ${exam.daysLeft} วัน`;
                    })()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ margin: '0 0 8px', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18 }}>
                    {exam.icon} {exam.title}
                    {exam.weight_pct && <span style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontWeight: 400, marginLeft: 8 }}>· {exam.weight_pct}%</span>}
                  </h3>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--clr-ink-soft)', marginBottom: 10 }}>
                    📅 {fmtThaiDate(exam.date)} · ⏰ {exam.time} · 📍 {exam.location}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--clr-ink)', marginBottom: 8 }}>
                    <strong>เนื้อหา:</strong>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                      {exam.content.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  {exam.notes && (
                    <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', marginTop: 8 }}>
                      💡 {exam.notes}
                    </div>
                  )}

                  {!isPast && (
                    hasQuestions(exam.subject) ? (
                      <button className="vmx-btn vmx-btn-primary vmx-btn-sm" style={{ marginTop: 12 }}
                        onClick={() => practiceSubject(exam.subject)}>
                        📝 ฝึกข้อสอบวิชานี้ →
                      </button>
                    ) : (
                      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--clr-rose)', fontStyle: 'italic', padding: '8px 12px', background: 'var(--clr-surface-2)', borderRadius: 8, display: 'inline-block' }}>
                        🚧 ยังไม่มีข้อสอบในวิชานี้ — รอเพิ่ม
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.6 }}>
        💡 <strong>Tip:</strong> คลิก "ฝึกข้อสอบวิชานี้" เพื่อเริ่มทำข้อสอบวิชานั้นเลย<br/>
        📌 ข้อมูลตารางอาจเปลี่ยนแปลง — เช็คกับเพื่อนในห้องอีกครั้งก่อนสอบ<br/>
        🔄 ถ้าข้อมูลผิด/ล้าสมัย → ส่งไปที่ <a href="#" onClick={(e) => { e.preventDefault(); setView('feedback'); }} style={{ color: 'var(--clr-sage)', textDecoration: 'underline' }}>ฟอร์มแจ้ง</a>
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
