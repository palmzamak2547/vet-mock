import { useEffect, useMemo, useRef, useState } from 'react';
import { SUBJECTS } from '../data/questions.js';
import { SUBJECTS_BY_YEAR } from '../data/curriculum.js';
import {
  Q_VISIBLE_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE,
  Q_VISIBLE_COUNTS_BY_YEAR, Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE,
} from '../data/q-counts.js';
import { SEMESTER } from '../data/schedule.js';
import { EXAM_SCOPE_LABELS, examScopeForPhase } from '../lib/question-prediction.js';
import BackBar from '../components/BackBar.jsx';
import LadderStrip from '../components/LadderStrip.jsx';
import { wholeSetTime, wholeSetTimeLabel } from '../hooks/utils.js';
import NavIcon from '../components/NavIcon.jsx';
import { hasMeasuredDifficulty } from '../lib/elo.js';
import { loadQuestionDifficulty } from '../lib/question-difficulty.js';
import { USER_CURATED_MODES } from '../lib/exam-pool.js';
import { ladderStep, ladderStepFor, ladderPreset, rememberLadderStep } from '../lib/practice-ladder.js';

// ============================================================
// ConfigView — ตั้งค่าก่อนเริ่มฝึก/สอบ
// ============================================================
// One screen for every way a set starts: a topic card, the subject card,
// Home's launchers, the sidebar's โหมดสอบ and a Panic card all land here.
// What it shows, top to bottom, in the order a student changes things:
//   • The practice ladder (lib/practice-ladder.js): three rungs that set the
//     mode, the clock, the feedback and the count in one tap. The active rung
//     is READ from those settings, so the strip and the switches under it can
//     never disagree. Hidden for Panic (its ranking is its own feature) and
//     for the curated review pools (bookmarks, weak, wrong).
//   • The subject, as a native select, when the set is cross-subject or an
//     exam: the owner's "โหมดสอบเลือกวิชาไม่ได้" (2026-10-11). A topic chosen
//     one screen back is the student's own narrowing, so the select hides.
//   • Question category (only for engprof — only subject with writing items;
//     other subjects are pure MCQ so the picker would be UI noise)
//   • # of questions (presets + custom)
//   • Timer toggle with its time-per-question presets folded under it
//   • Instant feedback (practice only)
//   • How questions are picked (random vs adaptive), de-emphasised
// The start button and its one-line summary sit in their own bar, which a
// phone keeps inside the thumb's reach (CSS: .vmx-config-actions).
//
// Remote grading was removed from the writing-review flow per
// user request; ConfigView no longer carries a "writing grading
// mode" picker. SelfGradeHint in ReviewView is the only output.
// ============================================================

const QCOUNT_PRESETS = [10, 20, 50];
const SECONDS_PRESETS = [30, 60, 120];

// Each chip names the types it actually serves, in the words of the badge on
// the question card. questionCategory() in hooks/utils.js decides membership:
// fill-in-the-blank is typed, so it sits with the written chip, and matching
// is marked automatically, so it sits with the other one.
const CATEGORIES = [
  { id: 'all',     label: 'ทุกประเภท',           iconName: 'exam',     desc: 'รวมทุกแบบ — เหมือนสอบจริง' },
  { id: 'mcq',     label: 'ปรนัย ถูก-ผิด จับคู่', iconName: 'practice', desc: 'ตรวจอัตโนมัติ — ฝึกความรู้เร็วๆ' },
  { id: 'writing', label: 'ข้อเขียนเท่านั้น',    iconName: 'pen',      desc: 'ตอบสั้น เขียนบรรยาย และเติมคำ — พิมพ์คำตอบเอง' },
];

