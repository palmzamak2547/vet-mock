import { useEffect, useState } from 'react';
import { QB } from '../data/questions.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate, shortCountdown } from '../data/schedule.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, CURRENT_YEAR, visibleQuestionCount } from '../data/curriculum.js';
import { LATEST_CHANGELOG, SCOPE_LABELS } from '../data/changelog.js';
import { useLocalStorage } from '../hooks/useStorage.js';

// onlineCount/onlineStatus are now passed as props (hook lives in App
// so the WebSocket presence survives view changes — see App.jsx).
// Phase metadata for label rendering. Mirrors PhaseSelectView's PHASES.
const PHASE_LABELS = {
  '1-mid':   { thai: 'เทอม 1 กลางภาค', short: 'เทอม 1 กลาง',  semester: 1, icon: '📚' },
  '1-final': { thai: 'เทอม 1 ปลายภาค', short: 'เทอม 1 ปลาย',  semester: 1, icon: '🎯' },
  '2-mid':   { thai: 'เทอม 2 กลางภาค', short: 'เทอม 2 กลาง',  semester: 2, icon: '📖' },
  '2-final': { thai: 'เทอม 2 ปลายภาค', short: 'เทอม 2 ปลาย',  semester: 2, icon: '🏁' },
};

export default function HomeView({ setView, setMode, setSubject, setTopic, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, cardStats, bookmarks, customQuestions, user, profile, readingChecklist = {}, onlineCount = 0, onlineStatus = 'disabled', selectedYear = CURRENT_YEAR, setSelectedYear, selectedPhase, setSelectedPhase, pendingResume, resumePendingExam, dismissPendingExam, history = [], setFeedbackPrefill }) {
  // Year context — determines hero copy + reading checklist scope.
  // Only Y4 has actual exam schedule entries today; for scaffold years
  // we hide the countdown banner since `getNextExam('y5')` returns null.
  const yearMeta = YEARS.find((y) => y.id === selectedYear) || YEARS.find((y) => y.id === 4);
  const isScaffoldYear = !!yearMeta?.scaffold;
  const nextExam = getNextExam(`y${selectedYear}`);
  const phaseMeta = selectedPhase ? PHASE_LABELS[selectedPhase] : null;
  // Filter SUBJECTS_BY_YEAR[selectedYear] to phase scope. If no phase
  // selected (e.g. Y6 block-based), show all subjects.
  // Special case: semester === 0 means cross-semester (e.g. VCA license
  // exam prep) — always show regardless of selected phase.
  const allYearSubjects = SUBJECTS_BY_YEAR[selectedYear] || [];
  const yearSubjects = phaseMeta
    ? allYearSubjects.filter((s) => s.semester === phaseMeta.semester || s.semester === 0)
    : allYearSubjects;

  // Question count — show year-filtered count so PREVIEW years don't
  // mislead users with the global total.
  const totalQ = isScaffoldYear
    ? QB.filter((q) => q.year === selectedYear).length
    : QB.length + (customQuestions?.length || 0);

  // Reading checklist progress — scoped to the active year + phase.
  const checklistTopics = yearSubjects
    .filter((s) => Array.isArray(s.topics) && s.topics.length > 0)
    .flatMap((s) => s.topics.map((t) => t.id));
  const readingDone = checklistTopics.filter((id) => readingChecklist[id]).length;
  const readingTotal = checklistTopics.length;

  // Changelog announcement banner — show until user dismisses this version
  const [lastSeenChangelog, setLastSeenChangelog] = useLocalStorage('vmx-last-seen-changelog', null);
  const [expanded, setExpanded] = useState(false);
  const showAnnouncement = LATEST_CHANGELOG && lastSeenChangelog !== LATEST_CHANGELOG.version;

  // Onboarding tour — shown once on first home visit (after year-pick).
  // 3-step explanation of subject grid + smart presets + persistent header.
  // Suppressed forever after dismiss via vmx-onboarding-seen flag.
  const [onboardingSeen, setOnboardingSeen] = useLocalStorage('vmx-onboarding-seen', false);
  const [tourStep, setTourStep] = useState(0);
  const showOnboarding = !onboardingSeen;

  // Email-verify banner dismiss — session-only state. We don't persist
  // because we WANT a gentle re-nag if they ignore it across sessions
  // until they actually verify. Once verified, the banner disappears
  // permanently because user.email_confirmed_at flips truthy.
  const [verifyDismissed, setVerifyDismissed] = useState(false);

  // (Removed dedicated IG banner from HomeView — Palm flagged the
  // home page had too many announcements. IG launch already lives in:
  //   1. Footer (every page)
  //   2. Changelog announcement (the v5.16.0 entry has the launch line)
  //   3. AboutView IG card (full QR + handle + tagline)
  // The single dismiss flag stays in localStorage in case we re-enable
  // it later for a future "follow us" push without losing prior opt-outs.)

  // Tick to keep the countdown banner fresh.
  //
  // Two cadences:
  //   • 1 min when an imminent countdown is shown (banner reads
  //     "อีก N นาที" / "อีก N ชม. M นาที" — needs minute granularity)
  //   • 5 min otherwise — keeps "X days left" accurate across day
  //     rollovers AND, more importantly, lets getNextExam roll forward
  //     when an exam finishes during the day (filtered out by exam-end
  //     time in schedule.js getNextExam, but only re-evaluated on
  //     re-render — without this tick, the banner would show a finished
  //     exam until the user did something else that re-rendered the
  //     home page).
  const [, setTick] = useState(0);
  const countdown = nextExam ? shortCountdown(nextExam) : null;
  useEffect(() => {
    const intervalMs = countdown ? 60_000 : 5 * 60_000;
    const id = setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => clearInterval(id);
  }, [nextExam, countdown]);

  // ─── Quick stats: study streak + today count + wrong Q pool ────
  // Computed from history (date + correct flag). Streak counts
  // consecutive days ending today (or yesterday if user hasn't
  // studied yet today). Wrong pool = Q IDs the user answered wrong,
  // grouped by frequency.
  const quickStats = (() => {
    if (!Array.isArray(history) || history.length === 0) {
      return { streak: 0, todayCount: 0, wrongCount: 0, wrongIds: [] };
    }
    const ymd = (d) => new Date(d).toLocaleDateString('en-CA');
    const todayKey = ymd(Date.now());
    const days = new Set();
    let todayCount = 0;
    const wrongFreq = new Map();
    for (const h of history) {
      if (!h?.date) continue;
      const dayKey = ymd(h.date);
      days.add(dayKey);
      if (dayKey === todayKey) todayCount++;
      if (h.correct === false) {
        const compoundId = (h.subject || '?') + ':' + h.questionId;
        wrongFreq.set(compoundId, (wrongFreq.get(compoundId) || 0) + 1);
      }
    }
    let streak = 0;
    const cursor = new Date();
    if (!days.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
    while (days.has(ymd(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    const wrongIds = [...wrongFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k);
    return { streak, todayCount, wrongCount: wrongIds.length, wrongIds };
  })();

  // Quick action: random 1 Q from full QB. Sets up a 1-question exam
  // and routes straight into ExamView via 'config' → which we shortcut
  // by setting numQuestions=1 and mode='quick'.
  const allQuestionsPool = QB.length + (customQuestions?.length || 0);
  const launchRandomQ = () => {
    if (allQuestionsPool === 0) return;
    if (setMode) setMode('quick');
    if (setNumQuestions) setNumQuestions(1);
    if (setUseTimer) setUseTimer(false);
    if (setSubject) setSubject(null);
    if (setTopic) setTopic(null);
    if (setPracticeMode) setPracticeMode('all');
    setView('config');
  };

  // Quick action: review questions answered wrong (cross-subject).
  // Uses the same pattern as bookmarks practiceMode — just a different
  // pool source. Sorted by wrong-frequency so the user sees their
  // most-confused Qs first.
  const launchWrongReview = () => {
    if (quickStats.wrongCount === 0) return;
    if (setMode) setMode('quick');
    if (setNumQuestions) setNumQuestions(Math.min(quickStats.wrongCount, 50));
    if (setUseTimer) setUseTimer(false);
    if (setSubject) setSubject(null);
    if (setTopic) setTopic(null);
    if (setPracticeMode) setPracticeMode('wrong');
    setView('config');
  };

  return (
    <>
      {showOnboarding && (
        <OnboardingTour
          step={tourStep}
          onNext={() => setTourStep((s) => s + 1)}
          onDismiss={() => { setOnboardingSeen(true); setTourStep(0); }}
        />
      )}
      <div className="vmx-hero">
        <h1>
          {user
            ? <>สวัสดี <em>{profile?.username || 'เพื่อน'}</em></>
            : <>อ่านแล้ว ลอง <em>ทำข้อสอบ</em> กันเถอะ</>}
        </h1>
        <p>
          {isScaffoldYear
            ? <>🚧 <strong>{yearMeta.label}</strong>, {yearMeta.desc}, พรีวิว — รอเติมเนื้อหา</>
            : <>คลังข้อสอบ <strong>{totalQ}</strong> ข้อ, {yearMeta?.label || 'ปี 4'}</>}
        </p>
        {/* Year-switcher pill removed from HomeView hero — moved to the
            global persistent App header (since 2026-05-08). One canonical
            place for year context = no duplication, no confusion. */}
      </div>

      {/* Email verification reminder — for users who signed up but
          haven't clicked the link yet. Dismissible per-session via
          state (not localStorage — gentle re-nag on next visit). */}
      {user && !user.email_confirmed_at && !verifyDismissed && (
        <div style={{
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          background: 'rgba(184, 137, 64, 0.10)',
          border: '1px solid var(--clr-gold)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: 13,
        }}>
          <span style={{ fontSize: 20 }}>📧</span>
          <span style={{ flex: 1, minWidth: 200, lineHeight: 1.5 }}>
            <strong>ยืนยันอีเมล</strong>, ส่งไปที่ <code style={{ fontSize: 12 }}>{user.email}</code> แล้ว — กดลิงก์ในอีเมล (ดู junk/spam ด้วย)
          </span>
          <button
            type="button"
            onClick={() => setVerifyDismissed(true)}
            style={{ all: 'unset', cursor: 'pointer', fontSize: 12, color: 'var(--clr-ink-soft)', padding: '4px 8px' }}
            title="ปิดประกาศ (รอบนี้)"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Resume in-flight exam — top priority. Shown when App detected a
          stale exam state in localStorage (< 6h old). Replaces the old
          jarring window.confirm prompt with an actionable banner. */}
      {pendingResume && (() => {
        // Search all years (the in-flight exam may not match selectedYear).
        const subjMeta = SUBJECTS.find((s) => s.id === pendingResume.subjectId);
        const subjLabel = subjMeta ? `${subjMeta.icon || ''} ${subjMeta.name || ''}` : 'ข้อสอบที่ค้างอยู่';
        const timeAgo = pendingResume.ageMin < 60
          ? `${pendingResume.ageMin} นาทีที่แล้ว`
          : `${Math.round(pendingResume.ageMin / 60)} ชม. ที่แล้ว`;
        return (
          <div style={{
            padding: 16,
            borderRadius: 16,
            marginBottom: 20,
            background: 'rgba(74, 107, 74, 0.08)',
            border: '2px solid var(--clr-sage)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 32 }}>▶️</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ทำต่อจาก {timeAgo}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, marginTop: 2 }}>
                {subjLabel}
              </div>
              <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
                ตอบไปแล้ว <strong>{pendingResume.answered}</strong>/{pendingResume.qCount} ข้อ
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="vmx-btn vmx-btn-primary"
                onClick={() => resumePendingExam && resumePendingExam()}
                style={{ background: 'var(--clr-sage)', borderColor: 'var(--clr-sage)' }}
              >
                ทำต่อ
              </button>
              <button
                className="vmx-btn vmx-btn-ghost"
                onClick={() => dismissPendingExam && dismissPendingExam()}
                title="เริ่มใหม่ (ลบข้อสอบที่ค้าง)"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        );
      })()}

      {/* Next exam countdown banner */}
      {nextExam && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 30 && (
        <div onClick={() => setView('schedule')} style={{
          padding: 16, borderRadius: 16, marginBottom: 24, cursor: 'pointer',
          background: countdown ? 'var(--clr-rose-soft)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose-soft)' : 'var(--clr-surface)'),
          border: `2px solid ${countdown ? 'var(--clr-rose)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-border)')}`,
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 36 }}>{nextExam.icon}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              สอบถัดไป
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, marginTop: 2 }}>
              {nextExam.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', marginTop: 2 }}>
              {fmtThaiDate(nextExam.date)}, ⏰ {nextExam.time}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {countdown ? (
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: countdown.kind === 'imminent' ? 22 : 26, lineHeight: 1.15, color: 'var(--clr-rose)' }}>
                {countdown.text}
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-ink)' }}>
                  {nextExam.daysLeft}
                </div>
                <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
                  days left
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* What's-new announcement — auto-dismissed once seen */}
      {showAnnouncement && (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            marginBottom: 20,
            background: 'rgba(184, 137, 64, 0.08)',
            border: '1px solid var(--clr-gold)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>🎉</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                อัปเดตใหม่, {LATEST_CHANGELOG.version}, {fmtThaiDate(LATEST_CHANGELOG.date)}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
                {LATEST_CHANGELOG.headline}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastSeenChangelog(LATEST_CHANGELOG.version)}
              aria-label="ปิดประกาศ"
              title="ปิดประกาศ"
              style={{
                all: 'unset',
                cursor: 'pointer',
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--clr-ink-soft)',
                fontSize: 18,
                lineHeight: 1,
                background: 'var(--clr-bg)',
                border: '1px solid var(--clr-border)',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>

          {/* Detail list collapsed by default — Palm flagged the
              banner felt too long when items rendered eagerly. Show
              only on click; show only titles (no desc) to keep the
              expanded state compact. */}
          {expanded && (
            <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LATEST_CHANGELOG.changes.map((c, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--clr-bg)',
                    border: '1px solid var(--clr-border)',
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {c.fromFeedback && <FeedbackChip />}
                    <strong style={{ color: 'var(--clr-ink)' }}>{c.title}</strong>
                  </span>
                  <KindPill kind={c.kind} />
                </li>
              ))}
            </ul>
          )}

          {LATEST_CHANGELOG.changes.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 8,
                fontSize: 12,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'JetBrains Mono, monospace',
                textDecoration: 'underline',
              }}
            >
              {expanded
                ? '▴ ซ่อน'
                : `▾ ดูรายละเอียด (${LATEST_CHANGELOG.changes.length} รายการ)`}
            </button>
          )}
        </div>
      )}

      {/* Quick Actions — streak chip + random Q + wrong-answer review.
          Cross-subject app-wide actions placed prominently above subject
          grid so casual sessions ("just one Q while waiting") and review
          loops ("show me what I got wrong") are 1 tap away. */}
      {(quickStats.streak > 0 || allQuestionsPool > 0 || quickStats.wrongCount > 0) && (
        <div style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 18,
          alignItems: 'center',
        }}>
          {quickStats.streak > 0 && (
            <div
              className={quickStats.streak >= 3 ? 'vmx-streak-active vmx-pop-in' : 'vmx-pop-in'}
              title={`ทำข้อสอบติดต่อกัน ${quickStats.streak} วัน, วันนี้ทำไปแล้ว ${quickStats.todayCount} ข้อ`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(231, 116, 68, 0.12)',
                border: '1px solid #d97744',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#a85a30',
              }}
            >
              🔥 streak {quickStats.streak} วัน
              {quickStats.todayCount > 0 && <span style={{ color: 'var(--clr-ink-soft)' }}>, วันนี้ {quickStats.todayCount} ข้อ</span>}
            </div>
          )}

          {allQuestionsPool > 0 && (
            <button
              className="vmx-chip-quick vmx-pop-in"
              onClick={launchRandomQ}
              title={`สุ่ม 1 ข้อจากคลังทั้งหมด ${allQuestionsPool} ข้อ`}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(93, 180, 211, 0.12)',
                border: '1px solid #5db4d3',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#3a8aa8',
                transition: 'transform 0.12s, background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(93, 180, 211, 0.20)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(93, 180, 211, 0.12)'}
            >
              🎲 ฝึก 1 ข้อด่วน
            </button>
          )}

          {quickStats.wrongCount > 0 && (
            <button
              className="vmx-chip-quick vmx-pop-in"
              onClick={launchWrongReview}
              title={`ทบทวนข้อที่เคยตอบผิด — เรียงตามความถี่ (ผิดบ่อยขึ้นก่อน)`}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(167, 61, 74, 0.12)',
                border: '1px solid #a73d4a',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#8a3340',
                transition: 'transform 0.12s, background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(167, 61, 74, 0.20)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(167, 61, 74, 0.12)'}
            >
              🎯 ทบทวนข้อที่ตอบผิด ({quickStats.wrongCount})
            </button>
          )}
        </div>
      )}

      {/* PRIMARY: Subject Grid — natural mental model is "I want to study X subject".
          Filtered to current phase (e.g. only sem 2 subjects when phase is '2-final'). */}
      <div className="vmx-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <span>
          วิชาใน{yearMeta?.label || 'ปี 4'}
          {phaseMeta && <span style={{ color: 'var(--clr-ink-soft)', fontWeight: 400 }}>, {phaseMeta.short}</span>}
        </span>
        {phaseMeta && setSelectedPhase && (
          <button
            type="button"
            onClick={() => setView('phase-select')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-ink-soft)',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
            }}
          >
            เปลี่ยน phase
          </button>
        )}
      </div>
      <SubjectGrid
        subjects={yearSubjects}
        questions={[...QB, ...(customQuestions || [])]}
        readingChecklist={readingChecklist}
        bookmarks={bookmarks}
        history={history}
        onPick={(s) => {
          // Both scaffold AND empty-LIVE subjects route to feedback with
          // subject prefilled. Difference is just messaging: scaffold =
          // "expected to be empty" (early stage), empty-LIVE = "this should
          // have content but doesn't, please tell us why or contribute."
          const totalQ = visibleQuestionCount(s.id, [...QB, ...(customQuestions || [])]);
          const isEmptyOrScaffold = s.scaffold || totalQ === 0;
          if (isEmptyOrScaffold) {
            if (setFeedbackPrefill) {
              const reason = s.scaffold
                ? 'อยากให้เพิ่มเนื้อหา'
                : 'วิชานี้ยังไม่มีข้อสอบ — มี slide/notes/ข้อสอบเก่าส่งมาช่วยได้ไหม';
              setFeedbackPrefill({
                type: 'Content',
                subject: `ขอเนื้อหา, ${s.name} (${s.code || 'TBD'}), ปี ${selectedYear}`,
                message: `${reason}\n\nวิชา: "${s.name}" (${s.name_en || ''}), ปี ${selectedYear}\n\nรายละเอียด:\n- (แนบลิงก์ Google Drive หรือบรรยายตรงนี้ได้เลย)`,
              });
            }
            setView('feedback');
            return;
          }
          setSubject && setSubject(s.id);
          setView('topic-select');
        }}
      />

      {/* SECONDARY: Practice modes — cross-subject within selected year.
          Smart presets ('ใกล้สอบ' / 'จุดอ่อน' / 'ทำซ้ำ') surface only when
          their data preconditions are met, jumping straight to ConfigView
          to skip subject/topic drill-down. */}
      {!isScaffoldYear && (() => {
        // Compute weakest TOPIC (then map up to subject) — gives a more
        // actionable signal than subject-level. Min 10 attempts, < 70%.
        // Scope to phase-filtered subjects so smart presets respect the
        // current phase context (e.g. don't suggest sem 1 weak topic when
        // user is in sem 2 phase).
        const yearSubjectIds = new Set(yearSubjects.map((s) => s.id));
        const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
        // Index Q→topic for history lookups (history doesn't store topic).
        // Use compound key (subject + ':' + id) because Q IDs collide
        // across subjects historically (e.g. com4 ↔ engprof both use
        // 1100-1160). Without compound key, stats for one subject leak
        // into another.
        const qIndex = new Map();
        for (const q of QB) qIndex.set(q.subject + ':' + q.id, q);
        const topicAcc = {};
        for (const h of (history || [])) {
          if (!h?.subject || !yearSubjectIds.has(h.subject)) continue;
          if (h.date && h.date < cutoff) continue;
          const q = qIndex.get(h.subject + ':' + h.questionId);
          const topic = q?.topic;
          if (!topic) continue;
          const key = `${h.subject}::${topic}`;
          if (!topicAcc[key]) topicAcc[key] = { subject: h.subject, topic, total: 0, correct: 0 };
          topicAcc[key].total++;
          if (h.correct) topicAcc[key].correct++;
        }
        let weakSubj = null, weakTopic = null, weakPct = 100;
        for (const { subject: sid, topic, total, correct } of Object.values(topicAcc)) {
          if (total < 10) continue;
          const pct = Math.round((correct / total) * 100);
          if (pct < weakPct && pct < 70) {
            weakPct = pct; weakSubj = sid; weakTopic = topic;
          }
        }
        // Try to read structured last-session-config first (full restore);
        // fall back to history scan if absent (older users without snapshot).
        let lastSession = null;
        try {
          const raw = window.localStorage?.getItem('vmx-last-session-config');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.subject && yearSubjectIds.has(parsed.subject)) lastSession = parsed;
          }
        } catch {}
        let lastSubj = lastSession?.subject || null;
        if (!lastSubj) {
          let lastTs = 0;
          for (const h of (history || [])) {
            if (!h?.subject || !yearSubjectIds.has(h.subject)) continue;
            if ((h.date || 0) > lastTs) { lastTs = h.date || 0; lastSubj = h.subject; }
          }
        }
        const lastSubjMeta = lastSubj ? SUBJECTS.find((s) => s.id === lastSubj) : null;
        const weakSubjMeta = weakSubj ? SUBJECTS.find((s) => s.id === weakSubj) : null;
        const weakTopicMeta = (weakSubjMeta?.topics || []).find((t) => t.id === weakTopic);

        return (
        <>
          <div className="vmx-section-label" style={{ marginTop: 28 }}>โหมดซ้อม</div>
          <div className="vmx-mode-grid">
            {/* Smart: ซ้อมใกล้สอบ — when nextExam exists in current year */}
            {nextExam && nextExam.subject && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 30 && (
              <button
                className="vmx-mode-card"
                onClick={() => {
                  setMode('quick');
                  setSubject && setSubject(nextExam.subject);
                  setPracticeMode && setPracticeMode('all');
                  setView('config');
                }}
                style={{ borderColor: 'var(--clr-rose)' }}
              >
                <div className="icon">{nextExam.icon || '📅'}</div>
                <div className="title">ซ้อมใกล้สอบ</div>
                <div className="sub">
                  {(() => {
                    const subjMeta = SUBJECTS.find((s) => s.id === nextExam.subject);
                    const label = subjMeta?.name || nextExam.subject;
                    return `${label}, อีก ${nextExam.daysLeft} วันจะสอบ`;
                  })()}
                </div>
                <div className="badge" style={{ background: 'var(--clr-rose)' }}>SMART</div>
              </button>
            )}

            {/* Smart: จุดอ่อน — topic-granular when ≥10 attempts + <70%.
                Sets subject + topic so ConfigView opens already filtered. */}
            {weakSubj && weakSubjMeta && (
              <button
                className="vmx-mode-card"
                onClick={() => {
                  setMode('quick');
                  setSubject && setSubject(weakSubj);
                  // Topic-granular: set the weakest specific topic if found,
                  // else fall back to subject-level (ConfigView reads null).
                  if (setTopic) setTopic(weakTopic || null);
                  setPracticeMode && setPracticeMode('all');
                  setView('config');
                }}
                style={{ borderColor: 'var(--clr-gold)' }}
                title={
                  weakTopicMeta
                    ? `จุดอ่อนสุด: ${weakTopicMeta.label} (ตอบถูก ${weakPct}%)`
                    : `90 วันล่าสุด ตอบถูก ${weakPct}% — ซ้อมเสริม`
                }
              >
                <div className="icon">⚠️</div>
                <div className="title">จุดอ่อน</div>
                <div className="sub">
                  {weakTopicMeta ? (() => {
                    const cleaned = weakTopicMeta.label.replace(/^[\d\s.·\-]+/, '').trim();
                    const label = cleaned.length > 24 ? `${cleaned.slice(0, 24)}…` : cleaned;
                    return `${weakSubjMeta.name}, ${label}`;
                  })() : `${weakSubjMeta.name}, ${weakPct}% ถูก`}
                </div>
                <div className="badge" style={{ background: 'var(--clr-gold)' }}>SMART</div>
              </button>
            )}

            {/* Smart: ทำซ้ำ — full restore from vmx-last-session-config when
                available (mode + subject + topic + numQuestions + timer).
                Falls back to history-derived subject-only mode for users
                who took exams before the snapshot existed. */}
            {lastSubj && lastSubjMeta && lastSubj !== nextExam?.subject && lastSubj !== weakSubj && (
              <button
                className="vmx-mode-card"
                onClick={() => {
                  if (lastSession) {
                    if (setMode) setMode(lastSession.mode || 'quick');
                    if (setSubject) setSubject(lastSession.subject);
                    if (setTopic) setTopic(lastSession.topic || null);
                    if (setPracticeMode) setPracticeMode(lastSession.practiceMode || 'all');
                    if (setNumQuestions && lastSession.numQuestions) setNumQuestions(lastSession.numQuestions);
                    if (setUseTimer && typeof lastSession.useTimer === 'boolean') setUseTimer(lastSession.useTimer);
                    if (setTimePerQ && lastSession.timePerQ) setTimePerQ(lastSession.timePerQ);
                  } else {
                    setMode('quick');
                    setSubject && setSubject(lastSubj);
                    if (setTopic) setTopic(null);
                    setPracticeMode && setPracticeMode('all');
                  }
                  setView('config');
                }}
                style={{ borderColor: 'var(--clr-ocean)' }}
                title={
                  lastSession?.score
                    ? `ครั้งที่แล้วตอบถูก ${lastSession.score.pct}% (${lastSession.score.correct}/${lastSession.score.total})`
                    : 'ทำซ้ำวิชาที่ซ้อมล่าสุด'
                }
              >
                <div className="icon">🔁</div>
                <div className="title">ทำซ้ำ</div>
                <div className="sub">
                  {lastSubjMeta.name}
                  {lastSession?.score && `, ${lastSession.score.pct}% ครั้งก่อน`}
                </div>
                <div className="badge" style={{ background: 'var(--clr-ocean)' }}>SMART</div>
              </button>
            )}

            <button className="vmx-mode-card" onClick={() => {
              setMode('quick');
              setSubject && setSubject('all');
              setPracticeMode && setPracticeMode('all');
              setView('config');
            }}>
              <div className="icon">📝</div>
              <div className="title">Quick Practice</div>
              <div className="sub">สุ่มข้อทุกวิชา, 5-50 ข้อ</div>
            </button>

            <button className="vmx-mode-card" onClick={() => {
              setMode('exam');
              setSubject && setSubject('all');
              setPracticeMode && setPracticeMode('all');
              if (setNumQuestions) setNumQuestions(50);
              if (setUseTimer) setUseTimer(true);
              if (setTimePerQ) setTimePerQ(60);
              setView('config');
            }}>
              <div className="icon">🎓</div>
              <div className="title">Exam Mode</div>
              <div className="sub">50 ข้อ × 60 วิ, เลียนข้อสอบจริง</div>
            </button>

            <button className="vmx-mode-card" onClick={() => { setMode('sr'); setView('sr-session'); }}>
              <div className="icon">🧠</div>
              <div className="title">Spaced Repetition</div>
              <div className="sub">
                {cardStats.due > 0
                  ? `${cardStats.due} ข้อทบทวนวันนี้, ≈ ${Math.max(5, Math.ceil(cardStats.due / 5) * 5)} นาที`
                  : 'ทบทวนแบบ Anki'}
              </div>
              {cardStats.due > 0 && <div className="badge">{cardStats.due}</div>}
            </button>

          </div>
        </>
        );
      })()}

      {/* TERTIARY: Year tools — schedule/scores/reading/videos disabled on
          scaffold years (data is year-scoped + empty). Analytics stays
          since it's cross-year. Adds a contribute CTA on scaffold years. */}
      <div className="vmx-section-label" style={{ marginTop: 28 }}>เครื่องมือ{yearMeta?.label || 'ปี 4'}</div>
      <div className="vmx-mode-grid">
        <button
          className="vmx-mode-card"
          onClick={() => !isScaffoldYear && setView('schedule')}
          disabled={isScaffoldYear}
          style={{ opacity: isScaffoldYear ? 0.45 : 1, cursor: isScaffoldYear ? 'not-allowed' : 'pointer' }}
          title={isScaffoldYear ? 'ยังไม่มีตารางสำหรับปีนี้' : ''}
        >
          <div className="icon">📅</div>
          <div className="title">ตารางสอบ</div>
          <div className="sub">
            {isScaffoldYear ? '🚧 ยังไม่มีตาราง' : 'Final exam schedule'}
          </div>
        </button>

        <button
          className="vmx-mode-card"
          onClick={() => !isScaffoldYear && setView('reading-checklist')}
          disabled={isScaffoldYear}
          style={{
            opacity: isScaffoldYear ? 0.45 : 1,
            cursor: isScaffoldYear ? 'not-allowed' : 'pointer',
            borderColor: readingDone > 0 ? 'var(--clr-gold)' : undefined,
          }}
          title={isScaffoldYear ? 'รายการอ่าน scaffold ปีนี้ยังว่าง' : ''}
        >
          <div className="icon">📚</div>
          <div className="title">รายการอ่าน</div>
          <div className="sub">
            {isScaffoldYear ? '🚧 ยังไม่มีหัวข้อ' : (readingTotal > 0 ? `${readingDone}/${readingTotal} หัวข้อ` : 'ยังไม่มีหัวข้อใน scope')}
          </div>
          {!isScaffoldYear && readingDone > 0 && <div className="badge" style={{ background: 'var(--clr-gold)' }}>{readingDone}</div>}
        </button>

        <button
          className="vmx-mode-card"
          onClick={() => !isScaffoldYear && setView('scores')}
          disabled={isScaffoldYear}
          style={{ opacity: isScaffoldYear ? 0.45 : 1, cursor: isScaffoldYear ? 'not-allowed' : 'pointer' }}
          title={isScaffoldYear ? 'สัดส่วนคะแนนของปีนี้ยังไม่มี' : ''}
        >
          <div className="icon">💰</div>
          <div className="title">สัดส่วนคะแนน</div>
          <div className="sub">{isScaffoldYear ? '🚧 ยังไม่มีข้อมูล' : 'Mid, Final, ฟรี, ทำงาน'}</div>
        </button>

        {/* คลิปย้อนหลัง card removed — Subject Detail's action panel
            now provides per-subject 🎥 access, which is the natural
            entry point. Cross-subject "browse all videos" was a rare
            use case and the redundancy created confusion. */}

        {isScaffoldYear && (
          <button
            className="vmx-mode-card"
            onClick={() => setView('feedback')}
            style={{ borderColor: 'var(--clr-gold)' }}
          >
            <div className="icon">🤝</div>
            <div className="title">ช่วยเติมเนื้อหา</div>
            <div className="sub">ส่ง slide / notes / past paper ของปีนี้</div>
          </button>
        )}
      </div>

      {/* Multiplayer (cross-year, account-scoped) */}
      {hasSupabase && (
        <>
          <div className="vmx-section-label" style={{ marginTop: 28 }}>Multiplayer</div>
          <div className="vmx-mode-grid">
            {user ? (
              <>
                <button className="vmx-mode-card" onClick={() => setView('groups')} style={{ borderColor: 'var(--clr-ocean)' }}>
                  <div className="icon">👥</div>
                  <div className="title">Study Groups</div>
                  <div className="sub">สร้างกลุ่ม, invite เพื่อน, แชร์ข้อสอบ</div>
                </button>
                <button className="vmx-mode-card" onClick={() => setView('leaderboard-global')} style={{ borderColor: 'var(--clr-gold)' }}>
                  <div className="icon">🏆</div>
                  <div className="title">Leaderboard</div>
                  <div className="sub">จัดอันดับคะแนนทั่วโลก</div>
                </button>
              </>
            ) : (
              <button className="vmx-mode-card" onClick={() => setView('auth')} style={{ borderColor: 'var(--clr-sage)' }}>
                <div className="icon">🔐</div>
                <div className="title">Login / Sign Up</div>
                <div className="sub">เพื่อใช้ Groups, Leaderboard, Cloud Sync</div>
              </button>
            )}
          </div>
        </>
      )}

      {/* Tips footer — only for first-time users (pre-onboarding-dismiss).
          Returning users have absorbed these already; hiding declutters
          the home view. Onboarding tour now covers the keyboard shortcuts
          + dark mode tips on first visit. */}
      {!onboardingSeen && (
        <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
          💡 ใช้ Spaced Repetition ทุกวัน วันละ 15-30 นาที จะได้ผลดีที่สุด<br/>
          ⌨️ กด <span className="vmx-kbd">1-4</span> เพื่อเลือก MCQ, <span className="vmx-kbd">T/F</span>, <span className="vmx-kbd">Space</span> ข้อถัดไป<br/>
          🌙 สลับโหมดมืด/สว่างที่ปุ่มขวาบน
        </div>
      )}

      {/* Bottom strip — about / feedback / Q manager / changelog re-open
          all consolidated as small text links. They're rarely-used utility
          actions that don't deserve full mode-card real estate. */}
      <div style={{
        marginTop: 36,
        paddingTop: 18,
        borderTop: '1px dashed var(--clr-border)',
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontSize: 12,
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--clr-ink-soft)',
      }}>
        <button type="button" onClick={() => setView('about')} style={linkStyle}>
          ℹ️ เกี่ยวกับ
        </button>
        <button type="button" onClick={() => setView('feedback')} style={linkStyle}>
          💌 แจ้งปัญหา / ขอเนื้อหา
        </button>
        <button type="button" onClick={() => setView('question-manager')} style={linkStyle}>
          ➕ เพิ่ม/แก้ข้อสอบเอง
        </button>
        {!showAnnouncement && LATEST_CHANGELOG && (
          <button type="button" onClick={() => setLastSeenChangelog(null)} style={linkStyle}>
            🔔 อัปเดตล่าสุด ({LATEST_CHANGELOG.version})
          </button>
        )}
      </div>
    </>
  );
}

