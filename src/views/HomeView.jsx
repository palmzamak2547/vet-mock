import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { QB } from '../data/questions.js';
// Phase 2 perf: lightweight precomputed Q counts for header/total
// displays — keeps "1,612 ข้อ" labels cheap and doesn't require the
// full QB to be scanned on every re-render.
import { QB_TOTAL, Q_COUNTS_BY_SUBJECT, Q_VISIBLE_COUNTS_BY_SUBJECT, Q_COUNTS_BY_YEAR } from '../data/q-counts.js';
import { hasSupabase } from '../lib/supabase.js';
import { getNextExam, fmtThaiDate, shortCountdown, getNextClassToday, getCurrentClass, getTopMilestone, getUpcomingEvents } from '../data/schedule.js';
import { SUBJECTS, SUBJECTS_BY_YEAR, YEARS, CURRENT_YEAR, visibleQuestionCount, yearForSubject } from '../data/curriculum.js';
import { hasNotes } from '../data/notes-registry.generated.js';
import { LATEST_CHANGELOG, SCOPE_LABELS } from '../data/changelog.js';
import { useLocalStorage } from '../hooks/useStorage.js';
import { pickTodaysQ, readTodaysQStatus, dailyQStreak, fetchTodaysClassPulse } from '../lib/daily-q.js';
// Phase Wrapped banner — surfaces a Spotify-Wrapped-style recap once
// a phase ends. Cheap helpers; the heavy canvas + card UI is lazy.
import { getCompletedPhase, isWrappedDismissed, markWrappedDismissed } from '../lib/phase-wrapped.js';
import { isTopicRead } from '../lib/study-progress.js';

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
// FeatureMenu — categorized feature grid (practice/learn/progress/tools)
// derived from the shared feature registry. Replaces the old scattered
// "เครื่องมือปีX" + "Multiplayer" grids + bottom text-link strip.
import FeatureMenu from '../components/FeatureMenu.jsx';
import { truncateThai } from '../lib/thai-text.js';
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

