// ============================================================
// NextActionCard — "กิจกรรมแนะนำสำหรับคุณ" study coach surface
// ============================================================

import { useMemo, useState } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function NextActionCard({
  nextExam,
  quickStats,
  cardStats,
  accBySubject,
  subjects,
  history,
  pendingResume,
  onPickResume,
  onDismissResume,
  onPickExamPrep,
  onPickSR,
  onPickWrong,
  onPickWeakSubject,
  onPickRandom,
}) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const actions = useMemo(() => {
    const out = [];

    // Priority 0: resume in-flight exam
    if (pendingResume) {
      const timeAgo = pendingResume.ageMin < 60
        ? `${pendingResume.ageMin} นาทีที่แล้ว`
        : `${Math.round(pendingResume.ageMin / 60)} ชั่วโมงที่แล้ว`;
      out.push({
        title: 'ทำต่อจากครั้งล่าสุด',
        sub: `ตอบไปแล้ว ${pendingResume.answered}/${pendingResume.qCount} ข้อ (${timeAgo})`,
        cta: 'ทำต่อ',
        kind: 'resume',
        onClick: () => onPickResume?.(),
        // Escape hatch — a user who wants a clean start could not drop the
        // in-flight set from here (the discard action existed in App but its
        // only UI was dead-coded in HomeView).
        secondary: onDismissResume ? { label: 'ไม่ทำต่อ', title: 'ลบชุดที่ค้างไว้ แล้วเริ่มใหม่' } : null,
      });
    }

    // Priority 1: imminent exam (≤7 days)
    if (nextExam && nextExam.daysLeft != null && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 7) {
      out.push({
        title: `ติว ${nextExam.subject_name || nextExam.title || 'วิชาที่จะสอบ'}`,
        sub: nextExam.daysLeft === 0 ? 'กำหนดสอบวันนี้' : `กำหนดสอบในอีก ${nextExam.daysLeft} วัน`,
        cta: 'เริ่มฝึก',
        kind: 'exam',
        onClick: () => onPickExamPrep?.(nextExam),
      });
    }

    // Priority 2: SR cards due
    if (
      cardStats?.due >= 5
      && cardStats.due <= 100
      && Array.isArray(history)
      && history.length >= 10
    ) {
      const target = Math.min(cardStats.due, 20);
      out.push({
        title: `ทบทวนความจำ ${target} ข้อ`,
        sub: cardStats.due > target
          ? `ค้างรวม ${cardStats.due} ข้อ (ทำวันละ ~${target} ข้อ)`
          : 'ทบทวนข้อสอบตามรอบระยะเวลา',
        cta: 'เริ่มทบทวน',
        kind: 'sr',
        onClick: () => onPickSR?.(),
      });
    }

    // Priority 3: wrong-streak review
    if (quickStats?.wrongCount >= 5) {
      const target = Math.min(quickStats.wrongCount, 10);
      out.push({
        title: `ทบทวนข้อที่ตอบผิด ${target} ข้อ`,
        sub: `มีข้อสอบที่ตอบผิดในประวัติรวม ${quickStats.wrongCount} ข้อ`,
        cta: 'ทบทวนข้อผิด',
        kind: 'wrong',
        onClick: () => onPickWrong?.(),
      });
    }

    // Priority 4: weakest subject
    if (out.length < 3 && accBySubject) {
      const candidates = Object.entries(accBySubject)
        .filter(([, acc]) => acc && acc.total >= 5)
        .map(([id, acc]) => ({ id, pct: acc.correct / acc.total, total: acc.total }))
        .sort((a, b) => a.pct - b.pct);
      if (candidates.length > 0 && candidates[0].pct < 0.75) {
        const weakest = candidates[0];
        const subj = subjects?.find((s) => s.id === weakest.id);
        out.push({
          title: `เสริมจุดอ่อน ${subj?.name || weakest.id}`,
          sub: `ความถูกต้อง ${Math.round(weakest.pct * 100)}% (ประวัติ 90 วันล่าสุด)`,
          cta: 'ฝึกซ้อม',
          kind: 'weak',
          onClick: () => onPickWeakSubject?.(weakest.id),
        });
      }
    }

    // Fallback: random Q
    if (out.length === 0) {
      out.push({
        title: history?.length === 0
          ? 'ลองทำ 1 ข้อแรก'
          : 'ฝึกสุ่ม 1 ข้อด่วน',
        sub: history?.length === 0
          ? 'เริ่มสะสมประวัติการทำโจทย์ของคุณวันนี้'
          : 'สุ่มโจทย์จากคลังวิชาในปีการศึกษานี้',
        cta: history?.length === 0 ? 'เริ่มทำ' : 'เริ่มฝึก',
        kind: 'random',
        onClick: () => onPickRandom?.(),
      });
    }

    return out.slice(0, 3);
  }, [nextExam, quickStats, cardStats, accBySubject, subjects, history, pendingResume, onPickResume, onDismissResume, onPickExamPrep, onPickSR, onPickWrong, onPickWeakSubject, onPickRandom]);

  if (actions.length === 0) return null;

  return (
    <section className="vmx-next-actions" aria-labelledby="vmx-next-actions-title">
      <h2 id="vmx-next-actions-title" className="vmx-next-actions-heading">
        กิจกรรมแนะนำสำหรับคุณ
      </h2>
      <div className="vmx-next-actions-list">
        {actions.map((a, i) => {
          const main = (
            <button
              key={a.kind}
              type="button"
              onClick={a.onClick}
              className={`vmx-next-action${i === 0 ? ' is-primary' : ''}`}
            >
              <span className="vmx-next-action-copy">
                <span className="vmx-next-action-title">{a.title}</span>
                <span className="vmx-next-action-sub">{a.sub}</span>
              </span>
              <span className="vmx-next-action-cta">{a.cta}</span>
            </button>
          );
          if (!a.secondary) return main;
          // Buttons can't nest, so the pair sits in a row instead.
          return (
            <div className="vmx-next-action-row" key={a.kind}>
              {main}
              <button
                type="button"
                className="vmx-btn vmx-btn-ghost vmx-btn-sm"
                onClick={() => setConfirmDiscard(true)}
                title={a.secondary.title}
              >
                {a.secondary.label}
              </button>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="ไม่ทำชุดที่ค้างไว้ต่อ?"
        body="ชุดที่ทำค้างไว้จะถูกลบ และคำตอบที่ตอบไปแล้วจะหายไป"
        note="เริ่มชุดใหม่ได้ทันทีหลังจากนี้"
        confirmLabel="ลบแล้วเริ่มใหม่"
        cancelLabel="เก็บไว้ก่อน"
        tone="danger"
        onConfirm={() => { setConfirmDiscard(false); onDismissResume?.(); }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </section>
  );
}