// What the adaptive chip can honestly say about the pool on screen. Difficulty
// comes only from measured attempts (src/lib/elo.js); a question without them
// sits at the neutral rating, so a pool with none measured is served as an
// ordinary topic-spread shuffle and the copy must not promise level matching.
// The order is not promised either: App re-sorts sets holding past-paper
// questions by id. `data` is undefined while loading and null on failure.
export function adaptiveHelpText({ data, pool }) {
  if (data === undefined) return 'กำลังตรวจว่าข้อในชุดนี้วัดความยากได้แล้วกี่ข้อ…';
  if (data === null) return 'ยังโหลดข้อมูลความยากไม่ได้ ตอนกดเริ่มจะลองโหลดอีกครั้ง';
  const noneYet = 'ข้อในชุดนี้ยังมีคนตอบไม่พอจะวัดความยาก ตอนนี้จะสุ่มให้แบบกระจายหัวข้อ ยังไม่ได้เลือกตามระดับของคุณ';
  if (!Object.keys(data).some((id) => hasMeasuredDifficulty({ id }, data))) return noneYet;
  if (!Array.isArray(pool)) return 'กำลังตรวจว่าข้อในชุดนี้วัดความยากได้แล้วกี่ข้อ…';
  const measured = pool.filter((q) => hasMeasuredDifficulty(q, data)).length;
  if (measured === 0) return noneYet;
  return `เลือกข้อที่ยากพอดีกับคุณจากประวัติการตอบ วัดความยากได้แล้ว ${measured.toLocaleString()} จาก ${pool.length.toLocaleString()} ข้อ ข้อที่เหลือนับเป็นระดับกลาง`;
}

// The subjects a student can switch to from this screen, with the number the
// generated tables hold for each under the paper in scope — the same numbers
// the subject cards print. The live count under "จำนวนข้อ" stays the
// authority once a pick is made; these are the menu.
export function subjectChoices({ selectedYear, selectedPhase }) {
  if (!Number.isFinite(selectedYear)) return null;
  const scoped = selectedPhase ? (Q_VISIBLE_COUNTS_BY_SUBJECT_BY_SCOPE[selectedPhase] || null) : null;
  const yearCount = scoped
    ? (Q_VISIBLE_COUNTS_BY_YEAR_BY_SCOPE[selectedPhase]?.[selectedYear] || 0)
    : (Q_VISIBLE_COUNTS_BY_YEAR[selectedYear] || 0);
  const groups = [];
  for (const s of SUBJECTS_BY_YEAR[selectedYear] || []) {
    if (!s?.has_questions) continue;
    const count = scoped ? (scoped[s.id] || 0) : (Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0);
    const label = s.semester ? `เทอม ${s.semester}` : 'ตลอดปี';
    let group = groups.find((g) => g.label === label);
    if (!group) { group = { label, items: [] }; groups.push(group); }
    group.items.push({ id: s.id, name: s.name, count });
  }
  return { yearCount, groups };
}

const PICKABLE_MODES = new Set(['all', 'adaptive']);

