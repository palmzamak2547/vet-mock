import { getAllScores } from '../data/scores.js';
import { SUBJECTS } from '../data/curriculum.js';
import BackBar from '../components/BackBar.jsx';

export default function ScoresView({ goHome }) {
  const scores = getAllScores();

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-hero">
        <h1>สัดส่วน <em>คะแนน</em></h1>
        <p>ปี 4 เทอม 2 · Vet 86 · ข้อมูลจากภาพ "สัดส่วนคะแนน.jpg" (อาจไม่ครบ — ส่งข้อมูลเพิ่มทาง Feedback ได้)</p>
      </div>

      <div className="vmx-section-label">รายวิชา ({scores.length})</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {scores.map((s, idx) => {
          const subject = SUBJECTS.find((sub) => sub.id === s.subject_id);
          const total = (typeof s.midterm === 'number' ? s.midterm : 0) + (s.final || 0) + (s.free || 0) + (s.work || 0);

          return (
            <div key={idx} className="vmx-dash-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 17 }}>
                  {subject?.icon || '📚'} {s.name}
                </h3>
                {total >= 95 && total <= 105 && (
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', padding: '2px 8px', background: 'var(--clr-surface-2)', borderRadius: 999 }}>
                    รวม ~{Math.round(total)}%
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: s.note ? 12 : 0 }}>
                <ScoreCell label="Midterm" value={s.midterm} color="var(--clr-ocean)" />
                <ScoreCell label="Final" value={s.final} color="var(--clr-rose)" />
                <ScoreCell label="ฟรี" value={s.free} color="var(--clr-sage)" />
                <ScoreCell label="ทำงาน" value={s.work} color="var(--clr-gold)" />
              </div>

              {s.note && (
                <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontStyle: 'italic', padding: '8px 12px', background: 'var(--clr-surface-2)', borderRadius: 8 }}>
                  💡 {s.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="vmx-empty" style={{ marginBottom: 20, padding: 16, background: 'var(--clr-surface-2)', borderRadius: 12 }}>
        ⚠️ ข้อมูลอาจไม่ครบหรือมีคลาดเคลื่อน — ส่ง update ได้ที่ <strong>Feedback</strong> หรือ <a href="mailto:palmzamak2547@gmail.com" style={{ color: 'var(--clr-sage)' }}>palmzamak2547@gmail.com</a>
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← หน้าแรก</button>
      </div>
    </>
  );
}

function ScoreCell({ label, value, color }) {
  if (value === null || value === undefined) {
    return (
      <div style={{ padding: 10, background: 'var(--clr-bg)', borderRadius: 8, textAlign: 'center', opacity: 0.4 }}>
        <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>—</div>
      </div>
    );
  }

  const display = typeof value === 'number' ? `${value}%` : value;

  return (
    <div style={{ padding: 10, background: 'var(--clr-bg)', borderRadius: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Fraunces, serif', color }}>{display}</div>
    </div>
  );
}
