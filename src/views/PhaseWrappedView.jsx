// ============================================================
// PhaseWrappedView — host view for the Phase Wrapped recap
// ============================================================
//
// Mounted on the 'phase-wrapped' route. Shows the recap poster for the most
// recently completed phase (even after its Home banner was dismissed), or
// for the current phase while it is still running, with the share panel
// under it: the poster on screen is the exact image that is shared.
//
// Reads from history / srCards / bookmarks / customQuestions
// already-loaded in App. No own storage.
// ============================================================

import { useCallback, useMemo } from 'react';
import BackBar from '../components/BackBar.jsx';
import ShareCardPanel from '../components/ShareCardPanel.jsx';
import {
  getCompletedPhase,
  getCurrentPhase,
  buildPhaseStats,
  markWrappedDismissed,
  statsToText,
  studyTimeText,
  subjectRows,
} from '../lib/phase-wrapped.js';
import { drawPhaseCard, academicYear, PHASE_STRIP } from '../lib/share-card/phase-card.js';
import { picture } from '../lib/share-card/kit.js';
import { MOCHI_POSE_ASSETS } from '../data/mochi-poses.generated.js';
import { SUBJECTS } from '../data/curriculum.js';
import { earnedBadges } from '../lib/badges.js';

function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (24 * 60 * 60 * 1000));
}

// What the picture says, for a screen reader.
function altText(s) {
  const parts = [`สรุป${s.phaseLabel}`, `ฝึกไป ${s.qCount.toLocaleString('en-US')} ข้อ`, `ความแม่นยำ ${s.correctPct}%`, `ต่อเนื่องสูงสุด ${s.longestStreak} วัน`,
    `เวลาอ่าน${s.studyTimeEstimated === false ? '' : 'ราว'} ${studyTimeText(s.totalStudyMin, { spoken: true })}`];
  const { best, weak } = subjectRows(s);
  if (best) parts.push(`${best.label} ${best.subject.name} ${best.subject.pct}%`);
  if (weak) parts.push(`${weak.label} ${weak.subject.name} ${weak.subject.pct}%`);
  return parts.join(', ');
}

export default function PhaseWrappedView({ goHome, history = [], srCards = {}, bookmarks = [], customQuestions = [], selectedYear = null }) {
  // bannerId: the phase Home is still offering, so "stop reminding me" only
  // shows where it changes something.
  const { phase, bannerId } = useMemo(() => {
    const now = new Date();
    const year = selectedYear ? `y${selectedYear}` : undefined;
    return {
      phase: getCompletedPhase(now, year, { includeDismissed: true }) ?? getCurrentPhase(now, year),
      bannerId: getCompletedPhase(now, year)?.id ?? null,
    };
  }, [selectedYear]);

  const stats = useMemo(() => {
    if (!phase) return null;
    return buildPhaseStats({ phase, history, srCards, bookmarks, customQuestions, subjects: SUBJECTS });
  }, [phase, history, srCards, bookmarks, customQuestions]);

  // Earned marks, derived from the same history the numbers above come from —
  // nothing extra is stored, so a badge cannot drift from the stats.
  const badges = useMemo(
    () => (stats ? earnedBadges({ history, srCards, customQuestions, stats }) : []),
    [stats, history, srCards, customQuestions],
  );

  const draw = useCallback(async (theme) => {
    const [mochi, strip] = await Promise.all([picture(MOCHI_POSE_ASSETS.happy), picture(PHASE_STRIP)]);
    return drawPhaseCard(stats, { theme, mochi, strip });
  }, [stats]);

  if (!phase || !stats) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div className="vmx-wrapped-empty">
          <h1>สรุปช่วงสอบ</h1>
          <p>ยังไม่มีช่วงสอบที่จบ สรุปจะขึ้นให้เองหลังสอบเสร็จ</p>
        </div>
      </>
    );
  }

  const isPreview = !stats.phaseCompleted;
  const daysLeft = isPreview ? daysUntil(phase.endDate) : null;
  const year = academicYear(phase.endDate);

  function dismiss() {
    markWrappedDismissed(stats.phaseId);
    goHome?.();
  }

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div className="vmx-wrapped vmx-share-page">
        <header className="vmx-wrapped-head">
          <h1>สรุป{stats.phaseLabel}</h1>
          {isPreview && (
            <p>
              ช่วงสอบนี้ยังไม่จบ ตัวเลขยังขยับได้
              {daysLeft === 0 ? ' วันนี้เป็นวันสอบวันสุดท้าย' : ''}
              {daysLeft > 0 ? ` อีก ${daysLeft} วันถึงวันสอบวันสุดท้าย` : ''}
            </p>
          )}
        </header>
        {stats.isEmpty ? (
          <p className="vmx-wrapped-none">
            {isPreview
              ? 'ช่วงนี้ยังไม่ได้ทำข้อในแอป ทำสักชุดแล้วกลับมาดูสรุปได้'
              : 'ช่วงสอบนี้ไม่ได้ทำข้อในแอป เลยไม่มีสรุปให้ดู'}
          </p>
        ) : (
          <ShareCardPanel
            draw={draw}
            fileBase={`vetmock-wrapped-${stats.phaseId}-${year}`}
            title="สรุปช่วงสอบ VetMock"
            shareText={statsToText(stats)}
            alt={altText(stats)}
          />
        )}
        {bannerId === stats.phaseId && (
          <button type="button" className="vmx-btn vmx-btn-ghost vmx-wrapped-dismiss" onClick={dismiss}>
            ไม่ต้องเตือนที่หน้าแรกแล้ว
          </button>
        )}
        {badges.length > 0 && (
          <section className="vmx-wrapped-badges" aria-label="เหรียญที่ได้">
            <h2>เหรียญที่ได้ {badges.length} อัน</h2>
            <ul>
              {badges.map((b) => (
                <li key={b.id}>
                  <img src={b.src} alt="" aria-hidden="true" width={512} height={512} loading="lazy" decoding="async" />
                  <div className="vmx-wrapped-badge-name">{b.label}</div>
                  {/* The reason is the point: a mark with no stated basis is
                      decoration pretending to be an achievement. */}
                  <div className="vmx-wrapped-badge-why">{b.why}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
