// ============================================================
// SR-eligibility filter
// ============================================================
// Single source of truth for "can this question be a flashcard?".
// Used by App.jsx (Home dashboard SR badge) and SRSessionView
// (planning step + session pool) so the numbers always agree.
//
// Excluded:
//   • type === 'match'   — needs to see all left-side prompts
//   • MCQ stems containing "ข้อใด/ข้อไหน/อันใด/อันไหน/ข้อต่อไปนี้/
//     ข้างต้น" or English equivalents (which-of, all-of-the-above)
// ============================================================

import { questionInScope, scopeForPhase } from '../lib/exam-scope.js';

const SR_INCOMPATIBLE_STEM = /ข้อใด|ข้อไหน|อันใด|อันไหน|ข้อต่อไปนี้|ตัวเลือกต่อไปนี้|ข้างต้น|\bwhich (?:of|one)?\b|all of the above/i;

/** Shared planning context for the Home count and the review queue. */
export function reviewQuestionsInContext(questions, {
  selectedYear,
  selectedPhase,
  subjectFilter = 'all',
  yearScope = 'current',
  phaseScope = 'current',
} = {}) {
  const wantedScope = phaseScope === 'all' ? null : scopeForPhase(selectedPhase);
  return questions.filter((q) => {
    if (!q || (subjectFilter !== 'all' && q.subject !== subjectFilter)) return false;
    // An explicitly chosen subject keeps its existing cross-year behavior.
    if (subjectFilter === 'all' && yearScope !== 'all' && selectedYear != null
      && q.year != null && q.year !== selectedYear) return false;
    // A subject label on a personal card is not evidence of its exam paper.
    if (q.type === 'flashcard' || q.type === 'cloze' || q.type === 'image-occlusion') return true;
    return questionInScope(q, wantedScope);
  });
}

export function isFlashcardCompatible(q) {
  if (!q || !q.type) return false;
  // User-authored flashcards (Highlight → Flashcard) always pass —
  // they were created by the user specifically for SR review.
  if (q.type === 'flashcard') return true;
  if (q.type === 'match') return false;
  // 'short' (free-form text) and 'essay' (writing) require self-assessment
  // and don't have a single right answer that fits the flashcard model
  if (q.type === 'short' || q.type === 'essay') return false;
  if (q.type !== 'mcq') return true; // tf, fill — recall works
  return !SR_INCOMPATIBLE_STEM.test(q.q || '');
}
