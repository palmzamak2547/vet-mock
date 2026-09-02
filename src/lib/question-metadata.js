// Canonical metadata rules shared by the runtime catalog, generators, and
// validators. Keeping these predicates in one dependency-light module avoids
// count drift when legacy question banks are migrated incrementally.

export const UNASSIGNED_TOPIC = '__unassigned__';

const PAST_PAPER_SOURCE_PATTERN = /ข้อสอบเก่า|FINAL\s*86|past\s*paper/i;

export function questionTopicId(question) {
  return question?.topic || UNASSIGNED_TOPIC;
}

// `sourceType` is the canonical marker and wins when present. `examOrigin` is
// authoritative only for legacy questions without that marker: several older
// ingests put a senior-summary note in examOrigin while correctly classifying
// the question as lecture-derived or student-compilation. The source-text
// fallback keeps still-older banks compatible until metadata is normalized.
export function isPastPaperQuestion(question) {
  if (question?.sourceType) return question.sourceType === 'past-paper';
  return Boolean(String(question?.examOrigin || '').trim())
    || PAST_PAPER_SOURCE_PATTERN.test(String(question?.source || ''));
}
