// The motion family: every duration and curve in the app comes from these functions.
//
// A spring is a damped oscillator of mass 1, set by two numbers a person can reason about:
// its response (the undamped period, in seconds) and its damping ratio zeta (1 = no overshoot,
// below 1 = a little bounce). Then k = (2 pi / response)^2 and c = 4 pi zeta / response.
// Four springs, named by role, cover every moment; exits, the exam session's calm variant, the
// two impulses, durations from distance and the list stagger are all derived from them.
//
// CSS cannot run a spring, but it can follow a sampled curve: `linear(...)` with the fewest
// evenly spaced samples that stay within BAKE_TOLERANCE of the true curve. The tokens in
// src/styles.css (--vm-ease-*, --vm-dur-*) are exactly motionTokens(); a unit test keeps the
// two equal. A drag cannot use a fixed curve, because it must keep the finger's speed: stepSpring
// integrates the same spring per frame instead.
//
// Pure functions, no DOM: safe to import from a component, a script or a test.

/** @typedef {{ response: number, zeta: number }} Spring */

/** The four springs, by role. */
export const SPRINGS = Object.freeze({
  /** Small things confirming a touch: check and cross chips, the bookmark, a count landing. */
  tap: Object.freeze({ response: 0.30, zeta: 0.70 }),
  /** Controls and content blocks: the verdict panel, the next question, rows arriving, toggles. */
  control: Object.freeze({ response: 0.35, zeta: 0.82 }),
  /** Surfaces over the page: sheets and dialogs; integrated per frame while a finger holds one. */
  sheet: Object.freeze({ response: 0.45, zeta: 1 }),
  /** The whole screen: a page change, the results arriving. */
  page: Object.freeze({ response: 0.50, zeta: 1 }),
});

/** Leaving is quicker than arriving: an exit runs at this fraction of the response, critically damped. */
export const EXIT_FACTOR = 0.8;
/** The exam session moves half as far as practice. */
export const CALM_TRAVEL = 0.5;

/**
 * Two impulses of the tap spring: kicked instead of stepped, they return to rest.
 * `pop` (scale, toward the student) says yes; `nudge` (sideways, at half the damping so it
 * swings back once like a shake of the head) says no. `rest` is the residual, as a fraction of
 * the peak, below which the motion counts as over: a quarter pixel for the 5 px nudge.
 */
export const IMPULSES = Object.freeze({
  pop: Object.freeze({ response: 0.30, zeta: 0.70, axis: 'scale', amplitude: 0.035, rest: 0.02 }),
  nudge: Object.freeze({ response: 0.30, zeta: 0.35, axis: 'translateX', amplitude: 5, rest: 0.25 / 5 }),
});

/** A press goes in within the 0.1 s a person reads as instant; the release rides the tap spring. */
export const PRESS = Object.freeze({ durationMs: 100, easing: 'cubic-bezier(0.2, 0, 0, 1)', scale: 0.97 });
/** Under reduced motion travel is dropped and an arrival stays as a fade; an exit fades faster. */
export const FADE = Object.freeze({ inMs: 160, outMs: 120 });

/** Max distance between a baked linear() curve and the true one, as a fraction of the travel. */
export const BAKE_TOLERANCE = 0.008;
const SETTLE_TOLERANCE = 0.001; // "settled" = within 0.1% of rest
const LOOKS_DONE_TOLERANCE = 0.02; // from inside a 2% band the eye reads it as arrived
const STEP = 0.0005; // seconds, for the searches below

/** Position over time (s) of a spring released from 0 towards 1. */
export function stepResponse({ response, zeta }) {
  const w0 = (2 * Math.PI) / response;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return (t) => 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
  }
  return (t) => 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

/** Position over time (s) of a spring at rest kicked once, normalised so its peak is 1. */
export function impulseResponse({ response, zeta }) {
  const w0 = (2 * Math.PI) / response;
  let f;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    f = (t) => Math.exp(-zeta * w0 * t) * Math.sin(wd * t);
  } else {
    f = (t) => t * Math.exp(-w0 * t);
  }
  let peak = 0;
  for (let t = 0; t < 2; t += STEP) peak = Math.max(peak, Math.abs(f(t)));
  return (t) => f(t) / peak;
}

/** The last moment (s) the curve is more than `tolerance` away from `target`. */
export function settleTime(fn, target, tolerance, horizon = 3) {
  let last = 0;
  for (let t = 0; t < horizon; t += STEP) if (Math.abs(fn(t) - target) > tolerance) last = t;
  return last;
}

function bake(fn, seconds, n, end) {
  const pts = Array.from({ length: n + 1 }, (_, i) => +fn((i / n) * seconds).toFixed(4));
  pts[n] = end;
  return pts;
}

/** Largest distance between the piecewise-linear samples and the true curve. */
export function bakeError(fn, seconds, pts) {
  const n = pts.length - 1;
  let worst = 0;
  for (let i = 0; i <= 2000; i++) {
    const u = i / 2000;
    const seg = Math.min(n - 1, Math.floor(u * n));
    const f = u * n - seg;
    const lin = pts[seg] * (1 - f) + pts[seg + 1] * f;
    worst = Math.max(worst, Math.abs(lin - fn(u * seconds)));
  }
  return worst;
}

