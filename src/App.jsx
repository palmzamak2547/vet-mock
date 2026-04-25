import { useState, useEffect, useMemo, useCallback } from 'react';
import { QB } from './data/questions.js';
import { SUBJECTS, CURRENT_YEAR } from './data/curriculum.js';
import { useLocalStorage } from './hooks/useStorage.js';
import { useAuth } from './hooks/useAuth.js';
import { shuffle, isCorrect, updateStreak } from './hooks/utils.js';
import { getCardStats } from './hooks/sm2.js';
import { STYLES } from './styles.js';
import { hasSupabase, signOut } from './lib/supabase.js';
import { saveExamResult, pullUserData, pushUserDataDebounced } from './lib/api.js';

import HomeView from './views/HomeView.jsx';
import SubjectSelectView from './views/SubjectSelectView.jsx';
import ConfigView from './views/ConfigView.jsx';
import ExamView from './views/ExamView.jsx';
import ResultsView from './views/ResultsView.jsx';
import ReviewView from './views/ReviewView.jsx';
import SRSessionView from './views/SRSessionView.jsx';
import DashboardView from './views/DashboardView.jsx';
import QuestionManagerView from './views/QuestionManagerView.jsx';
import AuthView from './views/AuthView.jsx';
import GroupsView from './views/GroupsView.jsx';
import GroupDetailView from './views/GroupDetailView.jsx';
import LeaderboardView from './views/LeaderboardView.jsx';
import ScheduleView from './views/ScheduleView.jsx';
import ScoresView from './views/ScoresView.jsx';
import VideoView from './views/VideoView.jsx';
import AboutView from './views/AboutView.jsx';
import FeedbackView from './views/FeedbackView.jsx';
import YearSelectView from './views/YearSelectView.jsx';

export default function App() {
  const { user, profile, loading: authLoading } = useAuth();

  const [view, setView] = useState('home');
  const [mode, setMode] = useState('quick');
  const [subject, setSubject] = useState('all');
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
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    pushUserDataDebounced(user.id, {
      bookmarks, history, notes, sr_cards: srCards,
      custom_questions: customQuestions, streak_data: streakData,
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
  }, [timeLeft, view, useTimer]);

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
  }, [view, currentIdx, questions]);

  const cardStats = useMemo(() => {
    const pool = {};
    allQuestions.forEach((q) => { pool[q.id] = srCards[q.id] || { nextReview: Date.now(), totalReviews: 0, repetitions: 0, interval: 0 }; });
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
    else pool = subject === 'all' ? allQuestions : allQuestions.filter((q) => q.subject === subject);
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
    setHistory([...history, ...newEntries]);

    if (user) {
      const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
      const duration = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : 0;
      saveExamResult({ user_id: user.id, mode, subject, total: questions.length, correct, pct, duration_sec: duration }).catch(() => {});
    }
    setView('results');
  };

  const toggleBookmark = (qId) => setBookmarks(bookmarks.includes(qId) ? bookmarks.filter((x) => x !== qId) : [...bookmarks, qId]);
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

  const goHome = () => {
    setView('home'); setQuestions([]); setAnswers({}); setCurrentIdx(0);
    setPracticeMode('all'); setMode('quick'); setActiveGroup(null);
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <span>{profile.avatar_emoji || '🐾'}</span>
                  <span>{profile.username}</span>
                  <button className="vmx-theme-btn" style={{ fontSize: 12 }} onClick={handleSignOut} title="Logout">⎋</button>
                </div>
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
            <>
              {view === 'home' && <HomeView {...{ setView, setMode, setSubject, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, cardStats, bookmarks, customQuestions, user, profile }} />}
              {view === 'auth' && hasSupabase && <AuthView onBack={goHome} onSuccess={goHome} />}
              {view === 'groups' && user && <GroupsView {...{ user, profile, goHome, setActiveGroup, setView }} />}
              {view === 'group-detail' && user && activeGroup && <GroupDetailView {...{ group: activeGroup, user, goBack: () => setView('groups') }} />}
              {view === 'leaderboard-global' && user && <LeaderboardView {...{ user, goHome }} />}
              {view === 'subject-select' && <SubjectSelectView {...{ setSubject, setView, setPracticeMode, goHome, mode, customQuestions }} />}
              {view === 'config' && <ConfigView {...{ practiceMode, subject, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, startExam, goHome, mode }} />}
              {view === 'exam' && currentQ && <ExamView {...{ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, notes, setNote }} />}
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
            </>
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
