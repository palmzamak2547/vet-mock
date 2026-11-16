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

import { useEffect } from 'react';
import { lazyWithRetry } from '../lib/lazy-retry.js';
import { hasSavedSession } from '../lib/supabase.js';

// Every declaration goes through lazyWithRetry (src/lib/lazy-retry.js): a screen
// whose download fails once is asked for again under a fresh URL before the
// page boundary shows its card. Re-exported for the callers that import it here.
export { lazyWithRetry };

// Lazy — HomeView is 1300+ lines and pulls curriculum.js + changelog.
// Splitting it shaves ~80KB off the initial bundle. We prefetch it on
// idle below so navigation feels instant even on first cold load.
export const HomeView = lazyWithRetry(() => import('../views/HomeView.jsx'));

// Lazy — the Chula sign-in wall (docs/CHULA-SIGNIN.md). Its screen and the door
// that opens over the app after a sign-in share one chunk.
export const ChulaGateView = lazyWithRetry(() => import('../views/ChulaGateView.jsx'));
export const ChulaGateExit = lazyWithRetry(() => import('../views/ChulaGateView.jsx'), (m) => ({ default: m.ChulaGateExit }));

// Lazy — pulls VIDEO_SUMMARIES (~200KB) into a separate chunk so it
// only ships when the user actually presses ⌘K (or clicks the search
// button). Keeps the first-paint bundle small.
export const CommandPalette = lazyWithRetry(() => import('../components/CommandPalette.jsx'));

// InstructorProfile — also lazy. Opens when an instructor is selected
// from the palette, and brings the faculty directory with it.
export const InstructorProfile = lazyWithRetry(() => import('../components/InstructorProfile.jsx'));
// VoiceSettings — speed, tone and the device voice. Lazy because most
// sessions never tweak voice. The settings it edits (read-aloud-store.js,
// 2 KB) ride in the main bundle: the practice card's chunk, which Home warms
// on every first visit, already needs them, and shared by this lazy chunk as
// well they would otherwise be a request of their own on Home.
import '../lib/read-aloud-store.js';
export const VoiceSettings = lazyWithRetry(() => import('../components/VoiceSettings.jsx'));

// Sketchpad — opens a blank canvas for free-form drawing/diagrams.
// Lazy because it includes canvas + image processing only used when
// the user opens the pad.
export const ImageAnnotator = lazyWithRetry(() => import('../components/ImageAnnotator.jsx'));

// VetMock's practical Imaging Lab intentionally stays separate from the
// full CUVETSMO imaging workstation. Keep it lazy: the Cornerstone/DICOM
// stack is only downloaded when a learner opens #lab.
export const LabView = lazyWithRetry(() => import('../views/LabView.jsx'));
export const WrapUpView = lazyWithRetry(() => import('../views/WrapUpView.jsx'));
export const AtlasView = lazyWithRetry(() => import('../views/AtlasView.jsx'));

// PinboardView — personal pin grid (Qs / summaries / flashcards /
// notes). Lazy because most sessions never open it.
export const PinboardView = lazyWithRetry(() => import('../views/PinboardView.jsx'));
export const ContributeView = lazyWithRetry(() => import('../views/ContributeView.jsx'));
export const ConnectAppsView = lazyWithRetry(() => import('../views/ConnectAppsView.jsx'));
export const ReviewQueueView = lazyWithRetry(() => import('../views/ReviewQueueView.jsx'));

// BenchView — the screening-test bench. Self-contained and rarely the first
// screen of a session, so it stays out of the main bundle.
export const BenchView = lazyWithRetry(() => import('../views/BenchView.jsx'));

// AdminView — the back-office. One account ever sees it, so its code stays
// out of everyone else's bundle.
export const AdminView = lazyWithRetry(() => import('../views/AdminView.jsx'));

// HighlightToCard — listens for text selections inside
// .vmx-summary-body (SummaryModal content) and offers a floating
// "✨ ทำ flashcard" button that opens a save modal. Lazy because
// users only need it when reading a video summary.
export const HighlightToCard = lazyWithRetry(() => import('../components/HighlightToCard.jsx'));

// ShortcutSheet — Linear-style "press ? for keyboard help" modal.
// Tiny, but only opened on `?` press from exam/review, so lazy keeps
// it out of the first-paint bundle.
export const ShortcutSheet = lazyWithRetry(() => import('../components/ShortcutSheet.jsx'));
export const OnboardingTour = lazyWithRetry(() => import('../components/OnboardingTour.jsx'));

