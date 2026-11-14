// ============================================================
// The differential boards, one lazy file per paper, by subject
// ============================================================
// A board is an arrangement of one wrap-up's own lines (lib/wrap-board.js).
// It names the subject and the exam date it was arranged for, so a later
// year's wrap-up of the same course never takes an old board: that paper
// shows no board until its own is filed. Adding a paper's board is a file in
// this folder and a line here, no code.
// ============================================================
export const BOARD_LOADERS = {
  'swine-clinic': () => import('./swine-clinic-final.js'),
};
