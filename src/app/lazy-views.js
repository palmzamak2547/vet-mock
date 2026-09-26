// ============================================================
// lazy-views.js — App's lazy screens, and the idle warm-up of the next ones
// ============================================================
// Moved out of App.jsx unchanged apart from `export` and the import paths,
// which now start from src/app/. Each import() names the same module as
// before, and a lazy chunk is named after that module (HomeView-<hash>.js),
// not after the file holding the import(), so the build emits the chunks it
// always did. tests/unit/boot-weight.test.mjs holds every declaration here
// to that: each resolves to a file loaded lazily and never statically.
// ============================================================

import { lazy, useEffect } from 'react';
import { hasSavedSession } from '../lib/supabase.js';

// Lazy — HomeView is 1300+ lines and pulls curriculum.js + changelog.
// Splitting it shaves ~80KB off the initial bundle. We prefetch it on
// idle below so navigation feels instant even on first cold load.
export const HomeView = lazy(() => import('../views/HomeView.jsx'));

// Lazy — pulls VIDEO_SUMMARIES (~200KB) into a separate chunk so it
// only ships when the user actually presses ⌘K (or clicks the search
// button). Keeps the first-paint bundle small.
export const CommandPalette = lazy(() => import('../components/CommandPalette.jsx'));

// InstructorModal — also lazy. Opens when an instructor is selected
// from the palette or from a topic card.
export const InstructorModal = lazy(() => import('../components/InstructorModal.jsx'));
// VoiceSettings — sliders for TTS pace + pause defaults. Lazy because
// most sessions never tweak voice — keep the main bundle slim.
export const VoiceSettings = lazy(() => import('../components/VoiceSettings.jsx'));

// Sketchpad — opens a blank canvas for free-form drawing/diagrams.
// Lazy because it includes canvas + image processing only used when
// the user opens the pad.
export const ImageAnnotator = lazy(() => import('../components/ImageAnnotator.jsx'));

// VetMock's practical Imaging Lab intentionally stays separate from the
// full CUVETSMO imaging workstation. Keep it lazy: the Cornerstone/DICOM
// stack is only downloaded when a learner opens #lab.
export const LabView = lazy(() => import('../views/LabView.jsx'));
export const WrapUpView = lazy(() => import('../views/WrapUpView.jsx'));
export const AtlasView = lazy(() => import('../views/AtlasView.jsx'));

// PinboardView — personal pin grid (Qs / summaries / flashcards /
// notes). Lazy because most sessions never open it.
export const PinboardView = lazy(() => import('../views/PinboardView.jsx'));
export const ContributeView = lazy(() => import('../views/ContributeView.jsx'));
export const ReviewQueueView = lazy(() => import('../views/ReviewQueueView.jsx'));

// BenchView — the screening-test bench. Self-contained and rarely the first
// screen of a session, so it stays out of the main bundle.
export const BenchView = lazy(() => import('../views/BenchView.jsx'));

// AdminView — the back-office. One account ever sees it, so its code stays
// out of everyone else's bundle.
export const AdminView = lazy(() => import('../views/AdminView.jsx'));

// HighlightToCard — listens for text selections inside
// .vmx-summary-body (SummaryModal content) and offers a floating
// "✨ ทำ flashcard" button that opens a save modal. Lazy because
// users only need it when reading a video summary.
export const HighlightToCard = lazy(() => import('../components/HighlightToCard.jsx'));

// ShortcutSheet — Linear-style "press ? for keyboard help" modal.
// Tiny, but only opened on `?` press from exam/review, so lazy keeps
// it out of the first-paint bundle.
export const ShortcutSheet = lazy(() => import('../components/ShortcutSheet.jsx'));
export const OnboardingTour = lazy(() => import('../components/OnboardingTour.jsx'));

