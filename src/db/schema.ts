// ============================================================
// VetMock — Complete Drizzle ORM Schema Definition
// ============================================================

import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  jsonb,
} from 'drizzle-orm/pg-core';

// ============================================================
// 10 Core VetMock Domain Entities
// ============================================================

export const wikiPageStatusEnum = pgEnum('wiki_page_status', ['draft', 'approved', 'archived']);
export const wikiAnchorStatusEnum = pgEnum('wiki_anchor_status', ['draft', 'approved', 'blocked']);
export const questionDifficultyEnum = pgEnum('question_difficulty', ['easy', 'medium', 'hard']);
export const questionStatusEnum = pgEnum('question_status', ['draft', 'published', 'archived']);
export const mockSessionStatusEnum = pgEnum('mock_session_status', ['in_progress', 'submitted', 'expired', 'abandoned']);
export const contentReviewEntityTypeEnum = pgEnum('content_review_entity_type', ['wiki_page', 'wiki_anchor', 'question', 'question_wiki_ref']);
export const contentReviewStatusEnum = pgEnum('content_review_status', ['pending', 'approved', 'rejected']);

// 1) domains
export const domains = pgTable('domains', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  isPublished: boolean('is_published').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2) wikiPages
export const wikiPages = pgTable('wiki_pages', {
  id: text('id').primaryKey(),
  domainId: text('domain_id').references(() => domains.id),
  pageId: text('page_id').notNull().unique(),
  title: text('title').notNull(),
  status: wikiPageStatusEnum('status').default('draft').notNull(),
  sourceApprovalRef: text('source_approval_ref'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3) wikiAnchors
export const wikiAnchors = pgTable(
  'wiki_anchors',
  {
    id: text('id').primaryKey(),
    wikiPageId: text('wiki_page_id').notNull().references(() => wikiPages.id, { onDelete: 'cascade' }),
    anchorId: text('anchor_id').notNull(),
    title: text('title').notNull(),
    contentSummary: text('content_summary'),
    status: wikiAnchorStatusEnum('status').default('draft').notNull(),
    mappingEligible: boolean('mapping_eligible').default(false).notNull(),
    sourceApprovalRef: text('source_approval_ref'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    unq: unique('wiki_anchor_page_anchor_unq').on(table.wikiPageId, table.anchorId),
  })
);

// 4) questions — รองรับ MCQ/TF/Fill/Match/Timed (B: match drag-drop)
export const questionTypeEnum = pgEnum('question_type', ['mcq', 'tf', 'fill', 'match', 'short', 'essay']);
export const questions = pgTable('questions', {
  id: text('id').primaryKey(),
  domainId: text('domain_id').references(() => domains.id),
  questionCode: text('question_code').notNull().unique(),
  stem: text('stem').notNull(),
  // Legacy MCQ path (nullable now) — new types use payload
  choices: jsonb('choices').$type<[string, string, string, string]>(),
  correctChoiceIndex: integer('correct_choice_index'),
  // Generic payload สำหรับ non-MCQ (match pairs/distractors, fill blanks, etc.)
  // { type, pairs:[{left,right}], distractors:[], blanks:[], keywords:[], model_answer, ... }
  payload: jsonb('payload').$type<Record<string, unknown>>(),
  questionType: questionTypeEnum('question_type').default('mcq').notNull(),
  timeLimitSeconds: integer('time_limit_seconds'), // per-question timed (null = use session default)
  explanation: text('explanation'),
  difficulty: questionDifficultyEnum('difficulty').default('medium').notNull(),
  status: questionStatusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5) questionWikiRefs
export const questionWikiRefs = pgTable('question_wiki_refs', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().unique().references(() => questions.id, { onDelete: 'cascade' }),
  wikiPageId: text('wiki_page_id').notNull().references(() => wikiPages.id),
  wikiAnchorId: text('wiki_anchor_id').notNull().references(() => wikiAnchors.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6) mockSessions
export const mockSessions = pgTable('mock_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  domainId: text('domain_id').notNull().references(() => domains.id),
  title: text('title').notNull(),
  status: mockSessionStatusEnum('status').default('in_progress').notNull(),
  questionCount: integer('question_count').notNull(),
  timeLimitSeconds: integer('time_limit_seconds'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7) mockSessionQuestions — รองรับ partial scoring + match (B)
export const mockSessionQuestions = pgTable(
  'mock_session_questions',
  {
    id: text('id').primaryKey(),
    sessionId: text('session_id').notNull().references(() => mockSessions.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull().references(() => questions.id),
    displayOrder: integer('display_order').notNull(),
    selectedChoiceIndex: integer('selected_choice_index'), // legacy MCQ
    selectedValue: jsonb('selected_value').$type<unknown>(), // generic answer (match: {0:right}, fill: string[], etc.)
    score: integer('score'), // earned points (for partial: e.g. 2/3)
    maxScore: integer('max_score'), // total possible (e.g. 3)
    isCorrect: boolean('is_correct'),
    answeredAt: timestamp('answered_at'),
  },
  (table) => ({
    unq: unique('mock_session_question_unq').on(table.sessionId, table.questionId),
  })
);

// 8) userDomainProgress
export const userDomainProgress = pgTable(
  'user_domain_progress',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    domainId: text('domain_id').notNull().references(() => domains.id),
    xp: integer('xp').default(0).notNull(),
    correctAnswers: integer('correct_answers').default(0).notNull(),
    totalAnswers: integer('total_answers').default(0).notNull(),
    masteryPercent: integer('mastery_percent').default(0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    unq: unique('user_domain_progress_unq').on(table.userId, table.domainId),
  })
);

// 9) contentReviews
export const contentReviews = pgTable('content_reviews', {
  id: text('id').primaryKey(),
  entityType: contentReviewEntityTypeEnum('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  status: contentReviewStatusEnum('status').default('pending').notNull(),
  reviewerUserId: text('reviewer_user_id'),
  comment: text('comment'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10) auditLogs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  actorUserId: text('actor_user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================
// Original Duolingo Clone Infrastructure Entities (Preserved)
// ============================================================

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
});

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST']);

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull(),
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: text('image_src'),
  audioSrc: text('audio_src'),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

export const challengeProgress = pgTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  completed: boolean('completed').notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable('user_subscription', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
});
