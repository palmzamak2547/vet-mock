// ============================================================
// SharedSetCard: a set sent by link, as the friend sees it
// ============================================================
// Drawn the same on the sender's share sheet ("เพื่อนจะได้รับแบบนี้") and on
// the sign-in wall a friend meets before opening it. Type only: the subject,
// the topic when the whole set is one, and how many questions. No picture
// (a cover comes from the repository's own art through scripts/og, never one
// whose origin is not recorded), no score, no name.
// ============================================================

import { SUBJECTS } from '../data/curriculum.js';

// The app's timed practice gives each question a minute; api/s.js says the same.
const MINUTES_PER_QUESTION = 1;

/** The words of the card for a list of { subject, topic? } items. */
export function sharedSetWords(items) {
  const list = Array.isArray(items) ? items : [];
  const subjects = [...new Set(list.map((q) => q?.subject).filter(Boolean))];
  const one = subjects.length === 1 ? SUBJECTS.find((s) => s.id === subjects[0]) : null;
  const topics = [...new Set(list.map((q) => q?.topic).filter(Boolean))];
  const topic = one && topics.length === 1 && list.every((q) => q?.topic === topics[0])
    ? one.topics?.find((t) => t.id === topics[0])?.label?.replace(/^[\d\s.\-]+/, '').trim() || null
    : null;
  const n = list.length;
  return {
    title: one ? one.name : subjects.length > 1 ? `${subjects.length} วิชา` : 'ชุดโจทย์',
    topic,
    count: `${n} ข้อ ใช้เวลาราว ${Math.max(1, n * MINUTES_PER_QUESTION)} นาที`,
  };
}

export default function SharedSetCard({ items, className = '' }) {
  const w = sharedSetWords(items);
  return (
    <div className={`vmx-set-card ${className}`.trim()} data-testid="shared-set-card">
      <span className="vmx-set-card-title">{w.title}</span>
      {w.topic ? <span className="vmx-set-card-topic">{w.topic}</span> : null}
      <span className="vmx-set-card-count">{w.count}</span>
    </div>
  );
}
