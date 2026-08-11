// ============================================================
// Canonical reading-progress identity
// ============================================================
//
// ReadingChecklistView historically stored progress under a bare topic id:
//
//   readingChecklist[topic] = completedAt
//
// Topic ids are only unique inside a subject, so a legacy key such as
// `nutrition` can accidentally mark several subjects as read. New writes use
// a compound subject/topic key. Reads keep the legacy fallback until stored
// data has been migrated.
// ============================================================

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function asChecklist(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function requireId(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`${label} must be a non-empty string`);
  }
  return value;
}

/** Stable storage key for one curriculum topic. */
export function topicProgressKey(subject, topic) {
  const subjectId = requireId(subject, 'subject');
  const topicId = requireId(topic, 'topic');
  return `topic:${encodeURIComponent(subjectId)}/${encodeURIComponent(topicId)}`;
}

/**
 * Read canonical progress first, then fall back to the historical bare key.
 * An own canonical `false` value is an intentional unread sentinel: it must
 * override a truthy legacy key that may still belong to another subject.
 */
export function isTopicRead(checklist, subject, topic) {
  const source = asChecklist(checklist);
  const canonicalKey = topicProgressKey(subject, topic);
  if (hasOwn(source, canonicalKey)) return Boolean(source[canonicalKey]);
  return hasOwn(source, topic) && Boolean(source[topic]);
}

/**
 * Pure set/toggle helper. It never removes the legacy key because that key may
 * still carry progress for another subject with the same topic id.
 *
 * `nextRead` accepts true, false, or 'toggle'. Writing false deliberately
 * stores a sentinel instead of deleting the canonical key, so legacy fallback
 * cannot turn the topic back on.
 */
export function setTopicRead(
  checklist,
  subject,
  topic,
  nextRead = 'toggle',
  completedAt = Date.now(),
) {
  const source = asChecklist(checklist);
  const canonicalKey = topicProgressKey(subject, topic);
  const read = nextRead === 'toggle' ? !isTopicRead(source, subject, topic) : nextRead;

  if (typeof read !== 'boolean') {
    throw new TypeError("nextRead must be true, false, or 'toggle'");
  }
  if (read && (!Number.isFinite(completedAt) || completedAt <= 0)) {
    throw new TypeError('completedAt must be a positive finite number');
  }

  const next = { ...source };
  if (!read) {
    next[canonicalKey] = false;
    return next;
  }

  // Setting an already-canonical completion is idempotent and keeps the first
  // completion time. A legacy-only completion is promoted with its original
  // timestamp when possible; otherwise use the caller-provided time.
  if (hasOwn(source, canonicalKey)) {
    next[canonicalKey] = source[canonicalKey] || completedAt;
  } else {
    const legacy = hasOwn(source, topic) ? source[topic] : null;
    next[canonicalKey] = Number.isFinite(legacy) && legacy > 0 ? legacy : completedAt;
  }
  return next;
}

/**
 * Pure one-time migration for a flat curriculum subject list such as
 * `SUBJECTS`. Only globally unique legacy topic ids are safe to move. Bare
 * keys shared by several subjects remain in place until each subject gets an
 * explicit canonical true/false write.
 */
export function migrateUniqueTopicProgress(checklist, subjects) {
  const source = asChecklist(checklist);
  if (!Array.isArray(subjects) || subjects.length === 0) return source;

  const ownersByTopic = new Map();
  for (const subject of subjects) {
    if (!subject || typeof subject.id !== 'string' || subject.id.length === 0 || !Array.isArray(subject.topics)) continue;
    for (const topic of subject.topics) {
      if (!topic || typeof topic.id !== 'string' || topic.id.length === 0) continue;
      if (!ownersByTopic.has(topic.id)) ownersByTopic.set(topic.id, new Set());
      ownersByTopic.get(topic.id).add(subject.id);
    }
  }

  let next = source;
  for (const [topic, owners] of ownersByTopic) {
    if (owners.size !== 1 || !hasOwn(source, topic)) continue;
    if (next === source) next = { ...source };
    const [subject] = owners;
    const canonicalKey = topicProgressKey(subject, topic);
    if (!hasOwn(next, canonicalKey)) next[canonicalKey] = source[topic];
    delete next[topic];
  }
  return next;
}
