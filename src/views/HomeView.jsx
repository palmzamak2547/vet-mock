import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { QB } from '../data/questions.js';
// Phase 2 perf: lightweight precomputed Q counts for header/total
// displays — keeps "1,612 ข้อ" labels cheap and doesn't require the
// full QB to be scanned on every re-render.
import { QB_TOTAL, Q_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT, Q_COUNTS_BY_YEAR } from '../data/q-counts.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate, shortCountdown } from '../data/schedule.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, CURRENT_YEAR, visibleQuestionCount } from '../data/curriculum.js';
import { LATEST_CHANGELOG, SCOPE_LABELS } from '../data/changelog.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { pickTodaysQ, readTodaysQStatus, dailyQStreak } from '../lib/daily-q.js';
// Phase Wrapped banner — surfaces a Spotify-Wrapped-style recap once
// a phase ends. Cheap helpers; the heavy canvas + card UI is lazy.
import { getCompletedPhase, isWrappedDismissed, markWrappedDismissed } from '../lib/phase-wrapped.js';

// DailyGoalCard is lazy-loaded — it only renders if there's history,
// and most users will see it after some interaction. Keeps HomeView's
// shell as small as possible.
const DailyGoalCard = lazy(() => import('../components/DailyGoalCard.jsx'));
// StudyBuddiesPanel — Supabase presence-driven, only meaningful when
// other users are online too. Lazy so its lookup table doesn't bloat
// the cold home render.
const StudyBuddiesPanel = lazy(() => import('../components/StudyBuddiesPanel.jsx'));
// A2HS prompt chip — lazy because most users will dismiss or already
// have it installed; no need to ship the iOS-tip modal HTML eagerly.
const PWAInstallChip = lazy(() => import('../components/PWAInstallChip.jsx'));
// Daily Q modal — single MCQ habit loop, deterministic per-date pick.
const TodaysQModal = lazy(() => import('../components/TodaysQModal.jsx'));
// NextActionCard — "study coach" surface (one primary action card with
// up to 3 personalised picks: exam-soon · SR due · wrong streak · weak
// subject · random fallback). Replaces the "menu of tools" feel called
// out in Palm's friend's review.
import NextActionCard from '../components/NextActionCard.jsx';
// QuestsPanel — Duolingo-style daily quests. Lazy because most users
// won't need it on first paint, and it pulls in quests + xp libs
// (~15KB combined). Mounted under the streak chip row.
const QuestsPanel = lazy(() => import('../components/QuestsPanel.jsx'));

// onlineCount/onlineStatus are now passed as props (hook lives in App
// so the WebSocket presence survives view changes — see App.jsx).
// Phase metadata for label rendering. Mirrors PhaseSelectView's PHASES.
const PHASE_LABELS = {
  '1-mid':   { thai: 'เทอม 1 กลางภาค', short: 'เทอม 1 กลาง',  semester: 1, icon: '📚' },
  '1-final': { thai: 'เทอม 1 ปลายภาค', short: 'เทอม 1 ปลาย',  semester: 1, icon: '🎯' },
  '2-mid':   { thai: 'เทอม 2 กลางภาค', short: 'เทอม 2 กลาง',  semester: 2, icon: '📖' },
  '2-final': { thai: 'เทอม 2 ปลายภาค', short: 'เทอม 2 ปลาย',  semester: 2, icon: '🏁' },
};

