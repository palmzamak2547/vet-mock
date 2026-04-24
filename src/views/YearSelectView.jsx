import { YEARS } from '../data/curriculum.js';

export default function YearSelectView({ goHome, selectedYear, setSelectedYear, setView }) {
  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>ชั้นปี</em></h1>
        <p>VetMock รองรับทุกชั้นปี — ตอนนี้มีเฉพาะปี 4 (Vet 86) ก่อน<br/>
           ถ้าอยากช่วยเพิ่มข้อสอบปีอื่น ทักมาได้เลย</p>
      </div>

      <div className="vmx-mode-grid">
        {YEARS.map((y) => (
          <button key={y.id}
            className="vmx-mode-card"
            onClick={() => {
              if (!y.available) return;
              setSelectedYear(y.id);
              setView('home');
            }}
            style={{
              opacity: y.available ? 1 : 0.5,
              cursor: y.available ? 'pointer' : 'not-allowed',
              borderColor: y.current ? 'var(--clr-sage)' : undefined,
            }}
            disabled={!y.available}>
            <div className="icon">🎓</div>
            <div className="title">{y.label}</div>
            <div className="sub">{y.desc}</div>
            {y.current && <div className="badge" style={{ background: 'var(--clr-sage)' }}>LIVE</div>}
            {!y.available && <div className="badge" style={{ background: 'var(--clr-ink-soft)' }}>SOON</div>}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
        💡 <strong>Roadmap:</strong><br/>
        ✅ <strong>ปี 4</strong> (Vet 86) — เปิดใช้งานแล้ว · 148 ข้อ<br/>
        🔜 <strong>ปี 5</strong> — Clinical rotation · จะเปิดเมื่อมีโพยพอ<br/>
        🔜 <strong>ปี 3, 2, 1</strong> — รอรุ่นน้องมาช่วยรวบรวม<br/>
        🙏 อยากช่วยเพิ่ม? ส่ง feedback บอกได้เลย
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
