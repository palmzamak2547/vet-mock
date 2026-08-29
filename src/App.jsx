import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { flushSync } from 'react-dom';
// Phase 3 perf: QB is now lazy. The static export here is the SAME
// array reference forever, but it's empty until `loadQB()` resolves.
// App.jsx kicks off loadQB() in a top-level effect (background load
// after first paint) and gates exam-start paths on the populated QB.
import { QB, loadQB, loadQBForYear, isQBLoaded, isQBYearLoaded, isQBFullyLoaded } from './data/questions.js';
import { SUBJECTS, YEARS, CURRENT_YEAR, hiddenTopicIdsFor, yearForSubject } from './data/curriculum.js';
import { useLocalStorage } from './hooks/useStorage.js';
import { useAuth } from './hooks/useAuth.js';
import { useWakeLock } from './hooks/useWakeLock.js';
import { useOnlineCount } from './hooks/useOnlineCount.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { useUserDataSync } from './hooks/useUserDataSync.js';
import ThemePicker from './components/ThemePicker.jsx';
import UserMenu from './components/UserMenu.jsx';
import HeaderBar from './components/HeaderBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import SyncStatusNotice from './components/SyncStatusNotice.jsx';
import AuthRequiredState, { AuthUnavailableState } from './components/AuthRequiredState.jsx';
import { useStudyBuddies } from './hooks/useStudyBuddies.js';
import { useExamSession } from './hooks/useExamSession.js';
import { shuffle, isCorrect, updateStreak, timeForQuestion, isWritingType, questionCategory as catOf } from './hooks/utils.js';
import { getCardStats } from './hooks/sm2.js';
import { isFlashcardCompatible } from './hooks/sr-filter.js';
// Global stylesheet. 2026-05-27: converted from a JS template-literal
// export (src/styles.js, injected via <style>{STYLES}</style>) to a real
// CSS file Vite handles natively. Kills the backtick-in-comment fragility
// class (STABILITY rule 5) and removes a runtime <style> injection —
// the sheet now loads in <head> before JS runs (better FOUC behavior).
import './styles.css';
import './styles-landing.css';
import { hasSupabase, signOut, signInWithGoogle, signInWithMagicLink } from './lib/supabase.js';
import { parseWikiPath, wikiPath } from './lib/vetwiki/url.js';
import { saveExamResult } from './lib/api.js';
import { readShareUrlFromLocation, readSenderInfoFromLocation } from './lib/share-link.js';
import { awardXp, XP_AWARDS } from './lib/xp.js';
import { recordQuestEvent } from './lib/quests.js';
import { findAutoPromoteCandidates, makeLowEaseCard } from './lib/wrong-to-sr.js';
import { migrateUniqueTopicProgress } from './lib/study-progress.js';
import { appPathForView, isAppPath, viewForAppPath } from './lib/view-route.js';
import { isQuestionDeliverable } from './data/question-delivery.generated.js';

// Eager — needed for first paint
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Lazy — HomeView is 1300+ lines and pulls curriculum.js + changelog.
// Splitting it shaves ~80KB off the initial bundle. We prefetch it on
// idle below so navigation feels instant even on first cold load.
const HomeView = lazy(() => import('./views/HomeView.jsx'));

// Lazy — pulls VIDEO_SUMMARIES (~200KB) into a separate chunk so it
// only ships when the user actually presses ⌘K (or clicks the search
// button). Keeps the first-paint bundle small.
const CommandPalette = lazy(() => import('./components/CommandPalette.jsx'));

// InstructorModal — also lazy. Opens when an instructor is selected
// from the palette or from a topic card.
const InstructorModal = lazy(() => import('./components/InstructorModal.jsx'));
// VoiceSettings — sliders for TTS pace + pause defaults. Lazy because
// most sessions never tweak voice — keep the main bundle slim.
const VoiceSettings = lazy(() => import('./components/VoiceSettings.jsx'));

// VetCalculator — floating widget for clinical math (RER, fluid ·
// drug dose, transfusion, DKA insulin). Imported eagerly because
// the FAB button needs to render on every page; modal contents only
// run when the user opens it, so the runtime cost is just ~5KB
// gzipped of inert UI code on first paint.
import VetCalculator from './components/VetCalculator.jsx';
// Unified bottom-right FAB — single button fans out to 🧮 + 🎨. Tiny
// component (~3 KB) and used on nearly every view, so import eagerly.
import ToolsFAB from './components/ToolsFAB.jsx';
import BottomNav from './components/BottomNav.jsx';

// Sketchpad — opens a blank canvas for free-form drawing/diagrams.
// Lazy because it includes canvas + image processing only used when
// the user opens the pad.
const ImageAnnotator = lazy(() => import('./components/ImageAnnotator.jsx'));

// VetMock's practical Imaging Lab intentionally stays separate from the
// full CUVETSMO imaging workstation. Keep it lazy: the Cornerstone/DICOM
// stack is only downloaded when a learner opens #lab.
const LabView = lazy(() => import('./views/LabView.jsx'));

// PinboardView — personal pin grid (Qs / summaries / flashcards /
// notes). Lazy because most sessions never open it.
const PinboardView = lazy(() => import('./views/PinboardView.jsx'));
const ContributeView = lazy(() => import('./views/ContributeView.jsx'));
const ReviewQueueView = lazy(() => import('./views/ReviewQueueView.jsx'));

// HighlightToCard — listens for text selections inside
// .vmx-summary-body (SummaryModal content) and offers a floating
// "✨ ทำ flashcard" button that opens a save modal. Lazy because
// users only need it when reading a video summary.
const HighlightToCard = lazy(() => import('./components/HighlightToCard.jsx'));

// XpChip + QuestsPanel are NOT imported here anymore (2026-05-27):
//   • XpChip moved into components/HeaderBar.jsx (its only consumer).
//   • QuestsPanel is owned by HomeView (renders under the streak row).
// Removing the dead App-level imports keeps the module graph honest.

// ShortcutSheet — Linear-style "press ? for keyboard help" modal.
// Tiny, but only opened on `?` press from exam/review, so lazy keeps
// it out of the first-paint bundle.
const ShortcutSheet = lazy(() => import('./components/ShortcutSheet.jsx'));

// View Transitions API helper — wraps a state update so the browser
// snapshots the DOM before/after and crossfades automatically. Falls
// back to a plain call when the API isn't available (Firefox, older
// Safari). Only animates if the user hasn't asked to reduce motion.
//
// Uses flushSync inside startViewTransition so React commits the
// update synchronously before the browser captures the "new" frame.
// Without flushSync, React 18 may batch the update past the
// transition window and you'd see no animation.
function withTransition(updateFn) {
  if (typeof document === 'undefined' || typeof updateFn !== 'function') {
    updateFn?.();
    return;
  }
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // Mobile WebKit can hard-crash while snapshotting a large React view
  // (observed on config → exam under iPhone/Safari). Its UA still exposes
  // the API, so capability detection alone is not sufficient. iOS browsers
  // all use WebKit; desktop Chromium contains "AppleWebKit" too, hence the
  // explicit Chromium-family exclusion.
  const ua = navigator.userAgent || '';
  const isWebKitEngine = /AppleWebKit/i.test(ua)
    && !/(Chrome|Chromium|Edg|OPR|SamsungBrowser)/i.test(ua);
  if (prefersReduce || isWebKitEngine || !document.startViewTransition) {
    updateFn();
    return;
  }
  try {
    const transition = document.startViewTransition(() => {
      flushSync(() => { updateFn(); });
    });
    // Browsers reject these promises when a second navigation supersedes the
    // first transition. That is a normal skip, not an application error.
    transition?.ready?.catch(() => {});
    transition?.updateCallbackDone?.catch(() => {});
    transition?.finished?.catch(() => {});
  } catch {
    updateFn();
  }
}

// ThemePicker + UserMenu + MenuItem extracted to ./components/ on
// 2026-05-24 to slim App.jsx (1994 → ~1800 LOC). Imports at top.
// Mobile-clipping fix history: see STABILITY.md rule 11.


// Lazy — pulled in only when the user navigates to that view.
// Big wins on cold load (esp. iPad / mobile Safari) since NotesView,
// VideoView, GroupsView etc. ship their own chunks.
const SubjectSelectView = lazy(() => import('./views/SubjectSelectView.jsx'));
const ConfigView = lazy(() => import('./views/ConfigView.jsx'));
const ExamView = lazy(() => import('./views/ExamView.jsx'));
const ResultsView = lazy(() => import('./views/ResultsView.jsx'));
const ReviewView = lazy(() => import('./views/ReviewView.jsx'));
const SRSessionView = lazy(() => import('./views/SRSessionView.jsx'));
const DashboardView = lazy(() => import('./views/DashboardView.jsx'));
const QuestionManagerView = lazy(() => import('./views/QuestionManagerView.jsx'));
const AuthView = lazy(() => import('./views/AuthView.jsx'));
const GroupsView = lazy(() => import('./views/GroupsView.jsx'));
const GroupDetailView = lazy(() => import('./views/GroupDetailView.jsx'));
const LeaderboardView = lazy(() => import('./views/LeaderboardView.jsx'));
const ScheduleView = lazy(() => import('./views/ScheduleView.jsx'));
const ScoresView = lazy(() => import('./views/ScoresView.jsx'));
const VideoView = lazy(() => import('./views/VideoView.jsx'));
const AboutView = lazy(() => import('./views/AboutView.jsx'));
const FeedbackView = lazy(() => import('./views/FeedbackView.jsx'));
const IgCardStudioView = lazy(() => import('./views/IgCardStudioView.jsx'));
const YearSelectView = lazy(() => import('./views/YearSelectView.jsx'));
// Marketing landing — signed-out front door. Full-bleed (own nav/footer),
// so it early-returns before the app chrome. Own scoped CSS.
const LandingView = lazy(() => import('./views/LandingView.jsx'));
const PhaseSelectView = lazy(() => import('./views/PhaseSelectView.jsx'));
const TopicSelectView = lazy(() => import('./views/TopicSelectView.jsx'));
const NotesView = lazy(() => import('./views/NotesView.jsx'));
const LibraryView = lazy(() => import('./views/LibraryView.jsx'));
const KnowledgeView = lazy(() => import('./views/KnowledgeView.jsx'));
const ReadingChecklistView = lazy(() => import('./views/ReadingChecklistView.jsx'));
const FacultyView = lazy(() => import('./views/FacultyView.jsx'));
const AccountSettingsView = lazy(() => import('./views/AccountSettingsView.jsx'));
const OfflineGameView = lazy(() => import('./views/OfflineGameView.jsx'));
// PomodoroView — Forest-style focus timer with a hatching-chick companion.
// Lazy: only loaded when the user opens it from the command palette.
const PomodoroView = lazy(() => import('./views/PomodoroView.jsx'));
const RaceView = lazy(() => import('./views/RaceView.jsx'));
// PdfAnnotateView — lazy because pdfjs-dist is heavy (~1 MB) and only
// needed when the user opens "PDF + annotate" from the command palette.
// Worker chunk is dynamically imported inside the view itself.
const PdfAnnotateView = lazy(() => import('./views/PdfAnnotateView.jsx'));
const ImageOcclusionView = lazy(() => import('./views/ImageOcclusionView.jsx'));
// PhaseWrappedView — end-of-phase recap (Spotify-Wrapped style).
// Only shown after a phase ends or opened via command palette,
// so lazy-load is appropriate.
const PhaseWrappedView = lazy(() => import('./views/PhaseWrappedView.jsx'));
// (Removed MockExamView/MockResultsView — an unwired English "DEMO ONLY" stub.
//  "Mock Exam" nav now routes into the real config → exam engine. 2026-07-24)

import TopLoadingBar, { ViewFallback } from './components/TopLoadingBar.jsx';
import DialogHost from './components/DialogHost.jsx';
import { confirmDialog, alertDialog } from './lib/dialog.js';
import { clearNoteRetryTarget, readNoteRetryTarget } from './lib/note-retry.js';

// Vercel Analytics + Speed Insights — lazy-loaded so the home page
// payload doesn't grow on existing users. Skipped on local hosts: `vite
// preview` serves the PRODUCTION build, so the tags would inject and the
// SPA fallback answers /_vercel/*.js with HTML — two guaranteed console
// SyntaxErrors polluting every local verification sweep.
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((m) => ({ default: m.Analytics })),
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((m) => ({ default: m.SpeedInsights })),
);
const IS_LOCAL_HOST = typeof window !== 'undefined'
  && /^(localhost|127\.|192\.168\.|\[::1\])/.test(window.location.hostname);

// The app shell is deliberately wider than reading/exam content so the
// persistent header does not wrap on ordinary laptop screens. Workspace and
// grid-heavy views opt into the full width; focused reading/form views keep a
// comfortable line length.
const WIDE_VIEWS = new Set([
  'home', 'subject-select', 'topic-select', 'dashboard', 'videos', 'notes',
  'reading-checklist', 'faculty', 'pinboard', 'lab', 'pdf-annotate', 'library',
  'image-occlusion', 'knowledge', 'wiki',
]);

