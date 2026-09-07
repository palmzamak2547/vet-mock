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

import { useState, useCallback, useEffect, useRef } from 'react';
import { timeForQuestion, isWritingType } from './utils.js';
import { confirmDialog } from '../lib/dialog.js';
import { inflightExamKey, isOwnedExam } from '../lib/exam-recovery.js';
import { secondsUntilDeadline } from '../lib/exam-clock.js';
import { createQuestionTiming, newStudySessionId, validSessionId } from '../lib/study-events.js';

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
export function useExamSession({ view, useTimer, timePerQ, onFinish, ownerId = null }) {
  // ── State (with localStorage hydration for in-flight resume) ────────
  const [initialSaved] = useState(null);
  const [sessionId, setSessionId] = useState(() => validSessionId(initialSaved?.sessionId) ? initialSaved.sessionId : newStudySessionId());
  const [sessionOwner, setSessionOwner] = useState(ownerId);
  const [completedAt, setCompletedAt] = useState(null);
  const timingRef = useRef(null);
  if (!timingRef.current) timingRef.current = createQuestionTiming(initialSaved?.questionTimes);
  const getQuestionTimes = useCallback(() => timingRef.current.snapshot(), []);
  const [questions, setQuestions] = useState(() => initialSaved?.questions || []);
  const [answers, setAnswers] = useState(() => initialSaved?.answers || {});
  const [currentIdx, setCurrentIdx] = useState(() => (
    Number.isInteger(initialSaved?.currentIdx)
      && initialSaved.currentIdx >= 0 && initialSaved.currentIdx < initialSaved.questions.length
      ? initialSaved.currentIdx : 0
  ));
  const [timeLeft, setRemainingTime] = useState(0);
  const [questionDeadline, setQuestionDeadline] = useState(null);
  const [examStartTime, setExamStartTime] = useState(null);
  const setTimeLeft = useCallback((seconds) => {
    const duration = Math.max(0, Number(seconds) || 0);
    setQuestionDeadline(Date.now() + duration * 1000);
    setRemainingTime(duration);
  }, []);
  const positionRef = useRef(null);
  positionRef.current = { questions, currentIdx, view };

  const timedQuestionId = view === 'exam' ? questions[currentIdx]?.id : null;
  useEffect(() => {
    const timer = timingRef.current;
    timer.enter(timedQuestionId, document.visibilityState !== 'hidden');
    const onVisibility = () => timer.visibility(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () => { timer.stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [timedQuestionId, sessionId]);

  // ── Shadow-start clock ──────────────────────────────────────────────
  // When entering view='exam' via a share-link (?qset=) the normal
  // startExam() never ran, so timeLeft + examStartTime stay at their
  // defaults. Without this priming effect, the timer tick below would
  // immediately see timeLeft=0 and auto-fire onFinish on single-Q quizzes.
  useEffect(() => {
    if (view !== 'exam') return;
    if (questions.length === 0) return;
    if (examStartTime !== null) return;
    setSessionOwner(ownerId);
    setExamStartTime(Date.now());
    setTimeLeft(timeForQuestion(questions[currentIdx], timePerQ));
  }, [view, questions, currentIdx, timePerQ, examStartTime, ownerId]);

  // ── Timer tick ──────────────────────────────────────────────────────
  // Reconciles with wall time. On time-up: advance to next Q
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
    const update = () => setRemainingTime(secondsUntilDeadline(questionDeadline));
    const t = setTimeout(update, 1000);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pageshow', update);
    return () => {
      clearTimeout(t);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pageshow', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onFinish stable via ref pattern in caller
  }, [timeLeft, questionDeadline, view, useTimer, currentIdx, questions, timePerQ, examStartTime]);

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
        // The timer or navigation may have moved on while the dialog was open.
        const live = positionRef.current;
        if (live.view !== 'exam' || live.questions !== questions || live.currentIdx !== currentIdx) return;
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
    timingRef.current.reset();
    setSessionOwner(ownerId);
    setCompletedAt(null);
    setSessionId(newStudySessionId());
    // Same hygiene as resetSession — drop in-flight marker so reload
    // behaves predictably during the replay round.
    try { window.localStorage?.removeItem(inflightExamKey(ownerId)); } catch {}
    setQuestions(qs);
    setAnswers({});
    setCurrentIdx(0);
    setExamStartTime(Date.now());
    setTimeLeft(0);
  }, [ownerId]);

  // ── Lifecycle helpers (App.jsx calls these from startExam/goHome) ───

  /** Called by App.startExam after the pool is built + picked. */
  const startNewSession = useCallback((picked, firstTime) => {
    timingRef.current.reset();
    setSessionOwner(ownerId);
    setCompletedAt(null);
    setSessionId(newStudySessionId());
    setQuestions(picked);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(firstTime);
    setExamStartTime(Date.now());
  }, [ownerId]);

  /** Called by App.resumePendingExam to rehydrate from localStorage. */
  const primeFromSaved = useCallback((saved) => {
    if (!isOwnedExam(saved, ownerId)) return false;
    if (!Array.isArray(saved?.questions) || !saved.questions.length) return false;
    if (saved.questions.some((q) => !q || q.id == null || typeof q.q !== 'string')) return false;
    setSessionOwner(ownerId);
    setCompletedAt(saved.submitted && Number.isFinite(saved.submittedAt) ? saved.submittedAt : null);
    timingRef.current.reset(saved.questionTimes);
    setSessionId(validSessionId(saved.sessionId) ? saved.sessionId : newStudySessionId());
    const index = Number.isInteger(saved.currentIdx) && saved.currentIdx >= 0
      && saved.currentIdx < saved.questions.length ? saved.currentIdx : 0;
    setQuestions(saved.questions);
    setAnswers(saved.answers || {});
    setCurrentIdx(index);
    setExamStartTime(Number.isFinite(saved.examStartTime) ? saved.examStartTime : Date.now());
    if (Number.isFinite(saved.questionDeadline) && saved.questionDeadline > 0) {
      setQuestionDeadline(saved.questionDeadline);
      setRemainingTime(secondsUntilDeadline(saved.questionDeadline));
    } else {
      setTimeLeft(timeForQuestion(saved.questions[index], saved.timePerQ ?? timePerQ));
    }
    return true;
  }, [setTimeLeft, timePerQ, ownerId]);

  /** Called by App.goHome / App.dismissPendingExam to clear runtime state. */
  const resetSession = useCallback(() => {
    timingRef.current.reset();
    setSessionOwner(ownerId);
    setCompletedAt(null);
    setSessionId(newStudySessionId());
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setExamStartTime(null);
    setTimeLeft(0);
  }, [ownerId]);

  // ── Derived ─────────────────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;

  return {
    // State
    questions, setQuestions,
    answers, setAnswers,
    currentIdx, setCurrentIdx,
    timeLeft, setTimeLeft,
    questionDeadline,
    examStartTime, setExamStartTime,
    sessionId, getQuestionTimes, sessionOwner, completedAt,
    // Derived
    currentQ, currentAnswer,
    // Actions
    answerCurrent, nextQ, prevQ, jumpToQ, replayQuestions,
    // Lifecycle helpers
    startNewSession, primeFromSaved, resetSession,
  };
}
