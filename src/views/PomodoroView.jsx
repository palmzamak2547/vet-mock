// PomodoroView — Forest-style pomodoro shell that hosts the PomodoroTimer.
//
// Layout: BackBar + PomodoroTimer + stats panel + collapsible config panel.
// State: config persisted via src/lib/pomodoro.js (vmx-pomodoro-config).
// History: read via getSessionsCount + getTotalMinutesToday, refreshed on
// the 'vmx-pomodoro-changed' event so completed sessions update immediately.
//
// Orchestrator TODO: when this lands, src/App.jsx already lazy-imports this
// view and wires `view === 'pomodoro'` (verified at App.jsx:241 / :1408).
// If the routing wiring is reverted, the orchestrator needs to add:
//   const PomodoroView = lazy(() => import('./views/PomodoroView.jsx'));
//   {view === 'pomodoro' && <PomodoroView goHome={goHome} />}
// alongside the existing view branches.

import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import PomodoroTimer from '../components/PomodoroTimer.jsx';
import BuddySelector from '../components/BuddySelector.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import MascotStill from '../components/MascotStill.jsx';
import { recordBuddyFocus } from '../lib/buddy-stats.js';
import { buddyArt, canShow3D } from '../lib/buddy.js';
import { useBuddy } from '../hooks/useBuddy.js';
import { useMotionPreferences } from '../hooks/useMotionPreferences.js';
import { useModalFocus } from '../hooks/useModalFocus.js';
import {
  loadConfig,
  saveConfig,
  loadHistory,
  recordSession,
  getTotalMinutesToday,
  getSessionsCount,
  POMODORO_DEFAULTS,
} from '../lib/pomodoro.js';

const MascotSquad3DViewer = lazy(() => import('../components/MascotSquad3DViewer.jsx'));

// Pomodoro's own story is the hatching chick: the status line, the escape
// banner and Strict Mode all talk about it. It stays the buddy here until the
// student picks another one (the app-wide default buddy is not a pick).
const POMODORO_BUDDY = 'chicky';

