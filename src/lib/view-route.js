// Readable URLs for stable, self-contained app destinations. Stateful flows
// (topic config, an active exam, results) intentionally stay out of this map:
// restoring only half their state would be worse than returning to Home.
const VIEW_TO_PATH = Object.freeze({
  home: '/',
  'subject-select': '/app/study',
  'sr-session': '/app/review',
  dashboard: '/app/progress',
  'question-manager': '/app/questions',
  groups: '/app/groups',
  'leaderboard-global': '/app/leaderboard',
  schedule: '/app/schedule',
  scores: '/app/course-scores',
  videos: '/app/videos',
  about: '/app/about',
  feedback: '/app/feedback',
  'ig-cards': '/app/tools/cards',
  'year-select': '/app/year',
  'phase-select': '/app/phase',
  'reading-checklist': '/app/reading',
  faculty: '/app/faculty',
  'account-settings': '/app/account',
  'offline-game': '/app/game',
  pomodoro: '/app/focus',
  race: '/app/race',
  'pdf-annotate': '/app/tools/pdf',
  pinboard: '/app/pinboard',
  'image-occlusion': '/app/tools/image-occlusion',
  'phase-wrapped': '/app/wrapped',
  contribute: '/app/contribute',
  'review-queue': '/app/review-queue',
});

const PATH_TO_VIEW = new Map(
  Object.entries(VIEW_TO_PATH)
    .filter(([, path]) => path !== '/')
    .map(([view, path]) => [path, view]),
);

function normalizePath(pathname) {
  if (typeof pathname !== 'string' || !pathname) return '/';
  const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return withoutTrailingSlash || '/';
}

export function appPathForView(view) {
  return VIEW_TO_PATH[view] || null;
}

export function viewForAppPath(pathname) {
  return PATH_TO_VIEW.get(normalizePath(pathname)) || null;
}

export function isAppPath(pathname) {
  const normalized = normalizePath(pathname);
  return normalized === '/app' || normalized.startsWith('/app/');
}

export const APP_VIEW_ROUTES = VIEW_TO_PATH;
