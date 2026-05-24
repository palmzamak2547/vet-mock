import { useState, useEffect, useMemo, useCallback, useRef, Suspense, lazy } from 'react';
import { flushSync } from 'react-dom';
// Phase 3 perf: QB is now lazy. The static export here is the SAME
// array reference forever, but it's empty until `loadQB()` resolves.
// App.jsx kicks off loadQB() in a top-level effect (background load
// after first paint) and gates exam-start paths on the populated QB.
import { QB, loadQB, loadQBForYear, isQBLoaded } from './data/questions.js';
import { SUBJECTS, CURRENT_YEAR, hiddenTopicIdsFor, yearForSubject } from './data/curriculum.js';
import { useLocalStorage } from './hooks/useStorage.js';
import { useAuth } from './hooks/useAuth.js';
import { useWakeLock } from './hooks/useWakeLock.js';
import { useOnlineCount } from './hooks/useOnlineCount.js';
import { useOnlineStatus } from './hooks/useOnlineStatus.js';
import { useStudyBuddies } from './hooks/useStudyBuddies.js';
import { shuffle, isCorrect, updateStreak, timeForQuestion, isWritingType, questionCategory as catOf } from './hooks/utils.js';
import { getCardStats } from './hooks/sm2.js';
import { isFlashcardCompatible } from './hooks/sr-filter.js';
import { STYLES } from './styles.js';
import { hasSupabase, signOut } from './lib/supabase.js';
import { saveExamResult, pullUserData, pushUserDataDebounced } from './lib/api.js';
import { readShareUrlFromLocation, readSenderInfoFromLocation } from './lib/share-link.js';
import { awardXp, XP_AWARDS } from './lib/xp.js';
import { recordQuestEvent } from './lib/quests.js';
import { findAutoPromoteCandidates, makeLowEaseCard } from './lib/wrong-to-sr.js';

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

// Sketchpad — opens a blank canvas for free-form drawing/diagrams.
// Lazy because it includes canvas + image processing only used when
// the user opens the pad.
const ImageAnnotator = lazy(() => import('./components/ImageAnnotator.jsx'));

// LabView — Imaging Practice Lab (Phase 1: DICOM viewer). Hidden
// behind the URL hash #lab so it doesn't appear in nav. Lazy import
// pulls Cornerstone3D into its own chunk only when a user opens it.
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

// XpChip + QuestsPanel — Duolingo-style daily quests + XP/level
// system. XpChip lives in the header next to 🔥 streak. QuestsPanel
// renders on HomeView under the streak chip row. Both are lazy
// because they're tiny but only useful after first interaction —
// keeps the cold-paint bundle slim.
const XpChip = lazy(() => import('./components/XpChip.jsx'));
const QuestsPanel = lazy(() => import('./components/QuestsPanel.jsx'));

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
  if (prefersReduce || !document.startViewTransition) {
    updateFn();
    return;
  }
  try {
    document.startViewTransition(() => {
      flushSync(() => { updateFn(); });
    });
  } catch {
    updateFn();
  }
}

// ── Theme picker — light/dark + 6 palettes ─────────────────────
// Click → opens a small popover with theme toggle + palette swatches.
// Closes on outside click (handled by capturing pointerdown on document).
const PALETTES = [
  { id: 'default', name: 'Sage + Gold', dot: '#4a6b4a' },
  { id: 'forest',  name: 'Forest',      dot: '#2d5a3d' },
  { id: 'ocean',   name: 'Ocean',       dot: '#3d6b82' },
  { id: 'plum',    name: 'Plum',        dot: '#7d4a7d' },
  { id: 'cherry',  name: 'Cherry',      dot: '#c26d6d' },
  { id: 'mono',    name: 'Mono',        dot: '#4a4a4a' },
];

function ThemePicker({ theme, setTheme, palette, setPalette }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    // Defer attaching the outside-click listener until after the click
    // that opened the menu has finished bubbling (otherwise the same
    // pointerdown closes the menu we just opened).
    const raf = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onDoc);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', onDoc);
    };
  }, [open]);
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        className="vmx-theme-btn"
        onClick={() => setOpen((o) => !o)}
        title="ธีมและสี"
        aria-label="ตัวเลือกธีมและจานสี"
        aria-expanded={open}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 950,
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            borderRadius: 10,
            padding: 10,
            boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
            minWidth: 220,
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
            โหมด
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`vmx-chip ${theme === 'light' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >☀️ Light</button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`vmx-chip ${theme === 'dark' ? 'active' : ''}`}
              style={{ flex: 1 }}
            >🌙 Dark</button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
            จานสี
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPalette(p.id)}
                className={`vmx-chip ${palette === p.id ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '5px 10px' }}
              >
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: p.dot, border: '1px solid var(--clr-border)' }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
const PhaseSelectView = lazy(() => import('./views/PhaseSelectView.jsx'));
const TopicSelectView = lazy(() => import('./views/TopicSelectView.jsx'));
const NotesView = lazy(() => import('./views/NotesView.jsx'));
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

import TopLoadingBar, { ViewFallback } from './components/TopLoadingBar.jsx';

// Vercel Analytics + Speed Insights — lazy-loaded so the home page
// payload doesn't grow on existing users. Both are no-op in dev mode
// and on non-Vercel deploys, so safe to render unconditionally.
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((m) => ({ default: m.Analytics })),
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((m) => ({ default: m.SpeedInsights })),
);

