// The overview paragraph at the top of a wrap-up (views/WrapUpView.jsx). One rule for every paper, never a
// list of subjects: an overview longer than INTRO_MAX_LINES lines on the screen it is drawn on opens folded to
// INTRO_FOLDED_LINES lines with "อ่านต่อ", so the first section of the wrap-up is on the first screen. The
// Swine final's overview ran 11 lines at 390 px and pushed every item below the fold.

export const INTRO_MAX_LINES = 4;
export const INTRO_FOLDED_LINES = 2;

/** How many lines a block of text fills, from its full height and its line height (both in px). */
export function linesOf(height, lineHeight) {
  if (!(height > 0) || !(lineHeight > 0)) return 0;
  return Math.round(height / lineHeight);
}

/** Whether an overview of this height folds. Unknown sizes never fold: the text stays whole. */
export function introFolds(height, lineHeight, max = INTRO_MAX_LINES) {
  return linesOf(height, lineHeight) > max;
}
