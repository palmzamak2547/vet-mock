import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { QB } from '../data/questions.js';

export default function YearSelectView({ goHome, selectedYear, setSelectedYear, setView }) {
  const y4Count = QB.filter((q) => q.year === 4).length;

  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>ชั้นปี</em></h1>
        <p>ปี 4 (Vet 86) เปิดเต็ม · ปีอื่นวางโครงรอเติมเนื้อหา ทักเข้ามาช่วยได้</p>
      </div>

      <div className="vmx-mode-grid">
        {YEARS.map((y) => {
          const subjectCount = (SUBJECTS_BY_YEAR[y.id] || []).length;
          const isLive = !y.scaffold;
          const accent = isLive ? 'var(--clr-sage)' : 'var(--clr-gold)';

          return (
            <button key={y.id}
              className="vmx-mode-card"
              onClick={() => {
                setSelectedYear(y.id);
                setView('home');
              }}
              style={{ borderColor: y.current ? accent : undefined }}>
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

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