// Focus views intentionally remove navigation chrome. In particular, hiding
// the footer prevents keyboard/scroll users from leaving an active exam
// without going through ExamView's confirmation flow.
const FOCUS_VIEWS = new Set(['exam', 'results', 'review', 'auth', 'year-select', 'phase-select', 'config']);
// Marketing/ecosystem links belong on destination pages, not after every
// internal workflow. Keeping the footer off topic, notes, schedule and tool
// views shortens those tasks without removing any top-level navigation.
const FOOTER_VIEWS = new Set(['home', 'about']);
const AUTH_REQUIRED_VIEWS = new Set([
  'groups',
  'group-detail',
  'leaderboard-global',
  'account-settings',
  'race',
  'review-queue',
]);

function isInteractiveKeyTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return true;
  return Boolean(target.closest('[role="button"], [role="checkbox"], [role="radio"], [role="switch"]'));
}

const USER_CURATED_MODES = new Set(['bookmarks', 'weak', 'wrong']);

function normalizePracticeMode(mode, subject, explicitMode = false) {
  if (!explicitMode && subject && subject !== 'all' && USER_CURATED_MODES.has(mode)) {
    return 'all';
  }
  return mode;
}

/**
 * One pool definition for both ConfigView's truthful availability count and
 * startExam's actual selection. Keeping these paths together prevents the UI
 * from promising 10 questions when the engine can only produce 5.
 */
function buildExamPool({
  questions,
  practiceMode,
  subject,
  topic,
  questionCategory,
  selectedYear,
  bookmarks = [],
  weakQuestions = [],
  history = [],
}) {
  const curated = USER_CURATED_MODES.has(practiceMode);
  const deliverableQuestions = questions.filter(isQuestionDeliverable);
  let pool;

  if (practiceMode === 'bookmarks') {
    pool = deliverableQuestions.filter((q) => bookmarks.includes(q.id));
  } else if (practiceMode === 'weak') {
    // Year-scoped like every other practice path: the dashboard promises a
    // year-scoped count, and serving lifetime cross-year questions under
    // that number made the two disagree.
    pool = deliverableQuestions.filter((q) => weakQuestions.includes(q.id)
      && (q.year == null || !selectedYear || q.year === selectedYear));
  } else if (practiceMode === 'wrong') {
    const wrongSet = new Set();
    for (const item of history) {
      if (item?.correct === false) wrongSet.add(`${item.subject || ''}:${item.questionId}`);
    }
    pool = deliverableQuestions.filter((q) => wrongSet.has(`${q.subject}:${q.id}`));
  } else {
    pool = subject === 'all'
      ? deliverableQuestions.filter((q) => !selectedYear || yearForSubject(q.subject) === selectedYear)
      : deliverableQuestions.filter((q) => q.subject === subject);

    if (topic) {
      if (topic.startsWith('_') && topic.endsWith('-all')) {
        const collectionId = topic.slice(1, -4);
        const subjectMeta = SUBJECTS.find((item) => item.id === subject);
        const collection = subjectMeta?.collections?.find((item) => item.id === topic);
        const prefix = collection?.topicPrefix || collectionId;
        pool = pool.filter((q) => q.topic?.startsWith(prefix));
      } else {
        pool = pool.filter((q) => q.topic === topic);
      }
    } else if (subject !== 'all') {
      const hidden = hiddenTopicIdsFor(subject);
      if (hidden.size) pool = pool.filter((q) => !hidden.has(q.topic));
    } else {
      pool = pool.filter((q) => !hiddenTopicIdsFor(q.subject).has(q.topic));
    }
  }

  if (!curated && (!subject || subject === 'all')) {
    pool = pool.filter((q) => q.year == null || q.year === selectedYear);
  }

  if (questionCategory === 'mcq') pool = pool.filter((q) => catOf(q) === 'mcq');
  else if (questionCategory === 'writing') pool = pool.filter((q) => catOf(q) === 'writing');

  return pool;
}