export default function PomodoroView({ goHome }) {
  // The buddy is the one kept for every screen (lib/buddy.js), live; with no
  // pick Pomodoro keeps its chick.
  const { id: selectedBuddyId, buddy: selectedBuddy } = useBuddy(POMODORO_BUDDY);
  // The chick keeps its hatching story; a buddy the student picked is named instead.
  const buddyName = selectedBuddyId === POMODORO_BUDDY ? null : selectedBuddy.nameTh;
  const [showCelebration, setShowCelebration] = useState(false);
  // The celebration is a companion moment: it follows the same device
  // preference as Mochi, and reduced motion gets a still picture.
  const { preferences: motionPrefs, reduced } = useMotionPreferences();
  const companionOn = motionPrefs.companion && motionPrefs.mode !== 'off';
  const celebrationOpen = showCelebration && companionOn;
  const closeCelebration = useCallback(() => setShowCelebration(false), []);
  const celebrationCloseRef = useRef(null);
  const celebrationRef = useModalFocus({ active: celebrationOpen, onClose: closeCelebration, initialFocusRef: celebrationCloseRef });
  const [config, setConfig] = useState(() => loadConfig());
  const [stats, setStats] = useState(() => ({
    today: getTotalMinutesToday(),
    counts: getSessionsCount(),
    streak: loadHistory().currentStreak,
  }));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [escapeNotice, setEscapeNotice] = useState(false);

  // Refresh stats when storage changes (new session recorded, etc.)
  const refreshStats = useCallback(() => {
    setStats({
      today: getTotalMinutesToday(),
      counts: getSessionsCount(),
      streak: loadHistory().currentStreak,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('vmx-pomodoro-changed', refreshStats);
    return () => window.removeEventListener('vmx-pomodoro-changed', refreshStats);
  }, [refreshStats]);

  // Today's minutes and the streak are read from the clock, so a tab left
  // open across midnight or in the background shows yesterday's numbers.
  // Recompute when the page comes back into view and when the local day
  // turns over; nothing is written.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') refreshStats(); };
    document.addEventListener('visibilitychange', onVisible);
    let timer = 0;
    const armMidnight = () => {
      const next = new Date();
      next.setHours(24, 0, 0, 0);
      timer = window.setTimeout(() => { refreshStats(); armMidnight(); }, Math.max(1000, next.getTime() - Date.now()));
    };
    armMidnight();
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearTimeout(timer);
    };
  }, [refreshStats]);

  // Surface the escape event briefly so the user sees a banner even if their
  // eyes were on the timer ring.
  useEffect(() => {
    const onFail = () => {
      setEscapeNotice(true);
      setTimeout(() => setEscapeNotice(false), 6000);
    };
    window.addEventListener('vmx-pomodoro-failed', onFail);
    return () => window.removeEventListener('vmx-pomodoro-failed', onFail);
  }, []);

  // Persist + reflect timer outcomes
  const onSessionComplete = useCallback(({ durationMin, completed }) => {
    recordSession({ durationMin, completed });
    if (completed) {
      if (selectedBuddyId && durationMin > 0) {
        recordBuddyFocus(selectedBuddyId, durationMin);
      }
      if (companionOn) setShowCelebration(true);
    }
    refreshStats();
  }, [refreshStats, selectedBuddyId, companionOn]);

  // Slider handler (debounced through setState since saveConfig is cheap)
  const setConfigField = useCallback((field, value) => {
    const next = saveConfig({ ...config, [field]: value });
    setConfig(next);
  }, [config]);

  const resetConfig = useCallback(() => {
    const next = saveConfig({ ...POMODORO_DEFAULTS });
    setConfig(next);
  }, []);

  // --- Styling helpers ---------------------------------------------------
  const buddyAvatar = selectedBuddyId !== POMODORO_BUDDY ? selectedBuddy : null;
  // The celebration picture: Mochi has a drawn celebrate pose, a clinic
  // mascot its one picture. Used for reduced motion, no WebGL2, and while the
  // 3D chunk loads, so the moment never opens on loading text.
  const celebrationStill = useMemo(
    () => ({ ...selectedBuddy, src: buddyArt(selectedBuddy, 'celebrate') }),
    [selectedBuddy]
  );
  const celebrate3D = celebrationOpen && !reduced && canShow3D();

  const statsRow = useMemo(
    () => [
      { label: 'นาทีวันนี้', value: stats.today, suffix: 'นาที' },
      { label: 'รอบวันนี้', value: stats.counts.today, suffix: 'ครั้ง' },
      { label: '7 วันล่าสุด', value: stats.counts.week, suffix: 'ครั้ง' },
      { label: 'วันต่อเนื่อง', value: stats.streak, suffix: 'วัน' },
    ],
    [stats]
  );

  return (
    <div
      style={{
        minHeight: '100dvh',
        paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
        paddingLeft: 'max(env(safe-area-inset-left), 16px)',
        paddingRight: 'max(env(safe-area-inset-right), 16px)',
        background: 'linear-gradient(180deg, var(--clr-surface) 0%, var(--clr-bg) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <BackBar onBack={goHome} label="หน้าแรก" subtitle="Pomodoro โฟกัสกับคู่หู" />

      {/* Title — short, no clutter; the ring is the hero. */}
      <h1
        style={{
          margin: '4px 0 0',
          fontSize: 20,
          fontWeight: 800,
          color: 'var(--clr-ink)',
          textAlign: 'center',
        }}
      >
        🍅 Pomodoro
      </h1>

      {/* Buddy selector: a pick here is the buddy on every screen */}
      <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
        <BuddySelector selectedId={selectedBuddyId} />
      </div>

      {/* Escape banner — appears for 6 s after a failed session */}
      {escapeNotice && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: 12,
            borderRadius: 12,
            background: 'color-mix(in srgb, var(--clr-rose) 12%, var(--clr-surface))',
            color: 'var(--clr-rose-text)',
            border: '1px solid var(--clr-rose-soft)',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          💔 {buddyName || 'ลูกไก่'}หนีไปแล้ว รอบหน้าอยู่ในหน้านี้จนครบเวลานะ
        </div>
      )}

      {/* Timer */}
      <div style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PomodoroTimer config={config} avatar={buddyAvatar} buddyName={buddyName} onSessionComplete={onSessionComplete} />
      </div>

      {/* Stats panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          padding: 10,
          background: 'var(--clr-surface)',
          borderRadius: 12,
          border: '1px solid var(--clr-gold-soft)',
        }}
      >
        {statsRow.map((s) => (
          <div key={s.label} style={{ textAlign: 'center', padding: '4px 2px' }}>
            <div style={{ fontSize: 11, color: 'var(--clr-ink-soft)', whiteSpace: 'nowrap' }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--clr-gold-text)' }}>
              {s.value}
              <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)', marginLeft: 2 }}>{s.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Config panel (collapsible) */}
      <div
        style={{
          background: 'var(--clr-surface)',
          borderRadius: 12,
          border: '1px solid var(--clr-gold-soft)',
          overflow: 'hidden',
        }}
      >
        <button
          type="button"
          onClick={() => setSettingsOpen((v) => !v)}
          aria-expanded={settingsOpen}
          style={{
            width: '100%',
            minHeight: 44,
            padding: '10px 14px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--clr-ink)',
          }}
        >
          <span>ปรับเวลาโฟกัสและพัก</span>
          <span aria-hidden="true">{settingsOpen ? '▾' : '▸'}</span>
        </button>
        {settingsOpen && (
          <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--clr-ink)', fontWeight: 600, padding: '4px 0', cursor: 'pointer' }}>
              <span>🐣 Strict Mode (ห้ามออกจากหน้าเกิน 5 วินาที)</span>
              <input
                type="checkbox"
                checked={config.strictFocus !== false}
                onChange={(e) => setConfigField('strictFocus', e.target.checked)}
                style={{ width: 20, height: 20, accentColor: 'var(--clr-gold)', cursor: 'pointer' }}
              />
            </label>
            <Slider
              label="Focus"
              suffix="นาที"
              min={5}
              max={90}
              step={5}
              value={config.focusMin}
              onChange={(v) => setConfigField('focusMin', v)}
            />
            <Slider
              label="พักสั้น"
              suffix="นาที"
              min={1}
              max={30}
              step={1}
              value={config.shortBreakMin}
              onChange={(v) => setConfigField('shortBreakMin', v)}
            />
            <Slider
              label="พักยาว"
              suffix="นาที"
              min={5}
              max={60}
              step={5}
              value={config.longBreakMin}
              onChange={(v) => setConfigField('longBreakMin', v)}
            />
            <button
              type="button"
              onClick={resetConfig}
              style={{
                alignSelf: 'flex-end',
                minHeight: 36,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                border: '1px solid var(--clr-border)',
                background: 'var(--clr-surface)',
                color: 'var(--clr-ink-soft)',
                cursor: 'pointer',
              }}
            >
              คืนค่าเริ่มต้น (25 / 5 / 15)
            </button>
          </div>
        )}
      </div>

      {/* Hint footer */}
      <div style={{ fontSize: 12, color: 'var(--clr-ink-soft)', textAlign: 'center', padding: '4px 8px' }}>
        {config.strictFocus !== false
          ? `Strict Mode: เปลี่ยนแท็บ พับหน้าต่าง หรือล็อกหน้าจอเกิน 5 วินาที ${buddyName || 'ลูกไก่'}จะหนี`
          : 'Relaxed Mode: สลับแอปอ่าน PDF/สรุปได้ โดยไม่พัง session'}
      </div>

      {/* Mascot celebration on focus completion. useModalFocus moves focus
          to the close control, traps Tab, closes on Escape and gives focus
          back. The close control sits at the top so a short phone reaches it
          without scrolling past the 3D canvas. */}
      {celebrationOpen && (
        <div
          ref={celebrationRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pomodoro-celebration-title"
          data-vmx-modal="true"
          tabIndex={-1}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            // A flat scrim: a blur under a full-screen dialog re-runs on
            // every frame of the 3D canvas above it.
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              position: 'relative',
              background: 'var(--clr-surface)',
              borderRadius: 20,
              border: '1px solid var(--clr-border)',
              maxWidth: 440,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              ref={celebrationCloseRef}
              type="button"
              aria-label="ปิด"
              onClick={closeCelebration}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                minWidth: 'var(--touch-min)',
                minHeight: 'var(--touch-min)',
                borderRadius: 999,
                border: '1px solid var(--clr-border)',
                background: 'var(--clr-surface)',
                color: 'var(--clr-ink)',
                fontSize: 18,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              <span aria-hidden="true">✕</span>
            </button>
            <div
              style={{
                padding: '24px 16px',
                overflowY: 'auto',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 12, padding: '0 40px' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }} aria-hidden="true">🎉</div>
                <h2 id="pomodoro-celebration-title" style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--clr-ink)' }}>
                  สำเร็จแล้ว! โฟกัสครบเวลา
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--clr-sage-text)', fontWeight: 500 }}>
                  {selectedBuddy?.nameTh || 'คู่หู'} ร่วมฉลองความสำเร็จกับคุณ!
                </p>
              </div>

              {celebrate3D ? (
                <ErrorBoundary fallback={<MascotStill mascot={celebrationStill} />}>
                  {/* While the 3D chunk loads, the buddy's picture holds the
                      place: no loading text in a moment of celebration. */}
                  <Suspense fallback={<MascotStill mascot={celebrationStill} />}>
                    <MascotSquad3DViewer id={selectedBuddyId} initialAction="celebrate" />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <MascotStill mascot={celebrationStill} />
              )}

              <button
                type="button"
                onClick={closeCelebration}
                style={{
                  marginTop: 16,
                  minHeight: 'var(--touch-min)',
                  padding: '10px 28px',
                  borderRadius: 999,
                  background: 'var(--clr-sage)',
                  color: 'var(--clr-sage-on)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Slider sub-component ---------------------------------------------------
function Slider({ label, suffix, min, max, step, value, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--clr-ink)', fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color: 'var(--clr-gold-text)' }}>
          {value} <span style={{ fontSize: 11, color: 'var(--clr-ink-soft)' }}>{suffix}</span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          minHeight: 44,
          accentColor: 'var(--clr-gold)',
        }}
        aria-label={`${label} ${suffix}`}
      />
    </label>
  );
}
