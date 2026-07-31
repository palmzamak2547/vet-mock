// ============================================================
// PhaseWrappedView — host view for the Phase Wrapped recap
// ============================================================
//
// Mounted on the 'phase-wrapped' route. Renders one of:
//   - PhaseWrappedCard for the most recently completed phase
//   - PhaseWrappedCard for the current phase (preview mode)
//     when the user opens it from CommandPalette mid-term
//   - Empty state with countdown to the next phase end when
//     no phase data is available
//
// Reads from history / srCards / bookmarks / customQuestions
// already-loaded in App. No own storage.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import PhaseWrappedCard from '../components/PhaseWrappedCard.jsx';
import {
  getCompletedPhase,
  getCurrentPhase,
  buildPhaseStats,
  markWrappedDismissed,
} from '../lib/phase-wrapped.js';
import { SUBJECTS } from '../data/curriculum.js';

// Day formatter shared with the empty-state countdown.
function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (24 * 60 * 60 * 1000));
}

export default function PhaseWrappedView({ goHome, history = [], srCards = {}, bookmarks = [], customQuestions = [] }) {
  const [, setTick] = useState(0); // forces a re-read of dismissal state

  // Prefer a completed phase first; fall back to the current
  // phase so the user can peek mid-term ("how am I doing?").
  const phase = useMemo(() => {
    const completed = getCompletedPhase();
    if (completed) return { ...completed, _state: 'completed' };
    const current = getCurrentPhase();
    if (current) return { ...current, _state: 'current' };
    return null;
  }, []);

  const stats = useMemo(() => {
    if (!phase) return null;
    return buildPhaseStats({
      phase,
      history,
      srCards,
      bookmarks,
      customQuestions,
      subjects: SUBJECTS,
    });
  }, [phase, history, srCards, bookmarks, customQuestions]);

  // Mark "shown" so the home banner stops surfacing it.
  // We treat opening the wrapped view as an implicit "I've seen
  // this" signal — banner doesn't need a separate dismiss click.
  useEffect(() => {
    if (phase?._state === 'completed' && phase?.id) {
      // No-op until user closes — completion-mark happens via
      // onDismissPhase below. We don't auto-mark on open so a
      // user who navigates away mid-view still sees the banner.
    }
  }, [phase]);

  function handleDismissPhase(phaseId) {
    if (phaseId) markWrappedDismissed(phaseId);
    setTick((n) => n + 1);
  }

  // Empty state — no phase context at all (cold install, scaffold year, …)
  if (!phase || !stats) {
    return (
      <>
        <BackBar onBack={goHome} label="หน้าแรก" />
        <div style={{
          padding: 'clamp(20px, 5vw, 32px)', maxWidth: 480, margin: '24px auto',
          borderRadius: 24, background: 'var(--clr-surface, #fdf6e9)',
          border: '1px dashed var(--clr-border, rgba(43,36,25,0.18))',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--vmx-mono)', color: 'var(--clr-ink-soft, #6b6055)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Phase Wrapped
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: 22, fontFamily: 'Fraunces, serif' }}>
            ยังไม่มี phase ที่จบ
          </h2>
          <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--clr-ink, #2b2419)' }}>
            รอสอบเสร็จก่อน — ระบบจะเด้งสรุปขึ้นมาเองหลังสอบจบ
          </p>
        </div>
      </>
    );
  }

  // "Current phase" mode — show a preview headline so the user
  // knows this is a live snapshot, not the final wrapped.
  const isPreview = phase._state === 'current';
  const daysLeft = isPreview ? daysUntil(phase.endDate) : null;

  return (
    <>
      <BackBar onBack={goHome} label="หน้าแรก" />
      <div style={{
        minHeight: 'calc(100dvh - 80px)',
        padding: '12px 0 max(40px, env(safe-area-inset-bottom))',
      }}>
        {isPreview && (
          <div style={{
            maxWidth: 480, margin: '0 auto 14px', padding: '10px 14px',
            borderRadius: 12, background: 'rgba(184, 137, 64, 0.10)',
            border: '1px solid var(--clr-gold, #b88940)',
            fontSize: 12, lineHeight: 1.6, textAlign: 'center',
            color: 'var(--clr-ink, #2b2419)',
          }}>
            👀 พรีวิวสด — phase ยังไม่จบ
            {typeof daysLeft === 'number' && daysLeft >= 0 && (
              <strong>, เหลืออีก {daysLeft} วันถึง phase ปิด</strong>
            )}
          </div>
        )}
        <PhaseWrappedCard
          stats={stats}
          onClose={goHome}
          onDismissPhase={handleDismissPhase}
        />
      </div>
    </>
  );
}
