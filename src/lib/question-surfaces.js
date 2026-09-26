// ============================================================
// question-surfaces — which questions a stem-and-options screen can carry
// ============================================================
// The daily question (TodaysQModal) and the race run screen draw the stem
// and the options and nothing else. A question that reads off a figure
// ("ดูภาพประกอบ — ภาพใดคือ …", options A to E naming grid cells) or off a
// passage cannot be answered there, and the daily answer is also counted
// into the class pulse. Those surfaces take text-only questions; practice,
// mock and review render the figure and keep every question.
// ============================================================

/** True when everything needed to answer is in the stem and the options. */
export function isTextOnlyQuestion(q) {
  return !q?.image && !q?.imagePath && !q?.passage;
}

/** The race pool for one subject: deliverable, multiple choice with at
 *  least three options, and answerable on the race screen. */
export function raceEligibleQuestions(qb, subject, isDeliverable = () => true) {
  if (!Array.isArray(qb)) return [];
  return qb.filter((q) => isDeliverable(q)
    && q?.type === 'mcq'
    && q.subject === subject
    && q.options?.length >= 3
    && isTextOnlyQuestion(q));
}
