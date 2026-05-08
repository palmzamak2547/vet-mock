import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { QB } from '../data/questions.js';

export default function YearSelectView({ goHome, selectedYear, setSelectedYear, setView, firstTime = false }) {
  const y4Count = QB.filter((q) => q.year === 4).length;

  return (
    <>
      <div className="vmx-hero">
        {firstTime ? (
          <>
            <h1>ยินดีต้อนรับ — เลือก <em>ชั้นปี</em></h1>
            <p>VetMock มีโครงสร้างครบทุกปี — เริ่มต้นเลือกปีของคุณก่อน<br/>
               ปี 4 (Vet 86) เปิดเต็ม · ปีอื่นวางโครงรอเติมเนื้อหา</p>
          </>
        ) : (
          <>
            <h1>เลือก <em>ชั้นปี</em></h1>
            <p>ปี 4 (Vet 86) เปิดเต็ม · ปีอื่นวางโครงรอเติมเนื้อหา ทักเข้ามาช่วยได้</p>
          </>
        )}
      </div>

      <div className="vmx-mode-grid">
        {YEARS.map((y) => {
          const subjectCount = (SUBJECTS_BY_YEAR[y.id] || []).length;
          const isLive = !y.scaffold;
          const accent = isLive ? 'var(--clr-sage)' : 'var(--clr-gold)';
          const isPicked = selectedYear === y.id && !firstTime;

          return (
            <button key={y.id}
              className="vmx-mode-card"
              onClick={() => {
                setSelectedYear(y.id);
                setView('home');
              }}
              style={{ borderColor: isPicked || y.current ? accent : undefined }}>
              <div className="icon">🎓</div>
              <div className="title">{y.label}</div>
              <div className="sub">{y.desc}</div>
              <div style={{
                marginTop: 8,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--clr-ink-soft)',
                letterSpacing: '0.04em',
              }}>
                {isLive ? `${y4Count} ข้อ · ${subjectCount} วิชา` : `${subjectCount} วิชา · รอเติม`}
              </div>
              <div className="badge" style={{ background: accent }}>
                {isLive ? 'LIVE' : 'PREVIEW'}
              </div>
            </button>
          );
        })}
      </div>

      {!firstTime && (
        <div className="vmx-btn-row" style={{ marginTop: 24 }}>
          <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
        </div>
      )}

      {firstTime && (
        <div style={{ marginTop: 24, padding: 14, borderRadius: 10, background: 'var(--clr-surface-2)', fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center', lineHeight: 1.6 }}>
          💡 เลือกแล้วระบบจะจำให้ — ครั้งต่อไปเข้าตรงไปที่ dashboard เลย<br/>
          เปลี่ยนปีได้ตลอดผ่านปุ่ม <strong>🎓 เปลี่ยนปี</strong> ในหน้า dashboard
        </div>
      )}
    </>
  );
}
