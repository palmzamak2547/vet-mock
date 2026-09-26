// pomodoro-run.js — the running Pomodoro session, kept outside the screen.
//
// PomodoroTimer used to hold every anchor (state, startedAt, pausedAcc,
// focusCount) in component state, and the timer is mounted only while the
// focus screen is. Opening the library, notes or a question set unmounted it:
// the session ended with no record, and /app/focus reopened idle at 25:00.
// The anchors now live under one localStorage key, written on each
// transition; the wall-clock maths already works from them, so a remount
// picks the session up where the clock says it is.
//
// Each phase also keeps the minutes it started with (`runMin`). The sliders
// stay live, but a change applies to the next phase: dragging Focus below the
// time already spent used to end the running focus at once and log the new
// slider value as its length.

export const POMODORO_RUN_KEY = 'vmx-pomodoro-run';
// Strict Mode: away from the focus screen (tab hidden, phone locked, another
// VetMock screen) for longer than this fails the session.
export const VISIBILITY_GRACE_MS = 5_000;

const ACTIVE = new Set(['focus', 'shortBreak', 'longBreak']);
const DEFAULTS = { focusMin: 25, shortBreakMin: 5, longBreakMin: 15 };

/** Minutes a phase runs for under this config. */
export function phaseMinutes(state, config) {
  if (state === 'shortBreak') return Number(config?.shortBreakMin) || DEFAULTS.shortBreakMin;
  if (state === 'longBreak') return Number(config?.longBreakMin) || DEFAULTS.longBreakMin;
  return Number(config?.focusMin) || DEFAULTS.focusMin;
}

/** The status line. Break lengths are the ones the student set. */
export function statusLabel(state, strictFocus = true, minutes) {
  switch (state) {
    case 'idle':
      return strictFocus
        ? 'พร้อมเริ่ม — กด Start เพื่อฟักลูกไก่ (Strict Mode: ห้ามออกจากหน้าเกิน 5 วินาที)'
        : 'พร้อมเริ่ม — กด Start เพื่อเริ่มโฟกัส (Relaxed Mode)';
    case 'focus':
      return strictFocus
        ? 'กำลังโฟกัส — อย่าออกจากหน้านี้เกิน 5 วินาทีนะ ไก่จะหนี!'
        : 'กำลังโฟกัส — สลับแอปอ่าน PDF/สรุปได้ตามสะดวก 📚';
    case 'shortBreak':
      return `พักสายตา ${minutes || DEFAULTS.shortBreakMin} นาที`;
    case 'longBreak':
      return `พักยาว ${minutes || DEFAULTS.longBreakMin} นาที — เก่งมาก! 🌻`;
    case 'failed':
      return 'ลูกไก่หนีไปแล้ว! เริ่มใหม่อีกครั้ง';
    default:
      return '';
  }
}

/** Remaining ms of an active run at `now`. */
export function remainingMs(run, now = Date.now()) {
  if (!run || !run.startedAt) return (run?.runMin || DEFAULTS.focusMin) * 60_000;
  let pausedMs = run.pausedAcc || 0;
  if (run.paused && run.pauseStartedAt) pausedMs += now - run.pauseStartedAt;
  return Math.max(0, run.runMin * 60_000 - (now - run.startedAt - pausedMs));
}

/** Wall-clock moment an active, unpaused run reaches zero. */
export function runEndsAt(run) {
  return run.startedAt + (run.pausedAcc || 0) + run.runMin * 60_000;
}

/** True when a Strict Mode focus was left for longer than the grace. */
export function escapedWhileAway(awaySince, now = Date.now()) {
  return Number.isFinite(awaySince) && now - awaySince > VISIBILITY_GRACE_MS;
}

const num = (v) => (Number.isFinite(v) ? v : null);

/** The stored run, or null when there is none or it cannot be read. */
export function loadRun() {
  try {
    const raw = window.localStorage?.getItem(POMODORO_RUN_KEY);
    const r = raw ? JSON.parse(raw) : null;
    if (!r || typeof r !== 'object' || !ACTIVE.has(r.state)) return null;
    if (!num(r.startedAt) || !(num(r.runMin) > 0)) return null;
    return {
      state: r.state,
      startedAt: r.startedAt,
      runMin: r.runMin,
      pausedAcc: num(r.pausedAcc) || 0,
      paused: r.paused === true,
      pauseStartedAt: r.paused === true ? num(r.pauseStartedAt) : null,
      focusCount: Number.isInteger(r.focusCount) && r.focusCount >= 0 ? r.focusCount : 0,
      strict: r.strict !== false,
      awaySince: num(r.awaySince),
    };
  } catch {
    return null;
  }
}

/** Store an active run; anything else clears the key. Never throws. */
export function saveRun(run) {
  try {
    if (!run || !ACTIVE.has(run.state) || !run.startedAt) {
      window.localStorage?.removeItem(POMODORO_RUN_KEY);
      return;
    }
    window.localStorage?.setItem(POMODORO_RUN_KEY, JSON.stringify(run));
  } catch {
    /* private mode / quota: the session still runs on this screen */
  }
}

/** Mark the stored run as left at `at` (unmount, tab hidden). */
export function markRunAway(at = Date.now()) {
  const run = loadRun();
  if (!run || run.awaySince) return;
  saveRun({ ...run, awaySince: at });
}
