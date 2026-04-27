import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { flushSync } from 'react-dom';
import { QB } from './data/questions.js';
import { SUBJECTS, CURRENT_YEAR } from './data/curriculum.js';
import { useLocalStorage } from './hooks/useStorage.js';
import { useAuth } from './hooks/useAuth.js';
import { useWakeLock } from './hooks/useWakeLock.js';
import { shuffle, isCorrect, updateStreak, timeForQuestion, isWritingType, questionCategory as catOf } from './hooks/utils.js';
import { getCardStats } from './hooks/sm2.js';
import { isFlashcardCompatible } from './hooks/sr-filter.js';
import { STYLES } from './styles.js';
import { hasSupabase, signOut } from './lib/supabase.js';
import { saveExamResult, pullUserData, pushUserDataDebounced } from './lib/api.js';

// Eager — needed for first paint
import HomeView from './views/HomeView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Lazy — pulls VIDEO_SUMMARIES (~200KB) into a separate chunk so it
// only ships when the user actually presses ⌘K (or clicks the search
// button). Keeps the first-paint bundle small.
const CommandPalette = lazy(() => import('./components/CommandPalette.jsx'));

// View Transitions API helper — wraps a state update so the browser
// snapshots the DOM before/after and crossfades automatically. Falls
// back to a plain call when the API isn't available (Firefox, older
// Safari). Only animates if the user hasn't asked to reduce motion.
//
// Uses flushSync inside startViewTransition so React commits the
// update synchronously before the browser captures the "new" frame.
// Without flushSync, React 18 may batch the update past the
// transition window and you'd see no animation.
function withTransition(updateFn) {
  if (typeof document === 'undefined' || typeof updateFn !== 'function') {
    updateFn?.();
    return;
  }
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce || !document.startViewTransition) {
    updateFn();
    return;
  }
  try {
    document.startViewTransition(() => {
      flushSync(() => { updateFn(); });
    });
  } catch {
    updateFn();
  }
}

// Lazy — pulled in only when the user navigates to that view.
// Big wins on cold load (esp. iPad / mobile Safari) since NotesView,
// VideoView, GroupsView etc. ship their own chunks.
const SubjectSelectView = lazy(() => import('./views/SubjectSelectView.jsx'));
const ConfigView = lazy(() => import('./views/ConfigView.jsx'));
const ExamView = lazy(() => import('./views/ExamView.jsx'));
const ResultsView = lazy(() => import('./views/ResultsView.jsx'));
const ReviewView = lazy(() => import('./views/ReviewView.jsx'));
const SRSessionView = lazy(() => import('./views/SRSessionView.jsx'));
const DashboardView = lazy(() => import('./views/DashboardView.jsx'));
const QuestionManagerView = lazy(() => import('./views/QuestionManagerView.jsx'));
const AuthView = lazy(() => import('./views/AuthView.jsx'));
const GroupsView = lazy(() => import('./views/GroupsView.jsx'));
const GroupDetailView = lazy(() => import('./views/GroupDetailView.jsx'));
const LeaderboardView = lazy(() => import('./views/LeaderboardView.jsx'));
const ScheduleView = lazy(() => import('./views/ScheduleView.jsx'));
const ScoresView = lazy(() => import('./views/ScoresView.jsx'));
const VideoView = lazy(() => import('./views/VideoView.jsx'));
const AboutView = lazy(() => import('./views/AboutView.jsx'));
const FeedbackView = lazy(() => import('./views/FeedbackView.jsx'));
const YearSelectView = lazy(() => import('./views/YearSelectView.jsx'));
const TopicSelectView = lazy(() => import('./views/TopicSelectView.jsx'));
const NotesView = lazy(() => import('./views/NotesView.jsx'));
const ReadingChecklistView = lazy(() => import('./views/ReadingChecklistView.jsx'));

const ViewFallback = () => <div className="vmx-empty">กำลังโหลด…</div>;

