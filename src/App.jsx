import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { QB } from './data/questions.js';
import { SUBJECTS, CURRENT_YEAR } from './data/curriculum.js';
import { useLocalStorage } from './hooks/useStorage.js';
import { useAuth } from './hooks/useAuth.js';
import { shuffle, isCorrect, updateStreak } from './hooks/utils.js';
import { getCardStats } from './hooks/sm2.js';
import { isFlashcardCompatible } from './hooks/sr-filter.js';
import { STYLES } from './styles.js';
import { hasSupabase, signOut } from './lib/supabase.js';
import { saveExamResult, pullUserData, pushUserDataDebounced } from './lib/api.js';

// Eager — needed for first paint
import HomeView from './views/HomeView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

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

  const [view, setView] = useState('home');
  const [mode, setMode] = useState('quick');
  const [subject, setSubject] = useState('all');
  const [topic, setTopic] = useState(null);
  const [practiceMode, setPracticeMode] = useState('all');
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [numQuestions, setNumQuestions] = useState(10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQ, setTimePerQ] = useState(60);
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

  useEffect(() => {
    if (view !== 'exam' || !useTimer) return;
    if (timeLeft <= 0) {
      if (currentIdx < questions.length - 1) { setCurrentIdx((i) => i + 1); setTimeLeft(timePerQ); }
      else finishExam();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finishExam intentionally not depended on
  }, [timeLeft, view, useTimer, currentIdx, questions.length, timePerQ]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (view !== 'exam') return;
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
  }, [view, currentIdx, questions]);

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
    if (!pool.length) { alert('ไม่มีข้อสอบในหมวดนี้'); return; }

    const qCount = Math.max(1, numQuestions);
    const qTime = useTimer ? Math.max(5, timePerQ) : 0;

    const picked = shuffle(pool).slice(0, Math.min(qCount, pool.length));
    setQuestions(picked); setAnswers({}); setCurrentIdx(0); setTimeLeft(qTime);
    setExamStartTime(Date.now());
    setView('exam');

    const newStreak = updateStreak(streakData.lastDate, streakData.streak);
    setStreakData(newStreak);
  };

  const finishExam = async () => {
    const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    const newEntries = questions.map((q) => ({
      date: Date.now(), questionId: q.id, correct: isCorrect(q, answers[q.id]), subject: q.subject,
    }));
    // Functional setState so a stale closure (e.g., from timer firing
    // mid-state-update) doesn't overwrite history with old data.
    setHistory((h) => [...h, ...newEntries]);

    if (user) {
      const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
      const duration = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : 0;
      saveExamResult({ user_id: user.id, mode, subject, total: questions.length, correct, pct, duration_sec: duration }).catch(() => {});
    }
    setView('results');
  };

  const toggleBookmark = (qId) => setBookmarks((bk) => bk.includes(qId) ? bk.filter((x) => x !== qId) : [...bk, qId]);
  const setNote = (qId, text) => {
    if (text.trim()) setNotes({ ...notes, [qId]: text });
    else { const { [qId]: _, ...rest } = notes; setNotes(rest); }
  };

  const score = useMemo(() => {
    const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    return { correct, total: questions.length, pct: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
  }, [questions, answers]);

  const answerCurrent = useCallback((val) => setAnswers((p) => ({ ...p, [questions[currentIdx].id]: val })), [questions, currentIdx]);
  const nextQ = useCallback(() => {
    if (currentIdx < questions.length - 1) { setCurrentIdx(currentIdx + 1); setTimeLeft(timePerQ); } else finishExam();
  }, [currentIdx, questions.length, timePerQ]);
  const prevQ = useCallback(() => {
    if (currentIdx > 0) { setCurrentIdx(currentIdx - 1); setTimeLeft(timePerQ); }
  }, [currentIdx, timePerQ]);
  const jumpToQ = useCallback((idx) => {
    if (idx >= 0 && idx < questions.length) { setCurrentIdx(idx); setTimeLeft(timePerQ); }
  }, [questions.length, timePerQ]);

  const goHome = () => {
    setView('home'); setQuestions([]); setAnswers({}); setCurrentIdx(0);
    setPracticeMode('all'); setMode('quick'); setActiveGroup(null); setTopic(null);
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
              {view === 'config' && <ConfigView {...{ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, startExam, goHome, mode }} />}
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
            {' · '}<a onClick={() => setView('feedback')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>แจ้งปัญหา</a>
          </div>
        </div>
      </div>
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
