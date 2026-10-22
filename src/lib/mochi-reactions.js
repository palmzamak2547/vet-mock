// ============================================================
// Mochi's reactions in a practice set, as inputs the screen sets
// ============================================================
// The screen says what happened (a verdict, how many correct in a row); this
// module decides what Mochi does about it: which still pose stays on the
// stamp, which Motion Kit state plays over it once, and which short
// vibration a phone gives. Pure: no React, no DOM, no clock.
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
 * What Mochi does for one revealed answer.
 *   pose    the still on the stamp (what the e2e and the reader see after)
 *   play    the Motion Kit state played once over it
 *   haptic  the vibration kind (lib/haptics.js)
 * The still stays 'correct' through a run: the stamp keeps meaning "ถูกแล้ว",
 * and only the movement grows with the run.
 */
export function feedbackReaction({ ok, run = 0 }) {
  if (!ok) return { pose: 'encourage', play: 'encourage', haptic: 'wrong' };
  const haptic = isComboMilestone(run) ? 'milestone' : 'correct';
  if (run >= 10) return { pose: 'correct', play: 'dance', haptic };
  if (run >= 5) return { pose: 'correct', play: 'highfive', haptic };
  if (run >= COMBO_MIN) return { pose: 'correct', play: 'hop', haptic };
  return { pose: 'correct', play: 'correct', haptic };
}
