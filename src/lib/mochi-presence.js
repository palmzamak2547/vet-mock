// Decoration policy only; navigation and study data retain their own sources.
export const MOCHI_PAGE_POSES = Object.freeze({
  home: 'wave', 'subject-select': 'curious', 'topic-select': 'think', config: 'think',
  'year-select': 'wave', 'phase-select': 'curious', auth: 'wave',
  notes: 'read', knowledge: 'read', wiki: 'read', library: 'read', videos: 'read',
  'reading-checklist': 'read', faculty: 'curious', schedule: 'think',
  dashboard: 'read', scores: 'think', 'phase-wrapped': 'happy',
  'sr-session': 'think', results: 'encourage', review: 'read',
  groups: 'hearts', 'group-detail': 'hearts', 'leaderboard-global': 'happy',
  pinboard: 'read', 'question-manager': 'read', 'review-queue': 'think',
  feedback: 'hearts', contribute: 'hearts', about: 'wave', privacy: 'read',
  'account-settings': 'idle', 'ig-cards': 'happy',
});

export function mochiPresenceFor(view, mode) {
  const pose = typeof view === 'string' && Object.prototype.hasOwnProperty.call(MOCHI_PAGE_POSES, view) ? MOCHI_PAGE_POSES[view] : null;
  return { visible: Boolean(pose), pose: pose || 'idle', feedback: view === 'exam' && mode === 'quick' };
}

export function mochiResultPose(score, gradedCount) {
  return gradedCount >= 3 && score?.total > 0 && score.correct / score.total >= .8
    ? 'celebrate' : 'encourage';
}