export default function HomeView({ setView, setMode, setSubject, setTopic, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, startExam, replayQuestions, cardStats, bookmarks, customQuestions, user, profile, readingChecklist = {}, onlineCount = 0, onlineStatus = 'disabled', selectedYear = CURRENT_YEAR, setSelectedYear, selectedPhase, setSelectedPhase, pendingResume, resumePendingExam, dismissPendingExam, history = [], setFeedbackPrefill, buddies = {}, onSketch, onVoiceSettings }) {
  // Year context — determines hero copy + reading checklist scope.
  // Years 4 and 5 both carry exam schedules (ภาคต้น 2569); scaffold years
  // carry none, so the countdown banner hides itself when getNextExam
  // returns null rather than being special-cased per year.
  const yearMeta = YEARS.find((y) => y.id === selectedYear) || YEARS.find((y) => y.current) || YEARS[0];
  const isScaffoldYear = !!yearMeta?.scaffold;
  const nextExam = getNextExam(`y${selectedYear}`);
  // Today's timetable + the registrar's deadlines, surfaced as chips so the
  // published schedule is one tap away instead of buried in a PDF.
  const nextClassToday = getNextClassToday(selectedYear);
  const currentClassNow = getCurrentClass(selectedYear);
  const topMilestone = getTopMilestone();
  // Faculty/สโมสร announcements with a real date+room (e.g. the stethoscope
  // fitting sessions) — only while they're still ahead, and only for the
  // years they were announced to.
  const nextEvent = getUpcomingEvents(selectedYear, 21)[0] || null;
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
  // Note: hero stat `totalQ` (year + vca + custom) was removed in
  // Round 2 retention overhaul (2026-05-18). Now `allQuestionsPool`
  // (defined below) handles the year-scoped count for the random-Q
  // chip — that's the only surface that still wants a top-level "X ข้อ
  // ในปีนี้" number. Subject grid uses Q_VISIBLE_COUNTS_BY_SUBJECT
  // directly (per-subject) so no aggregate needed there.

  // Reading checklist progress — scoped to the active year + phase.
  const checklistTopics = yearSubjects
    .filter((s) => Array.isArray(s.topics) && s.topics.length > 0)
    .flatMap((s) => s.topics.map((t) => t.id));
  // (readingDone/readingTotal badge moved into FeatureMenu's registry-driven
  // card; the bespoke progress count is no longer rendered on HomeView.)

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
    // Year scoping — Palm directive 2026-05-19 data-layer audit round 3.
    //   • streak  → CROSS-YEAR (habit counter, intentional, all years count)
    //   • todayCount → year-scoped (only counts current-year Qs · so user
    //                  in Y5 doesn't see "วันนี้ 5 ข้อ" if those 5 were Y4)
    //   • wrongCount/wrongIds → year-scoped · feeds chip "🎯 ทบทวนข้อผิด N"
    //                  + NextActionCard Priority 3. Mismatch with the
    //                  actual pool that startExam would assemble (which
    //                  year-filters via yearScope()) created UI/behavior
    //                  divergence: chip promised 50 but only 30 in pool.
    const yearSubjectIdSet = new Set((yearSubjects || []).map((s) => s.id));
    const inYear = (h) => {
      if (yearSubjectIdSet.size === 0) return true;
      // Prefer explicit year tag if entry has it (data-layer audit
      // backfilled this), else fall back to subject→year via the set.
      if (typeof h?.year === 'number') return h.year === selectedYear;
      return yearSubjectIdSet.has(h?.subject);
    };
    for (const h of history) {
      if (!h?.date) continue;
      const dayKey = ymd(h.date);
      days.add(dayKey);
      // Streak counts a day if ANY answer occurred (any year — habit).
      // todayCount is year-scoped per the rule above.
      if (dayKey === todayKey && inYear(h)) todayCount++;
      // Wrong tally is year-scoped to match the year-filtered pool.
      if (h.correct === false && inYear(h)) {
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
  }, [history, yearSubjects, selectedYear]);

  // Quick action: random 1 Q from full QB. Goes STRAIGHT into ExamView
  // via startExam({overrides}) — bypasses ConfigView so the user gets
  // the question in 1 click instead of 2. Bug fixed 2026-05-16: was
  // routing to 'config' with setSubject(null), which made startExam see
  // subject=null → pool filter `q.subject === null` returned empty →
  // "ไม่มีข้อสอบในหมวดนี้" alert. Now uses startExam overrides so
  // there's no async state-batching gap.
  // Year-scoped pool size — Palm directive 2026-05-19 data-layer audit
  // round 2. Was `QB_TOTAL` (cross-year 2,650) → user in Y4 saw 2,650
  // ข้อ but only 2,095 were actually their year. Same bug nudged
  // "🎲 ฝึก 1 ข้อด่วน" into the cross-year fallback path in App.startExam.
  // Custom Qs filtered by `q.year === selectedYear` (auto-tagged via
  // QuestionManagerView.save). Subjects without year (legacy custom Qs
  // pre-data-layer-audit) fall through `yearForSubject` lookup.
  const allQuestionsPool = useMemo(() => {
    const yearQ = Q_COUNTS_BY_YEAR[selectedYear] || 0;
    const customForYear = (customQuestions || []).filter((q) => {
      // Prefer explicit year tag (custom Qs created after data-layer audit).
      if (typeof q?.year === 'number') return q.year === selectedYear;
      // Legacy custom Q without year tag → derive from subject via
      // shared utility. Conservative — under-include rather than leak.
      return yearForSubject(q?.subject) === selectedYear;
    }).length;
    return yearQ + customForYear;
  }, [selectedYear, customQuestions]);
  // Round 2B 2026-05-18: transient "กำลังเตรียมข้อแรก..." copy when
  // user clicks the random-Q chip but ExamView hasn't mounted yet.
  // Cleared by component unmount + a safety timeout.
  const [quickActionPending, setQuickActionPending] = useState(false);
  useEffect(() => {
    if (!quickActionPending) return;
    const t = setTimeout(() => setQuickActionPending(false), 1500);
    return () => clearTimeout(t);
  }, [quickActionPending]);
  const launchRandomQ = () => {
    if (allQuestionsPool === 0) return;
    setQuickActionPending(true);
    // Round 2B 2026-05-18: prefer the pre-cached Q if available —
    // bypasses startExam's pool assembly (which awaits loadQB on cold
    // start). replayQuestions sets state in one shot, view='exam', no
    // batching gap. Side-effect: still call setMode/setSubject/etc.
    // so downstream resume + analytics see consistent state.
    if (setMode) setMode('quick');
    if (setSubject) setSubject('all');
    if (setTopic) setTopic(null);
    if (setPracticeMode) setPracticeMode('all');
    if (setNumQuestions) setNumQuestions(1);
    if (setUseTimer) setUseTimer(false);
    const cachedQ = prefetchedRandomQRef.current;
    if (cachedQ && typeof replayQuestions === 'function') {
      prefetchedRandomQRef.current = null; // consume; next idle re-pick
      replayQuestions([cachedQ]);
      return;
    }
    // Fallback: original startExam pool-assembly path.
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
  //
  // Year-scoping — Palm directive 2026-05-18 Q3=C: weakness signal is
  // computed from lifetime history (long-term pattern) BUT restricted
  // to subjects in the user's current year. Prevents a Y5 user from
  // being told to "ลุย com3" (a Y4 subject they already finished).
  const accBySubject = useMemo(() => {
    const acc = {};
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    if (!Array.isArray(history)) return acc;
    const yearSubjectIdSet = new Set((yearSubjects || []).map((s) => s.id));
    for (const h of history) {
      if (!h?.subject || h.date == null) continue;
      // Q3=C: drop entries whose subject isn't in current year's pool.
      if (yearSubjectIdSet.size > 0 && !yearSubjectIdSet.has(h.subject)) continue;
      const ts = new Date(h.date).getTime();
      if (ts < cutoff) continue;
      if (!acc[h.subject]) acc[h.subject] = { total: 0, correct: 0 };
      acc[h.subject].total++;
      if (h.correct) acc[h.subject].correct++;
    }
    return acc;
  }, [history, yearSubjects]);

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
  // pendingResume now lives INSIDE NextActionCard (priority 0) per
  // Palm round-2 spec — the dedicated banner is removed. NextActionCard
  // always renders, so resume always wins when it exists. The banner
  // priority list is for "secondary cards" that need 1 of 5 slots.
  const _emailUnverified = user && !user.email_confirmed_at && !verifyDismissed;
  const bannerWinner = showWrappedBanner
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

  // Whether the quick-action chip row has anything to show.
  // ⚠️ This MUST list every child of .vmx-home-quick-actions. The condition
  // used to live inline at the render site, 400 lines below the chips it
  // gated, and drifted: the schedule chips were added later and never got
  // added here, so a student with no history saw today's class and the
  // tuition deadline only while the changelog chip happened to be showing —
  // dismiss the changelog and all of it vanished at once.
  const hasQuickChips = Boolean(
    freezeNotice
    || quickStats.streak > 0
    || (allQuestionsPool > 0 && history.length > 0)
    || quickStats.wrongCount > 0
    || nextClassToday
    || nextEvent
    || topMilestone
    || showChangelogChip,
  );

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

  // ─── Round 2B (2026-05-18) — random-Q MEMORY prefetch ───────────
  // Different from the chunk prefetch above: this picks one random Q
  // from QB on idle and caches it in a ref so the click → ExamView
  // path doesn't have to await pool assembly on first tap. The Q is
  // year-scoped (only from yearSubjects + customQuestions). After a
  // click consumes the cached Q, we re-pick the next one in the
  // background so the cache is always ready for the NEXT click.
  const prefetchedRandomQRef = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const pickRandom = () => {
      if (cancelled) return;
      try {
        const yearIds = new Set((yearSubjects || []).map((s) => s.id));
        // Combine QB (lazy-loaded, mutates in place) + customQuestions.
        // QB.length === 0 until loadQB() resolves; in that case we just
        // skip — the next idle tick will catch it.
        const pool = [];
        for (const q of QB) if (yearIds.has(q.subject)) pool.push(q);
        for (const q of (customQuestions || [])) if (yearIds.has(q.subject)) pool.push(q);
        if (pool.length === 0) return;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        prefetchedRandomQRef.current = pick;
      } catch {}
    };
    const idle = window.requestIdleCallback
      || ((cb) => setTimeout(cb, 1800));
    const id = idle(pickRandom, { timeout: 3500 });
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof id === 'number') {
        try { window.cancelIdleCallback(id); } catch {}
      }
    };
    // Re-pick when year changes (different pool) or customQuestions add
    // — pickRandom is cheap so don't worry about churn.
  }, [yearSubjects, customQuestions]);

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
          onBack={() => setTourStep((s) => Math.max(0, s - 1))}
          onDismiss={() => { setTourOpen(false); setTourStep(0); setWelcomeDismissed(true); }}
          onStart={() => { 
            setTourOpen(false); 
            setTourStep(0); 
            setWelcomeDismissed(true); 
            launchRandomQ(); 
          }}
        />
      )}
      <div className="vmx-hero">
        <h1>
          {user
            ? <>สวัสดีคุณ <em>{profile?.username || 'นิสิต'}</em></>
            : <>คลังโจทย์ฝึก <em>สัตวแพทย์</em></>}
        </h1>
        {isScaffoldYear ? (
          <p><strong>{yearMeta.label}</strong> — อยู่ระหว่างจัดเตรียมข้อสอบและเนื้อหา</p>
        ) : (history.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--clr-ink-soft)' }}>
            ลองทำ <strong>1 ข้อแรก</strong> ใช้เวลาเพียง 20 วินาทีเพื่อเริ่มสะสมสถิติ
          </p>
        ) : null)}
      </div>

      {bannerWinner === 'wrapped' && (
        <div
          style={{
            marginBottom: 18,
            padding: '14px 16px',
            borderRadius: 12,
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', fontWeight: 600 }}>
              สรุปผลการเรียนประจำเทอม
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 2, lineHeight: 1.4 }}>
              {completedPhase.label} สิ้นสุดแล้ว ดูสรุปผลการทำโจทย์ของคุณ
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="vmx-btn vmx-btn-primary"
              style={{ minHeight: 40, fontSize: 13 }}
              onClick={() => setView('phase-wrapped')}
              aria-label="ดูสรุปการเรียนของเทอมที่จบ"
            >
              ดูสรุปผล
            </button>
            <button
              type="button"
              className="vmx-btn vmx-btn-ghost"
              style={{ fontSize: 13 }}
              onClick={() => {
                markWrappedDismissed(completedPhase.id);
                setWrappedTick((n) => n + 1);
              }}
              aria-label="ปิดประกาศสรุปผลการเรียนประจำเทอม"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {!isScaffoldYear && (
        <NextActionCard
          nextExam={nextExam}
          quickStats={quickStats}
          cardStats={cardStats}
          accBySubject={accBySubject}
          subjects={yearSubjects}
          history={history}
          pendingResume={pendingResume}
          onPickResume={() => resumePendingExam && resumePendingExam()}
          onDismissResume={dismissPendingExam ? () => dismissPendingExam() : null}
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

      {bannerWinner === 'welcome' && (
        <div className="vmx-welcome-banner" style={{
          marginBottom: 16,
          padding: '12px 14px',
          borderRadius: 12,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 180, fontSize: 13, lineHeight: 1.5 }}>
            <strong>ยินดีต้อนรับสู่ VetMock</strong> — แนะนำตำแหน่งและเมนูสำคัญใน 30 วินาที
          </div>
          <button
            type="button"
            className="vmx-btn vmx-btn-ghost vmx-btn-sm"
            onClick={() => { setTourOpen(true); setTourStep(0); }}
          >
            คำแนะนำการใช้งาน
          </button>
          <button
            type="button"
            className="vmx-icon-close"
            aria-label="ปิดข้อความต้อนรับ"
            onClick={() => setWelcomeDismissed(true)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 14,
              color: 'var(--clr-ink-soft)',
            }}
            title="ข้าม"
          >
            ×
          </button>
        </div>
      )}

      {bannerWinner === 'verify' && (
        <div style={{
          padding: 12,
          borderRadius: 12,
          marginBottom: 16,
          background: 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: 13,
        }}>
          <span style={{ flex: 1, minWidth: 200, lineHeight: 1.5 }}>
            <strong>กรุณายืนยันอีเมล</strong>ที่ <code style={{ fontSize: 12 }}>{user.email}</code> เพื่อเริ่มใช้งานเต็มรูปแบบ
          </span>
          <button
            type="button"
            className="vmx-link-btn vmx-tap"
            onClick={() => setVerifyDismissed(true)}
            style={{ all: 'unset', cursor: 'pointer', fontSize: 12, color: 'var(--clr-ink-soft)', padding: '4px 8px' }}
            title="ปิดประกาศ"
            aria-label="ปิดประกาศยืนยันอีเมล"
          >
            ปิด
          </button>
        </div>
      )}


      {nextExam && nextExam.daysLeft > 7 && nextExam.daysLeft <= 30 && (
        <button type="button" className="vmx-pressable-card" onClick={() => setView('schedule')} style={{
          padding: 16, borderRadius: 16, marginBottom: 24, cursor: 'pointer',
          background: countdown ? 'var(--clr-rose-soft)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose-soft)' : 'var(--clr-surface)'),
          border: `2px solid ${countdown ? 'var(--clr-rose)' : (nextExam.daysLeft <= 7 ? 'var(--clr-rose)' : 'var(--clr-border)')}`,
          display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
        }} aria-label={`ดูตารางสอบ ${nextExam.title}`}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--vmx-mono)', fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
              <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: countdown.kind === 'imminent' ? 22 : 26, lineHeight: 1.15, color: 'var(--clr-rose-text)' }}>
                {countdown.text}
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 32, lineHeight: 1, color: nextExam.daysLeft <= 7 ? 'var(--clr-rose-text)' : 'var(--clr-ink)' }}>
                  {nextExam.daysLeft}
                </div>
                <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', fontFamily: 'var(--vmx-mono)' }}>
                  days left
                </div>
              </>
            )}
          </div>
        </button>
      )}

      {(bannerWinner === 'announcement' || forceChangelogOpen) && (
        <div
          style={{
            padding: 16,
            borderRadius: 14,
            marginBottom: 20,
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                อัปเดตใหม่, {fmtThaiDate(LATEST_CHANGELOG.date)}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>
                {LATEST_CHANGELOG.headline}
              </div>
            </div>
            <button
              type="button"
              className="vmx-tap"
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
              className="vmx-tap"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                marginTop: 8,
                fontSize: 12,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'var(--vmx-mono)',
                textDecoration: 'underline',
              }}
            >
              {expanded
                ? 'ซ่อนรายละเอียด'
                : `ดูรายละเอียด (${LATEST_CHANGELOG.changes.length} รายการ)`}
            </button>
          )}
        </div>
      )}

      {hasQuickChips && (
        <div className="vmx-home-quick-actions" style={{
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
                padding: '6px 12px',
                borderRadius: 999,
                background: 'var(--clr-surface-2)',
                border: '1px solid var(--clr-border)',
                fontSize: 12,
                color: 'var(--clr-ink-soft)',
              }}
            >
              ระบบรักษาสถิติการเรียนต่อเนื่อง {freezeNotice.streak} วัน
            </div>
          )}
          {quickStats.streak > 0 && (
            <div
              className={`vmx-pop-in vmx-streak-card-home ${quickStats.streak >= 7 ? 'vmx-streak-hot' : quickStats.streak >= 3 ? 'vmx-streak-warm' : ''}`}
              title={`ทำข้อสอบติดต่อกัน ${quickStats.streak} วัน`}
            >
              <span className="vmx-streak-fire">🔥</span>
              <div className="vmx-streak-info">
                <span className="vmx-streak-num">{quickStats.streak}</span>
                <span className="vmx-streak-unit">วันต่อเนื่อง</span>
              </div>
              <div className="vmx-streak-week">
                {[...Array(7)].map((_, i) => (
                  <span key={i} className={`vmx-streak-dot ${i < Math.min(quickStats.streak, 7) ? 'vmx-streak-dot-active' : ''}`} />
                ))}
              </div>
              {quickStats.streak >= 7 && (
                <span className="vmx-streak-milestone">
                  {quickStats.streak >= 30 ? 'เทพ!' : quickStats.streak >= 14 ? 'แข็งแกร่ง!' : 'สุดยอด!'}
                </span>
              )}
              {quickStats.todayCount > 0 && (
                <span className="vmx-streak-today-count">+{quickStats.todayCount} วันนี้</span>
              )}
            </div>
          )}

          {allQuestionsPool > 0 && history.length > 0 && (
            <button
              className="vmx-chip-quick vmx-pop-in"
              onClick={launchRandomQ}
              disabled={quickActionPending}
              title={quickActionPending ? 'กำลังเตรียมข้อสอบ...' : `สุ่ม 1 ข้อจากคลังทั้งหมด ${allQuestionsPool} ข้อ`}
              style={{
                all: 'unset',
                cursor: quickActionPending ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 999,
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)',
                fontSize: 12,
                color: 'var(--clr-ink)',
                opacity: quickActionPending ? 0.65 : 1,
              }}
            >
              {quickActionPending ? 'กำลังเตรียมข้อแรก...' : 'สุ่มฝึก 1 ข้อด่วน'}
            </button>
          )}
          {history.length === 0 && quickActionPending && (
            <span
              role="status"
              aria-live="polite"
              style={{
                fontSize: 11,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'var(--vmx-mono)',
                marginLeft: 6,
              }}
            >
              โหลดคลังโจทย์ครั้งแรก, ครั้งต่อไปจะเร็วขึ้น
            </span>
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
                fontFamily: 'var(--vmx-mono)',
                color: '#8a3340',
                transition: 'transform 0.12s, background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(167, 61, 74, 0.20)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(167, 61, 74, 0.12)'}
            >
              ทบทวนข้อที่ตอบผิด ({quickStats.wrongCount})
            </button>
          )}
          {/* Today's next class + any open registration/payment window. Both
              come from the faculty's own published schedule, so they answer
              "เรียนอะไร ที่ไหน" and "ต้องจ่าย/ลงทะเบียนภายในเมื่อไหร่" without
              the student digging for the PDF. Tapping opens the full page. */}
          {nextClassToday && (
            <button
              type="button"
              onClick={() => setView('schedule')}
              className="vmx-chip-quick"
              title={`${nextClassToday.code}, ${nextClassToday.room}, ${nextClassToday.start}-${nextClassToday.end}`}
              style={{
                all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(74, 107, 74, 0.10)', border: '1px solid var(--clr-sage)',
                fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-sage-text)',
                minHeight: 44, boxSizing: 'border-box',
              }}
            >
              {currentClassNow ? 'กำลังเรียน' : `${nextClassToday.start} น.`} {truncateThai(nextClassToday.title, 26)}, {nextClassToday.room}
            </button>
          )}
          {nextEvent && (
            <button
              type="button"
              onClick={() => setView('schedule')}
              className="vmx-chip-quick"
              title={`${nextEvent.titleTh}, ${nextEvent.start}-${nextEvent.end} น., ${nextEvent.location}`}
              style={{
                all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(184, 137, 64, 0.10)', border: '1px solid var(--clr-gold)',
                fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-gold-text)',
                minHeight: 44, boxSizing: 'border-box',
              }}
            >
              {truncateThai(nextEvent.titleTh.replace(/^บริษัทนำ /, ''), 30)}
              {', '}
              {nextEvent.daysLeft === 0 ? 'วันนี้' : nextEvent.daysLeft === 1 ? 'พรุ่งนี้' : `อีก ${nextEvent.daysLeft} วัน`}
            </button>
          )}
          {topMilestone && (
            <button
              type="button"
              onClick={() => setView('schedule')}
              className="vmx-chip-quick"
              title={`${topMilestone.titleTh}${topMilestone.endTimeTh ? `, ${topMilestone.endTimeTh}` : ''}`}
              style={{
                all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 999,
                background: 'rgba(194, 109, 109, 0.10)', border: '1px solid var(--clr-rose)',
                fontSize: 12, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-rose-text)',
                minHeight: 44, boxSizing: 'border-box',
              }}
            >
              {truncateThai(topMilestone.titleTh, 22)}
              {', '}
              {topMilestone.active
                ? (topMilestone.daysLeftToEnd === 0 ? 'วันสุดท้ายวันนี้' : `เหลือ ${topMilestone.daysLeftToEnd} วัน`)
                : `อีก ${topMilestone.daysLeft} วัน`}
            </button>
          )}
          {showChangelogChip && (
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
                fontFamily: 'var(--vmx-mono)',
                color: 'var(--clr-gold-text, var(--clr-gold, #b88940))',
              }}
              title="ดูรายละเอียดอัปเดตล่าสุด"
            >
              อัปเดตใหม่{LATEST_CHANGELOG?.changes?.length ? ` ${LATEST_CHANGELOG.changes.length} รายการ` : ''}
            </button>
          )}
        </div>
      )}

      {/* Gamification + community block (QuestsPanel + DailyGoal + Daily Q
          + Race + StudyBuddies + PWA install) — Phase 1 (2026-05-18):
          moved BELOW the Subject Grid + Practice modes so the core
          "วิชาใน[ปี X]" + smart presets get the prime mobile real-estate.
          Per Palm: "Subject list ต้องโผล่ในจอแรกหรือเกือบจอแรก". */}

      {/* PRIMARY: Subject Grid — natural mental model is "I want to study X subject".
          Filtered to current phase (e.g. only sem 2 subjects when phase is '2-final').
          Section label uses the confident binary-frame copy pattern from
          Airtable/ElevenLabs ref study (see DESIGN-NOTES.md): when a phase
          is active, lead with the action ("ลุยได้เลย —") not the inventory. */}
      <div className="vmx-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
        <span>
          {phaseMeta ? (
            <>ลุยได้เลย — <span style={{ color: 'var(--clr-ink-soft)', fontWeight: 400 }}>{yearMeta?.label || 'ปี 4'}, {phaseMeta.short}</span></>
          ) : (
            <>วิชาใน{yearMeta?.label || 'ปี 4'}</>
          )}
        </span>
        {phaseMeta && setSelectedPhase && (
          <button
            type="button"
            className="vmx-link-btn"
            onClick={() => setView('phase-select')}
            aria-label="เปลี่ยนช่วงสอบ (Phase)"
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'var(--vmx-mono)',
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
          const hasUsableContent = totalQ > 0 || hasNotes(s.id);
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
          // Palm bug 2026-05-20: practiceMode is sticky across views.
          // If user previously hit "ทบทวนข้อที่ตอบผิด" (sets mode='wrong')
          // then clicked a subject card, startExam would still filter to
          // wrong-history pool ignoring the subject pick → looked like
          // "no questions in this category". Reset to 'all' explicitly
          // whenever a fresh subject pick starts.
          setPracticeMode && setPracticeMode('all');
          if (setTopic) setTopic(null);
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
                    const label = truncateThai(cleaned, 24);
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
                  ? `${cardStats.due} ข้อค้างทบทวน, แนะนำวันละ ~${Math.min(30, Math.max(5, Math.ceil(cardStats.due / 4 / 5) * 5))} นาที`
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
            <DailyGoalCard history={history} selectedYear={selectedYear} />
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
            แข่งกับเพื่อน (Race mode)
          </button>
        )}
        <Suspense fallback={null}>
          <PWAInstallChip />
        </Suspense>
      </div>

      {/* Group preview — Round 3 (2026-05-18). When the user isn't
          logged in, show a value-proposition card describing what
          groups unlock: room leaderboard, shared Q sets, daily
          challenge. Tapping → AuthView. Hides for signed-in users
          (they already have direct entry via UserMenu → groups). */}
      {!user && hasSupabase && (
        <div
          style={{
            marginBottom: 22,
            padding: '14px 16px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.06), rgba(184, 137, 64, 0.05))',
            border: '1px dashed var(--clr-sage, #4a6b4a)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }} aria-hidden>👥</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{
              fontSize: 11,
              fontFamily: 'var(--vmx-mono)',
              color: 'var(--clr-sage, #4a6b4a)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}>
              สร้างกลุ่มกับเพื่อน
            </div>
            <div style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              fontSize: 15,
              marginTop: 2,
              lineHeight: 1.4,
              color: 'var(--clr-ink)',
            }}>
              แชร์ leaderboard ห้อง, แชร์โจทย์, challenge รายวัน
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--clr-ink-soft)',
              marginTop: 4,
              lineHeight: 1.45,
            }}>
              login เพื่อสร้างกลุ่ม — ใช้ติว Y4 / Y5 / Sec กับเพื่อน
            </div>
          </div>
          <button
            type="button"
            className="vmx-btn vmx-btn-primary vmx-btn-sm"
            onClick={() => setView('auth')}
            style={{ minHeight: 40, flexShrink: 0 }}
          >
            Login เพื่อเริ่ม
          </button>
        </div>
      )}

      {/* Categorized feature menu — practice / learn / progress / tools,
          all derived from the shared feature registry (lib/feature-registry.js).
          Replaces what used to be 3 scattered sections (a "เครื่องมือปีX" grid,
          a "Multiplayer" grid, and a bottom text-link strip). One registry →
          this grid AND the ⌘K palette, so they can't drift. Auth-only features
          (groups/leaderboard/race/review-queue/account) hide when signed out;
          year-scoped ones (schedule/reading/scores) hide on scaffold years.
          The signed-out value-prop for groups already lives in the group-
          preview card above, so dropping the old "Login / Sign Up" tile here
          is not a regression. */}
      <FeatureMenu
        setView={setView}
        signedIn={!!user}
        scaffold={isScaffoldYear}
        hasSupabase={hasSupabase}
        selectedYear={selectedYear}
        onSketch={onSketch}
        onVoiceSettings={onVoiceSettings}
        onPractice={(inv) => {
          // Registry 'practice' invoke → set up a config flow (same as the
          // primary mode cards). Lands on ConfigView so count/timer can be
          // tweaked before starting. Mirrors App.startExam's overrides path.
          setMode?.(inv.mode);
          setSubject?.(inv.subject || 'all');
          setPracticeMode?.(inv.practiceMode || 'all');
          if (inv.numQuestions != null) setNumQuestions?.(inv.numQuestions);
          if (inv.useTimer != null) setUseTimer?.(inv.useTimer);
          if (inv.timePerQ != null) setTimePerQ?.(inv.timePerQ);
          setView('config');
        }}
      />

      {/* Tips footer — only for first-time users (pre-welcome-dismiss).
          Returning users have absorbed these already; hiding declutters
          the home view. The welcome tour covers the same shortcuts. */}
      {showWelcome && (
        <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: 'var(--clr-surface-2)', fontSize: 13, color: 'var(--clr-ink-soft)', lineHeight: 1.7 }}>
          ใช้ Spaced Repetition ทุกวัน วันละ 15-30 นาที จะได้ผลดีที่สุด<br/>
          กด <span className="vmx-kbd">1-4</span> เพื่อเลือก MCQ, <span className="vmx-kbd">T/F</span>, <span className="vmx-kbd">Space</span> ข้อถัดไป<br/>
          สลับโหมดมืด/สว่างที่ปุ่มขวาบน
        </div>
      )}

      {/* Bottom strip — only the changelog re-open remains here. The old
          about / feedback / Q-manager / contribute / review-queue links are
          now first-class cards in the FeatureMenu (🛠 Tools + Practice),
          so this strip shrank to the one action the registry doesn't model:
          re-surfacing the latest changelog announcement. */}
      {!showAnnouncement && LATEST_CHANGELOG && (
        <div style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: '1px dashed var(--clr-border)',
          display: 'flex',
          justifyContent: 'center',
          fontSize: 12,
          fontFamily: 'var(--vmx-mono)',
          color: 'var(--clr-ink-soft)',
        }}>
          <button type="button" className="vmx-link-btn" onClick={() => setLastSeenChangelog(null)} style={linkStyle}>
            อัปเดตล่าสุด ({LATEST_CHANGELOG.version})
          </button>
        </div>
      )}
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
        fontSize: 11,
        fontFamily: 'var(--vmx-mono)',
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
        color: 'var(--clr-gold-text)',
        fontSize: 11,
        fontFamily: 'var(--vmx-mono)',
        fontWeight: 600,
        verticalAlign: 'middle',
        whiteSpace: 'nowrap',
      }}
    >
      จาก feedback
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
        const hasUsableContent = count > 0 || hasNotes(s.id);

        // Per-subject progress (Phase 3) — readingChecklist + bookmarks
        // are local-storage backed and cheap to compute.
        const topics = Array.isArray(s.topics) ? s.topics.filter((t) => !t.hidden) : [];
        const readDone = topics.filter((t) => isTopicRead(readingChecklist, s.id, t.id)).length;
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
              s.has_notes && count === 0 ? 'มี Notes — คลิกอ่านสรุปได้, ข้อสอบยังไม่มี'
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
            <div className="count" style={{ color: count > 0 ? 'var(--clr-ink-soft)' : (s.has_notes ? 'var(--clr-sage)' : 'var(--clr-rose-text)') }}>
              {count > 0
                ? `${count} ข้อ`
                : s.has_notes
                  ? 'มีสรุปเนื้อหา'
                  : 'ยังไม่มีชุดข้อสอบ'}
            </div>

            {/* Per-subject progress chips — clean text badges */}
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
                  fontSize: 11,
                  color: 'var(--clr-ink-soft)',
                }}>
                  {hasAccData && (
                    <span title={`ตอบถูก ${acc.correct}/${acc.total} ใน 90 วันล่าสุด`} style={{ color: accColor, fontWeight: 600 }}>
                      ถูกต้อง {accPct}%
                    </span>
                  )}
                  {readDone > 0 && (
                    <span title={`อ่านแล้ว ${readDone}/${topics.length} หัวข้อ`}>
                      อ่านแล้ว {readPct}%
                    </span>
                  )}
                  {bookmarkCount > 0 && (
                    <span title={`มีบันทึก ${bookmarkCount} ข้อในวิชานี้`}>
                      บันทึก {bookmarkCount}
                    </span>
                  )}
                </div>
              );
            })()}

            {s.examFormat?.choiceCount && !isScaffold && (
              <div style={{
                marginTop: 6,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'var(--clr-surface-2)',
                fontSize: 11,
                color: 'var(--clr-ink-soft)',
                display: 'inline-block',
              }}>
                {s.examFormat.choiceCount} ตัวเลือก
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
  // QB is lazy-loaded and mutated IN PLACE, so an empty dep array snapshots the
  // empty bank on every cold load — pickTodaysQ returned nothing and the whole
  // "ข้อวันนี้" chip silently never appeared. Keying on the bank size re-runs
  // this once the load lands (HomeView re-renders when App flips qbReady).
  const todaysQ = useMemo(() => pickTodaysQ(QB), [QB.length]);
  const [status, setStatus] = useState(() => readTodaysQStatus());
  const [streak, setStreak] = useState(() => dailyQStreak());
  // Class pulse — Round 3 (2026-05-18). Fetches the public aggregate
  // (anonymous read · pure count, no PII) so HomeView can show "X คน
  // ทำ Daily Q วันนี้ · Y% ตอบถูก". Re-fetches after user completes
  // their own Daily Q so the count reflects them immediately. Silent
  // null when offline / not configured — chip just hides.
  const [pulse, setPulse] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchTodaysClassPulse().then((p) => { if (!cancelled) setPulse(p); });
    return () => { cancelled = true; };
  }, []);
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
        ข้อวันนี้{status.completed ? ' ✓' : ''}, {subj?.icon || ''} {subj?.name || todaysQ.subject}
      </button>
      {streak >= 2 && (
        <span style={{ fontSize: 12, color: 'var(--clr-gold, #b88940)', fontFamily: 'var(--vmx-mono)' }}>
          daily streak {streak}
        </span>
      )}
      {pulse && pulse.total >= 3 && (
        <span
          title={`${pulse.correct}/${pulse.total} ตอบถูกใน Daily Q วันนี้`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 999,
            background: 'rgba(93, 180, 211, 0.10)',
            border: '1px solid rgba(93, 180, 211, 0.5)',
            fontSize: 11,
            fontFamily: 'var(--vmx-mono)',
            color: '#3a8aa8',
          }}
        >
          🌐 {pulse.total} คนทำแล้ว, {pulse.pct}% ถูก
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
              // After the user records, the RPC fires inside
              // recordTodaysQAnswer. Re-fetch the pulse so the chip
              // reflects the post-attempt count without a reload.
              fetchTodaysClassPulse().then(setPulse).catch(() => {});
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

function OnboardingTour({ step, onNext, onBack, onDismiss, onStart }) {
  const steps = [
    {
      title: 'ยินดีต้อนรับสู่ VetMock',
      body: 'ฝึกทำข้อสอบสัตวแพทย์ จัดการจุดที่ยังไม่แม่น และเตรียมตัวให้เป็นระบบตามจังหวะของคุณ',
    },
    {
      title: 'เลือกโหมดให้เหมาะกับเป้าหมาย',
      body: 'ใช้โหมดฝึกฝนเพื่อทบทวนเฉพาะเรื่อง หรือเลือก Mock Exam เมื่อต้องการจำลองการทำข้อสอบแบบจับเวลา',
    },
    {
      title: 'ทบทวนจากสิ่งที่พลาด',
      body: 'หลังทำข้อสอบ คุณสามารถย้อนดูข้อที่ตอบผิดและทบทวนแหล่งอ้างอิงที่พร้อมใช้งานสำหรับข้อนั้นได้',
    },
  ];

  const current = steps[step] || steps[0];
  const isLast = step >= steps.length - 1;
  const isFirst = step === 0;

  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

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
        ref={dialogRef}
        tabIndex="-1"
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
          outline: 'none',
        }}
      >
        <button
          type="button"
          aria-label="ข้าม"
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
          <div>
            <button
              type="button"
              onClick={onDismiss}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'var(--vmx-mono)',
                padding: '8px 0',
              }}
            >
              ข้าม
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost"
                onClick={onBack}
              >
                ย้อนกลับ
              </button>
            )}
            <button
              type="button"
              className="vmx-btn vmx-btn-primary"
              onClick={isLast ? onStart : onNext}
              style={isLast ? { background: 'var(--clr-sage)', borderColor: 'var(--clr-sage)' } : {}}
            >
              {isLast ? 'เริ่มฝึกซ้อม' : 'ถัดไป'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small kind pill (เขียว/ทอง/กลาง) ────────────────────────────
function KindPill({ kind }) {
  const styles = {
    feature: { bg: 'rgba(74, 107, 74, 0.15)', color: 'var(--clr-sage)', label: 'ใหม่' },
    fix: { bg: 'rgba(184, 137, 64, 0.15)', color: 'var(--clr-gold-text)', label: 'แก้บั๊ก' },
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
        fontSize: 11,
        fontFamily: 'var(--vmx-mono)',
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
