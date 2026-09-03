// ============================================================
// WikiLinkForQuestion — "read the checked summary" button
// ============================================================
// One shared button for every surface that links a question to its
// VetWiki article: review, SR reveal and (new) practice instant
// feedback. The copy says WHY the tap is worth it — a topic where
// the lecturer and the literature disagree is the most exam-useful
// thing this corpus holds, and a generic "read the summary" link
// gives a student no reason to tap it.
//
// articleForQuestion (registry-lite), not hasTopic: questions pulled
// from past-paper compilations carry the compilation's name as their
// topic, so matching on topic alone leaves them with nowhere to go
// even when the right article exists. Keep this import on
// registry-lite — the caller views only need the yes/no + route, not
// the ~125 KB topic catalog (that catalog is why #15 exists).
// ============================================================

import { articleForQuestion } from '../lib/vetwiki/registry-lite.js';
// The generated per-topic summary, not the full conflict index: the
// index carries the whole 368 KB corrections table, and this button
// only needs the count (same choice ReviewView made when it moved
// off the index — Home prefetches these surfaces at idle).
import { conflictCountFor } from '../lib/vetwiki/conflict-summary.generated.js';
import { FEATURE_FLAGS } from '../lib/feature-registry.js';

export default function WikiLinkForQuestion({ q, onOpenWiki, onlyWhenWrong = true, correct = false }) {
  if (!onOpenWiki) return null;
  if (FEATURE_FLAGS.VETWIKI_ENABLED === false) return null;
  // Correct answers don't need the nudge — the moment that earns a
  // read is the miss. SR reveal passes onlyWhenWrong={false} because
  // the student explicitly asked to see the answer there.
  if (onlyWhenWrong && correct) return null;
  const article = articleForQuestion(q);
  if (!article) return null;
  const conflicts = conflictCountFor(article.subject, article.topic);
  return (
    <button
      type="button"
      onClick={() => onOpenWiki(article.subject, article.topic, article.sectionId)}
      style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, minHeight: 44, color: conflicts > 0 ? 'var(--clr-rose-text)' : 'var(--clr-sage-text)', fontSize: 12.5, fontWeight: 600 }}
      title={conflicts > 0
        ? 'หัวข้อนี้มีจุดที่หลักฐานไม่ตรงกับที่บรรยาย พร้อมคำแนะนำว่าเวลาสอบควรตอบอะไร'
        : 'อ่านสรุปหัวข้อนี้แบบตรวจสอบที่มาได้'}
    >
      {conflicts > 0
        ? `🧬 หัวข้อนี้มี ${conflicts} จุดที่หลักฐานไม่ตรงกับที่บรรยาย →`
        : '🧬 อ่านสรุปเรื่องนี้ใน VetWiki →'}
    </button>
  );
}
