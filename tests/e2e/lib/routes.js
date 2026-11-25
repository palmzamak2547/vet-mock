// The routes a student can open, and the way a visit to one is seeded and read. Shared by the route
// sweep (tests/e2e/route-sweep.spec.js) and the defect sweep (tests/e2e/defect-sweep.spec.js), so the
// two read one list: every view in `APP_VIEW_ROUTES` (src/lib/view-route.js) plus EXTRA_ROUTES, with
// NOT_ROUTED naming each view App.jsx renders that has no address, and why.
import { APP_VIEW_ROUTES } from '../../../src/lib/view-route.js';
import { QB, loadQB } from '../../../src/data/questions.js';
import { isQuestionDeliverable } from '../../../src/data/question-delivery.generated.js';

// Views App.jsx renders that have no address of their own, and why.
export const NOT_ROUTED = {
  landing: 'the front door at / for a visitor with no year (the visitor persona of / and of year-scoped routes)',
  auth: 'sign-in screen, opened from a button; this bundle has no backend to sign in to',
  'topic-select': 'needs a chosen subject: a step of the practice flow',
  config: 'needs a chosen subject and topic: a step of the practice flow',
  exam: 'needs a running set',
  results: 'needs a finished set',
  review: 'needs a finished set',
  wrapup: 'needs a chosen paper wrap-up, opened from Home',
  notes: 'needs a chosen subject; reached from a topic',
  knowledge: 'the wiki reader, served at /wiki/* (opened below as an extra route)',
  wiki: 'the wiki reader, served at /wiki/* (opened below as an extra route)',
  profile: 'a personal hub opened from the bar; view-route.js explains why it has no link',
  'card-studio': 'the card studio, opened from the card on the profile, which has no address either',
  'group-detail': 'needs a signed-in account and a chosen group',
  lab: 'Imaging Practical, opened at /#lab (an extra route below)',
  'connect-apps': 'opened from settings with a signed-in account',
  'mock-exam': 'retired; renders the fallback only',
  'mock-results': 'retired; renders the fallback only',
};

// Addresses that are routes but not views of APP_VIEW_ROUTES: [view App shows, path].
export const EXTRA_ROUTES = [
  ['knowledge', '/wiki'],
  ['lab', '/#lab'],
];

export const ROUTES = [...Object.entries(APP_VIEW_ROUTES), ...EXTRA_ROUTES];

// The student's history and cards name real questions of their year, as a real student's do.
let studiedOnce;
export function studiedQuestions() {
  studiedOnce ??= loadQB().then(() => {
    const picked = QB.filter((q) => q.year === 5 && isQuestionDeliverable(q) && (q.type === 'mcq' || q.type === 'tf')).slice(0, 12)
      .map((q) => ({ id: q.id, subject: q.subject }));
    if (picked.length < 12) throw new Error('the sweep needs twelve year-5 questions for its student');
    return picked;
  });
  return studiedOnce;
}

// Runs in the page (an init script): a year-5 student with history, review cards, a bookmark, a streak.
export function seedStudent({ now, studied }) {
  try {
    const day = 86_400_000;
    localStorage.setItem('vmx-selected-year', '5');
    localStorage.setItem('vmx-selected-phase', JSON.stringify('1-mid'));
    localStorage.setItem('vmx-seen-landing', '1');
    localStorage.setItem('vmx-consent', JSON.stringify('essential'));
    localStorage.setItem('vmx-pwa-install-dismissed', '1');
    localStorage.setItem('vmx-history', JSON.stringify(studied.map((q, i) => ({
      date: now - i * 3_600_000, questionId: q.id, subject: q.subject, year: 5, phase: '1-mid', correct: i % 3 !== 0,
    }))));
    localStorage.setItem('vmx-sr-cards', JSON.stringify(Object.fromEntries(studied.slice(0, 3).map(({ id }) => [id, {
      questionId: id, easeFactor: 2.5, interval: 1, repetitions: 1, lapses: 0, totalReviews: 1,
      lastReview: now - 3 * day, nextReview: now - day,
    }]))));
    localStorage.setItem('vmx-bookmarks', JSON.stringify([studied[0].id]));
    localStorage.setItem('vmx-streak', JSON.stringify({ streak: 3, lastDate: now - day, freezeUsedAt: null }));
  } catch { /* storage refused: the visit itself will say so */ }
}

export const isNoise = (text) => /Vercel Web Analytics|Vercel Speed Insights|va\.vercel-scripts|vitals\.vercel-insights|_vercel\/(insights|speed-insights)|Unrecognized feature|downloadable font.*fonts\.gstatic\.com|__cf_bm|rejected for invalid domain/i.test(text);

export async function visit(page, path) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(`.${path}`, { waitUntil: 'domcontentloaded' });
      return;
    } catch (error) {
      // The transient navigation cancels mobile-compat.spec.js retries, and only those.
      if (!/NS_BINDING_ABORTED|NS_ERROR_FAILURE|unknown error|frame was detached|interrupted by another navigation|Frame load interrupted/i.test(String(error)) || attempt === 2) throw error;
      await page.waitForTimeout(100 * (attempt + 1));
    }
  }
}

// The screen a visit drew, read in the page, in either language of the interface
// (tests/e2e/ui-language.spec.js walks the English one).
export function readScreen() {
  const main = document.querySelector('#main') || document.querySelector('main');
  const loading = !!main && (!!main.querySelector('.vmx-view-fallback')
    || [...main.querySelectorAll('[aria-busy="true"]')].some((el) => /กำลังโหลด|Loading/.test(el.textContent || '')));
  return {
    landing: !!document.querySelector('.lp-root main#lp-main'),
    view: document.querySelector('#main')?.getAttribute('data-view') || null,
    authCard: !!document.getElementById('vmx-auth-required-title'),
    errorCard: /หน้านี้ขัดข้อง|This page crashed/.test(main?.innerText || ''),
    loading,
  };
}
