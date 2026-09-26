// ============================================================
// vet-calc — the arithmetic behind the clinical calculator
// ============================================================
// VetCalculator.jsx draws the fields; the numbers a student copies onto a
// fluid sheet or a syringe come from here, so they can be pinned by a test
// that runs the same code the screen does.
// ============================================================

// Round to N decimals; null when the input cannot make a number, so the
// screen shows a dash rather than NaN.
export const round = (n, d = 1) => (Number.isFinite(n) ? +n.toFixed(d) : null);

const num = (v) => (typeof v === 'number' ? v : parseFloat(v));

/** Fluid plan for a dehydrated patient.
 *
 *  The deficit is replaced over the correction window the student picks.
 *  Maintenance (60 mL/kg/day) and the ongoing-loss estimate are daily
 *  volumes, so they run over 24 hours whatever the window is. The COM III
 *  final item 1371 (questions-com3.js, a 4 kg cat at 7% corrected over 4 h)
 *  sets the pump the same way: deficit 280 mL ÷ 4 h = 70, plus the hourly
 *  maintenance 8, = 78 mL/h. The herd-health calf-diarrhoea case sums the
 *  three daily volumes D + M + O over 24 h (questions-herd-health-rum.js).
 *
 *  Dividing the daily maintenance by a 12-hour window, as the calculator
 *  once did, gave a 4 kg cat at 7% 43.3 mL/h instead of 33.3.
 */
export function fluidPlan({ bw, dehydPct, hours = 24, ongoing = 0 } = {}) {
  const w = num(bw);
  const dehyd = num(dehydPct);
  const hr = num(hours);
  const og = num(ongoing) || 0;
  const deficit = Number.isFinite(w) && Number.isFinite(dehyd) && w > 0 && dehyd >= 0 ? round(w * dehyd * 10, 0) : null;
  const maint = Number.isFinite(w) && w > 0 ? round(w * 60, 0) : null;
  const total = deficit !== null && maint !== null ? deficit + maint + og : null;
  const windowOk = Number.isFinite(hr) && hr > 0;
  // During the window: the deficit share plus the daily volumes' hourly share.
  const ratePerHr = total !== null && windowOk ? round(deficit / hr + (maint + og) / 24, 1) : null;
  // Once the deficit is replaced only the daily volumes are left to run.
  const rateAfter = maint !== null ? round((maint + og) / 24, 1) : null;
  return { deficit, maint, total, ratePerHr, rateAfter };
}

/** Constant rate infusion: how much drug goes into the bag so that a given
 *  pump rate delivers the target µg/kg/min. */
export function criPlan({ bw, target, stock, bag, rate } = {}) {
  const w = num(bw);
  const t = num(target);
  const s = num(stock);
  const b = num(bag);
  const ml = num(rate);
  // Required mg/hr at target dose = BW(kg) × target(µg/kg/min) × 60 / 1000
  const mgPerHr = Number.isFinite(w) && Number.isFinite(t) && w > 0 && t > 0 ? round(w * t * 60 / 1000, 3) : null;
  // Concentration needed in the bag so that the pump rate delivers mgPerHr.
  const concNeeded = mgPerHr !== null && Number.isFinite(ml) && ml > 0 ? round(mgPerHr / ml, 3) : null;
  // Drug volume (mL) to add to the bag = (concNeeded × bag) / stock
  const drugMl = concNeeded !== null && Number.isFinite(s) && Number.isFinite(b) && s > 0 && b > 0
    ? round((concNeeded * b) / s, 2)
    : null;
  return { mgPerHr, concNeeded, drugMl };
}

// The worked example printed under the CRI tab. The note renders these
// numbers from criPlan, so the example can never disagree with the tab.
export const CRI_EXAMPLE = Object.freeze({ drug: 'dopamine', bw: 20, target: 5, stock: 40, bag: 250, rate: 10 });
