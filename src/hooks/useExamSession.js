// ============================================================
// useExamSession — exam runtime state + timer + navigation
// ============================================================
// Pulled out of App.jsx 2026-05-27 to slim the monolith. Owns the
// FIVE pieces of exam-runtime state and the keyboard-free navigation
// callbacks. App.jsx still owns startExam/finishExam (they touch
// many other concerns: streak, XP, quests, Supabase save, year
// resolution) but they now call session.startNewSession() /
// session.resetSession() instead of mutating raw setters.
//
// What this hook owns:
//   • State:    questions · currentIdx · answers · timeLeft · examStartTime
//   • Derived:  currentQ · currentAnswer
//   • Actions:  answerCurrent · nextQ · prevQ · jumpToQ · replayQuestions
//   • Lifecycle helpers (called BY App.jsx, not internal):
//                startNewSession(picked, firstTime)
//                primeFromSaved(saved)
//                resetSession()
//   • Effects:  shadow-start clock + timer tick
//
// What stays in App.jsx (intentional — these are NOT exam runtime):
//   • mode/subject/topic/practiceMode (navigation state)
//   • numQuestions/useTimer/timePerQ/questionCategory (config — read
//     by startExam, lives outside session)
//   • bookmarks/notes/history/srCards/streakData (user data, persist
//     independently of any single exam session)
//   • startExam — builds the pool; calls session.startNewSession at end
//   • finishExam — writes history/XP/quests/Supabase; reads session
//                  state via the same closure pattern as before
//   • Keyboard handlers (App-level UI; call session actions via closure)
//
// Circular-dep solution: finishExam reads session.* but session.tick
// effect needs to call finishExam when timer runs out on the last Q.
// Solved with a ref: App.jsx stashes finishExam in a ref and passes
// `() => finishExamRef.current?.()` as the `onFinish` callback. The
// hook never imports finishExam directly.
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { timeForQuestion, isWritingType } from './utils.js';
import { confirmDialog } from '../lib/dialog.js';

// localStorage init helpers — preserve the in-flight resume behavior
// that App.jsx used to do inline (Three useState(() => { ... }) blocks).
function _loadInflight() {
  try {
    const raw = window.localStorage?.getItem('vmx-inflight-exam');
    if (raw) return JSON.parse(raw) || null;
  } catch {}
  return null;
}

/**
 * @param {object} params
 * @param {string} params.view             — current app view (gates timer)
 * @param {boolean} params.useTimer        — timer enabled (from config)
 * @param {number} params.timePerQ         — base seconds per Q (from config)
 * @param {() => void} params.onFinish     — called when timer expires on
 *                                            the LAST question OR when
 *                                            nextQ is called on the last
 *                                            question. App.jsx wraps its
 *                                            real finishExam via ref.
 */
