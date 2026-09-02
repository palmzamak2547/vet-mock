import { useEffect, useRef } from 'react';
import { SUBJECTS } from '../data/questions.js';
import { SEMESTER } from '../data/schedule.js';
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
// Remote grading was removed from the writing-review flow per
// user request; ConfigView no longer carries a "writing grading
// mode" picker. SelfGradeHint in ReviewView is the only output.
// ============================================================

const QCOUNT_PRESETS = [10, 20, 50];
const SECONDS_PRESETS = [30, 60, 120];

const CATEGORIES = [
  { id: 'all',     label: 'ทุกประเภท',          icon: '🎯', desc: 'รวมทุกแบบ — เหมือนสอบจริง' },
  { id: 'mcq',     label: 'MCQ + T/F + Fill',   icon: '📝', desc: 'ตรวจอัตโนมัติ — ฝึกความรู้เร็วๆ' },
  { id: 'writing', label: 'Writing เท่านั้น',   icon: '✍️', desc: 'Short + Essay — ฝึกเขียน, จับเวลายาวขึ้นอัตโนมัติ' },
];

export default function ConfigView({ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory: cat, setQuestionCategory: setCat, instantFeedback, setInstantFeedback, startExam, goHome, onBack, availableCount, mode }) {
  const knownAvailableCount = Number.isFinite(availableCount)
    ? Math.max(0, Math.floor(availableCount))
    : null;
  const countPresets = Array.from(new Set([
    ...QCOUNT_PRESETS.filter((n) => knownAvailableCount == null || n <= knownAvailableCount),
    ...(knownAvailableCount != null && knownAvailableCount > 0 ? [knownAvailableCount] : []),
  ])).sort((a, b) => a - b);
  const questionCountRef = useRef(numQuestions);
  const timePerQuestionRef = useRef(timePerQ);

  useEffect(() => {
    if (knownAvailableCount == null || knownAvailableCount < 1 || numQuestions <= knownAvailableCount) return;
    questionCountRef.current = knownAvailableCount;
    setNumQuestions(knownAvailableCount);
  }, [knownAvailableCount, numQuestions, setNumQuestions]);

  const updateQuestionCount = (e) => {
    const value = Number(e.currentTarget.value);
    if (Number.isFinite(value) && value >= 1) {
      questionCountRef.current = knownAvailableCount == null
        ? Math.floor(value)
        : Math.min(Math.floor(value), Math.max(1, knownAvailableCount));
      setNumQuestions(questionCountRef.current);
    }
  };
  const updateTimePerQuestion = (e) => {
    const value = Number(e.currentTarget.value);
    if (Number.isFinite(value) && value >= 5) {
      timePerQuestionRef.current = Math.floor(value);
      setTimePerQ(timePerQuestionRef.current);
    }
  };
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
    : practiceMode === 'weak' ? 'Weak Spots — ข้อที่ผิดบ่อย'
    : practiceMode === 'wrong' ? 'ทบทวนข้อที่ตอบผิด — เรียงตามความถี่ (ผิดบ่อยขึ้นก่อน)'
    : practiceMode === 'current-scope' ? `ตามสไลด์ปัจจุบัน — เฉลยตรวจแล้วและตรง scope ${SEMESTER.id}`
    : practiceMode === 'predicted' ? 'ชุดน่าจะออก — เฉลยตรวจแล้ว + scope ปัจจุบัน + หลักฐานอย่างน้อย 2 ทาง; ไม่ใช่ข้อสอบยืนยัน'
    : topicMeta ? `${subjMeta?.icon} ${subjMeta?.name} → ${topicMeta.icon} ${topicMeta.label}`
    : `${subjMeta?.icon} ${subjMeta?.name}`;

  return (
    <>
      <BackBar onBack={onBack || goHome} label={subject && subject !== 'all' ? 'เลือกหัวข้อ' : 'หน้าแรก'} subtitle={contextLine} />
      <div className="vmx-hero">
        <h1>ตั้งค่า <em>{isExamMode ? 'โหมดสอบ' : 'การฝึก'}</em></h1>
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
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-sage-text)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 700 }}>
            ✍️ Quick strategy ก่อนเริ่มเขียน
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
            <li><strong>อ่าน 2 รอบ:</strong> 1 = gist, 2 = ขีดเส้น main idea + 4-5 details</li>
            <li><strong>เปิดด้วย topic sentence</strong> — paraphrase main idea (อย่าก๊อปประโยคแรก)</li>
            <li><strong>ใช้ transitions:</strong> However, Moreover, In addition, On the other hand</li>
            <li><strong>Paraphrase = เปลี่ยน 2 อย่าง</strong> — synonyms <em>and</em> sentence structure</li>
            <li><strong>Cite source:</strong> "In the article by [Author]..." → score 3/3 paraphrasing</li>
            <li><strong>Word count:</strong> target 150, ≤ 180 ปลอดภัย, &gt; 200 = −2</li>
            <li><strong>NO opinion, NO examples</strong> from original, NO invented info</li>
          </ul>
        </div>
      )}

      <div className="vmx-config-panel">
        {/* Question category — only shown for engprof (the one subject
            that actually has writing items). For other subjects, the
            picker would be inert noise. */}
        {showCategoryPicker && (
          <div className="vmx-config-row" role="group" aria-labelledby="vmx-config-category-label">
            <div id="vmx-config-category-label" className="vmx-label">ประเภทข้อสอบ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat && setCat(c.id)}
                  aria-pressed={(cat || 'all') === c.id}
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
                  {(cat || 'all') === c.id && <span style={{ fontSize: 14, color: 'var(--clr-sage-text)' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number of questions */}
        <div className="vmx-config-row" role="group" aria-labelledby="vmx-config-count-label">
          <div className="vmx-config-label-row">
            <div id="vmx-config-count-label" className="vmx-label">จำนวนข้อ</div>
            <div id="vmx-config-count-help" className="vmx-config-availability" role="status">
              {knownAvailableCount == null
                ? 'กำลังตรวจจำนวนข้อ…'
                : knownAvailableCount > 0
                  ? `มี ${knownAvailableCount.toLocaleString()} ข้อในชุดนี้`
                  : 'ยังไม่มีข้อที่พร้อมใช้ในชุดนี้'}
            </div>
          </div>
          <div className="vmx-chip-row">
            {countPresets.map((n) => (
              <button key={n} className={`vmx-chip ${numQuestions === n ? 'active' : ''}`} aria-pressed={numQuestions === n} onClick={() => { questionCountRef.current = n; setNumQuestions(n); }}>
                {n}
              </button>
            ))}
            <label className="vmx-custom-number">
              <span>กำหนดเอง</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={knownAvailableCount || undefined}
                value={numQuestions}
                onInput={updateQuestionCount}
                onChange={updateQuestionCount}
                aria-label="จำนวนข้อแบบกำหนดเอง"
                aria-describedby="vmx-config-count-help"
                className="vmx-number-pill"
              />
            </label>
          </div>
        </div>

        {/* Timer toggle */}
        <div className="vmx-config-row">
          <span className="vmx-label" id="vmx-timer-label">จับเวลา</span>
          <div className="vmx-toggle-row">
            <button
              type="button"
              className={`vmx-toggle ${useTimer ? 'on' : ''}`}
              role="switch"
              aria-checked={useTimer}
              aria-labelledby="vmx-timer-label vmx-timer-state"
              onClick={() => setUseTimer(!useTimer)}
            />
            <span id="vmx-timer-state" style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
              {useTimer ? `${timePerQ} วินาที / ข้อ` : 'ปิด — โหมดอ่านไม่จับเวลา'}
            </span>
          </div>
        </div>

        {/* Instant feedback — practice modes only. Exam mode must stay
            blind to per-question verdicts, so the toggle hides there. */}
        {!isExamMode && (
          <div className="vmx-config-row">
            <span className="vmx-label" id="vmx-instant-label">เฉลยทันที</span>
            <div className="vmx-toggle-row">
              <button
                type="button"
                className={`vmx-toggle ${instantFeedback ? 'on' : ''}`}
                role="switch"
                aria-checked={Boolean(instantFeedback)}
                aria-labelledby="vmx-instant-label vmx-instant-state"
                onClick={() => setInstantFeedback(!instantFeedback)}
              />
              <span id="vmx-instant-state" style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
                {instantFeedback ? 'เปิด — ตอบปุ๊บรู้ผล + อ่านคำอธิบายทันที' : 'ปิด — เฉลยหลังส่งเท่านั้น'}
              </span>
            </div>
          </div>
        )}

        {/* Time per question — only when timer on */}
        {useTimer && (
          <div className="vmx-config-row" role="group" aria-labelledby="vmx-config-time-label">
            <div id="vmx-config-time-label" className="vmx-label">เวลาต่อข้อ</div>
            <div className="vmx-chip-row">
              {SECONDS_PRESETS.map((t) => (
                <button key={t} className={`vmx-chip ${timePerQ === t ? 'active' : ''}`} aria-pressed={timePerQ === t} onClick={() => { timePerQuestionRef.current = t; setTimePerQ(t); }}>
                  {t}s
                </button>
              ))}
              <label className="vmx-custom-number">
                <span>กำหนดเอง</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={5}
                  value={timePerQ}
                  onInput={updateTimePerQuestion}
                  onChange={updateTimePerQuestion}
                  aria-label="เวลาต่อข้อแบบกำหนดเอง"
                  className="vmx-number-pill"
                />
              </label>
            </div>
            {/* Writing-time hint only relevant when subject = engprof */}
            {showCategoryPicker && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--clr-ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>
                เวลานี้ใช้กับข้อ MCQ/T/F, ข้อ Writing จะได้เวลามากขึ้นอัตโนมัติ:
                <br/>
                &nbsp;&nbsp;&nbsp;Short answer = max({timePerQ * 3 < 180 ? 180 : timePerQ * 3}s = {Math.max(3, timePerQ * 3 / 60)} min)
               , Essay = max({Math.max(1500, timePerQ * 25)}s = {Math.max(25, Math.round(timePerQ * 25 / 60))} min)
              </div>
            )}
          </div>
        )}
      </div>

      <div className="vmx-btn-row">
        <button className="vmx-btn vmx-btn-ghost" onClick={onBack || goHome}>
          ← {subject && subject !== 'all' ? 'เลือกหัวข้อ' : 'หน้าแรก'}
        </button>
        <button
          className="vmx-btn vmx-btn-primary"
          disabled={knownAvailableCount === 0}
          onClick={() => startExam({
            numQuestions: questionCountRef.current,
            timePerQ: timePerQuestionRef.current,
          })}
        >
          {isExamMode ? 'เริ่มสอบ' : 'เริ่มฝึก'}{knownAvailableCount ? ` ${Math.min(numQuestions, knownAvailableCount)} ข้อ` : ''} →
        </button>
      </div>
    </>
  );
}
