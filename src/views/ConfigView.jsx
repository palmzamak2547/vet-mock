import { SUBJECTS } from '../data/questions.js';
import BackBar from '../components/BackBar.jsx';

// ============================================================
// ConfigView — ตั้งค่าก่อนเริ่มฝึก/สอบ
// ============================================================
// Settings exposed:
//   • Question category (only for engprof — only subject with
//     writing items; other subjects are pure MCQ so the picker
//     would be UI noise)
//   • # of questions (presets + custom)
//   • Timer toggle + time-per-question
//
// Smart-AI grading was removed from the writing-review flow per
// user request; ConfigView no longer carries a "writing grading
// mode" picker. SelfGradeHint in ReviewView is the only output.
// ============================================================

const QCOUNT_PRESETS = [10, 20, 50];
const SECONDS_PRESETS = [30, 60, 120];

const CATEGORIES = [
  { id: 'all',     label: 'ทุกประเภท',          icon: '🎯', desc: 'รวมทุกแบบ — เหมือนสอบจริง' },
  { id: 'mcq',     label: 'MCQ + T/F + Fill',   icon: '📝', desc: 'ตรวจอัตโนมัติ — ฝึกความรู้เร็วๆ' },
  { id: 'writing', label: 'Writing เท่านั้น',   icon: '✍️', desc: 'Short + Essay — ฝึกเขียน · จับเวลายาวขึ้นอัตโนมัติ' },
];

export default function ConfigView({ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory: cat, setQuestionCategory: setCat, startExam, goHome, mode }) {
  // The category picker only makes sense for engprof — the only
  // subject with writing-style items. Showing it for COM III/IV/V
  // (pure MCQ) just adds visual noise. For bookmarks/weak modes the
  // pool is heterogeneous; we still hide it because the "all" default
  // already does the right thing there.
  const showCategoryPicker = subject === 'engprof' && practiceMode !== 'bookmarks' && practiceMode !== 'weak';
  const subjMeta = SUBJECTS.find((s) => s.id === subject);
  const topicMeta = topic && subjMeta?.topics?.find((t) => t.id === topic);
  const isExamMode = mode === 'exam';

  const contextLine = practiceMode === 'bookmarks' ? '🔖 Bookmark — เฉพาะข้อที่บันทึก'
    : practiceMode === 'weak' ? '🎯 Weak Spots — ข้อที่ผิดบ่อย'
    : topicMeta ? `${subjMeta?.icon} ${subjMeta?.name} → ${topicMeta.icon} ${topicMeta.label}`
    : `${subjMeta?.icon} ${subjMeta?.name}`;

  return (
    <>
      <BackBar onBack={goHome} label="ย้อนกลับ" subtitle={contextLine} />
      <div className="vmx-hero">
        <h1>{isExamMode ? 'เริ่ม' : 'ตั้งค่า'} <em>{isExamMode ? 'การสอบ' : 'การฝึก'}</em></h1>
        <p>{contextLine}</p>
      </div>

      {/* Writing-mode prep tips — shown only for writing-focused practice
          so students get a quick refresher of strategy before they sit
          down to the 25-minute essay. Hidden during pure MCQ to avoid
          UI noise. */}
      {(cat === 'writing') && subject === 'engprof' && (
        <div style={{
          marginBottom: 16,
          padding: 14,
          borderRadius: 12,
          background: 'rgba(74, 107, 74, 0.08)',
          border: '1px solid var(--clr-sage)',
        }}>
          <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-sage)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 700 }}>
            ✍️ Quick strategy ก่อนเริ่มเขียน
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
            <li><strong>อ่าน 2 รอบ:</strong> 1 = gist · 2 = ขีดเส้น main idea + 4-5 details</li>
            <li><strong>เปิดด้วย topic sentence</strong> — paraphrase main idea (อย่าก๊อปประโยคแรก)</li>
            <li><strong>ใช้ transitions:</strong> However · Moreover · In addition · On the other hand</li>
            <li><strong>Paraphrase = เปลี่ยน 2 อย่าง</strong> — synonyms <em>and</em> sentence structure</li>
            <li><strong>Cite source:</strong> "In the article by [Author]..." → score 3/3 paraphrasing</li>
            <li><strong>Word count:</strong> target 150 · ≤ 180 ปลอดภัย · &gt; 200 = −2</li>
            <li><strong>NO opinion · NO examples</strong> from original · NO invented info</li>
          </ul>
        </div>
      )}

      <div className="vmx-config-panel">
        {/* Question category — only shown for engprof (the one subject
            that actually has writing items). For other subjects, the
            picker would be inert noise. */}
        {showCategoryPicker && (
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
        )}

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
            {/* Writing-time hint only relevant when subject = engprof */}
            {showCategoryPicker && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>
                💡 เวลานี้ใช้กับข้อ MCQ/T/F · ข้อ Writing จะได้เวลามากขึ้นอัตโนมัติ:
                <br/>
                &nbsp;&nbsp;&nbsp;Short answer = max({timePerQ * 3 < 180 ? 180 : timePerQ * 3}s = {Math.max(3, timePerQ * 3 / 60)} min)
                · Essay = max({Math.max(1500, timePerQ * 25)}s = {Math.max(25, Math.round(timePerQ * 25 / 60))} min)
              </div>
            )}
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
