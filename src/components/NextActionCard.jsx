// ============================================================
// NextActionCard — "วันนี้ทำอะไรดี" study coach surface
// ============================================================
//
// Inspired by Palm's friend's review (2026-05-12): "เปิดมาแล้วมัน
// บอกเลยว่า 'วันนี้ควรทำ COM III 15 ข้อ + ทวนผิด 5 ข้อ + อ่าน
// คาบ 23' แบบ personalized". Goal: turn the home page from a
// menu-of-tools into a 1-card coach surface.
//
// Algorithm (priority-ordered, picks up to 3 actions):
//   1. Imminent exam (≤7 days) → "ติว <subject>"
//   2. SR cards due (≥5)        → "ทบทวน SR N ข้อ"
//   3. Wrong streak (≥5)        → "ทำข้อที่เคยผิด N ข้อ"
//   4. Weak subject (lowest acc ≥5 attempts)
//   5. Fallback: random Q
//
// IRON RULE 0: numbers shown come from real localStorage data
// (history, srCards, bookmarks). No fabricated recommendations.
// ============================================================

import { useMemo } from 'react';

export default function NextActionCard({
  nextExam,
  quickStats,
  cardStats,
  accBySubject,
  subjects,
  history,
  // Round 2A 2026-05-18: consolidate "resume in-flight exam" into the
  // priority-0 slot of the coach card (was a separate banner). Palm
  // spec wanted "ทำชุดเดิมต่อ" as part of the primary action card.
  pendingResume,
  onPickResume,
  onPickExamPrep,
  onPickSR,
  onPickWrong,
  onPickWeakSubject,
  onPickRandom,
}) {
  const actions = useMemo(() => {
    const out = [];

    // Priority 0: resume in-flight exam — Palm spec 2026-05-18 round 2.
    // Beats every other action because the user already started this;
    // bringing them back finishes a session they were mid-way through.
    if (pendingResume) {
      const timeAgo = pendingResume.ageMin < 60
        ? `${pendingResume.ageMin} นาทีที่แล้ว`
        : `${Math.round(pendingResume.ageMin / 60)} ชม. ที่แล้ว`;
      out.push({
        icon: '▶️',
        title: 'ทำชุดเดิมต่อ',
        sub: `ตอบไปแล้ว ${pendingResume.answered}/${pendingResume.qCount} · ${timeAgo}`,
        cta: 'ทำต่อ',
        kind: 'resume',
        onClick: () => onPickResume?.(),
      });
    }

    // Priority 1: imminent exam (≤7 days)
    if (nextExam && nextExam.daysLeft != null && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 7) {
      out.push({
        icon: '📅',
        title: `ติว ${nextExam.subject_name || nextExam.title || 'วิชาที่จะสอบ'}`,
        sub: nextExam.daysLeft === 0 ? 'สอบวันนี้' : `สอบใน ${nextExam.daysLeft} วัน`,
        cta: 'เริ่มฝึก',
        kind: 'exam',
        onClick: () => onPickExamPrep?.(nextExam),
      });
    }

    // Priority 2: SR cards due — gated on real history.
    // cardStats.due is reviewed-only (sm2.js fix 2026-05-16) so this
    // already excludes unseen cards. We additionally gate on ≥10
    // history entries + realistic daily band (5-100) so a user with
    // 3 cards reviewed yesterday doesn't get an SR push today.
    if (
      cardStats?.due >= 5
      && cardStats.due <= 100
      && Array.isArray(history)
      && history.length >= 10
    ) {
      const target = Math.min(cardStats.due, 20);
      out.push({
        icon: '🧠',
        title: `ทบทวน SR ${target} ข้อ`,
        sub: cardStats.due > target
          ? `(ค้างรวม ${cardStats.due} — ทำวันละ ~${target})`
          : 'ทบทวน flash card ที่ครบ interval',
        cta: 'เริ่ม SR',
        kind: 'sr',
        onClick: () => onPickSR?.(),
      });
    }

    // Priority 3: wrong-streak review
    if (quickStats?.wrongCount >= 5) {
      const target = Math.min(quickStats.wrongCount, 10);
      out.push({
        icon: '⚠️',
        title: `ทำข้อที่เคยผิด ${target} ข้อ`,
        sub: `(รวม ${quickStats.wrongCount} ข้อในประวัติ)`,
        cta: 'ทำข้อผิด',
        kind: 'wrong',
        onClick: () => onPickWrong?.(),
      });
    }

    // Priority 4: weakest subject (lowest accuracy among ≥5 attempts)
    if (out.length < 3 && accBySubject) {
      const candidates = Object.entries(accBySubject)
        .filter(([, acc]) => acc && acc.total >= 5)
        .map(([id, acc]) => ({ id, pct: acc.correct / acc.total, total: acc.total }))
        .sort((a, b) => a.pct - b.pct);
      if (candidates.length > 0 && candidates[0].pct < 0.75) {
        const weakest = candidates[0];
        const subj = subjects?.find((s) => s.id === weakest.id);
        out.push({
          icon: '🎯',
          title: `ลุย ${subj?.name || weakest.id}`,
          sub: `accuracy ${Math.round(weakest.pct * 100)}% ใน 90 วันล่าสุด`,
          cta: 'ฝึกซ้อม',
          kind: 'weak',
          onClick: () => onPickWeakSubject?.(weakest.id),
        });
      }
    }

    // Fallback: random Q if nothing else applies.
    // New users (history empty) get an aggressive "20 วินาที" CTA
    // — Palm spec 2026-05-18 round 2: turn the empty fallback into a
    // commitment-low first action ("just 20 seconds, just 1 Q").
    if (out.length === 0) {
      out.push({
        icon: '🎲',
        title: history?.length === 0
          ? 'ลอง 1 ข้อ — ใช้เวลา ~20 วินาที'
          : 'ฝึก 1 ข้อด่วน',
        sub: history?.length === 0
          ? 'ทำข้อแรกของคุณวันนี้ — ระบบจะเริ่มเก็บสถิติให้'
          : 'สุ่มจากทุกวิชาในปีนี้',
        cta: history?.length === 0 ? 'เริ่มเลย' : 'ลุย',
        kind: 'random',
        onClick: () => onPickRandom?.(),
      });
    }

    return out.slice(0, 3);
  }, [nextExam, quickStats, cardStats, accBySubject, subjects, history, pendingResume, onPickResume, onPickExamPrep, onPickSR, onPickWrong, onPickWeakSubject, onPickRandom]);

  if (actions.length === 0) return null;

  return (
    <section className="vmx-next-actions" aria-labelledby="vmx-next-actions-title">
      <h2 id="vmx-next-actions-title" className="vmx-next-actions-heading">
        <span aria-hidden>🎯</span> วันนี้ทำอะไรดี
      </h2>
      <div className="vmx-next-actions-list">
        {actions.map((a, i) => (
          <button
            key={a.kind}
            type="button"
            onClick={a.onClick}
            className={`vmx-next-action${i === 0 ? ' is-primary' : ''}`}
          >
            <span className="vmx-next-action-icon" aria-hidden>{a.icon}</span>
            <span className="vmx-next-action-copy">
              <span className="vmx-next-action-title">{a.title}</span>
              <span className="vmx-next-action-sub">{a.sub}</span>
            </span>
            <span className="vmx-next-action-cta">{a.cta} <span aria-hidden>→</span></span>
          </button>
        ))}
      </div>
    </section>
  );
}
