import { YEARS, SUBJECTS_BY_YEAR } from '../data/curriculum.js';

// PhaseSelectView — second step of the year picker.
// After user picks a year, they pick a 4-quadrant exam phase:
//   เทอม 1 กลางภาค, เทอม 1 ปลายภาค, เทอม 2 กลางภาค, เทอม 2 ปลายภาค
//
// Each card shows # subjects tagged with that semester + LIVE state.
// Auto-suggests the most likely current phase via month heuristic
// (Aug-Oct = 1-mid, Oct-Dec = 1-final, Jan-Mar = 2-mid, Mar-May = 2-final).
// Y6 is block-based (no fixed semester) — bypasses this view in App routing.

const PHASES = [
  { id: '1-mid',   semester: 1, label: 'เทอม 1 กลางภาค',   sub: 'เนื้อหาก่อนสอบกลางภาค', icon: '📚', months: [8, 9, 10] },
  { id: '1-final', semester: 1, label: 'เทอม 1 ปลายภาค',   sub: 'เนื้อหาก่อนสอบปลายภาค', icon: '🎯', months: [11, 12] },
  { id: '2-mid',   semester: 2, label: 'เทอม 2 กลางภาค',   sub: 'เนื้อหาก่อนสอบกลางภาค', icon: '📖', months: [2, 3] },
  { id: '2-final', semester: 2, label: 'เทอม 2 ปลายภาค',   sub: 'เนื้อหาก่อนสอบปลายภาค', icon: '🏁', months: [4, 5] },
];

export function detectCurrentPhase(now = new Date()) {
  const m = now.getMonth() + 1; // 1-12
  const found = PHASES.find((p) => p.months.includes(m));
  if (found) return found.id;
  // Uncovered months are semester breaks, and in a break the useful answer is
  // the phase you are walking INTO, not the one that just ended. June-July is
  // the long break before semester 1 (a student on 31 July is studying for
  // เทอม 1 กลางภาค, not the เทอม 2 final they sat in May); January is the gap
  // before semester 2's midterm.
  return m === 1 ? '2-mid' : '1-mid';
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
              title={isCurrent ? 'ช่วงที่ระบบแนะนำจากเดือนปัจจุบัน' : ''}
            >
              <div className="icon">{p.icon}</div>
              <div className="title">{p.label}</div>
              <div className="sub">{p.sub}</div>
              <div style={{
                marginTop: 8,
                fontSize: 11,
                fontFamily: 'var(--vmx-mono)',
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
                <div className="badge" style={{ '--badge-accent': 'var(--clr-rose)', fontSize: 10 }}>แนะนำ</div>
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
        ระบบแนะนำช่วงสอบจากเดือนปัจจุบัน คุณเลือกช่วงอื่นได้ตลอด
      </div>

      <div className="vmx-btn-row" style={{ marginTop: 24 }}>
        <button className="vmx-btn vmx-btn-ghost" onClick={() => setView('year-select')}>← เปลี่ยนปี</button>
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>หน้าแรก</button>
      </div>
    </>
  );
}
