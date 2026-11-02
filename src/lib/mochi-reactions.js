// ============================================================
// Reactions to a verdict in a practice set, as inputs the screen sets
// ============================================================
// The screen says what happened (a verdict, how many correct in a row); this
// module decides what follows: the run the "ถูกติดกัน" chip counts and the
// short vibration a phone gives. Pure: no React, no DOM, no clock.
// Mochi's stamp beside the verdict went in 5.189.2 (Palm: "ดูแปลกตา"), and
// with it the pose and the Motion Kit state chosen here for it.
// ============================================================

import { isCorrect, isAnswered } from '../hooks/utils.js';

// Only these give a verdict the moment they are answered (Question.jsx);
// fill, match and writing are graded at the end.
const INSTANT = new Set(['mcq', 'tf']);

/**
 * Correct instant verdicts in a row, ending at `idx`, in set order.
 * A question without an instant verdict neither breaks nor extends the run;
 * a wrong or unanswered one ends it.
 */
export function correctRun(questions, answers, idx) {
  let run = 0;
  for (let i = Math.min(idx, (questions?.length || 0) - 1); i >= 0; i--) {
    const q = questions[i];
    if (!q || !INSTANT.has(q.type)) continue;
    const answer = answers?.[q.id];
    if (!isAnswered(answer) || !isCorrect(q, answer)) break;
    run += 1;
  }
  return run;
}

/** The runs worth marking: 3, 5, then every 5 from 10. */
export const isComboMilestone = (run) => run === 3 || run === 5 || (run >= 10 && run % 5 === 0);

/** The run at which the "ถูกติดกัน" chip appears. */
export const COMBO_MIN = 3;

/**
 * What one revealed answer does to the phone.
 *   haptic  the vibration kind (lib/haptics.js): a miss is the soft double
 *           tick, a run milestone the longer pattern, any other right answer
 *           one tick.
 */
export function feedbackReaction({ ok, run = 0 }) {
  if (!ok) return { haptic: 'wrong' };
  return { haptic: isComboMilestone(run) ? 'milestone' : 'correct' };
}
