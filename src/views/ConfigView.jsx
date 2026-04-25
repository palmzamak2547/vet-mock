import { SUBJECTS } from '../data/questions.js';

// ============================================================
// ConfigView — ตั้งค่าก่อนเริ่มฝึก/สอบ
// Show only what matters: # questions, timer (optional), time/q
// ============================================================

const QCOUNT_PRESETS = [10, 20, 50];      // เน้นใช้บ่อยที่สุด — custom ได้
const SECONDS_PRESETS = [30, 60, 120];

export default function ConfigView({ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, startExam, goHome, mode }) {
  const subjMeta = SUBJECTS.find((s) => s.id === subject);
  const topicMeta = topic && subjMeta?.topics?.find((t) => t.id === topic);
  const isExamMode = mode === 'exam';

  const contextLine = practiceMode === 'bookmarks' ? '🔖 Bookmark — เฉพาะข้อที่บันทึก'
    : practiceMode === 'weak' ? '🎯 Weak Spots — ข้อที่ผิดบ่อย'
    : topicMeta ? `${subjMeta?.icon} ${subjMeta?.name} → ${topicMeta.icon} ${topicMeta.label}`
    : `${subjMeta?.icon} ${subjMeta?.name}`;

  return (
    <>
      <div className="vmx-hero">
        <h1>{isExamMode ? 'เริ่ม' : 'ตั้งค่า'} <em>{isExamMode ? 'การสอบ' : 'การฝึก'}</em></h1>
        <p>{contextLine}</p>
      </div>

      <div className="vmx-config-panel">
        {/* Number of questions */}
        <div className="vmx-config-row">
          <label className="vmx-label">จำนวนข้อ</label>
          <div className="vmx-chip-row">
            {QCOUNT_PRESETS.map((n) => (
              <button key={n} className={`vmx-chip ${numQuestions === n ? 'active' : ''}`} onClick={() => setNumQuestions(n)}>
                {n}
              </button>
            ))}
            <input
              type="number"
              min={1}
              value={numQuestions}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (Number.isFinite(v) && v >= 1) setNumQuestions(v);
              }}
              aria-label="จำนวนข้อแบบกำหนดเอง"
              style={{ width: 76, padding: '6px 10px', borderRadius: 999, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Timer toggle */}
        <div className="vmx-config-row">
          <label className="vmx-label">จับเวลา</label>
          <div className="vmx-toggle-row">
            <div className={`vmx-toggle ${useTimer ? 'on' : ''}`} role="switch" aria-checked={useTimer} tabIndex={0} onClick={() => setUseTimer(!useTimer)} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setUseTimer(!useTimer); } }}></div>
            <span style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              {useTimer ? `${timePerQ} วินาที / ข้อ` : 'ปิด — โหมดอ่านไม่จับเวลา'}
            </span>
          </div>
        </div>

        {/* Time per question — only when timer on */}
        {useTimer && (
          <div className="vmx-config-row">
            <label className="vmx-label">เวลาต่อข้อ</label>
            <div className="vmx-chip-row">
              {SECONDS_PRESETS.map((t) => (
                <button key={t} className={`vmx-chip ${timePerQ === t ? 'active' : ''}`} onClick={() => setTimePerQ(t)}>
                  {t}s
                </button>
              ))}
              <input
                type="number"
                min={5}
                value={timePerQ}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isFinite(v) && v >= 5) setTimePerQ(v);
                }}
                aria-label="เวลาต่อข้อแบบกำหนดเอง"
                style={{ width: 76, padding: '6px 10px', borderRadius: 999, border: '1px solid var(--clr-border)', background: 'var(--clr-bg)', color: 'var(--clr-ink)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={goHome}>← ย้อนกลับ</button>
        <button className="vmx-btn vmx-btn-primary" onClick={startExam}>
          {isExamMode ? '🎓 เริ่มสอบ →' : '🚀 เริ่มฝึก →'}
        </button>
      </div>
    </>
  );
}