export function useExamSession({ view, useTimer, timePerQ, onFinish }) {
  // ── State (with localStorage hydration for in-flight resume) ────────
  const [questions, setQuestions] = useState(() => _loadInflight()?.questions || []);
  const [answers, setAnswers] = useState(() => _loadInflight()?.answers || {});
  const [currentIdx, setCurrentIdx] = useState(() => _loadInflight()?.currentIdx || 0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState(null);

  // ── Shadow-start clock ──────────────────────────────────────────────
  // When entering view='exam' via a share-link (?qset=) the normal
  // startExam() never ran, so timeLeft + examStartTime stay at their
  // defaults. Without this priming effect, the timer tick below would
  // immediately see timeLeft=0 and auto-fire onFinish on single-Q quizzes.
  useEffect(() => {
    if (view !== 'exam') return;
    if (questions.length === 0) return;
    if (examStartTime !== null) return;
    setExamStartTime(Date.now());
    setTimeLeft(timeForQuestion(questions[currentIdx], timePerQ));
  }, [view, questions, currentIdx, timePerQ, examStartTime]);

  // ── Timer tick ──────────────────────────────────────────────────────
  // Decrements timeLeft once per second. On time-up: advance to next Q
  // (with its own per-Q time budget) or fire onFinish if on the last Q.
  useEffect(() => {
    if (view !== 'exam' || !useTimer) return;
    // Guard against 0-length question set — happens when a shared
    // ?qset= URL references Q ids that no longer exist in QB.
    if (questions.length === 0) return;
    // Don't auto-tick until the shadow-start effect above has primed
    // the clock. Otherwise the very first render sees timeLeft=0 and
    // immediately fires onFinish on single-Q exams.
    if (examStartTime === null) return;
    if (timeLeft <= 0) {
      if (currentIdx < questions.length - 1) {
        const next = questions[currentIdx + 1];
        setCurrentIdx((i) => i + 1);
        setTimeLeft(timeForQuestion(next, timePerQ));
      } else onFinish?.();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onFinish stable via ref pattern in caller
  }, [timeLeft, view, useTimer, currentIdx, questions, timePerQ]);

  // ── Navigation callbacks ────────────────────────────────────────────
  const answerCurrent = useCallback((val) => {
    setAnswers((p) => ({ ...p, [questions[currentIdx].id]: val }));
  }, [questions, currentIdx]);

  const nextQ = useCallback(async () => {
    const cur = questions[currentIdx];
    // Confirm before skipping a blank short/essay — these take real
    // effort so accidental "Next →" clicks shouldn't lose them.
    if (cur && isWritingType(cur)) {
      const ua = answers[cur.id];
      const isBlank = !ua || (typeof ua === 'string' && !ua.trim());
      const isLast = currentIdx === questions.length - 1;
      if (isBlank) {
        const msg = isLast
          ? 'ยังไม่ได้เขียนข้อนี้ — ส่งข้อสอบเลยจริงๆ?'
          : 'ยังไม่ได้เขียนคำตอบ — ข้ามไปข้อถัดไปเลย?';
        // Async on purpose: nothing reads nextQ's return value, so the
        // advance simply happens a microtask later once they answer.
        const go = await confirmDialog({
          title: isLast ? 'ยังไม่ได้เขียนข้อนี้' : 'ยังไม่ได้เขียนคำตอบ',
          body: msg,
          confirmLabel: isLast ? 'ส่งข้อสอบ' : 'ข้ามไปข้อถัดไป',
        });
        if (!go) return;
      }
    }
    if (currentIdx < questions.length - 1) {
      const next = questions[currentIdx + 1];
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(timeForQuestion(next, timePerQ));
    } else onFinish?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onFinish stable via ref
  }, [currentIdx, questions, timePerQ, answers]);

  const prevQ = useCallback(() => {
    // Use timeForQuestion so jumping back to an essay restores its
    // 25-min budget instead of shrinking it to the MCQ default.
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

  // Replay an arbitrary slice of questions as a fresh exam round.
  // Used by ResultsView "redo wrong" — passes the wrong-only subset
  // back into the session without going through startExam's pool
  // assembly. Mirrors the post-startExam state shape (answers={},
  // idx=0, timer cleared). Caller (App.jsx replayQuestions) handles
  // view transition + disabling useTimer for the redo round.
  const replayQuestions = useCallback((qs) => {
    if (!Array.isArray(qs) || qs.length === 0) return;
    // Same hygiene as resetSession — drop in-flight marker so reload
    // behaves predictably during the replay round.
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
    setQuestions(qs);
    setAnswers({});
    setCurrentIdx(0);
    setExamStartTime(Date.now());
    setTimeLeft(0);
  }, []);

  // ── Lifecycle helpers (App.jsx calls these from startExam/goHome) ───

  /** Called by App.startExam after the pool is built + picked. */
  const startNewSession = useCallback((picked, firstTime) => {
    setQuestions(picked);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(firstTime);
    setExamStartTime(Date.now());
  }, []);

  /** Called by App.resumePendingExam to rehydrate from localStorage. */
  const primeFromSaved = useCallback((saved) => {
    if (!saved?.questions?.length) return false;
    setQuestions(saved.questions);
    setAnswers(saved.answers || {});
    setCurrentIdx(saved.currentIdx || 0);
    return true;
  }, []);

  /** Called by App.goHome / App.dismissPendingExam to clear runtime state. */
  const resetSession = useCallback(() => {
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setExamStartTime(null);
    setTimeLeft(0);
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;

  return {
    // State
    questions, setQuestions,
    answers, setAnswers,
    currentIdx, setCurrentIdx,
    timeLeft, setTimeLeft,
    examStartTime, setExamStartTime,
    // Derived
    currentQ, currentAnswer,
    // Actions
    answerCurrent, nextQ, prevQ, jumpToQ, replayQuestions,
    // Lifecycle helpers
    startNewSession, primeFromSaved, resetSession,
  };
}