// Compact link style — used in the bottom strip for utility actions
// (about, feedback, Q manager, changelog re-open). Not a button visually,
// but still keyboard-focusable + click-target sized.
const linkStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  color: 'var(--clr-ink-soft)',
  padding: '4px 8px',
  borderRadius: 6,
};

// ── Scope chip (วิชา / ระบบ) — inline, before the title ─────────
function ScopeChip({ scope }) {
  const meta = SCOPE_LABELS[scope];
  if (!meta) return null;
  return (
    <span
      title={`อัปเดตในส่วน: ${meta.label}`}
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        marginRight: 6,
        marginBottom: 2,
        borderRadius: 999,
        background: meta.bg,
        color: meta.color,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      {meta.icon} {meta.label}
    </span>
  );
}

// ── "จาก feedback" chip ─────────────────────────────────────────
// Marks changelog entries that came from a user's feedback form or
// email so the rest of the cohort sees their submissions actually
// shipped. Keep this entry-level (not version-level) — sometimes a
// release contains both feedback fixes and unrelated changes.
function FeedbackChip() {
  return (
    <span
      title="แก้จาก feedback ที่ส่งมา"
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        marginRight: 6,
        marginBottom: 2,
        borderRadius: 999,
        background: 'rgba(184, 137, 64, 0.15)',
        color: 'var(--clr-gold)',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      📨 จาก feedback
    </span>
  );
}

