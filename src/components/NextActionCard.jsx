// ============================================================
// NextActionCard — "กิจกรรมแนะนำสำหรับคุณ" study coach surface
// ============================================================

import { useMemo, useState } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';
import { fmtThaiDate } from '../data/schedule.js';

export default function NextActionCard({
  nextExam,
  quickStats,
  cardStats,
  accBySubject,
  subjects,
  history,
  pendingResume,
  countdown,
  onPickResume,
  onDismissResume,
  onPickExamPrep,
  onPickPanic,
  onPickSR,
  onPickWrong,
  onPickWeakSubject,
  onPickRandom,
  onOpenSchedule,
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
    if (nextExam && nextExam.daysLeft != null && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 1 && onPickPanic) {
      out.push({
        title: nextExam.daysLeft === 0 ? 'สอบวันนี้ — ทบทวนเร่งด่วน' : 'พรุ่งนี้สอบ — จัดชุดทบทวนให้พอดีเวลา',
        sub: 'โฟกัสโจทย์สำคัญใน 30 นาที',
        cta: 'เริ่ม 30 นาที',
        kind: 'panic',
        onClick: () => onPickPanic('30'),
      });
    } else if (nextExam && nextExam.daysLeft != null && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 7) {
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
  }, [nextExam, quickStats, cardStats, accBySubject, subjects, history, pendingResume, onPickResume, onDismissResume, onPickExamPrep, onPickPanic, onPickSR, onPickWrong, onPickWeakSubject, onPickRandom]);

  if (actions.length === 0) return null;

  const primaryAction = actions[0];
  const secondaryActions = actions.slice(1);
  const showExamContext = nextExam
    && nextExam.daysLeft != null
    && nextExam.daysLeft >= 0
    && nextExam.daysLeft <= 30;
  const examTitle = nextExam?.title || nextExam?.subject_name || 'กำหนดสอบถัดไป';
  const guidanceNote = pendingResume
    ? 'กลับไปทำต่อได้โดยไม่เสียคำตอบที่ทำไว้'
    : nextExam?.daysLeft != null && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 7
      ? 'จัดลำดับจากกำหนดสอบที่ใกล้ที่สุด'
      : history?.length
        ? 'เลือกจากกำหนดสอบและประวัติการฝึกของคุณ'
        : 'เริ่มจาก 1 ข้อ แล้วค่อยปรับตามประวัติการฝึก';

  const renderAction = (action, { primary = false } = {}) => {
    const main = (
      <button
        key={action.kind}
        type="button"
        onClick={action.onClick}
        className={`vmx-next-action${primary ? ' is-primary' : ''}`}
        data-kind={action.kind}
      >
        <span className="vmx-next-action-copy">
          {primary && <span className="vmx-next-action-kicker">แนะนำตอนนี้</span>}
          <span className="vmx-next-action-title">{action.title}</span>
          <span className="vmx-next-action-sub">{action.sub}</span>
        </span>
        <span className="vmx-next-action-cta">{action.cta}</span>
      </button>
    );

    if (!action.secondary) return main;

    // Buttons cannot nest, so resume + discard remain separate controls.
    return (
      <div className="vmx-next-action-row" key={action.kind}>
        {main}
        <button
          type="button"
          className="vmx-btn vmx-btn-ghost vmx-btn-sm"
          onClick={() => setConfirmDiscard(true)}
          title={action.secondary.title}
        >
          {action.secondary.label}
        </button>
      </div>
    );
  };

  return (
    <section className="vmx-next-actions" aria-labelledby="vmx-next-actions-title">
      <header className="vmx-next-actions-header">
        <div>
          <span className="vmx-next-actions-kicker">แผนฝึกวันนี้</span>
          <h2 id="vmx-next-actions-title" className="vmx-next-actions-heading">
            ทำอะไรต่อดี
          </h2>
        </div>
        <span className="vmx-next-actions-note">{guidanceNote}</span>
      </header>

      <div className={`vmx-next-actions-layout${showExamContext ? ' has-exam' : ''}`}>
        <div className="vmx-next-actions-plan">
          {renderAction(primaryAction, { primary: true })}

          {secondaryActions.length > 0 && (
            <div className="vmx-next-actions-secondary" role="group" aria-label="ตัวเลือกฝึกสำรอง">
              {secondaryActions.map((action) => renderAction(action))}
            </div>
          )}
        </div>

        {showExamContext && (
          <button
            type="button"
            className="vmx-next-exam"
            onClick={() => onOpenSchedule?.()}
            aria-label={`ดูตารางสอบ ${examTitle}, ${countdown?.text || `อีก ${nextExam.daysLeft} วัน`}`}
          >
            <span className="vmx-next-exam-copy">
              <span className="vmx-next-exam-label">สอบถัดไป</span>
              <span className="vmx-next-exam-title">{examTitle}</span>
              <span className="vmx-next-exam-meta">
                {fmtThaiDate(nextExam.date)}{nextExam.time ? `, ${nextExam.time}` : ''}
              </span>
              <span className="vmx-next-exam-link">ดูตารางสอบ</span>
            </span>
            <span className={`vmx-next-exam-count${countdown ? ' is-imminent' : ''}`} aria-hidden="true">
              {countdown ? (
                <strong>{countdown.text}</strong>
              ) : (
                <>
                  <strong>{nextExam.daysLeft}</strong>
                  <span>วัน</span>
                </>
              )}
            </span>
          </button>
        )}
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