export default function App() {
  const { user, profile, loading: authLoading } = useAuth();

  // Phase 3 perf: QB lazy-load tracker. `qbReady` flips true on first
  // successful loadQB() resolution; we use it to (a) trigger a single
  // re-render across the tree so closures over QB pick up the freshly-
  // populated array, and (b) gate exam-start UI to await the load if
  // the user clicks before background-load finishes.
  const [qbReady, setQbReady] = useState(isQBLoaded());
  // The QB lazy-load effects that key off `selectedYear` are declared
  // AFTER `selectedYear` (line ~415) so they don't trip TDZ on the
  // const before it's initialized. See "QB year-scoped loaders" below.

  // Share-link (`?qset=`) resolution effect. Runs once after QB loads.
  // Initial render shows ExamView with empty questions[] — this effect
  // materializes the matched Qs (or falls back to home if none).
  // Lives at App level so it fires regardless of which view is active.
  const sharedResolvedRef = useRef(false);
  // Round 2B 2026-05-18: sender score/name parsed from URL (`?sc=...&by=...`)
  // — Palm spec wants async challenge to surface a "📨 ผู้ส่งได้ X/Y ·
  // ดูว่าคุณได้เท่าไหร่" banner so the receiver knows what to beat.
  const [challengeSender, setChallengeSender] = useState(() => readSenderInfoFromLocation());
  useEffect(() => {
    if (sharedResolvedRef.current) return;
    if (!qbReady) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('qset')) return;
      const shared = readShareUrlFromLocation();
      if (shared.length === 0) return;
      const map = new Map();
      for (const q of QB) map.set(q.subject + ':' + q.id, q);
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
      sharedResolvedRef.current = true;
    }
  }, [qbReady]);

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
  const initialView = (() => {
    if (typeof window === 'undefined') return 'home';
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'reset') return 'auth';
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
      // Hidden Imaging Practice Lab entry — #lab in the URL fragment.
      // Not surfaced in nav; only opens if someone knows the hash.
      if (window.location.hash === '#lab') return 'lab';
    } catch {}
    try {
      // Parse the stored value — `null` is a valid serialized state
      // meaning "user hasn't picked yet". `getItem` only returns raw
      // null when the key is absent, so distinguish via JSON.parse.
      const raw = window.localStorage.getItem('vmx-selected-year');
      const parsed = raw === null ? null : JSON.parse(raw);
      if (parsed === null) return 'year-select';
    } catch {}
    return 'home';
  })();

  const [view, setViewRaw] = useState(initialView);
  const [mode, setMode] = useState('quick');
  const [subject, setSubject] = useState('all');
  const [topic, setTopic] = useState(null);
  const [practiceMode, setPracticeMode] = useState('all');
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
    // Background load — non-blocking, fires once per page life. Errors
    // are swallowed at this layer; explicit awaits in startExam() will
    // surface real failures via alert().
    //
    // Year-scoped (Palm audit 2026-05-20): pull only the current year's
    // chunks instead of all 34. Y4-only users skip the ~7 Y5 banks
    // (~250 KB savings on slow networks). Cross-year banks (vca/short/
    // mahahon/termpaper) still load. If the user later switches year,
    // loadQBForYear() is re-called by the year-watcher effect below.
    loadQBForYear(selectedYear).then(() => setQbReady(true)).catch(() => {});
  }, [qbReady, selectedYear]);

  // When user switches year (e.g. Y4 → Y5), pull the new year's chunks
  // in the background. `loadQBForYear` is idempotent — already-loaded
  // scopes are no-ops. New chunks merge into the same `_qbArr` so
  // existing closures over QB get the union next render.
  useEffect(() => {
    if (!qbReady) return;
    loadQBForYear(selectedYear).catch(() => {});
  }, [selectedYear, qbReady]);

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
  const [swUpdateReady, setSwUpdateReady] = useState(false);
  useEffect(() => {
    const handler = () => setSwUpdateReady(true);
    window.addEventListener('vmx-sw-update', handler);
    return () => window.removeEventListener('vmx-sw-update', handler);
  }, []);

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

  // Wrap setView in a View Transitions snapshot so navigating between
  // views fades smoothly (Chrome/Edge/Safari TP). No-op on Firefox.
  const setView = useCallback((next) => {
    withTransition(() => setViewRaw(next));
  }, []);

  // Imaging Practice Lab — open when the user navigates to #lab at
  // runtime (e.g. pastes the link in an already-open tab). The
  // initial-mount case is handled by the initialView IIFE above.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHash = () => {
      if (window.location.hash === '#lab') setView('lab');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [setView]);

  // Universal hash cleanup: whenever the active view moves AWAY from
  // 'lab', strip #lab from the URL bar so it doesn't lie to the user
  // about where they are. Earlier we only cleared hash on LabView's
  // own back button — but FAB→Lab→browser-back, Home logo click,
  // or any other setView('home') path was leaving #lab stuck in the
  // URL. This effect catches every such transition in one place.
  // replaceState doesn't fire hashchange so it won't loop back into
  // the onHash listener above.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (view !== 'lab' && window.location.hash === '#lab') {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, [view]);

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

  // In-flight exam state. Persisted to localStorage so an accidental
  // tab close, browser crash, or PWA force-quit during a long writing
  // session doesn't lose answers — restored when the user opens the
  // app again. Cleared on submit / goHome.
  const [questions, setQuestions] = useState(() => {
    // Phase 3: QB is lazy — share-link resolution moves to a useEffect
    // below that awaits loadQB(). Initial state falls through to the
    // in-flight resume path if present. The share-link case shows a
    // brief "กำลังเตรียมโจทย์..." in ExamView until the effect populates.
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).questions || [];
    } catch {}
    return [];
  });
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).answers || {};
    } catch {}
    return {};
  });
  const [currentIdx, setCurrentIdx] = useState(() => {
    try {
      const raw = window.localStorage?.getItem('vmx-inflight-exam');
      if (raw) return JSON.parse(raw).currentIdx || 0;
    } catch {}
    return 0;
  });

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

  const [numQuestions, setNumQuestions] = useState(10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQ, setTimePerQ] = useState(60);
  // 'all' (default) | 'mcq' (auto-graded only) | 'writing' (essay+short only)
  const [questionCategory, setQuestionCategory] = useState('all');
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStartTime, setExamStartTime] = useState(null);
  // Resume banner state — populated on boot if a stale in-flight exam
  // was detected. Lives in App so HomeView (and any future entry points)
  // can read + handle resume/dismiss without re-querying localStorage.
  const [pendingResume, setPendingResume] = useState(null);
  // Feedback prefill — populated when a contextual entry (e.g. scaffold
  // subject card) routes to feedback. FeedbackView reads it on mount,
  // then clears so a manual revisit isn't pre-stuffed with old context.
  const [feedbackPrefill, setFeedbackPrefill] = useState(null);

  const [theme, setTheme] = useLocalStorage('vmx-theme', 'light');
  // Color palette — overlays on top of theme to recolor accent vars
  // (sage / gold). 'default' uses the original sage+gold; alternatives:
  // ocean / plum / cherry / mono / forest. Stored in localStorage so
  // preference is per-device.
  const [palette, setPalette] = useLocalStorage('vmx-palette', 'default');
  const [bookmarks, setBookmarks] = useLocalStorage('vmx-bookmarks', []);
  const [history, setHistory] = useLocalStorage('vmx-history', []);
  const [notes, setNotes] = useLocalStorage('vmx-notes', {});
  const [srCards, setSrCards] = useLocalStorage('vmx-sr-cards', {});
  const [customQuestions, setCustomQuestions] = useLocalStorage('vmx-custom-q', []);
  const [streakData, setStreakData] = useLocalStorage('vmx-streak', { streak: 0, lastDate: null });
  const [readingChecklist, setReadingChecklist] = useLocalStorage('vmx-reading-checklist', {});

  // Google Fonts moved to index.html with media=print + onload swap so
  // they download in parallel with the HTML and don't block first paint.
  // Previously injected from a useEffect here, which fired AFTER first
  // paint and caused a brief unstyled flash on cold load.

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
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

  useEffect(() => {
    if (!user) return;
    pullUserData(user.id).then((data) => {
      if (!data) return;
      if (data.bookmarks?.length) setBookmarks(data.bookmarks);
      if (data.history?.length) setHistory(data.history);
      if (data.notes && Object.keys(data.notes).length) setNotes(data.notes);
      if (data.sr_cards && Object.keys(data.sr_cards).length) setSrCards(data.sr_cards);
      if (data.custom_questions?.length) setCustomQuestions(data.custom_questions);
      if (data.streak_data?.lastDate) setStreakData(data.streak_data);
      // reading_checklist: pulled if the Supabase column exists; harmless
      // when it doesn't (data.reading_checklist is just undefined).
      if (data.reading_checklist && Object.keys(data.reading_checklist).length) setReadingChecklist(data.reading_checklist);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // NOTE: reading_checklist intentionally excluded from cloud push for
    // now — the user_data table in supabase-schema.sql doesn't include
    // that column yet, and including it would make the entire upsert
    // fail with "column not found", breaking ALL cloud sync for every
    // logged-in user. Add the column + uncomment the line below once
    // the migration runs:
    //   ALTER TABLE user_data ADD COLUMN reading_checklist JSONB DEFAULT '{}'::JSONB;
    pushUserDataDebounced(user.id, {
      bookmarks, history, notes, sr_cards: srCards,
      custom_questions: customQuestions, streak_data: streakData,
      // reading_checklist: readingChecklist,
    });
  }, [user, bookmarks, history, notes, srCards, customQuestions, streakData]);

  // QB is mutated in place when loadQB() resolves, so the same reference
  // grows from [] → 2,227 entries. Depend on `qbReady` so the memo
  // re-runs after the populate completes — without this, every consumer
  // closing over allQuestions would see the stale empty snapshot.
  const allQuestions = useMemo(() => [...QB, ...customQuestions], [customQuestions, qbReady]);

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
    if (questions.length > 0) return;
    let raw;
    try { raw = window.localStorage?.getItem('vmx-inflight-exam'); } catch {}
    if (!raw) return;
    let saved;
    try { saved = JSON.parse(raw); } catch { return; }
    if (!saved?.questions?.length) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on first mount
  }, []);

  // Handler triggered by the resume banner on HomeView.
  const resumePendingExam = useCallback(() => {
    let raw;
    try { raw = window.localStorage?.getItem('vmx-inflight-exam'); } catch {}
    if (!raw) { setPendingResume(null); return; }
    let saved;
    try { saved = JSON.parse(raw); } catch { setPendingResume(null); return; }
    if (!saved?.questions?.length) { setPendingResume(null); return; }
    setQuestions(saved.questions);
    setAnswers(saved.answers || {});
    setCurrentIdx(saved.currentIdx || 0);
    setPendingResume(null);
    setView('exam');
  }, []);

  const dismissPendingExam = useCallback(() => {
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
    setQuestions([]);
    setAnswers({});
    setCurrentIdx(0);
    setPendingResume(null);
  }, []);

  // Shadow-start the exam when entering via a share-link (?qset=).
  // The normal startExam() flow seeds timeLeft + examStartTime, but a
  // share-link bootstraps directly into view='exam' with the default
  // timeLeft=0, which would trip the timer's "time-up" branch and
  // auto-finish on a 1-Q quiz. This effect fills the gap exactly once
  // per fresh-entry per question set.
  useEffect(() => {
    if (view !== 'exam') return;
    if (questions.length === 0) return;
    if (examStartTime !== null) return;
    setExamStartTime(Date.now());
    setTimeLeft(timeForQuestion(questions[currentIdx], timePerQ));
  }, [view, questions, currentIdx, timePerQ, examStartTime]);

  useEffect(() => {
    if (view !== 'exam' || !useTimer) return;
    // Guard against 0-length question set — happens when a shared
    // ?qset= URL references Q ids that no longer exist in QB. Without
    // this, the time-up branch immediately fires finishExam and the
    // user lands on a 0/0 results screen with no warning. Bail early
    // so the empty-state UI in ExamView's parent can show instead.
    if (questions.length === 0) return;
    // Don't auto-tick until the shadow-start effect above has primed
    // the clock. Otherwise the very first render sees timeLeft=0 and
    // immediately fires finishExam on single-Q exams.
    if (examStartTime === null) return;
    if (timeLeft <= 0) {
      if (currentIdx < questions.length - 1) {
        const next = questions[currentIdx + 1];
        setCurrentIdx((i) => i + 1);
        setTimeLeft(timeForQuestion(next, timePerQ));
      } else finishExam();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- finishExam intentionally not depended on
  }, [timeLeft, view, useTimer, currentIdx, questions, timePerQ]);

  // Global ⌘K / Ctrl+K — open Command Palette anywhere in the app.
  // Mounted as its own effect so it stays active across all views
  // (including 'exam') without conflicting with exam-only shortcuts.
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (view !== 'exam') return;
      // Don't fire exam shortcuts while command palette is open
      if (paletteOpen) return;
      const q = questions[currentIdx];
      if (!q) return;
      if (q.type === 'mcq' && ['1', '2', '3', '4'].includes(e.key)) answerCurrent(parseInt(e.key) - 1);
      else if (q.type === 'tf') {
        if (e.key === 't' || e.key === 'T') answerCurrent(true);
        if (e.key === 'f' || e.key === 'F') answerCurrent(false);
      }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); nextQ(); }
      if (e.key === 'ArrowLeft') prevQ();
      if (e.key === 'ArrowRight') nextQ();
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
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      if (t.isContentEditable) return;
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
        if (view === 'exam') nextQ();
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
    // Q ID collisions exist across subjects (com4↔engprof, com3↔exotic etc).
    // Use compound (subject:id) lookup to avoid stat leakage. Pre-build a
    // map once per pass instead of O(n) Array.find per history entry.
    const qByCompound = new Map();
    for (const q of allQuestions) qByCompound.set(q.subject + ':' + q.id, q);
    history.forEach((h) => {
      const q = qByCompound.get((h.subject || '') + ':' + h.questionId)
        || allQuestions.find((x) => x.id === h.questionId); // fallback for legacy history without subject
      if (!q) return;
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
    const overallPct = history.length ? Math.round((totalCorrect / history.length) * 100) : 0;
    return { bySubject, weakTags, weakQuestions, totalAttempts: history.length, overallPct };
  }, [history, allQuestions]);

  // startExam accepts an optional `overrides` object so a caller (like the
  // 1-click "ฝึก 1 ข้อด่วน" from HomeView) can bypass React's async state
  // batching. Without overrides, the function reads from current React
  // state — preserves the original ConfigView "click เริ่มฝึก" flow.
  // Use `'key' in overrides` so callers can explicitly pass null (e.g.,
  // topic: null means "no topic filter"); `??` would default null back
  // to the state value.
  const startExam = async (overrides = {}) => {
    const _practiceMode = 'practiceMode' in overrides ? overrides.practiceMode : practiceMode;
    const _subject = 'subject' in overrides ? overrides.subject : subject;
    const _topic = 'topic' in overrides ? overrides.topic : topic;
    const _questionCategory = 'questionCategory' in overrides ? overrides.questionCategory : questionCategory;
    const _numQuestions = 'numQuestions' in overrides ? overrides.numQuestions : numQuestions;
    const _useTimer = 'useTimer' in overrides ? overrides.useTimer : useTimer;
    const _timePerQ = 'timePerQ' in overrides ? overrides.timePerQ : timePerQ;

    // Phase 3: QB lazy. App.jsx kicks off background load on mount so
    // by the time the user clicks "Start" this usually resolves
    // instantly. The await is here as a safety net — if the user is
    // very quick OR background-load is slow (cold cache, slow network)
    // we hold here until QB is populated rather than starting an exam
    // against an empty pool.
    if (!isQBLoaded()) {
      try {
        await loadQB();
      } catch (err) {
        alert('โหลดคลังโจทย์ไม่ได้ — ตรวจการเชื่อมต่อแล้วลองใหม่');
        return;
      }
    }

    // Year-scoping: when subject is 'all' (cross-subject random), constrain
    // to the year the user is currently studying so the QB feels coherent
    // with the year/phase pill in the header. Subject-specific picks are
    // implicitly year-scoped via the subject's curriculum entry, so no
    // additional filter needed for those. Bookmarks/weak/wrong are user-
    // curated pools — the user *chose* those Qs, so they stay cross-year
    // (matches the original intent in the comment, NOT the previous code
    // which over-filtered all modes through yearScope unconditionally).
    //
    // Palm bug 2026-05-20: "ไม่มีข้อสอบในหมวดนี้" was firing on
    // "🎯 ทบทวนข้อที่ตอบผิด" because the user's wrong-answer history
    // could be from a year other than `selectedYear` (e.g. VCA year=5
    // wrongs while studying Y4), so yearScope evicted everything.
    const isUserCuratedPool = (
      _practiceMode === 'bookmarks' ||
      _practiceMode === 'weak' ||
      _practiceMode === 'wrong'
    );
    const yearScope = (qs) => {
      if (isUserCuratedPool) return qs; // user-curated, cross-year on purpose
      if (_subject && _subject !== 'all') return qs; // subject implies year
      // Lenient: keep Qs with no year tag (treat as belonging to whatever
      // year the user is in). Hardens against legacy/custom Qs that
      // pre-date the year-tagging migration.
      return qs.filter((q) => q.year == null || q.year === selectedYear);
    };

    let pool;
    if (_practiceMode === 'bookmarks') pool = allQuestions.filter((q) => bookmarks.includes(q.id));
    else if (_practiceMode === 'weak') pool = allQuestions.filter((q) => analytics?.weakQuestions.includes(q.id));
    else if (_practiceMode === 'wrong') {
      // Cross-subject "review wrong" — uses history with compound (subject:id)
      // keying so dupe IDs across subjects don't leak. Pool is everything the
      // user has answered incorrectly at least once. No grading ratio threshold.
      const wrongSet = new Set();
      for (const h of (history || [])) {
        if (h && h.correct === false) wrongSet.add((h.subject || '') + ':' + h.questionId);
      }
      pool = allQuestions.filter((q) => wrongSet.has(q.subject + ':' + q.id));
    }
    else {
      pool = _subject === 'all' ? allQuestions : allQuestions.filter((q) => q.subject === _subject);
      if (_topic) {
        // Collection IDs (prefix `_<name>-all`) bundle multiple topics by
        // a shared topic prefix — used for "รวมหมาหอน" / "รวม Term Paper"
        // in repro-lect. Resolved here before exact-match filtering.
        if (_topic.startsWith('_') && _topic.endsWith('-all')) {
          const collectionId = _topic.slice(1, -4); // '_mahahon-all' -> 'mahahon'
          const subj = SUBJECTS.find((s) => s.id === _subject);
          const coll = subj?.collections?.find((c) => c.id === _topic);
          if (coll?.topicPrefix) {
            pool = pool.filter((q) => q.topic?.startsWith(coll.topicPrefix));
          } else {
            pool = pool.filter((q) => q.topic?.startsWith(collectionId));
          }
        } else {
          // Specific topic chosen — show all Qs of that topic (incl. hidden topics
          // are reachable only via direct deep link, never auto-suggested).
          pool = pool.filter((q) => q.topic === _topic);
        }
      } else if (_subject !== 'all') {
        // "ทำรวม" mode for one subject: exclude hidden-topic Qs (uncertain-scope,
        // midterm leftovers, etc.) so users get only Final-scope content.
        const hidden = hiddenTopicIdsFor(_subject);
        if (hidden.size) pool = pool.filter((q) => !hidden.has(q.topic));
      } else {
        // subject === 'all': filter hidden across every subject.
        pool = pool.filter((q) => {
          const hidden = hiddenTopicIdsFor(q.subject);
          return !hidden.has(q.topic);
        });
      }
    }

    // Apply year-scope filter (no-op when subject is non-'all' — see comment above)
    pool = yearScope(pool);

    // Apply question-category filter so users can split MCQ vs Writing
    if (_questionCategory === 'mcq') pool = pool.filter((q) => catOf(q) === 'mcq');
    else if (_questionCategory === 'writing') pool = pool.filter((q) => catOf(q) === 'writing');

    if (!pool.length) {
      alert(_questionCategory === 'writing'
        ? 'ยังไม่มีข้อ Writing ในหมวดนี้ — ลองเปลี่ยนเป็น MCQ หรือ "ทุกประเภท"'
        : 'ไม่มีข้อสอบในหมวดนี้');
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

    setQuestions(picked); setAnswers({}); setCurrentIdx(0); setTimeLeft(firstTime);
    setExamStartTime(Date.now());
    setView('exam');

    const newStreak = updateStreak(streakData.lastDate, streakData.streak, streakData.freezeUsedAt);
    setStreakData(newStreak);
    // Streak-freeze used → flash a one-time toast so the user knows
    // their streak survived a skipped day. (UI surface in HomeView.)
    if (newStreak.freezeJustUsed) {
      try { window.dispatchEvent(new CustomEvent('vmx-streak-freeze-used', { detail: newStreak.streak })); } catch {}
    }
  };

  const finishExam = async () => {
    // Only count auto-graded questions in history/percentage —
    // writing Qs need self/AI grading and shouldn't penalize the
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

  const toggleBookmark = (qId) => setBookmarks((bk) => bk.includes(qId) ? bk.filter((x) => x !== qId) : [...bk, qId]);
  const setNote = (qId, text) => {
    if (text.trim()) setNotes({ ...notes, [qId]: text });
    else { const { [qId]: _, ...rest } = notes; setNotes(rest); }
  };

  const score = useMemo(() => {
    // Split auto-graded vs writing for honest score reporting.
    // Writing questions are open-ended → counted separately so the
    // percentage reflects only what the engine could grade. Writing
    // gets graded in Review (Self assess or 🤖 Smart AI grade).
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

  const answerCurrent = useCallback((val) => setAnswers((p) => ({ ...p, [questions[currentIdx].id]: val })), [questions, currentIdx]);
  const nextQ = useCallback(() => {
    const cur = questions[currentIdx];
    // Confirm before skipping a blank short/essay — these take real
    // effort so accidental "Next →" clicks shouldn't lose them
    if (cur && isWritingType(cur)) {
      const ua = answers[cur.id];
      const isBlank = !ua || (typeof ua === 'string' && !ua.trim());
      const isLast = currentIdx === questions.length - 1;
      if (isBlank) {
        const msg = isLast
          ? 'ยังไม่ได้เขียนข้อนี้ — ส่งข้อสอบเลยจริงๆ?'
          : 'ยังไม่ได้เขียนคำตอบ — ข้ามไปข้อถัดไปเลย?';
        if (typeof window !== 'undefined' && !window.confirm(msg)) return;
      }
    }
    if (currentIdx < questions.length - 1) {
      const next = questions[currentIdx + 1];
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(timeForQuestion(next, timePerQ));
    } else finishExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- answers/finishExam read via closure
  }, [currentIdx, questions, timePerQ, answers]);
  const prevQ = useCallback(() => {
    // Use timeForQuestion so jumping back to an essay restores its
    // 25-min budget instead of shrinking it to the MCQ default
    if (currentIdx > 0) {
      const prev = questions[currentIdx - 1];
      setCurrentIdx(currentIdx - 1);
      setTimeLeft(timeForQuestion(prev, timePerQ));
    }
  }, [currentIdx, questions, timePerQ]);
  const jumpToQ = useCallback((idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIdx(idx);
      setTimeLeft(timeForQuestion(questions[idx], timePerQ));
    }
  }, [questions, timePerQ]);

  const goHome = () => {
    setView('home'); setQuestions([]); setAnswers({}); setCurrentIdx(0);
    setPracticeMode('all'); setMode('quick'); setActiveGroup(null); setTopic(null);
    // Reset exam clock so the next session's shadow-start (or
    // startExam) can prime timeLeft fresh without the previous
    // examStartTime value blocking re-init.
    setExamStartTime(null);
    setTimeLeft(0);
    // Clear in-flight exam state — user explicitly chose to leave
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
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

  const handleSignOut = async () => { if (confirm('Logout?')) { await signOut(); goHome(); } };

  // Replay an arbitrary slice of questions as a fresh exam round.
  // Used by ResultsView "redo wrong" — passes the wrong-only subset
  // back into setQuestions without going through startExam's pool
  // assembly. Mirrors the post-startExam state shape (answers={},
  // idx=0, view='exam', timer cleared) so ExamView mounts clean.
  const replayQuestions = useCallback((qs) => {
    if (!Array.isArray(qs) || qs.length === 0) return;
    // Same hygiene as goHome — drop in-flight markers + qset URL
    // before starting a new round so reload behaves predictably.
    try { window.localStorage?.removeItem('vmx-inflight-exam'); } catch {}
    setQuestions(qs);
    setAnswers({});
    setCurrentIdx(0);
    setUseTimer(false); // redo rounds never on a clock — focused review
    setExamStartTime(Date.now());
    setTimeLeft(0);
    setView('exam');
  }, []);

  const currentQ = questions[currentIdx];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  return (
    <>
      <style>{STYLES}</style>
      <TopLoadingBar />
      <div className="vmx-app">
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
          {(!networkOnline || networkJustChanged) && view !== 'offline-game' && view !== 'exam' && (
            <div
              role="status"
              aria-live="polite"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '8px 14px',
                marginBottom: 8,
                borderRadius: 8,
                fontSize: 13,
                background: networkOnline
                  ? 'rgba(74, 107, 74, 0.12)'
                  : 'rgba(184, 137, 64, 0.18)',
                color: networkOnline ? 'var(--clr-sage, #4a6b4a)' : 'var(--clr-gold, #b88940)',
              }}
            >
              <span>
                {networkOnline
                  ? '● กลับมาออนไลน์แล้ว — ข้อมูลจะ sync อัตโนมัติ'
                  : '● ออฟไลน์อยู่ — ใช้งานต่อได้ปกติ ข้อมูลที่บันทึกจะ sync เมื่อเน็ตกลับ'}
              </span>
              {!networkOnline && (
                <button
                  type="button"
                  onClick={() => setView('offline-game')}
                  className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    color: 'var(--clr-gold, #b88940)',
                    border: '1px solid currentColor',
                    background: 'transparent',
                    flexShrink: 0,
                  }}
                  aria-label="เล่นมินิเกมระหว่างรอเน็ตกลับ"
                >
                  🎮 เล่นเกม
                </button>
              )}
            </div>
          )}

          {/* New service-worker version installed — shown only when NOT in
              an exam (don't yank state mid-session). Reload only happens
              on user click, not auto-reload. */}
          {swUpdateReady && view !== 'exam' && (
            <div
              role="status"
              aria-live="polite"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '8px 14px',
                marginBottom: 8,
                borderRadius: 8,
                fontSize: 13,
                background: 'rgba(74, 107, 74, 0.12)',
                color: 'var(--clr-sage, #4a6b4a)',
                border: '1px solid var(--clr-sage, #4a6b4a)',
              }}
            >
              <span>✨ มีอัปเดตใหม่พร้อมแล้ว</span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  color: 'var(--clr-sage, #4a6b4a)',
                  border: '1px solid currentColor',
                  background: 'transparent',
                  flexShrink: 0,
                }}
              >
                🔄 รีเฟรช
              </button>
            </div>
          )}

          {/* Header — hidden on full-screen / focus views (exam in progress,
              results, review, auth) so user isn't tempted to navigate away
              mid-session and so the result/review pages don't have nav
              chrome competing with the data presentation.
              Also hidden on year-select to avoid a confusing logo→home
              click when the user hasn't picked a year yet. */}
          {!['exam', 'results', 'review', 'auth', 'year-select'].includes(view) && (
            <div className="vmx-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div className="vmx-logo" onClick={goHome}>Vet<span>Mock</span></div>
                {/* Year pill — visible on every page after pick, persistent
                    year context. Click → year-select. Hidden during the
                    first-time picker flow (selectedYearStored === null). */}
                {selectedYearStored !== null && view !== 'year-select' && (
                  <button
                    type="button"
                    onClick={() => setView('year-select')}
                    title="สลับชั้นปี"
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: 'var(--clr-surface)',
                      border: '1px solid var(--clr-border)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--clr-ink)',
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    🎓 ปี {selectedYear}
                    <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
                  </button>
                )}
                {/* Phase pill — separate from year so user can switch phase
                    without losing year context. Hidden if no phase set
                    (e.g. Y6 block-based) or on the picker views themselves. */}
                {selectedPhase && view !== 'phase-select' && view !== 'year-select' && (
                  <button
                    type="button"
                    onClick={() => setView('phase-select')}
                    title="สลับ phase สอบ"
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: 'var(--clr-surface)',
                      border: '1px solid var(--clr-border)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--clr-ink)',
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {(() => {
                      const map = { '1-mid':'📚 ทม.1 กลาง', '1-final':'🎯 ทม.1 ปลาย', '2-mid':'📖 ทม.2 กลาง', '2-final':'🏁 ทม.2 ปลาย' };
                      return map[selectedPhase] || selectedPhase;
                    })()}
                    <span style={{ opacity: 0.5, fontSize: 10 }}>▾</span>
                  </button>
                )}
              </div>
              <div className="vmx-header-right">
                <button
                  className="vmx-cmdk-btn"
                  onClick={() => setPaletteOpen(true)}
                  title="Quick search (⌘K / Ctrl+K)"
                  aria-label="เปิด command palette"
                >
                  <span style={{ fontSize: 13 }}>🔍</span>
                  <kbd className="vmx-cmdk-kbd">⌘K</kbd>
                </button>
                {/* Quick-access icons — bookmarks + analytics. Hidden on
                    small screens via inline @media query won't work in JSX,
                    so just rely on flex-wrap to drop them to next row. */}
                <button
                  className="vmx-theme-btn vmx-header-secondary"
                  onClick={() => setView('dashboard')}
                  title="Analytics, ดูสถิติ + ประวัติ"
                  aria-label="Analytics"
                >📊</button>
                <button
                  className="vmx-theme-btn vmx-header-secondary"
                  onClick={() => {
                    if (bookmarks.length === 0) return;
                    setPracticeMode('bookmarks');
                    setMode('quick');
                    setView('config');
                  }}
                  disabled={bookmarks.length === 0}
                  title={bookmarks.length === 0 ? 'ยังไม่มีข้อที่บันทึก' : `Bookmarks, ทำ ${bookmarks.length} ข้อที่บันทึก`}
                  aria-label="Bookmarks"
                  style={{
                    position: 'relative',
                    opacity: bookmarks.length === 0 ? 0.45 : 1,
                    cursor: bookmarks.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  🔖
                  {bookmarks.length > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      minWidth: 16,
                      height: 16,
                      padding: '0 4px',
                      borderRadius: 8,
                      background: 'var(--clr-rose)',
                      color: 'white',
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono, monospace',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}>{bookmarks.length}</span>
                  )}
                </button>
                {streakData.streak > 0 && <div className="vmx-streak">🔥 {streakData.streak}</div>}
                {/* XP chip — Lv N · XXX XP · thin progress bar. Lazy because
                    the gamification isn't critical for first paint. */}
                <Suspense fallback={null}>
                  <XpChip />
                </Suspense>
                {user && profile && (
                  <UserMenu profile={profile} onLogout={handleSignOut} onGroups={() => setView('groups')} onLeaderboard={() => setView('leaderboard-global')} />
                )}
                {!user && hasSupabase && (
                  <button className="vmx-btn vmx-btn-ghost vmx-btn-sm" onClick={() => setView('auth')}>Login</button>
                )}
                <ThemePicker theme={theme} setTheme={setTheme} palette={palette} setPalette={setPalette} />

              </div>
            </div>
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
                background: 'linear-gradient(135deg, rgba(184, 137, 64, 0.10), rgba(217, 119, 68, 0.08))',
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
                  ? <> · ผู้ส่งได้ <strong>{challengeSender.senderScore.correct}/{challengeSender.senderScore.total}</strong>
                    {Number.isFinite(challengeSender.senderTimeSec) && challengeSender.senderTimeSec > 0
                      ? <> ใน <strong>{Math.floor(challengeSender.senderTimeSec / 60)}:{String(Math.floor(challengeSender.senderTimeSec % 60)).padStart(2, '0')}</strong></>
                      : null}
                    {' '}— ลองว่าคุณได้เท่าไหร่</>
                  : <> · ลองทำชุดเดียวกัน</>}
              </div>
            </div>
          )}
          {/* Palm a11y audit 2026-05-20: add `<main>` landmark so screen
              readers can jump past the header chrome to the active view.
              Skip-link below the header lets keyboard users do the same. */}
          <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
          {authLoading ? <div className="vmx-empty">กำลังโหลด...</div> : (
            <ErrorBoundary onReset={goHome} key={view}>
            <Suspense fallback={<ViewFallback />}>
              {view === 'home' && <HomeView {...{ setView, setMode, setSubject, setTopic, setPracticeMode, setNumQuestions, setUseTimer, setTimePerQ, startExam, replayQuestions, cardStats, bookmarks, customQuestions, user, profile, readingChecklist, onlineCount, onlineStatus, selectedYear, setSelectedYear, selectedPhase, setSelectedPhase, pendingResume, resumePendingExam, dismissPendingExam, history, setFeedbackPrefill, buddies }} />}
              {view === 'auth' && hasSupabase && <AuthView onBack={goHome} onSuccess={goHome} user={user} />}
              {view === 'groups' && user && <GroupsView {...{ user, profile, goHome, setActiveGroup, setView }} />}
              {view === 'group-detail' && user && activeGroup && <GroupDetailView {...{ group: activeGroup, user, goBack: () => setView('groups') }} />}
              {view === 'leaderboard-global' && user && <LeaderboardView {...{ user, goHome, selectedYear }} />}
              {view === 'subject-select' && <SubjectSelectView {...{ setSubject, setTopic, setView, setPracticeMode, goHome, mode, customQuestions, selectedYear }} />}
              {view === 'topic-select' && <TopicSelectView {...{ subject, setSubject, setTopic, setView, goHome, mode, setMode, setNumQuestions, setUseTimer, setTimePerQ, customQuestions, readingChecklist }} />}
              {view === 'notes' && <NotesView subject={subject || 'com5'} initialTopic={topic} goBack={() => setView('topic-select')} goHome={goHome} />}
              {view === 'config' && <ConfigView {...{ practiceMode, subject, topic, numQuestions, setNumQuestions, useTimer, setUseTimer, timePerQ, setTimePerQ, questionCategory, setQuestionCategory, startExam, goHome, mode, selectedYear, selectedPhase }} />}
              {view === 'exam' && currentQ && <ExamView {...{ currentQ, currentIdx, questions, timeLeft, useTimer, isBookmarked, toggleBookmark, currentAnswer, answerCurrent, nextQ, prevQ, jumpToQ, notes, setNote, answers, bookmarks, buddies, user, goHome, selectedYear, selectedPhase }} />}
              {view === 'results' && <ResultsView {...{ score, questions, answers, goHome, setView, mode, selectedYear, selectedPhase, startExam, setSubject, setTopic, setPracticeMode, setMode, setNumQuestions, setUseTimer, replayQuestions, challengeSender, examStartTime }} />}
              {view === 'review' && <ReviewView {...{ questions, answers, bookmarks, toggleBookmark, goHome, setView, notes, user, selectedYear, selectedPhase }} />}
              {view === 'sr-session' && <SRSessionView {...{ srCards, setSrCards, goHome, customQuestions, selectedYear, selectedPhase }} />}
              {view === 'dashboard' && <DashboardView {...{ analytics, bookmarks, setHistory, setBookmarks, setSrCards, setNotes, setCustomQuestions, setStreakData, setPracticeMode, setView, setMode, history, notes, srCards, streak: streakData.streak, customQuestions, selectedYear, selectedPhase }} />}
              {view === 'question-manager' && <QuestionManagerView {...{ customQuestions, setCustomQuestions, goHome, selectedYear }} />}
              {view === 'schedule' && <ScheduleView {...{ goHome, setSubject, setMode, setView, setPracticeMode, selectedYear, selectedPhase }} />}
              {view === 'scores' && <ScoresView {...{ goHome }} />}
              {view === 'videos' && <VideoView {...{ goHome }} />}
              {view === 'about' && <AboutView {...{ goHome, setView }} />}
              {view === 'feedback' && <FeedbackView {...{ goHome, user, profile, prefill: feedbackPrefill, clearPrefill: () => setFeedbackPrefill(null) }} />}
              {view === 'ig-cards' && <IgCardStudioView {...{ goHome }} />}
              {view === 'year-select' && <YearSelectView {...{ goHome, selectedYear, setSelectedYear, setSelectedPhase, setView, firstTime: selectedYearStored === null }} />}
              {view === 'phase-select' && <PhaseSelectView {...{ goHome, selectedYear, selectedPhase, setSelectedPhase, setView }} />}
              {view === 'reading-checklist' && <ReadingChecklistView {...{ selectedYear, readingChecklist, setReadingChecklist, goHome, goBack: () => setView('home'), setSubject, setView }} />}
              {view === 'faculty' && <FacultyView {...{ goHome }} />}
              {view === 'account-settings' && user && <AccountSettingsView {...{ user, goHome, onSignedOut: goHome }} />}
              {view === 'offline-game' && <OfflineGameView goBack={goHome} online={networkOnline} />}
              {view === 'pomodoro' && <PomodoroView goHome={goHome} />}
              {view === 'race' && <RaceView goHome={goHome} setView={setView} user={user} profile={profile} />}
              {view === 'lab' && <LabView goHome={goHome} />}
              {view === 'pdf-annotate' && <PdfAnnotateView goHome={goHome} />}
              {view === 'pinboard' && <PinboardView {...{ goHome, setView, setSubject, setPracticeMode, selectedYear, selectedPhase }} />}
              {view === 'image-occlusion' && <ImageOcclusionView {...{ goHome, setView }} />}
              {view === 'phase-wrapped' && <PhaseWrappedView {...{ goHome, history, srCards, bookmarks, customQuestions }} />}
              {view === 'contribute' && <ContributeView {...{ goHome, setView, user, selectedYear }} />}
              {view === 'review-queue' && <ReviewQueueView {...{ goHome, setView, user }} />}
            </Suspense>
            </ErrorBoundary>
          )}
          </main>

          {/* Footer — two visual rows on mobile so a single long line
              doesn't wrap mid-link. Row 1: brand line. Row 2: utility
              links separated by ·, gap-flexed so they wrap as chips
              rather than a comma-soup. Dropped raw version "v5.0"
              (dev metadata; not user-facing). */}
          <div className="vmx-footer">
            <div style={{ marginBottom: 6 }}>
              made with ♡ by <strong>Vet 86</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', justifyContent: 'center' }}>
              <a onClick={() => setView('about')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>About</a>
              <a href="/blog/" style={{ textDecoration: 'underline' }}>บทความ</a>
              <a href="https://www.instagram.com/vetmock.cu/" target="_blank" rel="noopener noreferrer" title="ติดตามบน Instagram @vetmock.cu" style={{ textDecoration: 'underline' }}>📷 @vetmock.cu</a>
              <a onClick={() => setView('feedback')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>แจ้งปัญหา</a>
              <a onClick={() => setView('offline-game')} style={{ cursor: 'pointer', textDecoration: 'underline' }} title="เกมเล็ก ๆ — ลูกไก่หนีเชื้อโรค">🐤 มินิเกม</a>
            </div>
            {/* Ecosystem cross-links · sister sites in the Vet 86 ecosystem.
                Helps Google + users discover the network (CUVETSMO = student
                council, Hanong = stray welfare). VetMock is the most-trafficked
                of the three so this link gives the newer sites a fast lane
                through Googlebot's existing crawl schedule. */}
            <div style={{ marginTop: 8, fontSize: 11, color: '#888', display: 'flex', flexWrap: 'wrap', gap: '4px 12px', justifyContent: 'center' }}>
              <span>เครือข่าย Vet 86:</span>
              <a href="https://cuvetsmo.com" target="_blank" rel="noopener noreferrer" title="สโมสรนิสิตสัตวแพทย์ จุฬาฯ" style={{ textDecoration: 'underline', color: '#666' }}>🐾 CUVETSMO · สโมสรนิสิตสัตวแพทย์ จุฬาฯ</a>
              <a href="https://hanong.vercel.app" target="_blank" rel="noopener noreferrer" title="Hanong — stray welfare platform" style={{ textDecoration: 'underline', color: '#666' }}>🐕 Hanong · หาน้อง</a>
              {/* Internal link — same-origin hash route. Same window. */}
              <a
                onClick={(e) => { e.preventDefault(); setView('lab'); if (window.location.hash !== '#lab') window.location.hash = '#lab'; }}
                href="#lab"
                title="Imaging Practice Lab — ฝึกอ่าน X-ray + DICOM viewer (Experimental)"
                style={{ textDecoration: 'underline', color: '#666', cursor: 'pointer' }}
              >🔬 Imaging Lab · ฝึกอ่าน X-ray (Experimental)</a>
            </div>
          </div>

          {/* Floating clinical-math FAB — visible on every view except
              auth (we want to nudge users to log in, not show them tools
              first) and during an active exam (don't tempt them with the
              calculator UI mid-question — exam already shows wake lock).
              Rendered eagerly so the button is on first paint. */}
          {/* VetCalculator lives in the tree (modal + listener) but
              renders no FAB of its own — ToolsFAB drives opening via
              a window event. */}
          {view !== 'auth' && view !== 'exam' && <VetCalculator showFab={false} />}

          {/* Unified ToolsFAB — one button bottom-right that fans out
              into the calculator + sketchpad. Replaces what used to be
              two stacked floats. Hidden during exam/auth like before. */}
          {view !== 'auth' && view !== 'exam' && (
            <ToolsFAB
              onSketch={() => setSketchOpen(true)}
              onLab={() => {
                if (window.location.hash !== '#lab') window.location.hash = '#lab';
                setView('lab');
              }}
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
          stay on. No PII; Vercel-side aggregation. Both no-op in dev. */}
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </>
  );
}

// ============================================================
// UserMenu — profile pill with click-outside dropdown
// ============================================================
function UserMenu({ profile, onLogout, onGroups, onLeaderboard }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px 6px 6px', borderRadius: 999,
          background: open ? 'var(--clr-surface-2)' : 'var(--clr-surface)',
          border: '1px solid var(--clr-border)',
          fontSize: 13, fontWeight: 600,
          color: 'var(--clr-ink)',
          transition: 'background 0.12s',
        }}
      >
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--clr-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          {profile.avatar_emoji || '🐾'}
        </span>
        <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {profile.username}
        </span>
        <span style={{ fontSize: 10, color: 'var(--clr-ink-soft)' }}>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div role="menu" style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
          borderRadius: 12, boxShadow: 'var(--shadow-md)',
          minWidth: 200, padding: 6, zIndex: 20,
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--clr-border)', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--clr-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Signed in as
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
              {profile.avatar_emoji || '🐾'} {profile.username}
            </div>
          </div>
          {onGroups && (
            <MenuItem icon="👥" onClick={() => { setOpen(false); onGroups(); }}>Study Groups</MenuItem>
          )}
          {onLeaderboard && (
            <MenuItem icon="🏆" onClick={() => { setOpen(false); onLeaderboard(); }}>Leaderboard</MenuItem>
          )}
          <div style={{ height: 1, background: 'var(--clr-border)', margin: '4px 0' }} />
          <MenuItem icon="⎋" danger onClick={() => {
            setOpen(false);
            if (confirm('ออกจากระบบ?')) onLogout();
          }}>ออกจากระบบ (Logout)</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, danger }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', boxSizing: 'border-box', padding: '8px 12px',
        borderRadius: 8, fontSize: 13,
        color: danger ? 'var(--clr-rose)' : 'var(--clr-ink)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--clr-surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{children}</span>
    </button>
  );
}