export default function App() {
  const { user, profile, loading: authLoading } = useAuth();

  // Phase 3 perf: QB lazy-load tracker. `qbReady` flips true on first
  // successful loadQB() resolution; we use it to (a) trigger a single
  // re-render across the tree so closures over QB pick up the freshly-
  // populated array, and (b) gate exam-start UI to await the load if
  // the user clicks before background-load finishes.
  const [qbReady, setQbReady] = useState(isQBLoaded());
  const [qbRevision, setQbRevision] = useState(0);
  // The QB lazy-load effects that key off `selectedYear` are declared
  // AFTER `selectedYear` (line ~415) so they don't trip TDZ on the
  // const before it's initialized. See "QB year-scoped loaders" below.

  // Share-link (`?qset=`) resolution effect. A shared set can contain
  // questions from a different year than the receiver currently selected,
  // so it must await the full registry rather than the current year scope.
  // Initial render shows a ViewFallback until this materializes the set.
  // Lives at App level so it fires regardless of which view is active.
  const sharedResolvedRef = useRef(false);
  // Round 2B 2026-05-18: sender score/name parsed from URL (`?sc=...&by=...`)
  // — Palm spec wants async challenge to surface a "📨 ผู้ส่งได้ X/Y ·
  // ดูว่าคุณได้เท่าไหร่" banner so the receiver knows what to beat.
  const [challengeSender, setChallengeSender] = useState(() => readSenderInfoFromLocation());
  useEffect(() => {
    if (sharedResolvedRef.current) return;
    let cancelled = false;
    let hasSharedSet = false;
    try {
      const params = new URLSearchParams(window.location.search);
      hasSharedSet = Boolean(params.get('qset'));
    } catch {}
    if (!hasSharedSet) return;

    const resolveSharedSet = async () => {
      try {
        await loadQB();
        if (cancelled) return;
        setQbReady(true);
        setQbRevision((revision) => revision + 1);
      const shared = readShareUrlFromLocation();
        if (shared.length === 0) {
          sharedResolvedRef.current = true;
          setView('home');
          setChallengeSender(null);
          return;
        }
      const map = new Map();
      for (const q of QB) if (isQuestionDeliverable(q)) map.set(q.subject + ':' + q.id, q);
      const matched = shared
        .map((k) => map.get(k.subject + ':' + k.id))
        .filter(Boolean);
      sharedResolvedRef.current = true;
      if (matched.length > 0) {
        setQuestions(matched);
        setAnswers({});
        setCurrentIdx(0);
        setView('exam');
      } else {
        // URL referenced Q IDs that no longer exist — drop to home
        // gracefully instead of leaving the user staring at empty exam.
        setView('home');
        setChallengeSender(null);
      }
      } catch {
        if (cancelled) return;
        sharedResolvedRef.current = true;
        setView('home');
        setChallengeSender(null);
      }
    };
    resolveSharedSet();
    return () => { cancelled = true; };
    // setView/session setters are initialized later in the component but are
    // read only after this effect runs, once the full render has completed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime presence — mounted at App level so the WebSocket survives
  // every view navigation. (Was in HomeView previously, which caused
  // users to drop out of the count whenever they clicked into a topic /
  // exam, and to lose the indicator since it only rendered on home.)
  const { count: onlineCount, status: onlineStatus } = useOnlineCount();

  // navigator.onLine — separate from realtime presence count above.
  // online: false ⇒ banner suggests the offline game ✦ justChanged
  // ⇒ flash a transient "back online" toast for ~3.5s.
  const { online: networkOnline, justChanged: networkJustChanged } = useOnlineStatus();

  // Detect password-reset deep link on first render so the very first
  // view is AuthView (which then enters mode='update-password' from the
  // same query param). Without this, clicking the email link drops the
  // user on the home page and the recovery form is never shown.
  //
  // Year-select front-door (since 2026-05-08 6-year scaffold): if the
  // user has never picked a year (no `vmx-selected-year` in localStorage),
  // show YearSelectView first instead of dropping them on Y4 by default.
  // Returning users with a remembered pick land directly on HomeView for
  // their year. The pick is read SYNCHRONOUSLY here (not via the hook)
  // because useLocalStorage's useEffect hydrates the key on first mount,
  // which would erase the "absent" signal.
  // A failed Notes chunk must reload before native ESM will retry it. Consume
  // the one-shot destination saved by NotesView so that reload resumes the
  // exact subject instead of silently dropping the student on Home.
  const notesRetryTarget = typeof window !== 'undefined' ? readNoteRetryTarget() : null;
  const initialView = (() => {
    if (typeof window === 'undefined') return 'home';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'reset') return 'auth';
      // An email link that has expired or been opened twice comes back as
      // error=/error_description= in the hash (or query). AuthView already
      // parses exactly that and says so in Thai — but it only got the chance
      // when it happened to be mounted, and nothing routed here on an error,
      // so the usual outcome was an ordinary signed-out page that explained
      // nothing. The student cannot tell a dead link from a broken app.
      if (/[#?&]error(_code)?=/.test(window.location.hash + window.location.search)) return 'auth';
      if (notesRetryTarget) return 'notes';
      // VetWiki owns a real path namespace so its articles are shareable and
      // citable (/wiki, /wiki/<subject>/<topic>[#section]). vercel.json
      // rewrites /wiki/* to the SPA; see src/lib/vetwiki/url.js.
      if (parseWikiPath(window.location.pathname).isWiki) return 'knowledge';
      // Deliberate/shareable entry to the marketing landing, e.g. from a
      // footer link or an external share. Bypasses the first-time-only
      // gate so it works for returning visitors too.
      if (params.get('view') === 'landing') return 'landing';
      // Shareable quiz link — only jump to exam if the URL parameter
      // resolves to at least one valid Q in QB. Otherwise the user
      // would land on an instant 0/0 results screen (timer effect
      // auto-fires finishExam on length-0 questions). Falling back to
      // 'home' shows them the normal UI; the ?qset= param is harmless
      // dangling text in the URL bar.
      if (params.get('qset')) {
        const shared = readShareUrlFromLocation();
        // Phase 3: QB is lazy, so we can't synchronously validate that
        // any of the shared Q IDs still exist at this point. Trust the
        // URL has at least one ID — the in-flight effect below will
        // await loadQB() then either materialize the questions OR
        // bail to home if none resolve.
        if (shared.length > 0) return 'exam';
      }
      // VetMock Practical Imaging Lab owns the lightweight, shareable #lab
      // route. It is deliberately independent from the full Pro workstation.
      if (window.location.hash === '#lab') return 'lab';
      // Stable, self-contained app views use readable /app/* paths. Stateful
      // exam/config/topic flows remain history-only because a URL cannot
      // safely reconstruct their in-memory question set.
      const routedView = viewForAppPath(window.location.pathname);
      if (routedView) return routedView;
      if (isAppPath(window.location.pathname)) return 'home';
    } catch {}
    try {
      // Parse the stored value — `null` is a valid serialized state
      // meaning "user hasn't picked yet". `getItem` only returns raw
      // null when the key is absent, so distinguish via JSON.parse.
      const raw = window.localStorage.getItem('vmx-selected-year');
      const parsed = raw === null ? null : JSON.parse(raw);
      if (parsed === null) {
        // Brand-new visitor who hasn't picked a year yet → show the
        // marketing landing (signed-out front door) the first time only.
        // Once they enter the app we set 'vmx-seen-landing' so returning
        // visitors go straight to year-select (no landing regression).
        const seenLanding = window.localStorage.getItem('vmx-seen-landing');
        if (!seenLanding) return 'landing';
        return 'year-select';
      }
    } catch {}
    return 'home';
  })();

  // Remove only after the initial render has consumed it. React StrictMode
  // deliberately renders twice in development; removing during render would
  // make the second pass lose the destination and fall back to Home.
  useEffect(() => {
    if (notesRetryTarget) clearNoteRetryTarget();
    // Initial navigation seed only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setViewRaw] = useState(initialView);
  const viewRef = useRef(initialView);
  const [mode, setMode] = useState('quick');
  // Seed from /wiki/<subject>/<topic> so a shared article link opens directly
  // on that article instead of the wiki index.
  const _wikiEntry = typeof window !== 'undefined' ? parseWikiPath(window.location.pathname) : { subject: null, topic: null };
  const [subject, setSubject] = useState(_wikiEntry.subject || notesRetryTarget?.subject || 'all');
  const [topic, setTopic] = useState(_wikiEntry.topic || notesRetryTarget?.topic || null);
  // Videos may be opened either globally (show every subject) or from a
  // subject page (start scoped to that subject). Keep this navigation
  // context separate from the last exam subject so global Videos never
  // inherits a stale filter.
  const [videoSubject, setVideoSubject] = useState(null);
  const [practiceMode, setPracticeModeRaw] = useState('all');
  // Choosing a curated pool (bookmarks / weak / wrong) is a whole-library
  // intent, and those pools ignore the subject filter entirely. But a subject
  // left over from an earlier session made normalizePracticeMode strip the
  // mode straight back to 'all' — so pressing "ข้อที่บันทึกไว้" in the header,
  // "ทำข้อที่อ่อน" on the dashboard, or a pinned question on the pinboard
  // quietly served an ordinary practice set instead. Clearing the subject here
  // keeps the more recent, more specific signal (the button the student just
  // pressed) without weakening the guard that rule exists for.
  const setPracticeMode = useCallback((mode) => {
    setPracticeModeRaw(mode);
    if (USER_CURATED_MODES.has(mode)) setSubject('all');
  }, []);
  const [activeGroup, setActiveGroup] = useState(null);
  // selectedYear persists in localStorage. Fallback `null` means "user
  // hasn't picked yet" — the year-select front door above keys off this.
  // useLocalStorage will write `null` back on first mount (which serializes
  // as the string 'null'); the IIFE above parses that correctly so user
  // keeps seeing year-select until they actively pick a year.
  const [selectedYearStored, setSelectedYear] = useLocalStorage('vmx-selected-year', null);
  // Components expect a number — fall back to CURRENT_YEAR when null so
  // HomeView/etc. don't crash if the user somehow lands there pre-pick.
  const selectedYear = selectedYearStored ?? CURRENT_YEAR;

  // ── QB year-scoped loaders ─────────────────────────────────────
  // CRITICAL: these effects MUST live AFTER `selectedYear` is
  // declared (above) — they were originally up near `qbReady` and
  // caused a production TDZ ("Cannot access 'P' before initialization"
  // at <App>) because the dep array `[selectedYear, ...]` got
  // evaluated synchronously at render BEFORE the const above existed.
  // Build hash `index-CXPDEjJ3.js` reproduced this — left the entire
  // site blank. Don't move them back up.
  useEffect(() => {
    if (qbReady) return;
    // The first-run year picker uses precomputed counts. Do not download the
    // fallback Y4 bank before the visitor has actually chosen a year.
    if (selectedYearStored == null) return;
    // Background load — non-blocking, fires once per page life. Errors
    // are swallowed at this layer; explicit awaits in startExam() will
    // surface real failures via alert().
    //
    // Year-scoped (Palm audit 2026-05-20): pull only the current year's
    // chunks instead of all 34. Y4-only users skip the ~7 Y5 banks
    // (~250 KB savings on slow networks). Cross-year banks (vca/short/
    // mahahon/termpaper) still load. If the user later switches year,
    // loadQBForYear() is re-called by the year-watcher effect below.
    loadQBForYear(selectedYear).then(() => {
      setQbReady(true);
      setQbRevision((revision) => revision + 1);
    }).catch(() => {});
  }, [qbReady, selectedYear, selectedYearStored]);

  // When user switches year (e.g. Y4 → Y5), pull the new year's chunks
  // in the background. `loadQBForYear` is idempotent — already-loaded
  // scopes are no-ops. New chunks merge into the same `_qbArr` so
  // existing closures over QB get the union next render.
  useEffect(() => {
    if (!qbReady) return;
    if (selectedYearStored == null) return;
    if (isQBYearLoaded(selectedYear)) return;
    loadQBForYear(selectedYear)
      .then(() => setQbRevision((revision) => revision + 1))
      .catch(() => {});
  }, [selectedYear, selectedYearStored, qbReady]);

  // selectedPhase: '1-mid' | '1-final' | '2-mid' | '2-final' | null.
  // null means "no phase scoping" — show all subjects across both
  // semesters of the year (used as fallback for Y6 which is block-based).
  const [selectedPhase, setSelectedPhase] = useLocalStorage('vmx-selected-phase', null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openInstructor, setOpenInstructor] = useState(null);
  // Voice-settings modal — triggered from CommandPalette "Voice Settings"
  // or anywhere else that wants to expose the TTS pace/pause/speed sliders.
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  // Sketchpad open state — opens the ImageAnnotator in 'sketch' mode
  // (blank canvas) when the user taps the 🎨 FAB.
  const [sketchOpen, setSketchOpen] = useState(false);
  // Linear-style keyboard shortcut sheet — opened by pressing '?' while
  // in exam or review. Closed by Esc / overlay click. State lives here
  // so the global keydown handler can trigger it from any view-scope.
  const [shortcutSheetOpen, setShortcutSheetOpen] = useState(false);
  // Service worker update available — true after a new SW finishes
  // installing while an old one is still controlling the page. We show
  // a small toast (NOT during exam) with a "Refresh" button.
  // A waiting worker keeps waiting until the user acts, and main.jsx announces
  // it on every page load — so an update someone chose to ignore came back on
  // every single load with no way to make it stop. The dismissal is keyed to
  // the build being offered, so saying "later" silences THAT update and a
  // genuinely newer one still gets through.
  const [swUpdateReady, setSwUpdateReady] = useState(false);
  const [swUpdateVersion, setSwUpdateVersion] = useState(null);
  useEffect(() => {
    const handler = (e) => {
      const version = e?.detail?.version || null;
      let dismissed = null;
      try { dismissed = window.localStorage.getItem('vmx-update-dismissed'); } catch {}
      if (version && dismissed === version) return;
      setSwUpdateVersion(version);
      setSwUpdateReady(true);
    };
    window.addEventListener('vmx-sw-update', handler);
    return () => window.removeEventListener('vmx-sw-update', handler);
  }, []);

  const dismissSwUpdate = () => {
    try {
      if (swUpdateVersion) window.localStorage.setItem('vmx-update-dismissed', swUpdateVersion);
    } catch {}
    setSwUpdateReady(false);
  };

  // SR-card graded — listen defensively at App level so XP/quest credit
  // applies no matter which surface dispatches it (SRSessionView today,
  // maybe DashboardView "quick grade" later). Idempotency: each emit is
  // one grade, so the dispatcher controls dedup. We just translate the
  // event into the existing XP + quest event vocabulary.
  //
  // Event detail shape: { quality: 0..3 } (matches sm2.js grade scale).
  useEffect(() => {
    const handler = (e) => {
      try {
        const quality = Number(e?.detail?.quality);
        const safeQ = Number.isFinite(quality) ? Math.max(0, Math.min(3, quality)) : 0;
        if (safeQ < 1) return; // "Again" (0) — no XP, no quest credit
        awardXp(XP_AWARDS.srGrade, 'sr');
        recordQuestEvent('sr-graded', { quality: safeQ });
      } catch {}
    };
    window.addEventListener('vmx-sr-card-graded', handler);
    return () => window.removeEventListener('vmx-sr-card-graded', handler);
  }, []);

  // Study buddies hook is called LATER in the component body, after
  // `questions` + `currentIdx` state are declared, so the qKey can read
  // them without a temporal-dead-zone error. See the actual call site
  // tagged with "// — Study buddies". Hooks may be called in any order
  // as long as it's consistent across renders.

  // Wrap navigation in View Transitions and mirror it into browser history.
  // Leaving an active exam replaces its history entry, so Back cannot revive
  // a stale/completed session; browser Back while still in an exam asks first.
  const setView = useCallback((next, navigationState = null) => {
    if (!next || next === viewRef.current) return;
    const previous = viewRef.current;
    const enteringLab = next === 'lab';
    const nextVideoSubject = next === 'videos'
      ? navigationState?.subject || null
      : null;
    setVideoSubject(nextVideoSubject);
    if (typeof window !== 'undefined') {
      try {
        const state = {
          ...(window.history.state || {}),
          vmxView: next,
          vmxVideoSubject: nextVideoSubject,
        };
        // Wiki, Practical, and stable app destinations own canonical URLs.
        // Stateful flows return to root so refresh never reconstructs a
        // partial exam/config session from an unrelated previous route.
        const leavingWiki = next !== 'knowledge'
          && parseWikiPath(window.location.pathname).isWiki;
        const leavingLab = next !== 'lab' && window.location.hash === '#lab';
        const leavingAppPath = !appPathForView(next) && isAppPath(window.location.pathname);
        const appPath = appPathForView(next);
        // Some lazy views own a real, shareable URL. Push that URL in the
        // same event as the view state so slow chunk downloads never leave
        // the address bar pointing at the previous screen.
        const url = enteringLab
          ? '/#lab'
          : navigationState?.path
            || (next === 'knowledge' ? '/wiki' : '')
            || appPath
            || ((leavingWiki || leavingLab || leavingAppPath) ? '/' : '');
        // Assigning #lab manually already created a history entry. Stamp the
        // view state onto it rather than creating a duplicate Back step.
        const labHashAlreadyCreated = enteringLab && window.location.hash === '#lab';
        // LabView's own Back control removes the hash first. Replace that
        // just-cleaned entry so one Back click does not create two Home rows.
        const labHashAlreadyRemoved = previous === 'lab'
          && !enteringLab
          && window.location.hash !== '#lab';
        if (previous === 'exam' || labHashAlreadyCreated || labHashAlreadyRemoved) {
          window.history.replaceState(state, '', url || undefined);
        } else {
          window.history.pushState(state, '', url || undefined);
        }
      } catch {}
    }
    viewRef.current = next;
    withTransition(() => setViewRaw(next));
  }, []);

  useEffect(() => { viewRef.current = view; }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.history.replaceState(
        { ...(window.history.state || {}), vmxView: viewRef.current },
        '',
      );
    } catch {}
    const onPopState = (event) => {
      const next = event.state?.vmxView
        || viewForAppPath(window.location.pathname)
        || (parseWikiPath(window.location.pathname).isWiki ? 'knowledge' : null)
        || (window.location.hash === '#lab' ? 'lab' : 'home');
      const nextVideoSubject = next === 'videos'
        ? event.state?.vmxVideoSubject || null
        : null;
      if (viewRef.current === 'exam' && next !== 'exam') {
        // The app's own dialog is async, and popstate can't be un-fired, so
        // put the exam entry back straight away and only navigate once they
        // say yes. Staying put then needs no further history work.
        try {
          window.history.pushState(
            { ...(window.history.state || {}), vmxView: 'exam' },
            '',
          );
        } catch {}
        confirmDialog({
          title: 'ออกจากชุดนี้?',
          body: 'ความคืบหน้าจะถูกเก็บไว้ให้กลับมาทำต่อได้',
          confirmLabel: 'ออกจากชุด',
        }).then((leave) => {
          if (!leave) return;
          setVideoSubject(nextVideoSubject);
          viewRef.current = next;
          withTransition(() => setViewRaw(next));
        });
        return;
      }
      setVideoSubject(nextVideoSubject);
      viewRef.current = next;
      withTransition(() => setViewRaw(next));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Deep components (e.g. the per-question source panel) open the library
  // without prop-drilling setView through the exam tree — same event-bus
  // pattern the VetCalculator FAB uses.
  useEffect(() => {
    const onOpenLibrary = () => setView('library');
    window.addEventListener('vmx-open-library', onOpenLibrary);
    return () => window.removeEventListener('vmx-open-library', onOpenLibrary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unknown /app/* paths must not revive an unrelated stored screen. Repair
  // the address bar to Home once, while known app routes keep their URL.
  useEffect(() => {
    try {
      if (isAppPath(window.location.pathname) && !viewForAppPath(window.location.pathname)) {
        window.history.replaceState({ vmxView: 'home' }, '', '/');
      }
    } catch {}
  }, []);

  // Keep the Practical Lab's shareable hash and React view in lockstep.
  // Covers pasted hashes in an already-open tab and users who manually
  // remove #lab from the address bar.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHash = () => {
      if (window.location.hash === '#lab') {
        setView('lab');
        return;
      }
      if (viewRef.current !== 'lab') return;
      const next = 'home';
      try {
        window.history.replaceState(
          { ...(window.history.state || {}), vmxView: next, vmxVideoSubject: null },
          '',
          window.location.pathname + window.location.search,
        );
      } catch {}
      setVideoSubject(null);
      viewRef.current = next;
      withTransition(() => setViewRaw(next));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [setView]);

  // Scroll to top when view changes — without this, navigating to a
  // long page (e.g. NotesView) keeps you scrolled at the previous
  // view's offset, which feels broken. 'instant' avoids fighting the
  // View Transitions fade animation.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Use rAF so the scroll happens after the new view's first paint —
    // the browser positions the new content first, then jumps to top.
    const id = requestAnimationFrame(() => {
      try { window.scrollTo({ top: 0, behavior: 'instant' }); }
      catch { window.scrollTo(0, 0); }
      try { document.getElementById('main')?.focus({ preventScroll: true }); }
      catch { document.getElementById('main')?.focus(); }
    });
    return () => cancelAnimationFrame(id);
  }, [view]);

  // Idle-time prefetch — once the page is settled, quietly download
  // the chunks for views the user is most likely to visit next. By
  // the time they click, the chunk is already in the browser cache
  // and Suspense doesn't even need to show a fallback.
  //
  // We don't prefetch heavy/rare views (ExamView, NotesView with
  // notes-com3 ~270KB) — those still load on demand to keep the
  // initial idle bandwidth small. Sticking to small-medium views
  // that are 1 click away from home.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cic = window.cancelIdleCallback || clearTimeout;
    const id = ric(() => {
      // HomeView itself first — landing page for nearly every session,
      // so prefetch it the moment we're idle. (Even if `initialView` is
      // 'year-select', we'll be on home within ~3 seconds anyway.)
      import('./views/HomeView.jsx').catch(() => {});
      // Most-common next steps from home
      import('./views/SubjectSelectView.jsx').catch(() => {});
      import('./views/ConfigView.jsx').catch(() => {});
      import('./views/ScheduleView.jsx').catch(() => {});
      import('./views/FacultyView.jsx').catch(() => {});
      import('./views/AuthView.jsx').catch(() => {});
    }, { timeout: 5000 });
    return () => cic(id);
  }, []);

  // Keep the screen on while an exam is in progress (Web Wake Lock
  // API). Auto-releases when leaving exam view or component unmount.
  useWakeLock(view === 'exam');

  // Pre-warm the post-exam chunks (ResultsView + ReviewView) the
  // moment the exam starts. Reason: those views are lazy-loaded, so
  // their chunks (e.g. ResultsView-XXXXXXXX.js) are fetched only
  // when setView('results') runs. If we ship a deploy mid-exam,
  // Vercel atomically swaps to a new bundle and the OLD chunk hash
  // becomes a 404. The submit button would then strand the user on
  // a blank screen — exactly the regression Palm hit on 2026-05-08.
  // Importing here puts the chunk in the browser's module cache; if
  // a deploy happens later, the in-memory module survives even if
  // the URL stops resolving. Errors are swallowed because a network
  // hiccup at exam start shouldn't fail the exam itself — the
  // dynamic import inside Suspense will still try again at submit.
  useEffect(() => {
    if (view === 'exam') {
      import('./views/ResultsView.jsx').catch(() => {});
      import('./views/ReviewView.jsx').catch(() => {});
    }
  }, [view]);

  // Exam config (read by startExam to assemble the pool + timer budget).
  // Moved ABOVE useExamSession hook 2026-05-27 because the hook reads
  // useTimer + timePerQ at construction time.
  const [numQuestions, setNumQuestions] = useState(10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQ, setTimePerQ] = useState(60);
  // 'all' (default) | 'mcq' (auto-graded only) | 'writing' (essay+short only)
  const [questionCategory, setQuestionCategory] = useState('all');
  // Practice-mode instant feedback: reveal ✓/✗ + q.explain right after
  // answering instead of waiting for submit. Exam mode ignores this.
  const [instantFeedback, setInstantFeedback] = useState(true);

  // In-flight exam runtime — extracted to src/hooks/useExamSession.js
  // 2026-05-27. The hook owns: questions · currentIdx · answers ·
  // timeLeft · examStartTime + the 5 navigation callbacks
  // (answerCurrent · nextQ · prevQ · jumpToQ · replayQuestions) + the
  // 2 timer effects (shadow-start + tick). localStorage hydration of
  // in-flight exam ('vmx-inflight-exam') also lives in the hook.
  //
  // startExam / finishExam stay in App.jsx because they touch many
  // OTHER concerns (streak, XP, quests, Supabase save, year resolution).
  // They call session.startNewSession() / session.resetSession() etc.
  // instead of mutating raw setters.
  //
  // Circular dep: session's timer-tick must call finishExam on time-up.
  // Solved by stashing finishExam in a ref (declared below the hook
  // call, populated after finishExam is declared further down). The
  // hook only sees `() => finishExamRef.current?.()` as `onFinish`.
  const finishExamRef = useRef(null);
  // Re-entry latch: the timer-tick onFinish and a user submit on the last
  // question can race — this stops finishExam running twice (which would
  // double-append history + double-write the leaderboard). Reset when a new
  // exam starts or the user goes home.
  const finishingRef = useRef(false);
  const session = useExamSession({
    view, useTimer, timePerQ,
    onFinish: useCallback(() => finishExamRef.current?.(), []),
  });
  const {
    questions, setQuestions,
    answers, setAnswers,
    currentIdx, setCurrentIdx,
    timeLeft, setTimeLeft,
    examStartTime, setExamStartTime,
    currentQ, currentAnswer,
    answerCurrent, nextQ, prevQ, jumpToQ,
  } = session;

  // Stateful result/review history entries cannot be reconstructed after
  // goHome intentionally clears the session. Browser Back used to revive an
  // empty 0/0 Results screen. Repair that stale entry in place instead.
  useEffect(() => {
    if ((view !== 'results' && view !== 'review') || questions.length > 0) return;
    try {
      window.history.replaceState(
        { ...(window.history.state || {}), vmxView: 'home' },
        '',
        '/',
      );
    } catch {}
    viewRef.current = 'home';
    withTransition(() => setViewRaw('home'));
  }, [view, questions.length]);

  // — Study buddies — Supabase Realtime presence for "who's online +
  // what subject + which Q they're on". Placed here (not at top of
  // component) because qKey depends on `questions` + `currentIdx`
  // which were declared just above. HomeView groups by subject;
  // ExamView surfaces "X buddies on this Q" via countBuddiesOnQ.
  const _qOnExam = (view === 'exam' || view === 'sr-session') ? questions[currentIdx] : null;
  const buddies = useStudyBuddies({
    user,
    profile,
    subject: subject === 'all' ? null : subject,
    view,
    qKey: _qOnExam ? `${_qOnExam.subject}:${_qOnExam.id}` : null,
  });
  // Resume banner state — populated on boot if a stale in-flight exam
  // was detected. Lives in App so HomeView (and any future entry points)
  // can read + handle resume/dismiss without re-querying localStorage.
  const [pendingResume, setPendingResume] = useState(null);
  // Feedback prefill — populated when a contextual entry (e.g. scaffold
  // subject card) routes to feedback. FeedbackView reads it on mount,
  // then clears so a manual revisit isn't pre-stuffed with old context.
  const [feedbackPrefill, setFeedbackPrefill] = useState(null);

  const [theme, setTheme] = useLocalStorage('vmx-theme', 'light');
  // Landing page: language (landing-local; the app itself is Thai-first
  // with no i18n framework) + cookie consent. Consent gates the optional
  // analytics mount below — 'ask' | 'all' | 'essential' | 'custom'.
  // Thai by default — the audience is Thai veterinary students and the whole
  // app behind the landing is Thai. (An EN/ไทย toggle stays in the header for
  // exchange students and for sharing the page abroad.)
  const [landingLang, setLandingLang] = useLocalStorage('vmx-landing-lang', 'th');
  const [consent, setConsent] = useLocalStorage('vmx-consent', 'ask');
  const [consentPrefs, setConsentPrefs] = useLocalStorage('vmx-consent-prefs', { analytics: true, personal: true });
  const analyticsAllowed = consent === 'all' || (consent === 'custom' && !!consentPrefs.analytics);
  // Color palette — overlays on top of theme to recolor accent vars
  // (sage / gold). 'default' uses the original sage+gold; alternatives:
  // ocean / plum / cherry / mono / forest. Stored in localStorage so
  // preference is per-device.
  const [palette, setPalette] = useLocalStorage('vmx-palette', 'default');
  const {
    data: {
      bookmarks,
      history,
      notes,
      srCards,
      customQuestions,
      streakData,
      readingChecklist,
    },
    set: {
      bookmarks: setBookmarks,
      history: setHistory,
      notes: setNotes,
      srCards: setSrCards,
      customQuestions: setCustomQuestions,
      streakData: setStreakData,
      readingChecklist: setReadingChecklist,
    },
    sync: userDataSync,
  } = useUserDataSync(user?.id ?? null);

  // Legacy reading progress used bare topic ids, which collide across
  // subjects (for example `nutrition`). Safely promote only globally unique
  // ids; ambiguous keys remain readable until the learner makes an explicit
  // subject-scoped choice.
  useEffect(() => {
    const migrated = migrateUniqueTopicProgress(readingChecklist, SUBJECTS);
    if (migrated !== readingChecklist) setReadingChecklist(migrated);
  }, [readingChecklist, setReadingChecklist]);

  // Google Fonts moved to index.html with media=print + onload swap so
  // they download in parallel with the HTML and don't block first paint.
  // Previously injected from a useEffect here, which fired AFTER first
  // paint and caused a brief unstyled flash on cold load.

  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute('data-theme', theme);
    // Keep the html-level base bg + color-scheme in sync with the toggle
    // (the anti-FOUC inline script in index.html sets them for first paint;
    // this keeps the overscroll/landing area correct after a theme switch).
    d.style.colorScheme = theme;
    d.style.background = theme === 'dark' ? '#1a1612' : '#f6efe4';
  }, [theme]);
  useEffect(() => {
    if (palette && palette !== 'default') {
      document.documentElement.setAttribute('data-palette', palette);
    } else {
      document.documentElement.removeAttribute('data-palette');
    }
  }, [palette]);

  // ── Year/phase backfill for legacy history entries ─────────────
  // Data-layer audit 2026-05-18: history entries written before this
  // commit lack `year` + `phase` fields. Without them, NextActionCard
  // weak-subject + DashboardView year filter fall back to subject→
  // curriculum lookup on every read (slow + fragile).
  // One-time enrich on mount: scan history, derive year from subject
  // via yearForSubject(), write back. Idempotent — entries that
  // already have year are no-ops.
  useEffect(() => {
    if (!Array.isArray(history) || history.length === 0) return;
    const needsBackfill = history.some((h) => h && typeof h.year === 'undefined');
    if (!needsBackfill) return;
    const enriched = history.map((h) => {
      if (!h || typeof h.year !== 'undefined') return h;
      const y = yearForSubject(h.subject);
      // selectedYear is the user's current context — for entries with
      // unknown subject (e.g. legacy "all" mode), fall back to the
      // user's chosen year (better than null for filter purposes).
      return { ...h, year: y ?? selectedYear ?? null, phase: h.phase ?? null };
    });
    setHistory(enriched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run-once on mount

  // QB is mutated in place when loadQB() resolves, so the same reference
  // grows from [] → 2,227 entries. Depend on `qbReady` so the memo
  // re-runs after the populate completes — without this, every consumer
  // closing over allQuestions would see the stale empty snapshot.
  const allQuestions = useMemo(() => [...QB, ...customQuestions], [customQuestions, qbReady, qbRevision]);

  // Auto-save in-flight exam state to localStorage. Runs on every
  // answer/navigation so accidental tab-close during a 25-minute
  // essay doesn't lose work. Skipped when there's no active exam.
  // Debounced 500ms so a fast-typing essay (with answers state
  // updating per keystroke) doesn't cause a localStorage write
  // every 30ms — that throttles down to ≤2/sec, which is plenty
  // safe for crash recovery and far easier on slow phones.
  useEffect(() => {
    if (view !== 'exam' || questions.length === 0) return;
    const timer = setTimeout(() => {
      try {
        window.localStorage?.setItem('vmx-inflight-exam', JSON.stringify({
          questions, answers, currentIdx,
          savedAt: Date.now(),
        }));
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [view, questions, answers, currentIdx]);

  // Detect a previous in-flight exam at boot and surface as a non-modal
  // banner on HomeView (replaces the old window.confirm prompt — that
  // was jarring + couldn't be dismissed without committing). Stale state
  // (>6h old) is auto-cleared so the banner doesn't lure users into
  // resuming an exam they conceptually moved on from.
  useEffect(() => {
    // Bug (found by live-testing 2026-07-24): this used to bail on
    // `questions.length > 0`, but useExamSession hydrates `questions` from
    // this very same localStorage key at init — so whenever there WAS
    // something to resume, the guard fired and the resume card never
    // appeared for anyone. Gate on the view instead: skip only when we
    // booted straight into an exam (e.g. a ?qset= share link).
    if (view === 'exam') return;
    let raw;
    try { raw = window.localStorage?.getItem('vmx-inflight-exam'); } catch {}
    if (!raw) return;
    let saved;
    try { saved = JSON.parse(raw); } catch { return; }
    if (!saved?.questions?.length) return;
    // A submitted set is kept only so a failed ResultsView chunk load stays
    // recoverable (see finishExam). It is finished work, so never offer it back
    // as something to resume.
    if (saved.submitted) return;
    const ageMs = Date.now() - (saved.savedAt || 0);
    if (ageMs > 6 * 60 * 60 * 1000) {
      try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
      return;
    }
    setPendingResume({
      qCount: saved.questions.length,
      answered: Object.keys(saved.answers || {}).length,
      ageMin: Math.round(ageMs / 60000),
      // Look up the first question to derive the subject for display
      subjectId: saved.questions[0]?.subject || null,
    });
    // Re-runs when the view changes, not only at boot. Both exit paths promise
    // the set is "เก็บไว้ที่หน้าแรก", but the card is driven by pendingResume —
    // computed once on mount — so a student who left an exam without reloading
    // reached a Home screen with no resume card at all, and the promise was
    // only kept on their NEXT visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Handler triggered by the resume banner on HomeView.
  const resumePendingExam = useCallback(() => {
    let raw;
    try { raw = window.localStorage?.getItem('vmx-inflight-exam'); } catch {}
    if (!raw) { setPendingResume(null); return; }
    let saved;
    try { saved = JSON.parse(raw); } catch { setPendingResume(null); return; }
    if (!session.primeFromSaved(saved)) { setPendingResume(null); return; }
    setPendingResume(null);
    finishingRef.current = false; // arm the finish latch for the resumed session
    setView('exam');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session is stable across renders
  }, []);

  const dismissPendingExam = useCallback(() => {
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
    session.resetSession();
    setPendingResume(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session is stable across renders
  }, []);

  // Shadow-start + timer-tick effects moved into useExamSession 2026-05-27.
  // Previously these lived inline here (~30 LOC of clock priming + tick
  // countdown + finishExam-on-time-up). They now live in the hook; the
  // hook calls our finishExam via the `onFinish` callback (which reads
  // finishExamRef.current to break the circular dep — see finishExamRef
  // declaration above the session hook).

  // Global ⌘K / Ctrl+K — open Command Palette anywhere in the app.
  // Mounted as its own effect so it stays active across all views
  // (including 'exam') without conflicting with exam-only shortcuts.
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        // Keep an active exam in a distraction-free, guarded surface.
        if (view === 'exam') return;
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [view]);

  useEffect(() => {
    const handleKey = (e) => {
      if (view !== 'exam') return;
      if (isInteractiveKeyTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Don't fire exam shortcuts while command palette is open
      if (paletteOpen) return;
      // ...or while a modal (nav grid / submit-confirm) is open — let its
      // focused control receive Enter/Space natively instead of us eating it.
      if (typeof document !== 'undefined' && document.querySelector('.vmx-modal-overlay')) return;
      const q = questions[currentIdx];
      if (!q) return;
      if (q.type === 'mcq' && ['1', '2', '3', '4'].includes(e.key)) answerCurrent(parseInt(e.key) - 1);
      else if (q.type === 'tf') {
        if (e.key === 't' || e.key === 'T') answerCurrent(true);
        if (e.key === 'f' || e.key === 'F') answerCurrent(false);
      }
      // Decouple keypress from terminal submit: on the LAST question,
      // Space/Enter surface the styled submit-confirm instead of instantly
      // finishing the exam (a stray keypress must not end a session).
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentIdx < questions.length - 1) nextQ();
        else window.dispatchEvent(new CustomEvent('vmx-exam-submit-request'));
      }
      if (e.key === 'ArrowLeft') prevQ();
      if (e.key === 'ArrowRight') { if (currentIdx < questions.length - 1) nextQ(); }
      if (e.key === 'b' || e.key === 'B') toggleBookmark(q.id);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // NOTE: do NOT add answerCurrent/nextQ/prevQ/toggleBookmark to the
    // dep array — those `const`s are declared LATER in this component,
    // so referencing them here triggers a Temporal Dead Zone
    // ReferenceError at render → blank white screen for the whole app.
    // The handler reads them through closure at fire time, which is OK
    // because React already re-runs this effect on currentIdx/questions
    // changes (and those callbacks read from current state via setState
    // updaters / memo-stable identities).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentIdx, questions, paletteOpen]);

  // Linear-style power-user shortcuts — J/K/B/P/F/?. Gated to exam +
  // review views so they don't interfere with HomeView/Notes typing.
  // Skipped on INPUT/TEXTAREA/CONTENTEDITABLE targets so users typing
  // a note or answer don't trigger navigation. Also yields to the
  // command palette + shortcut sheet (so '?' inside the sheet closes
  // it through Esc, not double-toggles).
  //
  // Exam-only collisions handled:
  //   - B already toggles bookmark in the exam-only handler above, so
  //     here we only fire B in 'review' to avoid double-toggle.
  //   - F doubles as the True/False "False" key in exam (q.type==='tf'),
  //     so we only treat F as flag in 'review'.
  // P, J, K, ? have no collisions and fire in both views.
  useEffect(() => {
    const handleKey = (e) => {
      if (view !== 'exam' && view !== 'review') return;
      if (paletteOpen || shortcutSheetOpen) {
        // Allow '?' to act as a toggle even when sheet is open — closes it
        if (shortcutSheetOpen && e.key === '?') {
          e.preventDefault();
          setShortcutSheetOpen(false);
        }
        return;
      }
      const t = e.target;
      if (!t) return;
      // Skip when user is typing — INPUT, TEXTAREA, or contenteditable.
      // Reuse the same guard pattern as the existing exam handler.
      if (isInteractiveKeyTarget(t)) return;
      // Modifier keys → let the OS / palette handle them
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key;
      const q = questions[currentIdx];

      if (k === '?' || (e.shiftKey && k === '/')) {
        e.preventDefault();
        setShortcutSheetOpen((v) => !v);
        return;
      }
      if (k === 'j' || k === 'J') {
        e.preventDefault();
        if (view === 'exam') { if (currentIdx < questions.length - 1) nextQ(); else window.dispatchEvent(new CustomEvent('vmx-exam-submit-request')); }
        else if (view === 'review') {
          // ReviewView owns its own navigation. Emit an event so it can
          // listen and step forward without us reaching into its state.
          try { window.dispatchEvent(new CustomEvent('vmx-review-next')); } catch {}
        }
        return;
      }
      if (k === 'k' || k === 'K') {
        e.preventDefault();
        if (view === 'exam') prevQ();
        else if (view === 'review') {
          try { window.dispatchEvent(new CustomEvent('vmx-review-prev')); } catch {}
        }
        return;
      }
      if (k === 'p' || k === 'P') {
        // Pin — Question.jsx owns PinButton state; dispatch event with the
        // current questionId so it can pick up the right card.
        try {
          window.dispatchEvent(new CustomEvent('vmx-q-pin-toggle', {
            detail: { questionId: q?.id ?? null },
          }));
        } catch {}
        return;
      }
      if (view === 'review' && (k === 'b' || k === 'B')) {
        // Bookmark in review — exam handler covers exam view.
        if (q?.id != null) toggleBookmark(q.id);
        return;
      }
      if (view === 'review' && (k === 'f' || k === 'F')) {
        // Flag — emit event; whoever listens (Question.jsx flag UI) opens
        // its own prompt. Exam handler treats F as TF answer so we skip.
        try {
          window.dispatchEvent(new CustomEvent('vmx-q-flag-toggle', {
            detail: { questionId: q?.id ?? null },
          }));
        } catch {}
        return;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // Same TDZ caveat as the exam handler above — nextQ/prevQ/toggleBookmark
    // are declared later in this component. Closure read at fire time is OK.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentIdx, questions, paletteOpen, shortcutSheetOpen]);

  const cardStats = useMemo(() => {
    // Only count SR-eligible questions so the Home dashboard "X due"
    // badge matches what SRSessionView will actually serve.
    const pool = {};
    allQuestions.filter(isFlashcardCompatible).forEach((q) => {
      pool[q.id] = srCards[q.id] || { nextReview: Date.now(), totalReviews: 0, repetitions: 0, interval: 0 };
    });
    return getCardStats(pool);
  }, [srCards, allQuestions]);

  const analytics = useMemo(() => {
    if (!history.length) return null;
    const bySubject = {};
    const byTag = {};
    const questionStats = {};
    SUBJECTS.forEach((s) => { if (s.id !== 'all') bySubject[s.id] = { correct: 0, total: 0 }; });
    let totalCorrect = 0;
    // Entries whose question resolved in the currently-loaded bank. The
    // numerator below only counts these, so the denominator must too —
    // dividing by the full history understated accuracy for anyone whose
    // history spans questions outside the loaded year scope.
    let totalScored = 0;
    // Q ID collisions exist across subjects (com4↔engprof, com3↔exotic etc).
    // Use compound (subject:id) lookup to avoid stat leakage. Pre-build a
    // map once per pass instead of O(n) Array.find per history entry.
    const qByCompound = new Map();
    for (const q of allQuestions) qByCompound.set(q.subject + ':' + q.id, q);
    history.forEach((h) => {
      const q = qByCompound.get((h.subject || '') + ':' + h.questionId)
        || allQuestions.find((x) => x.id === h.questionId); // fallback for legacy history without subject
      if (!q) return;
      totalScored++;
      if (!bySubject[q.subject]) bySubject[q.subject] = { correct: 0, total: 0 };
      bySubject[q.subject].total++;
      if (h.correct) { bySubject[q.subject].correct++; totalCorrect++; }
      q.tags?.forEach((tag) => {
        if (!byTag[tag]) byTag[tag] = { correct: 0, total: 0 };
        byTag[tag].total++;
        if (h.correct) byTag[tag].correct++;
      });
      if (!questionStats[h.questionId]) questionStats[h.questionId] = { correct: 0, total: 0, wrong: 0 };
      questionStats[h.questionId].total++;
      if (h.correct) questionStats[h.questionId].correct++;
      else questionStats[h.questionId].wrong++;
    });
    const weakTags = Object.entries(byTag).filter(([_, s]) => s.total >= 2)
      .map(([tag, s]) => ({ tag, pct: Math.round((s.correct / s.total) * 100), total: s.total }))
      .sort((a, b) => a.pct - b.pct).slice(0, 8);
    const weakQuestions = Object.entries(questionStats).filter(([_, s]) => s.wrong >= 1)
      .sort((a, b) => b[1].wrong - a[1].wrong).slice(0, 25).map(([id]) => parseInt(id));
    const overallPct = totalScored ? Math.round((totalCorrect / totalScored) * 100) : 0;
    return { bySubject, weakTags, weakQuestions, totalAttempts: history.length, totalScored, overallPct };
  }, [history, allQuestions]);

  const configPracticeMode = normalizePracticeMode(practiceMode, subject, false);
  const configAvailableCount = useMemo(() => {
    const scopeReady = USER_CURATED_MODES.has(configPracticeMode)
      ? isQBFullyLoaded()
      : isQBYearLoaded(selectedYear);
    if (!scopeReady) return null;
    return buildExamPool({
      questions: allQuestions,
      practiceMode: configPracticeMode,
      subject,
      topic,
      questionCategory,
      selectedYear,
      bookmarks,
      weakQuestions: analytics?.weakQuestions || [],
      history,
    }).length;
  }, [allQuestions, analytics?.weakQuestions, bookmarks, configPracticeMode, history, questionCategory, selectedYear, subject, topic]);

  // startExam accepts an optional `overrides` object so a caller (like the
  // 1-click "ฝึก 1 ข้อด่วน" from HomeView) can bypass React's async state
  // batching. Without overrides, the function reads from current React
  // state — preserves the original ConfigView "click เริ่มฝึก" flow.
  // Use `'key' in overrides` so callers can explicitly pass null (e.g.,
  // topic: null means "no topic filter"); `??` would default null back
  // to the state value.
  const startExam = async (overrides = {}) => {
    finishingRef.current = false; // arm the finish latch for a fresh session
    // A new set replaces whatever was saved, so the resume card's numbers
    // (captured once at boot) would otherwise describe a session that no
    // longer exists — and its "ทำต่อ" button would find nothing to resume.
    setPendingResume(null);
    let _practiceMode = 'practiceMode' in overrides ? overrides.practiceMode : practiceMode;
    const _subject = 'subject' in overrides ? overrides.subject : subject;
    const _topic = 'topic' in overrides ? overrides.topic : topic;
    const _questionCategory = 'questionCategory' in overrides ? overrides.questionCategory : questionCategory;
    const _numQuestions = 'numQuestions' in overrides ? overrides.numQuestions : numQuestions;
    const _useTimer = 'useTimer' in overrides ? overrides.useTimer : useTimer;
    const _timePerQ = 'timePerQ' in overrides ? overrides.timePerQ : timePerQ;

    // Palm bug 2026-05-20: practiceMode='wrong'/'weak'/'bookmarks' gets
    // sticky from HomeView shortcuts ("ทบทวนข้อที่ตอบผิด" etc.) and
    // bleeds into the SubjectSelect → TopicSelect → ConfigView flow.
    // If the caller didn't explicitly pass `practiceMode` AND they did
    // pick a specific subject (not 'all'), the more recent + more
    // specific signal wins — force 'all' so the subject filter actually
    // applies. Without this, the user picks COM I, clicks 🚀, and gets
    // the 3 wrong-history Qs (or empty pool → alert) instead.
    const explicitMode = 'practiceMode' in overrides;
    _practiceMode = normalizePracticeMode(_practiceMode, _subject, explicitMode);

    const isUserCuratedPool = USER_CURATED_MODES.has(_practiceMode);

    // Phase 3: QB lazy. App.jsx kicks off background load on mount so
    // by the time the user clicks "Start" this usually resolves
    // instantly. The await is here as a safety net — if the user is
    // very quick OR background-load is slow (cold cache, slow network)
    // we hold here until QB is populated rather than starting an exam
    // against an empty pool.
    const needsFullRegistry = isUserCuratedPool;
    const scopeReady = needsFullRegistry
      ? isQBFullyLoaded()
      : isQBYearLoaded(selectedYear);
    if (!scopeReady) {
      try {
        if (needsFullRegistry) await loadQB();
        else await loadQBForYear(selectedYear);
        setQbReady(true);
        setQbRevision((revision) => revision + 1);
      } catch (err) {
        alertDialog({ title: 'โหลดคลังโจทย์ไม่ได้', body: 'ตรวจการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง' });
        return;
      }
    }

    // QB is a shared array mutated by the async loaders. Read it only after
    // the awaited scope completes; `allQuestions` belongs to the render that
    // started this async handler and can otherwise be stale on slow WebKit.
    const examQuestions = [...QB, ...customQuestions];

    const pool = buildExamPool({
      questions: examQuestions,
      practiceMode: _practiceMode,
      subject: _subject,
      topic: _topic,
      questionCategory: _questionCategory,
      selectedYear,
      bookmarks,
      weakQuestions: analytics?.weakQuestions || [],
      history,
    });

    if (!pool.length) {
      // Year-switch race: QB may already hold ANOTHER year's banks (so the
      // top-of-function "QB completely empty" guard was skipped), while the
      // picked subject's year-banks haven't merged in yet → the filtered
      // pool is empty even though the subject genuinely has questions.
      // Before dead-ending with an alert, load ALL banks and retry ONCE.
      // Only alert if the pool is STILL empty after a full load (= the
      // subject/category truly has no questions). Guarded against re-loops
      // by isQBFullyLoaded() + the __retriedFullLoad sentinel.
      if (!isQBFullyLoaded() && !overrides.__retriedFullLoad) {
        try {
          await loadQB();
          setQbReady(true);
          setQbRevision((revision) => revision + 1);
          return startExam({ ...overrides, __retriedFullLoad: true });
        } catch {
          alertDialog({ title: 'โหลดคลังโจทย์ไม่ได้', body: 'ตรวจการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง' });
          return;
        }
      }
      if (_questionCategory === 'writing') {
        alertDialog('ยังไม่มีข้อ Writing ในหมวดนี้ — ลองเปลี่ยนเป็น MCQ หรือ "ทุกประเภท"');
        return;
      }
      // A topic with no questions of its own is a dead end 33 VetWiki
      // articles can reach through "ฝึกจากหัวข้อนี้" — offer the whole
      // subject instead of just announcing the wall.
      const _subjMeta = SUBJECTS.find((s) => s.id === _subject);
      const _subjectHasQs = !!_subject && _subject !== 'all'
        && examQuestions.some((q) => q.subject === _subject);
      if (_topic && _subjectHasQs && _subjMeta) {
        const goSubject = await confirmDialog({
          title: 'หัวข้อนี้ยังไม่มีข้อสอบ',
          body: `ยังไม่มีข้อสอบของหัวข้อนี้โดยตรง — ฝึกทั้งวิชา ${_subjMeta.name} แทนเลยไหม`,
          confirmLabel: 'ฝึกทั้งวิชา',
          cancelLabel: 'ไว้ก่อน',
        });
        if (goSubject) return startExam({ ...overrides, topic: null, __retriedFullLoad: true });
        return;
      }
      alertDialog('ไม่มีข้อสอบในหมวดนี้');
      return;
    }

    const qCount = Math.max(1, _numQuestions);
    const baseTime = _useTimer ? Math.max(5, _timePerQ) : 0;

    let picked = shuffle(pool).slice(0, Math.min(qCount, pool.length));
    // Mock-tagged questions (examOrigin set) belong to a structured
    // exam — passage Q1 must come before Q2, etc. Re-sort by ID
    // after the random pick so passage flow is preserved while still
    // sampling randomly from the larger pool.
    if (picked.some((q) => q.examOrigin)) {
      picked = picked.sort((a, b) => a.id - b.id);
    }
    // Per-question time uses timeForQuestion(): essays get 25 min minimum,
    // short answers 3 min minimum, MCQ/TF stay at the user's base setting
    const firstTime = picked[0] ? timeForQuestion(picked[0], baseTime) : baseTime;

    // useExamSession owns the runtime state shape; this single call
    // primes questions/answers/currentIdx/timeLeft/examStartTime in
    // one synchronous batch (was 5 inline setters pre-refactor).
    session.startNewSession(picked, firstTime);
    setView('exam');
    // NOTE: the streak used to be bumped right here — i.e. for merely OPENING
    // a set, before a single answer. That inflated the header counter and made
    // it disagree with HomeView's streak, which is derived from real answer
    // history. It now happens in finishExam, where practice actually happened.
  };

  const finishExam = async () => {
    if (finishingRef.current) return; // guard against timer+submit double-fire
    finishingRef.current = true;
    // Only count auto-graded questions in history/percentage —
    // writing Qs need self-grading and shouldn't penalize the
    // correctness percentage by always being marked wrong.
    const autoQs = questions.filter((q) => !isWritingType(q));
    const correct = autoQs.filter((q) => isCorrect(q, answers[q.id])).length;
    // Year/phase scoping (data-layer audit 2026-05-18):
    //   Each history entry now carries `year` + `phase` so downstream
    //   analytics (NextActionCard weakest-subject, leaderboard filter,
    //   dashboard scopedHistory) can year-filter without going through
    //   the subject→year curriculum map on every read.
    //   Q's own `year` is preferred (set in q-bank source); falls back
    //   to selectedYear when missing (legacy Qs / custom Qs).
    const newEntries = autoQs.map((q) => ({
      date: Date.now(),
      questionId: q.id,
      correct: isCorrect(q, answers[q.id]),
      subject: q.subject,
      year: q.year ?? selectedYear ?? null,
      phase: selectedPhase ?? null,
    }));
    setHistory((h) => [...h, ...newEntries]);

    // Streak counts DAYS THE USER ACTUALLY PRACTISED, so it moves here (a
    // finished set with graded answers) rather than when a set is opened.
    if (newEntries.length > 0) {
      const newStreak = updateStreak(streakData.lastDate, streakData.streak, streakData.freezeUsedAt);
      setStreakData(newStreak);
      // Streak-freeze used → flash a one-time toast so the user knows
      // their streak survived a skipped day. (UI surface in HomeView.)
      if (newStreak.freezeJustUsed) {
        try { window.dispatchEvent(new CustomEvent('vmx-streak-freeze-used', { detail: newStreak.streak })); } catch {}
      }
    }

    // XP + Daily Quests + Auto-promote wrong → SR. Wrapped in try/catch
    // so a single throw can't block the navigate-to-results path that
    // follows — gamification must never break the core exam loop.
    try {
      for (const entry of newEntries) {
        const xpAmount = entry.correct ? XP_AWARDS.correctAnswer : XP_AWARDS.wrongAnswer;
        awardXp(xpAmount, 'exam');
        recordQuestEvent('answered', { subject: entry.subject, correct: entry.correct });
      }
    } catch {}

    // Auto-promote — find Qs the user has gotten wrong ≥ 2 times across
    // ALL history (including these fresh entries) and inject a low-ease
    // SR card so they resurface tomorrow. Skips Qs that already have a
    // pending review so the queue doesn't grow unboundedly.
    try {
      const combinedHistory = [...history, ...newEntries];
      const candidates = findAutoPromoteCandidates({ history: combinedHistory, srCards, threshold: 2 });
      if (candidates.length > 0) {
        setSrCards((prev) => {
          const next = { ...prev };
          for (const cand of candidates) {
            // Don't clobber a card the user has already reviewed once —
            // findAutoPromoteCandidates already filtered pending ones,
            // but the totalReviews>0 guard catches edge cases.
            const existing = next[cand.questionId];
            if (existing && (existing.totalReviews || 0) > 0) continue;
            next[cand.questionId] = makeLowEaseCard(cand.questionId, { ease: 1.5 });
          }
          return next;
        });
      }
    } catch {}

    // Snapshot the session config so the '🔁 ทำซ้ำ' preset on HomeView
    // can replay the exact same exam shape (mode + subject + topic +
    // numQuestions + timer settings). Per-Q history alone doesn't carry
    // these — only auto-graded session settings need preservation.
    try {
      window.localStorage?.setItem('vmx-last-session-config', JSON.stringify({
        mode, subject, topic, practiceMode,
        numQuestions, useTimer, timePerQ, questionCategory,
        savedAt: Date.now(),
        score: { correct, total: autoQs.length, pct: autoQs.length ? Math.round((correct / autoQs.length) * 100) : 0 },
      }));
    } catch {}

    if (user) {
      const pct = autoQs.length ? Math.round((correct / autoQs.length) * 100) : 0;
      const duration = examStartTime ? Math.round((Date.now() - examStartTime) / 1000) : 0;
      // Year/phase from selectedYear/Phase (data-layer audit 2026-05-18).
      // Mock that crosses years (subject='all' or mixed) sends year=null
      // so the leaderboard can show it under "ทั้งหมด" tab but not in
      // year-specific tabs. saveExamResult RPC accepts these as nullable.
      const resolvedYear = (() => {
        // If single-subject mock, prefer the subject's curriculum year
        // for correctness even when selectedYear differs (e.g. user
        // browsing Y5 but exam is from Y4 VCA add-on).
        if (subject && subject !== 'all') {
          const ySubj = yearForSubject(subject);
          if (Number.isFinite(ySubj)) return ySubj;
        }
        return selectedYear ?? null;
      })();
      saveExamResult({
        user_id: user.id,
        mode,
        subject,
        total: autoQs.length,
        correct,
        pct,
        duration_sec: duration,
        year: resolvedYear,
        phase: selectedPhase ?? null,
      }).catch(() => {});
    }
    // We used to clear `vmx-inflight-exam` here, but that left
    // submitted exams unrecoverable if the ResultsView chunk failed
    // to load (deploy mid-session 404, slow network, etc). Now we
    // tag the in-flight state as 'submitted' first; the user can
    // reload and ReviewView will replay the answers. ResultsView
    // does its own clear once it has actually mounted with score in
    // hand (see ResultsView's `useEffect` cleanup).
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) {
        const obj = JSON.parse(raw);
        obj.submitted = true;
        obj.submittedAt = Date.now();
        window.localStorage?.setItem('vmx-inflight-exam', JSON.stringify(obj));
      }
    } catch {}
    setView('results');
  };

  // Wire the finishExam ref so useExamSession's timer-tick effect can
  // call our finishExam on time-up. Must run AFTER finishExam is
  // declared. Reassigned on every render — that's fine, the ref is
  // stable; only its `.current` changes. The hook reads via callback
  // closure at fire time, so it always sees the latest finishExam.
  finishExamRef.current = finishExam;

  const toggleBookmark = (qId) => setBookmarks((bk) => bk.includes(qId) ? bk.filter((x) => x !== qId) : [...bk, qId]);
  // Notes are the one field a user edits a character at a time, and every
  // setNotes() is a synchronous localStorage commit of the whole dataset.
  // Measured on a 4x-throttled phone with a power-user store: 17.9 ms per
  // keystroke, i.e. a dropped frame on every letter, getting worse as the
  // store grows. So the draft lives in component state (instant, and the
  // textarea was already re-rendering per keystroke anyway) and the commit
  // is debounced. Anything that could lose the draft flushes first.
  const [notesDraft, setNotesDraft] = useState(null);
  const notesView = notesDraft || notes;
  const notesTimerRef = useRef(null);
  const notesDraftRef = useRef(null);
  notesDraftRef.current = notesDraft;

  const flushNotes = useCallback(() => {
    if (notesTimerRef.current) { clearTimeout(notesTimerRef.current); notesTimerRef.current = null; }
    const draft = notesDraftRef.current;
    if (!draft) return;
    // record() is synchronous, so both updates land in the same commit and
    // the textarea never flashes the pre-draft value.
    notesDraftRef.current = null;
    setNotes(draft);
    setNotesDraft(null);
  }, [setNotes]);

  const setNote = (qId, text) => {
    const base = notesDraftRef.current || notes;
    let next;
    if (text.trim()) next = { ...base, [qId]: text };
    else { const { [qId]: _drop, ...rest } = base; next = rest; }
    notesDraftRef.current = next;
    setNotesDraft(next);
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(flushNotes, 600);
  };

  // Leaving the question, closing the tab, or backgrounding the app all end
  // the typing burst — commit before the draft can be lost.
  useEffect(() => {
    const onHide = () => flushNotes();
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onHide);
      flushNotes();
    };
  }, [flushNotes]);
  useEffect(() => { flushNotes(); }, [currentIdx, view, flushNotes]);

  const score = useMemo(() => {
    // Split auto-graded vs writing for honest score reporting.
    // Writing questions are open-ended → counted separately so the
    // percentage reflects only what the engine could grade. Writing
    // gets graded against its rubric in Review.
    const autoQs = questions.filter((q) => !isWritingType(q));
    const writingQs = questions.filter((q) => isWritingType(q));
    const correct = autoQs.filter((q) => isCorrect(q, answers[q.id])).length;
    const writingAttempted = writingQs.filter((q) => {
      const ua = answers[q.id];
      return typeof ua === 'string' && ua.trim().length > 0;
    }).length;
    const totalAuto = autoQs.length;
    return {
      correct,
      total: totalAuto,
      pct: totalAuto ? Math.round((correct / totalAuto) * 100) : 0,
      writingTotal: writingQs.length,
      writingAttempted,
      // Combined total still used by some legacy callers
      totalAll: questions.length,
    };
  }, [questions, answers]);

  // answerCurrent · nextQ · prevQ · jumpToQ moved into useExamSession
  // 2026-05-27. Available via the destructure at the top of this
  // component. Identical behavior; same closure rules; the only
  // change is that they read state from the hook's own setters.

  // Open a governed article, landing on an exact section when the caller knows
  // one. The repo already decides which section answers each linked question
  // (QUESTION_LINKS carries a sectionId), and that judgement used to be thrown
  // away one call from delivery — dropping the reader at the top of an article
  // averaging a dozen sections, at the exact moment they had just lost a mark.
  // Push the article path before the large lazy KnowledgeView chunk mounts.
  // Besides making the link immediately shareable, this keeps history as one
  // atomic entry instead of relying on a later effect to rewrite `/`.
  const openWiki = (subj, top, sectionId) => {
    setSubject(subj);
    setTopic(top);
    setView('knowledge', { path: wikiPath(subj, top, sectionId) });
  };

  // Set when the reader opens a document from the library, so PdfAnnotateView
  // knows to stream it instead of showing its drag-drop empty state. Cleared
  // on the way out (below) — a stale value would silently reopen the last
  // library document when someone later picks "เขียนบน PDF" from the tools menu.
  const [libraryDoc, setLibraryDoc] = useState(null);
  useEffect(() => {
    if (libraryDoc && view !== 'pdf-annotate' && view !== 'library') setLibraryDoc(null);
  }, [view, libraryDoc]);

  const goHome = () => {
    setView('home');
    finishingRef.current = false; // clear the finish latch on leaving
    // Reset exam runtime (clears questions/answers/currentIdx + timer)
    session.resetSession();
    setPracticeMode('all'); setMode('quick'); setActiveGroup(null); setTopic(null);
    // The parked exam is deliberately LEFT ALONE here.
    //
    // This used to `removeItem('vmx-inflight-exam')` on the grounds that the
    // user "explicitly chose to leave". They did not: goHome is what the home
    // tab and every BackBar in the app call (see lib/nav.js), so tapping home
    // from a stat screen silently destroyed a half-finished mock — 31 of 50
    // answered, no prompt, no undo. Discarding the set is a real action with a
    // real confirmation, and it already exists: dismissPendingExam.
    //
    // Leaving the key costs nothing. It expires after 6 hours, ResultsView
    // clears it once a score has actually been rendered, and the resume offer
    // is opt-in.
    // Strip share-link query so a refresh from home doesn't bounce
    // back into the shared exam.
    try {
      if (
        window.location.search.includes('qset=')
        || window.location.search.includes('sc=')
        || window.location.search.includes('by=')
        || window.location.search.includes('t=')
      ) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch {}
    // Round 2B: clear challenge sender info — user left the challenge.
    setChallengeSender(null);
  };

  const goBackFromConfig = () => {
    if (subject && subject !== 'all' && !USER_CURATED_MODES.has(configPracticeMode)) {
      setView('topic-select');
      return;
    }
    goHome();
  };

  const handleSignOut = async () => {
    if (!(await confirmDialog({ title: 'ออกจากระบบ?', confirmLabel: 'ออกจากระบบ' }))) return;
    await signOut();
    goHome();
  };

  // Safety net for the removed Mock demo-stub: if stale browser history
  // pops back to 'mock-exam'/'mock-results', bounce to home instead of a
  // dead/blank view. (New Mock Exam nav goes through 'config' → real exam.)
  useEffect(() => {
    if (['mock-exam', 'mock-results', 'domain-detail', 'admin', 'wiki-public'].includes(view)) goHome();
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Mock Exam" preset — one handler shared by the desktop Sidebar and the
  // mobile BottomNav (same preset as HomeView's "Exam Mode" card): a real
  // 50-Q × 60s cross-subject timed exam through the config → engine flow.
  const startMockExam = () => {
    setMode('exam');
    setSubject('all');
    setPracticeMode('all');
    setNumQuestions(50);
    setUseTimer(true);
    setTimePerQ(60);
    setView('config');
  };
  const navHandlers = { setView, goHome, setSubject, setPracticeMode, setMode, onMockExam: startMockExam };

  // Replay an arbitrary slice of questions as a fresh exam round.
  // Used by ResultsView "redo wrong" — passes the wrong-only subset.
  // The CORE state shape (questions/answers/currentIdx/timer cleared)
  // is handled by session.replayQuestions; the App-only side effects
  // (setUseTimer false → redo rounds run untimed, setView('exam') →
  // route transition) wrap around it.
  const replayQuestions = useCallback((qs) => {
    if (!Array.isArray(qs) || qs.length === 0) return;
    finishingRef.current = false; // arm the finish latch for the redo round
    setUseTimer(false); // redo rounds never on a clock — focused review
    session.replayQuestions(qs);
    setView('exam');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session/setView stable
  }, []);

  // currentQ / currentAnswer destructured from useExamSession at top of
  // component (2026-05-27 refactor). Only isBookmarked stays local
  // because bookmarks is App-owned (cross-session user data).
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  // ── Landing → real app handlers ──────────────────────────────────
  // Marks the landing as seen (so returning visitors skip it) and drops
  // the visitor into the normal entry: year-select if they've never
  // picked a year, else home. No new flow — the real front door.
  const leaveLandingTo = (next) => {
    try { window.localStorage?.setItem('vmx-seen-landing', '1'); } catch {}
    setView(next);
  };
  const landingEnterApp = () => leaveLandingTo(selectedYearStored == null ? 'year-select' : 'home');

  // ── Landing CTAs land where they promise ─────────────────────────────
  // Every landing CTA used to call onEnterApp, so "Start a Mock Exam",
  // "Enter Panic Mode" and the Lab CTA all dumped the user on the generic
  // year picker — the page advertised destinations the click never reached.
  // Now each runs its real destination. A first-time visitor still has to
  // pick a year first (the questions are year-scoped), so the intent is
  // parked and replayed once they arrive at home.
  const landingIntentRef = useRef(null);
  const runLandingIntent = (intent) => {
    if (intent?.kind === 'mock-exam') { startMockExam(); return; }
    if (intent?.kind === 'panic') { startPanicSession(intent.timeKey); return; }
    if (intent?.kind === 'lab') { setView('lab'); return; }
  };
  const goLanding = (intent) => {
    try { window.localStorage?.setItem('vmx-seen-landing', '1'); } catch {}
    // Practical Imaging is year-agnostic, so first-time visitors can use it
    // immediately. Question-based intents still wait for a year selection.
    if (intent?.kind === 'lab') {
      runLandingIntent(intent);
      return;
    }
    if (selectedYearStored == null) {
      landingIntentRef.current = intent;   // replayed on arrival at home
      setView('year-select');
      return;
    }
    runLandingIntent(intent);
  };
  useEffect(() => {
    if (view !== 'home' || !landingIntentRef.current) return;
    const intent = landingIntentRef.current;
    landingIntentRef.current = null;
    runLandingIntent(intent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Panic Mode — real, not a mock-up: a timed cram sized to the time the
  // user says they have left, drawn from their weak topics when there's
  // enough history to know them (that's the page's "prioritised for you"),
  // otherwise a cross-subject set so a first-time user isn't handed an
  // empty pool.
  const PANIC_SIZE = { 15: 12, 30: 25, 60: 50, tonight: 120 };
  const startPanicSession = (timeKey = '30') => {
    const n = PANIC_SIZE[timeKey] || PANIC_SIZE['30'];
    const knowsWeakSpots = Array.isArray(history) && history.length >= 20;
    setMode('quick');
    setSubject('all');
    startExam({
      subject: 'all',
      topic: null,
      practiceMode: knowsWeakSpots ? 'weak' : 'all',
      questionCategory: 'all',
      numQuestions: n,
      useTimer: timeKey !== 'tonight',
      timePerQ: 60,
    });
  };
  // Pick a real subject from the landing → the exact sequence a subject
  // card uses in HomeView (reset practiceMode, set subject, topic-select).
  const landingPickSubject = (year, subjectId) => {
    try { window.localStorage?.setItem('vmx-seen-landing', '1'); } catch {}
    if (year != null) setSelectedYear(year);
    setMode('quick');
    setPracticeMode('all');
    setSubject(subjectId);
    setTopic(null);
    setView('topic-select');
  };
  const landingOpenAuth = () => leaveLandingTo(hasSupabase ? 'auth' : 'year-select');
  const landingConsent = (choice, prefs) => {
    setConsent(choice);
    if (prefs) setConsentPrefs(prefs);
  };

  if (view === 'landing') {
    return (
      <>
        <TopLoadingBar />
        <ErrorBoundary onReset={goHome}>
        <Suspense fallback={<ViewFallback />}>
          <LandingView
            onEnterApp={landingEnterApp}
            onStartMockExam={() => goLanding({ kind: 'mock-exam' })}
            onStartPanic={(timeKey) => goLanding({ kind: 'panic', timeKey })}
            onOpenLab={() => goLanding({ kind: 'lab' })}
            onPickSubject={landingPickSubject}
            onOpenAuth={landingOpenAuth}
            onGoogle={() => { signInWithGoogle().catch(() => landingOpenAuth()); }}
            onMagicLink={(email) => signInWithMagicLink(email)}
            hasSupabase={hasSupabase}
            theme={theme}
            onToggleTheme={() => setTheme((th) => (th === 'dark' ? 'light' : 'dark'))}
            lang={landingLang}
            onSetLang={setLandingLang}
            consent={consent}
            onConsent={landingConsent}
          />
        </Suspense>
        </ErrorBoundary>
        {analyticsAllowed && !IS_LOCAL_HOST && (
          <Suspense fallback={null}>
            <Analytics />
            <SpeedInsights />
          </Suspense>
        )}
      </>
    );
  }

  return (
    <>
      {/* Global CSS now loaded via `import './styles.css'` at the top of
          this file (Vite injects it) — no more <style>{STYLES}</style>. */}
      <TopLoadingBar />
      {/* One mounted dialog for every confirmDialog()/alertDialog() caller. */}
      <DialogHost />
      {/* `is-focus` = the bottom nav is not rendered for this view, so the
          space normally reserved for it is dead weight (58px of it, on every
          exam screen). See the .vmx-app padding rule in styles.css. */}
      <div className={`vmx-app${FOCUS_VIEWS.has(view) ? ' is-focus' : ''}`}>
        {!FOCUS_VIEWS.has(view) && (
          <Sidebar
            view={view}
            setView={setView}
            goHome={goHome}
            setSubject={setSubject}
            setPracticeMode={setPracticeMode}
            setMode={setMode}
            onMockExam={startMockExam}
          />
        )}
        <div className="vmx-container">
          {/* Skip-to-main link — keyboard/screen-reader only, visible on
              focus so sighted users don't see it. Lets users bypass the
              header chrome straight to the active view's content. */}
          <a href="#main" className="vmx-skip-link">ข้ามไปเนื้อหาหลัก</a>
          {/* Network-status banner — shown when offline OR briefly after
              regaining connectivity. The "Play game" action lives on a
              dedicated button so a stray tap on the banner text doesn't
              navigate accidentally (used to be a div-wide onClick which
              hijacked any tap, including swipe-to-scroll on iOS). */}
          {view !== 'offline-game' && view !== 'exam' && (
            <SyncStatusNotice
              online={networkOnline}
              justChanged={networkJustChanged}
              signedIn={Boolean(user)}
              sync={userDataSync}
              onRetry={userDataSync.retry}
              onOfflineGame={() => setView('offline-game')}
            />
          )}

          {/* New service-worker version installed — shown only when NOT in
              an exam (don't yank state mid-session). Reload only happens
              on user click, not auto-reload. */}
          {swUpdateReady && view !== 'exam' && (
            <div
              role="status"
              aria-live="polite"
              className="vmx-update-notice"
            >
              <span>มีเวอร์ชันใหม่พร้อมใช้</span>
              <button
                type="button"
                onClick={() => {
                  if (window.__VMX_UPDATE_STATUS__?.reason === 'service-worker') {
                    window.dispatchEvent(new Event('vmx-sw-apply-update'));
                  } else {
                    window.location.reload();
                  }
                }}
                className="vmx-btn vmx-btn-primary vmx-btn-sm vmx-update-notice__refresh"
              >
                รีเฟรชตอนนี้
              </button>
              <button
                type="button"
                onClick={dismissSwUpdate}
                className="vmx-icon-close vmx-update-notice__close"
                aria-label="ปิดการแจ้งเตือนอัปเดตนี้"
                title="ไว้ทีหลัง"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header — hidden on full-screen / focus views (exam in progress,
              results, review, auth) so user isn't tempted to navigate away
              mid-session and so the result/review pages don't have nav
              chrome competing with the data presentation.
              Also hidden on year-select to avoid a confusing logo→home
              click when the user hasn't picked a year yet.
              Body extracted to components/HeaderBar.jsx 2026-05-27. */}
          {!FOCUS_VIEWS.has(view) && (
            <HeaderBar
              view={view}
              setView={setView}
              goHome={goHome}
              selectedYear={selectedYear}
              selectedYearStored={selectedYearStored}
              selectedPhase={selectedPhase}
              setPaletteOpen={setPaletteOpen}
              bookmarks={bookmarks}
              setPracticeMode={setPracticeMode}
              setMode={setMode}
              streakData={streakData}
              user={user}
              profile={profile}
              handleSignOut={handleSignOut}
              theme={theme}
              setTheme={setTheme}
              palette={palette}
              setPalette={setPalette}
            />
          )}

          {/* Async-challenge sender banner — Round 2B 2026-05-18.
              Visible during exam + results so the receiver knows what
              score to beat. Survives view changes within the same
              shared-link session; cleared by goHome or new session. */}
          {challengeSender && (view === 'exam' || view === 'results' || view === 'review') && (
            <div
              role="status"
              style={{
                marginBottom: 12,
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-gold, #b88940)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }} aria-hidden>📨</div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--clr-ink)' }}>
                <strong>{challengeSender.senderName ? `${challengeSender.senderName}` : 'เพื่อน'}</strong>{' '}
                ท้าคุณ
                {challengeSender.senderScore
                  ? <>, ผู้ส่งได้ <strong>{challengeSender.senderScore.correct}/{challengeSender.senderScore.total}</strong>
                    {Number.isFinite(challengeSender.senderTimeSec) && challengeSender.senderTimeSec > 0
                      ? <> ใน <strong>{Math.floor(challengeSender.senderTimeSec / 60)}:{String(Math.floor(challengeSender.senderTimeSec % 60)).padStart(2, '0')}</strong></>
                      : null}
                    {' '}— ลองว่าคุณได้เท่าไหร่</>
                  : <>, ลองทำชุดเดียวกัน</>}
              </div>
            </div>
          )}
          {/* Palm a11y audit 2026-05-20: add `<main>` landmark so screen
              readers can jump past the header chrome to the active view.
              Skip-link below the header lets keyboard users do the same. */}
          <main
            id="main"
            tabIndex={-1}
            className={`vmx-main${WIDE_VIEWS.has(view) ? ' vmx-main--wide' : ''}`}
            style={{ outline: 'none' }}
          >
          {authLoading ? <ViewFallback /> : (
            <ErrorBoundary onReset={goHome} key={view}>
            <Suspense fallback={<ViewFallback />}>
              {AUTH_REQUIRED_VIEWS.has(view) && !user && (
                <AuthRequiredState onSignIn={() => setView('auth')} onHome={goHome} />
              )}
              {view === 'home' && <HomeView {...{ setView, setMode, setSubject, setTopic, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, startExam, replayQuestions, cardStats, bookmarks, customQuestions, user, profile, readingChecklist, onlineCount, onlineStatus, selectedYear, setSelectedYear, selectedPhase, setSelectedPhase, pendingResume, resumePendingExam, dismissPendingExam, history, setFeedbackPrefill, buddies, onSketch: () => setSketchOpen(true), onVoiceSettings: () => setVoiceSettingsOpen(true) }} onStartPanic={startPanicSession} />}
              {view === 'auth' && hasSupabase && <AuthView onBack={goHome} onSuccess={goHome} user={user} />}
              {view === 'auth' && !hasSupabase && <AuthUnavailableState onHome={goHome} />}
              {view === 'groups' && user && <GroupsView {...{ user, profile, goHome, setActiveGroup, setView }} />}
              {view === 'group-detail' && user && activeGroup && <GroupDetailView {...{ group: activeGroup, user, goBack: () => setView('groups') }} />}
              {view === 'leaderboard-global' && user && <LeaderboardView {...{ user, goHome, selectedYear }} />}
              {view === 'subject-select' && <SubjectSelectView {...{ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions, selectedYear, qbReady }} />}
              {view === 'topic-select' && <TopicSelectView {...{ subject, setSubject, setTopic, setView, goHome, mode, setMode, setNumQuestions, setUseTimer, setTimePerQ, customQuestions, readingChecklist, onOpenWiki: openWiki, onOpenVideos: (sourceSubject) => setView('videos', { subject: sourceSubject }) }} />}
              {view === 'notes' && <NotesView subject={subject || 'com5'} initialTopic={topic} goBack={() => setView('topic-select')} goHome={goHome} onOpenWiki={openWiki} />}
              {(view === 'knowledge' || view === 'wiki') && <KnowledgeView {...{ subject, topic, setView, setSubject, setTopic, goHome, startExam }} />}
              {view === 'config' && <ConfigView {...{ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory, setQuestionCategory, instantFeedback, setInstantFeedback, startExam, goHome, mode, selectedYear, selectedPhase }} availableCount={configAvailableCount} onBack={goBackFromConfig} />}
              {view === 'exam' && !currentQ && <ViewFallback />}
              {view === 'exam' && currentQ && <ExamView {...{ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, jumpToQ, notes: notesView, setNote, answers, bookmarks, buddies, user, goHome, selectedYear, selectedPhase, mode, instantFeedback }} />}
              {view === 'results' && <ResultsView {...{ score, questions, answers, goHome, setView, mode, selectedYear, selectedPhase, startExam, setSubject, setTopic, setPracticeMode, setMode, setNumQuestions, setUseTimer, replayQuestions, challengeSender, examStartTime }} />}
              {view === 'review' && <ReviewView {...{ questions, answers, bookmarks, toggleBookmark, goHome, setView, notes: notesView, setNote, user, selectedYear, selectedPhase, onOpenWiki: openWiki }} />}
              {view === 'sr-session' && <SRSessionView {...{ srCards, setSrCards, goHome, customQuestions, selectedYear, selectedPhase, qbReady, onOpenWiki: openWiki }} />}
              {view === 'dashboard' && <DashboardView {...{ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setNotes, setCustomQuestions, setStreakData, setPracticeMode, setView, setMode, history, notes, srCards, streak: streakData.streak, streakData, customQuestions, selectedYear, selectedPhase }} />}
              {view === 'question-manager' && <QuestionManagerView {...{ customQuestions, setCustomQuestions, goHome, selectedYear }} />}
              {view === 'schedule' && <ScheduleView {...{ goHome, setSubject, setMode, setView, setPracticeMode, selectedYear, selectedPhase }} />}
              {view === 'scores' && <ScoresView {...{ goHome }} />}
              {view === 'videos' && <VideoView goHome={goHome} initialSubject={videoSubject} />}
              {view === 'about' && <AboutView {...{ goHome, setView }} />}
              {view === 'feedback' && <FeedbackView {...{ goHome, user, profile, prefill: feedbackPrefill, clearPrefill: () => setFeedbackPrefill(null) }} />}
              {view === 'ig-cards' && <IgCardStudioView {...{ goHome }} />}
              {view === 'year-select' && <YearSelectView {...{ goHome, selectedYear, setSelectedYear, setSelectedPhase, setView, firstTime: selectedYearStored === null }} />}
              {view === 'phase-select' && <PhaseSelectView {...{ goHome, selectedYear, selectedPhase, setSelectedPhase, setView }} />}
              {view === 'reading-checklist' && <ReadingChecklistView {...{ selectedYear, readingChecklist, setReadingChecklist, goHome, goBack: () => setView('home'), setSubject, setTopic, setView }} />}
              {view === 'faculty' && <FacultyView {...{ goHome }} />}
              {view === 'account-settings' && user && <AccountSettingsView {...{ user, goHome, onSignedOut: goHome }} />}
              {view === 'offline-game' && <OfflineGameView goBack={goHome} online={networkOnline} />}
              {view === 'pomodoro' && <PomodoroView goHome={goHome} />}
              {view === 'race' && user && <RaceView goHome={goHome} setView={setView} user={user} profile={profile} />}
              {view === 'lab' && <LabView goHome={() => setView(selectedYearStored == null ? 'landing' : 'home')} />}
              {view === 'library' && <LibraryView goHome={goHome} selectedYear={selectedYear} onOpenDoc={(doc) => { setLibraryDoc(doc); setView('pdf-annotate'); }} />}
              {view === 'pdf-annotate' && (
                <PdfAnnotateView
                  goHome={goHome}
                  initialDoc={libraryDoc}
                  onExit={libraryDoc ? () => { setLibraryDoc(null); setView('library'); } : null}
                />
              )}
              {view === 'pinboard' && <PinboardView {...{ goHome, setView, setSubject, setPracticeMode, notes, selectedYear, selectedPhase }} />}
              {view === 'image-occlusion' && <ImageOcclusionView {...{ goHome, setView }} />}
              {view === 'phase-wrapped' && <PhaseWrappedView {...{ goHome, history, srCards, bookmarks, customQuestions }} />}
              {view === 'contribute' && <ContributeView {...{ goHome, setView, user, selectedYear }} />}
              {view === 'review-queue' && user && <ReviewQueueView {...{ goHome, setView, user }} />}
              {(view === 'mock-exam' || view === 'mock-results') && <ViewFallback />}
            </Suspense>
            </ErrorBoundary>
          )}
          </main>

          {/* Footer — brand line + utility links + Vet 86 ecosystem
              cross-links. Extracted to components/Footer.jsx 2026-05-27. */}
          {FOOTER_VIEWS.has(view) && <Footer setView={setView} />}
          {/* Mobile primary nav (<1024px, CSS-gated). Same destinations as the
              desktop Sidebar (lib/nav.js); hidden mid-exam via the same gate. */}
          {!FOCUS_VIEWS.has(view) && <BottomNav view={view} handlers={navHandlers} />}

          {/* Floating clinical-math FAB — visible on every view except
              auth (we want to nudge users to log in, not show them tools
              first) and during an active exam (don't tempt them with the
              calculator UI mid-question — exam already shows wake lock).
              Rendered eagerly so the button is on first paint. */}
          {/* VetCalculator lives in the tree (modal + listener) but
              renders no FAB of its own — ToolsFAB drives opening via
              a window event. */}
          {!FOCUS_VIEWS.has(view) && <VetCalculator showFab={false} />}

          {/* Unified ToolsFAB — one button bottom-right that fans out
              into the calculator + sketchpad. Replaces what used to be
              two stacked floats. Hidden during exam/auth like before. */}
          {!FOCUS_VIEWS.has(view) && view !== 'home' && (
            <ToolsFAB
              onSketch={() => setSketchOpen(true)}
              onView={setView}
            />
          )}
          {sketchOpen && (
            <Suspense fallback={null}>
              <ImageAnnotator src={null} mode="sketch" onClose={() => setSketchOpen(false)} />
            </Suspense>
          )}
        </div>
      </div>

      {/* CommandPalette is mounted only on first open — Suspense
          boundary handles the dynamic import; once loaded, subsequent
          opens are instant. We keep paletteOpen prop control so that
          closing fully unmounts the modal too (cleaner than leaving
          a hidden overlay in the tree). */}
      {paletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            goView={setView}
            setSubject={setSubject}
            setPracticeMode={setPracticeMode}
            openInstructor={(ins) => setOpenInstructor(ins)}
            openVoiceSettings={() => setVoiceSettingsOpen(true)}
            onSketch={() => setSketchOpen(true)}
            onPanic={startPanicSession}
            onOpenWiki={openWiki}
            onOpenLibraryDoc={(doc) => { setLibraryDoc(doc); setView('pdf-annotate'); }}
            onPractice={(inv) => {
              setMode(inv.mode || 'quick');
              setSubject(inv.subject || 'all');
              setPracticeMode(inv.practiceMode || 'all');
              if (inv.numQuestions != null) setNumQuestions(inv.numQuestions);
              if (inv.useTimer != null) setUseTimer(inv.useTimer);
              if (inv.timePerQ != null) setTimePerQ(inv.timePerQ);
              setView('config');
            }}
            signedIn={!!user}
            scaffold={Boolean(YEARS.find((year) => year.id === selectedYear)?.scaffold)}
            hasSupabase={hasSupabase}
            selectedYear={selectedYear}
          />
        </Suspense>
      )}

      {openInstructor && (
        <Suspense fallback={null}>
          <InstructorModal instructor={openInstructor} onClose={() => setOpenInstructor(null)} />
        </Suspense>
      )}

      {voiceSettingsOpen && (
        <Suspense fallback={null}>
          <VoiceSettings onClose={() => setVoiceSettingsOpen(false)} />
        </Suspense>
      )}

      {/* ShortcutSheet — Linear-style "?" help. Mounted only when open
          (lazy chunk loads on first '?' press from exam/review). */}
      {shortcutSheetOpen && (
        <Suspense fallback={null}>
          <ShortcutSheet open={shortcutSheetOpen} onClose={() => setShortcutSheetOpen(false)} />
        </Suspense>
      )}

      {/* HighlightToCard — global listener for text selections inside
          SummaryModal (.vmx-summary-body). Self-contained state; no
          props. Mounted always so the listener catches selections
          made on any SummaryModal that opens, regardless of view. */}
      <Suspense fallback={null}>
        <HighlightToCard />
      </Suspense>

      {/* Anonymous, privacy-preserving usage signal so Palm can see
          if Imaging Lab is getting organic visits + which views people
          stay on. No PII; Vercel-side aggregation. Both no-op in dev.
          Gated on cookie consent — the landing's consent card sets
          'vmx-consent'; analytics only mounts once the visitor opts in
          (or was never asked, e.g. deep-linked past the landing, where
          we default to the prior always-on behaviour to avoid silently
          dropping the existing signal for returning users). */}
      {(analyticsAllowed || consent === 'ask') && !IS_LOCAL_HOST && (
        <Suspense fallback={null}>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      )}
    </>
  );
}

