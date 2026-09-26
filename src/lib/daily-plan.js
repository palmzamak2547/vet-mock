// Planning estimates, not predicted mastery. Leave explicit time for review.
export function buildDailyPlan({ minutes = 30, due = 0, wrong = 0, exam = false, examUrgent = false, weakSubject = null, practiceAvailable = Infinity } = {}) {
  const budget = [15, 30, 60].includes(minutes) ? minutes : 30;
  const reviewMinutes = budget === 15 ? 3 : 5;
  let remaining = budget - reviewMinutes;
  const steps = [];
  const dueCount = Number.isFinite(Number(due)) ? Math.max(0, Math.floor(Number(due))) : 0;
  const wrongCount = Number.isFinite(Number(wrong)) ? Math.max(0, Math.floor(Number(wrong))) : 0;
  const available = practiceAvailable === Infinity ? Infinity
    : Number.isFinite(Number(practiceAvailable)) ? Math.max(0, Math.floor(Number(practiceAvailable))) : 0;
  const reviews = Math.min(dueCount, 20, Math.floor(remaining / 2));
  if (reviews) { steps.push({ kind: 'sr', count: reviews, minutes: reviews }); remaining -= reviews; }
  const count = Math.max(1, Math.floor(remaining / 2));
  const kind = exam ? 'exam' : wrongCount > 0 ? 'wrong' : weakSubject ? 'weak' : 'practice';
  const actualCount = Math.min(count, kind === 'wrong' ? wrongCount : available);
  if (actualCount) steps.push({ kind, count: actualCount, minutes: actualCount * 2, subject: weakSubject });
  remaining -= actualCount * 2;
  // A short wrong-answer set should not turn a whole hour into reading time.
  if (kind === 'wrong' && remaining >= 2 && available > 0) {
    const extra = Math.min(Math.floor(remaining / 2), available);
    steps.push({ kind: weakSubject ? 'weak' : 'practice', count: extra, minutes: extra * 2, subject: weakSubject });
  }
  if (exam && examUrgent) steps.reverse();
  const used = steps.reduce((sum, step) => sum + step.minutes, 0);
  return { budget, steps, reviewMinutes: budget - used };
}
