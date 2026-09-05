// Prediction metadata is deliberately separate from answer verification.
// A question can be medically correct without being likely to appear in the
// current exam, and an old recurring question can still need a fresh answer
// check. Keeping the two axes separate prevents either claim laundering the
// other.

export const PREDICTION_TIERS = new Set(['high', 'medium', 'low']);
export const ANSWER_STATUSES = new Set(['verified', 'needs-review']);
export const EXAM_SCOPES = new Set(['midterm', 'final', 'both', 'continuous']);
export const PREDICTION_SOURCE_TYPES = new Set([
  'lecture-derived',
  'student-compilation',
  'past-paper',
]);

// Labels for the exam a question belongs to. `continuous` is a course with
// no paper at all in the faculty exam timetable (POA in 2569-1), so its
// label says exactly that rather than inventing a third exam.
export const EXAM_SCOPE_LABELS = {
  midterm: 'กลางภาค',
  final: 'ปลายภาค',
  continuous: 'ไม่มีสอบแยก',
  both: 'กลางภาคและปลายภาค',
};
export const examScopeLabel = (scope) => EXAM_SCOPE_LABELS[scope] || null;

/** Does a question belong in the bucket the student picked? `both` sits in
 *  midterm AND final. `continuous` sits ONLY in continuous: a course graded
 *  by continuous assessment has no midterm paper for its questions to
 *  appear on, and folding them into the midterm set is exactly what made
 *  "กลางภาค" and "ปลายภาค" feel like the same pile. */
export function questionInScope(questionScope, wantedScope) {
  if (!wantedScope) return true;
  if (wantedScope === 'continuous') return questionScope === 'continuous';
  return questionScope === wantedScope || questionScope === 'both';
}

const VERSION_PATTERN = /^\d{4}-[123]$/;
const SIGNAL_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PREDICTION_SIGNALS = new Set(['current-lecture', 'senior-recurrence']);

export function examScopeForPhase(selectedPhase) {
  if (typeof selectedPhase !== 'string') return null;
  if (selectedPhase.endsWith('-mid')) return 'midterm';
  if (selectedPhase.endsWith('-final')) return 'final';
  return null;
}

export function predictionMetadataIssues(question) {
  const keys = [
    'answerStatus',
    'curriculumVersion',
    'examScope',
    'predictionTier',
    'predictionSignals',
    'predictionEvidence',
  ];
  if (!keys.some((key) => question?.[key] != null)) return [];

  const issues = [];
  if (!ANSWER_STATUSES.has(question?.answerStatus)) issues.push('answerStatus');
  if (!VERSION_PATTERN.test(String(question?.curriculumVersion || ''))) issues.push('curriculumVersion');
  if (!EXAM_SCOPES.has(question?.examScope)) issues.push('examScope');
  if (!PREDICTION_TIERS.has(question?.predictionTier)) issues.push('predictionTier');
  if (!PREDICTION_SOURCE_TYPES.has(question?.sourceType)) issues.push('sourceType');

  const signals = question?.predictionSignals;
  if (!Array.isArray(signals)
    || signals.length === 0
    || signals.some((signal) => !SIGNAL_PATTERN.test(String(signal)))
    || signals.some((signal) => !PREDICTION_SIGNALS.has(signal))
    || new Set(signals).size !== signals.length) {
    issues.push('predictionSignals');
  }
  if (question?.predictionTier === 'high' && Array.isArray(signals) && signals.length < 2) {
    issues.push('highTierNeedsTwoSignals');
  }
  const evidence = question?.predictionEvidence;
  if (evidence != null && (!Array.isArray(evidence)
    || evidence.length === 0
    || evidence.some((item) => typeof item !== 'string' || item.trim().length < 8))) {
    issues.push('predictionEvidence');
  }
  if (question?.predictionTier === 'high'
    && (!Array.isArray(evidence) || evidence.length === 0)) {
    issues.push('highTierNeedsEvidence');
  }
  return issues;
}

export function isCurrentScopeQuestion(question, {
  curriculumVersion,
  // The ONE phase control the app has (ปี → เทอม 1 กลางภาค / ปลายภาค).
  // Null means the whole semester.
  selectedPhase = null,
} = {}) {
  if (predictionMetadataIssues(question).length > 0) return false;
  if (question?.answerStatus !== 'verified') return false;
  if (!curriculumVersion || question?.curriculumVersion !== curriculumVersion) return false;

  const wantedScope = examScopeForPhase(selectedPhase);
  if (!wantedScope) return true;
  const phaseSemester = String(selectedPhase).split('-', 1)[0];
  const curriculumSemester = String(curriculumVersion).split('-', 2)[1];
  if (phaseSemester !== curriculumSemester) return false;
  return questionInScope(question?.examScope, wantedScope);
}

export function isHighPredictionQuestion(question, options = {}) {
  return question?.predictionTier === 'high'
    && isCurrentScopeQuestion(question, options);
}

// Severities the app can explain to the student: the card renders a
// documented conflict as a major/minor chip with the flag's note under it.
const DELIVERABLE_FLAG_SEVERITIES = new Set(['major', 'minor']);

// A flag the gate cannot read is a flag it cannot vouch for. Fourteen bank
// questions carry `flag` as a bare string ('verify-2026', 'tricky-stem',
// 'minor') instead of `{ severity, note }`. The card renders any of those as
// an UNCLEAR chip whose explanation is `undefined`, so delivering them as
// verified told the student two different things about the same field.
// Only a documented major/minor conflict is deliverable, and it ships with
// its warning; everything else waits for a human to say what it means.
function flagIsDocumentedConflict(flag) {
  return typeof flag === 'object'
    && DELIVERABLE_FLAG_SEVERITIES.has(flag?.severity)
    && typeof flag.note === 'string'
    && flag.note.trim().length > 0;
}

export function questionNeedsAnswerReview(question) {
  if (question?.answerStatus === 'needs-review') return true;
  const flag = question?.flag;
  if (!flag) return false;
  return !flagIsDocumentedConflict(flag);
}