function fewestSamples(fn, seconds, tolerance, end) {
  for (let n = 8; n <= 60; n++) {
    const pts = bake(fn, seconds, n, end);
    if (bakeError(fn, seconds, pts) <= tolerance) return pts;
  }
  return bake(fn, seconds, 60, end);
}

const toLinear = (pts) => `linear(${pts.join(', ')})`;

/**
 * A spring as a CSS curve: `{ easing, durationMs, looksDoneMs, overshoot }`.
 * `durationMs` is the settle time; the motion reads as finished at `looksDoneMs`.
 * @param {Spring} spring
 */
export function springEasing(spring) {
  const fn = stepResponse(spring);
  const settle = settleTime(fn, 1, SETTLE_TOLERANCE);
  let peak = 0;
  for (let t = 0; t < 2; t += STEP) peak = Math.max(peak, fn(t));
  return {
    easing: toLinear(fewestSamples(fn, settle, BAKE_TOLERANCE, 1)),
    durationMs: Math.round(settle * 1000),
    looksDoneMs: Math.round(settleTime(fn, 1, LOOKS_DONE_TOLERANCE) * 1000),
    overshoot: Math.max(0, +(peak - 1).toFixed(4)),
  };
}

/** An impulse as a CSS curve from rest to rest: animate from rest to the peak with this easing. */
export function impulseEasing(impulse) {
  const fn = impulseResponse(impulse);
  const seconds = settleTime(fn, 0, impulse.rest, 2);
  return { easing: toLinear(fewestSamples(fn, seconds, BAKE_TOLERANCE * 2, 0)), durationMs: Math.round(seconds * 1000) };
}

/** The exit of a spring: EXIT_FACTOR of its response, critically damped. */
export const exitSpring = (spring) => ({ response: +(spring.response * EXIT_FACTOR).toFixed(2), zeta: 1 });
/** The exam session's variant of a spring: the same response, no overshoot. */
export const calmSpring = (spring) => ({ response: spring.response, zeta: 1 });

/**
 * One frame of a spring, integrated in 1/240 s substeps (semi-implicit Euler), so a drag's
 * release lands identically at 60 Hz, 120 Hz and after a hitch. Mutates `state` ({ x, v });
 * returns true at rest. Start it with the finger's release velocity; never restart from zero.
 */
export function stepSpring(state, target, { response, zeta }, dtSeconds, eps = 0.1) {
  const k = ((2 * Math.PI) / response) ** 2;
  const c = (4 * Math.PI * zeta) / response;
  let dt = Math.min(Math.max(dtSeconds, 0), 0.1); // a hidden tab's huge gap is ignored
  while (dt > 0) {
    const h = Math.min(dt, 1 / 240);
    state.v += (-k * (state.x - target) - c * state.v) * h;
    state.x += state.v * h;
    dt -= h;
  }
  return Math.abs(state.x - target) < eps && Math.abs(state.v) < eps * 10;
}

/** Where a flick lands: velocity decays by `rate` each millisecond, so travel is about v / 2. */
export const project = (velocityPxPerS, rate = 0.998) => ((velocityPxPerS / 1000) * rate) / (1 - rate);

/** Pulling past a limit gives less and less travel, never more than `dimension`. */
export const rubberBand = (overshoot, dimension, c = 0.55) => (1 - 1 / ((overshoot * c) / dimension + 1)) * dimension;

/** Duration (ms) of a measured travel with no spring of its own: t = sqrt(2 d / a), clamped to [120, 450]. */
export const durationFor = (distancePx, a = 9600) =>
  Math.min(450, Math.max(120, Math.round(Math.sqrt((2 * Math.abs(distancePx)) / a) * 1000)));

/** Delay (ms) of item i in a list: a geometric series that never passes 200 ms. */
export const stagger = (i, first = 30, r = 0.85) => (first * (1 - r ** i)) / (1 - r);

/**
 * The CSS custom properties, as { root, calm }: `root` for :root, `calm` for [data-vm-calm]
 * (the exam session). Values are strings ready for a stylesheet.
 */
export function motionTokens() {
  const root = {};
  const calm = {};
  for (const [name, spring] of Object.entries(SPRINGS)) {
    const s = springEasing(spring);
    root[`--vm-ease-${name}`] = s.easing;
    root[`--vm-dur-${name}`] = `${s.durationMs}ms`;
    if (spring.zeta >= 1) continue; // already critically damped: the exam session uses it as it is
    const c = springEasing(calmSpring(spring));
    calm[`--vm-ease-${name}`] = c.easing;
    calm[`--vm-dur-${name}`] = `${c.durationMs}ms`;
  }
  for (const name of ['sheet', 'page']) {
    const s = springEasing(exitSpring(SPRINGS[name]));
    root[`--vm-ease-${name}-exit`] = s.easing;
    root[`--vm-dur-${name}-exit`] = `${s.durationMs}ms`;
  }
  for (const [name, impulse] of Object.entries(IMPULSES)) {
    const s = impulseEasing(impulse);
    root[`--vm-ease-${name}`] = s.easing;
    root[`--vm-dur-${name}`] = `${s.durationMs}ms`;
  }
  root['--vm-ease-press'] = PRESS.easing;
  root['--vm-dur-press'] = `${PRESS.durationMs}ms`;
  root['--vm-dur-fade'] = `${FADE.inMs}ms`;
  root['--vm-dur-fade-out'] = `${FADE.outMs}ms`;
  root['--vm-calm-travel'] = String(CALM_TRAVEL);
  return { root, calm };
}
