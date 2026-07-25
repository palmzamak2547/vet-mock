import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import { QB } from '../data/questions.js';

// PhaseSelectView — second step of the year picker.
// After user picks a year, they pick a 4-quadrant exam phase:
//   เทอม 1 กลางภาค, เทอม 1 ปลายภาค, เทอม 2 กลางภาค, เทอม 2 ปลายภาค
//
// Each card shows # subjects tagged with that semester + LIVE state.
// Auto-suggests the most likely current phase via month heuristic
// (Aug-Oct = 1-mid, Oct-Dec = 1-final, Jan-Mar = 2-mid, Mar-May = 2-final).
// Y6 is block-based (no fixed semester) — bypasses this view in App routing.

const PHASES = [
  { id: '1-mid',   semester: 1, label: 'เทอม 1 กลางภาค',   sub: 'Sem 1, Midterm',   icon: '📚', months: [8, 9, 10] },
  { id: '1-final', semester: 1, label: 'เทอม 1 ปลายภาค',   sub: 'Sem 1, Final',     icon: '🎯', months: [11, 12] },
  { id: '2-mid',   semester: 2, label: 'เทอม 2 กลางภาค',   sub: 'Sem 2, Midterm',   icon: '📖', months: [2, 3] },
  { id: '2-final', semester: 2, label: 'เทอม 2 ปลายภาค',   sub: 'Sem 2, Final',     icon: '🏁', months: [4, 5] },
];

export function detectCurrentPhase() {
  const m = new Date().getMonth() + 1; // 1-12
  const found = PHASES.find((p) => p.months.includes(m));
  if (found) return found.id;
  // Between phases (Jun-Jul = post sem 2 final; default to most recent)
  return '2-final';
}

export default function PhaseSelectView({ goHome, selectedYear, selectedPhase, setSelectedPhase, setView }) {
  const yearMeta = YEARS.find((y) => y.id === selectedYear);
  const subjects = SUBJECTS_BY_YEAR[selectedYear] || [];
  const currentPhase = detectCurrentPhase();

  return (
    <>
      <div className="vmx-hero">
        <h1>เลือก <em>ช่วงสอบ</em></h1>
        <p>{yearMeta?.label || `ปี ${selectedYear}`}, {yearMeta?.desc || ''} — เลือกช่วงที่จะดูเนื้อหา</p>
      </div>

      <div className="vmx-mode-grid">
        {PHASES.map((p) => {
          // semester 0 = cross-semester (e.g. VCA) — count in every phase
          const subjectsInPhase = subjects.filter((s) => s.semester === p.semester || s.semester === 0);
          const liveCount = subjectsInPhase.filter((s) => !s.scaffold).length;
          const isCurrent = p.id === currentPhase;
          const isPicked = p.id === selectedPhase;
          const accent = liveCount > 0 ? 'var(--clr-sage)' : 'var(--clr-gold)';

          return (
            <button
              key={p.id}
              className="vmx-mode-card"
              onClick={() => {
                setSelectedPhase(p.id);
                setView('home');
              }}
              style={{
                borderColor: isPicked ? accent : (isCurrent ? 'var(--clr-rose)' : undefined),
                position: 'relative',
              }}
              title={isCurrent ? 'ช่วงเวลาปัจจุบัน (auto-detect จากวันที่)' : ''}
            >
              <div className="icon">{p.icon}</div>
              <div className="title">{p.label}</div>
              <div className="sub">{p.sub}</div>
              <div style={{
                marginTop: 8,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--clr-ink-soft)',
                letterSpacing: '0.04em',
              }}>
                {subjectsInPhase.length === 0
                  ? 'ไม่มีวิชา'
                  : liveCount > 0
                    ? `${subjectsInPhase.length} วิชา, ${liveCount} เปิดเต็ม`
                    : `${subjectsInPhase.length} วิชา, รอเติม`}
              </div>
              {isCurrent && (
                <div className="badge" style={{ background: 'var(--clr-rose)', fontSize: 9 }}>NOW</div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 20,
        padding: 14,
        borderRadius: 10,
        background: 'var(--clr-surface-2)',
        fontSize: 12,
        color: 'var(--clr-ink-soft)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        💡 NOW = ช่วงที่ระบบเดาจากเดือนปัจจุบัน เลือกช่วงอื่นได้ตลอด<br/>
        เปลี่ยนชั้นปีได้ที่ปุ่ม <strong>ปี N</strong> ด้านบน
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('year-select')}>← เปลี่ยนปี</button>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>หน้าแรก</button>
      </div>
    </>
  );
}
