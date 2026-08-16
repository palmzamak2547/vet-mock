// Questions that mention an image but do not need one shown.
//
// The figure rule flags a stem that only makes sense while looking at
// something. A few stems mention an image while still telling the reader
// everything the image would have told them — those are answerable, and
// silently exempting them in a regex would hide the judgement. Each one is
// listed here with the reason instead, so the list can be argued with.
//
// This is NOT a place to park a question that really does need its figure.
// If a student cannot answer it without seeing something, it belongs in the
// defect count until it gets its figure or gets rewritten.

export const FIGURE_EXEMPT = {
  105022: 'the clinical picture IS the stem — 60% mortality with airsaculitis, pericarditis and perihepatitis are all stated; "ภาพนี้" means this presentation, not a photograph',
  106291: 'the radiograph finding is given ("ยืนยันจากภาพรังสีว่าแมวมี pleural effusion"); the question is what to do next',
  2202: '"แผนผังโครงสร้างฟาร์ม" is part of the DEFINITION being tested — conceptual biosecurity IS farm layout. No diagram is referred to',
  105755: 'asks what a HACCP flow diagram must COVER, which is the standard scope of that artefact, not a reading off one printed on a slide',
};
