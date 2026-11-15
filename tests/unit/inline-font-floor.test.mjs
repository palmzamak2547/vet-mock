// Thai text is 14 px or more app-wide (AGENTS.md, "UI and study flow"), and the stylesheet keeps that
// floor, but an inline `fontSize: 11` in JSX quietly wins over it. The screen hunt of 14 Nov 2026
// (scripts/screen-hunt.mjs, "thai-small") found the schedule's registration card drawing its kind
// (ชำระเงิน) at 11 px and its dates at 12 px that way, beside an event card already raised to 14.
//
// This counts, per file, the inline font sizes under 14 px in src/**/*.jsx. Some sit on Latin-only
// micro labels or icons, which the floor allows, so it is a ratchet rather than a ban: a file may hold
// no more than its number below, a file with no row may hold none, and a number that is now too high
// fails too, so a cleanup lowers it in the same change. The numbers only go down.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url);

const BUDGET = {
  'src/components/CommandPalette.jsx': 5,
  'src/components/DiagramLabelDrill.jsx': 1,
  'src/components/ErrorBoundary.jsx': 1,
  'src/components/ImageOcclusionCard.jsx': 2,
  'src/components/InstructorModal.jsx': 2,
  'src/components/MochiVoice.jsx': 3,
  'src/components/OSCEDrill.jsx': 2,
  'src/components/PdfPage.jsx': 1,
  'src/components/PdfThumbnailSidebar.jsx': 2,
  'src/components/QComments.jsx': 2,
  'src/components/Question.jsx': 2,
  'src/components/QuestsPanel.jsx': 2,
  'src/components/ShortcutSheet.jsx': 2,
  'src/components/SmartGrader.jsx': 4,
  'src/components/StudyBuddiesPanel.jsx': 1,
  'src/components/SyncStatusNotice.jsx': 1,
  'src/components/TemplateLibrary.jsx': 2,
  'src/components/TermPopup.jsx': 1,
  'src/components/TodaysQModal.jsx': 1,
  'src/components/UserMenu.jsx': 1,
  'src/components/VetCalculator.jsx': 3,
  'src/components/VideoNotePanel.jsx': 3,
  'src/components/VoiceSettings.jsx': 2,
  'src/components/XpChip.jsx': 1,
  'src/views/AuthView.jsx': 1,
  'src/views/ContributeView.jsx': 7,
  'src/views/DashboardView.jsx': 3,
  'src/views/ExamView.jsx': 2,
  'src/views/GroupDetailView.jsx': 3,
  'src/views/GroupsView.jsx': 1,
  'src/views/HomeView.jsx': 1,
  'src/views/LeaderboardView.jsx': 3,
  'src/views/LibraryView.jsx': 1,
  'src/views/PdfAnnotateView.jsx': 1,
  'src/views/PinboardView.jsx': 3,
  'src/views/RaceView.jsx': 2,
  'src/views/ReadingChecklistView.jsx': 1,
  'src/views/ReviewQueueView.jsx': 9,
  'src/views/ReviewView.jsx': 5,
  'src/views/TopicSelectView.jsx': 1,
  'src/views/VideoView.jsx': 4,
  'src/views/YearSelectView.jsx': 1,
};

export function smallInlineSizes(text) {
  return [...text.matchAll(/fontSize:\s*(?:(\d+(?:\.\d+)?)|'(\d+(?:\.\d+)?)px')/g)]
    .filter((m) => Number(m[1] ?? m[2]) < 14).length;
}

function jsxFiles(dir) {
  return readdirSync(new URL(dir, ROOT), { withFileTypes: true }).flatMap((e) => {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) return /data/.test(e.name) ? [] : jsxFiles(rel);
    return /\.jsx$/.test(e.name) ? [rel] : [];
  });
}

test('inline font sizes under 14 px only go down, file by file', () => {
  const over = [];
  const slack = [];
  for (const file of jsxFiles('src')) {
    const n = smallInlineSizes(readFileSync(new URL(file, ROOT), 'utf8'));
    const allowed = BUDGET[file] ?? 0;
    if (n > allowed) over.push(`${file}: ${n} inline font sizes under 14 px, budget ${allowed}`);
    else if (n < allowed) slack.push(`${file}: ${n}, budget still ${allowed} (lower it)`);
  }
  assert.deepEqual(over, [], 'Thai text is 14 px or more: use 14 or a class, not a smaller inline size');
  assert.deepEqual(slack, [], 'a file now holds fewer: lower its number here');
});

test('the counter reads both spellings and leaves 14 px alone', () => {
  assert.equal(smallInlineSizes("style={{ fontSize: 11 }} style={{ fontSize: '12px' }} style={{ fontSize: 14 }} style={{ fontSize: 13.5 }}"), 3);
});
