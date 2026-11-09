// ============================================================
// current-scope.js — what the ตามสไลด์ปัจจุบัน and ชุดหลักฐานตรงกัน sets serve
// ============================================================
// A question belongs to these sets when its answer is verified, its
// prediction metadata is complete for this curriculum version
// (lib/question-prediction.js), and it sits the term and the paper the
// student picked.
//
// The paper is the one every other set and count uses, from
// lib/exam-scope.js: the topic's scope, else the question's own field. The
// field is the paper a question was written for, often another cohort's.
// Read alone it kept 30 verified equine questions out of the final's set,
// although their topics sit both papers, and the pool's paper filter then
// required both readings to agree.
//
// It lives apart from question-prediction.js because the data gates load
// that module, and regen:delivery runs before regen:exam-papers rebuilds the
// table the resolver reads.
// ============================================================

import { predictionMetadataIssues, examScopeForPhase } from './question-prediction.js';
import { questionInScope } from './exam-scope.js';

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
  return questionInScope(question, wantedScope);
}

export function isHighPredictionQuestion(question, options = {}) {
  return question?.predictionTier === 'high'
    && isCurrentScopeQuestion(question, options);
}