export default function ConfigView({ practiceMode, setPracticeMode, subject, setSubject = null, topic, setTopic = null, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory: cat, setQuestionCategory: setCat, showCategoryPicker = false, instantFeedback, setInstantFeedback, startExam, goHome, onBack, availableCount, availablePool = null, mode, setMode = null, selectedYear = null, selectedPhase = null, panicPending = false, setPanicPending = null }) {
  const knownAvailableCount = Number.isFinite(availableCount)
    ? Math.max(0, Math.floor(availableCount))
    : null;
  const countPresets = Array.from(new Set([
    ...QCOUNT_PRESETS.filter((n) => knownAvailableCount == null || n <= knownAvailableCount),
    ...(knownAvailableCount != null && knownAvailableCount > 0 ? [knownAvailableCount] : []),
  ])).sort((a, b) => a - b);
  const questionCountRef = useRef(numQuestions);
  const timePerQuestionRef = useRef(timePerQ);
  // The difficulty snapshot is its own lazy chunk; it is fetched only once the
  // student picks the adaptive chip (undefined = not loaded, null = failed).
  const [difficultyData, setDifficultyData] = useState(undefined);
  useEffect(() => {
    if (practiceMode !== 'adaptive' || difficultyData !== undefined) return undefined;
    let live = true;
    loadQuestionDifficulty().then(
      (data) => { if (live) setDifficultyData(data || {}); },
      () => { if (live) setDifficultyData(null); },
    );
    return () => { live = false; };
  }, [practiceMode, difficultyData]);
  const adaptiveHelp = useMemo(
    () => (practiceMode === 'adaptive' ? adaptiveHelpText({ data: difficultyData, pool: availablePool }) : ''),
    [practiceMode, difficultyData, availablePool],
  );

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
  // Whether the category picker shows comes from App (categoryPickerShown),
  // which applies the pick only where it shows: English, outside bookmarks
  // and weak spots. Deciding it here as well is how a pick made in English
  // came to filter every subject after it without being on screen.
  const subjMeta = SUBJECTS.find((s) => s.id === subject);
  const topicMeta = topic && subjMeta?.topics?.find((t) => t.id === topic);
  const isExamMode = mode === 'exam';
  // Exam mode runs one clock for the whole paper. The per-question number is
  // still how the budget is chosen, so show what it adds up to rather than a
  // per-question figure the clock no longer enforces. The clock gives written
  // and matching items more than the base, so from a pool that holds them the
  // total depends on the draw, and the label gives the range this pool allows.
  const examBudget = wholeSetTime(availablePool, numQuestions, timePerQ);
  const examBudgetLabel = wholeSetTimeLabel(examBudget);

  // The phase comes from the app's one phase selector; this page only names it.
  const phaseScope = examScopeForPhase(selectedPhase);
  const scopeLabel = phaseScope ? EXAM_SCOPE_LABELS[phaseScope] : 'ทั้งเทอม';
  const contextLine = practiceMode === 'bookmarks' ? '🔖 Bookmark — เฉพาะข้อที่บันทึก'
    : practiceMode === 'weak' ? 'Weak Spots — ข้อที่ผิดบ่อย'
    : practiceMode === 'wrong' ? 'ทบทวนข้อที่ตอบผิด — เรียงตามความถี่ (ผิดบ่อยขึ้นก่อน)'
    : practiceMode === 'current-scope' ? `ตามสไลด์ปัจจุบัน — ${scopeLabel}, เฉลยตรวจแล้ว ตรง ${SEMESTER.id}`
    : practiceMode === 'predicted' ? `ชุดน่าจะออก — ${scopeLabel}, หลักฐานอย่างน้อย 2 ทาง ไม่ใช่ข้อสอบยืนยัน`
    : topicMeta ? `${subjMeta?.icon} ${subjMeta?.name} → ${topicMeta.icon} ${topicMeta.label}`
    : `${subjMeta?.icon} ${subjMeta?.name}`;

  // ── The ladder ────────────────────────────────────────────────────────
  // Read, not stored: the rung is whatever the mode and the clock say. The
  // curated review pools (bookmarks, weak, wrong) are not rungs; Panic is a
  // way of picking questions and sits on any rung.
  const activeStep = ladderStepFor({ mode, useTimer });
  const curated = USER_CURATED_MODES.has(practiceMode);
  const showLadder = !curated;
  const pickStep = (id) => {
    const preset = ladderPreset(id, { available: knownAvailableCount, timePerQ });
    if (setMode) setMode(preset.mode);
    // Mode is state App owns; without a setter the strip still shows where the
    // settings are, but a rung that needs another mode cannot be applied.
    if (!setMode && preset.mode !== mode) return;
    // The paper hides the pick-method row, so a level pick chosen on a lower
    // rung must not ride along silently into exam mode.
    if (preset.mode === 'exam' && practiceMode === 'adaptive' && setPracticeMode) setPracticeMode('all');
    setUseTimer(preset.useTimer);
    // Rung 1 is built on seeing the answer after every question. Rung 2 keeps
    // whatever the student chose for feedback; the hint under the strip reads
    // that choice back instead of promising one.
    if (id === 'understand' && setInstantFeedback) setInstantFeedback(true);
    if (preset.useTimer) { timePerQuestionRef.current = preset.timePerQ; setTimePerQ(preset.timePerQ); }
    questionCountRef.current = preset.numQuestions;
    setNumQuestions(preset.numQuestions);
    rememberLadderStep(id);
  };
  const stepHint = (() => {
    const step = ladderStep(activeStep);
    const order = panicPending ? 'เรียงตามแนวข้อสอบก่อน' : practiceMode === 'adaptive' ? 'เลือกข้อตามระดับของคุณ' : 'ข้อที่น่าจะง่ายมาก่อน';
    if (activeStep === 'exam') return panicPending ? `${order} ${step.hint}` : step.hint;
    const feedback = instantFeedback ? 'เห็นเฉลยและเหตุผลทันทีหลังตอบ' : 'เฉลยหลังส่งทั้งชุด';
    if (activeStep === 'timed') return `${panicPending ? `${order} ` : ''}จับเวลาทีละข้อ หมดเวลาข้อไหนจะไปข้อถัดไปเอง ${feedback}`;
    return `${order} ไม่จับเวลา ${feedback}`;
  })();
  // The gentle order is rung 1's promise ("ข้อที่น่าจะง่ายมาก่อน"), so it is
  // asked for only where that line is on screen: an untimed practice set from
  // a plain or scope pool. Panic keeps its paper-proximity ranking, the
  // curated pools keep most-missed-first, and the adaptive pick has its own
  // easy-to-hard ramp.
  const gentle = showLadder && !panicPending && activeStep === 'understand' && practiceMode !== 'adaptive';
  // How questions are picked: random, by level, or Panic's paper-first order.
  // Panic arrives armed from its card (App's panicPending) and can also be
  // chosen here, so "ทบทวนเร่งด่วน" is a preset on this page, not another door.
  const pickMethod = panicPending ? 'panic' : practiceMode === 'adaptive' ? 'adaptive' : 'random';
  const choosePickMethod = (method) => {
    if (method === 'panic') { if (setPracticeMode) setPracticeMode('all'); setPanicPending?.(true); return; }
    setPanicPending?.(false);
    if (setPracticeMode) setPracticeMode(method === 'adaptive' ? 'adaptive' : 'all');
  };
  const pickMethodHelp = pickMethod === 'panic'
    ? 'เรียงข้อตามแนวข้อสอบจริงก่อน แล้วตามข้อที่คุณผิดบ่อย เหมาะกับคืนก่อนสอบ'
    : pickMethod === 'adaptive'
      ? adaptiveHelp
      : gentle
        ? 'สุ่มจากทั้งชุด แล้วเรียงข้อที่น่าจะง่ายไว้ก่อน ส่วน "ปรับระดับ" จะเลือกข้อที่ยากพอดีกับคุณเมื่อข้อนั้นมีคนตอบมากพอ'
        : 'สุ่มจากทั้งชุด ส่วน "ปรับระดับ" จะเลือกข้อที่ยากพอดีกับคุณเมื่อข้อนั้นมีคนตอบมากพอ';

  // ── The subject ───────────────────────────────────────────────────────
  const choices = useMemo(() => subjectChoices({ selectedYear, selectedPhase }), [selectedYear, selectedPhase]);
  const showSubjectPick = Boolean(setSubject && choices && !topic
    && (isExamMode || (PICKABLE_MODES.has(practiceMode) && (!subject || subject === 'all'))));
  const subjectValue = subject && subject !== 'all' ? subject : 'all';
  const subjectListed = subjectValue === 'all' || choices?.groups.some((g) => g.items.some((s) => s.id === subjectValue));
  const pickSubject = (id) => {
    setSubject(id);
    if (setTopic) setTopic(null);
    // Re-apply the rung's count against the menu's number for the new pick, so
    // a 50-question exam does not stay clamped to the 35 of the subject before.
    const listed = id === 'all' ? choices.yearCount : choices.groups.flatMap((g) => g.items).find((s) => s.id === id)?.count;
    const n = ladderPreset(activeStep, { available: listed || null, timePerQ }).numQuestions;
    questionCountRef.current = n;
    setNumQuestions(n);
  };

  // ── The start bar ─────────────────────────────────────────────────────
  const servedCount = knownAvailableCount ? Math.min(numQuestions, knownAvailableCount) : numQuestions;
  const practiceMinutes = Math.ceil((servedCount * timePerQ) / 60);
  const summary = [
    `${servedCount.toLocaleString()} ข้อ`,
    !useTimer ? 'ไม่จับเวลา' : isExamMode ? `${examBudgetLabel} นาฬิกาเดียว` : `${timePerQ} วินาทีต่อข้อ (ประมาณ ${practiceMinutes} นาที)`,
    isExamMode ? 'เฉลยหลังส่ง' : instantFeedback ? 'เฉลยทันทีรายข้อ' : 'เฉลยหลังส่ง',
    ...(panicPending ? ['เรียงตามแนวข้อสอบก่อน'] : []),
  ].join(', ');

  return (
    <>
      <BackBar onBack={onBack || goHome} label={subject && subject !== 'all' ? 'เลือกหัวข้อ' : 'หน้าแรก'} />
      <div className="vmx-hero vmx-config-hero">
        <h1>ตั้งค่า <em>{isExamMode ? 'โหมดสอบ' : 'การฝึก'}</em></h1>
        <p>{contextLine}</p>
      </div>

      {/* Writing-mode prep tips — shown only for writing-focused practice
          so students get a quick refresher of strategy before they sit
          down to the 25-minute essay. Hidden during pure MCQ to avoid
          UI noise. */}
      {showCategoryPicker && cat === 'writing' && (
        <div style={{
          marginBottom: 16,
          padding: 14,
          borderRadius: 12,
          background: 'var(--clr-sage-soft)',
          border: '1px solid color-mix(in srgb, var(--clr-sage) 35%, transparent)',
        }}>
          <div style={{
            fontSize: 14,
            fontFamily: 'var(--vmx-mono)',
            color: 'var(--clr-sage-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <NavIcon name="pen" size={13} />
            <span>Quick Strategy ก่อนเริ่มเขียน</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)' }}>
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
        {/* The ladder: where this set sits on the way to the paper, and one
            tap to move. Hidden for Panic and the curated review pools. */}
        {showLadder && (
          <div className="vmx-config-row vmx-config-ladder" role="group" aria-labelledby="vmx-config-ladder-label">
            <div id="vmx-config-ladder-label" className="vmx-label">ขั้นการฝึก</div>
            <LadderStrip active={activeStep} onPick={pickStep} labelledBy="vmx-config-ladder-label" />
            <div className="vmx-config-hint vmx-config-ladder-hint" aria-live="polite">{stepHint}</div>
          </div>
        )}

        {/* The subject, as the review screen already offers it: a native
            select keeps the paper, the count and the start together on a
            phone instead of behind a grid of cards. */}
        {showSubjectPick && (
          <div className="vmx-config-row vmx-form-group vmx-config-subject">
            <label htmlFor="vmx-config-subject" className="vmx-label">วิชา</label>
            <select
              id="vmx-config-subject"
              value={subjectValue}
              onChange={(e) => pickSubject(e.target.value)}
              style={{ minHeight: 'var(--touch-min)', maxWidth: '100%' }}
            >
              {!subjectListed && <option value={subjectValue}>{subjMeta?.name || 'วิชาที่เลือกไว้'}</option>}
              <option value="all">
                {`รวมทุกวิชา ปี ${selectedYear}${phaseScope ? ` ${scopeLabel}` : ''} (${choices.yearCount.toLocaleString()} ข้อ)`}
              </option>
              {choices.groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.count === 0}>
                      {s.count > 0 ? `${s.name} (${s.count.toLocaleString()} ข้อ)` : `${s.name} (ไม่มีข้อใน${scopeLabel})`}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="vmx-config-hint">
              {phaseScope ? `ตัวเลขคือข้อของ${scopeLabel} วิชาที่ไม่มีข้อในช่วงนี้เลือกไม่ได้` : 'เปลี่ยนวิชาได้ที่นี่ โดยไม่ต้องย้อนกลับ'}
            </div>
          </div>
        )}

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
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1px solid ${(cat || 'all') === c.id ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
                    background: (cat || 'all') === c.id ? 'var(--clr-sage-soft)' : 'var(--clr-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    transition: 'border-color var(--dur-fast), background var(--dur-fast)',
                  }}
                >
                  <span style={{
                    width: 36,
                    height: 36,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 'var(--r-md)',
                    background: (cat || 'all') === c.id ? 'var(--clr-sage)' : 'var(--clr-surface-2)',
                    color: (cat || 'all') === c.id ? 'var(--clr-sage-on)' : 'var(--clr-ink)',
                  }}>
                    <NavIcon name={c.iconName} size={18} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: 14, color: 'var(--clr-ink)' }}>{c.label}</span>
                    <span style={{ display: 'block', fontSize: 14, color: 'var(--clr-ink-soft)', marginTop: 2 }}>{c.desc}</span>
                  </span>
                  {(cat || 'all') === c.id && (
                    <span style={{ color: 'var(--clr-sage-text)' }}>
                      <NavIcon name="check" size={16} />
                    </span>
                  )}
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

        {/* Timer toggle, with the per-question presets folded under it so the
            two settings about one clock read as one row. */}
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
            {/* What the clock does, not just how long it is: an exam clock is
                one budget for the whole set and submits it when it runs out; a
                practice clock runs per question and moves on by itself. */}
            <span id="vmx-timer-state" style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>
              {!useTimer ? 'ปิด — โหมดอ่านไม่จับเวลา'
                : isExamMode ? `${examBudgetLabel} นาฬิกาเดียวทั้งชุด, หมดเวลาคือส่งทั้งชุด`
                : `${timePerQ} วินาที / ข้อ, หมดเวลาข้อไหนจะไปข้อถัดไปเอง`}
            </span>
          </div>
          {useTimer && (
            <div className="vmx-config-subrow" role="group" aria-labelledby="vmx-config-time-label">
              <div id="vmx-config-time-label" className="vmx-config-sublabel">{isExamMode ? 'วินาทีต่อข้อ (รวมเป็นงบของทั้งชุด)' : 'วินาทีต่อข้อ'}</div>
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
              {isExamMode && !showCategoryPicker && examBudget.min !== examBudget.max && (
                <div className="vmx-config-hint" style={{ marginTop: 8 }}>
                  ข้อตอบสั้น เขียนบรรยาย และจับคู่ได้เวลาเพิ่ม เวลารวมจึงขึ้นกับข้อที่อยู่ในชุด
                </div>
              )}
              {/* Writing-time hint only relevant when subject = engprof */}
              {showCategoryPicker && (
                <div style={{ marginTop: 8, fontSize: 14, color: 'var(--clr-ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  เวลานี้ใช้กับข้อปรนัย ถูก-ผิด และเติมคำ ข้อตอบสั้นกับเขียนบรรยายจะได้เวลามากขึ้นอัตโนมัติ:
                  <br/>
                  &nbsp;&nbsp;&nbsp;ตอบสั้น = max({timePerQ * 3 < 180 ? 180 : timePerQ * 3}s = {Math.max(3, timePerQ * 3 / 60)} min)
                 , เขียนบรรยาย = max({Math.max(1500, timePerQ * 25)}s = {Math.max(25, Math.round(timePerQ * 25 / 60))} min)
                </div>
              )}
            </div>
          )}
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
              <span id="vmx-instant-state" style={{ fontSize: 14, color: 'var(--clr-ink-soft)' }}>
                {instantFeedback ? 'เปิด — ตอบปุ๊บรู้ผล + อ่านคำอธิบายทันที' : 'ปิด — เฉลยหลังส่งเท่านั้น'}
              </span>
            </div>
          </div>
        )}

        {/* How questions are picked — a random set, the adaptive set, or
            Panic's paper-first order. Shown only inside the plain-pool family:
            curated chips (bookmarks/weak/wrong) and the scope modes keep their
            own launchers, so this row can never quietly redirect what one of
            those screens promised. Exam mode is a paper, not a pick. */}
        {!isExamMode && (practiceMode === 'all' || practiceMode === 'adaptive') && setPracticeMode && (
          <div className="vmx-config-row" role="group" aria-labelledby="vmx-config-mode-label">
            <div id="vmx-config-mode-label" className="vmx-label">วิธีเลือกข้อ</div>
            <div className="vmx-chip-row">
              <button className={`vmx-chip ${pickMethod === 'random' ? 'active' : ''}`} aria-pressed={pickMethod === 'random'} onClick={() => choosePickMethod('random')}>
                สุ่มทั่วไป
              </button>
              <button className={`vmx-chip ${pickMethod === 'adaptive' ? 'active' : ''}`} aria-pressed={pickMethod === 'adaptive'} onClick={() => choosePickMethod('adaptive')}>
                ปรับระดับ
              </button>
              {(setPanicPending || panicPending) && (
                <button className={`vmx-chip ${pickMethod === 'panic' ? 'active' : ''}`} aria-pressed={pickMethod === 'panic'} onClick={() => choosePickMethod('panic')} disabled={!setPanicPending}>
                  เร่งด่วน
                </button>
              )}
            </div>
            <div className="vmx-config-availability" aria-live="polite">{pickMethodHelp}</div>
          </div>
        )}
      </div>

      {/* The start bar: what the set is, in one line, and the one button.
          A phone keeps it at the bottom of the screen (see .vmx-config-actions)
          so the primary action is in reach without scrolling past the panel. */}
      <div className="vmx-config-actions">
        <div className="vmx-config-summary" id="vmx-config-summary">{summary}</div>
        {/* Back and start as one pair, the same shape as the exam screen's
            previous/next bar; the start is the wide one. */}
        <div className="vmx-config-actions-row">
          <button className="vmx-btn vmx-btn-ghost vmx-config-back" onClick={onBack || goHome}>
            ← {subject && subject !== 'all' ? 'เลือกหัวข้อ' : 'หน้าแรก'}
          </button>
          <button
            className="vmx-btn vmx-btn-primary vmx-config-start"
            disabled={knownAvailableCount === 0}
            aria-describedby="vmx-config-summary"
            onClick={() => startExam({
              numQuestions: questionCountRef.current,
              timePerQ: timePerQuestionRef.current,
              ...(gentle ? { gentle: true } : {}),
            })}
          >
            {isExamMode ? 'เริ่มสอบ' : 'เริ่มฝึก'}{knownAvailableCount ? ` ${servedCount.toLocaleString()} ข้อ` : ''} →
          </button>
        </div>
      </div>
    </>
  );
}
