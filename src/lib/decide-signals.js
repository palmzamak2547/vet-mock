// ============================================================
// decide-signals.js — what the screens tell src/lib/decide.js
// ============================================================
// The topic screen applies practice.setup and the config screen explains it;
// both build the signals here, so the set a tap makes and the line that
// describes it read the same facts. This is the side that may read the clock,
// storage and the timetable; the rules in decide.js never do.
// ============================================================
import { getUpcomingExams } from '../data/schedule.js';
import { recallLadderStep } from './practice-ladder.js';

/** Bangkok days to the next paper of `subject` in `year`'s timetable, or null. */
export function daysToSubjectPaper(subject, year, now = new Date()) {
  if (!subject || subject === 'all' || !Number.isFinite(year)) return null;
  const next = getUpcomingExams(`y${year}`, now).find((e) => e.subject === subject && e.daysLeft >= 0);
  return next ? next.daysLeft : null;
}

export function practiceSignals({ subject, year, available, timePerQ, instantFeedback, practiceMode, hasHistory, now = new Date() }) {
  return {
    step: recallLadderStep(),
    available: Number.isFinite(available) && available > 0 ? available : null,
    timePerQ,
    instantFeedback: instantFeedback !== false,
    pick: practiceMode === 'adaptive' ? 'adaptive' : 'random',
    hasHistory: Boolean(hasHistory),
    daysToPaper: daysToSubjectPaper(subject, year, now),
  };
}
