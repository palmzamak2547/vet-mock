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
  library: '/app/library',
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

// Views whose CONTENT is filtered by the student's year. A visitor who has
// never picked one must be asked before any of these is drawn, because the
// app would otherwise present the default cohort's year as the visitor's own
// ("พร้อมฝึกสำหรับ ปี 5" to someone who never said they are in year 5).
//
// Deliberately NOT year-scoped, so a link posted in a group chat still opens
// for a stranger: the open-shelf library, video shelf, VetWiki, the faculty
// directory, about/feedback. Those either show every year at once or none.
const YEAR_SCOPED_VIEWS = new Set([
  'home',
  'subject-select',
  'dashboard',
  'leaderboard-global',
  'sr-session',
]);

/**
 * Has this visitor actually chosen a year?
 *
 * `vmx-selected-year` is absent for a brand-new browser and holds the STRING
 * 'null' once useLocalStorage has written its initial value back — both mean
 * "not chosen". Any other parseable value is a real choice.
 */
export function hasPickedYear(storedRaw) {
  if (storedRaw === null || storedRaw === undefined) return false;
  try {
    return JSON.parse(storedRaw) !== null;
  } catch {
    return false;
  }
}

/**
 * The front door for a visitor who has not picked a year yet, or null when
 * they may proceed to `view` as-is.
 *
 * Returns 'landing' the very first time (the marketing front door, which is
 * what "/" already does) and 'year-select' afterwards.
 */
export function frontDoorFor(view, { storedYearRaw, seenLanding } = {}) {
  if (hasPickedYear(storedYearRaw)) return null;
  if (!YEAR_SCOPED_VIEWS.has(view)) return null;
  return seenLanding ? 'year-select' : 'landing';
}

export const YEAR_SCOPED_VIEW_IDS = YEAR_SCOPED_VIEWS;

export const APP_VIEW_ROUTES = VIEW_TO_PATH;
