// PomodoroTimer — self-contained Forest-style focus timer with a hatching chick.
//
// Design notes:
// - Wall-clock (Date.now()) is the source of truth for remaining time —
//   setInterval(1000ms) copies it into state once a second (render never reads
//   the clock itself). iOS Safari aggressively throttles
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
import PomodoroChick from './PomodoroChick.jsx';
import FocusBackdrop from './FocusBackdrop.jsx';
import StudyBreak from './StudyBreak.jsx';
import { MotionButton } from './MotionFeedback.jsx';
import { buddyArt } from '../lib/buddy.js';
import { confirmDialog } from '../lib/dialog.js';
import {
  VISIBILITY_GRACE_MS, phaseMinutes, statusLabel, runEndsAt, escapedWhileAway,
  loadRun, saveRun, markRunAway,
} from '../lib/pomodoro-run.js';

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

// (The emoji stage-picker that used to live here is gone — PomodoroChick
// draws the same four stages as real artwork and decides them from
// `progress` itself.)

// (statusLabel lives in lib/pomodoro-run.js: the break lines used to be the
// literals "5 นาที" / "15 นาที" whatever the student had set.)

export default function PomodoroTimer({ config, avatar, buddyName, onSessionComplete }) {
  const reduced = usePrefersReducedMotion();

  // A session that was running when the student opened another screen comes
  // back from storage (lib/pomodoro-run.js); the wall clock does the rest.
  const [loaded] = useState(loadRun);
  // A Strict Mode focus left (another screen, hidden tab) for longer than the
  // grace comes back failed, decided before the first render so the expiry
  // effect below cannot also record it as completed.
  const [escapedOnRestore] = useState(() => Boolean(
    loaded?.state === 'focus' && loaded.strict && escapedWhileAway(loaded.awaySince),
  ));
  const restored = escapedOnRestore ? null : loaded;

  // State machine
  const [state, setState] = useState(escapedOnRestore ? 'failed' : (restored?.state || 'idle')); // 'idle' | 'focus' | 'shortBreak' | 'longBreak' | 'failed'
  const [focusCount, setFocusCount] = useState((restored || loaded)?.focusCount || 0); // # of completed focus sessions this run
  const [ambience, setAmbience] = useState('rain');

  // Wall-clock anchors
  const [startedAt, setStartedAt] = useState(restored?.startedAt ?? null);
  const [pauseStartedAt, setPauseStartedAt] = useState(restored?.pauseStartedAt ?? null);
  const [pausedAcc, setPausedAcc] = useState(restored?.pausedAcc || 0);
  const [paused, setPaused] = useState(restored?.paused || false);
  // Minutes the running phase started with; a slider change applies next phase.
  const [runMin, setRunMin] = useState(restored?.runMin ?? null);

  // The wall clock is state the one-second tick writes, so render stays pure.
  // Reading Date.now() during render let a render React bailed out of keep
  // "0 left" in the expiry effect's deps without running it: in WebKit a clock
  // jump past the end (a locked phone, a throttled tab) left the timer at 00:00
  // for good, with no break and the focus never counted.
  const [now, setNow] = useState(() => Date.now());

  // Visibility escape bookkeeping
  const escapeTimerRef = useRef(null);
  const hiddenSinceRef = useRef(null);
  const restoreHandledRef = useRef(false);

  // Pick total ms for the current state
  const totalMs = useMemo(() => {
    const active = state === 'focus' || state === 'shortBreak' || state === 'longBreak';
    if (active && runMin > 0) return runMin * 60_000;
    return phaseMinutes(active ? state : 'focus', config) * 60_000; // idle preview
  }, [state, runMin, config]);

  // Remaining ms from the clock state. `now` can trail an anchor set a moment
  // ago (the tick has not run yet), so elapsed time never goes below zero.
  let pausedMs = pausedAcc;
  if (paused && pauseStartedAt) pausedMs += now - pauseStartedAt;
  const remainingMs = startedAt ? Math.max(0, totalMs - Math.max(0, now - startedAt - pausedMs)) : totalMs;
  const progress = startedAt ? 1 - remainingMs / totalMs : 0;

  // Tick: only run when a timer state is active and not paused
  const isTimerActive = state === 'focus' || state === 'shortBreak' || state === 'longBreak';
  useEffect(() => {
    if (!isTimerActive || paused) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isTimerActive, paused]);

  // --- Phase transitions on timer expiry ----------------------------------
  useEffect(() => {
    if (!isTimerActive || paused) return;
    if (remainingMs > 0) return;
    if (state === 'focus') {
      const focusMin = runMin || phaseMinutes('focus', config);
      const nextCount = focusCount + 1;
      setFocusCount(nextCount);
      onSessionComplete?.({ durationMin: focusMin, completed: true });
      playTone(880, 220);
      // Every 4th focus → long break, else short break
      const goLong = nextCount % FOCUS_PER_CYCLE === 0;
      const next = goLong ? 'longBreak' : 'shortBreak';
      // The break starts when the focus ended, not when this screen noticed:
      // a session that finished while the student was elsewhere in VetMock
      // resumes at the right point of its break (or finishes it too).
      setStartedAt(runEndsAt({ startedAt, pausedAcc, runMin: focusMin }));
      setRunMin(phaseMinutes(next, config));
      setPausedAcc(0);
      setPauseStartedAt(null);
      setPaused(false);
      setState(next);
    } else if (state === 'shortBreak' || state === 'longBreak') {
      playTone(540, 180);
      // Return to idle — let the user decide whether to start another focus
      setStartedAt(null);
      setRunMin(null);
      setPausedAcc(0);
      setPauseStartedAt(null);
      setPaused(false);
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, isTimerActive, paused, state, focusCount, runMin]);

  // Strict Mode escape: the session fails and is recorded as not completed.
  const reportEscape = useCallback((minutes) => {
    // Later than now: on a remount this runs before PomodoroView's listener.
    setTimeout(() => {
      try {
        window.dispatchEvent(new Event('vmx-pomodoro-failed'));
      } catch {
        /* ignore */
      }
    }, 0);
    onSessionComplete?.({ durationMin: minutes || phaseMinutes('focus', config), completed: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSessionComplete, config?.focusMin]);

  const failFocus = useCallback((minutes) => {
    reportEscape(minutes);
    setStartedAt(null);
    setRunMin(null);
    setPausedAcc(0);
    setPauseStartedAt(null);
    setPaused(false);
    setState('failed');
  }, [reportEscape]);

  // --- Persist the running session (survives other VetMock screens) ------
  useEffect(() => {
    saveRun(isTimerActive ? {
      state, startedAt, runMin, pausedAcc, paused, pauseStartedAt, focusCount,
      strict: config?.strictFocus !== false,
    } : null);
  }, [isTimerActive, state, startedAt, runMin, pausedAcc, paused, pauseStartedAt, focusCount, config?.strictFocus]);

  // Leaving this screen while a session runs: note when, so a Strict Mode
  // focus left for longer than the grace fails when the student comes back,
  // the same as a hidden tab.
  useEffect(() => () => markRunAway(Date.now()), []);

  useEffect(() => {
    if (restoreHandledRef.current) return;
    restoreHandledRef.current = true;
    if (escapedOnRestore) reportEscape(loaded.runMin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Visibility escape (focus state only, if strictFocus mode is active) ---
  useEffect(() => {
    if (state !== 'focus' || config?.strictFocus === false) return undefined;
    const onVis = () => {
      if (document.hidden) {
        hiddenSinceRef.current = Date.now();
        markRunAway(hiddenSinceRef.current);
        if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
        escapeTimerRef.current = setTimeout(() => {
          // Re-check — still hidden, still in focus state?
          if (document.hidden && state === 'focus') failFocus(runMin);
        }, VISIBILITY_GRACE_MS);
      } else {
        // A locked phone or a switched-away app can suspend the page, and
        // with it the timer above: when the page wakes, the visible event may
        // run first and clear it. The wall clock decides instead.
        const away = hiddenSinceRef.current;
        hiddenSinceRef.current = null;
        if (escapeTimerRef.current) {
          clearTimeout(escapeTimerRef.current);
          escapeTimerRef.current = null;
        }
        if (escapedWhileAway(away)) { failFocus(runMin); return; }
        setNow(Date.now());
        saveRun({
          state, startedAt, runMin, pausedAcc, paused, pauseStartedAt, focusCount, strict: true,
        });
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
  }, [state, runMin, startedAt, pausedAcc, paused, pauseStartedAt, focusCount, config?.strictFocus]);

  // --- Actions ------------------------------------------------------------
  const startFocus = useCallback(() => {
    const at = Date.now();
    setNow(at);
    setStartedAt(at);
    setRunMin(phaseMinutes('focus', config));
    setPausedAcc(0);
    setPauseStartedAt(null);
    setPaused(false);
    setState('focus');
    playTone(720, 160);
  }, [config]);

  const pause = useCallback(() => {
    if (!isTimerActive || paused) return;
    const at = Date.now();
    setNow(at);
    setPauseStartedAt(at);
    setPaused(true);
  }, [isTimerActive, paused]);

  const resume = useCallback(() => {
    if (!paused) return;
    const at = Date.now();
    setNow(at);
    if (pauseStartedAt) setPausedAcc((acc) => acc + (at - pauseStartedAt));
    setPauseStartedAt(null);
    setPaused(false);
  }, [paused, pauseStartedAt]);

  const reset = useCallback(() => {
    setStartedAt(null);
    setRunMin(null);
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

  // Each control replaces the one pressed (เริ่ม becomes หยุดชั่วคราว, and so on),
  // which dropped keyboard focus to the page. Hand it to the row's new first button.
  const controlsRef = useRef(null);
  const keepFocus = useCallback((action) => {
    action();
    globalThis.requestAnimationFrame?.(() => controlsRef.current?.querySelector('button')?.focus());
  }, []);
  // A running round is work: ask before throwing it away. A failed one has nothing to lose.
  const confirmReset = useCallback(async () => {
    if (isTimerActive) {
      const ok = await confirmDialog({
        title: 'เริ่มรอบนี้ใหม่?',
        body: 'เวลาที่นับไปแล้วในรอบนี้จะหายไป และไม่นับเป็นรอบที่ทำเสร็จ',
        confirmLabel: 'เริ่มใหม่',
        cancelLabel: 'ทำต่อ',
        tone: 'danger',
      });
      if (!ok) return;
    }
    keepFocus(reset);
  }, [isTimerActive, keepFocus, reset]);

  // --- SVG ring geometry --------------------------------------------------
  const RING_SIZE = 240;
  const STROKE = 14;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - Math.max(0, Math.min(1, progress)));
  const status = statusLabel(state, config?.strictFocus !== false, runMin, buddyName, paused);

  // Ring color reflects state
  const ringColor =
    state === 'failed'
      ? '#c92a2a'
      : state === 'shortBreak'
      ? '#74c0fc'
      : state === 'longBreak'
      ? '#82c91e'
      : '#f59f00';

  // The ring is a 12px stroke with no text on it, so it can stay bright. The
  // primary button carries a white 15px label, and white on these hues is
  // 2.1-2.7:1 — well under the 4.5 it needs. Same family, taken down far
  // enough to be readable.
  const primaryBg =
    state === 'failed'
      ? '#a51111'
      : state === 'shortBreak'
      ? '#1667a8'
      : state === 'longBreak'
      ? '#3d6b0e'
      : '#b35c00';

  // --- Buttons ------------------------------------------------------------
  const btnBase = {
    minHeight: 'var(--touch-min)',
    minWidth: 96,
    padding: '10px 18px',
    // A bare <button> takes the platform font (MS Shell Dlg on Windows,
    // SF on iOS), not Sarabun like the rest of the screen.
    fontFamily: 'inherit',
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
  };
  const primaryBtn = {
    ...btnBase,
    background: primaryBg,
    color: '#fff',
    boxShadow: `0 2px 6px ${primaryBg}55`,
  };
  // Theme tokens: the fixed white button was a bright block in dark mode.
  const ghostBtn = {
    ...btnBase,
    background: 'var(--clr-surface)',
    color: 'var(--clr-ink)',
    border: '1px solid var(--clr-border)',
  };
  // The ring's track and the cycle dots' empty state: a pale gold in the
  // light theme, a deep one in the dark (the fixed #fff3bf stays as the
  // fallback where color-mix is missing; alone it was a bright ring on a
  // dark screen).
  const trackColor = 'color-mix(in srgb, var(--clr-gold) 20%, var(--clr-surface))';

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
        /* The ring steps once a second with the clock. A 1 s eased offset kept it
           repainting on every frame of a 25-minute round for a move under a pixel. */
        .pmd-t-ring-anim { transition: stroke 0.4s ease; }
      `}</style>

      {/* Ring + chick */}
      <div className="vmx-focus-scene" style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, maxWidth: '90vw', maxHeight: '90vw' }}>
        <FocusBackdrop preset={ambience} paused={!isTimerActive || paused} />
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
            style={{ stroke: trackColor }}
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
          {/* The chick, finally. PomodoroChick.jsx has been in the repo the
              whole time — 205 lines of SVG that hatch from an egg and grow
              into a proud chicken as the session runs — and nothing imported
              it; this slot held a static emoji instead. It owns its own
              animation and reduced-motion handling, so the pulse wrapper
              only applies to the failed/idle fallback path. */}
          <div
            style={{
              width: 'clamp(84px, 24vw, 118px)',
              height: 'clamp(84px, 24vw, 118px)',
              filter: state === 'failed' ? 'grayscale(60%)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            {avatar ? (
              // Mochi reads along during a focus (its drawn 'read' pose); a
              // clinic mascot shows its one picture throughout. key={src}:
              // the art fallback keeps its state on the element.
              <img
                key={buddyArt(avatar, state === 'focus' ? 'read' : 'rest')}
                src={buddyArt(avatar, state === 'focus' ? 'read' : 'rest')}
                alt={avatar.alt || ''}
                style={{
                  width: '90%',
                  height: '90%',
                  objectFit: 'contain',
                  transform:
                    (state === 'focus' || state === 'shortBreak' || state === 'longBreak') && !paused && !reduced
                      ? 'scale(1.05)'
                      : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            ) : (
              <PomodoroChick
                progress={state === 'idle' ? 0 : progress}
                state={
                  state === 'failed' ? 'escaped'
                    : paused ? 'paused'
                      : (state === 'focus' || state === 'shortBreak' || state === 'longBreak') ? 'running'
                        : 'idle'
                }
              />
            )}
          </div>
          <div
            style={{
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 800,
              color: state === 'failed' ? 'var(--clr-rose-text)' : 'var(--clr-ink)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 0.5,
            }}
            // No aria-live here on purpose. This text changes once a
            // second, so announcing it politely meant a screen reader read
            // the clock aloud every second for the whole 25-minute session
            // and never got to anything else on the page. The time stays
            // readable on demand; the status line below announces the
            // transitions that actually matter.
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
          color: state === 'failed' ? 'var(--clr-rose-text)' : 'var(--clr-ink-soft)',
          textAlign: 'center',
          maxWidth: 360,
          padding: '0 8px',
        }}
        // The status changes only when the session does — started, paused,
        // break, finished — which is what a listener needs to hear.
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </div>

      {/* Cycle dots */}
      {focusCount > 0 && state !== 'idle' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 14, color: 'var(--clr-ink-soft)' }}>
          <span>รอบ</span>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i < focusCount % FOCUS_PER_CYCLE ? 'var(--clr-gold)' : trackColor,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <label className="vmx-focus-scene-picker">บรรยากาศ <select aria-label="บรรยากาศโฟกัส" value={ambience} onChange={event => setAmbience(event.target.value)}>
        <option value="rain">ฝนเบา ๆ</option><option value="glow">สวนหิ่งห้อย</option><option value="garden">สวนดาว</option><option value="none">ปิดบรรยากาศ</option>
      </select></label>
      <div ref={controlsRef} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {state === 'idle' && (
          <MotionButton type="button" onClick={() => keepFocus(startFocus)} style={primaryBtn} aria-label="เริ่มโฟกัส">
            เริ่ม
          </MotionButton>
        )}
        {isTimerActive && !paused && (
          <button type="button" onClick={() => keepFocus(pause)} style={ghostBtn} aria-label="หยุดชั่วคราว">
            หยุดชั่วคราว
          </button>
        )}
        {paused && (
          <button type="button" onClick={() => keepFocus(resume)} style={primaryBtn} aria-label="ทำต่อ">
            ทำต่อ
          </button>
        )}
        {(isTimerActive || state === 'failed') && (
          <button type="button" onClick={confirmReset} style={ghostBtn} aria-label="เริ่มใหม่">
            เริ่มใหม่
          </button>
        )}
      </div>
      {(state === 'shortBreak' || state === 'longBreak') && <StudyBreak paused={paused} />}
    </div>
  );
}
