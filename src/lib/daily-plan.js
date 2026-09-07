// Planning estimates, not predicted mastery. Leave explicit time for review.
export function buildDailyPlan({ minutes = 30, due = 0, wrong = 0, exam = false, weakSubject = null } = {}) {
  const budget = [15, 30, 60].includes(minutes) ? minutes : 30;
  const reviewMinutes = budget === 15 ? 3 : 5;
  let remaining = budget - reviewMinutes;
  const steps = [];
  const reviews = Math.min(Math.max(0, Math.floor(Number(due) || 0)), 20, Math.floor(remaining / 2));
  if (reviews) { steps.push({ kind: 'sr', count: reviews, minutes: reviews }); remaining -= reviews; }
  const count = Math.max(1, Math.floor(remaining / 2));
  const kind = exam ? 'exam' : wrong > 0 ? 'wrong' : weakSubject ? 'weak' : 'practice';
  const actualCount = kind === 'wrong' ? Math.min(count, Math.floor(wrong)) : count;
  steps.push({ kind, count: actualCount, minutes: actualCount * 2, subject: weakSubject });
  const used = steps.reduce((sum, step) => sum + step.minutes, 0);
  return { budget, steps, reviewMinutes: budget - used };
}
