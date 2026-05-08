import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { QB } from '../data/questions.js';

export default function YearSelectView({ goHome, selectedYear, setSelectedYear, setView }) {
  const y4Count = QB.filter((q) => q.year === 4).length;

  // Count subjects per year — used to show "X subjects scaffolded" on
  // PREVIEW cards so users see the roadmap progress, not a blank tile.
  const subjectCounts = Object.fromEntries(
    Object.entries(SUBJECTS_BY_YEAR).map(([year, subs]) => [year, subs.length])
  );

  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>ชั้นปี</em></h1>
        <p>VetMock ครบ 6 ปีแล้ว — ปี 4 (Vet 86) เปิดเต็มรูปแบบ ส่วนปีอื่นวางโครงรอเติมเนื้อหา<br/>
           อยากช่วยรวบรวมข้อสอบ/notes ปีไหน → ทักมาได้เลย</p>
      </div>

      <div className="vmx-mode-grid">
        {YEARS.map((y) => {
          const isLive = y.available && !y.scaffold;
          const isPreview = y.available && y.scaffold;
          const subjectCount = subjectCounts[y.id] || 0;

          // Badge state machine
          let badgeText = null;
          let badgeColor = null;
          if (y.current) { badgeText = 'LIVE'; badgeColor = 'var(--clr-sage)'; }
          else if (isLive) { badgeText = 'READY'; badgeColor = 'var(--clr-ocean)'; }
          else if (isPreview) { badgeText = 'PREVIEW'; badgeColor = 'var(--clr-gold)'; }
          else { badgeText = 'SOON'; badgeColor = 'var(--clr-ink-soft)'; }

          return (
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
                borderColor: y.current ? 'var(--clr-sage)' : (isPreview ? 'var(--clr-gold)' : undefined),
              }}
              disabled={!y.available}>
              <div className="icon">🎓</div>
              <div className="title">{y.label}</div>
              <div className="sub">{y.desc}</div>
              {subjectCount > 0 && (
                <div style={{
                  marginTop: 6,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--clr-ink-soft)',
                  letterSpacing: '0.04em',
                }}>
                  {subjectCount} วิชา{isPreview ? ' · รอเติมเนื้อหา' : ''}
                </div>
              )}
              {badgeText && (
                <div className="badge" style={{ background: badgeColor }}>{badgeText}</div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
        💡 <strong>Roadmap status:</strong><br/>
        ✅ <strong>ปี 4</strong> (Vet 86) — เปิดเต็ม · {y4Count} ข้อ · 8 วิชา<br/>
        🚧 <strong>ปี 5</strong> — Clinical Rotation · 6 วิชาวางโครง (Equine · Aquatic · Swine · Avian · Food Safety · Small Animal Adv)<br/>
        🚧 <strong>ปี 3</strong> — Paraclinic · 7 วิชา (Microbio · Parasit · Path · Pharm · VPH · Clin Path · Husbandry II)<br/>
        🚧 <strong>ปี 2</strong> — Body Systems · 7 วิชา (Anat II · Physio I/II · Biochem · Husbandry · Nutrition · Genetics)<br/>
        🚧 <strong>ปี 1</strong> — Foundation · 6 วิชา (Intro Vet · Bio · Chem · Physics · Anat I · Histo)<br/>
        🚧 <strong>ปี 6</strong> — Internship · 7 บล็อกหมุนเวียน + Senior Project<br/>
        <br/>
        🙏 <strong>อยากช่วย contribute?</strong> ส่ง slides/notes/exam เก่าผ่าน feedback หรือ DM ได้ทุกปี
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}
