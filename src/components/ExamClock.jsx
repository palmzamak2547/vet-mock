// ============================================================
// ExamClock — the countdown on a timed set
// ============================================================
// It ticks on its own, so a second passing re-renders these few characters
// and nothing else. The session hook watches the same deadline and ends or
// advances the set when it passes; it no longer holds the seconds in App
// state, which re-rendered the app, ExamView and the question card once a
// second while a student was typing an essay.
//
// What it shows is always the deadline minus the wall clock, read at render,
// so a new deadline (the next question on a per-question clock) shows its
// full allowance at once, and a tab that was throttled, hidden or restored
// from the back-forward cache shows the right time the moment it is looked
// at. The tick lands when the shown second changes, not a second after the
// clock was mounted.
// ============================================================

import { useEffect, useReducer } from 'react';
import { fmtTime } from '../hooks/utils.js';
import { secondsUntilDeadline } from '../lib/exam-clock.js';

export default function ExamClock({ deadline, writing = false }) {
  const [, tick] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    let timer = null;
    const arm = () => {
      clearTimeout(timer);
      const left = deadline - Date.now();
      // Seconds are shown rounded up, so 0:59 holds from 59.000 s down to
      // 58.001 s and the next change is `left % 1000` ms away.
      if (left > 0) timer = setTimeout(update, left % 1000 || 1000);
    };
    const update = () => { tick(); arm(); };
    arm();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pageshow', update);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pageshow', update);
    };
  }, [deadline]);

  const timeLeft = secondsUntilDeadline(deadline);
  const warn = timeLeft <= 10 || (timeLeft <= 60 && writing);
  return (
    <div className={`vmx-timer ${warn ? 'warn' : ''}`}>
      {fmtTime(timeLeft)}
    </div>
  );
}