// ── Subject Grid ──────────────────────────────────────────────
// Primary content of HomeView (across all years). Each card represents
// a subject in the current year, with LIVE state (counts, exam format)
// or PREVIEW state (faculty count from vault_lecturers, course code).
// LIVE cards link to TopicSelectView (= subject detail). PREVIEW cards
// are visually distinct + non-interactive (subjects without Qs yet).
function SubjectGrid({ subjects, questions, readingChecklist = {}, bookmarks = [], history = [], onPick }) {
  if (!subjects?.length) {
    return (
      <div style={{
        padding: 20,
        borderRadius: 12,
        background: 'var(--clr-surface-2)',
        fontSize: 13,
        color: 'var(--clr-ink-soft)',
        textAlign: 'center',
      }}>
        ยังไม่มีวิชาในปีนี้ — กลับไปเลือกปีอื่นได้
      </div>
    );
  }

  // Pre-index Q by id + bucket bookmarks per subject. Done ONCE here so
  // each card's lookup is O(1). Without this, the per-card .find() loops
  // produced O(subjects × bookmarks × questions) work — ~700K ops on a
  // user with 50 bookmarks across 8 Y4 subjects + 1700 Q bank.
  const bookmarksBySubject = {};
  if (Array.isArray(bookmarks) && bookmarks.length > 0) {
    const qById = new Map();
    for (const q of questions) qById.set(q.id, q);
    for (const qId of bookmarks) {
      const q = qById.get(qId);
      if (q?.subject) bookmarksBySubject[q.subject] = (bookmarksBySubject[q.subject] || 0) + 1;
    }
  }

  // Compute per-subject accuracy from history. History entries are
  // {date, questionId, correct, subject} — same fields the finishExam
  // path writes. We use the LAST 90 days of attempts to keep the
  // accuracy current (a 50% from 6 months ago shouldn't drag down a
  // recently-mastered subject's display). Min 5 attempts to avoid
  // misleading "100% (1/1)" displays.
  const accBySubject = {};
  if (Array.isArray(history) && history.length > 0) {
    const cutoffMs = Date.now() - 90 * 24 * 60 * 60 * 1000;
    for (const h of history) {
      if (!h?.subject || (h.date && h.date < cutoffMs)) continue;
      if (!accBySubject[h.subject]) accBySubject[h.subject] = { total: 0, correct: 0 };
      accBySubject[h.subject].total++;
      if (h.correct) accBySubject[h.subject].correct++;
    }
  }

  return (
    <div className="vmx-subject-grid">
      {subjects.map((s) => {
        const count = visibleQuestionCount(s.id, questions);
        // `scaffold: true` is an explicit flag for placeholder subjects.
        // Use that as the source of truth — `count === 0` alone could
        // misclassify a real subject that we just haven't filled with Qs.
        const isScaffold = !!s.scaffold;
        const isEmpty = count === 0 && !isScaffold;

        // Per-subject progress (Phase 3) — readingChecklist + bookmarks
        // are local-storage backed and cheap to compute.
        const topics = Array.isArray(s.topics) ? s.topics.filter((t) => !t.hidden) : [];
        const readDone = topics.filter((t) => readingChecklist[t.id]).length;
        // O(1) lookup using bookmarksBySubject precomputed above
        const bookmarkCount = isScaffold ? 0 : (bookmarksBySubject[s.id] || 0);
        const readPct = topics.length > 0 ? Math.round((readDone / topics.length) * 100) : 0;

        return (
          <button
            key={s.id}
            className="vmx-subject-card"
            onClick={() => onPick && onPick(s)}
            style={{
              opacity: isEmpty ? 0.6 : (isScaffold ? 0.7 : 1),
              cursor: 'pointer',
            }}
            title={
              isScaffold ? 'คลิกเพื่อช่วยเติมเนื้อหา (ส่ง slide/notes/past paper)'
              : isEmpty ? 'ยังไม่มีข้อสอบ — คลิกเพื่อขอเพิ่มเนื้อหา'
              : ''
            }
          >
            <div className="accent" style={{ background: s.color }}></div>
            <div className="icon">{s.icon}</div>
            <div className="title">{s.name}</div>
            <div className="sub">{s.name_en}</div>
            <div className="count" style={{ color: isScaffold ? 'var(--clr-gold)' : (isEmpty ? 'var(--clr-rose)' : 'var(--clr-ink-soft)') }}>
              {isScaffold
                ? `🚧 รอเติมเนื้อหา${s.vault_lecturers?.length ? `, ${s.vault_lecturers.length} faculty` : ''}`
                : (isEmpty ? '🚧 รอข้อสอบเพิ่ม' : `${count} questions`)}
            </div>

            {/* Per-subject progress chips — only when LIVE + has data.
                Accuracy chip shown when ≥5 attempts (avoids "100% (1/1)"
                misleading display). Color: rose <60, gold 60-79, sage ≥80. */}
            {!isScaffold && !isEmpty && (() => {
              const acc = accBySubject[s.id];
              const hasAccData = acc && acc.total >= 5;
              const accPct = hasAccData ? Math.round((acc.correct / acc.total) * 100) : 0;
              const accColor = hasAccData
                ? (accPct < 60 ? 'var(--clr-rose)' : (accPct < 80 ? 'var(--clr-gold)' : 'var(--clr-sage)'))
                : 'var(--clr-ink-soft)';
              const showAny = readDone > 0 || bookmarkCount > 0 || hasAccData;
              if (!showAny) return null;
              return (
                <div style={{
                  marginTop: 6,
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--clr-ink-soft)',
                }}>
                  {hasAccData && (
                    <span title={`ตอบถูก ${acc.correct}/${acc.total} ใน 90 วันล่าสุด`} style={{ color: accColor, fontWeight: 600 }}>
                      🎯 {accPct}%
                    </span>
                  )}
                  {readDone > 0 && (
                    <span title={`อ่านแล้ว ${readDone}/${topics.length} หัวข้อ`}>
                      📚 {readPct}%
                    </span>
                  )}
                  {bookmarkCount > 0 && (
                    <span title={`มี bookmark ${bookmarkCount} ข้อในวิชานี้`}>
                      🔖 {bookmarkCount}
                    </span>
                  )}
                </div>
              );
            })()}

            {s.code && (
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', opacity: 0.7, marginTop: 2 }}>
                {s.code}
              </div>
            )}
            {s.examFormat && !isScaffold && (
              <div style={{
                marginTop: 6,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'var(--clr-surface-2)',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--clr-ink-soft)',
                display: 'inline-block',
                letterSpacing: '0.05em',
              }}>
                📝 {s.examFormat.weight}
                {s.examFormat.choiceCount && `, ${s.examFormat.choiceCount} ช้อยส์`}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Onboarding Tour ─────────────────────────────────────────────
// First-visit walkthrough — 3 steps explaining the layout. Dismissible
// at any step (saves to localStorage so it never shows again on this
// browser). Modal overlay; doesn't block JS but visually blocks clicks
// behind it via backdrop.
function OnboardingTour({ step, onNext, onDismiss }) {
  const steps = [
    {
      icon: '👋',
      title: 'ยินดีต้อนรับสู่ VetMock',
      body: 'คลังข้อสอบ + Notes + คลิป สำหรับสัตวแพทย์จุฬา ทุกชั้นปี\nค่อย ๆ พาทัวร์ 3 จุดสำคัญก่อนเริ่มใช้',
      cta: 'ถัดไป →',
    },
    {
      icon: '📚',
      title: 'เริ่มจาก "เลือกวิชา"',
      body: 'หน้าแรกจะแสดงวิชาในปีของคุณ\nคลิกวิชาไหน → จะเข้าหน้าเลือกหัวข้อ + ปุ่มฝึกซ้อม / สอบจริง / Notes / คลิป\n\nวิชาที่ยังไม่มีเนื้อหา (PREVIEW) คลิกได้ — จะพาไปแบบฟอร์มขอเพิ่มข้อสอบ',
      cta: 'ถัดไป →',
    },
    {
      icon: '🎯',
      title: 'Smart Presets ดูจาก progress',
      body: 'เมื่อใช้ไปสักพัก ระบบจะแสดง smart cards ให้:\n• 📅 ใกล้สอบ — ซ้อมวิชาที่กำลังจะสอบ\n• ⚠️ จุดอ่อน — ซ้อมวิชา/หัวข้อที่ตอบผิดบ่อย\n• 🔁 ทำซ้ำ — config ของ session ล่าสุด\n\nไม่ต้องไป config เอง',
      cta: 'ถัดไป →',
    },
    {
      icon: '🎓',
      title: 'Header อยู่ทุกหน้า',
      body: '🎓 ปี ▾ — สลับชั้นปีได้ตลอด\n🔍 ⌘K — ค้นหาเร็ว\n📊 — Analytics\n🔖 — Bookmarks\n🌙 — สลับโหมดมืด/สว่าง\n\nลุยเลย!',
      cta: 'เริ่มใช้',
    },
  ];

  const current = steps[step] || steps[0];
  const isLast = step >= steps.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--clr-bg)',
          border: '1px solid var(--clr-border)',
          borderRadius: 16,
          padding: 28,
          maxWidth: 460,
          width: '100%',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          aria-label="ข้าม onboarding"
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            fontSize: 18,
            color: 'var(--clr-ink-soft)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
          }}
          title="ข้าม"
        >×</button>

        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 12 }}>{current.icon}</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, margin: '0 0 10px', lineHeight: 1.2 }}>
          {current.title}
        </h2>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink)', whiteSpace: 'pre-line', marginBottom: 18 }}>
          {current.body}
        </div>

        {/* Dots indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? 18 : 8,
                height: 8,
                borderRadius: 8,
                background: i === step ? 'var(--clr-sage)' : 'var(--clr-border)',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--clr-ink-soft)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            ข้าม
          </button>
          <button
            type="button"
            className="vmx-btn vmx-btn-primary"
            onClick={isLast ? onDismiss : onNext}
            style={{ background: 'var(--clr-sage)', borderColor: 'var(--clr-sage)' }}
          >
            {current.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small kind pill (เขียว/ทอง/กลาง) ────────────────────────────
function KindPill({ kind }) {
  const styles = {
    feature: { bg: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-sage)', label: 'ใหม่' },
    fix: { bg: 'rgba(184, 137, 64, 0.15)', color: 'var(--clr-gold)', label: 'แก้บั๊ก' },
    content: { bg: 'var(--clr-surface-2)', color: 'var(--clr-ink-soft)', label: 'เพิ่มเนื้อหา' },
  };
  const s = styles[kind] || styles.content;
  return (
    <span
      style={{
        marginLeft: 'auto',
        padding: '2px 8px',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      {s.label}
    </span>
  );
}
