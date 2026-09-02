// Canonical metadata rules shared by the runtime catalog, generators, and
// validators. Keeping these predicates in one dependency-light module avoids
// count drift when legacy question banks are migrated incrementally.

export const UNASSIGNED_TOPIC = '__unassigned__';

const PAST_PAPER_SOURCE_PATTERN = /ข้อสอบ(?:เก่า)?|\b(?:FINAL|MID)\s*86\b|past\s*(?:paper|exam)/i;
const PAST_PAPER_ORIGIN_PATTERN = /ข้อสอบเก่า|past\s*(?:paper|exam)|exam(?:ination)?\s*recall|\b(?:final|mid(?:term)?|osce|prac\s*final|lab\s*final)\b|\bER\s*Q\d+/i;
const NON_PAPER_ORIGIN_PATTERN = /\bmock\b|station\s+prep/i;

export function questionTopicId(question) {
  return question?.topic || UNASSIGNED_TOPIC;
}

// `sourceType` is the canonical marker and wins when present. `examOrigin` is
// considered only for legacy questions without that marker and must itself
// name a real exam context. A nonempty value is not enough: practice mocks and
// senior summaries also use this field. The source-text fallback keeps
// still-older banks compatible until metadata is normalized.
export function isPastPaperQuestion(question) {
  if (question?.sourceType) return question.sourceType === 'past-paper';
  const origin = String(question?.examOrigin || '');
  return (!NON_PAPER_ORIGIN_PATTERN.test(origin) && PAST_PAPER_ORIGIN_PATTERN.test(origin))
    || PAST_PAPER_SOURCE_PATTERN.test(String(question?.source || ''));
}