export default function HomeView({ setView, setMode, setSubject, setTopic, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, startExam, cardStats, bookmarks, customQuestions, user, profile, readingChecklist = {}, onlineCount = 0, onlineStatus = 'disabled', selectedYear = CURRENT_YEAR, setSelectedYear, selectedPhase, setSelectedPhase, pendingResume, resumePendingExam, dismissPendingExam, history = [], setFeedbackPrefill, buddies = {} }) {
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

  // Question count — must match what YearSelectView shows for the same year:
  // strict `year === N` Qs + cross-rotation VCA Qs + user custom Qs.
  // Reads from precomputed q-counts.js (Phase 2 perf) instead of
  // scanning the full QB — keeps this count cheap on every re-render
  // and doesn't depend on the full Q-bank being loaded.
  const totalQ = (() => {
    const yearQ = Q_COUNTS_BY_YEAR[selectedYear] || 0;
    const vcaQ = Q_COUNTS_BY_SUBJECT['vca'] || 0;
    const customQ = (customQuestions?.length || 0);
    return yearQ + vcaQ + customQ;
  })();

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

  // Onboarding tour — opt-in via a friendly banner.
  //
  // Old design: auto-modal on first visit. Problem — new users landed
  // on the page, hit a blocker, had to read 4 slides before they could
  // even SEE the home screen. Conversion-killer.
  // New design: a small dismissible banner ("👋 มาทัวร์ก่อนไหม?") with
  // a "ลองทัวร์" CTA that opens the tour modal on demand. First impression
  // is now the actual home page; tour is opt-in.
  const [welcomeDismissed, setWelcomeDismissed] = useLocalStorage('vmx-welcome-dismissed', false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  // Legacy flag — once true, hide the welcome banner too (users who
  // already saw + dismissed the old auto-modal don't need the banner).
  const [legacyOnboardingSeen] = useLocalStorage('vmx-onboarding-seen', false);
  const showWelcome = !welcomeDismissed && !legacyOnboardingSeen;

  // Email-verify banner dismiss — session-only state. We don't persist
  // because we WANT a gentle re-nag if they ignore it across sessions
  // until they actually verify. Once verified, the banner disappears
  // permanently because user.email_confirmed_at flips truthy.
  const [verifyDismissed, setVerifyDismissed] = useState(false);

  // Streak-freeze toast: when updateStreak in App.jsx consumes the
  // one-time freeze (user missed a day but kept streak ≥5), it fires
  // a 'vmx-streak-freeze-used' window event with the new streak as
  // detail. We surface a small banner so the user understands why
  // their streak survived — without it the save is silent and the
  // user might assume the streak system is broken.
  const [freezeNotice, setFreezeNotice] = useState(null);
  useEffect(() => {
    const onFreeze = (e) => {
      setFreezeNotice({ streak: e.detail || 0, ts: Date.now() });
      // Auto-dismiss after 12s. Persistent enough to read but doesn't
      // linger across views.
      setTimeout(() => setFreezeNotice(null), 12_000);
    };
    window.addEventListener('vmx-streak-freeze-used', onFreeze);
    return () => window.removeEventListener('vmx-streak-freeze-used', onFreeze);
  }, []);

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
  //
  // Memoised on `history` — without this, the 60s tick interval
  // re-ran the entire scan + Map build + sort on every tick.
  // For a power user with 1000+ history rows that was ~5-20ms of
  // synchronous work every minute, plus the same cost on every
  // unrelated re-render (subject swap, modal open, etc.).
  const quickStats = useMemo(() => {
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
  }, [history]);

  // Quick action: random 1 Q from full QB. Goes STRAIGHT into ExamView
  // via startExam({overrides}) — bypasses ConfigView so the user gets
  // the question in 1 click instead of 2. Bug fixed 2026-05-16: was
  // routing to 'config' with setSubject(null), which made startExam see
  // subject=null → pool filter `q.subject === null` returned empty →
  // "ไม่มีข้อสอบในหมวดนี้" alert. Now uses startExam overrides so
  // there's no async state-batching gap.
  const allQuestionsPool = QB_TOTAL + (customQuestions?.length || 0);
  const launchRandomQ = () => {
    if (allQuestionsPool === 0) return;
    // We do BOTH: setState to update React state for downstream effects
    // (the timer useEffect in App.jsx reads useTimer from state — if we
    // don't setUseTimer(false), it sees the default `true` and auto-fires
    // finishExam on a 1-Q exam with timeLeft=0 → user lands on results
    // 0/1 without ever seeing the question). Plus overrides to startExam
    // so its pool/time calc doesn't race React's async state batching.
    if (setMode) setMode('quick');
    if (setSubject) setSubject('all');
    if (setTopic) setTopic(null);
    if (setPracticeMode) setPracticeMode('all');
    if (setNumQuestions) setNumQuestions(1);
    if (setUseTimer) setUseTimer(false);
    if (startExam) {
      startExam({
        practiceMode: 'all',
        subject: 'all',
        topic: null,
        questionCategory: 'all',
        numQuestions: 1,
        useTimer: false,
      });
    }
  };

  // Subject accuracy in the last 90 days — used by NextActionCard
  // to pick the weakest subject + by SubjectGrid card chips. Lifted
  // here so we only iterate `history` once. ≥5 attempts gating handled
  // by consumers (avoids "100% (1/1)" misleading display).
  const accBySubject = useMemo(() => {
    const acc = {};
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    if (!Array.isArray(history)) return acc;
    for (const h of history) {
      if (!h?.subject || h.date == null) continue;
      const ts = new Date(h.date).getTime();
      if (ts < cutoff) continue;
      if (!acc[h.subject]) acc[h.subject] = { total: 0, correct: 0 };
      acc[h.subject].total++;
      if (h.correct) acc[h.subject].correct++;
    }
    return acc;
  }, [history]);

  // Quick action: review questions answered wrong (cross-subject).
  // Uses the same pattern as bookmarks practiceMode — just a different
  // pool source. Sorted by wrong-frequency so the user sees their
  // most-confused Qs first. Goes 1-click direct to ExamView via
  // startExam overrides (matches the random-Q fix 2026-05-16).
  const launchWrongReview = () => {
    if (quickStats.wrongCount === 0) return;
    const n = Math.min(quickStats.wrongCount, 50);
    if (setMode) setMode('quick');
    if (setSubject) setSubject('all');
    if (setTopic) setTopic(null);
    if (setPracticeMode) setPracticeMode('wrong');
    if (setNumQuestions) setNumQuestions(n);
    if (setUseTimer) setUseTimer(false);
    if (startExam) {
      startExam({
        practiceMode: 'wrong',
        subject: 'all',
        topic: null,
        questionCategory: 'all',
        numQuestions: n,
        useTimer: false,
      });
    }
  };

  // ─── Phase Wrapped banner state ───────────────────────────
  // `getCompletedPhase` returns the most recently completed phase
  // (and reads its dismissed-state via localStorage internally).
  // We re-read on `wrappedTick` so dismissing the banner removes
  // it without a full page reload. Hidden on scaffold years.
  const [wrappedTick, setWrappedTick] = useState(0);
  const completedPhase = useMemo(() => {
    if (isScaffoldYear) return null;
    try { return getCompletedPhase(); } catch { return null; }
    // wrappedTick is read implicitly via the dismiss-state check —
    // include it as a dep so the memo invalidates when the user
    // clicks "ปิด" below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScaffoldYear, wrappedTick]);
  const showWrappedBanner = completedPhase && !isWrappedDismissed(completedPhase.id);

  // ─── Banner priority winner — Phase 1 (2026-05-18) ─────────────
  // Palm spec: "Banner priority rule — แสดงได้ครั้งละ 1 banner เท่านั้น".
  // Priority: pendingResume > wrapped > welcome > verify-email > announcement.
  // (Standalone exam countdown is REMOVED — NextActionCard already
  //  surfaces "ติว <subject>" when an exam is within 7 days.)
  // NextActionCard renders regardless of bannerWinner; it's the always-on
  // coach surface, not a "banner".
  const _emailUnverified = user && !user.email_confirmed_at && !verifyDismissed;
  const bannerWinner = pendingResume
    ? 'pendingResume'
    : showWrappedBanner
      ? 'wrapped'
      : showWelcome
        ? 'welcome'
        : _emailUnverified
          ? 'verify'
          : showAnnouncement
            ? 'announcement'
            : null;
  // Compact changelog chip shown in the quick-action row when there's
  // an unread changelog AND the announcement banner lost the priority
  // race (e.g. resume/wrapped won). Click → expand banner ("force show").
  const showChangelogChip = showAnnouncement && bannerWinner !== 'announcement';
  const [forceChangelogOpen, setForceChangelogOpen] = useState(false);

  // ─── Phase 6 (2026-05-18) — eager-prefetch downstream chunks ────
  // ExamView, ResultsView, ReviewView are lazy-loaded. On first click
  // of "ฝึก 1 ข้อด่วน" we hit a chunk-fetch round trip (~50-500ms cold).
  // Prefetching on idle after HomeView mounts puts the chunks in the
  // browser cache so click → mount feels instant. Cheap (browser can
  // throttle), safe (catch errors), zero UX cost.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const prefetch = () => {
      if (cancelled) return;
      import('./ExamView.jsx').catch(() => {});
      import('./ResultsView.jsx').catch(() => {});
      import('./ReviewView.jsx').catch(() => {});
    };
    const idle = window.requestIdleCallback
      || ((cb) => setTimeout(cb, 1500));
    const id = idle(prefetch, { timeout: 3000 });
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof id === 'number') {
        try { window.cancelIdleCallback(id); } catch {}
      }
    };
  }, []);

  // ─── Phase 4 (2026-05-18) — QuestsPanel inline action routing ───
  // QuestsPanel passes back an { kind, subject? } action when user
  // clicks "▶️ ลุย" on an incomplete quest. Map to existing handlers
  // so quests are 1-tap actionable instead of just progress bars.
  const handleQuestStart = (action /*, quest */) => {
    if (!action) return;
    if (action.kind === 'random') {
      launchRandomQ();
      return;
    }
    if (action.kind === 'sr') {
      setMode && setMode('sr');
      setView('sr-session');
      return;
    }
    if (action.kind === 'subject' && action.subject) {
      setSubject && setSubject(action.subject);
      setView('topic-select');
      return;
    }
    if (action.kind === 'subject-select') {
      setView('subject-select');
      return;
    }
  };

  return (
    <>
      {tourOpen && (
        <OnboardingTour
          step={tourStep}
          onNext={() => setTourStep((s) => s + 1)}
          onDismiss={() => { setTourOpen(false); setTourStep(0); setWelcomeDismissed(true); }}
        />
      )}
      <div className="vmx-hero">
        <h1>
          {user
            ? <>สวัสดี <em>{profile?.username || 'เพื่อน'}</em></>
            : <>เริ่ม <em>ฝึกโจทย์</em> กันเลย</>}
        </h1>
        <p>
          {isScaffoldYear
            ? <>🚧 <strong>{yearMeta.label}</strong>, {yearMeta.desc}, พรีวิว — รอเติมเนื้อหา</>
            : <>คลังโจทย์ฝึก <strong>{totalQ}</strong> ข้อ, {yearMeta?.label || 'ปี 4'}</>}
        </p>
      </div>

      {/* Phase Wrapped banner — surfaces a Spotify-Wrapped-style recap
          once the most recent exam phase has finished. Self-contained:
          dismiss writes to localStorage via markWrappedDismissed and
          we bump `wrappedTick` to invalidate the memo. */}
      {bannerWinner === 'wrapped' && (
        <div
          style={{
            marginBottom: 18,
            padding: '14px 16px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(184,137,64,0.18), rgba(184,137,64,0.08))',
            border: '1px solid var(--clr-gold, #b88940)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: 30,
              animation: 'vmx-wrapped-pulse 2.6s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            🎉
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
              📊 Phase Wrapped
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, marginTop: 2, lineHeight: 1.4 }}>
              {completedPhase.label} จบแล้ว! ดูสรุปการเรียนของคุณ
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="vmx-btn vmx-btn-primary"
              style={{ background: 'var(--clr-gold, #b88940)', borderColor: 'var(--clr-gold, #b88940)', minHeight: 44, fontSize: 13 }}
              onClick={() => setView('phase-wrapped')}
              aria-label="ดูสรุปการเรียนของเทอมที่จบ"
            >
              ✨ ดูสรุป →
            </button>
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              style={{ minHeight: 44, fontSize: 13 }}
              onClick={() => {
                markWrappedDismissed(completedPhase.id);
                setWrappedTick((n) => n + 1);
              }}
              aria-label="ปิดประกาศ Phase Wrapped"
            >
              ปิด
            </button>
          </div>
          {/* Keyframe lives inline so we don't depend on a global stylesheet
              edit. Respects prefers-reduced-motion via media query. */}
          <style>{`
            @keyframes vmx-wrapped-pulse {
              0%, 100% { transform: scale(1); }
              50%      { transform: scale(1.18); }
            }
            @media (prefers-reduced-motion: reduce) {
              [aria-hidden="true"] { animation: none !important; }
            }
          `}</style>
        </div>
      )}

      {/* Study coach surface — primary "วันนี้ทำอะไรดี" card. Picks 1-3
          personalised actions from real history/SR/exam data. See
          components/NextActionCard.jsx for the priority algorithm.
          Hidden on scaffold years (no Qs to coach against). */}
      {!isScaffoldYear && (
        <NextActionCard
          nextExam={nextExam}
          quickStats={quickStats}
          cardStats={cardStats}
          accBySubject={accBySubject}
          subjects={yearSubjects}
          history={history}
          onPickExamPrep={(exam) => {
            if (exam?.subject) {
              setSubject && setSubject(exam.subject);
              setView('topic-select');
            } else {
              setView('schedule');
            }
          }}
          onPickSR={() => { setMode && setMode('sr'); setView('sr-session'); }}
          onPickWrong={launchWrongReview}
          onPickWeakSubject={(subjectId) => {
            setSubject && setSubject(subjectId);
            setView('topic-select');
          }}
          onPickRandom={launchRandomQ}
        />
      )}

      {/* Welcome banner — first-time users see this instead of a
          blocking modal. One-tap to start the tour, X to dismiss. */}
      {bannerWinner === 'welcome' && (
        <div style={{
          marginBottom: 16,
          padding: '12px 14px',
          borderRadius: 12,
          background: 'var(--clr-surface)',
          border: '1px dashed var(--clr-sage)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 24, lineHeight: 1 }}>👋</div>
          <div style={{ flex: 1, minWidth: 180, fontSize: 13, lineHeight: 1.5 }}>
            <strong>ยินดีต้อนรับสู่ VetMock</strong> · ทัวร์ 4 จุดสำคัญใช้เวลา 30 วินาที
          </div>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => { setTourOpen(true); setTourStep(0); }}
          >
            🚀 ลองทัวร์
          </button>
          <button
            type="button"
            aria-label="ปิดข้อความต้อนรับ"
            onClick={() => setWelcomeDismissed(true)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: 14,
              color: 'var(--clr-ink-soft)',
              fontFamily: 'inherit',
            }}
            title="ข้าม"
          >
            ×
          </button>
        </div>
      )}

      {/* Email verification reminder — for users who signed up but
          haven't clicked the link yet. Dismissible per-session via
          state (not localStorage — gentle re-nag on next visit). */}
      {bannerWinner === 'verify' && (
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
      {bannerWinner === 'pendingResume' && (() => {
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

      {/* Next exam countdown banner — only show for 8-30 day window.
          When ≤7 days, NextActionCard already surfaces "ติว <subject>"
          as its top action, so the dedicated banner is redundant and
          steals real-estate from the subject grid. */}
      {nextExam && nextExam.daysLeft > 7 && nextExam.daysLeft <= 30 && (
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

      {/* What's-new announcement — auto-dismissed once seen.
          Only renders as a banner when it wins the priority race; if it
          lost (e.g. resume/wrapped won), the changelog appears as a
          dismissible chip in the quick-action row below instead. */}
      {(bannerWinner === 'announcement' || forceChangelogOpen) && (
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
              {/* Hide the raw version string (5.22.7) — it's developer
                  metadata; users only care that there's a new update
                  and when. Version stays accessible in About + via the
                  detail expander below for users who want it. */}
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                อัปเดตใหม่ · {fmtThaiDate(LATEST_CHANGELOG.date)}
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
          {freezeNotice && (
            <div
              className="vmx-pop-in"
              role="status"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(74, 107, 74, 0.12)',
                border: '1px solid var(--clr-sage)',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                color: 'var(--clr-sage)',
              }}
              title="ระบบใช้ Streak Freeze 1 ครั้ง — streak ของคุณรอด"
            >
              ❄️ Streak Freeze ใช้แล้ว · streak {freezeNotice.streak} วันรอด
            </div>
          )}
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

      {/* Changelog chip — Phase 1 (2026-05-18): when the announcement
          banner lost the priority race, surface "📰 อัปเดตใหม่ {N}" as
          a 1-tap chip in this row instead of a full card. Clicking it
          force-opens the banner below for users who want details. */}
      {showChangelogChip && (
        <div style={{ marginBottom: 14 }}>
          <button
            type="button"
            onClick={() => setForceChangelogOpen(true)}
            className="vmx-chip-quick"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(184, 137, 64, 0.10)',
              border: '1px solid var(--clr-gold, #b88940)',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--clr-gold, #b88940)',
            }}
            title="ดูรายละเอียดอัปเดตล่าสุด"
          >
            📰 อัปเดตใหม่{LATEST_CHANGELOG?.changes?.length ? ` ${LATEST_CHANGELOG.changes.length} รายการ` : ''}
          </button>
        </div>
      )}

      {/* Gamification + community block (QuestsPanel + DailyGoal + Daily Q
          + Race + StudyBuddies + PWA install) — Phase 1 (2026-05-18):
          moved BELOW the Subject Grid + Practice modes so the core
          "วิชาใน[ปี X]" + smart presets get the prime mobile real-estate.
          Per Palm: "Subject list ต้องโผล่ในจอแรกหรือเกือบจอแรก". */}

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
        // Phase 2/3 perf: SubjectGrid uses precomputed visible counts
        // (Q_VISIBLE_COUNTS_BY_SUBJECT) for the per-card badge instead of
        // scanning the full QB. Only customQuestions need to be passed
        // through since those are user-local and never end up in
        // q-counts.js. The component computes
        //   count = Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] + customQs.filter(...)
        customQuestions={customQuestions || []}
        readingChecklist={readingChecklist}
        bookmarks={bookmarks}
        history={history}
        accBySubject={accBySubject}
        onPick={(s) => {
          // Routing precedence:
          //   1. has_notes (scaffold or empty-LIVE but Notes available) →
          //      topic-select. Notes button works; Exam/SR buttons disabled.
          //   2. otherwise scaffold/empty → feedback (request content).
          //   3. has_questions → topic-select normally.
          const totalQ = (Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0)
            + (customQuestions || []).filter((q) => q.subject === s.id).length;
          const hasUsableContent = totalQ > 0 || s.has_notes === true;
          if (!hasUsableContent) {
            if (setFeedbackPrefill) {
              const reason = s.scaffold
                ? 'อยากให้เพิ่มเนื้อหา'
                : 'วิชานี้ยังไม่มีโจทย์ฝึก — มี slide/notes/โน้ตทบทวนส่งมาช่วยได้ไหม';
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
              <div className="sub">50 ข้อ × 60 วิ, จับเวลาเหมือนสนามจริง</div>
            </button>

            <button className="vmx-mode-card" onClick={() => { setMode('sr'); setView('sr-session'); }}>
              <div className="icon">🧠</div>
              <div className="title">Spaced Repetition</div>
              <div className="sub">
                {/* `cardStats.due` is now reviewed-only (sm2.js fix on
                    2026-05-13) so fresh users see "0 ข้อค้าง" instead
                    of the entire QB. SR is rapid — most users finish a
                    card in ~15 sec, so 4 cards/min budget, suggestion
                    capped at 30 min/day so users feel they can hit it. */}
                {cardStats.due > 0
                  ? `${cardStats.due} ข้อค้างทบทวน · แนะนำวันละ ~${Math.min(30, Math.max(5, Math.ceil(cardStats.due / 4 / 5) * 5))} นาที`
                  : 'ทบทวนแบบ Anki — ตอบผิด/ลังเลแล้วระบบจะนำมา review ในรอบถัดไป'}
              </div>
              {cardStats.due > 0 && <div className="badge">{cardStats.due}</div>}
            </button>

          </div>
        </>
        );
      })()}

      {/* ─── Gamification + community block — Phase 1 (2026-05-18) ────
          Quests + DailyGoal + StudyBuddies + DailyQ + Race + PWA install.
          Lives BELOW the core Subject + Practice mode grids so first-
          paint mobile real-estate goes to studying, not gamification.
          Quests now have per-quest "▶️ ลุย" action buttons (Phase 4)
          wired to handleQuestStart. */}

      {/* Daily Quests panel — 3 randomized quests resets at local
          midnight. Hidden on scaffold years (no Q bank to act against)
          so empty quests don't taunt users on Y1–Y3 / Y5–Y6 shells. */}
      {!isScaffoldYear && (
        <Suspense fallback={null}>
          <div style={{ marginTop: 28 }}>
            <QuestsPanel onStart={handleQuestStart} />
          </div>
        </Suspense>
      )}

      {/* Daily goal card — only mount once user has history. Avoids
          showing an empty quota widget to brand-new visitors. */}
      {history.length > 0 && (
        <Suspense fallback={null}>
          <div style={{ marginBottom: 18 }}>
            <DailyGoalCard history={history} />
          </div>
        </Suspense>
      )}

      {/* Study buddies — Supabase presence list. Hidden when no buddies
          are present (StudyBuddiesPanel returns null). */}
      {user && Object.keys(buddies || {}).length > 1 && (
        <Suspense fallback={null}>
          <StudyBuddiesPanel
            buddies={buddies}
            selfUserId={user?.id}
            onJumpToSubject={(subjectId) => {
              setSubject?.(subjectId);
              setMode?.('quick');
              setView('subject-select');
            }}
          />
        </Suspense>
      )}

      {/* Daily Q + Race + PWA install — entry points share one row */}
      <DailyQRow user={user} setView={setView} />
      <div style={{ marginBottom: 18, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {user && (
          <button
            type="button"
            onClick={() => setView('race')}
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            🏁 แข่งกับเพื่อน (Race mode)
          </button>
        )}
        <Suspense fallback={null}>
          <PWAInstallChip />
        </Suspense>
      </div>

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

      {/* Tips footer — only for first-time users (pre-welcome-dismiss).
          Returning users have absorbed these already; hiding declutters
          the home view. The welcome tour covers the same shortcuts. */}
      {showWelcome && (
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
function SubjectGrid({ subjects, customQuestions = [], readingChecklist = {}, bookmarks = [], history = [], accBySubject = {}, onPick }) {
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

  // Phase 2/3 perf: bookmarks-per-subject indexing.
  //
  // Previously this took the full merged Q array and built a Map from
  // q.id → q to look up each bookmark's subject. That forced HomeView
  // to import + scan the whole QB on every render.
  //
  // New approach: bookmark IDs live in a flat array in localStorage.
  // We KNOW each Q has a `subject`, but we don't know it from the
  // bookmark side. Until bookmark storage migrates to {id, subject}
  // pairs (separate refactor), we lazy-import QB ONLY when the user
  // has ≥1 bookmark — most users start with 0 so most renders avoid
  // the cost entirely. The fallback path is sync via the module's
  // top-level QB import (still present in this view for SR-related
  // paths until Phase 3b ships); when Phase 3b lazies that too, this
  // section will gain its own async load.
  const bookmarksBySubject = {};
  if (Array.isArray(bookmarks) && bookmarks.length > 0) {
    const qById = new Map();
    for (const q of QB) qById.set(q.id, q);
    for (const q of customQuestions) qById.set(q.id, q);
    for (const qId of bookmarks) {
      const q = qById.get(qId);
      if (q?.subject) bookmarksBySubject[q.subject] = (bookmarksBySubject[q.subject] || 0) + 1;
    }
  }

  // accBySubject computed at parent (HomeView) level — passed in via
  // props so NextActionCard + SubjectGrid share one iteration.

  return (
    <div className="vmx-subject-grid">
      {subjects.map((s) => {
        // Use precomputed visible counts + custom-Q overlay so this
        // render path never iterates the full QB. Saves ~5 ms per
        // HomeView re-render with the year's typical 8 subjects.
        const builtInCount = Q_VISIBLE_COUNTS_BY_SUBJECT[s.id] || 0;
        const customCount = customQuestions.filter((q) => q.subject === s.id).length;
        const count = builtInCount + customCount;
        // `scaffold: true` is an explicit flag for placeholder subjects.
        const isScaffold = !!s.scaffold;
        const isEmpty = count === 0 && !isScaffold;
        // Scaffold subjects that have notes available are still useful —
        // user can read 📖 Notes even though Q bank is empty. Render
        // them at normal opacity so they don't look "abandoned".
        const hasUsableContent = count > 0 || s.has_notes === true;

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
              opacity: hasUsableContent ? 1 : (isEmpty ? 0.6 : 0.7),
              cursor: 'pointer',
            }}
            title={
              s.has_notes && count === 0 ? '📖 มี Notes — คลิกอ่านสรุปได้, ข้อสอบยังไม่มี'
              : isScaffold ? 'คลิกเพื่อช่วยเติมเนื้อหา (ส่ง slide/notes/past paper)'
              : isEmpty ? 'ยังไม่มีข้อสอบ — คลิกเพื่อขอเพิ่มเนื้อหา'
              : ''
            }
          >
            <div className="accent" style={{ background: s.color }}></div>
            <div className="icon">{s.icon}</div>
            <div className="title">{s.name}</div>
            {/* Only show English subtitle when it adds info beyond the
                Thai title. Avoids "COM III / C ANI CLI SCI III, Companion
                Animal" double-line on small cards. */}
            {s.name_en && s.name_en.toLowerCase() !== s.name.toLowerCase() && (
              <div className="sub">{s.name_en}</div>
            )}
            <div className="count" style={{ color: count > 0 ? 'var(--clr-ink-soft)' : (s.has_notes ? 'var(--clr-sage)' : (isScaffold ? 'var(--clr-gold)' : 'var(--clr-rose)')) }}>
              {count > 0
                ? `${count} ข้อ${s.scaffold ? ' · PREVIEW' : ''}`
                : s.has_notes
                  ? `📖 มี Notes${s.vault_lecturers?.length ? ` · ${s.vault_lecturers.length} faculty` : ''}`
                  : isScaffold
                    ? `🚧 รอเติมเนื้อหา${s.vault_lecturers?.length ? `, ${s.vault_lecturers.length} faculty` : ''}`
                    : '🚧 รอข้อสอบเพิ่ม'}
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

            {/* Removed: 7-digit course code (3106417…). It's already
                searchable via the command palette and adds visual noise
                without helping users decide which card to tap.
                Removed: long examFormat detail chip ("Mid 105/200 (52.5%),
                Final 90/200 (45%), Class 5/200 (2.5%), Letter Grade A-F").
                The full breakdown lives on the subject detail / config
                page; on the card we only show the "choice count" hint
                because that materially changes how the user studies
                (4 vs 5 choices = different elimination math). */}
            {s.examFormat?.choiceCount && !isScaffold && (
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
                📝 {s.examFormat.choiceCount} ช้อยส์
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
// DailyQRow — chip on the home screen that opens today's deterministic
// Q in a modal. Shows ✓ once done; streak counter motivates daily return.
function DailyQRow({ user, setView }) {
  const [open, setOpen] = useState(false);
  const todaysQ = useMemo(() => pickTodaysQ(QB), []);
  const [status, setStatus] = useState(() => readTodaysQStatus());
  const [streak, setStreak] = useState(() => dailyQStreak());
  if (!todaysQ) return null;
  const subj = SUBJECTS.find((s) => s.id === todaysQ.subject);
  return (
    <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="vmx-btn vmx-btn-primary vmx-btn-sm"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        🌟 ข้อวันนี้ {status.completed ? '· ✓' : ''} · {subj?.icon || ''} {subj?.name || todaysQ.subject}
      </button>
      {streak >= 2 && (
        <span style={{ fontSize: 12, color: 'var(--clr-gold, #b88940)', fontFamily: 'JetBrains Mono, monospace' }}>
          🔥 daily streak {streak}
        </span>
      )}
      {open && (
        <Suspense fallback={null}>
          <TodaysQModal
            q={todaysQ}
            onClose={() => setOpen(false)}
            onDone={() => {
              setStatus(readTodaysQStatus());
              setStreak(dailyQStreak());
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

function OnboardingTour({ step, onNext, onDismiss }) {
  const steps = [
    {
      icon: '👋',
      title: 'ยินดีต้อนรับสู่ VetMock',
      body: 'คลังโจทย์ฝึก + Notes + สรุปคลิป สำหรับสัตวแพทย์จุฬา ทุกชั้นปี\nค่อย ๆ พาทัวร์ 3 จุดสำคัญก่อนเริ่มใช้',
      cta: 'ถัดไป →',
    },
    {
      icon: '📚',
      title: 'เริ่มจาก "เลือกวิชา"',
      body: 'หน้าแรกจะแสดงวิชาในปีของคุณ\nคลิกวิชาไหน → จะเข้าหน้าเลือกหัวข้อ + ปุ่มฝึกซ้อม / Mock test / Notes / คลิป\n\nวิชาที่ยังไม่มีเนื้อหา (PREVIEW) คลิกได้ — จะพาไปแบบฟอร์มขอเพิ่มเนื้อหา',
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
