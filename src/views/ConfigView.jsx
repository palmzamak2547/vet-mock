import { SUBJECTS } from '../data/questions.js';

export default function ConfigView({ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, startExam, goHome, mode }) {
  const subjMeta = SUBJECTS.find((s) => s.id === subject);
  const topicMeta = topic && subjMeta?.topics?.find((t) => t.id === topic);
  const msg = practiceMode === 'bookmarks' ? '🔖 โหมด Bookmark — ทำเฉพาะข้อที่ bookmark'
    : practiceMode === 'weak' ? '🎯 โหมด Weak Spots — ทำเฉพาะข้อที่ผิดบ่อย'
    : topicMeta ? `${subjMeta?.icon} ${subjMeta?.name} → ${topicMeta.icon} ${topicMeta.label}`
    : `${subjMeta?.name} — สุ่มข้อสอบ`;

  const isExamMode = mode === 'exam';

  return (
    <>
      <div className="vmx-hero">
        <h1>ตั้งค่า <em>{isExamMode ? 'การสอบ' : 'การฝึก'}</em></h1>
        <p>{msg}</p>
      </div>

      <div className="vmx-config-panel">
        <div className="vmx-config-row">
          <label className="vmx-label">จำนวนข้อ</label>
          <div className="vmx-chip-row">
            {[5, 10, 20, 30, 50, 100, 200].map((n) => (
              <button key={n} className={`vmx-chip ${numQuestions === n ? 'active' : ''}`} onClick={() => setNumQuestions(n)}>{n} ข้อ</button>
            ))}
            <input
              type="number"
              min={1}
              value={numQuestions}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isFinite(v) && v >= 1) setNumQuestions(v);
              }}
              style={{ width: 88, padding: '6px 10px', borderRadius: 999, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}
              title="กำหนดจำนวนข้อเอง"
            />
          </div>
        </div>

        <div className="vmx-config-row">
          <label className="vmx-label">จับเวลา</label>
          <div className="vmx-toggle-row">
            <div className={`vmx-toggle ${useTimer ? 'on' : ''}`} onClick={() => setUseTimer(!useTimer)}></div>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              {useTimer ? `${timePerQ} วินาที / ข้อ` : 'ไม่จับเวลา (โหมดฝึก)'}
            </span>
          </div>
        </div>

        {useTimer && (
          <div className="vmx-config-row">
            <label className="vmx-label">เวลาต่อข้อ</label>
            <div className="vmx-chip-row">
              {[15, 30, 60, 90, 120, 180, 300].map((t) => (
                <button key={t} className={`vmx-chip ${timePerQ === t ? 'active' : ''}`} onClick={() => setTimePerQ(t)}>{t}s</button>
              ))}
              <input
                type="number"
                min={5}
                value={timePerQ}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isFinite(v) && v >= 5) setTimePerQ(v);
                }}
                style={{ width: 88, padding: '6px 10px', borderRadius: 999, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}
                title="กำหนดวินาที/ข้อเอง"
              />
            </div>
          </div>
        )}

        {isExamMode && (
          <div style={{ padding: '12px 14px', marginTop: 8, fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7, background: 'var(--clr-surface-2)', borderRadius: 12 }}>
            <strong style={{ color: 'var(--clr-ink)' }}>🎓 Exam Mode</strong> — สอบจริงจัง · คะแนน ≥ 60% ถือว่าผ่าน<br/>
            ค่า default: 50 ข้อ × 60 วินาที = 50 นาที (เปลี่ยนได้ด้านบน)
          </div>
        )}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
        <button className="vmx-btn vmx-btn-primary" onClick={startExam}>
          {isExamMode ? '🎓 เริ่มสอบ →' : 'เริ่มสอบ →'}
        </button>
      </div>
    </>
  );
}
