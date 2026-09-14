// ============================================================
// screening.js — what a positive result is actually worth
// ============================================================
// A screening tool's headline number is almost never the number that
// decides anything. "99% accurate" is compatible with catching none of the
// diseased animals; a test with 90% sensitivity and 95% specificity flags
// mostly healthy animals as soon as the disease is rare. Both facts follow
// from one 2x2 table, and neither is visible until you build it.
//
// Everything here is derived from four inputs and nothing is asserted, so a
// student can move a dial and watch the consequence rather than trust a
// slide. The worked example in Module 5 of Veterinary Epidemiology (3107508,
// Chaidate Inchaisri, 2026/1) is reproduced exactly by `LECTURE_SCENARIOS`
// below — that is the check that this file computes the same thing the
// course teaches.
//
// Counts are whole animals. Rounding each cell independently would let the
// four cells disagree with the total, so each split is rounded once and its
// partner takes the remainder: the table always sums to n.

/** Clamp to [lo, hi], and treat a non-number as lo rather than poisoning
 *  every later calculation with NaN. */
function clamp(value, lo, hi) {
  const v = Number(value);
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}

/**
 * The 2x2 table for a population of `n` animals, plus everything derived
 * from it.
 *
 * @param {object} input
 * @param {number} input.n            population screened (>= 1)
 * @param {number} input.prevalence   proportion diseased, 0..1
 * @param {number} input.sensitivity  P(flagged | diseased), 0..1
 * @param {number} input.specificity  P(not flagged | healthy), 0..1
 * @returns {{
 *   n: number, diseased: number, healthy: number,
 *   tp: number, fp: number, fn: number, tn: number,
 *   flagged: number, notFlagged: number,
 *   ppv: number|null, npv: number|null, accuracy: number,
 *   falseAlertsPerHit: number|null,
 * }}
 */
export function screeningTable({ n, prevalence, sensitivity, specificity } = {}) {
  const total = Math.max(1, Math.round(clamp(n, 1, 10_000_000)));
  const p = clamp(prevalence, 0, 1);
  const se = clamp(sensitivity, 0, 1);
  const sp = clamp(specificity, 0, 1);

  const diseased = Math.round(total * p);
  const healthy = total - diseased;

  // Round once per split; the partner is the remainder. tp + fn is exactly
  // `diseased` and fp + tn is exactly `healthy`, for any rounding.
  const tp = Math.round(diseased * se);
  const fn = diseased - tp;
  const fp = Math.round(healthy * (1 - sp));
  const tn = healthy - fp;

  const flagged = tp + fp;
  const notFlagged = fn + tn;

  return {
    n: total,
    diseased,
    healthy,
    tp,
    fp,
    fn,
    tn,
    flagged,
    notFlagged,
    // A predictive value is a proportion OF the animals in that column. With
    // an empty column there is no proportion to report — the honest answer is
    // "nothing was flagged", not 0%. A test that flags nobody has an
    // undefined PPV, and showing 0% would say the opposite of the truth.
    ppv: flagged > 0 ? tp / flagged : null,
    npv: notFlagged > 0 ? tn / notFlagged : null,
    accuracy: (tp + tn) / total,
    // The number a farmer actually feels: how many healthy animals you
    // disturb for each sick one you find.
    falseAlertsPerHit: tp > 0 ? fp / tp : null,
  };
}

/**
 * PPV as prevalence varies, with sensitivity and specificity held still.
 *
 * Uses the closed form rather than the rounded table so the curve stays
 * smooth at low prevalence, where whole-animal rounding would make it a
 * staircase:  PPV = Se·p / (Se·p + (1 − Sp)·(1 − p))
 *
 * Sampled on a log scale because everything interesting happens between
 * 0.1% and 10%, which a linear axis compresses into the first few pixels.
 *
 * @returns {Array<{ prevalence: number, ppv: number|null }>}
 */
export function ppvCurve({ sensitivity, specificity, from = 0.001, to = 0.5, steps = 64 } = {}) {
  const se = clamp(sensitivity, 0, 1);
  const sp = clamp(specificity, 0, 1);
  const lo = Math.log(clamp(from, 1e-6, 1));
  const hi = Math.log(clamp(to, 1e-6, 1));
  const out = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = Math.exp(lo + ((hi - lo) * i) / steps);
    const hits = se * p;
    const alarms = (1 - sp) * (1 - p);
    out.push({ prevalence: p, ppv: hits + alarms > 0 ? hits / (hits + alarms) : null });
  }
  return out;
}

/**
 * The two worked examples from the lecture, verbatim in their numbers.
 *
 * `expect` is what the slide prints. The unit test recomputes each scenario
 * and compares, so a change to the maths that silently stopped agreeing with
 * the course would fail the build rather than mislead a student.
 */
export const LECTURE_SCENARIOS = Object.freeze([
  {
    id: 'false-alerts',
    label: 'เครื่องมือคัดกรองในฟาร์ม',
    note: 'ความไว 90% ความจำเพาะ 95% ความชุก 1% คัดกรอง 10,000 ตัว',
    source: 'Vet Epidemiology Module 5 — “False alerts matter”',
    input: { n: 10000, prevalence: 0.01, sensitivity: 0.9, specificity: 0.95 },
    // The slide's own table: flagged 585, of which 90 are truly diseased.
    expect: { tp: 90, fp: 495, fn: 10, tn: 9405, flagged: 585, ppvPct: 15.4 },
  },
  {
    id: 'accuracy-trap',
    label: 'ระบบที่ตอบว่า “ปกติ” ทุกตัว',
    note: 'ความไว 0% ความจำเพาะ 100% ความชุก 1% ตรวจ 1,000 ตัว',
    source: 'Vet Epidemiology Module 5 — “Why 99% accurate can be misleading”',
    input: { n: 1000, prevalence: 0.01, sensitivity: 0, specificity: 1 },
    // 990 of 1,000 calls are right, and not one diseased animal is found.
    expect: { tp: 0, fp: 0, fn: 10, tn: 990, flagged: 0, accuracyPct: 99 },
  },
]);
