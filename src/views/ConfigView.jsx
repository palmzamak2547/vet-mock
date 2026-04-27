import { SUBJECTS } from '../data/questions.js';

// ============================================================
// ConfigView — ตั้งค่าก่อนเริ่มฝึก/สอบ
// ============================================================
// Settings exposed:
//   • # of questions (presets + custom)
//   • Question category filter (all / MCQ-only / writing-only)
//   • Timer toggle + time-per-question
//
// The category filter solves "MCQ + writing all jumbled together"
// by letting the user split their practice. Writing-only sessions
// also get a smarter timer (essay = 25 min, short = 3 min) via
// timeForQuestion() in App.jsx.
// ============================================================

const QCOUNT_PRESETS = [10, 20, 50];
const SECONDS_PRESETS = [30, 60, 120];

const CATEGORIES = [
  { id: 'all',     label: 'ทุกประเภท',          icon: '🎯', desc: 'รวมทุกแบบ — เหมือนสอบจริง' },
  { id: 'mcq',     label: 'MCQ + T/F + Fill',   icon: '📝', desc: 'ตรวจอัตโนมัติ — ฝึกความรู้เร็วๆ' },
  { id: 'writing', label: 'Writing เท่านั้น',   icon: '✍️', desc: 'Short + Essay — ฝึกเขียน · จับเวลายาวขึ้นอัตโนมัติ' },
];

export default function ConfigView({ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory: cat, setQuestionCategory: setCat, startExam, goHome, mode }) {
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
        {/* Question category — separate writing from MCQ */}
        <div className="vmx-config-row">
          <label className="vmx-label">ประเภทข้อสอบ</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat && setCat(c.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: `1px solid ${(cat || 'all') === c.id ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                  background: (cat || 'all') === c.id ? 'rgba(74, 107, 74, 0.10)' : 'var(--clr-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: 13 }}>{c.label}</span>
                  <span style={{ display: 'block', fontSize: 11, color: 'var(--clr-ink-soft)', marginTop: 2 }}>{c.desc}</span>
                </span>
                {(cat || 'all') === c.id && <span style={{ fontSize: 14, color: 'var(--clr-sage)' }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

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
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>
              💡 เวลานี้ใช้กับข้อ MCQ/T/F · ข้อ Writing จะได้เวลามากขึ้นอัตโนมัติ:
              <br/>
              &nbsp;&nbsp;&nbsp;Short answer = max({timePerQ * 3 < 180 ? 180 : timePerQ * 3}s = {Math.max(3, timePerQ * 3 / 60)} min)
              · Essay = max({Math.max(1500, timePerQ * 25)}s = {Math.max(25, Math.round(timePerQ * 25 / 60))} min)
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
