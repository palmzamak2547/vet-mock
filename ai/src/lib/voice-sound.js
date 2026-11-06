// ============================================================
// voice-sound.js — the call's few sounds, synthesised (no files)
// ============================================================
// Open: a rising fifth (E5, B5), the way a line opens. Look-up: one soft sonar
// ping with an echo, played only when the agent is not talking. Close: the
// fifth falling. Mute: a dry tick. All quiet (peak gain 0.05, about -26 dBFS)
// and short, so the echo canceller never mistakes them for the student.
// One AudioContext, made on the tap that starts the call (autoplay rules).
// ============================================================

let ctx = null;

function audio() {
  if (!ctx) {
    const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;
    if (!AC) return null;
    try { ctx = new AC(); } catch { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(c, freq, at, dur, peak, type = 'sine') {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(c.destination);
  o.start(at);
  o.stop(at + dur + 0.02);
}

const play = (fn) => {
  const c = audio();
  if (!c) return;
  try { fn(c, c.currentTime + 0.015); } catch { /* a closed context */ }
};

export const voiceSound = {
  /** Call this inside the tap that starts the call: it unlocks audio on iOS. */
  prime() { audio(); },
  open() { play((c, t) => { tone(c, 659.25, t, 0.3, 0.045); tone(c, 987.77, t + 0.09, 0.42, 0.04); }); },
  close() { play((c, t) => { tone(c, 987.77, t, 0.24, 0.04); tone(c, 659.25, t + 0.08, 0.38, 0.035); }); },
  ping() { play((c, t) => { tone(c, 1318.5, t, 0.45, 0.022); tone(c, 1318.5, t + 0.2, 0.35, 0.008); }); },
  tick(on) { play((c, t) => tone(c, on ? 520 : 780, t, 0.05, 0.03, 'triangle')); },
};
