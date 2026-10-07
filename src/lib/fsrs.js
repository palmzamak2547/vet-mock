// FSRS-6 (Free Spaced Repetition Scheduler), pure port.
// Formulas and default weights per the awesome-fsrs wiki "The Algorithm"
// (github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm).
//
// The app speaks the SM-2 grade scale everywhere (0=Again, 1=Hard, 2=Good,
// 3=Easy) — this module takes that same scale and maps to FSRS grades
// G=1..4 internally, so call sites stay symmetric with sm2.js.
//
// State model: the card keeps its SM-2 fields untouched, and an optional
// `fsrs` sub-object carries { stability, difficulty, interval, due, lastReview }.
// A card with no sub-object yet is derived from its SM-2 history on first use
// (see deriveFsrsState in sr-scheduler.js) — no one-time migration, and the
// two schedulers can be switched back and forth without losing anything.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const FSRS_ALGORITHM = 'vetmock-fsrs6-v1';

// FSRS-6 default parameters, w[0]..w[20].
export const DEFAULT_W = Object.freeze([
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001,
  1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014,
  1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
]);

const DECAY = -DEFAULT_W[20];
// FACTOR makes retrievability(S, S) = 90% exactly under the power curve.
const FACTOR = 0.9 ** (-1 / DEFAULT_W[20]) - 1;

// Students reviewing a scheduled card want to be right ~90% of the time.
export const REQUEST_RETENTION = 0.9;

const clampDifficulty = (d) => Math.min(10, Math.max(1, d));

// Initial stability per first grade (G=1..4 → w[0..3]).
export function initialStability(grade) {
  return DEFAULT_W[grade - 1];
}

// Initial difficulty: D0(G) = w4 - e^(w5·(G-1)) + 1, clamped to [1, 10].
export function initialDifficulty(grade) {
  return clampDifficulty(DEFAULT_W[4] - Math.exp(DEFAULT_W[5] * (grade - 1)) + 1);
}

// Power forgetting curve: R(t, S) = (1 + FACTOR·t/S)^DECAY.
export function retrievability(elapsedDays, stability) {
  if (!(stability > 0)) return 0;
  return (1 + FACTOR * (elapsedDays / stability)) ** DECAY;
}

// Difficulty update: linear damping then mean reversion toward D0(4).
export function nextDifficulty(difficulty, grade) {
  const delta = -DEFAULT_W[6] * (grade - 3);
  const damped = difficulty + delta * ((10 - difficulty) / 9);
  return clampDifficulty(DEFAULT_W[7] * initialDifficulty(4) + (1 - DEFAULT_W[7]) * damped);
}

// Stability after a successful recall (G=2 Hard carries the penalty, G=4 Easy the bonus).
export function stabilityAfterRecall(difficulty, stability, retrievability_, grade) {
  const gradeMultiplier = (grade === 2 ? DEFAULT_W[15] : 1) * (grade === 4 ? DEFAULT_W[16] : 1);
  const increment = Math.exp(DEFAULT_W[8])
    * (11 - difficulty)
    * stability ** (-DEFAULT_W[9])
    * (Math.exp(DEFAULT_W[10] * (1 - retrievability_)) - 1)
    * gradeMultiplier;
  return stability * (1 + increment);
}

// Stability after a lapse: the card was seen but forgotten.
export function stabilityAfterForget(difficulty, stability, retrievability_) {
  return DEFAULT_W[11]
    * difficulty ** (-DEFAULT_W[12])
    * ((stability + 1) ** DEFAULT_W[13] - 1)
    * Math.exp(DEFAULT_W[14] * (1 - retrievability_));
}

// Same-day reviews grow small stabilities and leave large ones put
// (the increment is floored at 1 for passes; a same-day lapse may shrink it).
export function sameDayStabilityIncrement(stability, grade) {
  const inc = Math.exp(DEFAULT_W[17] * (grade - 3 + DEFAULT_W[18])) * stability ** (-DEFAULT_W[19]);
  return grade >= 2 ? Math.max(inc, 1) : inc;
}

// Interval in days that targets the requested retention by inverting the curve.
export function intervalFor(stability, retention = REQUEST_RETENTION) {
  return (stability / FACTOR) * (retention ** (1 / DECAY) - 1);
}

// A state of `stability: null` is a card FSRS has never met; its first grade
// seeds S and D from that grade instead of updating them.
function computeNext(state, quality, now) {
  const grade = quality + 1;
  if (!state || state.stability === null || state.stability === undefined) {
    const stability = initialStability(grade);
    const interval = Math.max(1, Math.round(intervalFor(stability)));
    return {
      stability,
      difficulty: initialDifficulty(grade),
      interval,
      due: now + interval * MS_PER_DAY,
      lastReview: now,
    };
  }
  const elapsedDays = Math.max(0, (now - (state.lastReview ?? now)) / MS_PER_DAY);
  let stability;
  if (elapsedDays < 1) {
    stability = state.stability * sameDayStabilityIncrement(state.stability, grade);
  } else {
    const r = retrievability(elapsedDays, state.stability);
    stability = grade === 1
      ? stabilityAfterForget(state.difficulty, state.stability, r)
      : stabilityAfterRecall(state.difficulty, state.stability, r, grade);
  }
  const interval = Math.max(1, Math.round(intervalFor(stability)));
  return {
    stability,
    difficulty: nextDifficulty(state.difficulty, grade),
    interval,
    due: now + interval * MS_PER_DAY,
    lastReview: now,
  };
}

// Advance one grade. Takes and returns the app-level fsrs sub-object shape.
export function nextFsrsState(state, quality, now = Date.now()) {
  return computeNext(state, quality, now);
}

// The interval each grade button would schedule, without committing it —
// the same honesty contract as sm2.js previewInterval, served from the same
// computeNext the grader itself uses.
export function previewFsrsIntervals(state, now = Date.now()) {
  return [0, 1, 2, 3].map((quality) => computeNext(state, quality, now).interval);
}
