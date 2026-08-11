// ============================================================
// Study catalog — metadata + navigation seam
// ============================================================
//
// This module joins the curriculum, generated question counts, note
// availability, video library, and reading progress without importing any
// question/note body. Views browse one consistent snapshot and execute the
// serializable actions it returns; content loaders and renderers stay in their
// existing modules.
// ============================================================

import { SUBJECTS, hiddenTopicIdsFor } from '../data/curriculum.js';
import {
  Q_COUNTS_BY_TOPIC,
  Q_PAST_PAPER_COUNTS_BY_TOPIC,
  Q_VISIBLE_COUNTS_BY_SUBJECT,
} from '../data/q-counts.js';
import {
  NOTE_TOPIC_COUNTS_BY_SUBJECT,
  hasNoteTopic,
  hasNotes,
} from '../data/notes-registry.generated.js';
import { VIDEO_LIBRARY } from '../data/videos.js';
import { isPastPaperQuestion } from './question-metadata.js';
import { isTopicRead, topicProgressKey } from './study-progress.js';
import { wikiPath } from './vetwiki/url.js';

function safeQuestions(value) {
  return Array.isArray(value) ? value.filter((q) => q && typeof q === 'object') : [];
}

function action(target, label, enabled, state, reason, href) {
  return Object.freeze({
    target,
    label,
    enabled: Boolean(enabled),
    ...(reason ? { reason } : {}),
    intent: Object.freeze({
      view: target === 'practice' || target === 'exam' ? 'config'
        : target === 'wiki' ? 'knowledge'
          : target,
      state: Object.freeze({ ...state }),
      ...(href ? { href } : {}),
    }),
  });
}

function countVideosBySubject() {
  const counts = Object.create(null);
  for (const video of VIDEO_LIBRARY) {
    if (!video?.subject) continue;
    counts[video.subject] = (counts[video.subject] || 0) + 1;
  }
  return counts;
}

const VIDEO_COUNTS_BY_SUBJECT = countVideosBySubject();

function indexCustomQuestions(customQuestions) {
  const bySubject = new Map();
  for (const question of safeQuestions(customQuestions)) {
    if (!question.subject) continue;
    if (!bySubject.has(question.subject)) bySubject.set(question.subject, []);
    bySubject.get(question.subject).push(question);
  }
  return bySubject;
}

/**
 * Metadata-only catalog. `browse()` is synchronous and never pulls a question
 * bank, note body, video summary, or network resource into the caller.
 */
