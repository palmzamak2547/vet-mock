// ============================================================
// NextActionCard — "กิจกรรมแนะนำสำหรับคุณ" study coach surface
// ============================================================

import { useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';
import { MotionButton } from './MotionFeedback.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { buildDailyPlan } from '../lib/daily-plan.js';
import { fmtThaiDate } from '../data/schedule.js';
import { seasonalMochiKey } from '../lib/seasonal-mochi.js';
import { SEASONAL_MOCHI } from '../data/art.js';

export default function NextActionCard({
  nextExam,
  lastExamDate = null,
  examContext = true,
  quickStats,
  cardStats,
  accBySubject,
  subjects,
  practiceCounts,
  history,
  pendingResume,
  countdown,
  onPickResume,
  onDismissResume,
  onPickExamPrep,
  onPickPanic,
  onPickSR,
  onPickWrong,
  onPickRandom,
  onOpenSchedule,
  onPickPlannedPractice,
}) {
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [minutes, setMinutes] = useLocalStorage('vmx-daily-minutes', 30);

  const { actions, plan } = useMemo(() => {
    const out = [];

    // Priority 0: resume in-flight exam
    if (pendingResume) {
      // Derive from the timestamp so the number is right at the moment it is
      // read, not at the moment the page mounted. ageMin remains the fallback
      // for a resume record saved before savedAt was carried through.
      const mins = pendingResume.savedAt
        ? Math.max(0, Math.round((Date.now() - pendingResume.savedAt) / 60000))
        : pendingResume.ageMin;
      const timeAgo = mins < 1
        ? 'เมื่อครู่นี้'
        : mins < 60
          ? `${mins} นาทีที่แล้ว`
          : `${Math.round(mins / 60)} ชั่วโมงที่แล้ว`;
      out.push({
        title: pendingResume.legacy ? 'พบชุดค้างจากรุ่นก่อน' : pendingResume.submitted ? 'กู้ผลชุดที่ยังบันทึกไม่สำเร็จ' : 'ทำต่อจากครั้งล่าสุด',
        sub: pendingResume.legacy ? 'ยืนยันเจ้าของก่อนเปิดคำตอบและกู้คืน' : `ตอบไปแล้ว ${pendingResume.answered}/${pendingResume.qCount} ข้อ (${timeAgo})`,
        cta: pendingResume.legacy ? 'ตรวจแล้วกู้คืน' : pendingResume.submitted ? 'กู้ผลชุดนี้' : 'ทำต่อ',
        kind: 'resume',
        onClick: () => onPickResume?.(),
        // Escape hatch — a user who wants a clean start could not drop the
        // in-flight set from here (the discard action existed in App but its
        // only UI was dead-coded in HomeView).
        secondary: !pendingResume.legacy && onDismissResume ? { label: 'ไม่ทำต่อ', title: 'ลบชุดที่ค้างไว้ แล้วเริ่มใหม่' } : null,
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
        // The date, not "อีก N วัน": the hero countdown above counts real time
        // (5 วัน 15 ชม.) while daysLeft counts calendar days (6), and the two
        // on one screen read as a contradiction.
        sub: nextExam.daysLeft === 0 ? 'กำหนดสอบวันนี้' : `กำหนดสอบ ${fmtThaiDate(nextExam.date)}`,
        cta: 'เริ่มฝึก',
        kind: 'exam',
        onClick: () => onPickExamPrep?.(nextExam),
      });
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

    if (pendingResume) return { actions: out.slice(0, 1) };
    // A brand-new student is invited by the hero to try one question in 20
    // seconds. The plan below then offered a 12-question, 24-minute session as
    // the prominent button, so the two surfaces described very different first
    // steps. With no history there is nothing to plan from anyway: honour the
    // small first step the hero promised.
    if (!history?.length) return { actions: out.slice(0, 1) };
    const available = id => practiceCounts == null ? Infinity : (practiceCounts[id] || 0);
    const weak = Object.entries(accBySubject || {}).filter(([id, a]) =>
      subjects?.some(s => s.id === id) && available(id) > 0
      && Number.isFinite(a?.total) && a.total >= 5
      && Number.isFinite(a?.correct) && a.correct >= 0 && a.correct / a.total < 0.75)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)[0];
    const exam = Number.isFinite(nextExam?.daysLeft) && nextExam.daysLeft >= 0 && nextExam.daysLeft <= 7
      && subjects?.some(s => s.id === nextExam.subject) && available(nextExam.subject) > 0;
    const plan = buildDailyPlan({ minutes, due: cardStats?.due, wrong: quickStats?.wrongCount,
      exam, examUrgent: exam && nextExam.daysLeft <= 1, weakSubject: weak?.[0],
      practiceAvailable: available(exam ? nextExam.subject : weak?.[0] || 'all') });
    return { plan, actions: plan.steps.map(step => ({ kind: step.kind, cta: step.kind === 'sr' ? 'เริ่มทบทวน' : 'เริ่มฝึก',
      title: step.kind === 'sr' ? `ทบทวนตามรอบ ${step.count} ข้อ`
        : step.kind === 'wrong' ? `ทบทวนข้อผิด ${step.count} ข้อ`
        : step.kind === 'exam' ? `เตรียม ${nextExam.subject_name || nextExam.title || 'วิชาที่ใกล้สอบ'} ${step.count} ข้อ`
        : step.kind === 'weak' ? `ฝึก ${subjects?.find(s => s.id === step.subject)?.name || step.subject} ${step.count} ข้อ`
        : `ฝึกโจทย์ ${step.count} ข้อ`,
      sub: `${step.kind === 'exam' ? `กำหนดสอบ ${fmtThaiDate(nextExam.date)}`
        : step.kind === 'sr' ? 'ถึงรอบทบทวนในช่วงที่เลือก'
        : step.kind === 'wrong' ? 'ข้อที่ยังตอบผิดจากประวัติการฝึก'
        : step.kind === 'weak' ? `ความถูกต้อง ${Math.round(weak[1].correct / weak[1].total * 100)}% จาก ${weak[1].total} ครั้งใน 90 วัน`
        : 'โจทย์ในปีและช่วงสอบที่เลือก'}, ประมาณ ${step.minutes} นาที`,
      onClick: () => step.kind === 'sr' ? onPickSR?.(step.count)
        : step.kind === 'wrong' ? onPickWrong?.(step.count)
        : onPickPlannedPractice?.(step.kind === 'exam' ? nextExam.subject : step.kind === 'weak' ? step.subject : 'all', step.count),
    })) };
  }, [nextExam, quickStats, cardStats, accBySubject, subjects, practiceCounts, history, pendingResume, onPickResume, onDismissResume, onPickExamPrep, onPickPanic, onPickSR, onPickWrong, onPickRandom, minutes, onPickPlannedPractice]);

  if (actions.length === 0) return null;

  const primaryAction = actions[0];
  const secondaryActions = actions.slice(1);
  // `examContext` is false when the hero already carries the countdown —
  // two counters for one paper on one screen is clutter, not emphasis.
  const showExamContext = examContext && nextExam
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
      <MotionButton
        key={action.kind}
        effect={primary ? 'magnet' : 'ripple'}
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
      </MotionButton>
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

  const seasonal = (() => {
    const key = seasonalMochiKey({ daysLeft: nextExam?.daysLeft ?? null, lastExamDate });
    return key ? SEASONAL_MOCHI[key] || null : null;
  })();

  return (
    <section className="vmx-next-actions" aria-labelledby="vmx-next-actions-title">
      <header className="vmx-next-actions-header">
        {/* The header is flex with space-between, so it must keep exactly TWO
            children — a third one pushes the title into the middle of the row.
            The picture belongs WITH the title, not beside it as a peer. */}
        <div className="vmx-next-actions-lead">
          {seasonal && (
            // Changes the picture, never the words — and only inside a window
            // the schedule actually puts the student in.
            <img
              className="vmx-next-actions-mochi"
              src={seasonal.src}
              alt={seasonal.alt}
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
            />
          )}
          <div>
            <span className="vmx-next-actions-kicker">แผนฝึกวันนี้</span>
            <h2 id="vmx-next-actions-title" className="vmx-next-actions-heading">
              ทำอะไรต่อดี
            </h2>
          </div>
        </div>
        {pendingResume || !plan ? <span className="vmx-next-actions-note">{guidanceNote}</span> : (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            วันนี้มีเวลา
            <select id="vmx-daily-minutes" value={plan.budget} onChange={e => setMinutes(Number(e.target.value))}
              style={{ minHeight: 44, padding: '4px 7px', borderRadius: 8, background: 'var(--clr-surface)', color: 'var(--clr-ink)' }}>
              {[15, 30, 60].map(n => <option key={n} value={n}>{n} นาที</option>)}
            </select>
          </label>
        )}
      </header>

      <div className={`vmx-next-actions-layout${showExamContext ? ' has-exam' : ''}`}>
        <div className="vmx-next-actions-plan">
          {renderAction(primaryAction, { primary: true })}

          {secondaryActions.length > 0 && (
            <div className="vmx-next-actions-secondary" role="group" aria-label="กิจกรรมถัดไปในแผน">
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

      {plan && <p role="status" style={{ margin: 'var(--space-3) 0 0', color: 'var(--clr-ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
        เผื่ออ่านเฉลย {plan.reviewMinutes} นาที, แผนปรับตามผลหลังฝึกแต่ละชุด
      </p>}

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
