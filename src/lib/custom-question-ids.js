// Matches the reserved custom-question range in user-flashcards/image-occlusion.
// Comments still store q_id as PostgreSQL INTEGER, so new IDs remain numeric.
export const CUSTOM_QUESTION_ID_RANGE = Object.freeze([60_000, 69_999]);

// ponytail: 10k numeric slots; widening requires the bank and comment ID contracts to agree.
export function assignCustomQuestionIds(incoming, existing, reservedIds = []) {
  const [min, max] = CUSTOM_QUESTION_ID_RANGE;
  const capacity = max - min + 1;
  const used = new Set([...existing.map(q => q.id), ...reservedIds].map(Number)
    .filter(id => Number.isInteger(id) && id >= min && id <= max));
  if (incoming.length > capacity - used.size) {
    throw new Error('รหัสข้อสอบส่วนตัวเต็มแล้ว (สูงสุด 10,000 ข้อ) ชุดนี้ยังไม่ถูกนำเข้า');
  }
  // Random starts avoid identical first IDs across tabs/devices at the same
  // millisecond. The latest local set still decides whether an ID is free.
  return incoming.map(question => {
    let id = min + Math.floor(Math.random() * capacity);
    while (used.has(id)) id = id === max ? min : id + 1;
    used.add(id);
    return { ...question, id };
  });
}

/** Allocate against the current complete store, including retired references. */
export function appendCustomQuestions(data, incoming) {
  const reserved = [
    ...data.bookmarks, ...data.history.map(item => item.questionId),
    ...Object.keys(data.srCards), ...Object.values(data.srCards).map(card => card.questionId),
    ...Object.keys(data.notes),
  ];
  return [...data.customQuestions, ...assignCustomQuestionIds(incoming, data.customQuestions, reserved)];
}
