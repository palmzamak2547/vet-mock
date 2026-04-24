import { SUBJECTS } from '../data/questions.js';

export default function ConfigView({ practiceMode, subject, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, startExam, goHome, mode }) {
  const msg = practiceMode === 'bookmarks' ? '🔖 โหมด Bookmark — ทำเฉพาะข้อที่ bookmark'
    : practiceMode === 'weak' ? '🎯 โหมด Weak Spots — ทำเฉพาะข้อที่ผิดบ่อย'
    : `${SUBJECTS.find((s) => s.id === subject)?.name} — สุ่มข้อสอบ`;

  // Exam mode: fixed 50 questions, 60s per Q
  const isExamMode = mode === 'exam';

  return (
    <>
      <div className="vmx-hero">
        <h1>ตั้งค่า <em>{isExamMode ? 'การสอบ' : 'การฝึก'}</em></h1>
        <p>{msg}</p>
      </div>

      <div className="vmx-config-panel">
        {!isExamMode && (
          <>
            <div className="vmx-config-row">
              <label className="vmx-label">จำนวนข้อ</label>
              <div className="vmx-chip-row">
                {[5, 10, 20, 30, 50].map((n) => (
                  <button key={n} className={`vmx-chip ${numQuestions === n ? 'active' : ''}`} onClick={() => setNumQuestions(n)}>{n} ข้อ</button>
                ))}
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
                  {[30, 60, 90, 120].map((t) => (
                    <button key={t} className={`vmx-chip ${timePerQ === t ? 'active' : ''}`} onClick={() => setTimePerQ(t)}>{t}s</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {isExamMode && (
          <div style={{ padding: '12px 0' }}>
            <div style={{ marginBottom: 16, fontSize: 15, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--clr-ink)' }}>📝 Exam Mode settings:</strong><br/>
              • จำนวน: <strong>50 ข้อ</strong> สุ่มจากวิชาที่เลือก<br/>
              • เวลา: <strong>60 วินาที/ข้อ</strong> รวม 50 นาที<br/>
              • ไม่สามารถหยุดเวลาได้<br/>
              • คะแนน ≥ 60% ถือว่าผ่าน
            </div>
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
