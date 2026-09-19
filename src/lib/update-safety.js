// Views where applying a new build costs the student something.
//
// Two paths can swap the app underneath someone: a waiting service worker,
// and a lazy chunk whose hash died in a deploy (vite:preloadError, which
// recovers by reloading). Both used to decide for themselves whether the
// moment was safe — App.jsx held this list of eight, while app-lifecycle.js
// checked only `activeView === 'exam'`. So a student who had just submitted
// and was reading the score, or was on the answers, got reloaded to Home with
// the screen gone, from the one path that was never told about them.
//
// None of these views has a URL of its own, which is exactly why a reload
// cannot put the student back: exam, sr-session, race and pomodoro are work in
// progress, and results, review, config and topic-select are state that only
// exists in memory.
export const UPDATE_UNSAFE_VIEWS = [
  'exam', 'sr-session', 'race', 'pomodoro', 'results', 'review', 'config', 'topic-select',
];

export const isUpdateUnsafe = (view) => UPDATE_UNSAFE_VIEWS.includes(view);