export function createStudyCatalog({ customQuestions = [], readingChecklist = {} } = {}) {
  const customBySubject = indexCustomQuestions(customQuestions);

  function browse(ref = {}) {
    const subjectId = ref?.subject;
    const subject = SUBJECTS.find((row) => row.id === subjectId);
    if (!subject) {
      return Object.freeze({
        status: 'not-found',
        kind: 'missing',
        ref: Object.freeze({ subject: subjectId || null }),
        resources: Object.freeze({}),
        topics: Object.freeze([]),
        collections: Object.freeze([]),
      });
    }

    const hidden = hiddenTopicIdsFor(subjectId);
    const subjectCustom = customBySubject.get(subjectId) || [];
    const visibleCustom = subjectCustom.filter((q) => !hidden.has(q.topic));
    const builtInByTopic = Q_COUNTS_BY_TOPIC[subjectId] || {};
    const builtInPastByTopic = Q_PAST_PAPER_COUNTS_BY_TOPIC[subjectId] || {};
    const customCount = (topicId) => subjectCustom.filter((q) => q.topic === topicId).length;
    const customPastCount = (topicId) => subjectCustom.filter((q) => q.topic === topicId && isPastPaperQuestion(q)).length;

    const topics = (subject.topics || [])
      .filter((topic) => !topic.hidden)
      .map((topic) => {
        const questionCount = (builtInByTopic[topic.id] || 0) + customCount(topic.id);
        const pastPaperCount = (builtInPastByTopic[topic.id] || 0) + customPastCount(topic.id);
        const noteAvailable = hasNoteTopic(subjectId, topic.id);
        const topicState = { subject: subjectId, topic: topic.id };
        const practice = action(
          'practice',
          'ทำข้อสอบ',
          questionCount > 0,
          { ...topicState, mode: 'quick' },
          questionCount > 0 ? null : 'missing-content',
        );
        const notes = action(
          'notes',
          'อ่าน Notes',
          noteAvailable,
          topicState,
          noteAvailable ? null : 'missing-content',
        );
        const wiki = action(
          'wiki',
          'เปิด VetWiki',
          noteAvailable,
          topicState,
          noteAvailable ? null : 'missing-content',
          noteAvailable ? wikiPath(subjectId, topic.id) : null,
        );

        return Object.freeze({
          ...topic,
          key: topicProgressKey(subjectId, topic.id),
          questionCount,
          pastPaperCount,
          read: isTopicRead(readingChecklist, subjectId, topic.id),
          resources: Object.freeze({ questions: practice, notes, wiki }),
          primaryAction: questionCount > 0 ? practice : noteAvailable ? notes : null,
        });
      });

    const visibleBuiltIn = Q_VISIBLE_COUNTS_BY_SUBJECT[subjectId] || 0;
    const questionCount = visibleBuiltIn + visibleCustom.length;
    const pastPaperCount = Object.entries(builtInPastByTopic)
      .filter(([topicId]) => !hidden.has(topicId))
      .reduce((sum, [, count]) => sum + count, 0)
      + visibleCustom.filter(isPastPaperQuestion).length;
    const noteCount = NOTE_TOPIC_COUNTS_BY_SUBJECT[subjectId] || 0;
    const videoCount = VIDEO_COUNTS_BY_SUBJECT[subjectId] || 0;
    const subjectState = { subject: subjectId, topic: null };

    const resources = Object.freeze({
      questions: Object.freeze({
        count: questionCount,
        pastPaperCount,
        available: questionCount > 0,
        quick: action('practice', 'ฝึกซ้อม', questionCount > 0, { ...subjectState, mode: 'quick' }, questionCount > 0 ? null : 'missing-content'),
        exam: action('exam', 'สอบจริง', questionCount > 0, { ...subjectState, mode: 'exam' }, questionCount > 0 ? null : 'missing-content'),
      }),
      notes: Object.freeze({
        count: noteCount,
        available: hasNotes(subjectId) && noteCount > 0,
        action: action('notes', 'Notes / สรุป', noteCount > 0, subjectState, noteCount > 0 ? null : 'missing-content'),
      }),
      wiki: Object.freeze({
        count: noteCount,
        available: noteCount > 0,
        action: action('wiki', 'VetWiki', noteCount > 0, subjectState, noteCount > 0 ? null : 'missing-content', '/wiki'),
      }),
      videos: Object.freeze({
        count: videoCount,
        available: videoCount > 0,
        action: action('videos', 'คลิปย้อนหลัง', videoCount > 0, subjectState, videoCount > 0 ? null : 'missing-content'),
      }),
    });

    const collections = (subject.collections || []).map((collection) => {
      const matches = (topicId) => collection.topicPrefix && topicId?.startsWith(collection.topicPrefix);
      const builtInCount = Object.entries(builtInByTopic)
        .filter(([topicId]) => matches(topicId) && !hidden.has(topicId))
        .reduce((sum, [, count]) => sum + count, 0);
      const customTotal = visibleCustom.filter((q) => matches(q.topic)).length;
      return Object.freeze({ ...collection, questionCount: builtInCount + customTotal });
    });

    return Object.freeze({
      status: 'ok',
      kind: 'subject',
      ref: Object.freeze({ subject: subjectId }),
      subject,
      resources,
      topics: Object.freeze(topics),
      collections: Object.freeze(collections),
      progress: Object.freeze({
        read: topics.filter((topic) => topic.read).length,
        total: topics.length,
      }),
    });
  }

  function open(studyAction) {
    if (!studyAction || studyAction.enabled !== true || !studyAction.intent) {
      return Object.freeze({ status: 'unavailable', reason: studyAction?.reason || 'invalid-action' });
    }
    return Object.freeze({ status: 'ready', ...studyAction.intent });
  }

  return Object.freeze({ browse, open });
}
