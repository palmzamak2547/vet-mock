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

import { useCallback, useEffect, useMemo, useState } from 'react';
import BackBar from '../components/BackBar.jsx';
import PomodoroTimer from '../components/PomodoroTimer.jsx';
import {
  loadConfig,
  saveConfig,
  loadHistory,
  recordSession,
  getTotalMinutesToday,
  getSessionsCount,
  POMODORO_DEFAULTS,
} from '../lib/pomodoro.js';

export default function PomodoroView({ goHome }) {
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
    refreshStats();
  }, [refreshStats]);

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
  const statsRow = useMemo(
    () => [
      { label: 'นาทีวันนี้', value: stats.today, suffix: 'นาที' },
      { label: 'Session วันนี้', value: stats.counts.today, suffix: 'ครั้ง' },
      { label: '7 วันล่าสุด', value: stats.counts.week, suffix: 'ครั้ง' },
      { label: 'Streak', value: stats.streak, suffix: 'วัน' },
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
      <BackBar onBack={goHome} label="หน้าหลัก" subtitle="Pomodoro, 🐤 ฟักลูกไก่" />

      {/* Title — short, no clutter; the ring is the hero. */}
      <h1
        style={{
          margin: '4px 0 0',
          fontSize: 20,
          fontWeight: 800,
          color: '#5c3a00',
          textAlign: 'center',
        }}
      >
        🍅 Pomodoro
      </h1>

      {/* Escape banner — appears for 6 s after a failed session */}
      {escapeNotice && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: 12,
            borderRadius: 12,
            background: '#fff5f5',
            color: '#c92a2a',
            border: '1px solid #ffd8d8',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          💔 ลูกไก่หนีไปแล้ว — อยู่ในหน้านี้ตลอด session นะ
        </div>
      )}

      {/* Timer */}
      <div style={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PomodoroTimer config={config} onSessionComplete={onSessionComplete} />
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
            <div style={{ fontSize: 16, fontWeight: 700, color: '#7a5a30' }}>
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
            color: '#5c3a00',
          }}
        >
          <span>ปรับเวลา (focus / break)</span>
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
                style={{ width: 20, height: 20, accentColor: '#f59f00', cursor: 'pointer' }}
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
                color: '#666',
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
          ? 'Strict Mode: เปลี่ยนแท็บ พับหน้าต่าง หรือล็อกหน้าจอเกิน 5 วินาที ลูกไก่จะหนี'
          : 'Relaxed Mode: สลับแอปอ่าน PDF/สรุปได้ โดยไม่พัง session'}
      </div>
    </div>
  );
}

// --- Slider sub-component ---------------------------------------------------
function Slider({ label, suffix, min, max, step, value, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--clr-ink)', fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color: '#7a5a30' }}>
          {value} <span style={{ fontSize: 11, color: '#aaa' }}>{suffix}</span>
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
          accentColor: '#f59f00',
        }}
        aria-label={`${label} ${suffix}`}
      />
    </label>
  );
}