export default function App() {
  const { user, profile, loading: authLoading } = useAuth();

  // Detect password-reset deep link on first render so the very first
  // view is AuthView (which then enters mode='update-password' from the
  // same query param). Without this, clicking the email link drops the
  // user on the home page and the recovery form is never shown.
  const initialView = (() => {
    if (typeof window === 'undefined') return 'home';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'reset') return 'auth';
    } catch {}
    return 'home';
  })();

  const [view, setViewRaw] = useState(initialView);
  const [mode, setMode] = useState('quick');
  const [subject, setSubject] = useState('all');
  const [topic, setTopic] = useState(null);
  const [practiceMode, setPracticeMode] = useState('all');
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Wrap setView in a View Transitions snapshot so navigating between
  // views fades smoothly (Chrome/Edge/Safari TP). No-op on Firefox.
  const setView = useCallback((next) => {
    withTransition(() => setViewRaw(next));
  }, []);

  // Keep the screen on while an exam is in progress (Web Wake Lock
  // API). Auto-releases when leaving exam view or component unmount.
  useWakeLock(view === 'exam');

  // In-flight exam state. Persisted to localStorage so an accidental
  // tab close, browser crash, or PWA force-quit during a long writing
  // session doesn't lose answers — restored when the user opens the
  // app again. Cleared on submit / goHome.
  const [questions, setQuestions] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).questions || [];
    } catch {}
    return [];
  });
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).answers || {};
    } catch {}
    return {};
  });
  const [currentIdx, setCurrentIdx] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).currentIdx || 0;
    } catch {}
    return 0;
  });
  const [numQuestions, setNumQuestions] = useState(10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQ, setTimePerQ] = useState(60);
  // 'all' (default) | 'mcq' (auto-graded only) | 'writing' (essay+short only)
  const [questionCategory, setQuestionCategory] = useState('all');
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState(null);

  const [theme, setTheme] = useLocalStorage('vmx-theme', 'light');
  const [bookmarks, setBookmarks] = useLocalStorage('vmx-bookmarks', []);
  const [history, setHistory] = useLocalStorage('vmx-history', []);
  const [notes, setNotes] = useLocalStorage('vmx-notes', {});
  const [srCards, setSrCards] = useLocalStorage('vmx-sr-cards', {});
  const [customQuestions, setCustomQuestions] = useLocalStorage('vmx-custom-q', []);
  const [streakData, setStreakData] = useLocalStorage('vmx-streak', { streak: 0, lastDate: null });
  const [readingChecklist, setReadingChecklist] = useLocalStorage('vmx-reading-checklist', {});

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,500&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500&display=swap';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  useEffect(() => {
    if (!user) return;
    pullUserData(user.id).then((data) => {
      if (!data) return;
      if (data.bookmarks?.length) setBookmarks(data.bookmarks);
      if (data.history?.length) setHistory(data.history);
      if (data.notes && Object.keys(data.notes).length) setNotes(data.notes);
      if (data.sr_cards && Object.keys(data.sr_cards).length) setSrCards(data.sr_cards);
      if (data.custom_questions?.length) setCustomQuestions(data.custom_questions);
      if (data.streak_data?.lastDate) setStreakData(data.streak_data);
      // reading_checklist: pulled if the Supabase column exists; harmless
      // when it doesn't (data.reading_checklist is just undefined).
      if (data.reading_checklist && Object.keys(data.reading_checklist).length) setReadingChecklist(data.reading_checklist);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // NOTE: reading_checklist intentionally excluded from cloud push for
    // now — the user_data table in supabase-schema.sql doesn't include
    // that column yet, and including it would make the entire upsert
    // fail with "column not found", breaking ALL cloud sync for every
    // logged-in user. Add the column + uncomment the line below once
    // the migration runs:
    //   ALTER TABLE user_data ADD COLUMN reading_checklist JSONB DEFAULT '{}'::JSONB;
    pushUserDataDebounced(user.id, {
      bookmarks, history, notes, sr_cards: srCards,
      custom_questions: customQuestions, streak_data: streakData,
      // reading_checklist: readingChecklist,
    });
  }, [user, bookmarks, history, notes, srCards, customQuestions, streakData]);

  const allQuestions = useMemo(() => [...QB, ...customQuestions], [customQuestions]);

  // Auto-save in-flight exam state to localStorage. Runs on every
  // answer/navigation so accidental tab-close during a 25-minute
  // essay doesn't lose work. Skipped when there's no active exam.
  // Debounced 500ms so a fast-typing essay (with answers state
  // updating per keystroke) doesn't cause a localStorage write
  // every 30ms — that throttles down to ≤2/sec, which is plenty
  // safe for crash recovery and far easier on slow phones.
  useEffect(() => {
    if (view !== 'exam' || questions.length === 0) return;
    const timer = setTimeout(() => {
      try {
        window.localStorage?.setItem('vmx-inflight-exam', JSON.stringify({
          questions, answers, currentIdx,
          savedAt: Date.now(),
        }));
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [view, questions, answers, currentIdx]);

  // Detect a previous in-flight exam at boot and offer to resume.
  // Only show the prompt once — after dismiss, the storage key is
  // cleared so it doesn't re-pop on every refresh.
  useEffect(() => {
    if (view !== 'home' || questions.length > 0) return;
    let raw;
    try { raw = window.localStorage?.getItem('vmx-inflight-exam'); } catch {}
    if (!raw) return;
    let saved;
    try { saved = JSON.parse(raw); } catch { return; }
    if (!saved?.questions?.length) return;
    // Only offer resume if save is < 6 hours old — older state likely stale
    const ageMs = Date.now() - (saved.savedAt || 0);
    if (ageMs > 6 * 60 * 60 * 1000) {
      try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
      return;
    }
    const ageMin = Math.round(ageMs / 60000);
    const answeredCount = Object.keys(saved.answers || {}).length;
    const ok = window.confirm(
      `🔄 พบข้อสอบที่ค้างอยู่ (${saved.questions.length} ข้อ · ตอบไป ${answeredCount} ข้อ · ${ageMin} นาทีที่แล้ว)\n\nกลับไปทำต่อไหม?`
    );
    if (ok) {
      setQuestions(saved.questions);
      setAnswers(saved.answers || {});
      setCurrentIdx(saved.currentIdx || 0);
      setView('exam');
    } else {
      try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
      setQuestions([]);
      setAnswers({});
      setCurrentIdx(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on first home render
  }, []);

  useEffect(() => {
    if (view !== 'exam' || !useTimer) return;
    if (timeLeft <= 0) {
      if (currentIdx < questions.length - 1) {
        const next = questions[currentIdx + 1];
        setCurrentIdx((i) => i + 1);
        setTimeLeft(timeForQuestion(next, timePerQ));
      } else finishExam();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finishExam intentionally not depended on
  }, [timeLeft, view, useTimer, currentIdx, questions, timePerQ]);

  // Global ⌘K / Ctrl+K — open Command Palette anywhere in the app.
  // Mounted as its own effect so it stays active across all views
  // (including 'exam') without conflicting with exam-only shortcuts.
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (view !== 'exam') return;
      // Don't fire exam shortcuts while command palette is open
      if (paletteOpen) return;
      const q = questions[currentIdx];
      if (!q) return;
      if (q.type === 'mcq' && ['1', '2', '3', '4'].includes(e.key)) answerCurrent(parseInt(e.key) - 1);
      else if (q.type === 'tf') {
        if (e.key === 't' || e.key === 'T') answerCurrent(true);
        if (e.key === 'f' || e.key === 'F') answerCurrent(false);
      }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); nextQ(); }
      if (e.key === 'ArrowLeft') prevQ();
      if (e.key === 'ArrowRight') nextQ();
      if (e.key === 'b' || e.key === 'B') toggleBookmark(q.id);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // NOTE: do NOT add answerCurrent/nextQ/prevQ/toggleBookmark to the
    // dep array — those `const`s are declared LATER in this component,
    // so referencing them here triggers a Temporal Dead Zone
    // ReferenceError at render → blank white screen for the whole app.
    // The handler reads them through closure at fire time, which is OK
    // because React already re-runs this effect on currentIdx/questions
    // changes (and those callbacks read from current state via setState
    // updaters / memo-stable identities).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentIdx, questions, paletteOpen]);

  const cardStats = useMemo(() => {
    // Only count SR-eligible questions so the Home dashboard "X due"
    // badge matches what SRSessionView will actually serve.
    const pool = {};
    allQuestions.filter(isFlashcardCompatible).forEach((q) => {
      pool[q.id] = srCards[q.id] || { nextReview: Date.now(), totalReviews: 0, repetitions: 0, interval: 0 };
    });
    return getCardStats(pool);
  }, [srCards, allQuestions]);

  const analytics = useMemo(() => {
    if (!history.length) return null;
    const bySubject = {};
    const byTag = {};
    const questionStats = {};
    SUBJECTS.forEach((s) => { if (s.id !== 'all') bySubject[s.id] = { correct: 0, total: 0 }; });
    let totalCorrect = 0;
    history.forEach((h) => {
      const q = allQuestions.find((x) => x.id === h.questionId);
      if (!q) return;
      if (!bySubject[q.subject]) bySubject[q.subject] = { correct: 0, total: 0 };
      bySubject[q.subject].total++;
      if (h.correct) { bySubject[q.subject].correct++; totalCorrect++; }
      q.tags?.forEach((tag) => {
        if (!byTag[tag]) byTag[tag] = { correct: 0, total: 0 };
        byTag[tag].total++;
        if (h.correct) byTag[tag].correct++;
      });
      if (!questionStats[h.questionId]) questionStats[h.questionId] = { correct: 0, total: 0, wrong: 0 };
      questionStats[h.questionId].total++;
      if (h.correct) questionStats[h.questionId].correct++;
      else questionStats[h.questionId].wrong++;
    });
    const weakTags = Object.entries(byTag).filter(([_, s]) => s.total >= 2)
      .map(([tag, s]) => ({ tag, pct: Math.round((s.correct / s.total) * 100), total: s.total }))
      .sort((a, b) => a.pct - b.pct).slice(0, 8);
    const weakQuestions = Object.entries(questionStats).filter(([_, s]) => s.wrong >= 1)
      .sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 25).map(([id]) => parseInt(id));
    const overallPct = history.length ? Math.round((totalCorrect / history.length) * 100) : 0;
    return { bySubject, weakTags, weakQuestions, totalAttempts: history.length, overallPct };
  }, [history, allQuestions]);

  const startExam = () => {
    let pool;
    if (practiceMode === 'bookmarks') pool = allQuestions.filter((q) => bookmarks.includes(q.id));
    else if (practiceMode === 'weak') pool = allQuestions.filter((q) => analytics?.weakQuestions.includes(q.id));
    else {
      pool = subject === 'all' ? allQuestions : allQuestions.filter((q) => q.subject === subject);
      if (topic) pool = pool.filter((q) => q.topic === topic);
    }

    // Apply question-category filter so users can split MCQ vs Writing
    if (questionCategory === 'mcq') pool = pool.filter((q) => catOf(q) === 'mcq');
    else if (questionCategory === 'writing') pool = pool.filter((q) => catOf(q) === 'writing');

    if (!pool.length) {
      alert(questionCategory === 'writing'
        ? 'ยังไม่มีข้อ Writing ในหมวดนี้ — ลองเปลี่ยนเป็น MCQ หรือ "ทุกประเภท"'
        : 'ไม่มีข้อสอบในหมวดนี้');
      return;
    }

    const qCount = Math.max(1, numQuestions);
    const baseTime = useTimer ? Math.max(5, timePerQ) : 0;

    let picked = shuffle(pool).slice(0, Math.min(qCount, pool.length));
    // Mock-tagged questions (examOrigin set) belong to a structured
    // exam — passage Q1 must come before Q2, etc. Re-sort by ID
    // after the random pick so passage flow is preserved while still
    // sampling randomly from the larger pool.
    if (picked.some((q) => q.examOrigin)) {
      picked = picked.sort((a, b) => a.id - b.id);
    }
    // Per-question time uses timeForQuestion(): essays get 25 min minimum,
    // short answers 3 min minimum, MCQ/TF stay at the user's base setting
    const firstTime = picked[0] ? timeForQuestion(picked[0], baseTime) : baseTime;

    setQuestions(picked); setAnswers({}); setCurrentIdx(0); setTimeLeft(firstTime);
    setExamStartTime(Date.now());
    setView('exam');

    const newStreak = updateStreak(streakData.lastDate, streakData.streak);
    setStreakData(newStreak);
  };

  const finishExam = async () => {
    // Only count auto-graded questions in history/percentage —
    // writing Qs need self/AI grading and shouldn't penalize the
    // correctness percentage by always being marked wrong.
    const autoQs = questions.filter((q) => !isWritingType(q));
    const correct = autoQs.filter((q) => isCorrect(q, answers[q.id])).length;
    const newEntries = autoQs.map((q) => ({
      date: Date.now(), questionId: q.id, correct: isCorrect(q, answers[q.id]), subject: q.subject,
    }));
    setHistory((h) => [...h, ...newEntries]);

    if (user) {
      const pct = autoQs.length ? Math.round((correct / autoQs.length) * 100) : 0;
      const duration = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : 0;
      saveExamResult({ user_id: user.id, mode, subject, total: autoQs.length, correct, pct, duration_sec: duration }).catch(() => {});
    }
    // Clear the auto-save now that the exam is submitted — Review/
    // Results doesn't need the in-flight key anymore
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
    setView('results');
  };

  const toggleBookmark = (qId) => setBookmarks((bk) => bk.includes(qId) ? bk.filter((x) => x !== qId) : [...bk, qId]);
  const setNote = (qId, text) => {
    if (text.trim()) setNotes({ ...notes, [qId]: text });
    else { const { [qId]: _, ...rest } = notes; setNotes(rest); }
  };

  const score = useMemo(() => {
    // Split auto-graded vs writing for honest score reporting.
    // Writing questions are open-ended → counted separately so the
    // percentage reflects only what the engine could grade. Writing
    // gets graded in Review (Self assess or 🤖 Smart AI grade).
    const autoQs = questions.filter((q) => !isWritingType(q));
    const writingQs = questions.filter((q) => isWritingType(q));
    const correct = autoQs.filter((q) => isCorrect(q, answers[q.id])).length;
    const writingAttempted = writingQs.filter((q) => {
      const ua = answers[q.id];
      return typeof ua === 'string' && ua.trim().length > 0;
    }).length;
    const totalAuto = autoQs.length;
    return {
      correct,
      total: totalAuto,
      pct: totalAuto ? Math.round((correct / totalAuto) * 100) : 0,
      writingTotal: writingQs.length,
      writingAttempted,
      // Combined total still used by some legacy callers
      totalAll: questions.length,
    };
  }, [questions, answers]);

  const answerCurrent = useCallback((val) => setAnswers((p) => ({ ...p, [questions[currentIdx].id]: val })), [questions, currentIdx]);
  const nextQ = useCallback(() => {
    const cur = questions[currentIdx];
    // Confirm before skipping a blank short/essay — these take real
    // effort so accidental "Next →" clicks shouldn't lose them
    if (cur && isWritingType(cur)) {
      const ua = answers[cur.id];
      const isBlank = !ua || (typeof ua === 'string' && !ua.trim());
      const isLast = currentIdx === questions.length - 1;
      if (isBlank) {
        const msg = isLast
          ? 'ยังไม่ได้เขียนข้อนี้ — ส่งข้อสอบเลยจริงๆ?'
          : 'ยังไม่ได้เขียนคำตอบ — ข้ามไปข้อถัดไปเลย?';
        if (typeof window !== 'undefined' && !window.confirm(msg)) return;
      }
    }
    if (currentIdx < questions.length - 1) {
      const next = questions[currentIdx + 1];
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(timeForQuestion(next, timePerQ));
    } else finishExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- answers/finishExam read via closure
  }, [currentIdx, questions, timePerQ, answers]);
  const prevQ = useCallback(() => {
    // Use timeForQuestion so jumping back to an essay restores its
    // 25-min budget instead of shrinking it to the MCQ default
    if (currentIdx > 0) {
      const prev = questions[currentIdx - 1];
      setCurrentIdx(currentIdx - 1);
      setTimeLeft(timeForQuestion(prev, timePerQ));
    }
  }, [currentIdx, questions, timePerQ]);
  const jumpToQ = useCallback((idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIdx(idx);
      setTimeLeft(timeForQuestion(questions[idx], timePerQ));
    }
  }, [questions, timePerQ]);

  const goHome = () => {
    setView('home'); setQuestions([]); setAnswers({}); setCurrentIdx(0);
    setPracticeMode('all'); setMode('quick'); setActiveGroup(null); setTopic(null);
    // Clear in-flight exam state — user explicitly chose to leave
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
  };

  const handleSignOut = async () => { if (confirm('Logout?')) { await signOut(); goHome(); } };

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  return (
    <>
      <style>{STYLES}</style>
      <div className="vmx-app">
        <div className="vmx-container">
          <div className="vmx-header">
            <div className="vmx-logo" onClick={goHome}>Vet<span>Mock</span></div>
            <div className="vmx-header-right">
              <button
                className="vmx-cmdk-btn"
                onClick={() => setPaletteOpen(true)}
                title="Quick search (⌘K / Ctrl+K)"
                aria-label="เปิด command palette"
              >
                <span style={{ fontSize: 13 }}>🔍</span>
                <kbd className="vmx-cmdk-kbd">⌘K</kbd>
              </button>
              {streakData.streak > 0 && <div className="vmx-streak">🔥 {streakData.streak}</div>}
              {user && profile && (
                <UserMenu profile={profile} onLogout={handleSignOut} onGroups={() => setView('groups')} onLeaderboard={() => setView('leaderboard-global')} />
              )}
              {!user && hasSupabase && (
                <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('auth')}>Login</button>
              )}
              <div className="vmx-subtitle">v5.0</div>
              <button className="vmx-theme-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle theme">
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          {authLoading ? <div className="vmx-empty">กำลังโหลด...</div> : (
            <ErrorBoundary onReset={goHome} key={view}>
            <Suspense fallback={<ViewFallback />}>
              {view === 'home' && <HomeView {...{ setView, setMode, setSubject, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, cardStats, bookmarks, customQuestions, user, profile, readingChecklist }} />}
              {view === 'auth' && hasSupabase && <AuthView onBack={goHome} onSuccess={goHome} user={user} />}
              {view === 'groups' && user && <GroupsView {...{ user, profile, goHome, setActiveGroup, setView }} />}
              {view === 'group-detail' && user && activeGroup && <GroupDetailView {...{ group: activeGroup, user, goBack: () => setView('groups') }} />}
              {view === 'leaderboard-global' && user && <LeaderboardView {...{ user, goHome }} />}
              {view === 'subject-select' && <SubjectSelectView {...{ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions }} />}
              {view === 'topic-select' && <TopicSelectView {...{ subject, setTopic, setView, goHome, mode, customQuestions, readingChecklist }} />}
              {view === 'notes' && <NotesView subject={subject || 'com5'} initialTopic={topic} goBack={() => setView('topic-select')} goHome={goHome} />}
              {view === 'config' && <ConfigView {...{ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory, setQuestionCategory, startExam, goHome, mode }} />}
              {view === 'exam' && currentQ && <ExamView {...{ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, jumpToQ, notes, setNote, answers, bookmarks }} />}
              {view === 'results' && <ResultsView {...{ score, questions, answers, goHome, setView, mode }} />}
              {view === 'review' && <ReviewView {...{ questions, answers, bookmarks, toggleBookmark, goHome, setView, notes }} />}
              {view === 'sr-session' && <SRSessionView {...{ srCards, setSrCards, goHome, customQuestions }} />}
              {view === 'dashboard' && <DashboardView {...{ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setNotes, setCustomQuestions, setStreakData, setPracticeMode, setView, setMode, history, notes, srCards, streak: streakData.streak, customQuestions }} />}
              {view === 'question-manager' && <QuestionManagerView {...{ customQuestions, setCustomQuestions, goHome }} />}
              {view === 'schedule' && <ScheduleView {...{ goHome, setSubject, setMode, setView, setPracticeMode }} />}
              {view === 'scores' && <ScoresView {...{ goHome }} />}
              {view === 'videos' && <VideoView {...{ goHome }} />}
              {view === 'about' && <AboutView {...{ goHome, setView }} />}
              {view === 'feedback' && <FeedbackView {...{ goHome, user, profile }} />}
              {view === 'year-select' && <YearSelectView {...{ goHome, selectedYear, setSelectedYear, setView }} />}
              {view === 'reading-checklist' && <ReadingChecklistView {...{ selectedYear, readingChecklist, setReadingChecklist, goHome, goBack: () => setView('home'), setSubject, setView }} />}
            </Suspense>
            </ErrorBoundary>
          )}

          <div className="vmx-footer">
            VetMock v5.0 · made with ♡ by <strong>Vet 86</strong>
            {' · '}<a onClick={() => setView('about')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>About</a>
            {' · '}<a href="/blog/" style={{ textDecoration: 'underline' }}>บทความ</a>
            {' · '}<a onClick={() => setView('feedback')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>แจ้งปัญหา</a>
          </div>
        </div>
      </div>

      {/* CommandPalette is mounted only on first open — Suspense
          boundary handles the dynamic import; once loaded, subsequent
          opens are instant. We keep paletteOpen prop control so that
          closing fully unmounts the modal too (cleaner than leaving
          a hidden overlay in the tree). */}
      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            goView={setView}
            setSubject={setSubject}
            setPracticeMode={setPracticeMode}
          />
        </Suspense>
      )}
    </>
  );
}

// ============================================================
// UserMenu — profile pill with click-outside dropdown
// ============================================================
function UserMenu({ profile, onLogout, onGroups, onLeaderboard }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 6px', borderRadius: 999,
          background: open ? 'var(--clr-surface-2)' : 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          fontSize: 13, fontWeight: 600,
          color: 'var(--clr-ink)',
          transition: 'background 0.12s',
        }}
      >
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          {profile.avatar_emoji || '🐾'}
        </span>
        <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {profile.username}
        </span>
        <span style={{ fontSize: 10, color: 'var(--clr-ink-soft)' }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div role="menu" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          borderRadius: 12, boxShadow: 'var(--shadow-md)',
          minWidth: 200, padding: 6, zIndex: 20,
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Signed in as
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
              {profile.avatar_emoji || '🐾'} {profile.username}
            </div>
          </div>
          {onGroups && (
            <MenuItem icon="👥" onClick={() => { setOpen(false); onGroups(); }}>Study Groups</MenuItem>
          )}
          {onLeaderboard && (
            <MenuItem icon="🏆" onClick={() => { setOpen(false); onLeaderboard(); }}>Leaderboard</MenuItem>
          )}
          <div style={{ height: 1, background: 'var(--clr-border)', margin: '4px 0' }} />
          <MenuItem icon="⎋" danger onClick={() => {
            setOpen(false);
            if (confirm('ออกจากระบบ?')) onLogout();
          }}>ออกจากระบบ (Logout)</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', boxSizing: 'border-box', padding: '8px 12px',
        borderRadius: 8, fontSize: 13,
        color: danger ? 'var(--clr-rose)' : 'var(--clr-ink)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{children}</span>
    </button>
  );
}
