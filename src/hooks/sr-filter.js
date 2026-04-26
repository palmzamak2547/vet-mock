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

const SR_INCOMPATIBLE_STEM = /ข้อใด|ข้อไหน|อันใด|อันไหน|ข้อต่อไปนี้|ตัวเลือกต่อไปนี้|ข้างต้น|\bwhich (?:of|one)?\b|all of the above/i;

export function isFlashcardCompatible(q) {
  if (!q || !q.type) return false;
  if (q.type === 'match') return false;
  if (q.type !== 'mcq') return true; // tf, fill — recall works
  return !SR_INCOMPATIBLE_STEM.test(q.q || '');
}
