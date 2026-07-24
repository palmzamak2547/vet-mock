// PomodoroTimer — self-contained Forest-style focus timer with a hatching chick.
//
// Design notes:
// - Wall-clock (Date.now()) is the source of truth for remaining time —
//   setInterval(1000ms) only drives UI refresh. iOS Safari aggressively throttles
//   background timers, so if we counted ticks instead of comparing wall clock,
//   a backgrounded tab would lie about remaining time even if the user came back.
//   (Background throttling is *also* why we have the visibility-escape rule — but
//   even with focus retained, wall-clock anchoring beats tick-counting.)
// - State machine: 'idle' → 'focus' → 'shortBreak'/'longBreak' (every 4th cycle)
//   → 'idle'. 'failed' is a terminal escape state requiring explicit reset.
// - Visibility detection: while state === 'focus', if document.hidden for > 5 s
//   the session fails. We schedule a 5-second timeout on hide and clear it on
//   show — so quick notification glances don't break a session. Dispatches
//   'vmx-pomodoro-failed' so any listener can react (analytics, etc.).
// - SVG ring uses stroke-dasharray / stroke-dashoffset — universally supported,
//   no canvas dependency, plays nice with prefers-reduced-motion.
// - Sound: best-effort WebAudio beeps on state transitions. If suspended/blocked
//   we silently degrade — never throw.
// - 44 px touch targets on every action button (iOS HIG minimum).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const VISIBILITY_GRACE_MS = 5_000; // 5 s — survives glances at notifications
const FOCUS_PER_CYCLE = 4; // every 4th focus → long break

