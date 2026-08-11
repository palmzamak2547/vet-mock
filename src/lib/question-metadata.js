// Canonical metadata rules shared by the runtime catalog, generators, and
// validators. Keeping these predicates in one dependency-light module avoids
// count drift when legacy question banks are migrated incrementally.

export const UNASSIGNED_TOPIC = '__unassigned__';

const PAST_PAPER_SOURCE_PATTERN = /ข้อสอบเก่า|FINAL\s*86|past\s*paper/i;

export function questionTopicId(question) {
  return question?.topic || UNASSIGNED_TOPIC;
}

// `sourceType` is the canonical marker. The source-text fallback keeps older
// banks compatible until their metadata is normalized.
export function isPastPaperQuestion(question) {
  return question?.sourceType === 'past-paper'
    || PAST_PAPER_SOURCE_PATTERN.test(String(question?.source || ''));
}
