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
  onPickExamPrep,
  onPickSR,
  onPickWrong,
  onPickWeakSubject,
  onPickRandom,
}) {
  const actions = useMemo(() => {
    const out = [];

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

    // Fallback: random Q if nothing else applies
    if (out.length === 0) {
      out.push({
        icon: '🎲',
        title: 'ฝึก 1 ข้อด่วน',
        sub: history?.length === 0
          ? 'เริ่มทำข้อแรก — ระบบจะเริ่มทำสถิติให้'
          : 'สุ่มจากทุกวิชาในปีนี้',
        cta: 'ลุย',
        kind: 'random',
        onClick: () => onPickRandom?.(),
      });
    }

    return out.slice(0, 3);
  }, [nextExam, quickStats, cardStats, accBySubject, subjects, history, onPickExamPrep, onPickSR, onPickWrong, onPickWeakSubject, onPickRandom]);

  if (actions.length === 0) return null;

  return (
    <div style={{
      marginBottom: 24,
      padding: '18px 18px 16px',
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(74, 107, 74, 0.06), rgba(184, 137, 64, 0.04))',
      border: '1px solid var(--clr-sage)',
      boxShadow: '0 1px 0 rgba(74, 107, 74, 0.08)',
    }}>
      <div style={{
        fontSize: 11,
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--clr-sage)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 700,
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        🎯 วันนี้ทำอะไรดี
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {actions.map((a, i) => (
          <button
            key={a.kind}
            type="button"
            onClick={a.onClick}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 14px',
              borderRadius: 12,
              background: i === 0 ? 'var(--clr-surface)' : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${i === 0 ? 'var(--clr-sage)' : 'var(--clr-border)'}`,
              transition: 'background 120ms, border-color 120ms, transform 100ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--clr-surface)';
              e.currentTarget.style.borderColor = 'var(--clr-sage)';
            }}
            onMouseLeave={(e) => {
              if (i !== 0) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderColor = 'var(--clr-border)';
              }
            }}
          >
            <div style={{ fontSize: 26, lineHeight: 1, flex: '0 0 auto' }}>{a.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1.25,
                color: 'var(--clr-ink)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {a.title}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--clr-ink-soft)',
                fontFamily: 'JetBrains Mono, monospace',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {a.sub}
              </div>
            </div>
            <div style={{
              flex: '0 0 auto',
              padding: '6px 12px',
              borderRadius: 999,
              background: i === 0 ? 'var(--clr-sage)' : 'transparent',
              border: i === 0 ? '1px solid var(--clr-sage)' : '1px solid var(--clr-border)',
              color: i === 0 ? 'var(--clr-bg)' : 'var(--clr-ink-soft)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}>
              {a.cta} →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