// --- Audio: best-effort WebAudio beep ------------------------------------
function playTone(freq = 660, ms = 180) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000 + 0.05);
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        /* ignore */
      }
    }, ms + 200);
  } catch {
    /* blocked / unsupported — silently degrade */
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

// --- Egg / chick stage decision ------------------------------------------
function pickEmoji(state, progress) {
  if (state === 'idle') return '🥚';
  if (state === 'focus') {
    if (progress >= 1) return '🐤';
    if (progress >= 0.5) return '🐣';
    return '🥚';
  }
  if (state === 'shortBreak') return '🐤';
  if (state === 'longBreak') return '🐤';
  if (state === 'failed') return '💔';
  return '🥚';
}

function statusLabel(state, strictFocus = true) {
  switch (state) {
    case 'idle':
      return strictFocus
        ? 'พร้อมเริ่ม — กด Start เพื่อฟักลูกไก่ (Strict Mode)'
        : 'พร้อมเริ่ม — กด Start เพื่อเริ่มโฟกัส (Relaxed Mode)';
    case 'focus':
      return strictFocus
        ? 'กำลังโฟกัส — อย่าออกจากหน้านี้นะ ไก่จะหนี!'
        : 'กำลังโฟกัส — สลับแอปอ่าน PDF/สรุปได้ตามสะดวก 📚';
    case 'shortBreak':
      return 'พักสายตา 5 นาที';
    case 'longBreak':
      return 'พักยาว 15 นาที — เก่งมาก! 🌻';
    case 'failed':
      return 'ลูกไก่หนีไปแล้ว! เริ่มใหม่อีกครั้ง';
    default:
      return '';
  }
}

export default function PomodoroTimer({ config, onSessionComplete }) {
  const reduced = usePrefersReducedMotion();

  // State machine
  const [state, setState] = useState('idle'); // 'idle' | 'focus' | 'shortBreak' | 'longBreak' | 'failed'
  const [focusCount, setFocusCount] = useState(0); // # of completed focus sessions this run

  // Wall-clock anchors
  const [startedAt, setStartedAt] = useState(null);
  const [pauseStartedAt, setPauseStartedAt] = useState(null);
  const [pausedAcc, setPausedAcc] = useState(0);
  const [paused, setPaused] = useState(false);

  // Force re-render every second while a timer state is active
  const [, setTickN] = useState(0);

  // Visibility escape bookkeeping
  const escapeTimerRef = useRef(null);
  const hiddenSinceRef = useRef(null);

  // Pick total ms for the current state
  const totalMs = useMemo(() => {
    if (state === 'focus') return (config?.focusMin || 25) * 60_000;
    if (state === 'shortBreak') return (config?.shortBreakMin || 5) * 60_000;
    if (state === 'longBreak') return (config?.longBreakMin || 15) * 60_000;
    return (config?.focusMin || 25) * 60_000; // idle preview
  }, [state, config]);

  // Pure: compute remaining ms from wall clock
  const computeRemaining = useCallback(() => {
    if (!startedAt) return totalMs;
    const now = Date.now();
    let pausedMs = pausedAcc;
    if (paused && pauseStartedAt) pausedMs += now - pauseStartedAt;
    return Math.max(0, totalMs - (now - startedAt - pausedMs));
  }, [startedAt, pausedAcc, paused, pauseStartedAt, totalMs]);

  const remainingMs = computeRemaining();
  const progress = startedAt ? 1 - remainingMs / totalMs : 0;

  // Tick: only run when a timer state is active and not paused
  const isTimerActive = state === 'focus' || state === 'shortBreak' || state === 'longBreak';
  useEffect(() => {
    if (!isTimerActive || paused) return undefined;
    const id = setInterval(() => setTickN((n) => (n + 1) % 1_000_000), 1000);
    return () => clearInterval(id);
  }, [isTimerActive, paused]);

  // --- Phase transitions on timer expiry ----------------------------------
  useEffect(() => {
    if (!isTimerActive || paused) return;
    if (remainingMs > 0) return;
    if (state === 'focus') {
      const focusMin = config?.focusMin || 25;
      const nextCount = focusCount + 1;
      setFocusCount(nextCount);
      onSessionComplete?.({ durationMin: focusMin, completed: true });
      playTone(880, 220);
      // Every 4th focus → long break, else short break
      const goLong = nextCount % FOCUS_PER_CYCLE === 0;
      setStartedAt(Date.now());
      setPausedAcc(0);
      setPauseStartedAt(null);
      setPaused(false);
      setState(goLong ? 'longBreak' : 'shortBreak');
    } else if (state === 'shortBreak' || state === 'longBreak') {
      playTone(540, 180);
      // Return to idle — let the user decide whether to start another focus
      setStartedAt(null);
      setPausedAcc(0);
      setPauseStartedAt(null);
      setPaused(false);
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, isTimerActive, paused, state, focusCount, config?.focusMin]);

  // --- Visibility escape (focus state only, if strictFocus mode is active) ---
  useEffect(() => {
    if (state !== 'focus' || config?.strictFocus === false) return undefined;
    const onVis = () => {
      if (document.hidden) {
        hiddenSinceRef.current = Date.now();
        if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
        escapeTimerRef.current = setTimeout(() => {
          // Re-check — still hidden, still in focus state?
          if (document.hidden && state === 'focus') {
            try {
              window.dispatchEvent(new Event('vmx-pomodoro-failed'));
            } catch {
              /* ignore */
            }
            onSessionComplete?.({ durationMin: config?.focusMin || 25, completed: false });
            setStartedAt(null);
            setPausedAcc(0);
            setPauseStartedAt(null);
            setPaused(false);
            setState('failed');
          }
        }, VISIBILITY_GRACE_MS);
      } else {
        hiddenSinceRef.current = null;
        if (escapeTimerRef.current) {
          clearTimeout(escapeTimerRef.current);
          escapeTimerRef.current = null;
        }
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (escapeTimerRef.current) {
        clearTimeout(escapeTimerRef.current);
        escapeTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, config?.focusMin, config?.strictFocus]);

  // --- Actions ------------------------------------------------------------
  const startFocus = useCallback(() => {
    setStartedAt(Date.now());
    setPausedAcc(0);
    setPauseStartedAt(null);
    setPaused(false);
    setState('focus');
    playTone(720, 160);
  }, []);

  const pause = useCallback(() => {
    if (!isTimerActive || paused) return;
    setPauseStartedAt(Date.now());
    setPaused(true);
  }, [isTimerActive, paused]);

  const resume = useCallback(() => {
    if (!paused) return;
    if (pauseStartedAt) setPausedAcc((acc) => acc + (Date.now() - pauseStartedAt));
    setPauseStartedAt(null);
    setPaused(false);
  }, [paused, pauseStartedAt]);

  const reset = useCallback(() => {
    setStartedAt(null);
    setPausedAcc(0);
    setPauseStartedAt(null);
    setPaused(false);
    setFocusCount(0);
    if (escapeTimerRef.current) {
      clearTimeout(escapeTimerRef.current);
      escapeTimerRef.current = null;
    }
    setState('idle');
  }, []);

  // --- SVG ring geometry --------------------------------------------------
  const RING_SIZE = 240;
  const STROKE = 14;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - Math.max(0, Math.min(1, progress)));

  const emoji = pickEmoji(state, progress);
  const status = statusLabel(state, config?.strictFocus !== false);

  // Ring color reflects state
  const ringColor =
    state === 'failed'
      ? '#c92a2a'
      : state === 'shortBreak'
      ? '#74c0fc'
      : state === 'longBreak'
      ? '#82c91e'
      : '#f59f00';

  // --- Buttons ------------------------------------------------------------
  const btnBase = {
    minHeight: 44,
    minWidth: 96,
    padding: '10px 18px',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
  };
  const primaryBtn = {
    ...btnBase,
    background: ringColor,
    color: '#fff',
    boxShadow: `0 2px 6px ${ringColor}55`,
  };
  const ghostBtn = {
    ...btnBase,
    background: '#fff',
    color: '#444',
    border: '1px solid #ddd',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes pmdTPulse { 0%,100% { transform: scale(1);} 50% { transform: scale(1.05);} }
        .pmd-t-pulse { animation: pmdTPulse 1.8s ease-in-out infinite; }
        .pmd-t-ring-anim { transition: stroke-dashoffset 1s linear, stroke 0.4s ease; }
      `}</style>

      {/* Ring + chick */}
      <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, maxWidth: '90vw', maxHeight: '90vw' }}>
        <svg
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#fff3bf"
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <circle
            className={!reduced ? 'pmd-t-ring-anim' : ''}
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            style={{ opacity: state === 'idle' ? 0.3 : 1 }}
          />
        </svg>

        {/* Center: emoji + clock */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <div
            className={!reduced && (state === 'focus' || state === 'shortBreak' || state === 'longBreak') && !paused ? 'pmd-t-pulse' : ''}
            style={{
              fontSize: 'clamp(48px, 14vw, 72px)',
              lineHeight: 1,
              filter: state === 'failed' ? 'grayscale(60%)' : 'none',
            }}
            aria-hidden="true"
          >
            {emoji}
          </div>
          <div
            style={{
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 800,
              color: state === 'failed' ? '#c92a2a' : '#5c3a00',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 0.5,
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatClock(state === 'idle' ? totalMs : remainingMs)}
          </div>
        </div>
      </div>

      {/* Status text */}
      <div
        style={{
          minHeight: 22,
          fontSize: 14,
          color: state === 'failed' ? '#c92a2a' : '#666',
          textAlign: 'center',
          maxWidth: 360,
          padding: '0 8px',
        }}
      >
        {status}
      </div>

      {/* Cycle dots */}
      {focusCount > 0 && state !== 'idle' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#888' }}>
          <span>Cycle:</span>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i < focusCount % FOCUS_PER_CYCLE ? '#f59f00' : '#fff3bf',
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {state === 'idle' && (
          <button type="button" onClick={startFocus} style={primaryBtn} aria-label="เริ่ม focus session">
            ▶ Start
          </button>
        )}
        {isTimerActive && !paused && (
          <button type="button" onClick={pause} style={ghostBtn} aria-label="หยุดชั่วคราว">
            ⏸ Pause
          </button>
        )}
        {paused && (
          <button type="button" onClick={resume} style={primaryBtn} aria-label="ทำต่อ">
            ▶ Resume
          </button>
        )}
        {(isTimerActive || state === 'failed') && (
          <button type="button" onClick={reset} style={ghostBtn} aria-label="รีเซ็ต">
            🔄 Reset
          </button>
        )}
      </div>
    </div>
  );
}
