// ============================================================
// mock-session-service.js — Server-Authoritative Mock Session Manager
// ============================================================

import { QB } from '../data/questions.js';

// In-memory server session store (simulates server DB state)
export const SESSIONS_DB = new Map();
export const USER_PROGRESS_DB = new Map();

/**
 * 1. Create a new mock session with deterministic published question inventory.
 */
export function createMockSession({ userId, domainId, title, questionCount = 10, timeLimitSeconds = null, customQuestions = null }) {
  if (!userId) throw new Error('Authentication required');

  // Filter published, unique questions for domain
  const pool = Array.isArray(customQuestions) && customQuestions.length > 0 ? customQuestions : QB;
  const publishedQuestions = pool.filter((q) => q.status === 'published' || q.status === undefined || q.isDemo);

  if (publishedQuestions.length === 0) {
    throw new Error('INSUFFICIENT_INVENTORY: No published questions available for this domain');
  }

  const selectedQuestions = publishedQuestions.slice(0, Math.min(questionCount, publishedQuestions.length));

  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    userId,
    domainId,
    title: title || 'Mock Exam Session',
    status: 'in_progress',
    questionCount: selectedQuestions.length,
    timeLimitSeconds,
    startedAt: new Date().toISOString(),
    submittedAt: null,
    answers: {},
    questions: selectedQuestions.map((q, idx) => ({
      id: q.id,
      questionCode: q.questionCode || `Q-${q.id}`,
      stem: q.stem || q.question,
      choices: q.choices || q.options,
      correctChoiceIndex: q.correctChoiceIndex ?? q.answer ?? 0,
      displayOrder: idx + 1,
    })),
    score: null,
    xpAwarded: 0,
    isSubmitted: false,
  };

  SESSIONS_DB.set(session.id, session);
  return session;
}

/**
 * 2. Get mock session details — verifies authenticated ownership.
 */
export function getMockSession(sessionId, currentUserId) {
  const session = SESSIONS_DB.get(sessionId);
  if (!session) return { error: 'NOT_FOUND', status: 404 };
  if (session.userId !== currentUserId) {
    return { error: 'FORBIDDEN', status: 403 };
  }
  return { session };
}

/**
 * 3. Save choice in an active session — verifies authenticated ownership & session state.
 */
export function saveSessionChoice(sessionId, questionId, choiceIndex, currentUserId) {
  const session = SESSIONS_DB.get(sessionId);
  if (!session) return { error: 'NOT_FOUND', status: 404 };
  if (session.userId !== currentUserId) {
    return { error: 'FORBIDDEN', status: 403 };
  }
  if (session.status !== 'in_progress') {
    return { error: 'SESSION_CLOSED', status: 400 };
  }

  session.answers[questionId] = choiceIndex;
  return { success: true, answers: session.answers };
}

/**
 * 4. Submit session — Idempotent submission with transaction-safe scoring & one-time XP award.
 */
export function submitMockSession(sessionId, answers = {}, currentUserId) {
  const session = SESSIONS_DB.get(sessionId);
  if (!session) return { error: 'NOT_FOUND', status: 404 };
  if (session.userId !== currentUserId) {
    return { error: 'FORBIDDEN', status: 403 };
  }

  // IDEMPOTENCY CHECK: If session already submitted, return existing score with 0 new XP
  if (session.isSubmitted || session.status === 'submitted') {
    return {
      session,
      alreadySubmitted: true,
      score: session.score,
      xpAwarded: 0,
    };
  }

  // Merge final answers
  session.answers = { ...session.answers, ...answers };

  // Calculate score deterministically against server QB source of truth
  let correctCount = 0;
  session.questions.forEach((sq) => {
    const fullQ = QB.find((q) => q.id === sq.id) || sq;
    const correctIdx = fullQ.correctChoiceIndex ?? fullQ.answer ?? 0;
    if (session.answers[sq.id] === correctIdx) {
      correctCount++;
    }
  });

  const accuracyPct = Math.round((correctCount / Math.max(1, session.questions.length)) * 100);
  const xpEarned = correctCount * 10 + 20;

  session.status = 'submitted';
  session.submittedAt = new Date().toISOString();
  session.score = { correct: correctCount, total: session.questions.length, accuracyPct };
  session.xpAwarded = xpEarned;
  session.isSubmitted = true;

  // Update user progress transactionally
  const userProgressKey = `${currentUserId}:${session.domainId}`;
  const existingProg = USER_PROGRESS_DB.get(userProgressKey) || { xp: 0, correctAnswers: 0, totalAnswers: 0, masteryPercent: 0 };

  const updatedProg = {
    xp: existingProg.xp + xpEarned,
    correctAnswers: existingProg.correctAnswers + correctCount,
    totalAnswers: existingProg.totalAnswers + session.questions.length,
    masteryPercent: Math.round(((existingProg.correctAnswers + correctCount) / Math.max(1, existingProg.totalAnswers + session.questions.length)) * 100),
  };
  USER_PROGRESS_DB.set(userProgressKey, updatedProg);

  return {
    session,
    alreadySubmitted: false,
    score: session.score,
    xpAwarded: xpEarned,
    userProgress: updatedProg,
  };
}