// Lazy — pulled in only when the user navigates to that view.
// Big wins on cold load (esp. iPad / mobile Safari) since NotesView,
// VideoView, GroupsView etc. ship their own chunks.
export const SubjectSelectView = lazy(() => import('../views/SubjectSelectView.jsx'));
export const ConfigView = lazy(() => import('../views/ConfigView.jsx'));
export const ExamView = lazy(() => import('../views/ExamView.jsx'));
export const ResultsView = lazy(() => import('../views/ResultsView.jsx'));
export const ReviewView = lazy(() => import('../views/ReviewView.jsx'));
export const SRSessionView = lazy(() => import('../views/SRSessionView.jsx'));
export const DashboardView = lazy(() => import('../views/DashboardView.jsx'));
export const QuestionManagerView = lazy(() => import('../views/QuestionManagerView.jsx'));
export const AuthView = lazy(() => import('../views/AuthView.jsx'));
export const GroupsView = lazy(() => import('../views/GroupsView.jsx'));
export const GroupDetailView = lazy(() => import('../views/GroupDetailView.jsx'));
export const LeaderboardView = lazy(() => import('../views/LeaderboardView.jsx'));
export const ScheduleView = lazy(() => import('../views/ScheduleView.jsx'));
export const ScoresView = lazy(() => import('../views/ScoresView.jsx'));
export const VideoView = lazy(() => import('../views/VideoView.jsx'));
export const AboutView = lazy(() => import('../views/AboutView.jsx'));
export const FeedbackView = lazy(() => import('../views/FeedbackView.jsx'));
export const IgCardStudioView = lazy(() => import('../views/IgCardStudioView.jsx'));
export const YearSelectView = lazy(() => import('../views/YearSelectView.jsx'));
// Marketing landing — signed-out front door. Full-bleed (own nav/footer),
// so it early-returns before the app chrome. Own scoped CSS.
export const LandingView = lazy(() => import('../views/LandingView.jsx'));
export const PhaseSelectView = lazy(() => import('../views/PhaseSelectView.jsx'));
export const TopicSelectView = lazy(() => import('../views/TopicSelectView.jsx'));
export const NotesView = lazy(() => import('../views/NotesView.jsx'));
export const LibraryView = lazy(() => import('../views/LibraryView.jsx'));
export const KnowledgeView = lazy(() => import('../views/KnowledgeView.jsx'));
export const ReadingChecklistView = lazy(() => import('../views/ReadingChecklistView.jsx'));
export const FacultyView = lazy(() => import('../views/FacultyView.jsx'));
export const PrivacyView = lazy(() => import('../views/PrivacyView.jsx'));
export const AccountSettingsView = lazy(() => import('../views/AccountSettingsView.jsx'));
export const OfflineGameView = lazy(() => import('../views/OfflineGameView.jsx'));
export const MochiView = lazy(() => import('../views/MochiView.jsx'));
// PomodoroView — Forest-style focus timer with a hatching-chick companion.
// Lazy: only loaded when the user opens it from the command palette.
export const PomodoroView = lazy(() => import('../views/PomodoroView.jsx'));
export const RaceView = lazy(() => import('../views/RaceView.jsx'));
// PdfAnnotateView — lazy because pdfjs-dist is heavy (~1 MB) and only
// needed when the user opens "PDF + annotate" from the command palette.
// Worker chunk is dynamically imported inside the view itself.
export const PdfAnnotateView = lazy(() => import('../views/PdfAnnotateView.jsx'));
export const ImageOcclusionView = lazy(() => import('../views/ImageOcclusionView.jsx'));
// PhaseWrappedView — end-of-phase recap (Spotify-Wrapped style).
// Only shown after a phase ends or opened via command palette,
// so lazy-load is appropriate.
export const PhaseWrappedView = lazy(() => import('../views/PhaseWrappedView.jsx'));
// (Removed MockExamView/MockResultsView — an unwired English "DEMO ONLY" stub.
//  "Mock Exam" nav now routes into the real config → exam engine. 2026-07-24)

export function useIdlePrefetch() {
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
    // A visitor who asked their browser to save data gets nothing they did
    // not tap for. The chunks still load on demand, one tap later.
    if (navigator.connection?.saveData) return;
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cic = window.cancelIdleCallback || clearTimeout;
    const id = ric(() => {
      // Conditions can change while waiting for idle. Avoid caching failed
      // imports for screens the student has not requested while offline.
      if (navigator.onLine === false || navigator.connection?.saveData) return;
      // HomeView itself first — landing page for nearly every session,
      // so prefetch it the moment we're idle. (Even if `initialView` is
      // 'year-select', we'll be on home within ~3 seconds anyway.)
      import('../views/HomeView.jsx').catch(() => {});
      // Most-common next steps from home
      import('../views/SubjectSelectView.jsx').catch(() => {});
      import('../views/ConfigView.jsx').catch(() => {});
      import('../views/ScheduleView.jsx').catch(() => {});
      // FacultyView is not on this list on purpose: it carries the whole
      // instructor directory (~330 KB, ~75 KB gzipped), which is exactly
      // the kind of chunk this prefetch exists to keep off the boot path.
      // It loads on demand, one tap away, like ExamView.
      // The sign-in screen only for someone who might sign in: a student who
      // already holds a session would download it and the auth helpers it
      // pulls in for nothing. It still loads on demand if they sign out.
      if (!hasSavedSession()) import('../views/AuthView.jsx').catch(() => {});
    }, { timeout: 5000 });
    return () => cic(id);
  }, []);
}
