// ============================================================
// parked-resume — resuming a parked set, one tap at a time
// ============================================================
// Resuming waits for the banks (up to RESUME_BANK_WAIT_MS) so a set still being answered continues
// on the current questions (exam-recovery.js refreshParkedQuestions). A wait is a window for the
// student to act, so:
//   - one resume runs at a time: a second tap while one is running joins it (createSingleFlight),
//     so a late second call can never prime the session again over answers given meanwhile;
//   - after the wait the resume carries on only if the student is still where they tapped and the
//     parked record is the one read at the tap (same sessionId and savedAt). A new set started, or
//     the set discarded, during the wait wins: the stale resume is dropped.
// App.jsx shows the card as busy from the tap until the run settles.
import { readOwnedExam, refreshParkedQuestions } from './exam-recovery.js';

export const RESUME_BANK_WAIT_MS = 8000;

/** fn's runs never overlap: a call while one is running gets that run's promise. */
export function createSingleFlight() {
  let running = null;
  return (fn) => {
    if (running) return running;
    running = Promise.resolve().then(fn).finally(() => { running = null; });
    return running;
  };
}

/** Is `saved` still the record parked for `owner` (nothing replaced or discarded it)? */
export function parkedStillCurrent(storage, owner, saved) {
  const now = readOwnedExam(storage, owner);
  return !!now && now.sessionId === saved?.sessionId && now.savedAt === saved?.savedAt;
}

/**
 * The resume itself. Every effect is passed in, so the order of checks is testable:
 *   read()          the parked record, or null (may await a confirmation)
 *   loadYear(y)     loads one year's banks (NaN: every bank)
 *   bank()          the questions loaded now
 *   stillCurrent(s) after the wait: same account, still on Home, same parked record
 *   prime(s)        hands the record to the session; false when it refuses
 *   apply(s)        restores the set's settings and opens it
 *   onBusy(b)       the card's busy state
 * Returns 'none' | 'stale' | 'refused' | 'resumed'.
 */
export async function resumeParkedSet({ read, loadYear, bank, stillCurrent, prime, apply, onBusy = () => {},
  waitMs = RESUME_BANK_WAIT_MS, timer = setTimeout }) {
  onBusy(true);
  try {
    let saved = await read();
    if (!saved) return 'none';
    if (!saved.submitted) {
      const years = [...new Set((saved.questions || []).map((q) => q?.year).filter(Number.isFinite))];
      const loads = Promise.all((years.length ? years : [NaN]).map((y) => loadYear(y)));
      const loaded = await Promise.race([loads.then(() => true, () => false), new Promise((r) => timer(() => r(false), waitMs))]);
      if (!stillCurrent(saved)) return 'stale';
      if (loaded) saved = { ...saved, questions: refreshParkedQuestions(saved.questions, bank()).questions };
    }
    if (!prime(saved)) return 'refused';
    apply(saved);
    return 'resumed';
  } finally {
    onBusy(false);
  }
}