// Lazy — pulled in only when the user navigates to that view.
// Big wins on cold load (esp. iPad / mobile Safari) since NotesView,
// VideoView, GroupsView etc. ship their own chunks.
export const SubjectSelectView = lazyWithRetry(() => import('../views/SubjectSelectView.jsx'));
export const ConfigView = lazyWithRetry(() => import('../views/ConfigView.jsx'));
export const ExamView = lazyWithRetry(() => import('../views/ExamView.jsx'));
export const ResultsView = lazyWithRetry(() => import('../views/ResultsView.jsx'));
export const ReviewView = lazyWithRetry(() => import('../views/ReviewView.jsx'));
export const SRSessionView = lazyWithRetry(() => import('../views/SRSessionView.jsx'));
export const DashboardView = lazyWithRetry(() => import('../views/DashboardView.jsx'));
export const QuestionManagerView = lazyWithRetry(() => import('../views/QuestionManagerView.jsx'));
export const AuthView = lazyWithRetry(() => import('../views/AuthView.jsx'));
export const GroupsView = lazyWithRetry(() => import('../views/GroupsView.jsx'));
export const GroupDetailView = lazyWithRetry(() => import('../views/GroupDetailView.jsx'));
export const LeaderboardView = lazyWithRetry(() => import('../views/LeaderboardView.jsx'));
export const ScheduleView = lazyWithRetry(() => import('../views/ScheduleView.jsx'));
export const ScoresView = lazyWithRetry(() => import('../views/ScoresView.jsx'));
export const VideoView = lazyWithRetry(() => import('../views/VideoView.jsx'));
export const AboutView = lazyWithRetry(() => import('../views/AboutView.jsx'));
export const FeedbackView = lazyWithRetry(() => import('../views/FeedbackView.jsx'));
export const IgCardStudioView = lazyWithRetry(() => import('../views/IgCardStudioView.jsx'));
export const YearSelectView = lazyWithRetry(() => import('../views/YearSelectView.jsx'));
// Marketing landing — signed-out front door. Full-bleed (own nav/footer),
// so it early-returns before the app chrome. Own scoped CSS.
export const LandingView = lazyWithRetry(() => import('../views/LandingView.jsx'));
export const PhaseSelectView = lazyWithRetry(() => import('../views/PhaseSelectView.jsx'));
export const TopicSelectView = lazyWithRetry(() => import('../views/TopicSelectView.jsx'));
export const NotesView = lazyWithRetry(() => import('../views/NotesView.jsx'));
export const LibraryView = lazyWithRetry(() => import('../views/LibraryView.jsx'));
// ExternalDocView is removed
export const KnowledgeView = lazyWithRetry(() => import('../views/KnowledgeView.jsx'));
export const ReadingChecklistView = lazyWithRetry(() => import('../views/ReadingChecklistView.jsx'));
export const FacultyView = lazyWithRetry(() => import('../views/FacultyView.jsx'));
export const PrivacyView = lazyWithRetry(() => import('../views/PrivacyView.jsx'));
export const AccountSettingsView = lazyWithRetry(() => import('../views/AccountSettingsView.jsx'));
export const OfflineGameView = lazyWithRetry(() => import('../views/OfflineGameView.jsx'));
export const MochiView = lazyWithRetry(() => import('../views/MochiView.jsx'));
// PomodoroView — Forest-style focus timer with a hatching-chick companion.
// Lazy: only loaded when the user opens it from the command palette.
export const PomodoroView = lazyWithRetry(() => import('../views/PomodoroView.jsx'));
export const RaceView = lazyWithRetry(() => import('../views/RaceView.jsx'));
// PdfAnnotateView — lazy because pdfjs-dist is heavy (~1 MB) and only
// needed when the user opens "PDF + annotate" from the command palette.
// Worker chunk is dynamically imported inside the view itself.
export const PdfAnnotateView = lazyWithRetry(() => import('../views/PdfAnnotateView.jsx'));
export const ImageOcclusionView = lazyWithRetry(() => import('../views/ImageOcclusionView.jsx'));
// PhaseWrappedView — end-of-phase recap (Spotify-Wrapped style).
// Only shown after a phase ends or opened via command palette,
// so lazy-load is appropriate.
export const PhaseWrappedView = lazyWithRetry(() => import('../views/PhaseWrappedView.jsx'));
// ProfileView — the personal hub behind the bottom bar's fifth tab. It reads
// study data App already holds, so the split buys no second network round trip
// on Home; it keeps the hub and the installer chip it mounts out of the entry
// chunk, which is what tests/unit/boot-weight.test.mjs holds every declaration
// here to.
export const ProfileView = lazyWithRetry(() => import('../views/ProfileView.jsx'));
// The first-run "how classmates see you" sheet: once per account, on Home.
export const IdentityStep = lazyWithRetry(() => import('../components/IdentityStep.jsx'));
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
      // The bottom bar's fifth tab. One tap from every screen, and small, so
      // the hub opens without the Suspense fallback the lazy split otherwise
      // shows on its first tap.
      import('../views/ProfileView.jsx').catch(() => {});
      // The offline banner's "เล่นเกม" opens this view, and it only appears
      // once the device is offline: a chunk first asked for then cannot load,
      // and the tap landed on "หน้านี้ขัดข้อง". Warmed now, the worker's
      // cache-first /assets/ route has it for the offline tap.
      import('../views/OfflineGameView.jsx').catch(() => {});
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
